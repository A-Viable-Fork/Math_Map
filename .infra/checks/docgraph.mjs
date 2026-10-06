// Role: the document graph (FUNCTIONS.md F10). Documents carry a typed front-matter header, and every
//   dependency is declared from both ends, so a document that others rely on cannot change unnoticed.
// Contract: config `docgraph: { include: [globs], exclude: [globs], fields: [...], types: [...] }`.
//   Default include `docs/**/*.md`; default fields Type, Purpose, Depends on, Depended on by. Each
//   included document must have the header with every field (types, when given, limits Type). Each
//   "Depends on" target must exist; when the target is an included document, it must list this one under
//   "Depended on by", and the reverse. Targets outside the included set (a trellis, a README) need only
//   exist. Paths are relative to the repository root. After A-Viable-Fork/epitrellis
//   scripts/verify-docs.py and epistack build/check-docs.mjs.
// Invariant: read-only.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { listFiles, read, result } from "../lib/core.mjs";
import { frontMatter } from "../lib/headers.mjs";

const FIELDS = ["Type", "Purpose", "Depends on", "Depended on by"];
const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);
export default function docgraph(root, cfg = {}) {
  const docs = listFiles(root, { ext: /\.md$/, include: cfg.include || ["docs/**/*.md"], exclude: cfg.exclude || [] });
  const fields = cfg.fields || FIELDS;
  const fails = [], H = new Map();
  for (const d of docs) {
    const fm = frontMatter(read(root, d));
    if (!fm) { fails.push(`${d}: no front-matter header`); continue; }
    for (const f of fields) if (!(f in fm.fields)) fails.push(`${d}: header lacks "${f}"`);
    if (cfg.types && fm.fields.Type && !cfg.types.includes(fm.fields.Type)) fails.push(`${d}: Type "${fm.fields.Type}" not in ${cfg.types.join(", ")}`);
    H.set(d, { on: list(fm.fields["Depends on"]), by: list(fm.fields["Depended on by"]) });
  }
  let edges = 0;
  for (const [d, h] of H) {
    for (const t of h.on) {
      edges++;
      if (!existsSync(join(root, t))) fails.push(`${d}: depends on ${t}, which does not exist`);
      else if (H.has(t) && !H.get(t).by.includes(d)) fails.push(`${d}: depends on ${t}, which does not list it under "Depended on by"`);
    }
    for (const s of h.by) {
      if (!existsSync(join(root, s))) fails.push(`${d}: depended on by ${s}, which does not exist`);
      else if (H.has(s) && !H.get(s).on.includes(d)) fails.push(`${d}: claims ${s} depends on it, but ${s} does not say so`);
    }
  }
  return result("docgraph", fails, `${docs.length} documents, ${H.size} with headers, ${edges} dependency edges`);
}
