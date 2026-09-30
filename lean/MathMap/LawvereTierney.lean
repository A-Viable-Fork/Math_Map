import Mathlib.Order.Nucleus

/-!
# Lawvere–Tierney topologies, read in the truth values (D7-288)

The nLab defines a Lawvere–Tierney topology as, internally, a closure operator given by a left exact
idempotent monad on the internal meet-semilattice of truth values `Ω`: an operator `j : Ω → Ω` that
is inflationary, idempotent and preserves meets. On a meet-semilattice that is exactly Mathlib's
`Nucleus`. This file works in a meet-semilattice (or frame) of truth values given externally, as for
the frame of opens of a space; the internal statement in an arbitrary topos is not formalized here
(Mathlib at the pin has no internal meet on the subobject classifier).

It formalizes the entry's broken claim, "truth values collapsed by `j`": the truth values that
survive are the fixed points of `j`, onto which `Ω` retracts, and they again form a frame; `j`
identifies truth values unless it is the trivial topology.
-/

namespace MathMap

/-- D7-288: a Lawvere–Tierney topology on a meet-semilattice of truth values, a nucleus. -/
abbrev LTTopology (Ω : Type*) [SemilatticeInf Ω] := Nucleus Ω

variable {Ω : Type*}

section SemilatticeInf

variable [SemilatticeInf Ω] (j : LTTopology Ω)

/-- D7-288, description: `j` is inflationary, idempotent and preserves meets. -/
theorem LTTopology.axioms :
    (∀ p, p ≤ j p) ∧ (∀ p, j (j p) = j p) ∧ ∀ p q, j (p ⊓ q) = j p ⊓ j q :=
  ⟨fun _ => Nucleus.le_apply, fun _ => Nucleus.idempotent _, fun _ _ => Nucleus.map_inf⟩

/-- D7-288, broken: the truth values that survive are the fixed points of `j`. -/
theorem LTTopology.mem_range_iff (p : Ω) : p ∈ Set.range j ↔ j p = p :=
  ⟨by rintro ⟨q, rfl⟩; exact Nucleus.idempotent _, fun h => ⟨p, h⟩⟩

/-- D7-288, broken: `j` collapses truth values unless it is the trivial topology (the identity):
it is injective exactly when it is `⊥`. -/
theorem LTTopology.injective_iff_eq_bot : Function.Injective j ↔ j = ⊥ := by
  constructor
  · intro h
    ext p
    exact h (Nucleus.idempotent p)
  · rintro rfl
    exact fun _ _ h => h

end SemilatticeInf

section Frame

variable [Order.Frame Ω] (j : LTTopology Ω)

/-- D7-288, broken: the surviving truth values again form a frame. -/
instance LTTopology.frameOfTruthValues : Order.Frame (Set.range j) := inferInstance

/-- D7-288, broken: the truth values retract onto the surviving ones: `j`, corestricted to its
fixed points, is left adjoint to the inclusion and a Galois insertion. -/
def LTTopology.retract : GaloisInsertion j.restrict Subtype.val := j.giRestrict

end Frame

end MathMap
