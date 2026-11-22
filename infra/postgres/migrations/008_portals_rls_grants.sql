BEGIN;

GRANT SELECT, INSERT, UPDATE ON
  tenants, energy_cases, generation_assets, energy_proposals
TO milet_app;

GRANT SELECT, INSERT ON audit_trail TO milet_app;
GRANT USAGE, SELECT ON SEQUENCE audit_trail_id_seq TO milet_app;
REVOKE UPDATE, DELETE ON audit_trail FROM milet_app;

COMMIT;
