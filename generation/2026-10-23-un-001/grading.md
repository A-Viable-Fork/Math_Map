# Grading: UN-001

Date 2026-10-23. Evidence marks: **read**, **secondary**, **inferred**, **recalled**, **unknown**.

## Rulings

[ruling: operator, 2026-10-23] On the review of the three Unattested notes: test both shapes for the logged effect (M1); restyling a guest, as new kinds of object rather than squeezed into old ones (M2); the rest as recommended (M3 to M10). The operator rules on what lands by merging this round.

## M1: the logged effect, both shapes tested

`node generation/2026-10-23-un-001/test-both.mjs` (run 2026-10-23) grades five flows three ways: the baseline as the notes ran it, shape (a) and shape (b).

| Flow | Baseline | (a) twins | (b) D9-X40 |
|---|---|---|---|
| I, install an identity | violation: E9-AUDIT broken, E9-LOCAL broken | violation: E9-LOCAL broken; E9-AUDIT created | the same as (a) |
| N, hand a link to the browser | violation: E9-AUDIT broken | holds | holds |
| U, answer a file request | violation: E9-AUDIT broken | holds | holds |
| D, a confirmed download | holds (restored at D9-X28) | holds; E9-AUDIT created at the first step | the same as (a) |
| R, the Regulator freezes an app | violation: E9-AUDIT broken | holds | holds |

**The two shapes agree on every flow.** They differ in cost: (a) needed seven twins for these five flows (D9-X01, X04, X05, X07, X10, X12, X42) and takes one more per effect, each a contract to grade and keep in step with its original; (b) is one entry and about twenty lines of `compose.mjs` with nine self-test checks (`--selftest`: 50 checks, PASS). (b) is also the stricter of the two: it composes D9-X24's claims with the effect's, so it keeps the gate's own break of E9-TNI, where a twin written as D9-X28 was copies only the effect's claims. **Verdict: (b) plausible, landed as D9-X40; (a) graded equivalent and dead on cost.**

**A finding the test surfaced, outside the logging gap:** flow I still violates E9-LOCAL under both shapes, at D9-X05 (grant), which states E9-LOCAL broken. Granting a capability to an identity build may let data leave the boundary through what was granted; logging the grant does not change that. It belongs to the shell's flow I, as a note back to Unattested.

## M2: restyling a guest page, on new kinds

D9-X41 lands on two new kinds, *page* and *presentation-rule*, both under data-value, so every data invariant applies to them unchanged. E9-IDEM and E9-MISS-IDENTITY are step invariants (carrier operation), which the vocabulary lacked. The contract holds only for rules that load nothing (**inferred** from CSS's own fetches: images, fonts, imports). Unattested's shell has a check that its rules load nothing, which is where that condition is enforced. **Verdict: plausible.**

## M3: the capture flow's E9-GFREE break

Confirmed as the design: D9-X07 keeps guest origin and no step produces E9-GFREE (rerun at this commit). No change.

## M4: the only way out of a contaminated process

Confirmed by reading `mapfill/invariants.js` and by rerunning the download chain with D9-X02: `compartment-context` raised at D9-X07, a violation at D9-X02, and none with D9-X28 in its place. Annotated beside the CONTEXT rules there: the journal append is the one broker every crossing goes through, as Phone's F-45 rules. The fresh-process operation is declined for now; Research_OS raises it when a desktop files into a project tree.

## M5: D9-X01 silent on attenuation

Confirmed: E9-ATTEN is reported "created then unknown" after D9-X12, silent at D9-X01 and every later step. **Verdict: needs refinement, not landed.** E9-ATTEN is a step invariant (it relates one transition's input and output capability), so asking a later step to "preserve" it is a category error; what a chain that attenuates before sending wants is that the send is authorized against the narrowed capability, which is E9-AUTH, and D9-X01 preserves E9-AUTH. What would close it: either `compose.mjs` stops carrying a step invariant forward from the step that produced it, or the chain policy for flow D asks for E9-AUTH where the note asked for E9-ATTEN. The first is a checker rule for its own round; D9-X01's generated text stays the generator's.

## M6: bounded repetition

Noted, not built: no second flow loops yet.

## M7: the Android pin's upstream

Dated fact (**secondary** here, read by the Unattested session 2026-10-22): LineageOS 24.0 on `android-17.0.0_r1` is the only branch built for either of Phone's devices. The pin stays at `android-16.0.0_r4` until Phone rules its F-48; observations from a 24.0 build would open their own binding set.

## M8: observations from a device

[ruling: operator, 2026-10-23] Recorded in `CLAUDE.md`'s rules: an observation bears only on the build it was made on; one run is a reading, never standing; observations raise a contract grade to monitored at most; a contradiction is a finding. The file that would hold observations waits for the first one.

## M9: a principal's lifecycle

D9-X42 suspend, D9-X43 resume, D9-X44 terminate, on a new kind, *principal*, with E9-SUSPENDED-NOEXEC (trace) produced by suspend and broken by resume. Each breaks E9-AUDIT as the other effect steps do, and each is repaired by D9-X40 (flow R above). Open for D9-X44: whether losing volatile state bears on any invariant; none in the vocabulary is about volatile state, so it is outside the vocabulary until one is. Bindings at the pin (`pm suspend`, `am force-stop`) are owed. **Verdict: plausible.**

## M10: settings, and the per-UID firewall

**Settings.** A held setting such as Do Not Disturb fits D9-X26 (compare-and-swap) as a data value with an expected prior value; no new kind is needed, since the guard is the prior value, not the kind. **Plausible.** **The per-UID firewall:** bound to D9-X12 at the pin. `external/iptables/extensions/libxt_owner.c` at `android-16.0.0_r4` parses `--uid-owner` (read; sha256 `d93c95a9...d3ad`, fetched here); `BpfNetMaps.java`'s hash reproduced here too. The match itself is the kernel's, outside the AOSP tree. Platform enforced, contract unknown: the platform neither knows of nor logs a root rule.

## Verdict

D9-X40, D9-X41 and D9-X42 to D9-X44 land as generated entries, unchecked, at their own tier; three new kinds and three new invariants enter the vocabulary under the operator's ruling; one binding lands. M5 needs refinement; M6 is noted; M3, M4, M7 and M8 are recorded.
