# Pre-registration: POLY-001, the operations inside the polynomial ring

Date 2026-10-23. Written and committed before the generation record and before any Mathlib source is read for this round. Its commit hash is the record that the questions, the grading rules and the predictions came first. Nothing below changes after the commit; a deviation is written in the grading as a deviation, with its reason.

## Why the round

Research_OS ingests Mathlib.Algebra at this map's pin and decomposes each declaration into the map's operations (Research_OS `functions/mathlib-ingest`, findings `mathlib-ingest-2026-10-14.md` and `mathlib-links-2026-10-14.md`). At this map's commit `9cd551e`, 2,511 declarations map cleanly onto D7-150, Polynomial Ring Extension, because `Polynomial` is anchored there and nothing else in the polynomial API is: `Polynomial.degree_mono` reads as "the polynomial ring construction" because the map has no degree. D7-150's count is an upper bound until the map holds the operations inside the ring. The map has no entries for them, so they enter through a round.

## The questions, fixed by the data

The questions are chosen by a count, never by the generator. Over the 2,511 declarations clean to D7-150 (decomposition of the Algebra declarations, sha256 `ce3d7df6...`, against this map at `9cd551e`), count, for each `Polynomial.*` definition, the declarations whose statement names it. Every definition named by at least 50 is a question, except:

- **instances** (a definition whose type ends in a class applied to `Polynomial R`: `semiring`, `module`, `algebraOfAlgebra`, `commSemiring`, `commRing`, `smulZeroClass`, and the `inst*` names), which are structure on the ring, the operation D7-150 already is;
- **the ring's generators** `C`, `X` and `monomial`, which build elements of R[X] from R and are D7-150's own construction. This exclusion is a judgment, disclosed here before generation.

That leaves 17 definitions (count of clean D7-150 declarations naming each): `natDegree` 397, `degree` 283, `coeff` 257, `map` 181, `Monic` 181, `leadingCoeff` 165, `derivative` 144, `eval` 139, `Splits` 104, `roots` 103, `comp` 100, `aeval` 98, `support` 89, `eval₂` 87, `IsRoot` 63, `rootMultiplicity` 54, `eraseLead` 52. Grouped into operations before generation (the grouping is a judgment, disclosed):

| Q | Operation asked for | Definitions it must cover |
|---|---|---|
| Q1 | degree | `degree`, `natDegree` |
| Q2 | coefficient extraction | `coeff`, `support` |
| Q3 | leading coefficient and the monic condition | `leadingCoeff`, `Monic`, `eraseLead` |
| Q4 | change of coefficient ring | `map` |
| Q5 | evaluation | `eval`, `eval₂`, `aeval` |
| Q6 | formal derivative | `derivative` |
| Q7 | roots and multiplicity | `roots`, `IsRoot`, `rootMultiplicity` |
| Q8 | composition (substitution of a polynomial) | `comp` |
| Q9 | splitting into linear factors | `Splits` |

## The generator and the grader

The generator is the model running this session, writing from what it knows, before reading the Mathlib source of these definitions. It writes one entry per question in the map's shape (name, kind, tags from the controlled vocabulary, description, input, output, preserved, broken, complexity) in `record.md`, committed before grading. The record is expression and is never edited after its commit.

The grader is the same session, reading Mathlib at `380f2aa`. Grader and generator are the same model, a weakness disclosed here: the grading's check is Mathlib's text, not the grader's judgment, and every grade cites the declaration it rests on.

## Grading rules

1. **Duplicates first.** Before an entry is graded, the map is searched (names, descriptions, inputs, outputs) for an entry that already is the operation. If one is, the question's verdict is **dead as an addition**, and the round proposes a formal link on that entry instead.
2. **Each field** is graded against the Mathlib declarations: **confirmed** (a verbatim window of the source states the claim), **marginal** (the source states it under a hypothesis the field omits, or states less; the field is corrected in the grading and the correction says so), **dead** (the source contradicts it, or nothing at the pin states it; the claim is dropped from the landed text).
3. **An entry lands** as an addition (`mapfill/additions.js`, origin `added`) only if (a) its defining declaration exists at the pin and is linked exact on the entry, so it anchors, and (b) every claim in its landed fields carries a receipt in `excerpts/` (the Mathlib excerpt files `scripts/formal.mjs --excerpt` writes). The landed text is the graded text; the generator's text stays in `record.md`.
4. **Entry verdict**: confirmed (every field confirmed), needs refinement (a field marginal or dead, the corrected text landing), dead (duplicate, or no defining declaration).

## Predictions, before anything is run

From the decomposer's rule (a statement naming anchors of several entries is a composite):

- P1. D7-150's clean count falls from 2,511 to under 1,000, because most of those statements name `Polynomial` and at least one of the new anchors.
- P2. Composites rise by more than 1,000 from 1,102.
- P3. The total clean count falls (the new entries gain fewer clean declarations than D7-150 loses), since few polynomial lemmas name an inner operation without naming the ring.
- P4. At least 7 of the 9 questions land as additions; Q9 is the likeliest duplicate (D7-154, splitting field) and Q4 the likeliest to need refinement.

P1 to P3 test the decomposition, not the entries: if they fail, the clean reading of D7-150 was less inflated than the 2026-10-14 finding inferred.

## Measurement

After landing: rebuild the map, rerun Research_OS's `mapread.mjs`, `decompose` and `gaps` on the same declarations, and report clean, composite, D7-150's count, the new entries' counts and the proof queue against the baseline at `9cd551e` (clean 8,704, composites 1,102, D7-150 2,511, 41 targets).
