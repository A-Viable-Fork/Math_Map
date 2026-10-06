// Role: lands receipts (FUNCTIONS.md F5). Generalizes A-Viable-Fork/formalization scripts/receipt.mjs and
//   metacomplexity scripts/map-receipt.mjs, which are one program in two copies.
// Contract: `node .infra/tools/receipt.mjs --spec SPEC.json --out RECEIPTS.(js|json)`. SPEC is an array of
//   { id, source, file, quote, note }. For each, the quote must occur exactly once in the landed file; the
//   receipt records its UTF-16 offsets and the file's sha256. Any refusal writes nothing. A .js output is a
//   CommonJS module exporting RECEIPTS with a Role header; a .json output is the array.
// Invariant: appends only; never rewrites an existing receipt; ids stay unique.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "../lib/core.mjs";
import { loadReceipts } from "../checks/receipts.mjs";

const root = resolve(join(dirname(fileURLToPath(import.meta.url)), "../.."));
const a = process.argv.slice(2); const arg = (k) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : undefined; };
const spec = arg("spec"), out = arg("out");
if (!spec || !out) { console.log("usage: receipt.mjs --spec SPEC.json --out RECEIPTS.js|json"); process.exit(2); }
const have = existsSync(join(root, out)) ? loadReceipts(root, out) : [];
const ids = new Set(have.map((r) => r.id));
const add = []; let bad = 0;
for (const s of JSON.parse(readFileSync(resolve(spec), "utf8"))) {
  const p = join(root, s.file || "");
  if (!s.id || ids.has(s.id)) { console.log(`refused ${s.id}: missing or duplicate id`); bad++; continue; }
  if (!existsSync(p)) { console.log(`refused ${s.id}: ${s.file} missing`); bad++; continue; }
  const b = readFileSync(p), t = b.toString("utf8");
  const i = t.indexOf(s.quote), j = i < 0 ? -1 : t.indexOf(s.quote, i + 1);
  if (i < 0 || j >= 0) { console.log(`refused ${s.id}: quote occurs ${i < 0 ? "nowhere" : "more than once"} in ${s.file}`); bad++; continue; }
  ids.add(s.id);
  add.push({ id: s.id, source: s.source, file: s.file, sha256: sha256(b), start: i, end: i + s.quote.length, quote: s.quote, note: s.note });
}
if (bad) { console.log(`receipt: ${bad} refused; nothing written`); process.exit(1); }
const all = [...have, ...add];
writeFileSync(join(root, out), out.endsWith(".json") ? JSON.stringify(all, null, 2) + "\n" :
  "// Role: receipts. Each binds a quote at UTF-16 offsets in a hashed landed source.\n" +
  "// Contract: exports RECEIPTS. Written by .infra/tools/receipt.mjs; checked by the kit's receipts check.\n" +
  "\"use strict\";\n\nconst RECEIPTS = " + JSON.stringify(all, null, 2) + ";\n\nmodule.exports = { RECEIPTS };\n");
console.log(`receipt: landed ${add.length}`);
