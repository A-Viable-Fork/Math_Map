// Role: the math map, made queryable. Parses source/math_map.md (landed verbatim, never edited) into
//   entries, applies the fill layer (mapfill/: clone resolution and authored fills), checks the parse and
//   the fills, reports data quality, and answers queries.
// Contract: `node scripts/mathmap.mjs` checks and writes reports/MATHMAP.md; `--check` only checks;
//   query flags print matching entries: --id D1-004, --domain D4, --tag compression (repeatable, all must
//   match), --kind Transformer, --text quotient (searches name, description, types and invariants),
//   --stubs, --origin fill|clone|map|dangling, --limit N, --full. --landed queries the map as landed,
//   without the fill layer. Exit 1 if the parse disagrees with the map's declared counts or a fill is bad.
//   Exports parse() (overlaid), parseLanded(), isStub(), anchorable() and check().
// Invariant: read-only over the corpus. Corrections live in mapfill/ and are applied in memory; every
//   entry carries its origin (map, fill, clone:<home id>, clone-dangling) so nothing authored passes as landed.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const FILE = "source/math_map.md";
const text = readFileSync(join(ROOT, FILE), "utf8");
const FIELDS = ["input", "output", "preserved", "broken"];

export function parseLanded() {
  const declared = {};
  for (const m of text.matchAll(/^# DOMAIN (\d): ([^\n(]+?)\s*\n[\s\S]*?# Source: Domain \d Mapper Report \((\d+) entries\)/gm)) declared[`D${m[1]}`] = { name: m[2].trim(), count: Number(m[3]) };
  const vocab = [...text.slice(0, text.indexOf("# DOMAIN 1")).matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1]);
  const heads = [...text.matchAll(/^### (D(\d)-(\d{3})): (.+)$/gm)];
  const entries = heads.map((h, i) => {
    const body = text.slice(h.index, i + 1 < heads.length ? heads[i + 1].index : undefined);
    const f = {};
    for (const r of body.matchAll(/^\| \*\*([^*]+)\*\* \| (.*) \|\s*$/gm)) f[r[1].trim()] = r[2].trim();
    const tags = (f["Functional Tags"] || "").replace(/`/g, "").split(",").map((s) => s.trim()).filter(Boolean);
    return {
      id: h[1], domain: `D${h[2]}`, heading: h[4].trim(), name: f["Name"] || "", description: f["Description"] || "",
      input: f["Input Type"] || null, output: f["Output Type"] || null,
      preserved: f["Preserved Invariants"] || null, broken: f["Broken Invariants"] || null,
      tags, kind: f["Operation Kind"] || "", complexity: f["Complexity"] || "", status: f["FS / FPT / ET / DST"] || "", iso: f["ISO / DEP / CS"] || "",
      origin: "map", reading: null, unknown: false,
    };
  });
  return { declared, vocab, entries };
}

export const isStub = (e) => e.unknown || (!e.input && !e.output && !e.preserved && !e.broken && e.description.replace(/\.$/, "").trim().toLowerCase() === e.name.trim().toLowerCase());
export const anchorable = (e) => !e.unknown && !e.flag && !!e.input && !!e.output && !!(e.preserved || e.broken);
// A pointer is text that names another entry instead of stating content: "See D6", "See Domain 6 home
// entry", "Same", "Same as D2-056". "Same as LU + explicit scaling" states content and is kept.
const isPtr = (v) => !!v && (/^See\b/.test(v) || /^Same\.?$/.test(v) || /^Same as D\d-\d{3}\.?$/.test(v));
const isAlias = (e) => /^See\b/.test(e.description) || /^Same as D\d-\d{3}\b/.test(e.description) || /Clone of D\d-\d{3}/.test(e.iso);
const norm = (s) => s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).normalize("NFD").replace(/[^\x00-\x7f]/g, "").toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, " ").trim();

// Landed entries with pointer fields nulled (the pointer text kept in e.ptr), so landed counts are honest.
function honest(e) {
  const out = { ...e, ptr: {} };
  for (const k of FIELDS) if (isPtr(e[k])) { out.ptr[k] = e[k]; out[k] = null; }
  return out;
}

export function parse() {
  const P = parseLanded();
  const landed = P.entries.map(honest);
  const byId = Object.fromEntries(landed.map((e) => [e.id, e]));
  const solid = (e) => !isAlias(e) && FIELDS.some((k) => e[k]);
  const byDomainName = {}, byName = {};
  for (const e of landed) {
    const k = `${e.domain}|${norm(e.name)}`;
    if (!byDomainName[k] || (!solid(byDomainName[k]) && solid(e))) byDomainName[k] = e;
    if (solid(e)) (byName[norm(e.name)] ||= []).push(e);
  }
  // Where a pointer leads: an explicit id; else the named domain, by name; else the ISO home domain;
  // else the one solid entry of that name anywhere (marked by-name). Ambiguity resolves to nothing.
  const target = (e, hint) => {
    const id = (hint || "").match(/\b(D\d-\d{3})\b/) || e.description.match(/\b(D\d-\d{3})\b/) || e.iso.match(/Clone of (D\d-\d{3})/);
    if (id) return byId[id[1]] ? { e: byId[id[1]], how: "id" } : null;
    const dm = (hint || "").match(/\bD(?:omain )?(\d)\b/) || e.description.match(/Domain (\d)/) || e.iso.match(/home: Domain (\d)/);
    const h = dm && byDomainName[`D${dm[1]}|${norm(e.name)}`];
    if (h && h.id !== e.id) return { e: h, how: "name" };
    const any = (byName[norm(e.name)] || []).filter((x) => x.id !== e.id);
    return any.length === 1 ? { e: any[0], how: "name-elsewhere" } : null;
  };
  const field = (e, k, seen = new Set()) => {
    if (e[k] || !e.ptr[k] && !(k === "description")) return { v: e[k], via: null };
    if (seen.has(e.id) || seen.size > 5) return { v: null, via: null, dangling: true };
    seen.add(e.id);
    const t = target(e, e.ptr[k]);
    if (!t) return { v: null, via: null, dangling: true };
    const r = field(t.e, k, seen);
    return { v: r.v, via: r.via || t, dangling: r.dangling };
  };
  const out = landed.map((e) => ({ ...e, ptr: { ...e.ptr } }));
  const outById = Object.fromEntries(out.map((e) => [e.id, e]));
  for (const e of out) {
    const alias = isAlias(e), ptrs = Object.keys(e.ptr);
    if (!alias && !ptrs.length) continue;
    const vias = [];
    let dangling = false;
    for (const k of FIELDS) {
      if (!e.ptr[k] && !(alias && !e[k])) continue;
      if (!e.ptr[k]) e.ptr[k] = e.description;
      const r = field(e, k);
      e[k] = r.v; if (r.via) vias.push(r.via); if (r.dangling || !r.v) dangling = true;
    }
    if (alias) {
      const t = target(e, e.description);
      if (t && !isAlias(t.e)) { e.pointer = e.description; e.description = t.e.description; vias.push(t); }
      else if (!vias.length) dangling = true;
    }
    const v = vias[0];
    if (alias && !ptrs.length && anchorable(e) && !v) { e.origin = "map"; e.selfPointer = e.description; continue; }
    e.origin = dangling && !FIELDS.some((k) => e[k]) ? "clone-dangling" : v ? `clone:${v.e.id}${v.how === "name-elsewhere" ? " (by name)" : ""}` : "clone-dangling";
  }
  const { FILLS } = require("../mapfill/index.js");
  for (const f of FILLS) {
    const e = outById[f.id];
    if (!e) continue;
    e.fillOf = e.origin;
    e.origin = "fill";
    e.reading = f.reading;
    e.unknown = [f.input, f.output, f.preserved, f.broken].every((x) => x === "Unknown");
    e.description = f.description;
    for (const k of FIELDS) e[k] = f[k];
  }
  const { FLAGS } = require("../mapfill/flags.js");
  for (const fl of FLAGS) { const e = outById[fl.id]; if (e && e.origin === "map") e.flag = fl; }
  const { CORRECTIONS } = require("../mapfill/corrections.js");
  for (const c of CORRECTIONS) {
    const e = outById[c.id];
    if (!e) continue;
    e.landedFields = {};
    for (const [k, v] of Object.entries(c.fields)) { e.landedFields[k] = e[k]; e[k] = v; }
    for (const k of c.clear || []) { e.landedFields[k] = e[k]; e[k] = ""; }
    e.corrected = Object.keys(c.fields);
    e.correction = { reason: c.reason, receipts: c.receipts };
    if (e.flag && FIELDS.concat("description").every((k) => c.fields[k])) { e.flagResolved = e.flag; delete e.flag; }
  }
  const { ADDITIONS } = require("../mapfill/additions.js");
  for (const a of ADDITIONS) out.push({ ...a, domain: a.id.slice(0, 2), heading: a.name, status: "Added / receipted (mapfill/additions.js)", iso: "", origin: "added", reading: null, unknown: false, ptr: {} });
  const { CONDITIONS } = require("../mapfill/conditions.js");
  const outById2 = Object.fromEntries(out.map((e) => [e.id, e]));
  for (const c of CONDITIONS) { const e = outById2[c.id]; if (e) { e.conditions = c.conditions; e.counterexamples = c.counterexamples || []; e.conditionReceipts = c.receipts; } }
  const V = require("../mapfill/invariants.js");
  for (const a of V.ACTS_ON) { const e = outById2[a.entry]; if (e) e.actsOn = { input: a.input, output: a.output }; }
  for (const l of V.LINKS) { const e = outById2[l.entry]; if (e) { e.invariants ||= { preserved: [], broken: [], output: [] }; if (e.invariants[l.field] && !e.invariants[l.field].includes(l.invariant)) e.invariants[l.field].push(l.invariant); } }
  const { MATHLIB, FORMAL } = require("../mapfill/formal.js");
  for (const k of FORMAL) { const e = outById2[k.entry]; if (e) (e.formal ||= []).push({ field: k.field, decl: k.decl, file: k.file, match: k.match, note: k.note }); }
  return { ...P, entries: out, fills: FILLS, flags: FLAGS, additions: ADDITIONS, conditions: CONDITIONS, corrections: CORRECTIONS, vocabulary: V, formal: { mathlib: MATHLIB, links: FORMAL }, landed };
}

export function check(P = parse()) {
  const F = [];
  const seen = new Set();
  for (const e of P.landed) { if (seen.has(e.id)) F.push(`duplicate id ${e.id}`); seen.add(e.id); }
  for (const [d, v] of Object.entries(P.declared)) {
    const n = P.landed.filter((e) => e.domain === d).length;
    if (n !== v.count) F.push(`${d}: parsed ${n} entries, the map declares ${v.count}`);
  }
  if (Object.keys(P.declared).length !== 8) F.push(`expected 8 declared domains, found ${Object.keys(P.declared).length}`);
  if (P.vocab.length < 20) F.push(`the controlled vocabulary parsed to only ${P.vocab.length} tags`);
  for (const e of P.landed) if (!e.name || !e.kind) F.push(`${e.id}: missing name or operation kind`);
  const landedById = Object.fromEntries(P.landed.map((e) => [e.id, e]));
  const resolvedById = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const fids = new Set();
  for (const f of P.fills) {
    const e = landedById[f.id];
    if (fids.has(f.id)) F.push(`${f.id}: filled twice`); fids.add(f.id);
    if (!e) { F.push(`${f.id}: fill names no entry`); continue; }
    if (e.name !== f.name) F.push(`${f.id}: fill names "${f.name}", the map says "${e.name}"`);
    for (const k of ["description", ...FIELDS]) if (!f[k] || !String(f[k]).trim()) F.push(`${f.id}: fill lacks ${k}`);
    if (resolvedById[f.id].unknown && !f.reading) F.push(`${f.id}: an Unknown fill must say why (reading)`);
    if (!isStub(e) && resolvedById[f.id].fillOf !== "clone-dangling") F.push(`${f.id}: fill overrides an entry that is neither a stub nor a dangling clone`);
  }
  for (const fl of P.flags) {
    const e = landedById[fl.id];
    if (!e) { F.push(`${fl.id}: flag names no entry`); continue; }
    if (e.name !== fl.name) F.push(`${fl.id}: flag names "${fl.name}", the map says "${e.name}"`);
    if (!["misaligned"].includes(fl.kind) || !fl.evidence) F.push(`${fl.id}: flag needs a kind and evidence`);
    if (P.fills.some((f) => f.id === fl.id)) F.push(`${fl.id}: flagged and filled; a corrected entry should drop its flag`);
  }
  const aids = new Set();
  for (const a of P.additions) {
    if (!/^D[1-8]-X\d{2}$/.test(a.id)) F.push(`${a.id}: an addition's id must be D<n>-X<nn>`);
    if (aids.has(a.id) || landedById[a.id]) F.push(`${a.id}: addition id is not unique`); aids.add(a.id);
    for (const k of ["name", "kind", "description", ...FIELDS, "requestedBy"]) if (!a[k] || !String(a[k]).trim()) F.push(`${a.id}: addition lacks ${k}`);
    for (const t of a.tags || []) if (!P.vocab.includes(t)) F.push(`${a.id}: tag ${t} is not in the map's vocabulary`);
    if (!(a.tags || []).length) F.push(`${a.id}: addition needs tags`);
    if (!(a.receipts || []).length) F.push(`${a.id}: an addition needs receipts`);
    for (const r of a.receipts || []) {
      if (!/^(excerpts|source)\//.test(r.file)) { F.push(`${a.id}: receipt must point into excerpts/ or source/`); continue; }
      let t = ""; try { t = readFileSync(join(ROOT, r.file), "utf8"); } catch { F.push(`${a.id}: missing receipt file ${r.file}`); continue; }
      const n = (x) => x.replace(/\s+/g, " ");
      if (!n(t).includes(n(r.quote))) F.push(`${a.id}: receipt quote not in ${r.file}: "${r.quote.slice(0, 50)}"`);
    }
  }
  const byIdAll = Object.fromEntries(P.entries.map((e) => [e.id, e])), cids = new Set();
  const inFile = (r) => { if (!/^(excerpts|source)\//.test(r.file)) return `receipt must point into excerpts/ or source/`; let t = ""; try { t = readFileSync(join(ROOT, r.file), "utf8"); } catch { return `missing receipt file ${r.file}`; } const n = (x) => x.replace(/\s+/g, " "); return n(t).includes(n(r.quote)) ? null : `receipt quote not in ${r.file}: "${r.quote.slice(0, 50)}"`; };
  for (const c of P.conditions) {
    const e = byIdAll[c.id];
    if (!e) { F.push(`${c.id}: conditions name no entry`); continue; }
    if (cids.has(c.id)) F.push(`${c.id}: conditions given twice`); cids.add(c.id);
    if (e.name !== c.name) F.push(`${c.id}: conditions name "${c.name}", the map says "${e.name}"`);
    if (!c.conditions || !String(c.conditions).trim()) F.push(`${c.id}: empty conditions`);
    if (!(c.receipts || []).length) F.push(`${c.id}: conditions need receipts`);
    for (const r of c.receipts || []) { const x = inFile(r); if (x) F.push(`${c.id}: ${x}`); }
    for (const k of c.counterexamples || []) { if (!k.case) F.push(`${c.id}: a counterexample needs a case`); if (k.receipt) { const x = inFile(k.receipt); if (x) F.push(`${c.id}: ${x}`); } }
  }
  const grades = Object.fromEntries([...require("../audit/grades-0_1.js").GRADES, ...require("../audit/targeted-0_1.js").TARGETED].map((g) => [g.id, g]));
  const CF = ["description", "input", "output", "preserved", "broken"], xids = new Set();
  for (const c of P.corrections) {
    const e = landedById[c.id], at = `correction ${c.id}`;
    if (!e) { F.push(`${at}: no such landed entry`); continue; }
    if (xids.has(c.id)) F.push(`${at}: given twice`); xids.add(c.id);
    if (e.name !== c.name) F.push(`${at}: names "${c.name}", the map says "${e.name}"`);
    if (!c.reason || !c.reason.trim()) F.push(`${at}: needs a reason`);
    const flagged = P.flags.some((f) => f.id === c.id);
    for (const [k, v] of Object.entries(c.fields)) {
      if (!CF.includes(k)) { F.push(`${at}: cannot correct ${k}`); continue; }
      if (!v || !String(v).trim()) F.push(`${at}: empty ${k}`);
      const g = grades[c.id]?.fields?.[k], fl = P.formal.links.some((l) => l.entry === c.id && l.field === k && ["conflicts", "general"].includes(l.match));
      if (!flagged && !(g && g.verdict !== "confirmed") && !fl) F.push(`${at}.${k}: no prior finding (an audit grade other than confirmed, a flag, or a Mathlib conflict)`);
      if (!(c.receipts || []).some((r) => (r.fields || []).includes(k))) F.push(`${at}.${k}: no receipt supports the corrected field`);
    }
    for (const k of c.clear || []) if (!["complexity"].includes(k)) F.push(`${at}: can only clear complexity`);
    if (!(c.receipts || []).length) F.push(`${at}: needs receipts`);
    for (const r of c.receipts || []) { const x = inFile(r); if (x) F.push(`${at}: ${x}`); for (const k of r.fields || []) if (!(k in c.fields)) F.push(`${at}: a receipt supports ${k}, which is not corrected`); }
  }
  const V = P.vocabulary, vids = new Set();
  const kinds = V.CARRIERS;
  for (const [k, p] of Object.entries(kinds)) if (p !== null && !(p in kinds)) F.push(`carrier ${k}: unknown parent ${p}`);
  for (const v of V.INVARIANTS) { if (vids.has(v.id)) F.push(`invariant ${v.id}: defined twice`); vids.add(v.id); if (!v.name || !v.kind || !v.definition) F.push(`invariant ${v.id}: needs a name, kind and definition`); if (!(v.carrier in kinds)) F.push(`invariant ${v.id}: unknown carrier ${v.carrier}`); if (!/^[a-z0-9-]+$/.test(v.id)) F.push(`invariant ${v.id}: ids are lowercase words joined by hyphens`); }
  for (const r of V.RELATIONS) {
    for (const k of [r.from, r.to]) if (!vids.has(k)) F.push(`relation ${r.from} to ${r.to}: unknown invariant ${k}`);
    if (!["implies", "equivalent"].includes(r.kind)) F.push(`relation ${r.from} to ${r.to}: bad kind ${r.kind}`);
    if (!(r.receipts || []).length && !r.basis) F.push(`relation ${r.from} to ${r.to}: needs receipts or a basis`);
    for (const x of r.receipts || []) { const m = inFile(x); if (m) F.push(`relation ${r.from} to ${r.to}: ${m}`); }
  }
  const nrm = (x) => String(x || "").replace(/\s+/g, " ").toLowerCase();
  const acted = new Set();
  for (const a of V.ACTS_ON) {
    const e = byIdAll[a.entry], at = `acts-on ${a.entry}`;
    if (!e) { F.push(`${at}: no such entry`); continue; }
    if (acted.has(a.entry)) F.push(`${at}: given twice`); acted.add(a.entry);
    for (const k of [...a.input, ...a.output]) if (!(k in kinds)) F.push(`${at}: unknown carrier ${k}`);
    for (const [side, ph] of [["input", a.inputPhrase], ["output", a.outputPhrase]]) for (const x of [ph].flat()) if (!x || !nrm(e[side]).includes(nrm(x))) F.push(`${at}: phrase "${x}" is not in the entry's ${side} field`);
  }
  const used = new Set();
  for (const l of V.LINKS) {
    const e = byIdAll[l.entry], at = `link ${l.entry}.${l.field} to ${l.invariant}`;
    if (!e) { F.push(`${at}: no such entry`); continue; }
    if (!["preserved", "broken", "output"].includes(l.field)) { F.push(`${at}: field must be preserved, broken or output`); continue; }
    if (!vids.has(l.invariant)) F.push(`${at}: unknown invariant`);
    if (!acted.has(l.entry)) F.push(`${at}: the entry has no acts-on record`);
    if (l.receipts) {
      if (l.phrase) F.push(`${at}: give a phrase or receipts, not both`);
      if (!l.note) F.push(`${at}: a receipted link needs a note saying how the receipt bears on the entry`);
      if (!l.receipts.length) F.push(`${at}: empty receipts`);
      for (const x of l.receipts) { const m = inFile(x); if (m) F.push(`${at}: ${m}`); }
    } else if (!l.phrase || !nrm(e[l.field]).includes(nrm(l.phrase))) F.push(`${at}: phrase "${l.phrase}" is not in the entry's ${l.field} field`);
    used.add(l.invariant);
  }
  for (const v of V.INVARIANTS) if (!used.has(v.id)) F.push(`invariant ${v.id}: defined but linked to no entry`);
  const self = ["scripts/mathmap.mjs", "mapfill/invariants.js", "mapfill/formal.js", "mapfill/corrections.js", "mapfill/conditions.js", "mapfill/additions.js", "mapfill/flags.js", "mapfill/fill.js", "mapfill/index.js", "mapfill/d7-a.js", "mapfill/d7-b.js", "mapfill/d7-c.js", "mapfill/d7-d.js", "mapfill/d7-e.js", "mapfill/homes.js"].map((f) => readFileSync(join(ROOT, f), "utf8")).join("");
  if (/[\u2013\u2014]/.test(self)) F.push("an en or em dash in the math map layer's own files");
  return F;
}

function quality(es, vocab) {
  return {
    stubs: es.filter(isStub),
    offVocab: es.flatMap((e) => e.tags.filter((t) => !vocab.includes(t)).map((t) => [e.id, t])),
    badTagCount: es.filter((e) => e.tags.length < 2 || e.tags.length > 4),
    noInvariants: es.filter((e) => !e.preserved && !e.broken),
    anchorable: es.filter(anchorable),
  };
}

function render(P) {
  const Q = quality(P.entries, P.vocab), L0 = quality(P.landed, P.vocab);
  const L = ["# The math map, version 0.2", "", `*Generated by \`scripts/mathmap.mjs\` from \`${FILE}\` (verbatim) and the fill layer \`mapfill/\`. Do not edit by hand.*`, ""];
  L.push("The structural layer: typed mathematical transformations (input, output, preserved and broken invariants, functional tags). Query with `node scripts/mathmap.mjs --tag compression --domain D4` and similar; `--landed` queries the map without the fill layer. See the script header.", "");
  L.push("## 1. Entries by domain", "", "Counts after the fill layer, with the landed count in brackets. *Anchorable*: has input, output and at least one invariant field, so it can anchor a composite (a chain of entries whose types meet).", "", "| Domain | Name | Entries | Name-only stubs | With invariants | Anchorable |", "|---|---|---|---|---|---|");
  const cnt = (es, d, fn) => es.filter((e) => e.domain === d && fn(e)).length;
  for (const [d, v] of Object.entries(P.declared)) {
    L.push(`| ${d} | ${v.name} | ${cnt(P.entries, d, () => true)} | ${cnt(P.entries, d, isStub)} [${cnt(P.landed, d, isStub)}] | ${cnt(P.entries, d, (e) => e.preserved || e.broken)} [${cnt(P.landed, d, (e) => e.preserved || e.broken)}] | ${cnt(P.entries, d, anchorable)} [${cnt(P.landed, d, anchorable)}] |`);
  }
  L.push(`| **all** | | **${P.entries.length}** | **${Q.stubs.length}** [${L0.stubs.length}] | **${P.entries.length - Q.noInvariants.length}** [${P.landed.length - L0.noInvariants.length}] | **${Q.anchorable.length}** [${L0.anchorable.length}] |`, "");
  L.push("## 2. The fill layer", "");
  const clones = P.entries.filter((e) => e.origin.startsWith("clone") || e.fillOf?.startsWith("clone"));
  const resolved = P.entries.filter((e) => e.origin.startsWith("clone:"));
  const dangling = P.entries.filter((e) => e.origin === "clone-dangling" || e.fillOf === "clone-dangling");
  const selfp = P.entries.filter((e) => e.selfPointer);
  if (selfp.length) L.push(`- **Self-pointers: ${selfp.length}** (${selfp.map((e) => e.id).join(", ")}). The entry is the home its description points to and carries its own data; counted as landed.`);
  L.push(`- **Clone pointers: ${clones.length}.** Resolved to a home entry: ${resolved.length}. Dangling (the named home does not exist): ${dangling.length}, of which ${dangling.filter((e) => e.origin === "fill").length} are filled by hand.`);
  const byDom = (es) => [...new Set(es.map((e) => e.domain))].map((d) => `${d}: ${es.filter((e) => e.domain === d).length}`).join(", ");
  if (dangling.length) L.push(`  Dangling by domain: ${byDom(dangling)}. Unfilled: ${dangling.filter((e) => e.origin !== "fill").map((e) => `${e.id} ${e.name}`).join("; ") || "none"}.`);
  const fills = P.entries.filter((e) => e.origin === "fill");
  L.push(`- **Authored fills: ${fills.length}** (${byDom(fills)}). Written from standard mathematics, not reviewed against sources; the map's Unvalidated and Unreviewed status still applies.`);
  const readings = fills.filter((e) => e.reading);
  L.push(`- **Fills with a stated reading: ${readings.length}.** The name is ambiguous or nonstandard; the fill says how it was read.`, "");
  if (readings.length) L.push("| Entry | Name | Reading |", "|---|---|---|", ...readings.map((e) => `| ${e.id} | ${e.name} | ${e.unknown ? "**Unidentified.** " : ""}${e.reading} |`), "");
  if (P.additions.length) L.push(`- **Additions: ${P.additions.length}** (\`mapfill/additions.js\`): entries the map lacks, written for a composite and receipted by verbatim windows in excerpts/. Counted in the domain totals above. ${P.additions.map((a) => `${a.id} ${a.name}`).join("; ")}.`, "");
  L.push(`- **Invariant vocabulary** (\`mapfill/invariants.js\`): ${P.vocabulary.INVARIANTS.length} named invariants, ${P.vocabulary.RELATIONS.length} relations between them, ${P.vocabulary.LINKS.length} links from entries (${new Set(P.vocabulary.LINKS.map((l) => l.entry)).size} entries; ${P.vocabulary.LINKS.filter((l) => l.receipts).length} receipted where the entry is silent), each justified by a phrase in the entry's own field or by a quoted source; ${P.vocabulary.ACTS_ON.length} entries record what kinds of object they take and return. \`node scripts/compose.mjs --chain ID,ID,...\` reports what survives a chain.`, "");
  L.push(`- **Mathlib links: ${P.formal.links.length}** on ${new Set(P.formal.links.map((k) => k.entry)).size} entries (\`mapfill/formal.js\`), pinned at ${P.formal.mathlib.commit.slice(0, 7)}; ${P.formal.links.filter((k) => k.match === "conflicts").length} record a conflict with the entry as written.`, "");
  L.push(`- **Conditions: ${P.conditions.length}** (\`mapfill/conditions.js\`): the hypotheses an entry's claims need, receipted. Counterexamples recorded: ${P.conditions.reduce((n, c) => n + (c.counterexamples || []).length, 0)}.`, "");
  if (P.corrections.length) L.push(`- **Corrections: ${P.corrections.length}** (\`mapfill/corrections.js\`): landed fields a check found wrong or imprecise, replaced by receipted text (the landed text is kept on the entry). ${P.corrections.reduce((n, c) => n + Object.keys(c.fields).length, 0)} fields in ${P.corrections.map((c) => c.id).join(", ")}; ${P.entries.filter((e) => e.flagResolved).length} flags resolved.`, "");
  if (P.flags.length) L.push(`- **Flagged entries: ${P.flags.length}.** Landed content known to be wrong (\`mapfill/flags.js\`); withheld from anchoring until corrected.`, "", "| Entry | Name | Kind | Evidence | Status |", "|---|---|---|---|---|", ...P.flags.map((f) => `| ${f.id} | ${f.name} | ${f.kind} | ${f.evidence} | ${P.entries.find((e) => e.id === f.id)?.flagResolved ? "corrected" : "open"} |`), "");
  L.push("## 3. Functional tags", "", "| Tag | Entries |", "|---|---|");
  for (const t of P.vocab) L.push(`| \`${t}\` | ${P.entries.filter((e) => e.tags.includes(t)).length} |`);
  L.push("");
  const kinds = [...new Set(P.entries.map((e) => e.kind))];
  L.push("## 4. Operation kinds", "", ...kinds.map((k) => `- ${k}: ${P.entries.filter((e) => e.kind === k).length}`), "");
  L.push("## 5. Upward corrections still open", "", "Findings for the map; the landed text is not repaired here.", "");
  L.push(`- **Name-only stubs after the fill layer: ${Q.stubs.length}** (landed: ${L0.stubs.length}).`);
  L.push(`- **Entries without preserved or broken invariants: ${Q.noInvariants.length}** (landed: ${L0.noInvariants.length}).${Q.noInvariants.length ? ` By domain: ${byDom(Q.noInvariants)}.` : ""}`);
  L.push(`- **Off-vocabulary tags: ${Q.offVocab.length}.**${Q.offVocab.length ? ` ${[...new Set(Q.offVocab.map((x) => x[1]))].slice(0, 20).join(", ")}` : ""}`);
  L.push(`- **Entries outside the 2 to 4 tag rule: ${Q.badTagCount.length}.** Tags are the map's own and are not refilled here.`);
  const dm = text.match(/(\d+) primary \+ (\d+) effect \+ (\d+) bridge \+ (\d+) modifier = (\d+)/);
  if (dm) L.push(`- **Vocabulary count:** the map declares "${dm[0]}"; its tables list ${P.vocab.length} tags${Number(dm[5]) !== P.vocab.length ? " (the modifier table has one fewer row than declared)" : ""}.`);
  L.push("");
  return L.join("\n");
}

function show(e, full) {
  const origin = (e.origin === "map" ? "" : ` {${e.origin}${e.reading ? ", reading" : ""}}`) + (e.flag ? ` {FLAGGED: ${e.flag.kind}}` : "");
  const head = `${e.id} ${e.name} [${e.kind}; ${e.tags.join(", ")}]${isStub(e) ? " (stub)" : ""}${origin}`;
  if (!full) return `${head}\n  ${e.description}`;
  const lines = [head, `  ${e.description}`, `  input: ${e.input ?? "-"}`, `  output: ${e.output ?? "-"}`, `  preserved: ${e.preserved ?? "-"}`, `  broken: ${e.broken ?? "-"}`, `  complexity: ${e.complexity}`, `  status: ${e.status}`];
  if (e.invariants) lines.push(`  invariants: preserved [${e.invariants.preserved.join(", ")}]; broken [${e.invariants.broken.join(", ")}]${e.invariants.output.length ? `; output [${e.invariants.output.join(", ")}]` : ""}`);
  if (e.conditions) lines.push(`  conditions: ${e.conditions}`);
  for (const k of e.formal || []) lines.push(`  mathlib (${k.match}, ${k.field}): ${k.decl}`);
  for (const k of e.counterexamples || []) lines.push(`  counterexample: ${k.case}`);
  if (e.reading) lines.push(`  reading: ${e.reading}`);
  if (e.pointer) lines.push(`  landed as: ${e.pointer}`);
  if (e.corrected) lines.push(`  corrected: ${e.corrected.join(", ")} (landed: ${e.corrected.map((k) => `${k} "${e.landedFields[k]}"`).join("; ")})`);
  if (e.flagResolved) lines.push(`  flag resolved: ${e.flagResolved.evidence}`);
  return lines.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const P = parse();
  const F = check(P);
  if (F.length) { for (const f of F) console.log("FAIL", f); console.log(`mathmap: ${F.length} failure(s)`); process.exit(1); }
  const a = process.argv.slice(2);
  const all = (k) => a.flatMap((x, i) => (x === k ? [a[i + 1]] : []));
  const one = (k) => all(k)[0];
  const query = ["--id", "--domain", "--tag", "--kind", "--text", "--stubs", "--origin"].some((k) => a.includes(k));
  if (query) {
    let es = a.includes("--landed") ? P.landed : P.entries;
    if (one("--id")) es = es.filter((e) => e.id === one("--id"));
    if (one("--domain")) es = es.filter((e) => e.domain === one("--domain"));
    for (const t of all("--tag")) es = es.filter((e) => e.tags.includes(t));
    if (one("--kind")) es = es.filter((e) => e.kind.toLowerCase() === one("--kind").toLowerCase());
    if (one("--text")) { const q = one("--text").toLowerCase(); es = es.filter((e) => [e.name, e.description, e.preserved, e.broken, e.input, e.output].filter(Boolean).join(" ").toLowerCase().includes(q)); }
    if (one("--origin")) { const o = one("--origin"); es = es.filter((e) => (o === "dangling" ? e.origin === "clone-dangling" : e.origin.startsWith(o))); }
    if (a.includes("--stubs")) es = es.filter(isStub);
    const lim = Number(one("--limit") || 25);
    console.log(`${es.length} match(es)${es.length > lim ? `, showing ${lim}` : ""}`);
    for (const e of es.slice(0, lim)) console.log(show(e, a.includes("--full") || !!one("--id")));
    process.exit(0);
  }
  if (!a.includes("--check")) { writeFileSync(join(ROOT, "reports/MATHMAP.md"), render(P) + "\n"); console.log("wrote reports/MATHMAP.md"); }
  const Q = quality(P.entries, P.vocab);
  console.log(`mathmap: PASS (${P.entries.length} entries in ${Object.keys(P.declared).length} domains; ${P.fills.length} fills; ${Q.stubs.length} stubs left; ${Q.anchorable.length} anchorable)`);
}
