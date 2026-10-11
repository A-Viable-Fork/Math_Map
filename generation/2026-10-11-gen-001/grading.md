# Grading: GEN-001, gap-driven generation, first test

Date 2026-10-11. Evidence marks: **read**, **secondary**, **inferred**, **recalled**, **unknown**.

## 1. The gaps themselves

Read against the map's text (Math_Map at `f748af2`, `map.json`):

| Gap | What it is | Evidence |
|---|---|---|
| spectral-sequence, form, verdict never consumed | **Typing misses.** The consumers are in the map: D7-258 and D7-259 take spectral sequences; D4-064, D4-127 and D4-177 take k-forms; D3-080 and D3-081 take oracle answers. The free pass typed one side of each and not the other ("Page E_r with d_r", "(k+1)-form dω", "oracle answers"), so they never counted as operations. | **read**, `scripts/type-lexicon.mjs --json` |
| surface never produced | **A coarse kind.** D2 blow-ups produce surfaces, typed as variety. | **read** |
| signal, point-cloud, process, equation never produced | **Mathematics the map lacks.** No entry mentions Nyquist or Shannon sampling, delay or Takens embedding, a random walk, a generator of a Markov process, or the Euler-Lagrange equations (0 matches each in names, descriptions, inputs and outputs). | **read** |

So the first output of the method is a defect list: 4 typing misses and coarse kinds to fix in the word list, and 5 standard operations missing from 1,992 entries.

## 2. The candidates

All five candidates are standard mathematics (**recalled**: Nyquist-Shannon sampling; Takens' embedding theorem, 1981; random walks on graphs; the generator of a Feller or Markov semigroup; the Euler-Lagrange equations). As map entries they are real additions; as generation they are rediscoveries, which is what a calibration run should produce.

## 3. The composites

| Composite | Verdict | Evidence |
|---|---|---|
| 1. Sliding-window embedding, then persistence, to measure periodicity | **Rediscovered.** Perea and Harer, "Sliding Windows and Persistence: An Application of Topological Methods to Signal Analysis", Foundations of Computational Mathematics 15(3), 2015 (arXiv 1307.6188), with the SW1PerS method; applied to gene expression in BMC Bioinformatics, 2015. | **secondary** |
| 2. Hitting times of random walks on graphs | **Rediscovered.** Classical (commute times and effective resistance). | **recalled** |
| 3. Euler-Lagrange then discretize, against discretize then discrete Euler-Lagrange | **Rediscovered, and the most telling.** Marsden and West, "Discrete mechanics and variational integrators", Acta Numerica 10 (2001), 357 to 514, DOI 10.1017/S096249290100006X: the variational route gives symplectic schemes (Verlet, RATTLE, symplectic partitioned Runge-Kutta) where a generic discretization of the equations does not. The map's own test for routes that disagree on an invariant points straight at this result. | **secondary** |
| 4. Persistence of sampled stochastic trajectories | **Plausible and probably known** (topological analysis of time series and dynamics is an active field); not searched. | **unknown** |

## 4. Verdict on the method

- **Calibration: 3 of 3 checked composites rediscover known results, one of them deep.** The map's structure aimed the generator at real mathematics, including a structure-preservation theorem found through the disagreeing-routes test.
- **Novelty: none.** Nothing new survived. At about 42 percent of the map typed on both sides, and with the gaps mostly standard material, that is the expected first result, not a kill.
- **The most valuable output was the defect list:** typing misses and missing standard operations. The method improves the map before it discovers anything, and a better map is what later rounds need.
- **What the interest measure must do,** learned here: rank a composite by whether it closes a loop with an invariant disagreement (composite 3 is the model), and discount a composite that only chains textbook steps.

Grade: plausible, needs refinement. The next round needs fuller typing, the five missing operations landed, and gaps that are not standard material.
