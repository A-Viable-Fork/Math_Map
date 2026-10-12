# Grading: MM-DR-003, prior art for D9

Date 2026-10-11. Evidence marks: **read**, **secondary**, **inferred**, **recalled**, **unknown**.

## 1. The disputed answer

DeepSeek: no system combines the four parts. ChatGPT: restricted systems already combine all four. **ChatGPT is right.** Its three closest matches were checked:

| System | Checked | Result |
|---|---|---|
| Guardians (Meijer, *CACM* 69(1), DOI 10.1145/3777544; software by Nada Amin and contributors) | `github.com/metareflection/guardians`: HEAD is `59e52d9` (2026-07-16), the cited commit; `src/guardians/tools.py` defines a `ToolSpec` with preconditions, postconditions, frame conditions, and source and sink taint labels, and a `ToolRegistry`; `src/guardians/verify.py` exists; license MIT (**read**). The DOI resolves to the ACM record (**secondary**). | Confirmed: a registry of tool contracts with flow labels, verified before execution. |
| CaMeLoT (Nikolaou et al., arXiv 2609.18674, 2026-09-16) | Abstract (**secondary**): a CaMeL plan translated to a finite-state model with provenance and taint, checked against CTL policies with nuXmv before any tool runs, counterexamples fed back for repair. `github.com/detlearsom/camelot` HEAD is `f70e280`, the cited commit (**read**). | Confirmed: policy checking over compositions of tool calls with provenance. |
| TACIT (Odersky et al., "Tracking Capabilities for Safer Agents", arXiv 2603.00991) | Abstract (**secondary**): agents write Scala 3 with capture checking; capabilities gate effects; local purity prevents leaks of classified data. `github.com/lampepfl/tacit` HEAD is `476b421`, the cited commit (**read**). | Confirmed: typed operations with tracked authority, composed by a compiler. |

CaMeL itself: `github.com/google-research/camel-prompt-injection` HEAD `f083b6b`, as cited (**read**).

## 2. What is new in D9, stated without inflation

- **The Android binding at a current tag.** The 2026 survey of Android permission work (arXiv 2601.00252, **secondary**) finds little API-to-permission mapping beyond limited or obsolete studies, and the newest mapping found reaches Android 10. The MM-DR-002 bindings, receipted at `android-16.0.0_r4`, are the part of D9 no one else publishes. ChatGPT also names FlowDroid's maintained data-flow summaries (StubDroid lineage, FlowDroid 2.15.1) as the closest current Android data; which Android version those summaries cover was not checked (**unknown**).
- **The breadth of the contract set** (shared-epoch revocation, atomic audit, replay prevention, bounded erasure, relational and timing properties). ChatGPT calls this a specification difference, not an implemented advantage, and that is the right grade: it becomes substantive only when enforced and checked.
- **Everything else is recombination or presentation.** Calling a contract registry an atlas, and showing losses join by join, is a view of contracts these systems already carry.

## 3. DeepSeek

Plausible on the recombination verdict for the parts, wrong on the whole (section 1). Errors: CaMeL's title given as "Capability Policies for LLM Agents" (it is "Defeating Prompt Injections by Design"); SuSi's category counts unsupported (a secondary source gives different numbers and attribution); Axplorer dated 2024; an untraceable `ep_effect_profiles.tla` (corrected in section 5: the file exists). Its pointer to the Emilia Protocol (an MCP server describing an authority gate at executor boundaries) is a lead to read, not yet prior art. It found Weir (Nadkarni, Andow, Enck, Jha, USENIX Security 2016, **secondary**), whose lazy polyinstantiation is prior art for the per-process contamination rule from MM-DR-002, alongside process-labeling information-flow operating systems such as Flume and HiStar (**recalled**, unverified).

## 3a. Kimi (added after first commit)

Plausible, and compatible with section 1 once its claim is read exactly. Its "no verified system" conjunction includes concrete Android mappings and OS-enforced capabilities, which none of Guardians, CaMeLoT or TACIT has, so it does not contradict ChatGPT; but it misses those three systems entirely, and they are the nearest prior art for the composition checker. Useful contributions: bind D9 through a versioned tuple (operation, API level, concrete signature, runtime check, evidence source) and never derive an operation's meaning from a permission name, which agrees with the MM-DR-002 finding that permissions authorize access and say nothing about provenance; Effect TS as the closest runtime analogue of one abstract operation with several platform realizations; Zelkova's reference-policy check (no access beyond a reference) as the shape of a profile-inclusion check. Checked: AppFunctions is at 1.0.0-alpha13, released 2026-10-07, alpha channel only (**secondary**, release page). FlowDroid's license is LGPL-2.1 (**read**, `LICENSE` on its develop branch), not the Apache-2.0 Kimi suggests checking for. Error: SuSi's title is given as "Efficient and Precise Taint Analysis for Android with SuSi"; the NDSS 2014 paper is "A Machine-learning Approach for Classifying and Categorizing Android Sources and Sinks" (**recalled**, as cited by the other two reports). Version claims for Effect TS, Koka, OPA and Genode are unchecked.

## 4. What follows for the build

[ruling: operator, 2026-10-11] Express the Android contracts for an existing checker, Guardians most likely, rather than build a parallel security verifier. The same day the operator ruled the MM-DR-001 schema proposals (invariant class, graded policy verdicts, context labels, facets; landed as commits 0647f17, d3cc337, befbd86 and 79bd7d4) and the MM-DR-002 Phone proposals (recorded in the Phone program, F-45).

- **Do not build a security verifier from scratch in `compose.mjs`.** Guardians (MIT, Z3), CaMeLoT (nuXmv, CTL) and TACIT (capture checking) already verify compositions of tool contracts, each in a restricted model. `compose.mjs` stays what it is, an inventory of what the map says about a chain, and reports security properties as needing an external check.
- **Contribute what is missing.** The Android contracts and bindings are the scarce part; the natural route is to express them in a form one of these checkers consumes (Guardians' `ToolSpec` is the closest shape), rather than a parallel checker.
- **Adopt the per-process contamination rule as prior art** (Weir; Flume and HiStar to be verified), not as an invention.
- **Pending:** licenses for CaMeLoT and TACIT, Guardians' actual verification depth beyond its design document, the Emilia Protocol lead, and FlowDroid summary coverage. (Section 5 settles all but the last.)

## 5. Follow-ups, later the same day

- **Correction to section 3.** `ep_effect_profiles.tla` is not untraceable: it is in `github.com/emiliaprotocol/emilia-protocol` at `formal/ep_effect_profiles.tla`, read at `3f712d28` (last changed `594d1efe`, 2026-08-06; sha256 `53c2ac494dc72c792a02c62c1e738bf27d974be736933ef770ee3ebff1081599`), with a TLC configuration beside it that the repository's `tlc.yml` workflow runs (**read**). The grading's own search missed it. DeepSeek's citation was right; its title-less form ("Emilia Protocol. ep_effect_profiles.tla. GitHub.") was what made it look untraceable.
- **The Emilia Protocol lead, graded.** Plausible as partial prior art, narrower than D9. The model composes six product-specific effect profiles (escrow release, a seven-leg evidence clearance, role non-substitution, authorized dispatch and settlement, a tenant-fenced mobile operation, an enrollment challenge) as independent state machines, one advancing per step, and checks safety invariants on one bounded instance with TLC. Its header says what it leaves out: cryptographic soundness, complete mediation, liveness, implementation refinement, and anything beyond the bounded instance (**read**). It is effect profiles checked under composition, for one product's operations; it carries no shared invariant vocabulary, no platform binding, and no information-flow property. License Apache-2.0 (**read**, `LICENSE`).
- **Licenses.** CaMeLoT at `f70e280` and TACIT at `476b421`: both Apache-2.0 (**read**, each `LICENSE` at the cited commit).
- **Guardians' verification depth.** Settled for flows by running it: `trial-guardians.md`. Explicit flows with sanitizers are checked; flows through branching were missed at `59e52d9`, and a drafted patch (`guardians-pc-labels.patch`) closes that case and passes Guardians' own tests. Held for the operator before it goes upstream.
- **Still pending:** FlowDroid summary coverage.
