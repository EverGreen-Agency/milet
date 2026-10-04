import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { createApplication } from "../src/bootstrap";
import { DEMO_IDS } from "@milet/test-fixtures";

test("health, correlation and tenant-first case access", async (t) => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_MODE = "fake";
  process.env.DEMO_DATA_ONLY = "true";
  const app = await createApplication();
  await app.listen(0, "127.0.0.1");
  t.after(async () => app.close());
  const address = app.getHttpServer().address() as AddressInfo;
  const base = `http://127.0.0.1:${address.port}`;

  const live = await fetch(`${base}/health/live`, { headers: { "x-correlation-id": "test-correlation" } });
  assert.equal(live.status, 200);
  assert.equal(live.headers.get("x-correlation-id"), "test-correlation");
  assert.equal(live.headers.get("x-content-type-options"), "nosniff");
  assert.equal(live.headers.get("x-frame-options"), "DENY");
  assert.equal(live.headers.get("cross-origin-resource-policy"), "cross-origin");
  assert.match(live.headers.get("content-security-policy") ?? "", /default-src 'none'/);
  const normalizedCorrelation = await fetch(`${base}/health/live`, { headers: { "x-correlation-id": "invalid correlation with spaces" } });
  assert.match(normalizedCorrelation.headers.get("x-correlation-id") ?? "", /^[0-9a-f-]{36}$/);

  const missing = await fetch(`${base}/v1/cases/${DEMO_IDS.caseId}`);
  assert.equal(missing.status, 400);

  const invalid = await fetch(`${base}/v1/cases/${DEMO_IDS.caseId}`, {
    headers: { "x-organization-id": "bad", "x-user-id": DEMO_IDS.userPublicId },
  });
  assert.equal(invalid.status, 400);

  const forbidden = await fetch(`${base}/v1/cases/${DEMO_IDS.caseId}`, {
    headers: { "x-organization-id": DEMO_IDS.organizationPublicId, "x-user-id": "USR-NOT-A-MEMBER" },
  });
  assert.equal(forbidden.status, 403);

  const isolated = await fetch(`${base}/v1/cases/${DEMO_IDS.caseId}`, {
    headers: { "x-organization-id": "ORG-9999", "x-user-id": "USR-DEMO-9999" },
  });
  assert.equal(isolated.status, 404);

  const allowed = await fetch(`${base}/v1/cases/${DEMO_IDS.caseId}`, {
    headers: { "x-organization-id": DEMO_IDS.organizationPublicId, "x-user-id": DEMO_IDS.userPublicId },
  });
  assert.equal(allowed.status, 200);
  const body = await allowed.json() as { classification: string; consumerUnit: { publicId: string } };
  assert.equal(body.classification, "synthetic_demo_only");
  assert.equal(body.consumerUnit.publicId, "UC-MG-00482");

  const allowedPreflight = await fetch(`${base}/v1/cases/${DEMO_IDS.caseId}`, {
    method: "OPTIONS",
    headers: { origin: "http://127.0.0.1:4173", "access-control-request-method": "GET" },
  });
  assert.equal(allowedPreflight.headers.get("access-control-allow-origin"), "http://127.0.0.1:4173");
  assert.equal(allowedPreflight.headers.get("access-control-allow-credentials"), null);

  const denied = await fetch(`${base}/health/live`, { headers: { origin: "https://untrusted.example" } });
  assert.notEqual(denied.headers.get("access-control-allow-origin"), "https://untrusted.example");

  const metrics = await fetch(`${base}/metrics`);
  assert.equal(metrics.status, 200);
  const snapshot = await metrics.json() as { scope: string; externalBackend: boolean; requests: number; errors: number };
  assert.equal(snapshot.scope, "process");
  assert.equal(snapshot.externalBackend, false);
  assert.ok(snapshot.requests >= 8);
  assert.ok(snapshot.errors >= 0);
});
