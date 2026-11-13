// Role: the landed review's check, blind draw and report, called by scripts/audit.mjs. Grades of the landed entries
//   (origin map, tier landed) field by field under the strict rule, in batches of 25, domain by domain.
// Contract: exports ORDER (the domains in review order), population(P) (the landed entries under review, in order),
//   checkLanded() (failures, as strings), drawBlind(round) (the items of a blind round, recomputed from its seed),
//   packet(round) (the blind packet's text) and renderLanded() (reports/LANDED-REVIEW.md). Reads
//   audit/landed-review-0_1.js, its recall and blind files, mapfill/corrections.js, flags.js, formal.js and
//   alignment.js.
// Invariant: read-only over the map and the review; a grade is a claim about an entry and never edits it. The
//   population is fixed by origin, not tier, so an entry stays in it once graded.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
export const ORDER = ["D2", "D4", "D1", "D3", "D5", "D6", "D8"];
const FIELDS = ["name", "description", "input", "output", "preserved", "broken"];
const VERDICTS = ["confirmed", "imprecise", "wrong", "unsupported"];
const MATCHES = ["exact", "general", "special", "related", "ingredient", "conflicts"];
const BLIND_N = 15, BLIND_EVERY = 5, BLIND_FLOOR = 0.9, SEED = 20261113;
const load = () => ({ ...require("../audit/landed-review-0_1.js"), ...require("../audit/landed-review-recall-0_1.js"), ...require("../audit/landed-review-blind-0_1.js") });

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function pick(r, arr, n) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); }

// Entries graded elsewhere (the sample, the targeted receipts, the fill review) and held misalignment leads are out;
// a flagged entry is out unless this review flagged it.
export function population(P = parse(), reviewed = new Set(load().REVIEW.map((g) => g.id))) {
  const other = new Set([...require("../audit/grades-0_1.js").GRADES, ...require("../audit/targeted-0_1.js").TARGETED, ...require("../audit/fill-review-0_1.js").REVIEW.flatMap((g) => [g, ...(g.covers || []).map((id) => ({ id }))])].map((g) => g.id));
  const held = new Set(require("../mapfill/alignment.js").HELD.map((h) => h.id));
  return P.entries.filter((e) => e.origin === "map" && ORDER.includes(e.domain) && !other.has(e.id) && !held.has(e.id) && ((!e.flag && !e.flagResolved) || reviewed.has(e.id)))
    .sort((a, b) => ORDER.indexOf(a.domain) - ORDER.indexOf(b.domain) || a.id.localeCompare(b.id));
}

export function drawBlind(round, R = load().REVIEW) {
  const after = round * BLIND_EVERY;
  const frame = R.filter((g) => g.batch < after).flatMap((g) => FIELDS.map((f) => `${g.id}.${f}`));
  return pick(rng(SEED + round), frame, BLIND_N);
}

export function packet(round, P = parse()) {
  const { REVIEW } = load(), byId = Object.fromEntries(P.entries.map((e) => [e.id, e])), gOf = Object.fromEntries(REVIEW.map((g) => [g.id, g]));
  const L = [`# Landed review, blind round ${round}`, "", `*Written by \`node scripts/audit.mjs --landed-draw ${round}\`. Each item is one field of a landed entry with the excerpt files its grade may use; the first grade, quote and note are not shown.*`, "",
    "Rule [ruling: operator, 2026-11-13]: **confirmed** only when a quoted window states the field's claim itself, not merely names the object; a claim with several parts is confirmed only if every part is quoted, otherwise **imprecise** (say which part) or **unsupported**. **wrong** when a window contradicts it. Grade the landed text, not a correction.", ""];
  for (const key of drawBlind(round)) {
    const [id, f] = key.split("."), e = byId[id], landed = (k) => (e.corrected?.includes(k) ? e.landedFields[k] : e[k]);
    L.push(`## ${key}`, "", `- Entry: ${id} ${e.name}`, `- Field **${f}**: ${f === "name" ? e.name : landed(f)}`,
      `- Whole entry as landed: description: ${landed("description")} | input: ${landed("input")} | output: ${landed("output")} | preserved: ${landed("preserved")} | broken: ${landed("broken")}`,
      `- Excerpt files: ${Object.values(gOf[id].files).map((x) => `\`${x}\``).join(", ")}`, "");
  }
  return L.join("\n");
}

export function checkLanded() {
  const F = [];
  const { REVIEW, RECALL, ROUNDS, DOMAINS } = load();
  const P = parse(), byId = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const reviewed = new Set(REVIEW.map((g) => g.id)), pop = population(P, reviewed);
  const { CORRECTIONS } = require("../mapfill/corrections.js"), { FORMAL } = require("../mapfill/formal.js");
  const flags = new Set(require("../mapfill/flags.js").FLAGS.map((f) => f.id));
  const corr = Object.fromEntries(CORRECTIONS.map((c) => [c.id, c]));
  const recall = new Map(), seen = new Set();
  for (const k of RECALL) { if (recall.has(k.id)) F.push(`landed recall ${k.id}: given twice`); recall.set(k.id, k); for (const f of FIELDS) if (!k[f] || !String(k[f]).trim()) F.push(`landed recall ${k.id}: no recalled ${f}`); }
  // Reviewed entries are a prefix of the population in order: no entry skipped, none out of turn.
  REVIEW.forEach((g, i) => { if (pop[i]?.id !== g.id) F.push(`landed ${g.id}: out of order (expected ${pop[i]?.id ?? "nothing"} at position ${i + 1})`); });
  const header = {};
  const urlOf = (file) => { if (!(file in header)) { try { header[file] = readFileSync(join(ROOT, file), "utf8").match(/^URL: (\S+)$/m)?.[1] ?? null; } catch { header[file] = undefined; } } return header[file]; };
  let lastBatch = 0;
  REVIEW.forEach((g, i) => {
    const at = `landed ${g.id}`, e = byId[g.id];
    if (!e) { F.push(`${at}: no such entry`); return; }
    if (e.origin !== "map") F.push(`${at}: the review grades landed entries; this entry's origin is ${e.origin}`);
    if (seen.has(g.id)) F.push(`${at}: reviewed twice`); seen.add(g.id);
    if (!Number.isInteger(g.batch) || g.batch < lastBatch) F.push(`${at}: batch ${g.batch} out of order`); lastBatch = g.batch;
    if (!g.why) F.push(`${at}: needs a why`);
    const rc = recall.get(g.id);
    if (!rc) F.push(`${at}: no recalled expectation on record`); else if (rc.batch !== g.batch) F.push(`${at}: recall and review disagree on the batch`);
    for (const [k, file] of Object.entries(g.files || {})) {
      const u = urlOf(file);
      if (u === undefined) F.push(`${at}: no excerpt file ${file}`);
      else if (!g.sources?.[k] || g.sources[k] !== u) F.push(`${at}: source ${k} must be ${file}'s URL (${u})`);
    }
    for (const f of FIELDS) {
      const v = g.fields?.[f];
      if (!v) { F.push(`${at}: no grade for ${f}`); continue; }
      if (!VERDICTS.includes(v.verdict)) F.push(`${at}.${f}: bad verdict ${v.verdict}`);
      for (const x of [v, ...(v.more || [])]) if (v.verdict !== "unsupported" && !(x.src && g.files?.[x.src] && x.quote)) F.push(`${at}.${f}: a ${v.verdict} grade needs an excerpt file and a quote for each receipt`);
      for (const x of v.against || []) if (!(x.src && g.files?.[x.src] && x.quote)) F.push(`${at}.${f}: a disagreeing source needs an excerpt file and a quote`);
      if (v.against?.length && !v.note) F.push(`${at}.${f}: a grade with a disagreeing source needs a note recording both`);
      if (v.verdict === "unsupported" && (v.quote || v.more)) F.push(`${at}.${f}: an unsupported grade carries no quote`);
      if (v.verdict !== "confirmed" && !v.note) F.push(`${at}.${f}: a ${v.verdict} grade needs a note`);
      if (/[–—]/.test(v.note || "")) F.push(`${at}.${f}: an en or em dash in the note`);
      // Wrong or imprecise content is corrected (receipted, landed text kept) or the entry is flagged.
      if (f !== "name" && ["imprecise", "wrong"].includes(v.verdict) && !(corr[g.id]?.fields?.[f]) && !flags.has(g.id)) F.push(`${at}.${f}: graded ${v.verdict} with no correction in mapfill/corrections.js and no flag`);
    }
    for (const f of g.contra || []) { if (!FIELDS.includes(f)) F.push(`${at}: contra names ${f}`); else if (g.fields?.[f]?.verdict === "unsupported") F.push(`${at}: contra ${f}, but no source settled the field`); }
    const links = FORMAL.filter((k) => k.entry === g.id);
    if (!links.length && !g.mathlib) F.push(`${at}: no Mathlib link and no note of what was searched at the pin`);
    for (const k of links) if (!MATCHES.includes(k.match)) F.push(`${at}: link ${k.decl} has match ${k.match}`);
    if ((i + 1) % 10 === 0) {
      const z = g.falsify;
      if (!z || !FIELDS.includes(z.field) || !z.claim || !z.attempt || !["survived", "falsified"].includes(z.outcome)) F.push(`${at}: the ${i + 1}th entry needs a falsification attempt (field, claim, attempt, outcome)`);
      else if (z.outcome === "falsified" && !["imprecise", "wrong"].includes(g.fields?.[z.field]?.verdict)) F.push(`${at}: falsified ${z.field}, but the grade is ${g.fields?.[z.field]?.verdict}`);
    } else if (g.falsify) F.push(`${at}: a falsification attempt on an entry that is not a tenth`);
  });
  // Recall may run one batch ahead of the review: the batch whose recall is committed and whose grades are not.
  const pending = Math.max(0, ...RECALL.map((k) => k.batch));
  for (const k of RECALL) if (!seen.has(k.id) && !(k.batch === pending && pending > lastBatch)) F.push(`landed recall ${k.id}: no review on record`);
  const order = [...REVIEW.map((g) => g.id), ...RECALL.filter((k) => !seen.has(k.id)).map((k) => k.id)];
  order.forEach((id, i) => { if (pop[i]?.id !== id) F.push(`landed recall ${id}: out of order`); });
  for (const b of [...new Set(REVIEW.map((g) => g.batch))]) { const n = REVIEW.filter((g) => g.batch === b).length; if (n > 25) F.push(`landed batch ${b}: ${n} entries (at most 25)`); }
  // Blind rounds: one after every fifth batch, before the next batch's grades.
  const rounds = new Map(ROUNDS.map((x) => [x.round, x]));
  for (let n = 1; n * BLIND_EVERY <= lastBatch; n++) if (!rounds.has(n) && lastBatch > n * BLIND_EVERY) F.push(`landed blind round ${n}: due after batch ${n * BLIND_EVERY}, before batch ${n * BLIND_EVERY + 1}`);
  for (const x of ROUNDS) {
    const items = drawBlind(x.round, REVIEW), got = Object.keys(x.grades || {});
    if (x.after !== x.round * BLIND_EVERY) F.push(`landed blind round ${x.round}: after must be ${x.round * BLIND_EVERY}`);
    if (!x.reader || !x.drawn) F.push(`landed blind round ${x.round}: needs a reader and a date`);
    if (items.length !== got.length || items.some((k) => !got.includes(k))) F.push(`landed blind round ${x.round}: grades must cover exactly the drawn items (${items.join(", ")})`);
    for (const [k, v] of Object.entries(x.grades || {})) { if (!VERDICTS.includes(v.verdict)) F.push(`landed blind ${k}: bad verdict`); if (/[–—]/.test(v.note || "")) F.push(`landed blind ${k}: an en or em dash in the note`); }
    const a = agreement(x, REVIEW);
    if (a.rate < BLIND_FLOOR && !(x.slipped && x.regraded?.length)) F.push(`landed blind round ${x.round}: agreement ${a.same}/${a.n} is under ${BLIND_FLOOR * 100}%; record what slipped and re-grade the affected batches`);
  }
  for (const [d, v] of Object.entries(DOMAINS)) {
    if (!ORDER.includes(d)) F.push(`landed domain ${d}: not reviewed here`);
    if (!["confirmed sound", "marginal", "needs refinement", "dead"].includes(v.verdict) || !v.note || !Array.isArray(v.fields)) F.push(`landed domain ${d}: needs a verdict (confirmed sound, marginal, needs refinement, dead), the fields carrying the damage and a note`);
    if (pop.some((e) => e.domain === d && !seen.has(e.id))) F.push(`landed domain ${d}: a verdict before every entry is graded`);
    if (/[–—]/.test(v.note || "")) F.push(`landed domain ${d}: an en or em dash in the note`);
  }
  return F;
}

function agreement(x, REVIEW) {
  const gOf = Object.fromEntries(REVIEW.map((g) => [g.id, g]));
  const rows = Object.entries(x.grades || {}).map(([k, v]) => { const [id, f] = k.split("."); return { k, first: gOf[id]?.fields?.[f]?.verdict, again: v.verdict, note: v.note }; });
  const same = rows.filter((r) => r.first === r.again).length;
  return { rows, same, n: rows.length, rate: rows.length ? same / rows.length : 1 };
}

export function renderLanded() {
  const { REVIEW, RECALL, ROUNDS, DOMAINS } = load();
  const P = parse(), byId = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const pop = population(P);
  const { CORRECTIONS } = require("../mapfill/corrections.js"), { FORMAL, LANDED = [] } = require("../mapfill/formal.js");
  const { FLAGS } = require("../mapfill/flags.js");
  const rc = Object.fromEntries(RECALL.map((k) => [k.id, k])), ids = new Set(REVIEW.map((g) => g.id));
  let sec = 0; const H = (t) => `## ${++sec}. ${t}`;
  const L = ["# Landed review, version 0.1", "", "*Generated by `scripts/audit.mjs` from `audit/landed-review-0_1.js`, `audit/landed-review-recall-0_1.js` and `audit/landed-review-blind-0_1.js`. Do not edit by hand.*", ""];
  L.push("The landed entries (origin map, tier landed: as written, never reviewed) graded field by field against sources, in batches of 25, domain by domain in the order D2, D4, D1, D3, D5, D6, D8 and by id inside a domain. Entries already audited, flagged or held as misalignment leads are skipped. Sources in order of preference: Mathlib at the pin, the nLab, Wikipedia at a pinned revision, arXiv; every confirmed, imprecise or wrong grade quotes a verbatim window of an excerpt file (`excerpts/`), checked by `scripts/mathmap.mjs --check`.", "",
    "The strict rule [ruling: operator, 2026-11-13]: **confirmed** only when a quoted window states the field's claim itself, not merely names the object; a claim with several parts is confirmed only when every part is quoted. **imprecise**: right idea with a part unquoted or a detail off (the note names it); **wrong**: a window contradicts it; **unsupported**: no window states it. Every imprecise or wrong content field carries a receipted correction in `mapfill/corrections.js` (the landed text kept beside it) or a flag. Before each batch's sources were read, the reviewer committed what each field should be (`audit/landed-review-recall-0_1.js`, recalled: a lead, never evidence).", "");
  const doms = ORDER.filter((d) => REVIEW.some((g) => byId[g.id].domain === d));
  L.push(`Graded: ${REVIEW.length} of ${pop.length} entries in ${new Set(REVIEW.map((g) => g.batch)).size} batches. By domain: ${ORDER.map((d) => `${d} ${REVIEW.filter((g) => byId[g.id].domain === d).length} of ${pop.filter((e) => e.domain === d).length}`).join(", ")}.`, "");
  const pend = RECALL.filter((k) => !ids.has(k.id));
  if (pend.length) L.push(`Recall committed, grades pending: batch ${pend[0].batch} (${pend.map((k) => k.id).join(", ")}).`, "");
  L.push(H("Verdicts by field"), "", "Each domain's fields, counted by verdict.", "");
  const table = (label, gs) => {
    if (!gs.length) return;
    L.push(`### ${label} (${gs.length} entries)`, "", "| Field | Confirmed | Imprecise | Wrong | Unsupported |", "|---|---|---|---|---|");
    for (const f of FIELDS) L.push(`| ${f} | ${VERDICTS.map((v) => gs.filter((g) => g.fields[f].verdict === v).length).join(" | ")} |`);
    const all = gs.flatMap((g) => FIELDS.map((f) => g.fields[f].verdict));
    L.push(`| **all** | ${VERDICTS.map((v) => all.filter((x) => x === v).length).join(" | ")} |`, "");
  };
  for (const d of doms) table(`${d}, ${P.domains[d].name}`, REVIEW.filter((g) => byId[g.id].domain === d));
  if (doms.length > 1) table("All domains", REVIEW);
  L.push(H("By batch"), "", "Per batch: imprecise and wrong fields found, scaled to 25 entries, and the share of fields a source settled (any verdict but unsupported) whose recalled expectation the source contradicted. A falling find rate with no change in the domain's difficulty is a signal to slow down.", "",
    "| Batch | Domain | Entries | Imprecise | Wrong | Per 25 entries | Entries with a finding | Fields settled | Recall contradicted | Rate |", "|---|---|---|---|---|---|---|---|---|---|");
  for (const b of [...new Set(REVIEW.map((g) => g.batch))].sort((a, b) => a - b)) {
    const gs = REVIEW.filter((g) => g.batch === b), n = (v) => gs.reduce((s, g) => s + FIELDS.filter((f) => g.fields[f].verdict === v).length, 0);
    const s = gs.reduce((t, g) => t + FIELDS.filter((f) => g.fields[f].verdict !== "unsupported").length, 0), c = gs.reduce((t, g) => t + g.contra.length, 0);
    const hit = gs.filter((g) => FIELDS.some((f) => ["imprecise", "wrong"].includes(g.fields[f].verdict))).length;
    L.push(`| ${b} | ${[...new Set(gs.map((g) => byId[g.id].domain))].join(", ")} | ${gs.length} | ${n("imprecise")} | ${n("wrong")} | ${((25 * (n("imprecise") + n("wrong"))) / gs.length).toFixed(1)} | ${hit} | ${s} | ${c} | ${s ? `${Math.round((100 * c) / s)}%` : "-"} |`);
  }
  L.push("");
  L.push(H("Blind re-grades"), "", `After every fifth batch, ${BLIND_N} fields drawn at random (seed ${SEED} + round) from the earlier batches are graded again from the landed text and excerpt files, without reading the first verdict. The reader is the first grader, so blind means the first verdict was not read again, not that it was forgotten. Under ${BLIND_FLOOR * 100}% agreement the review stops until the affected batches are re-graded.`, "");
  if (!ROUNDS.length) L.push("No round yet.", "");
  for (const x of ROUNDS) {
    const a = agreement(x, REVIEW);
    L.push(`### Round ${x.round}, after batch ${x.after} (${x.drawn})`, "", `Agreement: ${a.same} of ${a.n} (${Math.round(100 * a.rate)}%). Reader: ${x.reader}.`, "");
    for (const r of a.rows.filter((r) => r.first !== r.again)) L.push(`- ${r.k}: first ${r.first}, again ${r.again}${r.note ? `: ${r.note}` : ""}`);
    if (x.slipped) L.push("", `What slipped: ${x.slipped}`, `Re-graded: batches ${x.regraded.join(", ")}.`);
    L.push("");
  }
  L.push(H("Falsification attempts"), "", "Every tenth entry: its most specific claim (a hypothesis, a formula, an attribution), tried against the sources before grading.", "");
  for (const g of REVIEW.filter((g) => g.falsify)) L.push(`- **${g.id} ${byId[g.id].name}**, ${g.falsify.field}: ${g.falsify.claim} *Attempt:* ${g.falsify.attempt} *Outcome:* ${g.falsify.outcome}.`);
  L.push("");
  L.push(H("Findings"), "", "Corrections, flags and Mathlib conflicts on reviewed entries.", "");
  const cs = CORRECTIONS.filter((c) => ids.has(c.id));
  L.push(`### Corrections (${cs.length} entries, ${cs.reduce((n, c) => n + Object.keys(c.fields).length, 0)} fields)`, "");
  for (const c of cs) L.push(`- **${c.id} ${c.name}** (${Object.keys(c.fields).join(", ")}): ${c.reason}`);
  const fs = FLAGS.filter((f) => ids.has(f.id));
  L.push("", `### Flags (${fs.length})`, "", ...(fs.length ? fs.map((f) => `- **${f.id} ${f.name}**, ${f.kind}: ${f.evidence}`) : ["None."]));
  const cf = FORMAL.filter((k) => ids.has(k.entry) && k.match === "conflicts");
  L.push("", `### Mathlib conflicts (${cf.length})`, "", ...(cf.length ? cf.map((k) => `- **${k.entry}** ${k.field}, \`${k.decl}\`: ${k.note}`) : ["None."]), "");
  L.push(H("Formal links added"), "", "Links this review added in `mapfill/formal.js` (its LANDED list), by match grade, and the entries with none and what was searched at the pin.", "", "| Match | Links |", "|---|---|");
  for (const m of MATCHES) L.push(`| ${m} | ${LANDED.filter((k) => k.match === m).length} |`);
  L.push(`| **all** | ${LANDED.length} on ${new Set(LANDED.map((k) => k.entry)).size} entries |`, "");
  const none = REVIEW.filter((g) => g.mathlib && !FORMAL.some((k) => k.entry === g.id));
  if (none.length) L.push(`No link (${none.length}):`, "", ...none.map((g) => `- ${g.id} ${byId[g.id].name}: ${g.mathlib}`), "");
  if (Object.keys(DOMAINS).length) {
    L.push(H("Domains as landed"), "", "A graded verdict on each finished domain (confirmed sound, marginal, needs refinement, dead), naming the fields that carry the damage.", "");
    for (const [d, v] of Object.entries(DOMAINS)) L.push(`- **${d}, ${P.domains[d].name}: ${v.verdict}.** Damage in: ${v.fields.join(", ") || "none"}. ${v.note}`);
    L.push("");
  }
  L.push(H("Receipts"), "");
  for (const g of REVIEW) {
    L.push(`### ${g.id} ${byId[g.id].name} (batch ${g.batch})`, "");
    for (const f of FIELDS) {
      const v = g.fields[f], rs = [v, ...(v.more || [])].filter((x) => x.quote).map((x) => `[${x.src}] "${x.quote}"`).join(" ") + (v.against?.length ? ` Against: ${v.against.map((x) => `[${x.src}] "${x.quote}"`).join(" ")}` : "");
      const landed = f === "name" ? byId[g.id].name : byId[g.id].corrected?.includes(f) ? byId[g.id].landedFields[f] : byId[g.id][f];
      L.push(`- ${f} (landed: ${landed}): **${v.verdict}**${rs ? ` ${rs}` : ""}${v.note ? ` *${v.note}*` : ""}${g.contra.includes(f) ? " (recall contradicted)" : ""}`);
    }
    if (rc[g.id]) L.push(`- recalled: ${FIELDS.map((f) => `${f}: ${rc[g.id][f]}`).join("; ")}`);
    for (const k of FORMAL.filter((k) => k.entry === g.id)) L.push(`- mathlib (${k.match}, ${k.field}): \`${k.decl}\`. ${k.note}`);
    if (g.mathlib && !FORMAL.some((k) => k.entry === g.id)) L.push(`- mathlib: none. ${g.mathlib}`);
    L.push("", ...Object.entries(g.files).map(([k, file]) => `  ${k}: ${file} (${g.sources[k]})`), "");
  }
  return L.join("\n");
}
