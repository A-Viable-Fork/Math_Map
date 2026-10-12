---
Kind: expression
Author: an agent session, on the operator's commission
Commission: the operator's request of 2026-10-11 to bind D9 to Android, sent out as `prompts/MM-DR-002-d9-android-bindings.md` with the MM-DR-001 base list (27 operations, 19 invariants) attached
Date: 2026-10-11
---

# Generation: D9 bound to Android (MM-DR-002)

## Reaching for

For each D9 operation, the Android APIs that realize it at the AOSP tag LineageOS 23.2 is built on; where the platform enforces each effect; where effects escape enforcement; and whether a privileged app on a rooted phone (the Phone repository's Regulator) can enforce a compartment's effect policies at Android's boundaries.

## Seeds

The prompt carried four lessons settled in the MM-DR-001 grading: an operation's effect depends on named parameters; absence of a break is not enforcement; inputs are joint operands; trace violations are absorbing. Each binding records its deciding parameters and an assurance level (enforced, monitored, unknown, not observable). It named AccelEve, permission re-delegation, AppFunctions and the MCP tool annotations as sub-targets.

## Candidates

1. **DeepSeek.** 13 bindings for 27 operations; verdict DEAD for the enforcement claim, with zero-permission sensors as the earliest fatal step. Received as pasted text; graded, not landed.
2. **Kimi.** 38 bindings covering all 27 operations; verdict NEEDS REFINEMENT. Landed verbatim: `report-kimi.md`, `bindings-kimi.json`.
3. **ChatGPT.** 51 bindings covering all 27 operations, two assurance levels per binding, 81 hashed source receipts at the tag and 12 recorded failed lookups; verdict DEAD as broadly claimed, with a boundary-observation impossibility argument. Landed verbatim: `report-chatgpt.md`, `bindings-chatgpt.json`, `receipts-chatgpt.json`.

Landed files keep their own wording and dashes.

| File | sha256 |
|---|---|
| `report-chatgpt.md` | `7ca1ac33630758545f1893d41c5d068794474171709b280470a27a7c1c9eb706` |
| `bindings-chatgpt.json` | `60157d7580b53f56f28a444284070a2a95ef0677c414af690505db5a221a4252` |
| `receipts-chatgpt.json` | `858b5b6f09c1dff376d31afcbca8e8b3870b8312427e3045a45c507958df7587` |
| `report-kimi.md` | `93880ad2539bd3bff98bd337f70e63c608315a471f7a783870ed1382a3e93ca4` |
| `bindings-kimi.json` | `3158bf9b66be298a62ebad2f05d2712be90348f62f3627204935d7e1235d69cc` |

## Against the obvious

The obvious version is a table of API to operation with a permission beside each. All three depart from it by asking what the platform can see; they part on how much it sees. The grading settles that against the source.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1, 2, 3 | grading | conjecture | done: see `grading.md` |
| The bindings of 3 | the eventual `mapfill/android.js` | conjecture, receipted paths, not device-tested | a binding whose cited code does not do what it says at the tag, or a device test that contradicts it |
| Regulator mechanisms found in grading | Phone program (F-52, F-03, F-45) | proposals for the operator | a device test on the bench phone |
