export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  databaseMode: "fake" | "postgres";
  databaseUrl?: string;
  demoDataOnly: true;
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const nodeEnv = environment.NODE_ENV ?? "development";
  if (!(["development", "test", "production"] as const).includes(nodeEnv as AppConfig["nodeEnv"])) {
    throw new Error(`NODE_ENV inválido: ${nodeEnv}`);
  }

  const port = Number(environment.PORT ?? 4310);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT deve ser um inteiro entre 1 e 65535");

  const databaseMode = environment.DATABASE_MODE ?? "fake";
  if (databaseMode !== "fake" && databaseMode !== "postgres") throw new Error("DATABASE_MODE deve ser fake ou postgres");
  if (databaseMode === "postgres" && !environment.DATABASE_URL) throw new Error("DATABASE_URL é obrigatória em modo postgres");

  if ((environment.DEMO_DATA_ONLY ?? "true") !== "true") {
    throw new Error("Stage 0 exige DEMO_DATA_ONLY=true; faturas reais permanecem bloqueadas");
  }

  return {
    nodeEnv: nodeEnv as AppConfig["nodeEnv"],
    port,
    databaseMode,
    databaseUrl: environment.DATABASE_URL,
    demoDataOnly: true,
  };
}
