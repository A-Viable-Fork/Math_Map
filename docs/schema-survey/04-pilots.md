# Six disposable pilots

Date: 2026-11-13. Kind: utility, with source readings marked read, proposed rows marked generation, and findings bounded by the checks below. The production parser, schema, source and mapfill data are unchanged.

## Reproduce

```sh
PYTHONDONTWRITEBYTECODE=1 python docs/schema-survey/pilots/make_pilots.py
PYTHONDONTWRITEBYTECODE=1 python docs/schema-survey/pilots/run_pilots.py
```

The second command accepts `--pilot C02`, C23, C15, C30, C33 or C53. A filtered run writes only its own result; run without a filter for the complete results file. Python 3.12.14, NumPy 2.3.5, SciPy 1.17.0 and SymPy 1.14.0 were available in this session. These are disposable research tools, outside the production build. Source and row checks are local tripwires, not independent authorities.

Read/check: [pilots/results.json](pilots/results.json) records 103 rows on 73 distinct real entry ids, with 152 deduplicated quote/hash/offset receipts. Each pilot has 16 to 20 distinct entries. Several mathematical operations have multiple domain views; entry counts are not counts of independent operations or independent evidence. Fixtures and proposed alignments are generation. Every row retains the production entry's existing evidence levels.

## What was checked

| Candidate | Rows and file | Receipt and structural checks | Bounded computation or diagram | Universal mathematical proofs / behavioral tests |
|---|---|---|---|---|
| C02, scoped predicates | [16](pilots/C02.json) | 16/16; three fact states and an ill-typed input per guard | 16/16 guard evaluations from supplied fixture facts; no mathematical operand certification | 0; ambient theorem assumptions remain obligations |
| C23, intertwinings | [17](pilots/C23.json) | 17/17 | 17/17 bounded rational, symbolic or floating-point rule checks | 0 new universal proofs |
| C15, inverse edges | [16](pilots/C15.json) | 16/16 | 16/16 finite-model inverse/round-trip trials | 0 new universal inverse proofs |
| C30, realizations | [16](pilots/C30.json) | 16/16 contract fingerprints and source-envelope checks | 0/16 behavior checks; static drift controls only | 0 device/host tests; original unknown/not-observable contract assurance retained |
| C33, translation loss | [18](pilots/C33.json) | 18/18 proposed alignment bookkeeping checks | 17 reused C23 computations plus one exact recurrence comparison, including its discrepancy | 0/18 natural-language meaning proofs; 0 general code-refinement proofs |
| C53, atlas transitions | [20](pilots/C53.json) | 20/20 membership, domain-record and receipt checks | 8/20 finite transition/diagram views checked; 6 lossy and 6 missing-witness rows | 0 global cocycle or universal transport proofs |

Read/check: receipt occurrence is not entailment. Some rows quote a primary theorem or code definition; some quote existing map definitions or generated binding claims. In the latter case the receipt establishes what was written, and the bounded experiment is the additional evidence. The row builder labels those receipts explicitly. A sourced-looking record is not automatically a verified mathematical row.

## C02: conditions become explicit obligations

Generation: sixteen rows select one scoped hypothesis each, rather than claiming to formalize an entire entry. They include a (-1)-curve, existence of sheafification, a good cover, a nonempty cone base, a closed manifold, the particular Brownian h(x)=x case, the regular-Borel refinement, sigma-finiteness, finite-limit preservation, and seven polynomial-law guards.

Check: a present true fixture satisfies that guard; a false fixture violates it; missing or ill-typed facts return unknown. Satisfied does not mean the complete theorem is applicable. For example the Radon-Nikodym row checks SigmaFinite(nu), while SFinite(mu) remains an explicit ambient obligation.

Caught beyond the current reader: `compose(D2-118,D2-117)` has no obligation output. The sidecar refuses its contraction step for a supplied self-intersection of -2. A second concrete witness, `(2X)^2=0` in `(Z/4)[X]`, violates the leading-coefficient guard behind a degree-product equality. The current entry prose can state a condition while composition cannot evaluate it.

Verdict: **confirmed worth keeping** as a small fail-closed obligation mechanism. General theorem applicability, inference of operand facts and compound predicate reasoning remain **needs refinement**.

## C23: useful rules rather than preserved labels

Generation: nine polynomial rules, DFT convolution, FFT realization of DFT, graph transpose, complement/clique duality, translation/difference, positive-log/product, Mobius composition and Walsh/XOR convolution. Their equations, domains and receipts are in the sidecar. This is a narrow dictionary, not a migration of every preserved/broken field.

Check: polynomial computations run over the named rings and examples. DFT/XOR convolution trials enumerate all binary length-four inputs, with numerical FFT tolerance stated in the runner. Complement tests enumerate all graphs and vertex subsets on three vertices. Finite computation verifies these workloads, not the infinite family of workloads.

Caught beyond carrier matching: truncating linear convolution disagrees with circular convolution; transpose reverses multiplication order; normalized Walsh convolution needs a scale factor; Mobius matrix composition has an order. Four explicit negative controls fail the wrong rule. All these routes can have matching carrier names while their equations differ.

Verdict: **confirmed worth keeping** for narrow, fully specified rules. New infinite-dimensional analytic rules require complete hypotheses and independent proofs or strict source readings.

## C15: reverse routes with restrictions

Generation: sixteen entry views on graph reversal/complement, permutation reverse-complement, translations, reflections, rotations, a Mobius map, Walsh-Hadamard and the one-qubit Hadamard gate. Parameters transform explicitly: negate a displacement or angle, take an adjugate, or divide the unnormalized Walsh matrix by N. The gate and signal transform retain their distinct entry identities.

Check: both round trips are checked in the declared finite models. A small route graph containing only forward edges cannot answer output-to-input; adding the scoped inverse row supplies that reverse edge. This graph is the throwaway enabled-function demonstration. The production map has no typed inverse-route query to run as a baseline.

Caught boundary: the first runner attempted the inverse Mobius map at z=1 and encountered its pole. The corrected trial excludes that point explicitly and records the denominator-zero control. A singular matrix and an unscaled Walsh inverse are also negative controls. This is why domain and normalization travel with the edge.

Verdict: **plausible**. Finite inverse trials are useful, but many receipts here are map definitions plus generated finite calculations. Universal inverse laws and restricted-image witnesses need strict receipts before a production route can claim them.

## C30: realizations and drift

Generation: sixteen public platform-binding rows, eight Android and eight NixOS, re-enveloped without upgrading their existing assurance. Each has the source pin, operation reference, departures, unestablished invariants and a conservative survey contract fingerprint. Code, external-proof and checkpoint branches of a general envelope are not piloted here; their private records stay outside this repository.

Check: all sixteen fingerprints match. An injected input change or vocabulary change invalidates them; an evidence-grade-only change does not. The fingerprint includes entry semantics and the entire vocabulary/context rule set, deliberately overinvalidating rather than pretending to have a precise dependency closure. Foreign proof definitions and runtime state remain outside this trial digest.

Read/check: X28 and X29 still have no Android or NixOS binding in these inputs. The pilot does not invent one. The current generated source hashes are read from their registry, not reproduced from every upstream file again. All behavior checks remain absent.

Verdict: **plausible** for a realization envelope; **confirmed** for the utility of contract drift detection under a declared hash algorithm. A full uniform proof/code/model/world schema needs variant-specific evidence rules and further pilots.

## C33: translation loses information at particular arrows

Generation: the seventeen rule rows plus D6-060 receive math/code/language cards. Code is the generated finite implementation in this pilot. Language is the actual five entry fields, with manually proposed span interpretations. Each arrow states retained information, loss and the narrower computational domain.

Check: nine proposed round trips cannot recover all required information without inventing it. The checker computes that result from supplied alignments; it does not discover or prove the semantics of English. The nine polynomial cards retain the chosen rule/guard information under their proposed alignment; this is also not an automatic semantic certificate.

Inferred finding held as **needs refinement**: D6-060 writes a recursive normalized-block formula without specifying the normalization of the inner H_(N/2). With H1=1 and the same normalization applied recursively, H4 has Gram matrix I/2; conventional normalized Sylvester H4 has Gram matrix I. Both are computed exactly. A reading in which inner blocks are unnormalized differs. The survey records a convention ambiguity, leaves the entry untouched and makes no correction ruling.

Verdict: **needs refinement**. Loss accounting earns a place in the design. Alignment semantics, structured formula parsing and independently checked round trips are still owed.

## C53: charts, overlaps and the point where transport stops

Generation: twenty real members of six existing clusters. The three Legendre views are restricted to the quadratic family f(x)=a*x^2 with a>0. The three Galois/closure views use one finite monotone adjunction, restricted to fixed points. Two graph/module tensor views check an adjacency/Kronecker diagram on fixed bases. Topological tensor, sheaf and Yoneda comparison witnesses remain unknown.

Check: the quadratic cycle a -> h=2a -> b=1/(2h) -> a=1/(4b) returns exactly for sixteen positive rational inputs. An altered factor fails the cycle; a=0 is refused as outside this overlap. The finite adjunction checks its defining law and inverse maps on fixed points. On the full Q-side, 1 maps to 0, so an unrestricted round trip fails and l(u(b)) is not an extensive closure. This reproduces, in a small model, a distinction the strict hunt already identified.

Check: a triangle and a triangle with an isolated vertex have the same independent edge subsets and different vertex counts. Six graph/matroid abstraction rows therefore remain lossy rather than being promoted to isomorphisms. The other six unknown rows lack witnesses: one topological tensor, two sheafification and three Yoneda views. Shared object-version mismatch requires rechecking. None of these checks proves global atlas coherence.

Verdict: **needs refinement** for a production transition registry. **Confirmed** utility: cluster labels need validity domains, an equality level and explicit residuals before a route may transport anything.

## Observed production cost

[pilots/timings.json](pilots/timings.json) preserves stopwatch intervals from the start of each family's row encoding to its first successful run, including fixes. They are wall-clock readings for this agent session after shared source preparation, not measurements of human research labor or future corpus-wide costs. Later pilots reused sources, entries, models and helper code. Earlier phase-1 reading and phase-3 literature work are outside this stopwatch.

| Pilot | Family interval | Rows | Observed seconds per row |
|---|---:|---:|---:|
| C02 | 112.3 s | 16 | 7.02 |
| C23 | 108.8 s | 17 | 6.40 |
| C15 | 89.6 s | 16 | 5.60 |
| C30 | 86.2 s | 16 | 5.39 |
| C33 | 101.9 s | 18 | 5.66 |
| C53 | 97.8 s | 20 | 4.89 |

Additional shared pilot-source preparation took 284.2 s. The JSON materialization times are much smaller and are recorded separately; they do not estimate research/receipt cost. General analytic, behavioral and language-equivalence proofs were not priced by these finite trials. Extending these row rates to 2,066 entries would be unjustified.

## Source-byte correction and scope

Read/check correction to phase 1: copying the nineteen connector snapshots added one terminal newline. The original snapshot hashes are preserved in 01-reading-sources.json, and verifiedSourceSha256/gitBlobSha now identify exact source bytes. Each source Git blob id was independently matched; the quoted bytes and offsets did not change. This corrects the scope of those hashes, not the consumer readings. No private source snapshots are committed.

The survey rows have not entered mapfill/, map.json or any production evidence count. The operator can review which bounded functions justify a separate implementation round.
