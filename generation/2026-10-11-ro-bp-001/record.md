---
Kind: expression
Author: an agent session, on the operator's commission
Commission: blueprint the research OS's record and link in D9 operations before writing them (A-Viable-Fork/Research_OS `blueprints/record-and-link.md`)
Date: 2026-10-11
---

# Generation: two operations for journal-native systems (RO-BP-001)

## Reaching for

Running `scripts/compose.mjs` on the research OS's record and link showed two places where no D9 entry fits: a ruling whose only effect is its own journal entry, and docking, which merges two journals without rewriting either. These two entries are written to fill them, in the D9 shape, so the flows can be checked again.

## Candidates

1. **D9-X28, append a self-recording signed entry.** A specialization of D9-X21 by one parameter: the appended record is the effect itself, so the log is complete for that effect by construction. D9-X21 already signs and appends atomically; its contract withholds e9-audit because it may record an effect committed elsewhere ("cannot make a separate prior unlogged effect retrospectively atomic"). When nothing is committed outside the entry, that caveat has nothing to apply to.
2. **D9-X29, union of append-only journals.** The merge two replicas perform when they exchange entries: the union of two sets of signed entries, every entry's bytes kept. It differs from D9-X25, which merges one record under its owner's approval and rewrites its bytes.
3. **Two invariants:** e9-appendonly (trace) and e9-converge (relational), on a new carrier, journal, which is an execution trace.

Prior art, searched after generating: the union merge is the grow-only set of the conflict-free replicated data types (Shapiro, Preguiça, Baquero and Zawirski, 2011, **recalled**), whose convergence rests on union being commutative, associative and idempotent.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| 1, 2, 3 | grading | conjecture | done: see `grading.md` |
| Convergence | Lean (Research_OS `lean/`) | a theorem | a failed proof |
