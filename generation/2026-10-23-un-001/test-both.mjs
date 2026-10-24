// Role: the UN-001 round's test of both shapes for a logged effect, on the flows that found the gap.
// Contract: `node generation/2026-10-23-un-001/test-both.mjs [--json]`. For each flow, grades three chains with
//   scripts/compose.mjs against the flow's policy: the baseline (gate then unlogged effect, as the inbound note
//   ran it), shape (a), fixed-effect entries in D9-X28's manner (the effect's own claims with E9-AUDIT moved from
//   broken to produced and E9-MEDIATED kept), injected here and never landed, and shape (b), the landed combinator
//   D9-X40 wrapping the effect. Prints the policy verdict and E9-AUDIT's status for each.
// Invariant: read-only. Shape (a)'s entries exist only in this script's copy of the parsed map.
import { parse } from "../../scripts/mathmap.mjs";
import { compose } from "../../scripts/compose.mjs";

const P = parse();
const by = Object.fromEntries(P.entries.map((e) => [e.id, e]));
// Shape (a): one fixed-effect twin per effect, written as D9-X28 was written from D9-X21.
const twin = (id) => {
  const e = by[id], i = e.invariants;
  return { ...e, id: `A-${id}`, name: `Gate-committed ${e.name.toLowerCase()}`, origin: "generated",
    invariants: { preserved: [...new Set([...i.preserved, "e9-mediated"])], broken: i.broken.filter((v) => v !== "e9-audit"), output: [...new Set([...i.output, "e9-audit"])] } };
};
const EFFECTS = ["D9-X01", "D9-X04", "D9-X05", "D9-X07", "D9-X10", "D9-X12", "D9-X42"];
const PA = { ...P, entries: [...P.entries, ...EFFECTS.map(twin)] };

const FLOWS = [
  { flow: "I, install an identity", require: ["e9-atten", "e9-orig", "e9-local", "e9-auth", "e9-audit", "e9-mediated"],
    base: ["D9-X04", "D9-X05", "D9-X12"], wrap: ["D9-X04", "D9-X05", "D9-X12"] },
  { flow: "N, hand a link to the system browser", require: ["e9-mediated", "e9-auth", "e9-orig", "e9-audit", "e9-prov"],
    base: ["D9-X24", "D9-X01"], wrap: ["D9-X01"] },
  { flow: "U, answer a page's file request", require: ["e9-mediated", "e9-auth", "e9-atten", "e9-orig", "e9-audit", "e9-revoke"],
    base: ["D9-X24", "D9-X05", "D9-X12"], wrap: ["D9-X05", "D9-X12"] },
  { flow: "D, a confirmed download", require: ["e9-auth", "e9-audit", "e9-mediated", "e9-sig"],
    base: ["D9-X24", "D9-X12", "D9-X01", "D9-X07", "D9-X24", "D9-X10", "D9-X28"], wrap: ["D9-X12", "D9-X01", "D9-X07", "D9-X10"], tail: ["D9-X28"] },
  { flow: "R, the Regulator freezes an app", require: ["e9-auth", "e9-audit", "e9-mediated", "e9-suspended-noexec"],
    base: ["D9-X24", "D9-X42"], wrap: ["D9-X42"] },
];

const grade = (chain, Px) => { const r = compose(chain, Px, { require: FLOWS.find((f) => f.chain === chain)?.require || cur.require });
  if (r.error) return { verdict: `error: ${r.error}`, audit: "" };
  return { verdict: r.policy.verdict, audit: r.invariants.find((x) => x.invariant === "e9-audit")?.status || "not mentioned",
    failing: r.policy.required.filter((x) => x.verdict !== "holds under the map's claims").map((x) => `${x.invariant}: ${x.verdict}`), context: r.context.violations.length };
};
let cur;
const rows = FLOWS.map((f) => {
  cur = f;
  const a = [...f.wrap.map((id) => `A-${id}`), ...(f.tail || [])], b = [...f.wrap.map((id) => `D9-X40(${id})`), ...(f.tail || [])];
  return { flow: f.flow, baseline: { chain: f.base, ...grade(f.base, P) }, a: { chain: a, ...grade(a, PA) }, b: { chain: b, ...grade(b, P) } };
});
if (process.argv.includes("--json")) console.log(JSON.stringify(rows, null, 1));
else for (const r of rows) {
  console.log(r.flow);
  for (const k of ["baseline", "a", "b"]) console.log(`  ${k.padEnd(8)} ${r[k].chain.join(",")}\n           policy: ${r[k].verdict}; e9-audit ${r[k].audit}${r[k].failing?.length ? `; not holding: ${r[k].failing.join("; ")}` : ""}${r[k].context ? `; ${r[k].context} context violation(s)` : ""}`);
}
