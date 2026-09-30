// Role: the formal layer's data. Links from map entries to Mathlib declarations at one pinned commit.
// Contract: exports MATHLIB = { commit } and FORMAL = [{ entry, field, decl, file, match, note }]. field is
//   the entry field the declaration bears on (description, input, output, preserved, broken); decl is the
//   full Lean name; file is its path in mathlib4; match grades how the statement bears on the claim
//   (exact, general, special, related, ingredient, conflicts; see scripts/formal.mjs). Optional: whole
//   (an exact link that states the whole field, not one claim in it), invariant (the named invariant, in
//   mapfill/invariants.js, whose claim the declaration proves) and premise (for a general link, the entry
//   field stating the hypothesis the theorem needs, such as "is a right adjoint"). Checked by
//   scripts/formal.mjs against excerpts/mathlib-*.txt, which that script writes from a pinned checkout.
// Invariant: data only. A link never edits an entry; a conflict is recorded here and in the audit grade.
"use strict";

const MATHLIB = { commit: "380f2aafb622cb2c1c93dac545b6389083c68c51" };

const K = (entry, field, decl, file, match, note, opts = {}) => ({ entry, field, decl, file, match, note, ...opts });
const ADJ = "Mathlib/CategoryTheory/Adjunction/Limits.lean";
const FORMAL = [
  // D1 Combinatorics
  K("D1-003", "output", "SimpleGraph.lineGraph", "Mathlib/Combinatorics/SimpleGraph/LineGraph.lean", "exact",
    "The line graph is a simple graph on G.edgeSet: its vertices are the edges of G, so edge count becomes vertex count by definition.", { whole: true }),
  K("D1-003", "description", "SimpleGraph.lineGraph_adj_iff_exists", "Mathlib/Combinatorics/SimpleGraph/LineGraph.lean", "exact",
    "Two edges are adjacent in L(G) iff they are distinct and share a vertex. The entry's further claims (Eulerian to Hamiltonian, Whitney's theorem) are not in Mathlib at the pin."),
  K("D1-059", "output", "Matroid.dual_isBase_iff'", "Mathlib/Combinatorics/Matroid/Dual.lean", "exact",
    "Bases of the dual are the complements, within the ground set, of bases of M.", { whole: true }),
  K("D1-059", "preserved", "Matroid.dual_ground", "Mathlib/Combinatorics/Matroid/Dual.lean", "exact", "The dual has the same ground set."),
  K("D1-059", "broken", "Matroid.eRank_add_eRank_dual", "Mathlib/Combinatorics/Matroid/Rank/ENat.lean", "exact",
    "r + r* = |E|, the entry's rank formula, stated in extended naturals so it covers infinite ground sets."),
  K("D1-099", "description", "GaloisConnection", "Mathlib/Order/GaloisConnection/Defs.lean", "conflicts",
    "Mathlib's Galois connection is the monotone convention: l a <= b iff a <= u b, giving a <= u(l a) and l(u b) <= b. The entry states antitone maps but gives the monotone pair of inequalities. For antitone maps the second must read b <= f(g(b)); with that correction both composites are closure operators, as the entry's preserved field says (in Mathlib, an antitone connection is a monotone one into the order dual)."),
  K("D1-099", "description", "GaloisConnection.le_u_l", "Mathlib/Order/GaloisConnection/Defs.lean", "exact",
    "The unit inequality a <= g(f(a)), which holds in both conventions."),
  K("D1-099", "preserved", "GaloisConnection.closureOperator", "Mathlib/Order/Closure.lean", "special",
    "In the monotone convention only u after l is a closure operator (l after u is an interior operator). The entry's claim that both composites are closure operators is the antitone case."),
  // D2 Algebra
  K("D2-031", "description", "mellin", "Mathlib/Analysis/MellinTransform.lean", "exact", "The integral of t^(s-1) f(t) over (0, infinity): the entry's kernel."),
  K("D2-031", "preserved", "mellin_comp_mul_left", "Mathlib/Analysis/MellinTransform.lean", "general",
    "Mathlib gives the exact law: dilating f by a multiplies the transform by a^(-s). \"Scale invariance\" holds only for the modulus on the line Re s = 0. The convolution-to-product rule the entry also claims is not in Mathlib at the pin."),
  K("D2-103", "description", "TensorProduct.lift.unique", "Mathlib/LinearAlgebra/TensorProduct/Basic.lean", "exact",
    "The universal property: a linear map out of the tensor product is determined by its values on pure tensors, and lift realizes each bilinear map."),
  K("D2-103", "preserved", "rTensor_exact", "Mathlib/LinearAlgebra/TensorProduct/RightExactness.lean", "exact",
    "Right exactness: tensoring an exact sequence ending in a surjection gives an exact sequence."),
  // D3 Logic
  K("D3-033", "preserved", "FirstOrder.Language.Ultraproduct.sentence_realize", "Mathlib/ModelTheory/Ultraproducts.lean", "exact",
    "Los's theorem: the ultraproduct satisfies a sentence iff U-almost every factor does.", { whole: true }),
  K("D3-116", "description", "CategoryTheory.sheafificationAdjunction", "Mathlib/CategoryTheory/Sites/Sheafification.lean", "exact",
    "Sheafification is left adjoint to the inclusion of sheaves into presheaves, given that sheafification exists for the coefficient category (HasWeakSheafify), a hypothesis the entry leaves implicit."),
  // D4 Topology
  K("D4-153", "output", "PositiveLinearMap.gnsStarAlgHom", "Mathlib/Analysis/CStarAlgebra/GelfandNaimarkSegal.lean", "exact",
    "The GNS representation of the algebra on the completion of A with the inner product given by the positive functional. State recovery through a cyclic vector, the entry's preserved claim, is listed as future work in the file at the pin.", { whole: true }),
  K("D4-264", "output", "CategoryTheory.nerveFunctor", "Mathlib/AlgebraicTopology/SimplicialSet/Nerve.lean", "ingredient", "The nerve functor from categories to simplicial sets."),
  K("D4-264", "preserved", "CategoryTheory.nerveFunctor.fullyfaithful", "Mathlib/AlgebraicTopology/SimplicialSet/NerveAdjunction.lean", "exact",
    "The nerve functor is fully faithful on all small categories, so functors between categories are exactly maps of their nerves: the corrected field. (The landed field restricted this to groupoids, which is unnecessary.)", { invariant: "category-structure", whole: true }),
  // D6 Analysis
  K("D6-117", "output", "MeasureTheory.Measure.haveLebesgueDecomposition_add", "Mathlib/MeasureTheory/Measure/Decomposition/Lebesgue.lean", "exact",
    "mu = singular part + nu.withDensity (Radon-Nikodym derivative), given that a Lebesgue decomposition exists.", { whole: true }),
  K("D6-117", "description", "MeasureTheory.Measure.mutuallySingular_singularPart", "Mathlib/MeasureTheory/Measure/Decomposition/Lebesgue.lean", "exact", "The singular part is mutually singular with nu."),
  K("D6-117", "input", "MeasureTheory.Measure.haveLebesgueDecomposition_of_sigmaFinite", "Mathlib/MeasureTheory/Measure/Decomposition/Lebesgue.lean", "exact",
    "The decomposition exists when mu is s-finite and nu is sigma-finite. The entry's input (\"measures mu, nu\") omits this hypothesis."),
  // D7 Category theory
  K("D7-068", "input", "CategoryTheory.Reflective", "Mathlib/CategoryTheory/Adjunction/Reflective.lean", "exact",
    "A reflective subcategory: a fully faithful functor with a left adjoint.", { whole: true }),
  K("D7-068", "preserved", "CategoryTheory.monadicOfReflective", "Mathlib/CategoryTheory/Monad/Adjunction.lean", "general",
    "A reflective inclusion is monadic, and monadic functors create limits (monadicCreatesLimits): limits in R are computed in C."),
  K("D7-068", "preserved", "CategoryTheory.monadicCreatesLimits", "Mathlib/CategoryTheory/Monad/Limits.lean", "general", "With monadicOfReflective, the inclusion creates limits.", { invariant: "limits", premise: "input" }),
  K("D7-157", "preserved", "Subgroup.normalClosure_normal", "Mathlib/Algebra/Group/Subgroup/Basic.lean", "exact", "The normal closure is normal.", { whole: true }),
  K("D7-157", "description", "Subgroup.normalClosure_le_normal", "Mathlib/Algebra/Group/Subgroup/Basic.lean", "exact",
    "It is the smallest normal subgroup containing the set. The field-extension reading is a separate construction (IntermediateField.normalClosure), not linked here."),
  K("D7-157", "output", "Subgroup.normalClosure", "Mathlib/Algebra/Group/Subgroup/Basic.lean", "exact", "Defined as the subgroup generated by all conjugates of the set."),
  K("D7-X02", "preserved", "CategoryTheory.Sheaf.createsLimits", "Mathlib/CategoryTheory/Sites/Limits.lean", "special",
    "For a Grothendieck topology, the inclusion of sheaves into presheaves creates limits. Grothendieck topologies give the subtoposes of presheaf toposes; the general Lawvere-Tierney case is not in Mathlib at the pin."),
  K("D7-X02", "description", "CategoryTheory.preservesFiniteLimits_presheafToSheaf", "Mathlib/CategoryTheory/Sites/LeftExact.lean", "special",
    "Sheafification is left exact, for Grothendieck topologies and coefficient categories meeting the stated hypotheses."),
  // The categorical chain: adjoints preserve limits and colimits, applied to each step's functor.
  K("D7-X02", "preserved", "CategoryTheory.Adjunction.rightAdjoint_preservesLimits", ADJ, "general",
    "Any right adjoint preserves limits; the inclusion of a subtopos is right adjoint to sheafification (the entry's description).", { invariant: "limits", premise: "description" }),
  K("D7-284", "preserved", "CategoryTheory.Adjunction.rightAdjoint_preservesLimits", ADJ, "general",
    "f^* is right adjoint to f_! in the essential triple, so it preserves limits.", { invariant: "limits", premise: "output" }),
  K("D7-284", "preserved", "CategoryTheory.Adjunction.leftAdjoint_preservesColimits", ADJ, "general",
    "f^* is left adjoint to f_* in the triple, so it preserves colimits.", { invariant: "colimits", premise: "output" }),
  K("D7-X03", "preserved", "CategoryTheory.Adjunction.rightAdjoint_preservesLimits", ADJ, "general",
    "In the triple i_! left of i^* left of i_*, the middle functor i^* is a right adjoint, so it preserves limits.", { invariant: "limits", premise: "input" }),
  K("D7-X03", "preserved", "CategoryTheory.Adjunction.leftAdjoint_preservesColimits", ADJ, "general",
    "The middle functor i^* is also a left adjoint, so it preserves colimits.", { invariant: "colimits", premise: "input" }),
  // D4-086: Mathlib's covariant derivative (a Koszul connection on a vector bundle).
  K("D4-086", "preserved", "IsCovariantDerivativeOn", "Mathlib/Geometry/Manifold/VectorBundle/CovariantDerivative/Basic.lean", "exact",
    "The Leibniz rule is a field of Mathlib's definition: cov (g • σ) = g • cov σ + dg ⊗ σ.", { invariant: "leibniz-rule" }),
  K("D4-086", "preserved", "IsCovariantDerivativeOn", "Mathlib/Geometry/Manifold/VectorBundle/CovariantDerivative/Basic.lean", "exact",
    "Tensoriality in X is built into the type: the covariant derivative of a section is, at each point, a continuous linear map from the tangent space.", { invariant: "tensoriality" }),
  // D8 Computation
  K("D8-125", "preserved", "Real.strictMonoOn_log", "Mathlib/Analysis/SpecialFunctions/Log/Basic.lean", "exact", "The logarithm is strictly increasing on the positive reals, so the transform preserves order (the corrected field).", { whole: true }),
  K("D8-125", "description", "Real.log_mul", "Mathlib/Analysis/SpecialFunctions/Log/Basic.lean", "exact", "log(xy) = log x + log y: products become sums (the corrected field)."),
  K("D8-107", "description", "Module.End.exists_isNilpotent_isSemisimple", "Mathlib/LinearAlgebra/JordanChevalley.lean", "related",
    "Mathlib has the Jordan-Chevalley decomposition (f = nilpotent + semisimple, over a perfect field), which the Jordan normal form implies. The normal form itself is not in Mathlib at the pin. The name also matches Mathlib's Jordan decomposition of signed measures, a different theorem."),
];

module.exports = { MATHLIB, FORMAL };
