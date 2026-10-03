import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import type { DatabaseReadinessPort } from "@milet/contracts";
import { Pool } from "pg";
import type { AppConfig } from "../config/app-config";
import { TOKENS } from "../tokens";

@Injectable()
export class DatabaseReadinessService implements DatabaseReadinessPort, OnModuleDestroy {
  private readonly pool?: Pool;

  constructor(@Inject(TOKENS.appConfig) private readonly config: AppConfig) {
    if (config.databaseMode === "postgres") {
      this.pool = new Pool({ connectionString: config.databaseUrl, max: 2, connectionTimeoutMillis: 1_500 });
    }
  }

  async check(): Promise<{ ready: boolean; mode: "fake" | "postgres"; detail?: string }> {
    if (!this.pool) return { ready: true, mode: "fake", detail: "deterministic Stage 0 adapter" };
    try {
      await this.pool.query("SELECT 1");
      return { ready: true, mode: "postgres" };
    } catch {
      return { ready: false, mode: "postgres", detail: "database unavailable" };
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool?.end();
  }
}
