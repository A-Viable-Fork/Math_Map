// Role: pilot 1 of the schema survey (candidates G02, G25, G39). Checks chains of entries against predicates:
//   what each step requires of its input, and what it establishes, keeps or destroys in its output.
// Contract: `node p1-predicates.mjs [--json]`. Reads p1-predicates.rows.json, verifies every row's receipt,
//   runs each chain, and prints beside it what scripts/compose.mjs says about the same chain today.
//   Rules: a requirement is met when its predicate holds on entry to the step; it is "violated" when an
//   earlier step destroyed the predicate, and "not established" when nothing given or established supplies it.
//   A step that neither keeps nor establishes a predicate leaves it unknown (silence, as in compose.mjs).
//   Predicates are closed under the implications: holding flows forward, destruction flows backward.
//   A requirement tied to a claim fails the claim, and the report names it; a counterexample row for the
//   failed (entry, predicate) is printed with it.
// Invariant: read-only. The verdicts grade what the rows say; a row is only as good as its receipt.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HERE, ROOT, entry, tally } from "./lib.mjs";
const { compose } = await import(join(ROOT, "scripts", "compose.mjs"));

const D = JSON.parse(readFileSync(join(HERE, "p1-predicates.rows.json"), "utf8"));
const fwd = (set) => { let grew = true; while (grew) { grew = false; for (const i of D.implications) if (set.has(i.from) && !set.has(i.to)) { set.add(i.to); grew = true; } } return set; };
const back = (set) => { let grew = true; while (grew) { grew = false; for (const i of D.implications) if (set.has(i.to) && !set.has(i.from)) { set.add(i.from); grew = true; } } return set; };

export function check(chain) {
  let holds = fwd(new Set(chain.given)); const destroyed = new Map(); const report = []; let fail = false;
  chain.steps.forEach((id, k) => {
    const rows = D.rows.filter((r) => r.entry === id);
    for (const r of rows.filter((r) => r.role === "requires")) {
      if (holds.has(r.predicate)) continue;
      fail = true;
      const how = destroyed.has(r.predicate) ? `violated: destroyed at step ${destroyed.get(r.predicate) + 1}` : "not established";
      const cx = D.counterexamples.find((c) => c.entry === id && c.drops === r.predicate);
      report.push({ step: k + 1, entry: id, predicate: r.predicate, how, claim: r.claim ?? null, row: r.id, witness: cx?.witness ?? null });
    }
    const met = (r) => !r.given || r.given.every((p) => holds.has(p));
    const est = new Set(rows.filter((r) => r.role === "establishes" && met(r)).map((r) => r.predicate));
    const keep = new Set(rows.filter((r) => r.role === "keeps" && met(r)).map((r) => r.predicate));
    const gone = back(new Set(rows.filter((r) => r.role === "destroys").map((r) => r.predicate)));
    for (const p of gone) destroyed.set(p, k);
    const next = new Set([...holds].filter((p) => keep.has(p) && !gone.has(p)));
    for (const p of est) { next.add(p); destroyed.delete(p); }
    // An implied predicate stays only through what implies it; fwd restores those.
    holds = fwd(next);
    for (const p of holds) destroyed.delete(p);
  });
  return { verdict: fail ? "fail" : "pass", report, holdsAtEnd: [...holds].sort() };
}

const T = tally([...D.rows, ...D.implications, ...D.counterexamples]);
const out = [];
let agree = 0, caught = 0;
for (const c of D.chains) {
  const r = check(c);
  const cm = compose(c.steps);
  const joins = (cm.joins ?? []).map((j) => j.status);
  const composeSays = cm.error ? `error: ${cm.error}` : c.steps.length === 1 ? "one step, no join" : `joins ${joins.join(", ")}`;
  const composeObjects = !cm.error && joins.length && joins.every((j) => j === "match" || j === "narrowing");
  if (r.verdict === c.expect) agree++;
  if (r.verdict === "fail") caught++;
  out.push({ ...c, ...r, composeSays, composeAcceptsJoins: !!composeObjects });
}
if (process.argv.includes("--json")) { console.log(JSON.stringify({ tally: T, chains: out }, null, 1)); process.exit(0); }
const ents = new Set(D.rows.map((r) => r.entry));
console.log(`p1: ${D.rows.length} rows on ${ents.size} entries, ${D.implications.length} implications, ${D.counterexamples.length} counterexamples, ${Object.keys(D.predicates).length} predicates`);
console.log(`p1 receipts: ${T.verified} of ${T.rows} verify (` + Object.entries(T.byKind).map(([k, v]) => `${k} ${v.verified}/${v.rows}`).join(", ") + ")");
for (const b of T.bad) if (b.kind !== "none") console.log(`  UNVERIFIED ${b.row} [${b.kind}] ${b.why}`);
for (const c of out) {
  console.log(`${c.id} ${c.steps.join(" > ")} given {${c.given.join(", ")}}: ${c.verdict} (expected ${c.expect}); compose.mjs: ${c.composeSays}`);
  for (const x of c.report) console.log(`    step ${x.step} ${x.entry} ${entry(x.entry).name}: ${x.predicate} ${x.how}${x.claim ? ` [fails the claim "${x.claim}"]` : ""} (${x.row})${x.witness ? `\n      counterexample: ${x.witness}` : ""}`);
}
const silentPass = out.filter((c) => c.verdict === "fail" && c.composeAcceptsJoins).map((c) => c.id);
console.log(`p1: ${agree} of ${out.length} chains come out as expected; ${caught} fail on a predicate; of those, compose.mjs accepts every join in ${silentPass.length} (${silentPass.join(", ")}) and has no typing for the rest`);
process.exit(agree === out.length && T.bad.every((b) => b.kind === "none") ? 0 : 1);
