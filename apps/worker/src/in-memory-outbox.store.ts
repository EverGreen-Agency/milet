import type { OutboxEventContract } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import type { FailureDisposition, OutboxStorePort } from "./outbox-worker";

type RecordState = OutboxEventContract & { lockOwner?: string; processedAt?: string };

export class InMemoryOutboxStore implements OutboxStorePort {
  private readonly events = new Map<string, RecordState>();
  readonly deadLetters: RecordState[] = [];

  enqueue(event: OutboxEventContract): void {
    if (!this.events.has(event.id)) this.events.set(event.id, structuredClone(event));
  }

  async claim(context: TenantContext, workerId: string, now: string): Promise<OutboxEventContract | undefined> {
    const candidate = [...this.events.values()]
      .filter((event) => event.organizationId === context.organizationId && !event.processedAt && !event.lockOwner && event.availableAt <= now)
      .sort((left, right) => left.availableAt.localeCompare(right.availableAt) || left.id.localeCompare(right.id))[0];
    if (!candidate) return undefined;
    candidate.lockOwner = workerId;
    return structuredClone(candidate);
  }

  async complete(context: TenantContext, eventId: string, workerId: string, now: string): Promise<boolean> {
    const event = this.events.get(eventId);
    if (!event || event.organizationId !== context.organizationId || event.lockOwner !== workerId || event.processedAt) return false;
    event.processedAt = now;
    delete event.lockOwner;
    return true;
  }

  async fail(input: Parameters<OutboxStorePort["fail"]>[0]): Promise<FailureDisposition> {
    const event = this.events.get(input.eventId);
    if (!event || event.organizationId !== input.context.organizationId || event.lockOwner !== input.workerId || event.processedAt) {
      return { status: "ignored", attempts: event?.attempts ?? 0 };
    }
    event.attempts += 1;
    delete event.lockOwner;
    if (event.attempts >= input.maxAttempts) {
      this.events.delete(event.id);
      this.deadLetters.push(structuredClone(event));
      return { status: "dead_lettered", attempts: event.attempts };
    }
    event.availableAt = input.nextAvailableAt;
    return { status: "retry_scheduled", attempts: event.attempts, availableAt: event.availableAt };
  }
}
