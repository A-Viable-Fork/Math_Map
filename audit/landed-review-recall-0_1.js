// Role: the landed review's recalled expectations. For each landed entry under review, what the reviewer expected
//   each field to be, written from memory after reading the entry and before any source was fetched for its batch,
//   and committed alone ("recall, batch N") before the batch's grades.
// Contract: exports RECALL = [{ id, batch, name, description, input, output, preserved, broken }], one per entry of
//   audit/landed-review-0_1.js, plus the batch in progress. Each field is the reviewer's recalled verdict on the
//   landed text with the reason (ok: as stated; off: wrong or missing a hypothesis; thin: too vague to grade):
//   a lead, never evidence. The review records, per entry, the fields whose recall a source contradicted (contra);
//   reports/LANDED-REVIEW.md gives that rate per batch.
// Invariant: data only, and never revised after its batch's sources are read; a recall shown wrong stays as written.
"use strict";

const k = (id, batch, name, description, input, output, preserved, broken) => ({ id, batch, name, description, input, output, preserved, broken });

const RECALL = [
];

module.exports = { RECALL };
