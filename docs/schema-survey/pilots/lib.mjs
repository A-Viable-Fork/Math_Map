// Role: shared helpers for the schema-survey pilots: loads map.json, verifies a row's receipt, and gives a
//   seeded random source. Throwaway code for docs/schema-survey; no map script imports it.
// Contract: exports ROOT, map(), entry(id), verify(receipt) returning { ok, kind, why }, rng(seed), tally(rows).
//   Receipt kinds: { excerpt: file, quote } (a window in excerpts/ or docs/schema-survey/excerpts/),
//   { field: [entryId, fieldName], quote } (a substring of that entry's field in map.json, the entry's own
//   words), { formal: [entryId, decl] } (a Mathlib link or Lean claim the map already records on that entry),
//   { computed: note } (the pilot script recomputes it on every run), { external: citation } (a file in
//   another repository at a commit: cited, not checkable from here), { none: reason }.
// Invariant: read-only. A receipt that verifies shows the quoted words are where the row says; whether they
//   support the row is the reader's judgment, as with every receipt in the map.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, "..", "..", "..");
let M = null;
export const map = () => (M ??= JSON.parse(readFileSync(join(ROOT, "map.json"), "utf8")));
let BY = null;
export const entry = (id) => (BY ??= new Map(map().entries.map((e) => [e.id, e]))).get(id);

export function verify(r) {
  if (!r) return { ok: false, kind: "none", why: "no receipt" };
  if (r.excerpt) {
    const p = [join(ROOT, r.excerpt), join(ROOT, "excerpts", r.excerpt), join(HERE, "..", "excerpts", r.excerpt)].find(existsSync);
    if (!p) return { ok: false, kind: "excerpt", why: `no file ${r.excerpt}` };
    return { ok: readFileSync(p, "utf8").includes(r.quote), kind: "excerpt", why: r.quote ? "" : "no quote" };
  }
  if (r.field) {
    const e = entry(r.field[0]); const t = e?.[r.field[1]];
    const s = typeof t === "string" ? t : JSON.stringify(t ?? "");
    return { ok: !!e && s.includes(r.quote), kind: "field", why: e ? "" : `no entry ${r.field[0]}` };
  }
  if (r.formal) {
    const e = entry(r.formal[0]);
    const ok = !!e && [...(e.formal ?? []), ...(e.lean ?? [])].some((k) => k.decl === r.formal[1] || k.twin === r.formal[1]);
    return { ok, kind: "formal", why: ok ? "" : `no link ${r.formal[1]} on ${r.formal[0]}` };
  }
  if (r.computed) return { ok: true, kind: "computed", why: "" };
  if (r.external) return { ok: false, kind: "external", why: "cited at a commit in another repository; not checkable here" };
  return { ok: false, kind: "none", why: r.none ?? "no receipt" };
}

// mulberry32, as scripts/audit.mjs uses.
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Counts rows by receipt kind and by whether the receipt verified.
export function tally(rows, get = (x) => x.receipt) {
  const t = { rows: rows.length, verified: 0, byKind: {} };
  const bad = [];
  for (const x of rows) {
    const v = verify(get(x));
    t.byKind[v.kind] ??= { rows: 0, verified: 0 };
    t.byKind[v.kind].rows++;
    if (v.ok) { t.verified++; t.byKind[v.kind].verified++; } else bad.push({ row: x.id ?? JSON.stringify(x).slice(0, 60), ...v });
  }
  return { ...t, bad };
}
