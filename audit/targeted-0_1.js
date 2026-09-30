// Role: targeted receipts. Grades for map entries outside the random sample, receipted because a
//   composite anchors on them. Same grading rules as audit/grades-0_1.js; kept out of the sample's error
//   estimates, since entries chosen for use are not a random draw.
// Contract: exports TARGETED = [{ id, why, sources: { key: url }, fields: { name, description, input,
//   output, preserved, broken: { verdict, src?, quote?, note? } } }]. Checked by scripts/audit.mjs; quotes
//   checked live by --verify-quotes, like the sample's.
// Invariant: data only. Grades are claims about entries, never edits to them.
"use strict";

const C = (src, quote, note) => ({ verdict: "confirmed", src, quote, ...(note ? { note } : {}) });
const I = (src, quote, note) => ({ verdict: "imprecise", src, quote, note });
const t = (id, why, sources, fields) => ({ id, why, sources, fields });
const W = (x) => `https://en.wikipedia.org/w/index.php?action=raw&title=${x}`;
const N = (x) => `https://ncatlab.org/nlab/source/${x}`;
const USE = "Requested by a composite; receipted.";

const TARGETED = [
  t("D2-117", USE, { b: W("Blowing_up") }, {
    name: C("b", "blowing up or blowup is a type of geometric transformation"),
    description: I("b", "which replaces a subspace of a given space with the space of all directions pointing out of that subspace",
      "The locus need not be singular: any closed subscheme (or submanifold) can be blown up. \"Fundamental birational surgery\" is right: the source calls blowups the most fundamental transformation in birational geometry."),
    input: C("b", "let X be a scheme, and let", "The general input is a scheme with a coherent sheaf of ideals; a variety with a closed subvariety is the classical case."),
    output: C("b", "to replace the blow-up locus Z with the exceptional divisor E"),
    preserved: C("b", "is a birational mapping which, away from", "Birational, hence the same function field."),
    broken: C("b", "It is not difficult to show that E intersects itself negatively.",
      "What changes is more than local structure at Z: Z is replaced by a divisor of negative self-intersection (for a point on a surface, a (-1)-curve), and the topology changes (over C a connected sum with a reversed projective plane; over R a Moebius strip)."),
  }),
  t("D2-118", USE, { c: W("Castelnuovo%27s_contraction_theorem"), i: W("Intersection_theory") }, {
    name: C("c", "This contraction morphism is sometimes called a blowdown, which is the inverse operation of blowup."),
    description: C("c", "This contraction morphism is sometimes called a blowdown, which is the inverse operation of blowup."),
    input: I("c", "which means a smooth rational curve of self-intersection number",
      "\"Contractible exceptional\" hides the condition. On a smooth projective surface, contraction to a smooth point needs a (-1)-curve (Castelnuovo). Other curves contract, when they do, to singular points: a (-2)-curve to a Du Val point."),
    output: C("c", "has been contracted to one point"),
    preserved: C("c", "this morphism is an isomorphism outside"),
    broken: C("i", "-curve is the exceptional curve of some blow-up",
      "What is lost is recoverable: the contracted curve is the exceptional curve of the blow-up at its image point. The Stacks Project defines a contraction exactly so (Tag 0C5J: X is the blowing up of X' at x)."),
  }),
  t("D7-068", USE, { r: N("reflective+subcategory"), a: N("Aufhebung") }, {
    name: I("a", "whose reflection preserves finite limits",
      "In the nLab's usage (Lawvere's), a localization is a reflective subcategory whose reflector is left exact. A bare reflective subcategory is not yet a localization in that sense, and a composite built on this entry needs the left exact kind."),
    description: C("r", "The reflector in that case is the sheafification functor."),
    input: C("r", "A _reflective subcategory_ is a full subcategory"),
    output: C("r", "The left adjoint is sometimes called the __reflector__"),
    preserved: C("r", "A reflective subcategory is always closed under limits which exist in the ambient category"),
    broken: C("r", "When the unit of the reflector is a monomorphism",
      "The unit can add (a monomorphism, as in completion) or kill (an epimorphism, as in abelianization); the entry's gloss holds."),
  }),
  t("D7-284", USE, { e: N("essential+geometric+morphism") }, {
    name: C("e", "it is an **essential geometric morphism** if the"),
    description: C("e", "but also a left adjoint"),
    input: C("e", "Given a geometric morphism"),
    output: C("e", "f_! \\dashv f^* \\dashv f_*"),
    preserved: C("e", "of an essential geometric morphism preserves small limits since it is a right adjoint",
      "Limits because the inverse image is now a right adjoint; colimits because it was already a left adjoint."),
    broken: I("e", "is essential iff $f^\\ast$ preserves small limits iff $f^\\ast$ preserves small products",
      "Essentiality is a property of the geometric morphism (a condition on its inverse image, with the extra left adjoint determined up to isomorphism), not extra structure. \"Nothing is broken\" stands."),
  }),
  t("D7-288", USE, { l: N("Lawvere-Tierney+topology") }, {
    name: C("l", "a closure operator given by a left exact idempotent monad on the internal meet-semilattice"),
    description: C("l", "a closure operator given by a left exact idempotent monad on the internal meet-semilattice",
      "Inflationary and idempotent (a monad on the truth values), meet-preserving (left exact): the entry's three conditions."),
    input: C("l", "a Lawvere-Tierney topology on $E$, the inclusion"),
    output: C("l", "is itself a topos"),
    preserved: C("l", "which has a left exact left adjoint functor", "Sheafification, the left adjoint, preserves finite limits: the inclusion of j-sheaves is a geometric embedding, the left exact localization a composite built on this entry needs."),
    broken: C("l", "which amounts to the same thing as a natural closure operator on subobjects", "Subobjects with the same closure are identified among the j-sheaves: the truth values j collapses."),
  }),
  t("D4-176", USE, { h: W("Hodge_theory"), z: W("Helmholtz_decomposition") }, {
    name: C("h", "A variant of the Hodge theorem is the Hodge decomposition."),
    description: C("h", "The Hodge decomposition is a generalization of the Helmholtz decomposition for the de Rham complex.",
      "The map's formula is the standard one; for vector fields in three dimensions it is the Helmholtz (Leray) decomposition used in the Navier-Stokes cascade."),
    input: C("h", "on a closed Riemannian manifold as a sum of three parts in the form"),
    output: C("h", "this gives an orthogonal direct sum decomposition"),
    preserved: C("z", "has an orthogonal decomposition", "The L^2 orthogonality of gradient and curl parts is the invariant the PDE program uses: a pressure gradient pairs to zero with any curl."),
    broken: I("h", "there is a unique decomposition of any differential form",
      "A decomposition breaks nothing: it is an isomorphism onto the direct sum. What loses information is projecting onto one part (as the Leray projection discards the gradient part)."),
  }),
];

module.exports = { TARGETED };
