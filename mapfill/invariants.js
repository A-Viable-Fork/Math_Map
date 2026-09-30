// Role: the invariant vocabulary. Names the invariants that entries preserve or break, so a chain of entries
//   can be checked for what survives it by machine rather than by reading free text.
// Contract: exports INVARIANTS = [{ id, name, kind, definition }], RELATIONS = [{ from, to, kind, receipts?,
//   basis? }] and LINKS = [{ entry, field, invariant, phrase }]. field is preserved, broken or output (the step
//   produces the invariant in its output, as a blow-up produces an exceptional divisor). kind of a relation: implies (from holding
//   gives to) or equivalent (both ways). A relation carries receipts (quotes in excerpts/) or a basis naming
//   why it holds by definition. A link says an entry's preserved or broken field names the invariant; its
//   phrase must occur in that field's text, so every link is justified by the entry's own words. Checked
//   by scripts/mathmap.mjs; used by scripts/compose.mjs.
// Invariant: data only. The vocabulary is seeded from the fields that composites use and grows by use.
"use strict";

const I = (id, name, kind, definition) => ({ id, name, kind, definition });
const INVARIANTS = [
  // Algebraic geometry
  I("birational-type", "Birational type", "equivalence class", "The class of a variety up to birational equivalence: isomorphism of dense open subsets."),
  I("function-field", "Function field", "algebraic object", "The field of rational functions of an irreducible variety, as an extension of the base field."),
  I("local-structure-at-center", "Local structure at the center", "local structure", "The germ of the space along the locus a surgery is performed on."),
  I("exceptional-divisor", "Presence of the exceptional divisor", "configuration", "Whether the divisor created by a blow-up is present as a curve (or divisor) in the space."),
  I("self-intersection", "Self-intersection number", "numerical", "The intersection number of a curve with itself on a surface, C^2."),
  I("curve-isomorphism-type", "Isomorphism type of a curve", "equivalence class", "The curve up to isomorphism, as an abstract curve."),
  // Topology
  I("homotopy-type", "Homotopy type", "equivalence class", "The space up to homotopy equivalence."),
  I("contractibility", "Contractibility", "property", "Being homotopy equivalent to a point."),
  I("topology-of-input", "Topology of the input", "structure", "The input space's topology as given, before any collapse or gluing."),
  I("point-structure", "Individual point structure", "structure", "The identity and arrangement of individual input points."),
  // Category theory
  I("limits", "Limits", "structure", "Limits of diagrams (all small limits, where stated), preserved when a functor carries limit cones to limit cones."),
  I("finite-limits", "Finite limits", "structure", "Limits of finite diagrams: the terminal object, pullbacks, equalizers."),
  I("colimits", "Colimits", "structure", "Colimits of diagrams, preserved when a functor carries colimit cocones to colimit cocones."),
  I("category-structure", "Category structure", "structure", "The objects and morphisms of a category with their composition."),
  I("truth-values", "Truth values", "structure", "The subobject classifier's elements: the internal truth values of a topos."),
  I("skeletal-objects", "Skeletal objects of a level", "modal class", "The objects fixed by a level's skeleton modality (i-skeleta)."),
  I("level-opposition", "Opposition at a level", "modal relation", "The distinction, at one level, between its skeleta and its sheaves."),
  // Analysis
  I("l2-orthogonality", "L^2 orthogonality", "analytic", "Pieces of a decomposition are mutually orthogonal in the L^2 inner product."),
  I("cohomology", "Cohomology", "algebraic object", "De Rham or singular cohomology groups."),
  I("function-by-resummation", "The function itself (by resummation)", "identity", "The decomposed pieces sum back to the original function."),
  I("spatial-locality", "Spatial locality", "analytic", "Support or concentration in physical space."),
  I("instantaneous-locality", "Instantaneous locality", "analytic", "An effect at time t depends only on the source at time t."),
  I("linearity", "Linearity", "algebraic", "Superposition: the response to a sum is the sum of the responses."),
  I("causality", "Causality", "analytic", "Only earlier times contribute to the state at a given time."),
  // Differential geometry
  I("leibniz-rule", "Leibniz rule", "algebraic", "The product rule for derivations."),
  I("tensoriality", "Tensoriality", "algebraic", "Linearity over smooth functions (C-infinity linearity) in an argument."),
  I("flatness", "Flatness", "geometric", "Vanishing curvature: covariant derivatives commute."),
];

const RELATIONS = [
  { from: "birational-type", to: "function-field", kind: "equivalent",
    receipts: [{ file: "excerpts/wikipedia-birational-geometry.txt", quote: "are birational if and only if their [[Function field of an algebraic variety|function fields]] are isomorphic" }] },
  { from: "limits", to: "finite-limits", kind: "implies", basis: "By definition: a finite limit is a limit." },
];

const L = (entry, field, invariant, phrase) => ({ entry, field, invariant, phrase });
const LINKS = [
  L("D2-117", "preserved", "birational-type", "Birational type"), L("D2-117", "preserved", "function-field", "function field"),
  L("D2-117", "broken", "local-structure-at-center", "Local structure at Z"), L("D2-117", "output", "exceptional-divisor", "with exceptional divisor"),
  L("D2-118", "preserved", "birational-type", "Birational type"), L("D2-118", "broken", "exceptional-divisor", "Exceptional divisor"),
  L("D2-X01", "preserved", "curve-isomorphism-type", "C' is isomorphic to C"), L("D2-X01", "broken", "self-intersection", "Self-intersection"),
  L("D4-048", "preserved", "homotopy-type", "Homotopy type"), L("D4-048", "broken", "point-structure", "Individual point structure"),
  L("D4-264", "preserved", "category-structure", "Category structure"),
  L("D4-075", "preserved", "contractibility", "Contractibility"), L("D4-075", "broken", "topology-of-input", "Original topology of X"),
  L("D7-068", "preserved", "limits", "Limits in R"),
  L("D7-284", "preserved", "colimits", "Colimits"), L("D7-284", "preserved", "limits", "limits under f^*"),
  L("D7-288", "preserved", "finite-limits", "Finite limits"), L("D7-288", "broken", "truth-values", "Truth values collapsed by j"),
  L("D7-X01", "preserved", "skeletal-objects", "i-skeleta survive as j-sheaves"), L("D7-X01", "broken", "level-opposition", "The opposition at level i"),
  L("D6-X01", "preserved", "function-by-resummation", "the pieces sum to it"), L("D6-X01", "preserved", "l2-orthogonality", "in L^2 the pieces are orthogonal"),
  L("D6-X01", "broken", "spatial-locality", "Spatial locality"),
  L("D4-176", "preserved", "cohomology", "Cohomology"), L("D4-176", "preserved", "l2-orthogonality", "L^2 orthogonality"),
  L("D6-X02", "preserved", "linearity", "Linearity"), L("D6-X02", "preserved", "causality", "causality"),
  L("D6-X02", "broken", "instantaneous-locality", "Instantaneous locality"),
  L("D4-086", "preserved", "leibniz-rule", "Leibniz rule"), L("D4-086", "preserved", "tensoriality", "tensoriality"),
  L("D4-086", "broken", "flatness", "Flat derivative"),
];

module.exports = { INVARIANTS, RELATIONS, LINKS };
