import { MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuditService } from "./audit/audit.service";
import { InMemoryAuditStore } from "./audit/in-memory-audit.store";
import { CasesController } from "./cases/cases.controller";
import { InMemoryCaseQueryService } from "./cases/in-memory-case-query.service";
import { loadConfig } from "./config/app-config";
import { DatabaseReadinessService } from "./database/database-readiness.service";
import { HealthController } from "./health/health.controller";
import { CorrelationIdMiddleware } from "./http/correlation-id.middleware";
import { FakeTenantAccessService } from "./tenancy/fake-tenant-access.service";
import { TenantGuard } from "./tenancy/tenant.guard";
import { TOKENS } from "./tokens";

@Module({
  controllers: [HealthController, CasesController],
  providers: [
    AuditService,
    CorrelationIdMiddleware,
    FakeTenantAccessService,
    InMemoryAuditStore,
    InMemoryCaseQueryService,
    DatabaseReadinessService,
    { provide: TOKENS.appConfig, useFactory: () => loadConfig() },
    { provide: TOKENS.tenantAccess, useExisting: FakeTenantAccessService },
    { provide: TOKENS.auditStore, useExisting: InMemoryAuditStore },
    { provide: TOKENS.caseQuery, useExisting: InMemoryCaseQueryService },
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
