// Role: pilot 5 of the schema survey (candidates G58, G59, G61, G63, G67, with G12). Three charts (graphs,
//   matroids, matrices over a field) and three transition maps held as dictionaries, row by row: the cycle
//   matroid of a graph (GM), the incidence matrix of a graph (GX), the column matroid of a matrix (XM).
// Contract: `node p5-atlas.mjs`. Prints (1) the dictionary rows with their receipts; (2) the cocycle check on
//   the triple overlap, twice: as data (does XM after GX send each term where GM sends it) and on instances
//   (is the column matroid of the incidence matrix the cycle matroid), under each convention for the
//   incidence matrix; (3) claims carried from the matroid chart to the graph chart, with the evidence and
//   domain the crossing leaves them; (4) for each graph entry, the terms of its own fields that have no
//   image in the matroid chart: its departure, derived, beside the landed departure note.
//   Exit 1 if a receipt fails or the instance check contradicts what a row claims.
// Invariant: read-only. A dictionary row says a term of one chart is rendered by a term of another on a
//   stated domain; `to: null` says the term has no image, which is a claim too and carries a receipt.
import { entry, verify, rng } from "./lib.mjs";
import * as I from "./instances.mjs";

const W = "docs/schema-survey/pilots/excerpts/", X = (f, q) => ({ excerpt: W + f, quote: q }), F = (e, f, q) => ({ field: [e, f], quote: q });
const NONE = (why) => ({ none: why }), C = (what) => ({ computed: what });
const GMq = "is a [[matroid]] whose independent sets are the [[tree (graph theory)|forests]] in a given finite [[undirected graph]]";
const BASES = "are the full [[spanning tree|spanning forests]] of <math>G</math>, and the circuits of <math>M(G)</math> are the [[cycle (graph theory)|simple cycles]] of <math>G</math>.";
const MINOR = "the restriction and contraction operations by which they are formed correspond to edge deletion and [[edge contraction]] operations in graphs";
const ROWSCOLS = "Such a matrix has one row for each vertex, and one column for each edge.";
const COLM = "The graphic matroid of a graph <math>G</math> can be defined as the column matroid of any [[incidence matrix|oriented incidence matrix]] of <math>G</math>.";
const VEC = "gives rise to a matroid <math>M</math> on its set of columns. The dependent sets of columns in the matroid are those that are linearly dependent as vectors.";
export const CHARTS = { G: "graphs (D1: D1-003, D1-004, D1-007, D1-024, D1-046, D1-047, D1-048, D1-120)", M: "matroids (D1: D1-057, D1-058, D1-059, D1-060)", X: "matrices over a field (no home entries in the cluster)" };
export const DICT = [
  // GM: the cycle matroid
  { id: "GM01", t: "GM", from: "graph", to: "matroid", receipt: X("wikipedia-graphic-matroid.txt", GMq) },
  { id: "GM02", t: "GM", from: "edge", to: "element", receipt: X("wikipedia-graphic-matroid.txt", GMq) },
  { id: "GM03", t: "GM", from: "forest", to: "independent set", receipt: X("wikipedia-graphic-matroid.txt", GMq) },
  { id: "GM04", t: "GM", from: "spanning forest", to: "basis", receipt: X("wikipedia-graphic-matroid.txt", BASES) },
  { id: "GM05", t: "GM", from: "simple cycle", to: "circuit", receipt: X("wikipedia-graphic-matroid.txt", BASES) },
  { id: "GM06", t: "GM", from: "edge deletion", to: "deletion", fromEntry: "D1-046", toEntry: "D1-057", receipt: X("wikipedia-matroid-minor.txt", MINOR) },
  { id: "GM07", t: "GM", from: "edge contraction", to: "contraction", fromEntry: "D1-048", toEntry: "D1-058", receipt: X("wikipedia-matroid-minor.txt", MINOR) },
  { id: "GM08", t: "GM", from: "graph minor", to: "minor", fromEntry: "D1-004", toEntry: "D1-060", receipt: F("D1-060", "relation", "Matroid abstraction of graph minor (D1-004)") },
  { id: "GM09", t: "GM", from: "planar dual", to: "dual", fromEntry: "D1-007", toEntry: "D1-059", on: "planar graphs", receipt: X("wikipedia-dual-matroid.txt", "the matroid of the dual of a planar graph is the same as the dual of the matroid of the graph") },
  { id: "GM10", t: "GM", from: "vertices minus components", to: "rank", receipt: C("the rank of a forest is its edge count; checked in p6 (incidence-rank)") },
  { id: "GM11", t: "GM", from: "edge count", to: "size of the ground set", receipt: X("wikipedia-graphic-matroid.txt", GMq) },
  { id: "GM12", t: "GM", from: "vertex", to: null, receipt: F("D1-057", "relation", "no ambient graph needed, operates on independence system") },
  { id: "GM13", t: "GM", from: "vertex deletion", to: null, fromEntry: "D1-047", receipt: F("D1-004", "relation", "operates on vertices and edges rather than abstract ground set elements") },
  { id: "GM14", t: "GM", from: "vertex degree", to: null, receipt: X("wikipedia-graphic-matroid.txt", "Despite being non-isomorphic as graphs, they have isomorphic graphic matroids.") },
  { id: "GM15", t: "GM", from: "adjacency", to: null, receipt: X("wikipedia-graphic-matroid.txt", "Despite being non-isomorphic as graphs, they have isomorphic graphic matroids.") },
  { id: "GM16", t: "GM", from: "connectivity", to: null, receipt: NONE("authored: a forest with one component and a forest with three have the same matroid; no window fetched") },
  // GX: the incidence matrix (D1-120)
  { id: "GX01", t: "GX", from: "graph", to: "matrix", fromEntry: "D1-120", receipt: X("wikipedia-graphic-matroid.txt", ROWSCOLS) },
  { id: "GX02", t: "GX", from: "edge", to: "column", receipt: X("wikipedia-graphic-matroid.txt", ROWSCOLS) },
  { id: "GX03", t: "GX", from: "vertex", to: "row", receipt: X("wikipedia-graphic-matroid.txt", ROWSCOLS) },
  { id: "GX04", t: "GX", from: "forest", to: "independent set of columns", convention: "oriented, any field; or unoriented over the two-element field", receipt: X("wikipedia-graphic-matroid.txt", COLM) },
  { id: "GX05", t: "GX", from: "spanning forest", to: "column basis", convention: "as GX04", receipt: X("wikipedia-graphic-matroid.txt", COLM) },
  { id: "GX06", t: "GX", from: "simple cycle", to: "minimal dependent set of columns", convention: "as GX04", receipt: X("wikipedia-incidence-matrix.txt", "The integral [[cycle space]] of a graph is equal to the [[null space]] of its oriented incidence matrix") },
  { id: "GX07", t: "GX", from: "edge deletion", to: "column deletion", receipt: F("D1-057", "description", "In matrix representation, corresponds to column r") },
  { id: "GX08", t: "GX", from: "edge contraction", to: "adding one endpoint's row to the other's and deleting the column", convention: "oriented", receipt: C("checked below on instances") },
  { id: "GX09", t: "GX", from: "vertices minus components", to: "rank of the matrix", convention: "as GX04", receipt: C("checked in p6 (incidence-rank)") },
  { id: "GX10", t: "GX", from: "edge count", to: "number of columns", receipt: X("wikipedia-graphic-matroid.txt", ROWSCOLS) },
  { id: "GX11", t: "GX", from: "vertex deletion", to: "row deletion with its columns", receipt: NONE("authored; no window fetched") },
  // XM: the column matroid
  { id: "XM01", t: "XM", from: "matrix", to: "matroid", receipt: X("wikipedia-matroid.txt", VEC) },
  { id: "XM02", t: "XM", from: "column", to: "element", receipt: X("wikipedia-matroid.txt", VEC) },
  { id: "XM03", t: "XM", from: "independent set of columns", to: "independent set", receipt: X("wikipedia-matroid.txt", VEC) },
  { id: "XM04", t: "XM", from: "column basis", to: "basis", receipt: X("wikipedia-matroid.txt", VEC) },
  { id: "XM05", t: "XM", from: "minimal dependent set of columns", to: "circuit", receipt: X("wikipedia-matroid.txt", VEC) },
  { id: "XM06", t: "XM", from: "column deletion", to: "deletion", toEntry: "D1-057", receipt: F("D1-057", "description", "In matrix representation, corresponds to column r") },
  { id: "XM07", t: "XM", from: "projecting the remaining columns onto the quotient by a column", to: "contraction", toEntry: "D1-058", receipt: F("D1-058", "description", "corresponds to projecting remaining vectors onto quotient space") },
  { id: "XM08", t: "XM", from: "rank of the matrix", to: "rank", receipt: X("wikipedia-matroid.txt", VEC) },
  { id: "XM09", t: "XM", from: "number of columns", to: "size of the ground set", receipt: X("wikipedia-matroid.txt", VEC) },
  { id: "XM10", t: "XM", from: "row", to: null, receipt: NONE("authored: row operations leave the column matroid unchanged; no window fetched") },
  { id: "XM11", t: "XM", from: "row deletion with its columns", to: null, receipt: NONE("authored; no window fetched") },
];
// Claims that hold in the matroid chart, each with the dictionary terms it is stated in.
export const CLAIMS = [
  { id: "T1", entry: "D1-058", decl: "Matroid.dual_contract", says: "the dual of a contraction is the deletion in the dual", uses: ["contraction", "dual", "deletion"], carried: "for a planar graph, the dual of G with an edge contracted is the dual of G with that edge deleted" },
  { id: "T2", entry: "D1-059", decl: "Matroid.eRank_add_eRank_dual", says: "rank plus the rank of the dual is the size of the ground set", uses: ["rank", "dual", "size of the ground set"], carried: "for a planar graph, (vertices minus components) of G plus (vertices minus components) of its dual is the edge count: for a connected plane graph, V - 1 + F - 1 = E, Euler's formula" },
  { id: "T3", entry: "D1-059", decl: "Matroid.dual_ground", says: "the dual has the same ground set", uses: ["dual", "element"], carried: "a planar graph and its dual have the same edges" },
  { id: "T4", entry: "D1-059", decl: "Matroid.dual_isBase_iff'", says: "the bases of the dual are the complements of the bases", uses: ["dual", "basis"], carried: "for a connected plane graph, the complement of a spanning tree is a spanning tree of the dual" },
  { id: "T5", entry: "D1-060", decl: "Matroid.IsMinor.trans", says: "a minor of a minor is a minor", uses: ["minor"], carried: "a minor of a minor of a graph is a minor, for minors by edge deletion and contraction" },
];
const WORDS = [[/vert(ex|ices)/i, "vertex"], [/degree/i, "vertex degree"], [/adjacen/i, "adjacency"], [/connect/i, "connectivity"], [/\bedges?\b/i, "edge"], [/cycle/i, "simple cycle"], [/forest|spanning tree/i, "spanning forest"]];
const GRAPH_ENTRIES = ["D1-046", "D1-047", "D1-048", "D1-004", "D1-024", "D1-007", "D1-003", "D1-012", "D1-013", "D1-020", "D1-040", "D1-052"];

if (import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0; const R = rng(20261116); const kinds = {};
  for (const d of DICT) { const v = verify(d.receipt); kinds[v.kind] ??= { rows: 0, ok: 0 }; kinds[v.kind].rows++; if (v.ok) kinds[v.kind].ok++; else if (v.kind !== "none") { bad++; console.log(`  UNVERIFIED ${d.id} ${v.why}`); } }
  const by = (t) => new Map(DICT.filter((d) => d.t === t).map((d) => [d.from, d]));
  const GM = by("GM"), GX = by("GX"), XM = by("XM");
  const ents = new Set(DICT.flatMap((d) => [d.fromEntry, d.toEntry]).filter(Boolean));
  const read = new Set([...ents, ...GRAPH_ENTRIES, ...CLAIMS.map((c) => c.entry)]);
  console.log(`p5: ${DICT.length} dictionary rows in 3 transitions over 3 charts, binding ${ents.size} entries (${read.size} entries read in all); receipts ` + Object.entries(kinds).map(([k, v]) => `${k} ${v.ok}/${v.rows}`).join(", "));

  // (2a) the cocycle as data
  console.log("p5 cocycle as data: for each graph term, XM after GX against GM");
  let agree = 0, gap = 0, defect = 0;
  for (const [term, g] of GM) {
    const x = GX.get(term); if (!x) { console.log(`  ${term}: not on the triple overlap (GX has no row)`); continue; }
    const m = XM.get(x.to);
    if (!m) { gap++; console.log(`  ${term}: GAP. GX sends it to "${x.to}", for which XM has no row; GM sends it to ${g.to ? `"${g.to}"` : "nothing"}`); continue; }
    if (m.to === g.to) { agree++; console.log(`  ${term}: agrees (${g.to ?? "no image on either path"})`); } else { defect++; console.log(`  ${term}: DEFECT. via matrices "${m.to}", directly "${g.to}"`); }
  }
  console.log(`p5: ${agree} terms agree, ${gap} gap, ${defect} defects`);

  // (2b) the cocycle on instances, per convention of the incidence matrix
  console.log("p5 cocycle on instances: column matroid of the incidence matrix against the cycle matroid, 40 random graphs each");
  const conv = [["oriented, over the rationals", true, I.rankQ], ["oriented, over the two-element field", true, I.rankF2], ["unoriented, over the two-element field", false, I.rankF2], ["unoriented, over the rationals (the 0/1 matrix as D1-120 describes it, read over a field of characteristic not two)", false, I.rankQ]];
  const results = [];
  for (const [name, oriented, rank] of conv) {
    let fails = 0, witness = null;
    for (let k = 0; k < 40; k++) { const G = I.randomGraph(R, 5, 6); if (!I.mEqual(I.columnMatroid(I.incidence(G, oriented), rank), I.cycleMatroid(G))) { fails++; witness ??= G; } }
    const tri = { n: 3, edges: [[0, 1], [1, 2], [0, 2]] };
    results.push(fails);
    console.log(`  ${name}: ${fails ? `fails on ${fails} of 40` : "holds on 40 of 40"}${fails ? `; smallest witness, the triangle: cycle matroid rank ${I.cycleMatroid(tri)[7]}, column rank ${rank(I.incidence(tri, oriented))}` : ""}`);
  }
  if (results[0] || results[1] || results[2] || !results[3]) { bad++; console.log("  UNEXPECTED: the convention rows GX04 to GX09 do not match the instances"); }
  // The gap found as data, settled on instances: row-merge contraction against matroid contraction.
  let ok = true; for (let k = 0; k < 20 && ok; k++) { const G = I.randomGraph(R, 5, 6), e = Math.floor(R() * 6); ok = I.mEqual(I.columnMatroid(I.incidence(I.contractEdge(G, e), true), I.rankQ), I.mContract(I.columnMatroid(I.incidence(G, true), I.rankQ), 6, e)); }
  console.log(`  the gap at "edge contraction": merging the endpoint rows and deleting the column ${ok ? "gives the matroid contraction on 20 of 20 instances: the two matrix terms name one operation, and XM needs a row saying so" : "DOES NOT give the matroid contraction"}`);
  if (!ok) bad++;

  // (3) claims carried from matroids to graphs
  console.log("p5 claims carried from the matroid chart to the graph chart:");
  const back = new Map([...GM.values()].filter((d) => d.to).map((d) => [d.to, d]));
  for (const c of CLAIMS) {
    const v = verify({ formal: [c.entry, c.decl] }); if (!v.ok) { bad++; console.log(`  UNVERIFIED ${c.id} ${v.why}`); }
    const rows = c.uses.map((u) => back.get(u)); const missing = c.uses.filter((u, i) => !rows[i]);
    if (missing.length) { console.log(`  ${c.id} ${c.entry} ${c.decl}: not carried; no graph term for ${missing.join(", ")}`); continue; }
    const weakest = rows.some((r) => verify(r.receipt).kind === "none") ? "unchecked" : rows.some((r) => verify(r.receipt).kind === "computed") ? "computed on instances" : "sourced";
    const on = [...new Set(rows.map((r) => r.on).filter(Boolean))];
    console.log(`  ${c.id} ${c.entry} ${c.decl} (formal in its own chart): carried through ${rows.map((r) => r.id).join(", ")}; evidence after the crossing: ${weakest}; domain: ${on.length ? on.join(", ") : "all graphs"}\n      reads: ${c.carried}`);
  }

  // (4) departures derived: terms of a graph entry's own fields with no image in the matroid chart
  console.log("p5 departures derived for graph entries (terms of the entry's fields with no matroid image), beside the landed note:");
  for (const id of GRAPH_ENTRIES) {
    const e = entry(id); const lost = new Set(), kept = new Set();
    for (const f of ["description", "preserved", "broken"]) for (const [re, term] of WORDS) if (re.test(e[f])) (GM.get(term)?.to ? kept : lost).add(term);
    console.log(`  ${id} ${e.name}: no image for {${[...lost].join(", ")}}; image for {${[...kept].join(", ")}}\n      landed: ${e.relation?.departure ?? e.relation?.clusterNote ?? "no relation recorded"}`);
  }
  process.exit(bad ? 1 : 0);
}
