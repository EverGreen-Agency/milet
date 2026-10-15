import { Body, Controller, Inject, Post, Req, ServiceUnavailableException } from "@nestjs/common";
import type { Request } from "express";
import { PublicRoute } from "../http/public-route";
import { TOKENS } from "../tokens";
import type { AppConfig } from "../config/app-config";
import { IntakeRateLimiter } from "./intake-rate-limiter";
import { IntakeService } from "./intake.service";
import type { IntakeRequest } from "./intake.types";

@Controller("v1/intakes")
@PublicRoute()
export class IntakeController {
  constructor(
    @Inject(TOKENS.appConfig) private readonly config: AppConfig,
    private readonly intake: IntakeService,
    private readonly rateLimiter: IntakeRateLimiter,
  ) {}

  @Post()
  async submit(@Body() body: unknown, @Req() request: Request) {
    if (!this.config.intakeEnabled) throw new ServiceUnavailableException("O intake real ainda não está configurado neste ambiente.");
    this.rateLimiter.check(request.ip || request.socket.remoteAddress || "unknown");
    const result = await this.intake.submit(body as IntakeRequest);
    return { submissionId: result.submissionId, guidance: result.guidance, acknowledgementSent: result.acknowledgementSent };
  }
}
