// Role: the landed review. Field-by-field grades of the landed entries (origin map, tier landed) against sources
//   under the strict rule, in batches of 25, domain by domain (D2, D4, D1, D3, D5, D6, D8), each in id order.
// Contract: exports REVIEW = [{ id, batch, why, sources: { key: url }, files: { key: excerpt file }, fields: {
//   name, description, input, output, preserved, broken: { verdict, src?, quote?, note?, more?: [{ src, quote }],
//   against?: [{ src, quote }] } }, contra: [field], mathlib?: note, falsify?: { field, claim, attempt, outcome } }]:
//   the shape of audit/fill-review-0_1.js. contra names the fields whose recalled expectation
//   (audit/landed-review-recall-0_1.js, committed before the batch's sources were read) a source contradicted.
//   mathlib says what was searched at the pin when no link in mapfill/formal.js bears on the entry. Every tenth
//   entry carries falsify: its most specific claim, the attempt to break it, and the outcome (survived or
//   falsified). DOMAINS = { D<n>: { verdict, fields, note } }, the graded verdict on a finished domain as landed.
//   Every quote occurs in its file (scripts/mathmap.mjs --check); scripts/audit.mjs checks the grades and
//   renders reports/LANDED-REVIEW.md.
// Invariant: data only. A grade is a claim about a landed entry, never an edit to it. The strict rule [ruling:
//   operator, 2026-11-13]: confirmed only when a quoted window states the field's claim itself, not merely names
//   the object; a claim with several parts is confirmed only when every part is quoted (quote and more),
//   otherwise imprecise (the note names the part) or unsupported. wrong: a window contradicts it. A field
//   without a fetched source is unsupported, never confirmed.
"use strict";

const C = (src, quote, note, more) => ({ verdict: "confirmed", src, quote, ...(note ? { note } : {}), ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const I = (src, quote, note, more) => ({ verdict: "imprecise", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const X = (src, quote, note, more) => ({ verdict: "wrong", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const U = (note) => ({ verdict: "unsupported", note });
// A source that disagrees with the grade's source: recorded beside it, never picked over it.
const vs = (grade, against) => ({ ...grade, against: against.map(([s, q]) => ({ src: s, quote: q })) });
const WHY = (b) => `Landed review, batch ${b}: a landed entry graded field by field against sources under the strict rule.`;
const r = (id, batch, files, fields, contra = [], opts = {}) => ({ id, batch, why: WHY(batch), files, fields, contra, ...opts });
const F = (field, claim, attempt, outcome) => ({ field, claim, attempt, outcome });

const R = String.raw;
const ROWS = [
];

// The URL each excerpt file was windowed from (its header's URL line).
const URLS = {
};

const DOMAINS = {
};

const REVIEW = ROWS.map((g) => ({ ...g, files: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, `excerpts/${b}.txt`])),
  sources: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, URLS[b] ?? null])) }));

module.exports = { REVIEW, DOMAINS };
