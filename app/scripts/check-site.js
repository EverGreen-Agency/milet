import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "node_modules", "graphify-out", "public", "dist"]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const jsonFiles = files.filter((file) => file.endsWith(".json"));
const errors = [];

for (const file of jsonFiles) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${path.relative(root, file)}: JSON inválido (${error.message})`);
  }
}

function resolveLocalTarget(htmlFile, rawTarget) {
  const [withoutHash] = rawTarget.split("#", 1);
  const withoutQuery = withoutHash.split("?", 1)[0];
  if (!withoutQuery) return null;
  const decoded = decodeURIComponent(withoutQuery);
  const relativeTarget = decoded.startsWith("/") ? decoded.slice(1) : path.join(path.relative(root, path.dirname(htmlFile)), decoded);
  const normalized = path.normalize(relativeTarget);
  const candidates = [normalized];
  if (!path.extname(normalized)) {
    candidates.push(`${normalized}.html`, path.join(normalized, "index.html"));
  }
  if (normalized.endsWith(path.sep) || normalized === ".") candidates.push(path.join(normalized, "index.html"));
  return candidates.map((candidate) => path.resolve(root, candidate));
}

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const html = fs.readFileSync(file, "utf8");
  for (const marker of ["<!doctype html", "<html", "<head", "<title", "<body", "</body>", "</html>"]) {
    if (!html.toLowerCase().includes(marker)) errors.push(`${relative}: marcador HTML ausente: ${marker}`);
  }
  if (/^\s*(?:<<<<<<< .+|=======|>>>>>>> .+)\s*$/m.test(html)) errors.push(`${relative}: marcador de conflito encontrado`);

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of new Set(duplicates)) errors.push(`${relative}: id duplicado: ${id}`);

  const references = [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const target of references) {
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(target)) continue;
    const candidates = resolveLocalTarget(file, target);
    if (candidates && !candidates.some((candidate) => fs.existsSync(candidate))) {
      errors.push(`${relative}: referência local ausente: ${target}`);
    }
  }
}

if (errors.length) {
  throw new Error(`Falhas de integridade do site:\n- ${errors.join("\n- ")}`);
}

console.log(`Site checks passed: ${htmlFiles.length} HTML, ${jsonFiles.length} JSON, links locais válidos.`);
