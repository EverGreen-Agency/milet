BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('CONSUMIDOR', 'COMERCIALIZADORA', 'USINA', 'ADMIN');
  END IF;
END
$$;

CREATE TABLE tenants (
  id varchar(64) PRIMARY KEY,
  name varchar(255) NOT NULL,
  document varchar(32) NOT NULL,
  role user_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE energy_cases (
  id varchar(64) PRIMARY KEY,
  tenant_id varchar(64) NOT NULL REFERENCES tenants(id),
  distributor varchar(120) NOT NULL,
  submarket varchar(20) NOT NULL,
  voltage_group varchar(16) NOT NULL,
  consumption_kwh numeric(12, 2) NOT NULL CHECK (consumption_kwh > 0),
  contracted_demand_kw numeric(10, 2) NOT NULL DEFAULT 0 CHECK (contracted_demand_kw >= 0),
  status varchar(32) NOT NULL DEFAULT 'ANALYZED',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE generation_assets (
  id varchar(64) PRIMARY KEY,
  tenant_id varchar(64) NOT NULL REFERENCES tenants(id),
  name varchar(255) NOT NULL,
  source_type varchar(32) NOT NULL,
  modality varchar(32) NOT NULL,
  capacity_kw numeric(10, 2) NOT NULL CHECK (capacity_kw > 0),
  available_kw numeric(10, 2) NOT NULL CHECK (available_kw >= 0),
  distributor varchar(120) NOT NULL,
  status varchar(32) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE energy_proposals (
  id varchar(64) PRIMARY KEY,
  case_id varchar(64) NOT NULL REFERENCES energy_cases(id),
  supplier_tenant_id varchar(64) NOT NULL REFERENCES tenants(id),
  proposal_type varchar(32) NOT NULL,
  discount_percentage numeric(5, 2),
  fixed_kwh_rate numeric(10, 4),
  contract_term_months integer NOT NULL CHECK (contract_term_months > 0),
  status varchar(32) NOT NULL DEFAULT 'SUBMITTED',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_trail (
  id bigserial PRIMARY KEY,
  tenant_id varchar(64) NOT NULL,
  actor_id varchar(64) NOT NULL,
  action varchar(120) NOT NULL,
  resource_type varchar(64) NOT NULL,
  resource_id varchar(64) NOT NULL,
  payload jsonb NOT NULL,
  hash varchar(64) NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION reject_audit_trail_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_trail is append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_trail_no_update
BEFORE UPDATE ON audit_trail FOR EACH ROW EXECUTE FUNCTION reject_audit_trail_mutation();

CREATE TRIGGER audit_trail_no_delete
BEFORE DELETE ON audit_trail FOR EACH ROW EXECUTE FUNCTION reject_audit_trail_mutation();

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY portal_tenants_isolation ON tenants
  USING (id = current_setting('app.organization_id', true));

CREATE POLICY portal_cases_isolation ON energy_cases
  USING (tenant_id = current_setting('app.organization_id', true));

CREATE POLICY portal_assets_isolation ON generation_assets
  USING (tenant_id = current_setting('app.organization_id', true));

CREATE POLICY portal_proposals_isolation ON energy_proposals
  USING (
    supplier_tenant_id = current_setting('app.organization_id', true)
    OR EXISTS (
      SELECT 1 FROM energy_cases c
      WHERE c.id = energy_proposals.case_id
        AND c.tenant_id = current_setting('app.organization_id', true)
    )
  );

CREATE POLICY portal_audit_trail_isolation ON audit_trail
  USING (tenant_id = current_setting('app.organization_id', true));

CREATE INDEX portal_cases_tenant_idx ON energy_cases (tenant_id, status);
CREATE INDEX portal_assets_dist_idx ON generation_assets (distributor, modality, status);
CREATE INDEX portal_audit_tenant_idx ON audit_trail (tenant_id, recorded_at);

COMMIT;
