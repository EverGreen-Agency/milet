import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import type { DatabaseReadinessPort, SqlQueryResult, TenantTransaction, TenantTransactionPort } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
import type { AppConfig } from "../config/app-config";
import { TOKENS } from "../tokens";

export class TenantNotFoundError extends Error {
  constructor(public readonly organizationId: string) {
    super(`tenant não encontrado: ${organizationId}`);
  }
}

class PgTenantTransaction implements TenantTransaction {
  constructor(private readonly client: PoolClient) {}

  async query<Row>(text: string, values: readonly unknown[] = []): Promise<SqlQueryResult<Row>> {
    const result = await this.client.query<QueryResultRow>(text, [...values]);
    return { rows: result.rows as Row[], rowCount: result.rowCount };
  }
}

@Injectable()
export class PostgresTenantDatabase implements TenantTransactionPort, DatabaseReadinessPort, OnModuleDestroy {
  private readonly pool?: Pool;

  constructor(@Inject(TOKENS.appConfig) private readonly config: AppConfig) {
    if (config.databaseMode === "postgres") {
      this.pool = new Pool({ connectionString: config.databaseUrl, max: 4, connectionTimeoutMillis: 1_500 });
    }
  }

  async check(): Promise<{ ready: boolean; mode: "postgres"; detail?: string }> {
    if (!this.pool) return { ready: false, mode: "postgres", detail: "postgres adapter disabled" };
    try {
      await this.pool.query("SELECT 1");
      return { ready: true, mode: "postgres" };
    } catch {
      return { ready: false, mode: "postgres", detail: "database unavailable" };
    }
  }

  async withTenant<T>(
    context: TenantContext,
    operation: (transaction: TenantTransaction) => Promise<T>,
  ): Promise<T> {
    if (!this.pool) throw new Error("postgres adapter is disabled");
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const tenant = await client.query<{ id: string }>(
        "SELECT id::text AS id FROM organizations WHERE public_id = $1",
        [context.organizationId],
      );
      const organizationUuid = tenant.rows[0]?.id;
      if (!organizationUuid) throw new TenantNotFoundError(context.organizationId);
      await client.query("SELECT set_config('app.organization_id', $1, true)", [organizationUuid]);
      await client.query("SELECT set_config('app.user_public_id', $1, true)", [context.userId]);
      await client.query("SELECT set_config('app.correlation_id', $1, true)", [context.correlationId]);
      const result = await operation(new PgTenantTransaction(client));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool?.end();
  }
}
