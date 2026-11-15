// Role: hypotheses as predicates, checked and applied. Validates mapfill/predicates.js (every row receipted, every
//   quoted field pinned) and judges a chain of entries against it: which of each step's requirements are met.
// Contract: `node scripts/predicates.mjs --check` (the gate): every predicate is declared once on a declared
//   carrier and used; implications are acyclic and each has one basis; every row names an existing entry by its
//   name, a declared predicate and a role, and carries exactly one of receipts (the quote occurs in a file under
//   excerpts/ or source/), formal (the entry is linked to the declaration, and the quote occurs in the
//   declaration's statement window, or in the named excerpts/mathlib-context-*.txt file of the declaration's
//   own source at the pinned commit) or own (the phrase occurs in the entry's field); a formal row lists its
//   ambient premises; every field quoted by own or claim is pinned in PINS at its current hash, and no pin is
//   unused; no entry both establishes and destroys one predicate; a counterexample answers a requires row; the
//   CHAINS give the verdicts they expect; a selftest runs the chain rules on synthetic rows. `--pins` prints the
//   current pin table. Exports data(), check(P?), rowEvidence(P, E), hypotheses(ids, P, E, opts?, D?),
//   describeHypotheses(h) and forEntry(P, E).
//   A chain: a set of predicates holds on entry (opts.given, closed forward under the implications). At each
//   step every requires row is judged: met (the predicate holds), violated (an earlier step destroyed it and
//   none re-established it) or unknown (not given, not established, or dropped by a step that says nothing on
//   it: silence is never survival). Then the step's rows act: destroys removes a predicate and everything that
//   implies it; keeps carries a predicate that held; establishes adds one; everything else is dropped. A step
//   with no rows drops everything and is listed, so that an absence of rows is not read as an absence of
//   hypotheses. The chain's verdict is its worst requirement: violated, unknown, met, or none when no step
//   has a requires row. By default the verdict is reported and changes nothing; with opts.requireHypotheses
//   a violated verdict marks the chain failed. Unknown never fails a chain [ruling: operator, 2026-11-15].
//   A predicate outside the vocabulary in opts.given is an error: the check fails closed.
//   Evidence: a row's level (scripts/evidence.mjs) is sourced for receipts; formal for a formal row whose link
//   is exact and whose quote is in the declaration's own window, sourced for any other formal row (an inherited
//   `variable` binder is read, and that the declaration includes it is inferred: no Lean is compiled here); for
//   an own row the level of the quoted field, unchecked for conditions and counterexamples (authored overlay
//   text). A verdict carries the weakest level among the rows it rests on.
// Invariant: read-only. A verdict grades what the rows say about what the entries say; none is a proof. The
//   count of predicates used by one entry is a reading, printed and never judged.
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";
import { evidence, weaker } from "./evidence.mjs";
import { excerptFile } from "./formal.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ROLES = ["requires", "establishes", "keeps", "destroys", "silent"];
const FIELDS = ["description", "input", "output", "preserved", "broken", "conditions", "counterexamples"];
const WORST = ["violated", "unknown", "met"];
const norm = (s) => s.replace(/\s+/g, " ").trim();
const read = (f) => { try { return readFileSync(join(ROOT, f), "utf8"); } catch { return null; } };

export const data = () => require("../mapfill/predicates.js");
// The overlaid text of a field a row may quote; counterexamples are the cases, one per line.
export const fieldText = (e, f) => (f === "counterexamples" ? (e.counterexamples || []).map((c) => c.case).join("\n") : e[f] || "");
export const pinOf = (e, f) => createHash("sha256").update(fieldText(e, f)).digest("hex").slice(0, 12);
// The (entry, field) pairs a set of rows quotes by own or by claim.
const quoted = (D) => [...D.HYPOTHESES, ...D.COUNTEREXAMPLES].flatMap((r) => [r.own && [r.entry, r.own.field], r.claim && [r.entry, r.claim.field]].filter(Boolean))
  .concat(D.IMPLIES.filter((i) => i.own).map((i) => [i.own.entry, i.own.field]));
// A declaration's statement window in a formal excerpt file: from its header line to the next blank line.
const declWindow = (text, decl) => { const m = text.split(/\n\n+/).find((b) => b.startsWith(`-- ${decl} (line `)); return m ? m.slice(m.indexOf("\n") + 1) : null; };

export function check(P = parse(), D = data()) {
  const F = [], by = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const carriers = P.vocabulary.CARRIERS, commit = P.formal.mathlib.commit;
  const ids = new Set();
  for (const p of D.PREDICATES) {
    if (ids.has(p.id)) F.push(`predicate ${p.id}: declared twice`); ids.add(p.id);
    if (!(p.carrier in carriers)) F.push(`predicate ${p.id}: no carrier ${p.carrier}`);
    if (!p.definition) F.push(`predicate ${p.id}: no definition`);
  }
  const inFile = (r, where) => {
    if (!/^(excerpts|source)\//.test(r.file)) return F.push(`${where}: receipt must point into excerpts/ or source/`);
    const t = read(r.file);
    if (t === null) return F.push(`${where}: missing receipt file ${r.file}`);
    if (!norm(t).includes(norm(r.quote))) F.push(`${where}: quote not in ${r.file}: "${r.quote.slice(0, 50)}"`);
  };
  const inField = (id, o, where) => {
    const e = by[id];
    if (!e) return F.push(`${where}: no entry ${id}`);
    if (!FIELDS.includes(o.field)) return F.push(`${where}: no field ${o.field}`);
    if (!o.phrase || !fieldText(e, o.field).includes(o.phrase)) F.push(`${where}: phrase not in ${id} ${o.field}: "${(o.phrase || "").slice(0, 50)}"`);
  };
  const one = (r, kinds, where) => { const n = kinds.filter((k) => r[k]); if (n.length !== 1) F.push(`${where}: needs exactly one of ${kinds.join(", ")}, has ${n.join(", ") || "none"}`); return n[0]; };
  for (const i of D.IMPLIES) {
    const w = `implication ${i.from} to ${i.to}`;
    for (const p of [i.from, i.to]) if (!ids.has(p)) F.push(`${w}: no predicate ${p}`);
    const k = one(i, ["receipts", "definitional", "own"], w);
    if (k === "receipts") for (const r of i.receipts) inFile(r, w);
    if (k === "own") inField(i.own.entry, i.own, w);
  }
  // Acyclic: no predicate reaches itself along the implications.
  const out = (p) => D.IMPLIES.filter((i) => i.from === p).map((i) => i.to);
  for (const p of ids) { const seen = new Set(), q = [...out(p)]; while (q.length) { const x = q.pop(); if (x === p) { F.push(`implications: a cycle through ${p}`); break; } if (!seen.has(x)) { seen.add(x); q.push(...out(x)); } } }
  const rowCheck = (r, where, kinds) => {
    const e = by[r.entry];
    if (!e) return F.push(`${where}: no entry ${r.entry}`);
    if (e.name !== r.name) F.push(`${where}: entry is named "${e.name}", the row says "${r.name}"`);
    const k = one(r, kinds, where);
    if (k === "receipts") for (const x of r.receipts) inFile(x, where);
    if (k === "own") inField(r.entry, r.own, where);
    if (k === "formal") {
      const link = P.formal.links.find((l) => l.entry === r.entry && l.decl === r.formal.decl);
      if (!link) return F.push(`${where}: ${r.entry} has no link to ${r.formal.decl} in mapfill/formal.js`);
      if (!Array.isArray(r.ambient)) F.push(`${where}: a formal row lists its ambient premises (an empty list when the rows carry them all)`);
      if (r.formal.at) {
        const t = read(r.formal.at);
        if (!/^excerpts\/mathlib-context-/.test(r.formal.at) || t === null) return F.push(`${where}: no context excerpt ${r.formal.at}`);
        if (!t.split("\n")[1]?.includes(`/${commit}/${link.file}`)) F.push(`${where}: ${r.formal.at} is not ${link.file} at the pinned commit`);
        if (!norm(t).includes(norm(r.formal.quote))) F.push(`${where}: quote not in ${r.formal.at}: "${r.formal.quote.slice(0, 50)}"`);
      } else {
        const w = declWindow(read(excerptFile(link.file)) || "", r.formal.decl);
        if (w === null) F.push(`${where}: no statement window for ${r.formal.decl} in ${excerptFile(link.file)}`);
        else if (!norm(w).includes(norm(r.formal.quote))) F.push(`${where}: quote not in the statement of ${r.formal.decl}: "${r.formal.quote.slice(0, 50)}"`);
      }
    }
    if (r.claim) inField(r.entry, r.claim, `${where} claim`);
  };
  const seen = new Set();
  for (const r of D.HYPOTHESES) {
    const where = `${r.entry} ${r.role} ${r.predicate}`;
    if (seen.has(where)) F.push(`${where}: the row appears twice`); seen.add(where);
    if (!ROLES.includes(r.role)) F.push(`${where}: no role ${r.role}`);
    if (!ids.has(r.predicate)) F.push(`${where}: no predicate ${r.predicate}`);
    for (const g of r.given || []) if (!ids.has(g)) F.push(`${where}: given names no predicate ${g}`);
    if (r.given && !["establishes", "keeps"].includes(r.role)) F.push(`${where}: given belongs on an establishes or keeps row`);
    rowCheck(r, where, ["receipts", "formal", "own"]);
  }
  const has = (entry, role, p) => D.HYPOTHESES.some((r) => r.entry === entry && r.role === role && r.predicate === p);
  for (const r of D.HYPOTHESES) if (r.role === "establishes" && has(r.entry, "destroys", r.predicate)) F.push(`${r.entry}: establishes and destroys ${r.predicate}`);
  for (const r of D.HYPOTHESES) if (r.role === "silent" && ["establishes", "keeps", "destroys"].some((x) => has(r.entry, x, r.predicate))) F.push(`${r.entry}: silent on ${r.predicate} and also acts on it`);
  for (const c of D.COUNTEREXAMPLES) {
    const where = `${c.entry} counterexample dropping ${c.drops}`;
    if (!has(c.entry, "requires", c.drops)) F.push(`${where}: answers no requires row`);
    if (!c.witness) F.push(`${where}: no witness`);
    rowCheck(c, where, ["receipts", "own"]);
  }
  const used = new Set([...D.HYPOTHESES.map((r) => r.predicate), ...D.IMPLIES.flatMap((i) => [i.from, i.to])]);
  for (const p of ids) if (!used.has(p)) F.push(`predicate ${p}: declared and used by no row or implication`);
  // Pins: every quoted field at its current hash, and nothing else.
  const need = new Map(quoted(D).filter(([id]) => by[id]).map(([id, f]) => [`${id}.${f}`, pinOf(by[id], f)]));
  for (const [k, h] of need) if (D.PINS[k] !== h) F.push(`${k}: ${D.PINS[k] ? `the field changed since its rows were read (pinned ${D.PINS[k]}, now ${h}); read the rows again, then renew the pin` : `not pinned (now ${h})`}`);
  for (const k of Object.keys(D.PINS)) if (!need.has(k)) F.push(`${k}: pinned and quoted by no row`);
  const heldIds = new Set();
  for (const h of D.HELD) { if (heldIds.has(h.row)) F.push(`held ${h.row}: listed twice`); heldIds.add(h.row); if (!h.why || !h.closes) F.push(`held ${h.row}: needs why and closes`); if (h.entry && !by[h.entry]) F.push(`held ${h.row}: no entry ${h.entry}`); }
  if (!F.length) {
    const E = evidence(P);
    for (const c of D.CHAINS) { const h = hypotheses(c.steps, P, E, { given: c.given }, D); if (h.error) F.push(`chain ${c.steps.join(" > ")}: ${h.error}`); else if (h.verdict !== c.expect) F.push(`chain ${c.steps.join(" > ")} given {${c.given.join(", ")}}: ${h.verdict}, expected ${c.expect}`); }
  }
  return F;
}

// A row's evidence level, as a function of the row.
export function rowEvidence(P, E) {
  const by = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const ownLevel = (id, f) => (["conditions", "counterexamples"].includes(f) || !by[id] ? "unchecked" : E.field(by[id], f).level);
  return (r) => {
    if (r.receipts) return "sourced";
    if (r.definitional) return "formal";
    if (r.formal) { const l = P.formal.links.find((k) => k.entry === r.entry && k.decl === r.formal.decl); return l?.match === "exact" && !r.formal.at ? "formal" : "sourced"; }
    if (r.own) return ownLevel(r.own.entry || r.entry, r.own.field);
    return "unchecked";
  };
}

export function hypotheses(ids, P, E, opts = {}, D = data()) {
  const declared = new Set(D.PREDICATES.map((p) => p.id)), given = opts.given || [];
  const bad = given.filter((p) => !declared.has(p));
  if (bad.length) return { error: `no such predicates: ${bad.join(", ")}` };
  const ev = rowEvidence(P, E), weak = (a, b) => (a && b ? weaker(a, b) : a || b);
  // holds: predicate to { level, by }: the weakest row it rests on (null when only the caller's word), and how it came to hold.
  const fwd = (holds) => { let grew = true; while (grew) { grew = false; for (const i of D.IMPLIES) if (holds.has(i.from) && !holds.has(i.to)) { const a = holds.get(i.from); holds.set(i.to, { level: weak(a.level, ev(i)), by: `${a.by}, and ${i.from} implies ${i.to}`, given: a.given }); grew = true; } } return holds; };
  const back = (set) => { let grew = true; while (grew) { grew = false; for (const i of D.IMPLIES) if (set.has(i.to) && !set.has(i.from)) { set.set(i.from, set.get(i.to)); grew = true; } } return set; };
  let holds = fwd(new Map(given.map((p) => [p, { level: null, by: "given", given: true }])));
  const destroyed = new Map(), dropped = new Map(), silentOn = new Map(), requirements = [], unrowed = [];
  ids.forEach((id, k) => {
    const rows = D.HYPOTHESES.filter((r) => r.entry === id);
    if (!rows.length) unrowed.push(id);
    for (const r of rows.filter((r) => r.role === "requires")) {
      const p = r.predicate, h = holds.get(p), d = destroyed.get(p);
      const x = { step: k + 1, entry: id, predicate: p, ...(r.claim ? { claim: r.claim } : {}), ...(r.note ? { note: r.note } : {}) };
      if (h) Object.assign(x, { verdict: "met", detail: h.by, evidence: weak(ev(r), h.level), ...(h.given ? { restsOnGiven: true } : {}) });
      else if (d) Object.assign(x, { verdict: "violated", detail: `destroyed at step ${d.step} (${d.by})`, evidence: weak(ev(r), d.level) });
      else {
        const lost = dropped.get(p), s = silentOn.get(p);
        Object.assign(x, { verdict: "unknown", evidence: ev(r), detail: lost ? `it held until step ${lost.step}, where ${lost.by} says nothing on it`
          : s ? `not given, and step ${s.step} (${s.by}) is recorded silent on it` : k ? "not given, and no earlier step establishes it" : "not given" });
      }
      if (x.verdict !== "met") { const c = D.COUNTEREXAMPLES.find((c) => c.entry === id && c.drops === p); if (c) x.counterexample = c.witness; }
      requirements.push(x);
    }
    const met = (r) => !r.given || r.given.every((p) => holds.has(p));
    const keep = new Map(rows.filter((r) => r.role === "keeps" && met(r)).map((r) => [r.predicate, ev(r)]));
    const gone = back(new Map(rows.filter((r) => r.role === "destroys").map((r) => [r.predicate, ev(r)])));
    const next = new Map();
    for (const [p, h] of holds) {
      if (gone.has(p)) continue;
      if (keep.has(p)) next.set(p, { ...h, level: weak(h.level, keep.get(p)), by: `${h.by}, kept at step ${k + 1} (${id})` });
      else dropped.set(p, { step: k + 1, by: id });
    }
    for (const [p, level] of gone) { destroyed.set(p, { step: k + 1, by: id, level }); dropped.delete(p); }
    for (const r of rows.filter((r) => r.role === "establishes" && met(r))) next.set(r.predicate, { level: ev(r), by: `established at step ${k + 1} (${id})` });
    for (const r of rows.filter((r) => r.role === "silent")) silentOn.set(r.predicate, { step: k + 1, by: id });
    holds = fwd(next);
    for (const p of holds.keys()) { destroyed.delete(p); dropped.delete(p); }
  });
  const verdict = requirements.length ? WORST.find((v) => requirements.some((x) => x.verdict === v)) : "none";
  const enforced = !!opts.requireHypotheses;
  return { given, requirements, unrowed, holdsAtEnd: [...holds.keys()].sort(), verdict, enforced, failed: enforced && verdict === "violated" };
}

export function describeHypotheses(h) {
  if (!h.requirements.length && !h.given.length) return h.unrowed.length ? [`  hypotheses: no rows yet for ${h.unrowed.join(", ")} (silence, never an absence of hypotheses)`] : [];
  const L = [`  hypotheses, ${h.given.length ? `given ${h.given.join(", ")}` : "nothing given"}: ${h.verdict}${h.failed ? " (the chain fails: --require-hypotheses)" : h.verdict === "violated" ? " (reported only; --require-hypotheses makes it a failure)" : ""}`];
  for (const x of h.requirements) {
    L.push(`    ${x.verdict} at step ${x.step} (${x.entry}): ${x.predicate} (${x.detail})${x.claim ? `, needed for "${x.claim.phrase}" in its ${x.claim.field}` : ""} [${x.evidence}${x.restsOnGiven ? ", and the caller's word" : ""}]`);
    if (x.counterexample) L.push(`      counterexample: ${x.counterexample}`);
  }
  if (h.unrowed.length) L.push(`    no rows yet for ${h.unrowed.join(", ")}: a step without rows carries nothing forward (silence, never an absence of hypotheses)`);
  return L;
}

// Per entry, for the build: the rows with their evidence, and the counterexamples.
export function forEntry(P, E, D = data()) {
  const ev = rowEvidence(P, E);
  const basis = (r) => (r.receipts ? { receipts: r.receipts } : r.formal ? { formal: r.formal, ambient: r.ambient } : { own: r.own });
  const rows = {}, cx = {};
  for (const r of D.HYPOTHESES) (rows[r.entry] ||= []).push({ role: r.role, predicate: r.predicate, ...(r.claim ? { claim: r.claim } : {}), ...(r.given ? { given: r.given } : {}), ...basis(r), evidence: ev(r), ...(r.note ? { note: r.note } : {}) });
  for (const c of D.COUNTEREXAMPLES) (cx[c.entry] ||= []).push({ drops: c.drops, ...(c.claim ? { claim: c.claim } : {}), witness: c.witness, ...basis(c), evidence: ev(c) });
  return { rows, cx, implications: D.IMPLIES.map((i) => ({ ...i, evidence: ev(i) })) };
}

// The chain rules on synthetic rows; none is a map entry.
function selftest(P, E) {
  const F = [];
  const R = (entry, role, predicate, extra = {}) => ({ entry, name: entry, role, predicate, receipts: [], ...extra });
  const D = { PREDICATES: ["p", "q", "r"].map((id) => ({ id })), IMPLIES: [{ from: "p", to: "q", definitional: "synthetic" }], COUNTEREXAMPLES: [{ entry: "need-q", drops: "q", witness: "w" }],
    HYPOTHESES: [R("make-p", "establishes", "p"), R("keep-p", "keeps", "p"), R("kill-q", "destroys", "q"), R("need-p", "requires", "p"), R("need-q", "requires", "q"), R("if-r", "establishes", "p", { given: ["r"] }), R("mute", "silent", "q")] };
  const run = (ids, given = [], opts = {}) => hypotheses(ids, P, E, { given, ...opts }, D);
  const want = (label, got, exp) => { if (got !== exp) F.push(`${label}: got ${got}, expected ${exp}`); };
  want("established then required", run(["make-p", "need-p"]).verdict, "met");
  want("an implication carries holding forward", run(["make-p", "need-q"]).verdict, "met");
  want("a step without rows drops what held", run(["make-p", "blank", "need-p"]).verdict, "unknown");
  want("a keeps row carries it", run(["make-p", "keep-p", "need-p"]).verdict, "met");
  want("an implied predicate stays through what implies it", run(["make-p", "keep-p", "need-q"]).verdict, "met");
  want("destroyed then required is violated", run(["kill-q", "need-q"], ["q"]).verdict, "violated");
  want("destruction flows backward along an implication", run(["kill-q", "need-p"], ["p"]).verdict, "violated");
  want("re-established after destruction", run(["kill-q", "make-p", "need-q"], ["q"]).verdict, "met");
  want("nothing given is unknown, never violated", run(["need-p"]).verdict, "unknown");
  want("a conditional establishes needs its given", run(["if-r", "need-p"]).verdict, "unknown");
  want("a conditional establishes with its given", run(["if-r", "need-p"], ["r"]).verdict, "met");
  want("an unmet requirement prints its counterexample", run(["need-q"]).requirements[0].counterexample, "w");
  want("a recorded silence is named", /recorded silent/.test(run(["mute", "need-q"]).requirements[0].detail), true);
  want("an undeclared predicate is an error", !!run(["need-p"], ["zz"]).error, true);
  want("violated is reported only by default", run(["kill-q", "need-q"], ["q"]).failed, false);
  want("violated fails the chain when required", run(["kill-q", "need-q"], ["q"], { requireHypotheses: true }).failed, true);
  want("unknown never fails the chain", run(["need-p"], [], { requireHypotheses: true }).failed, false);
  want("no requires rows is no verdict", run(["make-p"]).verdict, "none");
  return F;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const P = parse(), D = data(), by = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  if (process.argv.includes("--pins")) {
    const need = [...new Set(quoted(D).map(([id, f]) => `${id}.${f}`))].sort();
    console.log("const PINS = {\n" + need.map((k) => { const [id, f] = k.split("."); return `  "${k}": "${by[id] ? pinOf(by[id], f) : "no such entry"}",`; }).join("\n") + "\n};");
    process.exit(0);
  }
  const F = [...check(P, D), ...selftest(P, evidence(P))];
  for (const f of F) console.log("FAIL", f);
  if (F.length) { console.log(`predicates: ${F.length} failure(s)`); process.exit(1); }
  const users = Object.fromEntries(D.PREDICATES.map((p) => [p.id, new Set(D.HYPOTHESES.filter((r) => r.predicate === p.id).map((r) => r.entry)).size]));
  const byRole = ROLES.map((r) => `${r} ${D.HYPOTHESES.filter((x) => x.role === r).length}`).join(", ");
  console.log(`predicates: PASS (${D.HYPOTHESES.length} rows on ${new Set(D.HYPOTHESES.map((r) => r.entry)).size} entries over ${D.PREDICATES.length} predicates: ${byRole}; ${D.IMPLIES.length} implications, ${D.COUNTEREXAMPLES.length} counterexamples, ${Object.keys(D.PINS).length} pinned fields, ${D.CHAINS.length} chains, ${D.HELD.length} pilot rows held; reading: ${Object.values(users).filter((n) => n <= 1).length} predicates are used by at most one entry)`);
}
