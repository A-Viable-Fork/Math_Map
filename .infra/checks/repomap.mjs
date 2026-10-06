// Role: the repository map stays complete and current (FUNCTIONS.md F9). Every file and directory is
//   described, and the committed map is exactly what the kit renders now.
// Contract: config `repomap: { out, manifest, edges }` (lib/repomap.mjs). Fails on every description
//   failure the map reports, and on a map that differs from a fresh render, or is missing; the map is
//   written by `node .infra/tools/repo-map.mjs`.
// Invariant: read-only; renders in memory.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { result } from "../lib/core.mjs";
import { mapState } from "../lib/repomap.mjs";

export default function repomap(root, cfg = {}) {
  const { failures, text, out } = mapState(root, cfg);
  const fails = [...failures];
  const p = join(root, out);
  if (!existsSync(p)) fails.push(`${out} is missing: run node .infra/tools/repo-map.mjs`);
  else if (readFileSync(p, "utf8") !== text) fails.push(`${out} is stale: run node .infra/tools/repo-map.mjs`);
  return result("repomap", fails, `${out}, ${text.split("\n").filter((l) => l.startsWith("| `")).length} rows`);
}
