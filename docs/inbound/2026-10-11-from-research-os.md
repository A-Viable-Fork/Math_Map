# From Research_OS, 2026-10-11: two operations D9 lacks

A proposal, not a change: verify, then fold in or decline, and say which. Found by blueprinting the research OS's record and link in D9 operations and running `scripts/compose.mjs` on them (Research_OS `blueprints/record-and-link.md`; Math_Map at `cbc2a69`).

## 1. Append a signed entry, atomically

**Why.** In a journal-native system an action's only effect is its journal entry. D9 has no operation whose effect is its own log record: generating a nonce (D9-X23) and signing (D9-X19) each break e9-audit, and the append (D9-X21) cannot restore it, by its own contract ("cannot make a separate prior unlogged effect retrospectively atomic"). So a ruling modeled as nonce, then sign, then append reports e9-audit broken however it is built.

**Proposed contract.** Input: the journal, the entry's content, a fresh nonce, a key handle. Output: the journal with one new entry binding the content, the nonce and the signature, committed in one step. Preserves e9-prov, e9-orig, e9-local, e9-noegress, e9-auth, e9-fresh, e9-mediated. Produces e9-sig (over the entry) and e9-audit (the entry is the record of its own effect). Breaks nothing beyond the relational class the other D9 entries break conservatively.

## 2. Union of append-only journals

**Why.** Docking two machines' journals is not D9-X25: that merges one record under its owner's approval and rewrites its bytes, so the checker reports e9-sig broken at the merge. A union of append-only journals keeps every entry's bytes and signature as they were.

**Proposed contract.** Input: two journals, each a set of signed entries. Output: their union. Preserves e9-sig of every entry (the bytes are framed, never rewritten), e9-prov, e9-audit of each side. Produces two invariants the vocabulary lacks:

- **append-only** (class trace): each input journal is a subset of the output, so no entry is lost or rewritten;
- **convergence** (class relational): two replicas that have exchanged all entries hold equal journals, whatever the order of exchange.

**Proof obligation.** Convergence holds because union is commutative, associative and idempotent; a short Lean proof, proposed for Math_Map's `lean/` or for Formalization.

## Correction to a commit message

Math_Map commit `cbc2a69` says 43 kinds were adopted; the count in `mapfill/invariants.js` is 40.
