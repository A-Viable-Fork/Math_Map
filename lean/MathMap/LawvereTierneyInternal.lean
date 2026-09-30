import Mathlib.CategoryTheory.Subobject.Classifier.Defs
import Mathlib.CategoryTheory.Limits.Shapes.BinaryProducts.ProdComparison
import Mathlib.CategoryTheory.Limits.Shapes.Equalizers

/-!
# Lawvere–Tierney topologies, internally (D7-288)

The internal version of `MathMap.LTTopology`, in any category with a subobject classifier, binary
products and pullbacks. Mathlib at the pin has no internal meet on the subobject classifier; it is
built here as the classifying map of the subobject `⟨true, true⟩ : 1 ⟶ Ω × Ω`, and
`internalAnd_classifies` shows it is the nLab's internal intersection map: composed with the pair of
classifying maps of two subobjects, it classifies their intersection.

The nLab's three axioms then define a Lawvere–Tierney topology `j : Ω ⟶ Ω`. The surviving truth
values are the object `Ω_j` of `j`-fixed truth values, the equalizer of `j` and the identity. `Ω`
retracts onto it, and the retraction is mono exactly when `j` is the identity: `j` collapses truth
values unless it is the trivial topology.
-/

namespace MathMap

open CategoryTheory Limits HasSubobjectClassifier

universe v u

variable {C : Type u} [Category.{v} C] [HasSubobjectClassifier C]

section Meet

variable [HasBinaryProducts C]

instance truthPair_mono : Mono (prod.lift (truth C) (truth C)) :=
  (HasSubobjectClassifier.exists_classifier.some.isTerminalΩ₀).mono_from _

/-- The internal meet on the subobject classifier: the classifying map of `⟨true, true⟩`. -/
noncomputable def internalAnd : Ω C ⨯ Ω C ⟶ Ω C :=
  χ (prod.lift (truth C) (truth C))

variable [HasPullbacks C]

/-- D7-288, description: `internalAnd` is the internal intersection map. For monos `m : A ⟶ X` and
`n : B ⟶ X`, the pair of their classifying maps followed by `internalAnd` classifies their
intersection (the pullback). -/
theorem internalAnd_classifies {A B X : C} (m : A ⟶ X) (n : B ⟶ X) [Mono m] [Mono n] :
    prod.lift (χ m) (χ n) ≫ internalAnd = χ (pullback.fst m n ≫ m) := by
  have hT := (HasSubobjectClassifier.exists_classifier.some.isTerminalΩ₀ (C := C))
  have h₁ : IsPullback (pullback.fst m n ≫ m) (hT.from (pullback m n)) (prod.lift (χ m) (χ n))
      (prod.lift (truth C) (truth C)) := by
    refine IsPullback.of_isLimit' ⟨by
      apply prod.hom_ext
      · simp only [Category.assoc, prod.lift_fst]
        rw [HasSubobjectClassifier.comm, ← Category.assoc]; congr 1; exact hT.hom_ext _ _
      · simp only [Category.assoc, prod.lift_snd]
        rw [← Category.assoc, pullback.condition, Category.assoc, HasSubobjectClassifier.comm,
          ← Category.assoc]; congr 1; exact hT.hom_ext _ _⟩ ?_
    refine PullbackCone.IsLimit.mk _ (fun s => pullback.lift
        ((isPullback_χ m).lift s.fst s.snd (by simpa using s.condition =≫ prod.fst))
        ((isPullback_χ n).lift s.fst s.snd (by simpa using s.condition =≫ prod.snd))
        (by simp)) (fun s => by simp) (fun s => hT.hom_ext _ _) (fun s l h₁ _ => ?_)
    rw [← cancel_mono (pullback.fst m n ≫ m)]
    simpa using h₁
  refine unique _ _ ?_
  convert h₁.paste_vert (isPullback_χ (prod.lift (truth C) (truth C))) using 1
  all_goals first | rfl | exact hT.hom_ext _ _

end Meet

variable [HasBinaryProducts C]

/-- D7-288: a Lawvere–Tierney topology, internally (the nLab's three axioms). -/
structure LawvereTierney (C : Type u) [Category.{v} C] [HasSubobjectClassifier C]
    [HasBinaryProducts C] where
  /-- The operator on truth values. -/
  j : Ω C ⟶ Ω C
  /-- `j true = true`. -/
  truth_comp : truth C ≫ j = truth C
  /-- `j j = j`. -/
  idem : j ≫ j = j
  /-- `j ∘ ∧ = ∧ ∘ (j × j)`. -/
  and_comp : internalAnd ≫ j = prod.map j j ≫ internalAnd

namespace LawvereTierney

variable [HasEqualizers C] (J : LawvereTierney C)

/-- The surviving truth values: the `j`-fixed (closed) truth values, the equalizer of `j` and the
identity. -/
noncomputable abbrev Ωj : C := equalizer J.j (𝟙 (Ω C))

/-- The inclusion of the surviving truth values. -/
noncomputable abbrev incl : J.Ωj ⟶ Ω C := equalizer.ι J.j (𝟙 _)

/-- The collapse of truth values onto the surviving ones: `j`, corestricted to its fixed points. -/
noncomputable def close : Ω C ⟶ J.Ωj := equalizer.lift J.j (by simp [J.idem])

/-- D7-288, broken: `close` followed by the inclusion is `j`. -/
@[reassoc (attr := simp)]
theorem close_incl : J.close ≫ J.incl = J.j := equalizer.lift_ι _ _

/-- D7-288, broken: the truth values retract onto the surviving ones. -/
@[reassoc (attr := simp)]
theorem incl_close : J.incl ≫ J.close = 𝟙 J.Ωj := by
  rw [← cancel_mono J.incl, Category.assoc, close_incl, Category.id_comp]
  simpa using equalizer.condition J.j (𝟙 _)

/-- D7-288, broken: the retraction onto the surviving truth values identifies truth values
(is not mono) unless `j` is the trivial topology, the identity. -/
theorem mono_close_iff : Mono J.close ↔ J.j = 𝟙 (Ω C) := by
  constructor
  · intro _
    rw [← cancel_mono J.close, Category.id_comp, ← close_incl, Category.assoc, incl_close,
      Category.comp_id]
  · intro h
    exact ⟨fun g k e => by simpa [h] using e =≫ J.incl⟩

end LawvereTierney

end MathMap
