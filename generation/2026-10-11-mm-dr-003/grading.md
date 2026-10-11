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

Plausible on the recombination verdict for the parts, wrong on the whole (section 1). Errors: CaMeL's title given as "Capability Policies for LLM Agents" (it is "Defeating Prompt Injections by Design"); SuSi's category counts unsupported (a secondary source gives different numbers and attribution); Axplorer dated 2024; an untraceable `ep_effect_profiles.tla`. Its pointer to the Emilia Protocol (an MCP server describing an authority gate at executor boundaries) is a lead to read, not yet prior art. It found Weir (Nadkarni, Andow, Enck, Jha, USENIX Security 2016, **secondary**), whose lazy polyinstantiation is prior art for the per-process contamination rule from MM-DR-002, alongside process-labeling information-flow operating systems such as Flume and HiStar (**recalled**, unverified).

## 4. What follows for the build

- **Do not build a security verifier from scratch in `compose.mjs`.** Guardians (MIT, Z3), CaMeLoT (nuXmv, CTL) and TACIT (capture checking) already verify compositions of tool contracts, each in a restricted model. `compose.mjs` stays what it is, an inventory of what the map says about a chain, and reports security properties as needing an external check.
- **Contribute what is missing.** The Android contracts and bindings are the scarce part; the natural route is to express them in a form one of these checkers consumes (Guardians' `ToolSpec` is the closest shape), rather than a parallel checker.
- **Adopt the per-process contamination rule as prior art** (Weir; Flume and HiStar to be verified), not as an invention.
- **Pending:** licenses for CaMeLoT and TACIT, Guardians' actual verification depth beyond its design document, the Emilia Protocol lead, and FlowDroid summary coverage.
