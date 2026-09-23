import { localize } from './localize.mjs';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const directory = process.argv.slice(2).find((arg, index, args) => !arg.startsWith('-') && args[index - 1] !== '--port');
const root = path.resolve(directory || '.');
if (root === path.resolve('.')) await localize();
const portArg = process.argv.indexOf('--port');
const port = Number(process.env.PORT || (portArg >= 0 ? process.argv[portArg + 1] : 5173));
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (/^\/(pl|uk|en|ru)$/.test(pathname)) { res.writeHead(301, { Location: pathname + '/' }); res.end(); return; }
    let file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    let data;
    try { data = await readFile(file); }
    catch { if (root === path.resolve('.')) { file = path.join(root, 'public', pathname); data = await readFile(file); } else throw new Error('Not found'); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`LUMERASTONE: http://localhost:${port}`));
