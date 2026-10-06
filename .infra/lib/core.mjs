// Role: shared plumbing for every kit check: the consumer's config, its file list, glob matching, hashing.
// Contract: loadConfig(root) reads infra.json; listFiles(root, {ext, include, exclude}) returns repository-
//   relative paths git tracks or sees as untracked (not ignored); glob(pattern) compiles a path glob
//   (`**` any depth, `*` one segment, `?` one character) to a RegExp; sha256(buffer) hex.
// Invariant: read-only; no dependencies beyond Node 22.
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join } from "node:path";

export const TEXT_EXT = /\.(md|js|mjs|cjs|json|yml|yaml|txt|py|sh|toml|lean|tex|bib)$/;

export function loadConfig(root) {
  const p = join(root, "infra.json");
  if (!existsSync(p)) throw new Error("no infra.json at the repository root");
  return JSON.parse(readFileSync(p, "utf8"));
}

export function glob(pattern) {
  let re = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    if (c === "*" && pattern[i + 1] === "*") { re += ".*"; i++; if (pattern[i + 1] === "/") i++; }
    else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${re}$`);
}

export const matcher = (patterns = []) => { const res = patterns.map(glob); return (f) => res.some((r) => r.test(f)); };

export function listFiles(root, { ext = TEXT_EXT, include = [], exclude = [] } = {}) {
  const all = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root })
    .toString().split("\0").filter(Boolean);
  const inc = include.length ? matcher(include) : () => true;
  const exc = matcher([".infra/**", ...exclude]);
  return [...new Set(all)].filter((f) => ext.test(f) && inc(f) && !exc(f) && existsSync(join(root, f)));
}

export const sha256 = (b) => createHash("sha256").update(b).digest("hex");
export const read = (root, f) => readFileSync(join(root, f), "utf8");
// The outcome protocol (FUNCTIONS.md F1, after Unset-Emerald's checklib.py): PASS 0, it ran and what it
// asserts holds; FAIL 1, it ran and found what it exists to catch; ERROR 2, it did not run, which says
// nothing about the tree and fails the gate. Warnings print and never fail.
export const PASS = "PASS", FAIL = "FAIL", ERROR = "ERROR";
export const EXIT = { PASS: 0, FAIL: 1, ERROR: 2 };
export const result = (name, fails, summary, warnings = []) =>
  ({ name, status: fails.length ? FAIL : PASS, ok: fails.length === 0, fails, warnings, summary });
export const errored = (name, message) => ({ name, status: ERROR, ok: false, fails: [message], warnings: [], summary: "did not run" });
