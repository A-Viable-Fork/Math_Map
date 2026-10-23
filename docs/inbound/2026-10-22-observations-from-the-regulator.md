# From Unattested, 2026-10-22: device observations, and two lifecycle gaps

A proposal, not a change: verify, then fold in or decline, and say which. Written at the operator's request (2026-10-22). Its companion in Phone proposes that the Regulator act as this map's instrument (Phone `docs/inbound/2026-10-22-regulator-as-instrument.md`, on branch `claude/inbound-from-unattested`). Everything below is generation except where a fact is marked.

## 1. The gap this would fill

Of the 51 bindings in `mapfill/android.js`, the 46 that name an API grade their contract as unknown; the other 5 are not observable (read, at `1c61663`). The rule here keeps it that way on purpose: "Bindings are generated claims with hashed sources, never a device or host test" (`CLAUDE.md`, read). The proposal keeps that rule and adds a layer beside it.

## 2. An observation layer, apart from the bindings

**What an observation is.** One run of one operation on one build, recorded as: the D9 entry and the binding it went through; the build it ran on (tag and build id, both public); the subject, always a probe app built for the purpose, never a person's app, so no instance data rides along; the postcondition the contract predicts; what was observed; and a receipt, the hash of the log excerpt that recorded it.

**What it may change.** A binding's text and its generated grades stay untouched. An observation is evidence the grading reads, as an audit grade is. Proposed grading rule, for the operator to rule on:

- Observations raise a binding's assurance only on the build they were made on. Observations from the pinned downstream (LineageOS 23.2 at `BP4A.251205.006`) bear on the pinned bindings; observations from any other build open their own binding set.
- A single observation is a reading, never standing. Standing needs the observation reproduced, by a second run and by an observer independent of the actor: the probe attempting the use, not the service that performed the action reporting on itself.
- Observations can raise a contract grade to monitored at most. Enforced needs an argument from the source at the pin as well, since an observation shows what happened on the runs that ran, not what every run must do.
- An observation that contradicts a contract is a finding, the precondition this repository already requires before a flag or a correction.

**Where it would live.** A file beside `android.js` with its own contract, or a directory of receipts in the shape of `excerpts/`; the operator's call.

## 3. Two operations D9 lacks: a principal's lifecycle

The Regulator freezes, thaws and suspends apps, and stops one holding call mode with no call (Phone `apps/regulator/README.md` at `4f0aab4`, read). No D9 entry acts on a principal's lifecycle. Draft contracts, for a graded round:

**Suspend a principal.** Input: a principal (an app, a user), the authority to suspend it. Output: the principal cannot run, start, or receive events until resumed; its stored state is unchanged. Preserves e9-prov, e9-orig and the principal's stored data. Its inverse, resume, restores the principal's ability to run and grants nothing it did not hold before.

**Terminate a principal's running instances.** Input: a principal and the authority. Output: none of its processes runs; stored state is unchanged, volatile state is lost. Open: whether losing volatile state breaks anything in the vocabulary, or is outside it.

**What they produce.** Probably an invariant the vocabulary lacks: *no execution while suspended* (class trace), checkable by the same audit that checks e9-revoke.

## 4. Two smaller items

1. **Settings.** Changing a held system setting (Do Not Disturb, for one) reads as D9-X26 compare-and-swap only if the setting is treated as a guarded resource with an expected prior value. Whether that is the right reading, or a gap, is a grading question.
2. **The UID firewall.** The Regulator's per-app network routes are kernel firewall rules by UID. That reads as D9-X12, attenuating the app's network capability, and `android.js` has no binding for it. A binding at the pin is owed before any observation of it can bear on anything.
