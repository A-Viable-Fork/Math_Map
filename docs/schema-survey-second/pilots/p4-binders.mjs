// Role: pilot 4 of the schema survey (candidate G31, binder-level alignment). Reads the hypotheses of every
//   Mathlib declaration the map links exact, special or general, maps each to a predicate word, and reports the
//   hypotheses the linked entry never states: leads for omitted conditions.
// Contract: `node p4-binders.mjs --build <dir of Mathlib files at the pin, named Mathlib.A.B.lean>` parses the
//   files (each checked against the sha256 the map's excerpt records) and writes p4-binders.rows.json.
//   `node p4-binders.mjs` rereads that file, rechecks each row's "stated" verdict against map.json, and prints
//   the tally. A row is { entry, field, decl, match, binder, source: variable|signature, predicate, stated }.
// Invariant: read-only on the map. A lead is a binder with no matching word in the entry; reading settles it
//   (the `reading` field, filled by hand for the rows read). The scope tracking is a heuristic: a `variable`
//   binder counts when one of its arguments is named in the declaration's statement.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { ROOT, HERE, map, entry } from "./lib.mjs";

// Hypothesis-like classes and predicates, each with the words that would state it in an entry.
const LEX = [
  [/\b(Fintype|Finite|Finset|Set\.Finite)\b/, "finite", /\bfinite|finitely|\bn\b|n x n|matrix|polynomial/i],
  [/\bInfinite\b/, "infinite", /infinite/i],
  [/\bCountable|Encodable\b/, "countable", /countabl/i],
  [/\bNonempty\b/, "nonempty", /non-?empty|inhabited/i],
  [/\bNontrivial\b/, "nontrivial", /non-?trivial|nonzero/i],
  [/\bCompactSpace|IsCompact\b/, "compact", /compact/i],
  [/\bLocallyCompactSpace\b/, "locally-compact", /locally compact/i],
  [/\bT2Space\b/, "hausdorff", /hausdorff|\bT2\b|separated/i],
  [/\bT1Space\b/, "t1", /\bT1\b/i],
  [/\b(NormalSpace|RegularSpace|T3Space|T4Space)\b/, "regular-or-normal", /regular|normal/i],
  [/\bSecondCountableTopology|SeparableSpace\b/, "second-countable-or-separable", /second.countable|separable/i],
  [/\bCompleteSpace\b/, "complete", /complete/i],
  [/\bIsNoetherianRing|IsNoetherian\b/, "noetherian", /noetherian/i],
  [/\bIsArtinianRing|IsArtinian\b/, "artinian", /artinian/i],
  [/\bIsDomain|NoZeroDivisors\b/, "domain", /domain|no zero.divisors|integral/i],
  [/\bCharZero\b/, "char-zero", /characteristic (zero|0)|char(acteristic)? 0/i],
  [/\b(CharP|ExpChar)\b/, "char-p", /characteristic/i],
  [/\bPerfectField\b/, "perfect-field", /perfect/i],
  [/\bIsAlgClosed\b/, "algebraically-closed", /algebraically closed/i],
  [/\bIsSeparable\b/, "separable", /separable/i],
  [/\bIsGalois\b/, "galois", /galois/i],
  [/\b(FiniteDimensional|Module\.Finite)\b/, "finite-dimensional", /finite.dimensional|finitely generated|finite rank|finite/i],
  [/\bModule\.Free\b/, "free-module", /free/i],
  [/\bModule\.Flat\b/, "flat", /flat/i],
  [/\bIsLocalRing\b/, "local-ring", /local ring|local/i],
  [/\bIsPrincipalIdealRing\b/, "pid", /principal|PID/],
  [/\bIsDedekindDomain\b/, "dedekind", /dedekind/i],
  [/\bUniqueFactorizationMonoid\b/, "ufd", /unique factori[sz]ation|UFD/i],
  [/\bIsIntegrallyClosed\b/, "integrally-closed", /integrally closed|normal/i],
  [/\b(SigmaFinite|SFinite)\b/, "sigma-finite", /sigma.finite|σ-finite|s-finite/i],
  [/\b(IsFiniteMeasure|IsProbabilityMeasure)\b/, "finite-measure", /finite measure|probability/i],
  [/\b(HasLimits|HasLimitsOfSize|HasLimitsOfShape|HasFiniteLimits|HasPullbacks|HasProducts|HasFiniteProducts|HasEqualizers|HasBinaryProducts|HasTerminal)\b/, "has-limits", /limit|complete|pullback|product|equali[sz]er|terminal/i],
  [/\b(HasColimits|HasColimitsOfSize|HasColimitsOfShape|HasFiniteColimits|HasPushouts|HasCoproducts|HasCoequalizers|HasFiniteCoproducts|HasInitial)\b/, "has-colimits", /colimit|cocomplete|pushout|coproduct|coequali[sz]er|initial/i],
  [/\bAbelian\b/, "abelian-category", /abelian/i],
  [/\b(Preadditive|HasZeroMorphisms|HasZeroObject)\b/, "additive-category", /additive|abelian|zero (object|morphism)|pointed/i],
  [/\b(EnoughProjectives|EnoughInjectives)\b/, "enough-projectives-or-injectives", /enough (projective|injective)/i],
  [/\b(IsFiltered|IsFilteredOrEmpty)\b/, "filtered", /filtered|directed/i],
  [/\b(Small|EssentiallySmall|LocallySmall|SmallCategory)\b/, "small", /small/i],
  [/\b(Mono|Epi|IsIso)\b/, "mono-epi-iso", /mono|epi|iso|injective|surjective/i],
  [/\b(Full|Faithful|FullyFaithful|IsEquivalence)\b/, "full-faithful", /full|faithful|equivalence|embedding/i],
  [/\b(PreservesLimits|PreservesFiniteLimits|PreservesLimitsOfShape|PreservesColimits|PreservesFiniteColimits)\b/, "preserves-limits", /preserv|exact|continuous/i],
  [/\b(Reflective|IsRightAdjoint|IsLeftAdjoint)\b/, "is-adjoint", /adjoint|reflect/i],
  [/\b(IsCyclic|IsSimpleGroup|IsSolvable|IsNilpotent)\b/, "group-property", /cyclic|simple|solvable|nilpotent/i],
  [/\.Normal\b/, "normal-subgroup", /normal/i],
  [/\b(IsKilling|IsSemisimple|HasTrivialRadical)\b/, "semisimple", /semi-?simple|killing/i],
  [/\b(WellFoundedLT|IsWellOrder|WellFoundedGT)\b/, "well-founded", /well.?(founded|order)|artinian|noetherian/i],
  [/\bLocallyFiniteOrder\b/, "locally-finite", /locally finite/i],
  [/\b(Continuous|ContinuousOn)\b/, "continuous", /continuous|homeomorphi|topolog/i],
  [/\b(Measurable|AEMeasurable|AEStronglyMeasurable)\b/, "measurable", /measurabl/i],
  [/\b(Integrable|IntegrableOn|MemLp|Memℒp)\b/, "integrable", /integrabl|L\^?[12p]|\bL1\b|\bL2\b/i],
  [/\bFunction\.Injective\b/, "injective", /injective|embedding|one-to-one|mono/i],
  [/\bFunction\.Surjective\b/, "surjective", /surjective|onto|epi|quotient/i],
  [/\b(Monotone|Antitone|StrictMono)\b/, "monotone", /monoton|antiton|order.(preserving|reversing)|increasing|decreasing/i],
  [/\b(IsOpen|IsClosed)\b/, "open-or-closed", /\bopen\b|\bclosed\b/i],
];

const fold = (s) => (s ?? "").normalize("NFKD");
const textOf = (e) => [e.name, e.description, e.input, e.output, e.preserved, e.broken, e.conditions, JSON.stringify(e.corrected?.landed ?? "")].map(fold).join(" | ");

// Splits a binder list into top-level bracketed groups.
function groups(s) {
  const out = []; let depth = 0, start = -1;
  const open = "([{⦃", close = ")]}⦄";
  for (let i = 0; i < s.length; i++) {
    if (open.includes(s[i])) { if (depth === 0) start = i; depth++; }
    else if (close.includes(s[i])) { depth--; if (depth === 0 && start >= 0) { out.push(s.slice(start, i + 1)); start = -1; } if (depth < 0) depth = 0; }
  }
  return out;
}
const idents = (s) => new Set((s.match(/[A-Za-zα-ωΑ-Ω𝕜][\w'₀-₉]*/gu) ?? []));

function build(dir) {
  const rows = [], stats = { links: 0, found: 0, hashOk: 0, files: new Set() };
  for (const e of map().entries) for (const k of e.formal ?? []) {
    if (!["exact", "special", "general"].includes(k.match)) continue;
    stats.links++;
    const dotted = k.file.replace(/\.lean$/, "").replace(/\//g, ".");
    const ex = join(ROOT, "excerpts", `mathlib-${dotted}.txt`), src = join(dir, `${dotted}.lean`);
    if (!existsSync(ex) || !existsSync(src)) continue;
    const exText = readFileSync(ex, "utf8"), srcText = readFileSync(src, "utf8");
    const want = exText.match(/SHA-256 of the file at that commit: ([0-9a-f]{64})/)?.[1];
    const sha = createHash("sha256").update(readFileSync(src)).digest("hex");
    if (want !== sha) continue;
    if (!stats.files.has(dotted)) { stats.files.add(dotted); stats.hashOk++; }
    // The statement as the map's excerpt holds it, and its line in the file.
    const esc = k.decl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const m = exText.match(new RegExp(`^-- ${esc} \\(line (\\d+)\\)\\n([\\s\\S]*?)(?=\\n-- |$)`, "m"));
    if (!m) continue;
    stats.found++;
    const line = +m[1], stmt = m[2].trim();
    // Variables in scope at that line: a stack of frames opened by section/namespace and closed by end.
    const lines = srcText.split("\n"); const frames = [[]];
    for (let i = 0; i < line - 1; i++) {
      const l = lines[i];
      if (/^\s*(noncomputable\s+|public\s+|@\[expose\]\s+)*(section|namespace)\b/.test(l)) frames.push([]);
      else if (/^\s*end\b/.test(l)) { if (frames.length > 1) frames.pop(); }
      else if (/^\s*variable\b/.test(l)) {
        let v = l; let j = i;
        while (j + 1 < line - 1 && /^\s+\S/.test(lines[j + 1]) && !/^\s*(theorem|lemma|def|instance|variable|section|namespace|end|open|@\[|\/--|--)/.test(lines[j + 1])) v += " " + lines[++j];
        frames[frames.length - 1].push(...groups(v.replace(/^\s*variable\s*/, "")));
      }
    }
    const head = stmt.split(/:=|\bwhere\b/)[0];
    const used = idents(head);
    const sigBinders = groups(head).map((b) => ({ b, source: "signature" }));
    const varBinders = frames.flat().filter((b) => b.startsWith("[")).filter((b) => [...idents(b.slice(1, -1).replace(/^[^:]*:/, ""))].some((x) => used.has(x) && x.length <= 3 || used.has(x) && /^[A-Zα-ω]/u.test(x) && x.length <= 2)).map((b) => ({ b, source: "variable" }));
    const txt = textOf(e);
    const seen = new Set();
    for (const { b, source } of [...sigBinders, ...varBinders]) {
      for (const [re, predicate, words] of LEX) {
        if (!re.test(b)) continue;
        const key = `${k.decl}|${predicate}`; if (seen.has(key)) continue; seen.add(key);
        rows.push({ entry: e.id, name: e.name, field: k.field, decl: k.decl, match: k.match, file: k.file, sha256: sha, line, binder: b.length > 140 ? b.slice(0, 140) + " ..." : b, source, predicate, stated: words.test(txt) });
      }
    }
  }
  return { rows, stats: { ...stats, files: stats.files.size } };
}

const READINGS = join(HERE, "p4-binders.readings.json");
const OUT = join(HERE, "p4-binders.rows.json");
const i = process.argv.indexOf("--build");
if (i >= 0) {
  const { rows, stats } = build(process.argv[i + 1]);
  writeFileSync(OUT, JSON.stringify({ about: "Pilot 4 rows: one per hypothesis-like binder of a linked Mathlib declaration. Generated by p4-binders.mjs --build; the receipt of a row is the binder text at the line and file hash given.", mathlib: "380f2aafb622cb2c1c93dac545b6389083c68c51", stats, rows }, null, 1) + "\n");
  console.log(`p4: built ${rows.length} rows from ${stats.found} of ${stats.links} links in ${stats.files} files (hashes reproduced)`);
}
const D = JSON.parse(readFileSync(OUT, "utf8"));
const R = existsSync(READINGS) ? JSON.parse(readFileSync(READINGS, "utf8")).readings : [];
// Recheck every "stated" verdict against the map as it is now.
let drift = 0;
for (const r of D.rows) { const [, , words] = LEX.find((x) => x[1] === r.predicate); if (words.test(textOf(entry(r.entry))) !== r.stated) drift++; }
const leads = D.rows.filter((r) => !r.stated);
const ents = new Set(D.rows.map((r) => r.entry)), leadEnts = new Set(leads.map((r) => r.entry));
console.log(`p4: ${D.rows.length} hypothesis binders on ${ents.size} entries (${D.stats.found} of ${D.stats.links} links parsed); stated by the entry ${D.rows.length - leads.length}, not stated ${leads.length} on ${leadEnts.size} entries; verdict drift against map.json ${drift}`);
const by = {}; for (const r of leads) by[r.predicate] = (by[r.predicate] ?? 0) + 1;
console.log("p4 leads by predicate: " + Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", "));
if (R.length) {
  const v = {}; for (const r of R) v[r.reading] = (v[r.reading] ?? 0) + 1;
  const known = new Set(leads.map((r) => `${r.entry}|${r.decl}|${r.predicate}`));
  const orphan = R.filter((r) => !known.has(`${r.entry}|${r.decl}|${r.predicate}`)).length;
  console.log(`p4 readings: ${R.length} leads read on ${new Set(R.map((r) => r.entry)).size} entries: ` + Object.entries(v).map(([k, n]) => `${k} ${n}`).join(", ") + `; readings matching no lead ${orphan}`);
}
if (process.argv.includes("--leads")) for (const r of leads) console.log(`${r.entry} ${r.name} | ${r.field} | ${r.match} | ${r.decl} | ${r.predicate} | ${r.source} | ${r.binder}`);
