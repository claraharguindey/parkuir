const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const url     = require('url');

const PORT      = 3000;
const DATA_FILE = path.join(__dirname, 'liga.json');
const MAX       = 100;

// ── HELPERS ──────────────────────────────────────────────
function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return []; }
}
function writeData(arr) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath) {
  const ext  = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.woff2':'font/woff2',
    '.json': 'application/json',
  }[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

// ── SERVER ───────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsed  = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') { send(res, 200, {}); return; }

  // ── API ──────────────────────────────────────────────
  // GET /api/liga — devuelve todas las camisetas
  if (req.method === 'GET' && pathname === '/api/liga') {
    send(res, 200, readData());
    return;
  }

  // POST /api/liga — guarda una camiseta nueva
  if (req.method === 'POST' && pathname === '/api/liga') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const item = JSON.parse(body);
        if (!item.img || !item.title) { send(res, 400, { error: 'Faltan campos' }); return; }
        const data = readData();
        if (data.length >= MAX) data.pop(); // eliminar el más antiguo si hay 100
        const entry = {
          id:    Date.now(),
          title: item.title,
          desc:  item.desc || '',
          img:   item.img,        // base64 PNG
          date:  new Date().toISOString(),
        };
        data.unshift(entry);      // más reciente primero
        writeData(data);
        send(res, 201, entry);
      } catch (e) {
        send(res, 400, { error: 'JSON inválido' });
      }
    });
    return;
  }

  // DELETE /api/liga/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/liga/')) {
    const id = parseInt(pathname.split('/').pop());
    const data = readData().filter(d => d.id !== id);
    writeData(data);
    send(res, 200, { ok: true });
    return;
  }

  // ── ARCHIVOS ESTÁTICOS ──────────────────────────────
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  // Evitar salir del directorio
  if (!filePath.startsWith(__dirname)) { res.writeHead(403); res.end(); return; }
  serveFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Parkuir corriendo en http://localhost:${PORT}`);
  console.log(`Liga guardada en ${DATA_FILE}`);
});