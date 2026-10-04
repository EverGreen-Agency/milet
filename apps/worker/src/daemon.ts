import type { OutboxEventContract } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { randomUUID } from "node:crypto";
import { loadWorkerConfig } from "./config";
import { WorkerOperationalMetrics } from "./operational-metrics";
import { OutboxWorker, PostgresOutboxStore, type OutboxEventHandler, type WorkerRunResult } from "./outbox-worker";
import { WorkerTenantDatabase } from "./postgres-tenant-database";
import { logJson } from "./structured-log";

export interface WorkerCyclePort { runOnce(context: TenantContext): Promise<WorkerRunResult> }

export interface WorkerLoopOptions {
  worker: WorkerCyclePort;
  context: TenantContext;
  metrics: WorkerOperationalMetrics;
  pollIntervalMs: number;
  maxEventsPerCycle: number;
  signal: AbortSignal;
  sleep?: (milliseconds: number, signal: AbortSignal) => Promise<void>;
  log?: typeof logJson;
}

export async function runWorkerLoop(options: WorkerLoopOptions): Promise<void> {
  const sleep = options.sleep ?? abortableDelay;
  const log = options.log ?? logJson;
  log("info", "worker_started", { tenantId: options.context.organizationId, maxEventsPerCycle: options.maxEventsPerCycle });
  while (!options.signal.aborted) {
    try {
      for (let processedThisCycle = 0; processedThisCycle < options.maxEventsPerCycle && !options.signal.aborted; processedThisCycle += 1) {
        const result = await options.worker.runOnce(options.context);
        options.metrics.record(result);
        if (result.status === "idle") break;
        log(result.status === "dead_lettered" || result.status === "lost_lease" ? "warn" : "info", "outbox_result", {
          status: result.status,
          eventId: "eventId" in result ? result.eventId : undefined,
          tenantId: options.context.organizationId,
        });
      }
    } catch (error) {
      options.metrics.recordError();
      log("error", "worker_cycle_failed", { errorCode: safeErrorCode(error), tenantId: options.context.organizationId });
    }
    if (!options.signal.aborted) {
      try { await sleep(options.pollIntervalMs, options.signal); } catch (error) {
        if (!options.signal.aborted) throw error;
      }
    }
  }
  log("info", "worker_stopped", { tenantId: options.context.organizationId, metrics: options.metrics.snapshot() });
}

async function main(): Promise<void> {
  const config = loadWorkerConfig();
  const controller = new AbortController();
  const shutdown = (signal: string) => {
    logJson("info", "shutdown_requested", { signal });
    controller.abort();
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);

  const database = new WorkerTenantDatabase(config.databaseUrl);
  const metrics = new WorkerOperationalMetrics();
  const handler: OutboxEventHandler = {
    async handle(event: OutboxEventContract): Promise<void> {
      if (event.payload.classification !== "synthetic_demo_only") throw new Error("NonSyntheticEventRejected");
      logJson("info", "synthetic_event_acknowledged", {
        tenantId: config.tenantId,
        eventId: event.id,
        eventType: event.eventType,
        aggregateType: event.aggregateType,
      });
    },
  };
  const worker = new OutboxWorker(new PostgresOutboxStore(database), handler, {
    workerId: config.workerId,
    maxAttempts: config.maxAttempts,
    baseBackoffSeconds: config.baseBackoffSeconds,
    maxBackoffSeconds: config.maxBackoffSeconds,
    now: () => new Date(),
  });
  const context: TenantContext = { organizationId: config.tenantId, userId: config.userId, correlationId: randomUUID() };
  try {
    await runWorkerLoop({ worker, context, metrics, pollIntervalMs: config.pollIntervalMs, maxEventsPerCycle: config.maxEventsPerCycle, signal: controller.signal });
  } finally {
    await database.close();
    process.removeListener("SIGTERM", shutdown);
    process.removeListener("SIGINT", shutdown);
  }
}

function abortableDelay(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return resolve();
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
    signal.addEventListener("error", () => { clearTimeout(timer); reject(new Error("abort signal failed")); }, { once: true });
  });
}

function safeErrorCode(error: unknown): string {
  const name = error instanceof Error ? error.name : "UnknownError";
  return name.replace(/[^A-Za-z0-9_.-]/g, "_").slice(0, 128) || "UnknownError";
}

if (require.main === module) {
  void main().catch((error) => {
    logJson("error", "worker_fatal", { errorCode: safeErrorCode(error) });
    process.exitCode = 1;
  });
}
