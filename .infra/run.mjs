// Role: the gate (FUNCTIONS.md F1). Runs the kit checks a repository enables in infra.json, then its own
//   local checks, and gives one verdict.
// Contract: `node .infra/run.mjs [--online] [--anchor DIR] [--root DIR]` in a consumer (`node kit/run.mjs` in the kit's own
//   repository). infra.json: `{ "checks": { "<name>": {config} | false }, "local": [{ "name", "run" }] }`;
//   `checks.kit` configures the kit check, which always runs. --anchor DIR names a local clone of
//   Repo-Infrastructure to anchor the pin against (checks/kit.mjs). Each check receives (root, its config,
//   { online, anchor, config }) where config is the whole infra.json. A check function may carry
//   `requires(cfg)`, the checks its guarantee rests on (F20): enabled without them, it is an ERROR, since
//   its PASS would not mean what it says.
//   Outcomes follow the protocol in lib/core.mjs: each check is PASS, FAIL or ERROR, with warnings that
//   never fail. A kit check that throws is an ERROR. A local check is a node script run from the
//   repository root (passed --online when given): exit 0 PASS, 1 FAIL, 2 ERROR, anything else (a crash, a
//   signal, an uncaught exception's trace on stderr) ERROR. Output: per check a human line, its findings and warnings, then a machine line in
//   Paper-kit's form `RESULT check=NAME status=S violations=N warnings=N`; finally `## RESULT: S` in
//   Unset-Emerald's form. Exit 0 if all pass, 1 if any FAIL and none ERROR, 2 if any ERROR.
// Invariant: read-only.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig, errored, EXIT, PASS, FAIL, ERROR } from "./lib/core.mjs";
import dashes from "./checks/dashes.mjs";
import leak from "./checks/leak.mjs";
import provenance from "./checks/provenance.mjs";
import receipts from "./checks/receipts.mjs";
import freshness from "./checks/freshness.mjs";
import headers from "./checks/headers.mjs";
import docgraph from "./checks/docgraph.mjs";
import corrections from "./checks/corrections.mjs";
import leanAudit from "./checks/lean-audit.mjs";
import repomap from "./checks/repomap.mjs";
import kit from "./checks/kit.mjs";

export const CHECKS = { dashes, leak, provenance, receipts, freshness, headers, docgraph, corrections, "lean-audit": leanAudit, repomap };
const HERE = dirname(fileURLToPath(import.meta.url));
export const VERSION = readFileSync(join(HERE, "VERSION"), "utf8").trim();

function local(root, l, online) {
  const r = spawnSync("node", [join(root, l.run), ...(online ? ["--online"] : [])], { cwd: root, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 });
  const out = ((r.stdout || "") + (r.stderr || "")).toString().trim().split("\n").filter(Boolean);
  // An uncaught exception also exits 1; its trace (Node's closing version line, Python's traceback) marks
  // it as a check that did not run, not a check that found something.
  const crashed = /^Node\.js v\d+|^Traceback \(most recent call last\)/m.test((r.stderr || "").toString());
  const status = r.status === 0 ? PASS : r.status === 1 && !crashed ? FAIL : ERROR;
  const m = out.join("\n").match(/RESULT check=\S+ status=\S+ violations=(\d+) warnings=(\d+)/);
  return { name: l.name, local: true, status, ok: status === PASS, fails: status === PASS ? [] : out.slice(-20),
    warnings: [], summary: status === ERROR ? `exited ${r.status ?? r.signal}` : out[out.length - 1] || "", counts: m ? [+m[1], +m[2]] : null };
}

export async function gate(root, { online = false, anchor } = {}) {
  let cfg;
  try { cfg = loadConfig(root); } catch (e) { return [errored("config", e.message)]; }
  const out = [];
  const opts = { online, anchor, config: cfg };
  const conf = (c) => (c === true || c === undefined ? {} : c);
  try { out.push(await kit(root, conf(cfg.checks?.kit), opts)); } catch (e) { out.push(errored("kit", e.message)); }
  const enabled = new Set(Object.entries(cfg.checks || {}).filter(([n, c]) => c !== false && n !== "kit").map(([n]) => n));
  for (const [name, c] of Object.entries(cfg.checks || {})) {
    if (c === false || name === "kit") continue;
    if (!CHECKS[name]) { out.push(errored(name, `unknown kit check "${name}" (kit ${VERSION})`)); continue; }
    const missing = (CHECKS[name].requires?.(conf(c)) || []).filter((r) => !enabled.has(r));
    if (missing.length) { out.push(errored(name, `rests on ${missing.join(", ")}, which infra.json does not enable; enable it, or see the check's contract for the setting that drops the premise`)); continue; }
    try { out.push(await CHECKS[name](root, conf(c), opts)); }
    catch (e) { out.push(errored(name, e.stack?.split("\n").slice(0, 3).join(" | ") || String(e))); }
  }
  for (const l of cfg.local || []) out.push(local(root, l, online));
  return out;
}

export const verdict = (results) => (results.some((r) => r.status === ERROR) ? ERROR : results.some((r) => r.status === FAIL) ? FAIL : PASS);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), r = a.indexOf("--root"), k = a.indexOf("--anchor");
  const root = resolve(r >= 0 ? a[r + 1] : join(HERE, ".."));
  const anchor = k >= 0 ? resolve(a[k + 1]) : undefined;
  const results = (await gate(root, { online: a.includes("--online"), anchor })).filter((x) => !x.skipped);
  for (const x of results) {
    console.log(`${x.status} ${x.local ? "local:" : ""}${x.name}${x.summary ? ` (${x.summary})` : ""}`);
    for (const f of x.fails) console.log(`  ${f}`);
    for (const w of x.warnings || []) console.log(`  warning: ${w}`);
    const [v, w] = x.counts || [x.fails.length, (x.warnings || []).length];
    console.log(`RESULT check=${x.name} status=${x.status} violations=${x.status === PASS ? 0 : v} warnings=${w}`);
  }
  const v = verdict(results);
  console.log(`infra ${VERSION}: ${results.length} checks, ${results.filter((x) => x.status === FAIL).length} failed, ${results.filter((x) => x.status === ERROR).length} errored`);
  console.log(`## RESULT: ${v}`);
  process.exit(EXIT[v]);
}
