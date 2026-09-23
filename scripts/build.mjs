import { localize } from './localize.mjs';
import { mkdir, cp, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['style.css', 'app.js']) await cp(file, `dist/${file}`);
await cp('public', 'dist', { recursive: true });
await localize('dist');
console.log('Built static website in dist/');
