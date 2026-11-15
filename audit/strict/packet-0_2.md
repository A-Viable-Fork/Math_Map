# Strict second reading, packet 0.2

*Generated once by `node scripts/strict.mjs --sample`. Shows the fill text and the excerpt files named for each entry; never the review's grade, quote or note.*

Rule [ruling: operator, 2026-11-13]: **confirmed** only when a quoted window states the field's claim itself, not merely names the object or operation; a claim with several parts is confirmed only if every part is quoted, otherwise **imprecise** (a part missing or a detail off) or **unsupported** (no window states the claim), saying which part is missing. **wrong** when a window contradicts it.

## S001: D7-017, broken

- Entry: Coproduct Formation
- Field: **broken**: Nothing is identified; relations between summands are absent
- Whole fill: description: Forms the colimit of a discrete family: the object receiving each summand, morphisms out of it determined summandwise. | input: Family of objects (X_i) | output: Coproduct sum X_i with injections | preserved: Each summand embeds (in extensive categories, disjointly) | broken: Nothing is identified; relations between summands are absent
- Excerpt files: `excerpts/nlab-coproduct.txt`

## S002: D7-279, broken

- Entry: Topos Internalization
- Field: **broken**: Classical principles: excluded middle, choice
- Whole fill: description: Reinterprets a mathematical construction inside a topos using its internal (intuitionistic, higher-order) language. | input: Construction stated constructively; topos E | output: Internal object or theorem in E | preserved: Constructive validity (Kripke-Joyal soundness) | broken: Classical principles: excluded middle, choice
- Excerpt files: `excerpts/nlab-internal-logic.txt`

## S003: D7-233, broken

- Entry: Ext Functor Evaluation
- Field: **broken**: Nothing
- Whole fill: description: Computes Ext^n(M, N), the right derived functors of Hom; Ext^1 classifies extensions. | input: Modules M, N | output: Groups Ext^n(M, N) | preserved: Balanced; Yoneda product | broken: Nothing
- Excerpt files: `excerpts/wikipedia-ext-functor.txt`, `excerpts/mathlib-Mathlib.Algebra.Homology.DerivedCategory.Ext.Basic.txt`

## S004: D7-062, broken

- Entry: Pointwise Extension
- Field: **broken**: Non-equational properties (for example total order, fields become rings)
- Whole fill: description: Extends a structure on a codomain to functions into it, componentwise: (f + g)(x) = f(x) + g(x). Pointwise Kan extensions compute values by (co)limits over comma categories. | input: Operation or structure on D; functions or functors into D | output: Same structure on the function space or functor category | preserved: Equational laws valid in D | broken: Non-equational properties (for example total order, fields become rings)
- Excerpt files: `excerpts/wikipedia-pointwise.txt`

## S005: D7-239, broken

- Entry: Betti Number Extraction
- Field: **broken**: Torsion; ring structure
- Whole fill: description: Computes ranks of homology groups. | input: Space or complex | output: Betti numbers b_n | preserved: Rational homology | broken: Torsion; ring structure
- Excerpt files: `excerpts/wikipedia-betti-number.txt`

## S006: D7-360, output

- Entry: Braided Operad Transformation
- Field: **output**: Braided operad
- Whole fill: description: Replaces symmetric groups by braid groups in the equivariance; algebras live in braided monoidal categories. | input: Operad data | output: Braided operad | preserved: Braid-group equivariance | broken: Symmetric equivariance
- Excerpt files: `excerpts/wikipedia-operad.txt`

## S007: D7-196, input

- Entry: Up-Set Generation
- Field: **input**: Poset P, subset S
- Whole fill: description: Forms the set of all elements above some element of S. | input: Poset P, subset S | output: Up-set up(S) | preserved: Order-filter structure | broken: Distinction of S from its upper closure
- Excerpt files: `excerpts/wikipedia-upper-set.txt`

## S008: D7-228, description

- Entry: Nine Lemma Reduction
- Field: **description**: In a 3x3 diagram with exact columns, exactness of two rows implies the third.
- Whole fill: description: In a 3x3 diagram with exact columns, exactness of two rows implies the third. | input: 3x3 commutative diagram | output: Exactness of the remaining row | preserved: Exactness | broken: Nothing
- Excerpt files: `excerpts/wikipedia-nine-lemma.txt`

## S009: D7-097, description

- Entry: Homomorphic Image Construction
- Field: **description**: Forms the image of an algebra under a surjective homomorphism, equivalently a quotient by its kernel congruence.
- Whole fill: description: Forms the image of an algebra under a surjective homomorphism, equivalently a quotient by its kernel congruence. | input: Algebra A, surjective homomorphism h: A to B | output: Algebra B = A/ker h | preserved: All identities of A | broken: Distinctions collapsed by the kernel
- Excerpt files: `excerpts/wikipedia-homomorphism.txt`, `excerpts/wikipedia-variety-universal-algebra.txt`

## S010: D7-233, output

- Entry: Ext Functor Evaluation
- Field: **output**: Groups Ext^n(M, N)
- Whole fill: description: Computes Ext^n(M, N), the right derived functors of Hom; Ext^1 classifies extensions. | input: Modules M, N | output: Groups Ext^n(M, N) | preserved: Balanced; Yoneda product | broken: Nothing
- Excerpt files: `excerpts/wikipedia-ext-functor.txt`, `excerpts/mathlib-Mathlib.Algebra.Homology.DerivedCategory.Ext.Basic.txt`

## S011: D7-194, output

- Entry: Interior Operator Application
- Field: **output**: Open element
- Whole fill: description: Applies a contractive, monotone, idempotent operator: topological interior, modal necessity (S4). | input: Poset or power set, interior operator | output: Open element | preserved: Order; open elements form a lattice | broken: Boundary information
- Excerpt files: `excerpts/wikipedia-interior-algebra.txt`

## S012: D7-119, description

- Entry: Galois Connection Formulation
- Field: **description**: Establishes an antitone (or monotone adjoint) pair between two posets, f(a) <= b iff a <= g(b), giving closure operators on each side and a bijection of closed elements.
- Whole fill: description: Establishes an antitone (or monotone adjoint) pair between two posets, f(a) <= b iff a <= g(b), giving closure operators on each side and a bijection of closed elements. | input: Posets P, Q, relation or maps f, g | output: Galois connection with closure operators | preserved: Order; closed elements correspond bijectively | broken: Non-closed elements (mapped to their closures)
- Excerpt files: `excerpts/wikipedia-galois-connection-r.txt`

## S013: D7-382, input

- Entry: Dagger Functor Inversion
- Field: **input**: Dagger category, morphism f
- Whole fill: description: Applies the involution f to f^dagger reversing morphisms (the Hilbert-space adjoint). | input: Dagger category, morphism f | output: Morphism f^dagger | preserved: Involution; composition reversed | broken: Direction
- Excerpt files: `excerpts/wikipedia-dagger-category.txt`

## S014: D7-347, output

- Entry: Topologically Enriched Category Formulation
- Field: **output**: Topologically enriched category
- Whole fill: description: Presents a category with spaces of morphisms. | input: Topological data | output: Topologically enriched category | preserved: Homotopy theory (via singular complex) | broken: Nothing
- Excerpt files: `excerpts/nlab-topologically-enriched-category.txt`

## S015: D7-124, broken

- Entry: Absorption Law Reduction
- Field: **broken**: Nothing
- Whole fill: description: Simplifies lattice expressions by a v (a ^ b) = a and a ^ (a v b) = a. | input: Lattice term | output: Shorter equal term | preserved: Value in every lattice | broken: Nothing
- Excerpt files: `excerpts/wikipedia-absorption-law.txt`

## S016: D7-196, broken

- Entry: Up-Set Generation
- Field: **broken**: Distinction of S from its upper closure
- Whole fill: description: Forms the set of all elements above some element of S. | input: Poset P, subset S | output: Up-set up(S) | preserved: Order-filter structure | broken: Distinction of S from its upper closure
- Excerpt files: `excerpts/wikipedia-upper-set.txt`

## S017: D7-128, broken

- Entry: Unary Operation Composition
- Field: **broken**: Nothing
- Whole fill: description: Composes unary operations, giving the monoid of unary term functions (the transformation monoid). | input: Unary operations f, g on A | output: Composite f o g | preserved: Associativity | broken: Nothing
- Excerpt files: `excerpts/wikipedia-transformation-semigroup.txt`

## S018: D7-013, name

- Entry: Pushout Construction
- Field: **name**: Pushout Construction
- Whole fill: description: Forms the colimit of a span X from Z to Y: X and Y glued along Z. Amalgamations, attaching cells, unions along an overlap. | input: Span X from Z to Y | output: Object X +_Z Y with injections | preserved: Universal property; epimorphisms stable under pushout | broken: Distinctness of the images of Z
- Excerpt files: `excerpts/nlab-pushout.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Limits.Shapes.Pullback.Mono.txt`

## S019: D7-052, preserved

- Entry: Braiding Isomorphism Application
- Field: **preserved**: Everything (it is an isomorphism); hexagon coherence
- Whole fill: description: Swaps tensor factors via the braiding b: X (x) Y to Y (x) X, satisfying the hexagon identities. | input: Braided monoidal category, objects X, Y | output: Isomorphism X (x) Y to Y (x) X | preserved: Everything (it is an isomorphism); hexagon coherence | broken: Symmetry: b twice need not be the identity
- Excerpt files: `excerpts/nlab-braided-monoidal-category.txt`

## S020: D8-201, description

- Entry: Square root transform
- Field: **description**: Applies y = sqrt(x), a variance-stabilizing transform for Poisson counts (Anscombe's variant sqrt(x + 3/8)).
- Whole fill: description: Applies y = sqrt(x), a variance-stabilizing transform for Poisson counts (Anscombe's variant sqrt(x + 3/8)). | input: Nonnegative data (counts) | output: Transformed data with near-constant variance | preserved: Order | broken: Additivity; original scale
- Excerpt files: `excerpts/wikipedia-variance-stabilizing.txt`, `excerpts/wikipedia-anscombe.txt`

## S021: D7-121, description

- Entry: J\u00f3nsson Lemma Application
- Field: **description**: In a congruence-distributive variety generated by K, every subdirectly irreducible member lies in HSP_U(K).
- Whole fill: description: In a congruence-distributive variety generated by K, every subdirectly irreducible member lies in HSP_U(K). | input: Congruence-distributive variety V(K) | output: Location of subdirectly irreducibles | preserved: Equational theory | broken: Nothing; it restricts where irreducibles can be
- Excerpt files: 

## S022: D7-072, description

- Entry: Exact Completion
- Field: **description**: Freely adds quotients of equivalence relations to a category with finite limits (or a regular category), producing an exact (Barr-exact) category.
- Whole fill: description: Freely adds quotients of equivalence relations to a category with finite limits (or a regular category), producing an exact (Barr-exact) category. | input: Category with finite limits (or regular category) | output: Exact category C_ex/lex or C_ex/reg with embedding | preserved: Finite limits; regular epis already present | broken: Nothing present; adds coequalizers of equivalence relations
- Excerpt files: `excerpts/nlab-regular-and-exact-completions.txt`

## S023: D7-146, broken

- Entry: Group Ring Construction
- Field: **broken**: Group structure is linearized (G is recoverable only in special cases)
- Whole fill: description: Forms R[G]: formal R-linear combinations of group elements with convolution product. Modules over it are representations. | input: Ring R, group G | output: Ring R[G] | preserved: Representations of G over R | broken: Group structure is linearized (G is recoverable only in special cases)
- Excerpt files: `excerpts/wikipedia-group-ring.txt`

## S024: D7-210, preserved

- Entry: Distributive Law Reduction
- Field: **preserved**: Value
- Whole fill: description: Uses x ^ (y v z) = (x ^ y) v (x ^ z) to normalize lattice terms. | input: Distributive lattice term | output: Normal form (join of meets) | preserved: Value | broken: Term shape
- Excerpt files: `excerpts/wikipedia-distributive-lattice.txt`

## S025: D7-024, broken

- Entry: Freyd's Adjoint Functor Construction
- Field: **broken**: Constructivity: the adjoint is a large limit, not an explicit formula
- Whole fill: description: Constructs a left adjoint to a continuous G from a small solution set, using limits in the domain (Freyd's General Adjoint Functor Theorem). | input: Continuous functor G: D to C, D complete and locally small, with solution sets | output: Left adjoint F: C to D | preserved: G's limit preservation; the adjunction bijection | broken: Constructivity: the adjoint is a large limit, not an explicit formula
- Excerpt files: `excerpts/nlab-adjoint-functor-theorem.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Adjunction.AdjointFunctorTheorems.txt`

## S026: D7-410, input

- Entry: Weyl's Complete Reducibility Transformation
- Field: **input**: Finite-dimensional representation
- Whole fill: description: Finite-dimensional representations of semisimple Lie algebras (compact groups) decompose into irreducibles. | input: Finite-dimensional representation | output: Direct sum of irreducibles | preserved: Character | broken: Extension data (split)
- Excerpt files: `excerpts/wikipedia-weyls-theorem-complete-reducibility.txt`

## S027: D7-394, preserved

- Entry: Trace Evaluation
- Field: **preserved**: Cyclicity; dimension
- Whole fill: description: Computes a categorical trace (feedback loop) in a traced monoidal category; the matrix trace in vector spaces. | input: Endomorphism with a traced output | output: Trace | preserved: Cyclicity; dimension | broken: Everything but the scalar or reduced map
- Excerpt files: `excerpts/wikipedia-traced-monoidal.txt`, `excerpts/nlab-traced-monoidal-category.txt`

## S028: D7-311, output

- Entry: Curry-Howard Correspondence Translation
- Field: **output**: Typed term (program)
- Whole fill: description: Translates proofs to programs and propositions to types (and to morphisms of a CCC: Curry-Howard-Lambek). | input: Natural deduction proof | output: Typed term (program) | preserved: Proof normalization equals evaluation | broken: Nothing
- Excerpt files: `excerpts/wikipedia-curry-howard-correspondence.txt`

## S029: D7-065, name

- Entry: Profunctor Composition
- Field: **name**: Profunctor Composition
- Whole fill: description: Composes profunctors P: A -/-> B and Q: B -/-> C by the coend (Q o P)(a, c) = integral^b Q(b, c) x P(a, b). | input: Profunctors P, Q | output: Profunctor Q o P | preserved: Associativity and units up to isomorphism (a bicategory) | broken: The middle variable b
- Excerpt files: `excerpts/nlab-profunctor.txt`

## S030: D7-269, output

- Entry: Hyperhomology Spectral Sequence
- Field: **output**: Two spectral sequences to hyperhomology
- Whole fill: description: The two spectral sequences of a double complex computing hyperderived functors of a complex. | input: Functor, complex of objects | output: Two spectral sequences to hyperhomology | preserved: Hyperderived functors | broken: Extension data
- Excerpt files: `excerpts/wikipedia-hyperhomology.txt`

## S031: D7-013, preserved

- Entry: Pushout Construction
- Field: **preserved**: Universal property; epimorphisms stable under pushout
- Whole fill: description: Forms the colimit of a span X from Z to Y: X and Y glued along Z. Amalgamations, attaching cells, unions along an overlap. | input: Span X from Z to Y | output: Object X +_Z Y with injections | preserved: Universal property; epimorphisms stable under pushout | broken: Distinctness of the images of Z
- Excerpt files: `excerpts/nlab-pushout.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Limits.Shapes.Pullback.Mono.txt`

## S032: D7-297, output

- Entry: Freyd Cover Construction
- Field: **output**: Glued topos (Set down Gamma E)
- Whole fill: description: Glues a topos along the global sections functor (Artin gluing, Sierpinski cone); proves disjunction and existence properties of intuitionistic logic. | input: Topos E | output: Glued topos (Set down Gamma E) | preserved: E as an open subtopos | broken: Nothing
- Excerpt files: `excerpts/nlab-freyd-cover.txt`

## S033: D7-015, output

- Entry: Coequalizer Construction
- Field: **output**: Object Q with epimorphism q: Y to Q
- Whole fill: description: Forms the universal q: Y to Q with q f = q g: the quotient forcing two maps to agree. | input: Parallel morphisms f, g: X to Y | output: Object Q with epimorphism q: Y to Q | preserved: Universal property; q is epic | broken: Distinctions between f(x) and g(x) in Y
- Excerpt files: `excerpts/nlab-coequalizer.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Limits.Shapes.Equalizers.txt`

## S034: D7-045, preserved

- Entry: Comma Category Construction
- Field: **preserved**: Universal 2-cell; limits where F preserves them
- Whole fill: description: Forms (F / G): objects (a, b, h: F a to G b), morphisms commuting squares. Generalizes slices, arrow categories, categories of elements. | input: Functors F: A to C, G: B to C | output: Comma category (F / G) with projections to A and B | preserved: Universal 2-cell; limits where F preserves them | broken: Nothing; it adds structure
- Excerpt files: `excerpts/nlab-comma-category.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Limits.Comma.txt`

## S035: D7-045, description

- Entry: Comma Category Construction
- Field: **description**: Forms (F / G): objects (a, b, h: F a to G b), morphisms commuting squares. Generalizes slices, arrow categories, categories of elements.
- Whole fill: description: Forms (F / G): objects (a, b, h: F a to G b), morphisms commuting squares. Generalizes slices, arrow categories, categories of elements. | input: Functors F: A to C, G: B to C | output: Comma category (F / G) with projections to A and B | preserved: Universal 2-cell; limits where F preserves them | broken: Nothing; it adds structure
- Excerpt files: `excerpts/nlab-comma-category.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Limits.Comma.txt`

## S036: D7-405, broken

- Entry: Highest Weight Representation
- Field: **broken**: Nothing
- Whole fill: description: Constructs or classifies irreducible representations by dominant integral highest weights. | input: Dominant weight | output: Irreducible representation | preserved: Weights | broken: Nothing
- Excerpt files: `excerpts/wikipedia-highest-weight-theorem.txt`

## S037: D7-175, preserved

- Entry: Supremum Evaluation
- Field: **preserved**: Order; universal property
- Whole fill: description: Computes the least upper bound (join) of a subset of a poset. | input: Poset P, subset S | output: sup S, if it exists | preserved: Order; universal property | broken: Individual elements of S
- Excerpt files: `excerpts/wikipedia-infimum-and-supremum.txt`

## S038: D7-156, output

- Entry: Sylow Subgroup Extraction
- Field: **output**: Sylow p-subgroup P
- Whole fill: description: Finds maximal p-subgroups of a finite group; they exist, are conjugate, and their number is 1 mod p and divides the index. | input: Finite group G, prime p | output: Sylow p-subgroup P | preserved: p-local structure; counts | broken: Structure at other primes
- Excerpt files: `excerpts/wikipedia-sylow-theorems.txt`

## S039: D7-043, input

- Entry: Tensor Product of Categories
- Field: **input**: Categories C, D, possibly enriched or cocomplete
- Whole fill: description: Forms a tensor of categories: for plain categories the Cartesian product C x D; for linear or locally presentable categories a universal bilinear or cocontinuous-in-each-variable product (Deligne, Kelly). | input: Categories C, D, possibly enriched or cocomplete | output: Category C (x) D | preserved: Bilinearity universal property; enrichment | broken: Individual structure of C and D is mixed
- Excerpt files: `excerpts/nlab-deligne-tensor-product-of-abelian-categories.txt`

## S040: D7-055, output

- Entry: Whiskering
- Field: **output**: Natural transformation alpha H or K alpha
- Whole fill: description: Composes a natural transformation with a functor on either side: (alpha H)_X = alpha_{H X} and (K alpha)_X = K(alpha_X). | input: Natural transformation alpha: F to G and functor H or K | output: Natural transformation alpha H or K alpha | preserved: Naturality | broken: Nothing
- Excerpt files: `excerpts/nlab-whiskering.txt`, `excerpts/wikipedia-natural-transformation.txt`

## S041: D3-184, input

- Entry: Stirling transform
- Field: **input**: Sequence (a_n)
- Whole fill: description: Transforms a sequence a_k to b_n = sum S(n, k) a_k with Stirling numbers of the second kind; the inverse uses the signed first kind. On exponential generating functions it is composition with e^x - 1. | input: Sequence (a_n) | output: Sequence (b_n) | preserved: Information (invertible) | broken: Nothing
- Excerpt files: `excerpts/wikipedia-stirling-transform.txt`

## S042: D7-226, input

- Entry: Snake Lemma Connecting Homomorphism
- Field: **input**: Commutative diagram of two short exact sequences
- Whole fill: description: From a map of short exact sequences, produces a six-term exact sequence of kernels and cokernels with a connecting map ker c to coker a. | input: Commutative diagram of two short exact sequences | output: Exact sequence ker a to ker b to ker c to coker a to coker b to coker c | preserved: Exactness | broken: Nothing; it produces new maps
- Excerpt files: `excerpts/wikipedia-snake-lemma.txt`

## S043: D7-035, description

- Entry: Localization of a Category
- Field: **description**: Formally inverts a class W of morphisms, C to C[W^-1], universal among functors sending W to isomorphisms.
- Whole fill: description: Formally inverts a class W of morphisms, C to C[W^-1], universal among functors sending W to isomorphisms. | input: Category C, class of morphisms W | output: Localized category C[W^-1] with localization functor | preserved: Universal property; objects | broken: Hom-set sizes and computability in general; distinctions made only by W-maps
- Excerpt files: `excerpts/nlab-localization.txt`, `excerpts/nlab-category-of-fractions.txt`

## S044: D7-136, output

- Entry: Krull Dimension Reduction
- Field: **output**: Ring of smaller dimension, or dim R
- Whole fill: description: Lowers dimension by quotienting by a parameter or localizing, or computes dim R as the supremum of lengths of prime chains. | input: Noetherian ring R | output: Ring of smaller dimension, or dim R | preserved: Chain structure of primes below | broken: One direction of the spectrum
- Excerpt files: `excerpts/wikipedia-krull-dimension.txt`

## S045: D7-086, description

- Entry: Abelianization of a Category
- Field: **description**: Embeds an additive or exact category in an abelian one (Freyd's abelian envelope, or the Freyd-Mitchell embedding for small abelian categories).
- Whole fill: description: Embeds an additive or exact category in an abelian one (Freyd's abelian envelope, or the Freyd-Mitchell embedding for small abelian categories). | input: Additive or exact category C | output: Abelian category A with embedding | preserved: Exact sequences of C (for exact embeddings); full faithfulness | broken: Nothing present; adds kernels and cokernels freely
- Excerpt files: `excerpts/nlab-freyd-mitchell-embedding-theorem.txt`, `excerpts/wikipedia-exact-category.txt`

## S046: D7-154, input

- Entry: Splitting Field Construction
- Field: **input**: Field K, polynomial f
- Whole fill: description: Adjoins exactly the roots of a polynomial: the smallest extension where it factors into linear factors. | input: Field K, polynomial f | output: Splitting field of f over K | preserved: Normality; uniqueness up to isomorphism | broken: Canonical ordering of roots
- Excerpt files: `excerpts/wikipedia-splitting-field.txt`, `excerpts/mathlib-Mathlib.FieldTheory.SplittingField.Construction.txt`

## S047: D7-142, output

- Entry: Exterior Algebra Generation
- Field: **output**: Graded-commutative algebra Lambda(V)
- Whole fill: description: Forms Lambda(V): the tensor algebra modulo v (x) v = 0. Alternating multilinear algebra; determinants and differential forms. | input: Module or vector space V | output: Graded-commutative algebra Lambda(V) | preserved: Dimension counts (binomial); functoriality | broken: Symmetric information
- Excerpt files: `excerpts/wikipedia-exterior-algebra.txt`, `excerpts/mathlib-Mathlib.LinearAlgebra.ExteriorAlgebra.Basic.txt`

## S048: D7-243, broken

- Entry: Bar Construction
- Field: **broken**: Strictness (it is large)
- Whole fill: description: Resolves an algebra or builds a classifying space: B(A) with tensor powers of A and alternating face maps; B G for a group. | input: Algebra, monoid, group or monad | output: Bar resolution or classifying object | preserved: Homological invariants (Tor, group homology) | broken: Strictness (it is large)
- Excerpt files: `excerpts/wikipedia-bar-construction.txt`

## S049: D7-220, description

- Entry: Cohomology Group Extraction
- Field: **description**: Computes H^n = ker d / im d for a cochain complex; often a ring under cup product.
- Whole fill: description: Computes H^n = ker d / im d for a cochain complex; often a ring under cup product. | input: Cochain complex | output: Cohomology groups H^n (often a graded ring) | preserved: Quasi-isomorphism invariance | broken: Cochain detail; Massey products unless tracked
- Excerpt files: `excerpts/wikipedia-chain-complex.txt`, `excerpts/wikipedia-cohomology.txt`

## S050: D7-080, output

- Entry: Initial Object Evaluation
- Field: **output**: Initial object 0 and the unique maps out of it
- Whole fill: description: Identifies the object with a unique morphism to every object: the empty colimit. | input: Category C | output: Initial object 0 and the unique maps out of it | preserved: Uniqueness up to unique isomorphism | broken: Nothing; it is a universal property
- Excerpt files: `excerpts/nlab-initial-object.txt`

## S051: D7-259, description

- Entry: Spectral Sequence Convergence Limit
- Field: **description**: Reads the associated graded of the target from E_infinity.
- Whole fill: description: Reads the associated graded of the target from E_infinity. | input: Convergent spectral sequence | output: E_infinity and a filtration on the target | preserved: Associated graded | broken: Extension data between graded pieces
- Excerpt files: `excerpts/wikipedia-spectral-sequence.txt`

## S052: D7-145, name

- Entry: Universal Enveloping Algebra Construction
- Field: **name**: Universal Enveloping Algebra Construction
- Whole fill: description: Forms U(g): the associative algebra whose modules are g-modules, T(g) modulo x y - y x = [x, y]. | input: Lie algebra g | output: Associative algebra U(g) | preserved: Representation theory of g; PBW basis (associated graded is Sym g) | broken: Nothing of g (it embeds, by PBW)
- Excerpt files: `excerpts/wikipedia-universal-enveloping-algebra.txt`, `excerpts/mathlib-Mathlib.Algebra.Lie.UniversalEnveloping.txt`

## S053: D7-005, name

- Entry: Left Kan Extension
- Field: **name**: Left Kan Extension
- Whole fill: description: Extends F: C to E along K: C to D to Lan_K F: D to E, universal among functors with a transformation from F. Pointwise a colimit over the comma category K/d. | input: Functors F: C to E, K: C to D; E cocomplete enough | output: Functor Lan_K F: D to E with unit F to (Lan_K F) K | preserved: Universal property; colimits of F when K is to the terminal category | broken: Values off the image of K are forced (freely generated), not given
- Excerpt files: `excerpts/nlab-kan-extension.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Functor.KanExtension.Basic.txt`

## S054: D7-027, description

- Entry: Isbell Duality Transformation
- Field: **description**: The adjunction between presheaves and copresheaves on C, O(X)(c) = Nat(X, C(c, -)) and Spec(Y)(c) = Nat(C(-, c), Y). Generalizes algebra-geometry duality.
- Whole fill: description: The adjunction between presheaves and copresheaves on C, O(X)(c) = Nat(X, C(c, -)) and Spec(Y)(c) = Nat(C(-, c), Y). Generalizes algebra-geometry duality. | input: Presheaf or copresheaf on small category C | output: Copresheaf or presheaf (its Isbell conjugate) | preserved: Representables are fixed; restricts to an equivalence on the Isbell-reflexive objects | broken: Everything outside the reflexive fixed points (non-reflexive objects change)
- Excerpt files: `excerpts/nlab-isbell-duality.txt`

## S055: D7-138, input

- Entry: Jacobson Radical Extraction
- Field: **input**: Ring R
- Whole fill: description: Computes the intersection of all maximal (left) ideals; Nakayama's lemma lives here. | input: Ring R | output: Jacobson radical J(R); semiprimitive quotient R/J | preserved: Simple modules; units lift | broken: Information in J(R)
- Excerpt files: `excerpts/wikipedia-jacobson-radical.txt`

## S056: D7-232, input

- Entry: Tor Functor Evaluation
- Field: **input**: Modules M, N
- Whole fill: description: Computes Tor_n(M, N), the left derived functors of the tensor product; Tor_1 measures torsion and non-flatness. | input: Modules M, N | output: Groups Tor_n^R(M, N) | preserved: Balanced (resolve either side) | broken: Nothing
- Excerpt files: `excerpts/wikipedia-tor-functor.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Monoidal.Tor.txt`

## S057: D7-245, broken

- Entry: Hochschild Homology Computation
- Field: **broken**: Nothing
- Whole fill: description: Computes HH_*(A) = Tor over A (x) A^op of (A, A); the algebraic analogue of differential forms (HKR). | input: Associative algebra A | output: Groups HH_n(A) | preserved: Morita invariance | broken: Nothing
- Excerpt files: `excerpts/wikipedia-hochschild-homology.txt`

## S058: D7-338, name

- Entry: Cofiber Sequence Construction
- Field: **name**: Cofiber Sequence Construction
- Whole fill: description: Extends f to X to Y to C f to S X to ... | input: Pointed map | output: Cofiber sequence | preserved: Long exact sequence in cohomology | broken: Nothing
- Excerpt files: `excerpts/wikipedia-puppe-sequence.txt`, `excerpts/nlab-cofiber-sequence.txt`

## S059: D7-272, description

- Entry: Exact Couple Construction
- Field: **description**: Packages maps D to D to E to D forming an exact triangle; deriving it repeatedly yields a spectral sequence (Massey).
- Whole fill: description: Packages maps D to D to E to D forming an exact triangle; deriving it repeatedly yields a spectral sequence (Massey). | input: Long exact sequences (for example from a filtration) | output: Exact couple (D, E, i, j, k) | preserved: Spectral sequence data | broken: Nothing
- Excerpt files: `excerpts/wikipedia-exact-couple.txt`

## S060: D7-040, input

- Entry: Hylomorphism
- Field: **input**: F-coalgebra (A, c), F-algebra (B, a)
- Whole fill: description: An unfold followed by a fold, fused so the intermediate structure is never built: divide and conquer as a recursion scheme. | input: F-coalgebra (A, c), F-algebra (B, a) | output: Morphism A to B satisfying h = a F(h) c | preserved: The composite result; no intermediate data structure | broken: Termination is not guaranteed in general
- Excerpt files: `excerpts/wikipedia-hylomorphism-computer-science.txt`

## S061: D7-068, broken

- Entry: Reflective Subcategory Localization
- Field: **broken**: Structure outside R (the unit kills or adds it)
- Whole fill: description: Given a full subcategory with a left adjoint to its inclusion, replaces each object by its best approximation inside (sheafification, completion, abelianization). | input: Category C, reflective full subcategory R | output: Reflector L: C to R with unit X to L X | preserved: Limits in R (computed in C); objects already in R | broken: Structure outside R (the unit kills or adds it)
- Excerpt files: `excerpts/nlab-reflective-subcategory-r.txt`

## S062: D7-281, input

- Entry: Direct Image Functor
- Field: **input**: Geometric morphism f: E to F
- Whole fill: description: The right adjoint f_* of a geometric morphism: pushforward of sheaves. | input: Geometric morphism f: E to F | output: Functor f_*: E to F | preserved: Limits | broken: Colimits; exactness (derived functors R f_* measure it)
- Excerpt files: `excerpts/nlab-direct-image.txt`, `excerpts/nlab-geometric-morphism-r.txt`

## S063: D7-388, description

- Entry: Frobenius Algebra Measurement Operation
- Field: **description**: Uses a special commutative dagger Frobenius algebra (an orthonormal basis) to copy and delete classical data.
- Whole fill: description: Uses a special commutative dagger Frobenius algebra (an orthonormal basis) to copy and delete classical data. | input: Dagger Frobenius algebra | output: Measurement and copy maps | preserved: Classical structure | broken: Quantum coherence
- Excerpt files: `excerpts/wikipedia-categorical-quantum-mechanics.txt`

## S064: D7-211, description

- Entry: Semimodularity Transformation
- Field: **description**: Tests or uses (upper) semimodularity: if a and b both cover a ^ b then a v b covers both. Geometric lattices are the semimodular atomistic ones, the lattices of flats of matroids.
- Whole fill: description: Tests or uses (upper) semimodularity: if a and b both cover a ^ b then a v b covers both. Geometric lattices are the semimodular atomistic ones, the lattices of flats of matroids. | input: Lattice L | output: Semimodularity verdict; rank function | preserved: Jordan-Dedekind chain condition; rank | broken: Nothing | reading: Nonstandard name. Read as the semimodular structure (and the matroid correspondence it enables).
- Excerpt files: `excerpts/wikipedia-semimodular-lattice.txt`, `excerpts/wikipedia-geometric-lattice.txt`

## S065: D7-310, broken

- Entry: Lambda Calculus Categorification
- Field: **broken**: Nothing (equivalence)
- Whole fill: description: The equivalence (Lambek) between typed lambda theories and Cartesian closed categories; the free CCC is the term model. | input: Typed lambda calculus | output: Cartesian closed category | preserved: Equality of terms | broken: Nothing (equivalence)
- Excerpt files: `excerpts/wikipedia-cartesian-closed-category.txt`, `excerpts/wikipedia-curry-howard-correspondence.txt`

## S066: D7-161, output

- Entry: Group Extension
- Field: **output**: Group G fitting in the extension
- Whole fill: description: Builds G from a normal subgroup N and quotient Q: 1 to N to G to Q to 1. Classified by cohomology when N is abelian (H^2(Q, N)). | input: Groups N, Q, action and cocycle data | output: Group G fitting in the extension | preserved: N and Q | broken: Splitting; uniqueness (extensions differ by cohomology classes)
- Excerpt files: `excerpts/wikipedia-group-extension.txt`

## S067: D7-254, output

- Entry: Sheaf Cohomology Computation
- Field: **output**: H^n(X, F)
- Whole fill: description: Computes right derived functors of global sections. | input: Space or site, sheaf F | output: H^n(X, F) | preserved: Local-to-global obstruction data | broken: Nothing
- Excerpt files: `excerpts/wikipedia-sheaf-cohomology.txt`

## S068: D7-400, name

- Entry: Root Space Decomposition
- Field: **name**: Root Space Decomposition
- Whole fill: description: Decomposes a semisimple Lie algebra under a Cartan subalgebra into root spaces. | input: Semisimple Lie algebra, Cartan subalgebra | output: Root system and root spaces | preserved: Isomorphism class | broken: Choice of Cartan (conjugate)
- Excerpt files: `excerpts/wikipedia-root-system-decomposition.txt`

## S069: D7-070, broken

- Entry: Factorization System Application
- Field: **broken**: Nothing; it is a decomposition
- Whole fill: description: Factors every morphism uniquely (up to iso) as an E-map followed by an M-map, with E left orthogonal to M (for example epi then mono). | input: Category with orthogonal factorization system (E, M), morphism f | output: Factorization f = m e | preserved: Uniqueness of the factorization; lifting properties | broken: Nothing; it is a decomposition
- Excerpt files: `excerpts/nlab-orthogonal-factorization-system.txt`, `excerpts/nlab-weak-factorization-system.txt`

## S070: D2-033, output

- Entry: Poisson-Mellin-Newton Cycle
- Field: **output**: Asymptotic expansion via Mellin poles
- Whole fill: description: The triangle of correspondences between Poisson generating functions, Mellin transforms and Newton (finite difference) series used in the analysis of algorithms (Flajolet and coauthors): a sequence's asymptotics read from the poles of a Mellin transform via Rice's integrals. | input: Sequence or generating function | output: Asymptotic expansion via Mellin poles | preserved: Asymptotic information | broken: Exact values (only asymptotics survive) | reading: Recorded from memory of the analytic-combinatorics literature.
- Excerpt files: `excerpts/wikipedia-norlund-rice.txt`, `excerpts/wikipedia-mellin-transform.txt`

## S071: D7-334, preserved

- Entry: Loop Space Functor Application
- Field: **preserved**: Homotopy groups shifted down one
- Whole fill: description: Forms Omega X of based loops; right adjoint to suspension; an A_infinity-space. | input: Pointed space | output: Loop space Omega X | preserved: Homotopy groups shifted down one | broken: pi_0 of X; components not containing the basepoint
- Excerpt files: `excerpts/wikipedia-loop-space.txt`

## S072: D8-201, preserved

- Entry: Square root transform
- Field: **preserved**: Order
- Whole fill: description: Applies y = sqrt(x), a variance-stabilizing transform for Poisson counts (Anscombe's variant sqrt(x + 3/8)). | input: Nonnegative data (counts) | output: Transformed data with near-constant variance | preserved: Order | broken: Additivity; original scale
- Excerpt files: `excerpts/wikipedia-variance-stabilizing.txt`, `excerpts/wikipedia-anscombe.txt`

## S073: D8-202, name

- Entry: Square transform
- Field: **name**: Square transform
- Whole fill: description: Applies y = x^2 to data (for example to reduce left skew, or to energy). | input: Real data | output: Squared data | preserved: Order on nonnegative values | broken: Sign; scale | reading: Generic reading as the power transform with exponent 2.
- Excerpt files: 

## S074: D7-163, name

- Entry: Wreath Product Construction
- Field: **name**: Wreath Product Construction
- Whole fill: description: Forms A wr H = A^X x| H for H acting on X; the symmetry group of hierarchical structures, universal for imprimitive actions (Krasner-Kaloujnine). | input: Groups A, H, H-set X | output: Group A wr H | preserved: Every extension of A by H embeds (Kaloujnine-Krasner) | broken: Direct product structure
- Excerpt files: `excerpts/wikipedia-wreath-product.txt`

## S075: D7-295, output

- Entry: Object Classifier Evaluation
- Field: **output**: Map into the object classifier
- Whole fill: description: In a higher topos, classifies morphisms (up to size) by maps into a universe object; the univalent universe. | input: Infinity-topos, morphism with small fibers | output: Map into the object classifier | preserved: Equivalences of fibers (univalence) | broken: Nothing
- Excerpt files: 

## S076: D7-012, name

- Entry: Pullback Construction
- Field: **name**: Pullback Construction
- Whole fill: description: Forms the limit of X to Z from Y: the object of pairs agreeing in Z. Fiber products, intersections, inverse images. | input: Cospan X to Z from Y | output: Object X x_Z Y with projections | preserved: Universal property; monomorphisms and many classes stable under pullback | broken: Parts of X and Y not over a common point of Z
- Excerpt files: `excerpts/nlab-pullback.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Limits.Shapes.Pullback.Mono.txt`

## S077: D7-193, broken

- Entry: Closure Operator Application
- Field: **broken**: Distinction between x and c(x)
- Whole fill: description: Applies an extensive, monotone, idempotent operator: topological closure, subalgebra generation, deductive closure. | input: Poset or power set, closure operator c | output: Closed element c(x) | preserved: Order; closed elements form a complete lattice (on complete lattices) | broken: Distinction between x and c(x)
- Excerpt files: `excerpts/wikipedia-closure-operator.txt`, `excerpts/mathlib-Mathlib.LinearAlgebra.Span.Defs.txt`

## S078: D7-297, input

- Entry: Freyd Cover Construction
- Field: **input**: Topos E
- Whole fill: description: Glues a topos along the global sections functor (Artin gluing, Sierpinski cone); proves disjunction and existence properties of intuitionistic logic. | input: Topos E | output: Glued topos (Set down Gamma E) | preserved: E as an open subtopos | broken: Nothing
- Excerpt files: `excerpts/nlab-freyd-cover.txt`

## S079: D7-089, output

- Entry: Retract Construction
- Field: **output**: Retract Y
- Whole fill: description: Exhibits Y as a retract of X via i: Y to X and r: X to Y with r i = id_Y, equivalently a split idempotent i r on X. | input: Object X with idempotent e, or maps i, r | output: Retract Y | preserved: Every property closed under retracts (projectivity, injectivity, finiteness of many kinds) | broken: The part of X killed by r
- Excerpt files: `excerpts/nlab-retract.txt`

## S080: D7-228, preserved

- Entry: Nine Lemma Reduction
- Field: **preserved**: Exactness
- Whole fill: description: In a 3x3 diagram with exact columns, exactness of two rows implies the third. | input: 3x3 commutative diagram | output: Exactness of the remaining row | preserved: Exactness | broken: Nothing
- Excerpt files: `excerpts/wikipedia-nine-lemma.txt`

## S081: D7-262, name

- Entry: Leray Spectral Sequence
- Field: **name**: Leray Spectral Sequence
- Whole fill: description: E_2 = H^p(Y, R^q f_* F) converges to H^{p+q}(X, F) for f: X to Y. | input: Continuous map and sheaf | output: Spectral sequence | preserved: Cohomology | broken: Extension data
- Excerpt files: `excerpts/wikipedia-leray-spectral-sequence.txt`

## S082: D7-412, broken

- Entry: Levi Decomposition
- Field: **broken**: Uniqueness (Levi factors are conjugate)
- Whole fill: description: Writes a finite-dimensional Lie algebra (char 0) as radical semidirect semisimple. | input: Lie algebra | output: Radical and Levi subalgebra | preserved: Structure | broken: Uniqueness (Levi factors are conjugate)
- Excerpt files: `excerpts/wikipedia-levi-decomposition.txt`

## S083: D7-396, output

- Entry: Open System Resource Transducer
- Field: **output**: Convertibility order
- Whole fill: description: Resource theories as symmetric monoidal categories (Coecke, Fritz, Spekkens): free processes convert resources. | input: Resource theory, resources | output: Convertibility order | preserved: Monotones | broken: Free operations | reading: Nonstandard name. Read as a free process in a categorical resource theory.
- Excerpt files: 

## S084: D7-007, name

- Entry: Yoneda Embedding
- Field: **name**: Yoneda Embedding
- Whole fill: description: Sends each object c to its representable presheaf Hom(-, c). Fully faithful: an object is determined up to isomorphism by the morphisms into it. | input: Locally small category C | output: Presheaf category [C^op, Set] with embedding y | preserved: Full faithfulness; limits of C; all morphism data | broken: Colimits of C (y freely adds new ones); smallness of the ambient category
- Excerpt files: `excerpts/nlab-yoneda-embedding.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Yoneda.txt`

## S085: D7-255, output

- Entry: Crystalline Cohomology Transformation
- Field: **output**: W(k)-modules H^n_crys
- Whole fill: description: A p-adic cohomology for varieties in characteristic p via divided-power thickenings (Berthelot, Grothendieck). | input: Smooth proper variety over a perfect field of characteristic p | output: W(k)-modules H^n_crys | preserved: Betti numbers analogue; Frobenius action | broken: Torsion subtleties
- Excerpt files: `excerpts/wikipedia-crystalline-cohomology.txt`

## S086: D7-034, input

- Entry: Lawvere Theory Functorial Semantics
- Field: **input**: Signature and equations, or a Lawvere theory T
- Whole fill: description: Presents an algebraic theory as a category T with finite products generated by one object; models are product-preserving functors T to Set. | input: Signature and equations, or a Lawvere theory T | output: Category of models Mod(T) = FP(T, Set) | preserved: The variety up to equivalence; interpretation in any category with finite products | broken: Syntax: the particular presentation by generators and equations
- Excerpt files: `excerpts/nlab-lawvere-theory.txt`

## S087: D7-359, broken

- Entry: Cyclic Operad Transformation
- Field: **broken**: Distinguished output
- Whole fill: description: Adds an action letting inputs and output be permuted cyclically (Getzler and Kapranov). | input: Operad with extra symmetry | output: Cyclic operad | preserved: Invariant inner products on algebras | broken: Distinguished output
- Excerpt files: `excerpts/nlab-cyclic-operad.txt`

## S088: D7-284, description

- Entry: Essential Geometric Morphism
- Field: **description**: A geometric morphism whose inverse image also has a left adjoint f_!.
- Whole fill: description: A geometric morphism whose inverse image also has a left adjoint f_!. | input: Geometric morphism f | output: Triple f_! left of f^* left of f_* | preserved: Colimits and limits under f^* | broken: Nothing; it is extra structure
- Excerpt files: `excerpts/nlab-essential-geometric-morphism-r.txt`

## S089: D7-317, description

- Entry: Boolean Topos Reduction
- Field: **description**: Passes to the double-negation subtopos, which is Boolean.
- Whole fill: description: Passes to the double-negation subtopos, which is Boolean. | input: Topos E | output: Boolean subtopos Sh_{not not}(E) | preserved: Dense structure | broken: Intuitionistic distinctions
- Excerpt files: `excerpts/nlab-double-negation.txt`

## S090: D7-387, name

- Entry: Gelfand-Naimark-Segal Construction
- Field: **name**: Gelfand-Naimark-Segal Construction
- Whole fill: description: Builds a Hilbert-space representation of a C*-algebra from a state. | input: C*-algebra A, state omega | output: Cyclic representation (H, pi, xi) | preserved: The state as an expectation | broken: Other states
- Excerpt files: `excerpts/wikipedia-gns.txt`

## S091: D7-276, output

- Entry: T-Structure Truncation
- Field: **output**: Truncations and triangle
- Whole fill: description: Truncates an object by a t-structure into tau_{<=0} and tau_{>=1} parts; the heart is abelian. | input: Triangulated category with t-structure, object X | output: Truncations and triangle | preserved: Heart cohomology | broken: Parts outside the chosen range
- Excerpt files: `excerpts/wikipedia-t-structure.txt`

## S092: D7-370, output

- Entry: Prism Match Evaluation
- Field: **output**: Focus or the untouched value
- Whole fill: description: Tests whether a sum-type value matches a case: match: S to A + S (a partial get). | input: Prism, value s | output: Focus or the untouched value | preserved: Prism laws | broken: Nothing
- Excerpt files: `excerpts/arxiv-2001.07488.txt`

## S093: D7-185, output

- Entry: Prime Ideal Extraction
- Field: **output**: Prime ideal separating them
- Whole fill: description: Finds prime ideals (of a ring or distributive lattice), existence by the prime ideal theorem. | input: Ring or distributive lattice, ideal disjoint from a filter | output: Prime ideal separating them | preserved: Separation; points of the spectrum | broken: Non-prime information
- Excerpt files: `excerpts/wikipedia-boolean-prime-ideal-theorem.txt`

## S094: D7-112, preserved

- Entry: Center Construction
- Field: **preserved**: Commutation with all elements
- Whole fill: description: Forms the center: the largest congruence (or subgroup, subring) commuting with everything. | input: Algebra, group or ring | output: Center Z(A) or central congruence zeta_A | preserved: Commutation with all elements | broken: Noncentral structure
- Excerpt files: `excerpts/wikipedia-center-group-theory.txt`

## S095: D8-166, preserved

- Entry: Quantile transform
- Field: **preserved**: Rank order
- Whole fill: description: Maps data through its empirical distribution function and a target inverse CDF, giving uniform or normal marginals. | input: Real data | output: Data with a chosen marginal distribution | preserved: Rank order | broken: Distances and scale
- Excerpt files: `excerpts/wikipedia-probability-integral-transform.txt`, `excerpts/wikipedia-quantile-normalization.txt`

## S096: D7-070, description

- Entry: Factorization System Application
- Field: **description**: Factors every morphism uniquely (up to iso) as an E-map followed by an M-map, with E left orthogonal to M (for example epi then mono).
- Whole fill: description: Factors every morphism uniquely (up to iso) as an E-map followed by an M-map, with E left orthogonal to M (for example epi then mono). | input: Category with orthogonal factorization system (E, M), morphism f | output: Factorization f = m e | preserved: Uniqueness of the factorization; lifting properties | broken: Nothing; it is a decomposition
- Excerpt files: `excerpts/nlab-orthogonal-factorization-system.txt`, `excerpts/nlab-weak-factorization-system.txt`

## S097: D7-336, input

- Entry: Homotopy Pushout
- Field: **input**: Span up to homotopy
- Whole fill: description: The pushout made homotopy invariant (double mapping cylinder). | input: Span up to homotopy | output: Homotopy pushout | preserved: Homotopy invariance; Mayer-Vietoris | broken: Strict pushout
- Excerpt files: `excerpts/wikipedia-homotopy-colimit.txt`, `excerpts/nlab-homotopy-pushout.txt`

## S098: D7-341, broken

- Entry: Strictification of 2-Categories
- Field: **broken**: Nothing; strict three-dimensional strictification fails (Gray)
- Whole fill: description: Every bicategory is biequivalent to a strict 2-category (Mac Lane and Pare). | input: Bicategory | output: Biequivalent 2-category | preserved: Biequivalence class | broken: Nothing; strict three-dimensional strictification fails (Gray)
- Excerpt files: `excerpts/wikipedia-bicategory.txt`, `excerpts/nlab-bicategory.txt`

## S099: D7-088, input

- Entry: Split Epimorphism Reduction
- Field: **input**: Split epimorphism p: X to Y with section s
- Whole fill: description: Uses a section s with p s = id to split an epimorphism: the codomain is a retract of the domain. | input: Split epimorphism p: X to Y with section s | output: Retract data; in additive categories X = Y (+) ker p | preserved: Y as a retract; absolute preservation (every functor preserves splittings) | broken: Nothing
- Excerpt files: `excerpts/nlab-split-epimorphism.txt`

## S100: D7-282, preserved

- Entry: Inverse Image Functor
- Field: **preserved**: Finite limits and all colimits; geometric formulas
- Whole fill: description: The left exact left adjoint f^*: pullback of sheaves. | input: Geometric morphism f | output: Functor f^*: F to E | preserved: Finite limits and all colimits; geometric formulas | broken: Infinite limits; implication and universal quantification
- Excerpt files: `excerpts/nlab-inverse-image.txt`, `excerpts/nlab-geometric-morphism-r.txt`

## S101: D7-194, preserved

- Entry: Interior Operator Application
- Field: **preserved**: Order; open elements form a lattice
- Whole fill: description: Applies a contractive, monotone, idempotent operator: topological interior, modal necessity (S4). | input: Poset or power set, interior operator | output: Open element | preserved: Order; open elements form a lattice | broken: Boundary information
- Excerpt files: `excerpts/wikipedia-interior-algebra.txt`

## S102: D7-029, description

- Entry: Eilenberg-Moore Category Construction
- Field: **description**: Forms the category of algebras (A, a: T A to A) of a monad T. The terminal resolution of T into an adjunction.
- Whole fill: description: Forms the category of algebras (A, a: T A to A) of a monad T. The terminal resolution of T into an adjunction. | input: Monad (T, eta, mu) on C | output: Category C^T with free-forgetful adjunction | preserved: The monad (recovered from the adjunction); limits of C (created by the forgetful functor) | broken: Colimits need not exist or be preserved
- Excerpt files: `excerpts/nlab-eilenberg-moore-category.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Monad.Limits.txt`

## S103: D7-069, input

- Entry: Coreflective Subcategory Localization
- Field: **input**: Category C, coreflective full subcategory
- Whole fill: description: Dual: replaces an object by the best approximation from inside a coreflective subcategory (for example the torsion part, or the underlying compactly generated space). | input: Category C, coreflective full subcategory | output: Coreflector R: C to S with counit R X to X | preserved: Colimits in S; objects already in S | broken: Structure not seen from S
- Excerpt files: `excerpts/nlab-coreflective-subcategory.txt`, `excerpts/nlab-reflective-subcategory-r.txt`

## S104: D7-103, output

- Entry: Ultraproduct Construction
- Field: **output**: Ultraproduct prod A_i / U
- Whole fill: description: Reduced product by an ultrafilter. Los's theorem: a first-order sentence holds in the ultraproduct iff it holds in U-almost all factors. | input: Family (A_i), ultrafilter U | output: Ultraproduct prod A_i / U | preserved: Every first-order sentence true U-almost everywhere | broken: Standardness (nonstandard elements appear); countable cardinality
- Excerpt files: `excerpts/wikipedia-ultraproduct.txt`, `excerpts/wikipedia-reduced-product.txt`

## S105: D7-065, input

- Entry: Profunctor Composition
- Field: **input**: Profunctors P, Q
- Whole fill: description: Composes profunctors P: A -/-> B and Q: B -/-> C by the coend (Q o P)(a, c) = integral^b Q(b, c) x P(a, b). | input: Profunctors P, Q | output: Profunctor Q o P | preserved: Associativity and units up to isomorphism (a bicategory) | broken: The middle variable b
- Excerpt files: `excerpts/nlab-profunctor.txt`

## S106: D7-324, output

- Entry: Unstraightening Transformation
- Field: **output**: Cocartesian fibration
- Whole fill: description: The inverse direction: a functor S to Cat_infinity (or spaces) becomes a (co)Cartesian fibration (the infinity-Grothendieck construction). | input: Functor to Cat_infinity | output: Cocartesian fibration | preserved: All information | broken: Separation into levels
- Excerpt files: `excerpts/nlab-straightening-functor.txt`

## S107: D7-122, broken

- Entry: Taylor Term Evaluation
- Field: **broken**: Nothing
- Whole fill: description: Tests for an idempotent Taylor term (satisfying a nontrivial system of linear identities). Its presence marks tractability in CSP. | input: Idempotent algebra or clone | output: Taylor term or its absence | preserved: Mal'cev-type condition | broken: Nothing
- Excerpt files: `excerpts/arxiv-2104.11808.txt`

## S108: D7-174, description

- Entry: Squier's Theorem Homotopy Construction
- Field: **description**: From a finite convergent rewriting system of a monoid builds a resolution showing the monoid has finite derivation type and satisfies FP_3; hence some monoids with decidable word problem have no finite convergent presentation.
- Whole fill: description: From a finite convergent rewriting system of a monoid builds a resolution showing the monoid has finite derivation type and satisfies FP_3; hence some monoids with decidable word problem have no finite convergent presentation. | input: Finite convergent rewriting system for a monoid M | output: Homotopy (2-dimensional) data; FDT and FP_3 | preserved: Monoid M | broken: Nothing; it is an obstruction theory
- Excerpt files: 

## S109: D7-237, output

- Entry: Quasi-Isomorphism Reduction
- Field: **output**: Isomorphism in the derived category
- Whole fill: description: Treats a chain map inducing isomorphisms on homology as an equivalence; the derived category inverts them. | input: Chain map f | output: Isomorphism in the derived category | preserved: Homology | broken: Chain-level structure; non-homotopy-invariant information
- Excerpt files: `excerpts/wikipedia-quasi-isomorphism.txt`, `excerpts/wikipedia-chain-homotopy.txt`

## S110: D8-202, output

- Entry: Square transform
- Field: **output**: Squared data
- Whole fill: description: Applies y = x^2 to data (for example to reduce left skew, or to energy). | input: Real data | output: Squared data | preserved: Order on nonnegative values | broken: Sign; scale | reading: Generic reading as the power transform with exponent 2.
- Excerpt files: 

## S111: D7-025, name

- Entry: MacNeille Completion
- Field: **name**: MacNeille Completion
- Whole fill: description: Embeds a poset in the smallest complete lattice containing it, via cuts (A, B) with A = lower bounds of B and B = upper bounds of A. | input: Poset P | output: Complete lattice DM(P) with order embedding | preserved: All existing joins and meets; join-density and meet-density of P | broken: Distributivity (the completion of a distributive lattice need not be distributive)
- Excerpt files: `excerpts/wikipedia-dedekind-macneille-completion.txt`, `excerpts/nlab-macneille-completion.txt`, `excerpts/mathlib-Mathlib.Order.Completion.txt`

## S112: D7-017, preserved

- Entry: Coproduct Formation
- Field: **preserved**: Each summand embeds (in extensive categories, disjointly)
- Whole fill: description: Forms the colimit of a discrete family: the object receiving each summand, morphisms out of it determined summandwise. | input: Family of objects (X_i) | output: Coproduct sum X_i with injections | preserved: Each summand embeds (in extensive categories, disjointly) | broken: Nothing is identified; relations between summands are absent
- Excerpt files: `excerpts/nlab-coproduct.txt`

## S113: D7-317, output

- Entry: Boolean Topos Reduction
- Field: **output**: Boolean subtopos Sh_{not not}(E)
- Whole fill: description: Passes to the double-negation subtopos, which is Boolean. | input: Topos E | output: Boolean subtopos Sh_{not not}(E) | preserved: Dense structure | broken: Intuitionistic distinctions
- Excerpt files: `excerpts/nlab-double-negation.txt`

## S114: D7-369, preserved

- Entry: Lens Modify Application
- Field: **preserved**: Complement
- Whole fill: description: Applies f: A to A through a lens: over f s = put(s, f(get s)). | input: Lens, function on the focus | output: Updated whole | preserved: Complement | broken: Old focus
- Excerpt files: `excerpts/arxiv-2001.07488.txt`

## S115: D7-035, broken

- Entry: Localization of a Category
- Field: **broken**: Hom-set sizes and computability in general; distinctions made only by W-maps
- Whole fill: description: Formally inverts a class W of morphisms, C to C[W^-1], universal among functors sending W to isomorphisms. | input: Category C, class of morphisms W | output: Localized category C[W^-1] with localization functor | preserved: Universal property; objects | broken: Hom-set sizes and computability in general; distinctions made only by W-maps
- Excerpt files: `excerpts/nlab-localization.txt`, `excerpts/nlab-category-of-fractions.txt`

## S116: D7-121, broken

- Entry: J\u00f3nsson Lemma Application
- Field: **broken**: Nothing; it restricts where irreducibles can be
- Whole fill: description: In a congruence-distributive variety generated by K, every subdirectly irreducible member lies in HSP_U(K). | input: Congruence-distributive variety V(K) | output: Location of subdirectly irreducibles | preserved: Equational theory | broken: Nothing; it restricts where irreducibles can be
- Excerpt files: 

## S117: D7-032, output

- Entry: Comonad Resolution
- Field: **output**: Adjunction realizing W
- Whole fill: description: Factors a comonad as F G for an adjunction; the dual of monad resolution. Coalgebras and co-Kleisli categories are the extremes. | input: Comonad W on C | output: Adjunction realizing W | preserved: The comonad W | broken: Uniqueness of the resolving adjunction
- Excerpt files: `excerpts/nlab-comonad.txt`, `excerpts/nlab-eilenberg-moore-category.txt`

## S118: D7-220, input

- Entry: Cohomology Group Extraction
- Field: **input**: Cochain complex
- Whole fill: description: Computes H^n = ker d / im d for a cochain complex; often a ring under cup product. | input: Cochain complex | output: Cohomology groups H^n (often a graded ring) | preserved: Quasi-isomorphism invariance | broken: Cochain detail; Massey products unless tracked
- Excerpt files: `excerpts/wikipedia-chain-complex.txt`, `excerpts/wikipedia-cohomology.txt`

## S119: D7-084, output

- Entry: Additive Category Completion
- Field: **output**: Additive category Mat(C) with embedding
- Whole fill: description: Freely adds finite biproducts to a preadditive category (the matrix category Mat(C)). | input: Preadditive category C | output: Additive category Mat(C) with embedding | preserved: Hom-group structure; full faithfulness | broken: Nothing present; adds direct sums
- Excerpt files: `excerpts/nlab-additive-envelope.txt`

## S120: D7-167, output

- Entry: Term Rewriting Step
- Field: **output**: Rewritten term t'
- Whole fill: description: Applies a rewrite rule l to r at a position of a term matching l under a substitution. | input: Term t, rule l to r | output: Rewritten term t' | preserved: Equational class of t (under the equations of the rules) | broken: Term shape; possibly termination
- Excerpt files: `excerpts/wikipedia-rewriting.txt`

## S121: D7-343, preserved

- Entry: Opetopic Set Generation
- Field: **preserved**: Pasting structure
- Whole fill: description: Builds higher categorical shapes from opetopes (Baez and Dolan): cells with many inputs and one output. | input: Opetopic data | output: Opetopic set | preserved: Pasting structure | broken: Nothing
- Excerpt files: `excerpts/nlab-opetope.txt`

## S122: D7-352, name

- Entry: Boardman-Vogt Tensor Product
- Field: **name**: Boardman-Vogt Tensor Product
- Whole fill: description: Tensor of operads whose algebras are P-algebras in Q-algebras with interchange; E_m (x) E_n = E_{m+n} (Dunn additivity). | input: Operads P, Q | output: Operad P (x)_BV Q | preserved: Interchange of operations | broken: Nothing
- Excerpt files: `excerpts/nlab-boardman-vogt-tensor-product.txt`

## S123: D7-160, name

- Entry: Derived Subgroup Evaluation
- Field: **name**: Derived Subgroup Evaluation
- Whole fill: description: Computes [G, G], generated by commutators; the quotient is the abelianization. | input: Group G | output: Derived subgroup G' | preserved: Normality (characteristic) | broken: Abelian information (in G/G')
- Excerpt files: `excerpts/wikipedia-commutator-subgroup.txt`, `excerpts/mathlib-Mathlib.GroupTheory.Commutator.Basic.txt`

## S124: D2-029, preserved

- Entry: Inverse Two-sided Laplace Transform
- Field: **preserved**: Information (inverse of the transform)
- Whole fill: description: Recovers f from its bilateral Laplace transform by a Bromwich integral along a vertical line inside the strip of convergence. | input: Analytic F(s) and its strip of convergence | output: Function f on R | preserved: Information (inverse of the transform) | broken: Nothing, given the strip; without it the inverse is ambiguous
- Excerpt files: `excerpts/wikipedia-inverse-laplace.txt`

## S125: D7-353, description

- Entry: Little Cubes Operad Application
- Field: **description**: Acts by embeddings of little n-cubes into the unit cube; E_n-algebras are n-fold loop spaces up to group completion (May).
- Whole fill: description: Acts by embeddings of little n-cubes into the unit cube; E_n-algebras are n-fold loop spaces up to group completion (May). | input: Space or algebra | output: E_n-algebra structure | preserved: Commutativity up to homotopy in n directions | broken: Strict commutativity
- Excerpt files: `excerpts/nlab-little-cubes-operad.txt`

## S126: D7-351, input

- Entry: Biased to Unbiased Bicategory Transformation
- Field: **input**: Biased bicategory
- Whole fill: description: Passes between bicategories with binary composition and those with composition of all arities (Leinster); they are equivalent. | input: Biased bicategory | output: Unbiased bicategory | preserved: All structure up to equivalence | broken: Nothing
- Excerpt files: `excerpts/nlab-biased-definition.txt`

## S127: D7-115, broken

- Entry: Solvable Reduction
- Field: **broken**: Deeper derived series
- Whole fill: description: Passes to a solvable quotient via the derived series, or tests solvability. | input: Group, ring or algebra A, length n | output: Quotient A/A^(n) | preserved: Derived-length-n structure | broken: Deeper derived series
- Excerpt files: `excerpts/wikipedia-solvable-group.txt`

## S128: D7-405, description

- Entry: Highest Weight Representation
- Field: **description**: Constructs or classifies irreducible representations by dominant integral highest weights.
- Whole fill: description: Constructs or classifies irreducible representations by dominant integral highest weights. | input: Dominant weight | output: Irreducible representation | preserved: Weights | broken: Nothing
- Excerpt files: `excerpts/wikipedia-highest-weight-theorem.txt`

## S129: D7-412, input

- Entry: Levi Decomposition
- Field: **input**: Lie algebra
- Whole fill: description: Writes a finite-dimensional Lie algebra (char 0) as radical semidirect semisimple. | input: Lie algebra | output: Radical and Levi subalgebra | preserved: Structure | broken: Uniqueness (Levi factors are conjugate)
- Excerpt files: `excerpts/wikipedia-levi-decomposition.txt`

## S130: D7-294, output

- Entry: Effective Topos Construction
- Field: **output**: Effective topos Eff
- Whole fill: description: Hyland's realizability topos over Kleene's first algebra: sets with realizers; every function N to N is computable internally. | input: Partial combinatory algebra (Kleene's K1) | output: Effective topos Eff | preserved: Computability | broken: Excluded middle; choice
- Excerpt files: `excerpts/nlab-effective-topos.txt`

## S131: D7-079, preserved

- Entry: Sifted Colimit Construction
- Field: **preserved**: Finite products; algebraic theories (models are closed under sifted colimits)
- Whole fill: description: Computes a colimit over a sifted diagram (diagonal is final): filtered colimits and reflexive coequalizers. They commute with finite products in Set. | input: Sifted diagram | output: Colimit object | preserved: Finite products; algebraic theories (models are closed under sifted colimits) | broken: Identifications made by the diagram
- Excerpt files: `excerpts/nlab-sifted-colimit.txt`

## S132: D7-408, name

- Entry: Whitehead's Lemma Resolution
- Field: **name**: Whitehead's Lemma Resolution
- Whole fill: description: For semisimple Lie algebras, H^1 and H^2 with finite-dimensional coefficients vanish. | input: Semisimple Lie algebra, module | output: Vanishing of H^1, H^2 | preserved: Complete reducibility; Levi decomposition | broken: Nothing
- Excerpt files: `excerpts/wikipedia-whiteheads-lemma-lie.txt`

## S133: D3-171, name

- Entry: Discrete cosine transform
- Field: **name**: Discrete cosine transform
- Whole fill: description: Expresses a finite real sequence as a sum of cosines at discrete frequencies (DCT-II in common use); concentrates the energy of smooth signals in few coefficients (JPEG). | input: Real sequence of length N | output: Real coefficient sequence of length N | preserved: Energy (orthonormal version); invertibility | broken: Locality in the sample domain
- Excerpt files: `excerpts/wikipedia-dct.txt`

## S134: D7-329, broken

- Entry: Right Fibration
- Field: **broken**: Nothing
- Whole fill: description: A map lifting against right horns; presheaves of spaces. | input: Map of simplicial sets | output: Right fibration verdict | preserved: Families of spaces (contravariant) | broken: Nothing
- Excerpt files: `excerpts/wikipedia-fibration-of-simplicial-sets.txt`

## S135: D7-284, name

- Entry: Essential Geometric Morphism
- Field: **name**: Essential Geometric Morphism
- Whole fill: description: A geometric morphism whose inverse image also has a left adjoint f_!. | input: Geometric morphism f | output: Triple f_! left of f^* left of f_* | preserved: Colimits and limits under f^* | broken: Nothing; it is extra structure
- Excerpt files: `excerpts/nlab-essential-geometric-morphism-r.txt`

## S136: D7-205, output

- Entry: Continuous Lattice Retraction
- Field: **output**: Retraction from a power of [0,1] or algebraic lattice onto L
- Whole fill: description: Continuous lattices are exactly the retracts of powers of [0,1] (or of algebraic lattices) by Scott-continuous maps; a retraction realizes one. | input: Continuous lattice L | output: Retraction from a power of [0,1] or algebraic lattice onto L | preserved: Scott-continuous structure; injectivity in T0 spaces | broken: Algebraicity (compact elements need not survive)
- Excerpt files: `excerpts/wikipedia-continuous-lattice.txt`

## S137: D7-061, description

- Entry: Eckmann-Hilton Argument Reduction
- Field: **description**: Two unital operations that distribute over each other coincide and are commutative. Forces higher homotopy groups abelian and monoids in monoids commutative.
- Whole fill: description: Two unital operations that distribute over each other coincide and are commutative. Forces higher homotopy groups abelian and monoids in monoids commutative. | input: Set with two unital binary operations satisfying interchange | output: One commutative operation | preserved: The operation | broken: Apparent distinctness of the two operations; noncommutativity
- Excerpt files: `excerpts/wikipedia-eckmann-hilton-argument.txt`

## S138: D7-010, description

- Entry: Limit Computation
- Field: **description**: Computes the universal cone over a diagram: the object that best maps into every part compatibly.
- Whole fill: description: Computes the universal cone over a diagram: the object that best maps into every part compatibly. | input: Diagram D: J to C | output: Limit object lim D with projections | preserved: Every cone factors uniquely; right adjoints preserve it | broken: Information not shared by all parts of the diagram
- Excerpt files: `excerpts/nlab-limit.txt`, `excerpts/nlab-adjoint-functor-theorem.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Adjunction.Limits.txt`

## S139: D7-400, description

- Entry: Root Space Decomposition
- Field: **description**: Decomposes a semisimple Lie algebra under a Cartan subalgebra into root spaces.
- Whole fill: description: Decomposes a semisimple Lie algebra under a Cartan subalgebra into root spaces. | input: Semisimple Lie algebra, Cartan subalgebra | output: Root system and root spaces | preserved: Isomorphism class | broken: Choice of Cartan (conjugate)
- Excerpt files: `excerpts/wikipedia-root-system-decomposition.txt`

## S140: D2-039, description

- Entry: Z-transform
- Field: **description**: Transforms a sequence x_n to X(z) = sum x_n z^{-n}, converging in an annulus; the discrete analogue of the Laplace transform.
- Whole fill: description: Transforms a sequence x_n to X(z) = sum x_n z^{-n}, converging in an annulus; the discrete analogue of the Laplace transform. | input: Sequence (x_n) | output: Function X(z) on an annulus | preserved: Convolution to product; information within the region of convergence | broken: Causality information unless the region is specified
- Excerpt files: `excerpts/wikipedia-z-transform.txt`

## S141: D7-053, name

- Entry: Symmetric Monoidal Transformation
- Field: **name**: Symmetric Monoidal Transformation
- Whole fill: description: A monoidal natural transformation between symmetric monoidal functors, compatible with tensor, unit and symmetry. | input: Symmetric monoidal functors F, G | output: Monoidal natural transformation F to G | preserved: Tensor structure and symmetry | broken: None beyond those of natural transformations
- Excerpt files: `excerpts/nlab-symmetric-monoidal-natural-transformation.txt`, `excerpts/nlab-monoidal-natural-transformation.txt`

## S142: D7-036, output

- Entry: Calculus of Fractions Application
- Field: **output**: Explicit description of C[W^-1]
- Whole fill: description: When W admits a calculus of fractions (Ore-type conditions), writes morphisms of C[W^-1] as roofs X from W to X' to Y, with explicit equivalence. | input: Category C, class W satisfying Ore and cancellation conditions | output: Explicit description of C[W^-1] | preserved: Finite limits or colimits (left fractions preserve finite limits) | broken: Nothing beyond the localization itself
- Excerpt files: `excerpts/nlab-calculus-of-fractions.txt`, `excerpts/nlab-category-of-fractions.txt`

## S143: D2-033, input

- Entry: Poisson-Mellin-Newton Cycle
- Field: **input**: Sequence or generating function
- Whole fill: description: The triangle of correspondences between Poisson generating functions, Mellin transforms and Newton (finite difference) series used in the analysis of algorithms (Flajolet and coauthors): a sequence's asymptotics read from the poles of a Mellin transform via Rice's integrals. | input: Sequence or generating function | output: Asymptotic expansion via Mellin poles | preserved: Asymptotic information | broken: Exact values (only asymptotics survive) | reading: Recorded from memory of the analytic-combinatorics literature.
- Excerpt files: `excerpts/wikipedia-norlund-rice.txt`, `excerpts/wikipedia-mellin-transform.txt`

## S144: D7-092, preserved

- Entry: Term Algebra Construction
- Field: **preserved**: Syntax exactly; initiality among Sigma-algebras (X empty)
- Whole fill: description: Forms the algebra of all well-formed terms over a signature and variables, with no equations: the absolutely free algebra. | input: Signature Sigma, variable set X | output: Term algebra T_Sigma(X) | preserved: Syntax exactly; initiality among Sigma-algebras (X empty) | broken: Every semantic identification
- Excerpt files: `excerpts/wikipedia-term-algebra.txt`

## S145: D7-355, broken

- Entry: A_\\infty-Algebra Formulation
- Field: **broken**: Strict associativity
- Whole fill: description: Replaces associativity by a hierarchy of higher homotopies m_n; homotopy transfer preserves the structure. | input: Differential graded data | output: A_infinity algebra | preserved: Associativity up to coherent homotopy | broken: Strict associativity
- Excerpt files: `excerpts/nlab-a-infinity-algebra.txt`, `excerpts/wikipedia-a-infinity.txt`
