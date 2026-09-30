// Role: the invariant vocabulary. Names the invariants that entries preserve or break, so a chain of entries
//   can be checked for what survives it by machine rather than by reading free text.
// Contract: exports CARRIERS, INVARIANTS, RELATIONS, ACTS_ON and LINKS.
//   CARRIERS = { kind: parent|null }: the kinds of object an invariant can belong to (a curve is a variety).
//   INVARIANTS = [{ id, name, kind, carrier, definition }]: carrier is the kind of object that has it;
//     "operation" means a property of the step itself (linearity), which every step can have or lack.
//   RELATIONS = [{ from, to, kind, receipts?, basis? }]: implies (from holding gives to) or equivalent
//     (both ways), with receipts (quotes in excerpts/) or a basis naming why it holds by definition.
//   ACTS_ON = [{ entry, input: [kinds], output: [kinds], inputPhrase, outputPhrase }]: what an entry takes and
//     returns; each phrase (or each phrase in a list) must occur in the entry's input or output field.
//   LINKS = [{ entry, field, invariant, phrase | receipts, note? }]: field is preserved, broken or output
//     (the step produces the invariant, as a blow-up produces an exceptional divisor). A link is justified
//     either by a phrase in the entry's own field, or, where the entry is silent, by receipts (quotes in
//     excerpts/) with a note saying how they bear on the entry.
//   Checked by scripts/mathmap.mjs; used by scripts/compose.mjs.
// Invariant: data only. The vocabulary is seeded from the fields that composites use and grows by use.
"use strict";

const CARRIERS = {
  variety: null, surface: "variety", curve: "variety",
  space: null, "point-cloud": null, "simplicial-set": "space",
  category: null, functor: null, topos: "category", level: null,
  field: null, function: "field", form: "field", evolution: null, connection: null, "vector-field": "form",
  operation: null,
};

const I = (id, name, kind, carrier, definition) => ({ id, name, kind, carrier, definition });
const INVARIANTS = [
  // Algebraic geometry
  I("birational-type", "Birational type", "equivalence class", "variety", "The class of a variety up to birational equivalence: isomorphism of dense open subsets."),
  I("function-field", "Function field", "algebraic object", "variety", "The field of rational functions of an irreducible variety, as an extension of the base field."),
  I("local-structure-at-center", "Local structure at the center", "local structure", "variety", "The germ of the space along the locus a surgery is performed on."),
  I("exceptional-divisor", "Presence of the exceptional divisor", "configuration", "variety", "Whether the divisor created by a blow-up is present as a curve (or divisor) in the space."),
  I("self-intersection", "Self-intersection number", "numerical", "curve", "The intersection number of a curve with itself on a surface, C^2."),
  I("curve-isomorphism-type", "Isomorphism type of a curve", "equivalence class", "curve", "The curve up to isomorphism, as an abstract curve."),
  // Topology
  I("homotopy-type", "Homotopy type", "equivalence class", "space", "The space up to homotopy equivalence."),
  I("contractibility", "Contractibility", "property", "space", "Being homotopy equivalent to a point."),
  I("topology-of-input", "Topology of the input", "structure", "space", "The input space's topology as given, before any collapse or gluing."),
  I("point-structure", "Individual point structure", "structure", "point-cloud", "The identity and arrangement of individual input points."),
  // Category theory
  I("limits", "Limits", "structure", "functor", "Limits of diagrams (all small limits, where stated), preserved when a functor carries limit cones to limit cones."),
  I("finite-limits", "Finite limits", "structure", "functor", "Limits of finite diagrams: the terminal object, pullbacks, equalizers."),
  I("colimits", "Colimits", "structure", "functor", "Colimits of diagrams, preserved when a functor carries colimit cocones to colimit cocones."),
  I("category-structure", "Category structure", "structure", "category", "The objects and morphisms of a category with their composition."),
  I("truth-values", "Truth values", "structure", "topos", "The subobject classifier's elements: the internal truth values of a topos."),
  I("skeletal-objects", "Skeletal objects of a level", "modal class", "level", "The objects fixed by a level's skeleton modality (i-skeleta)."),
  I("level-opposition", "Opposition at a level", "modal relation", "level", "The distinction, at one level, between its skeleta and its sheaves."),
  // Analysis
  I("l2-orthogonality", "L^2 orthogonality", "analytic", "field", "Pieces of a decomposition are mutually orthogonal in the L^2 inner product."),
  I("cohomology", "Cohomology", "algebraic object", "form", "De Rham or singular cohomology groups."),
  I("function-by-resummation", "The function itself (by resummation)", "identity", "function", "The decomposed pieces sum back to the original function."),
  I("spatial-locality", "Spatial locality", "analytic", "field", "Support or concentration in physical space."),
  I("instantaneous-locality", "Instantaneous locality", "analytic", "evolution", "An effect at time t depends only on the source at time t."),
  I("linearity", "Linearity", "algebraic", "operation", "Superposition: the response to a sum is the sum of the responses."),
  I("causality", "Causality", "analytic", "evolution", "Only earlier times contribute to the state at a given time."),
  // Differential geometry
  I("leibniz-rule", "Leibniz rule", "algebraic", "operation", "The product rule for derivations."),
  I("tensoriality", "Tensoriality", "algebraic", "operation", "Linearity over smooth functions (C-infinity linearity) in an argument."),
  I("flatness", "Flatness", "geometric", "connection", "Vanishing curvature: covariant derivatives commute."),
];

// What each linked entry takes and returns, in carrier kinds, with the phrase from its input and output fields.
const A = (entry, input, output, inputPhrase, outputPhrase) => ({ entry, input, output, inputPhrase, outputPhrase });
const ACTS_ON = [
  A("D2-117", ["variety"], ["variety"], "Variety X", "Bl_Z(X)"),
  A("D2-118", ["variety"], ["variety"], "Variety X", "Y with E collapsed"),
  A("D2-X01", ["surface", "curve"], ["curve"], "Surface X, curve C", "Strict transform C'"),
  A("D4-048", ["point-cloud"], ["simplicial-set"], "Point cloud", "Cech complex"),
  A("D4-264", ["category"], ["simplicial-set"], "Small category", "Simplicial set"),
  A("D4-075", ["space"], ["space"], "Topological space", "Cone CX"),
  A("D7-068", ["category"], ["functor"], "Category C", "Reflector L"),
  A("D7-288", ["topos"], ["topos"], "Topos E", "Subtopos"),
  A("D7-284", ["functor"], ["functor"], "Geometric morphism", "Triple"),
  A("D7-X01", ["level"], ["level"], "a level i", "The least level j"),
  A("D6-X01", ["function", "field"], ["function", "field"], ["Function f", "a field on a domain"], "Band pieces"),
  A("D4-176", ["form"], ["form"], "k-forms", "Orthogonal decomposition"),
  A("D6-X02", ["evolution", "field"], ["field"], ["Linear evolution operator", "source f(s)"], "The solution u(t)"),
  A("D4-086", ["vector-field", "connection"], ["vector-field"], "Vector fields", "Covariant derivative"),
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
  // Links where the entry's own field is silent, justified by receipts.
  { entry: "D2-X01", field: "preserved", invariant: "birational-type", note: "The strict transform maps to the curve isomorphically away from the blown-up point, so the two curves are birational.",
    receipts: [{ file: "excerpts/wikipedia-resolution-of-singularities.txt", quote: "is an isomorphism away from the singular points" }] },
  { entry: "D6-X01", field: "preserved", invariant: "linearity", note: "Each band piece is a Fourier multiplier applied to f, hence linear in f.",
    receipts: [{ file: "excerpts/wikipedia-littlewood-paley-multiplier.txt", quote: "\\hat f_\\rho := \\chi_\\rho\\hat f" }] },
  { entry: "D4-176", field: "preserved", invariant: "linearity", note: "The decomposition is given by orthogonal projections, which are linear.",
    receipts: [{ file: "excerpts/wikipedia-hodge-projection.txt", quote: "be the orthogonal projection" }] },
  { entry: "D7-284", field: "output", invariant: "skeletal-objects", note: "An essential inclusion's adjoint triple yields the skeleton modality, whose fixed objects are the level's skeleta.",
    receipts: [{ file: "excerpts/nlab-aufhebung-modalities.txt", quote: "yields two [[adjoint modalities]]" }] },
];

module.exports = { CARRIERS, INVARIANTS, RELATIONS, ACTS_ON, LINKS };
