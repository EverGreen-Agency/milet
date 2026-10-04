import type { SqlQueryResult, TenantTransaction, TenantTransactionPort } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

class PgWorkerTransaction implements TenantTransaction {
  constructor(private readonly client: PoolClient) {}

  async query<Row>(text: string, values: readonly unknown[] = []): Promise<SqlQueryResult<Row>> {
    const result = await this.client.query<QueryResultRow>(text, [...values]);
    return { rows: result.rows as Row[], rowCount: result.rowCount };
  }
}

export class WorkerTenantDatabase implements TenantTransactionPort {
  private readonly pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl, max: 2, connectionTimeoutMillis: 1_500, application_name: "milet-worker" });
  }

  async withTenant<T>(context: TenantContext, operation: (transaction: TenantTransaction) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const tenant = await client.query<{ id: string }>("SELECT id::text AS id FROM organizations WHERE public_id = $1", [context.organizationId]);
      const organizationUuid = tenant.rows[0]?.id;
      if (!organizationUuid) throw new Error("configured worker tenant not found");
      await client.query("SELECT set_config('app.organization_id', $1, true)", [organizationUuid]);
      await client.query("SELECT set_config('app.user_public_id', $1, true)", [context.userId]);
      await client.query("SELECT set_config('app.correlation_id', $1, true)", [context.correlationId]);
      const result = await operation(new PgWorkerTransaction(client));
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> { await this.pool.end(); }
}
