// Role: the math map audit. Draws a fixed stratified sample of entries, checks the grades against it, and
//   renders reports/AUDIT.md: error rates by stratum and by field, with every grade's receipt.
// Contract: `node scripts/audit.mjs --draw` writes audit/sample-0_1.json once (refuses if it exists: the
//   sample is fixed before grading). `node scripts/audit.mjs` checks audit/grades-0_1.js against the sample
//   and writes the report, with the targeted receipts of audit/targeted-0_1.js (entries outside the sample,
//   receipted for a composite; kept out of the estimates); `--check` only checks; `--verify-quotes` also fetches every cited source and
//   confirms each quote occurs in it (network; not run in CI). Exit 1 on any failure. Also checks the fill
//   review (audit/fill-review-0_1.js, with its recall) and renders reports/FILL-REVIEW.md.
// Invariant: read-only over the map and the fills. A grade is a claim about an entry, receipted by a
//   verbatim quote at a URL; it never edits the entry. Pending grades are reported as pending, not as passes.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const SAMPLE = "audit/sample-0_1.json";
const SEED = 20260929;
const FIELDS = ["name", "description", "input", "output", "preserved", "broken"];
const VERDICTS = ["confirmed", "imprecise", "wrong", "unsupported"];

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function pick(r, arr, n) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); }

function draw() {
  const P = parse();
  const r = rng(SEED);
  const out = [];
  for (const d of ["D1", "D2", "D3", "D4", "D5", "D6", "D8"]) {
    // The pool as drawn: landed entries with types and an invariant field, before any flag was applied.
    const pool = P.entries.filter((e) => e.domain === d && e.origin === "map" && e.input && e.output && (e.preserved || e.broken) && !e.unknown).map((e) => e.id).sort();
    for (const id of pick(r, pool, 5)) out.push({ id, stratum: `landed-${d}` });
  }
  const homes = require("../mapfill/homes.js");
  const homeIds = new Set(homes.map((h) => h.id));
  const d7 = P.entries.filter((e) => e.origin === "fill" && e.domain === "D7" && !e.unknown && !homeIds.has(e.id)).map((e) => e.id).sort();
  for (const id of pick(r, d7, 15)) out.push({ id, stratum: "fill-D7" });
  const groups = [...new Map(homes.filter((h) => h.input !== "Unknown").map((h) => [h.description, h.id])).values()].sort();
  for (const id of pick(r, groups, 10)) out.push({ id, stratum: "fill-home" });
  return { seed: SEED, drawn: "2026-09-29", note: "Stratified: 5 landed entries per domain with landed content (D7 has none), 15 D7 fills, 10 missing-home fills (one per home). Fixed before grading.", sample: out };
}

export function check() {
  const F = [];
  if (!existsSync(join(ROOT, SAMPLE))) return { F: ["no sample drawn: run node scripts/audit.mjs --draw"], S: null, G: [] };
  const S = JSON.parse(readFileSync(join(ROOT, SAMPLE), "utf8"));
  const drawnAgain = draw();
  if (JSON.stringify(drawnAgain.sample) !== JSON.stringify(S.sample)) F.push("the recorded sample differs from the seeded draw (the sample or the map changed)");
  const { GRADES } = require("../audit/grades-0_1.js");
  const ids = new Set(S.sample.map((s) => s.id));
  const seen = new Set();
  for (const g of GRADES) {
    if (!ids.has(g.id)) F.push(`${g.id}: graded but not in the sample`);
    if (seen.has(g.id)) F.push(`${g.id}: graded twice`); seen.add(g.id);
    for (const f of FIELDS) {
      const v = g.fields?.[f];
      if (!v) { F.push(`${g.id}: no grade for ${f}`); continue; }
      if (!VERDICTS.includes(v.verdict)) F.push(`${g.id}.${f}: bad verdict ${v.verdict}`);
      if (v.verdict !== "unsupported" && !(v.src && g.sources?.[v.src] && v.quote)) F.push(`${g.id}.${f}: a ${v.verdict} grade needs a source and a quote`);
      if (v.verdict !== "confirmed" && !v.note) F.push(`${g.id}.${f}: a ${v.verdict} grade needs a note`);
    }
  }
  const { TARGETED } = require("../audit/targeted-0_1.js");
  const all = new Set(parse().entries.map((e) => e.id)), tseen = new Set();
  for (const g of TARGETED) {
    if (!all.has(g.id)) F.push(`${g.id}: targeted but not in the map`);
    if (ids.has(g.id)) F.push(`${g.id}: targeted but already in the sample`);
    if (tseen.has(g.id)) F.push(`${g.id}: targeted twice`); tseen.add(g.id);
    if (!g.why) F.push(`${g.id}: a targeted receipt needs a why`);
    for (const f of FIELDS) {
      const v = g.fields?.[f];
      if (!v) { F.push(`${g.id}: no grade for ${f}`); continue; }
      if (!VERDICTS.includes(v.verdict)) F.push(`${g.id}.${f}: bad verdict ${v.verdict}`);
      if (v.verdict !== "unsupported" && !(v.src && g.sources?.[v.src] && v.quote)) F.push(`${g.id}.${f}: a ${v.verdict} grade needs a source and a quote`);
      if (v.verdict !== "confirmed" && !v.note) F.push(`${g.id}.${f}: a ${v.verdict} grade needs a note`);
    }
  }
  F.push(...checkReview());
  return { F, S, G: GRADES, T: TARGETED };
}

// The fill review (audit/fill-review-0_1.js): the targeted shape over fills, each source windowed into an
// excerpt file whose header names it, with the reviewer's recall (audit/fill-review-recall-0_1.js) on record.
export function checkReview() {
  const F = [];
  const { REVIEW } = require("../audit/fill-review-0_1.js"), { RECALL } = require("../audit/fill-review-recall-0_1.js");
  const P = parse(), byId = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const fillOf = Object.fromEntries(P.fills.map((f) => [f.id, f])), recall = new Map(), seen = new Set();
  for (const k of RECALL) { if (recall.has(k.id)) F.push(`recall ${k.id}: given twice`); recall.set(k.id, k); for (const f of FIELDS) if (!k[f] || !String(k[f]).trim()) F.push(`recall ${k.id}: no recalled ${f}`); }
  const header = {};
  const urlOf = (file) => { if (!(file in header)) { try { header[file] = readFileSync(join(ROOT, file), "utf8").match(/^URL: (\S+)$/m)?.[1] ?? null; } catch { header[file] = undefined; } } return header[file]; };
  for (const g of REVIEW) {
    const at = `review ${g.id}`;
    if (!byId[g.id]) { F.push(`${at}: no such entry`); continue; }
    if (byId[g.id].origin !== "fill") F.push(`${at}: the review grades fills; this entry's origin is ${byId[g.id].origin}`);
    if (seen.has(g.id)) F.push(`${at}: reviewed twice`); seen.add(g.id);
    if (!Number.isInteger(g.batch) || g.batch < 1) F.push(`${at}: needs a batch number`);
    if (!g.why) F.push(`${at}: needs a why`);
    const rc = recall.get(g.id);
    if (!rc) F.push(`${at}: no recalled expectation on record`); else if (rc.batch !== g.batch) F.push(`${at}: recall and review disagree on the batch`);
    for (const [k, file] of Object.entries(g.files || {})) {
      const u = urlOf(file);
      if (u === undefined) F.push(`${at}: no excerpt file ${file}`);
      else if (!g.sources?.[k] || g.sources[k] !== u) F.push(`${at}: source ${k} must be ${file}'s URL (${u})`);
    }
    for (const c of g.covers || []) {
      const a = fillOf[g.id], b = fillOf[c];
      if (!b || ["description", "input", "output", "preserved", "broken"].some((f) => a?.[f] !== b[f])) F.push(`${at}: covers ${c}, which does not carry the same fill`);
    }
    for (const f of FIELDS) {
      const v = g.fields?.[f];
      if (!v) { F.push(`${at}: no grade for ${f}`); continue; }
      if (!VERDICTS.includes(v.verdict)) F.push(`${at}.${f}: bad verdict ${v.verdict}`);
      for (const x of [v, ...(v.more || [])]) if (v.verdict !== "unsupported" && !(x.src && g.files?.[x.src] && x.quote)) F.push(`${at}.${f}: a ${v.verdict} grade needs an excerpt file and a quote for each receipt`);
      if (v.verdict === "unsupported" && (v.quote || v.more)) F.push(`${at}.${f}: an unsupported grade carries no quote`);
      if (v.verdict !== "confirmed" && !v.note) F.push(`${at}.${f}: a ${v.verdict} grade needs a note`);
      if (/[–—]/.test(v.note || "")) F.push(`${at}.${f}: an en or em dash in the note`);
    }
    for (const f of g.contra || []) { if (!FIELDS.includes(f)) F.push(`${at}: contra names ${f}`); else if (g.fields?.[f]?.verdict === "unsupported") F.push(`${at}: contra ${f}, but no source settled the field`); }
  }
  for (const id of recall.keys()) if (!seen.has(id)) F.push(`recall ${id}: no review on record`);
  return F;
}

function renderReview(S, G) {
  const { REVIEW } = require("../audit/fill-review-0_1.js"), { RECALL } = require("../audit/fill-review-recall-0_1.js");
  const P = parse(), byId = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const homes = new Set(require("../mapfill/homes.js").map((h) => h.id));
  const d7 = P.fills.filter((f) => f.id.startsWith("D7-") && !homes.has(f.id)).length;
  const homeGroups = new Set(require("../mapfill/homes.js").map((h) => JSON.stringify([h.description, h.input, h.output, h.preserved, h.broken]))).size;
  const pop = (g) => (homes.has(g.id) ? "homes" : "D7 stubs");
  const rc = Object.fromEntries(RECALL.map((k) => [k.id, k]));
  const L = ["# Fill review, version 0.1", "", "*Generated by `scripts/audit.mjs` from `audit/fill-review-0_1.js` and `audit/fill-review-recall-0_1.js`. Do not edit by hand.*", ""];
  L.push("The authored fills (origin fill, tier authored: written from memory, never reviewed) graded field by field against sources, in batches of 25: the D7 name-only stubs in id order, then the missing homes (one grade per home, on its first entry). Sources in order of preference: Mathlib at the pin, the nLab, Wikipedia at a pinned revision, arXiv. Every confirmed, imprecise or wrong grade quotes a verbatim window of an excerpt file (`excerpts/`), checked by `scripts/mathmap.mjs --check`. **confirmed**: the source states the field's claim; **imprecise**: right idea, a detail wrong; **wrong**: the source contradicts it; **unsupported**: no source found that settles it. A confirmed field may carry a note naming a secondary claim no fetched source settled. Before each batch's sources were read, the reviewer wrote down what each field should say (`audit/fill-review-recall-0_1.js`, recalled: a lead, never evidence); a recall the source contradicted is counted, as a reading of how far fills written the same way can be trusted.", "");
  const nD7 = REVIEW.filter((g) => pop(g) === "D7 stubs").length, nH = REVIEW.filter((g) => pop(g) === "homes").length;
  L.push(`Reviewed: ${nD7} of ${d7} D7 stubs, ${nH} of ${homeGroups} homes; ${REVIEW.length} entries in ${new Set(REVIEW.map((g) => g.batch)).size} batches.`, "");
  L.push("## 1. Verdicts by field", "", "Each population's fields, counted by verdict. The domain is the reviewed entry's own.", "");
  const table = (label, gs) => {
    if (!gs.length) return;
    L.push(`### ${label} (${gs.length} entries)`, "", "| Field | Confirmed | Imprecise | Wrong | Unsupported |", "|---|---|---|---|---|");
    for (const f of FIELDS) L.push(`| ${f} | ${VERDICTS.map((v) => gs.filter((g) => g.fields[f].verdict === v).length).join(" | ")} |`);
    const all = gs.flatMap((g) => FIELDS.map((f) => g.fields[f].verdict));
    L.push(`| **all** | ${VERDICTS.map((v) => all.filter((x) => x === v).length).join(" | ")} |`, "");
  };
  table("D7 stubs", REVIEW.filter((g) => pop(g) === "D7 stubs"));
  table("Homes", REVIEW.filter((g) => pop(g) === "homes"));
  for (const d of [...new Set(REVIEW.filter((g) => pop(g) === "homes").map((g) => g.id.slice(0, 2)))].sort()) table(`Homes, ${d}`, REVIEW.filter((g) => pop(g) === "homes" && g.id.startsWith(d)));
  L.push("## 2. Recall against source", "", "Per batch: fields a source settled (any verdict but unsupported), and how many of the reviewer's recalled expectations the source contradicted, in whole or in a detail.", "", "| Batch | Entries | Fields settled | Recall contradicted | Rate |", "|---|---|---|---|---|");
  const batches = [...new Set(REVIEW.map((g) => g.batch))].sort((a, b) => a - b);
  let ts = 0, tc = 0;
  for (const b of batches) {
    const gs = REVIEW.filter((g) => g.batch === b), s = gs.reduce((n, g) => n + FIELDS.filter((f) => g.fields[f].verdict !== "unsupported").length, 0), c = gs.reduce((n, g) => n + g.contra.length, 0);
    ts += s; tc += c;
    L.push(`| ${b} | ${gs.length} | ${s} | ${c} | ${s ? `${Math.round((100 * c) / s)}%` : "-"} |`);
  }
  L.push(`| **all** | ${REVIEW.length} | ${ts} | ${tc} | ${ts ? `${Math.round((100 * tc) / ts)}%` : "-"} |`, "");
  const sampled = REVIEW.filter((g) => S.sample.some((s) => s.id === g.id) && G.some((x) => x.id === g.id));
  if (sampled.length) {
    L.push("## 3. Second reading of the sample", "", "Fills in the audit's fixed sample, first graded by the fills' author against live URLs (`audit/grades-0_1.js`, kept for the sample's estimates), graded again here against excerpt files. Fields where the two readings differ:", "");
    const gOf = Object.fromEntries(G.map((g) => [g.id, g]));
    let same = 0, n = 0;
    for (const g of sampled) for (const f of FIELDS) { n++; const a = gOf[g.id].fields[f].verdict, b = g.fields[f].verdict; if (a === b) same++; else L.push(`- ${g.id} ${f}: sample ${a}, review ${b}.`); }
    L.push("", `Agreement: ${same} of ${n} fields.`, "");
  }
  L.push("## 4. Findings", "", "Every field not confirmed, with the reason.", "");
  for (const g of REVIEW) {
    const bad = FIELDS.filter((f) => g.fields[f].verdict !== "confirmed");
    if (bad.length) L.push(`- **${g.id} ${byId[g.id].name}** (batch ${g.batch}): ${bad.map((f) => `*${f}* ${g.fields[f].verdict}: ${g.fields[f].note}`).join(" ")}`);
  }
  L.push("", "## 5. Receipts", "");
  for (const g of REVIEW) {
    L.push(`### ${g.id} ${byId[g.id].name} (batch ${g.batch}${g.covers?.length ? `; covers ${g.covers.join(", ")}` : ""})`, "");
    for (const f of FIELDS) {
      const v = g.fields[f], rs = [v, ...(v.more || [])].filter((x) => x.quote).map((x) => `[${x.src}] "${x.quote}"`).join(" ");
      L.push(`- ${f}: **${v.verdict}**${rs ? ` ${rs}` : ""}${v.note ? ` *${v.note}*` : ""}${g.contra.includes(f) ? " (recall contradicted)" : ""}`);
    }
    if (rc[g.id]) L.push(`- recalled: ${FIELDS.map((f) => `${f}: ${rc[g.id][f]}`).join("; ")}`);
    L.push("", ...Object.entries(g.files).map(([k, file]) => `  ${k}: ${file} (${g.sources[k]})`), "");
  }
  return L.join("\n");
}

const norm = (s) => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1").replace(/'''?/g, "").replace(/\s+/g, " ").toLowerCase();

async function verifyQuotes(G) {
  const F = [], cache = {};
  for (const g of G) for (const [f, v] of Object.entries(g.fields)) {
    if (!v.quote) continue;
    const url = g.sources[v.src];
    if (!(url in cache)) { try { const r = await fetch(url, { headers: { "user-agent": "math-map-audit/0.1" } }); cache[url] = r.ok ? norm(await r.text()) : null; } catch { cache[url] = null; } }
    if (cache[url] === null) F.push(`${g.id}.${f}: could not fetch ${url}`);
    else if (!cache[url].includes(norm(v.quote))) F.push(`${g.id}.${f}: quote not found at ${url}`);
  }
  return F;
}

function render(S, G, T) {
  const P = parse();
  const byId = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const gById = Object.fromEntries(G.map((g) => [g.id, g]));
  const strata = [...new Set(S.sample.map((s) => s.stratum))];
  const worst = (g) => { const vs = FIELDS.map((f) => g.fields[f].verdict); return vs.includes("wrong") ? "wrong" : vs.includes("imprecise") ? "imprecise" : vs.every((v) => v === "confirmed") ? "confirmed" : "partly unsupported"; };
  const L = ["# Math map audit, version 0.1", "", "*Generated by `scripts/audit.mjs` from `audit/sample-0_1.json` and `audit/grades-0_1.js`. Do not edit by hand.*", ""];
  L.push(`A fixed stratified sample (seed ${S.seed}, drawn ${S.drawn}, before any grading). ${S.note} Each field is graded against a source: **confirmed** (the source states it or it follows directly), **imprecise** (right idea, a detail wrong or loose), **wrong** (the source contradicts it), **unsupported** (no source found that settles it). Every confirmed, imprecise or wrong grade carries a verbatim quote, checked against the live source by \`--verify-quotes\`.`, "");
  const graded = S.sample.filter((s) => gById[s.id]);
  L.push(`Graded: ${graded.length} of ${S.sample.length}.`, "");
  L.push("## 1. By stratum", "", "An entry's verdict is its worst field.", "", "| Stratum | Graded | Confirmed | Partly unsupported | Imprecise | Wrong |", "|---|---|---|---|---|---|");
  const row = (label, ss) => { const gs = ss.map((s) => gById[s.id]).filter(Boolean); const c = (w) => gs.filter((g) => worst(g) === w).length; return `| ${label} | ${gs.length}/${ss.length} | ${c("confirmed")} | ${c("partly unsupported")} | ${c("imprecise")} | ${c("wrong")} |`; };
  for (const st of strata) L.push(row(st, S.sample.filter((s) => s.stratum === st)));
  L.push(row("**landed, all**", S.sample.filter((s) => s.stratum.startsWith("landed"))), row("**fills, all**", S.sample.filter((s) => s.stratum.startsWith("fill"))), "");
  const wilson = (k, n) => { if (!n) return [0, 0]; const z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d; return [Math.max(0, c - h), Math.min(1, c + h)]; };
  const pct = (x) => `${Math.round(x * 100)}%`;
  const est = (label, pred) => { const gs = graded.filter(pred).map((s) => gById[s.id]); const n = gs.length; const k = gs.filter((g) => worst(g) === "wrong").length, j = gs.filter((g) => ["wrong", "imprecise"].includes(worst(g))).length; const [a, b] = wilson(k, n), [c, d] = wilson(j, n); return `| ${label} | ${n} | ${k} (${pct(a)} to ${pct(b)}) | ${j} (${pct(c)} to ${pct(d)}) |`; };
  L.push("### Estimates", "", "Entries with at least one wrong field, and with at least one wrong or imprecise field, with 95% Wilson intervals. The sample is small: read the intervals, not the point values. The fills were graded by their author, which biases their row toward leniency.", "", "| Population | n | Wrong (95% CI) | Wrong or imprecise (95% CI) |", "|---|---|---|---|");
  L.push(est("landed", (s) => s.stratum.startsWith("landed")), est("landed D8", (s) => s.stratum === "landed-D8"), est("landed, other domains", (s) => s.stratum.startsWith("landed") && s.stratum !== "landed-D8"), est("fills", (s) => s.stratum.startsWith("fill")), "");
  L.push("## 2. By field", "", "| Field | Confirmed | Imprecise | Wrong | Unsupported |", "|---|---|---|---|---|");
  for (const f of FIELDS) { const vs = graded.map((s) => gById[s.id].fields[f].verdict); L.push(`| ${f} | ${VERDICTS.map((v) => vs.filter((x) => x === v).length).join(" | ")} |`); }
  L.push("", "## 3. Findings", "", "Every field not confirmed, with the reason.", "");
  for (const s of graded) {
    const g = gById[s.id], e = byId[s.id];
    const bad = FIELDS.filter((f) => g.fields[f].verdict !== "confirmed");
    if (!bad.length) continue;
    L.push(`- **${s.id} ${e.name}** (${s.stratum}): ${bad.map((f) => `*${f}* ${g.fields[f].verdict}: ${g.fields[f].note}`).join(" ")}`);
  }
  L.push("", "## 4. Receipts", "");
  for (const s of graded) {
    const g = gById[s.id], e = byId[s.id];
    L.push(`### ${s.id} ${e.name} (${s.stratum}, ${worst(g)})`, "");
    for (const f of FIELDS) { const v = g.fields[f]; L.push(`- ${f}: **${v.verdict}**${v.quote ? ` [${v.src}] "${v.quote}"` : ""}${v.note ? ` *${v.note}*` : ""}`); }
    L.push("", ...Object.entries(g.sources).map(([k, u]) => `  ${k}: ${u}`), "");
  }
  L.push("## 5. Targeted receipts", "", "Entries outside the sample, receipted because a composite anchors on them. Chosen for use, not drawn at random, so they stay out of the estimates above.", "");
  for (const g of T) {
    const e = byId[g.id];
    L.push(`### ${g.id} ${e.name} (${worst(g)}; for ${g.why})`, "");
    for (const f of FIELDS) { const v = g.fields[f]; L.push(`- ${f}: **${v.verdict}**${v.quote ? ` [${v.src}] "${v.quote}"` : ""}${v.note ? ` *${v.note}*` : ""}`); }
    L.push("", ...Object.entries(g.sources).map(([k, u]) => `  ${k}: ${u}`), "");
  }
  const pending = S.sample.filter((s) => !gById[s.id]);
  if (pending.length) L.push("## 6. Pending", "", pending.map((s) => s.id).join(", "), "");
  return L.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  if (a.includes("--draw")) {
    if (existsSync(join(ROOT, SAMPLE))) { console.log(`refusing: ${SAMPLE} exists and the sample is fixed`); process.exit(1); }
    writeFileSync(join(ROOT, SAMPLE), JSON.stringify(draw(), null, 2) + "\n"); console.log(`wrote ${SAMPLE}`); process.exit(0);
  }
  const { F, S, G, T } = check();
  if (a.includes("--verify-quotes") && S) F.push(...(await verifyQuotes([...G, ...T, ...require("../audit/fill-review-0_1.js").REVIEW])));
  if (F.length) { for (const f of F) console.log("FAIL", f); console.log(`audit: ${F.length} failure(s)`); process.exit(1); }
  if (!a.includes("--check")) {
    writeFileSync(join(ROOT, "reports/AUDIT.md"), render(S, G, T) + "\n"); console.log("wrote reports/AUDIT.md");
    writeFileSync(join(ROOT, "reports/FILL-REVIEW.md"), renderReview(S, G) + "\n"); console.log("wrote reports/FILL-REVIEW.md");
  }
  console.log(`audit: PASS (${G.length} of ${S.sample.length} graded, ${T.length} targeted${a.includes("--verify-quotes") ? ", quotes verified" : ""})`);
}
