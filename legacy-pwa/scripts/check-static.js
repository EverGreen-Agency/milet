import fs from "node:fs";

const required = ["legacy-pwa/index.html", "legacy-pwa/styles.css", "legacy-pwa/runtime-config.js", "legacy-pwa/manifest.webmanifest", "legacy-pwa/sw.js", "legacy-pwa/src/app.js", "legacy-pwa/src/domain.js", "legacy-pwa/src/fixtures.js", "legacy-pwa/src/demo-adapter.js", "legacy-pwa/src/pwa.js"];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Arquivo obrigatório ausente: ${file}`);
}
const html = fs.readFileSync("legacy-pwa/index.html", "utf8");
const css = fs.readFileSync("legacy-pwa/styles.css", "utf8");
const app = fs.readFileSync("legacy-pwa/src/app.js", "utf8");
for (const marker of ["main", "live-region", "stepper", "theme-toggle", "runtime-status", "install-app"]) {
  if (!html.includes(`id="${marker}"`)) throw new Error(`Marco acessível ausente: ${marker}`);
}
if (!css.includes("prefers-reduced-motion")) throw new Error("Tratamento de movimento reduzido ausente");
if (!css.includes(".mobile-comparison")) throw new Error("Comparação mobile dedicada ausente");
if (!html.includes('rel="manifest"')) throw new Error("Manifesto PWA ausente no HTML");
for (const story of ["US-001", "US-002", "US-003", "US-006", "US-007", "US-008", "US-009", "US-013"]) {
  if (!fs.readFileSync("legacy-pwa/src/domain.js", "utf8").includes(story)) throw new Error(`Rastreabilidade ausente: ${story}`);
}
if (!app.includes("Nenhuma oferta compra posição")) throw new Error("Declaração sem spread/ranking ausente");
console.log("Static product checks passed.");
