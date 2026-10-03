import "reflect-metadata";
import { createApplication } from "./bootstrap";
import { loadConfig } from "./config/app-config";

async function main(): Promise<void> {
  const config = loadConfig();
  const app = await createApplication();
  await app.listen(config.port, "127.0.0.1");
}

void main();
