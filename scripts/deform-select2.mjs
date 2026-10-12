// Role: the SELECT-002 round. Tests F5 (an invariant form on S under A, with some generator of A moving S
//   within S) with decoys on four menus, and follows iterated menus along the lowest-order path under conflicts
//   in historical and in reversed order. Rows, forms, path rule and verdicts are
//   generation/2026-10-12-select-002/preregistration.md, committed first.
// Contract: `node scripts/deform-select2.mjs --round [--out FILE]` runs the round and prints (or writes) its
//   report; `--deviation` adds the variant the grading names (mixing by the boosts K only), never graded.
//   Exports F5 and path.
// Invariant: read-only on the repository except --out. HISTORY-001's engine unchanged; exact arithmetic.
import { writeFileSync } from "node:fs";
import { fingerprint, CONSTRAINTS, select, family } from "./deform.mjs";
import { ALG, candidates, outcome, decoySpace, drawDecoys } from "./deform-history.mjs";
import { ALG3 } from "./deform-select.mjs";
import { ALGEBRAS } from "./deform-algebras.mjs";

const ALL = { ...ALG, ...ALG3 };
const fams = (g, fs) => fs.flatMap((f) => family(g, f));
const mixes = (A, S) => (g) => { const a = fams(g, A), s = fams(g, S), inS = new Set(s); return a.some((i) => s.some((j) => [...(g.br.get(i * g.n + j) ?? new Map())].some(([k, f]) => inS.has(k) && !f.isZero()))); };
export const F5 = (p) => { const f1 = CONSTRAINTS.F1(p), m = mixes(p.mixBy ?? p.A, p.S); const f = (g) => m(g) && f1(g); Object.defineProperty(f, "partial", { get: () => f1.partial }); return f; };
const FORMS = { F5, F2: CONSTRAINTS.F2 };
const and = (ps) => (g) => ps.every((p) => p(g));
// F5's decoys are F1's decoy space, each with its own mixing condition.
const decoysFor = (g, form, params, seed) => { const { mixBy, ...p } = params; const r = drawDecoys(decoySpace(g, form === "F5" ? "F1" : form, p), seed); if (mixBy) r.decoys = r.decoys.map((d) => ({ ...d, mixBy: d.A.filter((x) => x !== "J") })); return r; };
const NAMES = ["static", "galilei", "poincare", "euclidean", "carroll", "newtonHookeDS", "newtonHookeAdS", "deSitter", "antiDeSitter"];
const NAMED = new Map(); for (const k of NAMES) NAMED.set(fingerprint((ALL[k] ?? ALGEBRAS[k])()), k);
for (const k of ["galilei3", "poincare3"]) NAMED.set(fingerprint(ALL[k]()), k);
const nameOf = (fp) => NAMED.get(fp) ?? "unnamed";
const rateS = (h, n) => (n ? `${h}/${n} = ${(h / n).toFixed(3)}` : "n/a (none)");
const table = (head, rows) => [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");

const F5_31 = { form: "F5", params: { S: ["H", "P"], A: ["J", "K"], sig: [3, 1] }, what: "1904: the Lorentz transformations mix t and x and keep the interval" };
const F5_21 = { form: "F5", params: { S: ["H", "P"], A: ["J", "K"], sig: [2, 1] }, what: "the same, in 2 + 1" };
const F2_POS = { form: "F2", params: { X: "H", S: ["P", "K"], sign: 1 }, what: "1998: the accelerating expansion" };
const TROWS = [
  { id: "T1", pred: "static", succ: "poincare", c: F5_31, note: "shaped on it (a replication)" },
  { id: "T2", pred: "galilei", succ: "poincare", c: F5_31, note: "not shaped on it" },
  { id: "T3", pred: "galilei3", succ: "poincare3", c: F5_21, note: "not shaped on it" },
  { id: "T4", pred: "carroll", succ: "poincare", c: F5_31, note: "not shaped on it" },
];
const PROWS = [
  { id: "P1", start: "static", stages: [F5_31, F2_POS], end: "deSitter" },
  { id: "P2", start: "galilei", stages: [F5_31, F2_POS], end: "deSitter" },
  { id: "P3", start: "static", stages: [F2_POS, F5_31], end: null },
];
const memo = new Map();
const menu = (g) => { const fp = fingerprint(g); if (!memo.has(fp)) memo.set(fp, candidates(g, ["J"])); return memo.get(fp); };

function gradeT(o, inMenu, rate, distinct) {
  if (!inMenu) return ["out of menu", "ungraded"];
  if (!o.succ) return ["fail", "dead"];
  const verdict = o.succ.rank > 1 ? "fail (below rank 1)" : o.alts >= 2 ? "filter, not prediction" : rate >= 0.25 ? "fail (decoys hit)" : "pass";
  let g = 4; const cap = (x) => { g = Math.min(g, x); };
  if (distinct < 5) cap(3); if (o.alts >= 2 && o.alts <= 3) cap(3); if (rate >= 0.25 && rate < 0.5) cap(3);
  if (o.succ.rank > 1 || o.alts >= 4 || rate >= 0.5) cap(2);
  return [verdict, ["", "", "plausible", "marginal", "confirmed"][g]];
}
function runT(row, seed) {
  const g0 = ALL[row.pred](), cs = menu(g0), distinct = new Set(cs.cands.map((c) => c.fp)).size, succFp = fingerprint(ALL[row.succ]());
  const list = select(cs.cands, F5(row.c.params)), o = outcome(list, succFp), inMenu = cs.cands.some((c) => c.fp === succFp);
  const { decoys } = decoysFor(g0, "F5", row.c.params, seed); let live = 0, hits = 0;
  for (const d of decoys) { const od = outcome(select(cs.cands, F5(d)), succFp); if (od.survivors) live++; if (od.hit) hits++; }
  const rate = live ? hits / live : 0, [verdict, grade] = gradeT(o, inMenu, rate, distinct);
  return { row, distinct, list, o, inMenu, decoys: decoys.length, live, hits, verdict, grade, succFp };
}
// One path: at each stage, the current algebra's menu under every constraint so far; move to the rank-1 survivors.
export function path(start, stages, seed = 1, start0 = null) {
  let branches = [{ g: start0 ?? ALL[start](), steps: [] }];
  const prior = [];
  for (const st of stages) {
    const p = FORMS[st.form](st.params), next = [];
    for (const b of branches) {
      if (b.stuck) { next.push(b); continue; }
      const cs = menu(b.g), list = select(cs.cands, and([...prior, p]));
      const { decoys } = decoysFor(b.g, st.form, st.params, seed++); let live = 0, alone = 0;
      for (const d of decoys) { const l = select(cs.cands, and([...prior, FORMS[st.form](d)])); if (l.length) live++; if (l.length && l.filter((x) => x.rank === 1).length === 1 && l[0].fp === (list[0] && list[0].fp)) alone++; }
      const step = { stage: st.what, menu: new Set(cs.cands.map((c) => c.fp)).size, survivors: list.map((x) => `${nameOf(x.fp)} (rank ${x.rank})`), decoys: decoys.length, live, same: alone };
      const top = list.filter((x) => x.rank === 1);
      if (!top.length) { next.push({ ...b, steps: [...b.steps, { ...step, to: "stuck" }], stuck: true }); continue; }
      for (const t of top) {
        const c = cs.cands.find((x) => x.fp === t.fp && x.order === t.best[0] && x.support === t.best[1]) ?? cs.cands.find((x) => x.fp === t.fp);
        next.push({ g: c.alg, steps: [...b.steps, { ...step, to: nameOf(t.fp), stayed: c.order === 0 }] });
      }
    }
    branches = next; prior.push(p);
  }
  return branches;
}
export function runRound() {
  const L = ["# SELECT-002: the mixing form and iterated menus, computed", "", "Generated by `node scripts/deform-select2.mjs --round`. Exact arithmetic; HISTORY-001's engine. Rows, forms, the path rule and verdicts are those of `preregistration.md` in this directory, committed before any of this was computed.", ""];
  const tres = TROWS.map((r, i) => runT(r, 20261100 + i));
  L.push("## F5 rows", "", table(["row", "predecessor", "menu (distinct)", "successor", "survivors", "successor rank", "false positives", "live-decoy hits", "verdict", "grade", "note"],
    tres.map((t) => [t.row.id, t.row.pred, t.distinct, t.row.succ, t.list.map((x) => `${nameOf(x.fp)} (${x.rank})`).join(", ") || "none", t.o.succ ? t.o.succ.rank : t.inMenu ? "absent" : "out of menu", t.o.alts, rateS(t.hits, t.live), t.verdict, t.grade, t.row.note])), "");
  const s = tres.slice(1), passN = s.filter((t) => t.verdict === "pass").length, failN = s.filter((t) => t.grade === "dead").length, rank1 = s.filter((t) => t.o.succ && t.o.succ.rank === 1).length;
  const tv = passN === 3 ? "confirmed" : failN >= 2 ? "dead" : failN === 0 && rank1 >= 1 ? "marginal" : "plausible";
  L.push(`F5 over T2 to T4 (the rows it was not shaped on): ${passN} pass, ${failN} fail, successor at rank 1 in ${rank1}. **${tv}.** The claim that the generator discovers the successor is capped at plausible by the pre-registered leakage judgment.`, "");
  L.push("## Path rows", "");
  for (const r of PROWS) {
    const br = path(r.start, r.stages, 20261200 + PROWS.indexOf(r) * 10);
    const ends = br.map((b) => (b.stuck ? "stuck" : nameOf(fingerprint(b.g))));
    const through = br.map((b) => b.steps.map((s) => s.to));
    let verdict;
    if (r.end) { const ok = br.filter((b) => !b.stuck && nameOf(fingerprint(b.g)) === r.end && b.steps.some((s) => s.to === "poincare")); verdict = br.every((b) => b.stuck) ? "stuck" : ok.length === br.length ? "reproduces history" : ok.length ? "reproduces with branching" : "fail"; }
    else verdict = ends.every((e) => e === "deSitter") ? "endpoint robust (de Sitter)" : "path dependent";
    L.push(`### ${r.id}: from ${r.start}, stages ${r.stages.map((s) => s.what.split(":")[0]).join(", then ")}`, "");
    br.forEach((b, i) => {
      L.push(`Branch ${i + 1}: ${[r.start, ...b.steps.map((s) => s.to)].join(" -> ")}`, "");
      L.push(table(["stage", "menu (distinct)", "survivors", "moved to", "decoys", "live", "decoys giving the same rank-1 algebra alone"], b.steps.map((s) => [s.stage, s.menu, s.survivors.join(", ") || "none", s.to + (s.stayed ? " (stayed)" : ""), s.decoys, s.live, s.same])), "");
    });
    L.push(`Endpoints: ${ends.join(", ")}. **${verdict}.**`, "");
  }
  return L.join("\n");
}
// Deviation, post hoc: the pre-registered F5 lets the rotations J satisfy the mixing condition, which the
// static algebra then passes vacuously. The variant asks the boosts K to mix, as SELECT-001's diagnostic did.
export function deviation() {
  const k = (c) => ({ ...c, params: { ...c.params, mixBy: ["K"] } });
  const L = ["## Deviation, post hoc: mixing by the boosts K only", "", "Not pre-registered and not graded. The same rows and paths with F5's mixing condition taken over K instead of A = {J, K}; decoys take mixing over their own A minus J.", ""];
  const tres = TROWS.map((r, i) => { const rr = { ...r, c: k(r.c) }; return runT(rr, 20261100 + i); });
  L.push(table(["row", "predecessor", "survivors", "successor rank", "false positives", "live-decoy hits", "verdict by the round's rules"], tres.map((t) => [t.row.id, t.row.pred, t.list.map((x) => `${nameOf(x.fp)} (${x.rank})`).join(", ") || "none", t.o.succ ? t.o.succ.rank : "absent", t.o.alts, rateS(t.hits, t.live), t.verdict])), "");
  for (const r of PROWS) {
    const br = path(r.start, r.stages.map((s) => (s.form === "F5" ? k(s) : s)), 20261300 + PROWS.indexOf(r) * 10);
    L.push(`${r.id}: ${br.map((b) => [r.start, ...b.steps.map((s) => s.to + (s.stayed ? " (stayed)" : ""))].join(" -> ")).join("; ")}`, "");
  }
  return L.join("\n");
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const a = process.argv.slice(2), i = a.indexOf("--out");
  if (a.includes("--round")) { const out = runRound() + (a.includes("--deviation") ? "\n" + deviation() : ""); if (i >= 0) { writeFileSync(a[i + 1], out + "\n"); console.log(`wrote ${a[i + 1]}`); } else console.log(out); }
  else { console.log("deform-select2: --round [--out FILE]"); process.exit(1); }
}
