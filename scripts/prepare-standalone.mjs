/**
 * Prépare .next/standalone pour PM2 :
 * - copie public/ → .next/standalone/public
 * - copie .next/static → .next/standalone/.next/static
 * - valide server.js + public + static
 *
 * Usage : node scripts/prepare-standalone.mjs
 * (appelé aussi par npm run build:standalone)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standalone = path.join(root, ".next", "standalone");
const staticSrc = path.join(root, ".next", "static");
const publicSrc = path.join(root, "public");
const serverJs = path.join(standalone, "server.js");

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else if (entry.isFile()) fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(serverJs)) {
  console.error("ERREUR: .next/standalone/server.js introuvable. Lancez npm run build.");
  process.exit(1);
}
if (!fs.existsSync(staticSrc)) {
  console.error("ERREUR: .next/static introuvable.");
  process.exit(1);
}
if (!fs.existsSync(publicSrc)) {
  console.error("ERREUR: public/ introuvable.");
  process.exit(1);
}

const staticDest = path.join(standalone, ".next", "static");
const publicDest = path.join(standalone, "public");

fs.rmSync(staticDest, { recursive: true, force: true });
fs.rmSync(publicDest, { recursive: true, force: true });
copyDir(staticSrc, staticDest);
copyDir(publicSrc, publicDest);

// Ne jamais embarquer un .env local dans le runtime standalone.
for (const name of [".env", ".env.local", ".env.production", ".env.development"]) {
  const p = path.join(standalone, name);
  if (fs.existsSync(p)) fs.rmSync(p, { force: true });
}

if (!fs.existsSync(serverJs)) {
  console.error("ERREUR: validation server.js échouée.");
  process.exit(1);
}
if (!fs.existsSync(staticDest)) {
  console.error("ERREUR: validation .next/static échouée.");
  process.exit(1);
}
if (!fs.existsSync(publicDest)) {
  console.error("ERREUR: validation public échouée.");
  process.exit(1);
}

console.log("STANDALONE_READY");
console.log(`server.js → ${serverJs}`);
console.log(`static → ${staticDest}`);
console.log(`public → ${publicDest}`);
