// Role: the fill review's recalled expectations. For each fill under review, what the reviewer expected each
//   field to say, written from memory after reading the fill and its landed name and before any source was
//   fetched for that batch.
// Contract: exports RECALL = [{ id, batch, name, description, input, output, preserved, broken }], one per
//   entry of audit/fill-review-0_1.js. Every field is a recalled claim: a lead, never evidence. The review
//   records, per entry, the fields whose recall a source contradicted (contra), and reports/FILL-REVIEW.md
//   gives that rate per batch: a reading of how far fills written the same way can be trusted.
// Invariant: data only, and never revised after its batch's sources are read; a recall shown wrong stays as
//   written.
"use strict";

const k = (id, batch, name, description, input, output, preserved, broken) => ({ id, batch, name, description, input, output, preserved, broken });

const RECALL = [
];

module.exports = { RECALL };
