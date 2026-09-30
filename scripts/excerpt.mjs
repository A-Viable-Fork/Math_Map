// Role: the excerpt maker. Fetches a source, checks that each requested window occurs in it verbatim, and
//   writes an excerpt file in the form receipts point into (excerpts/*.txt).
// Contract: `node scripts/excerpt.mjs --out excerpts/NAME.txt --title "Wikipedia, X (page source; CC BY-SA)"
//   (--wiki "Page_title" | --url URL) --window "..." [--window "..."]`. --wiki pins the page's current
//   revision (its oldid), so the URL keeps serving the same text. Exit 1, writing nothing, if any window is
//   not found verbatim. Network; maintenance only.
// Invariant: an excerpt file holds only verbatim windows of the source it names, with the hash of the
//   source as fetched.
import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const a = process.argv.slice(2), one = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
const windows = a.flatMap((x, i) => (x === "--window" ? [a[i + 1]] : []));
const out = one("--out"), title = one("--title");
if (!out || !title || !windows.length || !(one("--wiki") || one("--url"))) { console.log("excerpt: needs --out, --title, --wiki or --url, and at least one --window"); process.exit(1); }
const UA = { headers: { "user-agent": "math-map-excerpt/0.1" } };
let url = one("--url");
if (one("--wiki")) {
  const q = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids&format=json&titles=${encodeURIComponent(one("--wiki"))}`, UA)).json();
  const page = Object.values(q.query.pages)[0];
  if (!page.revisions) { console.log(`excerpt: no page ${one("--wiki")}`); process.exit(1); }
  url = `https://en.wikipedia.org/w/index.php?action=raw&oldid=${page.revisions[0].revid}`;
}
const r = await fetch(url, UA);
if (!r.ok) { console.log(`excerpt: HTTP ${r.status} for ${url}`); process.exit(1); }
const text = await r.text();
const missing = windows.filter((w) => !text.includes(w));
if (missing.length) { for (const w of missing) console.log(`NOT FOUND: ${w.slice(0, 80)}`); process.exit(1); }
const date = new Date().toISOString().slice(0, 10);
writeFileSync(join(ROOT, out), [`Excerpts, verbatim, from: ${title}`, `URL: ${url}`,
  `Fetched: ${date}. SHA-256 of the page source as fetched: ${createHash("sha256").update(text).digest("hex")}`,
  "Only the windows below are kept; each was checked to occur verbatim in the page source.", "", ...windows.flatMap((w) => [w, ""])].join("\n"));
console.log(`excerpt: wrote ${out} (${windows.length} windows from ${url})`);
