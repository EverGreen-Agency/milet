import { Inject, Injectable } from "@nestjs/common";
import type { TenantAccessPort, TenantTransactionPort } from "@milet/contracts";
import { PostgresTenantDatabase, TenantNotFoundError } from "../database/postgres-tenant-database";

@Injectable()
export class PostgresTenantAccessService implements TenantAccessPort {
  constructor(@Inject(PostgresTenantDatabase) private readonly database: PostgresTenantDatabase | TenantTransactionPort) {}

  async canAccess(organizationId: string, userId: string): Promise<boolean> {
    try {
      return await this.database.withTenant(
        { organizationId, userId, correlationId: "tenant-access-check" },
        async (transaction) => {
          const membership = await transaction.query<{ allowed: boolean }>(
            `SELECT true AS allowed
               FROM memberships membership
               JOIN users usr ON usr.id = membership.user_id
              WHERE membership.organization_id = current_setting('app.organization_id')::uuid
                AND usr.public_id = $1
              LIMIT 1`,
            [userId],
          );
          return membership.rows[0]?.allowed === true;
        },
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) return false;
      throw error;
    }
  }
}
