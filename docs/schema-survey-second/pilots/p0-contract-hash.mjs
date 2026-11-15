// Role: a side measurement for the schema survey (candidate G11, the contract hash). Hashes each entry's
//   contract (name, the five text fields, named invariants, actsOn) in map.json at two commits and reports
//   which entries' contracts moved between them.
// Contract: `node p0-contract-hash.mjs [old commit] [ids,...]`. Defaults: e1bcb83, the commit Research_OS's
//   bindings.json pins, and the four entries it binds. Reads the old map.json with `git show`; read-only.
// Invariant: the hash covers what a realization binds to and nothing else: evidence, tier, receipts and
//   bindings may change without moving it.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { ROOT, map } from "./lib.mjs";

const old = process.argv[2] ?? "e1bcb83", ids = (process.argv[3] ?? "D9-X07,D9-X20,D9-X28,D9-X29").split(",");
const FIELDS = ["name", "description", "input", "output", "preserved", "broken"];
const contract = (e) => JSON.stringify([FIELDS.map((f) => e[f] ?? null), e.invariants ?? null, e.actsOn ?? null]);
const hash = (e) => createHash("sha256").update(contract(e)).digest("hex").slice(0, 16);
const then = JSON.parse(execFileSync("git", ["-C", ROOT, "show", `${old}:map.json`], { maxBuffer: 1 << 28 }).toString());
const A = new Map(then.entries.map((e) => [e.id, e])), B = new Map(map().entries.map((e) => [e.id, e]));
for (const id of ids) { const a = A.get(id), b = B.get(id); console.log(`${id}: ${a ? hash(a) : "absent"} at ${old}, ${b ? hash(b) : "absent"} now: ${a && b && hash(a) === hash(b) ? "unchanged" : "MOVED"}`); }
let moved = 0, same = 0, added = 0; const movedIds = [];
for (const [id, b] of B) { const a = A.get(id); if (!a) added++; else if (hash(a) === hash(b)) same++; else { moved++; movedIds.push(id); } }
console.log(`p0: of ${B.size} entries now, ${same} have the contract they had at ${old}, ${moved} moved, ${added} are new since`);
console.log(`p0: moved: ${movedIds.slice(0, 40).join(", ")}${movedIds.length > 40 ? ", ..." : ""}`);
