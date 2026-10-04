BEGIN;

GRANT USAGE ON SCHEMA public TO milet_app;
GRANT SELECT ON
  organizations, users, memberships, consumer_units, invoices, invoice_revisions,
  baselines, scenarios, audit_events, outbox_events, outbox_dead_letters
TO milet_app;
GRANT INSERT ON audit_events TO milet_app;
GRANT INSERT, UPDATE, DELETE ON outbox_events TO milet_app;
GRANT INSERT, SELECT ON outbox_dead_letters TO milet_app;
REVOKE UPDATE, DELETE ON audit_events FROM milet_app;

COMMIT;
