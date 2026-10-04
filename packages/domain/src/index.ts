export type DataClassification = "public" | "internal" | "confidential" | "restricted";
export type OrganizationStatus = "active" | "suspended";
export type InvoiceStatus = "synthetic_received" | "review_required" | "reviewed";
export type ScenarioStatus = "draft" | "review_required" | "approved";

export interface EntityMetadata {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  dataClassification: DataClassification;
}

export interface TenantOwned {
  organizationId: string;
}

export interface Organization extends EntityMetadata {
  publicId: string;
  legalName: string;
  status: OrganizationStatus;
}

export interface User extends EntityMetadata {
  publicId: string;
  displayName: string;
}

export interface Membership extends EntityMetadata, TenantOwned {
  userId: string;
  role: "owner" | "operator" | "viewer";
  scopes: readonly string[];
}

export interface ConsumerUnit extends EntityMetadata, TenantOwned {
  publicId: string;
  distributor: string;
  maskedIdentifier: string;
  voltageGroup: string;
}

export interface Invoice extends EntityMetadata, TenantOwned {
  publicId: string;
  consumerUnitId: string;
  period: string;
  sha256: string;
  source: "synthetic_fixture";
  status: InvoiceStatus;
}

export interface InvoiceRevision extends EntityMetadata, TenantOwned {
  invoiceId: string;
  authorUserId: string;
  reason: string;
  values: Readonly<Record<string, string | number | null>>;
}

export interface Baseline extends EntityMetadata, TenantOwned {
  consumerUnitId: string;
  publicId: string;
  periodStart: string;
  periodEnd: string;
  currency: "BRL";
  totalCents: number;
  assumptions: readonly string[];
  calculationVersion: string;
}

export interface Scenario extends EntityMetadata, TenantOwned {
  publicId: string;
  baselineId: string;
  route: string;
  horizonMonths: number;
  totalCents: number;
  confidence: number;
  status: ScenarioStatus;
}

export interface AuditEvent extends TenantOwned {
  id: string;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  correlationId: string;
  occurredAt: string;
  before: Readonly<Record<string, unknown>> | null;
  after: Readonly<Record<string, unknown>> | null;
}

export interface TenantContext {
  organizationId: string;
  userId: string;
  correlationId: string;
}

export const TENANT_ID_PATTERN = /^ORG-[A-Z0-9][A-Z0-9-]{2,31}$/;
export const USER_ID_PATTERN = /^USR-[A-Z0-9][A-Z0-9-]{2,31}$/;

export function isValidTenantId(value: unknown): value is string {
  return typeof value === "string" && TENANT_ID_PATTERN.test(value);
}

export function isValidUserId(value: unknown): value is string {
  return typeof value === "string" && USER_ID_PATTERN.test(value);
}

export function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  }
  return value;
}

export class TenantScopedRepository<T extends TenantOwned & { id: string }> {
  private readonly records: readonly Readonly<T>[];

  constructor(records: readonly T[]) {
    this.records = records.map((record) => deepFreeze(structuredClone(record)));
  }

  findById(context: TenantContext, id: string): Readonly<T> | undefined {
    const record = this.records.find(
      (candidate) => candidate.id === id && candidate.organizationId === context.organizationId,
    );
    return record ? structuredClone(record) : undefined;
  }

  list(context: TenantContext): readonly Readonly<T>[] {
    return this.records
      .filter((candidate) => candidate.organizationId === context.organizationId)
      .map((candidate) => structuredClone(candidate));
  }
}
