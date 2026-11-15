// Role: pilot 3 of the schema survey (candidates G16, G41, G62). Holds inverse relations with a domain of
//   validity, in the shape of Mathlib's PartialEquiv (two entries, where they invert each other, what is not
//   recovered), recomputes the ones that are computable, and uses them three ways.
// Contract: `node p3-inverses.mjs`. Prints (1) the rows and their receipts, with every computed check rerun;
//   (2) the broken fields of entries that have a two-sided inverse on their domain: an invertible step loses
//   no information there, so whatever it breaks its inverse restores, and a round trip through the pair is
//   the identity on the domain; beside it, what scripts/compose.mjs says today about each typed pair's round
//   trip; (3) the kinds newly reachable in the typed map when a two-sided inverse may be walked backwards.
//   Exit 1 if a computed check or a receipt fails.
// Invariant: read-only. Computed checks use fixed seeds; a check shows the round trip on instances, never
//   in general.
import { join } from "node:path";
import { ROOT, entry, verify, rng, map } from "./lib.mjs";
const { typeEntries } = await import(join(ROOT, "scripts", "type-lexicon.mjs"));

const R = rng(20261114), rnd = () => R() * 2 - 1, close = (a, b, t = 1e-9) => Math.abs(a - b) <= t * (1 + Math.abs(a) + Math.abs(b));
// Complex vectors as [re, im] pairs.
const dft = (x, s = -1) => x.map((_, k) => x.reduce(([ar, ai], [xr, xi], n) => { const w = (s * 2 * Math.PI * k * n) / x.length, c = Math.cos(w), d = Math.sin(w); return [ar + xr * c - xi * d, ai + xr * d + xi * c]; }, [0, 0]));
const cvec = (n) => Array.from({ length: n }, () => [rnd(), rnd()]);
const ceq = (a, b, t = 1e-9) => a.length === b.length && a.every((v, i) => close(v[0], b[i][0], t) && close(v[1], b[i][1], t));
const scale = (x, c) => x.map(([a, b]) => [a * c, b * c]);
const hadamard = (x) => { let v = [...x]; for (let h = 1; h < v.length; h *= 2) for (let i = 0; i < v.length; i += 2 * h) for (let j = i; j < i + h; j++) { const a = v[j], b = v[j + h]; v[j] = a + b; v[j + h] = a - b; } return v; };
const sub = (S, k) => { const out = []; const go = (i, cur) => { if (cur.length === k) { out.push(cur); return; } for (let j = i; j < S.length; j++) go(j + 1, [...cur, S[j]]); }; go(0, []); return out; };
const key = (sets) => sets.map((s) => [...s].sort().join(",")).sort().join("|");
// Spanning trees of a graph on vertices 0..n-1 as edge-index sets: the bases of its cycle matroid.
const acyclic = (n, edges, idx) => { const p = Array.from({ length: n }, (_, i) => i); const f = (x) => (p[x] === x ? x : (p[x] = f(p[x]))); for (const i of idx) { const [u, v] = edges[i]; const a = f(u), b = f(v); if (a === b) return false; p[a] = b; } return true; };
const K4 = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
const lineGraph = (edges) => { const adj = []; for (let i = 0; i < edges.length; i++) for (let j = i + 1; j < edges.length; j++) if (edges[i].some((v) => edges[j].includes(v))) adj.push([i, j]); return { n: edges.length, m: adj.length }; };
const perms = (a) => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
const sign = (p) => { let s = 1; for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) if (p[i] > p[j]) s = -s; return s; };

const CHECKS = {
  "dft-inverse": () => { const x = cvec(16); return ceq(scale(dft(dft(x), +1), 1 / 16), x); },
  "dft-fourth-power": () => { const x = cvec(12); const y2 = dft(dft(x)), y4 = dft(dft(y2)); const rev = x.map((_, k) => x[(12 - k) % 12]); return ceq(scale(y2, 1 / 12), rev) && ceq(scale(y4, 1 / 144), x) && !ceq(scale(y2, 1 / 12), x); },
  "hadamard-involution": () => { const x = Array.from({ length: 16 }, rnd); return hadamard(hadamard(x)).every((v, i) => close(v / 16, x[i])); },
  "hadamard-gate": () => { const h = Math.SQRT1_2, H = [[h, h], [h, -h]]; const HH = [[0, 1].map((j) => H[0][0] * H[0][j] + H[0][1] * H[1][j]), [0, 1].map((j) => H[1][0] * H[0][j] + H[1][1] * H[1][j])]; return close(HH[0][0], 1) && close(HH[0][1], 0, 1e-12) && close(HH[1][1], 1); },
  "matroid-dual-involution": () => { const E = [0, 1, 2, 3, 4, 5]; const B = sub(E, 3).filter((s) => acyclic(4, K4, s)); const dual = (bs) => bs.map((b) => E.filter((e) => !b.includes(e))); return B.length === 16 && key(dual(dual(B))) === key(B) && key(dual(B)) !== key(B.map((b) => b.map((e) => 5 - e))) + "x"; },
  "transpose-involution": () => { const E = Array.from({ length: 20 }, () => [Math.floor(R() * 7), Math.floor(R() * 7)]); const t = (e) => e.map(([u, v]) => [v, u]); return JSON.stringify(t(t(E))) === JSON.stringify(E) && JSON.stringify(t(E)) !== JSON.stringify(E); },
  "order-dual-involution": () => { const rel = []; for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) if (b % a === 0) rel.push([a, b]); const d = (r) => r.map(([a, b]) => [b, a]); return key(d(d(rel))) === key(rel); },
  "line-graph-not-injective": () => { const K3 = [[0, 1], [1, 2], [0, 2]], claw = [[0, 1], [0, 2], [0, 3]]; const a = lineGraph(K3), b = lineGraph(claw); return a.n === 3 && a.m === 3 && b.n === 3 && b.m === 3; },
  "fenchel-biconjugate": () => {
    const X = Array.from({ length: 11 }, (_, i) => i - 5), P = Array.from({ length: 41 }, (_, i) => i - 20);
    const conj = (f, dom, to) => to.map((p) => Math.max(...dom.map((x, i) => p * x - f[i])));
    const bi = (f) => conj(conj(f, X, P), P, X);
    const convex = X.map((x) => x * x), dbl = X.map((x) => Math.min((x - 2) ** 2, (x + 2) ** 2));
    const b1 = bi(convex), b2 = bi(dbl);
    return b1.every((v, i) => v === convex[i]) && b2.every((v, i) => v <= dbl[i]) && b2[5] < dbl[5];
  },
  "moebius-inversion-finite": () => {
    const N = 60, divs = (n) => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
    const mu = (n) => { let m = 1, k = n; for (let p = 2; p <= k; p++) if (k % p === 0) { k /= p; if (k % p === 0) return 0; m = -m; } return m; };
    const f = Object.fromEntries(divs(N).map((d) => [d, Math.floor(R() * 19) - 9]));
    const g = Object.fromEntries(divs(N).map((n) => [n, divs(n).reduce((s, d) => s + f[d], 0)]));
    return divs(N).every((n) => divs(n).reduce((s, d) => s + mu(n / d) * g[d], 0) === f[n]);
  },
  "z-transform-needs-region": () => { const a = 0.5, causal = (z) => { let s = 0; for (let n = 0; n < 400; n++) s += (a / z) ** n; return s; }, anti = (z) => { let s = 0; for (let n = 1; n < 400; n++) s -= (z / a) ** n; return s; }; const formula = (z) => 1 / (1 - a / z); return close(causal(2), formula(2), 1e-9) && close(anti(0.25), formula(0.25), 1e-9); },
  "hilbert-square": () => {
    const n = 16, x = Array.from({ length: n }, rnd), mean = x.reduce((s, v) => s + v, 0) / n; const z = x.map((v) => [v - mean, 0]);
    const H = (v) => { const X = dft(v); const Y = X.map(([a, b], k) => (k === 0 || k === n / 2 ? [0, 0] : k < n / 2 ? [b, -a] : [-b, a])); return scale(dft(Y, +1), 1 / n); };
    const nyq = dft(z)[n / 2]; const w = z.map(([v], i) => [v - ((i % 2 ? -1 : 1) * nyq[0]) / n, 0]);
    const ones = Array.from({ length: n }, () => [1, 0]);
    return ceq(H(H(w)), scale(w, -1), 1e-9) && ceq(H(ones), ones.map(() => [0, 0]), 1e-9);
  },
  "hodge-star-square": () => {
    // On the standard basis of k-forms of R^n: *(e_I) = sign(I, I^c) e_{I^c}; so ** = (-1)^{k(n-k)}.
    for (const n of [3, 4]) for (let k = 0; k <= n; k++) for (const I of sub(Array.from({ length: n }, (_, i) => i), k)) { const J = Array.from({ length: n }, (_, i) => i).filter((i) => !I.includes(i)); if (sign([...I, ...J]) * sign([...J, ...I]) !== (k * (n - k)) % 2 ? -1 + 2 * 0 === 0 && sign([...I, ...J]) * sign([...J, ...I]) !== ((k * (n - k)) % 2 ? -1 : 1) : false) return false; if (sign([...I, ...J]) * sign([...J, ...I]) !== ((k * (n - k)) % 2 ? -1 : 1)) return false; }
    return true;
  },
  "stereographic-round-trip": () => { for (let i = 0; i < 50; i++) { let v = [rnd(), rnd(), rnd()]; const r = Math.hypot(...v); v = v.map((c) => c / r); if (v[2] > 0.999) continue; const [X, Y] = [v[0] / (1 - v[2]), v[1] / (1 - v[2])]; const d = 1 + X * X + Y * Y; const w = [(2 * X) / d, (2 * Y) / d, (X * X + Y * Y - 1) / d]; if (!w.every((c, j) => close(c, v[j], 1e-9))) return false; } return !Number.isFinite(1 / (1 - 1)); },
  "log-exp-positive": () => { const xs = Array.from({ length: 20 }, () => R() * 50 + 0.01); return xs.every((x) => close(Math.exp(Math.log(x)), x)) && Number.isNaN(Math.log(-1)); },
  "box-cox-round-trip": () => { const l = 0.5, xs = Array.from({ length: 20 }, () => R() * 50 + 0.01); return xs.every((x) => close(((l * ((x ** l - 1) / l) + 1) ** (1 / l)), x)); },
  "partial-transpose-involution": () => { const M = Array.from({ length: 4 }, () => Array.from({ length: 4 }, rnd)); const pt = (A) => A.map((row, i) => row.map((_, j) => A[2 * (i >> 1) + (j & 1)][2 * (j >> 1) + (i & 1)])); const B = pt(pt(M)); return B.every((r, i) => r.every((v, j) => v === M[i][j])) && pt(M).some((r, i) => r.some((v, j) => v !== M[i][j])); },
};

const F = (e, f, q) => ({ field: [e, f], quote: q }), X = (f, q) => ({ excerpt: f, quote: q }), C = (name) => ({ computed: name });
// side: "two-sided" (b after a and a after b are identities on the domain), "left" (b after a is the identity
// on the domain; a after b need not be), "none" (a has no inverse: the row records what blocks one).
export const ROWS = [
  { id: "V01", a: "D6-032", b: null, side: "two-sided", on: "all finite sequences", residue: null, receipt: C("dft-inverse"), note: "the inverse DFT has no entry of its own; D6-072 is the continuous inverse" },
  { id: "V02", a: "D6-032", b: "D6-032", side: "period", on: "all finite sequences", residue: "applying it twice reverses the sequence (times N); four times is the identity (times N squared)", receipt: C("dft-fourth-power"), note: "a holonomy row (G62): the round trip returns the input up to a named map" },
  { id: "V03", a: "D6-060", b: "D6-060", side: "two-sided", on: "vectors of length 2^n", residue: null, receipt: F("D6-060", "preserved", "self-inverse (up to scaling)"), check: "hadamard-involution" },
  { id: "V04", a: "D6-148", b: "D6-148", side: "two-sided", on: "vectors of length 2^n", residue: null, receipt: C("hadamard-involution"), note: "the entry does not say it is self-inverse; D6-060, the same transform, does" },
  { id: "V05", a: "D5-055", b: "D5-055", side: "two-sided", on: "one qubit", residue: null, receipt: F("D5-055", "description", "Self-inverse."), check: "hadamard-gate" },
  { id: "V06", a: "D1-059", b: "D1-059", side: "two-sided", on: "finite matroids", residue: null, receipt: C("matroid-dual-involution"), note: "computed on the cycle matroid of K4; the entry's output (bases are complements) implies it" },
  { id: "V07", a: "D1-001", b: "D1-001", side: "two-sided", on: "directed graphs", residue: null, receipt: C("transpose-involution") },
  { id: "V08", a: "D7-177", b: "D7-177", side: "two-sided", on: "posets", residue: null, receipt: C("order-dual-involution") },
  { id: "V09", a: "D7-028", b: "D7-028", side: "two-sided", on: "categories", residue: null, receipt: { none: "definitional; no window fetched" } },
  { id: "V10", a: "D1-003", b: null, side: "none", on: "connected graphs other than the triangle and the claw (Whitney), on which it is injective up to isomorphism", residue: "the triangle and the claw have the same line graph", receipt: C("line-graph-not-injective"), note: "a blocker row (G41) with its witness" },
  { id: "V11", a: "D5-088", b: "D5-088", side: "two-sided", on: "proper convex lower semicontinuous functions", residue: "off the domain the round trip returns the convex envelope, which lies below the function", receipt: F("D5-088", "preserved", "Biconjugation"), check: "fenchel-biconjugate" },
  { id: "V12", a: "D7-213", b: null, side: "two-sided", on: "posets with finite principal down-sets", residue: "on a merely locally finite poset the sums can diverge (the strict reading's hunt, D7-213)", receipt: F("D7-213", "preserved", "Information in f (invertible transform)"), check: "moebius-inversion-finite", note: "the inverse, summation over the down-set, has no entry" },
  { id: "V13", a: "D8-234", b: "D8-102", side: "left", on: "sequences together with the region of convergence", residue: "without the region the transform does not determine the sequence: a causal and an anticausal sequence share one formula", receipt: F("D8-102", "input", "X(z) with its region of convergence"), check: "z-transform-needs-region" },
  { id: "V14", a: "D6-086", b: "D6-073", side: "left", on: "points of continuity with t > 0, for transforms integrable along the line", residue: "values at jumps, and everything on t < 0, where the inverse returns 0", receipt: X("docs/inbound/2026-11-06-from-formalization.md", "the inverse recovers `f` at its points of continuity on `t > 0` and returns 0 on `t < 0`") },
  { id: "V15", a: "D6-022", b: "D6-072", side: "two-sided", on: "functions for which the inversion theorem holds; the entry does not say which", residue: "unknown: the entries give no domain", receipt: F("D6-072", "preserved", "Exact inversion (Fourier inversion theorem)") },
  { id: "V16", a: "D6-100", b: "D6-074", side: "left", on: "unknown: the entries give no domain", residue: "unknown", receipt: F("D6-074", "preserved", "Exact inversion") },
  { id: "V17", a: "D2-117", b: "D2-118", side: "left", on: "a point blown up on a smooth projective surface, the (-1)-curve blown down", residue: null, receipt: F("D2-118", "description", "Inverse of blow-up.") },
  { id: "V18", a: "D4-032", b: "D4-031", side: "left", on: "as V17; the D4 rows give no domain", residue: null, receipt: F("D4-031", "description", "Inverse of blowup.") },
  { id: "V19", a: "D9-X42", b: "D9-X43", side: "left", on: "a principal that was running and is suspended", residue: "events that arrived while suspended; the entries do not say whether they are queued or dropped", receipt: F("D9-X43", "description", "granting nothing it did not hold before it was suspended") },
  { id: "V20", a: "D6-067", b: "D6-067", side: "period", on: "zero-mean signals", residue: "applying it twice negates the signal; constants are sent to zero, so it has no inverse on signals with a mean", receipt: C("hilbert-square"), note: "a holonomy row and a blocker in one: period four on its domain, a kernel off it" },
  { id: "V21", a: "D4-177", b: "D4-177", side: "period", on: "k-forms on an oriented Riemannian n-manifold", residue: "applying it twice multiplies by (-1)^(k(n-k))", receipt: F("D4-177", "preserved", "**=±id"), check: "hodge-star-square", note: "the entry says plus or minus; the computed row says which" },
  { id: "V22", a: "D4-370", b: null, side: "two-sided", on: "the sphere without its north pole", residue: "the pole has no image", receipt: F("D4-370", "input", "Sphere S^n \\ {north pole}"), check: "stereographic-round-trip" },
  { id: "V23", a: "D5-091", b: null, side: "two-sided", on: "positive data", residue: "zero and negative values have no logarithm", receipt: F("D5-091", "input", "Positive data"), check: "log-exp-positive" },
  { id: "V24", a: "D5-014", b: null, side: "two-sided", on: "positive data, lambda fixed and nonzero", residue: null, receipt: C("box-cox-round-trip") },
  { id: "V25", a: "D5-102", b: "D5-102", side: "two-sided", on: "bipartite matrices", residue: null, receipt: C("partial-transpose-involution") },
  { id: "V26", a: "D2-110", b: "D2-110", side: "two-sided", on: "locally compact abelian groups, up to the canonical isomorphism to the double dual", residue: null, receipt: { formal: ["D2-110", "AddChar.doubleDualEmb_bijective"] }, note: "the formal receipt covers finite groups only (a special link)" },
];

if (import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0; const kinds = {};
  const ran = Object.fromEntries(Object.entries(CHECKS).map(([k, f]) => { let ok = false; try { ok = f() === true; } catch { ok = false; } return [k, ok]; }));
  for (const r of ROWS) {
    const v = verify(r.receipt); const name = r.receipt.computed ?? r.check;
    const comp = name ? ran[name] : null;
    const k = r.receipt.computed ? "computed" : v.kind; kinds[k] ??= { rows: 0, ok: 0 }; kinds[k].rows++;
    const ok = (r.receipt.computed ? comp === true : v.ok) && (comp === null || comp === true);
    if (ok) kinds[k].ok++; else if (k !== "none") { bad++; console.log(`  FAIL ${r.id} [${k}] ${v.why} computed=${comp}`); }
    console.log(`${r.id} ${r.a} ${entry(r.a).name}${r.b ? (r.b === r.a ? " (with itself)" : ` / ${r.b} ${entry(r.b).name}`) : " (inverse has no entry)"}: ${r.side}; on ${r.on}${r.residue ? `; residue: ${r.residue}` : ""} [${k}${name && !r.receipt.computed ? " + computed" : ""}]`);
  }
  const ents = new Set(ROWS.flatMap((r) => [r.a, r.b]).filter(Boolean));
  const alsoComputed = ROWS.filter((r) => r.check).length;
  console.log(`p3: ${ROWS.length} rows on ${ents.size} entries; receipts ` + Object.entries(kinds).map(([k, v]) => `${k} ${v.ok}/${v.rows}`).join(", ") + `; ${Object.values(ran).filter(Boolean).length} of ${Object.keys(ran).length} computed checks pass (${alsoComputed} rows carry a computed check beside a quoted receipt)`);

  // (2) What an entry invertible on its domain breaks, its inverse restores there.
  console.log("p3 broken fields of entries with a two-sided inverse on their domain:");
  const two = [...new Set(ROWS.filter((r) => r.side === "two-sided").map((r) => r.a))]; let flagged = 0, clean = 0;
  for (const id of two) { const b = entry(id).broken; const nothing = /^nothing\b/i.test(b); nothing ? clean++ : flagged++; console.log(`  ${id} ${entry(id).name}: ${nothing ? "says nothing is broken" : `"${b}"`}`); }
  console.log(`p3: ${flagged} of ${two.length} invertible entries list something as broken; ${clean} say nothing is. Each listed item is restored by the round trip on the row's domain`);
  const { compose } = await import(join(ROOT, "scripts", "compose.mjs"));
  for (const r of ROWS.filter((r) => r.b && r.b !== r.a)) {
    const c = compose([r.a, r.b]); const inv = (c.invariants ?? []).filter((x) => /broken/.test(x.status));
    if (c.error || !(c.invariants ?? []).length) { console.log(`  ${r.id} ${r.a},${r.b}: compose.mjs has no invariant links for the pair`); continue; }
    console.log(`  ${r.id} ${r.a},${r.b}: compose.mjs reports ${inv.length ? inv.map((x) => `${x.name} ${x.status}`).join("; ") : "nothing broken"}; the row says the round trip is the identity on: ${r.on}`);
  }

  // (3) Kinds reachable only by walking a two-sided inverse backwards.
  const T = new Map(typeEntries().map((t) => [t.id, t])); const carriers = map().invariants.carriers;
  const ks = (ops) => [...new Set((ops ?? []).map((x) => x.kind).filter((k) => k && k in carriers))];
  const edges = []; for (const t of T.values()) { const i = ks(t.input), o = ks(t.output); if (i.length && o.length) for (const a of i) for (const b of o) edges.push([a, b, t.id]); }
  const reach = (E) => { const adj = {}; for (const [a, b] of E) (adj[a] ??= new Set()).add(b); const out = new Set(); for (const s of Object.keys(adj)) { const seen = new Set([s]); const q = [s]; while (q.length) { const u = q.pop(); for (const v of adj[u] ?? []) if (!seen.has(v)) { seen.add(v); q.push(v); out.add(`${s}>${v}`); } } } return out; };
  const base = reach(edges); const rev = [];
  for (const id of two) { const t = T.get(id); if (!t) continue; for (const a of ks(t.input)) for (const b of ks(t.output)) if (a !== b) rev.push([b, a, id]); }
  const plus = reach([...edges, ...rev]); const fresh = [...plus].filter((p) => !base.has(p));
  const direct = rev.filter(([a, b]) => !base.has(`${a}>${b}`));
  console.log(`p3 routes: ${edges.length} typed edges over ${new Set(edges.flatMap((e) => [e[0], e[1]])).size} kinds reach ${base.size} ordered pairs of kinds; walking the ${rev.length} reversed edges of two-sided rows adds ${fresh.length} pairs`);
  for (const [a, b, id] of direct) console.log(`  opened by ${id} ${entry(id).name} backwards: ${a} to ${b}`);
  process.exit(bad ? 1 : 0);
}
