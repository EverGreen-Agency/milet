import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

test("migrations execute, create the required schema and enforce immutable audit", async () => {
  const db = new PGlite();
  const migrations = [
    "001_transactional_foundation.sql",
    "002_deterministic_demo_fixture.sql",
    "003_outbox_worker.sql",
    "004_stage1_demo_outbox_fixture.sql",
    "005_tenant_relational_integrity.sql",
  ];
  for (const migration of migrations) {
    await db.exec(await readFile(join(process.cwd(), "infra", "postgres", "migrations", migration), "utf8"));
  }

  const tables = await db.query<{ tablename: string }>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename",
  );
  const names = tables.rows.map((row) => row.tablename);
  for (const expected of ["organizations", "users", "memberships", "consumer_units", "invoices", "invoice_revisions", "baselines", "scenarios", "audit_events", "outbox_events", "outbox_dead_letters"]) {
    assert.ok(names.includes(expected), `missing table ${expected}`);
  }

  const policies = await db.query<{ count: number }>("SELECT count(*)::int AS count FROM pg_policies");
  assert.equal(policies.rows[0]?.count, 9);
  const fixture = await db.query<{ public_id: string }>("SELECT public_id FROM consumer_units");
  assert.equal(fixture.rows[0]?.public_id, "UC-MG-00482");
  await assert.rejects(db.exec("UPDATE audit_events SET action = 'tampered'"), /append-only/);
  await assert.rejects(db.exec("DELETE FROM audit_events"), /append-only/);
  const outbox = await db.query<{ event_type: string; attempts: number }>("SELECT event_type, attempts FROM outbox_events");
  assert.deepEqual(outbox.rows[0], { event_type: "case.fixture.ready.v1", attempts: 0 });
  const baseline = await db.query<{ consumer_unit_id: string }>("SELECT consumer_unit_id::text FROM baselines WHERE public_id = 'BASE-2026-08-00482'");
  assert.equal(baseline.rows[0]?.consumer_unit_id, "00000000-0000-7000-8000-000000000482");

  await db.exec(`
    INSERT INTO organizations (id, public_id, legal_name, status, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000009999', 'ORG-9999', 'Tenant isolado', 'active', now(), now());
    INSERT INTO consumer_units (id, organization_id, public_id, distributor, masked_identifier, voltage_group, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000009998', '00000000-0000-7000-8000-000000009999', 'UC-OTHER-9999', 'Demo', '•••••9999', 'A4', now(), now());
  `);
  const tenantConstraints = await db.query<{ conname: string }>(
    "SELECT conname FROM pg_constraint WHERE conname LIKE '%_tenant_%_fkey' ORDER BY conname",
  );
  for (const expected of [
    "audit_events_tenant_actor_fkey",
    "baselines_tenant_consumer_unit_fkey",
    "invoice_revisions_tenant_author_fkey",
    "invoice_revisions_tenant_invoice_fkey",
    "invoices_tenant_consumer_unit_fkey",
    "scenarios_tenant_baseline_fkey",
  ]) assert.ok(tenantConstraints.rows.some(({ conname }) => conname === expected), `missing ${expected}`);
  await assert.rejects(
    db.exec(`INSERT INTO invoices
      (id, organization_id, consumer_unit_id, public_id, period, sha256, source, status, created_at, updated_at)
      VALUES ('00000000-0000-7000-8000-000000009991', '00000000-0000-7000-8000-000000000007',
              '00000000-0000-7000-8000-000000009998', 'INV-CROSS-TENANT', '2026-09',
              'd47b08f85a325f70b1033b78444c2467346dd29a6a6ba6a2c39323f75a3ff7f8',
              'synthetic_fixture', 'review_required', now(), now())`),
    /foreign key/i,
  );
  await db.exec(`
    CREATE ROLE milet_app NOLOGIN;
    GRANT USAGE ON SCHEMA public TO milet_app;
    GRANT SELECT ON consumer_units TO milet_app;
    SET SESSION AUTHORIZATION milet_app;
    SELECT set_config('app.organization_id', '00000000-0000-7000-8000-000000000007', false);
  `);
  const isolatedRows = await db.query<{ public_id: string }>("SELECT public_id FROM consumer_units ORDER BY public_id");
  assert.deepEqual(isolatedRows.rows.map((row) => row.public_id), ["UC-MG-00482"]);
  await db.close();
});

test("local compose separates migration owner from the RLS application role", async () => {
  const compose = await readFile(join(process.cwd(), "compose.yaml"), "utf8");
  const environment = await readFile(join(process.cwd(), ".env.example"), "utf8");
  const roles = await readFile(join(process.cwd(), "infra", "postgres", "migrations", "000_local_roles.sql"), "utf8");
  const grants = await readFile(join(process.cwd(), "infra", "postgres", "migrations", "006_app_role_grants.sql"), "utf8");
  assert.match(compose, /POSTGRES_USER:\s*milet_owner/);
  assert.match(environment, /postgresql:\/\/milet_app:/);
  assert.doesNotMatch(environment, /postgresql:\/\/milet_owner:/);
  assert.match(roles, /NOBYPASSRLS/);
  assert.match(grants, /GRANT SELECT ON[\s\S]+TO milet_app/);
});

test("database fixtures preserve every public ID used by the static synthetic case", async () => {
  const frontend = await readFile(join(process.cwd(), "app", "src", "fixtures.js"), "utf8");
  const sql = await readFile(join(process.cwd(), "infra", "postgres", "migrations", "002_deterministic_demo_fixture.sql"), "utf8");
  for (const id of ["ORG-0007", "UC-MG-00482", "INV-2026-08-00482"]) {
    assert.match(frontend, new RegExp(id));
    assert.match(sql, new RegExp(id));
  }
});
