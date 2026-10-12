# Inbound, 2026-10-11: findings on compose.mjs, and the response

An external session's note on `scripts/compose.mjs`, pasted by the operator; its text is kept verbatim below the response. Each finding was verified against the code before anything changed. Evidence marks as in the kit conventions.

## Response

| # | Finding | Verified | Disposition |
|---|---|---|---|
| 1 | A chain that breaks, restores and breaks again is reported by its first break | Confirmed (**read**, and reproduced: the old logic reports the four-step oscillation as broken at step 1 and the policy as a violation although the invariant holds at the end) | Folded in. The status follows the final state, over the invariant's whole history of breaks and productions: restored when it ends produced after a break (the last loss and the production after it, the first of each run), the new status restored then broken when it ends broken after a restoration, and the history listed when there are more than two events. The policy verdict reads that status, so it follows the final state. A step that both breaks and produces counts as breaking, as before. |
| 2 | Relational and hyperproperty invariants lose their evidence | Confirmed (**read**) | Half folded in, half held. The class override stays: per-join claims cannot establish a property of sets of runs, so the verdict remains "whole-chain check required". The overridden status and evidence are now kept, as `claimedStatus` and `claimedEvidence`, so a formal step claim is visible instead of lost. The operator then ruled on linking a composite to an external whole-chain proof [ruling: operator, 2026-10-11]: a chain may cite one (`--proof ID=citation`), the verdict is "holds by whole-chain proof", and its grounding is inherited from the chain's weakest link. A step that states the invariant broken still makes it a violation. Folded in, with four self-test checks. |
| 3 | "Whole-chain check required" ranks worse than "unknown" | Read; the ordering is undocumented | Kept as it is: the operator saw no reason to choose either way (2026-10-11), so the order stands, noted in the code. The case for the present order: "unknown" is silence that more map claims could resolve, while "whole-chain check required" is a gap no per-step claim can ever close, so it needs evidence of another kind. The case for the reverse is the note's: the second names its remedy. Either way the per-invariant verdicts are all shown; the order only sets the chain's single worst verdict. |
| 4 | `output` is not closed under the vocabulary's relations | Confirmed (**read**) | Folded in, one step further than the note proposes. `mapfill/invariants.js` defines an implication over "state" as "from holding in a state gives to in that state", so a step that makes P hold makes Q hold; outputs are now closed under equivalence (both ways) and state implication. An implication over "preservation" relates preserving, not holding, and carries no output. |
| 5 | An invariant missing from the vocabulary can read as survival | Confirmed for direct calls of `compose` (reproduced); unreachable through the map, because `mathmap.mjs --check` rejects unknown ids on generated entries, on `LINKS` and on relations (**read**) | Folded in as a guard: such an invariant is reported unknown, with a note, never as surviving. |
| 6 | Self-test coverage | Confirmed (**read**) | Folded in. Fifteen checks added: equivalence carrying preservation both ways and breaking, outputs carried by equivalence and by state implication but not by preservation implication, created then broken, the oscillation in both endings with the policy verdict for each, consecutive breaks, an unknown id, and the kept evidence of a relational override. Run against the old logic, seven of them fail, each on a case the note names; all pass on the new. |
| 7 | A join of unknown kind carries no evidence | Read | Declined. A join of unknown kind asserts nothing, so it has no evidence level to be the weakest of; the chain's weakest link ranks the claims the chain asserts. The unknown join is listed in the chain's joins and printed in the report. |

The three Research_OS flows composed through this engine (`blueprints/record-and-link.md`: a ruling, a ruling taking effect, docking) keep their policy verdicts under the new logic, checked by rerunning each.

## The note, verbatim

# From an external session, 2026-10-11: six findings on compose.mjs

A proposal, not a change: verify, then fold in or decline, and say which.
Read against `scripts/compose.mjs` and `mapfill/invariants.js` at the commit
in this repository's MANIFEST. Evidence marks: **read** (the code states it),
**inferred** (I derived it from the code), **question** (intent unclear).

## 1. A chain that breaks, restores, then breaks again is reported as "broken"

**Read**, `compose.mjs`, the `result` mapping, the "restored" and "broken"
branches. Take a chain `[a, b, c, d]` where a breaks X, b outputs X, c breaks X,
d outputs X. Trace the branches:

- `b = 0` (first break), `c = 1` (first output after the first break).
- Branch 1 (`restored`) requires `!steps.slice(c+1).some(s => s.broken.has(v))`.
  `steps.slice(2)` contains c, which breaks X, so the branch fails.
- Branch 3 (`created then broken`) requires `c0 < b`, i.e. the first output
  precedes the first break. It does not.
- Branch 4 (`broken`) fires.

The report says "broken at step 1". It never mentions that X is present at step
2 and step 4. The policy verdict for X, computed by `verdictOf`, reads the
status `"broken"` and returns `"violation stated"`, so the chain's worst verdict
is `"violation stated"` even though X holds at the end of the chain.

The status taxonomy in the docstring (survives, broken, unknown, created,
restored, restored-then-unknown, created-then-unknown, created-then-broken) has
no slot for restored-then-broken-again or for a second restoration, and the
code resolves the case by falling back to the first break. The engine handles
at most one restoration.

**Fix or decide.** Either add the oscillation statuses (and a rule for which
break and which restoration are reported when there are several), or record
that first-break is deliberate and make the policy verdict read the final
state rather than the first break. The second is smaller; the first is more
honest to a chain that oscillates.

## 2. Relational and hyperproperty invariants lose their evidence unconditionally

**Read**, the `wide` override:

    for (const x of result) if (wide(x.invariant) && !["broken", "created then broken"].includes(x.status)) {
      x.claimedStatus = x.status; x.status = "whole-chain check required"; delete x.evidence;
    }

Even when the step's claim is `formal` — e.g. `e9-converge`, proved in
A-Viable-Fork/Research_OS `lean/ResearchOS/Journal.lean` — the map reports
"whole-chain check required" and discards the evidence level. There is also no
field on the result that links a relational invariant to an external whole-chain
proof, so the RO-BP-001 record's citation of `ResearchOS.converge` cannot be
seen by the compose engine.

**Question.** Is the class rule intended to override even a formal claim, or
should a `formal` evidence level survive the class override (the per-join
limitation still being reported, but as a note rather than as a lost claim)?
Separately, should there be a way to link a composite to an external whole-chain
proof, as RO-BP-001 does by hand?

## 3. Policy verdict ordering places "whole-chain check required" worse than "unknown"

**Read**, `VERDICTS = ["violation stated", "whole-chain check required", "unknown", "holds under the map's claims"]`.

"Unknown" means the map is silent. "Whole-chain check required" means a
per-join check cannot decide it, which names the kind of check to run next. I
would expect "unknown" (no information) to be the worse verdict and "whole-chain
check required" (actionable) to be the milder one. Is the current ordering
deliberate — a known debt worse than mere silence — or a default that was never
inspected?

## 4. `output` is not closed under the vocabulary's relations

**Read**, `compose.mjs`:

    preserved: closure(direct("preserved"), R, "down", E.relation),
    broken: closure(direct("broken"), R, "up", E.relation),
    output: direct("output"),

If a step outputs P and the vocabulary states P equivalent to Q (e.g.
`birational-type` equivalent to `function-field`), then Q is not added to
`output`. Whether this matters depends on whether "output" means "produces a
carrier" (a blow-up produces an exceptional divisor) or "produces a state
property" (a transform produces a Markov process). The vocabulary's equivalences
are mostly state properties, so producing one plausibly produces the other.

**Question.** Is the asymmetry deliberate, or should `output` be closed under
equivalence only, leaving implication alone (an output that implies a state
property does not output the implication)?

## 5. An invariant not in the vocabulary can be reported as "survives where it applies" with no evidence

**Inferred**, `compose.mjs`, the `applies` helper and the `survives` branch.
If an entry's `preserved`, `broken` or `output` list names an invariant not in
`mapfill/invariants.js`, `carrierOf[v]` is undefined and `applies` returns false
at every step. `silent` is then empty, `kept` is empty, and the branch returns
`status: "survives"` with `evidence: ev([])`, which is null. A missing
vocabulary entry can therefore read as survival.

**Question.** Does `mathmap.mjs` reject unknown invariant ids in an entry's
invariant list before `compose.mjs` sees them? If yes, this is unreachable and
the report can say so. If no, the `survives` branch should at minimum report a
survival with no carrier as "unknown" rather than as survival.

## 6. Selftest coverage

**Read**, `selftest()` in `compose.mjs`. Twenty-two synthetic chains cover
implication over preservation versus over state, restoration, creation,
joint-input matching, narrowing, partial, mismatch, relational override,
policy verdicts, and context labels. They do not cover:

- **Equivalence**, either direction. The only equivalence in the codebase
  (`birational-type` ⟺ `function-field`) is exercised through the real chain
  `D2-118, D2-117`, which is a single path through the closure both ways.
- **Oscillation**, the case in finding 1.
- **Created then broken**, the branch the code carries for it.
- **`output` not closed**, the case in finding 4.
- **Unknown invariant id**, the case in finding 5.

Each is a one-`want` addition to the existing harness. The oscillation case is
also the regression test for finding 1.

## 7. Join evidence is dropped when either step lacks `actsOn`

**Read**, `compose.mjs`, the `joins` map:

    if (!a.actsOn || !st.actsOn) return { from: a.id, to: st.id, status: "unknown" };

No `evidence` field is attached. A join with unknown kind is therefore not
included in `asserted`, and does not contribute to the chain's weakest link.
Whether that is intended — an unknown join is unknown at every evidence level —
or a gap is a question for the report. If a step lacks `actsOn`, its joins
contribute nothing to the chain's weakest claim, which may understate the
weakness of a chain that includes it.

## Suggested next steps

1. **Finding 1** is the only one I would call a defect on the code's own terms,
   because the code already claims to track restorations and the policy verdict
   inherits the miss. Fix or make explicit before the code goes into the map.
2. **Findings 2 to 7** are questions about intent. If each has an answer, the
   answer is worth a receipt in the code, in the vocabulary's `class` field, or
   in `CONTRACT.md`.
3. **If the code is going into the map as entries**, the finding-1 chain
   becomes a synthetic test case in `--selftest`, the fix becomes a correction,
   and the prior checker grades the correction. That is the loop the kit is
   built for, and this is its first real test.
