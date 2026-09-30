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
];

module.exports = { FLAGS };
