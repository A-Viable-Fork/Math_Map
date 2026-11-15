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
  { round: 1, after: 5, drawn: "2026-11-13",
    reader: "the first grader, from audit/landed-blind/packet-1.md (landed text and excerpt files, first verdicts unread)",
    grades: {
      "D2-113.name": { verdict: "confirmed" },
      "D2-009.output": { verdict: "confirmed" },
      "D2-132.input": { verdict: "imprecise", note: "The window states B a Borel subgroup of G; the class of G is not in it, and the page lead says certain algebraic groups." },
      "D2-089.broken": { verdict: "unsupported", note: "No window states what a free resolution breaks." },
      "D2-109.description": { verdict: "confirmed" },
      "D2-094.output": { verdict: "confirmed" },
      "D2-094.input": { verdict: "confirmed" },
      "D2-143.description": { verdict: "imprecise", note: "The index is stated; the knot polynomial is reached through the subfactor theory, which no window ties to this operation." },
      "D2-128.preserved": { verdict: "imprecise", note: "The vector space is kept as stated; the H-invariant subspaces are not in a window." },
      "D2-054.broken": { verdict: "unsupported", note: "No window states what the QZ reduction breaks." },
      "D2-087.output": { verdict: "confirmed" },
      "D2-114.broken": { verdict: "unsupported", note: "No window states the non-homogeneous information lost." },
      "D2-119.description": { verdict: "imprecise", note: "The window says the singularities get better, not that smoothness is preserved." },
      "D2-069.output": { verdict: "confirmed" },
      "D2-107.preserved": { verdict: "imprecise", note: "The adjunction is stated; the dualizing complex is not in the window graded." },
    },
    firstAtDraw: {
      "D2-113.name": "confirmed", "D2-009.output": "confirmed", "D2-132.input": "confirmed", "D2-089.broken": "unsupported",
      "D2-109.description": "confirmed", "D2-094.output": "confirmed", "D2-094.input": "confirmed", "D2-143.description": "imprecise",
      "D2-128.preserved": "imprecise", "D2-054.broken": "unsupported", "D2-087.output": "confirmed", "D2-114.broken": "unsupported",
      "D2-119.description": "imprecise", "D2-069.output": "confirmed", "D2-107.preserved": "confirmed",
    },
    slipped: "Context confirmation: both disagreements were first grades of confirmed on a field one of whose parts no quoted window stated (the class of G for D2-132, the dualizing complex for D2-107), the part supplied from the page around the window or from a note. Every confirmed field of batches 1 to 5 was read again against its windows alone. Where the page holds a window stating the missing part, the window was added and the grade kept (19 fields, D2-107.preserved among them); where it holds none, or states a narrower or different claim, the field went to imprecise with a receipted correction (16 fields, D2-132.input among them) or, for D2-130.input, whose normality hypothesis sits outside every declaration window, to unsupported.",
    regraded: [1, 2, 3, 4, 5] },
];

module.exports = { ROUNDS };
