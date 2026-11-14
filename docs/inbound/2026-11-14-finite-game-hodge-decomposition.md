# Inbound, 2026-11-14: the Hodge decomposition of finite games, six proposed entries and Mathlib leads

A proposal, not a change: verify, then fold in or decline, and say which. Sent at the operator's request (2026-11-14) from the sibling repository this branch is named for, where two papers were read against the map. Read against Math_Map `c6f8381` and Mathlib `380f2aa` (the map's own pin). Facts carry their mark; everything under a proposal is generation. Nothing in `mapfill/`, `excerpts/` or `catalogue/` is touched by this note.

## 1. The sources, as read

Both PDFs were fetched from arXiv on 2026-11-14 and read at the statements quoted (read). Text was extracted with pypdf; every quote in section 3 was checked to occur verbatim, on one line, in that extraction. pypdf keeps ligatures and drops some spaces ("gamesGM,E" is "games G_{M,E}").

| Source | Identifiers | SHA-256 of the PDF as fetched |
|---|---|---|
| Ozan Candogan, Ishai Menache, Asuman Ozdaglar, Pablo A. Parrilo, Flows and Decompositions of Games: Harmonic and Potential Games | arXiv:1005.2405v2 (2010); Mathematics of Operations Research 36(3), 474-503 (2011), doi:10.1287/moor.1110.0500 | `f2ea389d6b67c84b04a8ad3ce6a020da1cbb6dd9aaf01ca1ea83a4d0dee776f2` |
| Xiaoye Jiang, Lek-Heng Lim, Yuan Yao, Yinyu Ye, Statistical ranking and combinatorial Hodge theory | arXiv:0811.1067v2 (2009); Mathematical Programming 127(1), 203-244 (2011), doi:10.1007/s10107-010-0419-x | `c5b987c8233c88589f576e182714a008fa6afe91056538670ab5ccd5cfc9a57b` |

Theorem numbers below are those of the arXiv versions named; the journal versions were not opened, so their numbering is unknown.

## 2. Existing entries this rests on

Searched with `node scripts/mathmap.mjs --text` for: Hodge, Helmholtz, Laplacian, cochain, coboundary, clique, harmonic, potential game, Nash, game, zero-sum, equilibri, replicator, pseudoinverse, Betti, persistent (read, at `c6f8381`).

| Entry | Bearing |
|---|---|
| D4-176 Hodge decomposition | The smooth statement on a closed Riemannian manifold. The finite statement below is its counterpart on a finite complex and needs no analysis. |
| D4-105 Discrete exterior derivative | The coboundary the finite decomposition is built from. |
| D4-064 Codifferential operation | Its adjoint; on a finite complex the adjoint under the chosen inner products. |
| D4-108 Discrete Laplace operator | The degree-0 Laplacian. The game decomposition's potential function is a pseudoinverse of this operator applied to a divergence. |
| D4-058 Clique complex construction | The paper's 2-cells are the 3-cliques of the game graph. |
| D7-216, D7-218, D7-220 Cochain complex, coboundary, cohomology | The harmonic space represents the first cohomology of the complex. |
| D4-295 Persistent Hodge Laplacian | The same Laplacian in a filtered setting; not used. |
| D7-X05 Nash implementation (Maskin) | The one entry naming Nash equilibrium. `lean/MathMap/Implementation.lean` defines `Mechanism.IsNash` for mechanisms; no entry defines a finite game in strategic form. |

No entry was found for: the finite (combinatorial) Hodge or Helmholtz decomposition, a game in strategic form and its Nash equilibria, potential games, harmonic games, zero-sum games, or a pseudoinverse (searched as above; an absence from text search, by one reader).

## 3. Proposed additions

In the form of `mapfill/additions.js`. Ids are suggestions (the next free in each series at `c6f8381`). Each receipt names the source of section 1 and a window checked against its pypdf text; the excerpt files do not exist yet and would be made here in the usual way. Kinds and tags are from the vocabulary in use; grading is the map's.

```js
{ id: "D4-X03", name: "Combinatorial Hodge decomposition of cochains", kind: "Transformer", tags: ["decomposition", "spectral"],
  description: "On a finite simplicial complex with real coefficients and an inner product on each cochain space, the k-cochains split orthogonally as im(d_{k-1}) + ker(Laplacian_k) + im(d_k^*), with ker(Laplacian_k) = ker(d_k) meet ker(d_{k-1}^*). For k = 1 on a graph with its triangles (the Helmholtz decomposition) an edge flow is the sum of a gradient flow, a harmonic flow (curl-free and divergence-free) and a curl flow. The finite counterpart of D4-176: linear algebra, no analysis.",
  input: "Finite simplicial complex (for k = 1: a graph with a chosen set of triangles), inner products on cochains, a k-cochain",
  output: "Three orthogonal components: exact (gradient), harmonic, coexact (curl)",
  preserved: "The cochain (it is the sum of its parts); orthogonality; cohomology, by harmonic representatives: the harmonic space has the dimension of the k-th Betti number",
  broken: "Nothing: an isomorphism onto the direct sum. Which cyclic flows are harmonic and which are curl is fixed by the 2-cells of the complex, not by the graph",
  complexity: "Linear least squares (two orthogonal projections)",
  receipts: [
    { file: "excerpts/arxiv-0811.1067.txt", quote: "Theorem 4.7 (Hodge Decomposition Theorem) . Ck(K, R) admits an orthogonal" },
    { file: "excerpts/arxiv-0811.1067.txt", quote: "G, i.e. C1(KG, R), admits an orthogonal decomposition" },
    { file: "excerpts/arxiv-0811.1067.txt", quote: "curl-free and divergence-free. Figure 4.3 illustrates (20)." },
    { file: "excerpts/arxiv-0811.1067.txt", quote: "By Lemma 4.6, the dimension of ker(∆1) is equal to the ﬁrst Betti numberβ1(K)" },
    { file: "excerpts/arxiv-0811.1067.txt", quote: "nent exists is dependent on the topology of the clique complex K3" },
    { file: "excerpts/arxiv-0811.1067.txt", quote: "via a linear least squares regression. We also investigated the l1-projection of" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Theorem 3.1 (Helmholtz Decomposition). The vector space of edge ﬂowsC1 admits an orthogonal" },
  ] },

{ id: "D7-X23", name: "Pairwise comparison flow of a finite game", kind: "Transformer", tags: ["representation-change", "projection"],
  description: "Sends a finite game in strategic form to an edge flow on its game graph: the vertices are the strategy profiles, an edge joins two profiles that differ in one player's strategy, and the flow along it is that player's utility difference. The map D from games to flows is linear. Games with the same flow have the same Nash equilibria (strategic equivalence). The flow of a game is curl-free on the graph's 3-cliques.",
  input: "Finite game: players, a finite strategy set for each, a real utility for each player on the strategy profiles",
  output: "Edge flow X = Du on the game graph",
  preserved: "Utility differences under unilateral deviation, hence the set of Nash equilibria",
  broken: "The kernel of D (the nonstrategic component): payoff levels, and with them efficiency properties such as Pareto optimality",
  complexity: "Linear in the number of edges of the game graph",
  receipts: [
    { file: "excerpts/arxiv-1005.2405.txt", quote: "strictly less information than the original description of the game in terms of utility functions, all" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "relevant strategic aspects (e.g., equilibria) are captured." },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "games have the same equilibrium set. We refer to such games as strategically equivalent. We nor-" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "This result also implies that δ1D = 0, i.e., the pairwise comparisons of games belong to ker δ1." },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "game. Thus, the nonstrategic component has no eﬀect whatsoever on the equilibrium properties" },
  ] },

{ id: "D7-X24", name: "Potential, harmonic and nonstrategic decomposition of a finite game", kind: "Transformer", tags: ["decomposition"],
  description: "The space of games with fixed players and strategy sets is the direct sum P + H + N: P the normalized games whose flow is a gradient, H the normalized games whose flow is divergence-free, N the kernel of D. It is the Helmholtz decomposition of edge flows (D4-X03) pulled back through the flow map D (D7-X23); the curl part is zero for games. With d0 the graph gradient and + the pseudoinverse: u_P = D^+ d0 d0^+ D u, u_H = D^+ (I - d0 d0^+) D u, u_N = (I - D^+ D) u, and the potential is phi = d0^+ D u. The potential games are exactly P + N; the harmonic games are H + N.",
  input: "Finite game in strategic form",
  output: "Its potential, harmonic and nonstrategic components, and the potential function of the first",
  preserved: "The game (it is the sum of its components, uniquely); orthogonality of the three subspaces under the inner product weighted by strategy counts; the Nash equilibria, which depend on P + H alone",
  broken: "Nothing: an isomorphism onto the direct sum. Equilibrium properties belong to components and fail for sums: a potential game has a pure Nash equilibrium, a harmonic game generically has none and always has the uniformly mixed one",
  complexity: "One pseudoinverse of the game graph's Laplacian",
  receipts: [
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Theorem 4.1. The space of gamesGM,E is a direct sum of the potential, harmonic and nonstrategic" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "in terms of utility functions (as opposed to preferences) does not exhibit local cycles, therefore the" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "the direct sum property implies that the decomposition is canonical, i.e., it is independent of the" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "harmonic and nonstrategic subspaces are orthogonal." },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Theorem 5.1. The set of potential games is equal to the subspace P⊕N ." },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "2. G has a pure Nash equilibrium." },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Proposition 5.1. Harmonic games generically do not have pure Nash equilibria." },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Theorem 5.4. In harmonic games, the uniformly mixed strategy proﬁle is always a Nash equilib-" },
  ] },

{ id: "D7-X25", name: "Projection of a finite game onto the potential games", kind: "Transformer", tags: ["projection"],
  description: "Replaces a game by its closest potential game in the norm weighted by strategy counts: player m's utility becomes Pi_m phi + (I - Pi_m) u^m, with phi the potential of D7-X24 and Pi_m the projection that normalizes player m's utility. The harmonic component is removed and the other two kept. An approximate equilibrium of the projection is an approximate equilibrium of the game, with the loss bounded through the distance between them.",
  input: "Finite game in strategic form",
  output: "The closest potential game, and its distance from the input",
  preserved: "The potential and nonstrategic components; approximate equilibria, up to a bound in the distance",
  broken: "The harmonic component",
  complexity: "As D7-X24",
  receipts: [
    { file: "excerpts/arxiv-1005.2405.txt", quote: "1. The closest potential game to G has utilities Πmφ + (I− Πm)um for all m∈M," },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Theorem 6.3. LetG be a game, and ˆG be its closest potential game. Assume that hm denotes the" },
  ] },

{ id: "D7-X26", name: "Projection of a finite game onto the harmonic games", kind: "Transformer", tags: ["projection"],
  description: "Replaces a game by its closest harmonic game in the same norm: player m's utility becomes u^m - Pi_m phi. The potential component is removed and the other two kept. The result is a harmonic game: the uniformly mixed strategy profile is a Nash equilibrium of it, and harmonic games generically have no pure one.",
  input: "Finite game in strategic form",
  output: "The closest harmonic game",
  preserved: "The harmonic and nonstrategic components",
  broken: "The potential component, and with it the guarantee of a pure Nash equilibrium",
  complexity: "As D7-X24",
  receipts: [
    { file: "excerpts/arxiv-1005.2405.txt", quote: "2. The closest harmonic game to G has utilities um− Πmφ for all m∈M." },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Theorem 5.4. In harmonic games, the uniformly mixed strategy proﬁle is always a Nash equilib-" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Proposition 5.1. Harmonic games generically do not have pure Nash equilibria." },
  ] },

{ id: "D7-X27", name: "Normalization of a finite game", kind: "Transformer", tags: ["projection"],
  description: "Replaces a game by the unique strategically equivalent game that is normalized: for each player and each choice of the others' strategies, that player's utilities sum to zero over its own strategies. Player m's utility becomes Pi_m u^m; what is removed is the nonstrategic component. The flow and the equilibria are unchanged. Conversely, the paper states that the nonstrategic component can be chosen, with the other two components fixed, so that the pure Nash equilibria are exactly the Pareto optimal profiles.",
  input: "Finite game in strategic form",
  output: "The normalized game with the same pairwise comparison flow",
  preserved: "The flow of D7-X23, hence the Nash equilibria and the potential and harmonic components",
  broken: "The nonstrategic component: payoff levels and efficiency comparisons between profiles",
  complexity: "Linear in the size of the game",
  receipts: [
    { file: "excerpts/arxiv-1005.2405.txt", quote: "Lemma 4.6. LetG be a game with utilities {um}m∈M. Then there exists a unique game ˆG which" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "(i) has the same pairwise comparison function as G and (ii) is normalized. Moreover the utilities" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "such that (i) the potential and harmonic components of ¯G are identical to these of G and (ii) in ¯G" },
    { file: "excerpts/arxiv-1005.2405.txt", quote: "the set of pure NE coincides with the set of Pareto optimal strategy proﬁles." },
  ] },
```

Two claims in these fields are inferred and carry no receipt; drop them if they cannot be receipted here: D4-X03's remark that it needs no analysis, and D7-X24's complexity line (the paper says only that the Laplacian's pseudoinverse is cheaper than the gradient's).

One quoted statement needs a hypothesis the quote does not show (inferred): D7-X27's last sentence is the paper's Theorem 5.9 as stated in the arXiv version. A finite game always has a Pareto optimal profile, so the statement can hold only for a game with a pure Nash equilibrium; the proof was not read closely enough to say where that enters. A candidate for `mapfill/conditions.js` if the entry lands.

## 4. A computed check, and one finding about the 2-cells

The formulas of D7-X24 were implemented in numpy in the sending repository and checked against the paper's own worked examples (computed, 16 of 16 checks pass): Table 2 (generalized Rock-Paper-Scissors, all three component tables), equation (31) on a random normalized 4 by 4 bimatrix game, the dimensions of Proposition 4.1 for strategy counts (2,2), (3,3), (2,3), (2,2,2) and (2,3,2) (for example (8, 4, 6) for two players with three strategies each), orthogonality under the weighted inner product on random games (largest inner product 2.2e-14), Theorem 5.5, and the edge flows of Figure 1.

**Finding (computed and inferred).** The harmonic part of a game's flow is harmonic relative to a choice of 2-cells. With the paper's 2-cells (the 3-cliques, which are triangles inside one player's strategy set) every cyclic part of a game flow is harmonic and the curl part is zero, as equation (25) states. If the squares in which two players each switch between two strategies are added as 2-cells, the complex is the 2-skeleton of a product of simplices, its first Betti number is 0 (computed for the seven games tested; inferred in general, since a product of simplices is contractible), and the same cyclic part is all curl. Matching Pennies, squared flow norm 16: (gradient, curl, harmonic) = (0, 0, 16) with triangles only and (0, 16, 0) with squares added. The gradient part is the same under both. This is why D4-X03's broken field says the split is fixed by the 2-cells; the receipt for the general statement is the Betti number window.

## 5. Mathlib leads, at `380f2aa`

Read at the declaration in a checkout of the pin (read). These are leads for `mapfill/formal.js`, with a suggested grade; none is a link until `scripts/formal.mjs` excerpts it.

| Entry | Field | Declaration | File | Suggested grade and note |
|---|---|---|---|---|
| D4-108 | description | `SimpleGraph.lapMatrix`, `SimpleGraph.lapMatrix_mulVec_apply'` | `Mathlib/Combinatorics/SimpleGraph/LapMatrix.lean` | special: unweighted simple graphs, and the opposite sign. Mathlib: (L f)(v) is the sum over neighbors u of f(v) - f(u); the entry writes the sum of w(v,w)(f(w) - f(v)). |
| D4-108 | preserved (harmonic functions) | `SimpleGraph.lapMatrix_mulVec_eq_zero_iff_forall_reachable`, `SimpleGraph.card_connectedComponent_eq_finrank_ker_toLin'_lapMatrix` | same | exact for what a harmonic function is on a finite graph: constant on each connected component; the kernel's dimension is the number of components. |
| D4-108 | preserved (spectral properties) | `SimpleGraph.posSemidef_lapMatrix` | same | related: positive semidefinite. |
| D4-X03 (proposed) | description | `LinearMap.orthogonal_range`, `LinearMap.orthogonal_ker`, `LinearMap.ker_adjoint_comp_self`, `Submodule.isCompl_orthogonal_of_hasOrthogonalProjection` | `Mathlib/Analysis/InnerProductSpace/Adjoint.lean`, `Mathlib/Analysis/InnerProductSpace/Projection/Submodule.lean` | ingredient: for maps with d_k d_{k-1} = 0 between finite-dimensional inner product spaces the decomposition follows from these. The decomposition itself is not stated at the pin. |
| D7-X23 (proposed) | input | `SimpleGraph.boxProd`, `SimpleGraph.Connected.boxProd`, `SimpleGraph.connected_top` | `Mathlib/Combinatorics/SimpleGraph/Prod.lean`, `Mathlib/Combinatorics/SimpleGraph/Connectivity/Connected.lean` | ingredient: the game graph of two players is the box product of two complete graphs (inferred), and its connectedness is the content of the paper's Lemma 4.3. |

Not found at the pin, by file name over the whole tree and by content over `Mathlib/Combinatorics`, `Mathlib/AlgebraicTopology`, `Mathlib/LinearAlgebra`, `Mathlib/Algebra/Homology`, `Mathlib/Analysis/InnerProductSpace` and `Mathlib/Analysis/Matrix` (an absence from a search, by one reader):

- A Hodge or Helmholtz decomposition. The one file named for Hodge is `Mathlib/LinearAlgebra/ExteriorPower/HodgeStar.lean` (the star on exterior powers).
- An oriented incidence or coboundary matrix of a graph. `SimpleGraph.incMatrix` is the unoriented 0/1 matrix.
- Real cochains of a simplicial complex. `Mathlib/AlgebraicTopology/SimplicialComplex/Basic.lean` defines `AbstractSimplicialComplex`; no other file in the searched directories uses it.
- A Moore-Penrose pseudoinverse. `Mathlib/LinearAlgebra/Matrix/NonsingularInverse.lean` says pseudoinverses are not considered there.
- A game in strategic form, a Nash equilibrium or a potential game. There is no game theory directory at the pin.

## 6. A Lean statement, sketched and not compiled

No Lean toolchain was available where this was written, so the statement below has never been elaborated; treat every identifier as recalled until it compiles. It states the abstract core of Theorem 4.1 without a pseudoinverse or a graph: for linear maps D and d into one finite-dimensional inner product space with range d inside range D, the domain of D is the internal direct sum of three subspaces.

```lean
theorem decomposition_of_range_le
    {U X C : Type*}
    [NormedAddCommGroup U] [InnerProductSpace ℝ U] [FiniteDimensional ℝ U]
    [NormedAddCommGroup X] [InnerProductSpace ℝ X] [FiniteDimensional ℝ X]
    [NormedAddCommGroup C] [InnerProductSpace ℝ C] [FiniteDimensional ℝ C]
    (D : U →ₗ[ℝ] X) (d : C →ₗ[ℝ] X) (h : LinearMap.range d ≤ LinearMap.range D) :
    let P := (LinearMap.ker D)ᗮ ⊓ (LinearMap.range d).comap D
    let H := (LinearMap.ker D)ᗮ ⊓ (LinearMap.ker d.adjoint).comap D
    let N := LinearMap.ker D
    IsCompl P (H ⊔ N) ∧ Disjoint H N := by
  sorry
```

The game layer instantiates it: U is the players' utilities on profiles, X the real functions on triples (profile, player, strategy the player switches to), `D u (p, i, s) = u i (Function.update p i s) - u i p`, and `d φ (p, i, s) = φ (Function.update p i s) - φ p`. The hypothesis holds because d φ is D of the game in which every player's utility is φ. A potential game is then `∃ φ, D u = d φ`, which is the usual definition. Indexing flows by triples avoids orienting edges; each edge is counted in both directions, which scales the inner product on flows by 2 and changes neither subspace (inferred).

Estimated size (inferred, not measured): the statement with definitions, about 40 lines; the proof of the abstract theorem from the declarations in section 5, about 80 to 150 lines; the game instance and Theorem 5.1, about 60 more. The dimension formulas of Proposition 4.1 need the rank of d, which is the connectedness of the game graph through the Laplacian's kernel, and are the larger part: a few hundred lines. The equilibrium theorems (5.2, 5.4) need Nash equilibria of mixed extensions, which Mathlib lacks.

## 7. Catalogue rows

If the additions land, `catalogue/papers.json` gains the two sources of section 1, each read for the statements quoted here and their surrounding text, not cover to cover (the first: abstract, introduction and the quoted statements of sections 2 to 6; the second: abstract and the quoted statements of sections 2, 4 and 5).
