import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { TenantContext } from "@milet/domain";
import type { Request } from "express";

export const CurrentTenant = createParamDecorator((_data: unknown, context: ExecutionContext): TenantContext => {
  const tenant = context.switchToHttp().getRequest<Request>().tenantContext;
  if (!tenant) throw new Error("TenantGuard não inicializou o contexto");
  return tenant;
});
