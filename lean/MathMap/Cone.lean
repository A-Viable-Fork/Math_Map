import Mathlib.Topology.Homotopy.Contractible
import Mathlib.Topology.CompactOpen
import Mathlib.Topology.UnitInterval
import Mathlib.Topology.Separation.Connected

/-!
# The cone on a space (D4-075)

The map's entry D4-075 gives the cone as `CX = X × [0,1] / (X × {1})`. This file builds that quotient
and proves it contractible when `X` is nonempty. For empty `X` the quotient is empty, which is not
contractible; the usual definition attaches the cylinder to a point instead, and the two agree for
nonempty `X` (see `mapfill/conditions.js`). It also proves that `X` embeds as the base, which the
corrected entry says the cone preserves.
-/

namespace MathMap

open unitInterval Topology

variable (X : Type*) [TopologicalSpace X]

/-- Two points of the cylinder are identified when they are equal or both lie on the top, `X × {1}`. -/
def coneSetoid : Setoid (X × I) where
  r p q := p = q ∨ (p.2 = 1 ∧ q.2 = 1)
  iseqv := by
    refine ⟨fun p => Or.inl rfl, ?_, ?_⟩
    · rintro p q (h | ⟨hp, hq⟩)
      · exact Or.inl h.symm
      · exact Or.inr ⟨hq, hp⟩
    · rintro p q r (h | ⟨hp, hq⟩) (h' | ⟨hq', hr⟩)
      · exact Or.inl (h.trans h')
      · subst h; exact Or.inr ⟨hq', hr⟩
      · subst h'; exact Or.inr ⟨hp, hq⟩
      · exact Or.inr ⟨hp, hr⟩

/-- D4-075, output: the cone `X × [0,1] / (X × {1})`, with the quotient topology. -/
def Cone : Type _ := Quotient (coneSetoid X)

instance : TopologicalSpace (Cone X) := inferInstanceAs (TopologicalSpace (Quotient (coneSetoid X)))

variable {X}

/-- The quotient map from the cylinder. -/
def Cone.mk (p : X × I) : Cone X := Quotient.mk (coneSetoid X) p

theorem Cone.isQuotientMap_mk : IsQuotientMap (Cone.mk : X × I → Cone X) := isQuotientMap_quotient_mk'

theorem Cone.continuous_mk : Continuous (Cone.mk : X × I → Cone X) := Cone.isQuotientMap_mk.continuous

/-- `1 - (1 - t)(1 - s)`: slides `s` toward `1` as `t` goes from `0` to `1`. -/
def squeeze (t s : I) : I := σ ⟨(σ t : ℝ) * (σ s : ℝ), mul_mem (σ t).2 (σ s).2⟩

theorem continuous_squeeze : Continuous fun p : I × I => squeeze p.1 p.2 :=
  continuous_symm.comp (Continuous.subtype_mk (by fun_prop) _)

theorem squeeze_zero (s : I) : squeeze 0 s = s := by
  ext; simp [squeeze, coe_symm_eq]

theorem squeeze_one (s : I) : squeeze 1 s = 1 := by
  ext; simp [squeeze, coe_symm_eq]

theorem squeeze_top (t : I) : squeeze t 1 = 1 := by
  ext; simp [squeeze, coe_symm_eq]

/-- The contraction of the cone toward its top, on representatives. -/
def Cone.slide (t : I) : Cone X → Cone X :=
  Quotient.lift (fun p : X × I => Cone.mk (p.1, squeeze t p.2)) (by
    rintro p q (h | ⟨hp, hq⟩)
    · rw [h]
    · exact Quotient.sound (Or.inr ⟨by simp [hp, squeeze_top], by simp [hq, squeeze_top]⟩))

theorem Cone.continuous_slide : Continuous fun p : I × Cone X => Cone.slide p.1 p.2 :=
  Cone.isQuotientMap_mk.continuous_lift_prod_right
    (Cone.continuous_mk.comp (continuous_snd.fst.prodMk
      (continuous_squeeze.comp (continuous_fst.prodMk continuous_snd.snd))) |>.congr fun _ => rfl)

/-- The vertex of the cone. -/
noncomputable def Cone.vertex [Nonempty X] : Cone X := Cone.mk (Classical.arbitrary X, 1)

/-- D4-075, output: the cone on a nonempty space is contractible. -/
theorem Cone.contractible [Nonempty X] : ContractibleSpace (Cone X) := by
  rw [contractible_iff_id_nullhomotopic]
  refine ⟨Cone.vertex, ⟨{
    toFun := fun p => Cone.slide p.1 p.2
    continuous_toFun := Cone.continuous_slide
    map_zero_left := fun c => ?_
    map_one_left := fun c => ?_ }⟩⟩
  · induction c using Quotient.inductionOn with
    | h p => exact congrArg Cone.mk (Prod.ext rfl (squeeze_zero p.2))
  · induction c using Quotient.inductionOn with
    | h p => exact Quotient.sound (Or.inr ⟨squeeze_one p.2, rfl⟩)

/-- The base of the cone, `x ↦ [x, 0]`. -/
def Cone.base (x : X) : Cone X := Cone.mk (x, 0)

/-- The part of the cylinder below the top, `X × [0,1)`, is saturated: nothing in it is identified with
anything else. -/
theorem Cone.mk_eq_mk_of_ne_one {p q : X × I} (hp : p.2 ≠ 1) (h : Cone.mk p = Cone.mk q) : p = q := by
  rcases Quotient.exact h with h | ⟨h1, _⟩
  · exact h
  · exact absurd h1 hp

/-- D4-075, preserved: `X` embeds in its cone as the base. -/
theorem Cone.isEmbedding_base : IsEmbedding (Cone.base : X → Cone X) := by
  have hc : Continuous (Cone.base : X → Cone X) := Cone.continuous_mk.comp (continuous_id.prodMk continuous_const)
  refine ⟨⟨le_antisymm (continuous_iff_le_induced.1 hc) fun O hO => ?_⟩, fun x y h => ?_⟩
  · -- The image of `O × [0,1)` is open in the cone and pulls back to `O`.
    let A : Set (X × I) := O ×ˢ {s | s ≠ 1}
    have hpre : Cone.mk ⁻¹' (Cone.mk '' A) = A := by
      ext p
      constructor
      · rintro ⟨a, ha, hap⟩
        rw [← Cone.mk_eq_mk_of_ne_one ha.2 hap]; exact ha
      · intro hp; exact ⟨p, hp, rfl⟩
    refine isOpen_induced_iff.2 ⟨Cone.mk '' A, ?_, ?_⟩
    · rw [← Cone.isQuotientMap_mk.isOpen_preimage, hpre]; exact hO.prod isOpen_ne
    · ext x
      change Cone.mk (x, 0) ∈ Cone.mk '' A ↔ x ∈ O
      rw [← Set.mem_preimage, hpre]
      simp [A]
  · exact congrArg Prod.fst (Cone.mk_eq_mk_of_ne_one (p := (x, 0)) (by simp) h)

/-- D4-075, broken: the cone keeps the homotopy type of its base exactly when the base is already
contractible. -/
theorem Cone.homotopyEquiv_iff [Nonempty X] :
    Nonempty (ContinuousMap.HomotopyEquiv (Cone X) X) ↔ ContractibleSpace X := by
  have : ContractibleSpace (Cone X) := Cone.contractible
  constructor
  · rintro ⟨e⟩; exact e.symm.contractibleSpace
  · intro _
    obtain ⟨a⟩ := ContractibleSpace.hequiv_unit (Cone X)
    obtain ⟨b⟩ := ContractibleSpace.hequiv_unit X
    exact ⟨a.trans b.symm⟩

/-- D4-075, broken: the cone loses the homotopy type of its base. The cone on the two-point space is
contractible, so it is not homotopy equivalent to the two-point space. -/
theorem Cone.not_homotopyEquiv_bool : IsEmpty (ContinuousMap.HomotopyEquiv (Cone Bool) Bool) := by
  refine ⟨fun e => ?_⟩
  have : ContractibleSpace (Cone Bool) := Cone.contractible
  have : ContractibleSpace Bool := e.symm.contractibleSpace
  exact absurd ((PreconnectedSpace.trivial_of_discrete (X := Bool)).elim true false) (by decide)

end MathMap
