# MM-DR-001 — Systems and effects: operations, invariants, and composition audit

**Prompt date:** 2026-10-11. **Research series:** D9 systems/effects, first of three. **Scope:** abstract D9 proposal and audit; Android bindings and the later prior-art prompt are not executed here.

## 1. Executive Summary

**RESULT, GENERATED — Overall verdict: DEAD for the unrestricted exact checkability claim; MARGINAL for a restricted contract-based reformulation.** A named operation and a list of preserved/broken tags do not establish a security policy for a program. State predicates compose when every reachable transition really preserves them; trace safety policies compose when a trusted gate carries the policy's residual history and rejects every violating effect; selected noninterference properties compose through relational proofs with compatible interfaces and environment assumptions. Hyperproperty status does **not** by itself make local proofs impossible. The failure is treating unary inventory propagation as such a proof. The proposal below supplies 27 operations, 19 explicitly classified invariants, conditional contracts, a source ledger, and 11 exact counterexample checks. It also identifies limitations in the current Math_Map checker that must be resolved before it can return security verdicts. Published bridges remain specific to their languages or kernels [R11, R19, R28–R31].

### Evidence and scope conventions

**RESULT, GENERATED — Label discipline.** Published formal results below are labeled THEOREM when their stated theorem was checked, otherwise RESULT with its access limitation. Every D9 identifier, parameterized invariant, operation contract, reduction, logical argument, counterexample, and proposed checker change is **GENERATED**. An authored contract specifies intended behavior; it is not evidence that an implementation behaves that way. HEURISTIC labels apply only to usefulness estimates. No numerical experiment is used as a proof about an unbounded program.

**RESULT — Source access.** Original papers or author manuscripts were read for the central secure-flow, capability-isolation, kernel-integrity, security-composition and hyperproperty results. Other requested items were verified only through publisher/author abstracts or bibliographic records. Those limits are itemized in the bibliography and `source-ledger.json`. “I was unable to verify this claim” applies to an original exact theorem, theorem number, or claimed weakest composition condition in R01–R03, R06, R13, R25–R27 and R32; none is used as an independently checked original theorem here. R23's read extended abstract explicitly omits proofs; its journal result is not treated as a checked proof. This is a limitation of this survey, not a claim that the results do not exist.

**RESULT — Scaffold examined.** The current default-branch `A-Viable-Fork/Math_Map/scripts/compose.mjs` was fetched read-only, blob SHA `86abede7440a64d39781b9b5decf1f77976b990f`. Its vocabulary file was also read, blob SHA `e7978f83f2109cf16cbf739d85d1c43f08ac94a2`. The checker returns `unknown` for silence; it does not currently make the prompt's proposed policy pass/fail claim. Its actual mechanisms are: implication closure over preservation/may-break labels, carrier-based applicability, existential carrier-pair matching at joins, and a created/restored state inventory. The D9 audit concerns extending those mechanisms to security. It does not attribute a security guarantee to the existing repository.

**RESULT, GENERATED — Static/dynamic distinction.** A static effect/type certificate is about all executions in its stated language and environment. A dynamic gate permits or rejects the next actual event. Observing a monitored run gives evidence about that run; a proof of the gate and complete mediation gives the universal enforcement result. Noninterference compares executions. A signature verifier establishes a mathematical predicate on exact bytes/key, with further assumptions needed for signer identity and application authorization.

## 2. Q1 — Formal theories and what they give D9

**Overall verdict: CONFIRMED that the formal machinery exists; NEEDS REFINEMENT for transferring it to the proposed vocabulary.** The table distinguishes an established model from a D9 or device binding. “Composes” always names a condition or a precise restriction.

| Theory and evidence label | Operations/model | Properties and their carriers | Composition and contribution to D9 |
|---|---|---|---|
| Gifford–Lucassen 1986 [R01], RESULT: identity verified; detailed original guarantee UNVERIFIED | Functional computation with imperative state | Static computation effects attached to expressions/functions | A source for distinguishing computational effect from result type. No original soundness theorem is imported here. |
| Talpin–Jouvelot 1992 [R02], RESULT: official abstract verified | Polymorphic functional language with imperative regions | Types, regions, observable effects; carriers are expressions and possibly aliased memory regions | Region/effect information constrains generalization and hides nonobservable local effects. Full original theorem not independently verified. |
| Nielson–Nielson 1999 [R03], RESULT: chapter identity verified | Type/effect analysis framework | Static approximations attached to code | Requested survey identified. I was unable to verify a chapter-specific compositional soundness claim from the full text; use R08 for the checked language-specific bridge. |
| Plotkin–Power 2001–2003 [R04–R06], RESULT: author/publisher abstracts and identity verified | Operations/equations for effects; state and allocation are explicit examples | Algebraic theories, computation semantics and monads; not security labels on arbitrary data | Supplies an effect signature and equations. No universal six-operation basis or security-composition theorem follows from these abstracts. Original generic-effect theorem numbering was not verified. |
| Plotkin–Pretnar 2009 [R07], RESULT: full manuscript, §§2–4 | Effect invocation, computation sequencing, handlers and resumptions | Models of an effect theory and handler interpretations; computation/handler carriers | Handler semantics is part of the operation meaning. A handler may introduce effects or resume a continuation multiple times; security needs its own handler contract. |
| Leijen 2014 [R08], THEOREM: §5 Theorem 1 and subject-reduction Lemma 1 | Koka paper language, state and row-polymorphic effects | Static type/effect judgments on expressions | Establishes semantic soundness within that language. Supplies a checked example of a static annotation linked to operational semantics, without certifying arbitrary foreign tools or D9 handlers. |
| Denning 1976 [R09], RESULT: publisher abstract; model checked also in R11 §2 | Information-flow classes and permitted flow | Security classes on data/variables; policy lattice | Labels express allowed flows. They need data/control-flow rules and a semantic soundness bridge; lattice membership alone is not noninterference. |
| Goguen–Meseguer 1982 [R10], RESULT: original scan | Deterministic systems with actions and observations | Noninterference compares observations after removing disallowed actions; system-level carrier, a hyperproperty in modern terminology | The observer and system model must be fixed. A permission to perform an action is a different question from whether that action leaks information. |
| Volpano–Smith–Irvine 1996 [R11], THEOREM: §6 Theorem 6.8 | Deterministic imperative language and secure-flow typing | Agreement of final low values for two initially low-equivalent runs, when both terminate | A static whole-language theorem supported by local typing rules. It does not cover timing or differing termination, and it shows why “hyperproperties cannot have compositional local proofs” would be false. |
| Myers–Liskov 1997 [R12], RESULT: indexed author text, §§3 and 5 | Restriction/relabeling, decentralized declassification, acts-for authority | Owners' reader policies on labeled values, authority on principals | Supplies owner-sensitive release and label joins. The full original proof was not independently retrieved; application approval signatures are not supplied by the label model. |
| Sabelfeld–Myers 2003 [R13], RESULT: survey identity verified; detailed claims UNVERIFIED | Language-based information-flow security survey | Program information-flow policies | A requested organizing reference. Detailed original results could not be independently checked here; implicit-flow and timing findings below use checked sources or authored examples. |
| Sabelfeld–Sands 2009 [R14], RESULT: full manuscript, §2 | Declassification; discussion of endorsement for integrity | Release policy dimensions: what, who, where, when; policy/program carriers | Supplies explicit release parameters and the confidentiality/integrity distinction. Authorized release changes the policy being proved; it cannot silently preserve an unconditional no-release claim. |
| Dennis–Van Horn 1966 [R15], RESULT: original scan | Processes, computation state, object access and capabilities | Access authority in computation/object structures | Supplies state/process/authority distinctions. It does not establish modern secret-data provenance or arbitrary noninterference. |
| Miller 2006 [R16], RESULT: thesis §§9.2–9.3 | Reference introduction, delegation/attenuation, caretaker revocation, concurrency | Connectivity and authority in object graphs; protocol invariants | Supplies explicit authority paths and revocation through indirection. Distributed copies of data already delivered are outside that revocation guarantee. |
| Maffeis–Mitchell–Taly 2010 [R17], THEOREM: authority-isolation framework, Theorems 1 and 4 | Object-capability languages; restricted JavaScript isolation construction | Authority safety/isolation on executions and reachable objects/actions | Isolation is proved for the paper's defined authority maps and languages. Name correction: the paper is **Object Capabilities and Isolation of Untrusted Web Applications**. |
| Klein et al. 2009 [R18], RESULT: author/project record verified | seL4 kernel specification/implementation | Functional refinement/correctness of the kernel | Functional correctness is a bridge to a specification. The separate security results are R19 and R20; the 2009 record alone does not certify personal effect policies. |
| Sewell et al. 2011 [R19], RESULT: full paper, §4.1 | seL4 operations with dynamic authority and policy | Integrity relation between initial/current system states, plus policy refinement | The proof uses reflexivity/transitivity and sequentially composable Hoare triples. This is a direct example of local integrity proofs with explicit assumptions; it is not a universal guest-input noninterference theorem. |
| Murray et al. 2013 [R20], RESULT: full paper, security model/proof and timing discussion | Configured seL4 information-flow enforcement | Kernel confidentiality across executions under the defined partition and scheduling model | Supplies a whole-kernel security proof under configuration/platform assumptions. The model does not explicitly model time and does not settle covert timing channels. |
| CHERI ISAv9 2023 [R21], RESULT: specification Chapter 2, §2.3 | Guarded capability construction, bounds/permission reduction, protected dereference | Pointer capability integrity, provenance validity and monotonicity; capability/step carriers | Supplies hardware authority constraints. CHERI pointer provenance is not the same predicate as complete origin tracking for every application datum. |
| Milner–Parrow–Walker 1992 [R22], RESULT: manuscripts/publication records | Communication, parallel composition, name restriction and mobility | Scope/name structure and process behavioral equivalence | Supplies communication/concurrency syntax. Name restriction alone is not device confinement or a security theorem for a complete observer. |
| Hennessy–Riely 1998/2002 [R23], RESULT: §§2–4 of extended abstract; journal abstract | Distributed π-calculus, location migration, typed resource access | Location/resource permissions in typing environments; type safety | The abstract states subject reduction and safety, with proofs omitted. It supplies a locality/authority type design, not an independently checked general confidentiality proof. |
| Debenedetti et al. 2025 [R24], RESULT: CaMeL v2 §§5.2–5.4, 7 and 9 | Restricted interpreter, tool calls and value dependency/reader tags | Runtime policy predicates and tracked dependencies; values, events and interpreter state | Supplies a concrete dynamic design. NORMAL/STRICT dependency tracking differ, and the paper acknowledges side channels. Its value “capabilities” are policy metadata, not automatically hardware/object-capability references. |

**RESULT, GENERATED — Six-operation sufficiency verdict: NEEDS REFINEMENT.** There is no independently verified result establishing that send, store, read sensor, isolate, grant and revoke form a sufficient minimal basis. The question requires a language, allowed pure computation, handler semantics and an observational equivalence. With an unrestricted universal handler, missing operations can be hidden inside a seed action; this moves the implementation burden into the handler. With protected typed primitives, sequencing these six does not by itself define allocation, general reads, validation, release, concurrency, atomic transactions or opaque key-service operations. The present proposal makes those interfaces explicit. It does not claim a universal lower bound on primitive count.

## 3. Q2 — The D9 operation proposal

**Verdict: NEEDS REFINEMENT as deployable entries; the abstract contracts and reductions are GENERATED.** The full JSON array in Section 7 contains every requested field, per-field evidence labels, a confidence verdict, and primitive/derived metadata for 27 entries.

### Model M and the meaning of the fields

**RESULT, GENERATED — Model M.** An execution context is `(sigma, tau, Pi, Gamma, H, pc)`: complete modeled state, accumulated effect trace, fixed policy parameters/current protected epoch, operand and authority environment, handler environment, and control-dependency label. Pending requests contain explicit targets and operands. State includes revocation and replay registries, owner/version records, copy inventories and any required log head. The semantics names its observable channels and scheduling assumptions. The gate and internal metadata services are trusted parts of M; their implementation conformance remains an obligation.

**RESULT, GENERATED — Branches and frames.** Successful, denied, conflicting, error and diverging results are distinct. The `output` invariant list applies only to the specified success branch. Preservation of a signature is bound to the same immutable signed bytes and pinned key, or an exact copy. It does not attach that signature to newly transformed data. Origin correctness on new data requires the declared derivation rule. A guest-free fact remains a fact about its bound original datum; endorsement does not erase guest origins. Global state/trace predicates refer to the same boundary, policy and history throughout. These bindings cannot be represented by one unparameterized Boolean identifier.

**RESULT, GENERATED — Profile semantics.** `preserved` means an intended conditional universal contract, **if** the stated input assumptions and invariant hold. `broken` means **may destroy in some admissible context**, not an actual event on every call. Empty lists are unknown, not guarantees. `sources` marks every authored claim GENERATED; theory motivation is recorded separately. No source cited as motivation is a receipt proving the entire D9 contract. A safe transition in a particular state may exist even when its generic operation profile says may-break.

**RESULT, GENERATED — Primitive convention.** “Primitive” is relative to M's selected protected-effect algebra: the operation is an opaque interpreted generator with no authorized expansion into the other generators. Pure evaluation cannot forge capabilities/labels or invoke opaque key services; ordinary writes do not synthesize the protected atomic transaction service. This is a declared model boundary, not a platform-independent computational irreducibility theorem. Six entries are explicit derived macros: revoke, delegate, verify, log, authorized merge and local dispatch. Their chain and argument threading appear in JSON. Reductions include failure branches and do not hide an unbounded retry.

**RESULT, GENERATED — Derived operations are conditional refinements.** The authorized-merge chain is Verify → Check policy → guarded CAS. The final CAS must recheck mutable owner/epoch/version/nonce facts and atomically consume approval/log state. A prior verification followed by a generic write is not this macro. Revocation is one CAS attempt on a protected shared generation cell; it is successful only on its success branch. Log is Sign → append-only CAS; it does not make a separately completed prior action retrospectively atomic. Dispatch threads attenuated authority, task context and child history through Spawn → Join.

**RESULT, GENERATED — Carrier/schema consequence.** The proposed carrier arrays enumerate jointly required context/operand components. Current `compose.mjs` tests whether **some** carrier pair matches; that cannot verify a conjunction of required operands, exact record/key identities, or a success-branch refinement. This JSON is a research proposal, not a drop-in certified extension. The companion `carrier-proposal.json` states the proposed kinds and the interpretation requiring a schema decision.

## 4. Q3 — Invariant vocabulary and the five seeds

**Verdict: NEEDS REFINEMENT for the five seeds; 19 parameterized templates are proposed.** Their complete JSON definitions appear in Section 8. All exact D9 templates are GENERATED, with source motivation, carrier and logical class recorded individually.

| Seed | Decision | Reason and replacement |
|---|---|---|
| Locality | Split | `E9-LOCAL` is current explicit-copy placement, a state predicate. `E9-NOEGRESS` is historical explicit egress, a trace safety property. `E9-CNI`, `E9-TNI` and `E9-PNI` ask different confidentiality questions about observations across executions. No unconditional equivalence is asserted. |
| Provenance | Refine | `E9-PROV` requires complete protected provenance in the declared dependency semantics. A string naming an alleged origin is insufficient. Accurate provenance records where an assertion came from; it does not prove the assertion true or authorized. |
| Compartment origin | Keep as authenticated set-valued metadata | `E9-ORIG` retains every modeled ingress/compartment root through derivation. A value may have multiple roots. Processing it in a trusted compartment does not rewrite its historical origins. |
| Guest origin | Merge into origin vocabulary; expose a safe-state test | Guest membership is tested against the complete root set. `E9-GFREE` is known absence of guest origin. Unknown origin does not count as guest-free. This is an integrity input classification, not a causal noninterference proof. |
| Signature | Keep the mathematical predicate; separate its policy use | `E9-SIG` binds exact bytes and pinned key. `E9-OWNER` requires current owner approval at merge; `E9-FRESH` prevents approval reuse. A valid signature alone implies neither current owner authority nor freshness. |

**RESULT, GENERATED — Additional vocabulary.** Authority, attenuation, revocation, authenticated audit, modeled erasure, complete mediation, sound static effect bounds, integrity noninterference and joint-observation probabilistic noninterference are added. Availability, eventual completion, physical erasure, all possible covert channels and a cryptographic computational-indistinguishability policy are not silently represented by these identifiers. Encryption is an operation whose security depends on an algorithm and threat model; it is not a universal noninterference-preserving step.

**RESULT, GENERATED — Logical classes.** The vocabulary has six state predicates, two step relations, seven trace safety predicates and four hyperproperties. State predicates concern the current designated object/state. Step relations concern an instantiated transition and its parameters. Trace predicates quantify over the accumulated modeled events. Hyperproperties concern pairs of executions or distributions of complete joint observations. `E9-CNI` fixes a deterministic termination-insensitive model; `E9-PNI` fixes a probability/scheduler model. They are not interchangeable labels.

**RESULT, GENERATED — Probabilistic representation.** `E9-PNI` uses probability-bearing systems and their observation laws as its carrier semantics. Unweighted sets of possible traces do not determine probabilities. This follows the explicit choice of system representation discussed in R30 §7; it does not treat a probability law as recoverable from a raw trace support set.

**RESULT, GENERATED — Relations.** Three implications are proposed: complete provenance gives complete roots; known guest-free origin includes complete roots by definition; equality of a richer timed observer projection implies equality of its ordinary-output projection in the same model. All are parameter-aligned fact implications with authored proofs. They do not automatically turn “preserves P” into “preserves Q on every Q input.” No equivalence between locality, confinement, confidentiality, integrity, authority and signature is asserted.

## 5. Q4 — Dedicated sequential-composition audit

**Verdict: MARGINAL with explicit certificates; DEAD for arbitrary unary tag propagation.** The invariant-by-invariant table is in Section 9. The following arguments specify what “every step preserves it” must mean. Genuine semantic preservation and a field saying “preserved” are different inputs to an audit.

### C1 — Inductive state preservation

**RESULT, GENERATED — Exact statement and proof.** Fix one state predicate `I` and the same parameter/subject binding throughout. Suppose `I(s0)` and every reachable allowed transition `si -> si+1` satisfies `I(si) => I(si+1)`. Base: `I(s0)` holds. Induction: apply the next transition implication to obtain `I(si+1)`. Thus every reached state has I, including the endpoint. Environment transitions, alias writes, child execution and handler effects must be in the transition relation or covered by a proved frame/rely condition.

The weakest semantic obligation on the **reachable** transitions in this model is exactly absence of an `I`-state to `not-I` successor. The stronger universal Hoare contract `{I and Pre} op {I}` is a reusable sufficient certificate. Carrier/type compatibility alone does not prove either. The current state initially satisfying I is also indispensable; preservation does not create an invariant absent at entry.

### C2 — Residual-history enforcement for trace safety

**RESULT, GENERATED — Exact statement and proof.** Let a monitor carry residual state `q(tau)` for the accumulated trace, including an absorbing bad state. Assume the initial prefix is good and every committed event is admitted only if its monitor successor is good; update monitor/history and commit atomically. Induction over committed events establishes that every admitted prefix is good. A later event cannot remove a forbidden event from the historical prefix. The monitor may need unbounded nonce/history storage; this argument does not assert finite-state or efficient enforceability for every safety policy.

This covers the seven explicitly defined trace predicates when their event semantics and registries are complete. To prove all program executions satisfy the policy, prove the gate/adapter conformance and complete mediation for all executions. Dynamic checking of one observed trace establishes only that trace's prefix property. The original execution-monitor literature is R32; its full original proof was not independently retrieved, so C2 is given explicitly rather than transferred as an unchecked theorem.

### C3 — Relational proofs can compose noninterference

**RESULT, GENERATED — Deterministic sequential case.** Let `R` be the same relation on full states at each boundary, including all low-visible history needed by the observer. For deterministic total state transformers f and g assume `R(s,t) => R(f(s),f(t))` and `R(u,v) => R(g(u),g(v))`. Substitute `u=f(s), v=f(t)` to obtain `R(g(f(s)),g(f(t)))`. Repeat by induction for a chain. With partial transformers, the termination-insensitive claim is restricted to runs on which the compared prefix and composite terminate. Proving equality of termination or timed observations requires additional relational obligations.

The exact local obligation is preservation of the required boundary relation on the related reachable pairs; using different projections or forgetting low history invalidates the substitution. This is the repair for deterministic relational policies, not a unary metadata rule. Published static secure-flow typing gives such a bridge in its language: Volpano, Smith and Irvine 1996, JCS, §6 Theorem 6.8 [R11]. The kernel integrity proof uses a transitive relation and composable Hoare triples [R19, §4.1]. Integrity authorization as a trace predicate and integrity **noninterference** remain distinct.

**RESULT, GENERATED — Probabilistic sufficient condition.** At each boundary retain a relation on the two complete states including the shared public history. For every related pair, require a coupling of the two next-step distributions which produces identical next public observations and related successor states with probability one. Compose these conditional couplings over steps. Induction preserves equality of the joint public-history laws on finite prefixes. This is a sufficient relational proof condition for the declared stochastic model; no weakest universal coupling criterion is claimed. An isolated output's marginal distribution is a weaker premise and cannot substitute for it.

**THEOREM — Published concurrent bridge.** Mantel, Sands and Sudbrock 2011, CSF, Theorem 1 (Compositionality), proves their multi-threaded SIFUM security from SIFUM-secure commands with sound use of modes [R29]. The agreement between assumptions and guarantees is essential. This is not a proof for unrestricted handlers, arbitrary schedulers or a Boolean D9 invariant list.

### C4 — Conservative effect bounds compose; Boolean exactness does not

**RESULT, GENERATED — Upper-bound rule.** If every event of f is in a certified bound `Ef`, every event of g is in `Eg`, and sequencing introduces no unaccounted handler/environment effects, then every event of `f;g` is in `Ef union Eg`. This is set inclusion, not a proof that the order, arguments or correlations meet a security policy. Handlers require a summary of the handler interpretation and introduced/resumed computations; deleting a handled effect name without that summary is unsound.

**RESULT, GENERATED — Exact-profile counterexample.** On states `{0,1,2}`, define `I(x) = (x=0)`, `f(x)=x+1 mod 3`, and `g(x)=x-1 mod 3`. Both have the identical unary profile: not universally I-preserving, can break I, and do not create I for every input. The endpoint transformer `f;g` is identity and I-preserving; `f;f` is not. Identical Boolean step profiles therefore do not determine exact endpoint profiles. Both chains lose I at the intermediate state when begun at zero, so the example does not confuse endpoint restoration with “I held throughout.” The finite check reproduces these facts. A richer abstract transformer can retain the needed intermediate relation.

### C5 — Implicit control, exception and timing flows

**RESULT, GENERATED — Counterexample.** Evaluate `if secret_bit then fetch('/constant-image')`. The request payload is a public constant, but request occurrence distinguishes the two secret inputs. A payload-only provenance check does not see the dependence of **the event** on its program counter. The same construction works with a secret-dependent exception, loop count or completion time.

Correct control-dependency tracking and effect guards can block this modeled channel. Complete provenance of a value is not by itself complete provenance of whether an action occurs. Physical timing/resource observation requires a corresponding semantics and proof. CaMeL's STRICT/NORMAL distinction and acknowledged side channels give a concrete implementation illustration [R24, §§5.4 and 7]; the seL4 paper separately excludes covert timing guarantees [R20, timing discussion]. These results delimit the observer model rather than rule out all compositional proofs.

### C6 — Aggregation defeats independent-release summaries

**RESULT, GENERATED — Exact probabilistic counterexample.** Let secret H and random R be independent uniform bits. Release `A=R` and `B=R xor H`. For each fixed H, each individual release has probabilities `(1/2,1/2)`. The joint release determines `H=A xor B`. All four assignments are exhaustively enumerated by the companion check. Equality of each marginal output distribution is insufficient for `E9-PNI`, which requires the entire joint observation distribution.

This does not refute C3 or a correct probabilistic relational/coupling proof. After A is public, a boundary relation must retain that observation and its correlation with the internal random state. A summary that forgets it has changed the interface. A conservative origin-based no-egress policy may reject B immediately because it depends on W; that is sound for the literal egress policy even when individual-release probabilistic secrecy would have allowed it. The counterexample concerns incomplete semantic secrecy summaries, not a claim that every origin guard necessarily misses aggregation.

### C7 — Implication closure needs input-state premises

**RESULT, GENERATED — Counterexample reproduced against current code.** Let `P(s)=(s=0)`, `Q(s)=(s<=1)` on `{0,1,2}`, and `f(0)=0`, `f(1)=f(2)=2`. Then P implies Q, and f preserves P. But f takes Q-state 1 to non-Q state 2. The current preservation closure propagates `preserves P` down the implication and reports Q `survives` when only the preservation claim for P is supplied.

The valid inference is `{P} f {P}` plus `P => Q` gives `{P} f {Q}`. It does not give `{Q} f {Q}`. If the actual input is already known to satisfy P, output Q is justified. The checker must distinguish current facts and Hoare preconditions from universally quantified preservation claims.

**RESULT, GENERATED — May-break closure has the dual problem.** The same f has a Q-breaking witness at input 1 but preserves P on every P-input. The current upward may-break closure reports P broken from may-break Q. A witness breaking Q need not start in P. For an actual execution whose poststate violates Q, contraposition implies that its poststate violates P; attributing destruction of an initially held P still requires the initial P fact and the same execution/subject binding. The counterexample does not dispute logical implication itself.

### C8 — Signature validity, current authority and replay

**RESULT, GENERATED — TOCTOU counterexample.** A valid descriptor was verified for Alice owning record R at version 4. Before commit, owner becomes Bob and version becomes 5. The signature on the old descriptor is still mathematically valid, while current owner approval and expected-version checks fail. Even without an ownership change, a stateless verifier can accept the same signed command twice. Signature bytes are a state fact; current acceptance and replay are history-dependent predicates.

The owner key, action, record/destination, proposed bytes/digest, expected version, nonce, policy epoch and final commit must be bound. Atomic revalidation or an equivalent proved transaction protocol is sufficient in M. FIPS 186-5 distinguishes key association and verification [R33, §§3.1–3.3]; it does not supply this application transaction. RFC 8446 §8 provides a concrete anti-replay history example [R34].

### C9 — State restoration cannot repair trace safety

**RESULT, GENERATED — Counterexample.** Send W-derived payload outside B, then erase the external modeled copy. The current placement predicate can be true again. The trace still contains a forbidden egress. No erasure, signature, later endorsement or reclassification restores the historical no-egress property. Trace monitors therefore retain an absorbing violation state.

**RESULT — Additional current-code behavior, reproduced.** A synthetic chain with step 1 breaking X, step 2 creating X and step 3 silent on X is reported `restored`; the restoration branch checks for later break labels but not later silence. Likewise, a `created` report establishes creation at a step, not necessarily survival through a silent suffix. These are inventory statuses, not proof certificates for the end of a chain. A D9 security extension must retain unknown status after any relevant unproved suffix and must prohibit trace-policy restoration.

### C10 — Typed interfaces require all operands and their identities

**RESULT — Reproduced current-code behavior.** A step outputting `[system-state, unverified-data]` followed by a step requiring `[system-state, verified-signature]` is reported a carrier `match`, because the `system-state` pair matches. Such behavior is appropriate only if carrier lists mean alternatives or descriptive overlap. With jointly required operands it cannot establish that the signature witness exists. It also cannot prove that the witness covers the record and bytes about to be committed.

**RESULT, GENERATED — Repair.** Declare whether ports are sums/alternatives or products/conjunctive operands. Require a typed, identity-preserving binding for every required input component, branch refinement and parameter. Treat narrowing as an outstanding proof obligation. State/trace effects cannot be marked irrelevant merely because the immediate result's data carrier differs: aliases, handlers and control dependencies can affect them.

### The literature audit and its exact limits

**RESULT — Hook-up is a specific operator, not arbitrary sequential composition.** Mantel 2002, S&P, Section 4 Lemma 1 and Theorem 3, supplies explicit interface/trace assumptions for composing security properties of event systems [R28]. Its related-work discussion records failure of generalized noninterference under arbitrary compositions and composability results for stronger properties. Those results involve a defined event-system composition; transferring them to this D9 sequencing relation needs a model translation.

**RESULT — Historical subtargets.** McCullough 1987 and 1988 and Zakinthinos–Lee 1995–1997 are identified in the bibliography [R25–R27]. I was unable to verify their original exact theorem statements or their purported weakest hook-up conditions. The substantive historical failure/composition discussion used here is explicitly attributed to the checked primary research paper R28. No theorem number is fabricated for the inaccessible originals, and no universal “weakest” condition is attributed to them.

**THEOREM — Whole-system verification replacement.** Clarkson and Schneider 2010, JCS, Section 4 Theorem 2, reduces each k-safety hyperproperty to a safety property of the k-fold system [R30]. This supplies a product/self-composition route for the applicable deterministic relational policies. Their Section 5 shows why other formulations, including some possibilistic information-flow policies, have different logical character; not every security hyperproperty is 2-safety. Finkbeiner, Rabe and Sánchez 2015, CAV, Section 3, gives finite-state HyperLTL/HyperCTL* model-checking algorithms [R31]. These are whole-system/product-model checks, with their stated fragment/model limits.

**RESULT, GENERATED — Meaning of “weakest extra condition.”** There is no single weakest implementation assumption across all languages, observers and composition operators. C1, C2 and C3 state exact semantic obligations for their particular models. A protected origin adapter, common relation, atomic commit or sound rely/guarantee agreement is an explicit sufficient implementation condition; this survey does not claim it is globally minimal. Class membership identifies what must be related or remembered; it does not alone decide composability.

## 6. Q5 — Feasibility of personal-policy checking

**Overall verdict: DEAD as an unrestricted exact decision method; MARGINAL as evidence-aware contract checking plus enforcement.** Each proposed step is assessed separately below; the compact feasibility table follows the JSON and dedicated audit.

### Step 1 — Context-independent operation profiles

**Verdict: NEEDS REFINEMENT; DEAD if this means exact behavior determined by an uninstantiated operation name. RESULT, GENERATED.** A profile is well-defined only after fixing semantics, operand identities, targets, handlers, authority, observation model and interference. Inputs exist in the effect signatures and restricted languages in Q1 and in the proposed contracts, but a D9 name alone omits them. The same Send handled to an inside endpoint or an outside endpoint has different locality effects. Read may invoke a notifying adapter; isolate may share a timed resource; revoke may miss aliases.

A context-universal conservative profile is mathematically possible: preserve only what holds for all admitted contexts; may-break if some context violates it. That version is well-defined once the contexts are specified, and it does not determine the particular invocation. Its main obstacle is specificity/precision and implementation conformance, a local modeling gap. A claim of exact context-independent outcomes has a direct counterexample at this first step.

### Step 2 — Composition of profiles

**Verdict: MARGINAL for conservative abstractions; DEAD for exact composition from the given Boolean lists. RESULT, GENERATED.** Certified effect bounds compose under C4; Hoare/relational contracts compose under C1/C3 with compatible interfaces. The missing inputs are transformer preconditions/postconditions, object and parameter bindings, monitor state, dependency relations and assumptions about handlers/environment. The modulo-three example proves that exact endpoint profiles are not determined by the proposed three Boolean lists. Aggregation also loses joint information if profiles describe only individual outputs. Enriching the abstract domain and discharging interface obligations is a defined repair; evidence that the repaired analysis is exact for arbitrary programs does not exist here.

### Step 3 — Representation of each example policy

**Verdict: NEEDS REFINEMENT for the original five seeds; MARGINAL for explicitly chosen meanings. RESULT, GENERATED.** A vocabulary can name any policy, but naming does not make its preservation mechanically decidable. Each example needs its own semantics:

| Example policy | Exact selected meaning | Needed predicate/input | Check class and outstanding bridge |
|---|---|---|---|
| Data from W never leaves the device | No committed explicit transfer/storage/export of W-origin digital payload outside B, including specified logs, replicas and remote tool arguments | `E9-NOEGRESS`; complete roots, endpoints, copy/event inventory and fixed B/W | Trace safety with C2. If the intended meaning is absence of *all inferable information*, require an observer-specific `E9-CNI`, `E9-TNI` or `E9-PNI` whole-chain/relational proof. |
| Nothing merges without the owner's signature | Every accepted merge at its linearization point has the current record owner's signature on the exact action/update/expected version/nonce and satisfies current authorization | `E9-OWNER`, with `E9-FRESH` for replay prevention; trusted key/owner registry and atomic commit | Trace safety with C2 plus signature verifier conformance. A self-supplied signing key or old owner signature is insufficient. If the literal policy only means signature presence/validity, it is weaker and must be named accordingly. |
| No agent acts on guest text | Narrow reading: no guest-origin bytes are used as executable instructions or admitted as arguments to designated authority-bearing actions | `E9-GFREE` on exact operands plus PC/action-dependency checks and a stated admission predicate | A trace-safety admission rule can implement this narrow reading. `E9-GFREE` is sufficient only where all relevant dependencies are checked. |
| Same guest-text policy, causal reading | Varying guest input cannot change designated trusted action decisions | `E9-INI`; complete trusted-decision observer and full state relation | Hyperproperty. Requires a relational type/proof discipline or whole-chain product check; a trusted parser or endorsement does not by itself satisfy the absolute policy. |

Policy ranking/override is left out as requested. A declassification or endorsement event must refer to a specified effective policy; this report does not infer that an exception is authorized merely because an operation is named “declassify” or “endorse.”

### Step 4 — Soundness of “no step breaks it”

**Verdict: DEAD as stated; MARGINAL for the C1/C2/C3 reformulation. RESULT, GENERATED.** Published model-specific bridges in R11, R19 and R29 are established results; no D9 binding is thereby confirmed. No break label can mean a property is unknown, omitted, nonapplicable under a coarse carrier filter, or conditionally preserved with an unmet precondition. The current checker already distinguishes silence as unknown; the proposed policy claim must retain that distinction. The necessary inputs are a proved initial condition, complete required-property list, conformance certificates, compatible branch/identity/parameter bindings, all relevant environment effects and the appropriate monitor or relational state.

For state/trace policies with those inputs, induction proves soundness. For deterministic noninterference with a common full-state relation, C3 proves composition. Arbitrary unary propagation supplies none of the required inter-execution or joint-distribution evidence. The carrier filter, implication-closure premise gap, stale signature, omitted PC and lost history counterexamples show concrete false inferences if those omissions are treated as pass. Repairing a missing initial state or atomic guard is local. Changing from unary state facts to relational/hyperproperty reasoning is structural for this representation, even though compositional proof systems for such properties exist.

### Step 5 — Usefulness and rejection rate

**Verdict: MARGINAL in the published restricted designs; UNVERIFIED for this proposed D9 system. RESULT and HEURISTIC, GENERATED.** Inputs exist in secure-flow languages, capability systems and CaMeL's runtime design. No D9 implementation, policy corpus, accepted/rejected chain benchmark or platform binding is provided. There is consequently no measured false-rejection rate and no claim of practical coverage for arbitrary personal policies.

**HEURISTIC, GENERATED.** Instantiated endpoint/actor constraints, verified signatures tied to transaction context, and residual-state monitors can accept safe requests a context-universal may-break profile would reject. PC taint unions can conservatively reject computations whose results are mathematically independent of a secret; `secret xor secret` producing zero is an authored example. Proving independence needs a stronger relational analysis or explicit proof witness. Whether that extra effort pays off cannot be determined from the current map entries.

**RESULT, GENERATED — Earliest failure without silently changing the claim.** Exact outcomes independent of operation context fail at step 1. Reading step 1 as a conservative universal summary avoids that fatal reading; demanding exact composites from the given Boolean profiles then fails at step 2. If both are weakened to conservative conditional analysis, the decisive remaining failure is step 4's unrestricted interpretation of absent break labels as a policy proof. The restricted route requires affirmative, class-appropriate evidence, not mere absence of a break.

## 7. D9 entries — complete JSON array

All field claims below are labeled in `sources`. Every reduction is relative to M. These entries are proposals requiring receipts and implementation conformance before a security verdict can be issued.

```json
[
  {
    "id": "D9-X01",
    "domain": "D9",
    "name": "Send",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "communication",
      "egress"
    ],
    "description": "Deliver an immutable envelope to the explicitly bound endpoint through a chosen handler; rejection has no external effect.",
    "input": "State sigma, trace tau, program context, datum v, endpoint d, send capability c and handler h. The adapter preserves protected labels; current authority and gate checks are atomic with commit. No locality guard is assumed unless d is separately proved in B. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and delivery receipt or denied/error result. A successful event binds the actual endpoint, bytes, origins, actor and epoch; unchanged signature envelopes remain framed.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-SIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-CNI, E9-INI, E9-TNI, E9-PNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-SIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability",
        "handler"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-SIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R16 §9.2",
          "R24 §§5.2–5.4"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Destination, handler, observer, audit atomicity and all covert observations are context parameters.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X02",
    "domain": "D9",
    "name": "Store",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "storage",
      "replication"
    ],
    "description": "Write an immutable labeled value to a named resource; this is an ordinary write, not an atomic compare-and-swap.",
    "input": "State/trace/context, datum v, resource r, write capability and declared replica set. Write guards cover every replica and epoch; labels are copied and old snapshots remain explicitly inventoried. No B-local placement or append-only discipline is assumed. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and write receipt or failure. All actual destinations, replicas and retained old contents are represented.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-SIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-ERASE, E9-CNI, E9-INI, E9-TNI, E9-PNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-SIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-ERASE",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-SIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-ERASE",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R02 abstract",
          "R19 §4.1",
          "R24 §5.4"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Replication, overwrite history and storage callbacks determine the effect; generic write is not audit logging or erasure.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X03",
    "domain": "D9",
    "name": "Read sensor",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "sensing",
      "ingress"
    ],
    "description": "Capture a reading through an authenticated sensor adapter and introduce its modeled ingress provenance.",
    "input": "State/trace/context, sensor identifier and live read capability. Adapter authenticates the sensor/ingress root, accounts for read side effects, and unions any program-counter origins. No assertion that the physical observation is true or confidential is made. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace, freshly labeled reading and adapter receipt, or rejection. Guest and compartment membership follow authenticated ingress metadata.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-GFREE, E9-INI, E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-GFREE",
        "E9-INI",
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-PROV",
        "E9-ORIG"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-GFREE",
          "E9-INI",
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-PROV",
          "E9-ORIG"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R15 computation primitives",
          "R24 §5.3"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Sensor-origin authentication and actual adapter effects need a concrete model.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X04",
    "domain": "D9",
    "name": "Isolate",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "compartment",
      "confinement"
    ],
    "description": "Create an execution compartment with explicit memory, capability, handler and channel boundaries.",
    "input": "State/trace/context, fresh compartment descriptor, resource partition and initial capability graph. A trusted allocator/configurator enforces the stated partition; shared devices, scheduler and allowed channels are listed. No whole-program noninterference certificate is supplied. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and compartment handle or failure, with enforced structural access boundaries in the declared model.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "compartment",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "compartment",
        "capability"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R17 isolation model",
          "R20 Sections IV–V"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Structural isolation does not certify timing isolation, communication policies, or code placed inside.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X05",
    "domain": "D9",
    "name": "Grant capability",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "authority",
      "issuance"
    ],
    "description": "Issue fresh authority for an existing target from an explicitly authorized issuer root.",
    "input": "State/trace/context, issuer root, recipient, target, rights, lifetime and fresh generation. Issuer policy authorizes exactly this issuance; capability construction is protected. This is root issuance, not merely sending an already held capability. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and new protected capability with issuer/target/generation binding, or denial.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-CNI, E9-INI, E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R15 capability model",
          "R17 authority model"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Grant budget and issuer authority must be supplied; it cannot be called authority-preserving without those parameters.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X06",
    "domain": "D9",
    "name": "Revoke capability generation",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "authority",
      "revocation"
    ],
    "description": "Attempt an atomic update that disables one shared capability generation for subsequent effect commits.",
    "input": "State/trace/context, revoker authority, protected revocation cell, root/generation and expected cell version. Every alias and callee checks that cell at its commit point. The supplied expected version permits a single attempt; conflict returns failure. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. Any committed effect in this step and its required authenticated audit append share one atomic transition; pure steps commit no such effect.",
    "output": "Updated state/trace and revoked or conflict/denied result. Successful revocation blocks later commits with the old generation; earlier delivered data and independent grants remain.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-AUDIT, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-TNI. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-AUDIT",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-TNI"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-AUDIT",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-TNI"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R16 §9.3",
          "R19 §4.1"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Alias coverage and linearization are indispensable; revocation is not retroactive erasure.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "derived",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "chain": [
        "D9-X26"
      ],
      "argument_threading": "CAS the protected shared revocation cell at the supplied expected version. A conflict is a failed revocation attempt; no unbounded retry is hidden."
    }
  },
  {
    "id": "D9-X07",
    "domain": "D9",
    "name": "Read stored state",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "storage",
      "read"
    ],
    "description": "Read a named resource and its protected provenance/signature envelope without altering the underlying bytes.",
    "input": "State/trace/context, read capability, resource/version and trusted storage adapter. Hidden read notifications are either excluded by contract or accounted for. The result copies labels and immutable signed bytes exactly. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and a labeled snapshot of the actual version, or denied/error result; no current authorization certificate for later use is inferred.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-SIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-GFREE, E9-INI, E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-SIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-GFREE",
        "E9-INI",
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-SIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-GFREE",
          "E9-INI",
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R02 abstract",
          "R24 §5.4"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "A read-only API can still notify an external service or expose data to the observer; the adapter contract must rule that out or model it.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X08",
    "domain": "D9",
    "name": "Evaluate pure expression",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "computation",
      "control",
      "derivation"
    ],
    "description": "Run an effect-free total expression over explicit operands; derive new labels by union of data and program-counter dependencies.",
    "input": "State/trace/context, typed total pure expression f, explicit operands and PC origin set. No foreign calls, capability construction, label mutation, key-service invocation or hidden effects are allowed. All new-value dependency labels are protected. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. Any committed effect in this step and its required authenticated audit append share one atomic transition; pure steps commit no such effect.",
    "output": "Updated register state and labeled result f(operands); trace has no externally committed effect from evaluation. Original immutable envelopes are framed, but the derived result does not inherit their signatures.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-AUDIT, E9-MEDIATED, E9-EBND. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-GFREE, E9-SIG, E9-CNI, E9-INI, E9-TNI, E9-PNI. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-AUDIT",
        "E9-MEDIATED",
        "E9-EBND"
      ],
      "broken": [
        "E9-GFREE",
        "E9-SIG",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI"
      ],
      "output": [
        "E9-PROV",
        "E9-ORIG",
        "E9-EBND"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-AUDIT",
          "E9-MEDIATED",
          "E9-EBND"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-GFREE",
          "E9-SIG",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-EBND"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R08 §5",
          "R11 §6",
          "R24 §5.4"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Purity does not imply confidentiality: a returned low result may depend on a high or guest input.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X09",
    "domain": "D9",
    "name": "Allocate fresh resource",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "state",
      "allocation"
    ],
    "description": "Allocate a fresh local object identity and initialize its explicit authority and labels.",
    "input": "State/trace/context, allocator capability, initial value, compartment B and a protected freshness allocator. Initialization uses correct dependency labels; new resource lies in B; allocator budget is authorized. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace, fresh resource identifier and access handle, or failure. Retained copies and resource accounting remain in the model.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-ERASE, E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-ERASE",
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-PROV",
        "E9-ORIG"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-ERASE",
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-PROV",
          "E9-ORIG"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R05 state/allocation semantics",
          "R21 Chapter 2"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Fresh identity and placement need protected allocation; allocation size and failure may leak through resource observations.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X10",
    "domain": "D9",
    "name": "Declassify confidentiality label",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "confidentiality",
      "release"
    ],
    "description": "Create a value view with explicitly authorized weaker confidentiality restrictions while retaining historical origins.",
    "input": "State/trace/context, labeled datum, authorized releaser, release policy specifying what/who/where/when, and target label. No actual send is bundled. Immutable signed payload descriptors are retained; release annotations are separate metadata. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. The guest-free preservation binding is to the same original datum, not a newly sampled datum or a rewritten origin annotation.",
    "output": "Updated state/trace and released-label view of the same datum, or denial. The historical compartment/guest origin is unchanged.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-GFREE, E9-LOCAL, E9-NOEGRESS, E9-SIG, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-CNI, E9-TNI, E9-PNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-GFREE",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-SIG",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-CNI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-GFREE",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-SIG",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-CNI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R12 §5",
          "R14 §2"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Authorized release changes the confidentiality policy; it does not preserve the original no-release noninterference claim.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X11",
    "domain": "D9",
    "name": "Endorse integrity label",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "integrity",
      "endorsement"
    ],
    "description": "Permit a value to influence a specified trusted decision after an explicit authorized validation, without rewriting its origin.",
    "input": "State/trace/context, datum v, endorser authority, validation predicate and allowed decision scope. Validation succeeds over exact bound bytes; provenance is kept and endorsement is a separate annotation. No guest-free fact is fabricated. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. The guest-free preservation binding is to the same original datum, not a newly sampled datum or a rewritten origin annotation.",
    "output": "Updated state/trace and scoped endorsement witness with the original labeled datum, or denial.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-GFREE, E9-LOCAL, E9-NOEGRESS, E9-SIG, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-INI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-GFREE",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-SIG",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-INI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-GFREE",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-SIG",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-INI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R14 integrity/endorsement discussion"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "An endorsement exception conflicts with an absolute no-guest-influence policy; validation must be part of a separately chosen policy.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X12",
    "domain": "D9",
    "name": "Attenuate capability",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "authority",
      "bounds"
    ],
    "description": "Derive a protected capability for the same target with reduced declared rights, bounds and lifetime.",
    "input": "State/trace/context, live capability c and requested rights/bounds/lifetime contained in c. A guarded constructor prohibits forging tags, changing target identity or increasing permissions. It does not add ambient authority. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and attenuated capability c-prime, or rejection; a certificate binds this input/output pair.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-ATTEN"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-ATTEN"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R21 §2.3",
          "R16 §9.3"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Declared-rights subset is weaker than a theorem about transitive reachable or ambient authority.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X13",
    "domain": "D9",
    "name": "Delegate existing authority",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "authority",
      "delegation"
    ],
    "description": "Attenuate an existing capability and deliver it to an explicitly named recipient.",
    "input": "State/trace/context, delegable live capability, recipient endpoint, restricted rights and send handler. Attenuation preconditions and Send adapter/gate preconditions both hold; recipient admission and channel are explicit. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and delegation receipt or rejection. The delegate receives exactly the attenuated capability, not issuer-root authority.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-CNI, E9-INI, E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-ATTEN"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability",
        "handler"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-ATTEN"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R16 §§9.2–9.3",
          "R21 §2.3"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Reduced rights may still allow recipient forwarding, confused-deputy use or disclosure through permitted channels.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "derived",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "chain": [
        "D9-X12",
        "D9-X01"
      ],
      "argument_threading": "Attenuate c, then Send the resulting protected capability to the bound recipient. Recipient/endpoint and state are threaded explicitly."
    }
  },
  {
    "id": "D9-X14",
    "domain": "D9",
    "name": "Spawn task",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "concurrency",
      "spawn"
    ],
    "description": "Start a task with explicitly inherited data, authority, compartment and handler environment.",
    "input": "State/trace/context, task code, labeled arguments, attenuated initial capability graph and declared scheduler. Spawn itself is guarded; every child effect must obey the same gate/epoch protocol. Child code and behavior are otherwise unrestricted. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and task handle. Subsequent child effects are part of the program execution, not invisible to the parent policy monitor.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-GFREE, E9-CNI, E9-INI, E9-TNI, E9-PNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-GFREE",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "task-handle"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-GFREE",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R15 processes",
          "R29 §III.D"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Child behavior and environment interference require whole-program or rely/guarantee obligations; checking only the spawn call is insufficient.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X15",
    "domain": "D9",
    "name": "Join task",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "concurrency",
      "synchronization"
    ],
    "description": "Await a specified task and collect its labeled result and accounted execution history.",
    "input": "State/trace/context, task handle and declared scheduler. The join blocks or returns a cancellation/error according to explicit semantics; child results and traces are incorporated without changing their authentic labels. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and result/failed/cancelled outcome, or divergence. No successful or secure termination is inferred from the join operation.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-REVOKE, E9-FRESH. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-GFREE, E9-CNI, E9-INI, E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-REVOKE",
        "E9-FRESH"
      ],
      "broken": [
        "E9-GFREE",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "task-handle"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-REVOKE",
          "E9-FRESH"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-GFREE",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R22 process synchronization",
          "R29 §III.D"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Blocking, termination, exceptions and the child trace are security-relevant; histories cannot be discarded at the join.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X16",
    "domain": "D9",
    "name": "Install effect handler",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "handlers",
      "interpretation"
    ],
    "description": "Install an explicit interpreter for subsequent effect requests in a lexical scope.",
    "input": "State/trace/context, effect signature, handler h and installer authority. Installer event is guarded; handler forwarding preserves the trusted gate requirement. No proof that h has the same destinations or confidentiality behavior as the old handler is assumed. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and scoped handler environment. Resumption multiplicity, introduced effects and forwarding behavior are recorded.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-ERASE, E9-CNI, E9-INI, E9-TNI, E9-PNI, E9-AUDIT, E9-EBND. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-ERASE",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT",
        "E9-EBND"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "handler"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "handler"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-ERASE",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT",
          "E9-EBND"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R07 §§2–4"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Same request syntax can have different effects under different handlers; arbitrary handler replacement invalidates an old effect certificate.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X17",
    "domain": "D9",
    "name": "Encrypt with opaque key service",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "cryptography",
      "confidentiality"
    ],
    "description": "Use a declared encryption/key-service interface on labeled bytes and retain their origins on the ciphertext.",
    "input": "State/trace/context, plaintext, protected key handle, algorithm parameters and nonce from the declared freshness discipline. Key bytes are opaque to Evaluate; service calls are local to B, gated and currently authorized. No cryptographic secrecy theorem is imported by the word encrypt. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and labeled ciphertext, nonce and algorithm identifier, or failure. Output size and service timing remain modeled observations.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-CNI, E9-TNI, E9-PNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-CNI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-PROV",
        "E9-ORIG"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "key-handle"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-CNI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-PROV",
          "E9-ORIG"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R24 information-flow distinction; exact key-service contract GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "An algorithm/threat-model proof and key/nonce discipline are missing; ciphertext still violates literal payload locality if exported.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X18",
    "domain": "D9",
    "name": "Decrypt with opaque key service",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "cryptography",
      "reconstruction"
    ],
    "description": "Decrypt through the specified key service; reconstructed plaintext inherits the ciphertext and key-service dependency origins.",
    "input": "State/trace/context, ciphertext envelope, protected key handle and declared algorithm. Service is local to B, gated and authorized. Successful plaintext is relabeled from all modeled dependencies; no claim of factual integrity beyond a stated authentication check is made. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and labeled plaintext or explicit error. Error observability and reconstructed copies enter the state/trace model.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-ERASE, E9-GFREE, E9-CNI, E9-INI, E9-TNI, E9-PNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-ERASE",
        "E9-GFREE",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-PROV",
        "E9-ORIG"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "key-handle"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-ERASE",
          "E9-GFREE",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-PROV",
          "E9-ORIG"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R33 authentication distinction; exact decrypt contract GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Key-service conformance, error channels and reconstruction invalidate generic erasure or confidentiality summaries.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X19",
    "domain": "D9",
    "name": "Sign exact approval descriptor",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "cryptography",
      "signature"
    ],
    "description": "Sign a canonical immutable descriptor through an opaque signing-key service.",
    "input": "State/trace/context, canonical descriptor, authorized signing-key handle and declared signature scheme. The correct signing algorithm and pinned verification key are paired; the key service is local, gated and authorized. A digest-only approval additionally assumes collision resistance and canonical binding. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and exact signed envelope, or failure. Successful envelope satisfies mathematical verification under the paired pinned key; owner identity/permission and anti-replay remain separate.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-SIG"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "key-handle"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "signed-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-SIG"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R33 §§3.1–3.3"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Key association, canonicalization, signing-oracle exposure and commit-context binding are required.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X20",
    "domain": "D9",
    "name": "Verify signature",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "cryptography",
      "verification"
    ],
    "description": "Evaluate the declared public verification algorithm over exact bytes and a trusted pinned public key.",
    "input": "State/trace/context, immutable signed descriptor, signature, trusted pinned public-key bytes and verification algorithm. Public verification is a total pure expression available to Evaluate; public key lookup/ownership is supplied separately, not inferred from a key embedded in the message. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. Any committed effect in this step and its required authenticated audit append share one atomic transition; pure steps commit no such effect.",
    "output": "Updated register state and verified-signature witness on success, or explicit false/error. The witness binds exact bytes, algorithm and pinned key; it is not current owner authorization.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-AUDIT, E9-MEDIATED, E9-EBND. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-INI. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-AUDIT",
        "E9-MEDIATED",
        "E9-EBND"
      ],
      "broken": [
        "E9-INI"
      ],
      "output": [
        "E9-SIG",
        "E9-EBND"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "signed-value",
        "data-value"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "verified-signature"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-AUDIT",
          "E9-MEDIATED",
          "E9-EBND"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-INI"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-SIG",
          "E9-EBND"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R33 §3.3",
          "R08 §5"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "The signer may be the wrong or former owner; replay and state changes are not detected by this predicate.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "derived",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "chain": [
        "D9-X08"
      ],
      "argument_threading": "Evaluate the public Verify algorithm with the immutable descriptor and externally pinned trusted public key; return a signature witness only on its success branch."
    }
  },
  {
    "id": "D9-X21",
    "domain": "D9",
    "name": "Append authenticated audit record",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "logging",
      "accountability"
    ],
    "description": "Sign a record chained to the current log head and atomically append it to an authorized local append-only resource.",
    "input": "State/trace/context, audit descriptor, signing-key handle, protected local log and expected head/version. Sign then CAS preconditions hold; conflicts return failure without committing the associated effect. The log contains complete modeled commit metadata and an authenticated previous-head binding. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and authenticated appended record or conflict/error. This records an event but cannot make a separate prior unlogged effect retrospectively atomic.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-CNI, E9-INI, E9-TNI, E9-PNI. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI"
      ],
      "output": [
        "E9-SIG"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "key-handle",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "signed-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-SIG"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R33 signature mechanism; composition and log contract GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Append authentication is not completeness or effect/log atomicity; network logs can also be egress.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "derived",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "chain": [
        "D9-X19",
        "D9-X26"
      ],
      "argument_threading": "Sign the new record including the expected prior log head, then CAS an append-only local log. A conflict returns failure and does not commit an associated effect."
    }
  },
  {
    "id": "D9-X22",
    "domain": "D9",
    "name": "Erase modeled recoverable copies",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "erasure",
      "state"
    ],
    "description": "Delete all members of a complete explicitly bounded recoverable-copy inventory for the designated secret.",
    "input": "State/trace/context, erase authority and complete inventory of copies plus reconstructing keys/backups for x. The abstract erase primitive deletes those modeled resources; no unlisted recipient memory or physical medium state is promised erased. Histories remain protected. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and inventory-empty witness or failure. Past egress events remain in the trace; fresh ingress may later recreate x.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-ERASE"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-ERASE"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "GENERATED bounded deletion operation"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Inventory completeness and physical implementation are unresolved; restoration of current absence cannot undo a past violation.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X23",
    "domain": "D9",
    "name": "Generate and register fresh approval nonce",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "freshness",
      "randomness"
    ],
    "description": "Sample or allocate a nonce and reserve it in a protected issuer/scope namespace.",
    "input": "State/trace/context, issuer scope, nonce service and registry capability. Service uses an explicit random or monotone allocation model and atomically checks uniqueness in that namespace. Random unpredictability is a separate assumption; uniqueness does not authorize an action. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and labeled reserved nonce or collision/conflict error. Acceptance/replay history is not erased or reset.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-TNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-TNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-PROV",
        "E9-ORIG"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-TNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-PROV",
          "E9-ORIG"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R34 §8 motivates anti-replay state; nonce allocation GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Uniqueness reservation, lifetime and distributed verifier history need an implementation; randomness alone is insufficient.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X24",
    "domain": "D9",
    "name": "Check policy at the trusted gate",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "monitor",
      "authorization"
    ],
    "description": "Evaluate the current authorization predicate over exact intended effect arguments and return a bound, short-lived permit or denial.",
    "input": "State/trace/context, intended effect descriptor, actor, target, capabilities, current policy epoch and relevant history. The gate is trusted and total on supported requests. Permit is bound to exact arguments and epoch; any later commit rechecks freshness/current state atomically. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. Any committed effect in this step and its required authenticated audit append share one atomic transition; pure steps commit no such effect.",
    "output": "Updated state and bound policy ticket or rejection. The check alone commits no external effect and does not guarantee that the ticket will still authorize a later action.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-AUDIT, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-TNI. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-AUDIT",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-TNI"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "policy-ticket"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-AUDIT",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-TNI"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R24 §§5.2–5.4; atomic ticket design GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "TOCTOU, bypass paths and policy interpretation are independent obligations.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X25",
    "domain": "D9",
    "name": "Merge with current owner authorization",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "integrity",
      "transaction",
      "merge"
    ],
    "description": "Verify an owner-signed descriptor and atomically commit its exact proposed record update under the current owner/version/nonce checks.",
    "input": "State/trace/context, signed descriptor binding record/action/bytes/expected version/nonce, pinned owner-key candidate, merge capability and protected record. The record, all replicas and audit destinations are inside B. Verify, Check policy and CAS preconditions hold and are ordered; CAS rechecks current owner, epoch, version, nonce and ticket arguments and atomically logs and consumes the approval. Conflicts are explicit failures. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. Any committed effect in this step and its required authenticated audit append share one atomic transition; pure steps commit no such effect.",
    "output": "Updated state/trace and accepted merge receipt or denial/conflict. A success creates the approved record version; old signatures on changed record bytes are not reused.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-LOCAL, E9-NOEGRESS, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-AUDIT, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-SIG, E9-CNI, E9-INI, E9-TNI, E9-PNI. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-AUDIT",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-SIG",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "signed-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-AUDIT",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-SIG",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R33 verification",
          "R19 §4.1; exact owner-merge transaction GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "A platform must supply the stated atomic transaction; separate verification, policy checking and ordinary write do not establish it.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "derived",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "chain": [
        "D9-X20",
        "D9-X24",
        "D9-X26"
      ],
      "argument_threading": "Verify the exact descriptor, Check policy for those arguments, then invoke guarded CAS which rechecks all mutable authorization facts and atomically consumes nonce/log state."
    }
  },
  {
    "id": "D9-X26",
    "domain": "D9",
    "name": "Compare-and-swap guarded resource",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "state",
      "atomicity",
      "transaction"
    ],
    "description": "Attempt one atomic compare-and-swap with explicit resource/version, bound guards, and all required monitor/history/log updates.",
    "input": "State/trace/context, target resource, expected version, proposed bytes, live authority and bound guard specification. Trusted CAS service checks current policy/owner/epoch/replay predicates at one linearization point; requested log/history updates commit atomically. No locality constraint is assumed for an arbitrary target. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged. Any committed effect in this step and its required authenticated audit append share one atomic transition; pure steps commit no such effect.",
    "output": "Updated state/trace and success with new version or unchanged-data conflict/denial. All accepted-effect and monitor-state changes share a linearization point.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-OWNER, E9-AUTH, E9-REVOKE, E9-FRESH, E9-AUDIT, E9-MEDIATED. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-SIG, E9-ERASE, E9-CNI, E9-INI, E9-TNI, E9-PNI. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-OWNER",
        "E9-AUTH",
        "E9-REVOKE",
        "E9-FRESH",
        "E9-AUDIT",
        "E9-MEDIATED"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-SIG",
        "E9-ERASE",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI"
      ],
      "output": []
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability",
        "policy-ticket"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-OWNER",
          "E9-AUTH",
          "E9-REVOKE",
          "E9-FRESH",
          "E9-AUDIT",
          "E9-MEDIATED"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-SIG",
          "E9-ERASE",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "theory motivation",
        "references": [
          "R19 §4.1 proof pattern; generalized transaction service GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "NEEDS REFINEMENT",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "This specification assumes precisely the transaction service a concrete binding must prove; it is not a feature supplied by existing compose.mjs.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "primitive",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "nonexpressibility": "M treats this protected request or pure-evaluation operation as an independent generator; other generators cannot impersonate its trusted interpreter. No platform-independent irreducibility theorem is claimed."
    }
  },
  {
    "id": "D9-X27",
    "domain": "D9",
    "name": "Dispatch local component task",
    "kind": "Transformer",
    "tags": [
      "GENERATED",
      "components",
      "dispatch"
    ],
    "description": "Attenuate the component authority, spawn an explicitly named local component task and join its accounted result.",
    "input": "State/trace/context, named local component code, arguments, initial delegable capabilities, compartment and scheduler. Attenuate/Spawn/Join preconditions hold; all callee effects use the same gate, origin and revocation model. Additional preservation conditions: If this step accepts a policy-scoped approval, it atomically checks and updates the shared anti-replay history; otherwise it leaves that history unchanged.",
    "output": "Updated state/trace and component result, failure or divergence. Callee histories and dependencies remain available to policy checks.",
    "preserved": "GENERATED conditional preservation: E9-PROV, E9-ORIG, E9-REVOKE, E9-FRESH. Exact-bound original objects may be framed; a newly derived value needs its own witness.",
    "broken": "GENERATED may destroy: E9-LOCAL, E9-NOEGRESS, E9-GFREE, E9-CNI, E9-INI, E9-TNI, E9-PNI, E9-AUDIT. This is a conservative possibility claim, not actual loss on every invocation.",
    "invariants": {
      "preserved": [
        "E9-PROV",
        "E9-ORIG",
        "E9-REVOKE",
        "E9-FRESH"
      ],
      "broken": [
        "E9-LOCAL",
        "E9-NOEGRESS",
        "E9-GFREE",
        "E9-CNI",
        "E9-INI",
        "E9-TNI",
        "E9-PNI",
        "E9-AUDIT"
      ],
      "output": [
        "E9-ATTEN"
      ]
    },
    "actsOn": {
      "input": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value",
        "capability"
      ],
      "output": [
        "system-state",
        "execution-trace",
        "agent-program",
        "data-value"
      ]
    },
    "sources": [
      {
        "field": "schema fields",
        "invariants": [],
        "label": "GENERATED",
        "basis": "Identifiers, carriers, prose contracts and primitive/derived designation are authored for abstract model M."
      },
      {
        "field": "preserved",
        "invariants": [
          "E9-PROV",
          "E9-ORIG",
          "E9-REVOKE",
          "E9-FRESH"
        ],
        "label": "GENERATED",
        "basis": "Conditional design contract in this entry input/output; C1 or C2 explains composition once conformance is proved. Listed theory sources motivate the design but do not prove this D9 implementation. Exact values/parameters and the preserved frame must be bound."
      },
      {
        "field": "broken",
        "invariants": [
          "E9-LOCAL",
          "E9-NOEGRESS",
          "E9-GFREE",
          "E9-CNI",
          "E9-INI",
          "E9-TNI",
          "E9-PNI",
          "E9-AUDIT"
        ],
        "label": "GENERATED",
        "basis": "May-break claim, not an assertion that every invocation breaks the property. The missing guard/context named in this entry permits a violating instance; Q4 C5–C9 and the failure examples specify the relevant mechanism."
      },
      {
        "field": "output",
        "invariants": [
          "E9-ATTEN"
        ],
        "label": "GENERATED",
        "basis": "Successful-result postcondition of the authored contract; denied/conflict/error/diverging paths do not create it. A step certificate applies only to the specified substep/pair. A new state fact does not restore a violated trace policy."
      },
      {
        "field": "theory motivation",
        "references": [
          "R22 process structure",
          "R29 §III.D; component macro GENERATED"
        ],
        "label": "RESULT",
        "scope": "Published model or mechanism only; no automatic transfer to the D9 contract."
      }
    ],
    "verdict": {
      "category": "MARGINAL",
      "rigorously_known": "The cited restricted mechanisms exist; this authored transition contract still requires a conformance proof for any implementation.",
      "heuristic": "No executable D9 platform binding is claimed.",
      "main_obstacle": "Component callbacks, inherited ambient authority and interleaving must be modeled; a dispatch name is not an effect summary.",
      "obstacle_scope": "Local specification/binding gap; hyperproperty obligations are structural when unary summaries are used."
    },
    "primitive": {
      "status": "derived",
      "label": "GENERATED",
      "basis": "Relative to the explicitly chosen protected-effect algebra M; not a claim of universal computational minimality.",
      "chain": [
        "D9-X12",
        "D9-X14",
        "D9-X15"
      ],
      "argument_threading": "Attenuate initial authority, Spawn the local component with explicit context, then Join its result and accounted trace."
    }
  }
]
```

## 8. Effect-invariant vocabulary and relations

The identifiers denote parameterized predicate templates. An implementation must bind their subjects, boundary, observer, key, policy, scope and epoch explicitly. The exact definitions are authored; cited theories motivate specific mechanisms and logical classes.

```json
[
  {
    "id": "E9-PROV",
    "name": "Complete modeled provenance",
    "kind": "metadata correctness",
    "carrier": "data-value",
    "definition": "For datum v, a protected derivation DAG names every modeled data dependency and program-counter dependency that contributed to v; ingress roots are authenticated by the specified adapter. Completeness concerns the declared semantics, not unknown physical causes.",
    "class": "state",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R12 §3; R24 §§5.3–5.4",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-ORIG",
    "name": "Complete compartment-origin labels",
    "kind": "metadata correctness",
    "carrier": "data-value",
    "definition": "For v, Origins(v) is the complete set of compartment and external-ingress identifiers at the roots of its modeled dependency DAG. Derivation unions roots and never rewrites historical origins.",
    "class": "state",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R24 §§5.3–5.4; authored origin-set convention",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-GFREE",
    "name": "Known absence of guest origin",
    "kind": "integrity input classification",
    "carrier": "data-value",
    "definition": "Origins(v) is complete and intersects the policy GuestSet in the empty set. A missing or unknown origin is not a proof of this predicate. Endorsement does not change this historical fact.",
    "class": "state",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R14 integrity/endorsement discussion; R24 §5.3",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-LOCAL",
    "name": "Current explicit-payload locality",
    "kind": "confidentiality placement",
    "carrier": "system-state",
    "definition": "For fixed boundary B and root compartment W, every live modeled digital copy of a W-derived payload is at a location in B. Ciphertexts retain origins. Previously transmitted or erased copies are not live, so this state predicate does not assert historical confinement.",
    "class": "state",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "GENERATED placement predicate; R16 access-control model motivates the boundary distinction",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-NOEGRESS",
    "name": "No historical explicit egress",
    "kind": "confidentiality trace safety",
    "carrier": "execution-trace",
    "definition": "For every event in the trace, no send/store/export of a payload whose complete origin set contains W targets a location outside B. Includes designated requests, logs and replicas, but excludes unmodeled timing/occurrence inference.",
    "class": "trace",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R24 §§5.2–5.4 motivates mediated egress; exact predicate is authored",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-SIG",
    "name": "Valid signature on exact bound bytes",
    "kind": "cryptographic evidence predicate",
    "carrier": "signed-value",
    "definition": "Verify(pk, Canon(descriptor), sig)=true for the exact immutable descriptor, pinned public key and declared verification algorithm. The descriptor binding is part of the predicate. This does not identify the current owner or establish permission, freshness, or factual truth.",
    "class": "state",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R33 §§3.1–3.3",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-OWNER",
    "name": "Every accepted merge has current owner approval",
    "kind": "integrity trace safety",
    "carrier": "execution-trace",
    "definition": "Every successful merge event contains a verified signature by the owner key for that record at the commit linearization point, covering action, destination/record identity, proposed bytes or their collision-resistant digest, expected version and approval nonce. It satisfies the declared current authorization predicate at commit. Reuse control is separately E9-FRESH.",
    "class": "trace",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R33 motivates signature verification; exact application contract GENERATED",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-AUTH",
    "name": "All modeled effects authorized",
    "kind": "authority trace safety",
    "carrier": "execution-trace",
    "definition": "For every committed effect event e, Allow(Pi_at_commit, actor(e), target(e), action(e), cap(e), epoch(e)) is true. The fixed authorization predicate checks target binding, scope and live authority; possession of a label alone does not satisfy it.",
    "class": "trace",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R17 authority isolation; R19 abstract policy; exact predicate GENERATED",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-ATTEN",
    "name": "Declared capability-rights attenuation",
    "kind": "authority step relation",
    "carrier": "operation",
    "definition": "For this transition and the specified input/output capability pair, the output names the same permitted target region, no larger declared rights/bounds, and no longer lifetime than the input. Its rights set is a subset of the input rights set. This is not a statement about all ambient or transitive authority.",
    "class": "step",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R21 Chapter 2 §2.3; R16 §9.3",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-REVOKE",
    "name": "No use of a revoked capability generation",
    "kind": "authority trace safety",
    "carrier": "execution-trace",
    "definition": "After successful revocation of tuple (root, generation), every subsequent attempt to commit an effect through that generation is denied. All aliases of that generation consult the shared protected revocation state. A newly authorized grant has a different generation. In-flight commits are ordered at explicit linearization points.",
    "class": "trace",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R16 §9.3 motivates indirection; exact epoch contract GENERATED",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-FRESH",
    "name": "No replay of an accepted approval",
    "kind": "integrity trace safety",
    "carrier": "execution-trace",
    "definition": "No successful acceptance repeats a policy-defined approval identifier (issuer, scope, record/version, nonce), and each acceptance meets the modeled expiry rule. All verifiers share the relevant history or an equivalent serial version discipline. Fresh nonce generation alone does not imply this predicate.",
    "class": "trace",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R34 §8 replay/history example; exact tuple predicate GENERATED",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-AUDIT",
    "name": "Complete authenticated committed-effect log",
    "kind": "accountability trace safety",
    "carrier": "execution-trace",
    "definition": "Each committed modeled effect has one corresponding protected append record binding actor, effect, relevant parameters and prior log head. Effect commit and log append are one modeled atomic transition or the effect is not committed. Authentication does not make logged statements true or harmless to disclose.",
    "class": "trace",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "GENERATED; R19 transition-proof method and R33 signing motivate the construction",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-ERASE",
    "name": "Absence of a designated secret in modeled recoverable storage",
    "kind": "erasure state predicate",
    "carrier": "system-state",
    "definition": "At the current state, the complete declared inventory of recoverable digital copies, snapshots, backups and reconstructing key material for secret x is empty. This is a model-relative postcondition, not a physical disk, flash, forensic, recipient-memory or future-nonreintroduction guarantee.",
    "class": "state",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "GENERATED bounded-inventory predicate",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-MEDIATED",
    "name": "Complete effect mediation",
    "kind": "enforcement trace safety",
    "carrier": "execution-trace",
    "definition": "Every committed modeled effect crosses the designated trusted gate and commits using the same bound arguments and current policy epoch checked there. The gate cannot be bypassed through handlers, callbacks, retries or delegated tools. Correct mediation does not imply that the policy itself is correct.",
    "class": "trace",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R24 §5.4; exact atomic-gate contract GENERATED",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-CNI",
    "name": "Deterministic termination-insensitive confidentiality",
    "kind": "confidentiality noninterference",
    "carrier": "agent-program",
    "definition": "For the declared deterministic model, observer and low-equivalence relation, any two runs from low-equivalent initial full states that both terminate have equal designated low observations at termination. Prior observations may be retained in the low state. Time and termination differences are excluded unless explicitly added.",
    "class": "hyperproperty",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R11 §6 Theorem 6.8 motivates the formulation; R30 §§2 and 4 classify it",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-INI",
    "name": "Guest-input noninterference for trusted decisions",
    "kind": "integrity noninterference",
    "carrier": "agent-program",
    "definition": "In the declared deterministic model, any two terminating runs agreeing on initial trusted inputs and differing only in guest/untrusted input have equal trusted action-decision observations. There is no endorsement exception unless a different policy is explicitly supplied. This states absence of influence, not just absence of guest bytes in code.",
    "class": "hyperproperty",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "GENERATED dual policy; R14 endorsement distinction motivates it",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-TNI",
    "name": "Confidentiality for timed and resource observations",
    "kind": "confidentiality noninterference",
    "carrier": "agent-program",
    "definition": "For the same deterministic low-equivalence used by E9-CNI and an observation that includes its ordinary low outputs plus declared times, resource events and termination behavior, corresponding executions have identical full observer traces. The time/resource semantics and scheduler are explicitly part of the model.",
    "class": "hyperproperty",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "GENERATED strengthening; R20 timing exclusions and R24 §7 motivate it",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-EBND",
    "name": "Sound static effect upper bound",
    "kind": "static-to-step soundness relation",
    "carrier": "operation",
    "definition": "For this instantiated expression, environment and handler semantics, every emitted modeled effect belongs to its certified effect upper bound epsilon. Hidden foreign effects, handler-introduced effects and all branch alternatives are included. An annotation without a conformance proof is not this predicate.",
    "class": "step",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "R08 §5 Theorem 1 and subject reduction motivate the static-to-semantics bridge; arbitrary D9 rows GENERATED",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  },
  {
    "id": "E9-PNI",
    "name": "Probabilistic noninterference of joint observations",
    "kind": "probabilistic confidentiality",
    "carrier": "agent-program",
    "definition": "For fixed low inputs, declared scheduler/adversary class, probability model and any two secret inputs, the distributions of the complete joint low observation history are identical. Equality of the distribution of each release separately is insufficient. This is exact probabilistic secrecy, not computational indistinguishability.",
    "class": "hyperproperty",
    "source": {
      "label": "GENERATED",
      "definition_source": "This report, Q3 and contract model M",
      "motivation": "GENERATED distributional policy; R30 §7 probabilistic system representations motivate its class",
      "published_scope": "The exact D9 identifier and parameterized contract are authored, not a published implementation theorem."
    }
  }
]
```

### Relations — complete JSON array

These are implications between **facts with aligned parameters**. They are not unconditional preservation-closure rules. No equivalent relations are asserted.

```json
[
  {
    "from": "E9-PROV",
    "to": "E9-ORIG",
    "kind": "implies",
    "source": {
      "label": "RESULT, GENERATED",
      "basis": "Q3 definitions: extract the authenticated root identifiers from the complete protected dependency DAG. Same datum and same ingress/compartment model required."
    }
  },
  {
    "from": "E9-GFREE",
    "to": "E9-ORIG",
    "kind": "implies",
    "source": {
      "label": "RESULT, GENERATED",
      "basis": "Q3 definition of guest-free explicitly includes completeness of Origins(v). Same datum and GuestSet required."
    }
  },
  {
    "from": "E9-TNI",
    "to": "E9-CNI",
    "kind": "implies",
    "source": {
      "label": "RESULT, GENERATED",
      "basis": "Q4 C3: equality of the full timed observation implies equality of its ordinary-output projection, when the model, initial low-equivalence and observers are aligned."
    }
  }
]
```

## 9. Dedicated Audit Results — Q4

All invariant definitions are GENERATED. C1–C10 are the explicitly proved or reproduced report arguments. A conditional yes assumes actual transition conformance and an established initial condition; a field annotation is not such a certificate. “Under condition” identifies the exact semantic obligation or a named sufficient implementation condition, not a globally weakest architectural assumption.

| Invariant | Class | Sequentially compositional? | Settling result, counterexample, and required condition |
|---|---|---|---|
| `E9-PROV` | State | Under condition | C1: every new value is correctly derived from authenticated roots, explicit data and PC dependencies; aliases/handlers cannot corrupt the protected DAG. A tag copied by an unproved adapter is insufficient. |
| `E9-ORIG` | State | Under condition | C1: ingress roots are authenticated, derivation unions complete root sets, and no operation rewrites history. Framing binds the same datum; new operands require their own derivation. |
| `E9-GFREE` | State | Under condition | C1 on the same bound datum, or prove all roots of each newly derived value guest-free, including relevant control dependencies. Endorsement does not create this fact; C5 demonstrates the missing-PC problem. |
| `E9-LOCAL` | State | Under condition | C1 with complete live-copy inventory and destination checks for every creation/replica. C9 shows it can be restored while historical confinement remains violated. It is not noninterference. |
| `E9-NOEGRESS` | Trace | Under condition | C2 with the same B/W, complete payload-origin/event accounting, and persistent residual state. Each outgoing/log/replica destination must be checked before commit. C5 shows excluded inference channels can still leak. |
| `E9-SIG` | State | Under condition | Mathematical Verify predicate on the same bytes/key remains true when those inputs are unchanged. R33 §§3.1–3.3 plus C1 frame condition. C8 shows there is no implication to current owner approval/freshness. |
| `E9-OWNER` | Trace | Under condition | C2 and C8: exact descriptor, trusted current owner key, action/record/version/nonce binding and atomic current-owner check at successful merge. A valid old signature does not settle it. |
| `E9-AUTH` | Trace | Under condition | C2 with the declared Allow predicate, complete effect inventory, live target/scope/epoch authority and commit-time validation. Published authority isolation exists only in specified models [R17]. |
| `E9-ATTEN` | Step | Under condition, for a capability path | Subset and same-target/lifetime relations are transitive along correctly bound attenuation steps. CHERI's guarded monotonicity mechanism is R21 §2.3. This does not constrain independent grants or ambient authority. |
| `E9-REVOKE` | Trace | Under condition | C2: protected shared generation state, all-alias/all-callee consultation, and explicit ordering against in-flight commits. R16 §9.3 gives indirection motivation. Already delivered information and other generations are outside its scope. |
| `E9-FRESH` | Trace | Under condition | C2 and C8: shared accepted-approval history or equivalent serial version discipline, atomically checked/updated. Independent per-component “not previously seen” checks can accept the same approval twice. R34 §8 is the concrete replay example. |
| `E9-AUDIT` | Trace | Under condition | C2 with effect/log atomicity, protected append state and complete modeled commit metadata. Sign → Store alone does not imply completeness or rollback. Exact construction is GENERATED. |
| `E9-ERASE` | State | Under condition | C1 after inventory-empty creation, with all subsequent transitions prohibited from reconstructing/reintroducing x. The primitive postcondition alone can be broken by read/decrypt/ingress. Physical/recipient-memory erasure is unproved. |
| `E9-MEDIATED` | Trace | Under condition | C2 with a nonbypassable gate and arguments/epoch bound through commit. Handler forwarding, callbacks, child execution and retries must be covered. C8 excludes stale permits; R24 §5.4 motivates enforcement. |
| `E9-CNI` | Hyperproperty | Under relational condition; no unary pass | C3 with the same full-state low-equivalence and retained observer history. R11 §6 Theorem 6.8 establishes a restricted language theorem; R30 §4 Theorem 2 supplies a product-system route for applicable k-safety. C5/C6 defeat incomplete summaries. |
| `E9-INI` | Hyperproperty | Under relational condition; no unary pass | C3 with trusted-decision equivalence and untrusted-input variations in the declared model. This exact dual policy is GENERATED; R14 distinguishes endorsement. Scoped trust labels or valid signatures alone do not prove no guest influence. |
| `E9-TNI` | Hyperproperty | Under full observation relation; no generic guarantee | C3 must include timed/resource/termination observations and a compatible scheduler/environment. Storage-only proofs do not settle it; R20 explicitly excludes timing guarantees. No published universal device bridge verified. |
| `E9-EBND` | Step | Under condition | C4: sound instantiated bounds compose by inclusion under the declared sequence/handler rule. R08 §5 shows a checked language-specific static/semantics bridge. Arbitrary handler/foreign-tool effects invalidate the old certificate. |
| `E9-PNI` | Hyperproperty | No for marginal summaries; under joint relational condition | C6 is an exact counterexample to separately harmless releases. C3's probabilistic coupling condition is sufficient when complete public history and related successor distributions are retained. This report does not supply a general stochastic verifier or weakest bridge. |

**RESULT, GENERATED — No logical-class shortcut.** A state property is not automatically preserved by an operation; a trace safety property need not be memoryless; a hyperproperty need not fail sequential composition. For genuine full-state semantic preservation, C1 and C3 are composition arguments. The negative findings concern the weaker information stored by the proposed field lists and unsupported changes of model/interface.

## 10. Feasibility Table — Q5

This table keeps the original claim's exact reading separate from the strongest supported restricted version.

| Step | Best supporting result/input | Main gap and counterexample | Verdict |
|---|---|---|---|
| 1. Context-independent profile for every operation | Typed effect signatures and declared handler semantics [R07–R08]; instantiated contracts in M | Bare name lacks target, handler, authority, observer and context. Same Send has inside/outside effects. A universal conservative profile is possible but not an exact invocation profile. | **NEEDS REFINEMENT**; exact context-free reading **DEAD** |
| 2. Composite profile determined by step profiles | C1/C3 contract composition, C4 conservative effect union; restricted published bridge R29 Theorem 1 | Boolean lists forget preconditions, correlations, identities and histories. Identical modulo-three step profiles yield different endpoint profiles. | **MARGINAL** for conditional overapproximations; exact Boolean reading **DEAD** |
| 3. Every example is preservation of named invariants | Authored explicit-egress and owner-merge trace predicates; guest-input relational predicate | Original seeds omit history, authorization, PC dependencies and the meaning of “acts on.” Naming a hyperproperty does not make it unary-checkable. | **NEEDS REFINEMENT**; restricted meanings **MARGINAL** |
| 4. No break means the whole chain satisfies policy | C1/C2/C3 proofs; language/kernel-specific results R11/R19/R29 | Unknowns, unmet input predicates, partial operand matches, stale signatures, implicit flows and joint leakage can invalidate the inference. Required relational/monitor certificate is absent. | **DEAD** as stated; restricted certification **MARGINAL** |
| 5. Useful acceptance rate | Existing restricted languages and runtime designs; no D9 performance data | Uniform may-break profiles overreject; coarse taint may reject semantically independent results. No policy workload or accepted-chain measurements exist. | **UNVERIFIED** for D9; published restricted mechanisms support only **MARGINAL** generalization |

**RESULT, GENERATED — Known/heuristic split for these verdicts.** What is rigorous is the cited model-specific published result, the explicit inductive/relational arguments under their premises, and the finite counterexamples. What is heuristic is expected coverage or cost of an unimplemented D9 analysis. Context and transaction gaps are local specification/binding issues. Missing inter-execution/joint-distribution information is structural for a unary abstraction. Exact-profile information loss persists until the abstract domain is enriched.

## 11. Critical Obstructions

### The four expected failure modes

| Failure mode | What fails | Fatal to the whole approach? | Stated surviving subclass and replacement |
|---|---|---|---|
| Hyperproperties | Unary facts on one output/execution cannot establish agreement across executions or distributions | Fatal to an unrestricted unary pass rule; does not rule out compositional security proofs | Inductive state predicates and residual-monitor trace safety stay locally checkable. Selected relational noninterference uses C3, relational typing, self-composition/product checks or finite-state HyperLTL verification. |
| Implicit control, exceptions, timing and resource use | The observer learns from whether/when an effect occurs, not only its payload | Restricts any guarantee that omits those observations | Explicit-flow/explicit-event trace safety remains valid within its stated inventory. Modeled PC/exception flows need action-dependency guards; timed/resource confidentiality needs an enlarged semantics and corresponding relational proof. |
| Aggregation | Correct marginal guarantees fail to constrain the combined observation | Fatal to “each output harmless implies chain harmless” | Joint-history trace monitoring for syntactic release rules; joint-state/coupling or whole-chain probabilistic reasoning for semantic secrecy. Retain prior observations and their correlations at joins. |
| Context dependence | Identical names/labels denote different effects under different targets, authority, handlers or environments | Fatal to exact context-independent profiles; repairable with a stated model | Parameterized Hoare/effect/relational contracts with explicit handler and rely/guarantee assumptions; conservative context-universal profiles only give overapproximations. |

**RESULT, GENERATED — Further structural obstacles in this scaffold.** Subject identity and parameters must be part of the claim. A signature on datum A cannot become a signature on transformed B; an invariant for boundary B1 cannot silently discharge a policy for B2. A capability-rights subset is not a bound on all transitive authority. An acknowledged secret release changes the confidentiality policy; it does not preserve the unconditional policy by renaming a label. Past trace violations cannot be “restored.” A state/step fact and a program-level hyperproperty require different proof objects.

### Concrete checker requirements before any security verdict

**RESULT, GENERATED — Proposed behavior, not an implemented patch.** The following is a reviewable schema/checker proposal. These report artifacts do not modify the repository.

1. Accept an explicit required-policy list and an initial context with proved initial facts, rather than deriving the only examined invariant set from the entries that happen to mention it.
2. Bind every invariant to subject identities and parameters, including boundary/observer/key/owner/scope/epoch. Encode conjunctive operand ports, alternatives and success/error branches separately.
3. Separate current facts from preservation contracts. Apply fact implications to known facts. Compose preservation only through discharged pre/post conditions; fix the implication-closure premise problem in C7.
4. Interpret may-break as a conservative warning/obligation. Report an actual violation only with a concrete event/witness or proof of reachable loss. Keep every relevant silent claim unknown.
5. Carry residual monitor state for trace policies. An observed violation is absorbing; output creation/restoration cannot erase it. Check any suffix after creation/restoration for preservation or uncertainty.
6. For `class: hyperproperty`, refuse a unary pass. Report **“whole-chain check required”** unless a compatible relational/product-model certificate is supplied. A valid compositional relational certificate is an allowed replacement for rechecking the whole program from scratch.
7. Account for handler-introduced effects, child execution, callbacks, retries, alias/environment writes, PC dependencies and the chosen observer model. Match the implementation's complete effect surface to the abstract transition model.
8. Return an evidence-aware verdict such as **proved under stated assumptions**, **monitored prefix conforms**, **violation witnessed**, **unknown**, or **whole-chain check required**. Do not collapse all five into a Boolean pass.

**RESULT, GENERATED — Proof-status rule.** GENERATED entries cannot acquire “formal” status just because an implication is definitional or a required guard was written in prose. Any landed claim needs a source receipt for the relevant model and a separate implementation/model conformance argument when used as a platform security guarantee. A certificate for one language or kernel is not a certificate for an arbitrary agent or Android binding.

## 12. Bottom-Line Assessment

**Verdict: DEAD for the unrestricted claim.** The defensible reformulation is:

> **RESULT, GENERATED.** A D9 map may certify a chain for specified inductive state predicates and effectively checkable trace safety policies when it has proved initial conditions, instantiated transition contracts, complete effect/identity/handler bindings, compatible environment assumptions, and any required residual monitor state. Absence of a break label is insufficient. Hyperproperties require appropriate relational certificates or whole-chain/product-model checks; some of those certificates compose. Usefulness for this D9 proposal remains unmeasured.

The gap is local when the missing evidence is an endpoint parameter, trusted label adapter, current-owner check, atomic update, initial fact or frame condition. It is structural for the current unary representation when truth depends on multiple executions, joint observations, or history that the representation discards. A new `class` field identifies the proof obligation; it does not discharge it.

### Reproducibility and artifact status

**RESULT, GENERATED — Eleven checks passed.** The companion package contains the JSON arrays, carrier proposal, source ledger, `counterexamples.mjs`, literal upstream compose logic with parser/evidence stubs, snapshot identity, and the generated result file. After extraction, run `node counterexamples.mjs` to reproduce the exact finite checks. They test the named finite examples and current composition-function branches. They are not a cryptographic implementation test, platform proof, whole-repository test suite, or D9 completeness/utility benchmark. The all-formal evidence stub isolates logical behavior; it does not create real formal receipts.

**RESULT — Outstanding source limits.** Original theorem text for the inaccessible requested historical/overview papers remains unverified, as individually documented. No original theorem number or purported universal weakest composition assumption has been invented. No operation/invariant proposal has been landed, and no Android or prior-art task has been substituted for this prompt.

## 13. Bibliography — full identifiers and verification status

**[R01]** David K. Gifford and John M. Lucassen (1986). *Integrating Functional and Imperative Programming*. ACM LISP and Functional Programming (LFP), pp. 28–38. Identifier: 10.1145/319838.319848. [Primary document or verification route](https://doi.org/10.1145/319838.319848). **Verification:** Publisher metadata and bibliography verified; original full text not retrieved. No original theorem number verified.

**[R02]** Jean-Pierre Talpin and Pierre Jouvelot (1992). *The Type and Effect Discipline*. 7th IEEE Symposium on Logic in Computer Science (LICS), pp. 162–173. [Primary document or verification route](https://lics.siglog.org/1992/TalpinJouvelot-Thetypeandeffectdis.html). **Verification:** Official conference abstract and bibliographic record verified. Detailed original soundness theorem not retrieved.

**[R03]** Flemming Nielson and Hanne Riis Nielson (1999). *Type and Effect Systems*. Correct System Design, LNCS 1710, pp. 114–136. Identifier: 10.1007/3-540-48092-7_6. [Primary document or verification route](https://orbit.dtu.dk/en/publications/type-and-effect-systems/). **Verification:** Author institution metadata verified. Full chapter and theorem numbering not retrieved.

**[R04]** Gordon Plotkin and John Power (2001). *Semantics for Algebraic Operations*. Electronic Notes in Theoretical Computer Science 45, pp. 332–345. Identifier: 10.1016/S1571-0661(04)80970-8. [Primary document or verification route](https://www.sciencedirect.com/science/article/pii/S1571066104809708). **Verification:** Publisher abstract and bibliographic identity verified; full text not retrieved.

**[R05]** Gordon Plotkin and John Power (2002). *Notions of Computation Determine Monads*. FoSSaCS, LNCS 2303, pp. 342–356. [Primary document or verification route](https://www.research.ed.ac.uk/en/publications/notions-of-computation-determine-monads/). **Verification:** Author institution abstract and bibliographic identity verified. No general security theorem inferred.

**[R06]** Gordon Plotkin and John Power (2003). *Algebraic Operations and Generic Effects*. Applied Categorical Structures 11, pp. 69–94. Identifier: 10.1023/A:1023064908962. [Primary document or verification route](https://doi.org/10.1023/A:1023064908962). **Verification:** Bibliographic identity verified; original theorem proof and number not retrieved.

**[R07]** Gordon Plotkin and Matija Pretnar (2009). *Handlers of Algebraic Effects*. ESOP, LNCS 5502, pp. 80–94. [Primary document or verification route](https://www.pure.ed.ac.uk/ws/portalfiles/portal/17909848/Plotkin_Pretnar_2009_Handlers_of_Algebraic_Effects.pdf). **Verification:** Full author manuscript read; Sections 2–4 supply signatures, computations and handlers. Not a theorem about arbitrary security handlers.

**[R08]** Daan Leijen (2014). *Koka: Programming with Row Polymorphic Effect Types*. MSFP; EPTCS 153, pp. 100–126. Identifier: 10.4204/EPTCS.153.8; arXiv:1406.2061. [Primary document or verification route](https://arxiv.org/pdf/1406.2061). **Verification:** Full paper read; Section 5 Theorem 1, Lemma 1; Section 6 purity results. Results apply to the paper language.

**[R09]** Dorothy E. Denning (1976). *A Lattice Model of Secure Information Flow*. Communications of the ACM 19(5), pp. 236–243. Identifier: 10.1145/360051.360056. [Primary document or verification route](https://doi.org/10.1145/360051.360056). **Verification:** Publisher abstract and author bibliography verified. Model also described in R11 Section 2. No unverified theorem attributed to this paper.

**[R10]** Joseph A. Goguen and José Meseguer (1982). *Security Policies and Security Models*. IEEE Symposium on Security and Privacy, pp. 11–20. Identifier: 10.1109/SP.1982.10014. [Primary document or verification route](https://www.cs.purdue.edu/homes/ninghui/readings/AccessControl/goguen_meseguer_82.pdf). **Verification:** Original scan read; noninterference in deterministic system models. Exact theorem number not relied on.

**[R11]** Dennis Volpano, Geoffrey Smith and Cynthia Irvine (1996). *A Sound Type System for Secure Flow Analysis*. Journal of Computer Security 4(2–3), pp. 167–187. Identifier: 10.3233/JCS-1996-42-304. [Primary document or verification route](https://course.ece.cmu.edu/~ece732/s26/readings/secure-types.pdf). **Verification:** Full original paper in a later printout read; Section 6 Theorem 6.8 proves equality of final low values when both runs terminate.

**[R12]** Andrew C. Myers and Barbara Liskov (1997). *A Decentralized Model for Information Flow Control*. 16th ACM Symposium on Operating Systems Principles (SOSP), pp. 129–142. Identifier: 10.1145/268998.266669. [Primary document or verification route](https://www.cs.cornell.edu/andru/papers/iflow-sosp97/paper.html). **Verification:** Author-hosted indexed text verified, especially Sections 3 and 5; direct fetch failed. No complete original soundness theorem independently verified.

**[R13]** Andrei Sabelfeld and Andrew C. Myers (2003). *Language-Based Information-Flow Security*. IEEE Journal on Selected Areas in Communications 21(1), pp. 5–19. [Primary document or verification route](https://www.cs.cornell.edu/andru/papers/jsac/sm-jsac03.pdf). **Verification:** Bibliographic identity and indexed text verified; direct full-text retrieval failed. Detailed original results not independently verified here.

**[R14]** Andrei Sabelfeld and David Sands (2009). *Declassification: Dimensions and Principles*. Journal of Computer Security 17(5), pp. 517–548. Identifier: 10.3233/JCS-2009-0352. [Primary document or verification route](https://cs.yale.edu/homes/dsc5/papers/sabelfeld-sands-jcs07.pdf). **Verification:** Full author manuscript read; Section 2 four dimensions, integrity/endorsement distinction; section numbering refers to that manuscript.

**[R15]** Jack B. Dennis and Earl C. Van Horn (1966). *Programming Semantics for Multiprogrammed Computations*. Communications of the ACM 9(3), pp. 143–155. [Primary document or verification route](https://bitsavers.trailing-edge.com/pdf/mit/rle_pdp1/ProgramSemantics_Dennis_VanHorn_1966.pdf). **Verification:** Original scan read; computations, processes, objects and capabilities. Modern confidentiality properties are not attributed to this model.

**[R16]** Mark Samuel Miller (2006). *Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control*. PhD dissertation, Johns Hopkins University, May 2006. [Primary document or verification route](https://papers.agoric.com/assets/pdf/papers/robust-composition.pdf). **Verification:** Full thesis consulted; Sections 9.2–9.3 for connectivity and selective revocation; no theorem that revocation retracts information already delivered.

**[R17]** Sergio Maffeis, John C. Mitchell and Ankur Taly (2010). *Object Capabilities and Isolation of Untrusted Web Applications*. IEEE Symposium on Security and Privacy. [Primary document or verification route](https://theory.stanford.edu/~ataly/Papers/sp10.pdf). **Verification:** Full text consulted; authority-safety/isolation definitions, Theorems 1 and 4 checked in the paper models. Corrected the prompt title from Software to Web Applications.

**[R18]** Gerwin Klein, Kevin Elphinstone, Gernot Heiser, June Andronick, David Cock, Philip Derrin, Dhammika Elkaduwe, Kai Engelhardt, Rafal Kolanski, Michael Norrish, Thomas Sewell, Harvey Tuch and Simon Winwood (2009). *seL4: Formal Verification of an OS Kernel*. ACM Symposium on Operating Systems Principles (SOSP), pp. 207–220. [Primary document or verification route](https://isabelle.in.tum.de/~kleing/papers/sosp09.html). **Verification:** Author and project publication records verified; the 2009 functional-correctness result is distinguished from later security theorems. Full 2009 paper retrieval failed.

**[R19]** Thomas Sewell, Simon Winwood, Peter Gammie, Toby Murray, June Andronick and Gerwin Klein (2011). *seL4 Enforces Integrity*. Interactive Theorem Proving (ITP), pp. 325–340. [Primary document or verification route](https://sel4.systems/Research/pdfs/sel4-enforces-integrity.pdf). **Verification:** Full paper read; Section 4.1 explicitly uses sequentially composable Hoare triples for a transitive integrity relation.

**[R20]** Toby Murray, Daniel Matichuk, Matthew Brassil, Peter Gammie, Timothy Bourke, Sean Seefried, Corey Lewis, Xin Gao and Gerwin Klein (2013). *seL4: From General Purpose to a Proof of Information Flow Enforcement*. IEEE Symposium on Security and Privacy, pp. 415–429. [Primary document or verification route](https://sel4.systems/Research/pdfs/sel4-from-general-purpose-to-proof-information-flow-enforcement.pdf). **Verification:** Full paper read; Sections IV–V security model/proof and discussion of timing exclusions. The published system configuration and assumptions are essential.

**[R21]** Robert N. M. Watson and coauthors (2023). *Capability Hardware Enhanced RISC Instructions: CHERI Instruction-Set Architecture (Version 9)*. University of Cambridge Computer Laboratory Technical Report UCAM-CL-TR-987. Identifier: 10.48456/tr-987. [Primary document or verification route](https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-987.pdf). **Verification:** Architecture specification read; Chapter 2, especially Section 2.3, for capability integrity and monotonicity. This is a fixed version, not a claim about the latest architecture.

**[R22]** Robin Milner, Joachim Parrow and David Walker (1992). *A Calculus of Mobile Processes, I and II*. Information and Computation 100(1), pp. 1–40 and 41–77. [Primary document or verification route](https://www.pure.ed.ac.uk/ws/portalfiles/portal/16426068/A_Calculus_of_Mobile_Processes_II.pdf). **Verification:** Author publication records and Part II manuscript consulted; communication, name restriction and mobility. No confidentiality theorem follows from untyped restriction alone.

**[R23]** Matthew Hennessy and James Riely (1998; journal version 2002). *Resource Access Control in Systems of Mobile Agents*. 1998 HLCL extended abstract; 2002 Information and Computation 173(1), pp. 82–120. Identifier: 10.1006/inco.2001.3089 (journal version). [Primary document or verification route](https://fpl.cs.depaul.edu/jriely/papers/1998-rac.pdf). **Verification:** 1998 author manuscript read, Sections 2–4; it states subject reduction/type safety and explicitly omits proofs. 2002 publisher abstract/identity verified; full journal proofs not retrieved.

**[R24]** Edoardo Debenedetti, Ilia Shumailov, Tianqi Fan, Jamie Hayes, Nicholas Carlini, Daniel Fabian, Christoph Kern, Chongyang Shi, Andreas Terzis and Florian Tramèr (2025). *Defeating Prompt Injections by Design*. arXiv:2503.18813v2, 24 June 2025. Identifier: arXiv:2503.18813v2. [Primary document or verification route](https://arxiv.org/html/2503.18813v2). **Verification:** Full paper read; Sections 5.2–5.4, 6.4, 7 and 9. NORMAL/STRICT modes and acknowledged side channels delimit the guarantee.

**[R25]** Daryl McCullough (1987). *Specifications for Multi-Level Security and a Hook-Up Property*. IEEE Symposium on Security and Privacy, pp. 161–166. [Primary document or verification route](https://www.mais.informatik.tu-darmstadt.de/WebBibPHP/papers/2002/2002ieee-ssp.pdf). **Verification:** Identity/pages confirmed through R28 references and bibliographic records; original theorem text not retrieved.

**[R26]** Daryl McCullough (1988). *Noninterference and the Composability of Security Properties*. IEEE Symposium on Security and Privacy, pp. 177–186. Identifier: 10.1109/SECPRI.1988.8110. [Primary document or verification route](https://doi.org/10.1109/SECPRI.1988.8110). **Verification:** Bibliographic identity verified. Original text/theorem numbering not retrieved; conflicting secondary page citation was not used.

**[R27]** Aris Zakinthinos and E. S. Lee (1995; 1996; 1997). *The Composability of Non-Interference; How and Why Feedback Composition Fails; A General Theory of Security Properties and Secure Composition*. IEEE CSFW 1995, pp. 2–8; CSFW 1996, pp. 95–101; IEEE S&P 1997, pp. 94–102. [Primary document or verification route](https://www.ieee-security.org/Cipher/ReadersGuide/archive/SP97-paperlist.html). **Verification:** Titles/years/pages cross-checked with R28 references and original 1997 IEEE program. Original proofs not retrieved; no exact theorem attributed to them.

**[R28]** Heiko Mantel (2002). *On the Composition of Secure Systems*. IEEE Symposium on Security and Privacy, pp. 88–101. Identifier: 10.1109/SECPRI.2002.1004364. [Primary document or verification route](https://www.mais.informatik.tu-darmstadt.de/WebBibPHP/papers/2002/2002ieee-ssp.pdf). **Verification:** Full paper read; Section 4 Lemma 1 (Generalized Zipping Lemma), Theorem 3 and explicit interface hypotheses; Section 7 discussion of noncompositional generalized noninterference.

**[R29]** Heiko Mantel, David Sands and Henning Sudbrock (2011). *Assumptions and Guarantees for Compositional Noninterference*. IEEE Computer Security Foundations Symposium (CSF), pp. 218–232. [Primary document or verification route](https://www.mais.informatik.tu-darmstadt.de/WebBibPHP/papers/2011/2011-CSF-MantelSandsSudbrock-AssumptionsAndGuaranteesForCompositionalNoninterference.pdf). **Verification:** Full paper read; Section III.D, Theorem 1 (Compositionality), requires sound use of modes for SIFUM-secure commands.

**[R30]** Michael R. Clarkson and Fred B. Schneider (2010). *Hyperproperties*. Journal of Computer Security 18(6), pp. 1157–1210. Identifier: 10.3233/JCS-2009-0393. [Primary document or verification route](https://cse.msu.edu/~borzoo/teaching/20/825/papers/Hyperproperties.pdf). **Verification:** Full published paper read; Sections 2, 4 and 5; Section 4.2 Theorem 2 reduces k-safety to safety of the k-fold system. Not all information-flow definitions are 2-safety.

**[R31]** Bernd Finkbeiner, Markus N. Rabe and César Sánchez (2015). *Algorithms for Model Checking HyperLTL and HyperCTL**. Computer Aided Verification (CAV), LNCS 9206, pp. 30–48. [Primary document or verification route](https://finkbeiner.groups.cispa.de/_assets/paper.CrozMbg4.pdf). **Verification:** Full author manuscript read; Section 3 automata-based model checking of finite-state systems, including alternation-free fragments. Does not make arbitrary programs decidable.

**[R32]** Fred B. Schneider (2000). *Enforceable Security Policies*. ACM Transactions on Information and System Security 3(1), pp. 30–50. Identifier: 10.1145/353323.353382. [Primary document or verification route](https://ecommons.cornell.edu/entities/publication/5a936aa1-8a4f-41df-bc17-f2db479cf33e). **Verification:** Author repository abstract and publisher identity verified; full original proof not retrieved. Execution-monitor scope is recorded without transferring an unverified theorem to the D9 monitor.

**[R33]** National Institute of Standards and Technology (2023). *Digital Signature Standard (DSS)*. FIPS 186-5. Identifier: 10.6028/NIST.FIPS.186-5. [Primary document or verification route](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.186-5.pdf). **Verification:** Standard read; Sections 3.1–3.3 distinguish trusted key association, generation, and verification. Application authorization and freshness are additional predicates.

**[R34]** Eric Rescorla (2018). *The Transport Layer Security (TLS) Protocol Version 1.3*. IETF RFC 8446. Identifier: 10.17487/RFC8446. [Primary document or verification route](https://www.rfc-editor.org/rfc/rfc8446.html). **Verification:** Section 8 (0-RTT and Anti-Replay) read; used only as a concrete replay/history example, not as a theorem about all signed messages.
