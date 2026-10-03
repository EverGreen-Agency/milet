import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

test("migrations execute, create the required schema and enforce immutable audit", async () => {
  const db = new PGlite();
  const migrations = ["001_transactional_foundation.sql", "002_deterministic_demo_fixture.sql"];
  for (const migration of migrations) {
    await db.exec(await readFile(join(process.cwd(), "infra", "postgres", "migrations", migration), "utf8"));
  }

  const tables = await db.query<{ tablename: string }>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename",
  );
  const names = tables.rows.map((row) => row.tablename);
  for (const expected of ["organizations", "users", "memberships", "consumer_units", "invoices", "invoice_revisions", "baselines", "scenarios", "audit_events", "outbox_events"]) {
    assert.ok(names.includes(expected), `missing table ${expected}`);
  }

  const policies = await db.query<{ count: number }>("SELECT count(*)::int AS count FROM pg_policies");
  assert.equal(policies.rows[0]?.count, 8);
  const fixture = await db.query<{ public_id: string }>("SELECT public_id FROM consumer_units");
  assert.equal(fixture.rows[0]?.public_id, "UC-MG-00482");
  await assert.rejects(db.exec("UPDATE audit_events SET action = 'tampered'"), /append-only/);
  await assert.rejects(db.exec("DELETE FROM audit_events"), /append-only/);

  await db.exec(`
    INSERT INTO organizations (id, public_id, legal_name, status, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000009999', 'ORG-9999', 'Tenant isolado', 'active', now(), now());
    INSERT INTO consumer_units (id, organization_id, public_id, distributor, masked_identifier, voltage_group, created_at, updated_at)
    VALUES ('00000000-0000-7000-8000-000000009998', '00000000-0000-7000-8000-000000009999', 'UC-OTHER-9999', 'Demo', '•••••9999', 'A4', now(), now());
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

test("database fixtures preserve every public ID used by the static synthetic case", async () => {
  const frontend = await readFile(join(process.cwd(), "app", "src", "fixtures.js"), "utf8");
  const sql = await readFile(join(process.cwd(), "infra", "postgres", "migrations", "002_deterministic_demo_fixture.sql"), "utf8");
  for (const id of ["ORG-0007", "UC-MG-00482", "INV-2026-08-00482"]) {
    assert.match(frontend, new RegExp(id));
    assert.match(sql, new RegExp(id));
  }
});
