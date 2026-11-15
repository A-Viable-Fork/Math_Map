// Role: the falsification hunt over the fill layer: the forty fills with the most specific claims (scripts/strict.mjs,
//   huntSelection), each attacked for a counterexample, a missing hypothesis, a wrong attribution or a convention
//   mismatch, with what was found.
// Contract: exports HUNT = { method, results: { id: { verdict, field?, finding, evidence, quotes? } } }. verdict is
//   holds, imprecise or wrong; field names the field a finding bears on; evidence is the claim's mark (read: a window
//   in excerpts/ states it, quoted; inferred: a derivation or counterexample given in the finding; recalled: from
//   memory, a lead for a later receipt, never the basis of a correction). Every quote occurs in its file
//   (scripts/strict.mjs). Every selected fill has a result.
// Invariant: data only. A finding here is a lead for a correction, never an edit to the fill; a correction still needs
//   its receipts and a prior finding (mapfill/corrections.js).
"use strict";

const Q = (f, q) => ({ file: `excerpts/${f}.txt`, quote: q });
const H = (finding) => ({ verdict: "holds", finding, evidence: "inferred" });
const F = (verdict, field, finding, evidence, quotes) => ({ verdict, field, finding, evidence, ...(quotes ? { quotes } : {}) });

const RESULTS = {
  "D5-073": H("Crandall and Fagin's weighted transform multiplies modulo 2^p - 1 without zero padding; exactness rests on the roundoff check the source names."),
  "D4-175": H("An L^2 kernel gives a compact operator with Hilbert-Schmidt norm the kernel's L^2 norm; the non-invertibility is stated, correctly, for infinite-dimensional spaces."),
  "D7-037": H("The zig-zag construction with formal inverses is Gabriel and Zisman's (1967); local smallness can fail."),
  "D7-213": F("imprecise", "description", "The inversion g(x) = sum over y <= x of f(y) iff f(x) = sum mu(y, x) g(y) needs every principal down-set {y <= x} finite, which local finiteness does not give: on the integers, locally finite, f = 1 makes every sum diverge. Rota states it with finite down-sets, or for functions of suitable support.", "inferred"),
  "D7-133": F("imprecise", "description", "A right ring of fractions R S^-1 needs S to be a right denominator set: right Ore (permutable) and right reversible (s a = 0 implies a t = 0 for some t in S). The fill names the Ore condition alone, which suffices only in a domain.", "recalled"),
  "D7-188": H("a => b is the largest c with c ^ a <= b, right adjoint to meet; not a v b <= a => b always, with equality failing in general, as the fill says."),
  "D7-364": F("imprecise", "preserved", "The minimal model P_infinity is the cobar construction on the Koszul dual cooperad (the linear dual of P!, suspended), not on the operad P! itself; Ginzburg and Kapranov write it as the dual dg operad D(P!). A convention slip; Com and Lie, Ass and Ass are right.", "recalled"),
  "D7-408": F("imprecise", "description", "Whitehead's lemmas need characteristic zero: the source's statement is for a finite-dimensional semisimple Lie algebra over a field of characteristic zero, and in characteristic p the first lemma fails (sl_2 has finite-dimensional modules with nonzero H^1). The fill omits the field and its characteristic.", "read",
    [Q("wikipedia-whiteheads-lemma-lie", "Let <math>\\mathfrak{g}</math> be a finite-dimensional, semisimple Lie [[algebra over a field]] of characteristic zero")]),
  "D7-255": H("Divided-power thickenings, W(k)-module values, Grothendieck with Berthelot: as the sources state."),
  "D8-106": H("Squared distances within 1 +- eps give distances within 1 +- eps; k = O(log n / eps^2) and the random construction are right."),
  "D7-117": F("imprecise", "preserved", "Inv(Pol(Gamma)) equals the relations pp-definable from Gamma for a structure on a finite domain (Geiger; Bodnarchuk, Kaluzhnin, Kotov, Romov), and for omega-categorical structures (Bodirsky and Nesetril); the fill states it for any relational structure.", "recalled"),
  "D7-161": H("Extensions of Q by an abelian N with a fixed action are classified by H^2(Q, N); splitting and uniqueness are what the class records."),
  "D7-296": H("Geometric morphisms into presheaves on C correspond to flat functors C to E; internal choice gives excluded middle. Both theorems as the fill states them."),
  "D7-341": H("Bicategories are biequivalent to strict 2-categories; tricategories strictify only to Gray-categories."),
  "D7-216": H("Objects with coboundaries of degree +1 and d d = 0."),
  "D7-231": H("R^n F(A) = H^n(F(I)) for an injective resolution, where enough injectives give one; the formula is right where it applies."),
  "D7-251": F("imprecise", "description", "H^1(G, M) is the crossed homomorphisms modulo the principal ones, not the crossed homomorphisms; the source states the quotient. Ext over Z[G] and H^2 classifying extensions are right.", "read",
    [Q("wikipedia-group-cohomology", "The first cohomology group is the quotient of the so-called ''crossed homomorphisms''")]),
  "D7-266": F("imprecise", "description", "The spectral sequence converges conditionally in general; strong convergence to h^{p+q}(X) needs more, such as X finite-dimensional. The fill says converges, for any CW complex.", "read",
    [Q("wikipedia-atiyah-hirzebruch-spectral-sequence", "converges conditionally to <math>E^{p+q}(X)</math>")]),
  "D7-276": H("Truncation triangle tau_{<=0} X to X to tau_{>=1} X and an abelian heart (Beilinson, Bernstein, Deligne)."),
  "D7-365": F("imprecise", "description", "Kelly and Mac Lane's coherence theorem for closed categories decides commutativity by graphs only for shapes free of the unit object (their constant-free condition); with the unit, graphs do not decide it. The fill states it without the restriction.", "recalled"),
  "D2-039": H("The region of convergence is an annulus, possibly degenerate; the region fixes the sequence."),
  "D7-019": H("C^B right adjoint to - x B, existing exactly when that right adjoint does; (-)^B preserves limits."),
  "D7-026": H("For presheaves the coend (F * G)(c) = integral^{a,b} C(c, a (x) b) x F a x G b has the right variance; the source's smallness hypothesis was recorded by the sweep."),
  "D7-033": H("Reflecting isomorphisms and creating coequalizers of G-split pairs gives monadicity (creation even gives an isomorphism, so an equivalence)."),
  "D7-036": H("Under a calculus of left fractions the localization preserves finite limits (Gabriel and Zisman); left and right conventions vary between authors."),
  "D7-063": H("Nat(F, G) = integral_c D(F c, G c) for locally small D."),
  "D7-093": H("The satisfaction condition is the institution's; mapping symbols to terms is the derived signature morphism, a variant the fill's wording allows."),
  "D7-119": F("imprecise", "description", "With the monotone condition the fill writes, f(a) <= b iff a <= g(b), g f is a closure operator but f g is a kernel (interior) operator: closure operators on each side hold only for the antitone half of the fill's \"or\". The source names the kernel operator.", "read",
    [Q("wikipedia-galois-connection-r", "known as the associated [[closure operator]], and {{math|''FG'' : ''B'' → ''B''}}, known as the associated kernel operator.")]),
  "D7-132": H("S^-1 R is exact; its primes are those disjoint from S; the kernel is the S-torsion."),
  "D7-218": H("d raises degree and d d = 0; on 0-forms d kills the locally constant functions."),
  "D7-220": H("ker d / im d, a graded ring under cup product for the cohomology of spaces."),
  "D7-246": H("HH^*(A) = Ext over A (x) A^op of (A, A) over a field (A projective over the ground ring in general); HH^1 outer derivations, HH^2 deformations, a Gerstenhaber algebra."),
  "D7-253": H("Leray's theorem: Cech cohomology of an acyclic cover computes sheaf cohomology."),
  "D7-261": H("E_2 = R^p G R^q F(A) converging to R^{p+q}(G F)(A) when F sends injectives to G-acyclics, with enough injectives."),
  "D7-318": H("Goedel-Gentzen and Kolmogorov translations; classical provability is reflected."),
  "D7-366": F("imprecise", "description", "An infinity-topos is an accessible left exact localization of presheaves on a small infinity-category (Lurie, Higher Topos Theory, 6.1.0.4); the fill drops accessibility, which the source carries as presentability.", "recalled",
    [Q("nlab-infinity-1-topos", "* $\\mathbf{H}$ is [[presentable (infinity,1)-category|presentable]];")]),
  "D8-016": H("(x^lambda - 1)/lambda with log x at 0, positive data, lambda by maximum likelihood."),
  "D8-131": H("Singh, Memoli and Carlsson (2007): cover the filter's range, cluster preimages, take the nerve."),
  "D2-028": H("The bilateral transform's strip, the Fourier transform on the imaginary axis, and the moment generating function at -s."),
  "D2-038": F("imprecise", "preserved", "Positive definiteness (Bochner) holds for positive measures only, and the input is any finite Borel measure: mu = -delta_0 gives mu-hat = -1, not positive definite. A convention mismatch beside it: with mu-hat(xi) = integral e^{-i x xi} d mu, the characteristic function of a probability measure is mu-hat(-xi), not mu-hat.", "inferred"),
};

const HUNT = {
  method: "The forty fills (distinct homes counted once) with the highest specificity score: one point per formula mark (=, ^, <, >, a numeral, O(, sqrt, log, sum, integral, mod), two per named theorem or parenthesized attribution, per stated hypothesis (when, if, iff, unless, over a, for a finite or compact or semisimple or ..., in characteristic) and per year or pair of names; ties broken by id (scripts/strict.mjs, huntSelection). Each was attacked for a counterexample, a missing hypothesis, a wrong attribution and a convention mismatch.",
  results: RESULTS,
};

module.exports = { HUNT };
