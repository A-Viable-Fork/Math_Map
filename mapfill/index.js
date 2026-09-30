// Role: the fill layer's index. Collects every authored fill for the math map.
// Contract: exports FILLS, an array of fill records (mapfill/fill.js), in part order.
// Invariant: data only; scripts/mathmap.mjs applies and checks the fills.
"use strict";

const FILLS = [...require("./d7-a.js"), ...require("./d7-b.js"), ...require("./d7-c.js"), ...require("./d7-d.js"), ...require("./d7-e.js"), ...require("./homes.js")];

module.exports = { FILLS };
