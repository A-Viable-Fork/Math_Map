// Role: facets. A domain was both an entry's birthplace (the D2 in D2-118, fixed forever because receipts,
//   Lean claims and corrections cite the id) and its classification. Facets take over classification: an
//   entry belongs to its birthplace domain and to any other domain listed here, so an operation that lives
//   in several areas (encryption is algebra and systems) appears in each without being duplicated.
// Contract: exports FACETS = [{ entry, facet, basis }]. facet is a declared domain id other than the
//   entry's own; basis says why the entry belongs there. scripts/mathmap.mjs sets each entry's facets to
//   its domain plus these, checks them, and answers --facet queries. Ruled 2026-10-11 (operator).
// Invariant: data only. Empty until an entry needs a second facet.
"use strict";

const FACETS = [];

module.exports = { FACETS };
