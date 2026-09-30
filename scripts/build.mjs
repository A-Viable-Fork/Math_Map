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
import { evidence, LEVELS } from "./evidence.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const sha = (t) => createHash("sha256").update(t).digest("hex");

// Trust tiers, strongest evidence first: flagged (known wrong), audited (graded field by field against
// sources; its worst verdict is given), receipted (an addition, every claim quoted), landed (as written),
// authored (a fill, unreviewed). Links to Mathlib (mapfill/formal.js) are a separate axis, reported per claim.
const FIELDS6 = ["name", "description", "input", "output", "preserved", "broken"];
const worst = (g) => { const vs = FIELDS6.map((f) => g.fields[f].verdict); return vs.includes("wrong") ? "wrong" : vs.includes("imprecise") ? "imprecise" : vs.every((v) => v === "confirmed") ? "confirmed" : "partly unsupported"; };

export function build() {
  const P = parse();
  const gradeOf = Object.fromEntries([...require("../audit/grades-0_1.js").GRADES, ...require("../audit/targeted-0_1.js").TARGETED].map((g) => [g.id, g]));
  const grades = Object.fromEntries(Object.entries(gradeOf).map(([id, g]) => [id, worst(g)]));
  const E = evidence(P);
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
    if (e.invariants) o.invariants = e.invariants;
    if (e.actsOn) o.actsOn = e.actsOn;
    o.evidence = Object.fromEntries(FIELDS6.map((f) => [f, E.field(e, f).level]));
    if (e.invariants) o.claims = ["preserved", "broken", "output"].flatMap((f) => e.invariants[f].map((v) => ({ field: f, invariant: v, ...E.claim(e, f, v) })));
    if (e.corrected) o.corrected = { fields: e.corrected, landed: e.landedFields, reason: e.correction.reason, receipts: e.correction.receipts };
    if (e.flagResolved) o.flagResolved = { kind: e.flagResolved.kind, evidence: e.flagResolved.evidence };
    if (e.formal) o.formal = e.formal.map((k) => ({ ...k, url: `https://github.com/leanprover-community/mathlib4/blob/${P.formal.mathlib.commit}/${k.file}` }));
    if (e.conditions) { o.conditions = e.conditions; o.counterexamples = e.counterexamples; o.conditionReceipts = e.conditionReceipts; }
    const g = grades[e.id];
    o.tier = e.flag ? "flagged" : e.flagResolved ? "receipted" : g ? "audited" : e.origin === "added" ? "receipted" : e.origin === "fill" ? "authored" : "landed";
    if (g) { o.auditVerdict = e.corrected ? worst({ fields: Object.fromEntries(FIELDS6.map((f) => [f, e.corrected.includes(f) || (f === "name" && e.flagResolved) ? { verdict: "confirmed" } : gradeOf[e.id].fields[f]])) }) : g; if (e.corrected) o.landedAuditVerdict = g; }
    return o;
  });
  const { GRADES } = require("../audit/grades-0_1.js");
  const { TARGETED } = require("../audit/targeted-0_1.js");
  const audit = { sample: { seed: 20260929, note: "A fixed stratified random sample, graded field by field against cited sources.", grades: GRADES },
    targeted: TARGETED };
  const files = {};
  const map = { about: "A typed map of mathematical transformations: input, output, preserved and broken invariants, functional tags. Landed entries, an authored fill layer, and receipted additions; every entry states its origin.",
    builtFrom: { commit }, domains: P.declared, vocabulary: P.vocab, invariants: { carriers: P.vocabulary.CARRIERS, terms: P.vocabulary.INVARIANTS, relations: P.vocabulary.RELATIONS, receiptedLinks: P.vocabulary.LINKS.filter((l) => l.receipts) },
    origins: { map: "as landed", fill: "authored from standard mathematics, not reviewed against sources", "clone:<id>": "a pointer resolved to its home entry", added: "an entry the map lacked, each claim receipted by a verbatim quote (receipts)" },
    counts: { entries: entries.length, anchorable: entries.filter((e) => e.anchorable).length, byOrigin: entries.reduce((a, e) => { const k = e.origin.startsWith("clone:") ? "clone" : e.origin; a[k] = (a[k] || 0) + 1; return a; }, {}),
      byTier: entries.reduce((a, e) => { a[e.tier] = (a[e.tier] || 0) + 1; return a; }, {}), withConditions: entries.filter((e) => e.conditions).length, corrected: entries.filter((e) => e.corrected).length,
      fieldEvidence: Object.fromEntries(LEVELS.map((l) => [l, entries.reduce((n, e) => n + FIELDS6.filter((f) => e.evidence[f] === l).length, 0)])),
      claimEvidence: Object.fromEntries(LEVELS.map((l) => [l, entries.reduce((n, e) => n + (e.claims || []).filter((c) => c.level === l).length, 0)])),
      formal: { mathlibCommit: P.formal.mathlib.commit, entries: entries.filter((e) => e.formal).length, links: P.formal.links.length,
        byMatch: P.formal.links.reduce((a, k) => { a[k.match] = (a[k.match] || 0) + 1; return a; }, {}) } },
    entries: entries.map((e) => e.receipts ? e : e) };
  files["map.json"] = JSON.stringify(map, null, 1) + "\n";
  files["audit.json"] = JSON.stringify(audit, null, 1) + "\n";
  for (const d of Object.keys(P.declared)) {
    const L = [`# ${d}: ${P.declared[d].name}`, "", `Built from commit ${commit}. Origins: map (as landed), fill (authored, unreviewed), clone:<id> (resolved pointer), added (receipted).`, ""];
    for (const e of entries.filter((x) => x.domain === d)) {
      L.push(`## ${e.id} ${e.name}`, "", `*${e.kind}; ${e.tags.join(", ")}; origin: ${e.origin}; tier: ${e.tier}${e.auditVerdict ? ` (${e.auditVerdict})` : ""}${e.flag ? `; flagged: ${e.flag.kind}` : ""}*`, "", e.description, "",
        `- input: ${e.input ?? "-"}`, `- output: ${e.output ?? "-"}`, `- preserved: ${e.preserved ?? "-"}`, `- broken: ${e.broken ?? "-"}`, `- complexity: ${e.complexity ?? "-"}`);
      if (e.actsOn) L.push(`- acts on: ${e.actsOn.input.join(", ")} to ${e.actsOn.output.join(", ")}`);
      if (e.invariants) L.push(`- named invariants: preserved ${e.invariants.preserved.join(", ") || "none"}; broken ${e.invariants.broken.join(", ") || "none"}${e.invariants.output.length ? `; produced ${e.invariants.output.join(", ")}` : ""}`);
      L.push(`- evidence: ${FIELDS6.map((f) => `${f} ${e.evidence[f]}`).join(", ")}`);
      if (e.corrected) L.push(`- corrected: ${e.corrected.fields.join(", ")}. ${e.corrected.reason} Landed: ${e.corrected.fields.map((f) => `${f} "${e.corrected.landed[f]}"`).join("; ")}.`);
      if (e.conditions) L.push(`- conditions: ${e.conditions}`);
      for (const k of e.formal || []) L.push(`- Mathlib (${k.match}, on ${k.field}): [\`${k.decl}\`](${k.url}). ${k.note}`);
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
    `Each entry carries a tier, strongest evidence first: **flagged** (known wrong, withheld from use), **audited** (graded field by field against cited sources; the worst verdict is shown), **receipted** (an addition whose every claim is quoted), **landed** (as written, not reviewed), **authored** (a fill, not reviewed). Counts: ${Object.entries(map.counts.byTier).map(([k, v]) => `${k} ${v}`).join(", ")}.`, "",
    `Entries may also carry **conditions** (the hypotheses their claims need) and **counterexamples**, each receipted like an addition (\`mapfill/conditions.js\`). ${map.counts.withConditions} entries have conditions so far.`, "",
    "## Named invariants and composition", "",
    `Free-text fields say what an entry preserves and breaks; \`mapfill/invariants.js\` names those invariants (${P.vocabulary.INVARIANTS.length} so far, with the relations between them), gives each a carrier (the kind of object that has it), records what kinds of object each linked entry takes and returns, and links entries to invariants. Each link is justified by a phrase in the entry's own field or, where the entry is silent, by a receipted quote with a note. \`node scripts/compose.mjs --chain D2-118,D2-117\` then reports, for a chain of entries applied in order, whether each join fits (match, narrowing, or mismatch: an unstated conversion), and which invariants survive, break, are restored or created, judged only at the steps that act on their carrier. Silence means the map does not say, not that the invariant is lost. The vocabulary grows by use: it covers ${new Set(P.vocabulary.LINKS.map((l) => l.entry)).size} entries now.`, "",
    "## Evidence per claim", "",
    `Every field of every entry, and every named-invariant claim, carries an evidence level, weakest first: **contradicted** (a check found it wrong and it is not yet corrected), **unsupported** (checked; no source supports it), **unchecked** (never checked), **imprecise** (right idea, a detail wrong), **sourced** (a verbatim quote supports it), **formal** (Mathlib states it). \`scripts/evidence.mjs\` computes them from the audit grades, receipts, corrections and Mathlib links. The composition checker reports, for every result and join of a chain, the weakest claim it rests on and where it is, so verification can go where a chain is weakest. Fields by level: ${LEVELS.map((l) => `${l} ${map.counts.fieldEvidence[l]}`).join(", ")}. Invariant claims by level: ${LEVELS.map((l) => `${l} ${map.counts.claimEvidence[l]}`).join(", ")}.`, "",
    "## Corrections", "",
    `\`mapfill/corrections.js\` replaces landed fields that a check found wrong or imprecise with receipted text; the landed text is kept on the entry (\`corrected.landed\`). A correction needs a prior finding (an audit grade, a flag, or a Mathlib conflict) and a receipt for every field it changes. ${map.counts.corrected} entries are corrected so far; correcting every field of a flagged entry resolves the flag. The audit's error rates still describe the map as landed.`, "",
    "## Formal links (Lean and Mathlib)", "",
    `\`mapfill/formal.js\` links entries to declarations in [Mathlib](https://github.com/leanprover-community/mathlib4), pinned at commit \`${P.formal.mathlib.commit}\`: ${map.counts.formal.links} links on ${map.counts.formal.entries} entries. Each link names the field it bears on and grades the match: **exact** (Mathlib states the claim), **general** (Mathlib states something that implies it), **special** (a special case), **related** (a weaker or neighbouring result; the claim itself is not formalized), **ingredient** (the objects, not the claim), or **conflicts** (Mathlib's statement conflicts with the claim as written; the note says how). Counts: ${Object.entries(map.counts.formal.byMatch).map(([k, v]) => k + " " + v).join(", ")}. The declaration statements are quoted in \`excerpts/mathlib-*.txt\` with the hash of each file at the pin; \`node scripts/formal.mjs --verify\` refetches them. A link says Mathlib proves the quoted statement, which its CI type-checked at that commit; the grade of how it bears on the entry is a judgment, like an audit grade. \`reports/FORMAL-QUEUE.md\` lists unreviewed name matches still to be read.`, "",
    "## Audit", "",
    "`audit.json` holds field-by-field grades (confirmed, imprecise, wrong, unsupported) against cited sources: a fixed random sample of 60 entries, kept for unbiased error rates, and targeted grades for entries chosen for use (composites) or for citation (entries with a Mathlib counterpart), kept out of the estimates. Six landed entries are flagged as misaligned and carry their evidence.", "",
    "## Layout", "",
    "Sources, edited by hand and checked:", "",
    "- `source/math_map.md`: the map as landed, verbatim. `source/Category_Theory_Transformation_Enumeration.pdf`: the report the D7 names come from.",
    "- `mapfill/`: the fill layer (clone resolution, authored fills, missing homes, flags), the additions (`mapfill/additions.js`), conditions, the invariant vocabulary, and the Mathlib links (`mapfill/formal.js`). See `mapfill/README.md`.",
    "- `audit/`: the fixed sample, its grades, and the targeted receipts.",
    "- `excerpts/`: the verbatim windows that receipt the additions, each with its source URL and the hash of the page or PDF as fetched. Quoted for reference; the sources keep their own licences.",
    "- `scripts/`: the parser and query tool (`mathmap.mjs`), the composition checker (`compose.mjs`), the evidence levels (`evidence.mjs`), the Mathlib links (`formal.mjs`), the excerpt maker (`excerpt.mjs`), the MCP server (`mcp.mjs`), the audit (`audit.mjs`), this build (`build.mjs`), and the gate (`check-all.mjs`). Node 18 or later, no dependencies.", "",
    "Generated by `node scripts/build.mjs`, never edited by hand:", "",
    "- `map.json`: every entry, machine-readable. `domains/D1.md` to `domains/D8.md`: the same, readable. `audit.json`: the grades with their quotes and sources.",
    "- `reports/MATHMAP.md` and `reports/AUDIT.md`: data quality and error rates (written by `mathmap.mjs` and `audit.mjs`).",
    "- `MANIFEST.json` and `SHA256SUMS`: the source commit and file hashes, so an answer that cites this map can cite the exact version.", "",
    "## Querying", "",
    "`node scripts/mathmap.mjs --text quotient --domain D4 --full` prints matching entries. Flags: `--id`, `--domain`, `--tag`, `--kind`, `--text`, `--origin`, `--stubs`, `--limit`, `--full`, `--landed`.", "",
    "## For language models (MCP)", "",
    "`scripts/mcp.mjs` serves the map over the Model Context Protocol on stdio, with no dependencies. Tools: `map_info`, `search_entries` (by text, domain, tag, kind, tier or named invariant), `get_entry`, `list_invariants` and `compose_chain`. Every answer carries the commit the map was built from, so a model's citation names an exact version. To add it to Claude Code: `claude mcp add math-map -- node /path/to/Math_Map/scripts/mcp.mjs`. Other clients take the same command in their server configuration:", "",
    "```json", "{ \"mcpServers\": { \"math-map\": { \"command\": \"node\", \"args\": [\"/path/to/Math_Map/scripts/mcp.mjs\"] } } }", "```", "",
    "## Licence", "",
    "The map's data (the landed map, the fill layer, additions, conditions, invariants, audit grades and generated files) is licensed under CC BY 4.0; the scripts are under the MIT licence. See `LICENSE`. The excerpts in `excerpts/` are short quotations from their sources, which keep their own licences (Wikipedia text is CC BY-SA; arXiv papers and the nLab under their authors' terms).", "",
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
