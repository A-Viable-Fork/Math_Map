// Role: keeps landed sources verbatim. Each provenance manifest lists the files beside it with url, fetch
//   date, sha256 and rights; every file in that directory is listed; every hash matches.
// Contract: config `provenance: { manifests: [globs] }` (default `**/PROVENANCE.json`). Manifest shape:
//   `{ files: [{ path, work, url, fetched, sha256, rights }] }`, paths relative to the repository root.
//   --online re-fetches each url and reports upstream drift as a warning, never a failure or a repair.
//   A hash-only row (`landed: false`) records a source read but not held, because its rights are unstated or
//   forbid a copy: `{ landed: false, work, url, fetched, sha256, rights, reason }`, with no path. Offline it
//   is checked for its fields only; --online fetches the url and compares the hash, warning on drift
//   (FUNCTIONS.md section 5, item 3).
// Invariant: read-only. Generalized from A-Viable-Fork/tutor scripts/check-provenance.mjs (1908c47).
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { listFiles, read, result, sha256 } from "../lib/core.mjs";

const REQUIRED = ["path", "work", "url", "fetched", "sha256", "rights"];
const HASH_ONLY = ["work", "url", "fetched", "sha256", "rights", "reason"];
export default async function provenance(root, cfg = {}, opts = {}) {
  const manifests = listFiles(root, { ext: /PROVENANCE\.json$/, include: cfg.manifests || ["**/PROVENANCE.json"] });
  const fails = [], notes = []; let n = 0, h = 0;
  for (const m of manifests) {
    let prov; try { prov = JSON.parse(read(root, m)); } catch (e) { fails.push(`${m}: not JSON (${e.message})`); continue; }
    const dir = posix.dirname(m);
    const listed = new Set((prov.files || []).map((f) => f.path));
    for (const name of readdirSync(join(root, dir))) {
      const p = posix.join(dir, name);
      if (name !== posix.basename(m) && !listed.has(p)) fails.push(`${p}: not listed in ${m}`);
    }
    for (const f of prov.files || []) {
      if (f.landed === false) {
        h++;
        const at = `${m}: ${f.work || "(hash-only entry)"}`;
        for (const k of HASH_ONLY) if (!f[k]) fails.push(`${at} missing ${k}`);
        if (f.path) fails.push(`${at}: a hash-only row holds no file, so it names no path`);
        if (f.sha256 && !/^[0-9a-f]{64}$/.test(f.sha256)) fails.push(`${at}: sha256 is not a hex digest`);
        if (opts.online && f.url) {
          try { const r = await fetch(f.url); const d = sha256(Buffer.from(await r.arrayBuffer())); if (d !== f.sha256) notes.push(`${f.work}: the source now differs from the hash recorded when it was read`); }
          catch (e) { notes.push(`${f.work}: fetch failed (${e.message})`); }
        }
        continue;
      }
      n++;
      for (const k of REQUIRED) if (!f[k]) fails.push(`${m}: ${f.path || "(entry)"} missing ${k}`);
      if (!f.path) continue;
      const fp = join(root, f.path);
      if (!existsSync(fp)) { fails.push(`${f.path}: listed but missing`); continue; }
      if (sha256(readFileSync(fp)) !== f.sha256) fails.push(`${f.path}: hash mismatch (edited after landing?)`);
      if (opts.online && f.url) {
        try { const r = await fetch(f.url); const h = sha256(Buffer.from(await r.arrayBuffer())); if (h !== f.sha256) notes.push(`${f.path}: upstream now differs from the landed copy`); }
        catch (e) { notes.push(`${f.path}: fetch failed (${e.message})`); }
      }
    }
  }
  return result("provenance", fails, `${n} landed sources${h ? `, ${h} read but not landed` : ""} in ${manifests.length} manifest(s)`, notes);
}
