// Role: conditions and counterexamples. The hypotheses under which an entry's claims hold, and cases
//   that show where they stop, stated as their own fields so they can be checked like the invariants.
// Contract: exports CONDITIONS = [{ id, name, conditions, counterexamples?, receipts: [{ file, quote }] }].
//   id and name must match an entry (landed, filled or added); every receipt's quote occurs in its file under
//   excerpts/ or source/. counterexamples is a list of { case, receipt? } and may be empty. Checked by
//   scripts/mathmap.mjs.
// Invariant: data only. A condition narrows an entry's claims; it never edits the entry's other fields.
"use strict";

const CONDITIONS = [
  { id: "D2-118", name: "Blowing Down",
    conditions: "The curve contracted is a (-1)-curve (a smooth rational curve of self-intersection -1) on a smooth projective surface: then it contracts to a smooth point and the contraction is inverse to the blow-up (Castelnuovo). Other curves contract, when they do, to singular points.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/wikipedia-castelnuovo.txt", quote: "a (&minus;1)-[[algebraic curve|curve]] on <math>X</math>" },
      { file: "excerpts/wikipedia-castelnuovo.txt", quote: "(which means a smooth [[algebraic curve#rational curves|rational curve]] of [[intersection theory#self-intersection|self-intersection]] number&nbsp;&minus;1)" },
    ] },
  { id: "D7-068", name: "Reflective Subcategory Localization",
    conditions: "A localization in the sense needed for subtoposes and levels requires the reflector to preserve finite limits (an exact reflection; between toposes, a geometric embedding). A bare reflective subcategory need not.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/nlab-reflective-subcategory.txt", quote: "in addition preserves [[finite limits]], then the embedding is called _exact_. If the categories are [[topos]]es then such embeddings are called [[geometric embedding]]s." },
    ] },
  { id: "D4-176", name: "Hodge decomposition",
    conditions: "As stated, on a closed (compact, boundaryless) Riemannian manifold. The vector-field case used in fluid mechanics (the Helmholtz or Leray decomposition) holds for square-integrable fields on a bounded, simply-connected Lipschitz domain.",
    counterexamples: [],
    receipts: [
      { file: "excerpts/wikipedia-hodge-theory.txt", quote: "on a closed Riemannian manifold as a sum of three parts in the form" },
      { file: "excerpts/wikipedia-helmholtz-decomposition.txt", quote: "is a bounded, simply-connected, [[Lipschitz domain]]. Every [[square-integrable]] vector field" },
    ] },
];

module.exports = { CONDITIONS };
