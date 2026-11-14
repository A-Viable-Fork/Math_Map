# Landed review, blind round 1

*Written by `node scripts/audit.mjs --landed-draw 1`. Each item is one field of a landed entry with the excerpt files its grade may use; the first grade, quote and note are not shown.*

Rule [ruling: operator, 2026-11-13]: **confirmed** only when a quoted window states the field's claim itself, not merely names the object; a claim with several parts is confirmed only if every part is quoted, otherwise **imprecise** (say which part) or **unsupported**. **wrong** when a window contradicts it. Grade the landed text, not a correction.

## D2-113.name

- Entry: D2-113 Global Spec Construction
- Field **name**: Global Spec Construction
- Whole entry as landed: description: Relative Spec for O_S-algebra A. | input: Scheme S + O_S-algebra A | output: Scheme Spec_S(A) affine over S | preserved: Algebra structure, affine morphism | broken: Non-affine structure
- Excerpt files: `excerpts/wikipedia-spectrum-of-a-ring.txt`

## D2-009.output

- Entry: D2-009 Affine Transformation
- Field **output**: Transformed point
- Whole entry as landed: description: Linear map + translation. Preserves collinearity. | input: Affine space point | output: Transformed point | preserved: Collinearity, parallelism, distance ratios | broken: Absolute distances, angles
- Excerpt files: `excerpts/wikipedia-affine-transformation.txt`

## D2-132.input

- Entry: D2-132 Bruhat Decomposition
- Field **input**: Algebraic group G + Borel B
- Whole entry as landed: description: G = ⊔ BwB. Borel double cosets indexed by Weyl group. | input: Algebraic group G + Borel B | output: Disjoint union of Bruhat cells | preserved: Cell structure, Weyl combinatorics | broken: Continuous group structure
- Excerpt files: `excerpts/wikipedia-bruhat-decomposition.txt`

## D2-089.broken

- Entry: D2-089 Free Resolution
- Field **broken**: Module presentation
- Whole entry as landed: description: Projective resolution with all free modules. Always exists. | input: R-module M | output: Exact sequence of free modules over M | preserved: Betti numbers, Hilbert series | broken: Module presentation
- Excerpt files: `excerpts/wikipedia-resolution-algebra.txt`

## D2-109.description

- Entry: D2-109 Greenlees-May Duality
- Field **description**: Local cohomology / completion duality.
- Whole entry as landed: description: Local cohomology / completion duality. | input: Module + ideal | output: Duality between RΓ_I and LΛ^I | preserved: Adjunction | broken: Non-dual descriptions
- Excerpt files: `excerpts/arxiv-alg-geom-9503025-abstract.txt`

## D2-094.output

- Entry: D2-094 Derived Functor Application
- Field **output**: Graded {R^iF(M)} or {L_iF(M)}
- Whole entry as landed: description: Replaces non-exact F with R^iF or L_iF via resolutions. | input: Functor F + module M | output: Graded {R^iF(M)} or {L_iF(M)} | preserved: Functoriality, long exact sequences | broken: Exact functor behavior
- Excerpt files: `excerpts/wikipedia-derived-functor.txt`

## D2-094.input

- Entry: D2-094 Derived Functor Application
- Field **input**: Functor F + module M
- Whole entry as landed: description: Replaces non-exact F with R^iF or L_iF via resolutions. | input: Functor F + module M | output: Graded {R^iF(M)} or {L_iF(M)} | preserved: Functoriality, long exact sequences | broken: Exact functor behavior
- Excerpt files: `excerpts/wikipedia-derived-functor.txt`

## D2-143.description

- Entry: D2-143 Vaughan Jones Construction
- Field **description**: Subfactor -> Jones index + knot polynomial.
- Whole entry as landed: description: Subfactor -> Jones index + knot polynomial. | input: Type II_1 factor + subfactor | output: Jones index, knot invariants | preserved: Subfactor index, knot type | broken: Specific vN algebra structure
- Excerpt files: `excerpts/wikipedia-subfactor.txt`, `excerpts/wikipedia-jones-polynomial.txt`

## D2-128.preserved

- Entry: D2-128 Restriction
- Field **preserved**: Vector space, H-invariant subspaces
- Whole entry as landed: description: Rep of G restricted to subgroup H. May decompose. | input: Rep of G + subgroup H | output: Res_H^G(V) | preserved: Vector space, H-invariant subspaces | broken: G-irreducibility
- Excerpt files: `excerpts/wikipedia-restricted-representation.txt`, `excerpts/wikipedia-induced-representation.txt`

## D2-054.broken

- Entry: D2-054 QZ Decomposition (Generalized Schur)
- Field **broken**: Individual matrix structure
- Whole entry as landed: description: Simultaneous reduction of (A,B) for generalized eigenvalue problem Ax = λBx. | input: Matrix pair (A,B) | output: (Q*AZ, Q*BZ) upper triangular forms | preserved: Generalized eigenvalues | broken: Individual matrix structure
- Excerpt files: `excerpts/wikipedia-schur-decomposition.txt`

## D2-087.output

- Entry: D2-087 Projective Resolution
- Field **output**: Exact sequence of projectives over M
- Whole entry as landed: description: ...->P_2->P_1->P_0->M->0. Replaces module with projective complex. | input: R-module M | output: Exact sequence of projectives over M | preserved: Derived category iso, Ext groups | broken: Specific module structure
- Excerpt files: `excerpts/wikipedia-resolution-algebra.txt`, `excerpts/mathlib-Mathlib.CategoryTheory.Preadditive.Projective.Resolution.txt`

## D2-114.broken

- Entry: D2-114 Proj Construction
- Field **broken**: Non-homogeneous info
- Whole entry as landed: description: Graded ring -> projective scheme. | input: Graded commutative ring S | output: Proj(S) with O(1) | preserved: Graded structure, projectivity | broken: Non-homogeneous info
- Excerpt files: `excerpts/wikipedia-proj-construction.txt`, `excerpts/mathlib-Mathlib.AlgebraicGeometry.ProjectiveSpectrum.StructureSheaf.txt`

## D2-119.description

- Entry: D2-119 Flip
- Field **description**: MMP: replaces K-negative curve with K-positive. Preserves smoothness.
- Whole entry as landed: description: MMP: replaces K-negative curve with K-positive. Preserves smoothness. | input: Variety with K-negative extremal ray | output: X+ with K-positive replacement | preserved: Kodaira dimension | broken: Specific curve
- Excerpt files: `excerpts/wikipedia-flip-algebraic-geometry.txt`, `excerpts/wikipedia-kodaira-dimension.txt`

## D2-069.output

- Entry: D2-069 Rational Canonical Form (Frobenius Normal Form)
- Field **output**: Block diag of companion matrices
- Whole entry as landed: description: Block diagonal of companion matrices for invariant factors. Works over any field. | input: Square matrix over field F | output: Block diag of companion matrices | preserved: Minimal polynomial, invariant factors | broken: Eigenvalue decomposition
- Excerpt files: `excerpts/wikipedia-frobenius-normal-form.txt`

## D2-107.preserved

- Entry: D2-107 Grothendieck Duality
- Field **preserved**: Adjunction, dualizing complex
- Whole entry as landed: description: Generalizes Serre to proper morphisms. Dualizing complex. | input: Proper morphism + derived sheaf | output: Adjunction with dualizing complex | preserved: Adjunction, dualizing complex | broken: Non-dual structure
- Excerpt files: `excerpts/wikipedia-coherent-duality.txt`

