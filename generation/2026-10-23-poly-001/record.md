---
Kind: expression
Author: an agent session, on the operator's commission
Commission: the operator's go-ahead of 2026-10-23 to resume the Mathlib ingest with a graded generation round for polynomials (Research_OS `HANDOFF.md`, branch `claude/project-thread-sgnmlm`); questions fixed in `preregistration.md`
Date: 2026-10-23
---

# Generation: the operations inside the polynomial ring (POLY-001)

## Reaching for

The map holds R[X] as one operation, the ring construction, and nothing done with a polynomial once it exists. Mathlib's polynomial library is mostly about those inner operations: degree, coefficients, evaluation, the derivative, roots. Each question below is a Mathlib definition that many clean-to-D7-150 lemmas name; I want one entry per operation, typed so that a lemma about degree reads as degree applied inside the ring construction, a composite, rather than as the construction itself. Written from what I know of the mathematics and of Mathlib's conventions, before reading the source at the pin.

## Seeds

D7-150 (Polynomial Ring Extension: preserves Noetherian, domain, UFD; breaks field). D2-164 Pseudodivision and D8-159 Polynomial factorization, which act on polynomials but are algorithms, not the definitions asked for. D6-028 Derivative operator, the analytic derivative; the formal one is its algebraic shadow and differs in characteristic p. D7-154 Splitting Field Construction, which builds the field over which a polynomial splits; Q9 asks for the test, not the construction.

## Candidates

Ids are assigned at landing.

1. **Degree of a polynomial** (Q1). Transformer; tags projection.
   - description: Assigns to a polynomial the largest exponent whose coefficient is nonzero. The zero polynomial has degree minus infinity (`degree` takes values in WithBot ℕ); `natDegree` is the same with the zero polynomial sent to 0.
   - input: Polynomial p in R[X], R a semiring
   - output: degree p in ℕ ∪ {-∞}, or natDegree p in ℕ
   - preserved: deg(p + q) ≤ max(deg p, deg q); deg(pq) = deg p + deg q when R has no zero divisors; deg(p ∘ q) = deg p · deg q over a domain
   - broken: The polynomial itself (degree forgets all but one exponent); over a ring with zero divisors deg(pq) can be less than deg p + deg q
   - complexity: Linear in the number of terms

2. **Coefficient extraction** (Q2). Transformer; tags projection, decomposition.
   - description: Reads the coefficient of X^n in p. A polynomial is determined by its coefficients, finitely many of which are nonzero; the exponents where they are nonzero form its support, a finite set.
   - input: Polynomial p in R[X], exponent n
   - output: coeff p n in R; support p, a finite set of naturals
   - preserved: Additivity: coeff (p + q) n = coeff p n + coeff q n, and coeff is R-linear in p; two polynomials with the same coefficients are equal; the coefficient of a product is the convolution sum over i + j = n
   - broken: Multiplicativity: coeff (pq) n is not coeff p n · coeff q n
   - complexity: Constant per coefficient

3. **Leading coefficient** (Q3). Transformer; tags projection.
   - description: The coefficient of the highest power present, coeff p (natDegree p). A polynomial is monic when its leading coefficient is 1. Erasing the leading term leaves eraseLead p, of smaller degree, with p = eraseLead p + (leading term).
   - input: Polynomial p in R[X], R a semiring
   - output: leadingCoeff p in R; whether p is monic; eraseLead p in R[X]
   - preserved: Multiplicative over a ring without zero divisors: lc(pq) = lc p · lc q; a product of monic polynomials is monic over any semiring; lc 0 = 0
   - broken: Additivity: lc(p + q) need not be lc p + lc q (cancellation of the top terms)
   - complexity: Linear in the number of terms

4. **Change of coefficient ring** (Q4). Transformer; tags representation-change.
   - description: Applies a ring homomorphism f: R → S to every coefficient, giving a ring homomorphism map f: R[X] → S[X] that sends X to X.
   - input: Ring homomorphism f: R → S, polynomial p in R[X]
   - output: map f p in S[X]
   - preserved: It is a ring homomorphism; it commutes with evaluation, eval (f a) (map f p) = f (eval a p); with the derivative; and with composition; degree is preserved when f is injective
   - broken: Degree can drop when f kills the leading coefficient; irreducibility is not preserved (X^2 + 1 over the reals factors over the complexes)
   - complexity: Linear in the number of terms

5. **Evaluation of a polynomial** (Q5). Transformer; tags projection, algebra-bridge.
   - description: Substitutes a value for X. eval₂ f x p = Σ f(a_i) x^i along a ring homomorphism f: R → S at x in S; eval x p takes f the identity; aeval x is the R-algebra homomorphism R[X] → A sending X to x, the universal property of R[X] as the free commutative R-algebra on one generator.
   - input: Polynomial p in R[X]; a point x in S (or in an R-algebra A); for eval₂, a ring homomorphism f: R → S
   - output: The value p(x) in S (or A)
   - preserved: eval₂ f x is a ring homomorphism when S is commutative; aeval x is the unique R-algebra homomorphism sending X to x
   - broken: The polynomial is lost: distinct polynomials can define the same function (X^p and X over the field with p elements)
   - complexity: Linear in the degree (Horner's rule)

6. **Formal derivative** (Q6). Transformer; tags local.
   - description: Sends Σ a_i X^i to Σ i·a_i X^(i-1), defined by the formula and with no limit.
   - input: Polynomial p in R[X], R a semiring
   - output: derivative p in R[X]
   - preserved: R-linearity; the Leibniz rule (pq)' = p'q + pq'; the chain rule (p ∘ q)' = (p' ∘ q) · q'
   - broken: Degree drops by one in characteristic zero; in characteristic p, (X^p)' = 0, so p' = 0 does not make p constant; a multiple root of p is a root of both p and p'
   - complexity: Linear in the number of terms

7. **Roots with multiplicity** (Q7). Transformer; tags decomposition.
   - description: For p over a commutative domain, the multiset of its roots, each counted with its multiplicity: the largest n such that (X - a)^n divides p. IsRoot p a says p(a) = 0.
   - input: Polynomial p in R[X], R a commutative ring without zero divisors
   - output: roots p, a finite multiset of R; rootMultiplicity a p in ℕ
   - preserved: The number of roots, with multiplicity, is at most natDegree p; roots (pq) = roots p + roots q when pq ≠ 0; a is a root iff X - a divides p (the factor theorem)
   - broken: roots 0 is empty by convention; a polynomial that does not split has fewer roots than its degree
   - complexity: Not computable in general; over a finite or decidable field, by search

8. **Composition of polynomials** (Q8). Transformer; tags composition.
   - description: Substitutes q for X in p: p ∘ q = Σ a_i q^i, evaluation of p at q in the ring R[X].
   - input: Polynomials p, q in R[X]
   - output: p.comp q in R[X]
   - preserved: Associative, with X a two-sided identity; eval x (p ∘ q) = eval (eval x q) p; additive and multiplicative in p: (p + r) ∘ q = p ∘ q + r ∘ q, (pr) ∘ q = (p ∘ q)(r ∘ q) over a commutative ring; deg(p ∘ q) = deg p · deg q over a domain
   - broken: Not additive in q: p ∘ (q + s) is not p ∘ q + p ∘ s
   - complexity: Polynomial in the degrees

9. **Splitting of a polynomial** (Q9). Correspondence; tags decomposition.
   - description: Tests whether p splits along a ring homomorphism i: K → L of fields: i(p) is zero or every irreducible factor of i(p) has degree one; equivalently i(p) is a constant times a product of linear factors.
   - input: Field homomorphism i: K → L, polynomial p in K[X]
   - output: Whether p splits over L
   - preserved: Splitting persists along any further homomorphism L → M; a product splits iff each factor does; when p splits, its degree equals the number of roots of i(p) with multiplicity
   - broken: Nothing
   - complexity: Not computable in general

## Against the obvious

Every candidate is the obvious version: these are textbook definitions, and the round asks for them so the map can say what Mathlib's lemmas are about. Novelty is not the aim. Two places where I expect the source to differ from the textbook: Mathlib states many polynomial facts over semirings, wider than the rings I wrote; and Mathlib's `Splits` was defined through irreducible factors of degree one, which may have changed.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1 to 9 | grading | conjecture (each field a claim) | an existing entry already the operation; no defining declaration at `380f2aa`; a field the source contradicts |
