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
  // Batch 2: D7-026 to D7-050, written 2026-11-07 before the batch's sources were fetched.
  k("D7-026", 2, "Standard (Brian Day)", "Extends a monoidal structure on a small C to presheaves by a coend formula", "A small monoidal (or promonoidal) category", "A closed monoidal structure on presheaves", "Yoneda strong monoidal; symmetry", "Nothing stated in sources I recall"),
  k("D7-027", 2, "Standard (Isbell)", "An adjunction between presheaves and the opposite of copresheaves, O left of Spec", "A small category and a presheaf or copresheaf", "Its Isbell conjugate", "Representables are fixed; equivalence on the fixed points (reflexive objects)", "Non-reflexive objects"),
  k("D7-028", 2, "Standard", "Reverse all morphisms; every statement dualizes", "A category", "Its opposite", "Objects and hom-sets with reversed direction", "Direction: limits become colimits"),
  k("D7-029", 2, "Standard", "Category of T-algebras; the terminal adjunction resolving T", "A monad", "Algebras with free-forgetful adjunction", "Limits created by the forgetful functor", "Colimits not created in general"),
  k("D7-030", 2, "Standard", "Free algebras: morphisms X to T Y, the initial resolution", "A monad", "Kleisli category with adjunction", "The monad; computational effects (Moggi)", "Non-free algebras"),
  k("D7-031", 2, "Standard", "Adjunctions inducing T form a category, Kleisli initial, Eilenberg-Moore terminal", "A monad", "An adjunction", "The monad", "Uniqueness of the adjunction"),
  k("D7-032", 2, "Standard", "Dual", "A comonad", "An adjunction", "The comonad", "Uniqueness"),
  k("D7-033", 2, "Standard (Beck)", "A right adjoint is monadic iff it reflects isomorphisms and creates coequalizers of G-split pairs", "An adjunction", "Equivalence with the Eilenberg-Moore category, or failure", "Algebraic structure", "Nothing"),
  k("D7-034", 2, "Standard (Lawvere 1963)", "A category with finite products generated by one object; models are product-preserving functors to Set", "A Lawvere theory", "Category of models", "The variety; models in any category with finite products", "The presentation"),
  k("D7-035", 2, "Standard", "Formally inverts W; universal functor sending W to isomorphisms", "A category and a class W", "C[W^-1] with localization functor", "Objects; universal property", "Hom-sets may be large"),
  k("D7-036", 2, "Standard (Gabriel-Zisman)", "Ore-type conditions make morphisms roofs (spans) with an equivalence", "A category and W admitting a calculus of fractions", "Explicit C[W^-1]", "Finite limits or colimits by the localization functor, depending on the side", "Nothing beyond the localization"),
  k("D7-037", 2, "Standard (Gabriel and Zisman 1967)", "General construction of C[W^-1] by zigzags", "A category and W", "Category of fractions", "Objects; universal property", "Local smallness"),
  k("D7-038", 2, "Standard (Meijer, Fokkinga, Paterson)", "The unique algebra map from the initial algebra: a fold", "Initial algebra and an algebra", "The unique map", "Fusion laws", "The structure is collapsed"),
  k("D7-039", 2, "Standard", "The unique coalgebra map into the terminal coalgebra: an unfold", "Terminal coalgebra and a coalgebra", "The unique map", "Behaviour", "Identity of states beyond behaviour"),
  k("D7-040", 2, "Standard", "An unfold followed by a fold, fused (no intermediate structure)", "A coalgebra and an algebra", "A map A to B", "The result", "Termination in general"),
  k("D7-041", 2, "Standard (Meertens)", "Fold that also sees the substructures: primitive recursion", "Initial algebra and an algebra on F(mu F x A)", "Map mu F to A", "Access to substructures", "Nothing"),
  k("D7-042", 2, "Standard (Vene and Uustalu)", "Dual of paramorphism: unfold that can stop early", "Coalgebra A to F(nu F + A)", "Map A to nu F", "Early termination", "Nothing"),
  k("D7-043", 2, "Several notions: product of categories, Deligne and Kelly tensor products", "Universal bilinear (right exact in each variable) product", "Categories, linear or finitely cocomplete", "Tensor product category", "Universal property", "Unclear"),
  k("D7-044", 2, "Standard", "Objects functors, morphisms natural transformations", "Categories C (small) and D", "Functor category", "Limits and colimits computed pointwise", "Size if C is large"),
  k("D7-045", 2, "Standard (Lawvere)", "Objects (a, b, h: F a to G b), morphisms commuting squares; slices and arrow categories as cases", "Functors F and G into C", "Comma category with projections", "Universal property", "Nothing"),
  k("D7-046", 2, "Standard", "Objects over X", "A category and an object", "Slice category", "A slice of a topos is a topos", "The terminal object becomes id_X"),
  k("D7-047", 2, "Standard", "Objects under X; pointed sets for X = 1", "A category and an object", "Coslice", "Colimits created", "Initial object becomes id_X"),
  k("D7-048", 2, "Standard", "Quotient of hom-sets by a congruence, objects kept", "A category with a congruence", "Quotient category with a full functor", "Objects", "Distinctions between congruent morphisms"),
  k("D7-049", 2, "Standard", "One object per isomorphism class; equivalent to C (uses choice)", "A category", "Its skeleton", "Everything invariant under equivalence", "The choice of representatives"),
  k("D7-050", 2, "Standard", "The maximal subgroupoid: all objects, only isomorphisms", "A category", "Its core", "Objects, isomorphisms", "Non-invertible morphisms"),
];

module.exports = { RECALL };
