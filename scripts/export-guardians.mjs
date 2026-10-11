// Role: export to Guardians. Writes the D9 entries as Guardians tool specifications and a personal policy as a
//   Guardians policy, so an existing checker verifies agent workflows against the map's contracts instead of a
//   parallel one built here (ruling: operator, 2026-10-11; generation/2026-10-11-mm-dr-003/grading.md).
//   Guardians: github.com/metareflection/guardians, read at 59e52d9 (MIT).
// Contract: `node scripts/export-guardians.mjs [--source ID=label ...] [--forbid label ...] [--sanitizer ID ...]`
//   prints JSON { guardians, registry, policy, notExported }. registry holds one ToolSpec per D9 entry: params
//   from the entry's input carriers, a data-value param marked as a taint sink where the entry may break
//   no-egress or locality, and source labels from --source (which entries read which labeled data: an instance
//   choice, not part of the abstract operation). policy holds one TaintRule per --forbid label, from each
//   labeled source to every sink, with --sanitizer entries (default D9-X10, declassify) as sanitizers.
//   notExported lists what Guardians cannot express: every relational or hyperproperty invariant, and the
//   entries' prose contracts, which stay prose (no translation into its condition language is claimed).
// Invariant: read-only; Node only. An export is a translation of generated contracts, not a proof.
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";

const SINK_IF_BREAKS = ["e9-noegress", "e9-local"];

export function exportGuardians(P = parse(), opts = {}) {
  const sources = opts.sources || {}, forbid = opts.forbid || [], sanitizers = opts.sanitizers || ["D9-X10"];
  const d9 = P.generated.filter((g) => g.id.startsWith("D9-"));
  const registry = d9.map((g) => {
    const sink = (g.invariants?.broken || []).some((v) => SINK_IF_BREAKS.includes(v));
    const names = [...new Set(g.actsOn?.input || [])];
    return {
      name: g.id, description: `${g.name}. ${g.description}`,
      params: names.map((n) => ({ name: n, type: "str", description: `Carrier ${n} (Math_Map vocabulary).`, is_taint_sink: sink && n === "data-value" })),
      return_type: (g.actsOn?.output || []).join(", ") || "Any",
      preconditions: [], postconditions: [], frame_conditions: [],
      source_labels: sources[g.id] ? [sources[g.id]] : [], sink_labels: sink ? ["egress"] : [],
    };
  });
  const policy = {
    name: `math-map-d9${forbid.length ? `-forbid-${forbid.join("-")}` : ""}`,
    allowed_tools: d9.map((g) => g.id), automata: [], invariants: [],
    taint_rules: forbid.flatMap((label) => Object.entries(sources).filter(([, l]) => l === label).map(([src]) => ({
      name: `${label}-never-leaves-via-${src}`, source_tool: src, source_output: "result", sink_tool: "*", sink_param: "*", condition: null, sanitizers,
    }))),
  };
  const notExported = {
    invariants: P.vocabulary.INVARIANTS.filter((v) => v.id.startsWith("e9-") && ["relational", "hyperproperty"].includes(v.class)).map((v) => ({ id: v.id, class: v.class, why: "a property of pairs or sets of runs; Guardians checks explicit flows and call sequences in one run" })),
    contracts: "Each entry's input, output, preserved and broken text stays prose: no translation into Guardians' condition language is claimed, so pre-, post- and frame conditions are empty.",
    controlFlow: "Guardians joins both branches of a conditional without carrying the condition's labels into them (verify.py, _verify_conditional, at 59e52d9), so flows through branching are not seen; compose.mjs context labels cover that case.",
  };
  return { guardians: { repository: "github.com/metareflection/guardians", commit: "59e52d9" }, registry, policy, notExported };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), all = (k) => a.flatMap((x, i) => (x === k ? [a[i + 1]] : []));
  const sources = Object.fromEntries(all("--source").map((s) => s.split("=")));
  const san = all("--sanitizer");
  console.log(JSON.stringify(exportGuardians(parse(), { sources, forbid: all("--forbid"), ...(san.length ? { sanitizers: san } : {}) }), null, 1));
}
