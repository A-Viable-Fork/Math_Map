import MathMap.Topos
import Mathlib.CategoryTheory.Types.Basic
import Mathlib.CategoryTheory.Limits.Types.Colimits
import Mathlib.CategoryTheory.ObjectProperty.FullSubcategory

/-!
# The inclusion of a subtopos need not preserve colimits (D7-X02)

The degenerate subtopos of `Type`: the full subcategory of one-element types, reflected by the
constant functor. Its reflector is left exact (every cone in it is a limit), so it is a `Subtopos`;
its inclusion sends the initial object (a one-element type) to a nonempty type, which is not initial.
-/

namespace MathMap

open CategoryTheory Limits

noncomputable section

/-- One-element types. -/
def oneElement : ObjectProperty (Type) := fun X => Nonempty (Unique X)

instance (X Y : oneElement.FullSubcategory) : Subsingleton (X ⟶ Y) :=
  ⟨fun f g => by
    obtain ⟨u⟩ := Y.property
    ext x
    exact Subsingleton.elim _ _⟩

lemma hom_to_one {X : Type} (Y : oneElement.FullSubcategory) (f g : X ⟶ oneElement.ι.obj Y) :
    f = g := by
  obtain ⟨u⟩ := Y.property
  ext x
  exact Subsingleton.elim (α := Y.obj) _ _

/-- The one-element type `PUnit` as an object of the degenerate subtopos. -/
def pt : oneElement.FullSubcategory := ⟨PUnit, ⟨inferInstance⟩⟩

/-- Every object of the degenerate subtopos receives a map from any other. -/
def toAny (X Y : oneElement.FullSubcategory) : X ⟶ Y :=
  ObjectProperty.homMk (TypeCat.ofHom fun _ => (Classical.choice Y.property).default)

/-- Every cone in the degenerate subtopos is a limit. -/
def isLimitAny {J : Type} [Category J] {K : J ⥤ oneElement.FullSubcategory} (c : Cone K) :
    IsLimit c where
  lift _ := toAny _ _
  fac _ _ := Subsingleton.elim _ _
  uniq _ _ _ := Subsingleton.elim _ _

/-- The degenerate subtopos of `Type`, reflected by the constant functor. -/
noncomputable def degenerateSubtopos : Subtopos (Type) where
  S := oneElement.FullSubcategory
  ι := oneElement.ι
  L := (Functor.const _).obj pt
  adj := Adjunction.mkOfHomEquiv
    { homEquiv := fun X Y =>
        { toFun := fun _ => TypeCat.ofHom fun _ => (Classical.choice Y.property).default
          invFun := fun _ => toAny _ _
          left_inv := fun _ => Subsingleton.elim _ _
          right_inv := fun f => by
            obtain ⟨u⟩ := Y.property
            ext x
            exact Subsingleton.elim (α := Y.obj) _ _ }
      homEquiv_naturality_left_symm := fun _ _ => Subsingleton.elim _ _
      homEquiv_naturality_right := fun _ _ => hom_to_one _ _ _ }
  lex := ⟨fun J _ _ => ⟨fun {K} => ⟨fun {c} _ => ⟨isLimitAny _⟩⟩⟩⟩

/-- D7-X02, broken: the inclusion of a subtopos need not preserve colimits. In the degenerate
subtopos of `Type` it does not preserve the initial object (the empty colimit). -/
theorem Subtopos.inclusion_not_preservesColimits :
    ∃ T : Subtopos (Type), ¬ PreservesColimitsOfShape (Discrete PEmpty.{1}) T.ι := by
  refine ⟨degenerateSubtopos, fun h => ?_⟩
  have hi : IsInitial (pt : degenerateSubtopos.S) :=
    IsInitial.ofUnique _ (h := fun Y => ⟨⟨toAny _ Y⟩, fun _ => Subsingleton.elim _ _⟩)
  have : PreservesColimit (Functor.empty.{0} _) degenerateSubtopos.ι := inferInstance
  have hI := hi.isInitialObj degenerateSubtopos.ι
  exact ((hI.to (PEmpty : Type)) (PUnit.unit : PUnit)).elim

end

end MathMap
