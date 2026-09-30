// Role: the Lean layer's gate. Checks the registry (mapfill/lean.js) against the Lean project (lean/) and its
//   audit (lean/AUDIT.json).
// Contract: `node scripts/lean.mjs --audit` (needs Lean: lean/ built with `lake build`) runs `#print axioms`
//   and `#mathmap_deps` on every registered declaration and writes lean/AUDIT.json: each declaration's
//   axioms, status (proved: only propext, Classical.choice, Quot.sound; stated: sorryAx) and the MathMap
//   definitions its statement depends on, with a hash of the Lean sources. `--audit --verify` (CI) regenerates
//   it and fails if it differs from the committed one. `--check` (default; offline) fails if the audit is
//   stale (the sources changed since), if a registered declaration is missing from it or rests on another
//   axiom, if a claim's statement depends on an unreceipted MathMap definition, if a receipt's quote is not in
//   its file, if a claim names an unknown entry, field or invariant, or if the Lean project pins a Mathlib
//   other than mapfill/formal.js. Exports audit() and status().
// Invariant: read-only except for lean/AUDIT.json. Status comes from Lean, never from the registry.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEAN = join(ROOT, "lean"), AUDIT = join(LEAN, "AUDIT.json");
const require = createRequire(import.meta.url);
const { DEFS, CLAIMS } = require("../mapfill/lean.js");
const FIELDS = ["description", "input", "output", "preserved", "broken"];
const MATCHES = ["exact", "general", "special", "refutes-landed"];
const STANDARD = new Set(["propext", "Classical.choice", "Quot.sound"]);

function sources() {
  const files = ["lakefile.toml", "lean-toolchain", "lake-manifest.json", "MathMap.lean", ...readdirSync(join(LEAN, "MathMap")).filter((f) => f.endsWith(".lean")).sort().map((f) => `MathMap/${f}`)];
  const h = createHash("sha256");
  for (const f of files) h.update(`${f}\n`).update(readFileSync(join(LEAN, f)));
  return h.digest("hex");
}

export function audit() {
  const decls = [...new Set([...DEFS, ...CLAIMS].map((x) => x.decl))];
  const dir = mkdtempSync(join(tmpdir(), "mathmap-audit-")), file = join(dir, "Audit.lean");
  writeFileSync(file, ["import MathMap", ...decls.flatMap((d) => [`#print axioms ${d}`, `#mathmap_deps ${d}`])].join("\n") + "\n");
  let out;
  try { out = execFileSync("lake", ["env", "lean", file], { cwd: LEAN, maxBuffer: 1 << 26 }).toString(); }
  catch (e) { out = (e.stdout?.toString() ?? "") + (e.stderr?.toString() ?? ""); rmSync(dir, { recursive: true, force: true }); throw new Error(`lean failed:\n${out}`); }
  rmSync(dir, { recursive: true, force: true });
  const flat = out.replace(/\s+/g, " "), result = {};
  for (const d of decls) {
    const esc = d.replace(/\./g, "\\.");
    const ax = flat.match(new RegExp(`'${esc}' depends on axioms: \\[([^\\]]*)\\]`)), none = flat.includes(`'${d}' does not depend on any axioms`);
    const dep = flat.match(new RegExp(`MMDEPS ${esc}: ((?:MathMap\\.[^\\s']+ ?)*)`));
    if (!ax && !none) throw new Error(`no axioms reported for ${d}`);
    const axioms = ax ? ax[1].split(",").map((s) => s.trim()).filter(Boolean) : [];
    const status = axioms.includes("sorryAx") ? "stated" : axioms.every((a) => STANDARD.has(a)) ? "proved" : "axiom";
    result[d] = { status, axioms, deps: dep ? dep[1].trim().split(" ").filter((x) => x && x !== d) : [] };
  }
  const manifest = JSON.parse(readFileSync(join(LEAN, "lake-manifest.json"), "utf8"));
  return { toolchain: readFileSync(join(LEAN, "lean-toolchain"), "utf8").trim(), mathlib: manifest.packages.find((p) => p.name === "mathlib")?.rev, sources: sources(), decls: result };
}

export function status() { return existsSync(AUDIT) ? JSON.parse(readFileSync(AUDIT, "utf8")) : null; }

export function check(entries, vocabulary) {
  const F = [], A = status();
  if (!A) return ["lean/AUDIT.json is missing: run node scripts/lean.mjs --audit"];
  if (A.sources !== sources()) F.push("lean/AUDIT.json is stale (the Lean sources changed): run lake build and node scripts/lean.mjs --audit");
  const { MATHLIB } = require("../mapfill/formal.js");
  if (A.mathlib !== MATHLIB.commit) F.push(`the Lean project pins Mathlib ${A.mathlib}, the formal layer ${MATHLIB.commit}`);
  const ids = new Set(entries.map((e) => e.id)), invs = new Set(vocabulary.INVARIANTS.map((v) => v.id));
  const defs = new Set(DEFS.map((d) => d.decl)), claims = new Set(CLAIMS.map((c) => c.decl));
  const inFile = (r) => { if (!/^(excerpts|source)\//.test(r.file)) return `receipt must point into excerpts/ or source/`; let t = ""; try { t = readFileSync(join(ROOT, r.file), "utf8"); } catch { return `missing receipt file ${r.file}`; } const n = (x) => x.replace(/\s+/g, " "); return n(t).includes(n(r.quote)) ? null : `receipt quote not in ${r.file}: "${r.quote.slice(0, 50)}"`; };
  for (const d of DEFS) {
    if (!d.note) F.push(`lean def ${d.decl}: needs a note`);
    if (!(d.receipts || []).length) F.push(`lean def ${d.decl}: needs receipts`);
    for (const r of d.receipts || []) { const m = inFile(r); if (m) F.push(`lean def ${d.decl}: ${m}`); }
  }
  for (const x of [...DEFS, ...CLAIMS]) {
    const a = A.decls[x.decl];
    if (!a) { F.push(`${x.decl}: not in lean/AUDIT.json (run --audit)`); continue; }
    if (a.status === "axiom") F.push(`${x.decl}: rests on axioms beyond the standard three: ${a.axioms.join(", ")}`);
    for (const dep of a.deps) if (!defs.has(dep) && !claims.has(dep)) F.push(`${x.decl}: depends on ${dep}, which is neither a receipted definition nor a claim`);
  }
  for (const c of CLAIMS) {
    const at = `lean claim ${c.entry} ${c.decl}`;
    if (!ids.has(c.entry)) F.push(`${at}: no such entry`);
    if (!FIELDS.includes(c.field)) F.push(`${at}: field must be one of ${FIELDS.join(", ")}`);
    if (!MATCHES.includes(c.match)) F.push(`${at}: match must be one of ${MATCHES.join(", ")}`);
    if (c.invariant && !invs.has(c.invariant)) F.push(`${at}: unknown invariant ${c.invariant}`);
    if (c.whole && c.match !== "exact") F.push(`${at}: only an exact claim can state the whole field`);
    if (!c.note) F.push(`${at}: needs a note`);
    if (c.match === "refutes-landed" && !entries.find((e) => e.id === c.entry)?.corrected?.includes(c.field)) F.push(`${at}: refutes the landed ${c.field}, which is not corrected`);
  }
  return F;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  if (a.includes("--audit")) {
    const fresh = audit();
    if (a.includes("--verify")) {
      const old = status(), same = old && JSON.stringify(old) === JSON.stringify(fresh);
      if (!same) { console.log("FAIL lean/AUDIT.json differs from a fresh audit: run node scripts/lean.mjs --audit and commit it"); process.exit(1); }
      console.log(`lean: audit verified (${Object.keys(fresh.decls).length} declarations)`);
    } else { writeFileSync(AUDIT, JSON.stringify(fresh, null, 1) + "\n"); console.log(`lean: wrote lean/AUDIT.json (${Object.keys(fresh.decls).length} declarations)`); }
  } else {
    const { parse } = await import("./mathmap.mjs");
    const P = parse(), F = check(P.entries, P.vocabulary), A = status();
    for (const f of F) console.log("FAIL", f);
    if (F.length) { console.log(`lean: ${F.length} failure(s)`); process.exit(1); }
    const n = (s) => CLAIMS.filter((c) => A.decls[c.decl].status === s).length;
    console.log(`lean: PASS (${CLAIMS.length} claims on ${new Set(CLAIMS.map((c) => c.entry)).size} entries, ${n("proved")} proved, ${n("stated")} stated; ${DEFS.length} receipted definitions)`);
  }
}
