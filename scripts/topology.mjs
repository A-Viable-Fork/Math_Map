// Role: the topology of the typed map. Carriers are points, typed operations are edges from each input kind to
//   each output kind; the report gives the pieces, the loops, the kinds nothing produces or consumes, the parallel
//   routes between the same kinds whose invariant claims disagree, and the same with the formally evidenced
//   region collapsed to a point (X/A, whose reduced homology is the homology of X relative to A).
// Contract: `node scripts/topology.mjs` writes reports/TOPOLOGY.md; `--check` prints it without writing.
//   Exports topology(P?). A disagreement is two routes of one or two math operations between the same kinds,
//   one saying an invariant survives and the other that it is broken: either a real invariant separating the
//   routes or a kind too coarse to tell their inputs apart. No route records that two chains agree, so no loop
//   is filled; a loop count measures alternative routes, not obstructions.
// Invariant: read-only. Covers only typed entries (acts-on records and generated D9 entries).
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";
import { compose } from "./compose.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function pieces(vs, edges) {
  const p = Object.fromEntries(vs.map((v) => [v, v]));
  const f = (x) => (p[x] === x ? x : (p[x] = f(p[x])));
  for (const [a, b] of edges) p[f(a)] = f(b);
  const g = {};
  for (const v of vs) (g[f(v)] ||= []).push(v);
  return Object.values(g);
}

export function topology(P = parse()) {
  const V = P.vocabulary, C = V.CARRIERS;
  const byId = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const ops = [...V.ACTS_ON.map((a) => ({ id: a.entry, in: a.input, out: a.output })),
    ...P.generated.filter((g) => g.actsOn).map((g) => ({ id: g.id, in: g.actsOn.input, out: g.actsOn.output }))];
  const math = ops.filter((o) => !o.id.startsWith("D9-"));
  const D9KINDS = new Set(P.generated.filter((g) => g.actsOn).flatMap((g) => [...g.actsOn.input, ...g.actsOn.output]));
  const mathKinds = Object.keys(C).filter((c) => !D9KINDS.has(c) && c !== "operation");
  const edgesOf = (list) => list.flatMap((o) => o.in.flatMap((i) => o.out.map((j) => [i, j, o.id])));
  const sub = (vs) => vs.filter((c) => C[c] && vs.includes(C[c])).map((c) => [c, C[c], "subtype"]);
  const summary = (vs, edges) => { const pc = pieces(vs, edges); return { kinds: vs.length, edges: edges.length, pieces: pc, loops: edges.length - vs.length + pc.length, selfLoops: edges.filter(([a, b]) => a === b).length }; };
  const mEdges = edgesOf(math);
  const all = { ops: summary(mathKinds, mEdges), withSubtypes: summary(mathKinds, [...mEdges, ...sub(mathKinds)]) };
  const allEdges = edgesOf(ops);
  const prod = new Set(allEdges.map((e) => e[1])), cons = new Set(allEdges.map((e) => e[0]));
  const ends = { sources: Object.keys(C).filter((c) => cons.has(c) && !prod.has(c)), sinks: Object.keys(C).filter((c) => prod.has(c) && !cons.has(c)), untouched: Object.keys(C).filter((c) => !cons.has(c) && !prod.has(c)) };
  const fits = (a, b) => a.out.some((x) => b.in.includes(x) || b.in.includes(C[x]));
  const chains = [...math.map((o) => [o]), ...math.flatMap((a) => math.filter((b) => b.id !== a.id && fits(a, b)).map((b) => [a, b]))];
  const groups = {};
  for (const ch of chains) for (const s of ch[0].in) for (const t of ch[ch.length - 1].out) (groups[`${s} to ${t}`] ||= []).push(ch);
  const prof = (ch) => Object.fromEntries((compose(ch.map((o) => o.id), P).invariants || []).map((x) => [x.invariant, x.status]));
  const broken = (s) => s === "broken" || s === "created then broken";
  const routes = [], disagreements = [];
  for (const [k, list] of Object.entries(groups).sort()) {
    if (list.length < 2) continue;
    const named = list.map((ch) => ({ ids: ch.map((o) => o.id).join(" then "), p: prof(ch) }));
    routes.push({ ends: k, routes: named.map((n) => n.ids) });
    for (let i = 0; i < named.length; i++) for (let j = i + 1; j < named.length; j++) for (const inv of Object.keys(named[i].p)) {
      const a = named[i].p[inv], b = named[j].p[inv];
      if (b && ((a === "survives" && broken(b)) || (b === "survives" && broken(a)))) disagreements.push({ ends: k, invariant: inv, a: named[i].ids, aSays: a, b: named[j].ids, bSays: b });
    }
  }
  const formal = math.filter((o) => Object.values(byId[o.id]?.evidence || {}).some((v) => (v?.level || v) === "formal")).map((o) => o.id);
  const A = new Set(math.filter((o) => formal.includes(o.id)).flatMap((o) => [...o.in, ...o.out]));
  const q = (c) => (A.has(c) ? "*" : c);
  const relative = summary([...new Set(mathKinds.map(q))], mEdges.filter(([, , id]) => !formal.includes(id)).map(([a, b, id]) => [q(a), q(b), id]));
  return { typed: { math: math.length, d9: ops.length - math.length, entries: P.entries.length }, all, ends, routes, disagreements, formal, relative };
}

export function render(T) {
  const piecesLine = (s) => s.pieces.filter((p) => p.length > 1).map((p) => `{${p.join(", ")}}`).join("; ") + (s.pieces.some((p) => p.length === 1) ? `; alone: ${s.pieces.filter((p) => p.length === 1).map((p) => p[0]).join(", ")}` : "");
  const L = ["# Topology of the typed map", "",
    "Generated by `scripts/topology.mjs`. Kinds (carriers) are points; each typed operation is an edge from each input kind to each output kind. The map records no claim that two routes agree, so no loop is filled: a loop count measures alternative routes, not obstructions.", "",
    `Typed: ${T.typed.math} math entries and ${T.typed.d9} generated D9 entries, of ${T.typed.entries} entries in the map.`, "",
    "## Pieces and loops (math entries)", "",
    "| | Kinds | Edges | Pieces | Loops | Of which self-loops |", "|---|---|---|---|---|---|",
    `| Operations | ${T.all.ops.kinds} | ${T.all.ops.edges} | ${T.all.ops.pieces.length} | ${T.all.ops.loops} | ${T.all.ops.selfLoops} |`,
    `| With subtype links | ${T.all.withSubtypes.kinds} | ${T.all.withSubtypes.edges} | ${T.all.withSubtypes.pieces.length} | ${T.all.withSubtypes.loops} | ${T.all.withSubtypes.selfLoops} |`, "",
    `Pieces with subtype links: ${piecesLine(T.all.withSubtypes)}.`, "",
    "## Ends (all typed entries)", "",
    `- Produced by no operation: ${T.ends.sources.join(", ") || "none"}.`,
    `- Consumed by no operation: ${T.ends.sinks.join(", ") || "none"}.`,
    `- Touched by no operation: ${T.ends.untouched.join(", ") || "none"}.`, "",
    "## Parallel routes (one or two math operations between the same kinds)", "",
    ...T.routes.map((r) => `- ${r.ends}: ${r.routes.join(" | ")}`), "",
    `## Disagreements (${T.disagreements.length})`, "",
    "One route says an invariant survives, another between the same kinds says it is broken: a real invariant separating the routes, or a kind too coarse to tell their inputs apart.", "",
    ...(T.disagreements.length ? ["| Between | Invariant | Route | Says | Route | Says |", "|---|---|---|---|---|---|", ...T.disagreements.map((d) => `| ${d.ends} | ${d.invariant} | ${d.a} | ${d.aSays} | ${d.b} | ${d.bSays} |`)] : ["None."]), "",
    "## Relative to the formal region", "",
    `Typed math entries with a formal field: ${T.formal.join(", ") || "none"}. With that region collapsed to one point: ${T.relative.kinds} kinds, ${T.relative.pieces.length} pieces, ${T.relative.loops} loops.`];
  return L.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = render(topology());
  if (process.argv.includes("--check")) console.log(out);
  else { writeFileSync(join(ROOT, "reports/TOPOLOGY.md"), out + "\n"); console.log("wrote reports/TOPOLOGY.md"); }
}
