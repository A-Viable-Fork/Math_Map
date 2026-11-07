// Role: the fill review's recalled expectations. For each fill under review, what the reviewer expected each
//   field to say, written from memory after reading the fill and its landed name and before any source was
//   fetched for that batch.
// Contract: exports RECALL = [{ id, batch, name, description, input, output, preserved, broken }], one per
//   entry of audit/fill-review-0_1.js. Every field is a recalled claim: a lead, never evidence. The review
//   records, per entry, the fields whose recall a source contradicted (contra), and reports/FILL-REVIEW.md
//   gives that rate per batch: a reading of how far fills written the same way can be trusted.
// Invariant: data only, and never revised after its batch's sources are read; a recall shown wrong stays as
//   written.
"use strict";

const k = (id, batch, name, description, input, output, preserved, broken) => ({ id, batch, name, description, input, output, preserved, broken });

const RECALL = [
  // Batch 1: D7-001 to D7-025, written 2026-11-07 before the batch's sources were fetched.
  k("D7-001", 1, "Standard: a functor is a map of categories; applying it is the basic move", "F sends objects to objects and morphisms to morphisms, preserving identities and composition", "A functor F: C to D and an object or morphism of C", "The image object or morphism in D", "Identities, composition, hence commutative diagrams and isomorphisms", "Distinctions: a functor need not be faithful or full, and non-isomorphic objects can become isomorphic"),
  k("D7-002", 1, "Standard", "Components eta_X: F X to G X, one per object, with the naturality square commuting for every morphism", "Two parallel functors F, G: C to D", "A natural transformation, a morphism of the functor category", "Naturality; vertical composites of natural transformations are natural", "Invertibility: only a natural isomorphism has invertible components"),
  k("D7-003", 1, "Standard (left adjoint); construction via an adjoint functor theorem", "F left adjoint to G when Hom(F X, Y) is naturally isomorphic to Hom(X, G Y); unit and counit", "A functor G with a solution set condition (or representability of each Hom(X, G -))", "The left adjoint F with its unit", "Left adjoints preserve all colimits", "Limits are not preserved in general"),
  k("D7-004", 1, "Standard", "Dual: G right adjoint to F, counit F G to 1", "A functor F (dual hypotheses)", "The right adjoint G with counit", "Right adjoints preserve all limits", "Colimits in general"),
  k("D7-005", 1, "Standard", "Lan_K F: D to E with a universal transformation F to Lan_K F after K; pointwise a colimit over the comma category (K over d)", "Functors F: C to E and K: C to D, with E having the colimits needed", "Functor D to E with unit", "Universal property; F itself when K is fully faithful (the unit is an isomorphism)", "Nothing determined off the image of K except by the colimit formula"),
  k("D7-006", 1, "Standard", "Dual: Ran_K F with a counit, pointwise a limit over (d over K)", "F and K, E with the needed limits", "Functor D to E with counit", "Universal property; dual statements", "Dual"),
  k("D7-007", 1, "Standard", "c goes to the representable Hom(-, c); full and faithful by the Yoneda lemma", "A locally small category C", "The presheaf category with the embedding", "Full faithfulness; limits (the embedding preserves limits)", "Colimits: the embedding does not preserve colimits; it is the free cocompletion"),
  k("D7-008", 1, "Co-Yoneda lemma or density theorem: every presheaf is a colimit of representables", "A presheaf is the colimit of representables over its category of elements; coend formula", "A presheaf F on C", "A colimit presentation of F", "F up to isomorphism", "Nothing lost; the presentation is canonical and large"),
  k("D7-009", 1, "Standard", "From a functor C to Cat (or pseudofunctor) to a fibration over C whose objects are pairs (c, x in F c)", "A (pseudo)functor F: C^op to Cat", "A Grothendieck fibration over C", "F recovered as the fibres; an equivalence between indexed categories and fibrations", "The indexed presentation becomes a single category"),
  k("D7-010", 1, "Standard", "The limit of a diagram: a universal cone", "A diagram J to C", "A limit object with projections", "Uniqueness up to unique isomorphism; preserved by right adjoints", "Information outside the universal cone"),
  k("D7-011", 1, "Standard", "The colimit: a universal cocone", "A diagram J to C", "A colimit object with coprojections", "Preserved by left adjoints", "Identifications made by the gluing"),
  k("D7-012", 1, "Standard", "Limit of a cospan; fibre product", "A cospan X to Z from Y", "Object with two projections making the square commute", "Universal property; monomorphisms are stable under pullback", "Elements not over a common point"),
  k("D7-013", 1, "Standard", "Colimit of a span; amalgamation, gluing", "A span", "Object with two coprojections", "Universal property; epimorphisms stable under pushout", "Distinctness of the two images of Z"),
  k("D7-014", 1, "Standard", "Limit of a parallel pair; the equalizer is a monomorphism", "f, g: X to Y", "E with e: E to X, f e = g e", "e is a (regular) monomorphism", "Points where f and g differ"),
  k("D7-015", 1, "Standard", "Colimit of a parallel pair; the coequalizer is an epimorphism", "f, g: X to Y", "Q with q: Y to Q, q f = q g", "q is a (regular) epimorphism", "Distinctions identified"),
  k("D7-016", 1, "Standard", "Limit of a discrete diagram, with projections", "A family of objects", "Product with projections", "Universal property, componentwise maps", "Nothing particular"),
  k("D7-017", 1, "Standard", "Colimit of a discrete diagram; disjoint union in Set", "A family of objects", "Coproduct with injections", "Universal property", "Nothing particular"),
  k("D7-018", 1, "Nonstandard as an operation; Cartesian closed category is standard", "Finite products and exponentials; currying Hom(A x B, C) to Hom(A, C^B) and evaluation", "A Cartesian closed category", "Curried morphisms or evaluations", "The currying bijection; CCCs model simply typed lambda calculus", "Nothing (bijection)"),
  k("D7-019", 1, "Standard", "Exponential B^A with evaluation, right adjoint to - x A", "Objects in a category with binary products", "Exponential object with evaluation map", "Universal property of evaluation", "Exists only when the product functor has a right adjoint"),
  k("D7-020", 1, "Subobject classifier is standard; evaluation is the characteristic map", "Every mono is the pullback of true: 1 to Omega along a unique chi", "A topos and a monomorphism", "Characteristic map to Omega", "Sub(X) isomorphic to Hom(X, Omega); Omega an internal Heyting algebra", "Classical logic in general"),
  k("D7-021", 1, "Standard (Lawvere)", "Completion under absolute colimits; for ordinary categories the idempotent splitting; for metric spaces the Cauchy completion", "A (V-enriched) category", "Cauchy complete category", "Presheaf categories equivalent (Morita equivalence)", "Nothing lost; objects added"),
  k("D7-022", 1, "Standard", "Objects are pairs (X, e) with e idempotent; maps f with f = e' f e", "A category", "Its Karoubi envelope with fully faithful embedding", "Presheaves; Morita equivalence", "Nothing; adds splittings"),
  k("D7-023", 1, "Standard; the same as the Karoubi envelope", "Freely split idempotents", "A category", "Idempotent complete category", "As Karoubi", "As Karoubi"),
  k("D7-024", 1, "Freyd's general adjoint functor theorem; the name is not standard as a construction", "A limit-preserving G with complete locally small domain and a solution set has a left adjoint", "G: D to C, D complete and locally small, G continuous, solution set", "Left adjoint F", "Limit preservation of G", "Explicit formula"),
  k("D7-025", 1, "Standard (Dedekind-MacNeille)", "Smallest complete lattice containing the poset, by cuts", "A poset", "Complete lattice with order embedding", "Existing joins and meets; join-dense and meet-dense embedding", "Distributivity need not survive (Funayama)"),
];

module.exports = { RECALL };
