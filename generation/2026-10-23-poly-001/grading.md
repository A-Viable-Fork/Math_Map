# Grading: POLY-001, the operations inside the polynomial ring

Date 2026-10-23. Graded against Mathlib at `380f2aafb622cb2c1c93dac545b6389083c68c51`, read in a checkout at the pin; every declaration below is linked in `mapfill/formal.js` and excerpted in `excerpts/mathlib-*.txt`. Evidence marks: **read** (the declaration at the pin, with the section variables above it), **inferred**. The record (`record.md`, committed at `9b0916d`) is answered here and never edited.

## Duplicates (rule 1)

Read against `map.json` at `9cd551e`: names, descriptions, inputs and outputs searched for each operation. None of the nine is already in the map. The near misses are different operations: D6-028 (the analytic derivative, a limit), D2-122 (the Tschirnhaus substitution, one use of composition), D2-164 (pseudodivision), D7-154 (the splitting field, a construction; Q9 asks for the test), D2-162 and D2-163 (resultant and discriminant). D7-150 already links `Polynomial.aevalEquiv` on its description, the universal property of R[X]; `aeval` is defined from it and named separately by 98 statements, so Q5 is a separate operation. **read**

## The entries

Each field is graded confirmed, marginal (corrected) or dead (dropped). Section hypotheses are read at the line and given in each link's note; the excerpts keep the statements only.

| Q | Entry | Confirmed | Marginal, corrected | Dead, dropped | Verdict |
|---|---|---|---|---|---|
| Q1 | D7-X14 Degree | definition and natDegree; deg(p + q) ≤ max; deg(pq) = deg p + deg q with no zero divisors (`degree_mul`, a semiring with `NoZeroDivisors`, wider than the record's "domain") | composition: Mathlib states `natDegree_comp` for natDegree, not degree; the product's failure is an inequality (`degree_mul_le`) with equality when lc p · lc q ≠ 0 (`degree_mul'`), the strict case inferred | none | needs refinement |
| Q2 | D7-X15 Coefficients | `coeff`, `support` (a Finset), `coeff_add`, `lcoeff` (R-linear), `ext_iff`, `coeff_mul` (the antidiagonal sum) | broken: the failure of multiplicativity is inferred from `coeff_mul`, which states the law that replaces it | none | needs refinement |
| Q3 | D7-X16 Leading coefficient | `leadingCoeff`, `Monic`, `eraseLead` and p = eraseLead p + monomial; `leadingCoeff_mul` (no zero divisors); `Monic.mul` (any semiring); lc 0 = 0 | eraseLead lowers the degree only for p ≠ 0 (`degree_eraseLead_lt`); broken restated as the receipted case `leadingCoeff_add_of_degree_lt` | the cancellation clause, unreceipted | needs refinement |
| Q4 | D7-X17 Change of coefficients | `map` = eval₂ (C ∘ f) X, `map_X`, `mapRingHom`; evaluation commutes (`eval_map` with `eval₂_at_apply`); `derivative_map`; `map_comp`; degree kept for injective f | broken: `degree_map_le` gives deg(map f p) ≤ deg p; the strict drop is inferred | irreducibility not preserved: true, but no declaration at the pin states the example, so not landed | needs refinement |
| Q5 | D7-X18 Evaluation | `eval₂`, `eval`, `aeval`, `aeval_X`; `eval₂RingHom` for commutative S; uniqueness by `algHom_ext`; X^q and X agree on a finite field with q elements (`FiniteField.pow_card`) while X^p - X ≠ 0 for p > 1 (`FiniteField.X_pow_card_sub_X_ne_zero`) | "free commutative R-algebra": `aeval` maps into any R-algebra A, commutative or not, for R commutative; added `eval₂RingHom'` (noncommutative S, x commuting with f) and `funext` (an infinite domain) | none | needs refinement |
| Q6 | D7-X19 Formal derivative | the definition (an R-linear map); Leibniz (`derivative_mul`, over any semiring, wider than recorded); (X^n)' = n X^(n-1) (`derivative_X_pow`), so it vanishes in characteristic p when p divides n (inferred from the cast); f' = 0 gives f an expansion in X^p (`expand_contract`, characteristic p, no zero divisors); multiplicity above 1 iff a root of p and p' (`one_lt_rootMultiplicity_iff_isRoot`, an iff, stronger than recorded) | chain rule needs a commutative semiring and reads q' · (p' ∘ q) (`derivative_comp`); "degree drops by one in characteristic zero": the pin's `Derivative.lean` states natDeg p' ≤ natDeg p - 1 and strictness for nonconstant p, and no exact-drop lemma was found there | none | needs refinement |
| Q7 | D7-X20 Roots | `roots` over a commutative domain, `IsRoot`, `rootMultiplicity` (over any ring, 0 at p = 0), `le_rootMultiplicity_iff`; `card_roots'`; `roots_mul` (pq ≠ 0); `mem_roots`; `count_roots`; the factor theorem `dvd_iff_isRoot`; `roots_zero`; fewer roots than degree exactly when p does not split (`splits_iff_card_roots`) | none | complexity ("by search") not graded, landed as N/A | confirmed |
| Q8 | D7-X21 Composition | `comp` = eval₂ C q; `comp_X`, `X_comp`; `add_comp` (any semiring) | associativity (`comp_assoc`), `eval_comp` and `mul_comp` need a commutative semiring, which the record gave only for multiplicativity; `natDegree_comp` for natDegree with no zero divisors | broken (no additivity in q): true (p = X^2), but no declaration states it | needs refinement |
| Q9 | D7-X22 Splitting | persists along any ring homomorphism (`Splits.map`); products of splitting polynomials split (`Splits.mul`); with multiplicity, natDegree p roots iff p splits (`splits_iff_card_roots`, an iff, stronger than recorded) | the definition: at the pin `Splits` takes one argument, a polynomial over any semiring, and means membership in the submonoid generated by the constants and the X + C a (`Splits.lean` line 35); splitting along i is `Splits (map i f)`. The record's two-argument form over fields, through irreducible factors, is Mathlib's older definition. A product splits iff each factor does only for nonzero factors over a commutative domain (`splits_mul`) | none | needs refinement |

The complexity field is not graded: the five content fields carry the receipts, as for the map's other additions, and complexity is the generator's text (deviation from rule 3, which says every landed claim; stated here rather than hidden).

## Predictions

Measured with Research_OS's `mapread.mjs`, `decompose` and `gaps` on the same 59,559 Algebra declarations (sha256 `ce3d7df6...`), against this map at `9cd551e` and with the round landed.

| | Prediction | Baseline | After | Grade |
|---|---|---|---|---|
| P1 | D7-150 under 1,000 | 2,511 | 783 | confirmed |
| P2 | composites up by more than 1,000 | 1,102 | 2,781 (+1,679) | confirmed |
| P3 | total clean falls | 8,704 | 7,112 | confirmed |
| P4 | at least 7 of 9 land; Q9 the likeliest duplicate, Q4 the likeliest refined | | 9 of 9 land; Q9 was no duplicate and needed the largest correction | marginal: the count held, both specific guesses were wrong |

Of D7-150's former 2,511, 1,658 are now composites of the ring with one or more of the new operations (with degree alone 290, evaluation 192, coefficients 189, leading coefficient 150), 70 are the newly linked declarations themselves, and 783 stay clean. Those 783 name the ring's structure and generators (`semiring` 487, `X` 154, `C` 151, the instances) and the operations below the round's cut (`smeval`, `trailingDegree`, `toLaurent`, `evalEval`, `mirror`, `rootSet`, `expand`, `taylor`). The new entries gain few clean declarations (D7-X14 46, D7-X16 30, D7-X15 24, the rest under 13), as P3 predicted: a polynomial lemma almost always names the ring too. The proof queue goes from 41 targets on 17 entries to 49 on 22.

## Verdicts

**The operations inside the ring: confirmed as additions.** All nine are standard and absent from the map; all nine land with exact links on their defining declarations, one receipted.

**Generator against the pin: needs refinement.** One entry clean, eight corrected, no entry dead. The recurring errors are hypotheses: the generator wrote "domain" where Mathlib needs only no zero divisors, and omitted commutativity where Mathlib needs it. One error is a stale definition (`Splits`), which reading at the pin, not recall, caught.

**Clean as decomposition, for polynomials: confirmed that it was inflated.** 69% of D7-150's clean count (1,728 of 2,511) read as the ring only because the inner operations were missing. The remaining 783 are the ring's own structure, which is what D7-150 is, plus a tail of smaller operations; another round at a lower cut would take the tail.
