import { Controller, Get, Inject, NotFoundException, Param } from "@nestjs/common";
import type { CaseQueryPort } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { CurrentTenant } from "../tenancy/tenant-context.decorator";
import { TOKENS } from "../tokens";

@Controller("v1/cases")
export class CasesController {
  constructor(@Inject(TOKENS.caseQuery) private readonly cases: CaseQueryPort) {}

  @Get(":caseId")
  async getCase(@CurrentTenant() context: TenantContext, @Param("caseId") caseId: string) {
    const found = await this.cases.getById(context, caseId);
    if (!found) throw new NotFoundException("caso sintético não encontrado neste tenant");
    return found;
  }
}
