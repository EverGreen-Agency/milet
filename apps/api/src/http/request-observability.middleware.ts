import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { ApiOperationalMetrics } from "../observability/operational-metrics";

@Injectable()
export class RequestObservabilityMiddleware implements NestMiddleware {
  constructor(@Inject(ApiOperationalMetrics) private readonly metrics: ApiOperationalMetrics) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const startedAt = process.hrtime.bigint();
    this.metrics.requestStarted();
    response.once("finish", () => {
      this.metrics.requestFinished(response.statusCode);
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      process.stdout.write(`${JSON.stringify({
        timestamp: new Date().toISOString(),
        level: response.statusCode >= 500 ? "error" : "info",
        service: "milet-api",
        event: "http_request",
        method: request.method,
        route: request.route?.path ?? request.path,
        statusCode: response.statusCode,
        durationMs: Number(durationMs.toFixed(2)),
        correlationId: request.correlationId,
      })}\n`);
    });
    next();
  }
}
