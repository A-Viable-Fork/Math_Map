// Role: known-bad landed entries. A flag marks an entry whose content is wrong, so it cannot anchor a
//   composite until it is corrected. Found by the audit (reports/AUDIT-0_1.md) and the misalignment
//   check that followed it.
// Contract: exports FLAGS = [{ id, name, kind, evidence }]. kind: misaligned (the content describes a
//   different entry). name must equal the map's name for id. scripts/mathmap.mjs applies the flags:
//   a flagged entry is not anchorable and reports its flag.
// Invariant: data only. A flag withholds an entry; it never rewrites it. Correcting one is a fill.
"use strict";

const M = (id, name, evidence) => ({ id, name, kind: "misaligned", evidence });

const FLAGS = [
  M("D8-089", "Hermite transform", "The content describes lattice basis reduction (LLL), the subject of D8-115."),
  M("D8-125", "Log transform", "The content describes PCA (\"PCA on data matrix\"). Audit: wrong on every field."),
  M("D8-132", "Marching triangles transformation", "The content describes a point cloud to Vietoris-Rips or Cech to barcode pipeline (Mapper-like), not marching triangles."),
  M("D8-133", "Matrix square root decomposition", "The content describes marching triangles, the subject of D8-132. Audit: wrong on every field."),
  M("D8-185", "Robust PCA transformation", "The content is the square root transform, the subject of D8-201."),
  M("D8-186", "Rotation transformation", "The content is the square transform, the subject of D8-202."),
  M("D8-215", "Topological sort transformation", "The content describes a Vietoris-Rips filtration of a point cloud (\"See D4-416\"), not a topological sort; the operation is D8-X02. Found by the NixOS decomposition, 2026-10-11."),
  // Found by A-Viable-Fork/Formalization's intake stress test (docs/inbound/2026-11-06-from-formalization.md) and read
  // here against the landed text, 2026-11-06; D8-068 by this repository's sweep (scripts/misalign.mjs) the same day.
  M("D8-030", "Confluent persistence transformation", "The content describes dynamization, the subject of D8-048: a static structure made dynamic with O(log n) updates by periodic rebuilding."),
  M("D8-051", "Exponential transform", "The content describes the Euclidean distance transform, the subject of D8-050 (\"Euclidean distance transform variant with exact L2 metric\")."),
  M("D8-052", "Extended Euclidean transformation", "The content describes the exponential transform, D8-051's name: E{f}(s) = sum f(n) s^n / n!."),
  M("D8-068", "Fractional cascading transformation", "The content describes fractal compression by an iterated function system, D8-067's name (Fractal transform)."),
  M("D8-074", "Gaussian mechanism transformation", "The content describes the Laplace mechanism, the subject of D8-111: Laplace noise scaled to L1 sensitivity for epsilon-differential privacy."),
  M("D8-078", "Geometric hashing transformation", "The content describes the generalized Schur (QZ) decomposition, D8-077's name (\"Generalizes Schur for matrix pairs (A,B). See D2-054\")."),
  M("D8-079", "Graph minor transformation", "The content describes geometric hashing, D8-078's name: points to a hash table via geometric invariants."),
  M("D8-082", "Haar transform", "The content describes Groebner bases, D8-081's name (\"Grobner basis: see D2-156\")."),
  M("D8-109", "Kernelization transformation", "The content describes the Karhunen-Loeve transform, D8-108's name (\"Karhunen-Loeve / PCA ... See D5-077\")."),
  M("D8-121", "Leverage-score sampling transformation", "The content describes a leveraged random projection, read as the LESS sketch, D8-120's name; leverage-score sampling is a sampling, and its content sits on D8-122. A reading by the run, plausible rather than certain."),
  M("D8-122", "Line graph transformation", "The content describes leverage-score sampling, D8-121's name: rows sampled by leverage scores."),
  M("D8-207", "Succinctness transformation", "The content describes post-processing of differential privacy (\"Applies any data-independent map to differentially private output\"), not succinctness."),
  M("D8-208", "Sumudu transform", "The content describes topological sort, D8-215's name: a linear ordering of a DAG."),
  M("D8-220", "Turing (Cook) reduction", "The content describes the Tucker decomposition, D8-219's name: a core tensor times factor matrices along each mode."),
];

module.exports = { FLAGS };
