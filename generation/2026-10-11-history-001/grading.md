# Grading: HISTORY-001, can the deformation generator retrodict paradigm transitions?

Date 2026-10-12. Pre-registered at Math_Map `58fadd1` (`preregistration.md`, committed alone, before any computation). Computed at `52cdb5a`: `node scripts/deform-history.mjs --round` regenerates `rows.md` byte for byte in about a minute. Evidence marks: **read** (seen in the source, or computed and reproducible by the command named), **secondary**, **inferred**, **recalled**, **unknown**. Verdicts: confirmed, marginal, plausible, needs refinement, dead.

## 1. The table

| Row | Type | Directions (adjoint + central) | Distinct candidates | Survivors | Successor rank | False positives | Wrong predecessor | Live-decoy hits | Time slice | Leaked | Pre-registered grade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 Galilei to Poincare | deformation by c | 4 + 1 | 12 | 3 | 1 | 2 (de Sitter, anti-de Sitter) | Carroll: Poincare rank 1, 2 alternatives; static: rank 8 of 10 | 6/200 (0.030) | generated (rank 2 of 5) | no | marginal |
| R2 Poincare to de Sitter | deformation by Lambda | 1 + 0 | 3 | 1 | 1 | 0 | Galilei: rank 3 of 3 | 7/31 (0.226) | generated | no | confirmed |
| R3 the plane to Heisenberg | central extension, hbar | 2 + 1 | 3 | 1 | 1 | 0 | affine: none | none live (2 decoys) | generated | no | confirmed |
| R4 Galilei to Bargmann | central charge, mass | 4 + 1 | 12 | 1 | 1 | 0 | Poincare: none | none live (9 decoys) | generated | no | confirmed |
| R6L contracted su(3) to su(3) | unification, leaked | 2 + 1 | 4 | 1 | 1 | 0 | inert R^4: none | 0/1 | generated | **yes** | needs refinement |
| R10 Heisenberg to Schrodinger picture | reformulation | 2 + 0 | 4 | 1 (zero) | 1 | 0 | n/a | n/a | n/a | no | uninformative (class zero, as Gandy's reading predicts) |
| R5 electroweak | unification | | | | | | | | | | out of reach |
| R6 Eightfold Way | unification | | | | | | | | | | out of reach (computed only as R6L) |
| R7 Newton to general relativity | geometrization | | | | | | | | | | out of reach |
| R8 thermodynamics to statistical mechanics | reduction | | | | | | | | | | out of reach |
| R9 Lagrangian to Hamiltonian | reformulation | | | | | | | | | | out of reach |

All numbers: **read**, `rows.md`.

**Reach:** 6 of 11 rows computable, 5 of 11 computable without leaking (R6L needs the successor's generators supplied). The pre-registration expected 5. **Leakage count:** 1 (R6L); the pre-registration expected at least 2, counting R2 as borderline, and by the rule as written R2 does not leak (its constraint names only H, P and K). **Pattern, by the pre-registered rule:** 3 rows confirmed (R2, R3, R4), R1 marginal, none dead, rows specific: **confirmed**.

## 2. Deviations from the pre-registration

1. **The F1 form search is capped.** The pre-registered search over integer combinations (coefficients -2 to 2) of the invariant forms is exhaustive up to 7 basis forms. The F1 decoy space over every set of families reaches 31 basis forms, where 5^31 combinations cannot be enumerated. Beyond 7, the search covers combinations with at most two nonzero coefficients and is marked partial (`scripts/deform.mjs`, `formSignatures`; a selftest shows a partial search missing a signature that needs all eight forms). In R1, 154 of 750 decoys touched a partial search; without them the live hit rate is 6/157 = 0.038 instead of 6/200 = 0.030. The real constraint's search was exhaustive. Both rates are far below 0.25, so the cap moves no verdict.
2. **No live decoy.** The pre-registration did not say what a live hit rate of 0/0 means. The code treats it as below the threshold. This decides R3 and R4 (section 3).
3. **Overlapping rules.** "Fail" covers a successor below rank 1, and so does "plausible". The code applies the grade list: below rank 1 is plausible, and dead needs the successor absent. No row reached this case.
4. **"Generated" is read as pre-registered:** the sliced generator produces the successor and the constraint keeps it, at any rank. In R1 the Jacobi-only generator keeps Poincare at rank 2 of 5; read as "rank 1 with at most one alternative", R1 would be recognized after the fact. R1 is marginal either way.
5. **The R1 Carroll control is specific only by the threshold.** Carroll gives Poincare at rank 1 with two alternatives, the same picture as Galilei. That misses the hit criterion (at most one alternative), so R1 counts as specific, but the predecessor contributes nothing that tells the two apart. The static algebra, a genuinely wrong predecessor, ranks Poincare 8th of 10.

## 3. Reading the confirmations

The rule says confirmed. Read row by row, the confirmations are thinner than the word.

- **R3 and R4 select from a one-element menu.** In each, the predecessor's invariant H^2(g; R) is one-dimensional (the plane: [x, p]; Galilei: [K, P], the mass). Any constraint demanding a nonzero central bracket picks the only central extension there is. The decoys confirm it: no decoy of the same form has a survivor, so the control has nothing to measure. What carries the result is the classification (H^2(g; R) = 1), and the constraint only says "extend centrally". A pass with a vacuous decoy control. **read**, `rows.md`.
- **R3 and R4 are also close to leaking.** "[K, P] is nonzero and central" names only Galilei's families, so by the rule it does not leak. It is also the Bargmann algebra's defining relation, read off a representation. The rule I pre-registered cannot tell "stated in the old vocabulary" from "the new structure stated in the old vocabulary". This is the rule's gap, not the row's.
- **R2 chooses a sign.** Poincare has one class. The candidate set is zero, de Sitter and anti-de Sitter, and the constraint picks the sign of Lambda. The live-decoy rate, 7/31 = 0.226, sits just under the 0.25 threshold: about one live decoy in four of the same form also selects de Sitter alone.
- **R1 is the only row with a real field of candidates, and it gives a filter.** Galilei's 80 grid points integrate to 23 candidates and 12 distinct algebras. Maxwell's Lorentzian form on {H, P} cuts them to 3: Poincare, de Sitter and anti-de Sitter. Poincare comes first only by the ranking (order 1 against order 2). The decoy control is strong here: 6 of 200 live decoys select Poincare. So the constraint carries real information; it just does not finish the job.

**Grader's reading, beside the pre-registered grade:** the pattern's first half, "deformation gives the possible directions", holds wherever the method reaches. Every in-reach successor is in its predecessor's candidate set, at rank 1 of the survivors, and the three genuinely wrong predecessors (the static algebra, Galilei for de Sitter, Poincare for Bargmann) do not select it. The second half, "the conflict selects one", is a filter on the only row that tests it. The pre-registered grade stands as **confirmed**. My reading is **marginal**: confirmed on menus of one or two, a filter on the menu of twelve. The operator rules which reading the map carries.

## 4. The time slice

Every in-reach successor is **generated** from vocabulary dated before its transition, and the cohomology that makes the candidate list finite postdates most of them: Lie algebra cohomology 1929 with trivial coefficients and 1948 with coefficients in a module, deformation theory 1964 (Gerstenhaber; Nijenhuis and Richardson 1967 for Lie algebras), contraction 1951 (Segal) and 1953 (Inonu and Wigner). All **read**, receipts in `rows.md`. With Jacobi alone (Lie, 1870s), the relativistic brackets come out of Galilei, though not at rank 1, and the central terms come out of the Poisson bracket (1809). The free particle's Galilean generators, Poisson-bracketed, already span the Bargmann algebra: {K_i, P_j} = m delta_ij (**read**, computed). So the constraint for R4 was statable in 1926 (the Schrodinger equation's Galilean phase factor, **read**) and its algebra was computable with nineteenth-century tools, yet Bargmann named it in 1954. The method beats history by 28 years on R4, which is evidence that this transition was recognition, not discovery.

The vocabulary dates are first publications, the lenient choice the pre-registration fixed. The map entries' own "became standard" dates are later and would not change a verdict, since every row is already generated.

## 5. Prior art, searched after computing

- **Flato (1982) and Faddeev (1988, 1989)**, as reported by Vilela Mendes (arXiv:1112.3246): non-relativistic to relativistic and classical to quantum "may be interpreted as the replacement of two unstable theories by two stable ones", by deformation, with 1/c and hbar as the deformation parameters; also the idea that "physical theories drift towards simple algebras" (Segal 1951). **read**, `excerpts/arxiv-1112.3246.txt`. Flato's and Faddeev's own texts were not retrieved (**secondary** through Vilela Mendes). The pattern under test is theirs. Their selector is **stability** (rigidity), not conflict.
- This round adds one thing to that framing. On R1, stability and conflict disagree. De Sitter and anti-de Sitter are rigid (H^2 = 0, DEFORM-001) and Poincare is not (H^2 = 1). The stability principle therefore points at de Sitter. The conflict, with the simplicity ranking, points at Poincare, which is what happened in 1905; Lambda came later. Read this way, history took the lowest-order deformation the conflict allowed and reached the rigid algebra in a second step (R2). That reading is **inferred** from two rows. It is generation, and it is not tested here.
- **Vilela Mendes (1994)**, J. Phys. A 27, 8091, already landed by DEFORM-001: both transitions carried out on finite-dimensional algebras. **inspected-abstract**.
- **Lachieze-Rey, de Queiroz and Simon (2014)**, PoS(FFP14)210: "The progressions of theories is mathematically described as Inönü-Wigner extensions of the associated kinematical groups", "with hints at a logic of discovery". **read**, `excerpts/pos-ffp14-210.txt`. Their framing is philosophical; what this round adds is the controls (decoys, wrong predecessors, a time slice) and a count.
- **Figueroa-O'Farrill (2017)**, arXiv:1711.06111, and **Bacry and Levy-Leblond (1968)**: the kinematical classification the R1 and R2 candidate sets reproduce. **read** (already landed; the 1968 date from the paper's reference list).
- No prior test of the deformation account against decoy constraints or a dated vocabulary was found. The search was narrow: three web searches and the reference lists of two papers. Absence is **unknown**, not established.

## 6. Scope

- **Hand encodings.** Each constraint was written by hand, by someone who knew the successor. The pre-registration and the leakage rule limit what the hand can do, but they cannot make it blind. Section 3 shows where the rule is too weak (R3, R4). A stronger rule would require the constraint to be derived mechanically from the receipted evidence, which needs a formal language for the evidence that this map does not have.
- **Hindsight in the map.** The predecessors and their families (J, K, P, H) are modern presentations. In 1905 nobody wrote Galilei as a ten-dimensional Lie algebra with these generators; the time slice dates the tools, not the presentation. The candidate sets also rest on a class basis the engine chooses, and the grid over it decides which combinations count as support 1. On R1, Poincare's rank 1 depends on the relativistic class being a single basis element.
- **The finite-dimensional wall.** Five of eleven rows are out of reach. Unification adds generators (R5, R6), geometrization needs diffeomorphisms (R7, with Newton-Cartan arriving after general relativity, in 1923, as its limit: **read**), reduction has no algebra to deform (R8), and the Lagrangian to Hamiltonian change lives on function spaces (R9). The classical to quantum step is reached only as the Heisenberg Lie algebra; its real content, the Moyal deformation of the associative product, is infinite-dimensional.
- **Fingerprints.** Distinct algebras are counted by invariants, which can merge non-isomorphic algebras and so undercount false positives, never overcount them.
- **Decoy spaces** are small where the families are few: 2 decoys for R3, 9 for R4, 8 for R6L. There a decoy control can only be vacuous or decisive.

## 7. Verdicts

| Claim | Verdict |
|---|---|
| deformation of the predecessor contains the successor, on every row in reach | **confirmed** (5 of 5, with R6L leaked) |
| the conflict selects the successor alone | **marginal**: alone on menus of one (R3, R4) or two (R2); a filter leaving 3 of 12 on R1 |
| the selection is specific to the predecessor | **plausible**: three genuinely wrong predecessors fail to select; Carroll, a sibling contraction, gives R1's picture exactly |
| the successors are generable from their own era's vocabulary | **confirmed** for every row in reach; the cohomology that organizes the list postdates most transitions |
| the method's reach over paradigm transitions | 6 of 11, 5 without leaking: deformation and central extension only |
| the pattern as pre-registered | **confirmed** by the rule; **marginal** in the grader's reading (section 3) |

## 8. Proposal: the quantum gravity form of the test (a proposal, nothing more)

The rule says the pattern holds on the deformation rows, so the pre-registration ends with this proposal. Nothing below is computed.

**The test.** Take a seed algebra whose contractions include both the quantum algebra (Heisenberg, with hbar central) and the gravitational kinematics (Poincare and de Sitter). Write the QM-versus-GR conflicts as constraints in the forms F1 to F4. Run the same candidate set, ranking, wrong-predecessor and decoy controls. The time slice has no future analogue, so its place is taken by a stricter leakage rule.

**Constraints in the same form**, candidates for pre-registration:

1. F3, quantum: [P, X] has a nonzero central part (hbar survives).
2. F1, relativity: a Lorentzian invariant form on {P} under the Lorentz generators.
3. F2, gravity with Lambda > 0: tr((ad of time translation on {P, K})^2) > 0.
4. A localization bound (a minimal length): some bracket [X, X] is nonzero. Its evidence is a thought experiment, a measurement localizing energy inside its own gravitational radius. Writing it is where leakage is most likely, because the evidence is theory, not observation.

**What the seed already says.** For DEFORM-001's seed, Poincare semidirect Heisenberg, every nonzero deformation makes I non-central: each of the three cocycles gives I a nonzero bracket with P or X (**read**, `generation/2026-10-11-deform-001/seed.md`), and no nonzero combination cancels them, since (a) and (b) send [P, I] and [X, I] to different targets and (c) to P and X themselves (**inferred**). Constraint 1 then conflicts with every direction off the zero deformation, before any decoy is drawn. That is either the test's first finding or a sign that constraint 1 is worded too strictly. Deciding which is part of choosing the seed.

**What choosing the seed requires.**

- **A pre-registered list of seeds, not one.** History supplied each row's predecessor; here the predecessor is a choice: Poincare semidirect Heisenberg, U(1,3) semidirect Heisenberg (Born reciprocity), the Bargmann algebra relativized, or the conformal algebra as an already stable endpoint. The other seeds serve as each other's wrong predecessors, which makes the specificity control meaningful.
- **A rule that the seed is a contraction of nothing chosen for its answer.** A seed built so that a favoured algebra is a deformation of it is R6L again: leaked by construction.
- **Each constraint's evidence class,** marked observation, experiment or thought experiment, with the leakage rule tightened for the last kind.
- **A success criterion that cannot point at a known answer.** With no successor to recognize, a result is a survivor list. It means something only if the live-decoy rate is low and the list is short, and the decoy spaces must be large enough to be informative (R3 and R4 show what happens when they are not).
- **The reach stated in advance.** The candidate algebras stay finite-dimensional, so the test speaks to kinematical quantum gravity (noncommuting positions, deformed relativity), never to dynamics or diffeomorphisms.
