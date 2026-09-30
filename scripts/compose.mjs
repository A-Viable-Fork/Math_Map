// Role: composition. For a chain of entries applied in order, reports which named invariants survive the
//   whole chain, where each one breaks, and where the map is silent.
// Contract: `node scripts/compose.mjs --chain D2-118,D2-117 [--json]`. Exports compose(chain, P?). An
//   invariant's status: survives (every step preserves it), broken (at the first step that breaks it), or
//   unknown (no step breaks it, but some step says nothing about it; the silent steps are listed); a step
//   whose output produces the invariant after an earlier step broke it restores it. Steps'
//   claims are closed under the vocabulary's relations: preserving an invariant preserves what it implies,
//   and breaking an invariant breaks what implies it.
// Invariant: read-only. The answer is only as good as the entries' fields and links: "unknown" means the
//   map does not say, not that the invariant is lost.
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";

function closure(ids, R, dir) {
  const out = new Set(ids);
  let grew = true;
  while (grew) {
    grew = false;
    for (const r of R) {
      const pairs = r.kind === "equivalent" ? [[r.from, r.to], [r.to, r.from]] : dir === "down" ? [[r.from, r.to]] : [[r.to, r.from]];
      for (const [a, b] of pairs) if (out.has(a) && !out.has(b)) { out.add(b); grew = true; }
    }
  }
  return out;
}

export function compose(chain, P = parse()) {
  const by = Object.fromEntries(P.entries.map((e) => [e.id, e]));
  const R = P.vocabulary.RELATIONS;
  const missing = chain.filter((id) => !by[id]);
  if (missing.length) return { chain, error: `no such entries: ${missing.join(", ")}` };
  const steps = chain.map((id) => {
    const inv = by[id].invariants || { preserved: [], broken: [], output: [] };
    return { id, name: by[id].name, preserved: closure(inv.preserved, R, "down"), broken: closure(inv.broken, R, "up"), output: new Set(inv.output) };
  });
  const all = new Set(steps.flatMap((s) => [...s.preserved, ...s.broken, ...s.output]));
  const names = Object.fromEntries(P.vocabulary.INVARIANTS.map((v) => [v.id, v.name]));
  const result = [...all].sort().map((v) => {
    const b = steps.findIndex((s) => s.broken.has(v));
    const c = steps.findIndex((s, k) => k > b && s.output.has(v));
    if (b >= 0 && c > b && !steps.slice(c + 1).some((s) => s.broken.has(v))) return { invariant: v, name: names[v], status: "restored", brokenAt: b + 1, restoredAt: c + 1, by: steps[c].id };
    if (b < 0 && c >= 0) return { invariant: v, name: names[v], status: "created", at: c + 1, by: steps[c].id };
    if (b >= 0) return { invariant: v, name: names[v], status: "broken", at: b + 1, by: steps[b].id, silentBefore: steps.slice(0, b).filter((s) => !s.preserved.has(v)).map((s) => s.id) };
    const silent = steps.filter((s) => !s.preserved.has(v)).map((s) => s.id);
    return silent.length ? { invariant: v, name: names[v], status: "unknown", silentAt: silent } : { invariant: v, name: names[v], status: "survives" };
  });
  const unlinked = steps.filter((s) => !s.preserved.size && !s.broken.size && !s.output.size).map((s) => s.id);
  return { chain, steps: steps.map((s) => ({ id: s.id, name: s.name })), invariants: result, unlinked };
}

export function describe(r) {
  if (r.error) return r.error;
  const L = [`Chain: ${r.steps.map((s) => `${s.id} ${s.name}`).join(", then ")}`];
  for (const x of r.invariants) {
    if (x.status === "survives") L.push(`  survives: ${x.name}`);
    else if (x.status === "restored") L.push(`  restored: ${x.name} (broken at step ${x.brokenAt}, produced again at step ${x.restoredAt} by ${x.by})`);
    else if (x.status === "created") L.push(`  created at step ${x.at} (${x.by}): ${x.name}`);
    else if (x.status === "broken") L.push(`  broken at step ${x.at} (${x.by}): ${x.name}${x.silentBefore.length ? `; the map is silent on it before that at ${x.silentBefore.join(", ")}` : ""}`);
    else L.push(`  unknown: ${x.name} (the map is silent at ${x.silentAt.join(", ")})`);
  }
  if (r.unlinked.length) L.push(`  no invariant links yet for: ${r.unlinked.join(", ")}`);
  return L.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), i = a.indexOf("--chain");
  if (i < 0 || !a[i + 1]) { console.log("compose: needs --chain ID,ID,..."); process.exit(1); }
  const r = compose(a[i + 1].split(",").map((s) => s.trim()));
  console.log(a.includes("--json") ? JSON.stringify(r, null, 1) : describe(r));
  if (r.error) process.exit(1);
}
