// Role: conditions and counterexamples. The hypotheses under which an entry's claims hold, and cases
//   that show where they stop, stated as their own fields so they can be checked like the invariants.
// Contract: exports CONDITIONS = [{ id, name, conditions, counterexamples?, receipts: [{ file, quote }] }].
//   id and name must match an entry (landed, filled or added); every receipt's quote occurs in its file under
//   excerpts/ or source/. counterexamples is a list of { case, receipt? } and may be empty. Checked by
//   scripts/mathmap.mjs.
// Invariant: data only. A condition narrows an entry's claims; it never edits the entry's other fields.
"use strict";

const CONDITIONS = [
  { id: "D2-118", name: "Blowing Down",
    conditions: "The curve contracted is a (-1)-curve (a smooth rational curve of self-intersection -1) on a smooth projective surface: then it contracts to a smooth point and the contraction is inverse to the blow-up (Castelnuovo). Other curves contract, when they do, to singular points.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/wikipedia-castelnuovo.txt", quote: "a (&minus;1)-[[algebraic curve|curve]] on <math>X</math>" },
      { file: "excerpts/wikipedia-castelnuovo.txt", quote: "(which means a smooth [[algebraic curve#rational curves|rational curve]] of [[intersection theory#self-intersection|self-intersection]] number&nbsp;&minus;1)" },
    ] },
  { id: "D7-068", name: "Reflective Subcategory Localization",
    conditions: "A localization in the sense needed for subtoposes and levels requires the reflector to preserve finite limits (an exact reflection; between toposes, a geometric embedding). A bare reflective subcategory need not.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/nlab-reflective-subcategory.txt", quote: "in addition preserves [[finite limits]], then the embedding is called _exact_. If the categories are [[topos]]es then such embeddings are called [[geometric embedding]]s." },
    ] },
  { id: "D4-176", name: "Hodge decomposition",
    conditions: "As stated, on a closed (compact, boundaryless) Riemannian manifold. The vector-field case used in fluid mechanics (the Helmholtz or Leray decomposition) holds for square-integrable fields on a bounded, simply-connected Lipschitz domain.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/wikipedia-hodge-theory.txt", quote: "on a closed Riemannian manifold as a sum of three parts in the form" },
      { file: "excerpts/wikipedia-helmholtz-decomposition.txt", quote: "is a bounded, simply-connected, [[Lipschitz domain]]. Every [[square-integrable]] vector field" },
    ] },
  { id: "D6-117", name: "Radon-Nikodym decomposition",
    conditions: "The decomposition mu = mu_ac + mu_s with a density for mu_ac exists when mu is s-finite and nu is sigma-finite (in Mathlib, these hypotheses supply the Lebesgue decomposition instance). Without them it can fail.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/mathlib-Mathlib.MeasureTheory.Measure.Decomposition.Lebesgue.txt", quote: "[SFinite μ] [SigmaFinite ν] : HaveLebesgueDecomposition μ ν" },
      { file: "excerpts/mathlib-Mathlib.MeasureTheory.Measure.Decomposition.Lebesgue.txt", quote: "(μ ν : Measure α) [HaveLebesgueDecomposition μ ν] :" },
    ] },
  { id: "D3-116", name: "Sheafification",
    conditions: "Sheafification must exist for the coefficient category (Mathlib's HasWeakSheafify): it does for sets and for many concrete categories, and then it is left adjoint to the inclusion of sheaves.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/mathlib-Mathlib.CategoryTheory.Sites.Sheafification.txt", quote: "def sheafificationAdjunction [HasWeakSheafify J A] :" },
    ] },
  { id: "D4-048", name: "Cech complex construction",
    conditions: "The nerve theorem needs a good cover: every nonempty intersection of the balls contractible, as for balls in Euclidean space (they are convex). In a general metric space the Cech complex need not have the homotopy type of the union.",
    counterexamples: [{ case: "Two contractible sets can cover an n-sphere and meet: their nerve is a 1-simplex, not a sphere. The intersection is not contractible, so the cover is not good.",
      receipt: { file: "excerpts/wikipedia-nerve-complex.txt", quote: "one can cover any [[N-sphere|''n''-sphere]] with two contractible sets <math>U_1</math> and <math>U_2</math> that have a non-empty intersection" } }],
    receipts: [
      { file: "excerpts/wikipedia-nerve-complex.txt", quote: "the set <math>\\bigcap_{i\\in J} U_i</math> is either empty or contractible" },
    ] },
  { id: "D4-075", name: "Cone construction",
    conditions: "The landed formula X x [0,1] / (X x {1}) is empty when X is empty; the source attaches the cylinder to a point v, which gives the point. The contractibility claim needs X nonempty or that definition.",
    counterexamples: [{ case: "X empty: the landed quotient is the empty space, which is not contractible." }],
    receipts: [
      { file: "excerpts/wikipedia-cone-topology.txt", quote: "is a [[point (topology)|point]] (called the vertex of the cone)" },
    ] },
  { id: "D6-090", name: "Lebesgue decomposition",
    conditions: "The two-part decomposition (absolutely continuous plus singular) holds for sigma-finite measures and is unique; the three-part refinement (absolutely continuous, singular continuous, pure point) is stated for regular Borel measures.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/wikipedia-lebesgue-decomposition.txt", quote: "then there exist two uniquely determined σ-finite signed measures" },
      { file: "excerpts/wikipedia-lebesgue-decomposition.txt", quote: "An alternative refinement is that of the decomposition of a regular [[Borel measure]]" },
    ] },
];

module.exports = { CONDITIONS };
