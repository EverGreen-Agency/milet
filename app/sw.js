const CACHE_NAME = "milet-app-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./runtime-config.js",
  "./manifest.webmanifest",
  "./src/app.js",
  "./src/domain.js",
  "./src/fixtures.js",
  "./src/demo-adapter.js",
  "./src/pwa.js",
  "../tokens/tokens.css",
  "../assets/logo/svg/milet-logo-horizontal-light.svg",
  "../assets/logo/png/solid/app-icon-192x192.png",
  "../assets/logo/png/solid/app-icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate" && url.pathname.startsWith("/app/")) {
    event.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached ?? fetch(request)));
});
