// Role: composition. For a chain of entries applied in order, reports which named invariants survive the
//   whole chain, where each one breaks, where the map is silent, and whether each step's output kind fits
//   the next step's input.
// Contract: `node scripts/compose.mjs --chain D2-118,D2-117 [--require ID,ID] [--json]`, or `--selftest`.
//   Exports compose(chain, P?, opts?). An
//   invariant's status: survives (every step preserves it), broken (at the first step that breaks it), or
//   unknown (no step breaks it, but some step says nothing about it; the silent steps are listed); a step
//   whose output produces the invariant after an earlier step broke it restores it; one that produces it
//   before a later step breaks it is reported as created then broken. A restoration or creation followed
//   by a step that acts on the invariant's carrier and says nothing about it is reported as restored then
//   unknown (or created then unknown): producing an invariant says nothing about a later silent step.
//   A chain that breaks and produces an invariant more than once is judged by its final state: restored
//   when it ends produced after a break (reporting the last loss and the production after it), restored
//   then broken when it ends broken after a restoration, with the whole history listed. A step that both
//   breaks and produces an invariant counts as breaking it. An invariant missing from the vocabulary is
//   reported unknown, with a note, never as surviving.
//   Steps' claims are closed under the vocabulary's relations: an equivalence carries preservation and
//   breaking both ways, and outputs too; an implication over "state" carries an output (a step making P
//   hold makes Q hold) but not preservation or breaking; an implication carries those only when it relates preservation itself (over:
//   "preservation": a functor preserving limits preserves finite limits). An implication between state
//   facts (over: "state") is not closed over: a step preserving P, with P implying Q, can still take a
//   Q state outside Q, and a step breaking Q need not break P.
//   An invariant is judged only at the steps that act on its carrier (a step on surfaces is not asked
//   about a curve's invariants); the other steps are not applicable. Each join between steps is checked,
//   reading a step's input kinds as joint operands (a surface and a curve on it): match (every input kind
//   is supplied by a kind of the previous output), narrowing (some input needs a more special kind than
//   the output gives), partial (some input kinds are not supplied by the previous step at all; they must
//   come from outside the chain, named in the detail), or mismatch (no input kind is supplied).
//   Each result, join and the chain as a whole carries evidence: the weakest level (scripts/evidence.mjs)
//   among the claims it rests on, and where that claim is.
//   An invariant whose class is relational or hyperproperty (mapfill/invariants.js) is never reported as
//   surviving: per-join claims cannot establish it, so unless a step states it broken it is reported as
//   "whole-chain check required"; the per-step status and evidence it overrides are kept as claimedStatus
//   and claimedEvidence. With `--require ID,ID` (or opts.require) the chain is graded against
//   a policy: each required invariant gets one of four verdicts, "holds under the map's claims",
//   "violation stated", "unknown" or "whole-chain check required", and the chain gets the worst of them.
//   These grade what the map says; none is a proof about an implementation.
//   Context labels (CONTEXT in mapfill/invariants.js) are carried along the chain: a label raised at a
//   step stays on every later step until a step clears it, and a step that forbids a label present on
//   entry is a context violation. Under a policy, any context violation makes the chain's verdict
//   "violation stated".
// Invariant: read-only. The answer is only as good as the entries' fields and links: "unknown" means the
//   map does not say, not that the invariant is lost. `--selftest` checks these rules on synthetic chains.
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";
import { evidence, weaker, rank } from "./evidence.mjs";

// Closes a step's direct claims (a Map from invariant to evidence level) under the relations, carrying the
// evidence along: a derived claim is as strong as the best chain of claim and relation that yields it.
function closure(direct, R, dir, relEv) {
  const out = new Map(direct);
  let grew = true;
  while (grew) {
    grew = false;
    for (const r of R) {
      if (r.kind !== "equivalent" && r.over !== "preservation") continue;
      const pairs = r.kind === "equivalent" ? [[r.from, r.to], [r.to, r.from]] : dir === "down" ? [[r.from, r.to]] : [[r.to, r.from]];
      for (const [a, b] of pairs) {
        if (!out.has(a)) continue;
        const l = weaker(out.get(a), relEv(r));
        if (!out.has(b) || rank(l) > rank(out.get(b))) { out.set(b, l); grew = true; }
      }
    }
  }
  return out;
}

// What a step outputs, closed under the relations that carry a state: an equivalence both ways, and an
// implication over "state" (from holding in a state gives to in that state). An implication over
// "preservation" relates preserving, not holding, so it does not carry an output.
function outputClosure(direct, R, relEv) {
  const out = new Map(direct);
  let grew = true;
  while (grew) {
    grew = false;
    for (const r of R) {
      const pairs = r.kind === "equivalent" ? [[r.from, r.to], [r.to, r.from]] : r.over === "state" ? [[r.from, r.to]] : [];
      for (const [a, b] of pairs) {
        if (!out.has(a)) continue;
        const l = weaker(out.get(a), relEv(r));
        if (!out.has(b) || rank(l) > rank(out.get(b))) { out.set(b, l); grew = true; }
      }
    }
  }
  return out;
}

const isa = (k, t, C) => { for (let x = k; x; x = C[x]) if (x === t) return true; return false; };

export function compose(chain, P = parse(), opts = {}) {
  const by = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const R = P.vocabulary.RELATIONS;
  const missing = chain.filter((id) => !by[id]);
  if (missing.length) return { chain, error: `no such entries: ${missing.join(", ")}` };
  const C = P.vocabulary.CARRIERS, carrierOf = Object.fromEntries(P.vocabulary.INVARIANTS.map((v) => [v.id, v.carrier]));
  const E = evidence(P);
  const steps = chain.map((id) => {
    const e = by[id], inv = e.invariants || { preserved: [], broken: [], output: [] };
    const direct = (f) => new Map(inv[f].map((v) => [v, E.claim(e, f, v).level]));
    return { id, name: e.name, actsOn: e.actsOn || null, preserved: closure(direct("preserved"), R, "down", E.relation), broken: closure(direct("broken"), R, "up", E.relation), output: outputClosure(direct("output"), R, E.relation),
      inputEv: E.field(e, "input").level, outputEv: E.field(e, "output").level };
  });
  // The weakest of the claims a result rests on: [step index, field, level] triples.
  const rest = (claims) => claims.reduce((w, c) => (!w || rank(c[2]) < rank(w[2]) ? c : w), null);
  const ev = (claims) => { const w = rest(claims); return w ? { level: w[2], weakest: { step: w[0] + 1, id: steps[w[0]].id, field: w[1], level: w[2] } } : null; };
  const applies = (st, v) => { const c = carrierOf[v]; if (c === "operation" || !st.actsOn) return true; return [...st.actsOn.input, ...st.actsOn.output].some((k) => isa(k, c, C)); };
  const joins = steps.slice(1).map((st, i) => {
    const a = steps[i];
    if (!a.actsOn || !st.actsOn) return { from: a.id, to: st.id, status: "unknown" };
    const jev = ev([[i, "output", a.outputEv], [i + 1, "input", st.inputEv]]);
    // Each input kind is a required operand: supplied exactly, supplied by narrowing, or not supplied.
    const need = st.actsOn.input.map((n) => {
      if (a.actsOn.output.some((o) => isa(o, n, C))) return { n, by: "match" };
      const o = a.actsOn.output.find((o) => isa(n, o, C));
      return o ? { n, by: "narrowing", o } : { n, by: "none" };
    });
    const none = need.filter((x) => x.by === "none"), nar = need.filter((x) => x.by === "narrowing");
    if (none.length === need.length) return { from: a.id, to: st.id, status: "mismatch", detail: `${a.actsOn.output.join("/")} out, ${st.actsOn.input.join("/")} in`, evidence: jev };
    if (none.length) return { from: a.id, to: st.id, status: "partial", detail: `${none.map((x) => x.n).join(", ")} not supplied by ${a.id}`, evidence: jev };
    if (nar.length) return { from: a.id, to: st.id, status: "narrowing", detail: nar.map((x) => `${x.o} to ${x.n}`).join(", "), evidence: jev };
    return { from: a.id, to: st.id, status: "match", evidence: jev };
  });
  const all = new Set(steps.flatMap((s) => [...s.preserved.keys(), ...s.broken.keys(), ...s.output.keys()]));
  const names = Object.fromEntries(P.vocabulary.INVARIANTS.map((v) => [v.id, v.name]));
  const result = [...all].sort().map((v) => {
    if (!(v in carrierOf)) return { invariant: v, name: v, status: "unknown", silentAt: [], notApplicable: [], note: "not in the invariant vocabulary, so no step can be judged on it" };
    // The invariant's history: each step that breaks or produces it, in order. A step that does both counts as a break.
    const history = steps.map((s, k) => (s.broken.has(v) ? { step: k + 1, by: s.id, event: "broken" } : s.output.has(v) ? { step: k + 1, by: s.id, event: "produced" } : null)).filter(Boolean);
    const B = (k) => [k, "broken", steps[k].broken.get(v)], O = (k) => [k, "output", steps[k].output.get(v)];
    // Steps after a production that act on the invariant and neither preserve nor produce it again.
    const silentAfter = (k) => steps.slice(k + 1).filter((s) => applies(s, v) && !s.preserved.has(v) && !s.output.has(v)).map((s) => s.id);
    const hist = history.length > 2 ? { history } : {};
    if (history.length) {
      // The status follows the final state: the last event, and the event that last moved it the other way.
      const last = history.at(-1), k = last.step - 1;
      // lastOther: where the final state was last the opposite, taken at the start of that run (the first of
      // several consecutive breaks is where the invariant was lost).
      const before = history.slice(0, -1);
      let oi = before.map((h) => h.event).lastIndexOf(last.event === "produced" ? "broken" : "produced");
      while (oi > 0 && before[oi - 1].event === before[oi].event) oi--;
      const lastOther = oi >= 0 ? before[oi] : null;
      if (last.event === "produced") {
        const sa = silentAfter(k);
        if (lastOther) { const b = lastOther.step - 1, r = history.find((h) => h.event === "produced" && h.step - 1 > b).step - 1; return { invariant: v, name: names[v], status: sa.length ? "restored then unknown" : "restored", brokenAt: b + 1, restoredAt: r + 1, by: steps[r].id, silentAfter: sa, ...hist, evidence: ev([B(b), O(r)]) }; }
        const c = history[0].step - 1;
        return { invariant: v, name: names[v], status: sa.length ? "created then unknown" : "created", at: c + 1, by: steps[c].id, silentAfter: sa, ...hist, evidence: ev([O(k)]) };
      }
      if (lastOther) {
        const c = lastOther.step - 1, again = before.some((h) => h.event === "broken" && h.step - 1 < c);
        const lost = history.find((h) => h.event === "broken" && h.step - 1 > c).step - 1;
        return { invariant: v, name: names[v], status: again ? "restored then broken" : "created then broken", createdAt: c + 1, createdBy: steps[c].id, at: lost + 1, by: steps[lost].id, silentBefore: steps.slice(c + 1, lost).filter((s) => applies(s, v) && !s.preserved.has(v)).map((s) => s.id), ...hist, evidence: ev([O(c), B(lost)]) };
      }
      const b = history[0].step - 1;
      return { invariant: v, name: names[v], status: "broken", at: b + 1, by: steps[b].id, silentBefore: steps.slice(0, b).filter((s) => applies(s, v) && !s.preserved.has(v)).map((s) => s.id), ...hist, evidence: ev([B(b)]) };
    }
    const na = steps.filter((s) => !applies(s, v)).map((s) => s.id);
    const silent = steps.filter((s) => applies(s, v) && !s.preserved.has(v)).map((s) => s.id);
    const kept = steps.map((s, k) => [k, s]).filter(([, s]) => applies(s, v) && s.preserved.has(v)).map(([k, s]) => [k, "preserved", s.preserved.get(v)]);
    return silent.length ? { invariant: v, name: names[v], status: "unknown", silentAt: silent, notApplicable: na } : { invariant: v, name: names[v], status: "survives", notApplicable: na, evidence: ev(kept) };
  });
  // Relational and hyperproperty invariants: no per-join claim can make them survive.
  const classOf = Object.fromEntries(P.vocabulary.INVARIANTS.map((v) => [v.id, v.class || "state"]));
  const wide = (v) => ["relational", "hyperproperty"].includes(classOf[v]);
  for (const x of result) if (wide(x.invariant) && !["broken", "created then broken", "restored then broken"].includes(x.status)) {
    x.claimedStatus = x.status; x.status = "whole-chain check required";
    if (x.evidence) { x.claimedEvidence = x.evidence; delete x.evidence; }
  }
  // The policy grade: four verdicts, worst first in VERDICTS.
  const VERDICTS = ["violation stated", "whole-chain check required", "unknown", "holds under the map's claims"];
  const verdictOf = (x) => !x ? "unknown" : x.status === "whole-chain check required" ? x.status
    : ["broken", "created then broken", "restored then broken"].includes(x.status) ? "violation stated"
    : ["survives", "restored", "created"].includes(x.status) ? "holds under the map's claims" : "unknown";
  const policy = opts.require ? (() => {
    const rows = opts.require.map((v) => { const x = result.find((y) => y.invariant === v);
      return { invariant: v, name: names[v] || v, verdict: wide(v) && !x ? "whole-chain check required" : verdictOf(x), status: x ? x.status : "not mentioned by any step", evidence: x?.evidence || null }; });
    return { required: rows, verdict: rows.reduce((w, r) => (VERDICTS.indexOf(r.verdict) < VERDICTS.indexOf(w) ? r.verdict : w), VERDICTS[3]) };
  })() : null;
  // Context labels: absorbing until cleared; a forbidden label present on entry to a step is a violation.
  const ctxOf = Object.fromEntries((P.vocabulary.CONTEXT || []).map((c) => [c.entry, c]));
  const live = new Map(), contextViolations = [], cleared = [];
  steps.forEach((st, k) => {
    const c = ctxOf[st.id]; if (!c) return;
    for (const l of c.forbids || []) if (live.has(l)) contextViolations.push({ label: l, at: k + 1, by: st.id, raisedAt: live.get(l).at, raisedBy: live.get(l).by });
    for (const l of c.clears || []) if (live.has(l)) { cleared.push({ label: l, at: k + 1, by: st.id }); live.delete(l); }
    for (const l of c.raises || []) if (!live.has(l)) live.set(l, { at: k + 1, by: st.id });
  });
  const context = { live: [...live.entries()].map(([label, x]) => ({ label, raisedAt: x.at, raisedBy: x.by })), cleared, violations: contextViolations };
  if (policy && contextViolations.length) policy.verdict = "violation stated";
  const unlinked = steps.filter((s) => !s.preserved.size && !s.broken.size && !s.output.size).map((s) => s.id);
  const asserted = [...result.filter((x) => x.evidence), ...joins.filter((j) => j.evidence)];
  const weakest = asserted.reduce((w, x) => (!w || rank(x.evidence.level) < rank(w.evidence.level) ? x : w), null);
  return { chain, steps: steps.map((s) => ({ id: s.id, name: s.name, actsOn: s.actsOn })), joins, invariants: result, unlinked, context, ...(policy ? { policy } : {}),
    evidence: weakest ? { level: weakest.evidence.level, weakest: { ...weakest.evidence.weakest, on: weakest.invariant ? `${weakest.name}, ${weakest.status}` : `join ${weakest.from} to ${weakest.to}` } } : null };
}

export function describe(r) {
  if (r.error) return r.error;
  const L = [`Chain: ${r.steps.map((s) => `${s.id} ${s.name}`).join(", then ")}`];
  const tag = (x) => (x.evidence ? ` [${x.evidence.level}${x.evidence.level !== "formal" ? `: weakest ${x.evidence.weakest.id} ${x.evidence.weakest.field}` : ""}]` : "");
  for (const j of r.joins) L.push(`  join ${j.from} to ${j.to}: ${j.status}${j.detail ? ` (${j.detail})` : ""}${tag(j)}`);
  for (const x of r.invariants) {
    const na = x.notApplicable?.length ? ` (not applicable at ${x.notApplicable.join(", ")})` : "";
    if (x.status === "survives") L.push(`  survives${x.notApplicable?.length ? " where it applies" : ""}: ${x.name}${na}${tag(x)}`);
    else if (x.status.startsWith("restored")) L.push(`  ${x.status}: ${x.name} (broken at step ${x.brokenAt}, produced again at step ${x.restoredAt} by ${x.by}${x.silentAfter.length ? `; the map is silent on it after that at ${x.silentAfter.join(", ")}` : ""})${tag(x)}`);
    else if (x.status === "created" || x.status === "created then unknown") L.push(`  created at step ${x.at} (${x.by}): ${x.name}${x.silentAfter.length ? `; the map is silent on it after that at ${x.silentAfter.join(", ")}` : ""}${tag(x)}`);
    else if (x.status === "restored then broken") L.push(`  restored then broken: ${x.name} (produced at step ${x.createdAt} (${x.createdBy}) after an earlier break, broken again at step ${x.at} (${x.by}))${tag(x)}`);
    else if (x.status === "created then broken") L.push(`  created at step ${x.createdAt} (${x.createdBy}), broken at step ${x.at} (${x.by}): ${x.name}${x.silentBefore.length ? `; the map is silent on it in between at ${x.silentBefore.join(", ")}` : ""}${tag(x)}`);
    else if (x.status === "broken") L.push(`  broken at step ${x.at} (${x.by}): ${x.name}${x.silentBefore.length ? `; the map is silent on it before that at ${x.silentBefore.join(", ")}` : ""}${tag(x)}`);
    else if (x.status === "whole-chain check required") L.push(`  whole-chain check required: ${x.name} (a property of sets of runs; per-join claims cannot establish it)`);
    else L.push(`  unknown: ${x.name} (the map is silent at ${x.silentAt.join(", ")})${na}`);
  }
  for (const x of r.invariants) if (x.history) L.push(`  history of ${x.name}: ${x.history.map((h) => `${h.event} at step ${h.step}`).join(", ")}`);
  for (const x of r.invariants) if (x.note) L.push(`  ${x.invariant}: ${x.note}`);
  if (r.unlinked.length) L.push(`  no invariant links yet for: ${r.unlinked.join(", ")}`);
  for (const v of r.context?.violations || []) L.push(`  context violation at step ${v.at} (${v.by}): ${v.label}, raised at step ${v.raisedAt} (${v.raisedBy}) and not cleared`);
  for (const c of r.context?.cleared || []) L.push(`  context cleared at step ${c.at} (${c.by}): ${c.label}`);
  if (r.policy) { L.push(`  policy: ${r.policy.verdict}`); for (const p of r.policy.required) L.push(`    ${p.verdict}: ${p.name} (${p.status})`); }
  if (r.evidence) L.push(`  weakest link: ${r.evidence.level} (${r.evidence.weakest.on}; step ${r.evidence.weakest.step}, ${r.evidence.weakest.id} ${r.evidence.weakest.field})`);
  return L.join("\n");
}

// Synthetic chains for the rules above, built over the parsed map so evidence resolves; none is a map entry.
function selftest() {
  const P0 = parse(), F = [];
  const e = (id, inv = {}, input = ["t"], output = ["t"]) => ({ id, name: id, input: "-", output: "-", actsOn: { input, output }, invariants: { preserved: [], broken: [], output: [], ...inv } });
  const run = (chain, entries, ids, RELATIONS = [], CARRIERS = { t: null }) => compose(chain, { ...P0, entries,
    vocabulary: { ...P0.vocabulary, CARRIERS, RELATIONS, INVARIANTS: ids.map((id) => ({ id, name: id, carrier: "t" })), LINKS: [], ACTS_ON: [] } });
  const st = (r, v) => r.invariants.find((x) => x.invariant === v)?.status;
  let N = 0;
  const want = (label, got, exp) => { N++; if (got !== exp) F.push(`${label}: got ${got}, expected ${exp}`); };
  const imp = (over) => [{ from: "P", to: "Q", kind: "implies", basis: "synthetic", ...(over ? { over } : {}) }];
  want("state implication does not carry preservation", st(run(["f"], [e("f", { preserved: ["P"] })], ["P", "Q"], imp("state")), "Q"), undefined);
  want("state implication does not carry breaking", st(run(["f"], [e("f", { preserved: ["P"], broken: ["Q"] })], ["P", "Q"], imp("state")), "P"), "survives");
  want("preservation implication carries preservation", st(run(["f"], [e("f", { preserved: ["P"] })], ["P", "Q"], imp("preservation")), "Q"), "survives");
  want("restored then silent", st(run(["a", "b", "c"], [e("a", { broken: ["X"] }), e("b", { output: ["X"] }), e("c")], ["X"]), "X"), "restored then unknown");
  want("restored then preserved", st(run(["a", "b", "c"], [e("a", { broken: ["X"] }), e("b", { output: ["X"] }), e("c", { preserved: ["X"] })], ["X"]), "X"), "restored");
  want("created then silent", st(run(["a", "b"], [e("a", { output: ["X"] }), e("b")], ["X"]), "X"), "created then unknown");
  const C3 = { t: null, u: null, v: null, w: "v" };
  const j = (o, n) => run(["a", "b"], [e("a", {}, ["t"], o), e("b", {}, n, ["t"])], [], [], C3).joins[0];
  want("joint input with an unsupplied operand", j(["t", "u"], ["t", "v"]).status, "partial");
  want("joint input fully supplied", j(["t", "v"], ["t", "v"]).status, "match");
  want("joint input by narrowing", j(["t", "v"], ["t", "w"]).status, "narrowing");
  want("no input supplied", j(["u"], ["t", "v"]).status, "mismatch");
  const runC = (chain, entries, invs, req) => compose(chain, { ...P0, entries,
    vocabulary: { ...P0.vocabulary, CARRIERS: { t: null }, RELATIONS: [], INVARIANTS: invs.map(([id, cls]) => ({ id, name: id, carrier: "t", class: cls })), LINKS: [], ACTS_ON: [] } }, req ? { require: req } : {});
  want("relational never survives per join", st(runC(["a"], [e("a", { preserved: ["N"] })], [["N", "relational"]]), "N"), "whole-chain check required");
  want("relational stated broken stays broken", st(runC(["a"], [e("a", { broken: ["N"] })], [["N", "relational"]]), "N"), "broken");
  const pol = runC(["a", "b"], [e("a", { preserved: ["S"], broken: ["B"] }), e("b", { preserved: ["S"] })], [["S", "state"], ["B", "trace"], ["N", "hyperproperty"], ["U", "state"]], ["S", "B", "N", "U"]).policy;
  want("policy: holds", pol.required[0].verdict, "holds under the map's claims");
  want("policy: violation", pol.required[1].verdict, "violation stated");
  want("policy: whole chain", pol.required[2].verdict, "whole-chain check required");
  want("policy: unmentioned is unknown", pol.required[3].verdict, "unknown");
  want("policy: chain takes the worst", pol.verdict, "violation stated");
  const runX = (chain, CONTEXT, req) => compose(chain, { ...P0, entries: chain.map((id) => e(id)),
    vocabulary: { ...P0.vocabulary, CARRIERS: { t: null }, RELATIONS: [], INVARIANTS: [], LINKS: [], ACTS_ON: [], CONTEXT } }, req ? { require: req } : {});
  const cx = [{ entry: "r", raises: ["w"], basis: "s" }, { entry: "x", forbids: ["w"], basis: "s" }, { entry: "d", clears: ["w"], basis: "s" }];
  const v1 = runX(["r", "m", "x"], cx, []);
  want("context persists through a silent step to a forbidding one", v1.context.violations.length, 1);
  want("context violation grades the policy", v1.policy.verdict, "violation stated");
  want("cleared context is not a violation", runX(["r", "d", "x"], cx).context.violations.length, 0);
  want("forbidding before raising is not a violation", runX(["x", "r"], cx).context.violations.length, 0);
  const eq = [{ from: "P", to: "Q", kind: "equivalent", basis: "synthetic" }];
  want("equivalence carries preservation forward", st(run(["f"], [e("f", { preserved: ["P"] })], ["P", "Q"], eq), "Q"), "survives");
  want("equivalence carries preservation backward", st(run(["f"], [e("f", { preserved: ["Q"] })], ["P", "Q"], eq), "P"), "survives");
  want("equivalence carries breaking backward", st(run(["f"], [e("f", { broken: ["Q"] })], ["P", "Q"], eq), "P"), "broken");
  want("equivalence carries an output", st(run(["f"], [e("f", { output: ["P"] })], ["P", "Q"], eq), "Q"), "created");
  want("state implication carries an output", st(run(["f"], [e("f", { output: ["P"] })], ["P", "Q"], imp("state")), "Q"), "created");
  want("preservation implication carries no output", st(run(["f"], [e("f", { output: ["P"] })], ["P", "Q"], imp("preservation")), "Q"), undefined);
  want("created then broken", st(run(["a", "b"], [e("a", { output: ["X"] }), e("b", { broken: ["X"] })], ["X"]), "X"), "created then broken");
  const osc = (n) => run(["a", "b", "c", "d"].slice(0, n), [e("a", { broken: ["X"] }), e("b", { output: ["X"] }), e("c", { broken: ["X"] }), e("d", { output: ["X"] })], ["X"]);
  const o4 = osc(4).invariants[0];
  want("oscillation ending produced is restored", o4.status, "restored");
  want("oscillation reports the last loss", `${o4.brokenAt},${o4.restoredAt},${o4.history.length}`, "3,4,4");
  want("oscillation ending broken", st(osc(3), "X"), "restored then broken");
  const runP = (n) => compose(["a", "b", "c", "d"].slice(0, n), { ...P0, entries: [e("a", { broken: ["X"] }), e("b", { output: ["X"] }), e("c", { broken: ["X"] }), e("d", { output: ["X"] })],
    vocabulary: { ...P0.vocabulary, CARRIERS: { t: null }, RELATIONS: [], INVARIANTS: [{ id: "X", name: "X", carrier: "t" }], LINKS: [], ACTS_ON: [] } }, { require: ["X"] }).policy.verdict;
  want("policy reads the final state: restored", runP(4), "holds under the map's claims");
  want("policy reads the final state: broken again", runP(3), "violation stated");
  want("consecutive breaks report the first", run(["a", "b", "c"], [e("a", { broken: ["X"] }), e("b", { broken: ["X"] }), e("c", { output: ["X"] })], ["X"]).invariants[0].brokenAt, 1);
  want("an id outside the vocabulary is unknown, never survival", st(run(["f"], [e("f", { preserved: ["Z"] })], ["X"]), "Z"), "unknown");
  const rel = runC(["a"], [e("a", { preserved: ["N"] })], [["N", "relational"]]).invariants[0];
  want("relational override keeps the claimed status and evidence", `${rel.claimedStatus},${typeof rel.claimedEvidence?.level}`, "survives,string");
  want("map chain still restores", st(compose(["D2-118", "D2-117"]), "exceptional-divisor"), "restored");
  if (F.length) { console.log(`compose selftest: FAIL\n  ${F.join("\n  ")}`); process.exit(1); }
  console.log(`compose selftest: PASS (${N} checks)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--selftest")) { selftest(); process.exit(0); }
  const a = process.argv.slice(2), i = a.indexOf("--chain");
  if (i < 0 || !a[i + 1]) { console.log("compose: needs --chain ID,ID,..."); process.exit(1); }
  const q = a.indexOf("--require");
  const r = compose(a[i + 1].split(",").map((s) => s.trim()), parse(), q >= 0 && a[q + 1] ? { require: a[q + 1].split(",").map((s) => s.trim()) } : {});
  console.log(a.includes("--json") ? JSON.stringify(r, null, 1) : describe(r));
  if (r.error) process.exit(1);
}
