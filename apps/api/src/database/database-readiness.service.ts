import { Inject, Injectable } from "@nestjs/common";
import type { DatabaseReadinessPort } from "@milet/contracts";
import type { AppConfig } from "../config/app-config";
import { TOKENS } from "../tokens";
import { PostgresTenantDatabase } from "./postgres-tenant-database";

@Injectable()
export class DatabaseReadinessService implements DatabaseReadinessPort {
  constructor(
    @Inject(TOKENS.appConfig) private readonly config: AppConfig,
    private readonly postgres: PostgresTenantDatabase,
  ) {}

  async check(): Promise<{ ready: boolean; mode: "fake" | "postgres"; detail?: string }> {
    if (this.config.databaseMode === "fake") return { ready: true, mode: "fake", detail: "deterministic Stage 1 adapter" };
    return this.postgres.check();
  }
}
