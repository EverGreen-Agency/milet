import { Injectable } from "@nestjs/common";
import type { CaseQueryPort, SyntheticCaseContract } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { syntheticCase } from "@milet/test-fixtures";

@Injectable()
export class InMemoryCaseQueryService implements CaseQueryPort {
  async getById(context: TenantContext, caseId: string): Promise<SyntheticCaseContract | undefined> {
    if (context.organizationId !== syntheticCase.organization.publicId || caseId !== syntheticCase.caseId) return undefined;
    return structuredClone(syntheticCase);
  }
}
