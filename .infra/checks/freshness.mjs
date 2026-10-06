// Role: generated files stay fresh (FUNCTIONS.md F8). Each generated file is exactly what its generator
//   writes now; a hand edit or a forgotten regeneration fails.
// Contract: config `freshness: { outputs: [{ path, command }] }`. The working tree (tracked and untracked,
//   not ignored) is copied to a temporary directory and staged in a fresh git index there, each command
//   runs there with a shell, and each
//   output is compared byte for byte with the repository's copy. A differing or missing output FAILs; a
//   command that exits nonzero is an ERROR for the whole check.
// Invariant: read-only on the repository: generators run only in the temporary copy.
import { mkdtempSync, cpSync, readFileSync, existsSync, rmSync, mkdirSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { result, errored } from "../lib/core.mjs";

export default function freshness(root, cfg = {}) {
  const outputs = cfg.outputs || [];
  if (!outputs.length) return result("freshness", [], "no outputs declared");
  const tmp = mkdtempSync(join(tmpdir(), "infra-fresh-"));
  try {
    const files = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, maxBuffer: 1 << 28 })
      .toString().split("\0").filter(Boolean);
    for (const f of new Set(files)) {
      if (!existsSync(join(root, f))) continue;
      mkdirSync(dirname(join(tmp, f)), { recursive: true });
      cpSync(join(root, f), join(tmp, f));
    }
    // Generators often list files through git, so the copy is made a repository with the same index.
    execFileSync("git", ["init", "-q"], { cwd: tmp });
    execFileSync("git", ["add", "-A"], { cwd: tmp, maxBuffer: 1 << 28 });
    for (const c of new Set(outputs.map((o) => o.command))) {
      const r = spawnSync(c, { cwd: tmp, shell: true, stdio: ["ignore", "pipe", "pipe"] });
      if (r.status !== 0) return errored("freshness", `"${c}" exited ${r.status}: ${(r.stderr || "").toString().trim().split("\n").pop() || ""}`);
    }
    const fails = [];
    for (const o of outputs) {
      const mine = join(root, o.path), fresh = join(tmp, o.path);
      if (!existsSync(fresh)) fails.push(`${o.path}: "${o.command}" did not write it`);
      else if (!existsSync(mine)) fails.push(`${o.path}: not committed; run "${o.command}"`);
      else if (!readFileSync(mine).equals(readFileSync(fresh))) fails.push(`${o.path}: stale; run "${o.command}"`);
    }
    return result("freshness", fails, `${outputs.length} generated file(s)`);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}
