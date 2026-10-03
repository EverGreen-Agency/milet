BEGIN;

ALTER TABLE outbox_events
  ADD COLUMN locked_at timestamptz,
  ADD COLUMN lock_owner varchar(128),
  ADD CONSTRAINT outbox_lock_pair CHECK ((locked_at IS NULL) = (lock_owner IS NULL));

CREATE TABLE outbox_dead_letters (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  aggregate_type varchar(128) NOT NULL,
  aggregate_id varchar(128) NOT NULL,
  event_type varchar(128) NOT NULL,
  payload_json jsonb NOT NULL,
  correlation_id varchar(128) NOT NULL,
  occurred_at timestamptz NOT NULL,
  attempts integer NOT NULL CHECK (attempts > 0),
  final_error_code varchar(128) NOT NULL,
  dead_lettered_at timestamptz NOT NULL
);

ALTER TABLE outbox_dead_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY outbox_dead_letter_tenant_isolation ON outbox_dead_letters
  USING (organization_id::text = current_setting('app.organization_id', true));

CREATE INDEX outbox_events_claim_idx
  ON outbox_events (organization_id, available_at, occurred_at)
  WHERE processed_at IS NULL;
CREATE INDEX outbox_dead_letters_tenant_idx
  ON outbox_dead_letters (organization_id, dead_lettered_at);

COMMIT;
