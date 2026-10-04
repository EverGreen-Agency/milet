import type { OutboxEventContract } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import type { ClaimedOutboxEvent, CompletionDisposition, FailureDisposition, OutboxStorePort } from "./outbox-worker";

type RecordState = OutboxEventContract & { lockOwner?: string; claimToken?: string; lockedAt?: string; processedAt?: string };

export class InMemoryOutboxStore implements OutboxStorePort {
  private readonly events = new Map<string, RecordState>();
  readonly deadLetters: RecordState[] = [];

  enqueue(event: OutboxEventContract): void {
    if (!this.events.has(event.id)) this.events.set(event.id, structuredClone(event));
  }

  async claim(context: TenantContext, workerId: string, claimToken: string, now: string): Promise<ClaimedOutboxEvent | undefined> {
    const leaseCutoff = new Date(new Date(now).getTime() - 5 * 60_000).toISOString();
    const candidate = [...this.events.values()]
      .filter((event) => event.organizationId === context.organizationId && !event.processedAt && (!event.lockOwner || (event.lockedAt ?? "") < leaseCutoff) && event.availableAt <= now)
      .sort((left, right) => left.availableAt.localeCompare(right.availableAt) || left.id.localeCompare(right.id))[0];
    if (!candidate) return undefined;
    candidate.lockOwner = workerId;
    candidate.claimToken = claimToken;
    candidate.lockedAt = now;
    return structuredClone(candidate) as ClaimedOutboxEvent;
  }

  async complete(context: TenantContext, eventId: string, workerId: string, claimToken: string, now: string): Promise<CompletionDisposition> {
    const event = this.events.get(eventId);
    if (!event || event.organizationId !== context.organizationId || event.processedAt) return "already_completed";
    if (event.lockOwner !== workerId || event.claimToken !== claimToken) return "lost_lease";
    event.processedAt = now;
    delete event.lockOwner;
    delete event.claimToken;
    delete event.lockedAt;
    return "completed";
  }

  async fail(input: Parameters<OutboxStorePort["fail"]>[0]): Promise<FailureDisposition> {
    const event = this.events.get(input.eventId);
    if (!event || event.organizationId !== input.context.organizationId || event.lockOwner !== input.workerId || event.claimToken !== input.claimToken || event.processedAt) {
      return { status: "ignored", attempts: event?.attempts ?? 0 };
    }
    event.attempts += 1;
    delete event.lockOwner;
    delete event.claimToken;
    delete event.lockedAt;
    if (event.attempts >= input.maxAttempts) {
      this.events.delete(event.id);
      this.deadLetters.push(structuredClone(event));
      return { status: "dead_lettered", attempts: event.attempts };
    }
    event.availableAt = input.nextAvailableAt;
    return { status: "retry_scheduled", attempts: event.attempts, availableAt: event.availableAt };
  }
}
