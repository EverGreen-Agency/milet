export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  bindAddress: string;
  databaseMode: "fake" | "postgres";
  databaseUrl?: string;
  demoDataOnly: true;
  corsOrigins: readonly string[];
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const nodeEnv = environment.NODE_ENV ?? "development";
  if (!(["development", "test", "production"] as const).includes(nodeEnv as AppConfig["nodeEnv"])) {
    throw new Error(`NODE_ENV inválido: ${nodeEnv}`);
  }

  const port = Number(environment.PORT ?? 4310);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT deve ser um inteiro entre 1 e 65535");

  const bindAddress = environment.BIND_ADDRESS?.trim() || "127.0.0.1";
  if (!/^(?:localhost|[0-9a-f:.]+)$/i.test(bindAddress)) throw new Error("BIND_ADDRESS deve ser um host local ou endereco IP");

  const databaseMode = environment.DATABASE_MODE ?? "fake";
  if (databaseMode !== "fake" && databaseMode !== "postgres") throw new Error("DATABASE_MODE deve ser fake ou postgres");
  if (databaseMode === "postgres" && !environment.DATABASE_URL) throw new Error("DATABASE_URL é obrigatória em modo postgres");

  if ((environment.DEMO_DATA_ONLY ?? "true") !== "true") {
    throw new Error("Stage 0 exige DEMO_DATA_ONLY=true; faturas reais permanecem bloqueadas");
  }

  const corsOrigins = parseCorsOrigins(environment.CORS_ORIGINS, nodeEnv as AppConfig["nodeEnv"]);

  return {
    nodeEnv: nodeEnv as AppConfig["nodeEnv"],
    port,
    bindAddress,
    databaseMode,
    databaseUrl: environment.DATABASE_URL,
    demoDataOnly: true,
    corsOrigins,
  };
}

function parseCorsOrigins(value: string | undefined, nodeEnv: AppConfig["nodeEnv"]): readonly string[] {
  const defaults = nodeEnv === "production"
    ? []
    : ["http://127.0.0.1:4173", "http://localhost:4173"];
  const origins = value === undefined ? defaults : value.split(",").map((origin) => origin.trim()).filter(Boolean);
  const unique = [...new Set(origins)];
  for (const origin of unique) {
    let parsed: URL;
    try { parsed = new URL(origin); } catch { throw new Error(`CORS_ORIGINS contem origem invalida: ${origin}`); }
    if (!(["http:", "https:"] as const).includes(parsed.protocol as "http:" | "https:") || parsed.origin !== origin) {
      throw new Error(`CORS_ORIGINS exige origens exatas http(s), sem caminho: ${origin}`);
    }
  }
  return unique;
}
