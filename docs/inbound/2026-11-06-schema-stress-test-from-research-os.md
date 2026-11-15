# From Research_OS, 2026-11-06: the schema tested against its consumers

A proposal, not a change: verify, then fold in or decline, and say which. Written at the operator's request (2026-11-06). The full test, with every count and how to reproduce it, is Research_OS `findings/math-map-stress-test-2026-11-06.md` (branch `claude/project-thread-0tisrv`). Read at this repository's `0a3c92b`, Research_OS `e0415aa`, Phone `4d061e5`. Everything below is generation except where a fact is marked; the operator rules before any of it lands.

## 1. What the test found (read)

1. **The record's own operations are unbound.** D9-X28 and D9-X29 have no Android and no NixOS binding. Their only realization is Research_OS code, held in its `bindings.json` because this map has no code bindings.
2. **Realizations live outside the map.** Code bindings (Research_OS `bindings.json`), a proof in a consumer's Lean project (`ResearchOS.converge`, which `compose.mjs --chain D9-X20,D9-X29` reports as "whole-chain check required"), a model certificate bound to a checkpoint hash (mod-59 addition, no entry for the operation it computes), and the Regulator's bindings and postconditions for D9-X42, X43, X44 (Phone `Typed.java`, none in `android.js`).
3. **No per-entry contract hash.** Research_OS pins `e1bcb83`, 63 commits behind; D9-X07, X20, X28 and X29 are unchanged since, which took a hand diff to show.
4. **Typing.** Declared typing (`actsOn`, `invariants`) on 64 entries; the free typing pass finds carriers on both sides of 862 of 2,066. The Research_OS read step uses only the inferred kinds.
5. **Identity.** 63 names are shared by 144 entries that are not clones.
6. **Dead weight.** `status` is one string on 1,954 entries and restates origin and round on the rest; no script reads it. `complexity` is a pointer on 411 entries and "N/A" on 782; only display reads it.
7. **Coverage.** At `0a3c92b` the Mathlib.Algebra decomposition is 7,112 clean of 59,559; Order (9,397 declarations, 1 clean), BigOperators (1,878, 0), Ring (2,850, 1) and Field (467, 0) map to almost nothing.
8. **Composition.** The Regulator's freeze (`D9-X44,D9-X42`) joins partially for want of a way to name the same principal at both steps; M5 of UN-001 (a step invariant carried forward) is the same family.

## 2. Proposals

- **P1, one realization record** for proofs, code, platform APIs, models and later measurements: `{ entry, by, ref, departures, checkedBy, assurance: { platform, contract }, receipt }`. The Android and NixOS bindings are its platform rows, unchanged. A row whose source is private stays in its own repository and cites this map by pin, so nothing private lands here.
- **P2, a contract hash per entry** in `map.json`, so a realization pins the entry and a check reports when the contract moved.
- **P3, stored chain proofs** read by `compose.mjs` by default, first row `ResearchOS.converge` for D9-X20,D9-X29.
- **P4, the observation file** the 2026-10-23 rule waits on, in the Regulator's shape (entry, binding, build of public ids, probe subject, predicted, observed, receipt, observer), with the crossing of the Regulator's four steps (none, reading, reproduced, contradicted) onto the contract ladder stated.
- **P5, postcondition and read-back on a platform binding**, and the Regulator's D9-X42 to X44 bindings through a graded round.
- **P6, bind D9-X28 and D9-X29** on both platforms in a graded round.
- **P7, `sameAs`** for operations shared across domains, set by a graded pass, never by name alone.
- **P8**, declared typing extended first to the 29 entries the ingest reaches.
- **P9**, drop `status` from `map.json` (the landed source keeps it); null `complexity` where it is a pointer the resolver cannot resolve or "N/A".
- **P10, coverage rounds** in the POLY-001 form: Order, Group basics, BigOperators, and an entry for addition in Z/nZ.
- **P11, checker rules**: operands named across a chain, and a step invariant ends at its step.

Verdicts per proposal are in the finding's section 4; the four points for the operator are in its section 5.
