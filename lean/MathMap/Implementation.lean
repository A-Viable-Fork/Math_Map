import Mathlib.Logic.Function.Basic
import Mathlib.Data.Set.Image

/-!
# Nash implementation and Maskin monotonicity (D7-X05)

A mechanism (a message space for each agent and an outcome function) implements a social choice
correspondence in Nash equilibrium when, at every state, the outcomes of its Nash equilibria are exactly
the chosen outcomes. Maskin's necessity theorem: every Nash-implementable correspondence is Maskin
monotonic (an outcome chosen at one state stays chosen at any state where it has not fallen in any
agent's ranking). Complete information is built in: every agent knows the state.
-/

namespace MathMap

universe u v w x

/-- An environment: at state `θ`, agent `i` finds `a` at least as good as `b`. -/
structure Environment (I : Type u) (A : Type v) (Θ : Type w) where
  /-- The weak preference of agent `i` at state `θ`. -/
  pref : Θ → I → A → A → Prop

/-- A mechanism: a message space for each agent and an outcome function. -/
structure Mechanism (I : Type u) (A : Type v) where
  /-- The messages agent `i` can send. -/
  Msg : I → Type x
  /-- The outcome of a message profile. -/
  outcome : ((i : I) → Msg i) → A

namespace Mechanism

variable {I : Type u} {A : Type v} {Θ : Type w} [DecidableEq I]

/-- A message profile is a Nash equilibrium at state `θ` if no agent does strictly better by changing
only its own message. -/
def IsNash (g : Mechanism.{u, v, x} I A) (E : Environment I A Θ) (θ : Θ) (m : (i : I) → g.Msg i) : Prop :=
  ∀ i (m' : g.Msg i), E.pref θ i (g.outcome m) (g.outcome (Function.update m i m'))

/-- `g` implements `f` in Nash equilibrium: at every state the Nash equilibrium outcomes are exactly the
chosen outcomes. -/
def Implements (g : Mechanism.{u, v, x} I A) (E : Environment I A Θ) (f : Θ → Set A) : Prop :=
  ∀ θ, g.outcome '' {m | g.IsNash E θ m} = f θ

end Mechanism

/-- Maskin monotonicity: if `a` is chosen at `θ`, and at `θ'` every agent still finds `a` at least as
good as everything it found `a` at least as good as at `θ`, then `a` is chosen at `θ'`. -/
def MaskinMonotonic {I : Type u} {A : Type v} {Θ : Type w} (E : Environment I A Θ) (f : Θ → Set A) :
    Prop :=
  ∀ θ θ' a, a ∈ f θ → (∀ i b, E.pref θ i a b → E.pref θ' i a b) → a ∈ f θ'

/-- D7-X05, preserved: Maskin's necessity theorem. A correspondence implemented in Nash equilibrium by
any mechanism is Maskin monotonic. -/
theorem Mechanism.maskinMonotonic_of_implements {I : Type u} {A : Type v} {Θ : Type w} [DecidableEq I]
    (g : Mechanism.{u, v, x} I A) (E : Environment I A Θ) (f : Θ → Set A) (h : g.Implements E f) :
    MaskinMonotonic E f := by
  intro θ θ' a ha hmono
  rw [← h θ] at ha
  obtain ⟨m, hm, rfl⟩ := ha
  rw [← h θ']
  exact ⟨m, fun i m' => hmono i _ (hm i m'), rfl⟩

end MathMap
