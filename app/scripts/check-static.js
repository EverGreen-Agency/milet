import fs from "node:fs";

const required = ["app/index.html", "app/styles.css", "app/runtime-config.js", "app/src/app.js", "app/src/domain.js", "app/src/fixtures.js", "app/src/demo-adapter.js"];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Arquivo obrigatório ausente: ${file}`);
}
const html = fs.readFileSync("app/index.html", "utf8");
const css = fs.readFileSync("app/styles.css", "utf8");
const app = fs.readFileSync("app/src/app.js", "utf8");
for (const marker of ["main", "live-region", "stepper", "theme-toggle", "runtime-status"]) {
  if (!html.includes(`id="${marker}"`)) throw new Error(`Marco acessível ausente: ${marker}`);
}
if (!css.includes("prefers-reduced-motion")) throw new Error("Tratamento de movimento reduzido ausente");
if (!css.includes(".mobile-comparison")) throw new Error("Comparação mobile dedicada ausente");
for (const story of ["US-001", "US-002", "US-003", "US-006", "US-007", "US-008", "US-009", "US-013"]) {
  if (!fs.readFileSync("app/src/domain.js", "utf8").includes(story)) throw new Error(`Rastreabilidade ausente: ${story}`);
}
if (!app.includes("Nenhuma oferta compra posição")) throw new Error("Declaração sem spread/ranking ausente");
console.log("Static product checks passed.");
