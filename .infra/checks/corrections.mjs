// Role: corrections (FUNCTIONS.md F12). A claim already made is replaced on the record: the superseded
//   text, its replacement, the reason and the source that carried it in, with an optional receipt at a
//   pinned commit of another repository.
// Contract: config `corrections: { file, export }` (default corrections/corrections.js exporting
//   CORRECTIONS, the shape of A-Viable-Fork/phone and constitutional_kernel). Each correction: id, date,
//   status (proposed, accepted, withdrawn), file, superseded, text, reason, source, receipt? { repo,
//   commit, path, quote }. Accepted: text occurs verbatim in file and superseded does not. Proposed:
//   superseded still occurs. source exists. With --online each receipt's quote is fetched at its commit
//   (whitespace-normalized) and a failed quote fails. The report is rendered by
//   .infra/tools/corrections-report.mjs and kept fresh by the freshness check.
// Invariant: read-only.
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { result } from "../lib/core.mjs";

export function loadCorrections(root, cfg = {}) {
  const p = join(root, cfg.file || "corrections/corrections.js");
  if (!existsSync(p)) return null;
  const req = createRequire(join(root, "noop.js"));
  delete req.cache[req.resolve(p)];
  return req(p)[cfg.export || "CORRECTIONS"] || [];
}
const norm = (s) => s.replace(/\s+/g, " ").trim();
export default async function corrections(root, cfg = {}, opts = {}) {
  const list = loadCorrections(root, cfg);
  if (!list) return result("corrections", [`${cfg.file || "corrections/corrections.js"}: missing`], "");
  const fails = [], ids = new Set(); let quoted = 0;
  for (const c of list) {
    if (ids.has(c.id)) fails.push(`${c.id}: duplicate id`); ids.add(c.id);
    for (const k of ["id", "date", "status", "file", "superseded", "text", "reason", "source"]) if (!c[k]) fails.push(`${c.id || "(no id)"}: missing ${k}`);
    if (!["proposed", "accepted", "withdrawn"].includes(c.status)) fails.push(`${c.id}: status ${c.status}`);
    if (c.source && !existsSync(join(root, c.source))) fails.push(`${c.id}: source ${c.source} missing`);
    if (!c.file || !existsSync(join(root, c.file))) { fails.push(`${c.id}: ${c.file} missing`); continue; }
    const t = readFileSync(join(root, c.file), "utf8");
    if (c.status === "accepted") {
      if (!t.includes(c.text)) fails.push(`${c.id}: accepted text not found verbatim in ${c.file}`);
      if (t.includes(c.superseded)) fails.push(`${c.id}: superseded text still in ${c.file}`);
    }
    if (c.status === "proposed" && !t.includes(c.superseded)) fails.push(`${c.id}: superseded text no longer in ${c.file}`);
    if (c.receipt) {
      for (const k of ["repo", "commit", "path", "quote"]) if (!c.receipt[k]) fails.push(`${c.id}: receipt missing ${k}`);
      if (opts.online && c.receipt.repo) {
        const { repo, commit, path, quote } = c.receipt;
        try {
          const r = await fetch(`https://raw.githubusercontent.com/${repo}/${commit}/${path}`);
          if (!r.ok) fails.push(`${c.id}: receipt HTTP ${r.status}`);
          else if (!norm(await r.text()).includes(norm(quote))) fails.push(`${c.id}: receipt quote not found at ${repo}@${commit.slice(0, 7)}`);
          else quoted++;
        } catch (e) { fails.push(`${c.id}: receipt fetch failed (${e.cause?.code || e.message})`); }
      }
    }
  }
  return result("corrections", fails, `${list.length} corrections${quoted ? `, ${quoted} receipts quoted online` : ""}`);
}
