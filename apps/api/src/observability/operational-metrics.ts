import { Injectable } from "@nestjs/common";

export interface ApiMetricsSnapshot {
  requests: number;
  errors: number;
  inFlight: number;
  byStatus: Readonly<Record<string, number>>;
}

@Injectable()
export class ApiOperationalMetrics {
  private requests = 0;
  private errors = 0;
  private inFlight = 0;
  private readonly byStatus = new Map<string, number>();

  requestStarted(): void {
    this.requests += 1;
    this.inFlight += 1;
  }

  requestFinished(statusCode: number): void {
    this.inFlight = Math.max(0, this.inFlight - 1);
    if (statusCode >= 400) this.errors += 1;
    const bucket = `${Math.floor(statusCode / 100)}xx`;
    this.byStatus.set(bucket, (this.byStatus.get(bucket) ?? 0) + 1);
  }

  snapshot(): ApiMetricsSnapshot {
    return Object.freeze({
      requests: this.requests,
      errors: this.errors,
      inFlight: this.inFlight,
      byStatus: Object.freeze(Object.fromEntries([...this.byStatus.entries()].sort())),
    });
  }
}
