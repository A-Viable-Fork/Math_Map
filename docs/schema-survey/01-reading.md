# Schema survey: reading before generation

Date: 2026-11-13. Kind: truth for the readings, inferred for the design implications. Commission: the operator's five-phase survey. Scope: documents and disposable pilots; the operator decides what lands in the production data.

## Pins and coverage

| Repository or branch | Commit read | Coverage |
|---|---|---|
| Math_Map, main, survey base | `c6f8381284f67cf9e984dd75e00350a756f18880` | CLAUDE.md and its imported conventions first; AGENTS.md; README.md; STATUS.md; mapfill/README.md; map.json's shape; compose.mjs, evidence.mjs, misalign.mjs, excerpt.mjs; relationOf and clustersOf in build.mjs; parser, conditions, formal and binding contracts; all eight main-branch inbound notes |
| Math_Map, claude/strict-evidence | `b3f746c622d40109d5fd43650d3d288897710298` | reports/STRICT-READING.md, especially the strict evidence rule, sampling limitations and falsification hunt; read as a branch finding, not merged into the survey base |
| Math_Map, claude/project-thread-0tisrv | `2e6b13969e1412635ae3738b40f75d2403e2c45c` | Additional inbound schema stress-test note, absent from main |
| The_Smell_of_Knowledge | `8b91372ef74f3695f9aabf5e7572268fcf6ad973` | README.md; theory atlas, boundary crossing, documentation, regional construction and departure sections of The_Smell_of_Knowledge_v1_5.md |
| Research_OS, default branch | `e0415aae8b3e4d664fb0657e1758e2d113035948` | Instructions, README, HANDOFF, bindings.json, mapread.mjs, ingest/link findings and two decompositions |
| Research_OS, PR 22, claude/project-thread-0tisrv | `cd24c40c6b30097cd500045b4e5e87e5e9e623c1` | findings/math-map-stress-test-2026-11-06.md, all sections |
| Formalization, claude/gifted-gates-3blhch | `ec4d139c8ca16290a4b7168e9ca5dbbbdc5c175c` | Instructions, HANDOFF, reports/2026-11-06-map-intake-stress.md, all sections including the later gold-standard update |
| Phone, default branch | `4d061e5fe02d8e24c1c1f8f3986f65057af0cc6a` | Instructions, HANDOFF, apps/regulator/android/app/src/main/java/org/aviablefork/regulator/Typed.java |

Read: public repositories were cloned. The session exposes no add_repo capability. Private repositories were read through the authorized GitHub connection into separate local snapshots. Those repositories were not changed. Source hashes and selected verbatim windows with offsets are in [01-reading-sources.json](01-reading-sources.json). No external prior-art search has been run for this survey.

Read: main's generated map identifies its build as `42c6df3a586ff23e8754b75025cc1838abccb547`, while the checkout is `c6f8381`. Both identities matter. A consumer pin and an entry contract version are different things.

## What the map currently holds

Read at the survey base: 2,066 entries, 2,049 anchorable, 11,236 unchecked fields, 10 entries with conditions, 64 entries with declared actsOn typing (20 mathematical, 44 D9), 513 entries with relation metadata and 29 clusters. These counts were recomputed from map.json; they agree with STATUS.md where it reports them. This is a substantial existing evidence debt before another data kind is added.

| Layer | Fields or records read | Present consumer and limit |
|---|---|---|
| Entry | id, domain, name, kind, tags; description, input, output, preserved, broken; complexity, status | Text and MCP search; the short fields often combine several different claims |
| Provenance and evidence | origin, tier, field evidence, invariant claims, receipts, corrected/landed text, flags, reading, landedAs | evidence.mjs, audit, parser, reports; formal-link match is a judgment about a quoted statement |
| Declared operation contract | actsOn joint input/output kinds; named preserved/broken/output invariants; context labels; combinator | compose.mjs; carrier joins, invariant propagation, contextual violations and external whole-chain proof citations |
| Hypotheses and negative cases | conditions text, counterexamples, conditionReceipts | Parser validates receipt occurrence; display exposes them; compose does not evaluate predicates or discharge these conditions |
| Formal realization | Mathlib links at 380f2aa, exact/general/special/related/ingredient/conflicts, additive twins; own Lean claims and audit | formal.mjs, lean.mjs, evidence.mjs, Research_OS ingest; external project proofs have no persistent registry here |
| Platform realization | Android and NixOS binding rows at pins, source hashes, primitive and contract assurance | Parser and display; static generated claims, separated from device/host tests |
| Relation | relation.cluster, clusterNote, iso, departure, cloneStatus or whole note; clusters keyed by id with members/index prose | build.mjs and get_entry expose it; clone resolver uses landed pointers; no callable entry-to-entry transition certificate |

Read: compose.mjs reads named kinds and invariant links, rather than the prose conditions, cluster index or text intertwinings. It reports the weakest evidence for its asserted joins and invariant results. It distinguishes implications about state from implications about preservation. Relational and hyperproperty claims require whole-chain evidence; the proof citation is supplied per call. Input operands are joint requirements, but their identity across steps is not bound by a variable environment.

Read: evidence.mjs combines grades, corrections, addition receipts, Mathlib links, own Lean claims and invariant links. It does not establish that a quoted heading entails a compound prose claim. Read: misalign.mjs emits lexical leads and respects human readings; it never flags automatically, skips pointers/clones and misses damage sharing a word with the name. Inferred: neither receipt occurrence nor name overlap is a semantic verifier.

## Consumer: atlas and its interpreters

Read, The Smell of Knowledge, lines 139 to 149 at the pin: the theory atlas aggregates dependencies, abstractions, technique clusters, bridging patterns, density and axiom dependencies. Its short defining passage is:

> Each relation is a chart; the atlas is the collection, compatible on overlaps.

Read, the next sentence makes shared identity operational: a theorem seen in dependency and technique charts is the same theorem, and changing its formal statement propagates to both. Lines 145 to 149 require choices about chart organization, regional recomputation and locally authored regions. The paper explicitly offers functional specification, input, output, preserved and broken structure, as one chart organization.

Read: the paper describes structural deduplication by isomorphism hypotheses and clones with departure metadata (lines 221 and 263 to 265). The reference atlas proposes estimated citation neighborhoods; it does not inherit the theory atlas's verification status. Its departure compost pile records where a mathematical pattern stops fitting phenomena (line 334). Imported work awaits local retyping before it can support downstream standing (lines 127 to 135).

Unknown: there is no implemented map reader in this repository. Read: its text contains no definition named transition map or cocycle condition. Inferred: an executable transition would need to specify what shared identity, objects, claims and hypotheses mean on an overlap, which direction transport runs, and which departures remain. Cocycle verification and the point at which an isomorphism degrades to analogy are additional survey candidates, not specifications quoted from the paper. The paper's chart is a relational view over a library, not automatically a coordinate chart on a manifold.

What it reads now: conceptual operation specifications and the verified library, through trained interpreters. What it keeps outside Math_Map: axioms and their discharge/retraction, negative constraints and reopening conditions, technique organization, chart compatibility, local admission, reference estimates, phenomenological departures. What it asks of an operation map, inferred from the quoted sections: stable shared identity, transportable typed techniques, departures, dependencies and local recomputation boundaries.

## Consumer: Research_OS ingest, record, link and certificates

Read, mapread.mjs at `e0415aa`: reads map.json, the formal pin, carrier vocabulary and typeEntries(). Emits id/domain/name/tier/flag, five text fields, evidence, formal links with additive twins, own Lean claims and inferred input/output kinds. Declared actsOn is absent from this projection, as are conditions and the newly exported relation layer. Inferred: adding a field to map.json alone does not make it visible to this consumer.

Read, bindings.json: its own note says code bindings are "Kept here until Math_Map takes code bindings." Five rows associate functions with D9-X28, X20, X29, X07 and X20 then X29, with departures, tests and one external proof citation. The map pin there is e1bcb83. The record/link rows keep crash atomicity, key boundaries, effect-free reading and policy-filter departures outside the map.

Read, stress-test finding at `cd24c40`: asks for a realization envelope, per-entry contract hash, stored chain proofs, independent observations and the crossing between assurance ladders, binding postconditions/read-backs, missing X28/X29 platform bindings, reviewed sameAs, declared typing exposed to ingest, retirement of repetitive status, coverage rounds and operand/scope rules. These are its proposals, awaiting rulings. Its count of commits behind main describes its own historical pins, not today's branch distance.

Read, ingest/link findings at `e0415aa`: type signatures alone produced false mappings; anchors map an operation's API, but an overly broad type anchor overassigns inner operations. Duplicate anchors were deliberately linked on one side to avoid manufacturing composites. Inferred: identity, the role of an anchor and the statement/proof dependency distinction matter more than another similarity score.

Secondary: the stress report says the modular-addition certificate binds a checkpoint, software version and thread count, but no map entry describes that operation. Its certificate build was not rerun here. Such a model realization needs both a typed operation and an independently checkable artifact reference; checkpoint identity alone is insufficient.

## Consumer: Formalization intake and proof verifier

Read, intake report at `ec4d139`: consumes the text claims, formal pin, entry ids, relation prose and transform routes. Its probes are preserved in reports/intake/ and Bridges/Bridges/Laplace.lean, because the map cannot express the needed claim structure. The report describes 35 theorems and later gold-standard checking of 23 exposed results. Secondary: these builds and six-kernel replays were not rerun here; reading a report is evidence of what it reports, not a fresh proof run.

What it keeps elsewhere: a claim-kind classification of preserved/broken items; missing hypotheses by claim; input-dependent convergence regions; intertwining formulae; directed limit theorems; worked transform instances; a failed converse; route rules; shape flags and proposed external proof links. Its example of final-value failure is e^(it): the transform-side limit can exist while the original function has no limit.

| Its nine schema proposals, section 7 | Survey disposition at reading time |
|---|---|
| 1. Retain ISO / DEP / CS and cluster index | Read: already folded into main by the integrity work; transition data remain absent |
| 2. Flag D8 misalignment and add a lead check | Read: main records fourteen new flags, including one more than the intake list; checker emits leads |
| 3. Intertwining slot with direction, conditions, evidence | Open proposal; first-class rules are absent |
| 4. Typed entry relations, including inverse, adjoint, dual, implements, special case, sameAs | Open proposal; cluster prose is not these edges |
| 5. Claims with kind, direction, conditions and quantities | Open proposal; per-invariant evidence exists, full claim structure does not |
| 6. Entry nature and operation shape | Open proposal; existing kind does not distinguish theorem/existence/algorithm or dependent output |
| 7. Mathematical status distinct from map evidence | Open proposal; avoid confusing theorem truth with whether this row is checked |
| 8. Uses as problem classes | Open proposal; current text search is the workaround |
| 9. MCP related, intertwinings and routes queries | Open proposal; retrieval requires the preceding data and explicit consumer work |

Inferred: the report's strongest demand is fidelity at claim granularity. The Laplace probe required conditions for every attempted claim, and the route rule could be absent even when the transform entry existed. Its sample and route list were chosen/read by one grader. They are bounded findings rather than corpus-wide error estimates.

## Consumer: Phone's Regulator

Read, Typed.java at `4d061e5`: hardcodes D9 ids in action specifications. Each specification stores action, chain, binding, predicted postcondition, readBack and a predicate holds(output); JSON exports chain/binding/predicts. freeze uses X44,X42; thaw uses X43; nolocation uses X06; suspend/unsuspend use X42/X43; route uses X12. It does not load map.json at runtime in this file.

What it keeps in Java: platform call text, public action semantics, package input checking, predicted disabled/process/permission/suspension/firewall results, read-back programs and predicates. Read: some predicates infer success from absent matching output. Inferred: an empty/error read-back must be distinguished from a checked negative result before observations can carry assurance. No action or device experiment was run here.

Secondary: the stress test reports observations.jsonl in the Regulator's own shape. Typed.java's comment calls its service read-back a reading and names the probe app as independent observer. This distinction agrees with Math_Map's 2026-10-23 ruling: one run is a reading; independent reproduction can raise a contract at most to monitored, tied to that public build.

What it asks: binding-specific postconditions and read-back contracts, reproducible observations with independent observers, D9 lifecycle bindings, reusable code bindings and an operand environment linking the same principal and authority across steps. The observation grade, source assurance and mathematical claim evidence need separate fields.

## Every inbound note

All rows are read at main `c6f8381`, except the final branch note. Historical environment claims are recorded as proposals' premises and were not rechecked against current Android releases.

| Note | Consumer's lack and request | What the survey must preserve |
|---|---|---|
| 2026-10-11-compose-findings.md | Oscillation history, dropped relational evidence, output closure, unknown invariants, verdict order, unknown joins and missing checks | Read: most changes folded in, ordering retained, unknown-join evidence declined; keep scope and overridden evidence explicit |
| 2026-10-11-from-research-os.md | Journal-native signed append and byte-preserving union | Read: X28 as specialization and X29 landed; convergence proof remains external; specialization is a relation worth recording |
| 2026-10-14-mathlib-algebra-leads.md | Defining anchors, additive twins, duplicate identity, coarse typing and missing inner operations | Read: some links/twins landed; duplicate home decisions remain distinct from mere matching names |
| 2026-10-22-flow-d-grading.md | Export from contaminated process, attenuation after sending, bounded redirects, moved platform pin | Preserve process context versus datum label; loop bounds and applicability by pin; no silent migration of observations |
| 2026-10-22-from-unattested.md | Atomic logged effects; host presentation operation; deliberate guest-origin break | Read: combinator support exists in compose; distinguish restriction on fetch-free styling from a universal CSS claim, and intended break from defect |
| 2026-10-22-observations-from-the-regulator.md | Observation ledger, independent reproduction, lifecycle entries, setting interpretation and UID firewall binding | Read: ruling now in CLAUDE.md, lifecycle operations exist; observation schema and some bindings remain consumer-side |
| 2026-11-06-from-formalization.md | Dropped relations, D8 damage, nine schema proposals, external Laplace proofs and two corrections | Integrity portion resolved; external theorem admission and structured claims remain proposals |
| 2026-11-06-from-formalization-verdict.md | Records verification and partial uptake of the preceding note | Read: schema and Laplace portions explicitly wait; survey cannot mark them landed |
| 2026-11-06-schema-stress-test-from-research-os.md, branch `2e6b139` | Realizations, contract pins, chain proofs, observations, sameAs, typing, coverage and operand/scope gaps | Read as additional unmerged proposal; preserve private realization rows in their source repository |

## Strict reading and falsification hunt

Read at `b3f746c`: the strict rule confirms a field only when quoted windows state every part. A name, heading or bibliography label cannot receipt a relation. In the blind sample 38 of 100 previously confirmed fields are downgraded, 32 to imprecise and 6 to unsupported; this is a sample of a prior review's confirmed stratum, not all map entries. The targeted sweep is unblinded. Long quotes miss parts as well as short ones.

Read: the hunt attacked forty high-specificity fills, finding eleven imprecisions: four read, two inferred, five recalled. The recalled five remain receipt leads. Examples relevant to the survey: finite down-sets versus local finiteness in Moebius inversion (inferred); characteristic zero in Whitehead's lemmas (read); a quotient missing from H^1 (read); convergence strength of the Atiyah-Hirzebruch spectral sequence (read); monotone versus antitone Galois-connection composition (read); positive versus signed measures and Fourier sign conventions (inferred). Other leads concern Ore denominators, operadic dual/cooperad conventions, polymorphism domains, constant-free coherence and accessible localization (recalled in the report).

Inferred: receipts must attach to atomic propositions with explicit direction, predicates, parameters and conventions. Counterexamples should name the exact proposed generalization they refute. A source saying an object exists cannot confirm all properties of that object. The survey will count mechanically checked receipts separately from semantic checks, numerical readings and universal proof obligations.

## Reading handoff

Inferred design question for generation: which minimal records let a real consumer perform one additional checked function without copying another store's authority or multiplying unchecked claims? Generation will enumerate broadly before external prior art is searched. Pilots will use real entry ids, preserve current data, state their assumptions and fail closed on unknowns. Nothing here settles the operator's schema decisions.
