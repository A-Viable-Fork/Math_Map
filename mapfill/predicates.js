// Role: hypotheses as predicates. What an entry requires of its input, and what it establishes, keeps or destroys
//   in its output, as rows over a declared predicate vocabulary, each row with one receipt; implications among
//   the predicates; and counterexamples tied to the hypothesis they defeat.
// Contract: exports PREDICATES, IMPLIES, PINS, HYPOTHESES, COUNTEREXAMPLES, CHAINS and HELD.
//   PREDICATES = [{ id, carrier, definition }]: carrier is a kind in mapfill/invariants.js CARRIERS; the definition
//     is authored here and says what the id means in the rows.
//   IMPLIES = [{ from, to, basis }]: basis is exactly one of receipts ([{ file, quote }], a file under excerpts/),
//     definitional (a sentence: the implication is read off the two definitions above) or own ({ entry, field,
//     phrase }: an entry's own words). Acyclic. Holding flows forward along it; destruction flows backward.
//   HYPOTHESES = [{ entry, name, role, predicate, claim?, given?, ambient?, note?, and exactly one of receipts,
//     formal, own }]. role: requires (the step needs the predicate of its input), establishes (the output has it),
//     keeps (it survives the step when it held), destroys (the output lacks it), silent (the entry was read and
//     says nothing on it: a recorded silence, apart from a row nobody wrote).
//     receipts = [{ file, quote }]: verbatim windows under excerpts/ or source/.
//     formal = { decl, quote, at? }: decl is a Mathlib declaration the entry is linked to in mapfill/formal.js;
//       the quote occurs in that declaration's statement window, or, with at, in the named
//       excerpts/mathlib-context-*.txt file of the declaration's own source file at the pin (a `variable` line the
//       declaration inherits). ambient lists the declaration's other premises as read at the pin, the ones no row
//       carries: text for the reader, unchecked, and never a claim that the premise list is complete.
//     own = { field, phrase }: the entry's own words, as overlaid: a phrase of its description, input, output,
//       preserved, broken, conditions or counterexamples. The row is then only as good as that field.
//     claim = { field, phrase }: the row guards that one claim of the entry, and failing it fails the claim, not
//       the step. given = [predicate]: an establishes or keeps row that holds only when these held on entry.
//   PINS = { "ID.field": the first 12 hex digits of the SHA-256 of that field's overlaid text }: every field a row
//     quotes by own or claim is pinned. A changed field makes its rows stale and the gate fail, until the rows are
//     read again and the pin renewed (`node scripts/predicates.mjs --pins` prints the current table).
//   COUNTEREXAMPLES = [{ entry, name, drops, claim?, witness, and one of receipts or own }]: what goes wrong when
//     the requires row on (entry, drops) is not met. A chain prints it beside the unmet requirement.
//   CHAINS = [{ steps, given, expect, why }]: chains the gate runs, each with the verdict it must give (met,
//     unknown or violated).
//   HELD = [{ row, entry, why, closes }]: rows of the schema survey's first pilot
//     (docs/schema-survey/pilots/p1-predicates.rows.json) that did not land, each with what would land it.
//   Checked by `node scripts/predicates.mjs --check`; used by scripts/compose.mjs.
// Invariant: data only. A row never edits an entry. A row lands under the strict rule [ruling: operator,
//   2026-11-13]: its quote states the row itself, every part. A predicate in a chain belongs to "the object the
//   chain carries": rows do not yet bind predicates to operands (mu and nu in D6-117), so a step with two operands
//   is judged as if it had one.
"use strict";

const P = (id, carrier, definition) => ({ id, carrier, definition });
const PREDICATES = [
  P("compact", "space", "every open cover has a finite subcover"),
  P("noncompact", "space", "some open cover has no finite subcover"),
  P("locally-compact", "space", "every point has a compact neighbourhood"),
  P("hausdorff", "space", "distinct points have disjoint neighbourhoods"),
  P("nonempty", "space", "has a point"),
  P("closed-riemannian-manifold", "manifold", "a compact Riemannian manifold without boundary"),
  P("euclidean-points", "point-cloud", "the points lie in a Euclidean space, with its metric"),
  P("good-cover", "point-cloud", "every nonempty intersection of the balls around the points is contractible"),
  P("domain", "ring", "a nontrivial commutative ring with no zero divisors"),
  P("field", "ring", "a nontrivial commutative ring in which every nonzero element is a unit"),
  P("noetherian", "ring", "every ideal is finitely generated"),
  P("ufd", "ring", "a domain with unique factorization"),
  P("nontrivial", "ring", "0 differs from 1"),
  P("fg-algebra-over-field", "algebra", "a finitely generated commutative algebra over a field"),
  P("perfect-field", "algebraic-field", "every irreducible polynomial over it is separable"),
  P("algebraically-closed", "algebraic-field", "every nonconstant polynomial over it has a root"),
  P("char-zero", "algebraic-field", "characteristic zero"),
  P("finite-dimensional", "vector-space", "of finite dimension over its field"),
  P("sigma-finite", "measure", "the space is a countable union of sets of finite measure"),
  P("s-finite", "measure", "a countable sum of finite measures"),
  P("exponential-growth", "function", "bounded by C e^{at} on the half line"),
  P("reflective-subcategory", "category", "a full subcategory whose inclusion has a left adjoint, the reflector"),
  P("lex-reflector", "category", "a reflective subcategory whose reflector preserves finite limits"),
  P("subtopos", "category", "a full subcategory of a topos whose inclusion is a geometric embedding"),
  P("complete-category", "category", "has all small limits"),
  P("weak-sheafify", "category", "sheafification exists for this coefficient category on the site"),
  P("geometric-morphism", "morphism", "an adjoint pair between toposes whose left adjoint preserves finite limits"),
  P("geometric-embedding", "morphism", "a geometric morphism with fully faithful direct image"),
  P("essential", "morphism", "the inverse image has a further left adjoint"),
  P("smooth-projective-surface", "variety", "a smooth projective variety of dimension two"),
  P("minus-one-curve", "curve", "a smooth rational curve of self-intersection -1 on the surface"),
  P("finite-family", "set", "the indexing family is finite"),
  P("pairwise-coprime", "ideal", "each two ideals of the family sum to the whole ring"),
  P("excessive-h", "function", "h is excessive for the process"),
  P("harmonic-h", "function", "h is harmonic for the process"),
];

const CTX = (m) => `excerpts/mathlib-context-Mathlib.${m}.txt`;
const NLAB_REFLECTIVE = "excerpts/nlab-reflective-subcategory.txt";
const IMPLIES = [
  { from: "field", to: "domain", receipts: [{ file: CTX("Algebra.Field.Basic"), quote: "instance (priority := 100) Field.isDomain : IsDomain K :=" }] },
  { from: "closed-riemannian-manifold", to: "compact", definitional: "closed means compact and without boundary" },
  { from: "sigma-finite", to: "s-finite", receipts: [{ file: CTX("MeasureTheory.Measure.Typeclasses.SFinite"), quote: "instance (priority := 100) [SigmaFinite μ] : SFinite μ := by" }] },
  { from: "euclidean-points", to: "good-cover", own: { entry: "D4-048", field: "conditions", phrase: "as for balls in Euclidean space (they are convex)" } },
  { from: "geometric-embedding", to: "geometric-morphism", definitional: "a geometric embedding is a geometric morphism with one more property" },
  { from: "geometric-embedding", to: "lex-reflector", receipts: [{ file: NLAB_REFLECTIVE, quote: "If the categories are [[topos]]es then such embeddings are called [[geometric embedding]]s" }] },
  { from: "lex-reflector", to: "reflective-subcategory", receipts: [{ file: NLAB_REFLECTIVE, quote: "in addition preserves [[finite limits]], then the embedding is called _exact_" }] },
  { from: "subtopos", to: "lex-reflector", definitional: "a geometric embedding's inverse image is a left adjoint to the inclusion that preserves finite limits" },
  { from: "algebraically-closed", to: "perfect-field", receipts: [{ file: CTX("FieldTheory.IsAlgClosed.Basic"), quote: "noncomputable instance (priority := 100) perfectField [IsAlgClosed k] : PerfectField k := by" }] },
];

// The fields the rows below quote by own or by claim, pinned. Renew with `node scripts/predicates.mjs --pins`.
const PINS = {
  "D2-051.input": "b62c46973b7b",
  "D2-075.input": "69dc361290f8",
  "D4-048.conditions": "f5efb7406620",
  "D4-048.preserved": "e31c32f209f7",
  "D4-075.conditions": "b019337d4c85",
  "D4-075.counterexamples": "19a3fa63caa8",
  "D4-075.output": "11bb1c8bfd61",
  "D4-273.broken": "a352b9e13d9d",
  "D4-273.input": "9e2a7565bbcc",
  "D4-273.output": "3df924d8482b",
  "D4-312.preserved": "37bdb214b316",
  "D5-037.description": "831205eb4738",
  "D5-037.input": "425abc1f05e8",
  "D6-086.input": "19c6fe2a6a8c",
  "D7-068.conditions": "2e59058b4617",
  "D7-150.preserved": "4d53414d3a9a",
  "D7-284.broken": "75186133a33b",
  "D7-284.input": "86fbdd06c2d6",
  "D7-288.output": "0f275218971a",
  "D7-X02.input": "6b3130ff9b1e",
  "D7-X02.output": "48c6345b1d2b",
  "D7-X03.input": "09b47af232fc",
  "D7-X11.input": "4459783d7cc9",
  "D8-106.input": "126549b8e2df",
  "D8-106.output": "9698ebb2a9e4",
};

const own = (field, phrase) => ({ own: { field, phrase } });
const rc = (file, quote) => ({ receipts: [{ file, quote }] });
const fm = (decl, quote, ambient, at) => ({ formal: { decl, quote, ...(at ? { at } : {}) }, ambient });
const row = (role) => (predicate, how, extra = {}) => ({ role, predicate, ...how, ...extra });
const requires = row("requires"), establishes = row("establishes"), keeps = row("keeps"), destroys = row("destroys"), silent = row("silent");
const H = (entry, name, rows) => rows.map((r) => ({ entry, name, ...r }));

const LEBESGUE = "excerpts/mathlib-Mathlib.MeasureTheory.Measure.Decomposition.Lebesgue.txt";
const NERVE = "excerpts/wikipedia-nerve-complex.txt";
const CECH_CLAIM = { field: "preserved", phrase: "(nerve theorem, exact)" };
const CONE_CLAIM = { field: "output", phrase: "(contractible)" };
const NOETHER = ["exists_finite_inj_algHom_of_fg", "[Field k] [CommRing R] [Nontrivial R] [a : Algebra k R] [fin : Algebra.FiniteType k R]"];

const HYPOTHESES = [
  ...H("D4-273", "One-point compactification", [
    requires("locally-compact", own("input", "Non-compact locally compact Hausdorff space X")),
    requires("hausdorff", own("input", "Non-compact locally compact Hausdorff space X")),
    requires("noncompact", own("input", "Non-compact locally compact Hausdorff space X")),
    establishes("compact", own("output", "Compact space")),
    destroys("noncompact", own("broken", "Non-compactness")),
  ]),
  ...H("D4-176", "Hodge decomposition", [
    requires("closed-riemannian-manifold", rc("excerpts/wikipedia-hodge-theory.txt", "on a closed Riemannian manifold as a sum of three parts in the form")),
  ]),
  ...H("D4-312", "Product topology construction", [
    keeps("compact", own("preserved", "product of compact = compact"), { note: "Of a family: the product is compact when every factor is (Tychonoff)." }),
  ]),
  ...H("D4-075", "Cone construction", [
    requires("nonempty", own("conditions", "The contractibility claim needs X nonempty"), { claim: CONE_CLAIM,
      note: "For the landed formula. With the source's definition, which attaches the cylinder to a point, the cone of the empty space is a point and the claim needs nothing." }),
  ]),
  ...H("D4-048", "Cech complex construction", [
    requires("good-cover", rc(NERVE, "is either empty or contractible; equivalently: ''C'' is a [[good cover|good open cover]]), then <math>N(C)</math> is [[homotopy-equivalent]] to"), { claim: CECH_CLAIM }),
  ]),
  ...H("D8-106", "Johnson-Lindenstrauss transform", [
    requires("euclidean-points", own("input", "n points in R^d")),
    establishes("euclidean-points", own("output", "Points in R^k")),
  ]),
  ...H("D2-075", "Field of Fractions Construction", [
    requires("domain", own("input", "Integral domain R")),
    establishes("field", fm("FractionRing.field", "noncomputable instance field : Field (FractionRing A)", ["(A : Type*) [CommRing A]", "[IsDomain A]: the requires row on domain"])),
  ]),
  ...H("D7-150", "Polynomial Ring Extension", [
    keeps("noetherian", fm("Polynomial.isNoetherianRing", "[inst : IsNoetherianRing R] : IsNoetherianRing R[X]", ["R commutative, from the file's variables (the link's note)"])),
    keeps("domain", own("preserved", "domain property")),
    keeps("ufd", own("preserved", "UFD property")),
    destroys("field", fm("Polynomial.not_isUnit_X", "theorem not_isUnit_X : ¬IsUnit (X : R[X])", ["[Semiring R]", "[Nontrivial R]: the zero ring is no field either"])),
  ]),
  ...H("D2-080", "Noether Normalization", [
    requires("fg-algebra-over-field", fm(NOETHER[0], NOETHER[1], [], CTX("RingTheory.NoetherNormalization"))),
    requires("nontrivial", fm(NOETHER[0], "[Nontrivial R]", [], CTX("RingTheory.NoetherNormalization")), { note: "The entry does not state it; the declaration it is linked to does." }),
  ]),
  ...H("D2-051", "Jordan-Chevalley Decomposition", [
    requires("perfect-field", own("input", "over perfect field")),
    requires("finite-dimensional", own("input", "fin-dim space")),
  ]),
  ...H("D7-X11", "Cartan's criterion by the Killing form", [
    requires("field", own("input", "Finite-dimensional Lie algebra over a field of characteristic zero"), { note: "Of the base ring." }),
    requires("char-zero", own("input", "Finite-dimensional Lie algebra over a field of characteristic zero")),
    requires("finite-dimensional", own("input", "Finite-dimensional Lie algebra over a field of characteristic zero")),
  ]),
  ...H("D2-193", "Chinese Remainder Theorem Reduction", [
    requires("finite-family", fm("Ideal.quotientInfRingEquivPiQuotient", "[Finite ι]", ["{R : Type*} [CommRing R]"], CTX("RingTheory.Ideal.Quotient.Operations")), { note: "The entry does not state it; the declaration it is linked to does." }),
    requires("pairwise-coprime", fm("Ideal.quotientInfRingEquivPiQuotient", "(hf : Pairwise (IsCoprime on f))", ["{R : Type*} [CommRing R]", "[Finite ι]: the requires row on finite-family"])),
  ]),
  ...H("D2-188", "Adjoint Functor Construction", [
    requires("complete-category", fm("CategoryTheory.isRightAdjoint_of_preservesLimits_of_solutionSetCondition", "[HasLimitsOfSize.{w, w} D]",
      ["[PreservesLimitsOfSize.{w, w} G]", "(hG : SolutionSetCondition.{w} G)", "[LocallySmall.{w} D]"]), { note: "One of the conditions the entry's input leaves unnamed; the other three are properties of the functor and its solution sets." }),
  ]),
  ...H("D6-117", "Radon-Nikodym decomposition", [
    requires("s-finite", rc(LEBESGUE, "[SFinite μ] [SigmaFinite ν] : HaveLebesgueDecomposition μ ν"), { note: "Of mu." }),
    requires("sigma-finite", rc(LEBESGUE, "[SFinite μ] [SigmaFinite ν] : HaveLebesgueDecomposition μ ν"), { note: "Of nu, the reference measure." }),
  ]),
  ...H("D6-090", "Lebesgue decomposition", [
    requires("sigma-finite", rc("excerpts/wikipedia-lebesgue-decomposition.txt", "are [[sigma-finite measure|σ-finite]] [[signed measure]]s on <math>\\Sigma</math>, then there exist")),
    establishes("sigma-finite", rc("excerpts/wikipedia-lebesgue-decomposition.txt", "then there exist two uniquely determined σ-finite signed measures"), { note: "Of the two parts." }),
  ]),
  ...H("D6-086", "Laplace transform", [
    requires("exponential-growth", own("input", "with exponential growth bound")),
  ]),
  ...H("D7-068", "Reflective Subcategory Localization", [
    requires("reflective-subcategory", fm("CategoryTheory.Reflective", "class Reflective (R : D ⥤ C) extends R.Full, R.Faithful where /-- a choice of a left adjoint to `R` -/ L : C ⥤ D /-- `R` is a right adjoint -/ adj : L ⊣ R", [])),
    silent("lex-reflector", own("conditions", "A bare reflective subcategory need not.")),
  ]),
  ...H("D7-288", "Lawvere-Tierney Topology Closure", [
    establishes("subtopos", own("output", "Subtopos Sh_j(E)")),
  ]),
  ...H("D7-X02", "Inclusion of a subtopos", [
    requires("subtopos", own("input", "Subtopos Sh_j(E) of a topos E")),
    establishes("geometric-embedding", own("output", "Geometric embedding")),
  ]),
  ...H("D7-284", "Essential Geometric Morphism", [
    requires("geometric-morphism", own("input", "Geometric morphism f")),
    keeps("geometric-embedding", own("broken", "Nothing; it is extra structure"), { note: "The entry says nothing is broken, which covers every predicate; this row names the one a later step needs." }),
  ]),
  ...H("D7-X03", "Level of an essential inclusion", [
    requires("essential", own("input", "Essential geometric embedding")),
    requires("geometric-embedding", own("input", "Essential geometric embedding")),
  ]),
  ...H("D3-116", "Sheafification", [
    requires("weak-sheafify", fm("CategoryTheory.sheafificationAdjunction", "def sheafificationAdjunction [HasWeakSheafify J A] :", ["{C : Type u₁} [Category.{v₁} C] (J : GrothendieckTopology C)", "(A : Type u₂) [Category.{v₂} A]"])),
  ]),
  ...H("D7-290", "Sheafification", [
    requires("weak-sheafify", fm("CategoryTheory.sheafificationAdjunction", "def sheafificationAdjunction [HasWeakSheafify J A] :", ["{C : Type u₁} [Category.{v₁} C] (J : GrothendieckTopology C)", "(A : Type u₂) [Category.{v₂} A]"]),
      { note: "The entry states no condition; the declaration it is linked to does." }),
  ]),
  ...H("D2-118", "Blowing Down", [
    requires("smooth-projective-surface", rc("excerpts/wikipedia-castelnuovo.txt", "be a [[smooth variety|smooth]] [[algebraic surface|projective surface]]"), { note: "The source states the theorem over the complex numbers." }),
    requires("minus-one-curve", rc("excerpts/wikipedia-castelnuovo.txt", "a (&minus;1)-[[algebraic curve|curve]] on <math>X</math>")),
  ]),
  ...H("D5-037", "Doob h-transform", [
    requires("excessive-h", own("input", "excessive h")),
    requires("harmonic-h", own("input", "a harmonic h for a conservative transform"), { claim: { field: "description", phrase: "A harmonic h gives a conservative process" } }),
  ]),
];

const COUNTEREXAMPLES = [
  { entry: "D4-048", name: "Cech complex construction", drops: "good-cover", claim: CECH_CLAIM,
    witness: "Two contractible sets covering an n-sphere and meeting in a set that is not contractible: the nerve is a 1-simplex, not a sphere.",
    receipts: [{ file: NERVE, quote: "one can cover any [[N-sphere|''n''-sphere]] with two contractible sets <math>U_1</math> and <math>U_2</math> that have a non-empty intersection, as in example 1 above. In this case, <math>N(C)</math> is an abstract 1-simplex, which is similar to a line but not to a sphere." }] },
  { entry: "D4-075", name: "Cone construction", drops: "nonempty", claim: CONE_CLAIM,
    witness: "X empty: the landed quotient is the empty space, which is not contractible.",
    own: { field: "counterexamples", phrase: "X empty: the landed quotient is the empty space, which is not contractible." } },
];

// Chains the gate runs. The verdict is the worst over the chain's requirements: violated, then unknown, then met.
const CHAINS = [
  { steps: ["D2-075", "D7-150", "D2-075"], given: ["domain"], expect: "met", why: "fraction field, polynomial ring, fraction field: k(x). The polynomial ring destroys field and keeps domain." },
  { steps: ["D4-273", "D4-273"], given: ["locally-compact", "hausdorff", "noncompact"], expect: "violated", why: "compactify twice: the first step destroys the noncompactness the second requires" },
  { steps: ["D4-273", "D4-176"], given: ["locally-compact", "hausdorff", "noncompact"], expect: "unknown", why: "compactify, then decompose forms: compact is established, a closed Riemannian manifold is more" },
  { steps: ["D6-090", "D6-117"], given: [], expect: "unknown", why: "Lebesgue decomposition then Radon-Nikodym, nothing given" },
  { steps: ["D6-090", "D6-117"], given: ["sigma-finite"], expect: "met", why: "the same with sigma-finite given: s-finite follows by the implication" },
  { steps: ["D8-106", "D4-048"], given: ["euclidean-points"], expect: "met", why: "project by Johnson-Lindenstrauss, then build the Cech complex: balls in a Euclidean space form a good cover" },
  { steps: ["D4-048"], given: [], expect: "unknown", why: "the Cech complex of points in an unspecified metric space, read for homotopy type" },
  { steps: ["D7-068", "D7-X03"], given: ["reflective-subcategory"], expect: "unknown", why: "a bare reflector read as a level: neither essential nor a geometric embedding is established" },
  { steps: ["D7-288", "D7-X02", "D7-284", "D7-X03"], given: [], expect: "unknown", why: "a Lawvere-Tierney topology, its subtopos inclusion, read as a level: nothing establishes that the inclusion is essential" },
  { steps: ["D2-117", "D2-118"], given: [], expect: "unknown", why: "blow up any closed subvariety, then blow down: the blow-up has no rows yet" },
];

// Pilot rows that did not land. ids are the pilot's (R rows, X counterexamples, I implications).
const HELD = [
  { row: "R18", entry: "D2-072", why: "Establishes local-ring only when the multiplicative set is the complement of a prime: a condition on a parameter, which given (a predicate of the input) does not say.", closes: "Operand binding (the survey's binders step), or a predicate on the multiplicative set." },
  { row: "R23", entry: "D2-051", why: "Its receipt is reports/SECOND-READING.md, a model's reading, not a source.", closes: "A source window stating that a semisimple operator is diagonalizable over an algebraically closed field; the Mathlib conflict already recorded on the entry's output is the lead." },
  { row: "X03", entry: "D2-051", why: "The same receipt as R23.", closes: "A source window for the rotation of the real plane." },
  { row: "R35", entry: "D6-086", why: "Its receipt is a docs/inbound/ note, a proposal from another repository, not a source.", closes: "The Laplace formal links that note proposes, once verified at the pin." },
  { row: "R36", entry: "D6-073", why: "The same receipt as R35. Without it the Bromwich inversion has no row, so Laplace then inverse Laplace is not yet caught.", closes: "As R35." },
  { row: "X04", entry: "D6-086", why: "The same inbound note; and it drops a reading (two-way) that is not a declared predicate.", closes: "As R35, with the converse stated as a claim." },
  { row: "X06", entry: "D6-073", why: "The same inbound note.", closes: "As R35." },
  { row: "R38", entry: "D7-068", why: "The quote names the reflector; it does not say the subcategory stays reflective in the output.", closes: "A window, or a preserved clause on the entry, saying so." },
  { row: "R44", entry: "D7-284", why: "The entry takes any geometric morphism and returns the adjoint triple. Whether the further left adjoint is produced or presupposed, the entry does not say, and a subtopos inclusion is not essential in general: read as establishes, the row passes a Lawvere-Tierney subtopos as a level.", closes: "The operator's reading of the entry: a requires row on essential, or a condition in mapfill/conditions.js with a source window." },
  { row: "R52", entry: "D2-117", why: "No receipt: the exceptional curve of a point blown up on a smooth surface being a (-1)-curve was recalled. excerpts/wikipedia-blowing-up.txt does not state it.", closes: "A source window; this host cannot fetch Wikipedia." },
  { row: "R53", entry: "D2-117", why: "No receipt: recalled.", closes: "As R52." },
  { row: "X05", entry: "D2-193", why: "Authored from memory (the integers with all the ideals (p)), no source.", closes: "A source window, or a Lean proof in lean/." },
  { row: "I09", entry: null, why: "harmonic-h implies excessive-h: recalled.", closes: "A source window." },
];

module.exports = { PREDICATES, IMPLIES, PINS, HYPOTHESES, COUNTEREXAMPLES, CHAINS, HELD };
