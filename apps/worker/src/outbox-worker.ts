import type { OutboxEventContract, TenantTransactionPort } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { randomUUID } from "node:crypto";

export type FailureDisposition =
  | { status: "retry_scheduled"; attempts: number; availableAt: string }
  | { status: "dead_lettered"; attempts: number }
  | { status: "ignored"; attempts: number };

export type CompletionDisposition = "completed" | "already_completed" | "lost_lease";
export type ClaimedOutboxEvent = OutboxEventContract & { claimToken: string };

export interface OutboxStorePort {
  claim(context: TenantContext, workerId: string, claimToken: string, now: string): Promise<ClaimedOutboxEvent | undefined>;
  complete(context: TenantContext, eventId: string, workerId: string, claimToken: string, now: string): Promise<CompletionDisposition>;
  fail(input: {
    context: TenantContext;
    eventId: string;
    workerId: string;
    claimToken: string;
    errorCode: string;
    failedAt: string;
    nextAvailableAt: string;
    maxAttempts: number;
  }): Promise<FailureDisposition>;
}

export interface OutboxEventHandler {
  handle(event: OutboxEventContract, delivery: { idempotencyKey: string }): Promise<void>;
}

export interface WorkerOptions {
  workerId: string;
  maxAttempts: number;
  baseBackoffSeconds: number;
  maxBackoffSeconds: number;
  now: () => Date;
}

export type WorkerRunResult =
  | { status: "idle" }
  | { status: "processed"; eventId: string }
  | { status: "already_completed" | "lost_lease"; eventId: string }
  | ({ eventId: string } & FailureDisposition);

export class OutboxWorker {
  constructor(
    private readonly store: OutboxStorePort,
    private readonly handler: OutboxEventHandler,
    private readonly options: WorkerOptions,
  ) {}

  async runOnce(context: TenantContext): Promise<WorkerRunResult> {
    const now = this.options.now();
    const claimToken = randomUUID();
    const event = await this.store.claim(context, this.options.workerId, claimToken, now.toISOString());
    if (!event) return { status: "idle" };
    try {
      await this.handler.handle(event, { idempotencyKey: event.id });
      const completion = await this.store.complete(context, event.id, this.options.workerId, event.claimToken, this.options.now().toISOString());
      return { status: completion === "completed" ? "processed" : completion, eventId: event.id };
    } catch (error) {
      const delay = Math.min(
        this.options.baseBackoffSeconds * (2 ** event.attempts),
        this.options.maxBackoffSeconds,
      );
      const failedAt = this.options.now();
      const nextAvailableAt = new Date(failedAt.getTime() + delay * 1_000).toISOString();
      const disposition = await this.store.fail({
        context,
        eventId: event.id,
        workerId: this.options.workerId,
        claimToken: event.claimToken,
        errorCode: errorCode(error),
        failedAt: failedAt.toISOString(),
        nextAvailableAt,
        maxAttempts: this.options.maxAttempts,
      });
      return { eventId: event.id, ...disposition };
    }
  }
}

function errorCode(error: unknown): string {
  const raw = error instanceof Error ? error.name : "UnknownError";
  return raw.replace(/[^A-Za-z0-9_.-]/g, "_").slice(0, 128) || "UnknownError";
}

type ClaimedRow = {
  id: string; aggregate_type: string; aggregate_id: string; event_type: string;
  payload_json: Record<string, unknown>; correlation_id: string; occurred_at: string;
  available_at: string; attempts: number; claim_token: string;
};

export class PostgresOutboxStore implements OutboxStorePort {
  constructor(private readonly database: TenantTransactionPort) {}

  async claim(context: TenantContext, workerId: string, claimToken: string, now: string): Promise<ClaimedOutboxEvent | undefined> {
    return this.database.withTenant(context, async (transaction) => {
      const result = await transaction.query<ClaimedRow>(
        `WITH candidate AS (
           SELECT id FROM outbox_events
            WHERE organization_id = current_setting('app.organization_id')::uuid
              AND processed_at IS NULL AND available_at <= $2::timestamptz
              AND (locked_at IS NULL OR locked_at < $2::timestamptz - interval '5 minutes')
            ORDER BY available_at, occurred_at, id
            FOR UPDATE SKIP LOCKED LIMIT 1
         )
         UPDATE outbox_events event
            SET locked_at = $2::timestamptz, lock_owner = $1, claim_token = $3::uuid
           FROM candidate
          WHERE event.id = candidate.id
         RETURNING event.id::text, event.aggregate_type, event.aggregate_id, event.event_type,
                   event.payload_json, event.correlation_id,
                   event.occurred_at::text, event.available_at::text, event.attempts, event.claim_token::text`,
        [workerId, now, claimToken],
      );
      return result.rows[0] ? mapRow(context.organizationId, result.rows[0]) : undefined;
    });
  }

  async complete(context: TenantContext, eventId: string, workerId: string, claimToken: string, now: string): Promise<CompletionDisposition> {
    return this.database.withTenant(context, async (transaction) => {
      const result = await transaction.query<{ id: string }>(
        `UPDATE outbox_events SET processed_at = $4::timestamptz, locked_at = NULL, lock_owner = NULL, claim_token = NULL
          WHERE organization_id = current_setting('app.organization_id')::uuid
            AND id = $1::uuid AND lock_owner = $2 AND claim_token = $3::uuid AND processed_at IS NULL
        RETURNING id::text`,
        [eventId, workerId, claimToken, now],
      );
      if (result.rows[0]) return "completed";
      const state = await transaction.query<{ processed_at: string | null }>(
        `SELECT processed_at::text FROM outbox_events
          WHERE organization_id = current_setting('app.organization_id')::uuid AND id = $1::uuid`,
        [eventId],
      );
      return !state.rows[0] || state.rows[0].processed_at ? "already_completed" : "lost_lease";
    });
  }

  async fail(input: Parameters<OutboxStorePort["fail"]>[0]): Promise<FailureDisposition> {
    return this.database.withTenant(input.context, async (transaction) => {
      const selected = await transaction.query<ClaimedRow>(
        `SELECT id::text, aggregate_type, aggregate_id, event_type, payload_json, correlation_id,
                occurred_at::text, available_at::text, attempts, claim_token::text
           FROM outbox_events
          WHERE organization_id = current_setting('app.organization_id')::uuid
            AND id = $1::uuid AND lock_owner = $2 AND claim_token = $3::uuid AND processed_at IS NULL
          FOR UPDATE`,
        [input.eventId, input.workerId, input.claimToken],
      );
      const event = selected.rows[0];
      if (!event) return { status: "ignored", attempts: 0 };
      const attempts = event.attempts + 1;
      if (attempts >= input.maxAttempts) {
        await transaction.query(
          `INSERT INTO outbox_dead_letters
             (id, organization_id, aggregate_type, aggregate_id, event_type, payload_json, correlation_id,
              occurred_at, attempts, final_error_code, dead_lettered_at)
           SELECT id, organization_id, aggregate_type, aggregate_id, event_type, payload_json, correlation_id,
                  occurred_at, $3, $4, $5::timestamptz
             FROM outbox_events WHERE id = $1::uuid AND lock_owner = $2 AND claim_token = $6::uuid
           ON CONFLICT (id) DO NOTHING`,
          [input.eventId, input.workerId, attempts, input.errorCode, input.failedAt, input.claimToken],
        );
        await transaction.query(
          "DELETE FROM outbox_events WHERE id = $1::uuid AND lock_owner = $2 AND claim_token = $3::uuid",
          [input.eventId, input.workerId, input.claimToken],
        );
        return { status: "dead_lettered", attempts };
      }
      await transaction.query(
        `UPDATE outbox_events
            SET attempts = $3, last_error_code = $4, available_at = $5::timestamptz,
                locked_at = NULL, lock_owner = NULL, claim_token = NULL
          WHERE id = $1::uuid AND lock_owner = $2 AND claim_token = $6::uuid`,
        [input.eventId, input.workerId, attempts, input.errorCode, input.nextAvailableAt, input.claimToken],
      );
      return { status: "retry_scheduled", attempts, availableAt: input.nextAvailableAt };
    });
  }
}

function mapRow(organizationId: string, row: ClaimedRow): ClaimedOutboxEvent {
  return {
    id: row.id, organizationId, aggregateType: row.aggregate_type, aggregateId: row.aggregate_id,
    eventType: row.event_type, payload: row.payload_json, correlationId: row.correlation_id,
    occurredAt: row.occurred_at, availableAt: row.available_at, attempts: row.attempts,
    claimToken: row.claim_token,
  };
}
