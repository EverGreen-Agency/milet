BEGIN;

INSERT INTO outbox_events (
  id, organization_id, aggregate_type, aggregate_id, event_type, payload_json,
  correlation_id, occurred_at, available_at
)
VALUES (
  '00000000-0000-7000-8000-000000009101',
  '00000000-0000-7000-8000-000000000007',
  'SyntheticCase',
  'CASE-UC-MG-00482',
  'case.fixture.ready.v1',
  '{"classification":"synthetic_demo_only","invoicePublicId":"INV-2026-08-00482"}',
  'fixture-seed-stage1',
  '2026-10-03T12:00:00Z',
  '2026-10-03T12:00:00Z'
)
ON CONFLICT (id) DO NOTHING;

COMMIT;
