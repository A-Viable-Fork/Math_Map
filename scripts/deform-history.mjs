// Role: the HISTORY-001 round. Asks whether the deformation generator retrodicts paradigm transitions:
//   for each pre-registered row (generation/2026-10-11-history-001/preregistration.md) it builds the
//   predecessor's candidate set (the zero deformation, integrated adjoint deformations over a class grid,
//   central extensions), applies the conflict as a constraint, ranks the survivors, and runs the controls:
//   the real constraint on a wrong predecessor, every decoy constraint of the same form, and a time-sliced
//   generator restricted to the vocabulary dated before the transition. Grades follow the pre-registration.
// Contract: `node scripts/deform-history.mjs --round [--out FILE]` runs the round and prints (or writes) its
//   report; `--receipts` checks that every quote the round cites occurs in its excerpt file (cheap; in the
//   gate). Exports ALG (the round's algebras), ROWS, VOCAB, candidates, sliced, runRow.
// Invariant: read-only on the repository except --out. Exact arithmetic (the engine's). Decoys beyond 2000
//   are drawn by a seeded generator, so the report is reproducible byte for byte.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { algebra, h2, coords, vec2, classBasis, invariantBases, integrate, at_t, sumCochains, centralH2, centralExtension,
  trivialInvariant, jacobiCoefficients, jacobiHolds, fingerprint, CONSTRAINTS, select, fromMatrices, termsOf, describe,
  family, d1, Q, ONE, ZERO, signature, killing, invariantForms, formSignatures } from "./deform.mjs";
import { ALGEBRAS } from "./deform-algebras.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ---------- the round's algebras ----------
const I = (s) => [0, s], R = (s) => [s, 0], O = [0, 0];
// Gell-Mann matrices, as [re, im] entries.
const GM = {
  1: [[O, R(1), O], [R(1), O, O], [O, O, O]], 2: [[O, I(-1), O], [I(1), O, O], [O, O, O]], 3: [[R(1), O, O], [O, R(-1), O], [O, O, O]],
  4: [[O, O, R(1)], [O, O, O], [R(1), O, O]], 5: [[O, O, I(-1)], [O, O, O], [I(1), O, O]], 6: [[O, O, O], [O, O, R(1)], [O, R(1), O]],
  7: [[O, O, O], [O, O, I(-1)], [O, I(1), O]], Y: [[R(1), O, O], [O, R(1), O], [O, O, R(-2)]],
};
const times_i = (M) => M.map((r) => r.map(([a, b]) => [-b, a]));
const SU3_NAMES = ["T1", "T2", "T3", "Y", "V1", "V2", "V3", "V4"];
const su3 = () => fromMatrices(SU3_NAMES, [1, 2, 3, "Y", 4, 5, 6, 7].map((k) => times_i(GM[k])));
// su(2,1): the same compact u(2) part, and the Hermitian off-diagonal blocks, which preserve diag(1, 1, -1).
const su21 = () => fromMatrices(SU3_NAMES, [...[1, 2, 3, "Y"].map((k) => times_i(GM[k])), ...[4, 5, 6, 7].map((k) => GM[k])]);
const isV = (x) => x.startsWith("V");
const check = (g, what) => { if (!jacobiHolds(g)) throw new Error(`${what}: brackets fail Jacobi`); return g; };
const galTerms = () => termsOf(ALGEBRAS.galilei());
export const ALG = {
  galilei: ALGEBRAS.galilei, poincare: ALGEBRAS.poincare, deSitter: ALGEBRAS.deSitter, static: ALGEBRAS.static,
  carroll: () => check(algebra(ALGEBRAS.static().names, [...termsOf(ALGEBRAS.static()), ...[1, 2, 3].map((i) => [`K${i}`, `P${i}`, "H", 1])]), "Carroll"),
  bargmann: () => check(algebra([...ALGEBRAS.galilei().names, "M"], [...galTerms(), ...[1, 2, 3].map((i) => [`K${i}`, `P${i}`, "M", 1])]), "Bargmann"),
  plane: () => algebra(["x", "p"], []),
  affine: () => algebra(["x", "p"], [["x", "p", "x", 1]]),
  heisenberg: () => algebra(["x", "p", "z"], [["x", "p", "z", 1]]),
  oscillator: () => check(algebra(["x", "p", "z", "H"], [["x", "p", "z", 1], ["H", "x", "p", -1], ["H", "p", "x", 1]]), "oscillator"),
  charge: () => algebra(["Q"], []),
  isospinHypercharge: () => check(algebra(["T1", "T2", "T3", "Y"], [["T1", "T2", "T3", 1], ["T2", "T3", "T1", 1], ["T3", "T1", "T2", 1]]), "su(2) + u(1)"),
  su3, su21,
  // The contraction of su(3) along su(2) + u(1): V -> eps V, eps -> 0 drops [V, V].
  su3contracted: () => { const g = su3(); return check(algebra(g.names, termsOf(g).filter(([a, b]) => !(isV(a) && isV(b)))), "contracted su(3)"); },
  su3inert: () => { const g = su3(); return check(algebra(g.names, termsOf(g).filter(([a, b]) => !isV(a) && !isV(b))), "su(2) + u(1) + R^4"); },
};

// ---------- candidate sets ----------
const families = (g, fs) => fs.flatMap((f) => family(g, f));
const famList = (g) => { const out = []; for (const x of g.names) { const f = x.replace(/\d+$/, ""); if (!out.includes(f)) out.push(f); } return out; };
// The grid over a class basis of size k: all of {-1,0,1}^k minus zero when k <= 4, else at most two nonzero entries.
function grid(k) {
  const out = [];
  if (k <= 4) { const c = Array(k).fill(-1); for (;;) { if (c.some((x) => x)) out.push([...c]); let h = 0; while (h < k && c[h] === 1) c[h++] = -1; if (h === k) break; c[h]++; } return out; }
  for (let i = 0; i < k; i++) for (const s of [1, -1]) { const c = Array(k).fill(0); c[i] = s; out.push(c); }
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) for (const s of [1, -1]) for (const u of [1, -1]) { const c = Array(k).fill(0); c[i] = s; c[j] = u; out.push(c); }
  return out;
}
const lbl = (kind, c) => `${kind}(${c.join(",")})`;
// The pre-registered candidate set: zero; integrated adjoint deformations over the grid; central extensions over the grid.
export function candidates(g0, sym) {
  const C = coords(g0.n), H = sym ? families(g0, sym) : null;
  const inv = H ? h2(g0, H) : h2(g0);
  const keep = classBasis(inv.cocycles.map((p) => vec2(g0, p, C)), inv.coboundaries), basis = keep.map((i) => inv.cocycles[i]);
  const space = H ? invariantBases(g0, H).B2 : null;
  const out = [{ alg: g0, order: 0, support: 0, label: "zero" }];
  let obstructed = 0;
  for (const c of grid(basis.length)) {
    const phi = sumCochains(c.map((x, i) => [x, basis[i]]).filter(([x]) => x));
    const r = integrate(g0, phi, { space });
    if (!r.exact) { obstructed++; continue; }
    out.push({ alg: at_t(g0, r.phis, 1), order: r.order, support: c.filter((x) => x).length, label: lbl("adj", c) });
  }
  const ch = H ? centralH2(g0, H) : centralH2(g0), keepC = classBasis(ch.cocycles, ch.coboundaries), cbasis = keepC.map((i) => ch.cocycles[i]);
  for (const c of grid(cbasis.length)) {
    const w = new Map(); c.forEach((x, i) => { if (x) for (const [k, f] of cbasis[i]) { const y = (w.get(k) ?? ZERO).add(f.mul(Q.of(x))); if (y.isZero()) w.delete(k); else w.set(k, y); } });
    out.push({ alg: centralExtension(g0, w, "Z"), order: 1, support: c.filter((x) => x).length, label: lbl("ext", c) });
  }
  for (const x of out) x.fp = fingerprint(x.alg);
  return { cands: out, adjH2: basis.length, centralH2: cbasis.length, obstructed, directions: basis.map((p) => describe(g0, p)), centralDirections: cbasis.map((w) => [...w].map(([k]) => { const [i, j] = C.P[k]; return `[${g0.names[i]},${g0.names[j]}]`; }).join(" ")) };
}
// The time-sliced generator before cohomology: g0 + t phi over the invariant 2-cochain block basis (at most two
// nonzero coefficients, each +1 or -1), kept when Jacobi holds for every t; central extensions found by Jacobi on
// g0 + R z over the invariant trivial 2-cochains (same rule). No quotient by coboundaries.
export function sliced(g0, sym) {
  const H = sym ? families(g0, sym) : [], B2 = invariantBases(g0, H).B2, out = [{ alg: g0, order: 0, support: 0, label: "zero" }];
  const pick = (k) => { const o = []; for (let i = 0; i < k; i++) { o.push([[i, 1]], [[i, -1]]); for (let j = i + 1; j < k; j++) for (const s of [1, -1]) for (const u of [1, -1]) o.push([[i, s], [j, u]]); } return o; };
  for (const c of pick(B2.length)) {
    const phi = sumCochains(c.map(([i, s]) => [s, B2[i]]));
    if (jacobiCoefficients(g0, [g0.br, phi]).every((v) => !v.size)) out.push({ alg: at_t(g0, [g0.br, phi], 1), order: 1, support: c.length, label: lbl("jac", c.map(([i, s]) => `${s > 0 ? "+" : "-"}${i}`)) });
  }
  const T = trivialInvariant(g0, sym ? H : null).B2;
  for (const c of pick(T.length)) {
    const w = new Map(); for (const [i, s] of c) for (const [k, f] of T[i]) { const y = (w.get(k) ?? ZERO).add(f.mul(Q.of(s))); if (y.isZero()) w.delete(k); else w.set(k, y); }
    const ext = centralExtension(g0, w, "Z");
    if (w.size && jacobiHolds(ext)) out.push({ alg: ext, order: 1, support: c.length, label: lbl("cext", c.map(([i, s]) => `${s > 0 ? "+" : "-"}${i}`)) });
  }
  for (const x of out) x.fp = fingerprint(x.alg);
  return out;
}

// ---------- vocabulary dated, with receipts ----------
// Each map entry (or concept) a row's generator uses, with the year of first publication. First publication is
// earlier than "became standard", so slicing by it is lenient to the generator.
export const VOCAB = [
  { id: "D7-130", what: "Lie algebras: structure constants, the bracket, the Jacobi identity", year: 1870, receipt: ["excerpts/wikipedia-lie-algebra-history.txt", "Lie algebras were introduced to study the concept of [[infinitesimal transformation]]s by [[Sophus Lie]] in the 1870s,"] },
  { id: "classification", what: "the simple Lie algebras, su(3) among them (Killing and Cartan)", year: 1890, receipt: ["excerpts/wikipedia-lie-algebra-history.txt", "were classified by Killing and Cartan in the 1880s and 1890s, using [[root system]]s."] },
  { id: "D4-301", what: "the Poisson bracket", year: 1809, receipt: ["excerpts/wikipedia-poisson-bracket-history.txt", "He introduced the Poisson bracket in his 1809 treatise on mechanics."] },
  { id: "D7-X11", what: "Sylvester's law of inertia: the signature of a quadratic form", year: 1852, receipt: ["excerpts/wikipedia-sylvesters-law-history.txt", "This property is named after [[James Joseph Sylvester]], who published its proof in 1852."] },
  { id: "D7-402", what: "the Killing form and Cartan's criterion", year: 1894, receipt: ["excerpts/wikipedia-cartans-criterion-history.txt", "The criterion was introduced by {{harvs|txt|authorlink=Élie Cartan|first=Élie|last= Cartan|year=1894}}."] },
  { id: "D7-X12", what: "Lie algebra cohomology with trivial coefficients, so H^2(g; R) (Cartan)", year: 1929, receipt: ["excerpts/wikipedia-lie-algebra-cohomology-history.txt", "It was first introduced in 1929 by [[Élie Cartan]]"] },
  { id: "D7-X07", what: "Chevalley-Eilenberg cohomology with coefficients in a module, so H^2(g; g)", year: 1948, receipt: ["excerpts/wikipedia-lie-algebra-cohomology-history.txt", "|last2=Eilenberg|first2=Samuel|author1-link=Claude Chevalley|author2-link=Samuel Eilenberg|year=1948}} to coefficients in an arbitrary [[Lie algebra representation|Lie module]]."] },
  { id: "D7-X10", what: "contraction (Segal; Inonu and Wigner)", year: 1951, receipt: ["excerpts/wikipedia-group-contraction-history.txt", "<ref>{{harvnb|Segal|1951|p=221}}</ref>"] },
  { id: "D7-X08", what: "deformation theory of algebras (Gerstenhaber; for Lie algebras, Nijenhuis and Richardson 1967)", year: 1964, receipt: ["excerpts/wikipedia-murray-gerstenhaber.txt", "\"On the deformation of rings and algebras,\" ''Annals of Mathematics'', Second Series, Vol. 79, No. 1 (Jan., 1964)"] },
  { id: "kinematics", what: "the possible kinematics classified by deformation and contraction (Bacry and Levy-Leblond)", year: 1968, receipt: ["excerpts/arxiv-1711.06111-references.txt", "J. Mathematical Phys. 9 (1968) 1605"] },
];
const RECEIPTS = [
  ...VOCAB.map((v) => v.receipt),
  ["excerpts/arxiv-1711.06111-references.txt", "Deformations of Lie algebra structures,” J. Math. Mech. 17 (1967) 89–105."],
  ["excerpts/wikipedia-group-contraction-history.txt", "In theoretical physics, [[Eugene Wigner]] and [[Erdal İnönü]] have discussed<ref>{{harvnb|Inönü|Wigner|1953}}</ref>"],
  ["excerpts/wikipedia-killing-form-history.txt", "The Killing form was essentially introduced into Lie algebra theory by"],
  // The rows out of reach and R10: the dates and readings their table entries state.
  ["excerpts/wikipedia-newton-cartan-theory.txt", "first introduced by [[Élie Cartan]] in 1923"],
  ["excerpts/wikipedia-newton-cartan-theory.txt", "Newtonian gravity can be seen as a specific limit of general relativity"],
  ["excerpts/wikipedia-hamiltonian-mechanics-1833.txt", "is a reformulation of [[Lagrangian mechanics]] that emerged in 1833"],
  ["excerpts/wikipedia-heisenberg-picture.txt", "in which observables are constant (as long as there is no external force) and the states evolve in time."],
  ["excerpts/wikipedia-canonical-commutation-relation.txt", "This observation led [[Paul Dirac|Dirac]] to propose that the quantum counterparts"],
];

// ---------- the rows ----------
// Evidence: [file, quote, year]. Transition: [year, file, quote].
export const ROWS = [
  { id: "R1", type: "deformation by c", pred: "galilei", sym: ["J"], succ: "poincare", form: "F1", params: { S: ["H", "P"], A: ["J", "K"], sig: [3, 1] },
    conflict: "Maxwell's equations are invariant under the Lorentz transformation (Lorentz 1904); the null result of Michelson and Morley (1887)",
    transition: [1905, "excerpts/wikipedia-special-relativity-1905.txt", "around 1905, the year his paper on special relativity was published"],
    evidence: [["excerpts/wikipedia-history-lorentz-transformations.txt", "it was later shown by Lorentz (1904) and Poincaré (1905) that they are indeed invariant under this transformation to all orders", 1904], ["excerpts/wikipedia-michelson-morley-1887.txt", "The experiment was performed between April and July 1887", 1887]],
    wrong: [["carroll", ["J"]], ["static", ["J"]]] },
  { id: "R2", type: "deformation by Lambda", pred: "poincare", sym: ["J"], succ: "deSitter", form: "F2", params: { X: "H", S: ["P", "K"], sign: 1 },
    conflict: "the accelerating expansion (type Ia supernovae, 1998)",
    transition: [1998, "excerpts/wikipedia-accelerating-expansion-1998.txt", "The accelerated expansion of the [[universe]] was discovered in 1998"],
    evidence: [["excerpts/wikipedia-accelerating-expansion-1998.txt", "which used distant [[type Ia supernovae]] to measure the acceleration.", 1998]],
    wrong: [["galilei", ["J"]]] },
  { id: "R3", type: "deformation by hbar (central extension)", pred: "plane", sym: null, succ: "heisenberg", form: "F3", params: { A: "x", B: "p" },
    conflict: "the quantum of action in phase space: the Bohr-Sommerfeld quantization condition (Bohr 1913, Sommerfeld 1916)",
    transition: [1925, "excerpts/wikipedia-canonical-commutation-relation.txt", "[[Max Born]] and [[Pascual Jordan]] (1925),"],
    evidence: [["excerpts/wikipedia-old-quantum-theory.txt", "The main tool of the old quantum theory was the Bohr–Sommerfeld quantization condition", 1916], ["excerpts/wikipedia-old-quantum-theory.txt", "|date=1916|title=Zur Quantentheorie der Spektrallinien", 1916]],
    wrong: [["affine", null]] },
  { id: "R4", type: "central charge (mass)", pred: "galilei", sym: ["J"], succ: "bargmann", form: "F3", params: { A: "K", B: "P" },
    conflict: "the Schrodinger equation (1926) is Galilean invariant only up to a phase factor on the wave function",
    transition: [1954, "excerpts/wikipedia-lie-algebra-extension.txt", "the '''Bargmann group''',<ref>{{harvnb|Bargmann|1954}}</ref>"],
    evidence: [["excerpts/wikipedia-schrodinger-equation-galilean.txt", "The effect of a [[Galilean transformation]] upon the Schrödinger equation can be creates a phase factor times the wave function", 1926], ["excerpts/wikipedia-schrodinger-equation-galilean.txt", "published it in 1926", 1926]],
    wrong: [["poincare", ["J"]]] },
  { id: "R6L", type: "unification, leaked variant", pred: "su3contracted", sym: ["T", "Y"], succ: "su3", form: "F4", params: { sig: [0, 8] }, leakedBy: "the predecessor carries the successor's four new generators V (the contraction of su(3)), supplied by hand",
    conflict: "the baryon octet, complete with the neutral Xi (1959); finite multiplets are unitary, so the algebra is compact",
    transition: [1961, "excerpts/wikipedia-eightfold-way-1961.txt", "proposed the idea in 1961."],
    evidence: [["excerpts/wikipedia-xi-baryon-1959.txt", "The first discovery of the neutral Xi particle was at Lawrence Berkeley Laboratory in 1959.", 1959]],
    wrong: [["su3inert", ["T", "Y"]]] },
];
// Rows out of reach, and the reformulation row R10, as table entries.
const OUT_OF_REACH = [
  ["R5", "unification", "u(1) of electric charge (1)", "su(2) + u(1) with mixing (4)", "deformation keeps the dimension and a central extension adds one; the successor has three more generators, and the mixing angle is a choice of u(1) inside su(2) + u(1), not a structure constant"],
  ["R6", "unification", "su(2) + u(1), isospin and hypercharge (4)", "su(3) (8)", "four new generators; computed only as R6L, leaked"],
  ["R7", "geometrization", "Newtonian gravity", "general relativity", "diffeomorphisms are infinite-dimensional; Newton-Cartan, the geometrized Newtonian theory, came after general relativity (Cartan 1923) as its limit"],
  ["R8", "reduction", "thermodynamics", "statistical mechanics", "no finite symmetry algebra carries the transition"],
  ["R9", "reformulation", "Lagrangian mechanics", "Hamiltonian mechanics (1833)", "a change of variables on function spaces; no finite algebra changes"],
];

// ---------- decoys ----------
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const subsets = (xs) => { const out = []; for (let m = 1; m < 1 << xs.length; m++) out.push(xs.filter((_, i) => m & (1 << i))); return out; };
function decoySpace(g0, form, real) {
  const fams = famList(g0), dim = (S) => families(g0, S).length, out = [];
  const unions = subsets(fams).filter((S) => dim(S) >= 2);
  if (form === "F1") for (const S of unions) for (const A of subsets(fams)) for (let p = Math.ceil(dim(S) / 2); p <= dim(S); p++) out.push({ S, A, sig: [p, dim(S) - p] });
  if (form === "F2") for (const X of fams) for (const S of unions) for (const sign of [1, -1]) out.push({ X, S, sign });
  if (form === "F3") fams.forEach((A, i) => fams.slice(i).forEach((B) => out.push({ A, B })));
  if (form === "F4") for (let p = 0; p <= g0.n; p++) out.push({ sig: [p, g0.n - p] });
  const key = (x) => JSON.stringify(x, Object.keys(x).sort());
  const norm = (x) => (form === "F1" ? { ...x, sig: [Math.max(...x.sig), Math.min(...x.sig)] } : form === "F3" ? (fams.indexOf(x.A) <= fams.indexOf(x.B) ? x : { A: x.B, B: x.A }) : x);
  return out.filter((x) => key(norm(x)) !== key(norm(real)));
}
function drawDecoys(space, seed) {
  if (space.length <= 2000) return { decoys: space, exhaustive: true };
  const rnd = mulberry32(seed), idx = [...space.keys()];
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return { decoys: idx.slice(0, 500).sort((a, b) => a - b).map((i) => space[i]), exhaustive: false };
}

// ---------- running a row ----------
const outcome = (list, succFp) => { const s = list.find((g) => g.fp === succFp); return { survivors: list.length, succ: s ? { rank: s.rank, ties: s.ties } : null, alts: list.length - (s ? 1 : 0), hit: !!s && s.rank === 1 && list.length - 1 <= 1 }; };
export function runRow(row, n) {
  const g0 = ALG[row.pred](), succ = ALG[row.succ](), succFp = fingerprint(succ);
  const cs = candidates(g0, row.sym), pass = CONSTRAINTS[row.form](row.params);
  const list = select(cs.cands, pass), res = outcome(list, succFp);
  const wrong = row.wrong.map(([name, sym]) => { const w = candidates(ALG[name](), sym); return { name, n: w.cands.length, list: select(w.cands, pass), ...outcome(select(w.cands, pass), succFp) }; });
  const { decoys, exhaustive } = drawDecoys(decoySpace(g0, row.form, row.params), 20261011 + n);
  // A decoy whose F1 search was partial on some candidate is counted, and the rates are also given without it.
  let live = 0, hits = 0, partial = 0, liveExact = 0, hitsExact = 0;
  for (const d of decoys) {
    const pred = CONSTRAINTS[row.form](d), o = outcome(select(cs.cands, pred), succFp);
    if (o.survivors) live++; if (o.hit) hits++;
    if (pred.partial) partial++; else { if (o.survivors) liveExact++; if (o.hit) hitsExact++; }
  }
  // The time slice: D7-X07 and D7-X08 both dated before the transition, or the Jacobi-only generator.
  const year = row.transition[0], has = (id) => VOCAB.find((v) => v.id === id).year < year;
  const full = has("D7-X07") && has("D7-X08");
  const sl = full ? cs.cands : sliced(g0, row.sym), slList = select(sl, pass), slOut = outcome(slList, succFp);
  return { row, g0, cs, list, res, wrong, decoys: decoys.length, exhaustive, live, hits, partial, liveExact, hitsExact, realPartial: !!pass.partial, full, sliced: { n: sl.length, distinct: new Set(sl.map((c) => c.fp)).size, list: slList, ...slOut }, succFp,
    distinct: new Set(cs.cands.map((c) => c.fp)).size };
}

// ---------- the time slice, supplemented: Poisson realizations ----------
// Polynomials in q1..qd, p1..pd as Map(exponent string -> Q). The Poisson bracket {f, g} = sum df/dq dg/dp - df/dp dg/dq.
function poly(d, terms) { const m = new Map(); for (const [c, e] of terms) { const k = e.join(","); const y = (m.get(k) ?? ZERO).add(Q.of(c)); if (y.isZero()) m.delete(k); else m.set(k, y); } return m; }
function pmul(a, b) { const m = new Map(); for (const [ka, x] of a) for (const [kb, y] of b) { const e = ka.split(",").map((v, i) => +v + +kb.split(",")[i]); const k = e.join(","); const z = (m.get(k) ?? ZERO).add(x.mul(y)); if (z.isZero()) m.delete(k); else m.set(k, z); } return m; }
function pder(a, v) { const m = new Map(); for (const [k, x] of a) { const e = k.split(",").map(Number); if (!e[v]) continue; const c = x.mul(Q.of(e[v])); e[v]--; m.set(e.join(","), c); } return m; }
function padd(a, b, s = ONE) { const m = new Map(a); for (const [k, x] of b) { const y = (m.get(k) ?? ZERO).add(x.mul(s)); if (y.isZero()) m.delete(k); else m.set(k, y); } return m; }
function poissonBracket(f, g, d) { let out = new Map(); for (let i = 0; i < d; i++) { out = padd(out, pmul(pder(f, i), pder(g, d + i))); out = padd(out, pmul(pder(f, d + i), pder(g, i)), ONE.neg()); } return out; }
// The Lie algebra the functions span under the Poisson bracket, solved exactly in their span.
function poissonAlgebra(names, fs) {
  const keys = [...new Set(fs.flatMap((f) => [...f.keys()]))];
  const vec = (f) => { const v = new Map(); for (const [k, x] of f) { let i = keys.indexOf(k); if (i < 0) { keys.push(k); i = keys.length - 1; } v.set(i, x); } return v; };
  const terms = [];
  const span = (v) => { // solve v = sum c_j fs_j by elimination on the monomial coordinates
    const rows = fs.map(vec), n = rows.length;
    const A = rows.map((r) => new Map(r)), comb = rows.map((_, j) => new Map([[j, ONE]])), piv = [];
    for (let j = 0; j < n; j++) { for (const [c, p] of piv) { const f = A[j].get(c); if (f) { for (const [k, x] of A[p]) { const y = (A[j].get(k) ?? ZERO).sub(f.mul(x)); if (y.isZero()) A[j].delete(k); else A[j].set(k, y); } for (const [k, x] of comb[p]) { const y = (comb[j].get(k) ?? ZERO).sub(f.mul(x)); if (y.isZero()) comb[j].delete(k); else comb[j].set(k, y); } } } if (!A[j].size) throw new Error("dependent functions"); const c = Math.min(...A[j].keys()), s = ONE.div(A[j].get(c)); for (const [k, x] of A[j]) A[j].set(k, x.mul(s)); for (const [k, x] of comb[j]) comb[j].set(k, x.mul(s)); piv.push([c, j]); }
    const w = new Map(v), x = new Map();
    for (const [c, p] of piv) { const f = w.get(c); if (!f) continue; for (const [k, y] of A[p]) { const z = (w.get(k) ?? ZERO).sub(f.mul(y)); if (z.isZero()) w.delete(k); else w.set(k, z); } for (const [k, y] of comb[p]) { const z = (x.get(k) ?? ZERO).add(f.mul(y)); if (z.isZero()) x.delete(k); else x.set(k, z); } }
    if (w.size) throw new Error("the bracket leaves the span"); return x;
  };
  for (let a = 0; a < fs.length; a++) for (let b = a + 1; b < fs.length; b++) for (const [k, c] of span(vec(poissonBracket(fs[a], fs[b], fs.d)))) terms.push([names[a], names[b], names[k], c]);
  return algebra(names, terms);
}
export function realizations() {
  // One degree of freedom: q, p, 1.
  const e1 = (q, p) => [q, p];
  const r3 = Object.assign([poly(1, [[1, e1(1, 0)]]), poly(1, [[1, e1(0, 1)]]), poly(1, [[1, e1(0, 0)]])], { d: 1 });
  const heis = poissonAlgebra(["x", "p", "z"], r3);
  // A free particle in three dimensions, mass 1, at t = 0: J = q x p, K = q, P = p, H = p^2 / 2, and 1.
  const e = (q, p) => [...q, ...p], z3 = [0, 0, 0], u = (i) => z3.map((_, j) => (j === i ? 1 : 0));
  const J = [[1, 2], [2, 0], [0, 1]].map(([a, b]) => poly(3, [[1, e(u(a), u(b))], [-1, e(u(b), u(a))]]));
  const fs = Object.assign([...J, ...[0, 1, 2].map((i) => poly(3, [[1, e(u(i), z3)]])), ...[0, 1, 2].map((i) => poly(3, [[1, e(z3, u(i))]])), poly(3, [0, 1, 2].map((i) => ["1/2", e(z3, u(i).map((x) => 2 * x))])), poly(3, [[1, e(z3, z3)]])], { d: 3 });
  const barg = poissonAlgebra(["J1", "J2", "J3", "K1", "K2", "K3", "P1", "P2", "P3", "H", "M"], fs);
  return { heis, barg };
}

// ---------- the report ----------
const table = (head, rows) => [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
const fmtList = (list, succFp) => list.map((g) => `${g.fp === succFp ? "**successor** " : ""}rank ${g.rank}${g.ties ? ` (tied with ${g.ties})` : ""}, key (order ${g.best[0]}, support ${g.best[1]}): ${g.fp} [${g.labels.length} candidate${g.labels.length > 1 ? "s" : ""}: ${g.labels.slice(0, 4).join(" ")}${g.labels.length > 4 ? " ..." : ""}]`);
const rate = (h, n) => (n ? `${h}/${n} = ${(h / n).toFixed(3)}` : "n/a (none)");
function grade(r) {
  const leaked = !!r.row.leakedBy, s = r.res.succ, liveRate = r.live ? r.hits / r.live : 0;
  if (leaked) return { verdict: "leaked", grade: "needs refinement", pass: false, liveRate };
  if (!s) return { verdict: "fail", grade: "dead", pass: false, liveRate };
  const pass = s.rank === 1 && r.res.alts <= 1 && liveRate < 0.25;
  const verdict = s.rank > 1 ? "fail (below rank 1)" : r.res.alts >= 2 ? "filter, not prediction" : liveRate >= 0.25 ? "fail (decoys hit)" : "pass";
  let g = 4; const cap = (x) => { g = Math.min(g, x); };
  if (!r.sliced.succ) cap(3); // generated: the sliced generator produces the successor and the constraint keeps it
  if (r.res.alts >= 2 && r.res.alts <= 3) cap(3);
  if (liveRate >= 0.25 && liveRate < 0.5) cap(3);
  if (s.rank > 1 || r.res.alts >= 4 || liveRate >= 0.5) cap(2);
  return { verdict, grade: ["", "", "plausible", "marginal", "confirmed"][g], pass, liveRate };
}
export function runRound() {
  const L = ["# HISTORY-001: the rows, computed", "", "Generated by `node scripts/deform-history.mjs --round`. Exact arithmetic; every rank checked over Q and modulo 2^61-1 and 2^89-1. The rows, constraints, controls and verdict rules are those of `preregistration.md` in this directory, committed before any of this was computed.", ""];
  L.push("## Vocabulary, dated", "", "Each map entry (or concept) a row's generator uses, with the year of first publication and its receipt. First publication is earlier than becoming standard, so the slice is lenient to the generator.", "",
    table(["entry", "what", "year", "receipt"], VOCAB.map((v) => [v.id, v.what, v.year, `\`${v.receipt[0]}\``])), "");
  const results = ROWS.map((row, i) => runRow(row, i + 1));
  const summary = [];
  for (const r of results) {
    const gr = grade(r); r.gr = gr;
    const yr = r.row.transition[0], vocab = VOCAB.filter((v) => v.year < yr).map((v) => v.id);
    L.push(`## ${r.row.id}: ${r.row.pred} to ${r.row.succ} (${r.row.type}, ${yr})`, "",
      `Conflict: ${r.row.conflict}. Evidence: ${r.row.evidence.map(([f, , y]) => `${y}, \`${f}\``).join("; ")}. Constraint ${r.row.form} ${JSON.stringify(r.row.params)}.${r.row.leakedBy ? ` **Leaked**: ${r.row.leakedBy}.` : ""}`, "",
      `Directions: invariant H^2(g; g) = ${r.cs.adjH2} (${r.cs.directions.join("; ") || "none"}); invariant H^2(g; R) = ${r.cs.centralH2} (${r.cs.centralDirections.join("; ") || "none"}). Candidates: ${r.cs.cands.length} (${r.cs.obstructed} grid points obstructed and dropped), ${r.distinct} distinct by fingerprint. Successor: ${r.succFp}.`, "",
      `Survivors (${r.list.length}):`, "", ...(r.list.length ? fmtList(r.list, r.succFp).map((x) => `- ${x}`) : ["- none"]), "",
      `Successor: ${r.res.succ ? `rank ${r.res.succ.rank}${r.res.succ.ties ? `, tied with ${r.res.succ.ties}` : ""}` : "not among the survivors"}; false positives: ${r.res.alts}.`, "",
      `Wrong predecessor: ${r.wrong.map((w) => `${w.name} (${w.n} candidates): ${w.survivors} survivor(s); successor ${w.succ ? `rank ${w.succ.rank}` : "absent"}; ${w.hit ? "selects the successor" : "does not select the successor"}`).join("; ")}. Specific: ${r.wrong.every((w) => !w.hit) ? "yes" : "no"}.`, "",
      `Decoys (${r.row.form}, ${r.exhaustive ? "the whole space" : "500 drawn"}): ${r.decoys}; live ${r.live}; hits ${r.hits}. Hit rate over all ${rate(r.hits, r.decoys)}; over live ${rate(r.hits, r.live)}.${r.partial ? ` ${r.partial} decoy(s) rested on a partial form search somewhere; without them, live ${r.liveExact}, hits ${r.hitsExact}, live hit rate ${rate(r.hitsExact, r.liveExact)}.` : ""}${r.realPartial ? " The real constraint's own search was partial." : ""}`, "",
      `Time slice (vocabulary before ${yr}: ${vocab.join(", ")}): ${r.full ? "the full generator is available" : "cohomology or deformation theory postdates the transition, so the Jacobi-only generator"}; ${r.sliced.n} candidates, ${r.sliced.distinct} distinct, ${r.sliced.survivors} survive; successor ${r.sliced.succ ? `rank ${r.sliced.succ.rank}, ${r.sliced.alts} alternative(s)` : "absent"}: **${r.sliced.succ ? "generated" : "recognized after the fact"}**.`, "",
      `Verdict: **${gr.verdict}**; grade **${gr.grade}**.`, "");
    summary.push([r.row.id, r.row.type, r.row.pred, r.row.succ, `${r.cs.adjH2} + ${r.cs.centralH2}`, r.cs.cands.length, r.distinct, r.list.length, r.res.succ ? `${r.res.succ.rank}${r.res.succ.ties ? ` (tie ${r.res.succ.ties})` : ""}` : "absent", r.res.alts, r.wrong.every((w) => !w.hit) ? "yes" : "no", rate(r.hits, r.live), r.sliced.succ ? "generated" : "after the fact", r.row.leakedBy ? "yes" : "no", gr.verdict, gr.grade]);
  }
  // R10: the change of picture.
  const osc = ALG.oscillator(), Hx = osc.idx.get("H"), adH = new Map(); for (let a = 0; a < osc.n; a++) { const v = new Map(); for (const [k, f] of (osc.br.get(Hx * osc.n + a) ?? new Map())) v.set(k, f); if (v.size) adH.set(a, v); }
  const dAdH = d1(osc, adH), oc = candidates(osc, null), same = (g) => termsOf(g).map(String).sort().join() === termsOf(osc).map(String).sort().join();
  const ol = select(oc.cands, same);
  L.push("## R10: Heisenberg picture to Schrodinger picture (reformulation)", "", `The oscillator algebra x, p, z, H. The change of picture is conjugation by the time evolution, generated by ad H; d(ad H) ${dAdH.size ? "is nonzero" : "= 0"}, so ad H is a derivation and the change moves no structure constant: class zero in H^2. Candidates ${oc.cands.length} (H^2(g; g) = ${oc.adjH2}, H^2(g; R) = ${oc.centralH2}); under "the same facts" (the structure constants unchanged) ${ol.length} survive, the zero deformation${ol.length === 1 && ol[0].labels[0] === "zero" ? "" : " and others"}. Gandy's fields: content hypotheticals, trivial by reformulation yes. In reach, and uninformative: the method sees the reformulation as no transition.`, "");
  summary.push(["R10", "reformulation", "oscillator (Heisenberg picture)", "the same algebra (Schrodinger picture)", `${oc.adjH2} + ${oc.centralH2}`, oc.cands.length, new Set(oc.cands.map((c) => c.fp)).size, ol.length, ol.length === 1 ? "1" : "?", ol.length - 1, "n/a", "n/a", "n/a", "no", dAdH.size ? "fail" : "pass (class zero)", "uninformative"]);
  for (const [id, type, pred, succ, why] of OUT_OF_REACH) summary.push([id, type, pred, succ, "", "", "", "", "", "", "", "", "", id === "R6" ? "see R6L" : "", "out of reach", ""]);
  // Poisson realizations: the central primitives inside the predecessor's own vocabulary.
  const pr = realizations();
  L.push("## The time slice, supplemented: Poisson realizations", "", `The Poisson bracket (1809) of q, p and the constant 1 spans an algebra with fingerprint ${fingerprint(pr.heis)}: ${fingerprint(pr.heis) === fingerprint(ALG.heisenberg()) ? "the Heisenberg algebra" : "not the Heisenberg algebra"}. The Poisson brackets of a free particle's Galilean generators (J = q x p, K = m q at t = 0, P = p, H = p^2 / 2m, with m = 1) and the constant span an algebra with fingerprint ${fingerprint(pr.barg)}: ${fingerprint(pr.barg) === fingerprint(ALG.bargmann()) ? "the Bargmann algebra" : "not the Bargmann algebra"}. Both central terms are in the classical vocabulary: {q, p} = 1 and {K_i, P_j} = m delta_ij.`, "");
  // The summary, reach, leakage, the pattern.
  const inReach = summary.filter((r) => r[14] !== "out of reach").length, leaked = results.filter((r) => r.row.leakedBy).length;
  const dep = results.filter((r) => ["R1", "R2", "R3", "R4"].includes(r.row.id)), G = (x) => ["dead", "needs refinement", "plausible", "marginal", "confirmed"].indexOf(x);
  const conf = dep.filter((r) => r.gr.grade === "confirmed").length, margUp = dep.filter((r) => G(r.gr.grade) >= 3).length, dead = dep.filter((r) => r.gr.grade === "dead").length, lk = dep.filter((r) => r.row.leakedBy).length, spec = dep.filter((r) => r.wrong.every((w) => !w.hit)).length;
  const pattern = dead >= 2 ? "dead" : lk >= 2 ? "needs refinement" : conf >= 3 && spec >= 1 ? "confirmed" : (margUp >= 2) || (conf >= 3 && spec === 0) ? "marginal" : margUp >= 1 ? "plausible" : "dead";
  L.splice(4, 0, "## Summary", "", table(["row", "type", "predecessor", "successor", "H^2 adj + central", "candidates", "distinct", "survivors", "successor rank", "false positives", "specific", "live-decoy hits", "time slice", "leaked", "verdict", "grade"], summary), "",
    `Reach: ${inReach} of ${summary.length} rows. Leakage count: ${leaked}. Deformation rows R1 to R4: ${conf} confirmed, ${margUp} marginal or better, ${dead} dead, ${spec} specific. **Pattern: ${pattern}.**`, "");
  return L.join("\n");
}

function checkReceipts() {
  const all = [...RECEIPTS, ...ROWS.flatMap((r) => [[r.transition[1], r.transition[2]], ...r.evidence.map(([f, q]) => [f, q])])];
  const bad = all.filter(([f, q]) => !readFileSync(join(ROOT, f), "utf8").includes(q));
  for (const [f, q] of bad) console.log(`MISSING in ${f}: ${q.slice(0, 80)}`);
  if (bad.length) { console.log(`deform-history receipts: ${bad.length} missing`); process.exit(1); }
  console.log(`deform-history receipts: PASS (${all.length} quotes)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), one = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  if (a.includes("--receipts")) checkReceipts();
  else if (a.includes("--round")) { const out = runRound(); if (one("--out")) { writeFileSync(one("--out"), out + "\n"); console.log(`wrote ${one("--out")}`); } else console.log(out); }
  else { console.log("deform-history: --round [--out FILE] | --receipts"); process.exit(1); }
}
