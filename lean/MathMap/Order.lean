import Mathlib.Order.GaloisConnection.Defs
import Mathlib.Order.Closure

/-!
# Antitone Galois connections (D1-099)

The map's entry D1-099, as corrected in `mapfill/corrections.js`: a pair of order-reversing maps
`f : α → β`, `g : β → α` with `a ≤ g (f a)` and `b ≤ f (g b)`. Mathlib's `GaloisConnection` is the
monotone convention; an antitone connection is a monotone one into the order dual. The last theorem
shows why the landed definition (antitone maps with `f (g b) ≤ b`) was graded wrong: a pair can satisfy
it and be a Galois connection in neither convention.
-/

namespace MathMap

open OrderDual

variable {α β : Type*}

section Preorder

variable [Preorder α] [Preorder β]

/-- D1-099 (corrected): an antitone Galois connection. -/
def AntitoneGC (f : α → β) (g : β → α) : Prop :=
  Antitone f ∧ Antitone g ∧ (∀ a, a ≤ g (f a)) ∧ ∀ b, b ≤ f (g b)

/-- D1-099, description: equivalently, `b ≤ f a ↔ a ≤ g b` for all `a`, `b`. -/
theorem antitoneGC_iff {f : α → β} {g : β → α} :
    AntitoneGC f g ↔ ∀ a b, b ≤ f a ↔ a ≤ g b := by
  constructor
  · rintro ⟨hf, hg, h1, h2⟩ a b
    exact ⟨fun h => (h1 a).trans (hg h), fun h => (h2 b).trans (hf h)⟩
  · intro H
    refine ⟨fun a a' haa' => ?_, fun b b' hbb' => ?_, fun a => (H a (f a)).1 le_rfl,
      fun b => (H (g b) b).2 le_rfl⟩
    · exact (H a (f a')).2 (haa'.trans ((H a' (f a')).1 le_rfl))
    · exact (H (g b') b).1 (hbb'.trans ((H (g b') b').2 le_rfl))

/-- D1-099, output: an antitone Galois connection is exactly a (monotone) Galois connection, in
Mathlib's sense, from `α` into the order dual of `β`. -/
theorem antitoneGC_iff_galoisConnection {f : α → β} {g : β → α} :
    AntitoneGC f g ↔ GaloisConnection (toDual ∘ f) (g ∘ ofDual) := by
  rw [antitoneGC_iff]
  constructor
  · intro H a b
    simpa [toDual_le] using H a (ofDual b)
  · intro H a b
    simpa [toDual_le] using H a (toDual b)

end Preorder

section PartialOrder

variable [PartialOrder α] [PartialOrder β]

/-- `f ∘ g ∘ f = f` for an antitone Galois connection. -/
theorem AntitoneGC.fgf {f : α → β} {g : β → α} (h : AntitoneGC f g) (a : α) : f (g (f a)) = f a :=
  le_antisymm (h.1 (h.2.2.1 a)) (h.2.2.2 (f a))

/-- `g ∘ f ∘ g = g` for an antitone Galois connection. -/
theorem AntitoneGC.gfg {f : α → β} {g : β → α} (h : AntitoneGC f g) (b : β) : g (f (g b)) = g b :=
  le_antisymm (h.2.1 (h.2.2.2 b)) (h.2.2.1 (g b))

/-- D1-099, preserved: `g ∘ f` is a closure operator on `α`. -/
def AntitoneGC.closureGF {f : α → β} {g : β → α} (h : AntitoneGC f g) : ClosureOperator α :=
  ClosureOperator.mk' (g ∘ f) (h.2.1.comp h.1) h.2.2.1 fun a => by
    simp only [Function.comp_apply, h.fgf]; exact le_rfl

/-- D1-099, preserved: `f ∘ g` is a closure operator on `β`. -/
def AntitoneGC.closureFG {f : α → β} {g : β → α} (h : AntitoneGC f g) : ClosureOperator β :=
  ClosureOperator.mk' (f ∘ g) (h.1.comp h.2.1) h.2.2.2 fun b => by
    simp only [Function.comp_apply, h.gfg]; exact le_rfl

end PartialOrder

/-- D1-099, the landed definition: antitone maps with `a ≤ g (f a)` and `f (g b) ≤ b`. -/
def LandedGC [Preorder α] [Preorder β] (f : α → β) (g : β → α) : Prop :=
  Antitone f ∧ Antitone g ∧ (∀ a, a ≤ g (f a)) ∧ ∀ b, f (g b) ≤ b

/-- D1-099, counterexample to the landed text: on `Bool`, `f = not` and `g = const true` satisfy the
landed definition but are a Galois connection in neither convention. -/
theorem landedGC_neither :
    LandedGC (α := Bool) (β := Bool) not (fun _ => true) ∧
      ¬ AntitoneGC (α := Bool) (β := Bool) not (fun _ => true) ∧
      ¬ GaloisConnection (α := Bool) (β := Bool) not (fun _ => true) := by
  refine ⟨⟨?_, ?_, ?_, ?_⟩, ?_, ?_⟩
  · intro a b hab; cases a <;> cases b <;> simp_all
  · intro a b _; exact le_rfl
  · intro a; exact le_top
  · intro b; cases b <;> simp
  · intro h; exact absurd (h.2.2.2 true) (by decide)
  · intro h; exact absurd ((h false false).2 le_top) (by decide)

end MathMap
