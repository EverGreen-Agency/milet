import { deepFreeze, type AuditEvent } from "@milet/domain";
import type { SyntheticCaseContract } from "@milet/contracts";

export const DEMO_IDS = deepFreeze({
  organizationUuid: "00000000-0000-7000-8000-000000000007",
  organizationPublicId: "ORG-0007",
  userUuid: "00000000-0000-7000-8000-000000000101",
  userPublicId: "USR-DEMO-0001",
  consumerUnitUuid: "00000000-0000-7000-8000-000000000482",
  consumerUnitPublicId: "UC-MG-00482",
  invoiceUuid: "00000000-0000-7000-8000-000000008482",
  invoicePublicId: "INV-2026-08-00482",
  baselineUuid: "00000000-0000-7000-8000-000000007001",
  baselinePublicId: "BASE-2026-08-00482",
  scenarioUuid: "00000000-0000-7000-8000-000000008001",
  scenarioPublicId: "SCN-MERCADO-LIVRE-01",
  caseId: "CASE-UC-MG-00482",
});

const createdAt = "2026-10-03T12:00:00.000Z";
const metadata = { createdAt, updatedAt: createdAt, version: 1, dataClassification: "internal" as const };

export const syntheticCase: Readonly<SyntheticCaseContract> = deepFreeze({
  caseId: DEMO_IDS.caseId,
  classification: "synthetic_demo_only",
  organization: {
    ...metadata,
    id: DEMO_IDS.organizationUuid,
    publicId: DEMO_IDS.organizationPublicId,
    legalName: "Padaria Horizonte",
    status: "active",
  },
  user: {
    ...metadata,
    id: DEMO_IDS.userUuid,
    publicId: DEMO_IDS.userPublicId,
    displayName: "Usuária de demonstração",
  },
  consumerUnit: {
    ...metadata,
    id: DEMO_IDS.consumerUnitUuid,
    organizationId: DEMO_IDS.organizationPublicId,
    publicId: DEMO_IDS.consumerUnitPublicId,
    distributor: "Cemig",
    maskedIdentifier: "•••••0482",
    voltageGroup: "A4",
  },
  invoice: {
    ...metadata,
    id: DEMO_IDS.invoiceUuid,
    organizationId: DEMO_IDS.organizationPublicId,
    publicId: DEMO_IDS.invoicePublicId,
    consumerUnitId: DEMO_IDS.consumerUnitUuid,
    period: "2026-08",
    sha256: "b47b08f85a325f70b1033b78444c2467346dd29a6a6ba6a2c39323f75a3ff7f8",
    source: "synthetic_fixture",
    status: "review_required",
  },
  invoiceRevisions: [],
  baseline: {
    ...metadata,
    id: DEMO_IDS.baselineUuid,
    organizationId: DEMO_IDS.organizationPublicId,
    publicId: DEMO_IDS.baselinePublicId,
    periodStart: "2025-09-01",
    periodEnd: "2026-08-31",
    currency: "BRL",
    totalCents: 1092000,
    assumptions: ["Consumo médio mensal de 12.480 kWh", "Valores sintéticos, sem garantia de economia"],
    calculationVersion: "demo-v0.1",
  },
  scenarios: [
    {
      ...metadata,
      id: DEMO_IDS.scenarioUuid,
      organizationId: DEMO_IDS.organizationPublicId,
      publicId: DEMO_IDS.scenarioPublicId,
      baselineId: DEMO_IDS.baselineUuid,
      route: "mercado_livre_varejista",
      horizonMonths: 12,
      totalCents: 972000,
      confidence: 0.72,
      status: "review_required",
    },
  ],
});

export function syntheticAuditEvent(overrides: Partial<AuditEvent> = {}): AuditEvent {
  return {
    id: "00000000-0000-7000-8000-000000009001",
    organizationId: DEMO_IDS.organizationPublicId,
    actorUserId: DEMO_IDS.userPublicId,
    action: "case.viewed",
    targetType: "SyntheticCase",
    targetId: DEMO_IDS.caseId,
    correlationId: "00000000-0000-4000-8000-000000000001",
    occurredAt: createdAt,
    before: null,
    after: { classification: "synthetic_demo_only" },
    ...overrides,
  };
}
