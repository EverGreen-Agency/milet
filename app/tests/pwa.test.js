import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("manifest makes the existing mobile web app installable", () => {
  const manifest = JSON.parse(fs.readFileSync("app/manifest.webmanifest", "utf8"));
  assert.equal(manifest.id, "/app/");
  assert.equal(manifest.start_url, "/app/");
  assert.equal(manifest.scope, "/app/");
  assert.equal(manifest.display, "standalone");
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ["192x192", "512x512"]);
  for (const icon of manifest.icons) {
    const iconPath = path.resolve("app", icon.src);
    assert.ok(fs.existsSync(iconPath), `ícone PWA ausente: ${icon.src}`);
  }
});

test("service worker keeps the shell offline and never caches API responses", () => {
  const worker = fs.readFileSync("app/sw.js", "utf8");
  for (const asset of ["./index.html", "./runtime-config.js", "./src/app.js", "./src/fixtures.js"]) {
    assert.ok(worker.includes(`"${asset}"`), `app shell ausente: ${asset}`);
  }
  assert.match(worker, /url\.pathname\.startsWith\("\/api\/"\)/);
  assert.match(worker, /event\.respondWith\(fetch\(request\)\)/);
  assert.doesNotMatch(worker, /cache\.put\(request/);
});
