import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const legacyAppPath = path.join(rootDir, "app");
const backupAppPath = path.join(rootDir, ".app-legacy-backup");

let isRestored = false;

function restore() {
  if (isRestored) return;
  isRestored = true;

  if (fs.existsSync(backupAppPath)) {
    console.log("\n[demo-runner] Restaurando diretório legado app/...");
    if (fs.existsSync(legacyAppPath)) {
      // Se por algum motivo ambos existem, limpa backup
      fs.rmSync(backupAppPath, { recursive: true, force: true });
    } else {
      fs.renameSync(backupAppPath, legacyAppPath);
    }
    console.log("[demo-runner] Estrutura restaurada com sucesso.");
  }
}

process.on("SIGINT", () => {
  restore();
  process.exit(0);
});

process.on("SIGTERM", () => {
  restore();
  process.exit(0);
});

process.on("exit", () => {
  restore();
});

process.on("uncaughtException", (err) => {
  console.error("[demo-runner] Erro inesperado:", err);
  restore();
  process.exit(1);
});

console.log("==================================================");
console.log("  Milet · Pitch Demo Runner (Next.js Local)       ");
console.log("==================================================");

// 1. Temporariamente move app/ para .app-legacy-backup para destravar o App Router src/app
if (fs.existsSync(legacyAppPath)) {
  console.log("[demo-runner] Desviando app/ legado para permitir que o Next.js sirva src/app...");
  fs.renameSync(legacyAppPath, backupAppPath);
}

const port = process.env.PORT || "3000";
console.log(`[demo-runner] Iniciando Next.js dev server na porta ${port}...`);
console.log(`[demo-runner] URL da demo: http://localhost:${port}/diagnostico?demo=1`);
console.log(`[demo-runner] Pressione Ctrl+C para encerrar e restaurar tudo automaticamente.\n`);

const nextProc = spawn("npx", ["next", "dev", "-p", port], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true
});

nextProc.on("close", (code) => {
  restore();
  process.exit(code || 0);
});
