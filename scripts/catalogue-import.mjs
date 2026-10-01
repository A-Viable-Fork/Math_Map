// Role: imports the paper list of a sibling repository into catalogue/imports/NAME.json, bibliographic
//   fields and reading status only (id, title, authors, year, status). Sibling notes, node ids and source
//   paths are not copied: several siblings are private, and their structure stays there.
// Contract: `node scripts/catalogue-import.mjs --name NAME --kind (catalogue|sources|ids) --repo PATH
//   [--ids "arXiv ids, space-separated"]`. `catalogue`: the sibling keeps a catalogue JSON
//   (map/catalogue.json) with this repository's status vocabulary. `sources`: the sibling lands sources as
//   docs/sources/*/meta.json; a landed abstract counts as inspected-abstract and a landed body excerpt as
//   receipted. `ids`: arXiv ids given on the command line, status queued. Missing titles and authors are
//   fetched from the arXiv API. Network; maintenance only.
// Invariant: an import names its sibling's commit, so the list can be traced to the state it was taken from.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const a = process.argv.slice(2), one = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
const name = one("--name"), kind = one("--kind"), repo = one("--repo");
if (!name || !kind || !repo) { console.log("catalogue-import: needs --name, --kind and --repo"); process.exit(1); }
const commit = execFileSync("git", ["-C", repo, "rev-parse", "HEAD"]).toString().trim();
let papers = [];
if (kind === "catalogue") {
  for (const e of JSON.parse(readFileSync(join(repo, "map/catalogue.json"), "utf8")).entries)
    papers.push({ id: e.id, title: e.title, authors: e.authors, year: e.year, status: e.status, ...(e.alt_ids ? { alt_ids: e.alt_ids } : {}) });
} else if (kind === "sources") {
  const D = join(repo, "docs/sources");
  for (const d of readdirSync(D)) {
    const m = d.match(/^(?:abs|arxiv)-(.+)$/); if (!m) continue;
    let id = m[1].replace(/^(hep-th|gr-qc|astro-ph|quant-ph|hep-ph|math|cond-mat)-/, "$1/");
    id = "arxiv:" + id;
    const abs = existsSync(join(D, d, "abstract.txt")) ? readFileSync(join(D, d, "abstract.txt"), "utf8") : "";
    const field = (k) => (abs.match(new RegExp(`^${k}: (.*)$`, "m")) || [])[1];
    const status = d.startsWith("arxiv-") ? "receipted" : "inspected-abstract";
    const prev = papers.find((p) => p.id === id);
    if (prev) { if (status === "receipted") prev.status = status; continue; }
    papers.push({ id, title: field("Title"), authors: field("Authors"), year: field("Date") ? +field("Date").slice(0, 4) : undefined, status });
  }
} else if (kind === "ids") {
  for (const x of (one("--ids") || "").split(/\s+/).filter(Boolean)) papers.push({ id: "arxiv:" + x, status: "queued" });
} else { console.log(`catalogue-import: unknown kind ${kind}`); process.exit(1); }
const need = papers.filter((p) => p.id.startsWith("arxiv:") && (!p.title || !p.authors || !p.year));
for (let i = 0; i < need.length; i += 50) {
  const batch = need.slice(i, i + 50);
  const xml = await (await fetch(`https://export.arxiv.org/api/query?id_list=${batch.map((p) => p.id.slice(6)).join(",")}&max_results=50`)).text();
  for (const ent of xml.split("<entry>").slice(1)) {
    const id = (ent.match(/<id>https?:\/\/arxiv\.org\/abs\/([^<]+?)(v\d+)?<\/id>/) || [])[1]; if (!id) continue;
    const p = batch.find((q) => q.id === "arxiv:" + id); if (!p) continue;
    p.title ||= ent.match(/<title>([\s\S]*?)<\/title>/)[1].replace(/\s+/g, " ").trim();
    p.authors ||= [...ent.matchAll(/<name>([^<]+)<\/name>/g)].map((m) => m[1]).join(", ");
    p.year ||= +ent.match(/<published>(\d{4})/)[1];
  }
  await new Promise((r) => setTimeout(r, 3000));
}
papers.sort((x, y) => x.id.localeCompare(y.id));
writeFileSync(join(ROOT, `catalogue/imports/${name}.json`), JSON.stringify({ name, kind, commit, imported: new Date().toISOString().slice(0, 10), papers }, null, 1) + "\n");
console.log(`catalogue-import: ${name}: ${papers.length} papers from ${commit.slice(0, 7)}; ${papers.filter((p) => !p.title).length} without a title`);
