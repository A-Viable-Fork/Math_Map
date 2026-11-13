# Schema survey, phase 3: prior art, searched after generating

Date: 2026-11-13. Searched after `02-generation.md` was committed (`f208016`). Every "read" below is a verbatim window in `docs/schema-survey/excerpts/`, made with `scripts/excerpt.mjs`, which checks the window against the page as fetched and records the page's hash. A statement marked **recalled** is from memory and is a lead. **Unknown** means a fetch was tried and failed, or the page read did not say. **Not searched** means no source was looked for.

What a quotation shows is that a system keeps data of that kind in that form. It does not show the kind is right for this map; that is for the pilots.

## What could not be fetched

| Source | What happened | Consequence |
|---|---|---|
| The LMFDB site (`www.lmfdb.org`) | every page returned a reCAPTCHA challenge | what its knowls and its per-collection reliability pages say is unknown; the project's README on GitHub and an arXiv abstract were read instead |
| The Stacks project tag pages | TLS verification failed through the proxy | how tags work is unknown from the source; Mathlib's own `stacks` attribute at the pin is read |
| Müller, Gauthier, Kaliszyk, Kohlhase, Rabe, "Classification of Alignments between Concepts of Formal Mathematical Systems" | the address tried returned 404 and an arXiv title search found nothing | its alignment taxonomy is recalled only, and bears on G30, G59, G63; marked unknown where it would decide something |
| Tabareau, Tanter, Sozeau, univalent parametricity | arXiv title searches found nothing | recalled only |
| nLab, "transport of structure" | no page source at that address | Wikipedia's page was read instead |

## Sources read

| System | Excerpt file | What it keeps |
|---|---|---|
| Mathlib at `380f2aa` | `mathlib-equiv.txt`, `mathlib-partialequiv.txt`, `mathlib-chartedspace.txt`, `mathlib-adjunction.txt`, `mathlib-semiconj.txt`, `mathlib-transfer.txt`, `mathlib-counterexamples.txt` | inverses with and without a domain, atlases with a structure groupoid, adjunctions, commuting squares, transfer across an equivalence, a counterexample library, external tags |
| nLab | `nlab-univalence.txt`, `nlab-duality.txt`, `nlab-obstruction.txt` | sameness and transport, what "duality" covers, obstruction as a class |
| OEIS | `oeis-format.txt` | cross-references, formulas, programs, a keyword for dead entries |
| LMFDB (README and abstract) | `lmfdb-readme.txt`, `arxiv-lmfdb.txt` | labels, completeness, source and reliability statements per collection, related objects |
| Wikidata | `wikidata-P1889.txt`, `-P460.txt`, `-P1322.txt`, `-P2534.txt`, `-P1318.txt`, `-P4215.txt` | typed statements between items, external identifiers |
| MMT and OMDoc | `mmt-implicit.txt`, `wikipedia-omdoc.txt`, `arxiv-realms.txt`, `arxiv-biform.txt` | theory graphs, views, implicit morphisms that must commute, realms |
| Transport and univalence | `arxiv-trocq.txt`, `wikipedia-transport-of-structure.txt`, `nlab-univalence.txt`, `mathlib-transfer.txt` | carrying statements across equivalences and weaker relations |
| Ontology alignment | `w3c-skos-mapping.txt`, `sssom-chaining.txt`, `sssom-predicates.txt`, `arxiv-sssom.txt`, `wikipedia-ontology-alignment.txt` | graded mappings, their metadata, and rules for composing them |
| Atlases, literally | `wikipedia-atlas.txt`, `wikipedia-fiber-bundle-cocycle.txt`, `wikipedia-institution.txt` | transition maps on overlaps, the cocycle condition, truth preserved under change of notation |
| Others | `openmath-arith1.txt`, `fungrim-readme.txt`, `arxiv-fungrim.txt`, `pibase-theorem.txt`, `pibase-contributing.txt`, `leanblueprint-readme.txt`, `formal-conjectures-readme.txt`, `unison-big-idea.txt`, `plausible-readme.txt`, `wikipedia-quickcheck.txt`, `wikipedia-hoare-logic.txt`, `wikipedia-design-by-contract.txt`, `wikipedia-refinement-type.txt`, `wikipedia-bidirectional-transformation.txt`, `wikipedia-grammatical-framework.txt`, `wikipedia-proof-of-impossibility.txt`, `arxiv-mathgloss.txt`, `gams-home.txt` | named in the rows below |

## The findings that bear most on the survey

Six things the search turned up that the generation did not have, each quoted.

**1. Hypotheses on every formula is a working database design.** Fungrim: "An intended feature of Fungrim is that all formulas will be accompanied by explicit sufficient conditions of validity for the functions and variables." (`fungrim-readme.txt`). pi-Base goes further and makes the hypotheses a closed vocabulary of properties, with theorems as implications between them. A whole theorem there is data of this shape (`pibase-theorem.txt`):

    if:
      P000099: true
    then:
      P000002: true

and a contributed fact is refused when the vocabulary already yields it: 'Contributions that edit/add a "trait" (pair of an existing space/property) are typically acceptable' "unless the trait is already deduced by existing theorems." (`pibase-contributing.txt`). So G02 exists, in one field, with exactly the two parts generated here (predicates, and implications among them, which is G25). What pi-Base lacks is operations: its properties sit on spaces and nothing transforms a space. G02's `establishes` and `destroys` on an operation's output have no counterpart found.

**2. An inverse with a domain of validity is a Mathlib structure.** `PartialEquiv` is a pair of functions "from α to β and from β to α (just like equivs), which are inverse to each other on the subsets" "`e.source` and `e.target` of respectively α and β." (`mathlib-partialequiv.txt`). It also names the problem G08 points at: "`EqOnSource`: equivalence relation describing the \"right\" notion of equality for partial" equivalences. G16's `{ a, b, on }` is this structure with the sets replaced by predicates.

**3. An atlas is two ingredients, and Mathlib separates them.** "the set of charts, which is data" and "the fact that changes of charts belong to some group (in fact groupoid), which is additional Prop." (`mathlib-chartedspace.txt`). The groupoid is "stable under composition and inverse, to which the change of coordinates should belong." This is G59 and G63 in one design: the transitions are data, and the grade is a choice of which class of transitions is allowed. A smoother manifold is the same charts with a smaller groupoid. Read across: a stricter atlas of isomorphisms is the same dictionaries held to a stricter grade.

**4. Composition of mappings is where graded alignments fail, and two standards say so.** SKOS: "the possibility of \"compound errors\" when combining mappings across more than" two schemes is why `closeMatch` is not transitive; "All other SKOS mapping properties are not transitive." (`w3c-skos-mapping.txt`). SSSOM writes the composition table out: "We consider the following predicates transitive:", "Predicates we do not consider transitive include:", and "Role chains are rules that allow us to bridge across mappings across multiple different properties." (`sssom-chaining.txt`). MMT enforces the strict case: "there may at most 1 implicit morphism between any two theories." "In other words, the subgraph of implicit morphisms must commute." (`mmt-implicit.txt`; the first sentence is quoted from its middle). So G61 exists as a rule in MMT and as a caution in SKOS. Neither stores the defect when composition fails; MMT refuses the graph and SKOS declines to infer.

**5. A commuting square is one predicate in Mathlib.** "`Function.Semiconj`: `f : α → β` semiconjugates `ga : α → α` to `gb : β → β` if `f ∘ ga = gb ∘ f`;" (`mathlib-semiconj.txt`). G60's square, and G09's intertwining with both sides bound to operations (G27), are the same statement: a transform `f` semiconjugates operation `ga` to operation `gb`. The generation treated them as two candidates on two axes.

**6. "Dual" and "close" are known hazards.** nLab on duality: "a rough guiding intuition is of pairs of concepts that are mirror images of one another" (`nlab-duality.txt`), with the crisp case being a theory where "one has a [[theory]] whose [[signature]] admits a nontrivial [[involution]]". Wikidata's `dual to` is scoped by its own description to "dual of a polytope, graph or curve" (`wikidata-P1322.txt`). SSSOM on the loosest grade: "The two terms are intended to refer to roughly the same thing, but not quite. This is a hazy category and should be avoided in practice" (`sssom-predicates.txt`). G18 untyped and the "analogy" end of G63 are the hazy categories here.

## Candidate by candidate

"Exists" answers whether a system read here keeps this kind. Where a row says recalled or not searched, nothing is claimed.

### Axis 1: the entry itself

| Candidate | Exists elsewhere | Form, with the receipt |
|---|---|---|
| G01 claim atoms | yes | OpenMath content dictionaries list a symbol's properties one per element: "<CMP> for all a,b \| a + b = b + a </CMP>" with a formal twin beside each (`openmath-arith1.txt`). Fungrim: "Each entry (formula) in Fungrim is assigned a permanent identifier" (`fungrim-readme.txt`): the unit with an id is the formula, smaller than the function |
| G02 predicates | yes | Finding 1. Also the programming forms: "when the precondition is met, executing the command establishes the postcondition" (`wikipedia-hoare-logic.txt`); a refinement type "is a type endowed with a predicate which is assumed to hold for any element of" it (`wikipedia-refinement-type.txt`); contracts as "[[precondition]]s, [[postcondition]]s and [[Invariant (computer science)\|invariants]]" (`wikipedia-design-by-contract.txt`) |
| G03 quantities | not searched | Fungrim's formula language is described as representing "mathematical content semantically" (`arxiv-fungrim.txt`); whether it carries bounds as data is unknown |
| G04 instances | yes | OEIS keeps data, formulas and programs per entry: "cross-references are in %Y lines, formulae in %F lines, etc." (`oeis-format.txt`); pi-Base keeps spaces as witnesses (`pibase-contributing.txt`) |
| G05 status of the mathematics | yes, in two shapes | formal-conjectures marks each statement with attributes: "`@[category]`, `@[formal_proof]`, `@[AMS]`, `@[question]`" (`formal-conjectures-readme.txt`). Wikidata keeps the prover, "person who proved something" (`wikidata-P1318.txt`), which is attribution, a different thing from status |
| G06 nature | yes | OMDoc's statement level distinguishes "Definitions, theorems, proofs, examples and the relations between them" (`wikipedia-omdoc.txt`) |
| G07 shape, G10 operands, G36 signatures | recalled | OpenMath carries a `Role` on each symbol (seen in the fetched dictionary, not excerpted); a signature system for OpenMath is recalled, unread |
| G08 determinacy | yes, for the partial case | `EqOnSource`, finding 2 |
| G09 intertwinings | yes | Finding 5. `Function.Semiconj₂` is the binary case (read in the same file, not excerpted) |
| G11 contract hash | yes | Unison: "Each Unison definition has a unique and deterministic address (its hash) in this vast immutable address space." (`unison-big-idea.txt`) |
| G12 conventions | not searched | |
| G13 universal property | recalled | Mathlib's `IsLimit` and `IsColimit`; unread here |
| G14 complexity on the algorithm | partly | biform theories pair the logical and the computational side of one theory: "proof assistants express the semantic in logic and emphasize deduction, and computer algebra systems express the semantics in programming languages and emphasize computation" (`arxiv-biform.txt`) |
| G15 symbol table | yes | OpenMath content dictionaries: "The symbol representing an n-ary commutative function plus." (`openmath-arith1.txt`); Wikidata's "defining formula" (`wikidata-P2534.txt`) |

### Axis 2: between entries

| Candidate | Exists elsewhere | Form, with the receipt |
|---|---|---|
| G16 inverse with domain | yes | `Equiv` with "protected invFun : β → α" (`mathlib-equiv.txt`); `PartialEquiv`, finding 2 |
| G17 adjoint pair | yes | "structure Adjunction (F : C ⥤ D) (G : D ⥤ C) where" with unit, counit and the triangle identities (`mathlib-adjunction.txt`) |
| G18 dual | yes, and it is several things | Finding 6. Mathlib treats categorical duality as a mechanical translation of declarations: the attribute "to_dual self (reorder := C D, 2 4, F G)" sits on `Adjunction` (`mathlib-adjunction.txt`), beside `to_additive`, which this map already records as `twin` |
| G19 special case, generalization | yes | SKOS broad and narrow matches, composed by SSSOM's role chains (`sssom-chaining.txt`); this map's own match grades |
| G20 sameAs | yes, with a warning | Wikidata: "this item is said to be the same as that item, though this may be uncertain or disputed" (`wikidata-P460.txt`). SKOS says the strict identity properties of OWL "would typically be inappropriate for" linking concepts across schemes (`w3c-skos-mapping.txt`). LMFDB: "Each mathematical object should be given a label that is mathematically" meaningful (`lmfdb-readme.txt`) |
| G21 implements | partly | biform theories, as G14; OEIS program lines: "These lines give a program in some other language that will produce the sequence." (`oeis-format.txt`) |
| G22 discretizes, limit-of | not searched | |
| G23 composite-of | not searched | |
| G24 commutes-with | yes | "`Function.Commute`: `f : α → α` commutes with `g : α → α` if `f ∘ g = g ∘ f`," (`mathlib-semiconj.txt`) |
| G25 relations between invariants | yes | pi-Base theorems, finding 1 |
| G26 forgetful maps as entries | recalled | Mathlib's forgetful functors and coercions; unread |
| G27 operations as carriers | yes | In type theory an operation is a term like any other: `Semiconj` takes `ga` and `gb` as arguments (`mathlib-semiconj.txt`) |
| G28 depends-on | yes | leanblueprint: "`\uses` that lists LaTeX labels that are used in the surrounding environment." (`leanblueprint-readme.txt`); OMDoc: "Theories may import each other, thereby forming a [[graph (data structure)\|graph]]." (`wikipedia-omdoc.txt`) |

### Axis 3: across representations

| Candidate | Exists elsewhere | Form, with the receipt |
|---|---|---|
| G29 statement triples | yes, as pairs | OpenMath's CMP and FMP, a commented and a formal property side by side (`openmath-arith1.txt`). leanblueprint pairs an informal statement with "`\lean` that lists the Lean declaration names corresponding to the surrounding" statement (`leanblueprint-readme.txt`). A third, code-facing leg was found only in the biform-theory abstract |
| G30 one loss vocabulary | yes, in ontology mapping | SSSOM's stated purpose: "Introducing a machine-readable and extensible vocabulary to describe metadata that makes imprecision, inaccuracy and incompleteness in mappings explicit." and its motivating question, "are two terms equivalent or merely related? Are they narrow or broad matches?" (`arxiv-sssom.txt`). For formal mathematics the alignment classification paper is the likely source and is unknown (not fetched) |
| G31 binder alignment | not found | leanblueprint's `\leanok` "claims the surrounding environment is fully formalized" (`leanblueprint-readme.txt`): a claim of correspondence at the level of the statement, with no comparison of hypotheses. No system read here audits an informal statement against a declaration's binders |
| G32 controlled sentences | yes | Grammatical Framework: "GF is capable of parsing and generating texts in several languages simultaneously while working from a language-independent representation of meaning." (`wikipedia-grammatical-framework.txt`). Controlled natural languages for mathematics are recalled (Naproche, ForTheL); the page tried returned 404 |
| G33 round-trip records | yes, as laws | lenses: "Lenses are required to obey certain conditions to ensure sensible behaviour.", with the forward direction "discarding some information in the process" (`wikipedia-bidirectional-transformation.txt`). A stored record of a round trip having been run was not found |
| G34 lexicon with senses | partly | MathGloss: "MathGloss is a linked database of undergraduate concepts in mathematics." (`arxiv-mathgloss.txt`), linking terms across Wikidata, a Lean curriculum and the nLab per its abstract; whether it separates senses is unknown |
| G35 external identifiers | yes | Wikidata's "nLab ID", "name of a page in nLab wiki" (`wikidata-P4215.txt`); Mathlib's "@[stacks 0037" tag on a declaration (`mathlib-adjunction.txt`); formal-conjectures' `@[AMS]` |
| G37 executable laws | yes | QuickCheck: "Then QuickCheck attempts to generate a test case that [[Falsifiability\|falsifies]] such assertions." (`wikipedia-quickcheck.txt`). In Lean: "A property testing framework for Lean 4 that integrates into the tactic framework.", whose output is "Found a counter-example!" (`plausible-readme.txt`) |
| G38 aliases | recalled | Wikidata aliases; unread |

### Axis 4: negative knowledge

| Candidate | Exists elsewhere | Form, with the receipt |
|---|---|---|
| G39 counterexamples per hypothesis | yes | Mathlib keeps a `Counterexamples` library, one file per case: "public import Counterexamples.CharPZeroNeCharZero", "public import Counterexamples.NowhereDifferentiable" (`mathlib-counterexamples.txt`). pi-Base admits a space when it "provides an example/counter-example that is not currently represented" (`pibase-contributing.txt`). Neither ties the witness to the one hypothesis it defeats as a field; in pi-Base the tie is implicit in the traits |
| G40 obstructions | yes, in two senses | informal lists: an impossibility theorem "is a [[theorem]] that demonstrates a problem or general set of problems cannot be solved" (`wikipedia-proof-of-impossibility.txt`). The nLab's sense is narrower and sharper: a lift "exists precisely if the induced" class is trivial (`nlab-obstruction.txt`), an obstruction as an object whose vanishing decides the question |
| G41 inverse blockers | not found | lenses name the lost information (above); no system read derives non-invertibility from a list of broken invariants |
| G42 dead routes | partly | OEIS keyword `dead`: "An erroneous or duplicated sequence (the table" "contains a number of incorrect sequences that have appeared in the literature," with pointers to the correct versions (`oeis-format.txt`). That is a kept record of known errors. A record of failed strategies was not found |
| G43 false friends | yes | Wikidata: "item that is different from another item, with which it may be confused" (`wikidata-P1889.txt`) |
| G44 intended breaks | not searched | |
| G45 stated silence | not searched | recalled: the open-world and closed-world distinction in knowledge bases |
| G46 misstatement patterns | not searched | OEIS `dead` is the nearest thing read |
| G47 limits of an approximation | not searched | |

### Axis 5: realization and use

| Candidate | Exists elsewhere | Form, with the receipt |
|---|---|---|
| G48 realization record | partly | OEIS program lines (above); biform theories; LMFDB pages carry code per object (recalled; the site was not fetchable). A record with departures and an assurance grade was not found |
| G49 stored chain proofs | not searched | |
| G50 postcondition and read-back | yes, as a discipline | Hoare triples and contracts (G02's row) |
| G51 observation ledger | not searched | |
| G52 problem classes | yes | GAMS: "A cross-index and virtual repository of mathematical and statistical software" (`gams-home.txt`), indexed by a problem taxonomy (recalled; the taxonomy page was not read) |
| G53 named routes | not searched | |
| G54 consumer registry, G55 demand signal | partly | the essay's own "Heavily cited undischarged axioms rise in priority" (read in phase 1); elsewhere not searched |
| G56 technique tags | not searched | |
| G57 departure records | partly | LMFDB's per-collection statements: a page "summarizes key invariants, links to completeness, source, and" "reliability knowls, and when applicable, a list of related objects." (`lmfdb-readme.txt`). That is reliability of data, the nearest read analogue of a statement of where a record stops being trustworthy |

### Axis 6: the atlas

| Candidate | Exists elsewhere | Form, with the receipt |
|---|---|---|
| G58 charts | yes | Finding 3; OMDoc theories; MMT theories |
| G59 transition maps | yes | geometry: "A transition map provides a way of comparing two charts of an atlas." and "This composition is not well-defined unless we restrict both charts to the [[Intersection (set theory)\|intersection]] of their [[Domain of a function\|domains]] of definition." (`wikipedia-atlas.txt`). Logic: "it is assumed that signature morphisms lead to translations of sentences and models in a way that satisfaction is preserved" (`wikipedia-institution.txt`). Libraries: realms, where "Views interconnect these developments and establish that the axiomatizations are equivalent in the sense of being mutually interpretable." (`arxiv-realms.txt`). Ontologies: "A set of correspondences is also called an alignment." (`wikipedia-ontology-alignment.txt`) |
| G60 commuting squares | yes | Finding 5 |
| G61 cocycle records | yes as a condition, no as a record | Finding 4. Geometry: "The third condition applies on triple overlaps" and "The importance of this is that the transition functions determine the fiber bundle (if one assumes the cocycle condition)." (`wikipedia-fiber-bundle-cocycle.txt`) |
| G62 holonomy | not found | the involution of finding 6 is the one-step case; a stored defect around a cycle was found nowhere |
| G63 degradation grade | yes | Findings 3, 4 and 6. Trocq transfers proofs along a spectrum: it "may be used with more relations than just equivalences" (`arxiv-trocq.txt`) |
| G64 walk status | partly | SSSOM records how a mapping was justified (the justification vocabulary was read in the fetched page and is not excerpted); a red-team record was not found |
| G65 abstract pattern | yes | realms: "A realm also contains an external interface that is convenient for users of the library" beside its several axiomatizations (`arxiv-realms.txt`) |
| G66 regions | not searched | |
| G67 chart-relative evidence | partly | univalence removes the question inside one foundation: "one cannot define any [[predicate]] that provably distinguishes isomorphic [[types]]" (`nlab-univalence.txt`), so everything crosses an equivalence. Mathlib without univalence transfers structure by hand, one class at a time: "if `β` has a group structure and `α ≃ β`" "then `α` has a group structure, and similarly for monoids, semigroups and so on." (`mathlib-transfer.txt`). Evidence that is capped by the grade of the crossing was not found outside the essay |

## What the search changes

- **G02 with G25 is established practice, and the map's version has one new part.** Fungrim and pi-Base show the vocabulary closes in a field and that deduction over it pays. Neither has operations. The pilot should test the new part: `establishes` and `destroys` along a chain.
- **G09, G27 and G60 are one kind.** Mathlib's `Semiconj` is all three. They are piloted as one: an intertwining is a square whose top and bottom edges are entries.
- **G16 should copy `PartialEquiv`'s shape**: two entries, a source predicate, a target predicate, and the equality used.
- **G59 and G63 should copy `ChartedSpace`'s split**: dictionaries are data; the grade is the class of transition the atlas demands, stated once per atlas region, and a row either meets it or is recorded below it.
- **G61 has a known failure mode to design for**: approximate matches do not compose. The pilot should record defects, since neither MMT nor SKOS does, and report whether a defect located the wrong row.
- **G18 is confirmed hazardous** by three sources. It survives only typed: an involution on a signature, with what it swaps.
- **G31 and G41 found no prior art.** That makes them either new or wrong; both are cheap to pilot on rows the map already has.
- **Nothing found for** G42 as failed strategies, G62, G64 as a red-team ledger, G67 as capped evidence. The essay is their only source.

The six pilots stand as handed off, with the merge above: (1) G02 with G39, (2) G09 with G27 and G60 as squares on instances, (3) G16 with G41, (4) G31, (5) G59 with G58 and G61 on a triangle of charts, (6) G60 across charts, as the content of an isomorphism cluster. Pilots 2 and 6 use the same record on two axes, which is itself a test of the merge.
