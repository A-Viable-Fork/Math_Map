---
Kind: expression
Author: an agent session, on the operator's commission
Commission: the operator's rulings of 2026-10-23 on the Unattested inbound notes (`docs/inbound/2026-10-22-from-unattested.md`, `2026-10-22-flow-d-grading.md`, `2026-10-22-observations-from-the-regulator.md`), reviewed item by item as M1 to M10 in the Research_OS project
Date: 2026-10-23
---

# Generation: logged effects, a host restyling a guest, and a principal's lifecycle (UN-001)

## Reaching for

The Unattested shell and Phone's Regulator chain their flows in D9 and found four things the map cannot say: an effect committed with its own audit record (three effect steps break E9-AUDIT and nothing restores it), a host restyling a guest's page, suspending or terminating a principal, and the per-UID firewall the Regulator routes apps with. The operator asked for both shapes of the logged effect to be tested, and for new kinds of object where an operation acts on something the map has no kind for [ruling: operator, 2026-10-23].

## Seeds

The inbound notes' draft contracts: (a) fixed-effect entries in D9-X28's manner, (b) one combinator; a presentation rule with idempotence and identity on no match; suspend, resume and terminate with a trace invariant, no execution while suspended. D9-X24's own contract supplies the atomicity (b) rests on: "Any committed effect in this step and its required authenticated audit append share one atomic transition" (read, `mapfill/generated.js`).

## Candidates

1. **Shape (a), fixed-effect twins.** One entry per effect, its claims the effect's with E9-AUDIT moved from broken to produced. Built in `test-both.mjs` only, for the test.
2. **Shape (b), D9-X40, commit an effect through the gate.** A combinator, written `D9-X40(D9-X01)` in a chain. Its claims are D9-X24 followed by the effect, as a two-step chain gives them, with E9-AUDIT produced instead of broken. Needs `scripts/compose.mjs` to read a wrapped step as one step.
3. **D9-X41, apply a presentation rule to a guest page,** on two new kinds, *page* and *presentation-rule* (both data values), with two step invariants, E9-IDEM and E9-MISS-IDENTITY.
4. **D9-X42 suspend, D9-X43 resume, D9-X44 terminate a principal,** on a new kind, *principal*, with a trace invariant, E9-SUSPENDED-NOEXEC.
5. **An Android binding for D9-X12 through the per-UID firewall** (`iptables -m owner --uid-owner`, as root).

Prior art, searched after generating: (b) is the reference-monitor pattern in which the monitor and the commit are one transition (Anderson, 1972, **recalled**); wrapping an effect in a handler that adds logging is the algebraic-effects handler shape the MM-DR-001 prompt named (**recalled**). Suspension as a lifecycle state is Android's `pm suspend` and cgroup freezing (**recalled**).

## Against the obvious

The obvious fix for a missing log record is a twin per effect, as D9-X28 was. Candidate 2 departs from it: the gate already promises atomicity for any effect, so the gap is in what a chain can express, and one entry with a checker change closes it for every effect, present and future.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1, 2 | grading, with `test-both.mjs` | conjecture | a flow where the two shapes disagree, or where (b) produces a claim the two-step chain would not |
| 3, 4 | grading | conjecture | a contract that a binding at the pin contradicts |
| 5 | grading | binding, hashed source | a source at the tag that does not parse the match |
