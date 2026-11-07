# From Formalization, 2026-11-06: intake findings, thirteen misaligned D8 rows, and formal links for the Laplace entries

A proposal, not a change: verify, then fold in or decline, and say which. Sent at the operator's request (2026-11-06) from A-Viable-Fork/Formalization's stress test of the map's intake: `reports/2026-11-06-map-intake-stress.md`, with its working files in `reports/intake/`, on Formalization's branch `claude/gifted-gates-3blhch` at `ec4d139` (not yet merged). Read against Math_Map `0a3c92b` (`map.json` built from `dacfc7c`). Facts are marked; everything under a proposal is generation.

## 1. The relation layer is parsed and dropped

`scripts/mathmap.mjs` reads each landed entry's `ISO / DEP / CS` field into `iso` and uses it only to resolve clone pointers (read, lines 37 and 49 to 75). `map.json` carries it for no entry (read). 513 landed entries have content there: 485 departure notes and 62 references to 29 isomorphism clusters (measured, by grep of `source/math_map.md`). Domain 1's isomorphism cluster index types each relation and says where it departs (read, `source/math_map.md` lines 2645 to 2670).

**Proposal.** Emit the three parts as landed fields (`iso`, `departure`, `cloneStatus`), evidence unchecked, and expose them through `get_entry`; parse the Domain 1 index into typed relations with their departures.

## 2. Thirteen misaligned D8 rows

Each is landed, unaudited and anchorable at `0a3c92b`; none is used by a clone, composite, formal link or correction (read). The list, also in Formalization's `reports/intake/d8-misaligned.json`, is below. Most are a shift by one within an alphabetical run (D8-079 "Graph minor" carries the geometric hashing of D8-078's name; D8-078 carries the QZ decomposition of D8-077).

| Row | Landed name | The text describes |
|---|---|---|
| D8-030 | Confluent persistence transformation | dynamization (D8-048): static to dynamic structure with O(log n) updates |
| D8-051 | Exponential transform | Euclidean distance transform (D8-050), 'variant with exact L2 metric' |
| D8-052 | Extended Euclidean transformation | exponential transform (D8-051's name): E{f}(s) = sum f(n) s^n / n! |
| D8-074 | Gaussian mechanism transformation | Laplace mechanism (D8-111): Laplace noise scaled to L1 sensitivity for epsilon-DP |
| D8-078 | Geometric hashing transformation | generalized Schur (QZ) decomposition (D8-077): 'Generalizes Schur for matrix pairs (A,B)' |
| D8-079 | Graph minor transformation | geometric hashing (D8-078's name): points to a hash table via geometric invariants |
| D8-082 | Haar transform | Groebner basis (D8-081): 'Grobner basis: see D2-156' |
| D8-109 | Kernelization transformation | Karhunen-Loeve / PCA (D8-108): 'See D5-077' |
| D8-121 | Leverage-score sampling transformation | leverage-based random projection, read as the LESS sketch (D8-120); plausible, not certain |
| D8-122 | Line graph transformation | leverage-score sampling (D8-121's name): rows sampled by leverage scores |
| D8-207 | Succinctness transformation | post-processing of differential privacy: 'Applies any data-independent map to differentially private output' |
| D8-208 | Sumudu transform | topological sort (D8-215's name): linear ordering of a DAG |
| D8-220 | Turing (Cook) reduction | Tucker decomposition (D8-219): core tensor times factor matrices |

Read and found aligned among the same leads: D8-015 Bowyer-Watson (content is Bowyer-Watson); D8-056 Fiat-Shamir (content is Fiat-Shamir); D8-097 Inverse accumulation (reverse-mode AD is inverse accumulation).

**Proposal.** Flag them in `mapfill/flags.js` as `misaligned`, with the evidence in the list, and add a name-against-content lead check to the gate that reports leads and never flags on its own (Formalization's `reports/intake/misalign.mjs` is a first version: precision about 80% in D8, low elsewhere because proper-noun names share no word with their content).

## 3. The schema

Section 7 of the report ranks nine proposals: the relation layer above; the D8 flags; an intertwining slot; typed relations between entries; claims with their own kind, direction, conditions and quantities in place of four-word labels; an entry's nature and shape; the status of the mathematics apart from the map's evidence; uses (problem classes); and MCP queries for relations, intertwinings and routes. The measurements behind them are in its sections 1 to 3.

## 4. Formal links proposed for the Laplace entries

Formalization's `Bridges/Bridges/Laplace.lean` proves the claims below over Mathlib `380f2aa` on the toolchain `v4.35.0-rc3`, 35 theorems on the standard axioms, the closure replayed by the six kernels of `lake check --paranoid` (report, section 8); the theorems in the table below pass Formalization's gold standard (hand-reviewed challenges under `lake comparator --paranoid`, with two negative controls rejected; report, section 9). Math_Map's `formal.js` links Mathlib declarations and `lean.js` its own `lean/` project, so a link to a theorem in Formalization needs a ruling: link it in place, or port the file into `lean/` (it imports only `Mathlib.Analysis.MellinInversion` and `Mathlib.Analysis.Convolution`).

| Entry | Field | Theorem (namespace `Bridges.Laplace`) | Proposed grade |
|---|---|---|---|
| D6-086 | input, output | `laplaceConvergent_of_le_exp`, `LaplaceConvergent.mono_re` | exact (for a measurable input) |
| D6-086 | preserved: linearity | `laplace_add`, `laplace_const_smul` | exact |
| D6-086 | preserved: convolution to multiplication | `laplace_conv` (with `conv_eq_integral_Ioo`) | exact |
| D6-086 | preserved: initial and final value theorems | `tendsto_mul_laplace_atTop`, `tendsto_mul_laplace_nhdsGT_zero` | special (bounded input) |
| D6-086 | description: reduces ODEs to algebraic | `laplace_deriv` | exact, for the rule |
| D6-073 | preserved: exact inversion | `bromwich_laplace_of_pos`, `bromwich_laplace_of_neg` | exact, under integrability along the line |
| D2-028 and its four same-text homes | preserved: convolution to product; invertible within the strip | `bilaplace_conv`, `bromwich_bilaplace` | exact |
| D2-029 and its three same-text homes | description | `bromwich_bilaplace` | exact |

Two findings for corrections, each with a formal receipt. D6-086's "preserved: initial/final value theorems" files two one-way theorems as invariants; the converse of the final value theorem is false (`not_tendsto_cexp_mul_I` with `tendsto_mul_laplace_cexp_mul_I`: for `e^{it}`, `s F(s) → 0` while `f` has no limit). D6-086's "broken: pointwise values" is imprecise: the inverse recovers `f` at its points of continuity on `t > 0` and returns 0 on `t < 0`.
