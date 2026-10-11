---
Kind: expression
Author: an agent session, on the operator's commission
Commission: the first test of gap-driven generation (A-Viable-Fork/Research_OS `BLUEPRINT.md`, section 12b): turn the typed map's gaps into typed questions, answer each with a candidate operation, chain the candidates, and grade what comes back
Date: 2026-10-11
---

# Generation: candidates for the typed map's gaps (GEN-001)

## Reaching for

Whether the map's structure can aim generation: each gap from `scripts/gaps.mjs` (Math_Map at `f748af2` plus this round's tool) is a question with typed ends, and each candidate is a map operation that would close it. The generator is the model running this session, so what is measured is that model aimed by the map; a local model on the forge is the later comparison.

## Questions (the gaps)

Kinds no operation produces: signal, point-cloud, process, equation, surface. Kinds no operation consumes: spectral-sequence, verdict, form. No chain reaches process, signal or equation from any other major kind.

## Candidates

| Gap | Candidate operation | Its typed shape |
|---|---|---|
| to signal | Sampling a band-limited function (Nyquist-Shannon) | function to signal; preserves the function when the rate exceeds twice the band |
| to point-cloud | Delay (sliding-window) embedding of a time series (Takens) | signal or sequence to point-cloud; preserves the attractor's topology for a large enough embedding dimension |
| to process | Random walk on a graph | graph to process; its stationary law is degree-proportional on a connected undirected graph |
| to process | Markov process from its generator | operator to process; the semigroup it generates fixes the law |
| to equation | Euler-Lagrange equations of an action | function (a functional) to equation |
| to surface, from spectral-sequence, form, verdict | none: see the grading | |

Composites, each a chain of a candidate with operations already in the map:

1. Signal, delay embedding, Vietoris-Rips complex (D4-416), persistent homology: periodicity of a signal read as a loop in its embedded point cloud.
2. Graph, random walk, first passage (D5-X02): hitting times of a graph as a function.
3. Action, Euler-Lagrange, then finite differences (D8-058), against action, discretize first, then the discrete Euler-Lagrange equations: two routes from an action to a linear system, which the map's own disagreement test would flag if they differ on an invariant (the symplectic structure).
4. Process, sampled trajectories as a point cloud, Vietoris-Rips, persistent homology: the shape of a stochastic system's state space read from its paths.

## Handoff

| Candidate | To | As | What would kill it |
|---|---|---|---|
| All | grading | conjecture | done: see `grading.md` |
