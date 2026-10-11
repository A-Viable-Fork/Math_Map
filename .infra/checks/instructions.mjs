// Role: shared instructions (FUNCTIONS.md F22). An agent starting work in the repository reads the
//   conventions every repository shares, because the repository's instruction file imports them.
// Contract: config `instructions: { file = "CLAUDE.md", import = ".infra/CONVENTIONS.md", maxLines = 200 }`.
//   Fails when the file is missing, when it has no `@<import>` line outside code spans and fenced blocks
//   (Claude Code skips imports there), or when the imported file is missing. Warns when the file is longer
//   than maxLines, the length Claude Code's documentation advises against (2026-10-07). The import path
//   resolves against the file's own directory, as Claude Code resolves it.
// Invariant: read-only.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { result } from "../lib/core.mjs";

/** The text with fenced blocks and code spans removed, where Claude Code does not read an import. */
export function importable(text) {
  return text.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, "").replace(/`[^`\n]*`/g, "");
}

/** The paths a text imports, as written after `@`. */
export function imports(text) {
  return [...importable(text).matchAll(/(?:^|\s)@((?:\\ |[^\s`])+)/g)].map((m) => m[1].replace(/\\ /g, " ").replace(/[.,;:)]+$/, ""));
}

export default function instructions(root, cfg = {}) {
  const file = cfg.file || "CLAUDE.md", want = cfg.import || ".infra/CONVENTIONS.md", max = cfg.maxLines ?? 200;
  const p = join(root, file);
  if (!existsSync(p)) return result("instructions", [`${file} is missing: write one that imports @${want}, then the repository's own rules`], "no file");
  const text = readFileSync(p, "utf8"), base = dirname(file), fails = [], warnings = [];
  const target = normalize(want);
  const got = imports(text).map((i) => normalize(join(base, i)));
  if (!got.includes(target)) fails.push(`${file} does not import @${want} (an import in a code span or fenced block does not count)`);
  if (!existsSync(join(root, target))) fails.push(`${want} is missing: vendor the kit (node tools/vendor.mjs --into .) or fix the import path`);
  const lines = text.split("\n").length;
  if (lines > max) warnings.push(`${file} is ${lines} lines; past ${max} an instruction file is followed less reliably`);
  return result("instructions", fails, `${file}, ${lines} lines, imports ${got.length}`, warnings);
}
