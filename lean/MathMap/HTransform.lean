import Mathlib.Analysis.Calculus.Deriv.Mul
import Mathlib.Analysis.Calculus.Deriv.Add
import Mathlib.Analysis.Calculus.ContDiff.Basic
import Mathlib.Analysis.Calculus.IteratedDeriv.Defs

/-!
# The Doob h-transform of Brownian motion with h(x) = x (D5-037)

The generator of an h-transformed process is `A^h f = (1/h) A (h f)` (Wikipedia, Doob's h-transform).
For Brownian motion, `A f = f''/2`. With `h(x) = x`, harmonic for Brownian motion killed at 0, the
transformed generator is `f''/2 + f'/x`: a drift `1/x` away from the threshold, the Bessel-3 generator
(`dX = dW + dt/X`). Conditioning on survival alone produces the drift.
-/

namespace MathMap

/-- The generator of standard Brownian motion on `ℝ`, `f ↦ f''/2`. -/
noncomputable def bmGenerator (f : ℝ → ℝ) (x : ℝ) : ℝ := deriv (deriv f) x / 2

/-- The generator of the h-transform of a process with generator `A`: `A^h f = (1/h) A (h f)`. -/
noncomputable def hTransformGenerator (A : (ℝ → ℝ) → ℝ → ℝ) (h f : ℝ → ℝ) (x : ℝ) : ℝ :=
  A (fun y => h y * f y) x / h x

/-- D5-037, output: the h-transform of Brownian motion with `h(x) = x` has generator
`f''/2 + (1/x) f'` at every `x ≠ 0`: drift `1/x` away from the threshold at 0. -/
theorem hTransform_bm_id (f : ℝ → ℝ) (hf : ContDiff ℝ 2 f) {x : ℝ} (hx : x ≠ 0) :
    hTransformGenerator bmGenerator id f x = deriv (deriv f) x / 2 + (1 / x) * deriv f x := by
  have h1 : Differentiable ℝ f := hf.differentiable (by norm_num)
  have h2 : Differentiable ℝ (deriv f) := by
    simpa [iteratedDeriv_one] using hf.differentiable_iteratedDeriv 1 (by norm_num)
  have d1 : deriv (fun y => id y * f y) = fun y => f y + y * deriv f y := by
    funext y
    have e : HasDerivAt (fun y => id y * f y) (1 * f y + id y * deriv f y) y :=
      (hasDerivAt_id y).mul (h1 y).hasDerivAt
    rw [e.deriv]; simp
  have d2 : deriv (fun y => f y + y * deriv f y) x =
      deriv f x + (1 * deriv f x + x * deriv (deriv f) x) := by
    have e : HasDerivAt (fun y => f y + y * deriv f y)
        (deriv f x + (1 * deriv f x + x * deriv (deriv f) x)) x :=
      HasDerivAt.add (h1 x).hasDerivAt ((hasDerivAt_id x).mul (h2 x).hasDerivAt)
    exact e.deriv
  simp only [hTransformGenerator, bmGenerator]
  rw [d1, d2]
  simp only [id]
  field_simp
  ring

end MathMap
