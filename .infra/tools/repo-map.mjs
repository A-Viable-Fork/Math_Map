// Role: writes the repository map the repomap check verifies (FUNCTIONS.md F9).
// Contract: `node .infra/tools/repo-map.mjs [--root DIR]` (in Repo-Infrastructure itself, `node
//   kit/tools/repo-map.mjs`). Reads `checks.repomap` from infra.json, writes the map, and lists every
//   description failure; exits 1 when there is one, after writing, so the map can be read while it is fixed.
// Invariant: writes only the map file.
import { writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../lib/core.mjs";
import { mapState } from "../lib/repomap.mjs";

const a = process.argv.slice(2), r = a.indexOf("--root");
const root = resolve(r >= 0 ? a[r + 1] : join(dirname(fileURLToPath(import.meta.url)), "..", ".."));
const c = (loadConfig(root).checks || {}).repomap;
const { failures, text, out } = mapState(root, c === true || !c ? {} : c);
writeFileSync(join(root, out), text);
for (const f of failures) console.log(`FAIL ${f}`);
console.log(`wrote ${out}${failures.length ? `; ${failures.length} description failure(s)` : ""}`);
process.exit(failures.length ? 1 : 0);
