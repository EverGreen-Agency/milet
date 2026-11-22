export type UserRole = "CONSUMIDOR" | "COMERCIALIZADORA" | "USINA" | "ADMIN";
export type Submarket = "SE/CO" | "S" | "NE" | "N";
export type GenerationSourceType = "SOLAR" | "PCH" | "BIOMASSA" | "EOLICA";
export type AssetModality = "GD_COMPARTILHADA" | "AUTOPRODUCAO_ACL";
export type ProposalType = "ACL_VAREJISTA" | "GD_ASSINATURA" | "AUTOPRODUCAO";

export const PORTAL_ROLES: readonly UserRole[] = [
  "CONSUMIDOR",
  "COMERCIALIZADORA",
  "USINA",
  "ADMIN",
];

export const PORTAL_SUBMARKETS: readonly Submarket[] = ["SE/CO", "S", "NE", "N"];

export interface PortalSession {
  userId: string;
  tenantId: string;
  role: UserRole;
  displayName: string;
  email: string;
  issuedAt: number;
  expiresAt: number;
}

export interface EnergyCaseDTO {
  id: string;
  tenantId: string;
  companyName: string;
  documentNumber: string;
  distributor: string;
  submarket: Submarket;
  voltageGroup: string;
  consumptionKwh: number;
  contractedDemandKw: number;
  baselineTotalBrl: number;
  consentShared: boolean;
  status: "ANALYZED" | "QUOTING" | "CONTRACTED";
}

export interface GenerationAssetDTO {
  id: string;
  tenantId: string;
  name: string;
  sourceType: GenerationSourceType;
  modality: AssetModality;
  submarket: Submarket;
  distributor: string;
  capacityKw: number;
  availableKwhMonth: number;
  discountPercent: number;
  status: "ACTIVE" | "PENDING_APPROVAL";
}

export interface SupplierOfferDTO {
  id: string;
  supplierTenantId: string;
  supplierName: string;
  submarket: Submarket;
  proposalType: ProposalType;
  energyCostBrl: number;
  residualDistributionBrl: number;
  taxesBrl: number;
  guaranteesBrl: number;
  miletFeeMonthlyBrl: number;
  contractTermMonths: number;
  renewableShare: string;
}

export interface MatchResultDTO {
  offerId: string;
  providerTenantId: string;
  providerName: string;
  route: ProposalType;
  totalAllInBrl: number;
  monthlySavingBrl: number;
  savingPercent: number;
  miletFeeMonthlyBrl: number;
  fioBShareApplied: number;
  rank: number;
  compatible: boolean;
  incompatibilityReason?: string;
}

export interface AuditTrailEntryDTO {
  id: string;
  tenantId: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  payloadSummary: string;
  hash: string;
  recordedAt: string;
}

export function isValidUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && PORTAL_ROLES.includes(value as UserRole);
}

export function isValidSubmarket(value: unknown): value is Submarket {
  return typeof value === "string" && PORTAL_SUBMARKETS.includes(value as Submarket);
}

export function validateGenerationAssetInput(input: Partial<GenerationAssetDTO>): readonly string[] {
  const errors: string[] = [];
  if (!input.name || input.name.trim().length < 2) errors.push("Nome da usina é obrigatório.");
  if (!input.distributor || input.distributor.trim().length < 2) errors.push("Distribuidora é obrigatória.");
  if (!isValidSubmarket(input.submarket)) errors.push("Submercado CCEE inválido.");
  if (typeof input.capacityKw !== "number" || input.capacityKw <= 0) errors.push("Capacidade instalada deve ser positiva.");
  if (typeof input.availableKwhMonth !== "number" || input.availableKwhMonth < 0) errors.push("Saldo de geração inválido.");
  return errors;
}
