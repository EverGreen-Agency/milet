import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { AppModule } from "./app.module";
import type { AppConfig } from "./config/app-config";
import { TOKENS } from "./tokens";

export async function createApplication(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn"] });
  const config = app.get<AppConfig>(TOKENS.appConfig);
  app.enableCors({
    origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "HEAD", "OPTIONS"],
    allowedHeaders: ["content-type", "x-correlation-id", "x-organization-id", "x-user-id"],
    credentials: false,
    maxAge: 600,
  });
  app.enableShutdownHooks();
  return app;
}
