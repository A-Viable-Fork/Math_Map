// Role: the fill review. Field-by-field grades of the authored fills (origin fill, tier authored) against
//   sources, in batches of 25: the D7 name-only stubs in id order, then the missing homes of mapfill/homes.js
//   (one grade per home, on its first entry, covering every entry that carries it).
// Contract: exports REVIEW = [{ id, batch, why, sources: { key: url }, files: { key: excerpt file }, fields: {
//   name, description, input, output, preserved, broken: { verdict, src?, quote?, note?, more?: [{ src, quote }] }
//   }, contra: [field], covers?: [id] }]: the targeted-grade shape of audit/targeted-0_1.js, with the excerpt file
//   each source was windowed into (scripts/excerpt.mjs), further receipts for a field in more, and in contra the
//   fields whose recalled expectation (audit/fill-review-recall-0_1.js, written before any source was read) the
//   source contradicted. Every quote occurs in its file (scripts/mathmap.mjs --check); the grades are checked by
//   scripts/audit.mjs, which renders reports/FILL-REVIEW.md.
// Invariant: data only. A grade is a claim about a fill, never an edit to it. confirmed: the source states the
//   field's claim; imprecise: right idea, a detail wrong; wrong: the source contradicts it; unsupported: no
//   source found that settles it. A field without a fetched source is unsupported, never confirmed.
"use strict";

const C = (src, quote, note, more) => ({ verdict: "confirmed", src, quote, ...(note ? { note } : {}), ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const I = (src, quote, note, more) => ({ verdict: "imprecise", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const X = (src, quote, note, more) => ({ verdict: "wrong", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const U = (note) => ({ verdict: "unsupported", note });
const WHY = (b) => `Fill review, batch ${b}: an authored fill graded field by field against sources.`;
const r = (id, batch, files, fields, contra = [], opts = {}) => ({ id, batch, why: WHY(batch), files, fields, contra, ...opts });

const R = String.raw;
const ROWS = [
];

// The source each excerpt file was windowed from, as its header records it (checked by scripts/audit.mjs).
const URLS = {
};

const REVIEW = ROWS.map((g) => ({ ...g, files: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, `excerpts/${b}.txt`])),
  sources: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, URLS[b] ?? null])) }));

module.exports = { REVIEW };
