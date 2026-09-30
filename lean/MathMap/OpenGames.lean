import Mathlib.Order.Basic
import Mathlib.Order.Nat

/-!
# Open games and their monoidal product (D7-X04)

Open games (Ghani, Hedges, Winschel and Zahn 2018, Definition 3) with the monoidal product of
Definition 12 (simultaneous play) and utility-maximising decisions (Definition 4). The best response
relation of an open game is defined relative to a context: a state and a continuation.

The question these results answer: when two games are composed side by side, can a component's
equilibrium be verified once, in isolation, and reused in the composite? In the composite, each
component is checked in a context built from the other component's play. If the joint utility
separates across the boundary, that context does not depend on the other component and the
verification carries over (`tensor_best_separable`). If the utility couples the two sides, it does
not: a strategy that is a best response beside one partner strategy fails beside another
(`tensor_context_dependent`).
-/

namespace MathMap

universe u

/-- An open game `(X, S) → (Y, R)` (Definition 3): strategy profiles, play, coplay and a best response
relation relative to a context (a state and a continuation). -/
structure OpenGame (X S Y R : Type u) where
  /-- The strategy profiles. -/
  Strat : Type u
  /-- The play function. -/
  play : Strat → X → Y
  /-- The coplay function. -/
  coplay : Strat → X → R → S
  /-- The best response relation in the context `(x, k)`: `best x k σ σ'` says `σ'` is a best
  response to `σ`. -/
  best : X → (Y → R) → Strat → Strat → Prop

namespace OpenGame

variable {X₁ S₁ Y₁ R₁ X₂ S₂ Y₂ R₂ : Type u}

/-- The monoidal product (Definition 12): simultaneous play. Each component's best response is taken
in a context whose continuation fixes the other component's play. -/
def tensor (G₁ : OpenGame X₁ S₁ Y₁ R₁) (G₂ : OpenGame X₂ S₂ Y₂ R₂) :
    OpenGame (X₁ × X₂) (S₁ × S₂) (Y₁ × Y₂) (R₁ × R₂) where
  Strat := G₁.Strat × G₂.Strat
  play σ x := (G₁.play σ.1 x.1, G₂.play σ.2 x.2)
  coplay σ x r := (G₁.coplay σ.1 x.1 r.1, G₂.coplay σ.2 x.2 r.2)
  best x k σ σ' :=
    G₁.best x.1 (fun y₁ => (k (y₁, G₂.play σ.2 x.2)).1) σ.1 σ'.1 ∧
    G₂.best x.2 (fun y₂ => (k (G₁.play σ.1 x.1, y₂)).2) σ.2 σ'.2

/-- D7-X04, preserved: when the joint continuation separates across the boundary
(`k (y₁, y₂) = (f₁ y₁, f₂ y₂)`), a best response in the product is exactly a pair of best responses
in the components' own contexts, which do not mention the other component's strategy: verification
done in isolation carries over. -/
theorem tensor_best_separable (G₁ : OpenGame X₁ S₁ Y₁ R₁) (G₂ : OpenGame X₂ S₂ Y₂ R₂)
    (f₁ : Y₁ → R₁) (f₂ : Y₂ → R₂) (x : X₁ × X₂) (σ σ' : G₁.Strat × G₂.Strat) :
    (G₁.tensor G₂).best x (fun y => (f₁ y.1, f₂ y.2)) σ σ' ↔
      G₁.best x.1 f₁ σ.1 σ'.1 ∧ G₂.best x.2 f₂ σ.2 σ'.2 :=
  Iff.rfl

end OpenGame

/-- A utility-maximising decision `(X, 1) → (Y, R)` (Definition 4): a strategy is a function from
observations to choices, and it is a best response iff it chooses a maximum of the continuation. -/
abbrev decision (X Y R : Type u) [Preorder R] : OpenGame X PUnit Y R where
  Strat := X → Y
  play σ x := σ x
  coplay _ _ _ := PUnit.unit
  best x k _ σ' := ∀ y, k y ≤ k (σ' x)

/-- D7-X04, broken: with a coupled continuation (a coordination payoff: each player gets 1 if the
choices agree), a component's equilibrium is not verified once and for all. Player 1 always choosing `true` is an equilibrium strategy beside a partner who chooses
`true`, and fails beside a partner who chooses `false`; nothing about player 1 changed. -/
theorem tensor_context_dependent :
    ((decision PUnit Bool ℕ).tensor (decision PUnit Bool ℕ)).best (PUnit.unit, PUnit.unit)
        (fun y => if y.1 = y.2 then (1, 1) else (0, 0)) ((fun _ => true), (fun _ => true)) ((fun _ => true), (fun _ => true)) ∧
      ¬ ((decision PUnit Bool ℕ).tensor (decision PUnit Bool ℕ)).best (PUnit.unit, PUnit.unit)
        (fun y => if y.1 = y.2 then (1, 1) else (0, 0)) ((fun _ => true), (fun _ => false)) ((fun _ => true), (fun _ => false)) := by
  refine ⟨⟨?_, ?_⟩, fun h => ?_⟩
  · intro y; cases y <;> decide
  · intro y; cases y <;> decide
  · have := h.1 false
    revert this; decide

end MathMap
