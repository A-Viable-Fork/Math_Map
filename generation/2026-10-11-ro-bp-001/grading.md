# Grading: RO-BP-001

Date 2026-10-11. Evidence marks: **read**, **secondary**, **inferred**, **recalled**, **unknown**.

## Ruling

[ruling: operator, 2026-10-11] Adopt both operations ("Go for it", on the proposal in `docs/inbound/2026-10-11-from-research-os.md`).

## Checks

- **D9-X28 against D9-X21** (**read**, `mapfill/generated.js`): D9-X21's description is "Sign a record chained to the current log head and atomically append it"; its output text withholds atomicity only for "a separate prior unlogged effect". D9-X28 differs from it only in that parameter, so its contract is D9-X21's with e9-audit added as an output and e9-appendonly as preserved. The inbound note had proposed a new primitive; it is folded in as this specialization instead.
- **D9-X29**: preserves each entry's bytes, so every signature stays valid on the bytes it signed (**inferred** from the definition of union on sets of entries). Convergence is a theorem, proved in Lean in A-Viable-Fork/Research_OS `lean/ResearchOS/Journal.lean`.
- **Flows rerun** after landing: recorded in Research_OS `blueprints/record-and-link.md`.

## Verdict

Plausible for both entries as contracts; e9-converge is proved for the union model. Neither entry is receipted, so both stay at the generated tier.
