// Role: shared plumbing for the proof-assistant audit (FUNCTIONS.md F21): the hash of a Lean project's
//   sources, the status a declaration's axioms earn, and the parse of Lean's `#print axioms` output.
// Contract: sourcesHash(dir, patterns) hashes the files the patterns match under dir, in pattern order and
//   sorted within each pattern, each as `${path}\n` followed by its bytes (the scheme of
//   A-Viable-Fork/Math_Map scripts/lean.mjs, so its committed lean/AUDIT.json verifies unchanged).
//   statusOf(axioms) is "stated" when sorryAx appears, "proved" when only the standard three do, else
//   "axiom". parseAxioms(output, decls) returns { decl: { status, axioms } } or throws naming a declaration
//   Lean reported nothing for.
// Invariant: reads only; no Lean needed.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { glob } from "./core.mjs";

export const STANDARD = ["propext", "Classical.choice", "Quot.sound"];

const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? (n === ".lake" ? [] : walk(p)) : [p]; });

export function sourceFiles(dir, patterns) {
  const all = existsSync(dir) ? walk(dir).map((p) => relative(dir, p).split("\\").join("/")) : [];
  const seen = new Set(), out = [];
  for (const pat of patterns) {
    const re = glob(pat);
    for (const f of all.filter((x) => re.test(x)).sort()) if (!seen.has(f)) { seen.add(f); out.push(f); }
  }
  return out;
}

export function sourcesHash(dir, patterns) {
  const h = createHash("sha256");
  for (const f of sourceFiles(dir, patterns)) h.update(`${f}\n`).update(readFileSync(join(dir, f)));
  return h.digest("hex");
}

export const statusOf = (axioms) => (axioms.includes("sorryAx") ? "stated" : axioms.every((a) => STANDARD.includes(a)) ? "proved" : "axiom");

export function parseAxioms(output, decls) {
  const flat = output.replace(/\s+/g, " "), res = {};
  for (const d of decls) {
    const esc = d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const ax = flat.match(new RegExp(`'${esc}' depends on axioms: \\[([^\\]]*)\\]`));
    const none = flat.includes(`'${d}' does not depend on any axioms`);
    if (!ax && !none) throw new Error(`Lean reported no axioms for ${d}`);
    const axioms = ax ? ax[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
    res[d] = { status: statusOf(axioms), axioms };
  }
  return res;
}
