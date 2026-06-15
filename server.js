const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3000;
const DATA_FILE = "/app/data/liga.json";
if (!fs.existsSync("/app/data")) fs.mkdirSync("/app/data", { recursive: true });
const MAX = 100;

// ── HELPERS ──────────────────────────────────────────────
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}
function writeData(arr) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime =
    {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".woff2": "font/woff2",
      ".json": "application/json",
    }[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(__dirname, "404.html"), (err2, page404) => {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(err2 ? "Not found" : page404);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
}

// ── SERVER ───────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (req.method === "OPTIONS") {
    send(res, 200, {});
    return;
  }

  // GET /api/liga
  if (req.method === "GET" && pathname === "/api/liga") {
    send(res, 200, readData());
    return;
  }

  // POST /api/liga — guarda userId con la entrada
  if (req.method === "POST" && pathname === "/api/liga") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const item = JSON.parse(body);
        if (!item.img || !item.title) {
          send(res, 400, { error: "Faltan campos" });
          return;
        }
        const data = readData();
        if (data.length >= MAX) data.pop();
        const entry = {
          id: Date.now(),
          title: item.title,
          desc: item.desc || "",
          img: item.img,
          date: new Date().toISOString(),
          userId: item.userId || null, // ← guardamos el userId
        };
        data.unshift(entry);
        writeData(data);
        // devolvemos la entrada sin userId para no exponerlo
        const { userId: _, ...publicEntry } = entry;
        send(res, 201, publicEntry);
      } catch (e) {
        send(res, 400, { error: "JSON inválido" });
      }
    });
    return;
  }

  // DELETE /api/liga/:id — solo si el userId coincide
  if (req.method === "DELETE" && pathname.startsWith("/api/liga/")) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const id = parseInt(pathname.split("/").pop());
      const data = readData();
      const entry = data.find((d) => d.id === id);

      if (!entry) {
        send(res, 404, { error: "No encontrado" });
        return;
      }

      let userId = null;
      try {
        userId = JSON.parse(body).userId;
      } catch {}

      // si la entrada tiene userId y no coincide → prohibido
      if (entry.userId && entry.userId !== userId) {
        send(res, 403, { error: "No puedes borrar una equipación que no es tuya" });
        return;
      }

      writeData(data.filter((d) => d.id !== id));
      send(res, 200, { ok: true });
    });
    return;
  }

  // ── ARCHIVOS ESTÁTICOS ──────────────────────────────
  let filePath = path.join(
    __dirname,
    pathname === "/" ? "index.html" : pathname,
  );
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end();
    return;
  }
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Parkuir corriendo en http://localhost:${PORT}`);
  console.log(`Liga guardada en ${DATA_FILE}`);
});