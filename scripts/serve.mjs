import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const port = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".pdf": "application/pdf"
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Redireciona /app para /app/
  if (pathname === "/app") {
    res.writeHead(301, { Location: "/app/" });
    return res.end();
  }

  // Redireciona raiz / para /index.html ou /app/ se solicitado
  if (pathname.endsWith("/")) {
    pathname += "index.html";
  }

  const filePath = path.join(publicDir, pathname);

  // Previne directory traversal
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end("Acesso negado");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback para SPA no /app/ se for rota do app
      if (pathname.startsWith("/app/")) {
        const appIndex = path.join(publicDir, "app", "index.html");
        fs.readFile(appIndex, (err2, content) => {
          if (!err2) {
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
            return res.end(content);
          }
          res.writeHead(404);
          return res.end("Não encontrado");
        });
        return;
      }

      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Não encontrado");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-store, must-revalidate"
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`\n========================================`);
  console.log(`  Milet App rodando localmente!`);
  console.log(`  Acesse: http://localhost:${port}/app/`);
  console.log(`========================================\n`);
});
