import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

const migrations = [
  "001_transactional_foundation.sql",
  "002_deterministic_demo_fixture.sql",
  "003_outbox_worker.sql",
  "004_stage1_demo_outbox_fixture.sql",
  "005_tenant_relational_integrity.sql",
  "006_app_role_grants.sql",
  "007_portals_schema.sql",
  "008_portals_rls_grants.sql",
];

async function bootstrapPortalDatabase(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'milet_app') THEN
        CREATE ROLE milet_app NOLOGIN;
      END IF;
    END
    $$;
  `);

  for (const file of migrations) {
    const sql = await readFile(join(process.cwd(), "infra", "postgres", "migrations", file), "utf8");
    await db.exec(sql);
  }
  return db;
}

test("portal migrations create all 5 multi-tenant tables and enforce append-only audit triggers", async () => {
  const db = await bootstrapPortalDatabase();
  try {
    const tables = await db.query<{ table_name: string }>(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('tenants', 'energy_cases', 'generation_assets', 'energy_proposals', 'audit_trail')
      ORDER BY table_name
    `);
    assert.deepEqual(
      tables.rows.map((r) => r.table_name),
      ["audit_trail", "energy_cases", "energy_proposals", "generation_assets", "tenants"]
    );

    await db.query(
      `INSERT INTO audit_trail (tenant_id, actor_id, action, resource_type, resource_id, payload, hash)
       VALUES ('t-consumidor-1', 'usr-1', 'CASE_ANALYZED', 'energy_case', 'case-1', '{"kwh":12480}'::jsonb, 'hash-abc')`
    );

    await assert.rejects(
      () => db.query("UPDATE audit_trail SET action = 'TAMPERED' WHERE resource_id = 'case-1'"),
      /audit_trail is append-only/
    );
    await assert.rejects(
      () => db.query("DELETE FROM audit_trail WHERE resource_id = 'case-1'"),
      /audit_trail is append-only/
    );
  } finally {
    await db.close();
  }
});

test("portal RLS policies strictly isolate tenants under milet_app role", async () => {
  const db = await bootstrapPortalDatabase();
  try {
    await db.exec(`
      INSERT INTO tenants (id, name, document, role) VALUES
        ('t-consumidor-1', 'Padaria Horizonte Ltda', '12.345.678/0001-90', 'CONSUMIDOR'),
        ('t-comercializadora-1', 'Alvorada Energia S.A.', '98.765.432/0001-10', 'COMERCIALIZADORA'),
        ('t-comercializadora-2', 'Outra Comercializadora', '11.222.333/0001-44', 'COMERCIALIZADORA'),
        ('t-usina-1', 'Consórcio Solar Cerrado', '55.444.333/0001-22', 'USINA');

      INSERT INTO energy_cases (id, tenant_id, distributor, submarket, voltage_group, consumption_kwh, contracted_demand_kw) VALUES
        ('case-padaria-1', 't-consumidor-1', 'Cemig', 'SE/CO', 'A4', 12480, 75);

      INSERT INTO generation_assets (id, tenant_id, name, source_type, modality, capacity_kw, available_kw, distributor) VALUES
        ('asset-ufv-1', 't-usina-1', 'UFV Cerrado I', 'SOLAR', 'GD_COMPARTILHADA', 500, 320, 'Cemig');

      INSERT INTO energy_proposals (id, case_id, supplier_tenant_id, proposal_type, discount_percentage, contract_term_months) VALUES
        ('prop-1', 'case-padaria-1', 't-comercializadora-1', 'ACL_VAREJISTA', 18.5, 24);

      INSERT INTO audit_trail (tenant_id, actor_id, action, resource_type, resource_id, payload, hash) VALUES
        ('t-consumidor-1', 'usr-padaria', 'PORTAL_LOGIN', 'session', 'sess-1', '{}'::jsonb, 'hash-1');
    `);

    await db.exec("SET SESSION AUTHORIZATION milet_app;");

    await db.query("SELECT set_config('app.organization_id', 't-comercializadora-1', false)");
    const supplierCases = await db.query("SELECT id FROM energy_cases");
    const supplierProposals = await db.query<{ id: string }>("SELECT id FROM energy_proposals");
    const supplierAssets = await db.query("SELECT id FROM generation_assets");
    assert.equal(supplierCases.rows.length, 0);
    assert.deepEqual(supplierProposals.rows.map((r) => r.id), ["prop-1"]);
    assert.equal(supplierAssets.rows.length, 0);

    await db.query("SELECT set_config('app.organization_id', 't-comercializadora-2', false)");
    const otherSupplierProposals = await db.query("SELECT id FROM energy_proposals");
    assert.equal(otherSupplierProposals.rows.length, 0);

    await db.query("SELECT set_config('app.organization_id', 't-consumidor-1', false)");
    const consumerCases = await db.query<{ id: string }>("SELECT id FROM energy_cases");
    const consumerProposals = await db.query<{ id: string }>("SELECT id FROM energy_proposals");
    const consumerAudit = await db.query<{ hash: string }>("SELECT hash FROM audit_trail");
    assert.deepEqual(consumerCases.rows.map((r) => r.id), ["case-padaria-1"]);
    assert.deepEqual(consumerProposals.rows.map((r) => r.id), ["prop-1"]);
    assert.deepEqual(consumerAudit.rows.map((r) => r.hash), ["hash-1"]);

    await db.query("SELECT set_config('app.organization_id', 't-usina-1', false)");
    const usinaAssets = await db.query<{ id: string }>("SELECT id FROM generation_assets");
    const usinaAudit = await db.query("SELECT id FROM audit_trail");
    assert.deepEqual(usinaAssets.rows.map((r) => r.id), ["asset-ufv-1"]);
    assert.equal(usinaAudit.rows.length, 0);

    await db.query("SELECT set_config('app.organization_id', '', false)");
    const anonymousTenants = await db.query("SELECT id FROM tenants");
    assert.equal(anonymousTenants.rows.length, 0);

    await assert.rejects(() => db.query("DELETE FROM audit_trail"), /permission denied|must be owner/i);
  } finally {
    await db.exec("RESET SESSION AUTHORIZATION;").catch(() => undefined);
    await db.close();
  }
});
