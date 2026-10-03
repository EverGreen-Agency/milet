BEGIN;

INSERT INTO organizations (id, public_id, legal_name, status, created_at, updated_at)
VALUES ('00000000-0000-7000-8000-000000000007', 'ORG-0007', 'Padaria Horizonte', 'active', '2026-10-03T12:00:00Z', '2026-10-03T12:00:00Z');

INSERT INTO users (id, public_id, display_name, created_at, updated_at)
VALUES ('00000000-0000-7000-8000-000000000101', 'USR-DEMO-0001', 'Usuária de demonstração', '2026-10-03T12:00:00Z', '2026-10-03T12:00:00Z');

INSERT INTO memberships (id, organization_id, user_id, role, scopes, created_at, updated_at)
VALUES ('00000000-0000-7000-8000-000000000201', '00000000-0000-7000-8000-000000000007', '00000000-0000-7000-8000-000000000101', 'owner', '["case:read","audit:read"]', '2026-10-03T12:00:00Z', '2026-10-03T12:00:00Z');

INSERT INTO consumer_units (id, organization_id, public_id, distributor, masked_identifier, voltage_group, created_at, updated_at)
VALUES ('00000000-0000-7000-8000-000000000482', '00000000-0000-7000-8000-000000000007', 'UC-MG-00482', 'Cemig', '•••••0482', 'A4', '2026-10-03T12:00:00Z', '2026-10-03T12:00:00Z');

INSERT INTO invoices (id, organization_id, consumer_unit_id, public_id, period, sha256, source, status, created_at, updated_at)
VALUES ('00000000-0000-7000-8000-000000008482', '00000000-0000-7000-8000-000000000007', '00000000-0000-7000-8000-000000000482', 'INV-2026-08-00482', '2026-08', 'b47b08f85a325f70b1033b78444c2467346dd29a6a6ba6a2c39323f75a3ff7f8', 'synthetic_fixture', 'review_required', '2026-10-03T12:00:00Z', '2026-10-03T12:00:00Z');

INSERT INTO baselines (id, organization_id, public_id, period_start, period_end, currency, total_cents, assumptions, calculation_version, created_at, updated_at)
VALUES ('00000000-0000-7000-8000-000000007001', '00000000-0000-7000-8000-000000000007', 'BASE-2026-08-00482', '2025-09-01', '2026-08-31', 'BRL', 1092000, '["Consumo médio mensal de 12.480 kWh","Valores sintéticos, sem garantia de economia"]', 'demo-v0.1', '2026-10-03T12:00:00Z', '2026-10-03T12:00:00Z');

INSERT INTO scenarios (id, organization_id, baseline_id, public_id, route, horizon_months, total_cents, confidence, status, created_at, updated_at)
VALUES ('00000000-0000-7000-8000-000000008001', '00000000-0000-7000-8000-000000000007', '00000000-0000-7000-8000-000000007001', 'SCN-MERCADO-LIVRE-01', 'mercado_livre_varejista', 12, 972000, 0.72, 'review_required', '2026-10-03T12:00:00Z', '2026-10-03T12:00:00Z');

INSERT INTO audit_events (id, organization_id, actor_user_id, action, target_type, target_id, before_json, after_json, correlation_id, occurred_at)
VALUES ('00000000-0000-7000-8000-000000009001', '00000000-0000-7000-8000-000000000007', '00000000-0000-7000-8000-000000000101', 'fixture.created', 'SyntheticCase', 'CASE-UC-MG-00482', NULL, '{"classification":"synthetic_demo_only"}', 'fixture-seed-v1', '2026-10-03T12:00:00Z');

COMMIT;
