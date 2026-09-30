// Role: the build. Generates the published forms of the map from its sources: map.json (every entry,
//   machine-readable), domains/*.md (readable), audit.json (grades), README.md, MANIFEST.json and SHA256SUMS.
// Contract: `node scripts/build.mjs` writes them; `--check` fails if any differs from what would be written
//   (the commit stamp aside). Sources: source/math_map.md, mapfill/, audit/, excerpts/.
// Invariant: generated files are never edited by hand.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, anchorable } from "./mathmap.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const sha = (t) => createHash("sha256").update(t).digest("hex");

// Trust tiers, strongest evidence first: flagged (known wrong), audited (graded field by field against
// sources; its worst verdict is given), receipted (an addition, every claim quoted), landed (as written),
// authored (a fill, unreviewed). Formal verification would sit above audited; no entry has it yet.
const FIELDS6 = ["name", "description", "input", "output", "preserved", "broken"];
const worst = (g) => { const vs = FIELDS6.map((f) => g.fields[f].verdict); return vs.includes("wrong") ? "wrong" : vs.includes("imprecise") ? "imprecise" : vs.every((v) => v === "confirmed") ? "confirmed" : "partly unsupported"; };

export function build() {
  const P = parse();
  const grades = Object.fromEntries([...require("../audit/grades-0_1.js").GRADES, ...require("../audit/targeted-0_1.js").TARGETED].map((g) => [g.id, worst(g)]));
  const commit = (() => { try { return execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT }).toString().trim(); } catch { return "unknown"; } })();
  const entries = P.entries.map((e) => {
    const o = { id: e.id, domain: e.domain, name: e.name, kind: e.kind, tags: e.tags, description: e.description,
      input: e.input, output: e.output, preserved: e.preserved, broken: e.broken, complexity: e.complexity || null,
      status: e.status || null, origin: e.origin, anchorable: anchorable(e) };
    if (e.reading) o.reading = e.reading;
    if (e.unknown) o.unknown = true;
    if (e.flag) o.flag = { kind: e.flag.kind, evidence: e.flag.evidence };
    if (e.pointer) o.landedAs = e.pointer;
    if (e.receipts) o.receipts = e.receipts.map((r) => ({ file: r.file, quote: r.quote }));
    if (e.conditions) { o.conditions = e.conditions; o.counterexamples = e.counterexamples; o.conditionReceipts = e.conditionReceipts; }
    const g = grades[e.id];
    o.tier = e.flag ? "flagged" : g ? "audited" : e.origin === "added" ? "receipted" : e.origin === "fill" ? "authored" : "landed";
    if (g) o.auditVerdict = g;
    return o;
  });
  const { GRADES } = require("../audit/grades-0_1.js");
  const { TARGETED } = require("../audit/targeted-0_1.js");
  const audit = { sample: { seed: 20260929, note: "A fixed stratified random sample, graded field by field against cited sources.", grades: GRADES },
    targeted: TARGETED };
  const files = {};
  const map = { about: "A typed map of mathematical transformations: input, output, preserved and broken invariants, functional tags. Landed entries, an authored fill layer, and receipted additions; every entry states its origin.",
    builtFrom: { commit }, domains: P.declared, vocabulary: P.vocab,
    origins: { map: "as landed", fill: "authored from standard mathematics, not reviewed against sources", "clone:<id>": "a pointer resolved to its home entry", added: "an entry the map lacked, each claim receipted by a verbatim quote (receipts)" },
    counts: { entries: entries.length, anchorable: entries.filter((e) => e.anchorable).length, byOrigin: entries.reduce((a, e) => { const k = e.origin.startsWith("clone:") ? "clone" : e.origin; a[k] = (a[k] || 0) + 1; return a; }, {}),
      byTier: entries.reduce((a, e) => { a[e.tier] = (a[e.tier] || 0) + 1; return a; }, {}), withConditions: entries.filter((e) => e.conditions).length },
    entries: entries.map((e) => e.receipts ? e : e) };
  files["map.json"] = JSON.stringify(map, null, 1) + "\n";
  files["audit.json"] = JSON.stringify(audit, null, 1) + "\n";
  for (const d of Object.keys(P.declared)) {
    const L = [`# ${d}: ${P.declared[d].name}`, "", `Built from commit ${commit}. Origins: map (as landed), fill (authored, unreviewed), clone:<id> (resolved pointer), added (receipted).`, ""];
    for (const e of entries.filter((x) => x.domain === d)) {
      L.push(`## ${e.id} ${e.name}`, "", `*${e.kind}; ${e.tags.join(", ")}; origin: ${e.origin}; tier: ${e.tier}${e.auditVerdict ? ` (${e.auditVerdict})` : ""}${e.flag ? `; flagged: ${e.flag.kind}` : ""}*`, "", e.description, "",
        `- input: ${e.input ?? "-"}`, `- output: ${e.output ?? "-"}`, `- preserved: ${e.preserved ?? "-"}`, `- broken: ${e.broken ?? "-"}`, `- complexity: ${e.complexity ?? "-"}`);
      if (e.conditions) L.push(`- conditions: ${e.conditions}`);
      for (const k of e.counterexamples || []) L.push(`- counterexample: ${k.case}`);
      if (e.reading) L.push(`- reading: ${e.reading}`);
      if (e.receipts) for (const r of e.receipts) L.push(`- receipt (${r.file}): "${r.quote}"`);
      L.push("");
    }
    files[`domains/${d}.md`] = L.join("\n");
  }
  files["README.md"] = [
    "# Math map", "",
    "A typed map of mathematical transformations across eight domains. Each entry gives an operation's input, output, preserved invariants and broken invariants, with functional tags from a controlled vocabulary.", "",
    `${map.counts.entries} entries, ${map.counts.anchorable} with full types and invariants. The files in this list are generated by \`scripts/build.mjs\` from the sources; \`node scripts/check-all.mjs\` checks the sources and that the generated files are fresh.`, "",
    "## Origins", "",
    "Every entry states where its content comes from:", "",
    "- **map**: as written in the landed map (`source/math_map.md`, verbatim).",
    "- **fill**: authored from standard mathematics for entries the landed map left as names or broken pointers. Not reviewed against sources.",
    "- **clone:<id>**: the landed entry pointed at another entry; the pointer is resolved.",
    "- **added**: an entry the landed map lacked. Every weight-bearing claim is receipted by a verbatim quote in `excerpts/`.", "",
    "## Trust tiers", "",
    `Each entry carries a tier, strongest evidence first: **flagged** (known wrong, withheld from use), **audited** (graded field by field against cited sources; the worst verdict is shown), **receipted** (an addition whose every claim is quoted), **landed** (as written, not reviewed), **authored** (a fill, not reviewed). Formal verification would sit above audited; no entry has it yet. Counts: ${Object.entries(map.counts.byTier).map(([k, v]) => `${k} ${v}`).join(", ")}.`, "",
    `Entries may also carry **conditions** (the hypotheses their claims need) and **counterexamples**, each receipted like an addition (\`mapfill/conditions.js\`). ${map.counts.withConditions} entries have conditions so far.`, "",
    "## Audit", "",
    "`audit.json` holds field-by-field grades (confirmed, imprecise, wrong, unsupported) against cited sources: a fixed random sample of 60 entries, and targeted receipts for entries that were needed. Six landed entries are flagged as misaligned and carry their evidence.", "",
    "## Layout", "",
    "Sources, edited by hand and checked:", "",
    "- `source/math_map.md`: the map as landed, verbatim. `source/Category_Theory_Transformation_Enumeration.pdf`: the report the D7 names come from.",
    "- `mapfill/`: the fill layer (clone resolution, authored fills, missing homes, flags) and the additions (`mapfill/additions.js`). See `mapfill/README.md`.",
    "- `audit/`: the fixed sample, its grades, and the targeted receipts.",
    "- `excerpts/`: the verbatim windows that receipt the additions, each with its source URL and the hash of the page or PDF as fetched. Quoted for reference; the sources keep their own licences.",
    "- `scripts/`: the parser and query tool (`mathmap.mjs`), the audit (`audit.mjs`), this build (`build.mjs`), and the gate (`check-all.mjs`). Node 18 or later, no dependencies.", "",
    "Generated by `node scripts/build.mjs`, never edited by hand:", "",
    "- `map.json`: every entry, machine-readable. `domains/D1.md` to `domains/D8.md`: the same, readable. `audit.json`: the grades with their quotes and sources.",
    "- `reports/MATHMAP.md` and `reports/AUDIT.md`: data quality and error rates (written by `mathmap.mjs` and `audit.mjs`).",
    "- `MANIFEST.json` and `SHA256SUMS`: the source commit and file hashes, so an answer that cites this map can cite the exact version.", "",
    "## Querying", "",
    "`node scripts/mathmap.mjs --text quotient --domain D4 --full` prints matching entries. Flags: `--id`, `--domain`, `--tag`, `--kind`, `--text`, `--origin`, `--stubs`, `--limit`, `--full`, `--landed`.", "",
    "## Contributing", "",
    "A change to a field needs evidence: an addition or a correction carries receipts (verbatim quotes in `excerpts/`), and a grade carries a quote from its cited source. `node scripts/check-all.mjs` must pass.", "",
  ].join("\n");
  const manifest = { builtFrom: commit, files: Object.fromEntries(Object.keys(files).sort().map((f) => [f, sha(files[f])])) };
  files["MANIFEST.json"] = JSON.stringify(manifest, null, 1) + "\n";
  files["SHA256SUMS"] = Object.entries(manifest.files).map(([f, h]) => `${h}  ${f}`).join("\n") + "\n";
  return files;
}


// The commit stamp names the commit the build ran on (the parent of the commit that carries the output),
// or "unknown" outside a git checkout; a freshness check ignores it.
const unstamp = (t) => t.replace(/\b[0-9a-f]{64}\b/g, "HASH").replace(/\b[0-9a-f]{40}\b|\bunknown\b/g, "COMMIT");

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = build();
  if (process.argv.includes("--check")) {
    const F = Object.entries(files).filter(([f, t]) => !existsSync(join(ROOT, f)) || unstamp(readFileSync(join(ROOT, f), "utf8")) !== unstamp(t)).map(([f]) => f);
    if (F.length) { for (const f of F) console.log(`FAIL ${f} is stale: run node scripts/build.mjs`); process.exit(1); }
    console.log(`build: PASS (${Object.keys(files).length} generated files fresh)`);
  } else {
    for (const [f, t] of Object.entries(files)) { mkdirSync(dirname(join(ROOT, f)), { recursive: true }); writeFileSync(join(ROOT, f), t); }
    console.log(`build: wrote ${Object.keys(files).length} files`);
  }
}
