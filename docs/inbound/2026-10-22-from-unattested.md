# From Unattested, 2026-10-22: logged effects, and a host restyling a guest

A proposal, not a change: verify, then fold in or decline, and say which. Sent at the operator's request [ruling: operator, 2026-10-22, Unattested U-6]. Found by blueprinting Unattested's shell, a host for the web faces of guests that refuse the phone, in D9 operations and running `scripts/compose.mjs` on its flows (Unattested `BLUEPRINT.md` at `ce73072`, sections 4 and 5; Math_Map at `1c61663`).

## 1. An effect committed with its own log record

**Why.** Three of the shell's flows break e9-audit at their effect step, and no later step restores it: installing an identity breaks it at D9-X04 (isolate), handing a link to the system browser at D9-X01 (send), and answering a page's file request at D9-X05 (grant). Reproduce:

    node scripts/compose.mjs --chain D9-X04,D9-X05,D9-X12 --require e9-atten,e9-orig,e9-local,e9-auth,e9-audit,e9-mediated
    node scripts/compose.mjs --chain D9-X24,D9-X01 --require e9-mediated,e9-auth,e9-orig,e9-audit,e9-prov
    node scripts/compose.mjs --chain D9-X24,D9-X05,D9-X12 --require e9-mediated,e9-auth,e9-atten,e9-orig,e9-audit,e9-revoke

This is the gap Research_OS found for the nonce and the signature (`docs/inbound/2026-10-11-from-research-os.md`, proposal 1), recurring for isolation, sending and granting.

**The precedent says it may not be new.** That proposal landed as D9-X28, which is D9-X21 with one parameter fixed, not a new primitive. Here the same move looks available: D9-X24's contract already says "Any committed effect in this step and its required authenticated audit append share one atomic transition" (read in `map.json` at `1c61663`). A gate that commits the send, the grant or the isolation itself is X24 with its effect fixed. The checker cannot see that today, because a chain `D9-X24, D9-X01` reads as two steps, the second unlogged.

**Two ways to fold it in**, for the operator to choose between:

- **(a) Fixed-effect entries**, as X28 was: a gate-committed send, a gate-committed grant, a gate-committed isolation, each X24 with its effect parameter fixed, each producing e9-audit for its own effect.
- **(b) One combinator** (generation): *commit an effect through the gate*, taking any D9 effect and producing e9-audit for it while carrying the effect's other preservation claims unchanged. One entry instead of one per effect; it needs `compose.mjs` to treat a wrapped step as one step.

Three blueprints have now hit the gap; (b) is the case for not adding a fourth twin later.

## 2. A host restyling a guest's presentation

**Why.** The shell fits a guest's page to the phone by injecting a stylesheet chosen from the page's address. No D9 entry models a host acting on a guest's presentation, so the flow has no chain at all.

**Proposed contract** (generation):

- **Input:** the guest's page and a presentation rule chosen by the page's address alone.
- **Output:** the page with the rule applied.
- **Preserves:** every value the page computes and every request it sends; e9-orig and e9-prov of the guest's data; e9-noegress (the step sends nothing). It reads nothing from the page, so it raises no question for e9-ini.
- **Two properties the vocabulary may lack:** idempotence (applying the rule twice equals applying it once) and failure to identity (a rule whose selectors match nothing leaves the page as served).

**What it rests on.** "Every request it sends is unchanged" holds only if a stylesheet cannot make the page send. That is **unknown** as stated: CSS can trigger fetches (a background image, a font), so the contract either restricts rules to ones that load nothing or states the fetches as egress. The shell's own rules load nothing; a check there enforces it.

Per this repository's rules, a generated entry lands only from a graded round; this is the commission for one.

## 3. A break the design intends, for the record

In the shell's capture flow (`D9-X07, D9-X24, D9-X10, D9-X28`), e9-gfree is reported broken at the read. That is the design: a capture keeps its guest origin, and no step produces e9-gfree. Nothing is proposed; it is noted so a later reader of the verdict does not take it for a gap.
