// Role: the repository map (FUNCTIONS.md F9), generalized from A-Viable-Fork/philosophy scripts/repo-map.mjs
//   and A-Viable-Fork/physics build/emit-repo-map.mjs. Renders a map of every directory and file with a
//   one-line description, and the edges between files, extracted from their contents.
// Contract: mapState(root, cfg) returns { failures, text, out }. cfg: { out = "REPO-MAP.md", manifest =
//   "repo-map-manifest.json", edges = true }. The manifest is { dirs: { dir: text }, docs: { file: text },
//   families: { glob: text } } (Philosophy's shape plus families). A code file (js, mjs, cjs, py, sh) is
//   described by its Role header, else by a docs entry; any other file by a docs entry, else by the first
//   family whose glob matches it; a directory by a dirs entry, else by a family matching its contents
//   (`glob` or `glob/**`). `.infra/**` is a built-in family (the vendored kit). Failures: a file or directory
//   with no description, and a manifest entry naming nothing present. Edges, from code and Markdown files
//   outside any family: "imports" (a relative import or require that resolves to a file) and "names" (a
//   tracked path quoted or written as a word in the text). The map never scans itself.
// Invariant: read-only; files are those git tracks or sees as untracked and not ignored.
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, posix } from "node:path";
import { execFileSync } from "node:child_process";
import { glob } from "./core.mjs";
import { header, fields } from "./headers.mjs";

const CODE = /\.(js|mjs|cjs|py|sh)$/;
const dirOf = (f) => (f.includes("/") ? f.slice(0, f.lastIndexOf("/")) : ".");
const cell = (s) => String(s).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const BUILTIN = { ".infra/**": "Part of the vendored kit, pinned by infra.lock.json (Repo-Infrastructure)." };

export function role(text, f) {
  const r = fields(header(text, (f.match(/\.([a-z]+)$/) || [, ""])[1])).role;
  return r ? r.replace(/(\.)\s.*$/, "$1") : null;
}

export function mapState(root, cfg = {}) {
  const out = cfg.out || "REPO-MAP.md", manPath = cfg.manifest || "repo-map-manifest.json";
  const F = [];
  let M = { dirs: {}, docs: {}, families: {} };
  if (existsSync(join(root, manPath))) {
    try { M = { dirs: {}, docs: {}, families: {}, ...JSON.parse(readFileSync(join(root, manPath), "utf8")) }; }
    catch (e) { F.push(`${manPath}: not JSON (${e.message})`); }
  } else F.push(`${manPath}: missing`);
  const fam = Object.entries({ ...BUILTIN, ...M.families }).map(([g, t]) => [g, glob(g), glob(g.replace(/\/\*\*$/, "")), t]);
  const famOf = (p) => (fam.find(([, re, base]) => re.test(p) || base.test(p)) || [])[3];
  const listed = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, maxBuffer: 1 << 28 })
    .toString().split("\0").filter((f) => f && existsSync(join(root, f)) && statSync(join(root, f)).isFile());
  const files = [...new Set([...listed, out])].sort();
  const dirs = [...new Set(files.flatMap((f) => { const p = []; let d = dirOf(f); for (;;) { p.push(d); if (d === ".") break; d = dirOf(d); } return p; }))].sort();
  const text = (f) => (f === out || !existsSync(join(root, f)) ? "" : readFileSync(join(root, f), "utf8"));
  const desc = {};
  for (const f of files) {
    const r = CODE.test(f) && f !== out ? role(text(f), f) : null;
    desc[f] = r || M.docs[f] || (f === out ? "This map, generated; do not edit." : f === manPath ? "Descriptions the repository map reads." : famOf(f)) || "";
    if (!desc[f]) F.push(CODE.test(f) ? `${f}: no Role header and no manifest entry` : `${f}: no description in ${manPath}`);
  }
  const dd = {};
  for (const d of dirs) {
    dd[d] = M.dirs[d] || famOf(d) || "";
    if (!dd[d]) F.push(`directory ${d}: no description in ${manPath}`);
  }
  for (const d of Object.keys(M.dirs)) if (!dirs.includes(d)) F.push(`${manPath} names absent directory ${d}`);
  for (const f of Object.keys(M.docs)) if (!files.includes(f)) F.push(`${manPath} names absent file ${f}`);
  for (const [g, re, base] of fam.slice(Object.keys(BUILTIN).length)) if (!files.some((f) => re.test(f) || base.test(f))) F.push(`${manPath} family ${g} matches nothing`);
  const edges = [];
  if (cfg.edges !== false) {
    const set = new Set(files);
    for (const f of files) {
      if (f === out || famOf(f) || !(CODE.test(f) || f.endsWith(".md"))) continue;
      const t = text(f);
      if (t.length > 1 << 20) continue;
      if (/\.(js|mjs|cjs)$/.test(f)) for (const m of t.matchAll(/(?:from\s+|require\(\s*|import\(\s*)["'](\.{1,2}\/[^"']+)["']/g)) {
        const target = posix.normalize(posix.join(dirOf(f), m[1]));
        if (set.has(target) && target !== f) edges.push([f, "imports", target]);
      }
      for (const g of files) {
        if (g === f || g === out) continue;
        let i = t.indexOf(g);
        while (i >= 0) {
          const a = t[i - 1], b = t[i + g.length];
          if ((a === undefined || !/[\w./-]/.test(a)) && (b === undefined || !/[\w/-]/.test(b) || (b === "." && !/[\w]/.test(t[i + g.length + 1] || "")))) { edges.push([f, "names", g]); break; }
          i = t.indexOf(g, i + 1);
        }
      }
    }
  }
  const uniq = [...new Map(edges.map((e) => [e.join("\0"), e])).values()].sort((x, y) => x.join("\0").localeCompare(y.join("\0")));
  const code = files.filter((f) => CODE.test(f)), docs = files.filter((f) => !CODE.test(f));
  const L = ["# Repository map", "",
    `*Generated by the repository map in A-Viable-Fork/Repo-Infrastructure's kit from the files git sees, their Role headers and \`${manPath}\`. Do not edit by hand; the kit's \`repomap\` check fails when it is stale.*`, "",
    "## 1. Directories", "", "| Directory | Holds |", "|---|---|", ...dirs.map((d) => `| \`${d}\` | ${cell(dd[d])} |`), "",
    "## 2. Code", "", "| File | Role |", "|---|---|", ...code.map((f) => `| \`${f}\` | ${cell(desc[f])} |`), "",
    "## 3. Documents and data", "", "| File | What it is |", "|---|---|", ...docs.map((f) => `| \`${f}\` | ${cell(desc[f])} |`), ""];
  if (cfg.edges !== false) L.push("## 4. Edges", "", "Extracted from code and Markdown files outside any family: `imports` (a relative import that resolves to a file) and `names` (a path the file writes out).", "",
    "| From | Edge | To |", "|---|---|---|", ...uniq.map((e) => `| \`${e[0]}\` | ${e[1]} | \`${e[2]}\` |`), "");
  return { failures: F, text: L.join("\n"), out };
}
