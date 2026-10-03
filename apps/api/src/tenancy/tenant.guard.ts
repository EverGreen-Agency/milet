import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { TenantAccessPort } from "@milet/contracts";
import { isValidTenantId, isValidUserId } from "@milet/domain";
import type { Request } from "express";
import { PUBLIC_ROUTE } from "../http/public-route";
import { TOKENS } from "../tokens";

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(TOKENS.tenantAccess) private readonly access: TenantAccessPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const organizationId = request.header("x-organization-id");
    const userId = request.header("x-user-id");
    if (!organizationId || !userId) throw new BadRequestException("x-organization-id e x-user-id são obrigatórios");
    if (!isValidTenantId(organizationId) || !isValidUserId(userId)) {
      throw new BadRequestException("tenant ou usuário em formato inválido");
    }
    if (!(await this.access.canAccess(organizationId, userId))) throw new ForbiddenException("acesso ao tenant negado");

    request.tenantContext = { organizationId, userId, correlationId: request.correlationId };
    return true;
  }
}
