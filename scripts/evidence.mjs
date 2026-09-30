// Role: evidence per claim. Says, for each field of an entry and each named-invariant claim, how well it is
//   supported, so a chain can report the weakest claim it rests on.
// Contract: exports LEVELS, rank(level), weaker(a, b), and evidence(P) returning { field(e, f), claim(e, f,
//   invariant), grades }. Levels, weakest first: contradicted (a check found it wrong: an audit grade of wrong
//   or a Mathlib conflict, not since corrected), unsupported (checked; no source supports it), unchecked
//   (landed or authored, never checked), imprecise (right idea, a detail wrong), sourced (a verbatim quote
//   supports it: an audit grade of confirmed, an addition's or a correction's receipts, a receipted link),
//   formal (Mathlib states it: an exact link covering the whole field or naming the invariant, or a general
//   link whose premise field is itself formal). A relation between invariants passes evidence along at the
//   weaker of the claim's level and the relation's (receipts: sourced; a definitional basis: formal).
// Invariant: read-only. A level summarizes recorded evidence; it is never raised by argument alone.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
export const LEVELS = ["contradicted", "unsupported", "unchecked", "imprecise", "sourced", "formal"];
const RANK = { contradicted: 0, unsupported: 1, unchecked: 1, imprecise: 2, sourced: 3, formal: 4 };
export const rank = (l) => RANK[l];
export const weaker = (a, b) => (rank(a) <= rank(b) ? a : b);
const stronger = (a, b) => (rank(a) >= rank(b) ? a : b);
const FROM_GRADE = { wrong: "contradicted", unsupported: "unsupported", imprecise: "imprecise", confirmed: "sourced" };

export function evidence(P) {
  const grades = Object.fromEntries([...require("../audit/grades-0_1.js").GRADES, ...require("../audit/targeted-0_1.js").TARGETED].map((g) => [g.id, g]));
  const links = P.formal.links, V = P.vocabulary;
  const field = (e, f) => {
    const basis = [];
    const conflict = links.some((k) => k.entry === e.id && k.field === f && k.match === "conflicts");
    // A resolved misalignment flag realigns the content to the name, so the name's misalignment grade is superseded.
    const corrected = (e.corrected || []).includes(f) || (f === "name" && !!e.flagResolved);
    let level = "unchecked";
    if (e.origin === "added") { level = "sourced"; basis.push("addition receipts"); }
    const g = grades[e.id]?.fields?.[f];
    if (corrected) { level = "sourced"; basis.push("correction receipts"); }
    else if (g) { level = e.origin === "added" ? stronger(level, FROM_GRADE[g.verdict]) : FROM_GRADE[g.verdict]; basis.push(`audit: ${g.verdict}`); if (g.verdict === "wrong") level = "contradicted"; }
    if (conflict && !corrected) { level = "contradicted"; basis.push("Mathlib conflict"); }
    if (level !== "contradicted") for (const k of links.filter((k) => k.entry === e.id && k.field === f && k.whole && k.match === "exact")) { level = "formal"; basis.push(`Mathlib ${k.decl}`); }
    return { level, basis };
  };
  const claim = (e, f, inv) => {
    const basis = [];
    const ls = V.LINKS.filter((l) => l.entry === e.id && l.field === f && l.invariant === inv);
    let level = ls.some((l) => l.receipts) ? "sourced" : null;
    if (level) basis.push("receipted link");
    if (ls.some((l) => !l.receipts)) { const fe = field(e, f); level = level ? stronger(level, fe.level) : fe.level; basis.push(`field ${f}: ${fe.level}`); }
    if (!level) level = "unchecked";
    for (const k of links.filter((k) => k.entry === e.id && k.field === f && k.invariant === inv)) {
      if (k.match === "conflicts") { level = "contradicted"; basis.push(`Mathlib conflict ${k.decl}`); break; }
      if (k.match === "exact") { level = "formal"; basis.push(`Mathlib ${k.decl}`); }
      if (k.match === "general" && k.premise) { const pe = field(e, k.premise).level, l = weaker("formal", pe); if (rank(l) > rank(level)) { level = l; } basis.push(`Mathlib ${k.decl} given ${k.premise} (${pe})`); }
    }
    return { level, basis };
  };
  const relation = (r) => (r.receipts?.length ? "sourced" : "formal");
  return { field, claim, relation, grades };
}
