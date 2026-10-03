import assert from "node:assert/strict";
import test from "node:test";
import type { OutboxEventContract } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { InMemoryOutboxStore } from "../src/in-memory-outbox.store";
import { OutboxWorker, type OutboxEventHandler } from "../src/outbox-worker";

const tenant: TenantContext = { organizationId: "ORG-0007", userId: "USR-DEMO-0001", correlationId: "worker-test" };
const otherTenant: TenantContext = { organizationId: "ORG-9999", userId: "USR-DEMO-9999", correlationId: "worker-test" };

function event(overrides: Partial<OutboxEventContract> = {}): OutboxEventContract {
  return {
    id: "00000000-0000-7000-8000-000000009101",
    organizationId: "ORG-0007",
    aggregateType: "SyntheticCase",
    aggregateId: "CASE-UC-MG-00482",
    eventType: "case.fixture.ready.v1",
    payload: { classification: "synthetic_demo_only" },
    correlationId: "fixture-seed-stage1",
    occurredAt: "2026-10-03T12:00:00.000Z",
    availableAt: "2026-10-03T12:00:00.000Z",
    attempts: 0,
    ...overrides,
  };
}

function options(now: () => Date, maxAttempts = 3) {
  return { workerId: "worker-01", maxAttempts, baseBackoffSeconds: 10, maxBackoffSeconds: 60, now };
}

test("claim is tenant-scoped and completion is idempotent", async () => {
  const store = new InMemoryOutboxStore();
  store.enqueue(event());
  let handled = 0;
  const handler: OutboxEventHandler = { async handle() { handled += 1; } };
  const worker = new OutboxWorker(store, handler, options(() => new Date("2026-10-03T12:00:00.000Z")));

  assert.deepEqual(await worker.runOnce(otherTenant), { status: "idle" });
  assert.deepEqual(await worker.runOnce(tenant), { status: "processed", eventId: event().id });
  assert.deepEqual(await worker.runOnce(tenant), { status: "idle" });
  assert.equal(handled, 1);
  assert.equal(await store.complete(tenant, event().id, "worker-01", "2026-10-03T12:01:00.000Z"), false);
});

test("retry uses exponential backoff and succeeds after the event becomes available", async () => {
  const store = new InMemoryOutboxStore();
  store.enqueue(event());
  let now = new Date("2026-10-03T12:00:00.000Z");
  let calls = 0;
  const handler: OutboxEventHandler = {
    async handle() {
      calls += 1;
      if (calls === 1) throw new TypeError("synthetic transient failure");
    },
  };
  const worker = new OutboxWorker(store, handler, options(() => now));
  const first = await worker.runOnce(tenant);
  assert.deepEqual(first, { status: "retry_scheduled", eventId: event().id, attempts: 1, availableAt: "2026-10-03T12:00:10.000Z" });
  assert.deepEqual(await worker.runOnce(tenant), { status: "idle" });
  now = new Date("2026-10-03T12:00:10.000Z");
  assert.deepEqual(await worker.runOnce(tenant), { status: "processed", eventId: event().id });
  assert.equal(calls, 2);
});

test("permanent failure moves the event to the explicit DLQ", async () => {
  const store = new InMemoryOutboxStore();
  store.enqueue(event());
  const handler: OutboxEventHandler = { async handle() { throw new Error("synthetic permanent failure"); } };
  const worker = new OutboxWorker(store, handler, options(() => new Date("2026-10-03T12:00:00.000Z"), 1));

  assert.deepEqual(await worker.runOnce(tenant), { status: "dead_lettered", eventId: event().id, attempts: 1 });
  assert.equal(store.deadLetters.length, 1);
  assert.equal(store.deadLetters[0]?.aggregateId, "CASE-UC-MG-00482");
  assert.deepEqual(await worker.runOnce(tenant), { status: "idle" });
});
