import { MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuditService } from "./audit/audit.service";
import { InMemoryAuditStore } from "./audit/in-memory-audit.store";
import { PostgresAuditStore } from "./audit/postgres-audit.store";
import { CasesController } from "./cases/cases.controller";
import { InMemoryCaseQueryService } from "./cases/in-memory-case-query.service";
import { PostgresCaseQueryService } from "./cases/postgres-case-query.service";
import { loadConfig } from "./config/app-config";
import { DatabaseReadinessService } from "./database/database-readiness.service";
import { PostgresTenantDatabase } from "./database/postgres-tenant-database";
import { HealthController } from "./health/health.controller";
import { CorrelationIdMiddleware } from "./http/correlation-id.middleware";
import { FakeTenantAccessService } from "./tenancy/fake-tenant-access.service";
import { PostgresTenantAccessService } from "./tenancy/postgres-tenant-access.service";
import { TenantGuard } from "./tenancy/tenant.guard";
import { TOKENS } from "./tokens";

@Module({
  controllers: [HealthController, CasesController],
  providers: [
    AuditService,
    CorrelationIdMiddleware,
    FakeTenantAccessService,
    PostgresTenantAccessService,
    InMemoryAuditStore,
    PostgresAuditStore,
    InMemoryCaseQueryService,
    PostgresCaseQueryService,
    PostgresTenantDatabase,
    DatabaseReadinessService,
    { provide: TOKENS.appConfig, useFactory: () => loadConfig() },
    {
      provide: TOKENS.tenantAccess,
      inject: [TOKENS.appConfig, FakeTenantAccessService, PostgresTenantAccessService],
      useFactory: (config: ReturnType<typeof loadConfig>, fake: FakeTenantAccessService, postgres: PostgresTenantAccessService) =>
        config.databaseMode === "postgres" ? postgres : fake,
    },
    {
      provide: TOKENS.auditStore,
      inject: [TOKENS.appConfig, InMemoryAuditStore, PostgresAuditStore],
      useFactory: (config: ReturnType<typeof loadConfig>, memory: InMemoryAuditStore, postgres: PostgresAuditStore) =>
        config.databaseMode === "postgres" ? postgres : memory,
    },
    {
      provide: TOKENS.caseQuery,
      inject: [TOKENS.appConfig, InMemoryCaseQueryService, PostgresCaseQueryService],
      useFactory: (config: ReturnType<typeof loadConfig>, memory: InMemoryCaseQueryService, postgres: PostgresCaseQueryService) =>
        config.databaseMode === "postgres" ? postgres : memory,
    },
    { provide: TOKENS.tenantTransaction, useExisting: PostgresTenantDatabase },
    { provide: TOKENS.databaseReadiness, useExisting: DatabaseReadinessService },
    { provide: APP_GUARD, useClass: TenantGuard },
  ],
  exports: [AuditService, InMemoryAuditStore],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes("*");
  }
}
