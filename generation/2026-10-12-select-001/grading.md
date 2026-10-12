# Grading: SELECT-001, does the conflict select from a real menu?

Date 2026-10-12. Pre-registered at Math_Map `27e6266` (`preregistration.md`, committed and pushed alone, before any computation). `node scripts/deform-select.mjs --round --explore` regenerates `stages.md` in about two minutes. Evidence marks: **read** (computed and reproducible by that command, or seen in the source), **inferred**, **recalled**, **unknown**. Verdicts: confirmed, marginal, plausible, needs refinement, dead.

## 1. The stages

| Row | Stage | Distinct in menu | Survivors | Successor rank | False positives | Live-decoy rate | Grade |
|---|---|---|---|---|---|---|---|
| S1 Galilei, 3 + 1 | 1, relativity (1904) | 12 | 3 | 1 | 2 | 0.030 | marginal |
| S1 | 2, Lambda > 0 (1998), stage 1 held | 12 | 1 | 1 | 0 | 0.226 | confirmed |
| S2 static, 3 + 1 | 1, relativity | 16 | 10 | 8 (tie 2) | 9 | 0.012 | plausible |
| S2 | 2, Lambda > 0, stage 1 held | 16 | 2 | absent | 2 | 0.000 | out of menu |
| S3 Galilei, 2 + 1 | A, relativity | 26 | 3 | 1 | 2 | 0.027 | marginal |
| S3 | B, the Schrodinger phase factor | 26 | 2 | 1 | 1 | 0/2 live | confirmed |

All **read**, `stages.md`. **Pattern, by the pre-registered rule: marginal** (five qualifying stages: two confirmed, two marginal, one plausible, none dead).

## 2. What held

**Relativity selects a family; the lowest order picks its member.** In 3 + 1 (a menu of 12) and in 2 + 1 (a menu of 26), the invariant Lorentzian form on {H, P} leaves the same three algebras: the flat one (Poincare) and the two curved ones (de Sitter and anti-de Sitter in 3 + 1; their 2 + 1 counterparts, Killing +3 -3 and +4 -2). The constraint is informative, since about 3 percent of live decoys of the same form do as well. It does not choose inside the family; the ranking does, because the flat algebra is a first-order deformation and the curved ones second-order. Held cumulatively (S1), the 1998 conflict then leaves de Sitter alone. Read as history, physics took the lowest-order step the conflict in hand allowed, and the curvature came with a later conflict. HISTORY-001 inferred this from two rows; it now holds in two dimensions and cumulatively (**inferred**, the reading; the stages are **read**).

**S3's menu is the largest yet, and invariant and full H^2 agree there.** Galilei in 2 + 1 has H^2(g; g) = 8, invariant and full alike, so the abelian rotations cost nothing for this algebra. The pre-registration flagged that risk; it did not occur (**read**).

## 3. What failed, and why

**S2 stage 1: the encoding, not the menu.** From the static algebra, the zero deformation, the static algebra itself, passes F1 at rank 1. Its boosts act as zero on {H, P}, and every form is invariant under zero. F1 asks for an invariant Lorentzian form; it never asks that the boosts move anything. The Galilei rows hid this because Galilean boosts already act. Poincare is in the menu at rank 8 of 10. Grade plausible, by the rule.

**S2 stage 2: the generator's reach.** De Sitter is not among the static algebra's candidates. With 9 classes, the grid allows at most two nonzero coefficients, and de Sitter is further from the static algebra than that. A menu built by iterating (static, then each survivor's own deformations) would reach it. That was not pre-registered.

## 4. Exploratory, post hoc: the static menu with mixing required

Not pre-registered and not graded. Adding to F1 that some boost has a nonzero bracket with H or P landing in {H, P} (the Lorentz transformations mix t and x, and preserve the interval: both 1904) leaves **Poincare alone from all 16 algebras**, with a live-decoy rate of 4/290 = 0.014 for decoys of the same refined form (**read**, `stages.md`). It skips Galilei: one conflict, stated in full, picks Poincare from the whole menu of kinematics.

It is weaker than it looks. "A Lorentzian form preserved by boosts that mix time and space" is close to the definition of how the Lorentz group acts. This is HISTORY-001's leakage gap again: a constraint stated in the old vocabulary that is the new structure. It shows the 1904 constraint was sufficient. It does not show the generator found anything the constraint did not already say. It also needs its own pre-registered round before anything rests on it.

## 5. The 2 + 1 central extensions

The invariant H^2(g; R) of Galilei in 2 + 1 is 3: [K_i, P_i] (the mass), [K1, K2] (the exotic term) and [J, H] (**read**). The pre-registration's recall, two extensions, was incomplete. F3 leaves two algebras. The successor, the Bargmann algebra, comes first, and its fingerprint also covers mass with the exotic term. The two are isomorphic when the mass is nonzero: K_i to K_i + a eps_ij P_j removes the exotic term at a = kappa / 2m without touching the other brackets (**inferred**, worked by hand; consistent with the fingerprint, which cannot prove it). The other survivor adds a central [J, H]. The decoy control is again nearly vacuous (2 live of 9), as in HISTORY-001's central rows. Confirmed by the rule; thin.

## 6. Deviations from the pre-registration

1. The `--explore` diagnostic (section 4) was written after the stages were seen. It is reported, never graded, and its constraint is not a pre-registered form.
2. `scripts/deform-history.mjs` gained three `export` keywords (`outcome`, `decoySpace`, `drawDecoys`); its round regenerates `generation/2026-10-11-history-001/rows.md` byte for byte after the change (**read**).
3. The pre-registration expected "mass alone and mass with the exotic term" as F3's survivors; the fingerprint grouped them as one algebra, and section 5 says why that is right.

## 7. Verdicts

| Claim | Verdict |
|---|---|
| the conflict selects the successor alone from a real menu | **marginal**: alone in 2 of 5 qualifying stages; a family of 3 in two; fails on the static menu by encoding |
| relativity selects the family {flat, de Sitter, anti-de Sitter} | **confirmed**: menus of 12 and 26, two dimensions, live-decoy rates near 0.03 |
| history took the lowest-order step the conflict allowed | **plausible**: holds on every stage where it can be read (S1 1 and 2, S3 A); a ranking rule fitted to history, not derived |
| F1 as encoded captures the 1904 conflict | **needs refinement**: vacuous where boosts act as zero |
| the static menu reaches today's kinematics in one step | **dead** for the grid as defined: de Sitter is out of menu |
| the pattern as pre-registered | **marginal** |

## 8. What this means for the quantum gravity test (generation)

Two rounds now say the selecting power sits in how the conflict is encoded, and the encoding that selects best is the one closest to the successor's own definition. For a retrodiction that is a leak. For quantum gravity the successor is unknown, so the constraints can be written only from quantum mechanics and general relativity as they stand: no successor to leak, and nothing to tune the encoding against. The cost is the other side of the same fact. No row can be checked, so the encoding has to be fixed and pre-registered before the seed's menu is computed, and the lowest-order ranking is a fitted rule to report beside the survivors, never a verdict.

## 9. Next

- **SELECT-002, pre-registered:** F1 with mixing as a new form, F5, run with decoys on the static menu and on every menu here, so section 4 either holds or dies on its own round.
- **Iterated menus:** the static algebra's survivors' own deformations, to reach de Sitter and test whether the chain static, Galilei, Poincare, de Sitter is the lowest-order path that the conflicts in historical order allow.
- **The quantum gravity form,** once the encodings are fixed: section 8 says why the order matters.
