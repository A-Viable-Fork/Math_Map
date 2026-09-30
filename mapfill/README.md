# The fill layer

`source/math_map.md` is landed verbatim and never edited. Its upward corrections live here, as an overlay that `scripts/mathmap.mjs` applies when it parses the map. Every query, composite and report sees the overlaid map; `--landed` shows the original, and every entry carries its origin (map, fill, clone:<home id>) so nothing authored passes as landed.

## What the map had

Three kinds of pointer stand in for content in the landed map:

1. **Clone entries.** The description says "See Domain N home entry", "See home domain entry" (home named in the ISO field), "See Domain 2 home (D2-097)" or "Same as D2-056".
2. **Pointer fields.** A type or invariant field says "See D6", "See Domain 6 home entry" or "Same" instead of stating content (about 1,200 fields in 351 entries). "Same as LU + explicit scaling" states content and is kept as data.
3. **Name-only stubs.** 416 entries in D7 with a name and nothing else.

Counted honestly (a pointer is not a type), 1,118 of the 1,954 landed entries can anchor a composite.

## What the layer does

**Clone resolution** (computed). A pointer resolves by explicit id, else by name in the named domain, else by name in the ISO home domain, else to the one solid entry of that name anywhere (marked "by name"). Chains are followed. A pointer whose home does not exist is dangling.

**Authored fills.** `d7-*.js` fill every D7 stub. `homes.js` writes each missing home once (79 homes: SVD, PCA, the Z-transform, Johnson-Lindenstrauss, Delaunay and the rest) and attaches it to every entry that points at it. Each fill names its entry by id and by the map's exact name, so a fill cannot land on the wrong entry, and the check refuses a fill over an entry that has content of its own.

## Grades

A fill is **authored**: written from standard mathematics, from memory, and not reviewed against sources. The map's own status fields (Unformalized, Unvalidated, Unreviewed) still apply. A fill with a `reading` names an ambiguous or nonstandard entry and says how it was read. A fill whose fields are "Unknown" records an entry that could not be identified (D7-271, D8-199); it stays unusable as an anchor rather than carrying invented content.

## Source

The D7 mapper report (`source/Category_Theory_Transformation_Enumeration.pdf`) gives names only in its enumeration ("formatted strictly as names"), and types for about 25 transformation classes in its prose tables (functors, adjunctions, universal constructions, completions, the Grothendieck construction, free algebras, quotients, subdirect decomposition, Knuth-Bendix, resolutions, derived functors, spectral sequences, the mapping cone, integral transforms). The fills agree with those tables; everything else is authored here.

## Additions

`additions.js` holds entries the map lacks, written because a composite needs them (ids in a series the map never uses: `D<n>-X<nn>`). Unlike fills, each addition is receipted: every claim that carries weight has a verbatim window in `excerpts/`, and `scripts/mathmap.mjs` checks that each quote occurs in its file. Additions carry origin `added` and are counted in the domain totals; the audit's sample never draws them.

## Corrections

`corrections.js` replaces landed fields that a check found wrong or imprecise: an audit grade, a flag, or a Mathlib link graded conflicts. Every corrected field is supported by a receipt in `excerpts/` (Wikipedia windows are taken from a pinned revision with `scripts/excerpt.mjs`), claims that cannot be receipted are dropped and the reason says so, and the landed text stays on the entry. Correcting all five content fields of a flagged entry resolves its flag. Hypotheses an entry leaves out go in `conditions.js` instead.

