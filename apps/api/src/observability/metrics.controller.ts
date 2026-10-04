import { Controller, Get, Inject } from "@nestjs/common";
import { PublicRoute } from "../http/public-route";
import { ApiOperationalMetrics } from "./operational-metrics";

@Controller("metrics")
@PublicRoute()
export class MetricsController {
  constructor(@Inject(ApiOperationalMetrics) private readonly metrics: ApiOperationalMetrics) {}

  @Get()
  snapshot() {
    return { scope: "process", externalBackend: false, ...this.metrics.snapshot() };
  }
}
