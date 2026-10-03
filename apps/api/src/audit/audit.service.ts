import { Inject, Injectable } from "@nestjs/common";
import type { AuditStorePort } from "@milet/contracts";
import type { AuditEvent, TenantContext } from "@milet/domain";
import { randomUUID } from "node:crypto";
import { TOKENS } from "../tokens";

@Injectable()
export class AuditService {
  constructor(@Inject(TOKENS.auditStore) private readonly store: AuditStorePort) {}

  append(context: TenantContext, input: Omit<AuditEvent, "id" | "organizationId" | "actorUserId" | "correlationId" | "occurredAt">) {
    return this.store.append({
      ...input,
      id: randomUUID(),
      organizationId: context.organizationId,
      actorUserId: context.userId,
      correlationId: context.correlationId,
      occurredAt: new Date().toISOString(),
    });
  }

  list(context: TenantContext) {
    return this.store.list(context);
  }
}
