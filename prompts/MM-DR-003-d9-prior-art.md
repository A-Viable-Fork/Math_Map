# Title: Prior Art for a Typed Atlas of System Operations With Effect Profiles, Bound to Platform APIs and Used to Check Personal Policies

**Prompt ID:** MM-DR-003 (third of three; run only after MM-DR-001 and MM-DR-002 have returned)
**Target:** novelty and overlap assessment for Math_Map's D9 domain and its Android binding
**Scaffold:** Math_Map (A-Viable-Fork/math_map)
**Direction:** Find existing work that already does what D9 and its bindings propose, in whole or in part, and say exactly where it overlaps and where it differs.
**Date:** 2026-10-11

*Attach: the D9 entries, the invariant vocabulary and the Android bindings returned by MM-DR-001 and MM-DR-002. Before sending: strip the Scaffold Update Notes at the end.*

---

## Context and Setup

The attached design (generated, unverified) has four parts:

1. **An atlas of abstract operations on state** (send, store, read sensor, isolate, grant, revoke, declassify and others), each typed by input, output, and the named invariants it preserves or breaks.
2. **A vocabulary of effect invariants** (locality, provenance, compartment origin, guest origin, signature and others) with carriers and relations.
3. **Bindings** from each abstract operation to the concrete APIs that realize it on a platform (Android first, desktop Linux later), with recorded deviations.
4. **A composition checker** that takes a chain of operations and reports, join by join, which invariants survive. It is used to check a person's own policies over effects (an invented example: "data from compartment W never leaves the device").

The question is whether this exists, and if parts of it exist, which parts and how well.

---

## Research Questions

### Q1. Does any existing system combine all four parts?

Search for a system that holds abstract operations with effect profiles, binds them to platform APIs, and checks user-written policies by composing those profiles. For each candidate: what it covers of the four parts, its scope, whether it is maintained, and the citation.

### Q2. Which existing work covers each part separately?

For each part, find the strongest existing work. Sub-targets:

- **Android API effect maps:** SuSi (Rasthofer, Arzt and Bodden, NDSS 2014, sources and sinks by category); PScout (Au et al., CCS 2012) and Axplorer (Backes et al., USENIX Security 2016), permission maps; Stowaway (Felt et al., CCS 2011); TaintDroid (Enck et al., OSDI 2010); FlowDroid and IccTA (Arzt et al.; Li et al.); DroidSafe (Gordon et al., NDSS 2015). Report how each classifies APIs, whether the classification is an effect profile in the sense above, and whether it is current for Android 15 or 16.
- **Policy checking over effects:** AWS Zelkova (Backes et al., FMCAD 2018); Open Policy Agent and Rego; Datalog-based policy languages; CaMeL's capability policies (Debenedetti et al., 2025).
- **Typed effects in languages:** Koka, Unison abilities, Eff, OCaml 5 effects, Haskell effect libraries. Report whether any maintains a shared library of platform operations with effect types.
- **Capability operating systems:** Fuchsia's component framework and capability routing, Genode, seL4 with CAmkES. Report whether their capability declarations function as an atlas of operations.
- **Agent tool declarations:** Model Context Protocol tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`), Android AppFunctions metadata, and any 2025 or 2026 proposal for typed agent tool effects.

### Q3. For the closest prior work, what exactly is the difference?

For the three closest matches, state: what they do that the design does not, what the design does that they do not, and whether the difference is substantive (a capability neither has) or presentational (the same thing organized differently). Do not overstate novelty. If the design is a recombination of known parts, say so.

### Q4. What should the design adopt rather than rebuild?

Name existing classifications, vocabularies or datasets that the design could import directly (with their licenses), and any known failure of earlier attempts that the design should not repeat.

---

## Anti-Hallucination Protocols

1. **Citation requirement.** Authors, year, venue or arXiv identifier, and a URL for software. If you cannot verify a citation, write "I was unable to verify this claim."
2. **Evidence labels.** Label each claim RESULT, SYSTEM (exists and is described), CLAIMED (described but not checked), or FOLKLORE.
3. **Maintenance status.** For every system, give the date of its last release or commit, and the platform version it targets. A 2014 Android map is not a 2026 one.
4. **No novelty inflation.** "I found nothing" is weak evidence. Report it as UNVERIFIED, not as novel.
5. **No motivational framing.**

## Verdict Categories

For each part of the design, give one of: PRIOR ART EXISTS (a system does this), PARTIAL (done in a restricted form), RECOMBINATION (known parts, new arrangement), NOVEL AS FAR AS FOUND, UNVERIFIED (insufficient search).

## Output Format

1. **Answer:** does the whole design exist, in one paragraph.
2. **Part-by-part table:** part, closest prior work, overlap, difference, verdict.
3. **The three closest matches** in detail (Q3).
4. **Adopt list** (Q4), with licenses.
5. **Bibliography.**

Do not try to be encouraging. Try to be correct.

---

## Scaffold Update Notes

*(Strip before sending.)*

- Prior art found here is searched after generation by design (CLAIMS.md, the generation loop). Record in the D9 generation record which generated parts it confirms as prior art, which it reframes as recombination, and which survive as new.
- Any classification adopted (SuSi categories, for instance) is landed as a source with its license before use, or held as a hash-only row if its rights are unstated.
- If the whole design exists, D9 becomes a binding to that work rather than a parallel build: propose, the operator rules.
