import type { WorkerRunResult } from "./outbox-worker";

export interface WorkerMetricsSnapshot {
  processed: number;
  retries: number;
  deadLetters: number;
  lostLeases: number;
  alreadyCompleted: number;
  idlePolls: number;
  errors: number;
}

export class WorkerOperationalMetrics {
  private readonly values: WorkerMetricsSnapshot = {
    processed: 0,
    retries: 0,
    deadLetters: 0,
    lostLeases: 0,
    alreadyCompleted: 0,
    idlePolls: 0,
    errors: 0,
  };

  record(result: WorkerRunResult): void {
    if (result.status === "processed") this.values.processed += 1;
    else if (result.status === "retry_scheduled") this.values.retries += 1;
    else if (result.status === "dead_lettered") this.values.deadLetters += 1;
    else if (result.status === "lost_lease") this.values.lostLeases += 1;
    else if (result.status === "already_completed") this.values.alreadyCompleted += 1;
    else if (result.status === "idle") this.values.idlePolls += 1;
    else if (result.status === "ignored") this.values.errors += 1;
  }

  recordError(): void { this.values.errors += 1; }

  snapshot(): Readonly<WorkerMetricsSnapshot> { return Object.freeze({ ...this.values }); }
}
