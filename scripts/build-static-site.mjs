import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "public");
const siteDirectories = [
  { source: "legacy-pwa", destination: "app" },
  { source: "assets", destination: "assets" },
  { source: "brandbook-web", destination: "brandbook-web" },
  { source: "tokens", destination: "tokens" },
  { source: "openapi", destination: "openapi" },
  { source: "schemas", destination: "schemas" },
  { source: "v2", destination: "v2" },
];
const deployableExtensions = new Set([
  ".css",
  ".gif",
  ".html",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".json",
  ".png",
  ".svg",
  ".webmanifest",
  ".webp",
]);

function copyDeployableFile(source, destination) {
  if (!deployableExtensions.has(path.extname(source).toLowerCase())) return 0;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  return 1;
}

function copyDirectory(source, destination) {
  let copied = 0;
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (["scripts", "tests"].includes(entry.name)) continue;
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    copied += entry.isDirectory()
      ? copyDirectory(sourcePath, destinationPath)
      : copyDeployableFile(sourcePath, destinationPath);
  }
  return copied;
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

let copied = 0;
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  copied += copyDeployableFile(path.join(root, entry.name), path.join(output, entry.name));
}

for (const entry of siteDirectories) {
  const source = path.join(root, entry.source);
  if (!fs.existsSync(source)) throw new Error(`Diretorio publico ausente: ${entry.source}`);
  copied += copyDirectory(source, path.join(output, entry.destination));
}

for (const required of [
  "index.html",
  "brandbook.html",
  "home.css",
  "demo.html",
  "app/index.html",
  "app/manifest.webmanifest",
  "app/sw.js",
  "v2/index.html",
  "roadmap.html",
  "build-in-public.html",
  "openapi/v1/openapi.json",
  "schemas/v1/synthetic-case.schema.json",
]) {
  if (!fs.existsSync(path.join(output, required))) {
    throw new Error(`Saida publica obrigatoria ausente: ${required}`);
  }
}

const openapiPath = path.join(output, "openapi", "v1", "openapi.json");
const openapi = fs.readFileSync(openapiPath, "utf8");
const schemaReferences = openapi.match(/\.\.\/\.\.\/schemas\/v1\/[^\"]+/g) ?? [];
for (const reference of schemaReferences) {
  const resolved = path.resolve(path.dirname(openapiPath), reference);
  if (!fs.existsSync(resolved)) throw new Error(`Schema referenciado ausente na saida publica: ${reference}`);
}

console.log(`Static site built in public/ (${copied} files).`);
