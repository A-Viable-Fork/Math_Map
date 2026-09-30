// Role: the fill record constructor, shared by every mapfill/ part file.
// Contract: F(id, name, description, input, output, preserved, broken, opts?) returns a fill. name must
//   equal the map's name for id, as parsed (escapes included), which guards against filling the wrong
//   entry. opts.reading marks a nonstandard or ambiguous name and says how it was read; a fill whose
//   fields are "Unknown" must carry one, and never anchors a composite.
//   G(pairs, description, input, output, preserved, broken, opts?) returns one fill per [id, name] pair, all
//   with the same content: the form for a missing home that several entries point at.
// Invariant: data only.
"use strict";

const F = (id, name, description, input, output, preserved, broken, opts = {}) => ({ id, name, description, input, output, preserved, broken, reading: opts.reading || null });

const G = (pairs, ...rest) => pairs.map(([id, name]) => F(id, name, ...rest));

module.exports = { F, G };
