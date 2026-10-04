import { Inject, Injectable } from "@nestjs/common";
import type { AuditStorePort, TenantTransactionPort } from "@milet/contracts";
import type { AuditEvent, TenantContext } from "@milet/domain";
import { PostgresTenantDatabase, TenantNotFoundError } from "../database/postgres-tenant-database";

type AuditRow = {
  id: string; organization_id: string; actor_user_id: string; action: string; target_type: string;
  target_id: string; correlation_id: string; occurred_at: string;
  before_json: Record<string, unknown> | null; after_json: Record<string, unknown> | null;
};

@Injectable()
export class PostgresAuditStore implements AuditStorePort {
  constructor(@Inject(PostgresTenantDatabase) private readonly database: PostgresTenantDatabase | TenantTransactionPort) {}

  async append(event: AuditEvent): Promise<Readonly<AuditEvent>> {
    const context = { organizationId: event.organizationId, userId: event.actorUserId, correlationId: event.correlationId };
    await this.database.withTenant(context, async (transaction) => {
      const inserted = await transaction.query<{ id: string }>(
        `INSERT INTO audit_events
           (id, organization_id, actor_user_id, action, target_type, target_id, before_json, after_json, correlation_id, occurred_at)
         SELECT $1::uuid, org.id, usr.id, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10::timestamptz
           FROM organizations org
           JOIN memberships membership ON membership.organization_id = org.id
           JOIN users usr ON usr.id = membership.user_id
          WHERE org.id = current_setting('app.organization_id')::uuid
            AND org.public_id = $2 AND usr.public_id = $3
         RETURNING id::text`,
        [event.id, event.organizationId, event.actorUserId, event.action, event.targetType, event.targetId,
          JSON.stringify(event.before), JSON.stringify(event.after), event.correlationId, event.occurredAt],
      );
      if (!inserted.rows[0]) throw new Error("ator não pertence ao tenant");
    });
    return structuredClone(event);
  }

  async list(context: TenantContext): Promise<readonly Readonly<AuditEvent>[]> {
    try {
      return await this.database.withTenant(context, async (transaction) => {
        const result = await transaction.query<AuditRow>(
          `SELECT audit.id::text, org.public_id AS organization_id, usr.public_id AS actor_user_id,
                  audit.action, audit.target_type, audit.target_id, audit.correlation_id,
                  to_char(audit.occurred_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS occurred_at,
                  audit.before_json, audit.after_json
             FROM audit_events audit
             JOIN organizations org ON org.id = audit.organization_id
             JOIN users usr ON usr.id = audit.actor_user_id
            WHERE audit.organization_id = current_setting('app.organization_id')::uuid
            ORDER BY audit.occurred_at, audit.id`,
        );
        return result.rows.map((row) => ({
          id: row.id, organizationId: row.organization_id, actorUserId: row.actor_user_id,
          action: row.action, targetType: row.target_type, targetId: row.target_id,
          correlationId: row.correlation_id, occurredAt: row.occurred_at,
          before: row.before_json, after: row.after_json,
        }));
      });
    } catch (error) {
      if (error instanceof TenantNotFoundError) return [];
      throw error;
    }
  }
}
