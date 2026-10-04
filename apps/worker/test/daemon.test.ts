import assert from "node:assert/strict";
import { getEventListeners } from "node:events";
import test from "node:test";
import { loadWorkerConfig } from "../src/config";
import { runWorkerLoop } from "../src/daemon";
import { WorkerOperationalMetrics } from "../src/operational-metrics";
import type { WorkerRunResult } from "../src/outbox-worker";

const context = { organizationId: "ORG-0007", userId: "USR-DEMO-0001", correlationId: "worker-test" };

test("worker configuration is fail-fast and tenant-scoped", () => {
  assert.throws(() => loadWorkerConfig({}), /DATABASE_URL/);
  assert.throws(() => loadWorkerConfig({ DATABASE_URL: "postgres://local", WORKER_TENANT_ID: "bad", WORKER_USER_ID: "USR-DEMO-0001" }), /WORKER_TENANT_ID/);
  const config = loadWorkerConfig({ DATABASE_URL: "postgres://local", WORKER_TENANT_ID: "ORG-0007", WORKER_USER_ID: "USR-DEMO-0001" });
  assert.equal(config.maxEventsPerCycle, 10);
  assert.equal(config.pollIntervalMs, 1000);
});

test("worker loop is cycle-bounded, records metrics and shuts down gracefully", async () => {
  const controller = new AbortController();
  const metrics = new WorkerOperationalMetrics();
  const results: WorkerRunResult[] = [
    { status: "processed", eventId: "event-1" },
    { status: "retry_scheduled", eventId: "event-2", attempts: 1, availableAt: "2026-10-04T00:00:10.000Z" },
  ];
  let calls = 0;
  const logs: string[] = [];
  await runWorkerLoop({
    worker: { async runOnce() { calls += 1; return results.shift() ?? { status: "processed", eventId: `event-${calls}` }; } },
    context,
    metrics,
    pollIntervalMs: 100,
    maxEventsPerCycle: 2,
    signal: controller.signal,
    async sleep() { controller.abort(); },
    log(_level, event) { logs.push(event); },
  });
  assert.equal(calls, 2);
  assert.deepEqual(metrics.snapshot(), {
    processed: 1, retries: 1, deadLetters: 0, lostLeases: 0,
    alreadyCompleted: 0, idlePolls: 0, errors: 0,
  });
  assert.deepEqual(logs, ["worker_started", "outbox_result", "outbox_result", "worker_stopped"]);
});

test("worker metrics include DLQ and lost lease without external telemetry", () => {
  const metrics = new WorkerOperationalMetrics();
  metrics.record({ status: "dead_lettered", eventId: "event-1", attempts: 5 });
  metrics.record({ status: "lost_lease", eventId: "event-2" });
  metrics.record({ status: "already_completed", eventId: "event-3" });
  metrics.record({ status: "idle" });
  assert.deepEqual(metrics.snapshot(), {
    processed: 0, retries: 0, deadLetters: 1, lostLeases: 1,
    alreadyCompleted: 1, idlePolls: 1, errors: 0,
  });
});

test("default polling delay releases abort listeners between cycles", async () => {
  const controller = new AbortController();
  const metrics = new WorkerOperationalMetrics();
  let calls = 0;
  await runWorkerLoop({
    worker: {
      async runOnce() {
        calls += 1;
        assert.equal(getEventListeners(controller.signal, "abort").length, 0);
        if (calls === 12) controller.abort();
        return { status: "idle" };
      },
    },
    context,
    metrics,
    pollIntervalMs: 1,
    maxEventsPerCycle: 1,
    signal: controller.signal,
    log() {},
  });
  assert.equal(calls, 12);
});
