# Schema survey: every kind of data the map could keep, ranked

Date: 2026-11-15. The operator's commission of 2026-11-13: map every kind of data the math map could keep, judged against mathematics, code and language now and the atlas of The_Smell_of_Knowledge next. This is a design survey. It changes nothing in `mapfill/` or the schema; the operator rules on what lands.

| Phase | File | What it holds |
|---|---|---|
| 1 | `01-reading.md` | what each consumer reads, keeps outside the map, and asked for |
| 2 | `02-generation.md` | 67 candidate kinds, generated before any prior-art search |
| 3 | `03-prior-art.md`, `excerpts/` | how other systems keep each kind, 80 quotations in 51 receipted files |
| 4 | `04-pilots.md`, `pilots/` | six pilots on real entries, 234 rows, each with a script |
| 5 | this file | verdicts, an order to land them, and the first as a concrete proposal |

## How to read the verdicts

Generation and verification are kept apart. The **basis** column says which a verdict rests on:

- **piloted**: a script in `pilots/` ran rows of this kind on real entries, and the result is in `04-pilots.md`.
- **surfaced**: no pilot set out to test it; a pilot ran into the need.
- **consumer**: a consumer holds rows of this kind outside the map, read in phase 1.
- **prior art**: a system read in phase 3 keeps it.
- **generation only**: nothing but the argument in `02-generation.md`.

A verdict of **confirmed worth keeping** needs a pilot or a measurement made here. **Plausible** means the case stands and was not run. **Needs refinement** means it almost works, and the row says where the gap is. **Marginal** means it works and earns little. **Dead** means dead, with what would reactivate it.

## What the survey found, in six sentences

The unit the map is missing is smaller than an entry and larger than a field: a claim with its hypothesis. The hypothesis becomes useful when it is a predicate a chain can check, which no consumer asked for in that form and which pi-Base and Fungrim show closes inside one field (read). Three candidates generated on separate axes are one record, a commuting square, and it is the content of both an intertwining and an isomorphism cluster (piloted on 46 squares). A computation that can be rerun is a receipt the map's evidence ladder has no place for, and 62 pilot rows rest on one. The atlas is reachable from where the map stands: one triangle of charts cost 38 rows, and its cocycle check found a missing dictionary row as data and a missing convention on instances. An inverse opens no new route at the grain of kinds, and an intertwining's two sides are mostly operations the map has no entry for; both of those functions are dead as generated.

## Ranked verdicts

### Confirmed worth keeping

| Rank | Candidate | Basis | Reason |
|---|---|---|---|
| 1 | G02 hypotheses as predicates | piloted (1), prior art | Seven of twelve chains fail on a hypothesis; `compose.mjs` accepts every join in two of them, and one of those hypotheses already sits in `conditions.js` as prose no script reads. The hunt's findings are eight in eleven missing hypotheses. Limit: 24 of 36 predicates were used by one entry, so it lands one area at a time |
| 2 | G25 implications among predicates and invariants | piloted (1), prior art | Nine implications carried the chains; pi-Base's whole deduction is this. Lands in the same file as G02 |
| 3 | G39 counterexamples tied to a hypothesis | piloted (1, 2) | Six quoted, five more made by computation from rules stated without their hypothesis. The map's `counterexamples` field has the slot and lacks the tie |
| 4 | G31 binder alignment | piloted (4) | Rows cost a parse of files the map already hashes. Three omitted hypotheses found, each under a field graded formal. No prior art found. Precision 22%; a lead finder, like `misalign.mjs` |
| 5 | G11 contract hash | measured (`pilots/p0-contract-hash.mjs`), consumer | Reproduces in under a second the hand check Research_OS made: D9-X07, X20, X28, X29 unchanged since `e1bcb83`; of 2066 entries, 1994 unchanged, 0 moved, 72 new. Computed, so it adds nothing unchecked |
| 6 | G60 commuting squares | piloted (2, 6), prior art | One record served 30 squares inside a chart and 16 across charts. Nine landed clusters walked; two shown to be abstractions by a failing converse with a computed witness; one edge between clusters found |
| 7 | G09 intertwinings | piloted (2) | Kept as squares. Nine rules the entries lack hold on instances; one is filed by its entry under `broken` |
| 8 | G24 commutes-with | piloted (2) | Kept as squares whose top and bottom are the same entry (S22) |
| 9 | G04 worked instances | piloted (2, 3, 5, 6) | Every computed receipt is an instance. The checks are written once per kind of square and reused |
| 10 | G37 executable laws | piloted (2, 3, 6), prior art | 62 rows run. A failure is a counterexample and is final; a pass is a reading on instances. Whether "computed" is an evidence level is a ruling |
| 11 | G16 inverse with a domain | piloted (3), prior art | 26 rows in `PartialEquiv`'s shape. Fifteen of sixteen invertible entries list something as broken, which a round trip restores and `compose.mjs` reports broken. Needs one more field: the carrier it inverts on (suspend and resume invert state, not trace) |
| 12 | G59 transition maps | piloted (5), prior art | 38 dictionary rows among graphs, matroids and matrices. Five formal claims carried across with capped evidence, Euler's formula among them. Departures derived for twelve entries, more specific than the landed notes. Cost is the highest of any confirmed kind: eight fetched pages for one triangle |
| 13 | G58 charts as declared objects | piloted (5) | Needed for G59 to have ends; empty alone |
| 14 | G61 the cocycle check | piloted (5), prior art | As data it found a missing dictionary row; on instances it found that D1-120's transition fails on 26 of 40 graphs without a convention. MMT requires the condition and SKOS warns of it; neither records the defect, which is the useful part |

### Plausible

| Rank | Candidate | Basis | Reason, and what would confirm it |
|---|---|---|---|
| 15 | G12 conventions | surfaced (5) | A transition without one is wrong. Lands first as a field on transition and square rows; a per-family vocabulary waits for a second case |
| 16 | G45 stated silence | surfaced (1) | Two rows were needed to say "this output does not establish that". Cheap; lands inside G02 as a role |
| 17 | G10 named operands | surfaced (1), consumer | D6-117 requires different things of two measures; Research_OS's freeze chain has the same shape. Confirm by rerunning `D9-X44, D9-X42` with operands named |
| 18 | G01 claim atoms | surfaced (1, 4), prior art | Three readings say the unit of evidence is below the field. Not run: the kill, two readers cutting one field differently, is untested. G02 can land without it by naming a claim as field plus phrase |
| 19 | G08 determinacy | surfaced (3) | Enters as the carrier and equality of an inverse or a square. Mathlib's `EqOnSource` is the same need |
| 20 | G53 named routes | consumer | Pilot 1's twelve chains are a routes file in all but name; Formalization has nineteen. Confirm by running the nineteen in the gate once G02 has rows for them |
| 21 | G49 stored chain proofs | consumer | One row exists; `compose.mjs` already takes them per call |
| 22 | G48 one realization record | consumer | Three repositories hold rows. The shape is Research_OS's P1 and waits on its ruling |
| 23 | G50 postcondition and read-back | consumer | Six rows exist in `Typed.java` |
| 24 | G67 chart-relative evidence | piloted in part (5) | Pilot 5 capped a carried claim's evidence at the weakest dictionary row used. Making that a rule of `evidence.mjs` is a ruling |
| 25 | G65 abstract pattern entries | surfaced (6), prior art | Two clusters name a partner the map has no entry for (Schur complement, elimination fill-in). Realms are the precedent |
| 26 | G19 special case and generalization | surfaced (6) | The walk found one by computation (wye-delta inside Kron reduction). The match grades are the same relation |
| 27 | G17 adjoint pairs | prior art | One rule would derive two preservation claims per pair, on a formal basis the map already links. Not run |
| 28 | G23 composite-of | generation only | Few rows, each a consistency test of an entry against its own chain |
| 29 | G05 status of the mathematics | prior art | Record only where it departs from proved. D8-X09's conditions already carry such a status in prose |
| 30 | G06 nature | consumer | Formalization measured a quarter of a sample as other than operations. Needs a second reader's agreement measured |
| 31 | G35 external identifiers | prior art | Mathlib carries Stacks tags on declarations. Receipts could then be fetched by id |
| 32 | G34 lexicon with senses | consumer | The ingest's false friends are sense errors. Confirm by measuring typing misses before and after on one domain |
| 33 | G43 false friends | prior art | Rows fall out of readings already done |
| 34 | G42 dead routes | generation only | This survey produced four (the dead rows below). The readers are generation rounds |
| 35 | G40 obstructions | prior art | The nLab's sense, a class whose vanishing decides the question, is the typed form; the informal list is not. Scope is the hard part |
| 36 | G21 implements | prior art | Clean rows, about a hundred in D8, and no reader on day one |
| 37 | G33 round-trip records | piloted in part (3, 5) | The round trips were run; as stored records they are computed receipts under another name |

### Needs refinement

| Rank | Candidate | Where the gap is, and what would close it |
|---|---|---|
| 38 | G63 degradation grade | A judged grade repeats the match grades' problem (kappa 0.48). Pilot 6 got the same information with no judgment: squares that hold one way, and a converse that fails with a witness. Close it by deriving the grade from the walk |
| 39 | G20 sameAs | A wrong merge is expensive, and Wikidata and SKOS both hedge the relation. One certain case was walked (Q15). Close it with a graded pass in which a merge needs agreeing instances as well as agreeing text |
| 40 | G30 one loss vocabulary | Untested. Pilot 5 never used the six grades: it used a domain, a convention, and "no image". The paper that classifies alignments could not be fetched. Close it by grading the pilot's 38 rows blind, twice |
| 41 | G51 observation ledger | The rule is ruled; the fields and the crossing of two ladders are a ruling still to make |
| 42 | G52 problem classes | Free text unless each class is typed. A typed class is a named `--require` policy with given predicates, which is G53 plus G02 |
| 43 | G18 dual | Three sources call it hazy. What survived the pilots is an involution (a G16 row on itself) plus the squares saying what it swaps (S29, S30). Close it by dropping the relation word |
| 44 | G29 statement triples | Needs G01 first, and the code-facing leg exists only in D9 |
| 45 | G07 shape flags | Arity and operands are G10; uniqueness is G08; what is left (stochastic, needs choice) has no reader |

### Marginal

| Rank | Candidate | Reason |
|---|---|---|
| 46 | G64 walk status | It is the evidence of a square under another name |
| 47 | G46 misstatement patterns | The naive rows of pilot 2 carry it; as tags on 22 corrections and 11 hunt findings the statistics are thin |
| 48 | G32 controlled sentences | Sound, and three kinds must land before it has structure to render |
| 49 | G57 departure records from use | Arrives as the `departures` of G48 |
| 50 | G55 demand signal | Free once G48 and G53 exist, nothing before |
| 51 | G26 forgetful maps as entries | The "no image" rows of a transition say what is forgotten, in place |
| 52 | G28 depends-on | Mostly derivable; no consumer asked |
| 53 | G44 intended breaks | Belongs to the consumer's chain; the map needs at most a slot in a verdict |
| 54 | G22 discretizes and limit-of | A few dozen clear rows and no reader |
| 55 | G36 neutral signatures | Authored per entry, for no consumer |
| 56 | G13 universal property | A template for G01 |
| 57 | G14 complexity on the algorithm | Right in kind; waits on G21 |
| 58 | G03 quantities | 241 homes carry them and nothing composes them |
| 59 | G54 consumer registry | Stale the day after it is written, unless consumers publish it |
| 60 | G38 aliases | Feed for G20 |

### Dead

Recorded in the essay's Compost Pile shape: what was tried, how it failed, what survived, what would reactivate it.

| Rank | Candidate | Mechanism of failure | Residue | Reactivation |
|---|---|---|---|---|
| 61 | G27 operations as entries, for both sides of an intertwining | piloted: 5 of 60 sides are entries; the rest are operations inside a structure, which the map does not hold | sides are names from a small operation vocabulary, bound to an entry where one exists | coverage rounds in the POLY-001 form reach the common operations |
| 62 | G41 non-invertibility derived from `broken` | piloted: fifteen of sixteen invertible entries list something as broken, so the derivation gives the wrong answer on real entries | blocker rows with a witness, as a value of `side` in G16 (two computed) | `broken` is split into information lost and property changed |
| 63 | G62 holonomy as a kind of its own | its own kill: three receipted rows, under the five required | `side: period` in G16, with the map the round trip returns | a region where periods recur |
| 64 | G15 symbol table | no reader, a row per entry, and entries are mostly prose | OpenMath dictionaries exist to link to (G35) | entries gain formulas as data |
| 65 | G47 limits of an approximation | needs G03, which has no reader | none | G03 gains a reader |
| 66 | G56 technique tags on proofs | needs proofs read, for no consumer here | Formalization's crux record holds it where proofs live | the atlas's technique chart is built |
| 67 | G66 regions and authorship | one repository, one author | git | a second author contributes rows |

One function died without killing its candidate: a route found only through an inverse. The typed map's 995 edges over 53 kinds already reach 2213 ordered pairs, and reversed edges add none; reactivation is a route search over predicates. One function was never run: finding a route by its intertwining ("what turns convolution into a product"), which G09's generation named as its day-one use.

## Recommended order

Generation from here on: a recommendation, for the operator to rule on.

| Step | Lands | Why here |
|---|---|---|
| 1 | G02 with G25, G39, G45: `mapfill/predicates.js` | The largest measured defect, a day-one reader, and rows already receipted. Proposal below |
| 2 | G31 as a report beside `FORMAL-QUEUE.md` | Free, and it is the lead finder that feeds step 1 |
| 3 | G11 in `build.mjs` | Computed; every later kind that cites an entry pins against it |
| 4 | G60 with G09, G24: one squares file, receipts quoted or computed (G04, G37) | Needs a ruling on computed evidence first |
| 5 | G16, with carrier and `side: period` | Small; makes round trips report restoration |
| 6 | G59 with G58, G61, G12, one region at a time, starting with the graph, matroid and matrix triangle | The atlas proper; most expensive per row, so last among the confirmed |
| 7 | Then by need: G10, G53, G49, G48, G01 | Each waits on a consumer or a ruling named in its row |

Rulings the order needs: whether an unmet hypothesis changes a policy verdict (step 1); whether a rerunnable computation is an evidence level, and where it ranks (step 4); whether evidence is capped on crossing a transition (step 6).

## The first, as a concrete proposal

**What lands.** One file, `mapfill/predicates.js`, with four exports. Nothing in `conditions.js` changes: it keeps the prose, and rows here may cite the same receipts.

```js
// Role: predicates. Named hypotheses over carriers; which entries require, establish, keep or destroy them;
//   implications among them; counterexamples tied to the hypothesis they defeat.
PREDICATES = [{ id, carrier, definition }]
IMPLIES    = [{ from, to, receipts?: [{ file, quote }], basis?: "definitional: ..." }]
HYPOTHESES = [{ entry, name,                      // id and exact name, as conditions.js
                role,                             // "requires" | "establishes" | "keeps" | "destroys" | "silent"
                predicate,
                claim?:  { field, phrase },       // the one claim this bears on; phrase occurs in the field
                given?:  [predicate],             // an establishes or keeps that holds only under these
                receipts?: [{ file, quote }],     // verbatim windows in excerpts/
                formal?: decl,                    // a declaration linked to this entry, whose binder states it
                own?:    { field, phrase },       // the entry's own words
                note? }]
COUNTEREXAMPLES = [{ entry, name, drops: predicate, claim?, witness,
                     receipts?: [{ file, quote }], formal?: decl }]
```

**Checker change.**

- `scripts/mathmap.mjs --check`: every `entry` exists with that `name`; every predicate is declared, on a declared carrier; every row carries exactly one of `receipts`, `formal`, `own`; each quote occurs in its file; `formal` names a link the entry has; `phrase` occurs in the named field; no entry both establishes and destroys one predicate; `IMPLIES` is acyclic.
- `scripts/compose.mjs`: a third report beside joins and invariants, with the rules of `pilots/p1-predicates.mjs`: met, not established, or violated (destroyed at step k), per step; `--given P,Q` for what the chain's input supplies; a counterexample printed with the requirement it answers. Silence leaves a predicate unknown. The chain's weakest link includes the rows it used. The report prints and changes no existing verdict until the operator rules on it.
- `scripts/build.mjs`: `hypotheses` and `counterexamples` on each entry, `predicates` beside `invariants` in `map.json`, a line per row in `domains/*.md`, counts in `STATUS.md`.
- `scripts/mcp.mjs`: `get_entry` shows the rows; `compose_chain` returns the report and takes `given`; `list_invariants` lists predicates.

**Evidence rule.** A row is **sourced** when its quote verifies. It is **formal** when `formal` names a declaration linked exact to that entry and the predicate is a binder of it, the binder excerpted at the pin by `formal.mjs --excerpt` as statements are now. A row with `own` carries the evidence of the field it quotes and no more: it gives the entry's words structure and adds no support. A row with none of the three is refused, as `conditions.js` refuses a condition without receipts. An implication is sourced by a quote and formal by a definitional basis, the rule `evidence.mjs` already applies to relations between invariants. A computed counterexample waits on the ruling of step 4.

**First rows.** From pilot 1, the rows whose receipts verify: 53 hypothesis rows on 27 entries, 4 implications, 5 counterexamples, 36 predicates. From pilot 4, the three omissions (D2-193 finite, D2-188 complete, D7-290 colimits), each with a formal receipt. Nine of the ten entries of `conditions.js` are covered; D8-X09 is the one left. Next, by area, the entries `compose.mjs` already types: the topos entries, then commutative algebra, then measure.

**Consumers.**

- `scripts/compose.mjs`, on day one: `D7-068, D7-X03` and `D2-117, D2-118` stop reading as clean.
- Formalization: its Laplace probe found that all 8 claims "needed a hypothesis or a precision the entry lacks" and proposed conditions per claim; `claim` with `formal` is that slot, and its theorems' binders are the rows.
- Research_OS's `mapread.mjs`: a declaration whose binders the entry's predicates do not cover stops counting as a clean mapping.
- The MCP server: a model asking for an entry gets its hypotheses as data, which Formalization's report names as what the map can give a model that the model cannot give itself.

**What would show it was wrong to land.** After the three named areas, if more than half the predicates are still used by one entry, the vocabulary is not closing and the rows are prose with extra steps: stop and keep `conditions.js`. If a second reader, blind, assigns different predicates to the same quoted windows for more than a quarter of rows, the row shape is too loose: tighten `claim` before adding rows.
