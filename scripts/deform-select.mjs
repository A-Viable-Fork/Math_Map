// Role: the SELECT-001 round. Asks whether the conflicts of physics, applied in historical order as stages,
//   select the historical successor from candidate menus large enough to fail: cumulative selection from
//   Galilei and from the static algebra in 3 + 1 dimensions, and Galilei in 2 + 1 dimensions. Rows, stages,
//   controls and verdict rules are generation/2026-10-12-select-001/preregistration.md, committed first.
// Contract: `node scripts/deform-select.mjs --round [--out FILE]` runs the round and prints (or writes) its
//   report; `--explore` adds the post-hoc diagnostic the grading names (not pre-registered, never graded).
//   Exports ALG3 (the 2 + 1 algebras) and runStage.
// Invariant: read-only on the repository except --out. HISTORY-001's engine unchanged (candidates, the
//   constraint forms, decoys, ranking); a stage's decoys replace only its new constraint, the earlier ones
//   held at their real values. Exact arithmetic throughout.
import { writeFileSync } from "node:fs";
import { algebra, h2, jacobiHolds, fingerprint, CONSTRAINTS, select, family } from "./deform.mjs";
import { ALG, candidates, outcome, decoySpace, drawDecoys } from "./deform-history.mjs";

const check = (g, what) => { if (!jacobiHolds(g)) throw new Error(`${what}: brackets fail Jacobi`); return g; };
// ---------- 2 + 1 dimensions ----------
const N3 = ["J", "K1", "K2", "P1", "P2", "H"];
const ROT3 = [["J", "K1", "K2", 1], ["J", "K2", "K1", -1], ["J", "P1", "P2", 1], ["J", "P2", "P1", -1]];
const GAL3 = [["H", "K1", "P1", 1], ["H", "K2", "P2", 1]];
const REL3 = [["K1", "P1", "H", -1], ["K2", "P2", "H", -1], ["K1", "K2", "J", -1]];
export const ALG3 = {
  galilei3: () => check(algebra(N3, [...ROT3, ...GAL3]), "Galilei 2+1"),
  poincare3: () => check(algebra(N3, [...ROT3, ...GAL3, ...REL3]), "Poincare 2+1"),
  bargmann3: () => check(algebra([...N3, "M"], [...ROT3, ...GAL3, ["K1", "P1", "M", 1], ["K2", "P2", "M", 1]]), "Bargmann 2+1"),
};
const ALL = { ...ALG, ...ALG3 };

const F1_31 = { form: "F1", params: { S: ["H", "P"], A: ["J", "K"], sig: [3, 1] }, what: "relativity: Maxwell's invariance (1904)" };
const F2_POS = { form: "F2", params: { X: "H", S: ["P", "K"], sign: 1 }, what: "the accelerating expansion (1998)" };
const F1_21 = { form: "F1", params: { S: ["H", "P"], A: ["J", "K"], sig: [2, 1] }, what: "relativity in 2 + 1" };
const F3_KP = { form: "F3", params: { A: "K", B: "P" }, what: "the Schrodinger equation's Galilean phase factor" };
export const ROWS = [
  { id: "S1", what: "cumulative selection from Galilei (3 + 1)", pred: "galilei", sym: ["J"], stages: [{ add: F1_31, succ: "poincare", cumulative: true }, { add: F2_POS, succ: "deSitter", cumulative: true }] },
  { id: "S2", what: "the full static menu (3 + 1)", pred: "static", sym: ["J"], stages: [{ add: F1_31, succ: "poincare", cumulative: true }, { add: F2_POS, succ: "deSitter", cumulative: true }] },
  { id: "S3", what: "Galilei in 2 + 1 dimensions", pred: "galilei3", sym: ["J"], stages: [{ add: F1_21, succ: "poincare3", cumulative: false, name: "A" }, { add: F3_KP, succ: "bargmann3", cumulative: false, name: "B" }] },
];

const and = (ps) => (g) => ps.every((p) => p(g));
export function runStage(cs, prior, stage, seed) {
  const succFp = fingerprint(ALL[stage.succ]()), pNew = CONSTRAINTS[stage.add.form](stage.add.params);
  const list = select(cs.cands, and([...prior, pNew])), res = outcome(list, succFp);
  const inMenu = cs.cands.some((c) => c.fp === succFp);
  const g0 = cs.cands[0].alg, { decoys, exhaustive } = drawDecoys(decoySpace(g0, stage.add.form, stage.add.params), seed);
  let live = 0, hits = 0, partial = 0;
  for (const d of decoys) { const p = CONSTRAINTS[stage.add.form](d), o = outcome(select(cs.cands, and([...prior, p])), succFp); if (o.survivors) live++; if (o.hit) hits++; if (p.partial) partial++; }
  return { list, res, inMenu, succFp, decoys: decoys.length, exhaustive, live, hits, partial, pNew };
}
function grade(st, distinct) {
  const real = distinct >= 5, rate = st.live ? st.hits / st.live : 0, s = st.res.succ;
  if (!st.inMenu) return { verdict: "out of menu", grade: "ungraded", rate };
  if (!s) return { verdict: "fail", grade: "dead", rate };
  const verdict = s.rank > 1 ? "fail (below rank 1)" : st.res.alts >= 2 ? "filter, not prediction" : rate >= 0.25 ? "fail (decoys hit)" : "pass";
  let g = 4; const cap = (x) => { g = Math.min(g, x); };
  if (!real) cap(3);
  if (st.res.alts >= 2 && st.res.alts <= 3) cap(3);
  if (rate >= 0.25 && rate < 0.5) cap(3);
  if (s.rank > 1 || st.res.alts >= 4 || rate >= 0.5) cap(2);
  return { verdict, grade: ["", "", "plausible", "marginal", "confirmed"][g], rate };
}
const table = (head, rows) => [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
const rateS = (h, n) => (n ? `${h}/${n} = ${(h / n).toFixed(3)}` : "n/a (none)");
export function runRound() {
  const L = ["# SELECT-001: the stages, computed", "", "Generated by `node scripts/deform-select.mjs --round`. Exact arithmetic; HISTORY-001's engine. Rows, stages, controls and verdict rules are those of `preregistration.md` in this directory, committed before any of this was computed.", ""];
  const summary = [], qual = [];
  let seed = 20261012;
  for (const row of ROWS) {
    const g0 = ALL[row.pred](), cs = candidates(g0, row.sym), distinct = new Set(cs.cands.map((c) => c.fp)).size;
    const fullH2 = row.pred === "galilei3" ? h2(g0) : null, invH2 = row.pred === "galilei3" ? h2(g0, family(g0, "J")) : null;
    L.push(`## ${row.id}: ${row.what}`, "", `Predecessor ${row.pred}; symmetry ${row.sym.join(", ")}. Candidates ${cs.cands.length} (adjoint classes ${cs.adjH2}, central classes ${cs.centralH2}, ${cs.obstructed} grid points obstructed), **${distinct} distinct**: ${distinct >= 5 ? "a real menu" : "under 5, not a real menu"}.${fullH2 ? ` Full H^2(g; g) = ${fullH2.dimH2}; invariant ${invH2.dimH2}.` : ""}`, "");
    const prior = [];
    for (const [k, stage] of row.stages.entries()) {
      const st = runStage(cs, stage.cumulative ? prior : [], stage, seed++), gr = grade(st, distinct);
      const name = stage.name ?? `${k + 1}`;
      L.push(`### Stage ${name}: ${stage.add.what}`, "", `Constraint ${stage.add.form} ${JSON.stringify(stage.add.params)}${stage.cumulative && prior.length ? `, with the earlier stage${prior.length > 1 ? "s" : ""} held` : ""}. Successor ${stage.succ}: ${st.inMenu ? "in the menu" : "**not in the menu**"}.`, "",
        `Survivors (${st.list.length}):`, "", ...(st.list.length ? st.list.map((g) => `- ${g.fp === st.succFp ? "**successor** " : ""}rank ${g.rank}${g.ties ? ` (tied with ${g.ties})` : ""}, key (order ${g.best[0]}, support ${g.best[1]}): ${g.fp} [${g.labels.slice(0, 4).join(" ")}${g.labels.length > 4 ? " ..." : ""}]`) : ["- none"]), "",
        `Decoys (${st.exhaustive ? "the whole space" : "500 drawn"}): ${st.decoys}; live ${st.live}; hits ${st.hits}; live hit rate ${rateS(st.hits, st.live)}${st.partial ? `; ${st.partial} rested on a partial form search` : ""}.`, "",
        `Verdict: **${gr.verdict}**; grade **${gr.grade}**.`, "");
      summary.push([row.id, name, stage.add.what, stage.succ, distinct, st.inMenu ? "yes" : "no", st.list.length, st.res.succ ? `${st.res.succ.rank}${st.res.succ.ties ? ` (tie ${st.res.succ.ties})` : ""}` : "absent", st.res.alts, rateS(st.hits, st.live), gr.verdict, gr.grade]);
      if (distinct >= 5 && st.inMenu) qual.push(gr.grade);
      if (stage.cumulative) prior.push(st.pNew);
    }
  }
  const c = qual.filter((g) => g === "confirmed").length, cm = qual.filter((g) => g === "confirmed" || g === "marginal").length, dead = qual.filter((g) => g === "dead").length;
  const pattern = qual.length < 2 ? "needs refinement" : dead >= 2 ? "dead" : c === qual.length && qual.length >= 3 ? "confirmed" : cm * 2 >= qual.length && dead === 0 ? "marginal" : cm >= 1 || dead === 0 ? "plausible" : "dead";
  L.splice(4, 0, "## Summary", "", table(["row", "stage", "conflict", "successor", "distinct in menu", "in menu", "survivors", "successor rank", "false positives", "live-decoy hits", "verdict", "grade"], summary), "",
    `Qualifying stages (real menu, successor in menu): ${qual.length}; confirmed ${c}, confirmed or marginal ${cm}, dead ${dead}. **Pattern: ${pattern}.**`, "");
  return L.join("\n");
}
// Post hoc, not pre-registered: F1 asks for an invariant form, which boosts acting as zero satisfy vacuously.
// "Mixing" adds that some K has a nonzero bracket with S landing in S. Reported for the static menu only.
const mixes = (A, S) => (g) => { const a = families(g, A), s = families(g, S), inS = new Set(s); return a.some((i) => s.some((j) => [...(g.br.get(i * g.n + j) ?? new Map())].some(([k, f]) => inS.has(k) && !f.isZero()))); };
const families = (g, fs) => fs.flatMap((f) => family(g, f));
export function explore() {
  const g0 = ALL.static(), cs = candidates(g0, ["J"]), succFp = fingerprint(ALL.poincare());
  const pass = and([CONSTRAINTS.F1(F1_31.params), mixes(["K"], ["H", "P"])]), list = select(cs.cands, pass), o = outcome(list, succFp);
  const { decoys } = drawDecoys(decoySpace(g0, "F1", F1_31.params), 20261099); let live = 0, hits = 0;
  for (const d of decoys) { const ol = outcome(select(cs.cands, and([CONSTRAINTS.F1(d), mixes(d.A, d.S)])), succFp); if (ol.survivors) live++; if (ol.hit) hits++; }
  return ["## Exploratory, post hoc: the static menu with mixing required", "", "Not pre-registered and not graded. F1 is satisfied vacuously when boosts act as zero on {H, P}; this adds that some boost has a nonzero bracket with H or P landing in {H, P}.", "", `Survivors (${list.length}); successor ${o.succ ? `rank ${o.succ.rank}${o.succ.ties ? `, tied with ${o.succ.ties}` : ""}` : "absent"}; alternatives ${o.alts}:`, "", ...list.map((g) => `- ${g.fp === succFp ? "**successor** " : ""}rank ${g.rank}, key (order ${g.best[0]}, support ${g.best[1]}): ${g.fp}`), "", `Decoys of the same refined form (F1 with mixing of its own A on its own S): ${decoys.length}; live ${live}; hits ${hits}; live hit rate ${rateS(hits, live)}.`, ""].join("\n");
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const a = process.argv.slice(2), i = a.indexOf("--out");
  if (a.includes("--round")) { const out = runRound() + (a.includes("--explore") ? "\n" + explore() : ""); if (i >= 0) { writeFileSync(a[i + 1], out + "\n"); console.log(`wrote ${a[i + 1]}`); } else console.log(out); }
  else { console.log("deform-select: --round [--out FILE]"); process.exit(1); }
}
