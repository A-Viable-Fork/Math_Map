// Role: rulings on the disagreements of the second readings of packet-0_1.
// Contract: exports RULINGS = { itemId: { side, note } }. side: "reader" (the map's grade is changed to the
//   reader's; mapfill/formal.js carries the new grade) or "map" (the map's grade stands; the note says why).
//   Every disagreement in reports/SECOND-READING.md shows its ruling; scripts/blind.mjs checks that a
//   "reader" ruling matches the current grade and a "map" ruling keeps the packet-time grade.
// Invariant: data only. Rulings are provisional, by the first grader, and marked so; the user may overrule.
"use strict";

const R = (note) => ({ side: "reader", note }), K = (note) => ({ side: "map", note });

const RULINGS = {
  F007: R("The unit inequality is one clause of the definition, not the definition."),
  F010: R("Scaling gives covariance (a factor a^-s), not invariance; the declaration neighbours the claim."),
  F011: R("Only the uniqueness half of the universal property."),
  F016: R("The nerve functor does state the output: a small category goes to its nerve, a simplicial set."),
  F020: R("The declaration makes the sigma-finiteness hypothesis explicit: a special case of the input as written."),
  F022: K("monadicOfReflective is the premise half of a two-link argument with monadicCreatesLimits; general, with the premise recorded, is the map's convention, which the packet does not show."),
  F025: R("Only the minimality half of 'smallest normal subgroup containing S'."),
  F032: K("A general theorem applied through a recorded premise (the functor is a right adjoint in the triple), a mechanism the packet does not show; the claim is also proved in lean/ (Level.reflector_preservesLimits)."),
  F033: K("As F032, for colimits (Level.reflector_preservesColimits)."),
  F036: R("The declaration covers any contracted set; the entry's single element is the case C = {e}."),
  F037: R("As F036: stated for any set X."),
  F041: R("The corrected output states the condition (S the complement of a prime), so the declaration states it exactly."),
  F045: R("The lift gives the universal property, not minimality as stated."),
  F047: R("QuotientAction is more general than left multiplication on cosets."),
  F048: R("The index is defined as the cardinality of G/H: exactly the preserved sub-claim."),
  F054: R("Injectivity under cancellation is the converse direction of the claim about non-cancellative monoids."),
  F056: R("The declaration defines the connecting map, the preserved sub-claim."),
  F057: R("Mathlib's five lemma is for groups (and modules): a special case of the abelian-category statement, though with sharper hypotheses."),
  F058: R("Finitely generated generalizes the entry's finite structures."),
  F063: R("The minor relation is the output."),
  F064: R("Transitivity neighbours the description; it does not state it."),
  F066: K("The landed input is a perfect field, over which semisimple is not diagonalizable (a rotation of the real plane); the reader's argument needs an algebraically closed field. The conflict stands."),
  F067: R("The corrected description states the injectivity condition, which the declaration states exactly."),
  F073: R("The declaration only wraps objects; the category structure is separate. The link no longer makes D2-154's output formal."),
  F074: R("The adjunction recovers the monad; it does not state the free-algebra claim."),
  F078: R("VectorBundleCore is the transition-function data, the ingredient; the bundle it yields is separate."),
  F085: R("Density neighbours the broken claim without stating it."),
};

module.exports = { RULINGS };
