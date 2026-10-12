# Shared conventions (Repo-Infrastructure kit)

The conventions every A-Viable-Fork repository shares, vendored with the kit and imported by each repository's `CLAUDE.md`. The repository's own file follows with what is local to it; where the two disagree, the local file wins for that repository and should say so. A rule a kit check enforces is marked with the check's name; the rest are practice, which nothing enforces but the reader. Change this file in Repo-Infrastructure, never in `.infra/` (the `kit` check fails on a local edit), and it reaches each repository when it re-vendors.

## Working

- Run the gate before every commit: `node .infra/run.mjs` (or the repository's `scripts/check-all.mjs`, which forwards to it), with `--online` when the network is there. Commit only on PASS. [check: kit, and every check `infra.json` enables]
- One concern per commit: a subject saying what changed, a body saying why. End with the attribution lines the session supplies. No model identifiers in commits, documents or code. Push only to the branch the session names; open a pull request only when asked.
- Notes from other repositories or sessions arrive dated in `docs/inbound/` and are proposals: verify, then fold in or decline, and say which.
- Research reports and other model output are leads, not evidence: verify each source before anything lands on it.

## Writing

- No em or en dashes in authored text: commas, semicolons, colons, periods, or " - ". [check: dashes]
- Say what a thing is, not what it is not. Terse prose; a list or table only for content that is list-shaped.
- When something is dead, say so plainly; when it almost works, say where the gap is and what would close it.

## Claims (Repo-Infrastructure `CLAIMS.md`)

- Every claim is one of four kinds, and its kind says who may settle it: **truth** by evidence, **rightness** by the person, **expression** by its author, **utility** by a check.
- Truth claims carry an evidence mark: **read** (seen in the source, at a commit where it matters), **secondary** (a source says so, unchecked), **inferred**, **recalled** (from memory: a lead, never the basis of a ruling), **unknown**.
- Where another kind crosses a boundary, mark it: `[ruling: who, date]`, `[expression: author]`, `[check: path]`. Split a ruling from the fact it rests on.
- Never correct an expression or a ruling against evidence: annotate, or ask. A passing check shows code obeys a rule, not that the rule is right.
- Generation is marked as generation, and prior art is searched after generating, not before. New generation goes in a generation record: `.infra/templates/generation.md`.
- Verdicts are graded, not pass or fail: confirmed, marginal, plausible, needs refinement, dead.

## What never lands

- Keys, tokens, phone numbers, device identifiers, account names, private addresses, or anything from a person's own device or life that they did not put in the repository themselves. Examples are invented and say so. A value that must be guarded goes in the denylist as a keyed digest: `node .infra/tools/leak-add.mjs`. [check: leak]

## Sources

- A source is landed verbatim, hashed, with its provenance: `node .infra/tools/land.mjs`. One whose rights are unstated is read and cited, held only as a hash-only row. [check: provenance]
- A claim about what code does cites the commit it was read at. A quote is a receipt at an offset in a hashed file. [check: receipts, where enabled]
- A claim already made is fixed through a correction with its receipt, never by a silent edit. [check: corrections, where enabled]

## Design that has held up across the repositories

- **The repository describes itself.** Every code file opens with a `Role:` header (and `Contract:` and `Invariant:` where they say something); every other file and directory has a line in `repo-map-manifest.json`; `REPO-MAP.md` is generated from both. [check: headers, repomap]
- **Generated files are never edited by hand.** Regenerate them with the command that made them. [check: freshness]
- **The checker is not the checked.** A check whose authority matters runs from outside the tree it judges (the kit pin is verified from Repo-Infrastructure; Lean audits are written where Lean runs). An in-tree check is a tripwire, not an authority.
- **Readings, never standing.** A number (a score, a weight, a probability) may be shown beside a grade; it never enters the grade.
- **A check states what it rests on.** A check that assumes another declares it, and is an error without it.
- **An exception carries its reason.** Every allowed address, verbatim path or disabled check in `infra.json` says why; an exception without a reason is a hole.
- **The person rules; an agent proposes.** A decision held by a person is never recorded as closed by an agent: propose, record, recommend.
- **Interfaces use shared tokens.** Colors, sizes and fonts are tokens (the Ledger set in Repo-Infrastructure `UI.md`), text meets contrast in light and dark, motion honors reduced-motion, and focus stays visible. [check: tokens, where enabled]
- **A mechanism enters the kit when two repositories need it.** Until then it stays local, and Repo-Infrastructure's catalogue lists it.

## Where the longer versions live

In Repo-Infrastructure: `FUNCTIONS.md` (every function and discipline, with where each was first built), `CONTRACT.md` (what the kit promises a repository), `CLAIMS.md` (claim kinds and the generation loop), `UI.md` (interface tokens), `CHANGELOG.md` (what each kit release changed).
