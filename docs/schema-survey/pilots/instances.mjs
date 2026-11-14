// Role: small exact instances for the schema-survey pilots: graphs, matroids as rank functions, integer
//   matrices with rank over the rationals and over GF(2), polynomials, and a few numeric transforms.
// Contract: pure functions, no I/O. A graph is { n, edges: [[u, v], ...] } (parallel edges and loops allowed).
//   A matroid on m elements is an Int8Array r of length 2^m: r[mask] is the rank of that subset. Matrices are
//   arrays of rows of integers.
// Invariant: exact where it says exact (BigInt elimination, integer polynomials); numeric routines say so.
export const popcount = (x) => { let c = 0; while (x) { x &= x - 1; c++; } return c; };
export const bits = (mask) => { const o = []; for (let i = 0; mask >> i; i++) if ((mask >> i) & 1) o.push(i); return o; };

// --- graphs
export const randomGraph = (R, n, m, loops = false) => ({ n, edges: Array.from({ length: m }, () => { let u = Math.floor(R() * n), v = Math.floor(R() * n); while (!loops && v === u) v = Math.floor(R() * n); return [u, v]; }) });
export function graphRank(G, idx) { const p = Array.from({ length: G.n }, (_, i) => i); const f = (x) => (p[x] === x ? x : (p[x] = f(p[x]))); let r = 0; for (const i of idx) { const a = f(G.edges[i][0]), b = f(G.edges[i][1]); if (a !== b) { p[a] = b; r++; } } return r; }
export const cycleMatroid = (G) => { const m = G.edges.length, r = new Int8Array(1 << m); for (let s = 0; s < 1 << m; s++) r[s] = graphRank(G, bits(s)); return r; };
export const deleteEdge = (G, e) => ({ n: G.n, edges: G.edges.filter((_, i) => i !== e) });
// Contracting edge e = (u, v) merges v into u and removes e; other edges between u and v become loops.
export const contractEdge = (G, e) => { const [u, v] = G.edges[e]; const f = (x) => (x === v ? u : x); return { n: G.n, edges: G.edges.filter((_, i) => i !== e).map(([a, b]) => [f(a), f(b)]) }; };
export const inducedEdges = (G, S) => G.edges.map((e, i) => (S.has(e[0]) && S.has(e[1]) ? i : -1)).filter((i) => i >= 0);
export const incidence = (G, oriented) => Array.from({ length: G.n }, (_, v) => G.edges.map(([a, b]) => (a === b ? 0 : v === a ? 1 : v === b ? (oriented ? -1 : 1) : 0)));

// --- matroids as rank functions
const drop = (mask, e) => (mask & ((1 << e) - 1)) | ((mask >> (e + 1)) << e);       // remove bit position e
const lift = (mask, e) => (mask & ((1 << e) - 1)) | ((mask >> e) << (e + 1));         // insert a 0 at position e
export const mDelete = (r, m, e) => { const o = new Int8Array(1 << (m - 1)); for (let s = 0; s < o.length; s++) o[s] = r[lift(s, e)]; return o; };
export const mContract = (r, m, e) => { const o = new Int8Array(1 << (m - 1)); for (let s = 0; s < o.length; s++) o[s] = r[lift(s, e) | (1 << e)] - r[1 << e]; return o; };
export const mDual = (r, m) => { const full = (1 << m) - 1, o = new Int8Array(1 << m); for (let s = 0; s <= full; s++) o[s] = popcount(s) + r[full & ~s] - r[full]; return o; };
export const mRestrict = (r, m, keep) => { const o = new Int8Array(1 << keep.length); for (let s = 0; s < o.length; s++) { let big = 0; bits(s).forEach((i) => (big |= 1 << keep[i])); o[s] = r[big]; } return o; };
export const mPermute = (r, m, perm) => { const o = new Int8Array(1 << m); for (let s = 0; s < 1 << m; s++) { let t = 0; bits(s).forEach((i) => (t |= 1 << perm[i])); o[t] = r[s]; } return o; };
export const mEqual = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
export { drop };

// --- integer matrices
export function rankQ(A) { // fraction-free elimination over BigInt: exact rank over the rationals
  const M = A.map((r) => r.map(BigInt)); let rank = 0; const rows = M.length, cols = rows ? M[0].length : 0;
  for (let c = 0; c < cols && rank < rows; c++) { let p = rank; while (p < rows && M[p][c] === 0n) p++; if (p === rows) continue; [M[rank], M[p]] = [M[p], M[rank]];
    for (let i = rank + 1; i < rows; i++) if (M[i][c] !== 0n) { const a = M[rank][c], b = M[i][c]; for (let j = c; j < cols; j++) M[i][j] = M[i][j] * a - M[rank][j] * b; } rank++; }
  return rank;
}
export function rankF2(A) { const M = A.map((r) => r.map((x) => ((x % 2) + 2) % 2)); let rank = 0; const rows = M.length, cols = rows ? M[0].length : 0;
  for (let c = 0; c < cols && rank < rows; c++) { let p = rank; while (p < rows && !M[p][c]) p++; if (p === rows) continue; [M[rank], M[p]] = [M[p], M[rank]];
    for (let i = 0; i < rows; i++) if (i !== rank && M[i][c]) for (let j = c; j < cols; j++) M[i][j] ^= M[rank][j]; rank++; }
  return rank;
}
export const columnMatroid = (A, rank) => { const m = A.length ? A[0].length : 0, r = new Int8Array(1 << m); for (let s = 0; s < 1 << m; s++) { const c = bits(s); r[s] = c.length ? rank(A.map((row) => c.map((j) => row[j]))) : 0; } return r; };
export const matMul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
export const kron = (A, B) => A.flatMap((ra) => B.map((rb) => ra.flatMap((a) => rb.map((b) => a * b))));
export const transpose = (A) => A[0].map((_, j) => A.map((r) => r[j]));
export const randomInt = (R, n, m, k = 4) => Array.from({ length: n }, () => Array.from({ length: m }, () => Math.floor(R() * (2 * k + 1)) - k));
export const matEq = (A, B, tol = 0) => A.length === B.length && A.every((r, i) => r.length === B[i].length && r.every((v, j) => Math.abs(v - B[i][j]) <= tol * (1 + Math.abs(v))));

// --- numeric linear algebra (floating point)
export function solve(A, b) { const n = A.length, M = A.map((r, i) => [...r, b[i]]); for (let c = 0; c < n; c++) { let p = c; for (let i = c + 1; i < n; i++) if (Math.abs(M[i][c]) > Math.abs(M[p][c])) p = i; [M[c], M[p]] = [M[p], M[c]]; for (let i = 0; i < n; i++) if (i !== c) { const f = M[i][c] / M[c][c]; for (let j = c; j <= n; j++) M[i][j] -= f * M[c][j]; } } return M.map((r, i) => r[n] / r[i]); }
export const laplacian = (n, wedges) => { const L = Array.from({ length: n }, () => Array(n).fill(0)); for (const [u, v, w] of wedges) { L[u][u] += w; L[v][v] += w; L[u][v] -= w; L[v][u] -= w; } return L; };
// Effective resistance between a and b: ground the last node, solve L x = e_a - e_b.
export function effRes(L, a, b) { const n = L.length, g = n - 1; const idx = [...Array(n).keys()].filter((i) => i !== g); const A = idx.map((i) => idx.map((j) => L[i][j])); const rhs = idx.map((i) => (i === a ? 1 : 0) - (i === b ? 1 : 0)); const x = solve(A, rhs); const val = (i) => (i === g ? 0 : x[idx.indexOf(i)]); return val(a) - val(b); }
export function schur(L, keep, elim) { const B = elim.map((i) => elim.map((j) => L[i][j])); return keep.map((i) => keep.map((j) => { const col = solve(B, elim.map((k) => L[k][j])); return L[i][j] - elim.reduce((s, k, t) => s + L[i][k] * col[t], 0); })); }

// --- integer polynomials as coefficient arrays, low degree first; optional modulus
const trim = (p) => { const q = [...p]; while (q.length && q[q.length - 1] === 0) q.pop(); return q; };
const red = (x, mod) => (mod ? ((x % mod) + mod) % mod : x);
export const pAdd = (p, q, mod) => trim(Array.from({ length: Math.max(p.length, q.length) }, (_, i) => red((p[i] ?? 0) + (q[i] ?? 0), mod)));
export const pMul = (p, q, mod) => { if (!p.length || !q.length) return []; const o = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => (o[i + j] = red(o[i + j] + a * b, mod)))); return trim(o); };
export const pDeg = (p) => trim(p).length - 1;                     // -1 for the zero polynomial
export const pLead = (p) => { const t = trim(p); return t.length ? t[t.length - 1] : 0; };
export const pEval = (p, x, mod) => p.reduceRight((s, c) => red(s * x + c, mod), 0);
export const pDeriv = (p, mod) => trim(p.slice(1).map((c, i) => red(c * (i + 1), mod)));
export const pComp = (p, q, mod) => p.reduceRight((s, c) => pAdd(pMul(s, q, mod), [red(c, mod)], mod), []);
export const pMap = (p, mod) => trim(p.map((c) => red(c, mod)));
export const pEq = (p, q) => { const a = trim(p), b = trim(q); return a.length === b.length && a.every((v, i) => v === b[i]); };
export const randomPoly = (R, deg, k = 5, mod) => { const p = Array.from({ length: deg + 1 }, () => red(Math.floor(R() * (2 * k + 1)) - k, mod)); if (p[deg] === 0) p[deg] = 1; return p; };

// --- transforms on finite sequences
export const cdft = (x, s = -1) => x.map((_, k) => x.reduce(([ar, ai], [xr, xi], n) => { const w = (s * 2 * Math.PI * k * n) / x.length, c = Math.cos(w), d = Math.sin(w); return [ar + xr * c - xi * d, ai + xr * d + xi * c]; }, [0, 0]));
export const cmul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
export const cclose = (a, b, t = 1e-8) => a.length === b.length && a.every((v, i) => Math.abs(v[0] - b[i][0]) + Math.abs(v[1] - b[i][1]) <= t * (1 + Math.abs(v[0]) + Math.abs(v[1])));
export const wht = (x) => { const v = [...x]; for (let h = 1; h < v.length; h *= 2) for (let i = 0; i < v.length; i += 2 * h) for (let j = i; j < i + h; j++) { const a = v[j], b = v[j + h]; v[j] = a + b; v[j + h] = a - b; } return v; };
