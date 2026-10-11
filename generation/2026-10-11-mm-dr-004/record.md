---
Kind: expression
Author: an agent session, on the operator's commission
Commission: `prompts/MM-DR-004-d9-nixos-bindings.md`, with the D9 entries, invariants, relations and the graded Android bindings attached
Date: 2026-10-11
---

# Generation: D9 bound to NixOS, and the vocabulary measurement (MM-DR-004)

## Reaching for

The desktop counterpart of MM-DR-002: which Linux mechanisms and NixOS options at nixpkgs `7c8764b` realize each D9 operation, where effects escape, and, as the round's main output, how much vocabulary a desktop policy needs beyond the phone's (Research_OS `BLUEPRINT.md` section 12, build 1). Part B asks for Nix's own operations as candidate entries.

## Candidates

1. **ChatGPT.** Overall DEAD for the universal claim, MARGINAL for a restricted compartment. 38 parameter-specific bindings over all 27 operations; Q4: no new invariant, carrier or label, one refinement of the context label (process incarnation, inheritance, reset) and three parameter families. Landed verbatim: `report-chatgpt.md` (sha256 `a3df8131b7b5a2102a44fdcee6feb5f5ed11977e26fe2c4e42cd200e26b539d8`, identical to the report inside the package) and `package-chatgpt.zip` (sha256 `3e077102e433264140d3d094812e42ddd8bc00059e2ec50f408174dc466debf0`; 170 receipts, 187 files, a Nix module sketch).
2. **Kimi.** NEEDS REFINEMENT; 27 bindings; Q4: two new invariants (`e9-contam`, `e9-reset`). Landed verbatim: `report-kimi.md` (sha256 `b0f74fda0a2be1a2dcc53e2364746114f23eaa06a2f1b485c76c11463c08d825`, extracted from the package) and `package-kimi.zip` (sha256 `f2f6fb70980cee05b597294b5628e42c509af65e8ef91ddf004b1966786182a9`).
3. **DeepSeek.** Not yet received.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1, 2 | grading | conjecture | done: see `grading.md` |
| ChatGPT bindings | `mapfill/nixos.js` | proposal for the operator | a path or hash that does not reproduce |
| The context-label refinement | `scripts/compose.mjs`, `mapfill/invariants.js` | proposal for the operator | a case the refinement cannot state |
