BEGIN;

CREATE TABLE organizations (
  id uuid PRIMARY KEY,
  public_id varchar(64) NOT NULL UNIQUE,
  legal_name text NOT NULL,
  tax_id_encrypted bytea,
  status varchar(24) NOT NULL CHECK (status IN ('active', 'suspended')),
  data_classification varchar(24) NOT NULL DEFAULT 'confidential',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  public_id varchar(64) NOT NULL UNIQUE,
  display_name text NOT NULL,
  data_classification varchar(24) NOT NULL DEFAULT 'confidential',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE memberships (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  user_id uuid NOT NULL REFERENCES users(id),
  role varchar(24) NOT NULL CHECK (role IN ('owner', 'operator', 'viewer')),
  scopes jsonb NOT NULL DEFAULT '[]'::jsonb,
  data_classification varchar(24) NOT NULL DEFAULT 'internal',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (organization_id, user_id)
);

CREATE TABLE consumer_units (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  public_id varchar(64) NOT NULL,
  distributor text NOT NULL,
  masked_identifier text NOT NULL,
  voltage_group varchar(32) NOT NULL,
  data_classification varchar(24) NOT NULL DEFAULT 'confidential',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (organization_id, public_id)
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  consumer_unit_id uuid NOT NULL REFERENCES consumer_units(id),
  public_id varchar(64) NOT NULL,
  period char(7) NOT NULL CHECK (period ~ '^[0-9]{4}-[0-9]{2}$'),
  sha256 char(64) NOT NULL,
  source varchar(32) NOT NULL CHECK (source = 'synthetic_fixture'),
  status varchar(32) NOT NULL CHECK (status IN ('synthetic_received', 'review_required', 'reviewed')),
  data_classification varchar(24) NOT NULL DEFAULT 'restricted',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (organization_id, public_id),
  UNIQUE (organization_id, sha256)
);

CREATE TABLE invoice_revisions (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  invoice_id uuid NOT NULL REFERENCES invoices(id),
  author_user_id uuid NOT NULL REFERENCES users(id),
  reason text NOT NULL,
  values_json jsonb NOT NULL,
  data_classification varchar(24) NOT NULL DEFAULT 'restricted',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE baselines (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  public_id varchar(64) NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL CHECK (period_end >= period_start),
  currency char(3) NOT NULL CHECK (currency = 'BRL'),
  total_cents bigint NOT NULL CHECK (total_cents >= 0),
  assumptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  calculation_version varchar(64) NOT NULL,
  data_classification varchar(24) NOT NULL DEFAULT 'confidential',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (organization_id, public_id)
);

CREATE TABLE scenarios (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  baseline_id uuid NOT NULL REFERENCES baselines(id),
  public_id varchar(64) NOT NULL,
  route varchar(64) NOT NULL,
  horizon_months integer NOT NULL CHECK (horizon_months > 0),
  total_cents bigint NOT NULL CHECK (total_cents >= 0),
  confidence numeric(5,4) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  status varchar(32) NOT NULL CHECK (status IN ('draft', 'review_required', 'approved')),
  data_classification varchar(24) NOT NULL DEFAULT 'confidential',
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (organization_id, public_id)
);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  actor_user_id uuid NOT NULL REFERENCES users(id),
  action varchar(128) NOT NULL,
  target_type varchar(128) NOT NULL,
  target_id varchar(128) NOT NULL,
  before_json jsonb,
  after_json jsonb,
  correlation_id varchar(128) NOT NULL,
  ip_prefix inet,
  occurred_at timestamptz NOT NULL
);

CREATE TABLE outbox_events (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  aggregate_type varchar(128) NOT NULL,
  aggregate_id varchar(128) NOT NULL,
  event_type varchar(128) NOT NULL,
  payload_json jsonb NOT NULL,
  correlation_id varchar(128) NOT NULL,
  occurred_at timestamptz NOT NULL,
  available_at timestamptz NOT NULL,
  processed_at timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error_code varchar(128)
);

CREATE OR REPLACE FUNCTION reject_audit_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_events is append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_events_no_update
BEFORE UPDATE ON audit_events FOR EACH ROW EXECUTE FUNCTION reject_audit_mutation();

CREATE TRIGGER audit_events_no_delete
BEFORE DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION reject_audit_mutation();

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE consumer_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY membership_tenant_isolation ON memberships USING (organization_id::text = current_setting('app.organization_id', true));
CREATE POLICY consumer_unit_tenant_isolation ON consumer_units USING (organization_id::text = current_setting('app.organization_id', true));
CREATE POLICY invoice_tenant_isolation ON invoices USING (organization_id::text = current_setting('app.organization_id', true));
CREATE POLICY invoice_revision_tenant_isolation ON invoice_revisions USING (organization_id::text = current_setting('app.organization_id', true));
CREATE POLICY baseline_tenant_isolation ON baselines USING (organization_id::text = current_setting('app.organization_id', true));
CREATE POLICY scenario_tenant_isolation ON scenarios USING (organization_id::text = current_setting('app.organization_id', true));
CREATE POLICY audit_tenant_isolation ON audit_events USING (organization_id::text = current_setting('app.organization_id', true));
CREATE POLICY outbox_tenant_isolation ON outbox_events USING (organization_id::text = current_setting('app.organization_id', true));

CREATE INDEX outbox_events_pending_idx ON outbox_events (available_at, occurred_at) WHERE processed_at IS NULL;
CREATE INDEX audit_events_target_idx ON audit_events (organization_id, target_type, target_id, occurred_at);

COMMIT;
