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
const X = (src, quote, note) => ({ verdict: "wrong", src, quote, note });
const U = (note) => ({ verdict: "unsupported", note });
const M = (path) => `https://raw.githubusercontent.com/leanprover-community/mathlib4/380f2aafb622cb2c1c93dac545b6389083c68c51/${path}`;
const USE = "Requested by a composite; receipted.";
const CITE = "Citation pass 1: entries with a Mathlib counterpart, graded against a source and linked in mapfill/formal.js.";

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
  // Citation pass 1.
  t("D1-003", CITE, { l: W("Line_graph") }, {
    name: C("l", "the line graph of an undirected graph"),
    description: C("l", "only four behaviors are possible for this sequence",
      "Every claim checks: edges become vertices, adjacency is sharing an endpoint, an Euler cycle gives a Hamiltonian line graph, iteration has four behaviours, and Whitney's theorem with the K_3 and K_{1,3} exception."),
    input: C("l", "the line graph of an undirected graph"),
    output: C("l", "their corresponding edges share a common endpoint"),
    preserved: I("l", "not all Hamiltonian cycles in line graphs come from Euler cycles in this way",
      "Edge count becoming vertex count is right. \"Eulerian translates to Hamiltonian\" holds one way only: an Eulerian graph has a Hamiltonian line graph, but a Hamiltonian line graph need not come from an Eulerian graph."),
    broken: C("l", "and the number of edges of", "The source gives the line graph's vertex and edge counts from the original's, which change as the entry says."),
  }),
  t("D1-059", CITE, { d: W("Dual_matroid") }, {
    name: C("d", "the dual of a matroid"),
    description: C("d", "These two operations are dual", "The complement description of bases, the deletion and contraction duality, and the planar-graph statement all check."),
    input: C("d", "the dual of a matroid"),
    output: C("d", "its basis sets are the complements of the basis sets of"),
    preserved: C("d", "the matroids representable over any other field, and the regular matroids, are all self-dual families",
      "Same ground set and the matroid axioms are stated in the same article; representability over a field passes to the dual."),
    broken: C("d", "then the rank function of the dual matroid is", "r*(E) = |E| - r(E), the entry's rank formula, at S = E."),
  }),
  t("D1-099", CITE, { g: W("Galois_connection") }, {
    name: C("g", "we will refer to them as (monotone) Galois connections and antitone Galois connections"),
    description: X("g", "are the associated closure operators; they are monotone idempotent maps with the property",
      "The entry states antitone maps but gives the monotone convention's second inequality, f(g(b)) <= b. For an antitone connection the source gives b <= FG(b). As written the definition is neither convention. The claim about matroid flats is not checked."),
    input: C("g", "be two partially ordered sets."),
    output: C("g", "monotone Galois connections are special cases of pairs of adjoint functors",
      "Adjunction is the monotone reading; an antitone connection is an adjunction between one poset and the other's opposite."),
    preserved: C("g", "are the associated closure operators; they are monotone idempotent maps with the property",
      "Right for the antitone convention the entry names: both composites are closure operators. In the monotone convention one is a kernel operator."),
    broken: C("g", "every Galois connection gives rise to an isomorphism of certain sub-posets",
      "Only the closed elements correspond; the rest of the order is not preserved."),
  }),
  t("D2-031", CITE, { m: W("Mellin_transform") }, {
    name: C("m", "the Mellin transform is an integral transform"),
    description: C("m", "may be regarded as the multiplicative version of the two-sided Laplace transform"),
    input: C("m", "the Mellin transform is an integral transform", "The transform takes a function on the positive reals; Mathlib's definition integrates over (0, infinity)."),
    output: C("m", "is defined to be the largest open strip on which it is defined"),
    preserved: I("m", "which is invariant under dilation",
      "Multiplicative convolution to product is right. \"Scale invariance\" is loose: the measure dx/x is dilation invariant, but the transform is not; dilating f by a multiplies the transform by a^(-s) (the source's scaling row; Mathlib's mellin_comp_mul_left)."),
    broken: C("m", "which is translation invariant", "The two-sided Laplace transform is adapted to additive translation; the Mellin transform to dilation."),
  }),
  t("D2-103", CITE, { t: W("Tensor_product_of_modules") }, {
    name: C("t", "the tensor product of modules is a construction"),
    description: C("t", "The universal property of a tensor product has the following important consequence"),
    input: C("t", "can be carried out for a pair of modules over a commutative ring",
      "Over a noncommutative ring the construction pairs a right and a left module and yields an abelian group."),
    output: C("t", "the tensor product of modules is a construction"),
    preserved: C("t", "are always right exact functors", "Right exactness is stated; bilinear maps out of M x N become linear maps out of the product."),
    broken: I("t", "can be written, non-uniquely,",
      "\"Individual presentations\" is loose. What is lost is uniqueness: an element is a sum of pure tensors in many ways."),
  }),
  t("D3-033", CITE, { u: W("Ultraproduct") }, {
    name: C("u", "ultraproducts uses an index set"),
    description: C("u", "any first-order formula is true in the ultraproduct if and only if the set of indices"),
    input: C("u", "and an ultrafilter"),
    output: C("u", "which compares components only relative to the ultrafilter"),
    preserved: C("u", "any first-order formula is true in the ultraproduct if and only if the set of indices"),
    broken: C("u", "then the ultraproduct will again be well-founded",
      "The source's example shows a property that is not first-order, well-foundedness, surviving only under an extra hypothesis (sigma-completeness)."),
  }),
  t("D3-116", CITE, { s: W("Sheaf_(mathematics)") }, {
    name: C("s", "called the sheafification or sheaf associated to the presheaf"),
    description: C("s", "is the left adjoint functor to the inclusion functor"),
    input: C("s", "It takes a presheaf"),
    output: C("s", "produces a new sheaf"),
    preserved: I("s", "there is a unique morphism of sheaves",
      "The universal property is right. The sheaf condition is not preserved but produced: the input is a presheaf. On a presheaf that is already a sheaf, sheafification changes nothing (up to isomorphism)."),
    broken: C("s", "It turns out that there is a best possible way to do this",
      "Sheafification identifies sections that agree locally and adds sections glued from compatible local ones."),
  }),
  t("D4-153", CITE, { g: W("Gelfand%E2%80%93Naimark%E2%80%93Segal_construction") }, {
    name: C("g", "construction establishes a correspondence between cyclic"),
    description: C("g", "construction establishes a correspondence between cyclic"),
    input: C("g", "Given a state"),
    output: C("g", "with distinguished unit cyclic vector"),
    preserved: C("g", "with distinguished unit cyclic vector",
      "The state is recovered as the vector state of the cyclic vector. Mathlib's GNS file lists this recovery as future work at the pinned commit."),
    broken: U("\"Abstract algebra\" names no invariant. What a single state's representation can lose is faithfulness (it may have a kernel); the source does not say so on the lines checked."),
  }),
  t("D4-264", CITE, { n: W("Nerve_(category_theory)"), m: M("Mathlib/AlgebraicTopology/SimplicialSet/NerveAdjunction.lean") }, {
    name: C("n", "of a small category C is a simplicial set"),
    description: C("n", "consists of the k-tuples of composable morphisms"),
    input: C("n", "of a small category C is a simplicial set"),
    output: C("n", "of a small category C is a simplicial set"),
    preserved: I("m", "is fully faithful, demonstrating that",
      "The category is recoverable for every small category, not only for groupoids: the nerve functor is fully faithful (Mathlib, CategoryTheory.nerveFunctor.fullyfaithful)."),
    broken: X("n", "does not erase or otherwise disregard morphisms obtained by composition",
      "Nothing is broken: composition is recorded by the 2-simplices, and the nerve functor is fully faithful. What the nerve adds is higher simplices, which are determined by the 2-simplices."),
  }),
  t("D7-157", CITE, { n: W("Normal_closure_(group_theory)") }, {
    name: C("n", "the normal closure of a subset"),
    description: C("n", "is the smallest normal subgroup of G containing S", "The field-extension reading is a separate construction with its own article."),
    input: C("n", "the normal closure of a subset"),
    output: C("n", "is the smallest normal subgroup of G containing S"),
    preserved: C("n", "is the smallest normal subgroup of G containing S"),
    broken: C("n", "is the subgroup generated by the set", "It is generated by all conjugates of elements of S, so S and its conjugates are not told apart."),
  }),
  t("D8-107", CITE, { j: W("Jordan_normal_form") }, {
    name: C("j", "its Jordan normal form is also called the Jordan normal form of"),
    description: C("j", "This condition is always satisfied if K is algebraically closed"),
    input: C("j", "Any square matrix has a Jordan normal form if the field of"),
    output: C("j", "The Jordan normal form is obtained by some similarity transformation"),
    preserved: C("j", "is called the algebraic multiplicity of", "Similar matrices share eigenvalues with their multiplicities, and the form is a similarity invariant."),
    broken: C("j", "its Jordan normal form is very sensitive to perturbations"),
  }),
];

module.exports = { TARGETED };
