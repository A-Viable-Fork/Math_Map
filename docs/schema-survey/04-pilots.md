# Schema survey, phase 4: six pilots

Date: 2026-11-14. Each pilot adds rows for real entries in a scratch file under `docs/schema-survey/pilots/` and runs a throwaway script that uses them. Nothing here is in `mapfill/`, and no pilot row is map data. Every count below is printed by the script named beside it (**measured**); the readings of what a result means are **inferred** and say so.

To rerun: `node docs/schema-survey/pilots/p1-predicates.mjs` and likewise `p2-squares`, `p3-inverses`, `p4-binders`, `p5-atlas`, `p6-clusters`. Each exits 0 when its receipts verify and its computed checks come out as its rows say. Seeds are fixed. Pilot 4's rows were built from the 112 Mathlib files its links name, fetched at the pin, each matching the sha256 the map's excerpt records (112 of 112, measured); the built rows are committed, so the script reruns without the network.

## What a receipt is in these pilots

`pilots/lib.mjs` verifies six kinds. **excerpt**: a window in an excerpt file (the map's `excerpts/`, or one of eight new files in `pilots/excerpts/` made with `scripts/excerpt.mjs` at pinned Wikipedia revisions). **field**: a substring of the entry's own field in `map.json`, which shows the entry says it and carries the field's evidence, no more. **formal**: a Mathlib link or Lean claim the map already records on that entry. **computed**: the script recomputes it on every run. **external**: a file at a commit in another repository, cited and uncheckable from here. **none**: unreceipted, with the reason.

## Summary

| Pilot | Candidates | Rows | Entries | Receipts that verify | Rows also run on instances |
|---|---|---|---|---|---|
| 1 predicates along chains | G02, G25, G39, G45 | 55 rows, 9 implications, 6 counterexamples | 28 | 62 of 70 (field 34, excerpt 20, formal 8; 8 unreceipted) | 12 chains checked |
| 2 intertwinings as squares | G09, G27, G60, G24 | 30 | 22 | 30 of 30 (field 13, computed 14, formal 2, excerpt 1) | 28 of 30 |
| 3 inverses with a domain | G16, G41, G62 | 26 | 32 | 25 of 26 (field 13, computed 10, excerpt 1, formal 1; 1 unreceipted) | 18 of 26 |
| 4 binder alignment | G31 | 54 binders, 23 leads read | 29 | 54 of 54 (each a binder at a line of a file whose hash was reproduced) | none: it is a reading |
| 5 transitions and the cocycle | G58, G59, G61, G12 | 38 dictionary rows, 5 carried claims | 17 (10 bound by a row) | 34 of 38 (excerpt 25, field 6, computed 3; 4 unreceipted) | the triple overlap, 40 graphs per convention |
| 6 walking the clusters | G60, G63, G64 | 16 squares | 21 | 16 of 16 (excerpt 7, field 7, formal 1, computed 1) | 16 of 16 |

Across the six: 234 rows, of which 221 carry a receipt that verifies (94%), and 13 are unreceipted and say so. A field receipt is the weakest kind that verifies: 73 rows rest on one.

**Time per row.** Measured as wall-clock of the agent session between starting a pilot's rows and its first clean run, with the reading of entries beforehand left out: pilot 1, 220 seconds for 70 rows; pilot 2, 359 seconds for 30 rows and their checks; pilot 3, 153 seconds for 26 rows. Pilots 4 to 6 were not timed cleanly (a restart and shared scripts fall inside their intervals). These are readings of an agent's typing speed and say little about a person's cost. What transfers is the ordering (inferred): a row receipted by the entry's own field or by a formal link already in the map costs almost nothing; a row that needs a new fetched window costs a fetch and a search of the page (eight pages for pilots 5 and 6, rate-limited by Wikipedia to roughly one every few seconds); a row whose receipt is a computation costs the check, written once per kind of square and reused.

## Pilot 1: predicates along chains (G02, with G25, G39, G45)

**Rows.** 37 predicates; per entry, what it `requires` of its input (35 rows, 4 of them tied to one claim of the entry), `establishes` (9), `keeps` (7) or `destroys` (2) in its output, and 2 rows of stated silence. Nine implications among predicates. Six counterexamples, each tied to the hypothesis it defeats.

**The function.** A chain check with pi-Base's deduction and Hoare's rule: a requirement is met when its predicate holds on entry; "violated" when an earlier step destroyed it; "not established" when nothing supplies it. Silence leaves a predicate unknown, as in `compose.mjs`.

**What it caught that the map cannot.** Twelve chains; seven fail on a predicate. For two of the seven, `compose.mjs` today accepts every join:

- `D7-068, D7-X03` (a reflective subcategory read as a level): compose reports "match" and five invariant verdicts. The pilot reports "essential not established" and "geometric-embedding not established". The map knows this: `conditions.js` says in prose that a bare reflective subcategory need not be exact. The prose is on D7-068 and no script reads it.
- `D2-117, D2-118` (blow up, blow down) with nothing given: compose reports "match". The pilot reports "smooth-projective-surface not established" and "minus-one-curve not established", and passes the same chain when a point on a smooth projective surface is given.

For the other five compose has no typing and reports unknown joins. Among them: `D6-086, D6-073` (Laplace then Bromwich) fails on integrability along the line, with the counterexample printed (f = 1, F = 1/s); `D4-273, D4-273` (compactify twice) is a violation, since step one destroys the non-compactness step two requires.

**Fraction checkable.** 62 of 70 rows verify. The 8 unreceipted are implications recalled from Mathlib instances and two facts about blow-ups.

**Where it gives out (inferred).**

- The vocabulary does not close at this size: 24 of the 36 predicates used are used by one entry. Twelve are shared, and the chains that work are the ones inside one area (toposes: lex-reflector, geometric-embedding and essential carry four entries). This is pi-Base's situation in reverse: it closes because it stays in one field.
- Two rows needed a conditional `establishes` (D2-072 gives a local ring only at a prime; D2-117 gives a (-1)-curve only for a point on a smooth surface). The row shape grew a `given` field mid-pilot.
- D6-117 requires one thing of each of two measures. A chain that passes one object cannot say which. This is G10, named operands, arriving as a need.
- Four requirements belong to one claim of an entry, and the claim is named by a free string. This is G01, claim atoms, arriving as a need.
- All twelve chains came out as expected, and the expectations were written by the same hand as the rows. The pilot shows the mechanism catches what the rows say; it is no test of the rows.

## Pilot 2: intertwinings as squares (G09, G27, G60, G24)

**Rows.** Thirty squares "transform t carries operation top to operation bottom, on a domain", in the shape of Mathlib's `Function.Semiconj`. Twenty-eight are run on seeded instances.

**What it caught that the map cannot.**

- Five rules stated the way they are commonly said, without their hypothesis, each refuted by a computed instance: the DFT and linear convolution (S02; the tail wraps), exp(A + B) = exp(A) exp(B) (S12; needs commuting), degree and leading coefficient of a product (S17, S19; over Z/6, (2x + 1)(3x + 1) = 5x + 1), and the derivative of a product (S21). Each failure is a counterexample row tied to the missing hypothesis, made without anyone writing it.
- Nine rules the entries lack, each holding on instances: shift to modulation and reversal for the DFT, dyadic convolution for the Walsh-Hadamard transform, the Z-transform's delay rule, the matrix exponential on commuting matrices, the Kronecker mixed product, infimal convolution to sum for the Legendre-Fenchel transform, the Laplace derivative rule (by quadrature on three functions), and log taking products to sums. The last is filed by its entry under `broken` ("Additive structure").
- Fourteen of the sixteen quoted rows are also run. A quotation and a computation agreeing is two receipts of different kinds on one row.

**G27 is dead as generated.** Of 60 top and bottom operations, 5 are entries of the map. The rest (circular convolution, pointwise product, cyclic shift, sum of matrices) are operations inside a structure, which the map does not hold: the gap Research_OS measured for Mathlib.Algebra. An intertwining slot whose two sides must be entry ids would be empty for most rows. What survives: the sides are names from a small operation vocabulary, bound to an entry where one exists.

**Where the shape gives out.** Leibniz's rule takes one product to a sum of two: it is no square (S21). Anti-homomorphisms and one-way theorems (the final value theorem) need a direction field the pilot did not exercise.

## Pilot 3: inverses with a domain (G16, G41, G62)

**Rows.** Twenty-six rows in `PartialEquiv`'s shape: two entries (or one, for an involution or an inverse with no entry), the side, the domain, the residue. Seventeen computed checks, all passing.

**What it caught that the map cannot.**

- Fifteen of sixteen entries that are invertible on their domain list something under `broken`; one (D7-213) says nothing is broken. An invertible step loses no information on its domain, so whatever it breaks its inverse restores. Today a round trip reports those items broken: for `D2-117, D2-118` compose reports "Local structure at the center broken", on a chain that is the identity where Castelnuovo's condition holds.
- A round trip needs to know what "the same" means. `D9-X42, D9-X43` (suspend, resume) is an inverse on the principal's state and leaves the trace changed: compose reports the audit log broken, correctly. An inverse row has to name the carrier it inverts on. This is G08, and it was not in the row shape.
- Three rows are periods, the holonomy of G62: the DFT applied twice is reversal (times N) and four times the identity; the Hilbert transform squares to minus the identity on zero-mean signals and kills constants; the Hodge star squares to (-1)^(k(n-k)), where the entry says "plus or minus".
- Two blockers with computed witnesses (G41): the triangle and the claw have the same line graph; a causal and an anticausal sequence share one Z-transform formula.
- Three pairs where the entries give no domain at all (continuous Fourier, Mellin, the D4 blow-up pair): the rows say "unknown", and their field receipts show only that the entry claims an inverse.

**One function is dead.** The commission's example was a route found only through an inverse. At the grain of kinds it finds nothing: the typed map has 995 edges over 53 kinds and already reaches 2213 ordered pairs; the reversed edges add 0. The kinds are too coarse for an inverse to open anything. What would close the gap: a route search over predicates or invariants in place of kinds, which needs pilot 1's rows at scale.

## Pilot 4: binder alignment (G31)

**Rows.** Every Mathlib declaration the map links exact, special or general (223 of 223 parsed). The script collects hypothesis-like binders from the declaration and from the `variable` lines in scope, maps each to a predicate word, and asks whether the linked entry's text states it. 54 binders on 29 entries; 31 stated, 23 not.

**The 23 leads, read by hand.** Omitted 3, omitted in a degenerate case 2, the claim itself absent from the entry 1, already recorded by the link's grade 1, implied by the entry's setting 16.

**What it caught that the map cannot.** The three omissions each sit on a field the map grades formal:

- D2-193, Chinese remainder: the isomorphism needs finitely many ideals (`[Finite ι]`). The entry says "coprime ideals"; its output is formal on that declaration.
- D2-188, adjoint functor theorem: the entry's input is "Functor F satisfying conditions". The audit note lists the conditions; the entry does not; its description is formal.
- D7-290, sheafification: the entry does not say what the presheaf takes values in; the declaration needs colimits in the target.

A field graded formal by an exact link can still omit a hypothesis the formal statement carries, because the grade compares conclusions. Nothing in the map checks this today.

**Precision and misses.** 5 of 23 leads are real omissions (22%), 3 of them non-trivial (13%). The finder missed at least one true omission: D7-230 omits "enough projectives", which Mathlib spells `HasProjectiveResolutions`, a class outside the pilot's word list. The scope tracking of `variable` lines is a heuristic. Sixteen leads were "implied": the word list matches literally and cannot see that "over a field" gives a principal ideal domain.

**Cost.** The rows are free: a parse of files the map already hashes. The reading of 23 leads is the cost, and it is small.

## Pilot 5: transitions and the cocycle (G58, G59, G61, G12)

**Rows.** Three charts (graphs, matroids, matrices over a field) and three transitions as dictionaries: the cycle matroid (16 rows), the incidence matrix (11), the column matroid (11). A row sends a term of one chart to a term of another, or to nothing; "no image" is a claim with a receipt.

**The cocycle, as data.** For each graph term, the column-matroid image of its incidence-matrix image against its cycle-matroid image: 10 agree, 0 defects, 1 gap. The gap is edge contraction: the incidence dictionary sends it to "adding one endpoint's row to the other's and deleting the column", and the column-matroid dictionary knows contraction as "projecting the remaining columns onto the quotient", from D1-058's own text. Two names for one matrix operation. The script then checks on instances that the row-merge is the matroid contraction (20 of 20). A comparison of strings found a real hole in a dictionary, and a computation filled it.

**The cocycle, on instances.** Is the column matroid of the incidence matrix the cycle matroid? Oriented over the rationals: 40 of 40. Oriented or unoriented over the two-element field: 40 of 40. Unoriented over the rationals: fails on 26 of 40, smallest witness the triangle (cycle matroid rank 2, column rank 3). D1-120 describes the unoriented matrix ("entry = 1 iff element is in block") and names no field. So the transition as the entry states it fails the cocycle unless a convention is added. This is G12 arriving as a need: a transition row without its convention is wrong on two thirds of random graphs.

**Claims carried.** Five formal claims of matroid entries, carried to graphs through the dictionary, each with its evidence capped by the weakest row used and its domain set by the rows' domains. `Matroid.eRank_add_eRank_dual` on D1-059 (rank plus dual rank is the size of the ground set) crosses as: for a connected plane graph, V - 1 + F - 1 = E. Euler's formula falls out of a matroid theorem and three dictionary rows, at evidence "computed on instances", domain "planar graphs". The map has neither statement about graphs.

**Departures derived.** For twelve graph entries the script lists the terms of the entry's own fields that have no matroid image. D1-046: vertex, degree, adjacency, connectivity. The landed departure for D1-046 reads "Graph-specific: operates on edge of graph", which names nothing lost. Three entries with no landed relation at all (D1-047, D1-007, D1-003) get a derived one.

**Fraction checkable.** 34 of 38 rows; the four unreceipted are "no image" rows authored here.

**Where it gives out (inferred).** A term is a string, and the cocycle-as-data check is string equality: it found the gap because two authors (the entry and this pilot) named one thing two ways, and it would miss two things named one way. The carried claims' `uses` lists were written by hand. One triangle of charts took 38 rows and eight fetched pages.

## Pilot 6: walking the landed clusters (G60, G63, G64)

**Rows.** Sixteen squares across charts for nine of the 29 landed clusters, each run on instances. The landed status of every cluster is "Unwalked".

**What it caught that the map cannot.**

- **Which clusters are isomorphisms.** For ISO-D1-INT-01 and ISO-D1-INT-02 the squares hold one way (the cycle matroid of an edge deletion is the deletion; of a contraction, the contraction; of an induced subgraph, the restriction) and the converses fail with computed witnesses: the path and the star on four vertices have the same cycle matroid; in the triangle, the restriction to two edges is no induced subgraph. The landed index calls INT-01 an "abstraction hierarchy" and the map records the cluster as a list of six members. The walk says which way the arrow goes and exhibits what it forgets.
- **An edge between clusters.** The wye-delta transformation (D1-012, ISO-CROSS-YD) is Kron reduction (D1-052, ISO-CROSS-KR) at a node of degree three: eliminating the centre of a star with conductances a, b, c by a Schur complement gives the delta's ab/(a+b+c). Neither cluster's note names the other.
- **Partners with no entry.** ISO-CROSS-KR names the Schur complement and ISO-CROSS-CC names Gaussian elimination fill-in as partners; neither is bound to an entry in the cluster. The squares hold on instances all the same (effective resistance kept by the Schur complement; the fill pattern of elimination is the elimination game's, and the filled graph is chordal).
- **A cluster with nothing to run.** D4-221, the Legendre transformation in the geometric vocabulary, has no formula in its text; the square is run between D6-091 and D5-088.

**Coverage.** 9 of 29 clusters. Of the 20 not walked: three have finite instances that could be written (quantum channels, Jordan-Wigner, Smith normal form), six were not read, and for the other eleven no finite instance was written (Yoneda, GNS, Curry-Howard, sheaves among them).

## What the pilots say about the merge

Phase 3 proposed that G09, G27 and G60 are one kind, Mathlib's `Semiconj`. Pilots 2 and 6 used one record on two axes: thirty squares inside a chart and sixteen across charts share the fields `t`, `top`, `bottom`, `on`, a receipt and a check. The merge holds. G27 (both sides must be entries) is dead at 5 of 60.

## Needs that surfaced, by candidate

Each line is a candidate that a pilot ran into without setting out to test it.

| Candidate | Where it surfaced |
|---|---|
| G01 claim atoms | pilot 1: four requirements belong to one claim, named by a free string; pilot 4: the omitted hypotheses sit under a field-level formal grade |
| G08 determinacy, and the carrier of an inverse | pilot 3: suspend and resume invert on state, not on trace |
| G10 named operands | pilot 1: D6-117 requires different things of two measures |
| G12 conventions | pilot 5: the incidence matrix fails the cocycle without one |
| G39 counterexamples | pilot 2: five made by computation |
| G45 stated silence | pilot 1: two rows, both needed |
| G04 instances | pilots 2, 3, 5, 6: every computed receipt is one |
| G37 executable laws | pilots 2, 3, 6: 62 rows run on instances; the map's evidence ladder has no level for them |
