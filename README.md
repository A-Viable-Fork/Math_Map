# Math map

A typed map of mathematical transformations across eight domains. Each entry gives an operation's input, output, preserved invariants and broken invariants, with functional tags from a controlled vocabulary.

Exported from commit `bf5344d2fd306520ee520a6bb98c6ff5be553a61` of a private working repository. 1960 entries, 1952 with full types and invariants.

## Origins

Every entry states where its content comes from:

- **map**: as written in the landed map (`source/math_map.md`, verbatim).
- **fill**: authored from standard mathematics for entries the landed map left as names or broken pointers. Not reviewed against sources.
- **clone:<id>**: the landed entry pointed at another entry; the pointer is resolved.
- **added**: an entry the landed map lacked. Every weight-bearing claim is receipted by a verbatim quote in `excerpts/`.

## Audit

`audit.json` holds field-by-field grades (confirmed, imprecise, wrong, unsupported) against cited sources: a fixed random sample of 60 entries, and targeted receipts for entries that were needed. Six landed entries are flagged as misaligned and carry their evidence.

## Files

- `map.json`: every entry, machine-readable.
- `domains/D1.md` to `domains/D8.md`: the same, readable.
- `audit.json`: grades with their quotes and sources.
- `excerpts/`: the verbatim windows that receipt the additions, each with its source URL and the hash of the page or PDF as fetched. Quoted for reference; the sources keep their own licences.
- `source/math_map.md`: the map as landed.
- `MANIFEST.json` and `SHA256SUMS`: the source commit and file hashes, so an answer that cites this map can cite the exact version.
