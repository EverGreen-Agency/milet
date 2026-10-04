BEGIN;

ALTER TABLE outbox_events
  DROP CONSTRAINT outbox_lock_pair,
  ADD COLUMN claim_token uuid,
  ADD CONSTRAINT outbox_lock_triple CHECK (
    (locked_at IS NULL) = (lock_owner IS NULL)
    AND (locked_at IS NULL) = (claim_token IS NULL)
  );

ALTER TABLE consumer_units
  ADD CONSTRAINT consumer_units_organization_id_id_key UNIQUE (organization_id, id);
ALTER TABLE invoices
  ADD CONSTRAINT invoices_organization_id_id_key UNIQUE (organization_id, id);
ALTER TABLE baselines
  ADD COLUMN consumer_unit_id uuid,
  ADD CONSTRAINT baselines_organization_id_id_key UNIQUE (organization_id, id);

UPDATE baselines baseline
   SET consumer_unit_id = (
     SELECT unit.id
       FROM consumer_units unit
      WHERE unit.organization_id = baseline.organization_id
      ORDER BY unit.id
      LIMIT 1
   );

ALTER TABLE baselines
  ALTER COLUMN consumer_unit_id SET NOT NULL,
  ADD CONSTRAINT baselines_tenant_consumer_unit_fkey
    FOREIGN KEY (organization_id, consumer_unit_id)
    REFERENCES consumer_units (organization_id, id);

ALTER TABLE invoices
  DROP CONSTRAINT invoices_consumer_unit_id_fkey,
  ADD CONSTRAINT invoices_tenant_consumer_unit_fkey
    FOREIGN KEY (organization_id, consumer_unit_id)
    REFERENCES consumer_units (organization_id, id);

ALTER TABLE invoice_revisions
  DROP CONSTRAINT invoice_revisions_invoice_id_fkey,
  DROP CONSTRAINT invoice_revisions_author_user_id_fkey,
  ADD CONSTRAINT invoice_revisions_tenant_invoice_fkey
    FOREIGN KEY (organization_id, invoice_id)
    REFERENCES invoices (organization_id, id),
  ADD CONSTRAINT invoice_revisions_tenant_author_fkey
    FOREIGN KEY (organization_id, author_user_id)
    REFERENCES memberships (organization_id, user_id);

ALTER TABLE scenarios
  DROP CONSTRAINT scenarios_baseline_id_fkey,
  ADD CONSTRAINT scenarios_tenant_baseline_fkey
    FOREIGN KEY (organization_id, baseline_id)
    REFERENCES baselines (organization_id, id);

ALTER TABLE audit_events
  DROP CONSTRAINT audit_events_actor_user_id_fkey,
  ADD CONSTRAINT audit_events_tenant_actor_fkey
    FOREIGN KEY (organization_id, actor_user_id)
    REFERENCES memberships (organization_id, user_id);

COMMIT;
