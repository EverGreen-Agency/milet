import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "public");
const siteDirectories = ["app", "assets", "brandbook-web", "tokens"];
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

for (const required of ["index.html", "demo.html", "app/index.html", "roadmap.html", "build-in-public.html"]) {
  if (!fs.existsSync(path.join(output, required))) {
    throw new Error(`Saida publica obrigatoria ausente: ${required}`);
  }
}

console.log(`Static site built in public/ (${copied} files).`);
