import { Inject, Injectable } from "@nestjs/common";
import type { CaseQueryPort, SyntheticCaseContract, TenantTransactionPort } from "@milet/contracts";
import type { TenantContext } from "@milet/domain";
import { PostgresTenantDatabase, TenantNotFoundError } from "../database/postgres-tenant-database";

type CaseRow = {
  case_id: string; organization_id: string; organization_public_id: string; legal_name: string;
  organization_status: "active" | "suspended"; user_id: string; user_public_id: string; display_name: string;
  consumer_unit_id: string; consumer_unit_public_id: string; distributor: string; masked_identifier: string;
  voltage_group: string; invoice_id: string; invoice_public_id: string; period: string; sha256: string;
  invoice_status: "synthetic_received" | "review_required" | "reviewed"; baseline_id: string;
  baseline_public_id: string; period_start: string; period_end: string; total_cents: string;
  assumptions: string[]; calculation_version: string; created_at: string; updated_at: string;
};

type ScenarioRow = {
  id: string; public_id: string; route: string; horizon_months: number; total_cents: string; confidence: string;
  status: "draft" | "review_required" | "approved"; created_at: string; updated_at: string;
};

@Injectable()
export class PostgresCaseQueryService implements CaseQueryPort {
  constructor(@Inject(PostgresTenantDatabase) private readonly database: PostgresTenantDatabase | TenantTransactionPort) {}

  async getById(context: TenantContext, caseId: string): Promise<SyntheticCaseContract | undefined> {
    try {
      return await this.database.withTenant(context, async (transaction) => {
        const result = await transaction.query<CaseRow>(
          `SELECT
             'CASE-' || cu.public_id AS case_id,
             org.id::text AS organization_id, org.public_id AS organization_public_id,
             org.legal_name, org.status AS organization_status,
             usr.id::text AS user_id, usr.public_id AS user_public_id, usr.display_name,
             cu.id::text AS consumer_unit_id, cu.public_id AS consumer_unit_public_id,
             cu.distributor, cu.masked_identifier, cu.voltage_group,
             inv.id::text AS invoice_id, inv.public_id AS invoice_public_id,
             inv.period, inv.sha256, inv.status AS invoice_status,
             base.id::text AS baseline_id, base.public_id AS baseline_public_id,
             base.period_start::text, base.period_end::text, base.total_cents::text,
             base.assumptions, base.calculation_version,
             to_char(cu.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at,
             to_char(cu.updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS updated_at
           FROM consumer_units cu
           JOIN organizations org ON org.id = cu.organization_id
           JOIN memberships membership ON membership.organization_id = org.id
           JOIN users usr ON usr.id = membership.user_id AND usr.public_id = $2
           JOIN invoices inv ON inv.organization_id = org.id AND inv.consumer_unit_id = cu.id
           JOIN baselines base ON base.organization_id = org.id
           WHERE org.id = current_setting('app.organization_id')::uuid
             AND ('CASE-' || cu.public_id) = $1
           ORDER BY inv.period DESC, base.period_end DESC
           LIMIT 1`,
          [caseId, context.userId],
        );
        const row = result.rows[0];
        if (!row) return undefined;
        const scenarios = await transaction.query<ScenarioRow>(
          `SELECT id::text, public_id, route, horizon_months, total_cents::text, confidence::text, status,
                  to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at,
                  to_char(updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS updated_at
             FROM scenarios
            WHERE organization_id = current_setting('app.organization_id')::uuid AND baseline_id = $1::uuid
            ORDER BY public_id`,
          [row.baseline_id],
        );
        const revisions = await transaction.query<{
          id: string; author_user_id: string; reason: string; values_json: Record<string, string | number | null>;
          created_at: string; updated_at: string;
        }>(
          `SELECT rev.id::text, usr.public_id AS author_user_id, rev.reason, rev.values_json,
                  to_char(rev.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at,
                  to_char(rev.updated_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS updated_at
             FROM invoice_revisions rev JOIN users usr ON usr.id = rev.author_user_id
            WHERE rev.organization_id = current_setting('app.organization_id')::uuid AND rev.invoice_id = $1::uuid
            ORDER BY rev.created_at`,
          [row.invoice_id],
        );
        const metadata = { createdAt: row.created_at, updatedAt: row.updated_at, version: 1 };
        return {
          caseId: row.case_id,
          classification: "synthetic_demo_only",
          organization: { ...metadata, id: row.organization_id, publicId: row.organization_public_id, legalName: row.legal_name, status: row.organization_status, dataClassification: "confidential" },
          user: { ...metadata, id: row.user_id, publicId: row.user_public_id, displayName: row.display_name, dataClassification: "confidential" },
          consumerUnit: { ...metadata, id: row.consumer_unit_id, organizationId: row.organization_public_id, publicId: row.consumer_unit_public_id, distributor: row.distributor, maskedIdentifier: row.masked_identifier, voltageGroup: row.voltage_group, dataClassification: "confidential" },
          invoice: { ...metadata, id: row.invoice_id, organizationId: row.organization_public_id, publicId: row.invoice_public_id, consumerUnitId: row.consumer_unit_id, period: row.period, sha256: row.sha256, source: "synthetic_fixture", status: row.invoice_status, dataClassification: "restricted" },
          invoiceRevisions: revisions.rows.map((revision) => ({ ...metadata, id: revision.id, organizationId: row.organization_public_id, invoiceId: row.invoice_id, authorUserId: revision.author_user_id, reason: revision.reason, values: revision.values_json, createdAt: revision.created_at, updatedAt: revision.updated_at, dataClassification: "restricted" })),
          baseline: { ...metadata, id: row.baseline_id, organizationId: row.organization_public_id, publicId: row.baseline_public_id, periodStart: row.period_start, periodEnd: row.period_end, currency: "BRL", totalCents: Number(row.total_cents), assumptions: row.assumptions, calculationVersion: row.calculation_version, dataClassification: "confidential" },
          scenarios: scenarios.rows.map((scenario) => ({ ...metadata, id: scenario.id, organizationId: row.organization_public_id, publicId: scenario.public_id, baselineId: row.baseline_id, route: scenario.route, horizonMonths: scenario.horizon_months, totalCents: Number(scenario.total_cents), confidence: Number(scenario.confidence), status: scenario.status, createdAt: scenario.created_at, updatedAt: scenario.updated_at, dataClassification: "confidential" })),
        } satisfies SyntheticCaseContract;
      });
    } catch (error) {
      if (error instanceof TenantNotFoundError) return undefined;
      throw error;
    }
  }
}
