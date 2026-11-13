// Role: the strict second reading of the fill review. Draws a fixed stratified sample of graded fields from
//   audit/fill-review-0_1.js, writes a packet that shows each field's fill text and the excerpt files named
//   for its entry (never the grade, quote or note), and compares a strict reader's grades with the review's.
// Contract: `node scripts/strict.mjs --sample` (once; refuses to overwrite) writes audit/strict/sample-0_2.json
//   (seed, frame, item ids, no grades) and audit/strict/packet-0_2.md. `node scripts/strict.mjs` checks
//   audit/strict/reading-0_2.js (the blind sample) and audit/strict/sweep-0_2.js (the targeted sweep), verifies
//   every quote occurs in its excerpt file, and writes reports/STRICT-READING.md: the agreement matrix, the rate
//   at which confirmed becomes not-confirmed with a Wilson 95% interval, that rate by batch, every
//   disagreement with its reason, and the D7 verdict table before and after. `--check` (CI) only checks and
//   confirms the report is fresh.
// Invariant: a second reading never edits audit/fill-review-0_1.js; both grades stand side by side, and the
//   effective grade under the strict rule is the second reading's where one exists. The sample file holds no
//   grade; the strata are recomputed from the review at comparison time.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const DIR = join(ROOT, "audit/strict");
const SAMPLE = join(DIR, "sample-0_2.json"), PACKET = join(DIR, "packet-0_2.md");
const OUT = join(ROOT, "reports/STRICT-READING.md");
const SEED = 20261113;
const FIELDS = ["name", "description", "input", "output", "preserved", "broken"];
const VERDICTS = ["confirmed", "imprecise", "wrong", "unsupported"];
const STRATA = { confirmed: 100, unsupported: 30, imprecise: 20 };
// Entries whose grades the reader saw while learning the review's file format, before the draw: out of the frame.
const SEEN = ["D7-001", "D7-002", "D7-003", "D7-004"];

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle(r, arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

async function fills() { const { parse } = await import("./mathmap.mjs"); return Object.fromEntries(parse().fills.map((f) => [f.id, f])); }
const review = () => require("../audit/fill-review-0_1.js").REVIEW;

async function sample() {
  if (existsSync(SAMPLE) || existsSync(PACKET)) { console.log("strict: the sample exists; it is drawn once"); process.exit(1); }
  const R = review(), r = rng(SEED);
  const frame = R.filter((g) => !SEEN.includes(g.id)).flatMap((g) => FIELDS.map((f) => ({ entry: g.id, field: f, batch: g.batch, v: g.fields[f].verdict })));
  const drawn = Object.entries(STRATA).flatMap(([v, n]) => shuffle(r, frame.filter((x) => x.v === v)).slice(0, n));
  const items = shuffle(r, drawn).map((x, i) => ({ id: `S${String(i + 1).padStart(3, "0")}`, entry: x.entry, field: x.field, batch: x.batch }));
  const sizes = Object.fromEntries(Object.keys(STRATA).map((v) => [v, frame.filter((x) => x.v === v).length]));
  mkdirSync(DIR, { recursive: true });
  writeFileSync(SAMPLE, JSON.stringify({ version: "0.2", seed: SEED, rng: "mulberry32, as scripts/audit.mjs", drawn: new Date().toISOString().slice(0, 10),
    frame: `Every field of audit/fill-review-0_1.js (${R.length} entries) graded confirmed, unsupported or imprecise, less ${SEEN.join(", ")}, whose grades the reader saw before the draw.`,
    strata: Object.fromEntries(Object.entries(STRATA).map(([v, n]) => [v, { asked: n, drawn: Math.min(n, sizes[v]), frame: sizes[v] }])),
    method: "Each stratum shuffled (Fisher-Yates) and its first n taken, strata in the order confirmed, unsupported, imprecise; a stratum smaller than its n is taken whole (a census); the draw then shuffled together and numbered. The stratum of an item is not written here; it is recomputed from the review at comparison time.",
    items }, null, 1) + "\n");
  const F = await fills(), byId = Object.fromEntries(R.map((g) => [g.id, g]));
  const L = ["# Strict second reading, packet 0.2", "", "*Generated once by `node scripts/strict.mjs --sample`. Shows the fill text and the excerpt files named for each entry; never the review's grade, quote or note.*", "",
    "Rule [ruling: operator, 2026-11-13]: **confirmed** only when a quoted window states the field's claim itself, not merely names the object or operation; a claim with several parts is confirmed only if every part is quoted, otherwise **imprecise** (a part missing or a detail off) or **unsupported** (no window states the claim), saying which part is missing. **wrong** when a window contradicts it.", ""];
  for (const it of items) {
    const f = F[it.entry], g = byId[it.entry];
    L.push(`## ${it.id}: ${it.entry}, ${it.field}`, "", `- Entry: ${f.name}`, `- Field: **${it.field}**: ${it.field === "name" ? f.name : f[it.field]}`,
      `- Whole fill: description: ${f.description} | input: ${f.input} | output: ${f.output} | preserved: ${f.preserved} | broken: ${f.broken}${f.reading ? ` | reading: ${f.reading}` : ""}`,
      `- Excerpt files: ${Object.values(g.files).map((x) => `\`excerpts/${x.replace(/^excerpts\//, "")}\``).join(", ")}`, "");
  }
  writeFileSync(PACKET, L.join("\n"));
  console.log(`strict: drew ${items.length} items (frame ${JSON.stringify(sizes)}); wrote ${SAMPLE.slice(ROOT.length + 1)} and ${PACKET.slice(ROOT.length + 1)}`);
}

const HOMES = () => new Set(require("../mapfill/homes.js").map((h) => h.id));
const wilson = (x, n) => { if (!n) return [0, 0]; const z = 1.96, p = x / n, d = 1 + (z * z) / n, c = (p + (z * z) / (2 * n)) / d, h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d; return [Math.max(0, c - h), Math.min(1, c + h)]; };
const pct = (x) => `${(100 * x).toFixed(1)}%`;
const rate = (x, n) => { const [a, b] = wilson(x, n); return `${x}/${n} = ${n ? pct(x / n) : "-"} (95% Wilson interval ${pct(a)} to ${pct(b)})`; };
const cell = (t) => String(t ?? "").replace(/\|/g, "/").replace(/\n/g, " ");

// Checks one strict grade: its verdict, its reason, and that each quote occurs in its excerpt file.
function checkGrade(at, g, F, files) {
  if (!VERDICTS.includes(g.verdict)) F.push(`${at}: bad verdict ${g.verdict}`);
  if (!g.reason || !String(g.reason).trim()) F.push(`${at}: needs a one-line reason`);
  if (/[–—]/.test(g.reason || "")) F.push(`${at}: an en or em dash in the reason`);
  if (g.verdict === "unsupported" && g.quotes?.length) F.push(`${at}: an unsupported grade carries no quote`);
  if (g.verdict !== "unsupported" && !g.quotes?.length) F.push(`${at}: a ${g.verdict} grade needs a quote`);
  for (const q of g.quotes || []) {
    if (!files(q.file)) F.push(`${at}: ${q.file} is not an excerpt file of this reading`);
    let t = null; try { t = readFileSync(join(ROOT, q.file), "utf8"); } catch { F.push(`${at}: no file ${q.file}`); continue; }
    if (!t.includes(q.quote)) F.push(`${at}: quote not found in ${q.file}: ${q.quote.slice(0, 60)}`);
  }
}

function compare() {
  const F = [], L = [];
  const R = review(), byId = Object.fromEntries(R.map((g) => [g.id, g])), homes = HOMES();
  const S = JSON.parse(readFileSync(SAMPLE, "utf8"));
  const RD = existsSync(join(DIR, "reading-0_2.js")) ? require("../audit/strict/reading-0_2.js").READING : null;
  const SW = existsSync(join(DIR, "sweep-0_2.js")) ? require("../audit/strict/sweep-0_2.js").SWEEP : null;
  L.push("# Strict second reading of the fill review, version 0.2", "", "*Generated by `scripts/strict.mjs` from `audit/strict/sample-0_2.json`, `audit/strict/reading-0_2.js`, `audit/strict/sweep-0_2.js` and `audit/fill-review-0_1.js`. Do not edit by hand.*", "",
    `Rule [ruling: operator, 2026-11-13]: ${RD?.rule ?? "pending"}`, "",
    "The review's grades (`audit/fill-review-0_1.js`) stand as they were; this reading sits beside them. Where a field has a strict grade, the strict grade is its effective grade under the strict rule.", "");
  // The blind sample.
  const strata = Object.entries(S.strata).map(([v, x]) => `${v} ${x.drawn} of ${x.frame}${x.drawn < x.asked ? ` (${x.asked} asked; the stratum is taken whole)` : ""}`).join(", ");
  L.push("## The blind sample", "", `Seed ${S.seed} (${S.rng}), drawn ${S.drawn} before any grade was read. Frame: ${S.frame} Strata by the review's verdict: ${strata}. ${S.method}`, "");
  if (!RD) { L.push("Reading pending.", ""); return { F, text: L.join("\n") }; }
  L.push(`Reader: ${RD.reader}. Independence: ${RD.independence}`, "");
  const items = S.items.map((it) => ({ ...it, orig: byId[it.entry]?.fields[it.field]?.verdict, g: RD.grades[it.id] }));
  for (const it of items) {
    if (!it.orig) { F.push(`${it.id}: ${it.entry} ${it.field} is not in the review`); continue; }
    if (!it.g) { F.push(`${it.id}: no strict grade`); continue; }
    const named = new Set(Object.values(byId[it.entry].files));
    checkGrade(it.id, it.g, F, (f) => named.has(f));
    if (it.g.fetched) { checkGrade(`${it.id} fetched`, it.g.fetched, F, (f) => !named.has(f));
      if (it.g.verdict !== "unsupported") F.push(`${it.id}: a fetched grade is for a field the named files left unsupported`); }
  }
  for (const k of Object.keys(RD.grades)) if (!S.items.some((it) => it.id === k)) F.push(`${k}: graded but not in the sample`);
  const done = items.filter((it) => it.orig && it.g);
  const V = VERDICTS;
  L.push("### Agreement matrix", "", `Rows: the review's verdict. Columns: the strict reading's, from the excerpt files the review named. ${done.length} of ${S.items.length} items graded.`, "",
    `| Review \\ strict | ${V.join(" | ")} | total |`, `|---|${V.map(() => "---").join("|")}|---|`);
  for (const a of V) { const row = done.filter((it) => it.orig === a); if (row.length) L.push(`| ${a} | ${V.map((b) => row.filter((it) => it.g.verdict === b).length).join(" | ")} | ${row.length} |`); }
  const agree = done.filter((it) => it.orig === it.g.verdict).length;
  L.push(`| total | ${V.map((b) => done.filter((it) => it.g.verdict === b).length).join(" | ")} | ${done.length} |`, "", `Exact agreement: ${agree} of ${done.length}.`, "");
  const conf = done.filter((it) => it.orig === "confirmed"), flip = (xs) => xs.filter((it) => it.g.verdict !== "confirmed").length;
  const early = conf.filter((it) => it.batch <= 5), late = conf.filter((it) => it.batch >= 6);
  L.push("### Confirmed that the strict rule does not confirm", "",
    `Of the review's confirmed fields in the sample (a simple random draw from the ${S.strata.confirmed.frame} confirmed fields of the frame), the strict reading confirms fewer. Flip rate: ${rate(flip(conf), conf.length)}. Batches 1 to 5: ${rate(flip(early), early.length)}. Batches 6 to 18: ${rate(flip(late), late.length)}.`, "",
    `Where the flips go: ${V.filter((v) => v !== "confirmed").map((v) => `${v} ${conf.filter((it) => it.g.verdict === v).length}`).join(", ")}.`, "");
  const unsup = done.filter((it) => it.orig === "unsupported"), imp = done.filter((it) => it.orig === "imprecise");
  L.push(`Other strata: of ${unsup.length} unsupported, the strict reading finds ${unsup.filter((it) => it.g.verdict !== "unsupported").length} settled by the named files; of ${imp.length} imprecise, it confirms ${imp.filter((it) => it.g.verdict === "confirmed").length}.`, "");
  const CA = RD.causes || {}, dis = done.filter((it) => it.orig !== it.g.verdict);
  for (const it of dis) if (!CA[it.id]) F.push(`${it.id}: a disagreement with no cause`);
  for (const k of Object.keys(CA)) if (!dis.some((it) => it.id === k)) F.push(`${k}: a cause for an item that agrees`);
  const kinds = [...new Set(Object.values(CA))].sort();
  L.push("### Why the confirmed fields flip", "", "Each disagreement's cause, written after unblinding: **part**, a window states some of the claim and a part is in no window; **names**, the windows name the object, operation or an ingredient (or carry the claim only in a cut fragment or a cross-reference label) and state none of it; **detail**, a window states a detail otherwise; **reads**, the strict reader reads a window as stating what the review did not.", "",
    `Of the ${flip(conf)} flipped confirmed fields: ${kinds.map((k) => `${k} ${conf.filter((it) => it.g.verdict !== "confirmed" && CA[it.id] === k).length}`).filter((x) => !/ 0$/.test(x)).join(", ")}. Of them, ${conf.filter((it) => it.g.verdict !== "confirmed" && byId[it.entry].fields[it.field].note).length} carried a note in the review naming a part no source settled or a source that differs.`, "");
  L.push("### Every disagreement", "", "| Item | Field | Batch | Review | Strict | Cause | Strict reader's reason |", "|---|---|---|---|---|---|---|");
  for (const it of dis) L.push(`| ${it.id} | ${it.entry} ${it.field} | ${it.batch} | ${it.orig} | ${it.g.verdict} | ${CA[it.id] ?? ""} | ${cell(it.g.reason)} |`);
  L.push("");
  const fx = done.filter((it) => it.g.fetched);
  if (fx.length) {
    L.push("### Fetched sources", "", "Fields the named files left unsupported, graded again after a new source was windowed. Kept apart from the blind comparison.", "", "| Item | Field | Review | Strict (named files) | After fetching | Reason |", "|---|---|---|---|---|---|");
    for (const it of fx) L.push(`| ${it.id} | ${it.entry} ${it.field} | ${it.orig} | ${it.g.verdict} | ${it.g.fetched.verdict} | ${cell(it.g.fetched.reason)} |`);
    L.push("");
  }
  // The sweep (Part B): confirmed fields with a short or relationless quote, re-read under the strict rule.
  const second = new Map(done.map((it) => [`${it.entry}.${it.field}`, it.g.verdict]));
  if (SW) {
    L.push("## The targeted sweep", "", SW.why, "", `Selection: ${SW.selection}`, "");
    const rows = [];
    for (const [k, g] of Object.entries(SW.grades)) {
      const [id, f] = k.split("."), r = byId[id];
      if (!r || !FIELDS.includes(f)) { F.push(`sweep ${k}: no such reviewed field`); continue; }
      if (r.fields[f].verdict !== "confirmed") F.push(`sweep ${k}: the sweep re-reads confirmed fields; this one is ${r.fields[f].verdict}`);
      if (second.has(k)) F.push(`sweep ${k}: already read in the blind sample`);
      const named = new Set(Object.values(r.files));
      checkGrade(`sweep ${k}`, g, F, (x) => named.has(x) || !!g.fetchedFiles?.includes(x));
      second.set(k, g.verdict); rows.push([k, r, f, g]);
    }
    for (const k of SW.selected || []) if (!SW.grades[k] && !done.some((it) => `${it.entry}.${it.field}` === k)) F.push(`sweep ${k}: selected but not graded`);
    const ch = rows.filter(([, , , g]) => g.verdict !== "confirmed");
    L.push(`Graded ${rows.length} of ${(SW.selected || []).length} selected (the rest were read in the blind sample). Not confirmed under the strict rule: ${ch.length} (${V.filter((v) => v !== "confirmed").map((v) => `${v} ${ch.filter(([, , , g]) => g.verdict === v).length}`).join(", ")}).`, "",
      "| Field | Batch | Review | Strict | Reason |", "|---|---|---|---|---|");
    for (const [k, r, f, g] of ch) L.push(`| ${r.id} ${f} | ${r.batch} | confirmed | ${g.verdict} | ${cell(g.reason)} |`);
    L.push("");
  }
  // The verdict tables, before and after.
  const pop = (g) => (homes.has(g.id) ? "Homes" : "D7 stubs");
  L.push("## Verdicts before and after", "", "Field counts by verdict: the review's grades, and the effective grades under the strict rule (the strict grade where a field was read again, the review's elsewhere).", "");
  for (const P of ["D7 stubs", "Homes"]) {
    const gs = R.filter((g) => pop(g) === P); if (!gs.length) continue;
    const before = gs.flatMap((g) => FIELDS.map((f) => g.fields[f].verdict)), after = gs.flatMap((g) => FIELDS.map((f) => second.get(`${g.id}.${f}`) ?? g.fields[f].verdict));
    const reread = gs.reduce((n, g) => n + FIELDS.filter((f) => second.has(`${g.id}.${f}`)).length, 0);
    L.push(`### ${P} (${gs.length} entries, ${before.length} fields, ${reread} read again)`, "", "| | Confirmed | Imprecise | Wrong | Unsupported |", "|---|---|---|---|---|",
      `| review | ${V.map((v) => before.filter((x) => x === v).length).join(" | ")} |`, `| strict, effective | ${V.map((v) => after.filter((x) => x === v).length).join(" | ")} |`, "");
  }
  return { F, text: L.join("\n") };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  if (a.includes("--sample")) await sample();
  else {
    if (!existsSync(SAMPLE)) { console.log("strict: PASS (no sample drawn)"); process.exit(0); }
    const { F, text } = compare();
    for (const f of F) console.log("FAIL", f);
    if (F.length) process.exit(1);
    if (a.includes("--check")) {
      if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== text + "\n") { console.log("FAIL reports/STRICT-READING.md is stale: run node scripts/strict.mjs"); process.exit(1); }
      console.log("strict: PASS (reading checked; report fresh)");
    } else { writeFileSync(OUT, text + "\n"); console.log("strict: wrote reports/STRICT-READING.md"); }
  }
}
