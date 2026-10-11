// Role: the free typing pass. Types each entry's input and output by matching the head of each operand's text
//   against a word list of kinds, with no model, so the cost of typing the map is measured before any model is
//   spent on it.
// Contract: `node scripts/type-lexicon.mjs` writes reports/TYPING.md; `--check` prints it without writing;
//   `--json` prints every entry's proposed typing; `--sample N` prints N entries (fixed stride) for a reader to
//   grade. Exports typeEntries(P?) and LEXICON. A kind is either a carrier already in mapfill/invariants.js or a
//   candidate carrier (marked candidate), which enters the vocabulary only by the usual review. An operand is
//   split on " + ", "; " and ", "; an operand with no word of three letters or more, or one that names a size,
//   threshold, order or similar, is a parameter and needs no kind. The match is the pattern ending latest in the operand's head phrase (its first six words, up to the first symbol or linking word), since an English compound's kind is its last noun; bare words
//   with two common senses ("field", "form", "complex", "map", "flow") match only in a qualified phrase.
// Invariant: read-only. A proposed typing is a lead for review, never an acts-on record.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "./mathmap.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// kind: [patterns]; a kind not in CARRIERS is a candidate.
export const LEXICON = {
  variety: ["(?:projective |affine |algebraic )?variet(?:y|ies)"],
  surface: ["(?:riemann |algebraic |smooth )?surfaces?"],
  curve: ["(?:algebraic |elliptic |plane |projective )?curves?"],
  space: ["(?:topological |metric |pointed |compact |polish )?(?:sub)?spaces?(?! of)", "topological space", "(?:sub)?space topology"],
  "point-cloud": ["point clouds?", "sample points", "finite (?:set|sample) of points"],
  "simplicial-set": ["simplicial (?:sets?|complex(?:es)?)"],
  category: ["(?:small |monoidal |abelian |additive |serre )?(?:sub)?categor(?:y|ies)", "(?:infinity|∞)-categor(?:y|ies)"],
  functor: ["functors?", "geometric morphisms?", "adjunctions?"],
  topos: ["topos", "topoi"],
  field: ["scalar fields?", "(?:electric|magnetic|velocity|gauge|quantum) fields?", "fields? on"],
  function: ["(?:real-valued |complex-valued |smooth |continuous |integrable |measurable |boolean |analytic )?functions?(?!al)", "l\\^?[0-9p]\\(", "(?:fourier |laplace |mellin |integral )?transforms?", "transformed (?:function|expression|signal)"],
  form: ["differential (?:k-)?forms?", "k-forms?", "\\d-forms?", "k[+-]1\\)-forms?", "n-k\\)-forms?"],
  evolution: ["evolution operators?", "semigroups? of operators", "propagators?"],
  connection: ["(?:affine |levi-civita )?connections?"],
  "vector-field": ["vector fields?"],
  process: ["(?:stochastic|markov|random|poisson|diffusion|gaussian|levy|lévy|point) process(?:es)?", "brownian motion", "markov chains?", "random walks?", "stochastic differential equations?"],
  // candidates
  graph: ["(?:directed |undirected |weighted |bipartite |planar )?(?:sub)?graphs?", "digraphs?", "networks?", "trees?"],
  // Numeric and term sequences only; exact sequences are chain complexes. Coefficient vectors and series merged here.
  sequence: ["sequences?", "time series", "(?:[a-z]+ )?coefficients?", "(?:sine|cosine|fourier|frequency|power|real-valued) spectr(?:um|a)", "(?:power|fourier|formal|taylor|dirichlet) series", "(?:[a-z-]+ )?vectors?"],
  matrix: ["(?:square |symmetric |hermitian |sparse )?matri(?:x|ces)"],
  manifold: ["(?:smooth |riemannian |symplectic |complex |compact )?(?:sub)?manifolds?", "hypersurfaces?"],
  group: ["(?:finite |abelian |lie |topological |cyclic |braid )?(?:sub)?groups?", "group actions?", "braids?", "(?:integer |point |euclidean )lattices?", "lattices? in r"],
  ring: ["(?:commutative |polynomial )?(?:sub)?rings?", "integral domains?"],
  "algebraic-field": ["field extensions?", "number fields?", "finite fields?", "galois fields?", "fields? [a-z]\\b"],
  algebra: ["(?:lie |associative |boolean |c\\*-|von neumann |hopf |e_n-)?(?:co)?algebras?"],
  module: ["modules?"],
  "vector-space": ["(?:finite-dimensional )?vector spaces?", "hilbert spaces?", "banach spaces?", "normed spaces?", "inner product spaces?"],
  signal: ["(?:discrete |digital |audio )?signals?", "signal vectors?"],
  poset: ["posets?", "partially ordered sets?", "(?:semi)?lattices?", "(?:join|meet)-semilattices?", "monomial orders?", "orders?$"],
  polynomial: ["polynomials?"],
  sheaf: ["sheaves", "sheaf", "presheaves", "presheaf"],
  "chain-complex": ["(?:long |short |snake )?exact sequences?", "(?:koszul|cech|čech|de rham|bar|cobar|cellular|singular) complex(?:es)?", "(?:co)?chain complex(?:es)?", "filtered complex(?:es)?", "complex(?:es)? of (?:modules|vector spaces|sheaves)"],
  knot: ["knots?", "(?:pretzel |torus |hyperbolic )?links?"],
  operator: ["(?:linear |bounded |self-adjoint |differential |integral )?operators?"],
  distribution: ["probability (?:distributions?|measures?|densit(?:y|ies))", "(?:initial |joint )?(?:probability )?densit(?:y|ies)", "random variables?", "distributions?"],
  measure: ["measures?"],
  bundle: ["(?:vector |principal |fiber |fibre |line |tangent )?bundles?"],
  tensor: ["tensors?"],
  matroid: ["matroids?"],
  ideal: ["ideals?"],
  representation: ["representations?", "reps?"],
  "decision-problem": ["decision problems?", "languages?", "problem instances?"],
  formula: ["(?:boolean |propositional |first-order |cnf )?formulas?", "formulae"],
  proof: ["proofs?"],
  operad: ["operads?"],
  word: ["strings?", "words?"],
  number: ["integers?", "natural numbers?", "primes?", "real numbers?", "rationals?"],
  code: ["(?:linear |error-correcting )?codes?", "codewords?"],
  morphism: ["(?:homo|iso|endo|auto|diffeo|homeo)?morphisms?", "(?:chain |continuous |linear |smooth )?maps? [a-z]\\b", "maps? of", "maps?$", "homotopy equivalences?", "inclusions?", "epimorphisms?", "monomorphisms?", "natural transformations?", "homeomorphisms?", "symplectomorphisms?", "isometr(?:y|ies)", "embeddings?"],
  element: ["elements?", "relative complements?", "points? of", "objects?"],
  scheme: ["schemes?", "stacks?"],
  diagram: ["(?:commutative |string |zx |zw )?diagrams?"],
  relation: ["(?:equivalence |binary )?relations?"],
  equation: ["(?:differential |partial differential |integral |linear |polynomial )?equations?", "odes?", "pdes?", "(?:linear |algebraic )systems?"],
  problem: ["(?:counting |optimization |search )?problems?", "instances? of"],
  dataset: ["(?:empirical |observed |sample |discrete |poisson |statistical |time-series |raw |noisy )?data(?:sets?)?", "samples?", "observations?"],
  "spectral-sequence": ["spectral sequences?", "pages? e_?(?:r|r\\+1|\\{r\\+1\\}|infinity|∞)?", "e_(?:r|infinity|∞|\\{r\\+1\\})"],
  verdict: ["verdicts?", "yes/no", "decisions?"],
  model: ["(?:ground )?models? [a-z]\\b", "forcing extensions?"],
  program: ["(?:linear|integer|semidefinite|convex|parametric) programs?"],
  polytope: ["polytopes?", "polyhedr(?:on|a)"],
  circuit: ["(?:quantum |boolean |ansatz )?circuits?"],
  "characteristic-class": ["(?:chern|pontryagin|stiefel-whitney|euler|characteristic) classes?"],
  "set": ["(?:finite |measurable |open |closed |convex )?sets?", "subsets?"],
};

const compiled = Object.entries(LEXICON).flatMap(([kind, pats]) => pats.map((p) => ({ kind, re: new RegExp(`\\b${p}\\b`, "i"), len: p.length })));

// Split at top level only: commas and pluses inside brackets belong to one operand.
function operands(text) {
  const out = [];
  let depth = 0, cur = "";
  const t = String(text || "");
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if ("([{".includes(ch)) depth++;
    if (")]}".includes(ch)) depth = Math.max(0, depth - 1);
    const sep = depth === 0 && (t.startsWith(" + ", i) ? 3 : ch === ";" ? 1 : t.startsWith(", ", i) ? 2 : 0);
    if (sep) { out.push(cur); cur = ""; i += sep - 1; continue; }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter((s) => /[A-Za-z]{3,}/.test(s));
}

const PARAM = /^(?:(?:window |step |filtration |twist |scale )?(?:length|size|parameters?|values?|thresholds?|tolerance|index|indices|order|degree|rank|level|grid|bounds?|weights?|depth|width|radius|time|budget|seed|requirements?)\b|(?:an? |the )?(?:integer|number|positive integer|natural number) [a-z]\b)/i;

// The head phrase ends at the first symbol or linking word; in English its kind is its last noun
// ("group ring" is a ring, "matrix representation" a representation), so the latest-ending match wins.
const STOP = /[=:{\[⊆⊂<≅→]|\s(?:with|of|on|in|over|for|at|where|satisfying|and|or|to|from|under|by|whose|via|such)\s/i;
function kindOf(op, domain) {
  const words = op.toLowerCase().split(/\s+/).slice(0, 6).join(" ");
  const cut = words.search(STOP);
  const head = cut > 0 ? words.slice(0, cut) : words;
  let best = null;
  for (const c of compiled) {
    const m = c.re.exec(head);
    if (!m) continue;
    const end = m.index + m[0].length;
    if (!best || end > best.end || (end === best.end && m[0].length > best.size)) best = { kind: c.kind, end, size: m[0].length };
  }
  // A set is the fallback: any more specific kind in the head wins.
  if (best?.kind === "set") { const other = compiled.filter((c) => c.kind !== "set" && c.re.test(head)); if (other.length) return kindOf(op.replace(/\b(?:sub)?sets?\b/gi, ""), domain); }
  // Data that is structure, not observation ("algebraic data", "descent data") is not a dataset.
  if (best?.kind === "dataset" && /(?:algebraic|equivalence|descent|gluing|structure|homotopy|categorical) data/.test(head)) return null;
  // A bare "surface" is algebraic only in algebraic geometry (D2); elsewhere the carrier would mislead.
  if (best?.kind === "surface" && domain !== "D2" && !/(?:algebraic|projective|riemann|k3|del pezzo) surface/.test(head)) return null;
  return best?.kind || null;
}

export function typeEntries(P = parse()) {
  const carriers = new Set(Object.keys(P.vocabulary.CARRIERS));
  return P.entries.filter((e) => !e.id.startsWith("D9-")).map((e) => {
    const side = (t) => operands(t).map((op) => ({ op, kind: PARAM.test(op) ? "parameter" : kindOf(op, e.domain) }));
    const input = side(e.input), output = side(e.output);
    const all = [...input, ...output];
    const real = (x) => x.kind && x.kind !== "parameter";
    const typed = (pred) => input.some(real) && output.some(real) && all.every((x) => x.kind && (x.kind === "parameter" || pred(x.kind)));
    const some = input.some(real) && output.some(real);
    return { id: e.id, domain: e.domain, input, output,
      full: typed((k) => carriers.has(k)) ? "existing" : typed(() => true) ? "with candidates" : some ? "partial" : "none" };
  });
}

export function render(T, P) {
  const carriers = new Set(Object.keys(P.vocabulary.CARRIERS));
  const n = T.length, count = (s) => T.filter((t) => t.full === s).length;
  const pct = (k) => `${((100 * k) / n).toFixed(1)}%`;
  const doms = [...new Set(T.map((t) => t.domain))].sort();
  const kinds = {};
  for (const t of T) for (const x of [...t.input, ...t.output]) if (x.kind && x.kind !== "parameter") kinds[x.kind] = (kinds[x.kind] || 0) + 1;
  const misses = {};
  for (const t of T) for (const x of [...t.input, ...t.output]) if (!x.kind) { const w = x.op.toLowerCase().match(/[a-z][a-z-]{2,}/g)?.find((w) => !/^(the|and|with|of|on|in|for|its|over|from|two|each|given|set)$/.test(w)); if (w) misses[w] = (misses[w] || 0) + 1; }
  const L = ["# Typing by word list", "",
    "Generated by `scripts/type-lexicon.mjs`. Each operand of an entry's input and output is matched against a word list of kinds, with no model. A proposed typing is a lead for review, never an acts-on record; candidate kinds enter the vocabulary only by review. D9 entries are typed already and left out.", "",
    `Entries: ${n}.`, "",
    "| Typed | Entries | Share |", "|---|---|---|",
    `| Every operand, with existing kinds only | ${count("existing")} | ${pct(count("existing"))} |`,
    `| Every operand, using candidate kinds | ${count("with candidates")} | ${pct(count("with candidates"))} |`,
    `| At least one input and one output kind | ${count("partial")} | ${pct(count("partial"))} |`,
    `| Neither side | ${count("none")} | ${pct(count("none"))} |`, "",
    "## By domain", "", "| Domain | Entries | Fully typed | Partly | Neither |", "|---|---|---|---|---|",
    ...doms.map((d) => { const D = T.filter((t) => t.domain === d); const f = D.filter((t) => t.full === "existing" || t.full === "with candidates").length; return `| ${d} | ${D.length} | ${f} | ${D.filter((t) => t.full === "partial").length} | ${D.filter((t) => t.full === "none").length} |`; }), "",
    "## Kinds used", "", "| Kind | Operands | Status |", "|---|---|---|",
    ...Object.entries(kinds).sort((a, b) => b[1] - a[1]).map(([k, c]) => `| ${k} | ${c} | ${carriers.has(k) ? "carrier" : "candidate"} |`), "",
    "## Most frequent first words of untyped operands", "",
    "Where the word list is thinnest: the next kinds to add, or senses to split.", "",
    Object.entries(misses).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, 60).map(([w, c]) => `${w} ${c}`).join(", ") + "."];
  return L.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), P = parse(), T = typeEntries(P);
  if (a.includes("--json")) console.log(JSON.stringify(T, null, 1));
  else if (a.includes("--sample")) { const k = Number(a[a.indexOf("--sample") + 1]) || 40, step = Math.max(1, Math.floor(T.length / k));
    for (let i = 0; i < T.length && i / step < k; i += step) { const t = T[i]; console.log(`${t.id} [${t.full}]\n  in:  ${t.input.map((x) => `${x.op} => ${x.kind}`).join(" | ")}\n  out: ${t.output.map((x) => `${x.op} => ${x.kind}`).join(" | ")}`); } }
  else { const out = render(T, P); if (a.includes("--check")) console.log(out); else { writeFileSync(join(ROOT, "reports/TYPING.md"), out + "\n"); console.log("wrote reports/TYPING.md"); } }
}
