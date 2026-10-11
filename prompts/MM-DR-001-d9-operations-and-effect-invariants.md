# Title: Operations on State and Their Effects: A Typed Domain of System Operations With Named Effect Invariants, and Whether Personal Policies Over Effects Can Be Checked Step by Step

**Prompt ID:** MM-DR-001 (first of three; MM-DR-002 binds this domain to Android, MM-DR-003 searches prior art and runs last)
**Target:** a new domain D9, "Systems and effects", in Math_Map; new effect invariants in `mapfill/invariants.js`
**Scaffold:** Math_Map (A-Viable-Fork/math_map), its entry schema and composition checker `scripts/compose.mjs`
**Direction:** Generate the operations and the invariant vocabulary a typed map needs to state and check effect policies, then test whether such policies can be checked one join at a time.
**Date:** 2026-10-11

*Before sending: strip the Scaffold Update Notes at the end.*

---

## Context and Setup

Math_Map is a typed map of mathematical transformations in eight domains (combinatorics, algebra and algebraic geometry, logic and proof theory, topology, probability and information, analysis, category theory, computational methods). Each entry is one operation with this shape:

```json
{
  "id": "D9-X01",
  "domain": "D9",
  "name": "...",
  "kind": "Transformer",
  "tags": ["..."],
  "description": "one or two sentences",
  "input": "what the operation takes, precisely",
  "output": "what it returns, precisely",
  "preserved": "invariants that hold of the output if they held of the input",
  "broken": "invariants the operation can destroy",
  "invariants": { "preserved": ["invariant-id"], "broken": ["invariant-id"], "output": ["invariant-id the step creates"] },
  "actsOn": { "input": ["carrier kind"], "output": ["carrier kind"] }
}
```

Invariants are named in a controlled vocabulary. Each has an id, a name, a kind, a **carrier** (the kind of object that has it; "operation" for a property of the step itself), and a definition. Relations between invariants are `implies` or `equivalent`, each with a source.

A composition checker takes a chain of entries applied in order and reports, at each join, whether the output of one step fits the input of the next (match, narrowing, or mismatch: an unstated conversion), and which invariants survive, break, are restored or are created. An invariant is judged only at steps that act on its carrier. Silence means the map does not say.

The eight domains have no home for **operations on state with effects**: sending a message, storing data, reading a sensor, isolating a computation, granting or revoking an authority, declassifying information, dispatching to another component. The person building the map wants a ninth domain for these, because they intend to write personal policies over effects and check programs against them through the map. Invented examples of such policies:

- "Data originating in compartment W never leaves the device."
- "Nothing is merged into the record without the owner's signature."
- "No agent acts on text that came from a guest application."

Policies are tiered and ranked; a higher-ranked policy overrides a lower one when they conflict. That ordering is out of scope here. This prompt concerns whether each policy can be stated as invariants over operations and checked by the composition checker.

### Claimed inputs (desk work, 2026-10-11, unverified)

Treat these as proposals to test, not as established. Do not assume any of them is correct unless independently supported.

1. **A seed list of six operations:** send, store, read sensor, isolate, grant capability, revoke capability. The claim is that these six are a sufficient core from which the rest of the domain can be built.
2. **A seed list of five effect invariants:** locality (data stays within a boundary), provenance (the origin of data is known and carried), compartment origin (which compartment data came from), guest origin (whether data came from an untrusted application), signature (whether a value carries a valid signature by a named key).
3. **The checkability claim:** each example policy above can be stated as preservation of one or more of these invariants, so a chain of operations satisfies the policy exactly when no step breaks the invariant on the relevant carrier.

Claim 3 is the load-bearing one. One suspicion is already on record: some security properties, noninterference in particular, are properties of sets of executions (hyperproperties) rather than of single steps, and per-step checking may be unsound for them.

---

## Research Questions

### Q1. Which formal theories already name operations on state and their effect properties, and what does each one give the map?

Survey the theories below. For each, report: the operations it formalizes, the properties (invariants) it names, the objects those properties belong to, whether its properties compose, and the exact citation.

Sub-targets:
- **Effect systems:** Gifford and Lucassen (1986); Talpin and Jouvelot (1992); Nielson and Nielson on type and effect systems.
- **Algebraic effects and handlers:** Plotkin and Power (2001 to 2003); Plotkin and Pretnar (2009); Leijen on Koka and row-typed effects.
- **Information-flow control:** Denning (1976, the lattice model); Goguen and Meseguer (1982, noninterference); Volpano, Smith and Irvine (1996, type system for secure flow); Myers and Liskov (decentralized label model); Sabelfeld and Myers (2003 survey); Sabelfeld and Sands (2005 or 2009, dimensions of declassification).
- **Capabilities:** Dennis and Van Horn (1966); Miller (2006 thesis, robust composition); Maffeis, Mitchell and Taly (2010, object capabilities); Klein et al. (2009, seL4) and the seL4 integrity and confidentiality proofs; CHERI capability hardware.
- **Process calculi:** Milner's pi-calculus, and any typed variant with effect or locality annotations.
- **Recent agent security:** Debenedetti et al. (2025, "Defeating Prompt Injections by Design", CaMeL), for capabilities attached to values.

### Q2. Generate the D9 entries.

Produce between 15 and 30 entries in the schema above. Start from the seed six and add what the theories in Q1 show is missing: for example declassify, endorse, delegate, attenuate, spawn, join, encrypt, decrypt, sign, verify, log, erase. For each entry:
- fill every field;
- name each preserved and broken invariant by id;
- give the source that supports each preserved or broken claim, or mark the claim GENERATED if no source supports it;
- give a confidence verdict from the scale below.

Mark which entries are **primitive** (not expressible as a chain of other D9 entries) and which are **derived** (give the chain).

### Q3. Generate the effect-invariant vocabulary.

Produce between 8 and 20 invariants in this shape: `{ id, name, kind, carrier, definition, source }`. Test the five seed invariants first: keep, split, merge or replace each, and say why. Add what the theories require: for example integrity as distinct from confidentiality, authority (who can cause an effect), and freshness. Give every relation you assert (`implies`, `equivalent`) with its source.

For each invariant, state its **class**: a property of one state, of one step, of one execution trace, or of a set of executions (a hyperproperty, in the sense of Clarkson and Schneider 2010). This classification is required, not optional.

### Q4. Dedicated audit: is per-join checking sound for each invariant?

Explicitly check whether each invariant from Q3 is preserved under sequential composition: if every step preserves it, does the whole chain? Use the literature on composability of security properties. Sub-targets: McCullough (1987 and 1988, restrictiveness and hook-up); Zakinthinos and Lee; Mantel (2002, on composing noninterference properties); Clarkson and Schneider (2010); Rabe or Finkbeiner on hyperproperty verification. If the literature shows that an invariant is not compositional, say so explicitly, give the counterexample or the result, and state the weakest extra condition under which it becomes compositional.

### Q5. Feasibility: can a personal policy over effects be checked by per-join invariant propagation?

Assess each step separately. Do not infer one step from another.

1. Every D9 operation has a well-defined effect profile (preserved and broken invariants) independent of the context it runs in.
2. Effect profiles compose: the profile of a chain is determined by the profiles of its steps.
3. Each example policy can be stated as preservation of named invariants.
4. Per-join propagation is **sound**: if no step breaks the invariant, the chain satisfies the policy.
5. Per-join propagation is **useful**: it does not reject so many correct chains that it cannot be used.

For each step report: whether it is well-defined, what inputs exist, hidden assumptions, the main obstacle, known counterexamples, and a verdict. Identify the earliest fatal step.

**Crux:** step 4. The expected failure modes are (a) hyperproperties such as noninterference, which per-step checks cannot capture; (b) implicit flows through control flow, timing or resource use; (c) aggregation, where outputs that are harmless separately reveal something together; (d) context dependence, where the same operation has different effects in different environments. For each failure mode, say whether it is fatal to the whole approach or confines it to a stated subclass of invariants, and name that subclass.

Characterize the gap precisely: is the gap between per-join checking and whole-chain truth a matter of a missing side condition (local, repairable) or of the property's logical class (structural)?

---

## Anti-Hallucination Protocols

1. **Citation requirement.** Every theorem, definition or result cited needs authors, year, venue or arXiv identifier, and the theorem or section number where available. If you cannot verify a citation, write "I was unable to verify this claim."
2. **Evidence labels.** Label every nontrivial claim THEOREM, RESULT, CONJECTURE, HEURISTIC, NUMERICAL or FOLKLORE.
3. **GENERATED is a label too.** Any entry field, invariant or relation you propose without a supporting source is labeled GENERATED. Generated content is welcome; unlabeled generated content is not.
4. **Do not conflate static and dynamic.** A type-level effect annotation is a static claim about a program. A runtime monitor is a dynamic one. A noninterference proof is a claim about all executions. Say which one each result is.
5. **Do not conflate confidentiality and integrity.** They are duals with different composition behavior. Say which one each invariant concerns.
6. **Do not transfer results across models without saying so.** A result proved for a language, a calculus or a kernel holds for that model. Name the model.
7. **No motivational optimism.** Do not say a route "should work" or "is promising" without naming the exact bridge and its status.

## Verdict Categories

| Verdict | Meaning |
|---|---|
| CONFIRMED | A rigorous published result directly establishes the claim. |
| MARGINAL | Partial results exist in a restricted setting or under extra assumptions. |
| PLAUSIBLE | No direct result found; consistent with known results; no obstruction identified. |
| NEEDS REFINEMENT | The direction may have merit but the formulation is imprecise or has a gap. |
| DEAD | A known result, counterexample or structural obstruction kills it. |
| UNVERIFIED | Insufficient sources to assess. |

For each verdict, state what is rigorously known, what is heuristic, the main obstacle, and whether the obstacle is local to the formulation or structural.

## Output Format

1. **Executive Summary.** One paragraph: overall verdict on the checkability claim, and the main finding.
2. **Q1 to Q5,** each in its own section with verdicts.
3. **The D9 entries** as one JSON array in the schema above, with a `sources` field and a `verdict` field added to each entry.
4. **The invariant vocabulary** as one JSON array, with `class` and `source` fields, followed by the relations as a JSON array.
5. **Dedicated Audit Results** for Q4: a table of invariant, class, compositional (yes, no, under condition), and the result that settles it.
6. **Feasibility Table** for Q5: step, best supporting result, main gap, verdict.
7. **Critical Obstructions.**
8. **Bottom-Line Assessment:** one verdict, and the strongest defensible reformulation if the checkability claim fails as stated (for example, "checkable for trace properties of class X; hyperproperties need a whole-chain check").
9. **Bibliography** with full identifiers.

Do not try to be encouraging. Try to be correct. If per-join checking fails for an invariant, say which invariant, why, and what replaces it.

---

## Scaffold Update Notes

*(Strip before sending.)*

- The report is a lead, not evidence. Verify every cited source before anything lands; land receipts in `excerpts/` for each claim used.
- D9 entries land as additions (`D9-X01` onward) in `mapfill/additions.js`, each claim receipted; GENERATED fields land as authored fills, graded accordingly.
- Effect invariants land in `mapfill/invariants.js` with carriers; the `class` field (state, step, trace, hyperproperty) is new and needs a schema decision: propose, and the operator rules.
- If Q4 finds non-compositional invariants, `compose.mjs` must refuse a per-join verdict for them and report "whole-chain check required" rather than a pass.
- Feed the entries to MM-DR-002 (Android bindings). Run MM-DR-003 (prior art) only after both return.
