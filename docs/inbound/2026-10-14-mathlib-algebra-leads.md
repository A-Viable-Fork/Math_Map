# For Math_Map: leads from ingesting Mathlib.Algebra (2026-10-14)

From Research_OS's Mathlib ingest (functions/mathlib-ingest, finding findings/mathlib-ingest-2026-10-14.md on branch claude/project-thread-pcya7b). Proposals, to verify and then fold in or decline under Math_Map's own review; nothing here is a link. Read against Math_Map 7baf3a3 and Mathlib 380f2aa (the map's own pin).

## 1. Anchors are the bottleneck

Of 59,559 declarations in Mathlib.Algebra, 40 map cleanly onto an entry, through the declarations mapfill/formal.js links exact, general or special. Eight of those lie in the area: Subgroup.normalClosure and Subgroup.normalClosure_normal (D7-157), SnakeInput.δ and SnakeInput.snake_lemma (D2-195), LieAlgebra.hasTrivialRadical_iff_isKilling and IsKilling.instSemisimple (D7-X11), LieModule.Cohomology.d₂₃_comp_d₁₂ (D7-X07) and the five lemma for monoid homomorphisms (D2-196). One clean mapping (to D2-145) runs through an anchor outside the area. Each anchor brings its API with it: a statement that names an anchored declaration maps to that entry, and 20 lemmas about Subgroup.normalClosure do. The number of clean mappings grows with anchors, so a formal link on an operation's defining declaration is worth far more than one on a single lemma.

## 2. Additive twins

Mathlib's to_additive gives each multiplicative declaration its additive twin under a translation Mathlib itself checks. The links of D7-157 (Subgroup.normalClosure) do not reach AddSubgroup.normalClosure, so about 18 additive lemmas stay unmapped. Proposal: let a formal link extend to the to_additive twin of its declaration, recorded as such.

## 3. Named leads (56 entries)

Entries whose typed kinds fit a definition of the library and whose names share a word with it. Read by name and sample only (inferred, not read at the declaration): about 7 look like the entry's operation itself, about 12 are related or special cases, and the rest are false friends.

Likely the operation: D7-150 Polynomial Ring Extension (MvPolynomial), D7-147 Monoid Ring Construction (MonoidAlgebra, AddMonoidAlgebra), D2-185 and D7-273 Derived Category Construction (DerivedCategory), D4-268 Normal generation (AddSubgroup.normalClosure), D4-060 Closure operation (Subsemigroup.closure), D7-048 Quotient Category Construction (HomotopyCategory as a quotient).

Related or special: D7-291 (PresheafOfModules), D7-022 (Abelian.LeftResolution.karoubi), D7-342 and D2-187 (PresheafOfModulesOfCommRing.monoidalCategory), D7-007 and D3-114 (PresheafOfModules.freeYoneda), D2-167 and D7-159 (NormalizerCondition), D7-014 (RingHom.HasEqualizers), D7-219 (ShortComplex.abLeftHomologyData).

False friends, as examples: D2-078 and D7-134 Integral Closure against Subsemiring closures; D7-156 Sylow against AddSubgroup.torsionBy; D7-139 Prime Spectrum against ExpChar.prime; D2-075 Field of Fractions against Field.mk.

The full list is queue/mathlib-algebra-2026-10-14.ndjson in Research_OS (lead "named").

## 4. Namespaces nothing fits

1,249 namespaces hold declarations whose kinds no entry's typing fits. The largest: Polynomial (1,046 declarations), Submodule (644), HomologicalComplex (573), LinearMap (475), CategoryTheory.Abelian.SpectralObject (474), MvPolynomial (453), Finset (449), CategoryTheory.ShortComplex (413), Set (342), AddMonoidAlgebra (284), ModuleCat (282). Several of these have entries (polynomial rings, complexes), so the miss is partly the free typing pass (the entries' operands typed coarsely) and partly operations the map lacks; only reading tells which.

## Status, 2026-10-14

Proposed on branch `claude/mathlib-algebra-links`, for the operator's merge. Section 3's seven "likely the operation" leads, each read at the declaration at `380f2aa`:

- Folded in, as citation pass 6 in `mapfill/formal.js`: D7-150 (Polynomial, with Hilbert basis, UFD, the variable's freeness and commutativity, X a non-unit, and the Krull dimension claim graded special: it needs R Noetherian), D7-147 (MonoidAlgebra and AddMonoidAlgebra, MonoidAlgebra.of, and MvPolynomial as the monoid ring of σ →₀ ℕ), D7-273 (DerivedCategory, Qh as the localization of K(A), homology factoring through D(A)), D7-048 (CategoryTheory.Quotient and Congruence; the lead's HomotopyCategory is one instance of it, not the operation).
- D4-060: the lead's declaration (Subsemigroup.closure) is a false friend; the entry is topological closure, linked to `closure` and the four Kuratowski laws instead.
- Not linked, duplicates: D4-268 names the operation D7-157 already carries, and D2-185 the one D7-273 now carries. The decomposition counts a statement naming anchors of two entries as a composite, so linking both of a duplicate pair would turn every mapping through it from clean to composite. Which entry is the home, and whether the map records the other as a clone, is a question for the operator.
- D7-157 also gains its broken field (Subgroup.conjugatesOfSet_subset_normalClosure), which closes one of the 13 targets the ingest queued.

Section 2 (additive twins) is held: a `to_additive` name has no line in Mathlib's source, so `scripts/formal.mjs` cannot excerpt it, and the link format would need a twin field, read by Research_OS's map reader. Section 3's related and special leads and section 4 are not read yet.

## Status, 2026-10-14 (later)

Section 2 folded in [ruling: operator, 2026-10-14], on branch `claude/mathlib-algebra-links-2`: a link may name its additive twin (`twin` in `mapfill/formal.js`). `scripts/formal.mjs --excerpt` records the source's `@[to_additive]` beside the declaration and `--check` fails without it, or when the attribute names a different twin. Six links carry one (D7-157's four, D2-145's index, D7-193's subgroup closure). That a generated name exists is checked where Mathlib is built: Research_OS's ingest reads the twins and reports any its declarations lack.
