import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import type { SqlQueryResult, TenantTransaction, TenantTransactionPort } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { PostgresAuditStore } from "../../apps/api/src/audit/postgres-audit.store";
import { PostgresCaseQueryService } from "../../apps/api/src/cases/postgres-case-query.service";
import { TenantNotFoundError } from "../../apps/api/src/database/postgres-tenant-database";
import { PostgresTenantAccessService } from "../../apps/api/src/tenancy/postgres-tenant-access.service";
import { PostgresOutboxStore } from "../../apps/worker/src/outbox-worker";
import { DEMO_IDS, syntheticAuditEvent } from "@milet/test-fixtures";

const migrations = [
  "001_transactional_foundation.sql",
  "002_deterministic_demo_fixture.sql",
  "003_outbox_worker.sql",
  "004_stage1_demo_outbox_fixture.sql",
  "005_tenant_relational_integrity.sql",
];

class PGliteTenantDatabase implements TenantTransactionPort {
  constructor(private readonly db: PGlite) {}

  async withTenant<T>(context: TenantContext, operation: (transaction: TenantTransaction) => Promise<T>): Promise<T> {
    await this.db.exec("BEGIN");
    try {
      const tenant = await this.db.query<{ id: string }>("SELECT id::text AS id FROM organizations WHERE public_id = $1", [context.organizationId]);
      const organizationUuid = tenant.rows[0]?.id;
      if (!organizationUuid) throw new TenantNotFoundError(context.organizationId);
      await this.db.query("SELECT set_config('app.organization_id', $1, true)", [organizationUuid]);
      await this.db.query("SELECT set_config('app.user_public_id', $1, true)", [context.userId]);
      await this.db.query("SELECT set_config('app.correlation_id', $1, true)", [context.correlationId]);
      const transaction: TenantTransaction = {
        query: async <Row>(text: string, values: readonly unknown[] = []): Promise<SqlQueryResult<Row>> => {
          const result = await this.db.query<Row>(text, [...values]);
          return { rows: result.rows, rowCount: result.affectedRows ?? result.rows.length };
        },
      };
      const result = await operation(transaction);
      await this.db.exec("COMMIT");
      return result;
    } catch (error) {
      await this.db.exec("ROLLBACK");
      throw error;
    }
  }
}

async function createDatabase(): Promise<PGlite> {
  const db = new PGlite();
  for (const migration of migrations) {
    await db.exec(await readFile(join(process.cwd(), "infra", "postgres", "migrations", migration), "utf8"));
  }
  await db.exec(`
    INSERT INTO organizations (id, public_id, legal_name, status, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000009999', 'ORG-9999', 'Tenant isolado', 'active', now(), now());
    INSERT INTO users (id, public_id, display_name, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000009997', 'USR-DEMO-9999', 'Outro tenant', now(), now());
    INSERT INTO memberships (id, organization_id, user_id, role, scopes, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000009996', '00000000-0000-7000-8000-000000009999', '00000000-0000-7000-8000-000000009997', 'owner', '[]', now(), now());
  `);
  return db;
}

const demoContext: TenantContext = {
  organizationId: DEMO_IDS.organizationPublicId,
  userId: DEMO_IDS.userPublicId,
  correlationId: "stage1-postgres-test",
};
const otherContext: TenantContext = {
  organizationId: "ORG-9999",
  userId: "USR-DEMO-9999",
  correlationId: "stage1-postgres-test",
};

test("PostgreSQL case and audit repositories use tenant transaction context", async (t) => {
  const db = await createDatabase();
  t.after(async () => db.close());
  const tenantDatabase = new PGliteTenantDatabase(db);
  const cases = new PostgresCaseQueryService(tenantDatabase);
  const audit = new PostgresAuditStore(tenantDatabase);
  const access = new PostgresTenantAccessService(tenantDatabase);

  await db.exec(`
    UPDATE organizations SET version = 2, updated_at = '2026-10-03T12:10:00Z' WHERE public_id = 'ORG-0007';
    UPDATE users SET version = 3, updated_at = '2026-10-03T12:11:00Z' WHERE public_id = 'USR-DEMO-0001';
    UPDATE consumer_units SET version = 4, updated_at = '2026-10-03T12:12:00Z' WHERE public_id = 'UC-MG-00482';
    UPDATE invoices SET version = 5, updated_at = '2026-10-03T12:13:00Z' WHERE public_id = 'INV-2026-08-00482';
    UPDATE baselines SET version = 6, updated_at = '2026-10-03T12:14:00Z' WHERE public_id = 'BASE-2026-08-00482';
    INSERT INTO consumer_units (id, organization_id, public_id, distributor, masked_identifier, voltage_group, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000000483', '00000000-0000-7000-8000-000000000007', 'UC-MG-00483', 'Cemig', '•••••0483', 'A4', now(), now());
    INSERT INTO invoices (id, organization_id, consumer_unit_id, public_id, period, sha256, source, status, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000008483', '00000000-0000-7000-8000-000000000007', '00000000-0000-7000-8000-000000000483', 'INV-2026-08-00483', '2026-08', 'c47b08f85a325f70b1033b78444c2467346dd29a6a6ba6a2c39323f75a3ff7f8', 'synthetic_fixture', 'review_required', now(), now());
    INSERT INTO baselines (id, organization_id, consumer_unit_id, public_id, period_start, period_end, currency, total_cents, assumptions, calculation_version, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000007002', '00000000-0000-7000-8000-000000000007', '00000000-0000-7000-8000-000000000483', 'BASE-2026-08-00483', '2025-09-01', '2026-08-31', 'BRL', 999999, '[]', 'demo-v0.1', now(), now());
  `);

  const found = await cases.getById(demoContext, DEMO_IDS.caseId);
  assert.equal(found?.organization.publicId, "ORG-0007");
  assert.equal(found?.consumerUnit.publicId, "UC-MG-00482");
  assert.equal(found?.invoice.publicId, "INV-2026-08-00482");
  assert.equal(found?.baseline.publicId, "BASE-2026-08-00482");
  assert.equal(found?.baseline.consumerUnitId, DEMO_IDS.consumerUnitUuid);
  assert.equal(found?.scenarios.length, 1);
  assert.equal(found?.organization.version, 2);
  assert.equal(found?.user.version, 3);
  assert.equal(found?.consumerUnit.version, 4);
  assert.equal(found?.invoice.version, 5);
  assert.equal(found?.baseline.version, 6);
  assert.equal(await access.canAccess(DEMO_IDS.organizationPublicId, DEMO_IDS.userPublicId), true);
  assert.equal(await access.canAccess(DEMO_IDS.organizationPublicId, "USR-DEMO-9999"), false);
  assert.equal(await access.canAccess("ORG-9999", "USR-DEMO-9999"), true);
  assert.equal(await cases.getById(otherContext, DEMO_IDS.caseId), undefined);

  const appended = syntheticAuditEvent({ id: "00000000-0000-7000-8000-000000009102", action: "case.postgres-read" });
  await audit.append(appended);
  const ownEvents = await audit.list(demoContext);
  const otherEvents = await audit.list(otherContext);
  assert.ok(ownEvents.some((event) => event.id === appended.id));
  assert.equal(otherEvents.length, 0);
  await assert.rejects(db.exec(`UPDATE audit_events SET action = 'tampered' WHERE id = '${appended.id}'`), /append-only/);
});

test("PostgreSQL outbox claim is idempotent and persists retry and DLQ", async (t) => {
  const db = await createDatabase();
  t.after(async () => db.close());
  const store = new PostgresOutboxStore(new PGliteTenantDatabase(db));
  const now = "2026-10-03T12:01:00.000Z";
  const firstToken = "00000000-0000-4000-8000-000000000111";
  const secondToken = "00000000-0000-4000-8000-000000000222";
  const claimed = await store.claim(demoContext, "worker-pg-01", firstToken, now);
  assert.equal(claimed?.aggregateId, DEMO_IDS.caseId);
  assert.equal(claimed?.claimToken, firstToken);
  assert.equal(await store.claim(demoContext, "worker-pg-02", secondToken, now), undefined);
  assert.equal(await store.claim(otherContext, "worker-pg-02", secondToken, now), undefined);

  const retry = await store.fail({
    context: demoContext, eventId: claimed!.id, workerId: "worker-pg-01", claimToken: firstToken, errorCode: "SyntheticTransient",
    failedAt: now, nextAvailableAt: "2026-10-03T12:01:10.000Z", maxAttempts: 2,
  });
  assert.deepEqual(retry, { status: "retry_scheduled", attempts: 1, availableAt: "2026-10-03T12:01:10.000Z" });
  assert.equal(await store.claim(demoContext, "worker-pg-01", secondToken, "2026-10-03T12:01:09.000Z"), undefined);
  const retried = await store.claim(demoContext, "worker-pg-01", secondToken, "2026-10-03T12:01:10.000Z");
  assert.equal(retried?.attempts, 1);
  const dead = await store.fail({
    context: demoContext, eventId: retried!.id, workerId: "worker-pg-01", claimToken: secondToken, errorCode: "SyntheticPermanent",
    failedAt: "2026-10-03T12:01:10.000Z", nextAvailableAt: "2026-10-03T12:01:30.000Z", maxAttempts: 2,
  });
  assert.deepEqual(dead, { status: "dead_lettered", attempts: 2 });
  const deadLetters = await db.query<{ attempts: number; final_error_code: string }>("SELECT attempts, final_error_code FROM outbox_dead_letters");
  assert.deepEqual(deadLetters.rows[0], { attempts: 2, final_error_code: "SyntheticPermanent" });
  assert.equal((await db.query("SELECT id FROM outbox_events")).rows.length, 0);
});
