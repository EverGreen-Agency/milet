import type {
  AuditEvent,
  Baseline,
  ConsumerUnit,
  Invoice,
  InvoiceRevision,
  Organization,
  Scenario,
  TenantContext,
  User,
} from "@milet/domain";

export interface SyntheticCaseContract {
  caseId: string;
  organization: Organization;
  user: User;
  consumerUnit: ConsumerUnit;
  invoice: Invoice;
  invoiceRevisions: readonly InvoiceRevision[];
  baseline: Baseline;
  scenarios: readonly Scenario[];
  classification: "synthetic_demo_only";
}

export interface TenantAccessPort {
  canAccess(organizationId: string, userId: string): Promise<boolean>;
}

export interface CaseQueryPort {
  getById(context: TenantContext, caseId: string): Promise<SyntheticCaseContract | undefined>;
}

export interface AuditStorePort {
  append(event: AuditEvent): Promise<Readonly<AuditEvent>>;
  list(context: TenantContext): Promise<readonly Readonly<AuditEvent>[]>;
}

export interface DatabaseReadinessPort {
  check(): Promise<{ ready: boolean; mode: "fake" | "postgres"; detail?: string }>;
}

export interface SqlQueryResult<Row> {
  rows: Row[];
  rowCount: number | null;
}

export interface TenantTransaction {
  query<Row>(text: string, values?: readonly unknown[]): Promise<SqlQueryResult<Row>>;
}

export interface TenantTransactionPort {
  withTenant<T>(context: TenantContext, operation: (transaction: TenantTransaction) => Promise<T>): Promise<T>;
}

export interface OutboxEventContract {
  id: string;
  organizationId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Readonly<Record<string, unknown>>;
  correlationId: string;
  occurredAt: string;
  availableAt: string;
  attempts: number;
}

export interface InvoiceIntakePort {
  receiveSyntheticReference(input: {
    organizationId: string;
    publicInvoiceId: string;
  }): Promise<{ accepted: true; status: "review_required" }>;
}

export interface OcrPort {
  submitDisabled(): Promise<never>;
}

export interface SignaturePort {
  createEnvelopeDisabled(): Promise<never>;
}

export interface BillingPort {
  createChargeDisabled(): Promise<never>;
}
