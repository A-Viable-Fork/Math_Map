// Role: the landed review. Field-by-field grades of the landed entries (origin map, tier landed) against sources
//   under the strict rule, in batches of 25, domain by domain (D2, D4, D1, D3, D5, D6, D8), each in id order.
// Contract: exports REVIEW = [{ id, batch, why, sources: { key: url }, files: { key: excerpt file }, fields: {
//   name, description, input, output, preserved, broken: { verdict, src?, quote?, note?, more?: [{ src, quote }],
//   against?: [{ src, quote }] } }, contra: [field], mathlib?: note, falsify?: { field, claim, attempt, outcome } }]:
//   the shape of audit/fill-review-0_1.js. contra names the fields whose recalled expectation
//   (audit/landed-review-recall-0_1.js, committed before the batch's sources were read) a source contradicted.
//   mathlib says what was searched at the pin when no link in mapfill/formal.js bears on the entry. Every tenth
//   entry carries falsify: its most specific claim, the attempt to break it, and the outcome (survived or
//   falsified). DOMAINS = { D<n>: { verdict, fields, note } }, the graded verdict on a finished domain as landed.
//   Every quote occurs in its file (scripts/mathmap.mjs --check); scripts/audit.mjs checks the grades and
//   renders reports/LANDED-REVIEW.md.
// Invariant: data only. A grade is a claim about a landed entry, never an edit to it. The strict rule [ruling:
//   operator, 2026-11-13]: confirmed only when a quoted window states the field's claim itself, not merely names
//   the object; a claim with several parts is confirmed only when every part is quoted (quote and more),
//   otherwise imprecise (the note names the part) or unsupported. wrong: a window contradicts it. A field
//   without a fetched source is unsupported, never confirmed.
"use strict";

const C = (src, quote, note, more) => ({ verdict: "confirmed", src, quote, ...(note ? { note } : {}), ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const I = (src, quote, note, more) => ({ verdict: "imprecise", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const X = (src, quote, note, more) => ({ verdict: "wrong", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const U = (note) => ({ verdict: "unsupported", note });
// A source that disagrees with the grade's source: recorded beside it, never picked over it.
const vs = (grade, against) => ({ ...grade, against: against.map(([s, q]) => ({ src: s, quote: q })) });
const WHY = (b) => `Landed review, batch ${b}: a landed entry graded field by field against sources under the strict rule.`;
const r = (id, batch, files, fields, contra = [], opts = {}) => ({ id, batch, why: WHY(batch), files, fields, contra, ...opts });
const F = (field, claim, attempt, outcome) => ({ field, claim, attempt, outcome });

const R = String.raw;
const ROWS = [
  // Batch 1: D2-001 to D2-054.
  r("D2-001", 1, { t: "wikipedia-translation-geometry", i: "mathlib-Mathlib.Analysis.Normed.Affine.Isometry", a: "mathlib-Mathlib.Geometry.Euclidean.Angle.Unoriented.Affine" }, {
    name: C("t", "a '''translation''' is a [[geometric transformation]] that moves every point of a figure, shape or space by the same [[Distance geometry|distance]] in a given [[direction (geometry)|direction]]."),
    description: C("t", "a '''translation''' is a [[geometric transformation]] that moves every point of a figure, shape or space by the same [[Distance geometry|distance]] in a given [[direction (geometry)|direction]]."),
    input: C("t", "A translation can also be interpreted as the addition of a constant [[vector space|vector]] to every point"),
    output: C("t", "moves every point of a figure, shape or space by the same [[Distance geometry|distance]] in a given [[direction (geometry)|direction]]."),
    preserved: C("t", "Translations preserve the direction and length of line segments, and the amplitudes of angles.", null,
      [["t", "so that the orientation of the body in space is unaltered"], ["i", "def constVAdd (v : V) : P ≃ᵃⁱ[𝕜] P :="], ["a", "(f : P →ᵃⁱ[ℝ] P₂) (p₁ p₂ p₃ : P) : ∠ (f p₁) (f p₂) (f p₃) = ∠ p₁ p₂ p₃"]]),
    broken: C("t", "A translation is an [[affine transformation]] with ''no'' [[fixed point (mathematics)|fixed point]]s.", "Every point moves; the zero translation, the identity, is the trivial exception."),
  }),
  r("D2-002", 1, { r: "wikipedia-reflection-mathematics", o: "wikipedia-orientation-vector-space", p: "mathlib-Mathlib.Geometry.Euclidean.Projection", a: "mathlib-Mathlib.Geometry.Euclidean.Angle.Unoriented.Affine", d: "mathlib-Mathlib.Analysis.InnerProductSpace.Projection.FiniteDimensional" }, {
    name: C("r", "is a [[function (mathematics)|mapping]] from a [[Euclidean space]] to itself that is an [[isometry]] with a [[hyperplane]] as the set of [[Fixed point (mathematics)|fixed point]]s"),
    description: C("r", "is a [[function (mathematics)|mapping]] from a [[Euclidean space]] to itself that is an [[isometry]] with a [[hyperplane]] as the set of [[Fixed point (mathematics)|fixed point]]s", null,
      [["r", "For example, the mirror image of the small Latin letter '''p''' for a reflection with respect to a [[vertical axis]] (a ''vertical reflection'') would look like '''q'''."]]),
    input: C("r", "To find the reflection of a figure, reflect each point in the figure."),
    output: C("r", "To find the reflection of a figure, reflect each point in the figure."),
    preserved: C("r", "to itself that is an [[isometry]]", "Size as lengths: an isometry keeps every length. Angles: every affine isometry keeps them, and Mathlib's reflection is one.",
      [["p", "P ≃ᵃⁱ[𝕜] P :="], ["a", "(f : P →ᵃⁱ[ℝ] P₂) (p₁ p₂ p₃ : P) : ∠ (f p₁) (f p₂) (f p₃) = ∠ p₁ p₂ p₃"]]),
    broken: C("o", "while a reflection by the ''XY'' Cartesian plane is not orientation-preserving:", "Every reflection matrix has determinant -1 and a map preserves orientation when its determinant is positive; in three dimensions orientation is handedness.",
      [["r", "is [[orthogonal matrix|orthogonal]] with [[determinant]] −1"], ["o", "This mapping is '''orientation-preserving''' if its determinant is positive."], ["o", "in three dimensions when a figure is left-handed or right-handed."], ["d", "theorem det_reflection : LinearMap.det K.reflection.toLinearMap = (-1) ^ finrank 𝕜 Kᗮ"]]),
  }),
  r("D2-003", 1, { r: "wikipedia-rotation-mathematics", m: "mathlib-Mathlib.Geometry.Euclidean.Angle.Oriented.Rotation", b: "mathlib-Mathlib.Geometry.Euclidean.Angle.Unoriented.Basic" }, {
    name: C("r", "Any rotation is a [[motion (geometry)|motion]] of a certain [[space (mathematics)|space]] that preserves at least one [[point (geometry)|point]]."),
    description: C("r", "Any rotation is a [[motion (geometry)|motion]] of a certain [[space (mathematics)|space]] that preserves at least one [[point (geometry)|point]].", null,
      [["r", "In [[Plane (mathematics)|two dimensions]], only a single [[angle]] is needed to specify a rotation about the [[origin (mathematics)|origin]]"], ["r", "* The ''[[axis of rotation]]'' is a [[line (geometry)|line]] of its fixed points."]]),
    input: C("r", "This (common) fixed point or [[center (geometry)|center]] is called the ''[[center of rotation]]''", null, [["r", "only a single [[angle]] is needed to specify a rotation"]]),
    output: C("r", "Any rotation is a [[motion (geometry)|motion]]"),
    preserved: C("r", "it leaves [[Euclidean distance|the distance]] between any two points unchanged after the transformation. But a (proper) rotation also has to preserve the [[orientation (vector space)|orientation structure]].", "Angles: every linear isometry keeps them, and a rotation about the origin is one.",
      [["b", "angle (f u) (f v) = angle u v"], ["m", "def rotation (θ : Real.Angle) : V ≃ₗᵢ[ℝ] V :="], ["m", "theorem det_rotation (θ : Real.Angle) : LinearMap.det (o.rotation θ).toLinearMap = 1"]]),
    broken: I("r", "* The ''[[axis of rotation]]'' is a [[line (geometry)|line]] of its fixed points.", "In space every point of the axis stays fixed, not only the centre; in the plane only the centre does."),
  }, ["broken"]),
  r("D2-004", 1, { h: "wikipedia-homothety", m: "mathlib-Mathlib.LinearAlgebra.AffineSpace.AffineMap", d: "mathlib-Mathlib.Analysis.Normed.Affine.AddTorsor" }, {
    name: C("h", "a '''homothety''' (or '''homothecy''', or '''homogeneous dilation''')"),
    description: I("h", "is a [[Transformation (mathematics)|transformation]] of an [[affine space]] determined by a point {{mvar|S}} called its ''center'' and a nonzero number {{mvar|k}} called its ''ratio''",
      "Scaling by k from a centre, affine, as stated; it multiplies distances by |k|, so it is an isometry when |k| = 1 (k = -1 is the reflection at the centre): \"not isometric\" holds only for |k| other than 1.",
      [["h", R`multiplies ''distances'' between points by {{tmath|\vert k \vert}}`], ["h", "* for <math>k=-1</math> one gets the ''reflection'' at the center;"]]),
    input: C("h", "determined by a point {{mvar|S}} called its ''center'' and a nonzero number {{mvar|k}} called its ''ratio''"),
    output: C("h", "Consequences: A triangle is mapped on a [[Similarity (geometry)|similar]] one."),
    preserved: C("h", "* A ''line'' is mapped onto a parallel line. Hence: ''angles'' remain unchanged.", null,
      [["h", "* The ''ratio of two line segments'' is preserved."], ["h", "Consequences: A triangle is mapped on a [[Similarity (geometry)|similar]] one."]]),
    broken: C("h", R`multiplies ''distances'' between points by {{tmath|\vert k \vert}}, ''areas'' by <math>k^2</math>`, null, [["d", "dist p₁ (homothety p₁ c p₂) = ‖c‖ * dist p₁ p₂"]]),
  }, ["description"]),
  r("D2-005", 1, { t: "wikipedia-translation-geometry" }, {
    name: C("t", "which pictorially results in a vertical shift."),
    description: C("t", R`resulting in a graph consisting of the points {{tmath|\bigl(x, f(x) + b\bigr) }}`),
    input: C("t", R`A '''vertical translation''' means composing the function {{tmath|y \mapsto y + b}} with {{mvar|f}}, for some constant {{mvar|b}}`),
    output: C("t", R`resulting in a graph consisting of the points {{tmath|\bigl(x, f(x) + b\bigr) }}`),
    preserved: C("t", "are therefore vertical translates of each other.", "Derivative: the antiderivatives of one function are vertical translates of each other. Domain: each point (x, y) goes to (x, y + b), so x is kept. Shape: the graph is translated, and translations keep lengths and angles.",
      [["t", R`Each point {{tmath|(x, y)}} of the original graph corresponds to the point {{tmath|(x, y + b)}} in the new graph`], ["t", "Translations preserve the direction and length of line segments, and the amplitudes of angles."]]),
    broken: C("t", R`corresponds to the point {{tmath|(x, y + b)}} in the new graph`, "Every value moves by b, so the range moves by b."),
  }, [], { mathlib: "Searched graph shifts and Function.comp with addition: Mathlib states no graph transformations as such (f (x + c) is composition with a translation); no declaration states this entry's claims." }),
  r("D2-006", 1, { t: "wikipedia-translation-geometry" }, {
    name: C("t", "which pictorially results in a horizontal shift."),
    description: C("t", R`resulting in a graph consisting of points {{tmath|(x, f(x - a)) }}`, "With c = -a, f(x + c) moves the graph by -c: to the left when c > 0.",
      [["t", R`Each point {{tmath|(x, y)}} of the original graph corresponds to the point {{tmath|(x + a, y)}} in the new graph`]]),
    input: C("t", R`a '''horizontal translation''' means [[function composition|composing]] {{mvar|f}} with a function {{tmath|x \mapsto x - a}}, for some constant number {{mvar|a}}`),
    output: C("t", R`resulting in a graph consisting of points {{tmath|(x, f(x - a)) }}`),
    preserved: C("t", R`corresponds to the point {{tmath|(x + a, y)}} in the new graph`, "Range: every value y is kept. Shape: the graph is translated, keeping lengths and angles.",
      [["t", "Translations preserve the direction and length of line segments, and the amplitudes of angles."]]),
    broken: C("t", R`corresponds to the point {{tmath|(x + a, y)}} in the new graph`, "With c = -a the domain moves by -c."),
  }, [], { mathlib: "Searched as for D2-005: no graph-transformation declarations at the pin." }),
  r("D2-007", 1, { s: "wikipedia-scaling-geometry" }, {
    name: C("s", "* If <math>m=1</math>, the transformation is vertical;"),
    description: C("s", R`<math>y=nf\left(\frac{x}{m}\right).</math>`, "With m = 1 this is g(x) = n f(x).", [["s", "* If <math>m=1</math>, the transformation is vertical;"]]),
    input: I("s", R`for <math>m,n \in \R^+</math>.`, "The source's factor is positive; the landed scalar a is unrestricted, and a = 0 collapses the graph."),
    output: C("s", R`<math>y=nf\left(\frac{x}{m}\right).</math>`, "With m = 1."),
    preserved: U("No fetched source states that zeros and domain are kept (true for a nonzero a; a = 0 makes every point a zero)."),
    broken: U("No fetched source states the effect on the range and the extrema."),
  }, [], { mathlib: "Searched as for D2-005: no graph-transformation declarations at the pin." }),
  r("D2-008", 1, { s: "wikipedia-scaling-geometry" }, {
    name: C("s", "* If <math>n=1</math>, the transformation is horizontal;"),
    description: C("s", R`<math>y=nf\left(\frac{x}{m}\right).</math>`, "With n = 1 and a = 1/m this is f(a x); the source says m < 1, that is a > 1, is a contraction.",
      [["s", "* If <math>n=1</math>, the transformation is horizontal; when <math>m > 1</math>, it is a dilation, when <math>m < 1</math>, it is a contraction."]]),
    input: I("s", R`for <math>m,n \in \R^+</math>.`, "The source's factor is positive; the landed scalar a is unrestricted (a = 0 is not a scaling, a < 0 adds a reflection)."),
    output: C("s", R`<math>y=nf\left(\frac{x}{m}\right).</math>`, "With n = 1."),
    preserved: U("No fetched source states that the range is kept."),
    broken: U("No fetched source states the effect on the domain and the period."),
  }, [], { mathlib: "Searched as for D2-005: no graph-transformation declarations at the pin." }),
  r("D2-009", 1, { a: "wikipedia-affine-transformation" }, {
    name: C("a", "an '''affine transformation''' or '''affinity'''"),
    description: C("a", "That is, an arbitrary affine transformation of {{mvar|X}} is the composition of a linear transformation of {{mvar|X}} (viewed as a vector space) and a translation of {{mvar|X}}.", "Collinearity: lines go to lines.",
      [["a", "is a [[geometric transformation]] that preserves [[line (geometry)|lines]] and [[parallel (geometry)|parallelism]]"]]),
    input: C("a", "a [[Function (mathematics)|function]] which [[Map (mathematics)|maps]] an affine space onto itself"),
    output: C("a", "(meaning that it sends points to points, lines to lines, planes to planes, and so on)"),
    preserved: I("a", "and the ratios of the lengths of [[Parallel (geometry)|parallel]] line segments.", "Collinearity and parallelism are kept; ratios of distances are kept only for parallel segments, not in general.",
      [["a", "that preserves [[line (geometry)|lines]] and [[parallel (geometry)|parallelism]]"]]),
    broken: C("a", "but not necessarily [[Euclidean distance]]s and [[angle]]s."),
  }, ["input"], { mathlib: "Searched AffineMap, Collinear and AffineSubspace.Parallel: Mathlib defines affine maps (AffineMap), but no declaration at the pin states that they preserve collinearity, parallelism or ratios of parallel lengths." }),
  r("D2-010", 1, { c: "wikipedia-collineation", x: "wikipedia-cross-ratio", p: "mathlib-Mathlib.LinearAlgebra.Projectivization.Basic" }, {
    name: C("c", "a '''collineation''' is a [[injective function|one-to-one]] and [[surjection|onto]] map"),
    description: I("c", "If the geometric dimension of a [[Pappus's hexagon theorem|pappian]] projective space is at least 2, then every collineation is the product of a homography (a projective linear transformation) and an automorphic collineation.",
      "A bijection preserving collinearity, as stated; but semilinearity holds from geometric dimension 2 on (the fundamental theorem): on a projective line every bijection is a collineation, and non-Desarguesian planes come from no vector space.",
      [["c", "the resulting notion of collineation is just any bijection of the set."], ["c", "namely the [[non-Desarguesian plane]]s"]]),
    input: C("c", "map (a [[bijection]]) from one [[projective space]] to another, or from a projective space to itself"),
    output: C("c", "map (a [[bijection]]) from one [[projective space]] to another, or from a projective space to itself"),
    preserved: C("c", "such that the [[Image (mathematics)|images]] of [[collinear]] points are themselves collinear.", "Cross-ratio in the linear case: homographies are projective transformations, which preserve it.",
      [["x", "it is preserved by the [[projective transformation]]s of a projective line."], ["c", "projective linear transformations (also known as [[homography|homographies]])"]]),
    broken: U("No fetched source states which metric properties a collineation loses; a projective space carries no metric to lose."),
  }, [], { falsify: F("description", "All collineations are semilinear.", "Looked for collineations with no semilinear map behind them: on a projective line every bijection of the points is a collineation, and non-Desarguesian planes have collineations but no underlying vector space.", "falsified") }),
  r("D2-011", 1, { v: "wikipedia-involution-mathematics", f: "mathlib-Mathlib.Logic.Function.Basic" }, {
    name: C("v", "{{Short description|Function that is its own inverse}}"),
    description: C("v", "An involution is a function {{math|''f'' : ''X'' → ''X''}} that, when applied twice, brings one back to the starting point.", null, [["f", "∀ x, f (f x) = x"]]),
    input: C("v", "Given a module {{math|''M''}} over a [[ring (mathematics)|ring]] {{math|''R''}}, an {{math|''R''}} [[endomorphism]] {{math|''f''}} of {{math|''M''}} is called an involution", "The source defines involutions on any set; on an algebraic structure they act on its elements, as for modules."),
    output: C("v", "is called an involution if {{math|{{itco|''f''}}<sup>2</sup>}} is the identity homomorphism on {{math|''M''}}."),
    preserved: I("v", "In [[ring theory]], the word ''involution'' is customarily taken to mean an [[antihomomorphism]] that is its own inverse function.",
      "Involutivity holds by definition; the structure is respected only where the involution is required to respect it (an R-endomorphism of a module), a ring involution reverses products, and an involution of a bare set respects nothing.",
      [["v", "an {{math|''R''}} [[endomorphism]] {{math|''f''}} of {{math|''M''}} is called an involution"]]),
    broken: U("\"Specific element values\" is a gloss; no source states it."),
  }, ["input"]),
  r("D2-037", 1, { w: "wikipedia-fourier-mukai-transform", n: "nlab-fourier-mukai-transform" }, {
    name: C("w", "a '''Fourier–Mukai transform''' ''Φ''<sub>''K''</sub>"),
    description: I("w", "which is, in a sense, an [[integral transform]] along a kernel object ''K'' ∈ D(''X''×''Y'').",
      "An integral functor between derived categories along a kernel on X x Y, as stated; it is an equivalence only for some kernels (Mukai's Poincare kernel on an abelian variety and its dual), and Orlov's theorem says every fully faithful triangulated functor between derived categories of smooth projective varieties is one. It does not define a derived equivalence in general.",
      [["w", "in order to prove an [[equivalence of categories|equivalence]] between the derived categories of coherent sheaves on an [[abelian variety]] and its [[dual abelian variety|dual]]"], ["n", "be a [[triangulated functor|triangulated]] [[fully faithful functor]].  Then $F$ is represented by some object"]]),
    input: C("w", "''K'' ∈ D<sup>b</sup>(''X''×''Y'') an object in the derived category of coherent sheaves on their product."),
    output: C("w", "is a functor D<sup>b</sup>(''X'')→D<sup>b</sup>(''Y'') given by"),
    preserved: C("w", "this Fourier–Mukai transform gives examples of different varieties (with trivial canonical bundles) that have equivalent derived categories.", "An equivalence for the Poincare kernel on an abelian variety and its dual; the field leaves the conditions unstated.",
      [["w", "in order to prove an [[equivalence of categories|equivalence]]"]]),
    broken: I("w", "so this Fourier–Mukai transform gives examples of different varieties", "The variety is lost only in general: an abelian variety and its dual, usually not isomorphic, have equivalent derived categories, but when the canonical class is ample or anti-ample the derived category determines the variety.",
      [["w", "If the [[Canonical bundle|canonical class]] of a variety is [[ample line bundle|ample]] or anti-ample, then the derived category of coherent sheaves determines the variety."]]),
  }, [], { mathlib: "Searched Fourier-Mukai, integral functor and derived categories of coherent sheaves: Mathlib has derived categories of abelian categories (DerivedCategory) but no coherent sheaves on schemes or integral functors at the pin." }),
  r("D2-040", 1, { l: "wikipedia-lu-decomposition", t: "mathlib-Mathlib.LinearAlgebra.Matrix.Transvection" }, {
    name: C("l", "'''lower–upper''' ('''LU''') '''decomposition''' or '''factorization'''"),
    description: C("l", "factors a [[matrix (mathematics)|matrix]] as the product of a lower [[triangular matrix]] and an upper triangular matrix", null, [["l", "LU decomposition can be viewed as the matrix form of [[Gaussian elimination]]."]]),
    input: I("l", "If {{mvar|A}} is [[invertible matrix|invertible]], then it admits an LU (or LDU) factorization [[if and only if]] all its leading principal [[minor (linear algebra)|minors]] are nonzero",
      "The type is a square matrix, but the factorization need not exist: an invertible A has one exactly when its leading principal minors are nonzero, and otherwise the rows must be reordered first.",
      [["l", "Sometimes factorization is impossible without prior reordering of {{mvar|A}}"]]),
    output: C("l", "a lower triangular matrix {{mvar|L}} and an upper triangular matrix {{mvar|U}} such that {{math|1=''A'' = ''LU''}}."),
    preserved: C("l", R`\det(A) &= \det\left(P^{-1}\right) \det(L) \det(U) \\`, "The determinant is the product of the factors' determinants (with the sign of P when rows are permuted); Ax = b is solved by two triangular solves.",
      [["l", "# First, we solve the equation"], ["l", "# Second, we solve the equation"]]),
    broken: U("\"Matrix structure (triangulated)\" is a gloss; no source states what LU loses."),
  }, ["input"]),
  r("D2-041", 1, { l: "wikipedia-lu-decomposition" }, {
    name: C("l", "A '{{dfni|lower-diagonal-upper decomposition}}' (LDU) is a decomposition of the form"),
    description: C("l", "<math display=block> A = LDU, </math>", null, [["l", "where {{mvar|D}} is a [[diagonal matrix]]"]]),
    input: I("l", "If {{mvar|A}} is [[invertible matrix|invertible]], then it admits an LU (or LDU) factorization [[if and only if]] all its leading principal [[minor (linear algebra)|minors]] are nonzero",
      "As for LU: an invertible A has an LDU factorization exactly when its leading principal minors are nonzero; not every square matrix has one."),
    output: C("l", "are [[Triangular matrix#Unitriangular matrix|unitriangular matrices]], meaning that all the entries on the diagonals of {{mvar|L}} and {{mvar|U}} are one.", null, [["l", "where {{mvar|D}} is a [[diagonal matrix]]"]]),
    preserved: U("\"Same as LU + explicit scaling\" restates LU; no source states what LDU keeps beyond it."),
    broken: U("\"Same as LU\": no source states it."),
  }, ["input"], { mathlib: "Searched LDU and triangular factorizations: the nearest is Matrix.Pivot.exists_list_transvec_mul_diagonal_mul_list_transvec (transvections, diagonal, transvections), linked on D2-040 as related; no LDU at the pin." }),
  r("D2-042", 1, { l: "wikipedia-lu-decomposition" }, {
    name: C("l", "It is called '{{dfni|LU factorization with partial pivoting}}' (LUP):"),
    description: C("l", "It turns out that all square matrices can be factorized in this form,", null, [["l", R`<math display=block> PA = LU, \quad (AQ=LU),</math>`], ["l", "reorder the rows and columns of {{mvar|A}}."]]),
    input: C("l", "It turns out that all square matrices can be factorized in this form,"),
    output: C("l", R`<math display=block> PA = LU, \quad (AQ=LU),</math>`),
    preserved: I("l", "and the factorization is numerically stable in practice.", "Existence for every square matrix is stated; stability is stated only in practice, \"except for known pathological cases\", not guaranteed.",
      [["l", "is sufficient for numerically stable LU factorization, except for known pathological cases."], ["l", "It turns out that all square matrices can be factorized in this form,"]]),
    broken: C("l", "which, when correspondingly left- and right-multiplied to {{mvar|A}}, reorder the rows and columns of {{mvar|A}}."),
  }, [], { mathlib: "Searched LUP and pivoting: no LUP factorization at the pin." }),
  r("D2-043", 1, { b: "wikipedia-block-lu-decomposition" }, {
    name: C("b", "a '''Block LU decomposition''' is a [[matrix decomposition]] of a [[block matrix]]"),
    description: I("b", "This decomposition is used in [[numerical analysis]] to reduce the complexity of the block matrix formula.", "LU on a block matrix, as stated; the source says it is used to reduce the complexity of the block matrix formula, and says nothing about parallel architectures.",
      [["b", "is a [[matrix decomposition]] of a [[block matrix]] into a lower block triangular matrix ''L'' and an upper block triangular matrix ''U''."]]),
    input: C("b", "is a [[matrix decomposition]] of a [[block matrix]]"),
    output: C("b", "into a lower block triangular matrix ''L'' and an upper block triangular matrix ''U''."),
    preserved: U("\"Same as LU at block level\": no source states it."),
    broken: U("\"Intra-block detail\" is a gloss; no source states it."),
  }, [], { mathlib: "Searched block LU and Schur complements: Mathlib has the block determinant formulas (Matrix.det_fromBlocks) but no block LU factorization stated as such at the pin." }),
  r("D2-044", 1, { k: "wikipedia-rank-factorization" }, {
    name: C("k", "a '''rank decomposition''' or '''rank factorization''' of {{mvar|A}} is a [[factorization]] of {{mvar|A}} of the form {{math|1=''A'' = ''CF''}}"),
    description: C("k", R`where <math>C\in\mathbb F^{m\times r}</math> and <math>F\in\mathbb F^{r\times n}</math>, where <math>r=\operatorname{rank} A</math>`, "Full column and full row rank are stated for the construction through the singular value decomposition; with r = rank A they hold for any rank factorization.",
      [["k", R`Since <math display="inline">U_1</math> is a full-column-rank matrix and <math display="inline">\Sigma_r V_1^*</math> is a full-row-rank matrix`]]),
    input: C("k", R`where <math>r=\operatorname{rank} A</math> is the [[Rank (linear algebra)|rank]] of <math>A</math>.`),
    output: C("k", R`where <math>C\in\mathbb F^{m\times r}</math> and <math>F\in\mathbb F^{r\times n}</math>`),
    preserved: I("k", R`be any [[basis (linear algebra)|basis]] for the column space of <math display="inline">A</math> and place them as column vectors to form the`, "Rank (r = rank A) and the column space (the columns of C are a basis of it) are stated; for the row space the source states only that the row space of A lies in that of F.",
      [["k", R`where <math>r=\operatorname{rank} A</math>`], ["k", R`Therefore, the column space of <math display="inline">A^\textsf{T}</math> is contained within the column space of <math display="inline">F^\textsf{T}</math>`]]),
    broken: U("\"Full matrix (compressed to rank-r)\" is a gloss; no source states what is lost."),
  }, ["preserved"], { mathlib: "Searched rank factorization in Mathlib/LinearAlgebra/Matrix/Rank.lean: Mathlib has Matrix.rank and rank inequalities for products, but no rank factorization at the pin." }),
  r("D2-045", 1, { c: "wikipedia-cholesky-decomposition" }, {
    name: C("c", "When it is applicable, the Cholesky decomposition is roughly twice as efficient as the [[LU decomposition]]"),
    description: C("c", "Every Hermitian positive-definite matrix (and thus also every real symmetric positive-definite matrix) has a Cholesky decomposition", "The source writes A = L L* with L lower triangular; U = L* gives the landed U* U.",
      [["c", "is roughly twice as efficient as the [[LU decomposition]] for solving [[System of linear equations|systems of linear equations]]."], ["c", "where {{math|'''L'''}} is a [[lower triangular matrix]] with real and positive diagonal entries, and {{math|'''L'''}}* denotes the [[conjugate transpose]] of {{math|'''L'''}}."]]),
    input: C("c", "Every Hermitian positive-definite matrix (and thus also every real symmetric positive-definite matrix) has a Cholesky decomposition"),
    output: C("c", "where {{math|'''L'''}} is a [[lower triangular matrix]] with real and positive diagonal entries", "With U = L*, upper triangular."),
    preserved: I("c", "is roughly twice as efficient as the [[LU decomposition]] for solving [[System of linear equations|systems of linear equations]].", "The solution set is kept (the factorization solves Ax = b); positive-definiteness is the input's hypothesis, and no source states that the factorization preserves it."),
    broken: U("\"Full matrix\" is a gloss; no source states what is lost."),
  }, [], { mathlib: "Searched Cholesky: none at the pin; the LDL decomposition (LDL.lower_conj_diag) is linked on D2-046." }),
  r("D2-046", 1, { c: "wikipedia-cholesky-decomposition", m: "mathlib-Mathlib.Analysis.Matrix.LDL" }, {
    name: C("c", "A closely related variant of the classical Cholesky decomposition is the LDL decomposition"),
    description: C("c", "For this reason, the LDL decomposition is often called the ''square-root-free Cholesky'' decomposition.", null, [["m", "theorem LDL.lower_conj_diag : LDL.lower hS * LDL.diag hS * (LDL.lower hS)ᴴ = S"]]),
    input: I("c", "Some indefinite matrices for which no Cholesky decomposition exists have an LDL decomposition with negative entries in {{math|'''D'''}}", "Positive-definite matrices have one, but so do positive semidefinite ones and indefinite ones whose first n - 1 leading principal minors are non-singular: the landed input is narrower than the operation.",
      [["c", R`For positive semidefinite {{math|'''A'''}}, an  <math display=inline>\mathbf L \mathbf D \mathbf L^*</math> decomposition exists`]]),
    output: C("c", "where {{math|'''L'''}} is a [[Unitriangular matrix|lower unit triangular (unitriangular)]] matrix, and {{math|'''D'''}} is a [[diagonal matrix|diagonal]] matrix."),
    preserved: I("c", "For this reason, the LDL decomposition is often called the ''square-root-free Cholesky'' decomposition.", "No square roots, as stated; \"same as Cholesky\" is not stated, and positive-definiteness is not kept for an indefinite input.",
      [["c", R`An alternative way to eliminate taking square roots in the <math display=inline>\mathbf{LL}^\mathrm{*}</math> decomposition is to compute the LDL decomposition`]]),
    broken: U("\"Same as Cholesky\": no source states it."),
  }, ["preserved"]),
  r("D2-047", 1, { q: "wikipedia-qr-decomposition", g: "mathlib-Mathlib.Analysis.InnerProductSpace.GramSchmidtOrtho" }, {
    name: C("q", "QR decomposition is often used to solve the [[linear least squares (mathematics)|linear least squares]] (LLS) problem"),
    description: I("q", "QR decomposition is often used to solve the [[linear least squares (mathematics)|linear least squares]] (LLS) problem", "A = QR with Q orthogonal and R upper triangular, used for least squares, as stated; numerical stability belongs to the algorithm (Householder reflections are stable, Gram-Schmidt is not), not to the decomposition.",
      [["q", "into a product ''A''&nbsp;=&nbsp;''QR'' of an [[orthonormal matrix]] ''Q'' and an [[upper triangular matrix]] ''R''."], ["q", "The Gram-Schmidt process is inherently numerically unstable."], ["q", "The use of Householder transformations is inherently the most simple of the numerically stable QR decomposition algorithms"]]),
    input: C("q", "More generally, we can factor a complex ''m''×''n'' matrix ''A'', with {{nowrap|''m'' ≥ ''n''}}", "The source states m at least n."),
    output: C("q", "where ''Q'' is an [[orthogonal matrix]] (its columns are [[orthogonal]] [[unit vector]]s"),
    preserved: I("q", "If ''A'' has ''n'' [[linearly independent]] columns, then the first ''n'' columns of ''Q'' form an [[orthonormal basis]] for the [[column space]] of ''A''.", "The column space, for full column rank, is stated; that Q preserves norms is not stated in a window, and numerical stability depends on the algorithm.",
      [["g", "theorem span_gramSchmidt (f : ι → E) : span 𝕜 (range (gramSchmidt 𝕜 f)) = span 𝕜 (range f)"]]),
    broken: U("\"Dense structure\" is a gloss; no source states it."),
  }, ["description", "preserved"], { falsify: F("description", "QR gives numerically stable least squares.", "Checked whether stability holds however Q and R are computed: the source says the Gram-Schmidt process is inherently numerically unstable, while Householder reflections give a stable algorithm.", "falsified") }),
  r("D2-048", 1, { e: "wikipedia-eigendecomposition-of-a-matrix", v: "wikipedia-eigenvalues-and-eigenvectors", m: "mathlib-Mathlib.Analysis.Matrix.Spectrum" }, {
    name: I("e", "When the matrix being factorized is a [[normal matrix|normal]] or real [[symmetric matrix]], the decomposition is called \"spectral decomposition\"", "Eigendecomposition is the name; \"spectral decomposition\" names it only for normal or real symmetric matrices.",
      [["e", "'''eigendecomposition''' (also known as '''eigenvalue decomposition''' or '''EVD''')"]]),
    description: C("e", R`{{tmath|A {{=}} QDQ^\mathsf{-1} }}, where <math>D</math> is a diagonal matrix containing the [[eigenvalues]] of <math>A</math> on the diagonal`, null,
      [["e", "The form is useful because it reduces many matrix operations including powers and matrix functions, to operations on the diagonal entries of Λ."]]),
    input: C("e", "Note that only [[diagonalizable matrices]] can be factorized in this way."),
    output: C("e", R`{{tmath|A {{=}} QDQ^\mathsf{-1} }}, where <math>D</math> is a diagonal matrix containing the [[eigenvalues]] of <math>A</math> on the diagonal`),
    preserved: C("e", "where <math>D</math> is a diagonal matrix containing the [[eigenvalues]] of <math>A</math> on the diagonal", null,
      [["v", "defined as the sum of its diagonal elements, is also the sum of all its eigenvalues:"], ["v", "* The [[determinant]] of {{tmath|A}} is the product of all its eigenvalues:"]]),
    broken: U("\"Original entries\" is a gloss; no source states it."),
  }),
  r("D2-050", 1, { j: "wikipedia-jordan-normal-form", m: "mathlib-Mathlib.LinearAlgebra.JordanChevalley" }, {
    name: C("j", "''J'' is called the '''Jordan normal form''' of ''A''."),
    description: I("j", "The diagonal form for [[diagonalizable]] matrices, for instance [[normal matrix|normal matrices]], is a special case of the Jordan normal form.", "Jordan blocks with the eigenvalue on the diagonal and 1 on the superdiagonal, as stated; but the form exists for every square matrix whose eigenvalues lie in the field, diagonalizable ones included, not only for non-diagonalizable ones.",
      [["j", "Such a matrix has each non-zero off-diagonal entry equal to&nbsp;1, immediately above the main diagonal"]]),
    input: C("j", "This condition is always satisfied if ''K'' is [[algebraically closed]]"),
    output: C("j", "So there exists an invertible matrix ''P'' such that ''P''<sup>−1</sup>''AP'' = ''J''"),
    preserved: C("j", "* Counting multiplicities, the eigenvalues of ''J'', and therefore of ''A'', are the diagonal entries.", null,
      [["j", "it is the number of Jordan blocks corresponding to ''λ''<sub>''i''</sub>."], ["j", "is its [[algebraic multiplicity]]."], ["j", "gives a decomposition of the ''n'' dimensional Euclidean space into invariant subspaces of ''A''."]]),
    broken: X("j", "* ''A'' is diagonalizable if and only if, for every eigenvalue ''λ'' of ''A'', its geometric and algebraic multiplicities coincide. In particular, the Jordan blocks in this case are {{val|1|×|1}} matrices; that is, scalars.",
      "Diagonalizability is not broken: A is diagonalizable exactly when its Jordan form is diagonal. The original basis is replaced (J represents the operator in another basis).", [["j", "with respect to some [[Basis (linear algebra)|basis]]."]]),
  }),
  r("D2-052", 1, { s: "wikipedia-schur-decomposition" }, {
    name: C("s", "the '''Schur decomposition''' or '''Schur triangulation'''"),
    description: I("s", "It allows one to write an arbitrary complex square matrix as [[Matrix similarity|unitarily similar]] to an [[Upper-triangular matrix|upper triangular matrix]] whose diagonal elements are the eigenvalues of the original matrix.", "A = U T U* with the eigenvalues on the diagonal of T, as stated; no window says the decomposition is numerically stable (the source says it is computed by the QR algorithm).",
      [["s", "The Schur decomposition of a given matrix is numerically computed by the [[QR algorithm]] or its variants."]]),
    input: C("s", "It allows one to write an arbitrary complex square matrix"),
    output: C("s", "for some [[unitary matrix]] ''Q'' (so that the inverse ''Q''<sup>−1</sup> is also the [[conjugate transpose]] ''Q''* of ''Q''), and some [[upper triangular matrix]] ''U''."),
    preserved: C("s", "Since ''U'' is [[similar (linear algebra)|similar]] to ''A'', it has the same [[Spectrum of a matrix|spectrum]]", null, [["s", "[[Matrix similarity|unitarily similar]]"]]),
    broken: U("\"Original structure\" is a gloss; no source states it."),
  }, ["description"], { mathlib: "Searched Schur, triangulation and IsUpperTriangular: Mathlib has the determinant and characteristic polynomial of triangular matrices, but no Schur decomposition at the pin." }),
  r("D2-053", 1, { s: "wikipedia-schur-decomposition" }, {
    name: C("s", "There is also a real Schur decomposition."),
    description: I("s", "A quasi-triangular matrix is a matrix that when expressed as a block matrix of {{math|''2'' × ''2''}} and {{math|''1'' × ''1''}} blocks is triangular.", "Real arithmetic and a quasi-triangular T with 2 by 2 blocks, as stated; that the 2 by 2 blocks carry the complex conjugate eigenvalue pairs is not in a fetched window.",
      [["s", "where {{mvar|Q}} is an [[orthogonal matrix]] and {{mvar|H}} is either upper or lower quasi-triangular."]]),
    input: C("s", "If {{mvar|A}} is an {{math|''n'' × ''n''}} [[square matrix]] with [[real numbers|real]] entries, then ''A'' can be expressed as"),
    output: C("s", "<math display=\"block\"> A = Q H Q^{-1}</math>", "Q is orthogonal, so its inverse is its transpose.", [["s", "where {{mvar|Q}} is an [[orthogonal matrix]]"]]),
    preserved: U("No fetched window states that real eigenvalues sit on the diagonal and complex pairs in the 2 by 2 blocks."),
    broken: U("\"Complex arithmetic\" is a gloss on what the real form avoids; no source states it."),
  }, ["description"], { mathlib: "Searched as for D2-052: no real Schur form at the pin." }),
  r("D2-054", 1, { s: "wikipedia-schur-decomposition" }, {
    name: C("s", "The generalized Schur decomposition is also sometimes called the '''QZ decomposition'''."),
    description: C("s", "Given square matrices ''A'' and ''B'', the '''generalized Schur decomposition''' factorizes both matrices", null, [["s", R`<math>A\mathbf{x}=\lambda B\mathbf{x}</math>`]]),
    input: C("s", "Given square matrices ''A'' and ''B''"),
    output: C("s", "where ''Q'' and ''Z'' are [[unitary matrix|unitary]], and ''S'' and ''T'' are [[upper triangular]].", "A = Q S Z* gives S = Q* A Z, and likewise T = Q* B Z."),
    preserved: C("s", "can be calculated as the ratio of the diagonal elements of ''S'' to those of ''T''."),
    broken: U("\"Individual matrix structure\" is a gloss; no source states it."),
  }, [], { mathlib: "Searched generalized Schur and matrix pencils: none at the pin." }),
];

// The URL each excerpt file was windowed from (its header's URL line).
const URLS = {
  "mathlib-Mathlib.Analysis.InnerProductSpace.GramSchmidtOrtho": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Analysis/InnerProductSpace/GramSchmidtOrtho.lean",
  "mathlib-Mathlib.Analysis.InnerProductSpace.Projection.FiniteDimensional": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Analysis/InnerProductSpace/Projection/FiniteDimensional.lean",
  "mathlib-Mathlib.Analysis.Matrix.LDL": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Analysis/Matrix/LDL.lean",
  "mathlib-Mathlib.Analysis.Matrix.Spectrum": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Analysis/Matrix/Spectrum.lean",
  "mathlib-Mathlib.Analysis.Normed.Affine.AddTorsor": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Analysis/Normed/Affine/AddTorsor.lean",
  "mathlib-Mathlib.Analysis.Normed.Affine.Isometry": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Analysis/Normed/Affine/Isometry.lean",
  "mathlib-Mathlib.Geometry.Euclidean.Angle.Oriented.Rotation": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Geometry/Euclidean/Angle/Oriented/Rotation.lean",
  "mathlib-Mathlib.Geometry.Euclidean.Angle.Unoriented.Affine": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Geometry/Euclidean/Angle/Unoriented/Affine.lean",
  "mathlib-Mathlib.Geometry.Euclidean.Angle.Unoriented.Basic": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Geometry/Euclidean/Angle/Unoriented/Basic.lean",
  "mathlib-Mathlib.Geometry.Euclidean.Projection": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Geometry/Euclidean/Projection.lean",
  "mathlib-Mathlib.LinearAlgebra.AffineSpace.AffineMap": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/LinearAlgebra/AffineSpace/AffineMap.lean",
  "mathlib-Mathlib.LinearAlgebra.JordanChevalley": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/LinearAlgebra/JordanChevalley.lean",
  "mathlib-Mathlib.LinearAlgebra.Matrix.Transvection": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/LinearAlgebra/Matrix/Transvection.lean",
  "mathlib-Mathlib.LinearAlgebra.Projectivization.Basic": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/LinearAlgebra/Projectivization/Basic.lean",
  "mathlib-Mathlib.Logic.Function.Basic": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Logic/Function/Basic.lean",
  "nlab-fourier-mukai-transform": "https://ncatlab.org/nlab/source/Fourier-Mukai+transform",
  "wikipedia-affine-transformation": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1369617920",
  "wikipedia-block-lu-decomposition": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1383393985",
  "wikipedia-cholesky-decomposition": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1371639196",
  "wikipedia-collineation": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1379256919",
  "wikipedia-cross-ratio": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1380801487",
  "wikipedia-eigendecomposition-of-a-matrix": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1375469145",
  "wikipedia-eigenvalues-and-eigenvectors": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1384631874",
  "wikipedia-fourier-mukai-transform": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1354517967",
  "wikipedia-homothety": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1356815044",
  "wikipedia-involution-mathematics": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1372904372",
  "wikipedia-jordan-normal-form": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1374766194",
  "wikipedia-lu-decomposition": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1380927710",
  "wikipedia-orientation-vector-space": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1342638631",
  "wikipedia-qr-decomposition": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1377367532",
  "wikipedia-rank-factorization": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1310010178",
  "wikipedia-reflection-mathematics": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1380109823",
  "wikipedia-rotation-mathematics": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1378041656",
  "wikipedia-scaling-geometry": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1316810640",
  "wikipedia-schur-decomposition": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1381324233",
  "wikipedia-translation-geometry": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1379247508",
};

const DOMAINS = {
};

const REVIEW = ROWS.map((g) => ({ ...g, files: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, `excerpts/${b}.txt`])),
  sources: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, URLS[b] ?? null])) }));

module.exports = { REVIEW, DOMAINS };
