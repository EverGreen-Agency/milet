import { Injectable } from "@nestjs/common";
import type { TenantAccessPort } from "@milet/contracts";
import { DEMO_IDS } from "@milet/test-fixtures";

@Injectable()
export class FakeTenantAccessService implements TenantAccessPort {
  private readonly memberships = new Set([
    `${DEMO_IDS.organizationPublicId}:${DEMO_IDS.userPublicId}`,
    "ORG-9999:USR-DEMO-9999",
  ]);

  async canAccess(organizationId: string, userId: string): Promise<boolean> {
    return this.memberships.has(`${organizationId}:${userId}`);
  }
}
