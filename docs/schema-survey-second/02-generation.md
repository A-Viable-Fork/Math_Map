---
Kind: expression
Author: an agent session, on the operator's commission
Commission: the operator's request of 2026-11-13: map every kind of data the math map could keep, judged against math, code and language now and the atlas of The_Smell_of_Knowledge next; a ranked design survey with pilots, changing nothing in `mapfill/` or the schema
Date: 2026-11-13
---

# Generation: candidate data kinds for the map (SCHEMA-001)

Written before any prior-art search. During phase 1 nine outside addresses were probed for reachability by status code alone (Wikipedia, the nLab, the Mathlib docs, OEIS, the LMFDB, Wikidata, the MMT documentation, arXiv, Mathlib's raw source); no page body was read. Everything below is generation. The words "enables", "catches" and "would" are conjecture until a pilot or a source says otherwise.

## Reaching for

A map entry today is one shape: an operation with five short text fields, graded per field. Phase 1 says where that shape gives out. The strict reading finds the unit of evidence is smaller than a field. The hunt finds the usual defect is a hypothesis nobody wrote down. Three consumers each keep a private table of the same thing (a realization of an entry, with its departures). The landed relation layer is prose. And the atlas the map is heading for needs a kind of record the map has none of: a statement that two descriptions agree where they overlap.

So I am reaching for the set of record kinds such that every arrow among mathematics, code and language has (a) something to carry across, (b) a statement of what was lost in carrying it, and (c) a check that can fail. A data kind earns a place when a script that exists today could read it on the day it lands and report something it cannot report now. A kind whose rows nobody can check adds to the unchecked pile of 11236 fields and is worth less than nothing.

Constraints as I read them: the landed source stays verbatim; every row carries an origin, a tier and evidence; a row is receipted by a verbatim window, a formal declaration, a computation that can be rerun, or it starts unchecked and says so; nothing here changes the schema.

Arrows are written M (mathematics, the claim as a mathematician states it), F (the formal statement in Lean), C (code and platform primitives), L (language, the sentence a person or a model reads and writes), and A (the atlas: between charts).

## Seeds

Seeds, not evidence.

- The consumers' own asks, read in phase 1: Formalization's nine proposals, Research_OS's twelve, the Regulator's four literals per action, Unattested's three open items. Where a candidate is one of those it says so; the departures from them are in "Against the obvious".
- The strict reading's causes (part, names, detail) and the hunt's eleven findings.
- The essay's chart list (dependency, typeclass, technique, bridging, density, axiom-dependency), its Compost Pile schema of eight fields, its departure compost pile, and "clones of an abstract pattern with departure metadata".
- Differential geometry's atlas taken literally: charts, overlaps, transition maps, the cocycle condition on triple overlaps, and what a failed cocycle is (a twist, which is itself data). Applying the map's own operator here: a transition map is a change of coordinates, and it preserves exactly the claims that are stated in terms both charts have words for; it breaks every claim that uses a word only one chart has.
- `scripts/compose.mjs` as it stands: joins by kind, invariants by carrier, classes, context labels, the `OUTER(INNER)` form, per-call proofs.
- `reports/TOPOLOGY.md`: seventeen loops, none filled, ten disagreements on one invariant.
- Recalled shapes from elsewhere, deliberately unverified at this point: Hoare triples, refinement types, property-based testing laws, galois connections between abstract and concrete semantics, optics (a lens as a lawful round trip), the notion of a section and a retraction.

## Candidates

Each candidate gives: what it is; the arrows it serves; the function it enables; who reads it on day one; how a row gets receipted; its cost (rows needed before it pays, how checkable a row is, and what it adds to the unchecked pile).

### Axis 1: the entry itself

**G01 Claim atoms.** Each item of `preserved`, `broken`, `output` and each sentence of `description` becomes a claim with its own id (`D6-086#c3`), a kind (invariant kept, invariant lost, operator property, intertwining, theorem, created, by-construction, approximate), a direction (equal, implies, iff) and its own evidence level. Arrows: M to F, M to L. Enables: evidence at the grain the strict reading found; a formal link or receipt that covers one clause stops being graded as covering the field. Day one: `evidence.mjs` (level per atom, a field's level the weakest of its atoms), `formal.mjs`. Receipt: unchanged, one window per atom. Cost: splitting is mechanical for the 1693 homes (about 4800 items by Formalization's count), kinding them is a judgment per item; adds no new unchecked content, it re-cuts what exists. Pays from the first entry.

**G02 Hypotheses as predicates.** A vocabulary of named predicates over carriers (`compact`, `char-zero`, `sigma-finite`, `finite-domain`, `locally-finite`, `smooth-projective-surface`), with two uses: an atom `requires` predicates of its inputs, and an entry `establishes` or `destroys` predicates of its output. Arrows: M to F (a hypothesis is a binder), M to C (a precondition), L to M (the word "when"). Enables: a chain check that fails when step two requires what step one does not establish or what step one destroys; a query "which claims need characteristic zero". Day one: `compose.mjs`, as a third report beside joins and invariants. Receipt: a window stating the hypothesis, or a Mathlib declaration whose binders carry it (the binder list is the receipt). Cost: 30 to 60 predicates cover the hunt's findings and the ten conditioned entries; each row checkable against a source; a requires-row that is wrong makes a chain fail loudly, so errors surface in use.

**G03 Quantities.** Structured parameters and bounds on an atom: symbol, role (dimension, error, probability, rate), the bound as an expression, and what it depends on. Arrows: M to C (complexity and accuracy are what code is chosen by). Enables: composing error and probability budgets along a chain; selecting an entry by a numeric need. Day one: nobody; `compose.mjs` would need an arithmetic of bounds. Receipt: a window with the formula. Cost: 241 homes have quantitative content; expressions need a small grammar; checkability by window is good, by composition is poor until the arithmetic exists.

**G04 Worked instances.** One or more concrete input and output pairs per entry, small enough to recompute, each tied to the atoms it exhibits. Arrows: M to C (a test vector), M to L (an example), F (a non-degeneracy instance). Enables: a round-trip check across representations, since code, a Lean `example` and a sentence can all be tested against the same instance; detection of a vacuous formal statement. Day one: a new `instances.mjs` that recomputes the runnable ones; Formalization already writes these in Lean. Receipt: the computation itself, rerun in the gate, or a window. Cost: 15 minutes a row where a few lines of Node can compute it; about a third of entries have computable instances at all (conjecture); adds nothing unchecked when computed.

**G05 Status of the mathematics.** Apart from the map's evidence: proved, folklore, conjectured, conditional on a named claim, refuted, independent of a named theory. Arrows: M to L. Enables: a chain reports "holds if the Unique Games Conjecture holds"; conditional results stop reading as theorems. Day one: `compose.mjs` weakest-link report. Receipt: a window. Cost: nearly every row is "proved", so the information sits in the few dozen that are not; cheap if recorded only where it departs from proved.

**G06 Nature.** What the entry is: operation, theorem, class of maps, relation, existence statement, obstruction, conjecture, algorithm, composite. Arrows: L to M. Enables: the checker refuses to compose a theorem as if it were a step; retrieval filters. Day one: `compose.mjs` (refusal), MCP search. Receipt: none needed beyond the entry's own text; it is a reading. Cost: one judgment per entry, 2066 rows, checkable by a second reader with agreement measured.

**G07 Shape flags.** Arity, named parameters, partial, multi-valued, stochastic, output type depends on input, needs choice. Arrows: M to C (a signature), M to F. Enables: the join check knows a step needs a second operand from outside the chain by declaration instead of by inference; code generation of a signature. Day one: `compose.mjs` joins. Receipt: a window or a formal signature. Cost: moderate; overlaps G08 and G10.

**G08 Determinacy of the output.** Unique, unique up to isomorphism, unique up to unique isomorphism, a choice among many, a distribution. Arrows: M to C, A. Enables: a round trip can only be asked to return "the same" in the sense the entry promises; a transition map knows what equality to use. Day one: the round-trip checker of G33. Receipt: a window ("unique up to"). Cost: small vocabulary, one row per entry, high checkability.

**G09 Intertwining dictionary.** Per entry, rows `{ from, to, direction, requires }`: convolution to product, derivative to multiplication by s minus the initial value, product to sum. Arrows: M to F, M to L, A (a transition map between two operation vocabularies is exactly such a dictionary). Enables: route finding by rule ("what turns convolution into product"), and the rule a chain is built for becomes a checkable item. Day one: MCP search and `gaps.mjs`. Receipt: a window or a declaration. Cost: 244 homes carry such phrases; `from` and `to` need names for operations, which pushes toward entry ids on both sides, and that is G27 by another door.

**G10 Named operands.** An entry's inputs and outputs as named, typed roles (`principal`, `capability`, `journal`), so a chain can state that two steps act on the same thing. Research_OS's P11 in data form. Arrows: M to C. Enables: `D9-X44,D9-X42` stops reporting a partial join for a principal that is the same principal. Day one: `compose.mjs`. Receipt: the entry's own input text. Cost: 64 typed entries first; a checker rule as much as a data kind.

**G11 Contract hash.** A hash per entry over its contract fields, emitted by the build. Research_OS's P2. Arrows: every arrow, as the pin a realization or a relation was made against. Enables: staleness detection for anything that cites an entry. Day one: the build; any consumer's pin check. Receipt: none; it is computed. Cost: near zero; adds nothing unchecked.

**G12 Conventions.** For a family of entries, the convention each row fixes: sign of the exponent, normalization, left or right, variance, indexing from 0 or 1, operad or cooperad. A small vocabulary per family. Arrows: M to C (the commonest source of a wrong port), M to F, A (two charts often differ by convention alone). Enables: a join check that flags two steps with different conventions on the same carrier; a transition map that is "the same up to convention c". Day one: `compose.mjs`. Receipt: a window. Cost: only families that have conventions (transforms, dualities, graded objects); a few hundred rows; highly checkable.

**G13 Universal property as the defining claim.** For a universal construction, the property in structured form: the diagram shape, existence and uniqueness as separate atoms. Arrows: M to F. Enables: the second reading's "only the uniqueness half" becomes two atoms with two links. Day one: `formal.mjs`. Receipt: a declaration. Cost: about 60 constructions; a special case of G01 with a fixed template.

**G14 Complexity on the algorithm.** Complexity moved from the operation to an `implements` relation's algorithm, structured (time, space, model of computation). Arrows: M to C. Enables: choosing among implementations. Day one: nobody. Receipt: a window. Cost: 58% of today's values are empty; the kind is right and the readers are absent.

**G15 Symbol table.** The symbols an entry's text uses, each with its meaning and kind. Arrows: L to M. Enables: a formula in a field can be parsed and compared across entries; the same letter used two ways in one chain is caught. Day one: `type-lexicon.mjs`. Receipt: the text itself. Cost: large (every entry), low yield per row.

### Axis 2: between entries

**G16 Inverse, with a domain of validity.** `{ a, b, side: left, right or two-sided, on: predicates, residue: what is not recovered }`. Arrows: M to C, A. Enables: a route found by walking an inverse edge; a round trip `a then b` reported as identity only on the stated domain, with the residue named elsewhere. Day one: `compose.mjs` (a chain `a, b` under the relation yields "restored" for the invariants `a` broke, on the domain), `topology.mjs` (the first filled loops). Receipt: a window ("is inverse to", "recovers f at points of continuity") or a declaration. Cost: 28 entries are named "Inverse X" and 8 pairs are homes linked by name alone; perhaps 150 pairs in all; each row checkable.

**G17 Adjoint pair.** `{ left, right, unit, counit }` with the standing consequence that the right adjoint preserves limits and the left preserves colimits. Arrows: M to F. Enables: preservation claims derived for every pair from one rule with a formal basis already linked (the map links `rightAdjoint_preservesLimits`). Day one: `compose.mjs` closure. Receipt: a window or a Mathlib `Adjunction`. Cost: 40 to 80 pairs in D7 and D2; each row produces two derived claims at the level of the row.

**G18 Dual, with variance.** `{ a, b, reverses: what order or arrows flip, involutive: yes, up to iso, or no }`. Arrows: M to F, A. Enables: transporting a claim across a duality with the right reversal. Day one: nobody without G09. Receipt: a window. Cost: moderate; the risk is that "dual" covers six different things.

**G19 Special case and generalization.** `{ special, general, by: the predicate or parameter value that specializes }`. Arrows: M to F (Mathlib match grades `special` and `general` are this relation between a claim and a declaration), A. Enables: claims flow down from general to special under the predicate; hypotheses flow with them. Day one: `compose.mjs` closure, `evidence.mjs`. Receipt: a window. Cost: the landed Domain 1 index already has rows; a few hundred pairs.

**G20 sameAs.** One canonical id for an operation that appears under several entry ids. Research_OS's P7. Arrows: every arrow (identity is what everything else keys on). Enables: a formal link or a realization made on one id reaches the others; the ingest's one-side rule retires. Day one: Research_OS's `mapread.mjs`, `facets.js`. Receipt: a reading of both rows, recorded like an alignment sweep, plus G04 instances agreeing. Cost: 94 same-name groups, 82 with divergent text; each row is a judgment and a wrong merge is expensive, so it needs the same care as a flag.

**G21 Implements.** An algorithm entry implements an operation entry, with what the algorithm adds (complexity, numerical error, a restriction of the domain). Arrows: M to C. Enables: FFT stops being a second DFT. Day one: nobody directly. Receipt: a window. Cost: about 100 rows in D8; clean to check.

**G22 Discretizes and limit-of.** `{ discrete or family, continuous or limit, parameter, lost at the limit }`. Arrows: M to C (every numerical method is one), A. Enables: "what is this the discrete version of"; invariants that survive discretization are the interesting ones (GEN-001's variational integrators). Day one: `gaps.mjs`. Receipt: a window. Cost: a few dozen clear rows, then judgment.

**G23 Composite-of.** An entry stored as a chain of other entries. Arrows: M to M. Enables: `compose.mjs` checks the composite's own claims against what its chain yields, a consistency check between an entry and its decomposition. Day one: `compose.mjs`. Receipt: a window naming the steps. Cost: few rows (inverse scattering, PCA as centering then SVD), each a strong test.

**G24 Commutes-with.** Two operations commute, or commute up to a stated correction, under predicates: `{ a, b, on, defect }`. Arrows: M to M, A. Enables: two routes between the same kinds are declared equal, which is the first filler for a loop in `topology.mjs`; a disagreement between routes becomes either a contradiction with a commute row or a recorded defect. Day one: `topology.mjs`. Receipt: a window or a declaration (`map_comp`-style lemmas). Cost: open-ended; rows are needed only on loops the topology report already lists, which bounds it at the 16 parallel-route groups today.

**G25 More relations between invariants.** Today five. Add `implies`, `equivalent`, and two new kinds: `incompatible` (no object has both) and `refines` (one is a finer version of the other). Arrows: M to F. Enables: closure does more work per claim; an entry that claims to preserve two incompatible invariants is caught. Day one: `compose.mjs`. Receipt: a window or a declaration. Cost: scales with the invariant vocabulary, 59 terms now; each row is a small theorem.

**G26 Forgetful and inclusion maps between carriers as entries.** The subtype links between carriers made into operations with what they forget. Arrows: A, M to F (coercions). Enables: a "narrowing" join names the map that bridges it and what that map loses. Day one: `compose.mjs` joins. Receipt: a window. Cost: 74 carriers, perhaps 40 maps.

**G27 Operations as carriers.** Let an operation be an object another entry acts on (derivative, convolution, product as things a transform takes to other things). Needed by G09 to name its `from` and `to`. Arrows: M to F. Enables: an intertwining is an ordinary claim "transform T carries operation p to operation q", composable like any other. Day one: `compose.mjs`. Receipt: as G09. Cost: the kind `operation` exists in the carrier list and nothing touches it (read, TOPOLOGY); the cost is a design decision more than rows.

**G28 Depends-on.** An entry's definition uses another entry (the dependency chart of the essay). Arrows: M to F (imports). Enables: a correction or flag propagates a warning to dependents. Day one: the build. Receipt: Mathlib's import and declaration dependency for linked entries, text for the rest. Cost: derivable from 148 name-mention edges plus formal links; mostly computed.

### Axis 3: across representations

**G29 Statement triples.** For one claim atom, its three renderings held together: the sentence, the formal statement (a declaration name with its binders and conclusion), and a code-facing contract (pre, post). Arrows: all six among M, F, C, L. Enables: any two can be compared; the map becomes a parallel corpus of mathematics, formal text and contract. Day one: `formal.mjs` (already holds sentence and declaration pairs for 248 links). Receipt: each rendering has its own. Cost: the third leg exists only for D9; for mathematics it must be authored.

**G30 Loss record on every arrow.** Generalize the Mathlib match grade: any link between two renderings of a claim carries a grade (exact, general, special, related, ingredient, conflicts) and a residue field naming what the target lacks or adds. `bindings.json`'s `departures` is this for code; the essay's "departure metadata" is this for clones. Arrows: every arrow. Enables: one vocabulary of loss across formal links, code bindings, platform bindings and cluster edges, so a chain's weakest link can cross representations. Day one: `evidence.mjs`. Receipt: per grade, as today. Cost: the grade vocabulary exists and is measured (kappa 0.48, which is the weak point: a loss grade two readers disagree on a third of the time).

**G31 Binder-level alignment.** Align a formal declaration's hypotheses, one by one, with the entry's predicates (G02): which binders the entry states, which it omits. Arrows: M to F and back. Enables: a mechanical finder of missing hypotheses: every binder of an `exact` link that maps to no predicate of the entry is a lead. Day one: `formal.mjs`, over the 248 links. Receipt: the declaration text already excerpted at the pin. Cost: 248 links exist; reading binders is parsing; the mapping to predicates is the judgment. High yield per row because the formal side is already checked.

**G32 Controlled sentences.** A small grammar for claim sentences ("T carries X to Y when P"), with each atom's sentence generated from its structure, or parsed back into it. Arrows: M to L and L to M. Enables: the sentence and the structure cannot drift; a model's output in the grammar is machine-checkable against the map. Day one: the build (render), `mathmap.mjs --check` (parse). Receipt: none new. Cost: needs G01, G02, G09 first; the grammar is a design, not rows.

**G33 Round-trip records.** A stored check that a claim survives a loop of arrows: sentence to formal and back, entry to code to observed behaviour, chart to chart and back. Each record names the loop, the instance used (G04), the equality used (G08) and the outcome. Arrows: all, as loops. Enables: the commission's "how a round trip is checked" as data with a date and an outcome. Day one: the gate, for the loops that are computations. Receipt: the rerun. Cost: per loop kind, a harness; rows are cheap after that.

**G34 Lexicon with senses.** Each technical word of the entries with its senses, one kind or invariant per sense, synonyms, and false friends ("closure" topological and algebraic, "normal", "field", "regular", "kernel"). Arrows: L to M, L to F (name search in Mathlib). Enables: the free typing pass stops conflating senses; the ingest's false friends (Subsemigroup.closure for topological closure) are caught by sense. Day one: `type-lexicon.mjs`, `misalign.mjs`, Research_OS's lead finder. Receipt: the entries where each sense occurs. Cost: about 300 words cover most operands (the typing report lists 63 kinds and the top untyped first words); each row checkable against usage.

**G35 External identifiers.** Per entry: Wikidata QID, nLab page, Mathlib anchor declaration, MSC code, a Wikipedia title with revision. Arrows: L to M, A (another atlas's chart is reached through its ids). Enables: alignment with outside ontologies; receipts can be fetched by id. Day one: `excerpt.mjs`, `catalogue.mjs`. Receipt: the fetched page naming the operation. Cost: one lookup per entry, partly automatable by title, checkable by fetch.

**G36 Neutral signatures for mathematical entries.** A typed signature in a small interface language: operand names and kinds, parameters, result, effects none. Arrows: M to C. Enables: math entries get the same code-facing surface D9 has; a binding to a library function (`numpy.fft.fft`) becomes a realization row with something to check against. Day one: `export-guardians.mjs`-style exporters. Receipt: authored; checked by G37. Cost: subsumes G07 and G10; authored per entry.

**G37 Executable laws.** A claim atom rendered as a property test over a named library function: the intertwining `fft(conv(a, b)) = fft(a) * fft(b)` run on random inputs. Arrows: M to C and back. Enables: a claim checked by computation, an evidence source the map lacks between "sourced" and "formal"; a missing hypothesis shows up as a failing input, which is a counterexample for G39. Day one: a new harness in the gate; `evidence.mjs` would need a level for it. Receipt: the test and its seed, rerun. Cost: only computable entries on finite or floating data, perhaps 200; each row is twenty lines and a strong check. A new evidence level is a ruling.

**G38 Aliases and name history.** Other names for the operation, with source. Arrows: L to M. Enables: retrieval; sameAs leads. Day one: MCP search. Receipt: a window. Cost: cheap, low yield except as feed for G20.

### Axis 4: negative knowledge

**G39 Counterexamples tied to a hypothesis.** `{ claim atom, hypothesis dropped, witness, shows }`: the integers for Mobius inversion without finite down-sets; `e^{it}` for the converse of the final value theorem. Arrows: M to F (a Lean counterexample), M to C (a failing test input), M to L. Enables: the map can say why a hypothesis is there; a chain that violates a predicate gets the witness in its report. Day one: `compose.mjs` report, alongside G02. Receipt: a window, a Lean `example`, or a computed instance. Cost: one per hypothesis that matters; the hunt already produced several; each is checkable and several are computable.

**G40 Obstructions.** A record for an impossibility: no operation from kind X to kind Y preserves invariant I (no retraction of the disk to its boundary; no formula in radicals for the general quintic). Arrows: M to L, A. Enables: route search prunes; a generator stops proposing chains through a wall. Day one: `gaps.mjs`, which today reads a gap as possibly missing mathematics and could read some as proved absences. Receipt: a window stating the theorem. Cost: perhaps 50 famous ones; each row's scope (exactly what is ruled out) is the hard part and the place a wrong row does harm.

**G41 Inverse blockers.** For an entry with no inverse: what is lost, as named invariants or a kernel description, and what extra datum would restore invertibility. Arrows: M to C (what to store alongside to make it reversible). Enables: "broken" gets teeth: an entry breaking invariant I has no left inverse on objects distinguished by I, mechanically; the extra datum suggests the enriched operation that is invertible. Day one: `compose.mjs` (derive: if `a` breaks I and no later step outputs I, no chain restores it without outside input). Receipt: a window, or derived from the entry's own broken list. Cost: largely derived from existing `broken` rows once G16 exists.

**G42 Dead routes.** The Compost Pile schema applied to chains: a chain someone tried, the blocking constraint, mechanism, scope (point or class), residue, reactivation. Arrows: M to M, A. Enables: generation rounds query before proposing. Day one: the generation rounds' graders (`generation/*/grading.md` hold dead candidates in prose now). Receipt: the grading that killed it. Cost: rows exist as prose in twelve rounds; extraction is cheap; yield depends on generation continuing.

**G43 False friends.** Pairs that look alike and differ: an entry and a declaration, two entries, a word and a kind. Arrows: L to M, L to F. Enables: the same wrong link is not proposed twice; the ingest's lead finder filters. Day one: `formal.mjs` queue, Research_OS's ingest. Receipt: the reading that separated them. Cost: rows fall out of work already done (second reading, ingest leads, misalign sweeps).

**G44 Intended breaks.** A policy or design declares that a chain breaks an invariant on purpose, with the reason. Arrows: M to C. Enables: a verdict distinguishes a violation from a design choice. Day one: `compose.mjs --require`. Receipt: the design document, by commit. Cost: belongs to the consumer's chain more than to the map; the map needs only the slot in the verdict.

**G45 Stated silence.** An entry says explicitly that it makes no claim about an invariant, or that the invariant does not apply, as distinct from never having considered it. Arrows: M to M. Enables: "unknown" splits into "open" and "deliberately unclaimed"; Unattested's "X01 is silent on attenuation" becomes a to-do with an address. Day one: `compose.mjs`. Receipt: none; it is a marker with an author. Cost: cheap per row, and a standing temptation to mark everything.

**G46 Misstatement patterns.** From corrections and hunt findings: the recurring ways a claim of this family is misstated (hypothesis dropped, one-way stated as two-way, convention swapped), as a typed tag on each correction. Arrows: L to M. Enables: targeted re-reading: families with a high rate of a pattern get read for it first; a model consulting the map is warned of the usual error. Day one: `audit.mjs` reports. Receipt: the correction itself. Cost: 22 corrections and 11 hunt findings to tag today; cheap; statistics are thin until there are more.

**G47 Limits of an approximation.** Where an approximate claim degrades: the regime, the rate, the first-order correction. Arrows: M to C. Enables: chains through approximations carry their regime. Day one: nobody. Receipt: a window. Cost: needs G03.

### Axis 5: realization and use

**G48 One realization record.** Research_OS's P1: `{ entry, by: proof, code, platform, model or world, ref, departures, checkedBy, assurance, contract hash }`. Arrows: M to C, M to F. Enables: one place to ask "what makes this entry real, and how far does it depart". Day one: Research_OS (its `bindings.json` rows move in), the build. Receipt: a ref at a commit with a hash; departures are claims and start unchecked. Cost: rows exist in three repositories; the schema is a union of shapes already in use.

**G49 Stored chain proofs.** P3: `{ chain, invariant, citation, axioms }`. Arrows: M to F. Enables: "whole-chain check required" resolves by lookup. Day one: `compose.mjs`. Receipt: the proof at a commit, its axioms printed. Cost: one row exists; cheap.

**G50 Postcondition and read-back on a binding.** P5: the predicted postcondition as a sentence and a script whose output decides it. Arrows: M to C and back. Enables: the Regulator reads its types from the map instead of holding them in Java. Day one: Phone. Receipt: the script, and a round. Cost: per binding; five exist in `Typed.java`.

**G51 Observation ledger.** P4, under the ruled rule. Arrows: C to M. Enables: a contract grade can move to monitored. Day one: the binding grades. Receipt: a hash of the read-back output. Cost: the rule is ruled; the fields and the crossing of two ladders are a ruling still to make.

**G52 Problem classes served.** A vocabulary of problem classes with entries and stored routes attached. Arrows: L to M. Enables: retrieval from a problem statement. Day one: MCP. Receipt: a window where a source says the method solves the class. Cost: the vocabulary is the hard part, and it is free text under another name unless each class is itself typed (input kind, wanted output kind, invariants required), in which case it is a `compose --require` policy with a name.

**G53 Named routes.** A stored chain with a purpose, checked by `compose.mjs` in the gate. Arrows: M to M, L to M. Enables: regression tests for the map (a route that composed yesterday and fails today names what moved); the nineteen routes of Formalization's probe as fixtures. Day one: the gate. Receipt: a source describing the method. Cost: small; each row exercises many others.

**G54 Consumer registry.** Who reads which entry at which pin. Arrows: none; it is bookkeeping. Enables: a contract change lists who to tell. Day one: the build. Receipt: the consumer's own file at a commit. Cost: cheap, and it goes stale the day after it is written unless consumers publish it themselves.

**G55 Demand signal.** Per unchecked claim, how many stored routes, realizations and consumers rest on it. Arrows: none. Enables: verification goes where use is, the essay's "heavily cited undischarged axioms rise in priority". Day one: `audit.mjs` targeting. Receipt: computed. Cost: free once G48 and G53 exist.

**G56 Technique tags on proofs.** For formal links and Lean claims, the technique the proof turns on (the essay's technique chart, Formalization's crux record). Arrows: F to L. Enables: "which proof strategies recur across domains". Day one: nobody here. Receipt: the proof. Cost: needs proof reading; far from today's consumers.

**G57 Departure records from use.** The essay's departure compost pile: where a pattern fails a phenomenon or a platform, what residue is left. `bindings.json`'s `departures` and the binding notes are small instances. Arrows: C to M. Enables: an applied reader sees where the mathematics leaves their case. Day one: with G48. Receipt: the observation or the code. Cost: arrives with realizations; no rows otherwise.

### Axis 6: the atlas

**G58 Charts as declared objects.** A chart is a named vocabulary with a scope: its carriers, its invariants, the entries stated in it, who authored it. The nine domains are charts by birth; "graphs", "matroids", "the D9 effect vocabulary", "Mathlib.Algebra as read by the ingest" are charts by use. Arrows: A. Enables: overlaps and transitions have something to be between. Day one: the build (membership is mostly derivable from carriers). Receipt: none; it is a declaration with an author. Cost: small, and empty of value alone.

**G59 Transition maps.** Between two charts, a dictionary on the overlap: carrier to carrier, invariant to invariant, operation to operation, each row with a domain of validity and a loss grade (G30), and a direction. For graphs to matroids: graph to its cycle matroid, edge to ground-set element, forest to independent set, edge deletion to matroid deletion, edge contraction to matroid contraction; valid on all graphs one way, on graphic matroids the other way; vertices are lost. Arrows: A. Enables: a claim receipted in one chart is carried to the other with its evidence capped at the transition's; a claim that uses a word outside the dictionary is reported as untransportable, which is the departure, derived. Day one: `compose.mjs` (a transition is a step whose kinds are charts), MCP. Receipt: a window per dictionary row, or a declaration (Mathlib has `Matroid` and graphic matroids in some form: unknown at this point). Cost: the 29 landed clusters are the seed; a transition for one cluster is 5 to 15 rows; each row checkable.

**G60 Commuting squares.** The content of "these two operations are the same across charts": operation `p` in chart A, operation `q` in chart B, transition `t`, and the claim `t after p = q after t`, on a domain, up to the equality of G08. Arrows: A. Enables: an isomorphism cluster stops being a list of members and becomes checkable statements, each of which can be tested on instances (G04) and can fail; the failures are the departures. Day one: a checker that runs squares on instances. Receipt: a window ("contraction in the graph corresponds to contraction in the matroid"), a declaration, or a computed instance. Cost: one square per pair of corresponding operations per cluster, perhaps 100 for the landed clusters; computable for finite combinatorial charts.

**G61 Cocycle records.** For three charts with transitions among them, whether `t_BC after t_AB = t_AC` on the triple overlap, row by row of the dictionaries, with any defect recorded. Arrows: A. Enables: the atlas's "compatible on overlaps" as a check that runs; an inconsistent trio of dictionaries is caught mechanically without knowing which one is wrong. Day one: a checker over G59 rows; pure data comparison. Receipt: computed from the dictionaries. Cost: free once there are three charts pairwise connected, which today means choosing a triangle on purpose (graphs, matroids, matrices; or posets, categories, toposes).

**G62 Holonomy.** The defect around a cycle of transitions or of dualities kept as data in its own right: going there and back returns the object up to a twist (double dual, transpose twice, Fourier four times is the identity and twice is reflection). Arrows: A, M to C (a round trip in code that is the identity only up to a named map). Enables: a round trip check knows what to expect instead of expecting equality; a nontrivial holonomy is an invariant of the atlas region. Day one: G33's harness. Receipt: a window or a computed instance. Cost: few rows, each surprising; speculative as a general kind.

**G63 Degradation grade.** For a cluster edge: isomorphism, equivalence, adjunction, embedding, restricted isomorphism, abstraction, structural bridge, analogy; with the place it stops. The landed Domain 1 index uses several of these words. Arrows: A. Enables: evidence transport across an edge is capped by the grade: all claims cross an isomorphism, only claims in the dictionary cross an abstraction, nothing crosses an analogy except a lead. Day one: `evidence.mjs`. Receipt: a window. Cost: 29 clusters, one grade per edge; the grade is a judgment like a match grade, with the same agreement risk.

**G64 Walk status.** The test record of an isomorphism hypothesis: unwalked, walked with squares checked on instances, red-teamed with the counterexample that bounded it. The landed status is "Unwalked" everywhere. Arrows: A. Enables: the essay's "isomorphism hypotheses red-teaming tests" as a ledger. Day one: the build. Receipt: the squares and instances that were run. Cost: it is the evidence level of G59 and G60 rows under another name, so it costs nothing extra if those carry evidence.

**G65 Abstract pattern entries.** The node a cluster's members are clones of ("restriction", "minor", "tensor product"), with each member's departure typed as: adds structure, restricts domain, changes convention, loses structure. Arrows: A. Enables: structural deduplication as the essay has it; a claim proved for the pattern is offered to every clone, minus what its departure breaks. Day one: `mathmap.mjs` clone resolution, which already resolves pointers to homes. Receipt: a window for the pattern's statement. Cost: 29 patterns; the typed departure is the valuable part and is a judgment per member (62 rows).

**G66 Regions and authorship.** Which chart region a row belongs to and who authored it, so recomputation is local. Arrows: A. Enables: the essay's locality. Day one: the build. Receipt: git. Cost: premature at one repository and one author.

**G67 Chart-relative evidence.** A claim's evidence level is recorded per chart, and crossing a transition makes it "imported", grounding nothing until re-typed locally (the essay's crossing rule). Arrows: A. Enables: evidence does not launder across an analogy. Day one: `evidence.mjs`. Receipt: the local re-typing. Cost: a rule in the evidence function, plus one new level or basis tag; a ruling.

## Against the obvious

The obvious survey is the union of the two consumer wish lists. Where a candidate is that, it says so: G05, G06, G07 are Formalization's 7 and 6; G09 its 3; G16 to G23 its 4; G11, G48 to G51, G20 are Research_OS's P2, P1, P3, P5, P4, P7; G52 is Formalization's 8.

Departures from the obvious:

- **G02 against "conditions per claim".** Both consumers ask for hypotheses attached to claims as text. G02 makes them predicates with an `establishes` side on outputs, so they compose. A text condition documents; a predicate lets a chain fail.
- **G31.** The obvious use of a formal link is to raise evidence. G31 runs the link backwards: the declaration's binders audit the entry for omitted hypotheses.
- **G27 against G09.** The obvious intertwining slot is a list of string pairs. G27 says the strings must be entries, which turns the slot into ordinary claims over a carrier the map already declares and nothing touches.
- **G24 and G60.** The obvious relation layer is edges between entries. These are 2-cells: statements that two paths agree. They are what `topology.mjs` says it lacks, and what an "isomorphism of operations" consists of.
- **G30.** The obvious design gives each arrow its own loss vocabulary (match grades for Lean, departures for code, departure notes for clones). G30 bets they are one vocabulary.
- **G37.** The obvious evidence ladder is the present one. G37 inserts computation between a quotation and a proof.
- **G61 and G62.** The obvious atlas is a graph of analogies. These take the manifold metaphor literally enough to compute with: a cocycle check needs no judgment, only three dictionaries.
- **G41.** The obvious negative record is a list of counterexamples. G41 derives non-invertibility from `broken` rows the map already has.
- **G45, G46.** No consumer asked. They come from reading the hunts.

The obvious versions, unchanged: G01, G03, G04, G08, G12, G13, G14, G15, G17 to G19, G21, G22, G25, G26, G28, G29, G32 to G36, G38 to G40, G42 to G44, G47, G53 to G59, G63 to G67.

## Handoff

Every candidate goes to grading as a conjecture about usefulness; what would kill it is stated per candidate. Prior art is searched next (`03-prior-art.md`), then six are piloted (`pilots/`), then all are ranked (`SURVEY.md`).

| Candidate | To | As | What would kill it |
|---|---|---|---|
| G01 claim atoms | grading | conjecture | atoms cannot be cut consistently: two readers split the same field differently |
| G02 predicates | pilot | conjecture | a chain check over real entries catches nothing the present checker misses, or the predicate vocabulary does not close (every entry needs its own) |
| G03 quantities | grading | conjecture | no reader within the survey's horizon |
| G04 instances | grading | conjecture | under a tenth of entries have a computable instance |
| G05 status | grading | conjecture | fewer than 20 entries depart from "proved" |
| G06 nature | grading | conjecture | second-reader agreement as low as the match grades' |
| G07 shape, G08 determinacy, G10 operands | grading | conjecture | subsumed by G36 with nothing left over |
| G09 intertwinings, G27 operations as carriers | pilot (together) | conjecture | `from` and `to` cannot be bound to entries for most rows; or no route is found through them that text search does not find |
| G11 contract hash | grading | conjecture | nothing; it is computed. Dead only if no consumer pins |
| G12 conventions | grading | conjecture | conventions do not cluster into small per-family vocabularies |
| G13, G14, G15 | grading | conjecture | no day-one reader |
| G16 inverse with domain | pilot | conjecture | pairs cannot be receipted with a domain; or `compose` reports nothing new on round trips |
| G17 adjoint pairs | grading | conjecture | derived claims duplicate what entries already state |
| G18, G19, G21, G22, G23 | grading | conjecture | the relation word covers too many things to type (most likely for G18) |
| G20 sameAs | grading | conjecture | most same-name groups turn out to be different operations |
| G24 commutes-with | grading | conjecture | no loop in TOPOLOGY can be filled with a receipted row |
| G25, G26, G28 | grading | conjecture | no change in any chain's verdict |
| G29, G32, G33 | grading | conjecture | need G01 and G02 first; dead alone |
| G30 one loss vocabulary | grading | conjecture | the grades do not transfer: a code departure fits none of the six |
| G31 binder alignment | pilot | conjecture | binders of exact links are all already stated by their entries |
| G34 lexicon | grading | conjecture | senses do not reduce typing misses measurably |
| G35 external ids | grading | conjecture | ids resolve for too few entries |
| G36, G37 | grading | conjecture | G37: too few entries compute; a new evidence level is refused |
| G38 | kept | expression only | n/a |
| G39 counterexamples per hypothesis | pilot (with G02) | conjecture | witnesses cannot be receipted or computed |
| G40 obstructions | grading | conjecture | scope cannot be stated in the map's kinds and invariants |
| G41 inverse blockers | pilot (with G16) | conjecture | derivation from `broken` gives wrong answers on real entries |
| G42 to G47 | grading | conjecture | no reader, or rows only in prose that resists extraction |
| G48 to G51 | grading | conjecture | the union schema fits none of the three consumers' rows without loss |
| G52 problem classes | grading | conjecture | cannot be typed, so it is free text |
| G53 named routes | grading | conjecture | routes cannot be typed for the checker (1 of 19 today) |
| G54 to G57 | grading | conjecture | stale or reader-less |
| G58 charts, G59 transitions | pilot (together) | conjecture | a transition's rows cannot be receipted; or carrying a claim across gives nothing the landed departure note does not already say |
| G60 commuting squares | pilot | conjecture | squares cannot be tested on instances; or all pass trivially |
| G61 cocycle | pilot (with G59) | conjecture | no triangle of charts exists in the landed clusters |
| G62 holonomy | grading | conjecture | fewer than five receipted rows |
| G63, G64, G65 | grading | conjecture | grade agreement too low; walk status adds nothing over evidence levels |
| G66 regions | kept | expression only | n/a |
| G67 chart-relative evidence | grading | conjecture | needs a ruling; dead if imported claims are simply not carried |
