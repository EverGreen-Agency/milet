export const TOKENS = {
  appConfig: Symbol("appConfig"),
  tenantAccess: Symbol("tenantAccess"),
  caseQuery: Symbol("caseQuery"),
  auditStore: Symbol("auditStore"),
  databaseReadiness: Symbol("databaseReadiness"),
  tenantTransaction: Symbol("tenantTransaction"),
} as const;
