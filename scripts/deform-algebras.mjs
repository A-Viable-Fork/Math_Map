// Role: the algebras and rounds of the deformation generator (scripts/deform.mjs). Builds Lie algebras from
//   index rules (three-dimensional rotation vectors with epsilon and delta; four-dimensional Lorentz tensors
//   with the Minkowski metric), names the kinematical algebras of the calibration round and the
//   Poincare-Heisenberg seed, and runs both rounds of generation/2026-10-11-deform-001.
// Contract: exports kin(terms), lor(terms), ALGEBRAS {name: () => algebra}, ROUNDS {calibration, seed}, each
//   returning a markdown report. Rule forms: ["eps", A, B, C, s] for [A_i, B_j] = s eps_ijk C_k; ["delta", A,
//   B, S, s] for [A_i, B_j] = s delta_ij S; ["vs", S, A, B, s] for [S, A_i] = s B_i; ["eta", V, W, S, s] for
//   [V_m, W_n] = s eta_mn S; ["mvv", V, W, s] for [V_m, W_n] = s M_mn; ["sv", S, V, W, s] for [S, V_m] = s W_m.
//   Conventions: [J_i, J_j] = eps_ijk J_k; [M_mn, V_r] = eta_nr V_m - eta_mr V_n; eta = diag(1, -1, -1, -1).
// Invariant: every algebra is checked against Jacobi, exactly, when it is built; a rule set that fails is an
//   error, never a silent algebra. The rounds use only the engine's exact routines.
import { algebra, cochain, h2, templateCocycles, classRank, integrate, at_t, jacobiHolds, killing, signature,
  commutantDim, contractionWeights, describe, sumCochains, invariantBases, coords, d1, adMatrix, Q } from "./deform.mjs";

const EPS = [[0, 1, 2, 1], [1, 2, 0, 1], [2, 0, 1, 1], [1, 0, 2, -1], [2, 1, 0, -1], [0, 2, 1, -1]];
const ETA = [1, -1, -1, -1];
const check = (g, what) => { if (!jacobiHolds(g)) throw new Error(`${what}: brackets fail Jacobi`); return g; };

// ---------- rotation vectors (three dimensions) ----------
const KIN_NAMES = ["J1", "J2", "J3", "K1", "K2", "K3", "P1", "P2", "P3", "H"];
function kinTerms(rules) {
  const out = [];
  for (const r of rules) {
    const [type, A, B, C, s] = r;
    if (type === "eps") for (const [i, j, k, e] of EPS) { if (A === B && i > j) continue; out.push([`${A}${i + 1}`, `${B}${j + 1}`, `${C}${k + 1}`, Q.of(s).mul(Q.of(e))]); }
    else if (type === "delta") for (let i = 1; i <= 3; i++) out.push([`${A}${i}`, `${B}${i}`, C, s]);
    else if (type === "vs") for (let i = 1; i <= 3; i++) out.push([A, `${B}${i}`, `${C}${i}`, s]);
    else throw new Error(`unknown rule ${type}`);
  }
  return out;
}
const ROT = [["eps", "J", "J", "J", 1], ["eps", "J", "K", "K", 1], ["eps", "J", "P", "P", 1]];
export const kin = (rules, what = "kinematical algebra") => check(algebra(KIN_NAMES, kinTerms([...ROT, ...rules])), what);
export const kinCochain = (g, rules) => cochain(g, kinTerms(rules));

// ---------- Lorentz tensors (four dimensions) ----------
const MN = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
const mName = (m, n) => (m < n ? [`M${m}${n}`, 1] : m > n ? [`M${n}${m}`, -1] : null);
function lorTerms(rules, vectors) {
  const out = [];
  for (const r of rules) {
    const [type] = r;
    if (type === "lorentz") {
      // [M_mn, M_rs] = eta_nr M_ms - eta_mr M_ns - eta_ns M_mr + eta_ms M_nr
      MN.forEach(([m, n], x) => MN.forEach(([p, q], y) => {
        if (y <= x) return;
        const rhs = [[n === p ? ETA[n] : 0, m, q], [m === p ? -ETA[m] : 0, n, q], [n === q ? -ETA[n] : 0, m, p], [m === q ? ETA[m] : 0, n, p]];
        for (const [c, a, b] of rhs) { if (!c) continue; const nm = mName(a, b); if (nm) out.push([`M${m}${n}`, `M${p}${q}`, nm[0], c * nm[1]]); }
      }));
      for (const V of vectors) MN.forEach(([m, n]) => { for (let p = 0; p < 4; p++) { if (n === p) out.push([`M${m}${n}`, `${V}${p}`, `${V}${m}`, ETA[n]]); if (m === p) out.push([`M${m}${n}`, `${V}${p}`, `${V}${n}`, -ETA[m]]); } });
    } else if (type === "eta") { const [, V, W, S, s] = r; for (let m = 0; m < 4; m++) out.push([`${V}${m}`, `${W}${m}`, S, Q.of(s).mul(Q.of(ETA[m]))]); }
    else if (type === "mvv") { const [, V, W, s] = r; for (let m = 0; m < 4; m++) for (let n = 0; n < 4; n++) { if (m === n || (V === W && m > n)) continue; const nm = mName(m, n); out.push([`${V}${m}`, `${W}${n}`, nm[0], Q.of(s).mul(Q.of(nm[1]))]); } }
    else if (type === "sv") { const [, S, V, W, s] = r; for (let m = 0; m < 4; m++) out.push([S, `${V}${m}`, `${W}${m}`, s]); }
    else throw new Error(`unknown rule ${type}`);
  }
  return out;
}
const PH_NAMES = [...MN.map(([m, n]) => `M${m}${n}`), "P0", "P1", "P2", "P3", "X0", "X1", "X2", "X3", "I"];
export const lor = (rules, what = "Lorentz algebra") => check(algebra(PH_NAMES, lorTerms([["lorentz"], ...rules], ["P", "X"])), what);
export const lorCochain = (g, rules) => cochain(g, lorTerms(rules, []));

// ---------- named algebras ----------
// Kinematical algebras in the conventions above. The signs of Poincare, Newton-Hooke, de Sitter and anti-de
// Sitter are fixed by Jacobi ([K_i, K_j] carries the sign of [K_i, P_j], and [P_i, P_j] that of [H, P_i]) and
// named by the Killing signature of the semisimple ones: so(4,1) is +4 -6, so(3,2) is +6 -4, so(4) is 0 -6.
const GAL = [["vs", "H", "K", "P", 1]];
const REL = [["delta", "K", "P", "H", -1], ["eps", "K", "K", "J", -1]];
export const ALGEBRAS = {
  static: () => kin([], "static"),
  galilei: () => kin(GAL, "Galilei"),
  poincare: () => kin([...GAL, ...REL], "Poincare"),
  euclidean: () => kin([...GAL, ["delta", "K", "P", "H", 1], ["eps", "K", "K", "J", 1]], "Euclidean"),
  newtonHookeDS: () => kin([...GAL, ["vs", "H", "P", "K", 1]], "Newton-Hooke (expanding)"),
  newtonHookeAdS: () => kin([...GAL, ["vs", "H", "P", "K", -1]], "Newton-Hooke (oscillating)"),
  deSitter: () => kin([...GAL, ...REL, ["vs", "H", "P", "K", 1], ["eps", "P", "P", "J", 1]], "de Sitter"),
  antiDeSitter: () => kin([...GAL, ...REL, ["vs", "H", "P", "K", -1], ["eps", "P", "P", "J", -1]], "anti-de Sitter"),
  poincareHeisenberg: () => lor([["eta", "P", "X", "I", 1]], "Poincare semidirect Heisenberg"),
};

// ---------- rounds ----------
const ROTS = (g) => ["J1", "J2", "J3"].map((x) => g.idx.get(x));
const LORS = (g) => MN.map(([m, n]) => g.idx.get(`M${m}${n}`));
const sig = (g) => { const s = signature(killing(g)); return `+${s.pos} -${s.neg}${s.zero ? ` 0x${s.zero}` : ""}`; };
const w2s = (g, w) => (w ? g.names.map((x, i) => `${x} ${w[i]}`).filter((_, i, a) => a.findIndex((y) => y.split(" ")[0].replace(/\d+$/, "") === a[i].split(" ")[0].replace(/\d+$/, "")) === i).map((s) => s.replace(/(\D+)\d+ /, "$1 ")).join(", ") : "none found");
const table = (head, rows) => [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");

export const ROUNDS = {
  calibration() {
    const L = ["# Calibration: the kinematical algebras", "", "Generated by `node scripts/deform.mjs --round calibration`. Exact arithmetic; every rank checked over Q and modulo 2^61-1 and 2^89-1. Invariant means invariant under the rotations J1, J2, J3.", ""];
    const names = ["static", "galilei", "poincare", "euclidean", "newtonHookeDS", "newtonHookeAdS", "deSitter", "antiDeSitter"];
    const rows = names.map((nm) => { const g = ALGEBRAS[nm](), r = { inv: h2(g, ROTS(g)), full: h2(g) }; return [nm, r.inv.dimH2, r.full.dimH2, `${r.inv.dimC2} / ${r.inv.dimZ2} / ${r.inv.dimB2}`, sig(g), commutantDim(g)]; });
    L.push("## Second cohomology", "", table(["algebra", "invariant H^2", "full H^2", "invariant C^2 / Z^2 / B^2", "Killing", "commutant"], rows), "");

    // The four Galilei directions, each as a template; each solved for its cocycles, counted as classes,
    // integrated, and contracted back.
    const g = ALGEBRAS.galilei(), C = coords(g.n), H = ROTS(g);
    const { B1 } = invariantBases(g, H), cob = B1.map((f) => d1(g, f, C));
    const DIRS = [
      ["relativistic: [K,P] -> H with [K,K] -> J", [["delta", "K", "P", "H", 1], ["eps", "K", "K", "J", 1]]],
      ["Newton-Hooke: [H,P] -> K", [["vs", "H", "P", "K", 1]]],
      ["H as scaling: [H,K] -> K", [["vs", "H", "K", "K", 1]]],
      ["boosts closing on translations: [K,K] -> P", [["eps", "K", "K", "P", 1]]],
    ];
    L.push("## The four Galilei directions", "", "Each direction is a template span of rotation-invariant terms; the cocycles inside it are solved exactly, then counted modulo coboundaries. A direction integrates exactly at first order when the t^2 Jacobi coefficient of mu + t phi vanishes too.", "");
    const reps = [], drow = [];
    for (const [label, rules] of DIRS) {
      const T = templateCocycles(g, rules.map((r) => kinCochain(g, [r])), cob, C);
      const phi = T.cocycles[0];
      const I = phi ? integrate(g, phi, { space: invariantBases(g, H).B2 }) : null;
      if (phi) reps.push(phi);
      drow.push([label, T.cocycles.length, T.classes, phi ? describe(g, phi) : "none", I ? (I.exact ? `exact at order ${I.order}` : `obstructed at ${I.obstructedAt}`) : "", I?.exact ? `${sig(at_t(g, I.phis, 1))}; ${sig(at_t(g, I.phis, -1))}` : "", I?.exact ? w2s(g, contractionWeights(g, I.phis)) : ""]);
    }
    L.push(table(["direction", "cocycles in span", "classes", "cocycle", "integration", "Killing at t = 1; t = -1", "contraction weights"], drow), "");
    L.push(`Joint rank of the four directions modulo coboundaries: ${classRank(g, reps, cob, C)} (invariant H^2 of Galilei: ${h2(g, H).dimH2}).`, "");

    // Galilei to de Sitter: the relativistic and Newton-Hooke directions together.
    const rel = templateCocycles(g, DIRS[0][1].map((r) => kinCochain(g, [r])), cob, C).cocycles[0];
    const nh = templateCocycles(g, DIRS[1][1].map((r) => kinCochain(g, [r])), cob, C).cocycles[0];
    L.push("## Galilei to de Sitter", "");
    for (const [label, a, b] of [["relativistic + Newton-Hooke", 1, 1], ["relativistic - Newton-Hooke", 1, -1], ["- relativistic + Newton-Hooke", -1, 1], ["- relativistic - Newton-Hooke", -1, -1]]) {
      const phi = sumCochains([[a, rel], [b, nh]]);
      const I = integrate(g, phi, { space: invariantBases(g, H).B2 });
      const gt = I.exact ? at_t(g, I.phis, 1) : null;
      L.push(`- ${label}: first-order family exact: ${I.phis.length === 2 && I.exact ? "yes" : "no"}; integrated: ${I.exact ? `exact at order ${I.order}` : "obstructed"}; second-order term: ${I.phis[2] ? describe(g, I.phis[2]) : "none"}; Killing at t=1: ${gt ? sig(gt) : "n/a"}; contraction weights: ${I.exact ? w2s(g, contractionWeights(g, I.phis)) : "n/a"}.`);
    }
    return L.join("\n");
  },

  seed() {
    const g = ALGEBRAS.poincareHeisenberg(), C = coords(g.n), H = LORS(g);
    const L = ["# Seed: Poincare semidirect Heisenberg", "", "Generated by `node scripts/deform.mjs --round seed`. Generators M_mn (Lorentz), P_m, X_m (two Lorentz vectors), I central, [P_m, X_n] = eta_mn I, eta = diag(1,-1,-1,-1). Invariant means invariant under the six Lorentz generators. Exact arithmetic; every rank checked over Q and modulo 2^61-1 and 2^89-1.", ""];
    const inv = h2(g, H), full = h2(g);
    L.push("## Second cohomology", "", `Lorentz-invariant H^2: ${inv.dimH2} (invariant C^1 ${inv.dimC1}, C^2 ${inv.dimC2}, Z^2 ${inv.dimZ2}, B^2 ${inv.dimB2}). Full H^2: ${full.dimH2} (C^2 ${full.dimC2}, Z^2 ${full.dimZ2}, B^2 ${full.dimB2}). The seed's Killing signature: ${sig(g)}; commutant of ad: ${commutantDim(g)}.`, "");
    const B2 = invariantBases(g, H).B2;
    const DIRS = [
      ["(a) [P,P] -> M with [P,I] -> X", [["mvv", "P", "P", 1], ["sv", "I", "P", "X", 1]]],
      ["(b) [X,X] -> M with [X,I] -> P", [["mvv", "X", "X", 1], ["sv", "I", "X", "P", 1]]],
      ["(c) [P,X] -> M with I scaling P and X oppositely", [["mvv", "P", "X", 1], ["sv", "I", "P", "P", 1], ["sv", "I", "X", "X", 1]]],
    ];
    const reps = [], drow = [], frow = [];
    for (const [label, rules] of DIRS) {
      const T = templateCocycles(g, rules.map((r) => lorCochain(g, [r])), inv.coboundaries, C);
      const phi = T.cocycles[0];
      reps.push(phi);
      const I = integrate(g, phi, { space: B2 });
      drow.push([label, T.cocycles.length, T.classes, describe(g, phi), I.exact ? `exact at order ${I.order}` : `obstructed at ${I.obstructedAt}`, I.exact ? w2s(g, contractionWeights(g, I.phis)) : ""]);
      for (const t of [1, -1]) { const gt = at_t(g, I.phis, t), s = signature(killing(gt)); frow.push([label.slice(0, 3), t, sig(gt), s.zero ? "" : commutantDim(gt), s.zero ? "" : h2(gt).dimH2]); }
    }
    L.push("## The three directions", "", "Each direction is a template span; its cocycles are solved exactly and counted modulo coboundaries. Integration adds t^m psi_m whenever the Jacobi defect at order m is a coboundary, searching the Lorentz-invariant 2-cochains; exact at order 1 means mu + t phi is a Lie algebra for every t.", "", table(["direction", "cocycles in span", "classes", "cocycle", "integration", "contraction weights"], drow), "");
    L.push(`Joint rank of the three directions modulo invariant coboundaries: ${classRank(g, reps, inv.coboundaries, C)}; modulo all coboundaries: ${classRank(g, reps, full.coboundaries, C)}.`, "");
    L.push("Each direction at t = 1 and t = -1 (commutant and full H^2 computed where the Killing form is nondegenerate):", "", table(["direction", "t", "Killing", "commutant", "full H^2"], frow), "");
    // Generic deformations: a phi_a + b phi_b + c phi_c over a grid and off it, integrated along the ray. The
    // reading tested at every point: with D = ab + c^2 (in this normalization of the cocycles), D > 0 gives
    // +8 -7, D = 0 a degenerate Killing form, D < 0 gives +9 -6 when a > 0 and +5 -10 when a < 0.
    const pts = [];
    for (const a of [-1, 0, 1]) for (const b of [-1, 0, 1]) for (const c of [-1, 0, 1, 2]) if (a || b || c) pts.push([a, b, c]);
    pts.push([1, -4, 2], [1, -4, 1], [1, -4, 3], [2, -2, 2], [4, -1, 2], [-1, 4, 2], [2, 3, 0], [-2, -3, 0], [3, -1, 1], [3, -1, 2], [1, -3, 2], [-1, 3, 1], [1, -3, 1], [2, -1, 1], [-2, 1, 1], ["1/2", -2, 1], [5, "-1/5", "1/3"]);
    const predict = (a, b, c) => { const D = a.mul(b).add(c.mul(c)); return D.sign() > 0 ? "+8 -7" : D.isZero() ? "degenerate" : a.sign() > 0 ? "+9 -6" : "+5 -10"; };
    const grow = [], seen = new Map(); let agree = 0, firstOrder = 0;
    for (const [a, b, c] of pts) {
      const [A, B, Cc] = [a, b, c].map((x) => Q.of(x));
      const phi = sumCochains([[A, reps[0]], [B, reps[1]], [Cc, reps[2]]]);
      const I = integrate(g, phi, { space: B2 });
      if (!I.exact) { grow.push([`${a}, ${b}, ${c}`, `obstructed at ${I.obstructedAt}`, "", "", "", "", ""]); continue; }
      if (I.order === 1) firstOrder++;
      const gt = at_t(g, I.phis, 1), s = signature(killing(gt)), semi = !s.zero, k = sig(gt), D = A.mul(B).add(Cc.mul(Cc));
      seen.set(k, (seen.get(k) ?? 0) + 1);
      const p = predict(A, B, Cc), ok = p === "degenerate" ? !semi : p === k;
      if (ok) agree++;
      grow.push([`${a}, ${b}, ${c}`, `${D}`, `exact at order ${I.order}`, k, semi ? commutantDim(gt) : "", semi ? h2(gt).dimH2 : "", ok ? "yes" : "NO"]);
    }
    L.push("## Generic deformations", "", "The deformation a phi_a + b phi_b + c phi_c, with phi_a, phi_b, phi_c the cocycles above, integrated along the ray and evaluated at t = 1. D = ab + c^2 in this normalization; the last column tests the reading D > 0 gives +8 -7, D = 0 a degenerate Killing form, D < 0 gives +9 -6 for a > 0 and +5 -10 for a < 0.", "", table(["a, b, c", "D", "integration", "Killing", "commutant", "full H^2", "reading holds"], grow), "", `Signatures: ${[...seen].map(([k, v]) => `${k} (${v})`).join(", ")}. The reading holds at ${agree} of ${pts.length} points. Points where the linear family mu + t phi was already exact (no higher-order term added): ${firstOrder} of ${pts.length}.`, "");
    // Direction (c): I becomes a dilatation.
    const Ic = integrate(g, reps[2], { space: B2 }), gc = at_t(g, Ic.phis, 1), A = adMatrix(gc, gc.idx.get("I"));
    const eig = (fam) => [0, 1, 2, 3].map((m) => { const i = gc.idx.get(`${fam}${m}`); const col = A.map((r) => r[i]); const nz = col.map((x, k) => [k, x]).filter(([, x]) => !x.isZero()); return nz.length === 1 && nz[0][0] === i ? `${nz[0][1]}` : "not diagonal"; });
    const zeroOnM = H.every((x) => A.every((r) => r[x].isZero()));
    L.push("## Direction (c): I as a dilatation", "", `ad_I at t = 1 on P0..P3: ${eig("P").join(", ")}; on X0..X3: ${eig("X").join(", ")}; on the Lorentz generators: ${zeroOnM ? "zero" : "nonzero"}. In the seed I is central; after the deformation ad_I is diagonal with opposite eigenvalues on P and X and zero on the Lorentz generators, the grading a dilatation induces on translations and special conformal generators.`);
    return L.join("\n");
  },
};
