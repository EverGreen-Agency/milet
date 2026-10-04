import { isValidTenantId, isValidUserId } from "@milet/domain";

export interface WorkerConfig {
  databaseUrl: string;
  tenantId: string;
  userId: string;
  workerId: string;
  pollIntervalMs: number;
  maxEventsPerCycle: number;
  maxAttempts: number;
  baseBackoffSeconds: number;
  maxBackoffSeconds: number;
}

export function loadWorkerConfig(environment: NodeJS.ProcessEnv = process.env): WorkerConfig {
  const databaseUrl = required(environment.DATABASE_URL, "DATABASE_URL");
  const tenantId = required(environment.WORKER_TENANT_ID, "WORKER_TENANT_ID");
  const userId = required(environment.WORKER_USER_ID, "WORKER_USER_ID");
  if (!isValidTenantId(tenantId)) throw new Error("WORKER_TENANT_ID invalido");
  if (!isValidUserId(userId)) throw new Error("WORKER_USER_ID invalido");

  return {
    databaseUrl,
    tenantId,
    userId,
    workerId: safeId(environment.WORKER_ID ?? "milet-worker-01", "WORKER_ID"),
    pollIntervalMs: integer(environment.WORKER_POLL_INTERVAL_MS, 1_000, 100, 60_000, "WORKER_POLL_INTERVAL_MS"),
    maxEventsPerCycle: integer(environment.WORKER_MAX_EVENTS_PER_CYCLE, 10, 1, 100, "WORKER_MAX_EVENTS_PER_CYCLE"),
    maxAttempts: integer(environment.WORKER_MAX_ATTEMPTS, 5, 1, 100, "WORKER_MAX_ATTEMPTS"),
    baseBackoffSeconds: integer(environment.WORKER_BASE_BACKOFF_SECONDS, 10, 1, 3_600, "WORKER_BASE_BACKOFF_SECONDS"),
    maxBackoffSeconds: integer(environment.WORKER_MAX_BACKOFF_SECONDS, 300, 1, 86_400, "WORKER_MAX_BACKOFF_SECONDS"),
  };
}

function required(value: string | undefined, name: string): string {
  if (!value?.trim()) throw new Error(`${name} e obrigatoria`);
  return value.trim();
}

function safeId(value: string, name: string): string {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(value)) throw new Error(`${name} invalido`);
  return value;
}

function integer(raw: string | undefined, fallback: number, min: number, max: number, name: string): number {
  const value = Number(raw ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${name} deve ser inteiro entre ${min} e ${max}`);
  return value;
}
