// Role: the kit pin's out-of-tree anchor (FUNCTIONS.md F19). Reads the kit as it stands at the lock's
//   commit in Repo-Infrastructure's own history, so a pin is checked against something the consuming tree
//   does not hold.
// Contract: anchorKit(commit, { dir } | { url }) reads kit/ at `commit` from a local clone of
//   Repo-Infrastructure (`dir`; a commit missing from a shallow clone is fetched from its origin) or from a
//   remote (`url`, fetched at depth 1 into a temporary repository). Returns { ok: true, files: { path:
//   sha256 } } with paths relative to kit/, or { ok: false, reason } when git cannot produce the commit (no
//   network, no access, unknown commit). Never throws. CANONICAL is the remote the in-tree check uses; a
//   lock's own upstream url is never trusted for this, since the lock is what is being checked.
// Invariant: read-only on every repository; writes only a temporary directory it removes.
import { mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sha256 } from "./core.mjs";

export const CANONICAL = "https://github.com/A-Viable-Fork/Repo-Infrastructure.git";
const git = (cwd, ...a) => execFileSync("git", a, { cwd, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 28,
  env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
const why = (e) => ((e.stderr || "").toString().trim().split("\n").pop() || e.message).slice(0, 200);

export function anchorKit(commit, { dir, url } = {}) {
  if (!/^[0-9a-f]{40}$/.test(commit || "")) return { ok: false, reason: `the lock names no full commit hash (${commit || "none"})` };
  let tmp = null;
  try {
    if (dir) {
      try { git(dir, "cat-file", "-e", `${commit}^{commit}`); }
      catch { git(dir, "fetch", "-q", "--depth", "1", "origin", commit); }
    } else {
      tmp = mkdtempSync(join(tmpdir(), "infra-anchor-"));
      git(tmp, "init", "-q");
      git(tmp, "fetch", "-q", "--depth", "1", url || CANONICAL, commit);
      dir = tmp;
    }
    const paths = git(dir, "ls-tree", "-r", "-z", "--name-only", commit, "kit/").toString().split("\0").filter(Boolean);
    if (!paths.length) return { ok: false, reason: `commit ${commit.slice(0, 7)} has no kit/` };
    const files = {};
    for (const p of paths) files[p.slice("kit/".length)] = sha256(git(dir, "cat-file", "blob", `${commit}:${p}`));
    return { ok: true, files };
  } catch (e) {
    return { ok: false, reason: why(e) };
  } finally {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
  }
}
