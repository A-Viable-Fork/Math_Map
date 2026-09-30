import Mathlib.CategoryTheory.Adjunction.Limits
import Mathlib.CategoryTheory.Limits.Preserves.Finite

/-!
# Subtoposes, essential geometric morphisms and levels

Definitions and claims for the math map's categorical chain: D7-X02 (inclusion of a subtopos),
D7-284 (essential geometric morphism), D7-X03 (level of an essential inclusion) and D7-X01 (Aufhebung).
Mathlib at the pinned commit has none of these notions; each definition follows the nLab, and its
receipt is recorded in `mapfill/lean.js`.

The definitions are stated for categories in general, not only toposes: every claim proved here holds
without the topos axioms, so it holds in particular for toposes.
-/

namespace MathMap

open CategoryTheory Limits

universe w w' v u

/-- A geometric morphism `f : E → F`: a direct image `f_*` with a left adjoint inverse image `f^*` that
preserves finite limits. -/
structure GeometricMorphism (E F : Type u) [Category.{v} E] [Category.{v} F] where
  /-- The direct image `f_*`. -/
  direct : E ⥤ F
  /-- The inverse image `f^*`. -/
  inverse : F ⥤ E
  /-- `f^* ⊣ f_*`. -/
  adj : inverse ⊣ direct
  /-- The inverse image is left exact. -/
  inverse_lex : PreservesFiniteLimits inverse

/-- An essential geometric morphism: the inverse image `f^*` has a further left adjoint `f_!`, giving
the adjoint triple `f_! ⊣ f^* ⊣ f_*`. -/
structure EssentialGeometricMorphism (E F : Type u) [Category.{v} E] [Category.{v} F]
    extends GeometricMorphism E F where
  /-- The extra left adjoint `f_!`. -/
  shriek : E ⥤ F
  /-- `f_! ⊣ f^*`. -/
  adj' : shriek ⊣ inverse

/-- A subtopos of `E`, presented as a full reflective subcategory whose reflector preserves finite
limits: in the nLab's terms an exact reflective embedding, between toposes a geometric embedding. -/
structure Subtopos (E : Type u) [Category.{v} E] where
  /-- The objects of the subtopos (the sheaves). -/
  S : Type u
  [cat : Category.{v} S]
  /-- The inclusion `i_*`. -/
  ι : S ⥤ E
  [full : ι.Full]
  [faithful : ι.Faithful]
  /-- The reflector `i^*` (sheafification). -/
  L : E ⥤ S
  /-- `i^* ⊣ i_*`. -/
  adj : L ⊣ ι
  /-- The reflector is left exact. -/
  lex : PreservesFiniteLimits L

attribute [instance] Subtopos.cat Subtopos.full Subtopos.faithful

variable {E : Type u} [Category.{v} E]

/-- D7-X02, preserved: the inclusion of a subtopos preserves limits, since it is right adjoint to the
reflector. -/
theorem Subtopos.inclusion_preservesLimits (T : Subtopos E) :
    PreservesLimitsOfSize.{w, w'} T.ι :=
  T.adj.rightAdjoint_preservesLimits

/-- D7-X02, output: the inclusion is a geometric morphism with the reflector as inverse image. -/
def Subtopos.embedding (T : Subtopos E) : GeometricMorphism T.S E where
  direct := T.ι
  inverse := T.L
  adj := T.adj
  inverse_lex := T.lex

/-- D7-X02, output: the embedding's direct image is fully faithful (a geometric embedding). -/
theorem Subtopos.embedding_direct_full_faithful (T : Subtopos E) :
    T.embedding.direct.Full ∧ T.embedding.direct.Faithful :=
  ⟨T.full, T.faithful⟩

variable {F : Type u} [Category.{v} F]

/-- D7-284, preserved: the inverse image of an essential geometric morphism preserves limits, since it
is right adjoint to `f_!`. -/
theorem EssentialGeometricMorphism.inverse_preservesLimits (f : EssentialGeometricMorphism E F) :
    PreservesLimitsOfSize.{w, w'} f.inverse :=
  f.adj'.rightAdjoint_preservesLimits

/-- D7-284, preserved: the inverse image preserves colimits, since it is left adjoint to `f_*`. -/
theorem EssentialGeometricMorphism.inverse_preservesColimits (f : EssentialGeometricMorphism E F) :
    PreservesColimitsOfSize.{w, w'} f.inverse :=
  f.adj.leftAdjoint_preservesColimits

/-- D7-284, output: an essential geometric morphism carries an adjoint pair of modalities on its
codomain, `f_! f^* ⊣ f_* f^*`: the skeleton and sheaf sides that a level makes idempotent. -/
def EssentialGeometricMorphism.modalities (f : EssentialGeometricMorphism E F) :
    f.inverse ⋙ f.shriek ⊣ f.inverse ⋙ f.direct :=
  f.adj.comp f.adj'

/-- A level of `E`: an essential subtopos, whose reflector `i^*` has a further left adjoint `i_!`,
giving the triple `i_! ⊣ i^* ⊣ i_*`. -/
structure Level (E : Type u) [Category.{v} E] extends Subtopos E where
  /-- The extra left adjoint `i_!`. -/
  shriek : S ⥤ E
  /-- `i_! ⊣ i^*`. -/
  adj' : shriek ⊣ L

/-- D7-X03, input: the inclusion of a level is an essential geometric morphism. -/
def Level.essential (i : Level E) : EssentialGeometricMorphism i.S E where
  toGeometricMorphism := i.embedding
  shriek := i.shriek
  adj' := i.adj'

/-- D7-X03, preserved: the middle functor `i^*` of the triple preserves limits (right adjoint to `i_!`). -/
theorem Level.reflector_preservesLimits (i : Level E) : PreservesLimitsOfSize.{w, w'} i.L :=
  i.adj'.rightAdjoint_preservesLimits

/-- D7-X03, preserved: the middle functor `i^*` preserves colimits (left adjoint to `i_*`). -/
theorem Level.reflector_preservesColimits (i : Level E) : PreservesColimitsOfSize.{w, w'} i.L :=
  i.adj.leftAdjoint_preservesColimits

/-- The skeleton modality of a level, `i_! i^*`. -/
def Level.skeleton (i : Level E) : E ⥤ E := i.L ⋙ i.shriek

/-- The sheaf modality of a level, `i_* i^*`. -/
def Level.sheaf (i : Level E) : E ⥤ E := i.L ⋙ i.ι

/-- D7-X03, output: a level carries the adjoint pair of modalities skeleton ⊣ sheaf. -/
def Level.skeletonSheafAdj (i : Level E) : i.skeleton ⊣ i.sheaf :=
  i.adj.comp i.adj'

/-- An object is an `i`-sheaf when the sheaf modality fixes it: `○_i X ≃ X`. -/
def Level.IsSheaf (i : Level E) (X : E) : Prop := Nonempty (i.sheaf.obj X ≅ X)

/-- An object is an `i`-skeleton when the skeleton modality fixes it: `□_i X ≃ X`. -/
def Level.IsSkeleton (i : Level E) (X : E) : Prop := Nonempty (i.skeleton.obj X ≅ X)

/-- `i ≺ j`: every `i`-sheaf is a `j`-sheaf and every `i`-skeleton is a `j`-skeleton. -/
def Level.Prec (i j : Level E) : Prop :=
  (∀ X, i.IsSheaf X → j.IsSheaf X) ∧ ∀ X, i.IsSkeleton X → j.IsSkeleton X

/-- `i ≪ j`, `j` resolves the opposite of `i`: `i ≺ j` and `○_j □_i = □_i`, that is, every
`i`-skeleton is a `j`-sheaf. -/
def Level.Resolves (i j : Level E) : Prop := i.Prec j ∧ ∀ X, i.IsSkeleton X → j.IsSheaf X

/-- The order between levels by subtopos inclusion: `j ≤ k` when every `j`-sheaf is a `k`-sheaf. -/
def Level.Below (j k : Level E) : Prop := ∀ X, j.IsSheaf X → k.IsSheaf X

/-- `j` is the Aufhebung of `i`: `i ≪ j`, and `j ≤ k` for every `k` with `i ≪ k`. -/
def Level.IsAufhebung (i j : Level E) : Prop := i.Resolves j ∧ ∀ k : Level E, i.Resolves k → j.Below k

/-- D7-X01, preserved: under the Aufhebung, the `i`-skeleta survive as `j`-sheaves. This holds by the
nLab's definition; the statement pins which objects and which condition are meant. -/
theorem Level.IsAufhebung.skeleta_are_sheaves {i j : Level E} (h : i.IsAufhebung j) :
    ∀ X, i.IsSkeleton X → j.IsSheaf X :=
  h.1.2

/-- D7-X01, preserved: the `i`-sheaves survive too, since the Aufhebung lies above `i`. -/
theorem Level.IsAufhebung.sheaves_are_sheaves {i j : Level E} (h : i.IsAufhebung j) :
    ∀ X, i.IsSheaf X → j.IsSheaf X :=
  h.1.1.1

/-- D7-X01, broken: the Aufhebung erases the opposition at level `i`. Both of its sides, the
`i`-skeleta and the `i`-sheaves, become `j`-sheaves, so at level `j` they are no longer opposed. -/
theorem Level.IsAufhebung.opposition_resolved {i j : Level E} (h : i.IsAufhebung j) :
    (∀ X, i.IsSkeleton X → j.IsSheaf X) ∧ (∀ X, i.IsSheaf X → j.IsSheaf X) :=
  ⟨h.skeleta_are_sheaves, h.sheaves_are_sheaves⟩

/-- D7-X01, output: the Aufhebung of a level, when it exists, is unique up to having the same
sheaves. -/
theorem Level.IsAufhebung.unique {i j j' : Level E} (h : i.IsAufhebung j) (h' : i.IsAufhebung j') :
    j.Below j' ∧ j'.Below j :=
  ⟨h.2 j' h'.1, h'.2 j h.1⟩

end MathMap
