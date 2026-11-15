// Role: pilot 2 of the schema survey (candidates G09, G27, G60, G24, with G39 as a by-product). Holds
//   intertwinings as squares in the shape of Mathlib's Function.Semiconj: a transform t carries operation
//   `top` to operation `bottom`, t after top = bottom after t, on a stated domain. Each square is run on
//   seeded instances.
// Contract: `node p2-squares.mjs`. Prints each square with its receipt and the outcome on instances. A row
//   marked naive states the rule as it is commonly said, without its hypothesis; its check is expected to
//   find a counterexample, which is printed: a counterexample row made by computation. Exit 1 if a square
//   that should hold fails, a naive one finds no counterexample, or a quoted receipt does not verify.
// Invariant: read-only. Passing on instances shows the square on those instances; a failure is a
//   counterexample and is final.
import { entry, verify, rng } from "./lib.mjs";
import * as I from "./instances.mjs";

const R = rng(20261114), rnd = () => R() * 2 - 1, ri = (k) => Math.floor(R() * (2 * k + 1)) - k;
const cvec = (n) => Array.from({ length: n }, () => [rnd(), rnd()]);
const cconv = (x, y) => x.map((_, k) => x.reduce((s, xv, i) => { const p = I.cmul(xv, y[(k - i + x.length) % x.length]); return [s[0] + p[0], s[1] + p[1]]; }, [0, 0]));
const lconvTrunc = (x, y) => x.map((_, k) => x.reduce((s, xv, i) => (k - i >= 0 ? ((p) => [s[0] + p[0], s[1] + p[1]])(I.cmul(xv, y[k - i])) : s), [0, 0]));
const pw = (X, Y) => X.map((v, i) => I.cmul(v, Y[i]));
const trials = (n, f) => { for (let i = 0; i < n; i++) { const w = f(); if (w !== true) return w; } return true; };
const modpow = (b, e, m) => { let r = 1; b %= m; while (e) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; } return r; };
const ntt = (x, p, w) => x.map((_, k) => x.reduce((s, v, n) => (s + v * modpow(w, k * n, p)) % p, 0));
const quad = (f, T = 60, n = 240000) => { let s = 0; const h = T / n; for (let i = 0; i <= n; i++) s += (i === 0 || i === n ? 0.5 : 1) * f(i * h); return s * h; };
const lap = (f, s) => quad((t) => f(t) * Math.exp(-s * t));
const near = (a, b, t = 1e-5) => Math.abs(a - b) <= t * (1 + Math.abs(a));
const expm = (A) => { const n = A.length; let S = A.map((r, i) => r.map((_, j) => (i === j ? 1 : 0))), T = S; for (let k = 1; k < 40; k++) { T = I.matMul(T, A).map((r) => r.map((v) => v / k)); S = S.map((r, i) => r.map((v, j) => v + T[i][j])); } return S; };
const madd = (A, B) => A.map((r, i) => r.map((v, j) => v + B[i][j]));

// Each check returns true, or a string describing the instance on which the square fails.
const CHECKS = {
  "dft-circular-convolution": () => trials(5, () => { const x = cvec(8), y = cvec(8); return I.cclose(I.cdft(cconv(x, y)), pw(I.cdft(x), I.cdft(y))) || "random length-8 vectors"; }),
  "dft-linear-convolution": () => trials(5, () => { const x = cvec(8), y = cvec(8); return I.cclose(I.cdft(lconvTrunc(x, y)), pw(I.cdft(x), I.cdft(y))) || "x, y random of length 8: the DFT of their linear convolution, cut to length 8, differs from the product of their DFTs (the tail wraps around)"; }),
  "dft-zero-padded-convolution": () => trials(5, () => { const z = [0, 0]; const x = [...cvec(4), z, z, z, z], y = [...cvec(4), z, z, z, z]; return I.cclose(I.cdft(lconvTrunc(x, y)), pw(I.cdft(x), I.cdft(y))) || "padded vectors"; }),
  "dft-shift-modulation": () => trials(5, () => { const n = 8, m = 3, x = cvec(n); const shifted = x.map((_, k) => x[(k - m + n) % n]); const mod = I.cdft(x).map((v, k) => I.cmul(v, [Math.cos((-2 * Math.PI * k * m) / n), Math.sin((-2 * Math.PI * k * m) / n)])); return I.cclose(I.cdft(shifted), mod) || "shift"; }),
  "dft-reversal": () => trials(5, () => { const n = 8, x = cvec(n); const rev = (v) => v.map((_, k) => v[(n - k) % n]); return I.cclose(I.cdft(rev(x)), rev(I.cdft(x))) || "reversal"; }),
  "wht-dyadic-convolution": () => trials(5, () => { const n = 8, x = Array.from({ length: n }, () => ri(5)), y = Array.from({ length: n }, () => ri(5)); const c = x.map((_, k) => x.reduce((s, v, i) => s + v * y[k ^ i], 0)); const a = I.wht(c), b = I.wht(x).map((v, i) => v * I.wht(y)[i]); return a.every((v, i) => v === b[i]) || "dyadic"; }),
  "ntt-cyclic-convolution": () => trials(5, () => { const p = 17, n = 8, w = 2; const x = Array.from({ length: n }, () => Math.floor(R() * p)), y = Array.from({ length: n }, () => Math.floor(R() * p)); const c = x.map((_, k) => x.reduce((s, v, i) => (s + v * y[(k - i + n) % n]) % p, 0)); const a = ntt(c, p, w), X = ntt(x, p, w), Y = ntt(y, p, w); return a.every((v, i) => v === (X[i] * Y[i]) % p) || "ntt"; }),
  "z-convolution": () => trials(5, () => { const x = Array.from({ length: 5 }, () => ri(4)), y = Array.from({ length: 4 }, () => ri(4)); const z = 1.7; const Z = (s) => s.reduce((a, v, n) => a + v * z ** -n, 0); return near(Z(I.pMul(x, y).length ? [...I.pMul(x, y)] : [0]), Z(x) * Z(y), 1e-9) || "z"; }),
  "z-delay": () => trials(5, () => { const x = Array.from({ length: 5 }, () => ri(4)); const z = 1.7; const Z = (s) => s.reduce((a, v, n) => a + v * z ** -n, 0); return near(Z([0, ...x]), Z(x) / z, 1e-9) || "delay"; }),
  "log-product-sum": () => trials(20, () => { const a = R() * 9 + 0.1, b = R() * 9 + 0.1; return near(Math.log(a * b), Math.log(a) + Math.log(b), 1e-12) || "log"; }),
  "exp-sum-commuting": () => trials(5, () => { const A = I.randomInt(R, 3, 3, 2).map((r) => r.map((v) => v / 4)); const B = madd(I.matMul(A, A), A.map((r, i) => r.map((v, j) => 2 * v + (i === j ? 1 : 0)))); return I.matEq(expm(madd(A, B)), I.matMul(expm(A), expm(B)), 1e-7) || "commuting pair"; }),
  "exp-sum-any": () => { const A = [[0, 1], [0, 0]], B = [[0, 0], [1, 0]]; return I.matEq(expm(madd(A, B)), I.matMul(expm(A), expm(B)), 1e-7) || "A = [[0,1],[0,0]], B = [[0,0],[1,0]]: exp(A + B) has cosh 1 on the diagonal, exp(A) exp(B) has 2 and 1"; },
  "trace-cyclic": () => trials(5, () => { const A = I.randomInt(R, 3, 4), B = I.randomInt(R, 4, 3); const tr = (M) => M.reduce((s, r, i) => s + r[i], 0); return tr(I.matMul(A, B)) === tr(I.matMul(B, A)) || "trace"; }),
  "kron-mixed-product": () => trials(5, () => { const A = I.randomInt(R, 2, 3), B = I.randomInt(R, 2, 2), C = I.randomInt(R, 3, 2), D = I.randomInt(R, 2, 3); return I.matEq(I.matMul(I.kron(A, B), I.kron(C, D)), I.kron(I.matMul(A, C), I.matMul(B, D))) || "kron"; }),
  "eval-ring-hom": () => trials(10, () => { const p = I.randomPoly(R, 3), q = I.randomPoly(R, 2), x = ri(4); return (I.pEval(I.pMul(p, q), x) === I.pEval(p, x) * I.pEval(q, x) && I.pEval(I.pAdd(p, q), x) === I.pEval(p, x) + I.pEval(q, x)) || "eval"; }),
  "degree-product-domain": () => trials(10, () => { const p = I.randomPoly(R, 3), q = I.randomPoly(R, 2); return I.pDeg(I.pMul(p, q)) === I.pDeg(p) + I.pDeg(q) || "degree over the integers"; }),
  "degree-product-any-ring": () => { const p = [1, 2], q = [1, 3]; const d = I.pDeg(I.pMul(p, q, 6)); return d === I.pDeg(p) + I.pDeg(q) || `over Z/6: (2x + 1)(3x + 1) = 5x + 1, of degree ${d}, where the degrees add to 2`; },
  "lead-product-domain": () => trials(10, () => { const p = I.randomPoly(R, 3), q = I.randomPoly(R, 2); return I.pLead(I.pMul(p, q)) === I.pLead(p) * I.pLead(q) || "lead over the integers"; }),
  "lead-product-any-ring": () => { const p = [1, 2], q = [1, 3]; const l = I.pLead(I.pMul(p, q, 6)); return l === (I.pLead(p) * I.pLead(q)) % 6 || `over Z/6: (2x + 1)(3x + 1) = 5x + 1 has leading coefficient ${l}, where the leading coefficients multiply to 0`; },
  "derivative-sum": () => trials(10, () => { const p = I.randomPoly(R, 4), q = I.randomPoly(R, 3); return I.pEq(I.pDeriv(I.pAdd(p, q)), I.pAdd(I.pDeriv(p), I.pDeriv(q))) || "derivative of a sum"; }),
  "derivative-product": () => { const p = [0, 1], q = [0, 1]; return I.pEq(I.pDeriv(I.pMul(p, q)), I.pMul(I.pDeriv(p), I.pDeriv(q))) || "p = q = x: (x^2)' = 2x, and p' q' = 1 (the rule is Leibniz's, which is not a square)"; },
  "map-commutes-derivative": () => trials(10, () => { const p = I.randomPoly(R, 5, 9); return I.pEq(I.pDeriv(I.pMap(p, 5), 5), I.pMap(I.pDeriv(p), 5)) || "map and derivative"; }),
  "eval-of-composition": () => trials(10, () => { const p = I.randomPoly(R, 3), q = I.randomPoly(R, 2), x = ri(3); return I.pEval(I.pComp(p, q), x) === I.pEval(p, I.pEval(q, x)) || "composition"; }),
  "fenchel-infimal-convolution": () => trials(5, () => { const X = Array.from({ length: 9 }, (_, i) => i - 4), P = Array.from({ length: 13 }, (_, i) => i - 6); const f = X.map(() => Math.floor(R() * 20)), g = X.map(() => Math.floor(R() * 20)); const Zs = Array.from({ length: 17 }, (_, i) => i - 8); const inf = Zs.map((z) => Math.min(...X.flatMap((x, i) => X.map((y, j) => (x + y === z ? f[i] + g[j] : Infinity))))); const conj = (h, dom) => P.map((p) => Math.max(...dom.map((x, i) => p * x - h[i]))); const a = conj(inf, Zs), b = conj(f, X).map((v, i) => v + conj(g, X)[i]); return a.every((v, i) => v === b[i]) || "infimal convolution"; }),
  "laplace-derivative": () => { for (const [f, df, f0] of [[(t) => Math.exp(-t), (t) => -Math.exp(-t), 1], [(t) => t * Math.exp(-t), (t) => (1 - t) * Math.exp(-t), 0], [(t) => Math.cos(t) * Math.exp(-t / 2), (t) => (-Math.sin(t) - Math.cos(t) / 2) * Math.exp(-t / 2), 1]]) for (const s of [0.7, 1.5, 3]) if (!near(lap(df, s), s * lap(f, s) - f0, 1e-5)) return `s = ${s}`; return true; },
  "laplace-convolution": () => { const conv = (t) => Math.exp(-t) - Math.exp(-2 * t); for (const s of [0.5, 1, 2.5]) if (!near(lap(conv, s), lap((t) => Math.exp(-t), s) * lap((t) => Math.exp(-2 * t), s), 1e-5)) return `s = ${s}`; return true; },
  "dual-contraction-deletion": () => trials(8, () => { const G = I.randomGraph(R, 5, 7), m = 7, r = I.cycleMatroid(G); for (let e = 0; e < m; e++) if (!I.mEqual(I.mDual(I.mContract(r, m, e), m - 1), I.mDelete(I.mDual(r, m), m, e))) return "matroid"; return true; }),
  "order-dual-join-meet": () => { const div = [1, 2, 3, 4, 6, 12]; const lcm = (a, b) => div.find((d) => d % a === 0 && d % b === 0), gcd = (a, b) => [...div].reverse().find((d) => a % d === 0 && b % d === 0); const le = (a, b) => b % a === 0, ge = (a, b) => le(b, a); const supIn = (leq, a, b) => div.filter((d) => leq(a, d) && leq(b, d)).find((d, _, U) => U.every((u) => leq(d, u))); for (const a of div) for (const b of div) if (supIn(ge, a, b) !== gcd(a, b) || supIn(le, a, b) !== lcm(a, b)) return "lattice"; return true; },
};

const F = (e, f, q) => ({ field: [e, f], quote: q }), L = (e, d) => ({ formal: [e, d] }), X = (f, q) => ({ excerpt: f, quote: q }), C = { computed: true };
const N = (name) => ({ name }), E = (id) => ({ entry: id });
export const ROWS = [
  { id: "S01", t: "D6-032", top: N("circular convolution"), bottom: N("pointwise product"), on: "sequences of one length N, indices taken mod N", receipt: F("D6-032", "preserved", "convolution -> multiplication"), check: "dft-circular-convolution" },
  { id: "S02", t: "D6-032", top: N("linear convolution, cut to length N"), bottom: N("pointwise product"), on: "none stated", naive: true, receipt: C, check: "dft-linear-convolution", note: "the rule as usually said for the FFT; Formalization's route probe filed it as misfiled or imprecise" },
  { id: "S03", t: "D6-032", top: N("linear convolution"), bottom: N("pointwise product"), on: "sequences zero-padded so that the two supports add to at most N", receipt: C, check: "dft-zero-padded-convolution" },
  { id: "S04", t: "D6-032", top: N("cyclic shift by m"), bottom: N("multiplication by exp(-2 pi i k m / N)"), on: "all sequences", receipt: C, check: "dft-shift-modulation", note: "absent from the entry" },
  { id: "S05", t: "D6-032", top: N("index reversal"), bottom: N("index reversal"), on: "all sequences", receipt: C, check: "dft-reversal", note: "absent from the entry" },
  { id: "S06", t: "D6-148", top: N("dyadic (XOR) convolution"), bottom: N("pointwise product"), on: "sequences of length 2^n", receipt: C, check: "wht-dyadic-convolution", note: "absent from the entry" },
  { id: "S07", t: "D6-107", top: N("cyclic convolution mod p"), bottom: N("pointwise product mod p"), on: "length N dividing p - 1, with a primitive N-th root of unity", receipt: F("D6-107", "preserved", "Exact integer convolution"), check: "ntt-cyclic-convolution" },
  { id: "S08", t: "D8-234", top: N("convolution of sequences"), bottom: N("product of functions"), on: "the common region of convergence", receipt: F("D8-234", "preserved", "Convolution to product"), check: "z-convolution" },
  { id: "S09", t: "D8-234", top: N("delay by one step"), bottom: N("multiplication by 1/z"), on: "the region of convergence", receipt: C, check: "z-delay", note: "absent from the entry: the shift rule Formalization's route probe found missing" },
  { id: "S10", t: "D5-091", top: N("product"), bottom: N("sum"), on: "positive reals", receipt: C, check: "log-product-sum", note: "the entry files 'Additive structure' under broken, where this intertwining is the reason the transform is used" },
  { id: "S11", t: "D7-397", top: N("sum of matrices"), bottom: N("product of matrices"), on: "commuting matrices", receipt: C, check: "exp-sum-commuting", note: "absent from the entry" },
  { id: "S12", t: "D7-397", top: N("sum of matrices"), bottom: N("product of matrices"), on: "none stated", naive: true, receipt: C, check: "exp-sum-any" },
  { id: "S13", t: "D7-394", top: N("product A B"), bottom: N("product B A, same value"), on: "matrices of compatible shapes", receipt: F("D7-394", "preserved", "Cyclicity"), check: "trace-cyclic" },
  { id: "S14", t: "D2-103", top: N("matrix product, factorwise"), bottom: N("matrix product"), on: "matrices of compatible shapes", receipt: C, check: "kron-mixed-product", note: "the Kronecker product of matrices as the tensor product of maps; the entry states bilinearity only" },
  { id: "S15", t: "D7-X18", top: N("product and sum of polynomials"), bottom: N("product and sum in the ring"), on: "a commutative ring", receipt: L("D7-X18", "Polynomial.eval₂RingHom'"), check: "eval-ring-hom" },
  { id: "S16", t: "D7-X14", top: N("product of polynomials"), bottom: N("sum of degrees"), on: "a ring with no zero divisors, nonzero factors", receipt: F("D7-X14", "preserved", "deg(pq) = deg p + deg q when R has no zero divisors"), check: "degree-product-domain" },
  { id: "S17", t: "D7-X14", top: N("product of polynomials"), bottom: N("sum of degrees"), on: "none stated", naive: true, receipt: C, check: "degree-product-any-ring" },
  { id: "S18", t: "D7-X16", top: N("product of polynomials"), bottom: N("product in the ring"), on: "a ring with no zero divisors", receipt: F("D7-X16", "preserved", "Multiplicative when R has no zero divisors"), check: "lead-product-domain" },
  { id: "S19", t: "D7-X16", top: N("product of polynomials"), bottom: N("product in the ring"), on: "none stated", naive: true, receipt: C, check: "lead-product-any-ring" },
  { id: "S20", t: "D7-X19", top: N("sum of polynomials"), bottom: N("sum of polynomials"), on: "any semiring", receipt: F("D7-X19", "preserved", "R-linearity"), check: "derivative-sum" },
  { id: "S21", t: "D7-X19", top: N("product of polynomials"), bottom: N("product of polynomials"), on: "none stated", naive: true, receipt: C, check: "derivative-product", note: "the true rule, Leibniz's, takes two inputs to a sum of two products: outside the square shape" },
  { id: "S22", t: "D7-X17", top: E("D7-X19"), bottom: E("D7-X19"), on: "any ring homomorphism", receipt: F("D7-X17", "preserved", "it commutes with the derivative"), check: "map-commutes-derivative", note: "top and bottom are both entries: a commutes-with row (G24)" },
  { id: "S23", t: "D7-X18", top: E("D7-X21"), bottom: N("composition of functions"), on: "a commutative semiring", receipt: F("D7-X21", "preserved", "eval x (p ∘ q) = eval (eval x q) p over a commutative semiring"), check: "eval-of-composition" },
  { id: "S24", t: "D5-088", top: N("infimal convolution"), bottom: N("sum"), on: "functions on a common grid", receipt: C, check: "fenchel-infimal-convolution", note: "absent from the entry" },
  { id: "S25", t: "D6-086", top: N("derivative"), bottom: N("multiplication by s, minus the initial value"), on: "f differentiable on t > 0, right-continuous at 0, e^{-st} f(t) tending to 0", receipt: X("docs/inbound/2026-11-06-from-formalization.md", "`laplace_deriv` | exact, for the rule"), check: "laplace-derivative", note: "absent from the entry; proved in Formalization, checked here by quadrature on three functions" },
  { id: "S26", t: "D6-086", top: N("one-sided convolution"), bottom: N("product"), on: "absolute convergence of both transforms", receipt: F("D6-086", "preserved", "convolution->multiplication"), check: "laplace-convolution" },
  { id: "S27", t: "D6-100", top: N("multiplicative convolution"), bottom: N("product"), on: "unknown: the entry gives no domain", receipt: F("D6-100", "preserved", "Multiplicative convolution -> multiplication") },
  { id: "S28", t: "D6-022", top: N("convolution"), bottom: N("product"), on: "unknown: the entry gives no domain", receipt: F("D6-022", "preserved", "convolution -> multiplication") },
  { id: "S29", t: "D1-059", top: E("D1-058"), bottom: E("D1-057"), on: "finite matroids", receipt: L("D1-058", "Matroid.dual_contract"), check: "dual-contraction-deletion", note: "all three sides are entries" },
  { id: "S30", t: "D7-177", top: N("join"), bottom: N("meet"), on: "lattices", receipt: F("D7-177", "description", "Joins become meets"), check: "order-dual-join-meet" },
];

if (import.meta.url === `file://${process.argv[1]}`) {
  let bad = 0; const kinds = {}; const cex = []; let ran = 0, quoted = 0, quotedAndRun = 0, bound = 0, sides = 0;
  for (const r of ROWS) {
    const v = r.receipt === C ? { ok: true, kind: "computed" } : verify(r.receipt);
    const out = r.check ? CHECKS[r.check]() : null; if (r.check) ran++;
    kinds[v.kind] ??= { rows: 0, ok: 0 }; kinds[v.kind].rows++; if (v.ok) kinds[v.kind].ok++; else { bad++; console.log(`  UNVERIFIED ${r.id} ${v.why}`); }
    if (v.kind !== "computed") { quoted++; if (r.check) quotedAndRun++; }
    for (const s of [r.top, r.bottom]) { sides++; if (s.entry) bound++; }
    const side = (s) => (s.entry ? `${s.entry} ${entry(s.entry).name}` : s.name);
    let verdict;
    if (out === null) verdict = "not run (no instance written)";
    else if (r.naive) { verdict = out === true ? "NO COUNTEREXAMPLE FOUND" : `fails, as it should: ${out}`; if (out === true) bad++; else cex.push({ row: r.id, entry: r.t, witness: out }); }
    else { verdict = out === true ? "holds on instances" : `FAILS: ${out}`; if (out !== true) bad++; }
    console.log(`${r.id} ${r.t} ${entry(r.t).name}: ${side(r.top)} -> ${side(r.bottom)}; on ${r.on} [${v.kind}] ${verdict}`);
  }
  const ents = new Set(ROWS.flatMap((r) => [r.t, r.top.entry, r.bottom.entry]).filter(Boolean));
  console.log(`p2: ${ROWS.length} squares on ${ents.size} entries; receipts ` + Object.entries(kinds).map(([k, v]) => `${k} ${v.ok}/${v.rows}`).join(", ") + `; ${ran} run on instances, ${ROWS.length - ran} not runnable; of ${quoted} quoted rows ${quotedAndRun} are also run`);
  console.log(`p2: ${cex.length} counterexamples made by computation, each for a rule stated without its hypothesis: ` + cex.map((c) => c.row).join(", "));
  console.log(`p2: ${bound} of ${sides} top and bottom operations are entries of the map; the rest are operations the map has no entry for`);
  process.exit(bad ? 1 : 0);
}
