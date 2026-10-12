# Pre-registration: SELECT-001, does the conflict select from a real menu?

Date 2026-10-12. Written and committed before any computation of this round. Its commit hash is the record that the rows, constraints, controls and verdict rules came first. Nothing below is changed after the commit; a deviation is written in the round's grading as a deviation, with its reason.

## The question

HISTORY-001 confirmed, by its rule, that the conflict selects the successor; its grader read that as marginal, because three of the four deformation rows chose from menus of one or two candidates, with decoy controls that had nothing to measure, and the one real menu (Galilei, 12 distinct algebras) was filtered to 3. SELECT-001 asks the second half of the pattern alone, on menus large enough to fail: when a predecessor offers many candidates, do the conflicts of physics, applied in historical order, leave the historical successor alone?

## What is already known (disclosed, so it cannot pass as a prediction)

From HISTORY-001 (`generation/2026-10-11-history-001/rows.md`): from Galilei in 3 + 1 dimensions, F1 with S = {H, P}, A = {J, K}, signature (3, 1) leaves Poincare, de Sitter and anti-de Sitter, Poincare at rank 1; from the static algebra the same constraint leaves 10 algebras with Poincare at rank 8; from Poincare, F2 on H over {P, K} with positive sign leaves de Sitter alone. From DEFORM-001: the static algebra's rotation-invariant H^2 is 9. Recalled and unverified: the Galilei algebra in 2 + 1 dimensions has two central extensions (the mass, and an "exotic" one pairing the two boosts); with abelian rotations, invariant and full H^2 can differ.

## Definitions

Everything HISTORY-001's pre-registration fixed applies unchanged: families, the candidate set (zero, integrated adjoint deformations over the class grid invariant under the row's symmetry generators, central extensions), fingerprints, ranking, false positives, the forms F1 to F4, the leakage rule, decoys of the same form, the 0.25 live-decoy threshold. The engine is HISTORY-001's (`scripts/deform.mjs`, `scripts/deform-history.mjs`), unchanged except for exporting internals and adding the 2 + 1 algebras.

New here:

- **A stage** is one constraint added to those before it; the predicate is their conjunction. Each stage is graded on its own.
- **A real menu** is a candidate set with at least 5 distinct algebras before any constraint.
- **Stage decoys.** The decoys of a stage replace only that stage's new constraint, with the earlier ones held at their real values, so a decoy measures what the new conflict adds.
- **Out of menu.** If the successor is not among the candidates at all, the stage reports "out of menu": a failure of the generator's reach from that predecessor, not of selection. It is never counted as a pass.

## The rows

**S1, cumulative selection from Galilei (3 + 1).** Predecessor Galilei, symmetry J.
- Stage 1, the 1904 conflict: F1, S = {H, P}, A = {J, K}, signature (3, 1). Successor Poincare (1905).
- Stage 2, the 1998 conflict: add F2, X = H, S = {P, K}, sign positive. Successor de Sitter.
Expected (inferred from the disclosures above): stage 1 a filter (3 survivors); stage 2 de Sitter alone.

**S2, the full static menu (3 + 1).** Predecessor the static algebra (rotations acting, every other bracket zero), symmetry J: the most contracted kinematics, whose deformations include every kinematical algebra one step away.
- Stage 1: the same F1 as S1. Successor Poincare.
- Stage 2: add the same F2. Successor de Sitter.
Expected: stage 1 a filter with Poincare below rank 1 (disclosed). Stage 2 unknown; de Sitter may be out of menu, since the grid over 9 classes allows at most two nonzero coefficients.

**S3, Galilei in 2 + 1 dimensions.** Generators J (one rotation), K1, K2, P1, P2, H. [J, K1] = K2, [J, K2] = -K1, the same for P; Galilei adds [H, K_i] = P_i, matching the 3 + 1 convention. Symmetry J. The full H^2 is reported beside the invariant one.
- Stage A, relativity: F1, S = {H, P}, A = {J, K}, signature (2, 1). Successor Poincare in 2 + 1 (the same relativistic brackets as in 3 + 1, the rotation rule changed).
- Stage B, quantum mechanics, a separate stage on the same predecessor: F3, A = K, B = P (the Schrodinger equation's Galilean phase factor). Successor the Bargmann extension, [K_i, P_j] = delta_ij M.
Expected: unknown for stage A. For stage B, if the recalled exotic extension exists, survivors include mass alone and mass with the exotic term; the exotic term alone fails F3, since F3 needs [K, P] nonzero.

## Verdict rules, per stage

- **pass**: the successor survives at rank 1 with at most one alternative, and the live-decoy hit rate is below 0.25.
- **filter, not prediction**: the successor survives at rank 1 with two or more alternatives.
- **fail (below rank 1)**: the successor survives below rank 1.
- **fail**: the successor is in the menu and does not survive.
- **out of menu**: as defined.

Grades per stage: confirmed (pass on a real menu); marginal (pass on a menu under 5, or rank 1 with two or three alternatives, or a live-decoy rate from 0.25 to 0.5); plausible (below rank 1, four or more alternatives, or a live-decoy rate of 0.5 or more); dead (fail); out of menu is ungraded.

## The pattern's verdict

Over the stages on real menus with the successor in menu:

- **confirmed**: every such stage confirmed, and at least three such stages.
- **marginal**: at least half confirmed or marginal, none dead.
- **plausible**: some stage confirmed or marginal, or none dead.
- **dead**: two or more such stages dead.

If fewer than two stages qualify, the verdict is **needs refinement**: the round could not test the question.

## Scope fixed in advance

The constraints are HISTORY-001's encodings and inherit its leakage gap: a constraint statable in the old vocabulary can still be the new structure, stated in it. The 2 + 1 rows are not history; they test selection on a larger menu, nothing about 1905. Fingerprints can merge non-isomorphic algebras and so undercount false positives.
