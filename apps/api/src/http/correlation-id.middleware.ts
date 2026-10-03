import { Injectable, type NestMiddleware } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const SAFE_CORRELATION_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const candidate = request.header("x-correlation-id");
    const correlationId = candidate && SAFE_CORRELATION_ID.test(candidate) ? candidate : randomUUID();
    request.correlationId = correlationId;
    response.setHeader("x-correlation-id", correlationId);
    next();
  }
}

declare module "express-serve-static-core" {
  interface Request {
    correlationId: string;
    tenantContext?: import("@milet/domain").TenantContext;
  }
}
