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
});
