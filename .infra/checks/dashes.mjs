// Role: the style floor. Fails on an en or em dash in authored text.
// Contract: config `dashes: { exclude: [globs], verbatim: [globs], window: 24 }`. Files matching exclude or
//   verbatim are not scanned. A dash in an authored file still passes when it sits inside a quotation: some
//   span of `window` + 1 characters containing it (whitespace-normalized) occurs in the verbatim files.
//   Reports file:line per failing line.
// Invariant: read-only. Generalized from A-Viable-Fork/philosophy scripts/check-dashes.mjs (fee94ee),
//   without its repository-specific audit-receipt rule.
import { listFiles, read, result } from "../lib/core.mjs";

const DASH = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`, "g"); // en and em dash, built from code points so this file stays dash-free
export default function dashes(root, cfg = {}) {
  const window = cfg.window ?? 24;
  const verbatimFiles = (cfg.verbatim || []).length ? listFiles(root, { include: cfg.verbatim }) : [];
  const corpus = verbatimFiles.map((f) => read(root, f).replace(/\s+/g, " ")).join("\n");
  const files = listFiles(root, { exclude: [...(cfg.exclude || []), ...(cfg.verbatim || [])] });
  // A dash is quoted when some span of window + 1 characters containing it, in any split of left and
  // right context, occurs in the verbatim text; a quotation that starts or ends near the dash still passes.
  const norm = (x) => x.replace(/\s+/g, " ");
  const quoted = (l, i) => corpus.length > 0 && Array.from({ length: window + 1 }, (_, left) => left)
    .some((left) => i - left >= 0 && i + (window - left) < l.length && corpus.includes(norm(l.slice(i - left, i + window - left + 1))));
  const fails = [];
  for (const f of files) {
    read(root, f).split("\n").forEach((l, n) => {
      if ([...l.matchAll(DASH)].some((m) => !quoted(l, m.index))) fails.push(`${f}:${n + 1}`);
    });
  }
  return result("dashes", fails, `${files.length} authored files${verbatimFiles.length ? `, ${verbatimFiles.length} verbatim` : ""}`);
}
