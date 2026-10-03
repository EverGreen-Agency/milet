import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryAuditStore, ImmutableAuditViolation } from "../src/audit/in-memory-audit.store";
import { syntheticAuditEvent } from "@milet/test-fixtures";

test("audit store is append-only and tenant-scoped", async () => {
  const store = new InMemoryAuditStore();
  const event = syntheticAuditEvent();
  await store.append(event);
  const own = await store.list({ organizationId: "ORG-0007", userId: "USR-DEMO-0001", correlationId: "c" });
  const other = await store.list({ organizationId: "ORG-9999", userId: "USR-DEMO-9999", correlationId: "c" });
  assert.equal(own.length, 1);
  assert.equal(other.length, 0);
  await assert.rejects(store.replace(), ImmutableAuditViolation);
  await assert.rejects(store.delete(), ImmutableAuditViolation);
});
