# Finite cochain and game-flow decompositions: supplement, 2026-11-14

Proposal for verification and intake. Read against `c6f8381284f67cf9e984dd75e00350a756f18880`; `map.json` records build source `42c6df3a586ff23e8754b75025cc1838abccb547`. This note proposes mathematics and formalization ingredients. The candidate ids below are provisional and unallocated. No map entry is installed by this note.

**Read:** the same branch already carries `docs/inbound/2026-11-14-finite-game-hodge-decomposition.md` at `7ebe8fb602e0ef8bd2efb8c82fb32e377a750038`. This supplement preserves that note. Four candidate identities below align with its proposals; the two normalized projection records are distinct variants. Intake should consolidate the overlapping records.

## Existing entries reused

**Read:** the overlaid `map.json`, `mapfill/README.md`, the additions contract in `mapfill/additions.js`, and the formal-link contract and pin in `mapfill/formal.js`.

| Id | Reuse | Boundary |
|---|---|---|
| D4-176 | Hodge decomposition; full decomposition preserves information and orthogonality | Stated for differential forms on a closed Riemannian manifold; finite cochains need a separate specialization |
| D4-105 | Discrete exterior derivative, with successive coboundaries composing to zero | Supplies the cochain operators, rather than their orthogonal splitting |
| D4-108 | Discrete graph Laplace operator | Its displayed formula uses adjacency minus degree, the negative of the positive-semidefinite convention in the Mathlib link below |
| D4-063 | Cocycle condition | Closed cochains remain distinct from their classes modulo exact cochains |
| D7-216 | Cochain complex construction | Existing `CochainComplex` link is infrastructure |
| D7-218 | Coboundary application | The adjoint requires a chosen inner product |
| D7-220 | Cohomology extraction | Harmonic representatives require the additional inner-product splitting |

**Read:** searches over entry names, descriptions, inputs and outputs found no potential-game, harmonic-game or cyclic-game entry. The equilibrium-related implementation entry concerns implementing a social choice correspondence; it does not supply a finite-game decomposition. Searches also covered the landed source and fill files. Reuse the listed entries rather than duplicating their general content.

## Verified mathematical source objects

**Read:** [Flows and Decompositions of Games: Harmonic and Potential Games](https://arxiv.org/abs/1005.2405), 2011 journal reference, DOI `10.1287/moor.1110.0500`; arXiv v2, Sections 3, 4 and 6, especially Theorem 4.1 and Theorem 6.1. [Statistical ranking and combinatorial Hodge theory](https://arxiv.org/abs/0811.1067), 2011 journal reference, DOI `10.1007/s10107-010-0419-x`; arXiv v2, Theorems 4.7 and 4.8.

Let A be the finite product of the players' nonempty action sets. Vertices are profiles. Edges connect profiles differing in one player's action. Put a triangle on every 3-clique. Let B be the vertex-to-edge coboundary, C the edge-to-triangle coboundary, and D the map from payoff tensors to unilateral payoff differences. With consistent orientations, CB = 0 and CD = 0. The latter identity follows by telescoping one player's payoffs around every triangle.

**Inferred, algebraic restatement:** write x = Du, let phi be the zero-mean least-squares solution of B phi approximating x, and let D+ denote the inverse on the own-action-centered payoff subspace. Then

```text
xP = B phi
xH = x - xP
uP = D+ xP
uH = D+ xH
uN = u - uP - uH
```

The three payoff components are unique when uP and uH are centered over every player's own actions at fixed opponents. Orthogonality uses the payoff inner product `sum_i |A_i| sum_a u_i(a) v_i(a)`. On edge cochains the general splitting is exact plus harmonic plus coexact. For game flows the coexact component is zero; the third payoff component is ker D, which maps to zero flow. It is therefore mathematically incorrect to identify the nonstrategic payoff component with a nonzero coexact flow.

**Inferred:** the profile graph is connected for every such fixed action product. Its H^0 has rank one, regardless of how many equilibria a particular payoff tensor has. Equilibrium-set topology is a further computation on the reconstructed game. The full decomposition retains the original game by summing its components; a single projection discards components, consistently with D4-176's corrected broken field.

## Generation record: proposed intake records

**Generation:** these candidates index existing theorems and constructions. Their contribution is typed coverage in this map. Their mathematical novelty is not claimed. Seeds are the two verified papers and D4-176, D4-105, D4-108, D7-216, D7-218 and D7-220. Against the obvious: use finite linear algebra and existing cochain infrastructure; keep flow splitting separate from the payoff-map kernel. The user commissioned literature verification before these intake proposals.

The following JSON uses the addition record's fields. `receipts` is empty deliberately: source pointers above are reading evidence, and admission still requires the repository's verbatim-window receipts. The `requestedBy` field records a mathematical coverage need without private provenance. Candidate ids were unused at the inspected commit; intake must recheck allocation. All candidates remain **generated proposals**, with no promoted map tier. D7-X28 and D7-X29 project onto the normalized summands P and H. The preceding note's D7-X25 and D7-X26 instead retain the nonstrategic summand and project onto the full potential-game class P + N and harmonic-game class H + N. These outputs differ and should keep distinct operation contracts.

```json
[
  {
    "id": "D4-X03",
    "name": "Finite cochain Hodge decomposition",
    "kind": "Transformer",
    "tags": ["decomposition", "spectral", "topology-bridge"],
    "description": "For finite-dimensional real inner-product cochain spaces with d1 d0 = 0, decomposes each middle cochain into im d0, ker d1 intersect ker d0*, and im d1*. The middle summand is the kernel of d0 d0* + d1* d1.",
    "input": "Finite-dimensional real inner-product spaces C0, C1, C2 and linear maps d0, d1 satisfying d1 d0 = 0",
    "output": "Unique mutually orthogonal exact, harmonic and coexact cochains summing to the input",
    "preserved": "Entire input by addition; linearity; squared norm as the sum of component squared norms; cohomology classes via harmonic representatives",
    "broken": "None for the full decomposition; a projection onto one summand discards the others",
    "complexity": "Polynomial in explicitly represented matrix dimensions; dense linear algebra gives a cubic upper bound in the total coordinate dimension",
    "requestedBy": "Finite cochain and game-flow coverage",
    "receipts": []
  },
  {
    "id": "D7-X23",
    "name": "Unilateral payoff-difference flow representation",
    "kind": "Transformer",
    "tags": ["representation-change", "algebra-bridge"],
    "description": "Maps a finite normal-form payoff tensor to a profile-graph edge flow. An edge changing player i from a to b carries u_i(b) - u_i(a). All triangle sums vanish.",
    "input": "Finite nonempty player and action sets, real payoff functions on their product",
    "output": "Triangle-closed edge cochain Du on the unilateral-deviation graph",
    "preserved": "Unilateral payoff differences and therefore pure and mixed Nash equilibria",
    "broken": "Opponent-dependent additive payoff levels; absolute and interpersonal payoff comparisons",
    "complexity": "O(E) evaluations of explicitly represented payoffs, where E is the number of unoriented deviation edges",
    "requestedBy": "Finite cochain and game-flow coverage",
    "receipts": []
  },
  {
    "id": "D7-X27",
    "name": "Own-action normalization of a finite game",
    "kind": "Transformer",
    "tags": ["decomposition", "projection"],
    "description": "Averages each player's payoff over that player's actions at fixed opponents to obtain uN. The centered remainder u - uN has the same unilateral differences. The nonstrategic subspace consists exactly of payoffs independent of each player's own action.",
    "input": "Finite real payoff tensor u with nonempty action sets",
    "output": "Centered payoff tensor u - uN and nonstrategic tensor uN in ker D",
    "preserved": "Entire payoff tensor by adding both outputs; the centered output preserves unilateral differences and pure and mixed Nash equilibria",
    "broken": "The centered output alone discards opponent-dependent payoff levels and can change payoff efficiency comparisons",
    "complexity": "O(n N), where n is player count and N is profile count",
    "requestedBy": "Finite cochain and game-flow coverage",
    "receipts": []
  },
  {
    "id": "D7-X28",
    "name": "Normalized potential-game projection",
    "kind": "Transformer",
    "tags": ["projection", "decomposition"],
    "description": "Projects Du onto im B by least squares and lifts the resulting gradient to the unique own-action-centered payoff tensor uP. A normalized potential game has DuP = B phi for a single profile potential phi.",
    "input": "Finite real payoff tensor u, its deviation maps D and B, standard edge inner product, and own-action centering",
    "output": "Normalized potential component uP with shared unilateral potential phi; phi is fixed by zero mean",
    "preserved": "Potential component; linearity and idempotence; orthogonality to the discarded components in the weighted payoff inner product",
    "broken": "Harmonic and nonstrategic payoff components; equilibria of the original game need not survive projection",
    "complexity": "Polynomial in the explicitly represented profile and edge counts",
    "requestedBy": "Finite cochain and game-flow coverage",
    "receipts": []
  },
  {
    "id": "D7-X29",
    "name": "Normalized harmonic-game projection",
    "kind": "Transformer",
    "tags": ["projection", "decomposition", "topology-bridge"],
    "description": "Removes the gradient part of Du and lifts the residual to its unique own-action-centered payoff tensor uH. The resulting flow satisfies C DuH = 0 and B* DuH = 0 on the profile complex.",
    "input": "Finite real payoff tensor u, profile complex, standard edge inner product, and own-action centering",
    "output": "Normalized harmonic component uH and its divergence-free, triangle-closed deviation flow",
    "preserved": "Harmonic component; linearity and idempotence; orthogonality to the discarded components in the weighted payoff inner product",
    "broken": "Potential and nonstrategic payoff components; equilibria of the original game need not survive projection",
    "complexity": "Polynomial in the explicitly represented profile and edge counts",
    "requestedBy": "Finite cochain and game-flow coverage",
    "receipts": []
  },
  {
    "id": "D7-X24",
    "name": "Canonical finite-game direct-sum decomposition",
    "kind": "Transformer",
    "tags": ["decomposition", "algebra-bridge"],
    "description": "Combines the payoff-difference representation, finite cochain splitting and own-action normalization to write each finite real game uniquely as normalized potential plus normalized harmonic plus nonstrategic components.",
    "input": "Finite real payoff tensor u on fixed nonempty action sets, standard edge inner product and own-action centering",
    "output": "Ordered triple (uP, uH, uN), with u = uP + uH + uN, DuP in im B, B* DuH = 0 and DuN = 0",
    "preserved": "Entire payoff tensor by addition; uniqueness; linearity; pairwise orthogonality for inner(u,v) = sum_i |A_i| sum_a u_i(a) v_i(a)",
    "broken": "None for the full triple; each projection separately discards the other components",
    "complexity": "Polynomial in the explicitly represented payoff-table size; profile count grows as the product of action-set sizes",
    "requestedBy": "Finite cochain and game-flow coverage",
    "receipts": []
  }
]
```

## Formal-link proposals at the repository pin

**Read:** source files at Mathlib `380f2aafb622cb2c1c93dac545b6389083c68c51`. These are proposed `formal.js` rows, using its `entry`, `field`, `decl`, `file`, `match`, and `note` vocabulary. The exact claims below are limited to their stated scope. None proves the complete finite-game theorem.

| Entry | Field | Declaration | File under Mathlib/ | Match | Note |
|---|---|---|---|---|---|
| D4-108 | description | `SimpleGraph.lapMatrix_mulVec_apply'` | `Combinatorics/SimpleGraph/LapMatrix.lean` | related | Exact unweighted positive-semidefinite formula; the map's displayed operator has the opposite sign |
| D4-X03 | description | `LinearMap.adjoint` | `Analysis/InnerProductSpace/Adjoint.lean` | ingredient | Finite-dimensional adjoint |
| D4-X03 | output | `Submodule.exists_add_mem_mem_orthogonal` | `Analysis/InnerProductSpace/Projection/Basic.lean` | ingredient | Orthogonal splitting by one subspace; two compatible splittings yield the three summands |
| D4-X03 | output | `ContinuousLinearMap.orthogonal_range` | `Analysis/InnerProductSpace/Adjoint.lean` | ingredient | Orthogonal complement of range is kernel of adjoint |
| D7-X28 | output | `Submodule.orthogonalProjectionOnto` | `Analysis/InnerProductSpace/Projection/Basic.lean` | ingredient | Supplies edge-flow projection; game-specific lift and normalization remain to prove |
| D7-X29 | output | `ContinuousLinearMap.orthogonal_range` | `Analysis/InnerProductSpace/Adjoint.lean` | ingredient | Turns orthogonal residual into zero adjoint divergence |

Existing `CochainComplex` and `HomologicalComplex.d_comp_d` are reusable through D7-216; duplicate links are unnecessary. Also read: `SimpleGraph.card_connectedComponent_eq_finrank_ker_toLin'_lapMatrix`, in `Combinatorics/SimpleGraph/LapMatrix.lean`, gives the degree-zero connected-component count for a finite simple graph. It is an optional ingredient for a future graph-component extraction entry, rather than a proof of a game decomposition.

## Intake checks and reopening conditions

**Inferred:** promote D4-X03 only after verifying its finite-dimensional hypotheses, the adjoint convention and a cohomology-representative proof. Promote the game records only after receipting normalization and the weighted inner product as well as the decomposition statement. A per-player positive rescaling can change the canonical projections, so keep the metric and normalization explicit. The numerical implementation of a matrix pseudoinverse is an algorithmic reading, distinct from a formally checked theorem.

**Generation handoff:** allocate ids at intake, extract source windows under the receipts contract, grade the proposed records, and fold in or decline each. Earliest failure is a type mismatch between payoff tensors and edge cochains, or a missing normalization that destroys uniqueness. A full existing finite-cochain entry discovered during intake would replace D4-X03 with reuse. A complete existing game-decomposition formalization would replace the ingredient-only links with verified theorem links.
