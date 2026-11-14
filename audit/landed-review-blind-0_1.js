// Role: the landed review's blind re-grades. After every fifth batch, 15 fields drawn at random from the earlier
//   batches are graded again from the landed text and the excerpt files alone, without reading the first verdict,
//   and the two are compared.
// Contract: exports ROUNDS = [{ round, after, drawn, reader, grades: { "<id>.<field>": { verdict, note? } },
//   firstAtDraw?: { "<id>.<field>": verdict }, slipped?, regraded?: [batch] }]. firstAtDraw keeps the first verdicts
//   as they stood when the round was graded, so a later re-grade leaves the round's own agreement on record.
//   The items are drawn by `node scripts/audit.mjs --landed-draw <round>` (seed 20261113 + round, mulberry32 as the
//   audit's sample, over every field of batches 1 to after - 1, in review order), which also writes the packet
//   audit/landed-blind/packet-<round>.md: each item's landed text and excerpt files, never the first grade. The
//   check recomputes the draw and requires a grade for exactly its items; reports/LANDED-REVIEW.md gives the
//   agreement and every disagreement with both verdicts. Under 90% agreement the review stops until the affected
//   batches are re-graded; the round records what slipped (slipped) and the batches re-graded (regraded).
// Invariant: data only. A blind grade never edits the review (a re-grade of the affected batches is the review's
//   own act, recorded in regraded); where the two disagree, both are shown. The reader is
//   the first grader: blind here means the first verdict was not read again, not that it was forgotten.
"use strict";

const ROUNDS = [
];

module.exports = { ROUNDS };
