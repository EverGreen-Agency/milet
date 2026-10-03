import { NestFactory } from "@nestjs/core";
import type { INestApplication } from "@nestjs/common";
import { AppModule } from "./app.module";

export async function createApplication(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { logger: ["error", "warn"] });
  app.enableShutdownHooks();
  return app;
}
