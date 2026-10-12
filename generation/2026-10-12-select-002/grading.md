# Grading: SELECT-002, the mixing form and iterated menus

Date 2026-10-12. Pre-registered at Math_Map `1506e45` (`preregistration.md`, committed and pushed alone, before any computation). `node scripts/deform-select2.mjs --round --deviation` regenerates `rows.md` in about two and a half minutes. Evidence marks: **read** (computed and reproducible by that command, or seen in the source), **inferred**, **recalled**. Verdicts: confirmed, marginal, plausible, needs refinement, dead.

## 1. The pre-registration was wrong in a way that matters

The pre-registration says F5 fixes "SELECT-001's post-hoc refinement" as a form, then defines its mixing condition over the families A = {J, K}. SELECT-001's diagnostic took mixing over the boosts K alone. The rotations J already move P within {H, P} in every kinematical algebra, so the condition as registered holds everywhere, and on the static algebra F5 reduces to F1, which the static algebra passes vacuously. The registered form is not the refinement it claims to fix. The graded results below are the registered ones. The intended form appears only as a labelled deviation (section 4), and it is never graded.

## 2. The graded results

| Row | Menu | Survivors | Successor rank | Live-decoy rate | Verdict | Grade |
|---|---|---|---|---|---|---|
| T1 static (replication) | 16 | 10, static first | 8 | 0.014 | fail (below rank 1) | plausible |
| T2 Galilei 3 + 1 | 12 | Poincare, de Sitter, anti-de Sitter | 1 | 0.034 | filter | marginal |
| T3 Galilei 2 + 1 | 26 | Poincare 2 + 1 and its two curved relatives | 1 | 0.033 | filter | marginal |
| T4 Carroll | 6 | Poincare, de Sitter, anti-de Sitter | 1 | 0.078 | filter | marginal |

**F5 over T2 to T4: marginal** by the rule (no pass, no fail, the successor at rank 1 in all three). T1, the replication, fails, for the reason in section 1.

| Path | Route | Verdict |
|---|---|---|
| P1 static, 1904 then 1998 | static (stayed) to H-scales-K | fail |
| P2 Galilei, 1904 then 1998 | Galilei to Poincare to de Sitter | reproduces history |
| P3 static, 1998 then 1904 | static to H-scales-K, then stuck | path dependent |

All **read**, `rows.md`.

## 3. What the rows show

**The family result holds a third time.** From Galilei in two dimensions, and now from Carroll (whose boosts take P to H, the opposite contraction), relativity leaves the same family: flat, de Sitter, anti-de Sitter, with the flat member first. Carroll's menu is under 5, so T4 is not a real menu. Its live-decoy rate (0.078) is the highest of the three, still well under the threshold.

**The 1998 conflict, as encoded, has the same weakness as the 1904 one.** F2 asks that ad H on {P, K} have a positive trace of its square: exponential growth. From the static algebra, the cheapest way to satisfy that is H rescaling the boosts, [K, H] = K. That structure never mixes P and K, so it is not an expanding spacetime. It is the "H as scaling" direction DEFORM-001 found in Galilei's H^2. P1 lands there, and so does P3's first step. F1 was satisfied by boosts doing nothing; F2 is satisfied by H doing the wrong thing. **read** (the algebra's brackets, computed); its reading as unphysical is **inferred**.

**P3 is stuck, and that is partly informative.** With the conflicts reversed, the path reaches H-scales-K, and none of that algebra's 4 distinct deformations satisfies both conflicts, so the path ends. Under this path rule (one move per stage, the class grid as defined), the endpoint depends on the order of the conflicts. That is evidence against the stability reading's strong form, "every path ends at the rigid algebra". It is weak evidence, though: the dead end comes from F2's degenerate satisfier, so P3 cannot separate path dependence in physics from a loose encoding.

## 4. Deviation, post hoc: mixing by the boosts only

Not pre-registered and not graded. With the mixing condition over K, as SELECT-001's diagnostic had it:

- T1: Poincare alone from the 16-algebra static menu, live-decoy rate 8/226 = 0.035 (the decoys now also take mixing over K-like families only, so the rate differs from SELECT-001's 4/290).
- T2 to T4: unchanged, as expected. The family survives, Poincare first.
- P1: static to Poincare to de Sitter, the historical chain. P2 as before. P3 still stuck.

So the intended form does what SELECT-001's diagnostic said, on its own decoys. It remains post hoc twice over, and under the pre-registered leakage judgment it shows sufficiency, not discovery.

## 5. The finding across three rounds: the encoding and leakage trade-off

Every loose encoding has now been satisfied, on a wide menu, by a degenerate structure: boosts acting as zero (F1), rotations doing the mixing (F5 as registered), H rescaling boosts (F2). Each fix tightens the encoding toward what the successor's brackets say, and the tightest fixes are close to the successor's definition: HISTORY-001's leak, from the other side. Wide menus punish loose encodings; tight encodings leak. That is the method's central limit so far (**inferred**, from the failures listed, all **read**).

**A way through that does not use the successor (generation).** Each failure has the same shape: the constraint's property was carried by a bracket that does not connect the families the conflict is about. A generic non-degeneracy rule would catch all three: a constraint naming families must hold on the part of the action that connects distinct families among those named. For F1 and F5, the boosts must act between H and P. For F2, H must act between P and K. The rule is stated in the predecessor's vocabulary, applies to any constraint, and needs no knowledge of the successor. It also has a check of its own: every encoding must fail on the most contracted algebra, where nothing connects anything. Whether the rule removes the degenerate satisfiers without itself leaking is SELECT-003's question.

## 6. Verdicts

| Claim | Verdict |
|---|---|
| F5 as registered selects Poincare | **needs refinement**: the registration let rotations carry the mixing |
| relativity selects the family {flat, de Sitter, anti-de Sitter}, flat first | **confirmed**, now from Galilei (two dimensions) and Carroll |
| iterated lowest-order paths reproduce the historical chain | **marginal**: P2 does; P1 fails as registered, and reproduces only under the post-hoc form |
| the endpoint is independent of the order of conflicts (stability, strong form) | **plausible at best**: P3 is stuck under this path rule, but through a degenerate encoding |
| the generator discovers the successor | **plausible**, capped in advance; nothing here lifts the cap |

## 7. For the quantum gravity test

The non-degeneracy rule, if SELECT-003 confirms it, is what makes the quantum gravity form possible: QM and GR constraints written once, held to a rule that forbids degenerate satisfiers, with no successor to tune them against. Without such a rule, every wide menu will be won by the cheapest structure that technically satisfies the conflict.

## 8. Independence

SELECT-001 and SELECT-002 were designed, run and graded by one session, and section 1 is that session's own error, found by its own replication row. An independent re-run of both rounds is owed before anything rests on them.
