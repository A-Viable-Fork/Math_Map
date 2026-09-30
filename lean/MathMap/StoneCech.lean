import Mathlib.Topology.Compactification.StoneCech
import Mathlib.Topology.Bases

/-!
# Stone–Čech compactification and separability (D2-168)

The map's entry D2-168 lists separability among what the Stone–Čech compactification breaks. It does
not: `X` has dense image in `βX`, so `βX` is separable whenever `X` is. (Metrizability, the entry's other
broken property, is lost: `βℕ` is not metrizable. That is not proved here.)
-/

namespace MathMap

open TopologicalSpace

/-- D2-168, refutes the landed broken field: the Stone–Čech compactification of a separable space is
separable. -/
theorem stoneCech_separableSpace (X : Type*) [TopologicalSpace X] [SeparableSpace X] :
    SeparableSpace (StoneCech X) :=
  denseRange_stoneCechUnit.separableSpace continuous_stoneCechUnit

end MathMap
