---
Kind: expression
Author: an agent session, on the operator's commission
Commission: `prompts/MM-DR-003-d9-prior-art.md`, run after MM-DR-001 and MM-DR-002, with the D9 entries, invariants, relations and the ChatGPT Android bindings attached
Date: 2026-10-11
---

# Generation: prior art for D9 and its Android binding (MM-DR-003)

## Reaching for

Whether the D9 design (an atlas of operations with effect profiles, an invariant vocabulary, platform bindings, and a composition checker for a person's own policies) already exists, in whole or in part; what to adopt instead of building; and where D9 differs in substance rather than presentation. Searched after generation, by design.

## Candidates

1. **DeepSeek.** The whole design does not exist as one system; a recombination of known parts; no prior art found for the composition checker. Received as pasted text; graded, not landed.
2. **ChatGPT.** The four-part architecture is a recombination, and restricted systems already combine all four parts (Guardians, CaMeLoT with CaMeL, TACIT); D9's exact 19-contract conjunction on current Android is unverified, not novel. Landed verbatim: `report-chatgpt.md`, sha256 `0ba2147d44ae46ca61fe3f363e29418feb10cc3daac570b4e5a66d7981a7afd4`.

3. **Kimi.** No verified system provides all of: typed platform operations, reusable profiles, preserve and break semantics, declarative composition, concrete Android mappings, and OS-enforced capabilities; closest per layer are Effect TS and Koka, Zelkova and OPA, CaMeL, and Fuchsia and Genode. Landed verbatim: `report-kimi.md`, sha256 `dedcf32654b94e43618f74dc196f8b34eb95aabfd8731087fa41f8cc51f078e3`. It arrived after the round was first committed and is added here.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1, 2, 3 | grading | conjecture | done: see `grading.md` |
| Adopt list | the operator | proposals | a license or maintenance check that fails |
