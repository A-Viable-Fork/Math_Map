# Blind second reading: Mathlib match grades

Each item pairs a claim from the math map (one field of one entry) with a declaration from Mathlib at commit 380f2aafb622cb2c1c93dac545b6389083c68c51. Grade how the Lean statement bears on the claim, using exactly one of:

- **exact**: the statement states the claim as written (a definition counts when the claim is the definition).
- **general**: the statement implies the claim (it is more general; the claim follows given the entry's own setting).
- **special**: the statement proves a special case of the claim, or the claim under an extra hypothesis the statement makes explicit.
- **related**: a weaker or neighbouring result; the claim itself is not stated.
- **ingredient**: the statement defines the objects or the operation, not the claim.
- **conflicts**: the statement conflicts with the claim as written.

A field may contain several claims; grade the item by the claim the declaration bears on most directly, and say which. Answer as JSON: `{ "F001": { "match": "exact", "reason": "one sentence" }, ... }`. Do not try to be generous; try to be right.

## F001

**Entry D1-003 (Line graph), field output:** Undirected graph L(G) = (E, E') where E' encodes edge-adjacency

**Mathlib `SimpleGraph.lineGraph`** (Mathlib/Combinatorics/SimpleGraph/LineGraph.lean):

```lean
def lineGraph : SimpleGraph G.edgeSet where
  Adj e₁ e₂ := e₁ ≠ e₂ ∧ (e₁ ∩ e₂ : Set V).Nonempty
  symm.symm e₁ e₂ hadj := by rwa [ne_comm, Set.inter_comm]
```

## F002

**Entry D1-003 (Line graph), field description:** Constructs a new graph L(G) whose vertices are the edges of G, with two vertices in L(G) adjacent when their corresponding edges in G share an incident vertex. Translates Eulerian cycles to Hamiltonian cycles. Iterated application yields deterministic terminal behaviors (stabilizes as cycle, collapses, terminates as triangle, or expands). Whitney Isomorphism Theorem: G is recoverable from L(G) for connected graphs except K_3 vs K_{1,3}.

**Mathlib `SimpleGraph.lineGraph_adj_iff_exists`** (Mathlib/Combinatorics/SimpleGraph/LineGraph.lean):

```lean
lemma lineGraph_adj_iff_exists {e₁ e₂ : G.edgeSet} :
    (G.lineGraph).Adj e₁ e₂ ↔ e₁ ≠ e₂ ∧ ∃ v, v ∈ (e₁ : Sym2 V) ∧ v ∈ (e₂ : Sym2 V)
```

## F003

**Entry D1-059 (Matroid dual), field output:** Matroid M* = (E, B*) where B* = {E \ B : B in B}

**Mathlib `Matroid.dual_isBase_iff'`** (Mathlib/Combinatorics/Matroid/Dual.lean):

```lean
theorem dual_isBase_iff' : M✶.IsBase B ↔ M.IsBase (M.E \ B) ∧ B ⊆ M.E
```

## F004

**Entry D1-059 (Matroid dual), field preserved:** Ground set, matroid axioms, representability over same field (when applicable)

**Mathlib `Matroid.dual_ground`** (Mathlib/Combinatorics/Matroid/Dual.lean):

```lean
@[simp] theorem dual_ground : M✶.E = M.E
```

## F005

**Entry D1-059 (Matroid dual), field broken:** Basis structure (complemented), rank (r* = |E| - r), independence structure

**Mathlib `Matroid.eRank_add_eRank_dual`** (Mathlib/Combinatorics/Matroid/Rank/ENat.lean):

```lean
lemma eRank_add_eRank_dual (M : Matroid α) : M.eRank + M✶.eRank = M.E.encard
```

## F006

**Entry D1-099 (Galois connection), field description:** A pair of order-reversing (antitone) maps f: P -> Q, g: Q -> P satisfying: a ≤ g(f(a)) and f(g(b)) ≤ b for all a in P, b in Q. Captures dual relationships between posets even without bijection. Maps directly onto the lattice of flats in matroid theory.

**Mathlib `GaloisConnection`** (Mathlib/Order/GaloisConnection/Defs.lean):

```lean
def GaloisConnection [Preorder α] [Preorder β] (l : α → β) (u : β → α) :=
  ∀ a b, l a ≤ b ↔ a ≤ u b
```

## F007

**Entry D1-099 (Galois connection), field description:** A pair of order-reversing (antitone) maps f: P -> Q and g: Q -> P with a ≤ g(f(a)) for all a in P and b ≤ f(g(b)) for all b in Q. Both composites g∘f and f∘g are closure operators. Captures dual relationships between posets without a bijection. (The monotone convention instead has f(a) ≤ b iff a ≤ g(b), giving a ≤ g(f(a)) and f(g(b)) ≤ b.)

**Mathlib `GaloisConnection.le_u_l`** (Mathlib/Order/GaloisConnection/Defs.lean):

```lean
theorem le_u_l (a) : a ≤ u (l a)
```

## F008

**Entry D1-099 (Galois connection), field preserved:** Closure operators induced on both sides (f∘g and g∘f), fixed point correspondence

**Mathlib `GaloisConnection.closureOperator`** (Mathlib/Order/Closure.lean):

```lean
def GaloisConnection.closureOperator [PartialOrder α] [Preorder β] {l : α → β} {u : β → α}
    (gc : GaloisConnection l u) : ClosureOperator α :=
  gc.lowerAdjoint.closureOperator
```

## F009

**Entry D2-031 (Mellin Transform), field description:** Multiplicative Laplace analogue. Kernel t^{s-1}.

**Mathlib `mellin`** (Mathlib/Analysis/MellinTransform.lean):

```lean
def mellin (f : ℝ → E) (s : ℂ) : E :=
  ∫ t : ℝ in Ioi 0, (t : ℂ) ^ (s - 1) • f t
```

## F010

**Entry D2-031 (Mellin Transform), field preserved:** Multiplicative convolution -> multiplication, scale invariance

**Mathlib `mellin_comp_mul_left`** (Mathlib/Analysis/MellinTransform.lean):

```lean
theorem mellin_comp_mul_left (f : ℝ → E) (s : ℂ) {a : ℝ} (ha : 0 < a) :
    mellin (fun t => f (a * t)) s = (a : ℂ) ^ (-s) • mellin f s
```

## F011

**Entry D2-103 (Tensor Product), field description:** M ⊗_R N. Universal property for bilinear maps.

**Mathlib `TensorProduct.lift.unique`** (Mathlib/LinearAlgebra/TensorProduct/Basic.lean):

```lean
theorem lift.unique {g : M ⊗[R] N →ₛₗ[σ₁₂] P₂} (H : ∀ x y, g (x ⊗ₜ y) = f' x y) : g = lift f'
```

## F012

**Entry D2-103 (Tensor Product), field preserved:** Bilinearity, right exactness

**Mathlib `rTensor_exact`** (Mathlib/LinearAlgebra/TensorProduct/RightExactness.lean):

```lean
theorem rTensor_exact : Exact (rTensor Q f) (rTensor Q g)
```

## F013

**Entry D3-033 (Ultraproduct construction), field preserved:** First-order theory (Los's theorem)

**Mathlib `FirstOrder.Language.Ultraproduct.sentence_realize`** (Mathlib/ModelTheory/Ultraproducts.lean):

```lean
theorem sentence_realize (φ : L.Sentence) :
    (u : Filter α).Product M ⊨ φ ↔ ∀ᶠ a : α in u, M a ⊨ φ
```

## F014

**Entry D3-116 (Sheafification), field description:** Transforms presheaf into sheaf by forcing the gluing axiom. Left adjoint to inclusion of sheaves into presheaves.

**Mathlib `CategoryTheory.sheafificationAdjunction`** (Mathlib/CategoryTheory/Sites/Sheafification.lean):

```lean
def sheafificationAdjunction [HasWeakSheafify J A] :
    presheafToSheaf J A ⊣ sheafToPresheaf J A := Adjunction.ofIsRightAdjoint _
```

## F015

**Entry D4-153 (GNS construction), field output:** Hilbert space representation

**Mathlib `PositiveLinearMap.gnsStarAlgHom`** (Mathlib/Analysis/CStarAlgebra/GelfandNaimarkSegal.lean):

```lean
noncomputable def gnsStarAlgHom : A →⋆ₐ[ℂ] (f.GNS →L[ℂ] f.GNS) where
  __ := f.gnsNonUnitalStarAlgHom
  map_one' := by simp
  commutes' r := by simp [Algebra.algebraMap_eq_smul_one]
```

## F016

**Entry D4-264 (Nerve functor), field output:** Simplicial set N(C)

**Mathlib `CategoryTheory.nerveFunctor`** (Mathlib/AlgebraicTopology/SimplicialSet/Nerve.lean):

```lean
def nerveFunctor : Cat.{v, u} ⥤ SSet where
  obj C := nerve C
  map F := nerveMap F.toFunctor
```

## F017

**Entry D4-264 (Nerve functor), field preserved:** Category structure: the nerve functor is fully faithful, so functors between small categories are exactly the maps of their nerves

**Mathlib `CategoryTheory.nerveFunctor.fullyfaithful`** (Mathlib/AlgebraicTopology/SimplicialSet/NerveAdjunction.lean):

```lean
noncomputable def nerveFunctor.fullyfaithful : nerveFunctor.FullyFaithful :=
  Functor.FullyFaithful.ofFullyFaithful _
```

## F018

**Entry D6-117 (Radon-Nikodym decomposition), field output:** Decomposition mu = f*dnu + mu_s

**Mathlib `MeasureTheory.Measure.haveLebesgueDecomposition_add`** (Mathlib/MeasureTheory/Measure/Decomposition/Lebesgue.lean):

```lean
theorem haveLebesgueDecomposition_add (μ ν : Measure α) [HaveLebesgueDecomposition μ ν] :
    μ = μ.singularPart ν + ν.withDensity (μ.rnDeriv ν)
```

## F019

**Entry D6-117 (Radon-Nikodym decomposition), field description:** Decomposes measure mu = mu_ac + mu_s relative to reference nu. mu_ac has density (RN derivative), mu_s is singular.

**Mathlib `MeasureTheory.Measure.mutuallySingular_singularPart`** (Mathlib/MeasureTheory/Measure/Decomposition/Lebesgue.lean):

```lean
theorem mutuallySingular_singularPart (μ ν : Measure α) : μ.singularPart ν ⟂ₘ ν
```

## F020

**Entry D6-117 (Radon-Nikodym decomposition), field input:** Measures mu, nu

**Mathlib `MeasureTheory.Measure.haveLebesgueDecomposition_of_sigmaFinite`** (Mathlib/MeasureTheory/Measure/Decomposition/Lebesgue.lean):

```lean
nonrec instance (priority := 100) haveLebesgueDecomposition_of_sigmaFinite
    [SFinite μ] [SigmaFinite ν] : HaveLebesgueDecomposition μ ν
```

## F021

**Entry D7-068 (Reflective Subcategory Localization), field input:** Category C, reflective full subcategory R

**Mathlib `CategoryTheory.Reflective`** (Mathlib/CategoryTheory/Adjunction/Reflective.lean):

```lean
class Reflective (R : D ⥤ C) extends R.Full, R.Faithful where
  /-- a choice of a left adjoint to `R` -/
  L : C ⥤ D
  /-- `R` is a right adjoint -/
  adj : L ⊣ R
```

## F022

**Entry D7-068 (Reflective Subcategory Localization), field preserved:** Limits in R (computed in C); objects already in R

**Mathlib `CategoryTheory.monadicOfReflective`** (Mathlib/CategoryTheory/Monad/Adjunction.lean):

```lean
instance (priority := 100) monadicOfReflective [Reflective R] :
    MonadicRightAdjoint R
```

## F023

**Entry D7-068 (Reflective Subcategory Localization), field preserved:** Limits in R (computed in C); objects already in R

**Mathlib `CategoryTheory.monadicCreatesLimits`** (Mathlib/CategoryTheory/Monad/Limits.lean):

```lean
noncomputable def monadicCreatesLimits (R : D ⥤ C) [MonadicRightAdjoint R] :
    CreatesLimitsOfSize.{v, u} R :=
  createsLimitsOfNatIso (Monad.comparisonForget (monadicAdjunction R))
```

## F024

**Entry D7-157 (Normal Closure Construction), field preserved:** Normality

**Mathlib `Subgroup.normalClosure_normal`** (Mathlib/Algebra/Group/Subgroup/Basic.lean):

```lean
instance normalClosure_normal : (normalClosure s).Normal
```

## F025

**Entry D7-157 (Normal Closure Construction), field description:** Forms the smallest normal subgroup containing a subset (or the smallest normal extension containing a field extension).

**Mathlib `Subgroup.normalClosure_le_normal`** (Mathlib/Algebra/Group/Subgroup/Basic.lean):

```lean
theorem normalClosure_le_normal {N : Subgroup G} [N.Normal] (h : s ⊆ N) : normalClosure s ≤ N
```

## F026

**Entry D7-157 (Normal Closure Construction), field output:** Normal closure of S

**Mathlib `Subgroup.normalClosure`** (Mathlib/Algebra/Group/Subgroup/Basic.lean):

```lean
def normalClosure (s : Set G) : Subgroup G :=
  closure (conjugatesOfSet s)
```

## F027

**Entry D7-X02 (Inclusion of a subtopos), field preserved:** Limits (the inclusion is a right adjoint); the subtopos's objects, unchanged

**Mathlib `CategoryTheory.Sheaf.createsLimits`** (Mathlib/CategoryTheory/Sites/Limits.lean):

```lean
instance createsLimits [HasLimitsOfSize.{u₁, u₂} D] :
    CreatesLimitsOfSize.{u₁, u₂} (sheafToPresheaf J D)
```

## F028

**Entry D7-X02 (Inclusion of a subtopos), field description:** Takes a subtopos, such as the j-sheaves of a Lawvere-Tierney topology, to its inclusion into the ambient topos: a geometric embedding, whose direct image is fully faithful and whose inverse image (sheafification) is a left exact left adjoint.

**Mathlib `CategoryTheory.preservesFiniteLimits_presheafToSheaf`** (Mathlib/CategoryTheory/Sites/LeftExact.lean):

```lean
instance preservesFiniteLimits_presheafToSheaf [PreservesLimits (forget D)]
    [∀ X : C, Small.{t, max u v} (J.Cover X)ᵒᵖ] [HasFiniteLimits D] :
    PreservesFiniteLimits (plusPlusSheaf J D)
```

## F029

**Entry D7-X02 (Inclusion of a subtopos), field preserved:** Limits (the inclusion is a right adjoint); the subtopos's objects, unchanged

**Mathlib `CategoryTheory.Adjunction.rightAdjoint_preservesLimits`** (Mathlib/CategoryTheory/Adjunction/Limits.lean):

```lean
lemma rightAdjoint_preservesLimits : PreservesLimitsOfSize.{v, u} G
```

## F030

**Entry D7-284 (Essential Geometric Morphism), field preserved:** Colimits and limits under f^*

**Mathlib `CategoryTheory.Adjunction.rightAdjoint_preservesLimits`** (Mathlib/CategoryTheory/Adjunction/Limits.lean):

```lean
lemma rightAdjoint_preservesLimits : PreservesLimitsOfSize.{v, u} G
```

## F031

**Entry D7-284 (Essential Geometric Morphism), field preserved:** Colimits and limits under f^*

**Mathlib `CategoryTheory.Adjunction.leftAdjoint_preservesColimits`** (Mathlib/CategoryTheory/Adjunction/Limits.lean):

```lean
lemma leftAdjoint_preservesColimits : PreservesColimitsOfSize.{v, u} F
```

## F032

**Entry D7-X03 (Level of an essential inclusion), field preserved:** The adjoint triple (the level is its image); the subtopos

**Mathlib `CategoryTheory.Adjunction.rightAdjoint_preservesLimits`** (Mathlib/CategoryTheory/Adjunction/Limits.lean):

```lean
lemma rightAdjoint_preservesLimits : PreservesLimitsOfSize.{v, u} G
```

## F033

**Entry D7-X03 (Level of an essential inclusion), field preserved:** The adjoint triple (the level is its image); the subtopos

**Mathlib `CategoryTheory.Adjunction.leftAdjoint_preservesColimits`** (Mathlib/CategoryTheory/Adjunction/Limits.lean):

```lean
lemma leftAdjoint_preservesColimits : PreservesColimitsOfSize.{v, u} F
```

## F034

**Entry D4-086 (Covariant derivative), field preserved:** Leibniz rule, tensoriality in X

**Mathlib `IsCovariantDerivativeOn`** (Mathlib/Geometry/Manifold/VectorBundle/CovariantDerivative/Basic.lean):

```lean
structure IsCovariantDerivativeOn
    (cov : (Π x : M, V x) → (Π x : M, TangentSpace I x →L[𝕜] V x))
    (s : Set M := Set.univ) : Prop where
  add {σ σ' : Π x : M, V x} {x}
    (hσ : MDiffAt (T% σ) x) (hσ' : MDiffAt (T% σ') x) (hx : x ∈ s := by trivial) :
    cov (σ + σ') x = cov σ x + cov σ' x
  leibniz {σ : Π x : M, V x} {g : M → 𝕜} {x}
    (hσ : MDiffAt (T% σ) x) (hg : MDiffAt g x) (hx : x ∈ s := by trivial) :
    cov (g • σ) x = g x • cov σ x + (d% g x).smulRight (σ x)
```

## F035

**Entry D4-086 (Covariant derivative), field preserved:** Leibniz rule, tensoriality in X

**Mathlib `IsCovariantDerivativeOn`** (Mathlib/Geometry/Manifold/VectorBundle/CovariantDerivative/Basic.lean):

```lean
structure IsCovariantDerivativeOn
    (cov : (Π x : M, V x) → (Π x : M, TangentSpace I x →L[𝕜] V x))
    (s : Set M := Set.univ) : Prop where
  add {σ σ' : Π x : M, V x} {x}
    (hσ : MDiffAt (T% σ) x) (hσ' : MDiffAt (T% σ') x) (hx : x ∈ s := by trivial) :
    cov (σ + σ') x = cov σ x + cov σ' x
  leibniz {σ : Π x : M, V x} {g : M → 𝕜} {x}
    (hσ : MDiffAt (T% σ) x) (hg : MDiffAt g x) (hx : x ∈ s := by trivial) :
    cov (g • σ) x = g x • cov σ x + (d% g x).smulRight (σ x)
```

## F036

**Entry D1-058 (Matroid contraction), field output:** Matroid M/e = (E \ {e}, I')

**Mathlib `Matroid.contract_ground`** (Mathlib/Combinatorics/Matroid/Minor/Contract.lean):

```lean
@[simp] lemma contract_ground (M : Matroid α) (C : Set α) : (M ／ C).E = M.E \ C
```

## F037

**Entry D1-058 (Matroid contraction), field description:** Contracts an element: the resulting matroid has ground set E \ {e} with rank function r'(A) = r(A ∪ {e}) - r({e}). In matrix representation, corresponds to projecting remaining vectors onto quotient space. Dual to matroid deletion in M*.

**Mathlib `Matroid.dual_contract`** (Mathlib/Combinatorics/Matroid/Minor/Contract.lean):

```lean
lemma dual_contract (M : Matroid α) (X : Set α) : (M ／ X)✶ = M✶ ＼ X
```

## F038

**Entry D1-058 (Matroid contraction), field preserved:** Relative independence structure modulo e

**Mathlib `Matroid.IsNonloop.contractElem_indep_iff`** (Mathlib/Combinatorics/Matroid/Minor/Contract.lean):

```lean
lemma IsNonloop.contractElem_indep_iff (he : M.IsNonloop e) :
    (M ／ {e}).Indep I ↔ e ∉ I ∧ M.Indep (insert e I)
```

## F039

**Entry D2-071 (Gram-Schmidt Orthogonalization), field output:** Orthonormal {e_1,...,e_k}

**Mathlib `InnerProductSpace.gramSchmidtNormed_orthonormal`** (Mathlib/Analysis/InnerProductSpace/GramSchmidtOrtho.lean):

```lean
theorem gramSchmidtNormed_orthonormal {f : ι → E} (h₀ : LinearIndependent 𝕜 f) :
    Orthonormal 𝕜 (gramSchmidtNormed 𝕜 f)
```

## F040

**Entry D2-071 (Gram-Schmidt Orthogonalization), field preserved:** Span, dimension

**Mathlib `InnerProductSpace.span_gramSchmidt`** (Mathlib/Analysis/InnerProductSpace/GramSchmidtOrtho.lean):

```lean
theorem span_gramSchmidt (f : ι → E) : span 𝕜 (range (gramSchmidt 𝕜 f)) = span 𝕜 (range f)
```

## F041

**Entry D2-072 (Localization), field output:** Ring S^{-1}R; a local ring (R_p) when S is the complement of a prime ideal p

**Mathlib `IsLocalization.AtPrime.isLocalRing`** (Mathlib/RingTheory/Localization/AtPrime/Basic.lean):

```lean
theorem AtPrime.isLocalRing [IsLocalization.AtPrime S P] : IsLocalRing S
```

## F042

**Entry D2-072 (Localization), field preserved:** Ring axioms, prime structure (localized)

**Mathlib `IsLocalization.orderIsoOfPrime`** (Mathlib/RingTheory/Localization/Ideal.lean):

```lean
@[simps] def orderIsoOfPrime :
    { p : Ideal S // p.IsPrime } ≃o { p : Ideal R // p.IsPrime ∧ Disjoint (M : Set R) ↑p } where
  toFun p := ⟨p.1.under R, (isPrime_iff_isPrime_disjoint M S p.1).1 p.2⟩
  invFun p := ⟨Ideal.map (algebraMap R S) p.1, isPrime_of_isPrime_disjoint M S p.1 p.2.1 p.2.2⟩
  left_inv J := Subtype.ext (map_under M S J)
  right_inv I := Subtype.ext (under_map_of_isPrime_disjoint M S I.2.1 I.2.2)
```

## F043

**Entry D2-075 (Field of Fractions Construction), field output:** Frac(R)

**Mathlib `FractionRing.field`** (Mathlib/RingTheory/Localization/FractionRing.lean):

```lean
noncomputable instance field : Field (FractionRing A)
```

## F044

**Entry D2-075 (Field of Fractions Construction), field preserved:** Ring ops, injectivity R -> Frac(R)

**Mathlib `IsFractionRing.injective`** (Mathlib/RingTheory/Localization/FractionRing.lean):

```lean
protected theorem injective : Function.Injective (algebraMap R K)
```

## F045

**Entry D2-075 (Field of Fractions Construction), field description:** Integral domain to smallest containing field.

**Mathlib `IsFractionRing.lift`** (Mathlib/RingTheory/Localization/FractionRing.lean):

```lean
noncomputable def lift (hg : Injective g) : K →+* L :=
  IsLocalization.lift fun y : nonZeroDivisors A => isUnit_map_of_injective hg y
```

## F046

**Entry D2-080 (Noether Normalization), field output:** Polynomial subring k[y_1,...,y_d] with A finite over it

**Mathlib `exists_finite_inj_algHom_of_fg`** (Mathlib/RingTheory/NoetherNormalization.lean):

```lean
theorem exists_finite_inj_algHom_of_fg : ∃ s, ∃ g : (MvPolynomial (Fin s) k) →ₐ[k] R,
    Function.Injective g ∧ g.Finite
```

## F047

**Entry D2-145 (Coset Construction), field preserved:** Group action, index [G:H]

**Mathlib `MulAction.quotient`** (Mathlib/GroupTheory/GroupAction/Quotient.lean):

```lean
instance quotient [QuotientAction X H] : MulAction X (G ⧸ H)
```

## F048

**Entry D2-145 (Coset Construction), field preserved:** Group action, index [G:H]

**Mathlib `Subgroup.index`** (Mathlib/GroupTheory/Index.lean):

```lean
noncomputable def index : ℕ :=
  Nat.card (G ⧸ H)
```

## F049

**Entry D2-168 (Stone-Cech Compactification), field output:** Compact Hausdorff βX with X dense

**Mathlib `denseRange_stoneCechUnit`** (Mathlib/Topology/Compactification/StoneCech.lean):

```lean
theorem denseRange_stoneCechUnit : DenseRange (stoneCechUnit : α → StoneCech α)
```

## F050

**Entry D2-168 (Stone-Cech Compactification), field preserved:** Continuous function extension

**Mathlib `stoneCechExtend_extends`** (Mathlib/Topology/Compactification/StoneCech.lean):

```lean
lemma stoneCechExtend_extends : stoneCechExtend hg ∘ stoneCechUnit = g
```

## F051

**Entry D2-168 (Stone-Cech Compactification), field broken:** Separability, metrizability

**Mathlib `DenseRange.separableSpace`** (Mathlib/Topology/Bases.lean):

```lean
protected theorem _root_.DenseRange.separableSpace [SeparableSpace α] [TopologicalSpace β]
    {f : α → β} (h : DenseRange f) (h' : Continuous f) : SeparableSpace β
```

## F052

**Entry D2-180 (Grothendieck Group Construction), field output:** K(M)

**Mathlib `Algebra.GrothendieckGroup.instCommGroup`** (Mathlib/GroupTheory/MonoidLocalization/GrothendieckGroup.lean):

```lean
instance instCommGroup : CommGroup (GrothendieckGroup M)
```

## F053

**Entry D2-180 (Grothendieck Group Construction), field preserved:** Monoid structure, formal differences

**Mathlib `Algebra.GrothendieckGroup.of`** (Mathlib/GroupTheory/MonoidLocalization/GrothendieckGroup.lean):

```lean
abbrev of : M →* GrothendieckGroup M := (monoidOf ⊤).toMonoidHom
```

## F054

**Entry D2-180 (Grothendieck Group Construction), field broken:** Non-cancellation

**Mathlib `Algebra.GrothendieckGroup.of_injective`** (Mathlib/GroupTheory/MonoidLocalization/GrothendieckGroup.lean):

```lean
lemma of_injective [IsCancelMul M] : Injective (of (M := M))
```

## F055

**Entry D2-195 (Snake Lemma Construction), field output:** Snake exact sequence

**Mathlib `CategoryTheory.ShortComplex.SnakeInput.snake_lemma`** (Mathlib/Algebra/Homology/ShortComplex/SnakeLemma.lean):

```lean
lemma snake_lemma : S.composableArrows.Exact
```

## F056

**Entry D2-195 (Snake Lemma Construction), field preserved:** Exactness, connecting map

**Mathlib `CategoryTheory.ShortComplex.SnakeInput.δ`** (Mathlib/Algebra/Homology/ShortComplex/SnakeLemma.lean):

```lean
noncomputable def δ : S.L₀.X₃ ⟶ S.L₃.X₁ :=
  S.L₀'_exact.desc (S.φ₁ ≫ S.v₂₃.τ₁) (by simp only [L₁_f_φ₁_assoc, w₁₃_τ₁])
```

## F057

**Entry D2-196 (Five Lemma Construction), field description:** In a commutative diagram with exact rows, if the four outer maps are epi, iso, iso, mono (in particular, four isomorphisms), the middle map is an isomorphism.

**Mathlib `MonoidHom.bijective_of_surjective_of_bijective_of_bijective_of_injective`** (Mathlib/Algebra/FiveLemma.lean):

```lean
lemma bijective_of_surjective_of_bijective_of_bijective_of_injective (hi₁ : Function.Surjective i₁)
    (hi₂ : Function.Bijective i₂) (hi₄ : Function.Bijective i₄) (hi₅ : Function.Injective i₅) :
    Function.Bijective i₃
```

## F058

**Entry D3-035 (Fraïssé limit construction), field input:** Countable class of finite structures with HP, JEP, AP

**Mathlib `FirstOrder.Language.IsFraisse`** (Mathlib/ModelTheory/Fraisse.lean):

```lean
class IsFraisse : Prop where
  is_nonempty : K.Nonempty
  FG : ∀ M : Bundled.{w} L.Structure, M ∈ K → Structure.FG L M
  is_essentially_countable : (Quotient.mk' '' K).Countable
  hereditary : Hereditary K
  jointEmbedding : JointEmbedding K
  amalgamation : Amalgamation K
```

## F059

**Entry D3-035 (Fraïssé limit construction), field output:** Fraïssé limit: countable, ultrahomogeneous

**Mathlib `FirstOrder.Language.IsFraisseLimit`** (Mathlib/ModelTheory/Fraisse.lean):

```lean
structure IsFraisseLimit [Countable (Σ l, L.Functions l)] [Countable M] : Prop where
  protected ultrahomogeneous : IsUltrahomogeneous L M
  protected age : L.age M = K
```

## F060

**Entry D3-035 (Fraïssé limit construction), field description:** From a countable class of finitely generated structures with the hereditary, joint embedding and amalgamation properties, constructs a countable ultrahomogeneous structure whose age is the class, unique up to isomorphism (e.g., the random graph, the rational order). For a finite language it is ω-categorical exactly when the class is uniformly locally finite.

**Mathlib `FirstOrder.Language.IsFraisseLimit.nonempty_equiv`** (Mathlib/ModelTheory/Fraisse.lean):

```lean
theorem nonempty_equiv : Nonempty (M ≃[L] N)
```

## F061

**Entry D3-114 (Yoneda embedding), field output:** Full and faithful embedding C -> [C^op, Set]

**Mathlib `CategoryTheory.Yoneda.fullyFaithful`** (Mathlib/CategoryTheory/Yoneda.lean):

```lean
def fullyFaithful : (yoneda (C := C)).FullyFaithful where
  preimage f := f.app _ (𝟙 _)
  map_preimage := by -- this was automatic
    intro Z W f
    ext X x
    have := f.naturality_apply x.op (𝟙 Z)
```

## F062

**Entry D3-114 (Yoneda embedding), field preserved:** Full faithfulness, representability

**Mathlib `CategoryTheory.Yoneda.fullyFaithful`** (Mathlib/CategoryTheory/Yoneda.lean):

```lean
def fullyFaithful : (yoneda (C := C)).FullyFaithful where
  preimage f := f.app _ (𝟙 _)
  map_preimage := by -- this was automatic
    intro Z W f
    ext X x
    have := f.naturality_apply x.op (𝟙 Z)
```

## F063

**Entry D1-060 (Matroid minor), field output:** Minor matroid N

**Mathlib `Matroid.IsMinor`** (Mathlib/Combinatorics/Matroid/Minor/Order.lean):

```lean
def IsMinor (N M : Matroid α) : Prop := ∃ C D, N = M ／ C ＼ D
```

## F064

**Entry D1-060 (Matroid minor), field description:** Result of any sequence of deletion and contraction operations. Gives rise to forbidden-minor characterizations of matroid classes. Minors are not well-quasi-ordered on all matroids; for matroids representable over a fixed finite field, well-quasi-ordering is a conjecture of Robertson and Seymour, proved for bounded branchwidth (Geelen, Gerards and Whittle announced a proof of the related Rota conjecture in 2014, unpublished).

**Mathlib `Matroid.IsMinor.trans`** (Mathlib/Combinatorics/Matroid/Minor/Order.lean):

```lean
lemma IsMinor.trans {M₁ M₂ M₃ : Matroid α} (h : M₁ ≤m M₂) (h' : M₂ ≤m M₃) : M₁ ≤m M₃
```

## F065

**Entry D1-098 (Order isomorphism), field description:** A bijection between posets that preserves the ordering in both directions: f(a) ≤ f(b) iff a ≤ b. The strongest structure-preserving map between posets.

**Mathlib `OrderIso.le_iff_le`** (Mathlib/Order/Hom/Basic.lean):

```lean
theorem le_iff_le (e : α ≃o β) {x y : α} : e x ≤ e y ↔ x ≤ y
```

## F066

**Entry D2-051 (Jordan-Chevalley Decomposition), field output:** D (diagonalizable) + N (nilpotent), DN = ND

**Mathlib `Module.End.exists_isNilpotent_isSemisimple`** (Mathlib/LinearAlgebra/JordanChevalley.lean):

```lean
theorem exists_isNilpotent_isSemisimple [PerfectField K] :
    ∃ᵉ (n ∈ adjoin K {f}) (s ∈ adjoin K {f}), IsNilpotent n ∧ IsSemisimple s ∧ f = n + s
```

## F067

**Entry D2-073 (Completion (I-adic)), field description:** The inverse limit of the quotients R/I^n (for k[x] at the ideal (x), the formal power series ring k[[x]]). The map from R is injective, so the completion extends R, exactly when the powers of I intersect in zero.

**Mathlib `AdicCompletion.of_injective_iff`** (Mathlib/RingTheory/AdicCompletion/Basic.lean):

```lean
theorem of_injective_iff : Function.Injective (of I M) ↔ IsHausdorff I M
```

## F068

**Entry D2-110 (Pontryagin Duality), field description:** LCA group G -> dual group G^ of characters. G ≅ G^^.

**Mathlib `AddChar.doubleDualEmb_bijective`** (Mathlib/Analysis/Fourier/FiniteAbelian/PontryaginDuality.lean):

```lean
lemma doubleDualEmb_bijective : Bijective (doubleDualEmb : α → AddChar (AddChar α ℂ) ℂ)
```

## F069

**Entry D2-112 (Spec Construction), field preserved:** Ring structure (recovered from global sections)

**Mathlib `AlgebraicGeometry.Scheme.ΓSpecIso`** (Mathlib/AlgebraicGeometry/Scheme.lean):

```lean
def ΓSpecIso : Γ(Spec R, ⊤) ≅ R := SpecΓIdentity.app R
```

## F070

**Entry D2-112 (Spec Construction), field output:** Affine scheme (Spec(R), O)

**Mathlib `AlgebraicGeometry.Spec`** (Mathlib/AlgebraicGeometry/Scheme.lean):

```lean
def Spec (R : CommRingCat) : Scheme where
  local_affine _ := ⟨⟨⊤, trivial⟩, R, ⟨(Spec.toLocallyRingedSpace.obj (op R)).restrictTopIso⟩⟩
  toLocallyRingedSpace := Spec.locallyRingedSpaceObj R
```

## F071

**Entry D2-153 (Eilenberg-Moore Algebra Construction), field preserved:** Monad structure, adjunction

**Mathlib `CategoryTheory.Monad.adj`** (Mathlib/CategoryTheory/Monad/Algebra.lean):

```lean
def adj : T.free ⊣ T.forget :=
  Adjunction.mkOfHomEquiv
    { homEquiv := fun X Y =>
        { toFun := fun f => T.η.app X ≫ f.f
          invFun := fun f =>
            { f := T.map f ≫ Y.a
```

## F072

**Entry D2-153 (Eilenberg-Moore Algebra Construction), field output:** Category C^T of T-algebras

**Mathlib `CategoryTheory.Monad.Algebra`** (Mathlib/CategoryTheory/Monad/Algebra.lean):

```lean
structure Algebra (T : Monad C) : Type max u₁ v₁ where
  /-- The underlying object associated to an algebra. -/
  A : C
  /-- The structure morphism associated to an algebra. -/
  a : (T : C ⥤ C).obj A ⟶ A
  /-- The unit axiom associated to an algebra. -/
  unit : T.η.app A ≫ a = 𝟙 A
```

## F073

**Entry D2-154 (Kleisli Category Construction), field output:** Kleisli category C_T

**Mathlib `CategoryTheory.Kleisli`** (Mathlib/CategoryTheory/Monad/Kleisli.lean):

```lean
structure Kleisli (T : Monad C) where mk (T) ::
  /-- The underlying object of the base category. -/
  of : C
```

## F074

**Entry D2-154 (Kleisli Category Construction), field preserved:** Monad structure, free algebras

**Mathlib `CategoryTheory.Kleisli.Adjunction.adj`** (Mathlib/CategoryTheory/Monad/Kleisli.lean):

```lean
def adj : toKleisli T ⊣ fromKleisli T :=
  Adjunction.mkOfHomEquiv
    { homEquiv X Y := { toFun f := f.of, invFun f := .mk f }
      homEquiv_naturality_left_symm := fun {X} {Y} {Z} f g => by
        ext
        simp [← T.η.naturality_assoc g] }
```

## F075

**Entry D2-188 (Adjoint Functor Construction), field description:** Constructs left/right adjoint via Freyd's theorem.

**Mathlib `CategoryTheory.isRightAdjoint_of_preservesLimits_of_solutionSetCondition`** (Mathlib/CategoryTheory/Adjunction/AdjointFunctorTheorems.lean):

```lean
lemma isRightAdjoint_of_preservesLimits_of_solutionSetCondition [HasLimitsOfSize.{w, w} D]
    [PreservesLimitsOfSize.{w, w} G] (hG : SolutionSetCondition.{w} G)
    [LocallySmall.{w} D] : G.IsRightAdjoint
```

## F076

**Entry D7-290 (Sheafification), field description:** Left adjoint to the inclusion of sheaves into presheaves; the plus construction applied twice.

**Mathlib `CategoryTheory.GrothendieckTopology.sheafify`** (Mathlib/CategoryTheory/Sites/ConcreteSheafification.lean):

```lean
noncomputable def sheafify (P : Cᵒᵖ ⥤ D) : Cᵒᵖ ⥤ D :=
  J.plusObj (J.plusObj P)
```

## F077

**Entry D7-290 (Sheafification), field description:** Left adjoint to the inclusion of sheaves into presheaves; the plus construction applied twice.

**Mathlib `CategoryTheory.sheafificationAdjunction`** (Mathlib/CategoryTheory/Sites/Sheafification.lean):

```lean
def sheafificationAdjunction [HasWeakSheafify J A] :
    presheafToSheaf J A ⊣ sheafToPresheaf J A := Adjunction.ofIsRightAdjoint _
```

## F078

**Entry D4-414 (Vector bundle construction), field description:** Constructs vector bundle from transition functions. See also Domain 2 (D2-184).

**Mathlib `VectorBundleCore`** (Mathlib/Topology/VectorBundle/Basic.lean):

```lean
structure VectorBundleCore (ι : Type*) where
  baseSet : ι → Set B
  isOpen_baseSet : ∀ i, IsOpen (baseSet i)
  indexAt : B → ι
  mem_baseSet_at : ∀ x, x ∈ baseSet (indexAt x)
  coordChange : ι → ι → B → F →L[R] F
  coordChange_self : ∀ i, ∀ x ∈ baseSet i, ∀ v, coordChange i i x v = v
  continuousOn_coordChange : ∀ i j, ContinuousOn (coordChange i j) (baseSet i ∩ baseSet j)
  coordChange_comp : ∀ i j k, ∀ x ∈ baseSet i ∩ baseSet j ∩ baseSet k, ∀ v,
    (coordChange j k x) (coordChange i j x v) = coordChange i k x v
```

## F079

**Entry D4-010 (Abelianization), field output:** Abelian group G^{ab} = G/[G,G]

**Mathlib `Abelianization`** (Mathlib/GroupTheory/Abelianization/Defs.lean):

```lean
def Abelianization : Type u :=
  G ⧸ commutator G
```

## F080

**Entry D4-010 (Abelianization), field preserved:** Abelian quotient structure, H_1

**Mathlib `Abelianization.of`** (Mathlib/GroupTheory/Abelianization/Defs.lean):

```lean
def of : G →* Abelianization G where
  toFun := QuotientGroup.mk
  map_one' := rfl
  map_mul' _ _ := rfl
```

## F081

**Entry D4-072 (Compact-open topology construction), field output:** Function space Map(X,Y) with compact-open topology

**Mathlib `ContinuousMap.compactOpen`** (Mathlib/Topology/CompactOpen.lean):

```lean
instance compactOpen : TopologicalSpace C(X, Y)
```

## F082

**Entry D4-127 (Exterior derivative), field preserved:** d∘d = 0, Stokes theorem, de Rham cohomology

**Mathlib `extDeriv_extDeriv`** (Mathlib/Analysis/Calculus/DifferentialForm/Basic.lean):

```lean
theorem extDeriv_extDeriv (h : ContDiff 𝕜 r ω) (hr : minSmoothness 𝕜 2 ≤ r) :
    extDeriv (extDeriv ω) = 0
```

## F083

**Entry D4-249 (Metrization), field description:** Determines whether topological space admits a compatible metric. Urysohn/Nagata-Smirnov theorems.

**Mathlib `TopologicalSpace.metrizableSpace_of_t3_secondCountable`** (Mathlib/Topology/Metrizable/Urysohn.lean):

```lean
instance (priority := 90) metrizableSpace_of_t3_secondCountable : MetrizableSpace X
```

## F084

**Entry D4-273 (One-point compactification), field preserved:** Local topology of X, compactness achieved

**Mathlib `OnePoint.isOpenEmbedding_coe`** (Mathlib/Topology/Compactification/OnePoint/Basic.lean):

```lean
theorem isOpenEmbedding_coe : IsOpenEmbedding ((↑) : X → OnePoint X)
```

## F085

**Entry D4-273 (One-point compactification), field broken:** Non-compactness, separation at infinity

**Mathlib `OnePoint.denseRange_coe`** (Mathlib/Topology/Compactification/OnePoint/Basic.lean):

```lean
theorem denseRange_coe [NoncompactSpace X] : DenseRange ((↑) : X → OnePoint X)
```

## F086

**Entry D4-373 (Stone-Cech compactification), field output:** Compact Hausdorff βX with X dense

**Mathlib `denseRange_stoneCechUnit`** (Mathlib/Topology/Compactification/StoneCech.lean):

```lean
theorem denseRange_stoneCechUnit : DenseRange (stoneCechUnit : α → StoneCech α)
```

## F087

**Entry D4-373 (Stone-Cech compactification), field preserved:** Universal property, continuous function extension

**Mathlib `stoneCechExtend_extends`** (Mathlib/Topology/Compactification/StoneCech.lean):

```lean
lemma stoneCechExtend_extends : stoneCechExtend hg ∘ stoneCechUnit = g
```

## F088

**Entry D4-373 (Stone-Cech compactification), field broken:** Metrizability, separability, cardinality

**Mathlib `DenseRange.separableSpace`** (Mathlib/Topology/Bases.lean):

```lean
protected theorem _root_.DenseRange.separableSpace [SeparableSpace α] [TopologicalSpace β]
    {f : α → β} (h : DenseRange f) (h' : Continuous f) : SeparableSpace β
```

## F089

**Entry D4-427 (Whitney embedding), field description:** Embeds n-manifold into R^{2n}. Whitney embedding theorem: every smooth n-manifold embeds in R^{2n}.

**Mathlib `SmoothBumpCovering.embeddingPiTangent_injective`** (Mathlib/Geometry/Manifold/WhitneyEmbedding.lean):

```lean
theorem embeddingPiTangent_injective (f : SmoothBumpCovering ι I M) :
    Injective f.embeddingPiTangent
```

## F090

**Entry D4-436 (Zariski topology construction), field output:** (Spec(R), Zariski topology)

**Mathlib `PrimeSpectrum.isClosed_iff_zeroLocus`** (Mathlib/RingTheory/Spectrum/Prime/Topology.lean):

```lean
theorem isClosed_iff_zeroLocus (Z : Set (PrimeSpectrum R)) : IsClosed Z ↔ ∃ s, Z = zeroLocus s
```

## F091

**Entry D8-125 (Log transform), field preserved:** Order (log is strictly increasing on the positive reals)

**Mathlib `Real.strictMonoOn_log`** (Mathlib/Analysis/SpecialFunctions/Log/Basic.lean):

```lean
theorem strictMonoOn_log : StrictMonoOn log (Set.Ioi 0)
```

## F092

**Entry D8-125 (Log transform), field description:** Applies y = log x to positive data. Multiplicative relations become additive, and large values are compressed, spreading skewed data more evenly.

**Mathlib `Real.log_mul`** (Mathlib/Analysis/SpecialFunctions/Log/Basic.lean):

```lean
theorem log_mul (hx : x ≠ 0) (hy : y ≠ 0) : log (x * y) = log x + log y
```

## F093

**Entry D8-107 (Jordan decomposition), field description:** Writes a square matrix as P J P^-1 with J block diagonal of Jordan blocks (over an algebraically closed field).

**Mathlib `Module.End.exists_isNilpotent_isSemisimple`** (Mathlib/LinearAlgebra/JordanChevalley.lean):

```lean
theorem exists_isNilpotent_isSemisimple [PerfectField K] :
    ∃ᵉ (n ∈ adjoin K {f}) (s ∈ adjoin K {f}), IsNilpotent n ∧ IsSemisimple s ∧ f = n + s
```
