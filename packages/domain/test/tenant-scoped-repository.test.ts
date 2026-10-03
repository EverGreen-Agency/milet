import assert from "node:assert/strict";
import test from "node:test";
import { TenantScopedRepository, type TenantContext } from "../src/index";

const tenantA: TenantContext = { organizationId: "ORG-0007", userId: "USR-DEMO-0001", correlationId: "c-a" };
const tenantB: TenantContext = { organizationId: "ORG-9999", userId: "USR-DEMO-9999", correlationId: "c-b" };
const repository = new TenantScopedRepository([
  { id: "shared-looking-id", organizationId: tenantA.organizationId, value: "a" },
  { id: "other", organizationId: tenantB.organizationId, value: "b" },
]);

test("tenant-scoped repository never returns another tenant's record", () => {
  assert.equal(repository.findById(tenantB, "shared-looking-id"), undefined);
  assert.deepEqual(repository.list(tenantA).map((record) => record.id), ["shared-looking-id"]);
  assert.deepEqual(repository.list(tenantB).map((record) => record.id), ["other"]);
});
