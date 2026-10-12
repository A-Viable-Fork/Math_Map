// Role: the deformation generator. Reads a Lie algebra from its structure constants and computes, exactly,
//   what can deform it: dim H^2(g,g) of the Chevalley-Eilenberg complex with adjoint coefficients, in full
//   and on the subcomplex of cochains invariant under named generators; the cocycles inside a template span
//   and how many classes they give; whether a deformation integrates (exact Jacobi of the deformed brackets,
//   order by order, solving away each obstruction that is a coboundary); the Killing signature; whether the
//   commutant of ad is one-dimensional; and diagonal contraction weights that return the old algebra as a
//   limit (Inonu-Wigner, generalized). Sublation read as deformation: generation/2026-10-11-deform-001.
// Contract: `node scripts/deform.mjs --algebra NAME [--invariant A,B,..] [--full]` (NAME from
//   scripts/deform-algebras.mjs) or `--spec FILE` (JSON {names, brackets: [[a, b, {c: coef}]]}, coef a number
//   or "p/q"); `--round calibration|seed [--out FILE]` runs a round and prints (or writes) its report;
//   `--selftest` runs the tests (2-dim abelian H^2 = 2, so(3) H^2 = 0, and the rules below). Exports the
//   engine. Every rank is computed three ways and asserted equal: exact rational elimination, and modulo
//   the Mersenne primes 2^61-1 and 2^89-1. Every kernel vector is verified by exact multiplication.
// Invariant: read-only on the repository except --out. Exact arithmetic throughout (BigInt rationals); no
//   floating point enters a result. The invariant subcomplex equals the full complex in cohomology only when
//   the named generators span a reductive subalgebra acting semisimply; the script reports both where it
//   can and never substitutes one for the other silently.
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// ---------- exact rationals ----------
const gcd = (a, b) => { if (a < 0n) a = -a; if (b < 0n) b = -b; while (b) [a, b] = [b, a % b]; return a; };
export class Q {
  constructor(n, d = 1n) {
    if (d === 0n) throw new Error("division by zero");
    if (d < 0n) { n = -n; d = -d; }
    const g = n === 0n ? d : gcd(n, d);
    this.n = n / g; this.d = d / g;
  }
  static of(x) {
    if (x instanceof Q) return x;
    if (typeof x === "bigint") return new Q(x);
    if (typeof x === "number") { if (!Number.isInteger(x)) throw new Error(`non-integer number ${x}: write "p/q"`); return new Q(BigInt(x)); }
    const m = String(x).trim().match(/^(-?\d+)(?:\/(\d+))?$/);
    if (!m) throw new Error(`not a rational: ${x}`);
    return new Q(BigInt(m[1]), BigInt(m[2] ?? 1));
  }
  add(b) { return this.d === 1n && b.d === 1n ? new Q(this.n + b.n) : new Q(this.n * b.d + b.n * this.d, this.d * b.d); }
  sub(b) { return this.add(b.neg()); }
  mul(b) { return this.d === 1n && b.d === 1n ? new Q(this.n * b.n) : new Q(this.n * b.n, this.d * b.d); }
  div(b) { return new Q(this.n * b.d, this.d * b.n); }
  neg() { return new Q(-this.n, this.d); }
  isZero() { return this.n === 0n; }
  sign() { return this.n > 0n ? 1 : this.n < 0n ? -1 : 0; }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
export const ZERO = new Q(0n), ONE = new Q(1n);

// Sparse vectors: Map<int, Q>, zeros never stored.
const addTo = (v, k, x) => { if (x.isZero()) return; const y = v.has(k) ? v.get(k).add(x) : x; if (y.isZero()) v.delete(k); else v.set(k, y); };
const axpy = (v, f, w) => { for (const [k, x] of w) addTo(v, k, f.mul(x)); }; // v += f w
const scaled = (w, f) => { const v = new Map(); for (const [k, x] of w) { const y = f.mul(x); if (!y.isZero()) v.set(k, y); } return v; };

// ---------- modular arithmetic for the rank cross-checks ----------
export const PRIMES = [(1n << 61n) - 1n, (1n << 89n) - 1n];
const mod = (a, p) => ((a % p) + p) % p;
function inv(a, p) { let [r0, r1, s0, s1] = [mod(a, p), p, 1n, 0n]; while (r1) { const q = r0 / r1; [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; } if (r0 !== 1n) throw new Error("not invertible mod p"); return mod(s0, p); }
const toP = (x, p) => { if (x.d % p === 0n) throw new Error("denominator divisible by the prime"); return mod(x.n * inv(x.d, p), p); };

// Rank of a list of sparse rational vectors modulo p, by echelon elimination on the smallest key.
export function rankModP(vecs, p) {
  const piv = new Map();
  for (const w of vecs) {
    const v = new Map(); for (const [k, x] of w) { const y = toP(x, p); if (y) v.set(k, y); }
    while (v.size) {
      let c = Infinity; for (const k of v.keys()) if (k < c) c = k;
      const r = piv.get(c);
      if (!r) { const s = inv(v.get(c), p); for (const [k, x] of v) v.set(k, (x * s) % p); piv.set(c, v); break; }
      const f = v.get(c);
      for (const [k, x] of r) { const y = mod((v.get(k) ?? 0n) - f * x, p); if (y) v.set(k, y); else v.delete(k); }
    }
  }
  return piv.size;
}

// Exact elimination over Q (Gauss-Jordan on the pivot rows, so one pass clears every pivot coordinate).
// Returns the rank, a kernel basis of the column map x -> sum x_j vecs[j], and a solver for targets.
export function eliminate(vecs) {
  const piv = new Map(); // coordinate -> { v, combo }
  const kernel = [];
  const reduce = (v, combo) => {
    for (const k of [...v.keys()]) {
      const r = piv.get(k); if (!r || !v.has(k)) continue;
      const f = v.get(k).neg(); axpy(v, f, r.v); axpy(combo, f, r.combo);
    }
  };
  vecs.forEach((w, j) => {
    const v = new Map(w), combo = new Map([[j, ONE]]);
    reduce(v, combo);
    if (!v.size) { kernel.push(combo); return; }
    let c = Infinity; for (const k of v.keys()) if (k < c) c = k;
    const s = ONE.div(v.get(c)), nv = scaled(v, s), nc = scaled(combo, s);
    for (const r of piv.values()) if (r.v.has(c)) { const f = r.v.get(c).neg(); axpy(r.v, f, nv); axpy(r.combo, f, nc); }
    piv.set(c, { v: nv, combo: nc });
  });
  // Every kernel vector is checked by exact multiplication.
  for (const x of kernel) { const s = new Map(); for (const [j, f] of x) axpy(s, f, vecs[j]); if (s.size) throw new Error("kernel vector failed verification"); }
  const solve = (t) => { // x with sum x_j vecs[j] = t, or null
    const v = new Map(t), combo = new Map();
    reduce(v, combo);
    return v.size ? null : scaled(combo, ONE.neg());
  };
  return { rank: piv.size, kernel, solve };
}

// The rank of a list of vectors, exactly and modulo both primes, asserted equal.
export function rank(vecs) {
  const q = eliminate(vecs).rank, m = PRIMES.map((p) => rankModP(vecs, p));
  if (m.some((r) => r !== q)) throw new Error(`rank disagreement: Q ${q}, mod p ${m.join(", ")}`);
  return q;
}

// ---------- Lie algebras and cochains ----------
// A 2-cochain (and a bracket) is a Map from i*n+j to a sparse vector, stored for both orders, antisymmetric.
export function algebra(names, terms) {
  const n = names.length, idx = new Map(names.map((x, i) => [x, i]));
  const br = new Map();
  const g = { names, n, idx, br };
  for (const [a, b, c, s] of terms) addTerm(br, n, idx.get(a), idx.get(b), idx.get(c), Q.of(s));
  return g;
}
export function addTerm(phi, n, i, j, k, s) {
  if ([i, j, k].some((x) => x === undefined)) throw new Error("unknown generator in a term");
  if (i === j) throw new Error("a bracket term [a,a] must vanish");
  for (const [a, b, f] of [[i, j, s], [j, i, s.neg()]]) { const key = a * n + b; const v = phi.get(key) ?? new Map(); addTo(v, k, f); if (v.size) phi.set(key, v); else phi.delete(key); }
}
export function cochain(g, terms) { const phi = new Map(); for (const [a, b, c, s] of terms) addTerm(phi, g.n, g.idx.get(a), g.idx.get(b), g.idx.get(c), Q.of(s)); return phi; }
const EMPTY = new Map();
const at = (phi, n, i, j) => phi.get(i * n + j) ?? EMPTY;
// phi(x, e_j) for a sparse vector x
function evalL(phi, n, x, j) { const out = new Map(); for (const [i, f] of x) axpy(out, f, at(phi, n, i, j)); return out; }
export function sumCochains(list) { // [[coef, phi], ...]
  const out = new Map();
  for (const [f, phi] of list) for (const [key, v] of phi) { const w = out.get(key) ?? new Map(); axpy(w, Q.of(f), v); if (w.size) out.set(key, w); else out.delete(key); }
  return out;
}

// Indexing of cochain coordinates.
function pairs(n) { const P = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) P.push([i, j]); return P; }
function triples(n) { const T = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) T.push([a, b, c]); return T; }
export function coords(n) {
  const P = pairs(n), T = triples(n), pi = new Map(P.map(([i, j], x) => [i * n + j, x]));
  return { P, T, pi };
}
// 2-cochain <-> vector over C^2 coordinates (pair index * n + k)
export function vec2(g, phi, C = coords(g.n)) { const v = new Map(); C.P.forEach(([i, j], x) => { for (const [k, f] of at(phi, g.n, i, j)) v.set(x * g.n + k, f); }); return v; }
export function unvec2(g, v, C = coords(g.n)) { const phi = new Map(); for (const [c, f] of v) { const [i, j] = C.P[Math.floor(c / g.n)]; addTerm(phi, g.n, i, j, c % g.n, f); } return phi; }

// Sum over cyclic permutations of phi(psi(e_a, e_b), e_c): the building block of every Jacobi identity.
function jac(g, phi, psi, a, b, c) {
  const out = new Map(), n = g.n;
  for (const [x, y, z] of [[a, b, c], [b, c, a], [c, a, b]]) for (const [k, f] of evalL(phi, n, at(psi, n, x, y), z)) addTo(out, k, f);
  return out;
}
// The linearized Jacobiator: delta(phi) = jac(mu, phi) + jac(phi, mu), as a vector over C^3 coordinates.
// It is minus the Chevalley-Eilenberg differential d(phi); kernels and images are the same.
export function delta2(g, phi, C = coords(g.n), mu = g.br) {
  const v = new Map(), n = g.n;
  C.T.forEach(([a, b, c], t) => { const s = jac(g, mu, phi, a, b, c); for (const [k, f] of jac(g, phi, mu, a, b, c)) addTo(s, k, f); for (const [k, f] of s) v.set(t * n + k, f); });
  return v;
}
// Jacobi defect of a polynomial family of brackets mu_t = sum_m t^m phis[m], coefficient by coefficient.
export function jacobiCoefficients(g, phis, C = coords(g.n)) {
  const out = [], N = phis.length - 1;
  for (let m = 0; m <= 2 * N; m++) {
    const v = new Map();
    for (let i = Math.max(0, m - N); i <= Math.min(m, N); i++) C.T.forEach(([a, b, c], t) => { for (const [k, f] of jac(g, phis[i], phis[m - i], a, b, c)) addTo(v, t * g.n + k, f); });
    out.push(v);
  }
  return out;
}
// d of a 1-cochain f (Map a -> sparse vector f(e_a)): (df)(a,b) = [a, f b] + [f a, b] - f([a,b]).
export function d1(g, f, C = coords(g.n), mu = g.br) {
  const v = new Map(), n = g.n, F = (a) => f.get(a) ?? EMPTY;
  C.P.forEach(([a, b], x) => {
    const s = new Map();
    for (const [i, c] of F(b)) axpy(s, c, at(mu, n, a, i));
    for (const [i, c] of F(a)) axpy(s, c, at(mu, n, i, b));
    for (const [i, c] of at(mu, n, a, b)) for (const [k, e] of F(i)) addTo(s, k, c.mul(e).neg());
    for (const [k, c] of s) v.set(x * n + k, c);
  });
  return v;
}
const basis1 = (n) => { const B = []; for (let a = 0; a < n; a++) for (let k = 0; k < n; k++) B.push(new Map([[a, new Map([[k, ONE]])]])); return B; };

// The action of a generator X on cochains, (X.phi)(a,b) = [X, phi(a,b)] - phi([X,a], b) - phi(a, [X,b]).
function act2(g, X, phi, C) {
  const v = new Map(), n = g.n;
  C.P.forEach(([a, b], x) => {
    const s = new Map();
    for (const [k, f] of at(phi, n, a, b)) axpy(s, f, at(g.br, n, X, k));
    for (const [i, f] of at(g.br, n, X, a)) axpy(s, f.neg(), at(phi, n, i, b));
    for (const [i, f] of at(g.br, n, X, b)) axpy(s, f.neg(), at(phi, n, a, i));
    for (const [k, f] of s) v.set(x * n + k, f);
  });
  return v;
}
function act1(g, X, f) { // (X.f)(a) = [X, f a] - f([X, a]); f as Map a -> vector
  const v = new Map(), n = g.n, F = (a) => f.get(a) ?? EMPTY;
  for (let a = 0; a < n; a++) {
    const s = new Map();
    for (const [k, c] of F(a)) axpy(s, c, at(g.br, n, X, k));
    for (const [i, c] of at(g.br, n, X, a)) axpy(s, c.neg(), F(i));
    for (const [k, c] of s) v.set(a * n + k, c);
  }
  return v;
}
// Blocks of generators that the named generators never mix (connected components of their ad action), so
// invariant cochains can be found block by block: each block Hom(B1 x B2, B3) is an invariant subspace.
function hBlocks(g, H) {
  const parent = g.names.map((_, i) => i), find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (const X of H) for (let a = 0; a < g.n; a++) for (const k of at(g.br, g.n, X, a).keys()) parent[find(a)] = find(k);
  return g.names.map((_, i) => find(i));
}
// Basis of the invariant 1-cochains and 2-cochains under generators H (indices).
export function invariantBases(g, H) {
  const n = g.n, C = coords(n), blk = hBlocks(g, H);
  const groups1 = new Map(), groups2 = new Map();
  for (let a = 0; a < n; a++) for (let k = 0; k < n; k++) { const key = `${blk[a]}|${blk[k]}`; (groups1.get(key) ?? groups1.set(key, []).get(key)).push([a, k]); }
  C.P.forEach(([i, j], x) => { for (let k = 0; k < n; k++) { const b = [blk[i], blk[j]].sort((p, q) => p - q); const key = `${b}|${blk[k]}`; (groups2.get(key) ?? groups2.set(key, []).get(key)).push([i, j, k]); } });
  const B1 = [], B2 = [];
  for (const cells of groups1.values()) {
    const fs = cells.map(([a, k]) => new Map([[a, new Map([[k, ONE]])]]));
    const cols = fs.map((f) => { const v = new Map(); H.forEach((X, h) => { for (const [c, y] of act1(g, X, f)) v.set(h * n * n + c, y); }); return v; });
    for (const x of eliminate(cols).kernel) { const f = new Map(); for (const [j, c] of x) { const [a, k] = cells[j]; const w = f.get(a) ?? new Map(); addTo(w, k, c); f.set(a, w); } B1.push(f); }
  }
  const N2 = C.P.length * n;
  for (const cells of groups2.values()) {
    const phis = cells.map(([i, j, k]) => { const p = new Map(); addTerm(p, n, i, j, k, ONE); return p; });
    const cols = phis.map((p) => { const v = new Map(); H.forEach((X, h) => { for (const [c, y] of act2(g, X, p, C)) v.set(h * N2 + c, y); }); return v; });
    for (const x of eliminate(cols).kernel) B2.push(sumCochains([...x].map(([j, c]) => [c, phis[j]])));
  }
  return { B1, B2 };
}

// Second cohomology. With H, on the invariant subcomplex; without, in full.
export function h2(g, H = null) {
  const C = coords(g.n);
  let B1, B2;
  if (H) ({ B1, B2 } = invariantBases(g, H));
  else { B1 = basis1(g.n); B2 = C.P.flatMap(([i, j]) => [...Array(g.n).keys()].map((k) => { const p = new Map(); addTerm(p, g.n, i, j, k, ONE); return p; })); }
  const dB2 = B2.map((p) => delta2(g, p, C));
  const E = eliminate(dB2), rd2 = rank(dB2);
  if (E.rank !== rd2) throw new Error("rank mismatch");
  const cocycles = E.kernel.map((x) => sumCochains([...x].map(([j, c]) => [c, B2[j]])));
  const cob = B1.map((f) => d1(g, f, C)), rd1 = rank(cob);
  return { dimC1: B1.length, dimC2: B2.length, rankD1: rd1, rankD2: rd2, dimZ2: cocycles.length, dimB2: rd1, dimH2: cocycles.length - rd1, cocycles, coboundaries: cob, C };
}

// Cocycles inside a template span: the template is a list of cochains; returns the cocycle basis in the span,
// and the number of independent classes they give modulo the coboundaries.
export function templateCocycles(g, template, coboundaries, C = coords(g.n)) {
  const E = eliminate(template.map((t) => delta2(g, t, C)));
  const cocycles = E.kernel.map((x) => sumCochains([...x].map(([j, c]) => [c, template[j]])));
  const rB = rank(coboundaries);
  const classes = rank([...coboundaries, ...cocycles.map((p) => vec2(g, p, C))]) - rB;
  return { cocycles, classes, combos: E.kernel };
}
export function classRank(g, cocycles, coboundaries, C = coords(g.n)) { return rank([...coboundaries, ...cocycles.map((p) => vec2(g, p, C))]) - rank(coboundaries); }

// Integrate mu + t phi order by order: at order m the Jacobi defect must be a coboundary d(psi_m) of a
// 2-cochain (searched in `space`, a list of cochains, by default all of C^2); add t^m psi_m and continue.
// Stops when the family satisfies Jacobi exactly at every order (it terminates as a polynomial), or when an
// obstruction is not a coboundary in the space, or after maxOrder.
export function integrate(g, phi, { space = null, maxOrder = 6 } = {}) {
  const C = coords(g.n);
  const sp = space ?? C.P.flatMap(([i, j]) => [...Array(g.n).keys()].map((k) => { const p = new Map(); addTerm(p, g.n, i, j, k, ONE); return p; }));
  const E = eliminate(sp.map((p) => delta2(g, p, C)));
  const phis = [g.br, phi];
  for (let m = 2; m <= maxOrder + 1; m++) {
    const J = jacobiCoefficients(g, phis, C);
    if (J.every((v) => !v.size)) return { exact: true, order: phis.length - 1, phis };
    if (m > maxOrder) break;
    // the defect at order m, with the next term unknown: J[m] + delta(psi_m) = 0
    const x = E.solve(scaled(J[m], ONE.neg()));
    if (!x) return { exact: false, obstructedAt: m, phis };
    phis.push(sumCochains([...x].map(([j, c]) => [c, sp[j]])));
  }
  return { exact: false, order: phis.length - 1, phis, unfinished: true };
}
// Evaluate a polynomial family at t: the structure constants of mu_t.
export function at_t(g, phis, t) { const T = Q.of(t); let p = ONE; return { ...g, br: sumCochains(phis.map((phi) => { const c = p; p = p.mul(T); return [c, phi]; })) }; }

// ---------- invariants of the deformed algebra ----------
export function jacobiHolds(g) { return jacobiCoefficients(g, [g.br]).every((v) => !v.size); }
export function adMatrix(g, x) { const n = g.n, M = Array.from({ length: n }, () => Array(n).fill(ZERO)); for (let a = 0; a < n; a++) for (const [k, f] of at(g.br, n, x, a)) M[k][a] = f; return M; }
export function killing(g) {
  const n = g.n, ad = [...Array(n).keys()].map((x) => adMatrix(g, x));
  const tr = (A, B) => { let s = ZERO; for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) if (!A[i][k].isZero() && !B[k][i].isZero()) s = s.add(A[i][k].mul(B[k][i])); return s; };
  return ad.map((A) => ad.map((B) => tr(A, B)));
}
// Signature of a rational symmetric matrix by congruence (Sylvester's law of inertia).
export function signature(M) {
  const A = M.map((r) => [...r]), n = A.length; let pos = 0, neg = 0, zero = 0;
  for (let k = 0; k < n; k++) {
    let p = -1; for (let i = k; i < n; i++) if (!A[i][i].isZero()) { p = i; break; }
    if (p < 0) { // all diagonal zero: find an off-diagonal entry and add row/col j to row/col i
      let found = null; for (let i = k; i < n && !found; i++) for (let j = i + 1; j < n; j++) if (!A[i][j].isZero()) { found = [i, j]; break; }
      if (!found) { zero += n - k; break; }
      const [i, j] = found;
      for (let r = 0; r < n; r++) A[i][r] = A[i][r].add(A[j][r]);
      for (let r = 0; r < n; r++) A[r][i] = A[r][i].add(A[r][j]);
      p = i;
    }
    [A[k], A[p]] = [A[p], A[k]]; for (const r of A) [r[k], r[p]] = [r[p], r[k]];
    const d = A[k][k]; (d.sign() > 0 ? pos++ : neg++);
    for (let r = k + 1; r < n; r++) {
      if (A[r][k].isZero()) continue;
      const f = A[r][k].div(d);
      for (let c = k; c < n; c++) A[r][c] = A[r][c].sub(f.mul(A[k][c]));
      for (let c = k; c < n; c++) A[c][r] = A[r][c];
    }
  }
  return { pos, neg, zero };
}
// Dimension of the commutant {T : T ad_x = ad_x T for all x}. One-dimensional with a nondegenerate Killing
// form means simple, with simple complexification (a sum of ideals would give a projection in the commutant).
export function commutantDim(g) {
  const n = g.n, ad = [...Array(n).keys()].map((x) => adMatrix(g, x)), cols = [];
  for (let p = 0; p < n; p++) for (let q = 0; q < n; q++) { // T = E_pq: (E_pq A - A E_pq)
    const v = new Map();
    ad.forEach((A, x) => { for (let c = 0; c < n; c++) addTo(v, x * n * n + p * n + c, A[q][c]); for (let r = 0; r < n; r++) addTo(v, x * n * n + r * n + q, A[r][p].neg()); });
    cols.push(v);
  }
  return n * n - rank(cols);
}
// Diagonal contraction weights: rational w with w_i + w_j - w_k = m for every term of phis[m]. Rescaling
// e_k -> s^(w_k) e_k then carries mu_1 to mu_s, and s -> 0 returns phis[0] (a generalized Inonu-Wigner
// contraction). Returns one solution (free weights set to 0), or null.
export function contractionWeights(g, phis) {
  const n = g.n, rows = [];
  phis.forEach((phi, m) => { for (const [key, v] of phi) { const i = Math.floor(key / n), j = key % n; if (i > j) continue; for (const k of v.keys()) rows.push([i, j, k, m]); } });
  // columns: the n weights and the constant; solve sum = m
  const vecs = rows.map(([i, j, k, m]) => { const v = new Map(); addTo(v, i, ONE); addTo(v, j, ONE); addTo(v, k, ONE.neg()); addTo(v, n, Q.of(-m)); return v; });
  // transpose: unknown vector (w, 1) must be orthogonal to every row. Kernel of the rows as linear forms.
  const colsT = []; for (let c = 0; c <= n; c++) { const v = new Map(); vecs.forEach((r, ri) => { if (r.has(c)) v.set(ri, r.get(c)); }); colsT.push(v); }
  const K = eliminate(colsT).kernel;
  const withConst = K.find((x) => x.has(n));
  if (!withConst) return null;
  const s = ONE.div(withConst.get(n)), w = Array(n).fill(ZERO);
  for (const [c, f] of withConst) if (c < n) w[c] = f.mul(s);
  for (const [i, j, k, m] of rows) if (!w[i].add(w[j]).sub(w[k]).sub(Q.of(m)).isZero()) throw new Error("weights failed verification");
  return w;
}

// ---------- reading cochains ----------
// A cochain as family-level rules: "[K,P] -> H (3 terms)". The family is the name without its trailing digits.
const fam = (s) => s.replace(/\d+$/, "");
export function describe(g, phi) {
  const n = g.n, rules = new Map();
  for (const [key, v] of phi) { const i = Math.floor(key / n), j = key % n; if (i > j) continue; for (const k of v.keys()) { const r = `[${fam(g.names[i])},${fam(g.names[j])}] -> ${fam(g.names[k])}`; rules.set(r, (rules.get(r) ?? 0) + 1); } }
  return [...rules].map(([r, c]) => `${r} (${c})`).join("; ") || "zero";
}
export function terms(g, phi) {
  const n = g.n, out = [];
  for (const [key, v] of phi) { const i = Math.floor(key / n), j = key % n; if (i > j) continue; for (const [k, f] of v) out.push(`[${g.names[i]},${g.names[j]}] ${f.sign() < 0 ? "-" : "+"}= ${f.sign() < 0 ? f.neg() : f} ${g.names[k]}`); }
  return out;
}
export function fromSpec(spec) { return algebra(spec.names, spec.brackets.flatMap(([a, b, rhs]) => Object.entries(rhs).map(([c, s]) => [a, b, c, s]))); }

// ---------- tests ----------
async function selftest() {
  const ok = [], fail = [];
  const t = (name, cond) => (cond ? ok : fail).push(name);
  const ab2 = algebra(["x", "y"], []);
  t("2-dim abelian: H^2 = 2", h2(ab2).dimH2 === 2);
  const so3 = algebra(["J1", "J2", "J3"], [["J1", "J2", "J3", 1], ["J2", "J3", "J1", 1], ["J3", "J1", "J2", 1]]);
  t("so(3): Jacobi holds", jacobiHolds(so3));
  t("so(3): H^2 = 0", h2(so3).dimH2 === 0);
  t("so(3): invariant H^2 = 0", h2(so3, [0, 1, 2]).dimH2 === 0);
  t("so(3): Killing signature (0,3), negative definite", (({ pos, neg }) => pos === 0 && neg === 3)(signature(killing(so3))));
  t("so(3): commutant of ad is one-dimensional", commutantDim(so3) === 1);
  const sl2 = algebra(["h", "e", "f"], [["h", "e", "e", 2], ["h", "f", "f", -2], ["e", "f", "h", 1]]);
  t("sl(2,R): Killing signature (2,1)", (({ pos, neg }) => pos === 2 && neg === 1)(signature(killing(sl2))));
  t("sl(2) + sl(2): commutant two-dimensional", commutantDim(algebra(["a", "b", "c", "x", "y", "z"], [["a", "b", "c", 1], ["b", "c", "a", 1], ["c", "a", "b", 1], ["x", "y", "z", 1], ["y", "z", "x", 1], ["z", "x", "y", 1]])) === 2);
  const heis = algebra(["p", "q", "z"], [["p", "q", "z", 1]]);
  t("Jacobi fails on [a,b]=a, [a,c]=b, [b,c]=a", !jacobiHolds(algebra(["a", "b", "c"], [["a", "b", "a", 1], ["a", "c", "b", 1], ["b", "c", "a", 1]])));
  t("ranks agree across Q and both primes", rank([new Map([[0, Q.of("1/3")], [1, ONE]]), new Map([[0, ONE], [1, Q.of(3)]])]) === 1);
  // A coboundary is a cocycle: delta(d1 f) = 0 for every basis f, on so(3) and on the Heisenberg algebra.
  for (const g of [so3, heis]) { const C = coords(g.n); t(`d^2 = 0 on ${g.names.join("")}`, basis1(g.n).every((f) => !delta2(g, unvec2(g, d1(g, f, C), C), C).size)); }
  // Integration: on the 2-dim abelian algebra, [x,y] = x integrates exactly at first order (to the affine algebra).
  const r = integrate(ab2, cochain(ab2, [["x", "y", "x", 1]]));
  t("abelian 2-dim: [x,y]=x integrates at first order", r.exact && r.order === 1);
  // Contraction: so(3) contracts to the Euclidean algebra e(2) with weights (0 for J3, 1 for J1, J2).
  const e2 = algebra(["J1", "J2", "J3"], [["J3", "J1", "J2", 1], ["J2", "J3", "J1", 1]]);
  const w = contractionWeights(e2, [e2.br, cochain(e2, [["J1", "J2", "J3", 1]])]);
  t("e(2) to so(3): contraction weights exist", !!w);
  // The calibration's anchors, cheap enough for the gate (generation/2026-10-11-deform-001/calibration.md).
  const { ALGEBRAS } = await import("./deform-algebras.mjs");
  const gal = ALGEBRAS.galilei(), rot = ["J1", "J2", "J3"].map((x) => gal.idx.get(x));
  t("Galilei: rotation-invariant H^2 = 4 = full H^2", h2(gal, rot).dimH2 === 4 && h2(gal).dimH2 === 4);
  const ds = ALGEBRAS.deSitter();
  t("de Sitter: H^2 = 0, Killing +4 -6, commutant 1", h2(ds).dimH2 === 0 && (({ pos, neg }) => pos === 4 && neg === 6)(signature(killing(ds))) && commutantDim(ds) === 1);
  for (const f of fail) console.log(`FAIL ${f}`);
  if (fail.length) { console.log(`deform selftest: ${fail.length} failure(s)`); process.exit(1); }
  console.log(`deform selftest: PASS (${ok.length} tests)`);
}

// The CLI runs after this module has finished evaluating, so deform-algebras.mjs can import it.
async function main() {
  const a = process.argv.slice(2), one = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
  if (a.includes("--selftest")) await selftest();
  else if (one("--round")) {
    const { ROUNDS } = await import("./deform-algebras.mjs");
    const run = ROUNDS[one("--round")];
    if (!run) { console.log(`deform: no round ${one("--round")}; rounds: ${Object.keys(ROUNDS).join(", ")}`); process.exit(1); }
    const out = run();
    if (one("--out")) { writeFileSync(one("--out"), out + "\n"); console.log(`wrote ${one("--out")}`); } else console.log(out);
  } else if (one("--algebra") || one("--spec")) {
    const { ALGEBRAS } = await import("./deform-algebras.mjs");
    const g = one("--spec") ? fromSpec(JSON.parse(readFileSync(one("--spec"), "utf8"))) : ALGEBRAS[one("--algebra")]?.();
    if (!g) { console.log(`deform: no algebra ${one("--algebra")}`); process.exit(1); }
    if (!jacobiHolds(g)) { console.log("deform: the brackets fail Jacobi"); process.exit(1); }
    console.log(`algebra: ${g.n} generators (${g.names.join(" ")})`);
    if (one("--invariant")) { const H = one("--invariant").split(",").map((x) => g.idx.get(x)); const r = h2(g, H); console.log(`invariant H^2 under ${one("--invariant")}: ${r.dimH2} (C^1 ${r.dimC1}, C^2 ${r.dimC2}, Z^2 ${r.dimZ2}, B^2 ${r.dimB2})`); }
    if (a.includes("--full") || !one("--invariant")) { const r = h2(g); console.log(`H^2: ${r.dimH2} (C^2 ${r.dimC2}, Z^2 ${r.dimZ2}, B^2 ${r.dimB2})`); }
    const s = signature(killing(g)); console.log(`Killing signature: +${s.pos} -${s.neg} 0x${s.zero}; commutant of ad: ${commutantDim(g)}`);
  } else { console.log("deform: --selftest | --algebra NAME [--invariant A,B] [--full] | --spec FILE | --round NAME [--out FILE]"); process.exit(1); }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((e) => { console.log(`deform: ${e.message}`); process.exit(1); });
