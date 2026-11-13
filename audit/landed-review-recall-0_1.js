// Role: the landed review's recalled expectations. For each landed entry under review, what the reviewer expected
//   each field to be, written from memory after reading the entry and before any source was fetched for its batch,
//   and committed alone ("recall, batch N") before the batch's grades.
// Contract: exports RECALL = [{ id, batch, name, description, input, output, preserved, broken }], one per entry of
//   audit/landed-review-0_1.js, plus the batch in progress. Each field is the reviewer's recalled verdict on the
//   landed text with the reason (ok: as stated; off: wrong or missing a hypothesis; thin: too vague to grade):
//   a lead, never evidence. The review records, per entry, the fields whose recall a source contradicted (contra);
//   reports/LANDED-REVIEW.md gives that rate per batch.
// Invariant: data only, and never revised after its batch's sources are read; a recall shown wrong stays as written.
"use strict";

const k = (id, batch, name, description, input, output, preserved, broken) => ({ id, batch, name, description, input, output, preserved, broken });

const RECALL = [
  // Batch 1: D2-001 to D2-054, written 2026-11-13 before the batch's sources were fetched.
  k("D2-001", 1, "ok: standard (translation in geometry)", "ok: every point moved by the same vector", "ok: a figure and a vector", "ok: the translated figure", "ok: a translation is a direct isometry, so distances, angles and orientation are kept", "ok: position changes; a nonzero translation fixes no point"),
  k("D2-002", 1, "ok: standard", "ok: reflection in a hyperplane, a mirror image", "ok: figure and mirror", "ok", "ok: an isometry, so distances, angles and size are kept", "ok: reflections reverse orientation (opposite isometry)"),
  k("D2-003", 1, "ok: standard", "ok: turn about a point (plane) or axis (space) by an angle", "ok", "ok", "ok: a direct isometry: distances, angles, orientation", "ok: every point but the centre moves (for a nonzero angle)"),
  k("D2-004", 1, "ok: dilation or homothety, scaling from a centre", "ok: x to c + k(x - c); affine, a similarity but not an isometry when |k| differs from 1", "ok", "ok", "ok: angles, shape, ratios of distances", "ok: lengths scale by |k|"),
  k("D2-005", 1, "ok: standard name in graph transformations", "ok: g(x) = f(x) + c", "ok", "ok", "ok: shape, derivative and domain unchanged", "ok: range moves by c"),
  k("D2-006", 1, "ok", "ok: f(x + c) with c > 0 moves the graph left", "ok", "ok", "ok: shape and range", "ok: the domain moves by -c"),
  k("D2-007", 1, "ok", "ok: a f(x); a < 0 also reflects", "ok", "ok", "ok: zeros and domain", "ok: values and extrema scale by a"),
  k("D2-008", 1, "ok", "ok: f(a x), a > 1 compresses horizontally", "ok", "ok", "ok: range", "ok: domain scale, period divided by |a|"),
  k("D2-009", 1, "ok: standard", "ok: a linear map followed by a translation; preserves collinearity", "thin: also needs the map itself", "ok", "off: preserves ratios of lengths along parallel lines, not distance ratios in general", "ok: distances and angles"),
  k("D2-010", 1, "ok", "off: collineations are semilinear by the fundamental theorem of projective geometry only in dimension at least 2", "ok", "ok", "ok: collinearity; cross-ratio for projective (linear) maps", "ok: metric properties"),
  k("D2-011", 1, "ok", "ok: f(f(x)) = x", "thin", "ok", "off: an involution need not respect the structure's operations unless it is an automorphism or anti-automorphism", "thin"),
  k("D2-037", 1, "ok: standard (Mukai)", "off: an integral functor; it is an equivalence only for suitable kernels (Orlov: every exact equivalence is one)", "ok: an object of the bounded derived category and a kernel on X x Y", "ok", "ok: equivalence when the kernel satisfies conditions", "thin"),
  k("D2-040", 1, "ok: standard", "ok: A = LU, Gaussian elimination in matrix form", "ok: square matrix (may need pivoting to exist)", "ok", "ok: det A = det L det U; Ax = b solved by two triangular solves", "thin"),
  k("D2-041", 1, "ok", "ok: A = LDU with unit triangular factors", "ok", "ok", "thin: relative to LU", "thin"),
  k("D2-042", 1, "ok: LUP or PLU", "ok: PA = LU exists for every square matrix", "ok", "ok", "off: partial pivoting is stable in practice, not guaranteed (growth factor up to 2^(n-1)); existence ok", "ok: rows permuted"),
  k("D2-043", 1, "ok", "thin: block LU exists; parallel optimization is a use, not a definition", "ok", "ok", "thin", "thin"),
  k("D2-044", 1, "ok", "ok: A = CF with C full column rank and F full row rank", "ok", "ok", "ok: rank; column space of C is that of A, row space of F that of A", "thin"),
  k("D2-045", 1, "ok", "ok: A = LL* = U*U for Hermitian positive-definite A; about half the cost of LU", "ok", "ok", "thin: positive-definiteness is the input's, solution set ok", "thin"),
  k("D2-046", 1, "ok", "ok: A = LDL* with no square roots", "off: LDL* exists more widely, for symmetric matrices with nonzero leading minors (indefinite included)", "ok", "ok: no square roots", "thin"),
  k("D2-047", 1, "ok", "ok: Q orthogonal or unitary, R upper triangular; used for least squares, stable", "ok", "ok", "ok: Q keeps 2-norms; column space when A has full rank", "thin"),
  k("D2-048", 1, "ok", "ok: A = V D V^-1 for diagonalizable A; powers through D^n", "ok", "ok", "ok: similarity keeps eigenvalues, trace, determinant", "thin"),
  k("D2-050", 1, "ok", "off: exists for every square matrix over an algebraically closed field, diagonalizable ones included", "ok", "ok", "ok: eigenvalues, algebraic and geometric multiplicities", "off: diagonalizability is a similarity invariant, kept, not broken"),
  k("D2-052", 1, "ok", "ok: A = U T U* with T upper triangular, eigenvalues on its diagonal", "ok", "ok", "ok", "thin"),
  k("D2-053", 1, "ok", "ok: real quasi-triangular T with 2 by 2 blocks for complex conjugate pairs", "ok", "ok", "ok", "ok"),
  k("D2-054", 1, "ok: QZ or generalized Schur", "ok: unitary Q, Z making both A and B upper triangular, for Ax = lambda Bx", "ok", "ok: in the complex case; real QZ gives quasi-triangular", "ok: generalized eigenvalues as ratios of diagonals", "thin"),
];

module.exports = { RECALL };
