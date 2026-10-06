// Role: writes the audit the lean-audit check verifies (FUNCTIONS.md F21): runs `#print axioms` on each
//   declaration through the project's own toolchain and records each one's axioms and status, with the hash
//   of the Lean sources it was taken from.
// Contract: `node .infra/tools/lean-audit.mjs [--root DIR] [--decls a,b,...]`, run where Lean is installed
//   (CI). Reads `checks.lean-audit` from infra.json (project, audit, sources, declarations, and `imports`:
//   the modules the generated file imports, default ["Main"]); --decls adds names. Writes the audit file;
//   exits 1 when Lean fails or reports nothing for a declaration.
// Invariant: writes only the audit file and a temporary .lean file it removes.
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { loadConfig } from "../lib/core.mjs";
import { sourcesHash, parseAxioms } from "../lib/lean.mjs";

const a = process.argv.slice(2), arg = (k) => { const i = a.indexOf(`--${k}`); return i >= 0 ? a[i + 1] : undefined; };
const root = resolve(arg("root") || ".");
const cfg = (loadConfig(root).checks || {})["lean-audit"] || {};
if (!cfg.project || !cfg.audit || !cfg.sources) { console.log("infra.json checks.lean-audit needs project, audit and sources"); process.exit(1); }
const decls = [...new Set([...(cfg.declarations || []), ...(arg("decls") ? arg("decls").split(",") : [])])];
if (!decls.length) { console.log("no declarations to audit: list them in checks.lean-audit.declarations or pass --decls"); process.exit(1); }
const project = join(root, cfg.project);
const dir = mkdtempSync(join(tmpdir(), "infra-lean-audit-")), file = join(dir, "Audit.lean");
writeFileSync(file, [...(cfg.imports || ["Main"]).map((m) => `import ${m}`), ...decls.map((d) => `#print axioms ${d}`)].join("\n") + "\n");
let out;
try { out = execFileSync("lake", ["env", "lean", file], { cwd: project, maxBuffer: 1 << 26 }).toString(); }
catch (e) { console.log(`lean failed: ${(e.stdout || "").toString()}${(e.stderr || "").toString()}`.slice(0, 2000)); process.exit(1); }
finally { rmSync(dir, { recursive: true, force: true }); }
let parsed;
try { parsed = parseAxioms(out, decls); } catch (e) { console.log(e.message); process.exit(1); }
const audit = { sources: sourcesHash(project, cfg.sources), decls: parsed };
writeFileSync(join(root, cfg.audit), JSON.stringify(audit, null, 2) + "\n");
const n = (s) => Object.values(parsed).filter((x) => x.status === s).length;
console.log(`wrote ${cfg.audit}: ${decls.length} declarations, ${n("proved")} proved, ${n("stated")} stated, ${n("axiom")} on other axioms`);
