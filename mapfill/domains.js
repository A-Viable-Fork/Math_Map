// Role: added domains. The landed map declares eight domains in its own text, which is never edited; a domain the
//   map lacks is declared here, with the tags its entries use where the map's controlled vocabulary has none.
// Contract: exports DOMAINS = [{ id, name, basis }] and TAGS = [{ tag, domain, definition }]. A domain id
//   continues the landed series (D9 onward). scripts/mathmap.mjs adds these to the declared domains, accepts
//   the tags for entries of their domain, and checks both.
// Invariant: data only.
"use strict";

const DOMAINS = [
  { id: "D9", name: "SYSTEMS AND EFFECTS",
    basis: "Operations on state with effects (send, store, read a sensor, isolate, grant and revoke authority, declassify, sign) and the invariants that say what they keep and break. Requested by the operator 2026-10-11; generated and graded in generation/2026-10-11-mm-dr-001 to -003." },
];

const T = (tag, definition) => ({ tag, domain: "D9", definition });
const TAGS = [
  T("egress", "Moves data or an effect out across a boundary."),
  T("ingress", "Brings data in from outside the modeled state (a sensor, a guest)."),
  T("storage", "Creates, reads or changes stored state."),
  T("isolation", "Creates or bounds a compartment."),
  T("authority", "Grants, checks, narrows, delegates or revokes the right to cause an effect."),
  T("information-flow", "Computes on labeled data, or changes a confidentiality or integrity label."),
  T("concurrency", "Starts or joins a separate computation."),
  T("dispatch", "Routes a request to a handler or component that interprets it."),
  T("cryptography", "Encrypts, decrypts, signs or verifies under a key."),
  T("audit", "Records an effect so it can be checked later."),
  T("erasure", "Removes data from modeled storage."),
  T("freshness", "Issues or checks a value meant to be used once."),
  T("transaction", "Commits a change only if its preconditions still hold at the moment of commit."),
];

module.exports = { DOMAINS, TAGS };
