# Grading: MM-DR-001, D9 operations and effect invariants

Date 2026-10-11. Grades the three candidates in `record.md` against sources and against this repository's code. Evidence marks follow the kit: **read** (seen in the source), **secondary** (a source says so, unchecked), **inferred**, **recalled** (from memory; a lead, never a basis), **unknown**. Verdicts are graded: confirmed, marginal, plausible, needs refinement, dead.

## 1. Findings about this repository's checker

ChatGPT ran the composition logic of `scripts/compose.mjs` (blob `86abede7440a64d39781b9b5decf1f77976b990f`, identical to this repository's file at the time, **read**: `git hash-object`) with parser and evidence stubs. Its four claims about the code were reproduced here against the real file with a separate script, not with the generator's code (**read**: output before the fix):

| Case | Reported | Grade |
|---|---|---|
| f preserves P, P implies Q | Q survives | Confirmed defect for implications between state facts. `{P} f {P}` with `P => Q` gives `{P} f {Q}`, not `{Q} f {Q}`. The map's one implication (limits to finite limits) relates preservation properties of functors, where the inference holds, so no current chain was wrong. |
| f breaks Q, P implies Q | P broken | Confirmed defect, same scope: a Q-breaking witness need not start in P. |
| break X, create X, silent step | X restored | Confirmed defect, live: silence was treated as unknown everywhere except after a production. |
| outputs [t, u] into inputs [t, v] | join match | Confirmed defect, latent: five entries take joint inputs (D2-X01 takes a surface and a curve on it). |

All four are fixed at commit `b34698e`: implications declare `over: "preservation"` or `over: "state"` and only the first is closed over; a production followed by a silent applicable step is "restored then unknown" or "created then unknown"; input kinds are joint operands and an unsupplied one makes the join "partial". `node scripts/compose.mjs --selftest` checks each rule and runs in `check-all`.

## 2. The load-bearing claim: is per-join checking sound?

**Settled: needs refinement, not dead.** The candidates disagree; the resolution:

- **Trace safety properties are per-join checkable.** "No output carrying W's data crosses the boundary" judges each run alone (a trace property in the sense of Clarkson and Schneider 2010, *JCS* 18(6):1157-1210, DOI 10.3233/JCS-2009-0393; **secondary**, publisher abstract). DeepSeek misclassified this and similar properties ("never crosses", "no unauthorized modification ever", provenance soundness) as hyperproperties because they quantify over all executions; every property does. Kimi and ChatGPT classified them correctly.
- **Noninterference composes sequentially over deterministic steps.** If each step maps low-equivalent states to low-equivalent states, so does the chain: `s ~ t => f(s) ~ f(t) => g(f(s)) ~ g(f(t))` (**inferred**; derived independently in this session and in ChatGPT's C3, which also cites Volpano, Smith and Irvine 1996, Theorem 6.8, for a typed language). DeepSeek and Kimi stated that noninterference is not compositional under sequential composition, citing McCullough, Zakinthinos and Lee, and Mantel. Those results concern hook-up of event systems with feedback and nondeterminism (**secondary**: the Zakinthinos and Lee abstract says the paper proves McCullough's conjecture that non-interference is composable *without* feedback, *JCS* 3(4):269-281, 1995). DeepSeek also cited that paper backwards, as a non-composability result.
- **What does break per-join checking:** declassification (by design), nondeterminism and concurrency (possibilistic properties), quantitative leaks (they add up), joint observations (ChatGPT's C6: two releases each independent of a secret bit whose pair reveals it), and timing or termination channels. These are reported as uncovered, never passed.
- **What the checker needs** for the relational case: a context label carried through the chain (implicit flows; Volpano, Smith and Irvine), and relational claims stated as preserving a named relation between runs, which compose by relation composition.

The prompt seeded the suspicion that noninterference defeats per-step checking. Two of three generators confirmed the seed and found citations to fit; one did not. Future prompts state such suspicions as open questions with their distinctions named (sequential or parallel composition, deterministic or nondeterministic steps).

## 3. Per candidate

**DeepSeek: needs refinement; weakest of the three.** Useful as corroboration of the operation core. Errors beyond section 2: Encrypt listed as breaking confidentiality (it is the step that makes sending safe); Sign listing provenance as preserved (signing creates the signature fact); Revoke listed as breaking authority-boundedness (removing authority cannot exceed it); Send listing locality as both preserved and broken; two implication relations reversed (it states implicit-flow safety and aggregation safety imply noninterference; noninterference implies them, so the stated direction would let a checker infer the strong property from a weak one). Citations: Gifford and Lucassen venue and pages confirmed (LFP 1986, pp. 28-38; **secondary**), its article DOI unconfirmed; Milner, Parrow and Walker 1992 marked GENERATED though correct as far as recalled (**recalled**).

**Kimi: needs refinement; good.** Correct event and information forms of locality; the program-counter label as a per-step sufficient condition; provenance subsuming compartment and guest origin as label granularities; audit completeness, erasability with a no-copies condition, leak budget and separability as new invariants; effect profiles stated relative to explicit environment assumptions; new relation kinds ("breaks-unless", "sufficient-condition-per-step"). Errors: the sequential noninterference claim (section 2); Join said to widen readers (by Denning's join rule the merged label is more restrictive, so fewer readers see it); erasability classed as a trace property though its definition is a dependence property; Decrypt's prose names noninterference broken while its JSON omits it; Declassify said to preserve the authority it requires as a precondition; the headline (dead) disagrees with its own bottom line (needs refinement), and the bottom line is the right one.

**ChatGPT: plausible; strongest of the three.** Correct invariant classes; sequential relational composition proved (C3); absence of a break distinguished from proof; a five-valued verdict (proved under stated assumptions, monitored prefix conforms, violation witnessed, unknown, whole-chain check required); current facts separated from preservation contracts; invariants bound to subjects and parameters; trace violations absorbing (C9); the signature policy shown under-specified (a stale signature after an owner change, and a replayed one, both verify), so the real policy binds owner, exact update, expected version and nonce with one atomic commit; declines to invent theorem numbers for sources it could not open. Its 27 entries and 19 invariants are not yet audited entry by entry.

## 4. What carries forward

- **Base list for MM-DR-002:** ChatGPT's 27 operations and 19 invariants, as conjecture. The three-way merge of entries happens at landing, with Kimi's provenance granularity and added invariants considered there.
- **Schema proposals for the operator** (none landed): an invariant `class` field (state, step, trace, relational, other hyperproperty); the five-valued verdict in `compose.mjs`; a context label threaded through chains; relational claims; Kimi's two relation kinds; domains as facets with the id prefix as birthplace (proposed in the session, not from the reports).
- **For the Phone trellis:** the merge axiom ("nothing merges without the owner's signature") needs the transaction binding in section 3 before it is enforceable.
