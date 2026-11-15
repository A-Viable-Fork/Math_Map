# Prior art: verification after generation

Date: 2026-11-13. Generation was frozen at `d0f272d` before the first external search. Evidence is read where the fetched source says the quoted thing; the match from a precedent to a generated candidate is inferred. Search is bounded, so unknown means unestablished here, never absent everywhere.

## How to read the comparison

A source quote is printed once below and referenced by receipt id in every candidate row. The complete verbatim window, URL, source hash and offsets are in [03-prior-art-sources.json](03-prior-art-sources.json) and receipts/. Each window was fetched and checked by scripts/excerpt.mjs. HTML markup is stripped only for display below; the receipt retains the exact bytes. The matrix is [03-prior-art-matrix.json](03-prior-art-matrix.json).

The searches covered Mathlib at the map pin, the nLab, OEIS, LMFDB, Wikidata mathematical properties and statements, OMDoc/MMT theory morphisms, Lean/Rocq transport, the HoTT book, and EDOAL/Alignment API/SKOS ontology alignment. W3C PROV is an additional provenance comparison. These are primary system documentation or source. No source executes an adapter for this map merely by resembling a candidate.

## Fetched quotes and what they establish

| Receipt | Source | Verbatim quotation, display only |
|---|---|---|
| [PA01](receipts/PA01.txt) | [Lean reference: dependent core terms](https://lean-lang.org/doc/reference/latest/The-Type-System/) | Terms are a dependently typed λ-calculus: they include function abstraction, application, variables, and let-bindings. |
| [PA02](receipts/PA02.txt) | [Lean reference: propositions at runtime](https://lean-lang.org/doc/reference/latest/The-Type-System/Propositions/) | Propositions are erased from compiled code. |
| [PA03](receipts/PA03.txt) | [Lean reference: audited axiom dependencies](https://lean-lang.org/doc/reference/latest/Axioms/) | Lean automatically tracks the axioms that each proof depends on so that they can be audited. |
| [PA04](receipts/PA04.txt) | [Mathlib at the map pin: Equiv](https://raw.githubusercontent.com/leanprover-community/mathlib4/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Logic/Equiv/Defs.lean) | α ≃ β is the type of functions from α → β with a two-sided inverse. / protected def symm (e : α ≃ β) : β ≃ α := ⟨e.invFun, e.toFun, e.right_inv, e.left_inv⟩ / protected def trans (e₁ : α ≃ β) (e₂ : β ≃ γ) : α ≃ γ :=   ⟨e₂ ∘ e₁, e₁.symm ∘ e₂.symm, e₂.left_inv.comp e₁.left_inv, e₂.right_inv.comp e₁.right_inv⟩ |
| [PA05](receipts/PA05.txt) | [Mathlib at the map pin: transferring group structure](https://raw.githubusercontent.com/leanprover-community/mathlib4/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Algebra/Group/TransferInstance.lean) | In this file we prove lemmas of the following form: if β has a group structure and α ≃ β then α has a group structure, and similarly for monoids, semigroups and so on. |
| [PA06](receipts/PA06.txt) | [Rocq 9.2: generalized rewriting](https://rocq-prover.org/doc/V9.2.0/refman/addendum/generalized-rewriting.html) | One function can respect several different relations and thus it can be declared as a morphism having multiple signatures. |
| [PA07](receipts/PA07.txt) | [HoTT book: univalence](https://raw.githubusercontent.com/HoTT/book/578b85cc8d586b1677ec4335148adeb443057d24/basics.tex) | In particular, univalence means that \emph{equivalent types may be identified}. |
| [PA08](receipts/PA08.txt) | [nLab: adjunction coherence](https://ncatlab.org/nlab/source/adjoint+functor) | The [[adjunction unit]] and [[adjunction counit]] satisfy the [[triangle identities]] |
| [PA09](receipts/PA09.txt) | [OEIS: separate formula, example and program fields](https://oeis.org/eishelp1.html) | %F = Formula (if not included in %N line) / %e = examples / Computer program to produce the sequence |
| [PA10](receipts/PA10.txt) | [LMFDB developer principles](https://raw.githubusercontent.com/LMFDB/lmfdb/51941321c3c67054e0c3148c1c8d215857200280/README.md) | summarizes key invariants, links to completeness, source, and reliability knowls, and when applicable, a list of related objects. |
| [PA12](receipts/PA12.txt) | [Wikidata: statement qualifiers, ranks and references](https://www.wikidata.org/wiki/Help:Statements) | The structure is property-value(s), with optionals for every value (rank, qualifier and references). |
| [PA13](receipts/PA13.txt) | [Wikidata P2534: defining formula](https://www.wikidata.org/wiki/Special:EntityData/P2534.json) | "datatype":"math","id":"P2534" / "language":"en","value":"defining formula" |
| [PA14](receipts/PA14.txt) | [Wikidata P7235: formula symbol](https://www.wikidata.org/wiki/Special:EntityData/P7235.json) | "datatype":"math","id":"P7235" / "language":"en","value":"in defining formula" |
| [PA16](receipts/PA16.txt) | [MMT: theory morphism composition](https://uniformal.github.io/doc/language/modules) | Complex morphisms can be built in particular using composition. |
| [PA17](receipts/PA17.txt) | [MMT and OMDoc: theories and interpretation](https://uniformal.github.io/doc/language/) | Theory morphisms translate between theories either by representation (views) or by inheritance (structures). |
| [PA18](receipts/PA18.txt) | [OMDoc: statement and theory modules](https://www.omdoc.org/modules/) | Definitions, Theorems, Axioms, Examples, etc, and simple theories with inheritance / To add inheritance via translations, theory inclusions. |
| [PA19](receipts/PA19.txt) | [EDOAL: transformation of aligned encodings](https://moex.gitlabpages.inria.fr/alignapi/edoal.html) | Property values using different encoding or units can be  aligned using transformations. |
| [PA20](receipts/PA20.txt) | [Alignment API: confidence in a correspondence](https://moex.gitlabpages.inria.fr/alignapi/format.html) | the confidence     that the relation holds between the first and     the second entity. |
| [PA21](receipts/PA21.txt) | [W3C SKOS: limits of mapping composition](https://www.w3.org/TR/skos-reference/) | All other SKOS mapping properties are not transitive. |
| [PA22](receipts/PA22.txt) | [W3C PROV-O: scoped activities and entities](https://www.w3.org/TR/prov-o/) | An activity is something that occurs over a period of time and acts upon or with entities; |

Read: Mathlib separates a plain type equivalence from transported algebraic structure; Rocq can respect several different relations for the same function. Inferred: a chart bridge must name the structure and equality it transports. HoTT univalence is a theorem/axiom discipline in a particular foundation; it does not turn an English analogy into a checked identity, and it is not an additional axiom silently granted to the Lean pin.

Read: OEIS gives formulas, examples and programs different fields. LMFDB explicitly puts invariants next to source, completeness and reliability. Wikidata P2534 and P7235 have mathematical-expression datatypes, while its statements have references/qualifiers/ranks. Inferred: these are good representation precedents, and none alone checks that a formula, program and sentence mean the same thing.

Read: MMT theory morphisms compose, and OMDoc distinguishes statement/theory/proof modules. EDOAL describes conversions between encodings or units. SKOS explicitly restricts transitive entailments among mapping properties. Inferred: ontology matching can propose overlap correspondences, but a match measure cannot authorize mathematical transport.

## Candidate-by-candidate comparison

Each source id below incorporates the exact quotation above and its fetched receipt. Exists identifies a concrete data form, partial identifies essential missing integration/semantics, and unknown makes no prior-art absence claim.

| Candidate | Exists elsewhere? | Quoted source receipts | Existing form and remaining gap |
|---|---|---|---|
| C01 | partial | [PA12](receipts/PA12.txt), [PA18](receipts/PA18.txt) | Wikidata reifies property-value statements with qualifiers/references; OMDoc has statement classes. Atomic logical entailment is additional work. |
| C02 | partial | [PA01](receipts/PA01.txt), [PA06](receipts/PA06.txt) | Dependent terms and relation-respecting morphism signatures are substrates. The proposed map-side obligation environment is not specified by these pages. |
| C03 | partial | [PA01](receipts/PA01.txt), [PA17](receipts/PA17.txt) | Bound variables and context/theory interpretation can express operand roles. Cross-step D9 resource identity remains a design obligation. |
| C04 | partial | [PA18](receipts/PA18.txt) | OMDoc separates definitions, theorems, axioms and examples. The proposed partial/stochastic/choice shape vocabulary needs a separate specification. |
| C05 | partial | [PA13](receipts/PA13.txt), [PA19](receipts/PA19.txt) | Wikidata stores defining formulas; EDOAL transforms encodings/units. Neither fetched window specifies dependent probabilistic guarantee discharge. |
| C06 | exists | [PA09](receipts/PA09.txt), [PA18](receipts/PA18.txt) | OEIS keeps examples separate from generating programs/formulas; OMDoc distinguishes examples as statements. Executable example receipts remain local work. |
| C07 | partial | [PA03](receipts/PA03.txt), [PA12](receipts/PA12.txt) | Axiom dependencies and ranked referenced statements exist. A rank is not a theorem's mathematical standing; the exact status ledger is not established here. |
| C08 | exists | [PA03](receipts/PA03.txt) | Lean tracks a proof's axiom dependencies for auditing. A foundation-crossing admission policy still belongs to the receiver. |
| C09 | unknown | [PA09](receipts/PA09.txt), [PA19](receipts/PA19.txt) | Formulas and transformation expressions are present; no fetched source establishes the proposed family/degeneration record with limiting losses. |
| C10 | partial | [PA19](receipts/PA19.txt), [PA14](receipts/PA14.txt) | Encoding/unit conversions and formula symbols have records. A mathematical sign/normalization profile still needs defining equations. |
| C11 | exists | [PA05](receipts/PA05.txt), [PA06](receipts/PA06.txt) | Mathlib transfers algebraic structure using an equivalence; Rocq supports functions respecting relation signatures. The required law must be proved. |
| C12 | partial | [PA08](receipts/PA08.txt), [PA17](receipts/PA17.txt) | Adjunction coherence and theory interpretations encode structured mathematical specifications. A generic universal-property query interface was not found here. |
| C13 | partial | [PA01](receipts/PA01.txt) | Dependent types provide a representation substrate. Explicit convergence-region output and its inference rules are not documented in the fetched page. |
| C14 | unknown | [PA10](receipts/PA10.txt), [PA22](receipts/PA22.txt) | Reliability links and provenance activities are related records. A compositional noise/error model is not established by these sources. |
| C15 | exists | [PA04](receipts/PA04.txt) | Mathlib Equiv stores the forward/inverse structure and composes/reverses equivalences. Restricted domains require subtypes or separate hypotheses. |
| C16 | exists | [PA08](receipts/PA08.txt) | The nLab adjunction definition explicitly includes unit/counit triangle identities. It is narrative mathematics here, not a checked map edge. |
| C17 | partial | [PA06](receipts/PA06.txt), [PA17](receipts/PA17.txt) | Relation-aware morphism signatures and theory interpretation support directed transport; arbitrary duality/variance data require actual theorems. |
| C18 | partial | [PA17](receipts/PA17.txt) | A view interprets a source theory in a target theory. A text saying generalizes does not supply a valid view or premise implication. |
| C19 | partial | [PA10](receipts/PA10.txt), [PA12](receipts/PA12.txt) | Object pages and referenced statements are established identity infrastructure. Same-name mathematical operation canonicalization is not certified by either. |
| C20 | partial | [PA17](receipts/PA17.txt), [PA19](receipts/PA19.txt) | Theory representations and data transformations have explicit arrows. Numerical refinement bounds and executable correctness are additional obligations. |
| C21 | unknown | [PA19](receipts/PA19.txt) | Encoding transformations exist; the fetched source does not establish topology-sensitive continuum/discrete convergence records. |
| C22 | partial | [PA16](receipts/PA16.txt) | MMT composes theory morphisms. A control-flow recipe with external resources needs more than this composition operation. |
| C23 | partial | [PA05](receipts/PA05.txt), [PA06](receipts/PA06.txt) | Transport of algebraic structure and relation-respecting rewriting are verified-rule forms. A map-wide dictionary of analytic intertwinings needs claim-specific equations. |
| C24 | unknown | [PA22](receipts/PA22.txt) | PROV models bounded activities; the fetched sources do not give temporal propagation rules for the map's state/step/trace invariant classes. |
| C25 | unknown | [PA18](receipts/PA18.txt) | OMDoc distinguishes assertion forms, but this fetched module list establishes no obstruction-planning record or pruning rule. |
| C26 | partial | [PA09](receipts/PA09.txt), [PA18](receipts/PA18.txt) | Examples have independent slots. Claim-targeted executable refutations and attacked-invariant links are extra structure. |
| C27 | unknown | [PA18](receipts/PA18.txt) | Structured mathematical documents can carry statements. No dead-route/reopening ledger is established by the inspected module documentation. |
| C28 | partial | [PA04](receipts/PA04.txt) | A two-sided inverse is a precise positive contract. Explicit fibers/kernels and lost-information accounts require further theorems, not just reversing an arrow. |
| C29 | partial | [PA03](receipts/PA03.txt), [PA18](receipts/PA18.txt) | Axioms and theorem/assertion distinctions are represented. Neither no proof found nor a postulated axiom certifies independence. |
| C30 | partial | [PA09](receipts/PA09.txt), [PA17](receipts/PA17.txt), [PA22](receipts/PA22.txt) | Programs, theory interpretations and artifact activities are existing forms. A uniform envelope must preserve their distinct evidence and applicability. |
| C31 | partial | [PA03](receipts/PA03.txt), [PA17](receipts/PA17.txt) | Audited axiom dependencies and interpreted theories support external proof references. Receiving-side statement fidelity and replay receipts remain mandatory. |
| C32 | unknown | [PA03](receipts/PA03.txt) | Dependency audits exist. No semantic statement/definition fingerprint format is established by the fetched audit documentation. |
| C33 | partial | [PA02](receipts/PA02.txt), [PA17](receipts/PA17.txt), [PA19](receipts/PA19.txt) | Theory interpretations and encoding transformations are explicit arrows; Lean's proposition erasure is a concrete semantic difference between proof and runtime views. |
| C34 | partial | [PA04](receipts/PA04.txt), [PA07](receipts/PA07.txt) | Equivalence supplies inverse laws; univalence identifies equivalent types within its foundation. Neither certifies a natural-language round trip automatically. |
| C35 | partial | [PA14](receipts/PA14.txt), [PA19](receipts/PA19.txt) | Formula symbols and aligned ontology entities are represented. Mathematical sense disambiguation still needs context and review. |
| C36 | unknown | [PA18](receipts/PA18.txt) | OMDoc separates mathematical statement kinds. The fetched module list supplies no verified controlled-language parser or language-to-proof equivalence. |
| C37 | partial | [PA02](receipts/PA02.txt), [PA17](receipts/PA17.txt) | Runtime proposition erasure and interpreted theories expose model differences. No fetched source establishes a deployment-specific crash/integer model for these consumers. |
| C38 | partial | [PA18](receipts/PA18.txt) | OMDoc supports structured proofs from hypotheses. Cross-domain move skeleton retrieval is not certified by that representation alone. |
| C39 | unknown | [PA03](receipts/PA03.txt) | Audited proof dependencies are available. The proposed role classification of map anchors and its mapping fidelity are consumer-specific additions. |
| C40 | unknown | [PA12](receipts/PA12.txt) | Referenced statements have source identity. No per-operation contract-fingerprint algorithm or dependency policy is established by the fetched pages. |
| C41 | partial | [PA22](receipts/PA22.txt) | PROV activities can identify events and entities. Independent observer reproduction and the map's assurance ladder are additional local rules. |
| C42 | unknown | [PA09](receipts/PA09.txt) | Executable programs can be stored separately. Binding-specific tri-state read-back semantics are not established by the inspected sources. |
| C43 | unknown | [PA10](receipts/PA10.txt), [PA22](receipts/PA22.txt) | Reliability/provenance have homes. Reproducible hardware/workload envelopes and cross-platform performance comparisons are not specified in the fetched windows. |
| C44 | unknown | [PA17](receipts/PA17.txt) | Theory contexts are explicit. A manifest of fields a consumer actually reads was not established by the fetched documentation. |
| C45 | partial | [PA09](receipts/PA09.txt), [PA10](receipts/PA10.txt) | Worked examples and related-object browsing offer use-oriented entry points. Typed problem-to-route retrieval still needs its own solver and applicability rules. |
| C46 | exists | [PA12](receipts/PA12.txt), [PA10](receipts/PA10.txt) | References attached to statements and source/reliability links attached to object pages are working precedents. Automatic retraction closure remains extra. |
| C47 | partial | [PA18](receipts/PA18.txt) | OMDoc explicitly provides development-graph infrastructure for theory change. The map still needs precise dependency grains and invalidation rules. |
| C48 | partial | [PA03](receipts/PA03.txt), [PA22](receipts/PA22.txt) | Axiom dependency audits and recorded activities support scoped evidence tasks. They do not independently establish checker succession or authority. |
| C49 | partial | [PA03](receipts/PA03.txt), [PA16](receipts/PA16.txt) | Whole theories/morphisms and proof assumptions can be recorded. Binding a theorem to this exact chain, policy and operands remains local alignment work. |
| C50 | unknown | [PA16](receipts/PA16.txt) | Morphism composition exists. Bounded loops, branch frames and hyperproperty verification do not follow from it and were not established in the fetched pages. |
| C51 | partial | [PA17](receipts/PA17.txt), [PA18](receipts/PA18.txt) | MMT theories/views and OMDoc theory modules organize mathematical contexts. Their notion of theory is not automatically the paper's chart projection. |
| C52 | partial | [PA16](receipts/PA16.txt), [PA19](receipts/PA19.txt) | Theory morphisms and ontology alignments explicitly connect contexts. Shared labels alone do not witness a compatible overlap. |
| C53 | exists | [PA04](receipts/PA04.txt), [PA05](receipts/PA05.txt), [PA16](receipts/PA16.txt) | Equivalence maps with inverse laws and composable theory morphisms provide concrete transition forms. A transition must declare the structure it actually transports. |
| C54 | partial | [PA04](receipts/PA04.txt), [PA07](receipts/PA07.txt) | Composition/inverses and foundational identification exist. Arbitrary atlas cycle coherence still needs the declared equality level and domain intersection. |
| C55 | partial | [PA20](receipts/PA20.txt), [PA21](receipts/PA21.txt) | Alignment confidence and limits on mapping transitivity are explicit. A numerical confidence is not evidence of isomorphism or a substitute for lost-law witnesses. |
| C56 | partial | [PA03](receipts/PA03.txt), [PA17](receipts/PA17.txt) | Audited assumptions and theory interpretations can support receiving-side admission. The paper's local-standing policy is a separate institutional rule. |
| C57 | partial | [PA18](receipts/PA18.txt) | Development graphs address theory change. Regional ownership, sparse overlap maintenance and their performance need their own implementation and governance. |
| C58 | exists | [PA03](receipts/PA03.txt) | Lean records proof axiom dependencies. Discharge/retraction identity across libraries and intended-reference fidelity require separate checks. |
| C59 | partial | [PA19](receipts/PA19.txt), [PA20](receipts/PA20.txt) | Ontology alignment records possible correspondences and confidence. A technique cluster remains a proposal until its transport laws are verified. |
| C60 | partial | [PA22](receipts/PA22.txt) | PROV activities give empirical provenance a representation. Formal model departure and uncertified successful compression need additional domain-specific claims. |
| C61 | partial | [PA12](receipts/PA12.txt) | References belong to statements. Computed anticipation/priority and a declared-versus-computed citation delta are not established by this representation. |
| C62 | partial | [PA10](receipts/PA10.txt) | LMFDB links completeness and reliability next to invariants. Consumer-weighted coverage/evidence-debt calculations are a local design and must expose denominators. |
| C63 | partial | [PA20](receipts/PA20.txt) | Alignment confidence is stored as a measure. Learned retrieval needs an actual evaluated retriever; confidence in an alignment is not map truth. |
| C64 | unknown | [PA12](receipts/PA12.txt), [PA20](receipts/PA20.txt) | Ranks and correspondence confidence exist, but neither supplies a calibrated global mathematical truth/utility score. The proposed scalar mixes incompatible judgments. |

## Unfetchable and bounded readings

- LMFDB /rcs returned HTTP 200 with a reCAPTCHA page. Its requested content is unknown here; the independent pinned repository README is the receipt used for the source/reliability/completeness comparison. Search snippets were not substituted for receipts.
- The attempted LeanDojo /lean-dojo.html returned 404. Its claims are unknown from that URL and are not used to support the matrix.
- Wikidata P9758 EntityData returned 403. Symbol-represents semantics remain unknown in this comparison; P2534 and P7235 were independently fetched.
- No deployed device, proof kernel, ontology reasoner or corpus-wide retriever was run for this phase. The sources establish representation forms, not these designs' correctness or novelty.

## Pilot selection after this reading

The six tentative families remain C02, C23, C15, C30, C33 and C53. They span missing hypotheses, useful transform rules, reverse routes, consumer realizations, language loss and atlas transitions. This is the survey's priority order for experiments, subject to their outcomes; the final ranking will keep these six first and grade their different levels of readiness. C01, C10, C24, C34, C40 and C54 are supporting requirements, not permission to change their production counterparts.
