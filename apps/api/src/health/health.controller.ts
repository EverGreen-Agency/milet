import { Controller, Get, Inject, ServiceUnavailableException } from "@nestjs/common";
import type { DatabaseReadinessPort } from "@milet/contracts";
import { PublicRoute } from "../http/public-route";
import { TOKENS } from "../tokens";

@Controller("health")
@PublicRoute()
export class HealthController {
  constructor(@Inject(TOKENS.databaseReadiness) private readonly database: DatabaseReadinessPort) {}

  @Get("live")
  live() {
    return { status: "ok" as const };
  }

  @Get("ready")
  async ready() {
    const database = await this.database.check();
    if (!database.ready) throw new ServiceUnavailableException({ status: "not_ready", database });
    return { status: "ready" as const, database };
  }
}
