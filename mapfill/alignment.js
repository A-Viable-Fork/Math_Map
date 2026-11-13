// Role: the reading ledger for misalignment leads (scripts/misalign.mjs). Records which leads have been read against
//   the landed text and found aligned, and which are held because reading could not settle them.
// Contract: exports SWEEPS = [{ date, by, scope, aligned: [ids] }] and HELD = [{ id, note }]. A lead in a sweep's
//   aligned list is settled; a held lead stays visible in reports/MISALIGN.md with its note; a misaligned lead goes to
//   mapfill/flags.js instead. A new lead (a changed entry or a changed finder) is open until a later sweep reads it.
// Invariant: data only. Aligned means the content describes the named operation as far as a reading of the landed
//   text shows; it is no audit grade and raises no evidence level.
"use strict";

const SWEEPS = [
  { date: "2026-11-06", by: "agent reading of the landed text, every lead in all nine domains", scope: "all leads at 0a3c92b",
    aligned: [
      "D1-012", "D1-013", "D1-014", "D1-030", "D1-036", "D1-052", "D1-071", "D1-076", "D1-077", "D1-079",
      "D1-099", "D1-100", "D2-040", "D2-042", "D2-045", "D2-047", "D2-048", "D2-051", "D2-052", "D2-054",
      "D2-056", "D2-062", "D2-063", "D2-065", "D2-067", "D2-068", "D2-069", "D2-071", "D2-072", "D2-077",
      "D2-080", "D2-092", "D2-094", "D2-095", "D2-096", "D2-099", "D2-101", "D2-103", "D2-107", "D2-110",
      "D2-117", "D2-119", "D2-120", "D2-121", "D2-122", "D2-124", "D2-127", "D2-129", "D2-130", "D2-131",
      "D2-133", "D2-134", "D2-136", "D2-137", "D2-138", "D2-144", "D2-146", "D2-147", "D2-156", "D2-157",
      "D2-162", "D2-163", "D2-166", "D2-170", "D2-179", "D2-183", "D2-186", "D2-193", "D2-196", "D3-003",
      "D3-004", "D3-005", "D3-009", "D3-010", "D3-011", "D3-014", "D3-022", "D3-023", "D3-029", "D3-032",
      "D3-048", "D3-049", "D3-074", "D3-082", "D3-088", "D3-092", "D3-117", "D3-121", "D3-122", "D3-123",
      "D3-125", "D3-127", "D4-013", "D4-021", "D4-028", "D4-043", "D4-064", "D4-102", "D4-114", "D4-118",
      "D4-119", "D4-120", "D4-122", "D4-123", "D4-124", "D4-125", "D4-127", "D4-132", "D4-135", "D4-136",
      "D4-151", "D4-163", "D4-176", "D4-177", "D4-186", "D4-188", "D4-205", "D4-212", "D4-243", "D4-255",
      "D4-264", "D4-266", "D4-298", "D4-299", "D4-313", "D4-323", "D4-324", "D4-331", "D4-337", "D4-356",
      "D4-360", "D4-381", "D4-390", "D4-405", "D4-434", "D5-005", "D5-013", "D5-014", "D5-015", "D5-016",
      "D5-021", "D5-024", "D5-028", "D5-029", "D5-035", "D5-037", "D5-038", "D5-045", "D5-054", "D5-055",
      "D5-063", "D5-065", "D5-070", "D5-076", "D5-077", "D5-082", "D5-086", "D5-087", "D5-091", "D5-093",
      "D5-096", "D5-103", "D5-104", "D5-105", "D5-108", "D5-111", "D5-117", "D5-130", "D5-132", "D5-134",
      "D5-142", "D6-008", "D6-011", "D6-012", "D6-013", "D6-018", "D6-033", "D6-040", "D6-052", "D6-053",
      "D6-054", "D6-055", "D6-057", "D6-061", "D6-062", "D6-063", "D6-064", "D6-071", "D6-080", "D6-081",
      "D6-082", "D6-083", "D6-084", "D6-086", "D6-090", "D6-091", "D6-093", "D6-100", "D6-101", "D6-102",
      "D6-107", "D6-109", "D6-110", "D6-111", "D6-116", "D6-117", "D6-126", "D6-127", "D6-133", "D6-140",
      "D6-151", "D6-153", "D8-015", "D8-021", "D8-032", "D8-056", "D8-097",
    ] },
];

const HELD = [
  { id: "D3-103", note: "\"Maps between determinacy and large cardinal principles\": too thin to tell whether a Martin-Monk transformation is meant." },
  { id: "D4-156", note: "\"Giffen-Kauffman construction for classical link invariants\": the name could not be matched to a known construction; neither aligned nor another row's content." },
  { id: "D5-004", note: "\"Maps computational problems via logical derivations in AIT. Formalizes Occam's razor\": reads as minimum description length, not as a reduction; the name is generic." },
  { id: "D5-032", note: "\"DSIHT\" is an unexpanded acronym; the content (unitaries for quantum circuits, fewer CNOTs) could not be checked against it." },
  { id: "D5-094", note: "\"Maps Gaussian process supremum to packing numbers\" reads as Sudakov minoration or Dudley's bound, not a mixed-volume inequality; no neighbour carries the name." },
  { id: "D6-104", note: "\"Variant integral transform\": too thin to judge." },
];

module.exports = { SWEEPS, HELD };
