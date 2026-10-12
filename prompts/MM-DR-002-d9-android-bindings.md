# Title: Binding Abstract Operations on State to Android: Which Platform APIs Realize Each Operation, Where Android Enforces Their Effects, and Where Effects Escape Enforcement

**Prompt ID:** MM-DR-002 (second of three; takes the D9 entries returned by MM-DR-001 as input)
**Target:** a binding layer `mapfill/android.js` binding D9 (and D8) entries of Math_Map to Android APIs at a pinned AOSP tag
**Scaffold:** Math_Map (A-Viable-Fork/math_map); downstream user: the Regulator of A-Viable-Fork/phone (a privileged app shipped as a Magisk module)
**Direction:** For each abstract operation, find the Android APIs that realize it, where the platform enforces the operation's effects, and where effects escape every enforcement point.
**Date:** 2026-10-11

*Attach: `d9-entries.json`, `effect-invariants.json`, `invariant-relations.json` and `carrier-proposal.json` (the base list from the MM-DR-001 round: 27 operations, 19 invariants; GENERATED, not yet audited entry by entry). Before sending: strip the Scaffold Update Notes at the end.*

---

## Context and Setup

Math_Map holds operations as typed entries: input, output, invariants preserved and invariants broken. A new domain D9, "Systems and effects", holds abstract operations on state (send, store, read sensor, isolate, grant capability, revoke capability, declassify, and others; the attached list is authoritative). Its invariants include effect properties such as locality, provenance, compartment origin, guest origin and signature (the attached vocabulary is authoritative).

A **binding** says that a concrete API realizes an abstract operation, and records where it deviates. Math_Map already binds entries to Lean's Mathlib this way. This prompt asks for the Android binding. A later binding will map the same entries to desktop Linux, so the phone and the desktop share operations and differ only in bindings.

The bindings will be used by a privileged application on a rooted phone (the Regulator) that enforces personal policies over effects, for example "data originating in compartment W never leaves the device" (an invented example). Enforcement happens at Android's boundaries: Binder transactions, permission checks, AppOps, SELinux, network routing, storage access. Compartments are realized with Android user profiles, work profiles, or per-app sandboxes.

**Platform pin.** Use the AOSP Android 16 release tag on which LineageOS 23.2 is based, and state the exact tag (for example `android-16.0.0_rN`). Where stock OEM builds of Android 15 differ in a way that matters for enforcement, say so separately. Every code citation names a path at that tag.

### Claimed inputs (desk work, 2026-10-11, unverified)

Treat these as proposals to test. Do not assume any is correct unless independently supported.

1. Every effect that crosses an app's sandbox boundary passes through at least one enforcement point the platform controls (Binder, a permission check, AppOps, SELinux policy, the kernel's network stack).
2. A privileged application with root can observe, at those points, which app caused each effect, and attribute it to a compartment.
3. AppFunctions, Android's API for apps to declare typed functions that authorized agents can call, gives a place where apps declare operations, and could therefore carry effect profiles.

Claim 1 is the load-bearing one.

### Lessons carried from MM-DR-001 (settled in verification, apply them here)

- **An operation name does not fix its effect.** Whether `send` breaks locality depends on its destination; whether a merge is authorized depends on the current owner and version. Every binding must name the **parameters** that decide its effect, and the deviations must be stated per parameter value where they differ.
- **Absence of a break is not a proof.** For each binding, say which of these the platform can supply: *enforced* (a check the app cannot bypass), *monitored* (observable after the fact), *unknown*, or *not observable*. Do not report silence as enforcement.
- **Inputs are joint operands.** When an API needs several inputs (a value and a destination, a payload and a signature), list all of them; matching one does not satisfy the others.
- **Trace violations are absorbing.** An effect that crossed a boundary is not undone by deleting a copy later.

---

## Research Questions

### Q1. For each attached D9 entry, which Android APIs realize it?

For each entry, list the realizing APIs across these layers: Java and Kotlin framework APIs, NDK and system calls, Binder services in `system_server`, intents and broadcasts, content providers, `ClipboardManager`, shared and scoped storage, and AppFunctions. For each API report:

```json
{
  "entry": "D9-X01",
  "api": "fully.qualified.Class#method or syscall",
  "aospPath": "path/at/the/pinned/tag",
  "tag": "android-16.0.0_rN",
  "permissions": ["android.permission.X"],
  "appOps": ["OP_X"],
  "enforcementPoint": "where the platform checks it, with path",
  "parameters": { "name": "what it decides, e.g. destination inside or outside the boundary" },
  "deviations": { "preserves": ["invariant-id"], "breaks": ["invariant-id"], "note": "how this API differs from the abstract entry, per parameter value where it matters" },
  "assurance": "enforced | monitored | unknown | not observable",
  "verdict": "CONFIRMED | MARGINAL | PLAUSIBLE | NEEDS REFINEMENT | DEAD | UNVERIFIED"
}
```

Deviations are the point. For example, a broadcast intent may break locality in ways a direct socket write does not, because receivers are resolved at runtime. Record every such difference.

### Q2. Where does Android enforce each effect?

For each enforcement mechanism (UID sandbox, runtime and install-time permissions, AppOps, SELinux, `netd` and per-app network policy, scoped storage, user and work profiles, the Private Space added in Android 15), give: what it checks, where the check runs (path), what it can attribute (UID, package, user), and what it cannot see. Sub-targets: the AOSP permission and AppOps implementation in `frameworks/base/services`, `system/sepolicy`, `system/netd`, and the documentation for user profiles and Private Space.

### Q3. Where do effects escape enforcement?

List known channels by which data or authority crosses a boundary without passing an enforcement point that can attribute it. For each, give the mechanism, the Android versions affected, the evidence (paper, CVE identifier, or AOSP commit), and whether it is fixed at the pinned tag. Sub-targets:
- motion sensors carrying audio (AccelEve, Ba et al., NDSS 2020) and other zero-permission sensor channels;
- covert channels through shared resources (storage metadata, timing, `/proc` information, clipboard history);
- intent and content-provider confused-deputy problems (permission re-delegation, Felt et al. 2011);
- side channels studied in the mobile security literature since 2020;
- any channel by which a guest app's text reaches an agent without the platform recording its origin.

### Q4. Can AppFunctions or a similar declaration carry effect profiles?

Report what metadata an AppFunction declaration carries at present, who verifies it, and whether a declared effect profile could be checked against the app's actual behavior. Compare with any other declaration mechanism (Model Context Protocol tool annotations such as `readOnlyHint` and `destructiveHint`, the Android manifest, Data safety labels). Say whether each declaration is checked or merely asserted.

### Q5. Feasibility: can a privileged application enforce a compartment's effect policies at Android's boundaries?

Assess each step separately.

1. Every effect that crosses a sandbox boundary passes an enforcement point (claimed input 1).
2. Each enforcement point is observable from a privileged Magisk module, without modifying the platform.
3. Each observed effect is attributable to an app and a compartment.
4. The policy decision at each point is computable per call, fast enough not to break the app.
5. The escaping channels from Q3 are either closed by configuration or confined to a stated, small class.

For each step: inputs available, hidden assumptions, main obstacle, known counterexamples, verdict. Identify the earliest fatal step.

**Crux:** step 1 and step 5 together. Expected failure modes: zero-permission sensor channels; covert channels through shared resources; effects inside one app's process that the platform never sees (an app holding data from two compartments in memory). For each, state whether it is fatal or confines enforcement to a stated class, and characterize the gap: a missing enforcement point that could be added (local) or a channel no boundary check can see (structural).

---

## Anti-Hallucination Protocols

1. **Citation requirement.** Every API, permission or mechanism needs an AOSP path at the stated tag, or official documentation with its URL and date. Every attack needs its paper (authors, year, venue) or CVE identifier. If you cannot verify a citation, write "I was unable to verify this claim."
2. **Evidence labels.** Label each claim THEOREM, RESULT, CONJECTURE, HEURISTIC, NUMERICAL, FOLKLORE, or GENERATED (proposed without a source).
3. **Version specificity.** Never state Android behavior without the version. Behavior changed across Android 10 to 16 for storage, background starts, clipboard access and sensors. Say which version each statement holds for.
4. **AOSP versus OEM.** Distinguish AOSP behavior from OEM builds. Do not attribute an OEM feature to AOSP.
5. **Documented versus implemented.** Distinguish what the documentation promises from what the code at the tag does. Where they differ, report both.
6. **Exact identifiers.** Permission names, AppOps names and API signatures must be exact. Do not paraphrase an identifier.
7. **No motivational optimism.** Do not say enforcement "should be possible" without naming the exact enforcement point and its path.

## Verdict Categories

| Verdict | Meaning |
|---|---|
| CONFIRMED | Code at the pinned tag or a rigorous published result directly establishes the claim. |
| MARGINAL | Holds in a restricted configuration or Android version. |
| PLAUSIBLE | No direct evidence; consistent with what is known; no obstruction found. |
| NEEDS REFINEMENT | The claim has merit but is imprecise or has a gap. |
| DEAD | Code, a published attack, or a structural fact kills it. |
| UNVERIFIED | Insufficient sources to assess. |

## Output Format

1. **Executive Summary.** One paragraph: the overall verdict on boundary enforcement and the main finding.
2. **Q1 to Q5,** each with verdicts.
3. **The bindings** as one JSON array in the shape given in Q1.
4. **Enforcement map:** mechanism, what it checks, path, what it attributes, what it misses.
5. **Escape channels:** channel, versions, evidence, fixed at the tag (yes or no), confinable by configuration (yes or no).
6. **Feasibility Table** for Q5: step, best supporting evidence, main gap, verdict.
7. **Bottom-Line Assessment:** one verdict, and the strongest defensible reformulation if boundary enforcement fails as claimed (for example, "enforceable for effects crossing Binder; in-process mixing needs one compartment per process").
8. **Bibliography** with full identifiers.

Do not try to be encouraging. Try to be correct. If an effect escapes every boundary, name the channel and say so plainly.

---

## Scaffold Update Notes

*(Strip before sending.)*

- The report is a lead. Every AOSP path is re-read at the stated tag before a binding lands; the tag is recorded in Math_Map and in Phone's `upstream/lock.json` as an upstream with file hashes.
- Bindings land in a new `mapfill/android.js` modeled on `mapfill/formal.js`, each with a receipt from the AOSP source.
- Escape channels feed Phone's program (F-52, the sensing layer; L19 and T0-MEM) as candidate Linter rules or exclusion reservoir entries; propose there, the operator rules.
- If step 1 or 5 fails, `compose.mjs` must report effects on unenforced channels as "unenforced" rather than as preserved.
- Run MM-DR-003 (prior art) after this returns.
