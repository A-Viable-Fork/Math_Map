# From Unattested, 2026-10-22: grading a download, and a pin that moved

A proposal, not a change: verify, then fold in or decline, and say which. Written at the operator's request (2026-10-22) by the agent working in A-Viable-Fork/Unattested, whose `BLUEPRINT.md` section 4 (at `8cdbb67`, branch `claude/blueprint`) holds the flow graded here. Facts are marked; everything else is generation.

## 1. Flow D, as graded

The shell's download flow, after the operator's ruling on its U-10 (2026-10-22): the person confirms a download the page asked for; the shell fetches that one address in the account's own process, carrying the account's cookie for that request only; the file and its record leave the account's compartment. Graded with `scripts/compose.mjs` at `5abe49b` (read, run 2026-10-22):

- `D9-X24, D9-X12, D9-X01, D9-X07, D9-X10, D9-X02, D9-X28` reports a context violation at X02: `compartment-context` raised at X07, not cleared.
- `D9-X24, D9-X12, D9-X01, D9-X07, D9-X24, D9-X10, D9-X02, D9-X28`, with a second gate before the crossing, reports the same violation.
- `D9-X24, D9-X12, D9-X01, D9-X07, D9-X24, D9-X10, D9-X28`, the file written as the record's own entry, grades with one stated violation, e9-gfree broken at X07, the same shape as the shell's capture flow; e9-audit restored at X28, e9-sig created there, e9-atten created at X12.

The shell took the third chain.

## 2. What the grading shows about D9

**The only export out of a contaminated process is the journal append.** `mapfill/invariants.js` says nothing in D9 clears `compartment-context`, since X10 releases one datum's label and not the process, and a reset lies outside the chain (read). So a declassified datum may leave by X28 and by no other step. That may be intended: the record as the one broker every crossing goes through, which is Phone's F-45. If it is, the map could say so where a reader of D9 will see it, beside X02 and X10. If it is not, generation: an operation *hand one declassified datum to a fresh process*, whose output is that datum with context cleared and whose precondition is X10's release; X02 in the fresh process then grades clean. The shell does not need it, since its record append already is the crossing; a desktop that files a download into a project tree, not a journal, would.

**X01 is silent on attenuation.** e9-atten is created at X12 and the map is silent on it at every later step, X01 included. The point of X12 before X01 is that the send uses the capability within the bounds X12 set: one request, one host, held nowhere. Proposed: X01's contract states whether a send preserves the attenuation of the capability it uses, so that a chain attenuating before sending can grade the property it was built for.

**Repetition has no form.** The shell follows redirects itself so each hop carries only its own host's cookie: X12 then X01, once per hop, at most five times. `compose.mjs` takes a fixed chain, so the bounded loop is graded as one pass. Noted, not proposed: whether chains need a bounded repetition form is for the next flow that loops.

## 3. The Android pin has moved upstream (dated environment fact)

The Android bindings pin `android-16.0.0_r4` with LineageOS `lineage-23.2` as their downstream, build `BP4A.251205.006` (read: `mapfill/android.js` at `5abe49b`). LineageOS 24.0, on `android-17.0.0_r1`, is now the only branch LineageOS builds for the OnePlus 13 and the OnePlus 8T (read: LineageOS/hudson `lineage-build-targets`, and the `lineage-24.0` manifest, 2026-10-22). Phone's base-ROM note of the same day (branch `claude/inbound-from-unattested` there) recommends 24.0 for every Android build. Moving this repository's pin is its own call; until it moves, observations from a 24.0 build would open their own binding set under the grading rule already proposed.
