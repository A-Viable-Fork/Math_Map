// Role: the kit's own integrity in a consuming repository (FUNCTIONS.md F6). Every vendored file under
//   .infra/ matches its hash in infra.lock.json, unless the lock names it as a divergence; nothing
//   unrecorded sits in .infra/.
// Contract: runs only where infra.lock.json exists. The lock has the shape of the epistack substrate lock
//   (A-Viable-Fork/physics upstream/lock.json): upstream, commit_hash, acquisition_date, provisional,
//   repin_obligation, extraction, extracted_files { path: sha256 }, divergences [{ file, change,
//   rationale }]. A divergence must name a vendored file, state its change and rationale, actually differ
//   from the locked hash, and carry the marker "infra divergence" in the file itself. A 0.1 lock
//   (files, commit, version) still verifies, with a warning to re-vendor.
//   Anchoring (F19): with --online, or --anchor DIR naming a clone of Repo-Infrastructure, the lock itself
//   is checked against kit/ at its commit_hash in Repo-Infrastructure's history (lib/anchor.mjs, from the
//   canonical remote, never the lock's own url): every locked hash must be the hash there, and no file
//   there may be missing from the lock. A re-locked local edit passes the tree-only check and fails here.
//   Config `checks.kit.anchor`: "best-effort" (default; an anchor that cannot be reached is a warning) or
//   "required" (it is an ERROR). Offline without --anchor the pin is checked against the tree alone.
//   This check runs from the vendored copy, so it is a tripwire; the authority is tools/verify-pin.mjs run
//   from Repo-Infrastructure's own tree (CONTRACT.md, trusted base).
// Invariant: read-only; hashes are recomputed from disk every run.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { result, errored, sha256 } from "../lib/core.mjs";
import { anchorKit } from "../lib/anchor.mjs";

const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
export default function kit(root, cfg = {}, opts = {}) {
  const lockPath = join(root, "infra.lock.json");
  if (!existsSync(lockPath)) return { ...result("kit", [], "no infra.lock.json (the kit repository itself)"), skipped: true };
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  const mode = cfg.anchor || "best-effort";
  if (!["best-effort", "required"].includes(mode)) return errored("kit", `checks.kit.anchor is "${mode}"; use "best-effort" or "required"`);
  const fails = [], warnings = [];
  const legacy = !lock.extracted_files && lock.files;
  const files = lock.extracted_files || lock.files || {};
  const commit = lock.commit_hash || lock.commit || "";
  if (legacy) warnings.push("infra.lock.json has the 0.1 shape; re-vendor to move to the substrate lock shape");
  const div = new Map((lock.divergences || []).map((d) => [d.file, d]));
  for (const [f, d] of div) {
    if (!(f in files)) fails.push(`divergence names ${f}, which is not a vendored file`);
    if (!d.change || !d.rationale) fails.push(`divergence ${f}: states no change or no rationale`);
  }
  const dir = join(root, ".infra");
  const present = existsSync(dir) ? walk(dir).map((p) => relative(dir, p).split("\\").join("/")) : [];
  for (const [f, h] of Object.entries(files)) {
    const p = join(dir, f);
    if (!existsSync(p)) { fails.push(`.infra/${f}: in the lock, missing`); continue; }
    const same = sha256(readFileSync(p)) === h;
    if (div.has(f)) {
      if (same) fails.push(`.infra/${f}: declared a divergence but matches the kit; remove the divergence`);
      else if (!readFileSync(p, "utf8").includes("infra divergence")) fails.push(`.infra/${f}: diverges without the "infra divergence" marker at the change`);
    } else if (!same) fails.push(`.infra/${f}: differs from kit ${lock.version || "?"} (${commit.slice(0, 7)}) and is not a declared divergence`);
  }
  for (const f of present) if (!(f in files)) fails.push(`.infra/${f}: not in the lock`);
  let anchor = ", not anchored (offline)";
  if (opts.online || opts.anchor) {
    const a = anchorKit(commit, opts.anchor ? { dir: opts.anchor } : {});
    const at = `kit/ at ${commit.slice(0, 7)}`;
    if (!a.ok) {
      if (mode === "required") return errored("kit", `the pin could not be anchored: ${a.reason}`);
      warnings.push(`the pin could not be anchored (${a.reason}); it rests on this tree's own lock`);
      anchor = ", anchor unreachable";
    } else {
      for (const [f, h] of Object.entries(files)) {
        if (!(f in a.files)) fails.push(`the lock names ${f}, which ${at} does not hold`);
        else if (a.files[f] !== h) fails.push(`the lock's hash for ${f} is not the hash in ${at}: the lock was edited after vendoring`);
      }
      for (const f of Object.keys(a.files)) if (!(f in files)) fails.push(`${at} holds ${f}, which the lock omits`);
      anchor = `, anchored in Repo-Infrastructure`;
    }
  }
  if (lock.provisional) warnings.push(`the kit pin is provisional: ${lock.repin_obligation || "no obligation stated"}`);
  return result("kit", fails, `kit ${lock.version || "?"} at ${commit.slice(0, 7)}, ${Object.keys(files).length} files${div.size ? `, ${div.size} divergence(s)` : ""}${anchor}`, warnings);
}
