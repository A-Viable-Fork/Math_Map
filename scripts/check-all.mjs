// Role: the gate. Runs every check of the map and fails if any fails.
// Contract: `node scripts/check-all.mjs`. CI runs exactly this. Exit 1 on any failure.
// Invariant: read-only. Reports are checked for freshness by rendering into a scratch copy of the tree.
import { execFileSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECKS = [["scripts/mathmap.mjs", "--check"], ["scripts/audit.mjs", "--check"], ["scripts/build.mjs", "--check"]];
const REPORTS = [["scripts/mathmap.mjs", "reports/MATHMAP.md"], ["scripts/audit.mjs", "reports/AUDIT.md"]];
let fail = 0;
for (const [s, ...a] of CHECKS) {
  try { process.stdout.write(execFileSync("node", [join(ROOT, s), ...a], { cwd: ROOT }).toString()); }
  catch (e) { process.stdout.write(e.stdout?.toString() ?? ""); console.log(`FAIL ${s}`); fail++; }
}
const tmp = mkdtempSync(join(tmpdir(), "math-map-"));
try {
  for (const d of ["source", "mapfill", "audit", "excerpts", "scripts", "reports"]) cpSync(join(ROOT, d), join(tmp, d), { recursive: true });
  for (const [s, r] of REPORTS) {
    try { execFileSync("node", [join(tmp, s)], { cwd: tmp }); } catch { console.log(`FAIL ${s} did not render`); fail++; continue; }
    if (readFileSync(join(tmp, r), "utf8") !== readFileSync(join(ROOT, r), "utf8")) { console.log(`FAIL ${r} is stale: run node ${s}`); fail++; }
  }
} finally { rmSync(tmp, { recursive: true, force: true }); }
if (fail) { console.log(`check-all: ${fail} failure(s)`); process.exit(1); }
console.log(`check-all: PASS (${CHECKS.length} checks, ${REPORTS.length} reports fresh)`);
