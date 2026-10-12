# Pre-registration: HISTORY-001, can the deformation generator retrodict paradigm transitions?

Date 2026-10-11. Written and committed before any computation of this round. Its commit hash is the record that the rows, constraints, controls and verdict rules came first. Nothing below is changed after the commit; a deviation is written in the round's grading as a deviation, with its reason.

## The pattern under test

DEFORM-001 suggested: deformation of the predecessor's symmetry algebra gives the possible directions, and the conflict that drove the transition selects one (Galilei has four rotation-invariant directions; the Lorentz invariance of Maxwell's equations selects the relativistic one). HISTORY-001 asks whether that holds across history, with controls strong enough that a pass means something.

## What is already known (disclosed, so it cannot pass as a prediction)

From DEFORM-001 (`generation/2026-10-11-deform-001/calibration.md`): rotation-invariant H^2 of Galilei 4, Poincare 1, Newton-Hooke 2, de Sitter and anti-de Sitter 0; the four Galilei directions; Galilei to de Sitter at second order. From memory, recalled and unverified: the central extension of Galilei by mass (Bargmann), H^2(Poincare; R) = 0, su(3) and su(2,1) as the deformations of the contraction of su(3) along su(2) + u(1). The deformation rows below are therefore not blind; the controls are what this round adds.

## Definitions fixed in advance

**Families.** Generators come in families named by their letters (J, K, P, H for the kinematical algebras; M for a central mass; x, p, z for one degree of freedom; T, Y, V for su(2), hypercharge and the four strangeness-changing generators). A constraint may name families only.

**Candidate set of a row.** Computed from the predecessor g0 alone, before the constraint is read:

1. the zero deformation (g0 itself: no transition);
2. adjoint deformations: a class basis of H^2(g0; g0) invariant under the row's symmetry generators (cocycle representatives chosen deterministically by the engine, in the order exact elimination returns them, keeping each that raises the class rank); every combination with coefficients in {-1, 0, 1} when the basis has at most 4 elements, otherwise every combination with at most 2 nonzero coefficients, each +1 or -1; each integrated order by order in the invariant 2-cochains (maxOrder 6), and dropped as obstructed if integration fails;
3. central extensions: a basis of the invariant H^2(g0; R) with trivial coefficients, the same grid rule, each giving g0 + R z with [a, b] + omega(a, b) z.

Each surviving family is evaluated at t = 1 (the grid holds both signs).

**Distinct algebras.** Candidates are grouped by a fingerprint: dimension, Killing signature (positive, negative, null), dimension of the center, the derived series and the lower central series (dimensions until they stabilize), the dimension of the derivation algebra, and the dimension of the commutant of ad. Equal fingerprints are counted as one algebra; this can undercount (non-isomorphic algebras may share a fingerprint), never overcount. The successor is recognized by fingerprint equality with an independently built copy of it.

**Ranking.** Each algebra's key is the best (smallest) pair (integration order, number of nonzero coefficients) over the candidates that produce it; central extensions and first-order deformations have order 1, the zero deformation order 0. Rank is by key; algebras with equal keys share a rank, and the tie count is reported.

**False positives.** The number of distinct surviving algebras other than the successor.

**Constraint forms.** Four, each statable in the predecessor's families:

- F1, required invariant form: the span S of some families is stable under ad of the families A, and carries a nondegenerate symmetric bilinear form, invariant under ad A, of signature (p, q) up to overall sign. The search for a form of that signature runs over integer combinations, coefficients -2 to 2, of a basis of the invariant forms.
- F2, required growth: S is stable under ad of the first generator X1 of family X, and tr((ad X1 restricted to S)^2) has a required sign, positive (exponential separation) or negative (oscillation).
- F3, required central bracket: some bracket [A_i, B_j] is nonzero and every such bracket commutes with the whole algebra.
- F4, required Killing type: the Killing form has a required signature (p, q) and is nondegenerate.

**The leakage rule.** A constraint leaks if its statement names a family the predecessor lacks, or if its receipted evidence postdates the transition, or if the predecessor itself had to be enlarged by the successor's new generators for the row to be computed. A leaked row is reported, and never counted as a pass.

**The time-sliced vocabulary.** Each map entry a row uses gets the date it was first published, with a receipt; first publication is earlier than "became standard", so the slice is lenient to the generator, and a row that fails it fails under any later date. The sliced generator uses only entries dated before the transition. When Chevalley-Eilenberg cohomology (D7-X07) or deformation theory (D7-X08) is unavailable, it is the Jacobi-only generator: g0 + t phi for phi in the invariant 2-cochain basis (block basis, at most 2 nonzero coefficients, each +1 or -1), kept when Jacobi holds for every t (orders 1 and 2), plus central extensions found by Jacobi on g0 + R z over the invariant trivial-coefficient 2-cochains (same support rule), with no quotient by coboundaries; duplicates are merged by fingerprint. When Lie algebras themselves are unavailable, the row is out of reach for the sliced generator. A row is **generated** when the sliced generator produces the successor and the constraint keeps it, **recognized after the fact** otherwise.

**Null controls.**

- Wrong predecessor: the real constraint applied to the candidate set of a named wrong predecessor. The row is **specific** when the successor is not selected there (not at rank 1 with at most one alternative).
- Decoys: every constraint of the same form, over the predecessor's families, other than the real one. If that space has more than 2000 members, 500 are drawn with a seeded generator (mulberry32, seed 20261011 plus the row number). The decoy parameter spaces: F1, S any union of families of dimension at least 2, A any nonempty set of families, (p, q) with p + q = dim S and p >= q; F2, X any family, S any union of families of dimension at least 2, sign + or -; F3, any unordered pair of families, repetition allowed; F4, (p, q) with p + q = dim, nondegenerate. A decoy **hits** when it selects the successor by the pass criterion below (rank 1, at most one alternative). Reported: the hit rate over all decoys, and over live decoys (those with at least one survivor).

## The rows

| Row | Type | Predecessor (algebra) | Conflict, with its dated evidence (recalled; receipts follow) | Constraint | Successor | Symmetry for invariance | Wrong predecessor |
|---|---|---|---|---|---|---|---|
| R1 | deformation by c | Galilei, 10 | Maxwell's wave equation is invariant under transformations mixing t and x (Voigt 1887, Lorentz 1904); the null result of Michelson and Morley (1887) | F1: S = {H, P}, A = {J, K}, signature (3, 1) | Poincare | J | Carroll ([K, P] = H, the c to 0 contraction), and the static algebra |
| R2 | deformation by Lambda | Poincare, 10 | the accelerating expansion (supernova observations, 1998) | F2: X = H, S = {P, K}, sign + | de Sitter so(4,1) | J | Galilei |
| R3 | deformation by hbar (central extension) | abelian span(x, p), 2 | the quantum of action in phase space, the Bohr-Sommerfeld rule (1913 to 1916); transition 1925 | F3: [x, p] nonzero and central | Heisenberg, 3 | none | the nonabelian 2-dimensional algebra [x, p] = x |
| R4 | central charge (mass) | Galilei, 10 | Galilean invariance of the Schrodinger equation (1926) holds only up to a mass-dependent phase; transition Bargmann 1954 | F3: [K, P] nonzero and central | Bargmann, 11 | J | Poincare |
| R5 | unification | u(1) of electric charge, 1 | the weak interaction's charged currents (Fermi 1933 onward); transition Glashow 1961 to Weinberg and Salam 1967 to 1968 | none statable: the successor has 4 generators | su(2) + u(1) with mixing | none | n/a |
| R6 | unification | isospin and hypercharge su(2) + u(1), 4 | the baryon and meson octets (complete by 1959); transition Gell-Mann and Ne'eman 1961 | F4: compact, signature (0, 8) | su(3), 8 | T, Y | n/a |
| R6L | unification, leaked variant | (su(2) + u(1)) semidirect R^4, the contraction of su(3) along su(2) + u(1), 8 | as R6 | F4: signature (0, 8) | su(3) | T, Y | (su(2) + u(1)) + R^4 with R^4 inert |
| R7 | geometrization | Newtonian gravity | the perihelion of Mercury (1859), the equivalence of inertial and gravitational mass | none in a finite algebra | general relativity | n/a | n/a |
| R8 | reduction | thermodynamics | the second law's statistical reading | none in a finite algebra | statistical mechanics | n/a | n/a |
| R9 | reformulation | Lagrangian mechanics | none: the same facts | none | Hamiltonian mechanics | n/a | n/a |
| R10 | reformulation | the oscillator algebra x, p, z, H (Heisenberg picture), 4 | none: the same facts | "the same facts": the algebra is unchanged (the zero deformation only) | the same algebra, Schrodinger picture | none | n/a |

Rows considered and dropped: Aristotelian to Galilean kinematics, because the predecessor has no boosts, so the transition adds generators and no historical predecessor algebra with boosts existed (the static kinematical algebra is a modern contraction, used here only as a wrong predecessor). Newton-Cartan to general relativity is folded into R7: the recalled fact that Newton-Cartan is the c to infinity limit of general relativity, published after it (Cartan 1923), is checked against a receipt; it is out of reach either way, since diffeomorphisms are infinite-dimensional.

R6 as stated is out of reach (4 generators cannot deform into 8). R6L is computed to show what the method does once the successor's new generators are supplied; it is leaked by construction.

R10 records how a reformulation looks to the method: Gandy's fields (Physics `docs/research/GANDY-0_1.md`) for both reformulation rows are content "hypotheticals", trivial "yes" (a change of picture or of variables keeps every fact). In R10 the change of picture is conjugation by the time evolution, generated by ad H; the round checks that it is a derivation (d of it vanishes), so it moves no structure constant and is invisible to H^2.

## Expected outcomes (generation, written before computing)

- R1: Poincare survives at rank 1; de Sitter and anti-de Sitter also carry a Lorentzian invariant form on {H, P}, so the false-positive count is expected at least 2. Carroll is expected to reach Poincare too (Poincare is a deformation of Carroll), so R1 is expected not specific.
- R2: two candidates besides zero (the two signs of the one class), de Sitter survives, anti-de Sitter fails. Expected pass with 0 false positives, on a candidate set too small for the decoys to say much.
- R3: one class; the constraint and the successor coincide. Expected pass, uninformative.
- R4: expected pass with 0 false positives; Poincare as wrong predecessor expected to give no survivor.
- R5, R6, R7, R8, R9: out of reach. R6L: su(3) and su(2,1) expected among the candidates, compactness selecting su(3); leaked.
- Reach expected 5 of 11 rows (R1, R2, R3, R4, R10); leakage count expected at least 2 (R2's encoding is a borderline case: its statement names only predecessor families but asserts the bracket [H, P] the successor adds; R6L by construction).

## What counts

For each row in reach, apart from R10:

- **pass**: the successor survives at rank 1 with at most one alternative; the constraint does not leak; the live-decoy hit rate is below 0.25.
- **fail**: the successor does not survive, or survives below rank 1.
- **filter, not prediction**: the successor survives at rank 1 with two or more alternatives.
- **out of reach**: the predecessor or successor is not a finite-dimensional Lie algebra given by rational structure constants, or the two differ in dimension by more than a central extension.

Grades, per row:

- **confirmed**: pass, and generated by the sliced vocabulary.
- **marginal**: pass but recognized only after the fact; or rank 1 with two or three alternatives; or a live-decoy hit rate from 0.25 to 0.5.
- **plausible**: the successor survives below rank 1, or with four or more alternatives, or a live-decoy hit rate of 0.5 or more.
- **needs refinement**: leaked.
- **dead**: fail.

The pattern as a whole, over the deformation rows R1 to R4:

- **confirmed**: at least three rows confirmed, none dead, and at least one row specific;
- **marginal**: at least two rows marginal or better and none dead, or confirmed by count with no row specific;
- **plausible**: one row marginal or better;
- **needs refinement**: two or more rows leaked;
- **dead**: two or more rows dead.

R10 is graded only on whether the change of picture is invisible to H^2; R5 to R9 enter the reach, not the grade. The reach is the share of rows in reach; the leakage count is the number of rows marked leaked.

## After computing

Prior art is searched only after the computation: Flato on deformation as a model of physical theories, Faddeev, Vilela Mendes, Figueroa-O'Farrill's kinematical classifications. Excerpts are landed for whatever the grading rests on. If the pattern holds on the deformation rows, the round ends with a proposal only: the quantum gravity form of the test, and what choosing its seed requires.
