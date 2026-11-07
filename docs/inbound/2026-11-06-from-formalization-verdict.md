# Verdict on the 2026-11-06 note from Formalization, sections 1 and 2

The operator chose integrity as the first direction [ruling: operator, 2026-11-06]. This records what was folded in from `2026-11-06-from-formalization.md` and what waits.

## Section 1, the relation layer: folded in

Read: 513 landed entries carry an ISO / DEP / CS field other than "- / - / Unlinked"; 485 a departure, 62 a cluster reference to 29 clusters, matching the note's counts. Each now carries `relation` in `map.json` and `get_entry` (cluster, cluster note, departure, clone status; landed, unchecked), and `map.json` lists the clusters under `clusters`, with the Domain 1 index's type and status. The index is the only cluster index the landed map has. Typed relations between entries (the note's section 3) are not built: the landed relation types are prose.

## Section 2, the thirteen D8 rows: folded in, with one more

Each row was read against the landed text. Twelve are misaligned as the note says. D8-121, which the note calls plausible, is flagged with that reading stated in its evidence: its content is a projection, leverage-score sampling is a sampling, and leverage-score sampling's content sits on D8-122. A sweep of this repository found one more: D8-068 "Fractional cascading" carries fractal compression, D8-067's name. Fourteen flags, 21 in all.

The lead check is `scripts/misalign.mjs`, written here from the note's description; Formalization's `misalign.mjs` was not read. It lists every landed entry whose own content shares no significant word with its name: 242 leads across seven domains (D7 is all fills, D9 all generated or added). All 242 were read: 19 are flagged, 6 held with a note, 217 aligned (`mapfill/alignment.js`). The shift damage is confined to D8 as far as this check reaches; a misaligned row whose content shares a word with its own name is outside it.

## Waiting

Sections 3 and 4 (the schema proposals, the Laplace formal links and the two D6-086 findings) wait for the operator's next direction.
