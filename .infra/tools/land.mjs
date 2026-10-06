// Role: lands a source verbatim: fetches it, writes it unmodified, and records it in the provenance
//   manifest beside it.
// Contract: `node .infra/tools/land.mjs --url URL --to PATH --work "..." --rights "..." [--edition "..."]`.
//   PATH is relative to the repository root; the manifest is PROVENANCE.json in PATH's directory (created
//   if absent). Refuses to overwrite an existing file or a listed path.
// Invariant: the fetched bytes are written as received; nothing is normalized.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../lib/core.mjs";

const root = resolve(join(dirname(fileURLToPath(import.meta.url)), "../.."));
const a = process.argv.slice(2); const arg = (k) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : undefined; };
const [url, to, work, rights] = ["url", "to", "work", "rights"].map(arg);
if (!url || !to || !work || !rights) { console.log("usage: land.mjs --url URL --to PATH --work TEXT --rights TEXT [--edition TEXT]"); process.exit(1); }
const fp = join(root, to);
if (existsSync(fp)) { console.log(`${to} exists; landed files are never overwritten.`); process.exit(1); }
const r = await fetch(url); if (!r.ok) { console.log(`fetch failed: ${r.status}`); process.exit(1); }
const b = Buffer.from(await r.arrayBuffer());
mkdirSync(dirname(fp), { recursive: true }); writeFileSync(fp, b);
const mp = join(root, posix.dirname(to), "PROVENANCE.json");
const m = existsSync(mp) ? JSON.parse(readFileSync(mp, "utf8")) : { files: [] };
if (m.files.some((f) => f.path === to)) { console.log(`${to} already listed.`); process.exit(1); }
m.files.push({ path: to, work, edition: arg("edition"), url, fetched: new Date().toISOString().slice(0, 10), sha256: sha256(b), rights });
writeFileSync(mp, JSON.stringify(m, null, 2) + "\n");
console.log(`landed ${to} (${b.length} bytes, sha256 ${sha256(b).slice(0, 12)})`);
