// Role: the excerpt maker. Fetches a source, checks that each requested window occurs in it verbatim, and
//   writes an excerpt file in the form receipts point into (excerpts/*.txt).
// Contract: `node scripts/excerpt.mjs --out excerpts/NAME.txt --title "Wikipedia, X (page source; CC BY-SA)"
//   (--wiki "Page_title" | --url URL) --window "..." [--window "..."]`. --wiki pins the page's current
//   revision (its oldid), so the URL keeps serving the same text; when the query API refuses (rate limit), the
//   revision is read from the article page's wgCurRevisionId. `--append --out excerpts/NAME.txt --window "..."`
//   adds windows to an existing file: it refetches the file's own URL, refuses unless the source still hashes
//   to the recorded SHA-256, and keeps every window already there. Exit 1, writing nothing, if any window is
//   not found verbatim. Network; maintenance only.
// Invariant: an excerpt file holds only verbatim windows of the source it names, with the hash of the
//   source as fetched.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const a = process.argv.slice(2), one = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
let windows = a.flatMap((x, i) => (x === "--window" ? [a[i + 1]] : []));
const out = one("--out"), append = a.includes("--append");
const sha = (t) => createHash("sha256").update(t).digest("hex");
const UA = { headers: { "user-agent": "math-map-excerpt/0.1" } };
let title = one("--title"), url = one("--url"), prior = null;
if (append) {
  if (!out || !existsSync(join(ROOT, out)) || !windows.length) { console.log("excerpt: --append needs an existing --out and at least one --window"); process.exit(1); }
  const t = readFileSync(join(ROOT, out), "utf8");
  title = t.match(/^Excerpts, verbatim, from: (.*)$/m)?.[1]; url = t.match(/^URL: (\S+)$/m)?.[1];
  prior = { hash: t.match(/SHA-256 of the page source as fetched: ([0-9a-f]{64})/)?.[1], fetched: t.match(/^Fetched: (\d{4}-\d{2}-\d{2})/m)?.[1],
    windows: t.split("\n\n").slice(2).map((w) => w.replace(/\n$/, "")).filter((w) => w.length) };
  if (!title || !url || !prior.hash) { console.log(`excerpt: ${out} lacks a title, URL or page hash; it cannot be appended to`); process.exit(1); }
} else if (!out || !title || !windows.length || !(one("--wiki") || one("--url"))) { console.log("excerpt: needs --out, --title, --wiki or --url, and at least one --window"); process.exit(1); }
if (!append && existsSync(join(ROOT, out))) { console.log(`excerpt: ${out} exists; use --append to add windows`); process.exit(1); }
if (!append && one("--wiki")) {
  const t = one("--wiki");
  let revid = null;
  try { const q = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids&format=json&titles=${encodeURIComponent(t)}`, UA)).json(); const page = Object.values(q.query.pages)[0]; revid = page.revisions?.[0]?.revid ?? null; if (!page.revisions) { console.log(`excerpt: no page ${t}`); process.exit(1); } }
  catch { const h = await (await fetch(`https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, "_"))}`, UA)).text(); revid = h.match(/"wgCurRevisionId":(\d+)/)?.[1] ?? null; if (h.includes('"wgIsRedirect":true')) { console.log(`excerpt: ${t} is a redirect; name the target page`); process.exit(1); } }
  if (!revid) { console.log(`excerpt: could not pin a revision of ${t}`); process.exit(1); }
  url = `https://en.wikipedia.org/w/index.php?action=raw&oldid=${revid}`;
}
const r = await fetch(url, UA);
if (!r.ok) { console.log(`excerpt: HTTP ${r.status} for ${url}`); process.exit(1); }
const text = await r.text();
if (append && sha(text) !== prior.hash) { console.log(`excerpt: ${url} no longer hashes to the recorded ${prior.hash.slice(0, 12)}; make a new excerpt file`); process.exit(1); }
const missing = windows.filter((w) => !text.includes(w));
if (missing.length) { for (const w of missing) console.log(`NOT FOUND: ${w.slice(0, 80)}`); process.exit(1); }
if (append) windows = [...prior.windows, ...windows.filter((w) => !prior.windows.includes(w))];
const date = new Date().toISOString().slice(0, 10);
writeFileSync(join(ROOT, out), [`Excerpts, verbatim, from: ${title}`, `URL: ${url}`,
  `Fetched: ${append && prior.fetched !== date ? `${prior.fetched}, appended ${date}` : date}. SHA-256 of the page source as fetched: ${sha(text)}`,
  "Only the windows below are kept; each was checked to occur verbatim in the page source.", "", ...windows.flatMap((w) => [w, ""])].join("\n"));
console.log(`excerpt: wrote ${out} (${windows.length} windows from ${url})`);
