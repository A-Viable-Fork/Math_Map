# Schema survey, phase 1: what each consumer reads, keeps elsewhere, and asked for

Date: 2026-11-13. A reading, with nothing generated: the candidates come in `02-generation.md`. Every statement below is a truth claim and carries a mark: **read** (seen in the tree at the commit named), **measured** (computed here from `map.json` at that commit), **inferred**, **recalled**. A quotation is verbatim from the file and commit named beside it.

## Trees read

| Repository | Commit | Note |
|---|---|---|
| Math_Map | `c6f8381` (main; `map.json` built from `42c6df3`) | the working tree |
| Math_Map, branch `claude/strict-evidence` | `b3f746c` | `reports/STRICT-READING.md` lives only here; main has `reports/SECOND-READING.md` (read) |
| The_Smell_of_Knowledge | `8b91372` | `The_Smell_of_Knowledge_v1_5.md`, 658 lines |
| Research_OS | `e0415aa` (default) | `bindings.json`, `functions/mathlib-ingest/mapread.mjs` |
| Research_OS, branch `claude/project-thread-0tisrv` | `cd24c40` | `findings/math-map-stress-test-2026-11-06.md` lives only here (read: every branch head scanned for it) |
| Formalization, branch `claude/gifted-gates-3blhch` | `ec4d139` | `reports/2026-11-06-map-intake-stress.md`; the default branch at `071e8c4` does not hold it (read) |
| Phone | `4d061e5` | `apps/regulator/.../Typed.java`, `Observe.java` |

Three of the files the commission names sit on unmerged branches. They are read at the commits above and cited by them; whether they merge is the operator's call.

## 1. The map as it stands

**Shape (measured).** `map.json` has nine top-level keys: `about`, `builtFrom`, `domains`, `vocabulary` (28 landed tags; 42 distinct tags are in use once D9's are counted), `invariants` (74 carriers, 59 terms, 5 relations, receipted links), `origins`, `counts`, `clusters` (29) and `entries` (2066). Every entry carries sixteen keys: `id`, `domain`, `name`, `kind`, `tags`, `description`, `input`, `output`, `preserved`, `broken`, `complexity`, `status`, `origin`, `anchorable`, `evidence`, `tier`. The rest are sparse:

| Key | Entries | What it holds |
|---|---|---|
| `relation` | 513 | landed ISO / DEP / CS: cluster id, cluster note, departure, clone status; unchecked |
| `landedAs` | 284 | a clone's or pointer's landed text |
| `auditVerdict` | 118 | worst field verdict of an audited entry |
| `formal` | 94 | Mathlib links: field, declaration, file, match grade, note, optional `whole`, `premise`, `twin` |
| `receipts` | 68 | an addition's verbatim windows |
| `invariants`, `actsOn`, `claims` | 64 | named invariants preserved, broken, output; carrier kinds in and out; evidence per claim |
| `android`, `nixos` | 27 each | platform bindings with two assurance grades, `breaks`, a note |
| `corrected` | 22 | corrected fields with the landed text kept |
| `reading` | 20 | how an ambiguous fill was read |
| `flag` / `flagResolved` | 15 / 6 | misalignment flags |
| `lean` | 12 | claims proved in this repository's Lean project |
| `conditions`, `counterexamples`, `conditionReceipts` | 10 | one prose condition per entry, a list of counterexample cases, receipts |

Entry `kind` takes four values: Transformer 1696, Constructor 295, Correspondence 74, Combinator 1 (measured). Invariant terms carry a `class`: state 35, step 7, trace 10, relational 6, hyperproperty 1 (measured).

**What is typed (read, `STATUS.md` and `reports/TOPOLOGY.md`).** 64 entries carry declared typing: 20 mathematical, 44 in D9. The composition checker runs on those. The free typing pass proposes kinds on both sides for 862 of 2066 entries (`reports/GAPS.md`); those are leads.

**Evidence (read, `STATUS.md`).** Field evidence: unchecked 11236, unsupported 100, imprecise 20, sourced 961, formal 79, contradicted 0. Invariant-claim evidence: unchecked 481, sourced 29, formal 20.

**The relation layer (read).** 513 entries carry `relation`; 62 name one of 29 isomorphism clusters and 485 a departure. `map.json` lists each cluster's members and nothing else for the cross-domain clusters. The landed source's Domain 1 index gives each internal cluster a type in prose ("Abstraction hierarchy: graph operations abstract to matroid operations", "Restriction operation", "Identical operation, different names") and a status, which is "Unwalked" for every row (read, `source/math_map.md` lines 2645 to 2670). Largest clusters: ISO-CROSS-CPTP and ISO-D1-INT-01 with 6 members, ISO-CROSS-GNS with 4; eleven clusters have one member in the map (measured). The verdict note of 2026-11-06 says of typed relations: "Typed relations between entries (the note's section 3) are not built: the landed relation types are prose." (read, `docs/inbound/2026-11-06-from-formalization-verdict.md`).

**Relations between invariants (measured).** Five: one `equivalent` (birational type and function field, receipted), one `implies` over preservation (limits to finite limits, definitional), three `implies` over state (D9, generated). `compose.mjs` closes claims over them with stated rules for each kind (read, its header).

**The scripts named in the commission (read).**

- `scripts/compose.mjs` reads `invariants`, `actsOn`, the invariant relations, the classes, context labels, and the evidence levels. It reports joins (match, narrowing, partial, mismatch) and invariant histories, and the weakest claim a chain rests on. It reads nothing about hypotheses: a chain whose second step needs a condition the first step's output fails is a clean chain to it (inferred from the header's contract, which names no condition field). It takes whole-chain proofs per call (`--proof ID=citation`) and stores none.
- `scripts/evidence.mjs` computes a level per field and per invariant claim from audit grades, receipts, corrections, Mathlib links and Lean claims. Its inputs are per field or per invariant; a claim that is one clause of a field has no level of its own unless a named invariant stands for it.
- `scripts/misalign.mjs` finds landed rows whose content shares no significant word with the name. 242 leads, all read: 19 flagged, 6 held, 217 aligned (read, `reports/MISALIGN.md`).
- `scripts/topology.mjs` states: "The map records no claim that two routes agree, so no loop is filled: a loop count measures alternative routes, not obstructions." (read, `reports/TOPOLOGY.md`). It lists ten disagreements between parallel routes, all on one invariant.
- `scripts/mcp.mjs` serves five tools: `map_info`, `search_entries`, `get_entry`, `list_invariants`, `compose_chain` (read). None follows a relation or a cluster.

## 2. Where entries fail, by the hunts

**The strict reading (read, `reports/STRICT-READING.md` at `b3f746c`).** Under the rule "confirmed only when a quoted window states the field's claim itself", 38 of 100 sampled confirmed fields flip (Wilson 95% interval 29.1% to 47.8%). The causes, written after unblinding: part 21, names 14, detail 3. "Part" is a field that bundles several claims of which a window states some. The report's own conclusion: "the flips are claim parts no window states, which long quotes leave out as often as short ones."

**The falsification hunt, same report (read).** Forty fills with the highest specificity score were attacked. Eleven carry a finding, all graded imprecise. Sorted by what was missing (inferred, from the eleven findings' text):

| What the fill lacked | Fills |
|---|---|
| A hypothesis | D7-213 (finite down-sets), D7-133 (right reversibility), D7-408 (characteristic zero), D7-117 (finite domain or omega-categorical), D7-266 (finite-dimensional, for strong convergence), D7-365 (unit-free shapes), D7-366 (accessibility), D2-038 (positive measure) |
| A convention fixed | D7-364 (cooperad against operad), D2-038 (sign of the exponent) |
| A detail of the object | D7-251 (the quotient by principal crossed homomorphisms), D7-119 (closure on one side, kernel on the other) |

Eight of eleven are missing hypotheses. Evidence of the findings: read 4, inferred 2, recalled 5.

**The second reading of Mathlib match grades (read, `reports/SECOND-READING.md`).** Agreement 66 of 93, Cohen's kappa 0.48. The recurring disagreement is a declaration that states one clause of a field ("Only the uniqueness half of the universal property", "Only the minimality half") graded as stating the field.

**Misalignment (read, `reports/MISALIGN.md`).** Nineteen flagged rows, all in D8, most a shift by one in an alphabetical run.

The three readings agree on one shape: a field is a bundle, and the unit that evidence attaches to is smaller than the field.

## 3. Consumers

### 3.1 Math_Map's own checker and reports

Reads: named invariants, `actsOn`, invariant relations, evidence. Keeps elsewhere: whole-chain proofs (per call only); route agreement (nowhere). Asked for, through the inbound notes folded in so far: oscillation statuses, output closure, a combinator form, context labels, additive twins (all landed, read in `docs/inbound/`).

### 3.2 Research_OS

**Reads (read, `functions/mathlib-ingest/mapread.mjs` at `e0415aa`).** Per entry: `id`, `domain`, `name`, `tier`, `flagged`, the five text fields, `evidence`, `formal` (with twins as links of their own), `lean`, and input and output kinds from the free typing pass. It does not read `actsOn`, `invariants`, `relation`, `conditions` or the bindings. The record and the link read D9-X07, X20, X28, X29 as contracts (read, `bindings.json`).

**Keeps outside the map (read).**

- Code bindings. `bindings.json` opens: "Code bindings of the atlas: each function of the record and the link, the Math_Map operation it performs (at the map commit given), how it departs from that operation's contract, and the test that checks it. Kept here until Math_Map takes code bindings." Five rows, each `{ function, operation, departures, checkedBy, proof? }`, pinned at Math_Map `e1bcb83`.
- An external proof: `ResearchOS.converge` in its own `lean/`, cited by hand to `compose.mjs --proof`.
- A carrier table from Mathlib head constants to carriers, in its `decompose` step.
- A model certificate (addition mod 59, bound to a checkpoint hash) with no entry to bind to.

**Asked for (read, `findings/math-map-stress-test-2026-11-06.md` at `cd24c40`, section 4).** Twelve proposals, with its own verdicts:

| # | Proposal | Its verdict |
|---|---|---|
| P1 | One realization record `{ entry, by: proof, code, platform, model or world, ref, departures, checkedBy, assurance, receipt }` | plausible |
| P2 | A per-entry contract hash, so a realization pins the entry it binds | confirmed as cheap and needed |
| P3 | Stored chain proofs `{ chain, invariant, citation, axioms }` | plausible |
| P4 | An observation ledger in the Regulator's shape | needs refinement |
| P5 | Predicted postcondition and read-back as fields of a platform binding | plausible |
| P6 | Bind D9-X28 and X29 on Android and NixOS | confirmed as a gap |
| P7 | An operation identity field (`sameAs`) for 63 shared-name groups | needs refinement |
| P8 | The ingest reads declared typing where it exists | plausible |
| P9 | Retire `status`; null empty `complexity` | confirmed for `status` |
| P10 | Coverage rounds by declarations unreached | confirmed as the measured gap |
| P11 | Checker rules: operands named across a chain; a step invariant ends at its step | needs refinement |
| P12 | Keep `kind` and `tags` | marginal |

Its field-by-field reading grades `status` dead ("1,954 entries carry the same string"), `complexity` needs refinement ("58% carry nothing"), and `name` as failing for identity ("63 names are shared by 144 entries that are not clones of each other"). On pins: "That check had to be done by hand, because an entry carries no hash of its own contract."

Earlier notes asked for and received entries (D9-X28, X29) and additive twins. One ask stands partly open: section 4 of the algebra-leads note, 1249 Mathlib namespaces whose kinds no entry's typing fits (read, `docs/inbound/2026-10-14-mathlib-algebra-leads.md`). The same note states the measured lever: "a formal link on an operation's defining declaration is worth far more than one on a single lemma."

### 3.3 Formalization

**Reads (read, the intake report at `ec4d139`).** `map.json` and `source/math_map.md`, for measurement; D6-086, D6-073, D2-028, D2-029 as claims to prove.

**Keeps outside the map (read).** `Bridges/Bridges/Laplace.lean`, 35 theorems, of which the note proposes links for 14 on four entries. The map's `formal.js` links Mathlib and `lean.js` its own project, so a theorem in a third repository has no slot; the inbound note says a link "needs a ruling: link it in place, or port the file". Per-claim hypotheses, the derivative rule, the dependence of the output's region on the input, and the converse failure of the final value theorem all live in the Lean file and the report.

**What it measured (read, sections 1 to 4).** Over 1693 mathematical homes: median words per field 13, 5, 4, 4, 3; 207 homes state a hypothesis inline against 10 with a structured condition; 244 homes carry an intertwining phrase; 158 state a relation to another operation only in prose; 8 pairs "X" and "Inverse X" linked by nothing but the name; 94 same-name groups, 82 with divergent content. Of 85 sampled preserved items, 40 are invariants of the object carried through. Of 19 known solution routes, the rule that makes the route work sits in a field for 8, and one is typed for the checker. Of 8 Laplace claims, 8 "needed a hypothesis or a precision the entry lacks."

**Asked for (read, section 7).** Nine proposals, in its rank order:

1. Carry ISO / DEP / CS into `map.json` and the MCP server; parse the Domain 1 index into typed relations. Folded in for the carrying; the typing waits (read, the verdict note).
2. Flag thirteen D8 rows and add a lead check. Folded in, with one more row.
3. An intertwining slot `{ from, to, direction, conditions, evidence }`.
4. Typed relations between entries: `inverse-of`, `adjoint-of`, `dual-of`, `special-case-of`, `implements`, `discretizes`, `limit-of`, `composite-of`, `same-as`, each with a departure note and evidence.
5. Claims in place of labels: each item of preserved and broken with a kind, a direction, its own conditions and quantities, its own evidence.
6. An entry's nature (operation, theorem, class, relation, existence, obstruction, conjecture, algorithm, composite) and shape flags (arity, parameters, partial, multi-valued, stochastic, dependent output, needs choice).
7. The status of the mathematics apart from the map's evidence.
8. Uses: the problem classes an entry solves.
9. MCP queries `related`, `intertwinings`, `routes`.

Proposals 3 to 9 wait (read, the verdict note: "Sections 3 and 4 ... wait for the operator's next direction"). The report also says what to leave out: "**What not to add:** more free text."

### 3.4 Phone (the Regulator)

**Reads (read, `Typed.java` at `4d061e5`).** D9 ids only, as strings in a chain: `D9-X44,D9-X42` (freeze), `D9-X43` (thaw, unsuspend), `D9-X06` (revoke location), `D9-X42` (suspend), `D9-X12` (route).

**Keeps outside the map (read).** Its class comment says each action is typed by "the chain it runs, the platform binding it goes through, the postcondition the operation's contract predicts, and a read-back script whose output says whether the prediction held." All four, and the predicate that judges the read-back, are Java literals in `Typed.java`. The bindings for D9-X42, X43 and X44 (`pm suspend`, `pm disable-user`, `am force-stop`, `pm enable`) exist only there (read; the stress test's 3e says the same). Observations are kept on the phone in `observations.jsonl`: "one run of one D9 operation on one build, the prediction its contract makes against what was seen, with a receipt (the sha256 of the read-back's output)" (read, `Observe.java`). The build is recorded by public identifiers only.

**Asked for (read, `docs/inbound/2026-10-22-observations-from-the-regulator.md`).** An observation layer apart from the bindings; the operator ruled the grading rule on 2026-10-23 (read, `CLAUDE.md`), and no file or schema for it exists (read: no such file in `mapfill/`). Two lifecycle operations, landed in round UN-001.

### 3.5 Unattested

**Reads (read, three inbound notes of 2026-10-22).** D9 entries composed as flows through `compose.mjs` with `--require`.

**Asked for.** A logged-effect combinator (landed as D9-X40); a host restyle entry (landed); and three things that stand open (read, `2026-10-22-flow-d-grading.md`): whether D9-X01 preserves the attenuation X12 set ("X01 is silent on attenuation"), a place where the map says that the journal append is the only export from a contaminated process, and bounded repetition ("Repetition has no form"). It also notes a break the design intends, "so a later reader of the verdict does not take it for a gap": the map has no slot for an intended break.

### 3.6 Guardians export

`scripts/export-guardians.mjs` exports D9 entries as tool specifications and a policy as taint rules (read, `README.md`). It reads the D9 fields and invariant classes; "Relational and hyperproperty invariants and flows through branching stay outside it."

## 4. The atlas in The_Smell_of_Knowledge

All quotations are from `The_Smell_of_Knowledge_v1_5.md` at `8b91372`, by line.

**What the atlas is (line 141).** "The *theory atlas* is the structural-organizational object that aggregates these relations into a queryable topology over the library. Each relation is a chart; the atlas is the collection, compatible on overlaps."

**What a chart is.** A chart is one relation over the library. Line 139 lists them: "Dependency relations show which theorems use which. Typeclass and structure hierarchies show which objects instantiate which abstractions. Technique clusters show which proof strategies recur across domains. Bridging patterns show where techniques from one area formally apply to another. Density patterns show where the library is thick and where it is thin. The axiom-dependency chart shows which results depend on which axioms".

**What compatibility on an overlap is (line 141).** "When a theorem appears in both the dependency chart and the technique chart, it is the same theorem, and a modification to its formal statement propagates to both." And: "The atlas is a single object viewed from multiple angles, not several objects with nominal cross-references."

**The words "transition map" and "atlas of isomorphisms" (read).** Neither phrase occurs in the essay: a search of the file for "transition" finds only a title in the references, and "isomorphism" occurs twice. The two occurrences carry the essay's whole account of isomorphism data:

- Line 221: "Structural deduplication, where proofs that differ syntactically but are isomorphic under a chart's compatibility relations can be grouped as clones of an abstract pattern with departure metadata, reduces the pragmatic layer's input from 'every verified proof' to 'every structurally distinct family of verified proofs.'" (the inner quotation marks are the essay's, written there as double quotes).
- Line 263: "Atlas construction produces the isomorphism hypotheses red-teaming tests and the retrieval structure proposers use."

So in the essay an isomorphism is a hypothesis the atlas proposes and red-teaming tests, and its record is a clone of an abstract pattern with departure metadata. A transition map, in the differential-geometric sense the commission uses, is this survey's reading of what "compatible on overlaps" needs once two charts describe the same operation in different vocabularies (inferred; the essay does not define it). The nearest thing the essay does define is the crossing rule between foundations (line 131): "an imported result grounds nothing until a local author types it under the receiving foundation and signs the typing as a claim of their own."

**What the atlas needs from a map of operations (lines 145, 221, 147, 334).**

- An organization by function. Line 145: "Another is by functional specification: what a transformation takes as input, what it produces, what it preserves, what it breaks." That is the map's entry, field for field.
- Typed retrieval. Line 221: "Functional-specification retrieval lets curators ask the atlas for proofs satisfying a particular typed need".
- Clones with departures. Line 221 above; the map's landed ISO / DEP / CS field is this record, carried and unchecked.
- Locality. Line 147: "an admission recomputes its own region's charts and the overlaps that region participates in, and the global atlas is the composition of verified regions rather than an object reverified as a whole."
- Departure records. Line 334: "a departure compost pile records where structural patterns fail phenomenological reality", with a stated use: "they would flag for applied users where existing mathematical treatment is known to break down in their domain".
- Negative records with structure. The Compost Pile's schema (lines 69 to 80) has eight fields: entry id, hypothesis, blocking constraint, mechanism, scope (point or class), residue, reactivation, trellis version.
- A weaker layer marked as weaker. Line 257: "The theory atlas maps a formal substrate with verified edges; the reference atlas maps a social substrate with estimated edges ... a proposal layer rather than a verification layer".
- Provenance on a declared axiom (line 119): "the informal theorem it represents, the textual source of that theorem, the scope and signature of the claim the axiom encodes, and a status flag (undischarged, discharged, retracted)."

**Where the map stands against that (inferred).** The map has the functional-specification chart for 2066 operations and evidence per field. It has one cross-vocabulary chart, the clusters, with 62 member rows whose landed status is "Unwalked". It has no record that two charts agree on an overlap, which `topology.mjs` states in its own words.

## 5. What has no home today, by who holds it

A tally of sections 2 to 4, with nothing proposed. Each row is something a consumer keeps outside the map or asked for and did not get.

| Held outside or asked for | Held by | Evidence |
|---|---|---|
| Per-claim hypotheses | Formalization (Lean file); the strict hunt's findings | read |
| The rule a transform is used for (derivative, shift, convolution rules) | Formalization (report) | read |
| Typed relations between entries, with departures | landed source, as prose; Formalization asked | read |
| Operation identity across same-name entries | Research_OS (a one-side rule in its ingest) | read |
| Code bindings with departures and tests | Research_OS `bindings.json` | read |
| Proofs in other repositories | Research_OS `lean/`, Formalization `Bridges/` | read |
| Whole-chain proofs | passed per call to `compose.mjs` | read |
| A pin of the contract a realization was made against | checked by hand in Research_OS | read |
| Predicted postcondition and read-back per binding | Phone `Typed.java` | read |
| Observations | Phone `observations.jsonl`; rule ruled, no schema | read |
| Model realizations | Research_OS certificate | read |
| What an entry is (operation, theorem, obstruction and so on) and its shape | nowhere; Formalization asked | read |
| Status of the mathematics | the landed `status`, one string 1954 times | read |
| Problem classes served | nowhere; Formalization asked | read |
| Intended breaks | Unattested's note | read |
| Bounded repetition; operands named across a chain; step invariants ending at their step | checker rules asked by Unattested and Research_OS | read |
| Agreement of two routes or two charts on an overlap | nowhere | read |
| Obstructions and dead routes | the essay's Compost Pile schema; no rows in the map | read |
