---
Kind: expression
Author: an agent session, on the operator's commission
Commission: a deformation generator: sublation in physics read as Lie algebra deformation, validated on history (the kinematical algebras) and then on one open seed (Poincare semidirect Heisenberg); the operator's request of 2026-10-11
Date: 2026-10-11
---

# Generation: sublation as deformation (DEFORM-001)

## Reaching for

When a physical theory is superseded, the old one is kept as a limit of the new: Galilei inside Poincare as c goes to infinity, Poincare inside de Sitter as the radius goes to infinity, classical mechanics inside quantum mechanics as hbar goes to zero. Read algebraically, the new symmetry algebra deforms the old one by a new constant, the old returns as a contraction, and the process stops at an algebra with no deformations left (a rigid one, which a semisimple algebra always is). If that reading holds, the map can generate: take an algebra, compute what can deform it, integrate each direction, and check where it stops. The question is whether this machine, run blind, reproduces known history, and what it says about an algebra whose deformations are less familiar.

The seed was chosen by hand: Poincare semidirect Heisenberg, the algebra of a relativistic particle whose position X is a second Lorentz vector with [P, X] = eta I. Its deformations are where noncommuting positions live.

## Seeds

- D7-X01 (Lawvere's Aufhebung, `lean/MathMap/Topos.lean`): the least level above i at which the i-skeleta become sheaves; the opposition at level i is absorbed, both sides surviving in the higher level. The analogy taken: the old algebra survives in the new as its contraction limit (the old brackets are the new ones at t = 0), and the contradiction absorbed is the obstruction or instability (a nonzero H^2). What it breaks when applied here: Lawvere's order is subtopos inclusion, a poset where the Aufhebung is least; the deformation order is orbit closure, where a deformation is not unique and need not be least. The analogy is expression, never a theorem.
- D7-X07 to D7-X11 (landed in this round, receipted): the cohomology, the deformation and obstruction theory, rigidity, contraction, and Cartan's criterion. These are the machine's parts.
- Leads from a prior session, carried as leads to confirm and never as evidence: the rotation-invariant H^2 of Galilei 4, Poincare 1, Newton-Hooke 2, de Sitter and anti-de Sitter 0; the four Galilei directions; Galilei to de Sitter not first order; for the seed, invariant H^2 = 3 with three named directions, a generic so(4,2) with signature +8 -7, one sign giving so(3,3) at +9 -6, both rigid, and I becoming a dilatation in direction (c).

## Candidates

1. **The deformation generator itself** (`scripts/deform.mjs`): structure constants in; exact H^2 in full and on invariant cochains, cocycles solved in a template span, order-by-order integration with exact Jacobi, the Killing signature, the commutant of ad, and the contraction weights that return the old algebra as a limit.
2. **Calibration:** the generator reproduces the kinematical history, Galilei to Poincare and Newton-Hooke, and both to de Sitter and anti-de Sitter, stopping at the semisimple ones (`calibration.md`).
3. **Seed:** Poincare semidirect Heisenberg deforms along three directions to a family whose generic member is simple and rigid, so(4,2) on one side of a degeneracy surface and so(3,3) or so(5,1) on the other; deformation stops there (`seed.md`).
4. **The degeneracy surface:** with D = ab + c^2 in the round's normalization, D = 0 is where the deformed algebra fails to be semisimple, a double cone through the origin; the sign of D and of a name the real form.

## Against the obvious

1. The obvious version is a symbolic computation by hand or in a computer algebra system with floating-point ranks. This one is exact (rationals, with every rank checked modulo two Mersenne primes) and certifies simplicity by the commutant rather than by inspection.
2. This is the obvious version: Bacry and Levy-Leblond's diagram of possible kinematics, recovered by computation.
3. The obvious version deforms Poincare alone (to de Sitter). Adding a second Lorentz vector and a central charge opens a three-parameter space; the expectation going in was one simple algebra, so(4,2).
4. Not anticipated by the leads, which named only so(4,2) and so(3,3). It came out of the grid.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1 | grading | tool | a rank, kernel or Jacobi check that disagrees with an independent computation |
| 2 | grading | conjecture | any of the leads failing the exact computation, or a published H^2 that disagrees |
| 3 | grading | conjecture | the generic deformation failing to be simple or rigid; prior art that already states it (searched after: see grading) |
| 4 | grading | conjecture | a point off the surface where the reading fails |
| 3 | A-Viable-Fork/Physics `docs/inbound/` | proposal | the Physics side finding no measurable consequence with existing bounds |
