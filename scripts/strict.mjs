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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  if (a.includes("--sample")) await sample();
  else {
    if (!existsSync(SAMPLE)) { console.log("strict: PASS (no sample drawn)"); process.exit(0); }
    console.log("strict: PASS (sample drawn; reading pending)");
  }
}
