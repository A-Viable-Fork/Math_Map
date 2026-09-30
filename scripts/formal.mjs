// Role: the formal layer. Links map entries to Mathlib declarations at one pinned commit and checks the links.
// Contract: `node scripts/formal.mjs --check` (CI, offline): every link in mapfill/formal.js names an entry
//   and a field, has a valid match grade and a note, and its declaration's statement occurs verbatim in an
//   excerpt file stamped with the pinned commit. `--excerpt --mathlib DIR` (maintenance): DIR is a checkout
//   of mathlib4 at the pinned commit; resolves every linked declaration's full name (namespaces tracked),
//   fails on any it cannot find, and writes the excerpt files. `--candidates --mathlib DIR` writes
//   reports/FORMAL-QUEUE.md: entries whose name matches a Mathlib module title, unreviewed. `--verify`
//   (network) refetches each excerpted file at the pinned commit and checks its hash.
//   Links may carry whole, invariant and premise (see mapfill/formal.js); scripts/evidence.mjs reads them.
// Invariant: a link says Mathlib proves (or defines) the quoted statement; the match grade saying how that
//   statement bears on the entry is a judgment, recorded with a note, like an audit grade. No Lean is
//   compiled here: the pinned commit is one Mathlib's CI built, so a declaration present at it type-checks.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { MATHLIB, FORMAL } = require("../mapfill/formal.js");
const FIELDS = ["description", "input", "output", "preserved", "broken"];
export const MATCHES = {
  exact: "Mathlib states the entry's claim as written.",
  general: "Mathlib states a more general result that implies the claim.",
  special: "Mathlib states a special case of the claim.",
  ingredient: "Mathlib defines the objects or the operation, not the claim.",
  related: "Mathlib states a weaker or neighbouring result; the claim itself is not formalized at the pin.",
  conflicts: "Mathlib's statement conflicts with the claim as written; the note says how.",
};
const KW = /^(?:@\[[^\]]*\]\s*)?(?:(?:public|private|protected|noncomputable|nonrec|scoped)\s+)*(theorem|lemma|def|abbrev|instance|structure|class|inductive)\s+(?:\(priority\s*:=\s*\w+\)\s+)?([^\s:({[⦃]+)/;
export const excerptFile = (path) => `excerpts/mathlib-${path.replace(/\.lean$/, "").replace(/\//g, ".")}.txt`;
const sha = (t) => createHash("sha256").update(t).digest("hex");

// Every declaration in a Lean file with its full name and statement window (keyword line up to the proof).
function declarations(text) {
  const lines = text.split("\n"), stack = [], out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    let m;
    if ((m = l.match(/^namespace\s+(\S+)/))) { stack.push({ kind: "ns", name: m[1] }); continue; }
    if ((m = l.match(/^(?:@\[[^\]]*\]\s*)?(?:(?:public|private|noncomputable)\s+)*section\b\s*(\S*)/))) { stack.push({ kind: "sec", name: m[1] }); continue; }
    if ((m = l.match(/^end\b\s*(\S*)/))) { stack.pop(); continue; }
    if (!(m = l.match(KW))) continue;
    const written = m[2], ns = stack.filter((s) => s.kind === "ns").map((s) => s.name).join(".");
    const full = written.startsWith("_root_.") ? written.slice(7) : ns ? `${ns}.${written}` : written;
    // A theorem's statement ends at the proof's ":=" (bracket depth 0); a definition keeps its body, up to a
    // blank line or the next unindented line, so the excerpt says what is defined.
    const isDef = ["def", "abbrev", "structure", "class", "inductive"].includes(m[1]);
    const chunk = [];
    for (let j = i; j < lines.length && j < i + 16; j++) { if (j > i && (!lines[j].trim() || /^\S/.test(lines[j]))) break; chunk.push(lines[j]); }
    let s = chunk.join("\n"), depth = 0, cut = s.length;
    for (let c = 0; c < s.length; c++) {
      const ch = s[c];
      if ("([{⦃⟨".includes(ch)) depth++; else if (")]}⦄⟩".includes(ch)) depth--;
      else if (depth === 0 && (s.startsWith(":=", c) || (!isDef && /^\swhere\b/.test(s.slice(c - 1, c + 6)) && /\s/.test(s[c - 1])))) { cut = c; break; }
    }
    if (!isDef || /^:=\s*by\b/.test(s.slice(cut))) s = s.slice(0, cut);
    else s = s.split("\n").slice(0, 6).join("\n");
    out.push({ full, line: i + 1, statement: s.split("\n").map((x) => x.trimEnd()).join("\n").trimEnd() });
  }
  return out;
}

function excerpt(dir) {
  const head = execFileSync("git", ["-C", dir, "rev-parse", "HEAD"]).toString().trim();
  if (head !== MATHLIB.commit) { console.log(`formal: ${dir} is at ${head}, the pin is ${MATHLIB.commit}`); process.exit(1); }
  const byFile = {}, F = [];
  for (const k of FORMAL) (byFile[k.file] ||= new Set()).add(k.decl);
  for (const [file, decls] of Object.entries(byFile)) {
    const p = join(dir, file);
    if (!existsSync(p)) { F.push(`${file}: not in Mathlib at the pin`); continue; }
    const text = readFileSync(p, "utf8"), ds = declarations(text);
    const wins = [];
    for (const d of decls) {
      const hit = ds.find((x) => x.full === d);
      if (!hit) { F.push(`${d}: not declared in ${file} (found: ${ds.filter((x) => x.full.endsWith(d.split(".").pop())).map((x) => x.full).join(", ") || "none"})`); continue; }
      wins.push(`-- ${d} (line ${hit.line})\n${hit.statement}`);
    }
    const hdr = [`Excerpts, verbatim, from: Mathlib, ${file}`, `URL: https://github.com/leanprover-community/mathlib4/blob/${MATHLIB.commit}/${file}`,
      `Commit: ${MATHLIB.commit}. SHA-256 of the file at that commit: ${sha(text)}`,
      "Only the declaration statements below are kept (proofs omitted); each was checked to occur verbatim in the file. Mathlib is licensed under Apache 2.0.", ""];
    writeFileSync(join(ROOT, excerptFile(file)), hdr.join("\n") + "\n" + wins.join("\n\n") + "\n");
  }
  for (const f of F) console.log("FAIL", f);
  if (F.length) process.exit(1);
  console.log(`formal: wrote ${Object.keys(byFile).length} excerpt files for ${FORMAL.length} links`);
}

export function check(entries) {
  const F = [], ids = new Set(entries.map((e) => e.id)), seen = new Set();
  const invariantIds = new Set(require("../mapfill/invariants.js").INVARIANTS.map((v) => v.id));
  if (!/^[0-9a-f]{40}$/.test(MATHLIB.commit)) F.push("MATHLIB.commit must be a 40-hex commit");
  for (const k of FORMAL) {
    const at = `formal ${k.entry} ${k.decl}`;
    if (!ids.has(k.entry)) F.push(`${at}: no such entry`);
    if (!FIELDS.includes(k.field)) F.push(`${at}: field must be one of ${FIELDS.join(", ")}`);
    if (!(k.match in MATCHES)) F.push(`${at}: match must be one of ${Object.keys(MATCHES).join(", ")}`);
    if (!k.note || !k.note.trim()) F.push(`${at}: a link needs a note saying how the statement bears on the entry`);
    if (k.whole && k.match !== "exact") F.push(`${at}: only an exact link can state the whole field`);
    if (k.invariant && !invariantIds.has(k.invariant)) F.push(`${at}: unknown invariant ${k.invariant}`);
    if (k.premise && !FIELDS.includes(k.premise)) F.push(`${at}: premise must be a field`);
    if (k.premise && k.match !== "general") F.push(`${at}: a premise belongs to a general link`);
    if (k.match === "general" && k.invariant && !k.premise) F.push(`${at}: a general link on an invariant needs the premise field that makes the theorem apply`);
    const key = `${k.entry}|${k.field}|${k.decl}`; if (seen.has(key)) F.push(`${at}: given twice`); seen.add(key);
    const ef = join(ROOT, excerptFile(k.file));
    if (!existsSync(ef)) { F.push(`${at}: no excerpt file ${excerptFile(k.file)} (run --excerpt)`); continue; }
    const t = readFileSync(ef, "utf8");
    if (!t.includes(`Commit: ${MATHLIB.commit}.`)) F.push(`${at}: excerpt file is not at the pinned commit`);
    if (!t.includes(`-- ${k.decl} (line `)) F.push(`${at}: the declaration is not in its excerpt file (run --excerpt)`);
  }
  return F;
}

function candidates(dir, entries) {
  const files = [];
  (function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith(".lean") && files.push(p); } })(join(dir, "Mathlib"));
  const STOP = new Set("the of a an and or in on for to by with via from as at is theorem lemma construction map maps operation".split(" "));
  const tok = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)).map((w) => w.replace(/ies$/, "y").replace(/s$/, ""));
  const mods = files.map((p) => { const t = readFileSync(p, "utf8"), m = t.match(/\/-!\s*\n#\s+([^\n]+)/); const rel = p.slice(dir.length + 1);
    return { rel, title: m ? m[1].trim() : "", toks: new Set(tok(`${m ? m[1] : ""} ${rel.split("/").slice(-2).join(" ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\.lean$/, "")}`)) }; });
  const linked = new Set(FORMAL.map((k) => k.entry)), rows = [];
  for (const e of entries) {
    if (linked.has(e.id)) continue;
    const et = [...new Set(tok(e.name))]; if (!et.length) continue;
    let best = null;
    for (const m of mods) { const k = et.filter((w) => m.toks.has(w)).length; if (k === et.length && (!best || m.toks.size < best.toks.size)) best = m; }
    if (best) rows.push(`| ${e.id} | ${e.name} | \`${best.rel}\` | ${best.title || "-"} |`);
  }
  const L = ["# Formal queue", "", `*Generated by \`scripts/formal.mjs --candidates\` against Mathlib at ${MATHLIB.commit}. Unreviewed.*`, "",
    "Entries not yet linked whose every name word matches a Mathlib module's title or path. A row is a place to look, not a link: many are false friends (the same word for a different object). A link is made only by reading the declaration and grading its match (`mapfill/formal.js`).", "",
    `${rows.length} candidates.`, "", "| Entry | Name | Mathlib module | Module title |", "|---|---|---|---|", ...rows, ""];
  writeFileSync(join(ROOT, "reports/FORMAL-QUEUE.md"), L.join("\n"));
  console.log(`formal: wrote reports/FORMAL-QUEUE.md (${rows.length} candidates)`);
}

async function verify() {
  const F = [];
  for (const file of new Set(FORMAL.map((k) => k.file))) {
    const url = `https://raw.githubusercontent.com/leanprover-community/mathlib4/${MATHLIB.commit}/${file}`;
    const r = await fetch(url); if (!r.ok) { F.push(`${file}: HTTP ${r.status}`); continue; }
    const h = sha(await r.text()), t = readFileSync(join(ROOT, excerptFile(file)), "utf8");
    if (!t.includes(h)) F.push(`${file}: hash at the pin differs from the excerpt's`);
  }
  for (const f of F) console.log("FAIL", f);
  if (F.length) process.exit(1);
  console.log("formal: every excerpted file matches Mathlib at the pin");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), dir = a[a.indexOf("--mathlib") + 1];
  const { parse } = await import("./mathmap.mjs");
  if (a.includes("--find")) {
    const re = new RegExp(a[a.indexOf("--find") + 1]), sub = a.includes("--in") ? a[a.indexOf("--in") + 1] : "Mathlib";
    const files = []; (function walk(d) { if (d.endsWith(".lean")) return files.push(d); for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith(".lean") && files.push(p); } })(join(dir, sub));
    for (const p of files) for (const d of declarations(readFileSync(p, "utf8"))) if (re.test(d.full)) console.log(`${d.full}  [${p.slice(dir.length + 1)}:${d.line}]\n  ${d.statement.replace(/\n/g, "\n  ")}`);
  } else if (a.includes("--excerpt")) excerpt(dir);
  else if (a.includes("--candidates")) candidates(dir, parse().entries);
  else if (a.includes("--verify")) await verify();
  else {
    const F = check(parse().entries);
    for (const f of F) console.log("FAIL", f);
    if (F.length) { console.log(`formal: ${F.length} failure(s)`); process.exit(1); }
    console.log(`formal: PASS (${FORMAL.length} links to Mathlib at ${MATHLIB.commit.slice(0, 7)}, ${new Set(FORMAL.map((k) => k.entry)).size} entries)`);
  }
}
