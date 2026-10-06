// Role: receipts (FUNCTIONS.md F5). A receipt binds a quote to UTF-16 offsets in a landed file at a hash;
//   this check recomputes both, so a quoted claim cannot outlive its source.
// Contract: config `receipts: { files: [path] }`, each a JSON array or a CommonJS module exporting
//   RECEIPTS (the form written by A-Viable-Fork/formalization scripts/receipt.mjs and metacomplexity
//   scripts/map-receipt.mjs). A receipt: { id, file, sha256, start, end, quote, source?, note? }. Fails on a
//   missing field, a duplicate id, a missing file, a hash mismatch, text at the offsets that is not the
//   quote, or a quote that occurs more than once in its file.
//   Composition (F20): a receipt proves a quote is in a file; that the file is the real source is the
//   provenance check's guarantee. So each receipt's file must be listed in a PROVENANCE.json (the
//   provenance check's `manifests` globs, default `**/PROVENANCE.json`), and the check requires provenance
//   to be enabled. `landed: false` drops both, restoring 0.2: a receipt may then point at any file.
// Invariant: read-only. Receipts are written by .infra/tools/receipt.mjs.
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { listFiles, result, sha256 } from "../lib/core.mjs";

export function loadReceipts(root, path) {
  const p = join(root, path);
  if (path.endsWith(".json")) return JSON.parse(readFileSync(p, "utf8"));
  const req = createRequire(join(root, "noop.js"));
  delete req.cache[req.resolve(p)];
  return req(p).RECEIPTS || [];
}

export const requires = (cfg = {}) => (cfg.landed === false ? [] : ["provenance"]);
receipts.requires = requires;

function landedPaths(root, config) {
  const include = config?.checks?.provenance?.manifests || ["**/PROVENANCE.json"];
  const out = new Set();
  for (const m of listFiles(root, { ext: /PROVENANCE\.json$/, include })) {
    try { for (const f of JSON.parse(readFileSync(join(root, m), "utf8")).files || []) if (f.path) out.add(f.path); } catch { /* provenance reports it */ }
  }
  return out;
}

export default function receipts(root, cfg = {}, opts = {}) {
  const fails = []; const ids = new Set(); let n = 0;
  const landed = cfg.landed === false ? null : landedPaths(root, opts.config);
  const texts = new Map();
  for (const path of cfg.files || []) {
    if (!existsSync(join(root, path))) { fails.push(`${path}: receipts file missing`); continue; }
    for (const r of loadReceipts(root, path)) {
      n++;
      const at = `${path}: ${r.id || "(no id)"}`;
      for (const k of ["id", "file", "sha256", "start", "end", "quote"]) if (r[k] === undefined || r[k] === "") fails.push(`${at}: missing ${k}`);
      if (ids.has(r.id)) fails.push(`${at}: duplicate id`); ids.add(r.id);
      if (!r.file || !existsSync(join(root, r.file))) { fails.push(`${at}: landed file ${r.file} missing`); continue; }
      if (landed && !landed.has(r.file)) fails.push(`${at}: ${r.file} is not a landed source (no PROVENANCE.json lists it)`);
      if (!texts.has(r.file)) { const b = readFileSync(join(root, r.file)); texts.set(r.file, { h: sha256(b), t: b.toString("utf8") }); }
      const { h, t } = texts.get(r.file);
      if (h !== r.sha256) fails.push(`${at}: ${r.file} hash changed since the receipt`);
      if (t.slice(r.start, r.end) !== r.quote) fails.push(`${at}: the text at ${r.start}..${r.end} is not the quote`);
      const first = t.indexOf(r.quote);
      if (first >= 0 && t.indexOf(r.quote, first + 1) >= 0) fails.push(`${at}: the quote occurs more than once in ${r.file}`);
    }
  }
  return result("receipts", fails, `${n} receipts in ${(cfg.files || []).length} file(s)${landed ? ", on landed sources" : ", landing not required"}`);
}
