import { Injectable } from "@nestjs/common";
import type { AuditStorePort } from "@milet/contracts";
import { deepFreeze, type AuditEvent, type TenantContext } from "@milet/domain";

export class ImmutableAuditViolation extends Error {
  constructor() {
    super("AuditEvent é append-only; UPDATE e DELETE são proibidos");
  }
}

@Injectable()
export class InMemoryAuditStore implements AuditStorePort {
  private readonly events: Readonly<AuditEvent>[] = [];

  async append(event: AuditEvent): Promise<Readonly<AuditEvent>> {
    const immutable = deepFreeze(structuredClone(event));
    this.events.push(immutable);
    return structuredClone(immutable);
  }

  async list(context: TenantContext): Promise<readonly Readonly<AuditEvent>[]> {
    return this.events
      .filter((event) => event.organizationId === context.organizationId)
      .map((event) => structuredClone(event));
  }

  async replace(): Promise<never> {
    throw new ImmutableAuditViolation();
  }

  async delete(): Promise<never> {
    throw new ImmutableAuditViolation();
  }
}
