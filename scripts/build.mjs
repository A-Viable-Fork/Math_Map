// Role: the build. Generates the published forms of the map from its sources: map.json (every entry,
//   machine-readable), domains/*.md (readable), audit.json (grades), README.md (the design),
//   STATUS.md (what the data holds, dated by the commit built from), MANIFEST.json and SHA256SUMS.
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
import { status as leanStatus } from "./lean.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const sha = (t) => createHash("sha256").update(t).digest("hex");

// Trust tiers, strongest evidence first: flagged (known wrong), audited (graded field by field against
// sources; its worst verdict is given), receipted (an addition, every claim quoted), landed (as written),
// authored (a fill, unreviewed), generated (a graded generation round's design contract, unreviewed field by
// field). Links to Mathlib (mapfill/formal.js) are a separate axis, reported per claim.
const FIELDS6 = ["name", "description", "input", "output", "preserved", "broken"];
const worst = (g) => { const vs = FIELDS6.map((f) => g.fields[f].verdict); return vs.includes("wrong") ? "wrong" : vs.includes("imprecise") ? "imprecise" : vs.every((v) => v === "confirmed") ? "confirmed" : "partly unsupported"; };

export function build() {
  const P = parse();
  const gradeOf = Object.fromEntries([...require("../audit/grades-0_1.js").GRADES, ...require("../audit/targeted-0_1.js").TARGETED].map((g) => [g.id, g]));
  const grades = Object.fromEntries(Object.entries(gradeOf).map(([id, g]) => [id, worst(g)]));
  const E = evidence(P);
  const { CLAIMS: LC, DEFS: LD } = require("../mapfill/lean.js"), LA = leanStatus();
  const leanSrc = readdirSync(join(ROOT, "lean/MathMap")).filter((f) => f.endsWith(".lean")).map((f) => [`lean/MathMap/${f}`, readFileSync(join(ROOT, "lean/MathMap", f), "utf8")]);
  const leanFile = (decl) => { const short = decl.split(".").pop(); return leanSrc.find(([, t]) => new RegExp(`^(theorem|def|structure|abbrev)\\s+(\\S+\\.)?${short.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "m").test(t))?.[0] ?? null; };
  const commit = (() => { try { return execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT }).toString().trim(); } catch { return "unknown"; } })();
  const ANDROID = require("../mapfill/android.js");
  const NIXOS = require("../mapfill/nixos.js");
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
    if (e.facets?.length > 1) o.facets = e.facets;
    const ab = ANDROID.BINDINGS.filter((b) => b.entry === e.id);
    if (ab.length) o.android = { tag: ANDROID.PIN.tag, bindings: ab.map((b) => ({ api: b.api, path: b.path, platformAssurance: b.platformAssurance, contractAssurance: b.contractAssurance, breaks: b.breaks, note: b.note })) };
    const nb = NIXOS.BINDINGS.filter((b) => b.entry === e.id);
    if (nb.length) o.nixos = { nixpkgs: NIXOS.PIN.nixpkgs, bindings: nb.map((b) => ({ variant: b.variant, mechanism: b.mechanism, options: b.nixosOptions, path: b.path, platformAssurance: b.platformAssurance, contractAssurance: b.contractAssurance, breaks: b.breaks, verdict: b.verdict, note: b.note })) };
    o.evidence = Object.fromEntries(FIELDS6.map((f) => [f, E.field(e, f).level]));
    if (e.invariants) o.claims = ["preserved", "broken", "output"].flatMap((f) => e.invariants[f].map((v) => ({ field: f, invariant: v, ...E.claim(e, f, v) })));
    if (e.corrected) o.corrected = { fields: e.corrected, landed: e.landedFields, reason: e.correction.reason, receipts: e.correction.receipts };
    if (e.flagResolved) o.flagResolved = { kind: e.flagResolved.kind, evidence: e.flagResolved.evidence };
    const lc = LC.filter((c) => c.entry === e.id);
    if (lc.length) o.lean = lc.map((c) => ({ field: c.field, decl: c.decl, match: c.match, status: LA?.decls?.[c.decl]?.status ?? "unaudited", ...(c.invariant ? { invariant: c.invariant } : {}), ...(c.whole ? { whole: true } : {}), note: c.note, file: leanFile(c.decl) }));
    if (e.formal) o.formal = e.formal.map((k) => ({ ...k, url: `https://github.com/leanprover-community/mathlib4/blob/${P.formal.mathlib.commit}/${k.file}` }));
    if (e.conditions) { o.conditions = e.conditions; o.counterexamples = e.counterexamples; o.conditionReceipts = e.conditionReceipts; }
    const g = grades[e.id];
    o.tier = e.flag ? "flagged" : e.flagResolved ? "receipted" : g ? "audited" : e.origin === "added" ? "receipted" : e.origin === "fill" ? "authored" : e.origin === "generated" ? "generated" : "landed";
    if (g) { o.auditVerdict = e.corrected ? worst({ fields: Object.fromEntries(FIELDS6.map((f) => [f, e.corrected.includes(f) || (f === "name" && e.flagResolved) ? { verdict: "confirmed" } : gradeOf[e.id].fields[f]])) }) : g; if (e.corrected) o.landedAuditVerdict = g; }
    return o;
  });
  const { GRADES } = require("../audit/grades-0_1.js");
  const { TARGETED } = require("../audit/targeted-0_1.js");
  const audit = { sample: { seed: 20260929, note: "A fixed stratified random sample, graded field by field against cited sources.", grades: GRADES },
    targeted: TARGETED };
  const files = {};
  const map = { about: "A typed map of mathematical transformations: input, output, preserved and broken invariants, functional tags. Landed entries, an authored fill layer, and receipted additions; every entry states its origin.",
    builtFrom: { commit }, domains: P.domains, vocabulary: P.vocab, invariants: { carriers: P.vocabulary.CARRIERS, terms: P.vocabulary.INVARIANTS, relations: P.vocabulary.RELATIONS, receiptedLinks: P.vocabulary.LINKS.filter((l) => l.receipts) },
    origins: { map: "as landed", fill: "authored from standard mathematics, not reviewed against sources", "clone:<id>": "a pointer resolved to its home entry", added: "an entry the map lacked, each claim receipted by a verbatim quote (receipts)" },
    counts: { entries: entries.length, anchorable: entries.filter((e) => e.anchorable).length, byOrigin: entries.reduce((a, e) => { const k = e.origin.startsWith("clone:") ? "clone" : e.origin; a[k] = (a[k] || 0) + 1; return a; }, {}),
      byTier: entries.reduce((a, e) => { a[e.tier] = (a[e.tier] || 0) + 1; return a; }, {}), withConditions: entries.filter((e) => e.conditions).length, corrected: entries.filter((e) => e.corrected).length,
      fieldEvidence: Object.fromEntries(LEVELS.map((l) => [l, entries.reduce((n, e) => n + FIELDS6.filter((f) => e.evidence[f] === l).length, 0)])),
      lean: { toolchain: LA?.toolchain, claims: LC.length, entries: new Set(LC.map((c) => c.entry)).size, definitions: LD.length,
        proved: LC.filter((c) => LA?.decls?.[c.decl]?.status === "proved").length, stated: LC.filter((c) => LA?.decls?.[c.decl]?.status === "stated").length },
      claimEvidence: Object.fromEntries(LEVELS.map((l) => [l, entries.reduce((n, e) => n + (e.claims || []).filter((c) => c.level === l).length, 0)])),
      formal: { mathlibCommit: P.formal.mathlib.commit, entries: entries.filter((e) => e.formal).length, links: P.formal.links.length,
        byMatch: P.formal.links.reduce((a, k) => { a[k.match] = (a[k.match] || 0) + 1; return a; }, {}) } },
    entries: entries.map((e) => e.receipts ? e : e) };
  files["map.json"] = JSON.stringify(map, null, 1) + "\n";
  files["audit.json"] = JSON.stringify(audit, null, 1) + "\n";
  for (const d of Object.keys(P.domains)) {
    const L = [`# ${d}: ${P.domains[d].name}`, "", `Built from commit ${commit}. Origins: map (as landed), fill (authored, unreviewed), clone:<id> (resolved pointer), added (receipted), generated (a graded generation round's design contract).`, ""];
    for (const e of entries.filter((x) => x.domain === d)) {
      L.push(`## ${e.id} ${e.name}`, "", `*${e.kind}; ${e.tags.join(", ")}; origin: ${e.origin}; tier: ${e.tier}${e.auditVerdict ? ` (${e.auditVerdict})` : ""}${e.flag ? `; flagged: ${e.flag.kind}` : ""}*`, "", e.description, "",
        `- input: ${e.input ?? "-"}`, `- output: ${e.output ?? "-"}`, `- preserved: ${e.preserved ?? "-"}`, `- broken: ${e.broken ?? "-"}`, `- complexity: ${e.complexity ?? "-"}`);
      if (e.actsOn) L.push(`- acts on: ${e.actsOn.input.join(", ")} to ${e.actsOn.output.join(", ")}`);
      if (e.invariants) L.push(`- named invariants: preserved ${e.invariants.preserved.join(", ") || "none"}; broken ${e.invariants.broken.join(", ") || "none"}${e.invariants.output.length ? `; produced ${e.invariants.output.join(", ")}` : ""}`);
      L.push(`- evidence: ${FIELDS6.map((f) => `${f} ${e.evidence[f]}`).join(", ")}`);
      if (e.corrected) L.push(`- corrected: ${e.corrected.fields.join(", ")}. ${e.corrected.reason} Landed: ${e.corrected.fields.map((f) => `${f} "${e.corrected.landed[f]}"`).join("; ")}.`);
      if (e.conditions) L.push(`- conditions: ${e.conditions}`);
      for (const k of e.lean || []) L.push(`- Lean (${k.match}, ${k.status}, on ${k.field}${k.invariant ? `: ${k.invariant}` : ""}): \`${k.decl}\` in \`${k.file}\`. ${k.note}`);
      for (const k of e.formal || []) L.push(`- Mathlib (${k.match}, on ${k.field}): [\`${k.decl}\`](${k.url}). ${k.note}`);
      for (const k of e.counterexamples || []) L.push(`- counterexample: ${k.case}`);
      if (e.reading) L.push(`- reading: ${e.reading}`);
      if (e.receipts) for (const r of e.receipts) L.push(`- receipt (${r.file}): "${r.quote}"`);
      L.push("");
    }
    files[`domains/${d}.md`] = L.join("\n");
  }
  // README.md is the design and stays timeless: no counts, pins or dates. Everything that changes with the data
  // goes in STATUS.md below, derived from the same build.
  files["README.md"] = [
    "# Math map", "",
    "A typed map of mathematical transformations. Each entry gives an operation's input, output, preserved invariants and broken invariants, with functional tags from a controlled vocabulary. Every entry states where its content came from and how far it has been checked, and every field carries its own evidence level, so a use of the map can go only as far as its evidence does. Chains of entries compose: a checker reports whether each join fits, which invariants survive, and the weakest claim the chain rests on.", "",
    "The machinery is general. The map is data: a landed source kept verbatim, an overlay that fills, corrects, adds and links it, and audit grades. Domains, entries, invariants and their bindings to platforms are rows in that data; the parser, evidence levels, composition checker, build and query tools work over whatever rows are there. One domain, systems and effects, holds operation contracts for software that the same checker composes, with bindings to platform primitives.", "",
    "What is in the map, as counts derived from its data, is in [`STATUS.md`](STATUS.md), regenerated by the build. The fill layer's design is [`mapfill/README.md`](mapfill/README.md).", "",
    "## Origins", "",
    "Every entry states where its content comes from:", "",
    "- **map**: as written in the landed map (`source/math_map.md`, verbatim).",
    "- **fill**: authored from standard mathematics for entries the landed map left as names or broken pointers. Not reviewed against sources.",
    "- **clone:<id>**: the landed entry pointed at another entry; the pointer is resolved.",
    "- **added**: an entry the landed map lacked. Every weight-bearing claim is receipted by a verbatim quote in `excerpts/`.",
    "- **generated**: a design contract from a graded generation round (`mapfill/generated.js`), landed at its own tier with the round recorded.", "",
    "## Trust tiers", "",
    "Each entry carries a tier, strongest evidence first: **flagged** (known wrong, withheld from use), **audited** (graded field by field against cited sources; the worst verdict is shown), **receipted** (an addition whose every claim is quoted), **landed** (as written, not reviewed), **authored** (a fill, not reviewed), **generated** (from a graded generation round, not reviewed field by field; its claims start unchecked). A stronger tier is earned by evidence, never assigned. A flag withholds an entry from use and never rewrites it.", "",
    "Entries may also carry **conditions** (the hypotheses their claims need) and **counterexamples**, each receipted like an addition (`mapfill/conditions.js`).", "",
    "## Platform bindings", "",
    "Entries of the systems domain can be bound to the platform primitives that would realize them: Android APIs (`mapfill/android.js`) and NixOS options, systemd unit settings and kernel features (`mapfill/nixos.js`), each at a pinned source release. A binding grades the platform primitive and the whole contract separately (enforced, monitored, unknown, not observable) and cites hashed source files. Bindings are generated claims from a graded round; none is a device or host test.", "",
    "`scripts/export-guardians.mjs` exports the systems entries as tool specifications for Guardians (github.com/metareflection/guardians, MIT), and a personal policy (`--source ID=label --forbid label`) as its taint rules, so an existing checker verifies agent workflows against the map's contracts. Relational and hyperproperty invariants and flows through branching stay outside it.", "",
    "## Named invariants and composition", "",
    "Free-text fields say what an entry preserves and breaks; `mapfill/invariants.js` names those invariants, with the relations between them, gives each a carrier (the kind of object that has it), records what kinds of object each linked entry takes and returns, and links entries to invariants. Each link is justified by a phrase in the entry's own field or, where the entry is silent, by a receipted quote with a note. The vocabulary grows by use.", "",
    "`node scripts/compose.mjs --chain D2-118,D2-117` reports, for a chain of entries applied in order, whether each join fits (match, narrowing, partial: an input the previous step does not supply, or mismatch: an unstated conversion), and which invariants survive, break, are restored or created, judged only at the steps that act on their carrier. A step's input kinds are joint operands, and an implication between invariants carries claims only when it relates preservation itself. Silence means the map does not say; the invariant is then reported as unknown.", "",
    "## Evidence per claim", "",
    "Every field of every entry, and every named-invariant claim, carries an evidence level, weakest first: **contradicted** (a check found it wrong and it is not yet corrected), **unsupported** (checked; no source supports it), **unchecked** (never checked), **imprecise** (right idea, a detail wrong), **sourced** (a verbatim quote supports it), **formal** (Mathlib or this repository's Lean project states it). `scripts/evidence.mjs` computes them from the audit grades, receipts, corrections and formal links. The composition checker reports, for every result and join of a chain, the weakest claim it rests on and where it is, so verification can go where a chain is weakest.", "",
    "## Corrections", "",
    "`mapfill/corrections.js` replaces landed fields that a check found wrong or imprecise with receipted text; the landed text is kept on the entry (`corrected.landed`). A correction needs a prior finding (an audit grade, a flag, or a Mathlib conflict) and a receipt for every field it changes. Correcting every field of a flagged entry resolves the flag. The audit's error rates still describe the map as landed.", "",
    "## Formal links (Lean and Mathlib)", "",
    "`mapfill/formal.js` links entries to declarations in [Mathlib](https://github.com/leanprover-community/mathlib4) at a pinned commit. Each link names the field it bears on and grades the match: **exact** (Mathlib states the claim), **general** (Mathlib states something that implies it), **special** (a special case), **related** (a weaker or neighbouring result; the claim itself is not formalized), **ingredient** (the objects, not the claim), or **conflicts** (Mathlib's statement conflicts with the claim as written; the note says how). The declaration statements are quoted in `excerpts/mathlib-*.txt` with the hash of each file at the pin; `node scripts/formal.mjs --verify` refetches them. A link says Mathlib proves the quoted statement, which its CI type-checked at that commit; the grade of how it bears on the entry is a judgment, like an audit grade. `reports/FORMAL-QUEUE.md` lists unreviewed name matches still to be read, and `lean/WISHLIST.md` what the claims need from Mathlib and do not find there.", "",
    "`lean/` is a Lean 4 project on the same pinned Mathlib. It states and proves claims of entries that Mathlib does not cover, over definitions of its own. `mapfill/lean.js` registers each definition with receipts from its source and each claim with the entry, field and invariant it bears on. Whether a claim is proved or only stated is read from Lean itself: `node scripts/lean.mjs --audit` runs `#print axioms` (a proof that uses `sorry` is only stated) and lists the definitions each statement depends on, all of which must be receipted; the result is `lean/AUDIT.json`, which CI regenerates after `lake build` and compares. A proved exact claim makes its invariant claim, or its whole field, formal. To build: `cd lean && lake exe cache get && lake build`.", "",
    "## Audit", "",
    "`audit.json` holds field-by-field grades (confirmed, imprecise, wrong, unsupported) against cited sources: a fixed random sample, kept for unbiased error rates, and targeted grades for entries chosen for use (composites) or for citation (entries with a Mathlib counterpart), kept out of the estimates. Entries found misaligned are flagged with their evidence (`mapfill/flags.js`).", "",
    "## Layout", "",
    "Sources, edited by hand and checked:", "",
    "- `source/math_map.md`: the map as landed, verbatim. `source/Category_Theory_Transformation_Enumeration.pdf`: the report the D7 names come from.",
    "- `mapfill/`: the fill layer (clone resolution, authored fills, missing homes, flags), the additions (`mapfill/additions.js`), conditions, the invariant vocabulary, and the Mathlib links (`mapfill/formal.js`). See `mapfill/README.md`.",
    "- `audit/`: the fixed sample, its grades, and the targeted receipts.",
    "- `excerpts/`: the verbatim windows that receipt the additions, each with its source URL and the hash of the page or PDF as fetched. Quoted for reference; the sources keep their own licences.",
    "- `scripts/`: the parser and query tool (`mathmap.mjs`), the composition checker (`compose.mjs`), the evidence levels (`evidence.mjs`), the Mathlib links (`formal.mjs`), the excerpt maker (`excerpt.mjs`), the MCP server (`mcp.mjs`), the Guardians export (`export-guardians.mjs`), the topology of the typed map (`topology.mjs`), the free typing pass (`type-lexicon.mjs`), the gap finder (`gaps.mjs`), the deformation generator (`deform.mjs`: exact Lie algebra cohomology, integration and contraction, with its algebras and rounds in `deform-algebras.mjs`); the HISTORY-001 round, retrodicting paradigm transitions under pre-registered controls, in `deform-history.mjs`), the audit (`audit.mjs`), this build (`build.mjs`), and the gate (`check-all.mjs`). Node 18 or later, no dependencies.",
    "- `.infra/`: the vendored [Repo-Infrastructure](https://github.com/A-Viable-Fork/Repo-Infrastructure) kit, pinned by `infra.lock.json` and configured by `infra.json`. `node .infra/run.mjs` runs its checks, and `check-all.mjs` runs it. `repo-map-manifest.json` describes every directory and every file that has no Role header.", "",
    "Generated by `node scripts/build.mjs`, never edited by hand:", "",
    `- \`map.json\`: every entry, machine-readable. \`domains/D1.md\` to \`domains/${Object.keys(P.domains).at(-1)}.md\`: the same, readable. \`audit.json\`: the grades with their quotes and sources.`,
    "- `README.md`, this design, and `STATUS.md`, what the map holds as counts from its data, dated by the commit it was built from.",
    "- `reports/MATHMAP.md` and `reports/AUDIT.md`: data quality and error rates (written by `mathmap.mjs` and `audit.mjs`).",
    "- `MANIFEST.json` and `SHA256SUMS`: the source commit and file hashes, so an answer that cites this map can cite the exact version.", "",
    "Generated by `node .infra/tools/repo-map.mjs`: `REPO-MAP.md`, every directory and file with a one-line description, and the edges between files (imports, and paths a file names). The kit's `repomap` check fails when a file is undescribed or the map is stale.", "",
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
  // STATUS.md: what the map holds, derived from the data at the commit the build ran on. Dated by that commit.
  const A = require("../mapfill/android.js"), N = require("../mapfill/nixos.js"), FL = require("../mapfill/flags.js").FLAGS;
  const commitDate = (() => { try { return execFileSync("git", ["log", "-1", "--format=%cs", "HEAD"], { cwd: ROOT }).toString().trim(); } catch { return "unknown"; } })();
  const kv = (o) => Object.entries(o).map(([k, v]) => `${k} ${v}`).join(", ");
  const added = P.addedDomains.map((d) => `${d.id} (${d.name.toLowerCase()})`).join(", ");
  files["STATUS.md"] = [
    "# Status", "",
    `What the map holds against the design in \`README.md\`, as of ${commitDate} (built from commit ${commit}). Generated by \`node scripts/build.mjs\` from the data; never edited by hand.`, "",
    "## Entries", "",
    `${map.counts.entries} entries in ${Object.keys(P.domains).length} domains: the ${Object.keys(P.declared).length} the landed map declares, and ${added}, added in \`mapfill/domains.js\`. ${map.counts.anchorable} have full types and invariants.`, "",
    "| Axis | Counts |", "|---|---|",
    `| Origin | ${kv(map.counts.byOrigin)} |`,
    `| Tier | ${kv(map.counts.byTier)} |`,
    `| Field evidence | ${LEVELS.map((l) => `${l} ${map.counts.fieldEvidence[l]}`).join(", ")} |`,
    `| Invariant-claim evidence | ${LEVELS.map((l) => `${l} ${map.counts.claimEvidence[l]}`).join(", ")} |`, "",
    `Conditions: ${map.counts.withConditions} entries. Corrections: ${map.counts.corrected} entries. Flags: ${FL.length} recorded, ${entries.filter((e) => e.flagResolved).length} resolved by corrections, ${entries.filter((e) => e.flag).length} still withheld.`, "",
    `Named invariants: ${P.vocabulary.INVARIANTS.length} in the vocabulary, linked to ${new Set(P.vocabulary.LINKS.map((l) => l.entry)).size} entries.`, "",
    "## Audit", "",
    `${GRADES.length} entries in the fixed random sample (seed ${audit.sample.seed}), ${TARGETED.length} targeted grades. Error rates are in \`reports/AUDIT.md\`.`, "",
    "## Formal links", "",
    `Mathlib pinned at \`${P.formal.mathlib.commit}\`: ${map.counts.formal.links} links on ${map.counts.formal.entries} entries (${kv(map.counts.formal.byMatch)}).`, "",
    `Lean (${map.counts.lean.toolchain}): ${map.counts.lean.claims} claims on ${map.counts.lean.entries} entries, ${map.counts.lean.proved} proved and ${map.counts.lean.stated} stated, over ${map.counts.lean.definitions} receipted definitions.`, "",
    "## Platform bindings", "",
    `Android: ${A.BINDINGS.length} bindings at AOSP \`${A.PIN.tag}\` (build ${A.PIN.buildId}), over ${A.SOURCES.length} hashed source files, from round ${A.PIN.round}.`, "",
    `NixOS: ${N.BINDINGS.length} bindings at nixpkgs \`${N.PIN.nixpkgs.slice(0, 7)}\` (${N.PIN.branch}, kernel ${N.PIN.kernel}, systemd ${N.PIN.systemd}), over ${N.SOURCES.length} hashed source files, from round ${N.PIN.round}.`, "",
    "## Owed", "",
    `- ${map.counts.byTier.authored ?? 0} authored fills and ${map.counts.byTier.generated ?? 0} generated entries not yet reviewed against sources; ${map.counts.fieldEvidence.unchecked} fields unchecked.`,
    `- ${map.counts.fieldEvidence.unsupported} fields unsupported and ${map.counts.fieldEvidence.imprecise} imprecise, awaiting a source or a correction.`,
    "- Unreviewed Mathlib name matches: `reports/FORMAL-QUEUE.md`. Notions Mathlib lacks: `lean/WISHLIST.md`.",
    "- No binding is a device or host test.", "",
  ].join("\n");
  const manifest = { builtFrom: commit, files: Object.fromEntries(Object.keys(files).sort().map((f) => [f, sha(files[f])])) };
  files["MANIFEST.json"] = JSON.stringify(manifest, null, 1) + "\n";
  files["SHA256SUMS"] = Object.entries(manifest.files).map(([f, h]) => `${h}  ${f}`).join("\n") + "\n";
  return files;
}


// The commit stamp names the commit the build ran on (the parent of the commit that carries the output),
// or "unknown" outside a git checkout; STATUS.md is dated by that commit. A freshness check ignores both.
const unstamp = (t) => t.replace(/as of \d{4}-\d{2}-\d{2}|as of unknown/g, "as of DATE").replace(/\b[0-9a-f]{64}\b/g, "HASH").replace(/\b[0-9a-f]{40}\b|\bunknown\b/g, "COMMIT");

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
