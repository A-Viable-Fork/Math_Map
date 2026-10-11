---
Kind: expression
Author: an agent session, on the operator's commission
Commission: the operator's request of 2026-10-11 for a ninth domain, "Systems and effects", sent out as `prompts/MM-DR-001-d9-operations-and-effect-invariants.md`
Date: 2026-10-11
---

# Generation: D9, operations on state and their effects (MM-DR-001)

## Reaching for

A home in the map for operations that act on state with effects (send, store, read a sensor, isolate, grant and revoke authority), named invariants for those effects, and an answer to whether a person's own policies over effects (data from a compartment never leaves the device; nothing merges without the owner's signature; no agent acts on guest text) can be checked by composing operation profiles one join at a time. The use behind it is the personal OS: the same operations bound to Android and to the desktop, with the person's ranked axioms checked through the map.

## Seeds

The prompt seeded six operations (send, store, read sensor, isolate, grant capability, revoke capability) and five invariants (locality, provenance, compartment origin, guest origin, signature), and named the theories to draw on: effect systems, algebraic effects, information-flow control, capabilities, process calculi, CaMeL. It also seeded a suspicion: that noninterference, a property of sets of executions, might defeat per-step checking. That seed shaped two of the three answers (see the grading).

## Candidates

Three generators answered the same prompt independently.

1. **DeepSeek.** 24 operations, 16 invariants; verdict DEAD for the checkability claim. Received as text pasted in the session, not as a file, so it is not landed here; the grading quotes what it relies on.
2. **Kimi.** 20 operations, 13 invariants; verdict DEAD as stated, NEEDS REFINEMENT as reformulated. Landed verbatim: `report-kimi.md`.
3. **ChatGPT.** 27 operations, 19 invariants, a source ledger, and 11 finite counterexample checks run against this repository's `compose.mjs`; verdict DEAD for the unrestricted claim, MARGINAL for a contract-based reformulation. Landed verbatim: `report-chatgpt.md` and `package-chatgpt.zip`.

Landed files keep their own dashes and wording; they are the generators' expression, not this repository's prose.

| File | sha256 |
|---|---|
| `report-kimi.md` | `a02d9df9a0d6a66ff671ba68d89a047e55b371904b413a3fb6dc03d9cf59f965` |
| `report-chatgpt.md` | `784d65ae073ab1007265b4404acb91e01c85072595cec1eda3ef63357339f0cf` |
| `package-chatgpt.zip` | `3ba3a811de1d3c94089bc4f6b9644b70652d0874ad9dfe42413ace8a57cc6145` |

## Against the obvious

The obvious version is a list of operations tagged with what they preserve and break, checked by asking whether any step breaks the policy's invariant. All three candidates depart from it in the same direction: the class of an invariant (state, step, trace, relational, other hyperproperty) decides what a per-join check can say about it, and silence is not preservation. They differ on how far per-join checking reaches; the grading settles that.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1 | grading | conjecture | done: see `grading.md` |
| 2 | grading | conjecture | done: see `grading.md` |
| 3 | grading; its four claims about `compose.mjs` to the checker | conjecture; code claims as findings | done: reproduced and fixed at `b34698e` |
| The 27 operations and 19 invariants of 3 | MM-DR-002 as the base list | conjecture, not yet audited entry by entry | an entry whose profile fails against a source or a binding |
