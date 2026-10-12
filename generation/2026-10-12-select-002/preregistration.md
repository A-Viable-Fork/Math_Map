# Pre-registration: SELECT-002, the mixing form and iterated menus

Date 2026-10-12. Written and committed before any computation of this round. Its commit hash is the record that the rows, forms, controls and verdict rules came first. Nothing below is changed after the commit; a deviation is written in the round's grading as a deviation, with its reason.

## The questions

1. **F5.** SELECT-001 found F1 vacuous where boosts act as zero, and a post-hoc refinement, reported ungraded, selected Poincare alone from the static menu. Does that refinement, fixed now as a form, hold with decoys on every menu, including ones it was not shaped on?
2. **Iterated menus.** SELECT-001 inferred a rule: a conflict selects a family, and the lowest-order step picks its member; later conflicts add curvature. Followed step by step, with each step's menu built from the algebra the last step reached, does the rule reproduce the chain static, Poincare, de Sitter? And does the endpoint depend on the order of the conflicts? The stability reading (DEFORM-001, HISTORY-001) says the endpoint is the rigid algebra whatever the order; the conflict reading says the path follows the conflicts.

## What is already known (disclosed)

From SELECT-001 (`generation/2026-10-12-select-001/stages.md`): on the static menu, F1 with the mixing condition leaves Poincare alone, live-decoy rate 4/290; on the Galilei menus (3 + 1 and 2 + 1) F1 alone leaves {flat, de Sitter, anti-de Sitter}, and every one of those has boosts acting on {H, P}, so F5 is expected to leave the same three there. From HISTORY-001: from Poincare, F2 (H over {P, K}, positive) leaves de Sitter alone; de Sitter and anti-de Sitter are rigid (DEFORM-001).

## Definitions

HISTORY-001's and SELECT-001's definitions apply unchanged (candidate sets, fingerprints, ranking, decoys, the 0.25 threshold, real menus of at least 5 distinct algebras, out of menu). New:

- **F5, invariant form with mixing.** F1 (S, A, signature), and some generator of the families A has a nonzero bracket with some generator of S whose component in S is nonzero. Its decoys are F1's decoy space, each decoy's mixing condition taken on its own A and S.
- **The leakage judgment, made now.** F5 names only the predecessor's families and rests on 1904 evidence (the Lorentz transformations mix t and x and preserve the interval), so by the formal rule it does not leak. It is also close to the definition of how the Lorentz algebra acts on spacetime. A pass therefore shows that the 1904 constraint was sufficient to fix the kinematics, not that the generator discovered it. Whatever the rows give, the claim "the generator discovers the successor" is capped at **plausible** in this round.
- **A path.** From a start algebra and an ordered list of stages, each stage adding a constraint to those before it: at each stage, build the current algebra's candidate menu (rotation-invariant, as before), keep the candidates that pass every constraint so far, and move to the rank-1 survivors. If the current algebra itself survives, it is rank 1 (order 0) and the path stays. If rank 1 is tied between distinct algebras, the path branches and every branch is followed. A stage with no survivor ends the path as **stuck**. Each stage's live-decoy rate is reported, decoys replacing only that stage's new constraint.

## The rows

**F5 rows.** Constraint F5 with S = {H, P}, A = {J, K}, signature (3, 1) in 3 + 1 and (2, 1) in 2 + 1. Symmetry J throughout.

| Row | Predecessor | Successor | Menu known? |
|---|---|---|---|
| T1 | static (3 + 1) | Poincare | shaped on it (disclosed) |
| T2 | Galilei (3 + 1) | Poincare | not shaped on it |
| T3 | Galilei (2 + 1) | Poincare in 2 + 1 | not shaped on it |
| T4 | Carroll (3 + 1) | Poincare | not shaped on it; Carroll's boosts take P to H |

**Path rows.** Stage 1904: F5 (3, 1). Stage 1998: F2 with X = H, S = {P, K}, positive.

| Row | Start | Stage order | Historical endpoint |
|---|---|---|---|
| P1 | static | 1904, then 1998 | de Sitter, through Poincare |
| P2 | Galilei | 1904, then 1998 | de Sitter, through Poincare |
| P3 | static | 1998, then 1904 (counterfactual) | none; the endpoint is the question |

## Verdict rules

**F5 rows**, per row: SELECT-001's rules (pass, filter, fail below rank 1, fail, out of menu; confirmed, marginal, plausible, dead). Summary over T2 to T4, the rows F5 was not shaped on: **confirmed** if all three pass; **marginal** if none fails and at least one passes or filters with the successor at rank 1; **dead** if two fail. T1 is reported as a replication, outside the summary.

**Path rows:**

- P1 and P2 **reproduce history** if every branch passes through Poincare and ends at de Sitter; **reproduce with branching** if some branch does; **fail** if none does; **stuck** as defined.
- P3 reports its endpoint. **Endpoint robust** if it is de Sitter on every branch; **path dependent** if not.

**What the stability and conflict readings predict.** Stability: every path ends at a rigid algebra, de Sitter included, whatever the order. Conflict-and-lowest-order: the path visits the lowest-order algebra each stage allows; in P3 the 1998 stage acts first, on the static menu. Neither reading is graded; the round reports which one the paths match.

## Scope fixed in advance

Rotation-invariant candidates only; the class grid as before (at most two nonzero coefficients where there are more than four classes), so some algebras may be out of menu from a given start. There is no pre-1905 Galilean stage: no encoding of Galilean relativity was found that does not restate Galilei's defining brackets, so paths are not expected to pass through Galilei. The rounds are designed, run and graded by one session; an independent re-run is owed before anything rests on them.
