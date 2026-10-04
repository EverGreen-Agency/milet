import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "public");
const siteDirectories = ["app", "assets", "brandbook-web", "tokens", "openapi", "schemas"];
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

for (const directory of siteDirectories) {
  const source = path.join(root, directory);
  if (!fs.existsSync(source)) throw new Error(`Diretorio publico ausente: ${directory}`);
  copied += copyDirectory(source, path.join(output, directory));
}

for (const required of [
  "index.html",
  "demo.html",
  "app/index.html",
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
