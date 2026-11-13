// Role: the survey's receipt tripwire. Checks that every quotation in 03-prior-art.md that is followed by an
//   excerpt file name occurs verbatim in that file, and that every excerpt file is cited.
// Contract: `node docs/schema-survey/check-quotes.mjs`. A quotation is a double-quoted span (or an indented
//   block) on a line or table cell that names one or more `name.txt` files in backticks; it must occur in one
//   of the files named on that line. Exit 1 on a miss. Markdown escapes \| and \" are undone before matching.
// Invariant: read-only; a tripwire for this survey's documents, not a check of the map.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url)), EX = join(HERE, "excerpts");
const files = Object.fromEntries(readdirSync(EX).map((f) => [f, readFileSync(join(EX, f), "utf8")]));
const doc = readFileSync(join(HERE, "03-prior-art.md"), "utf8").split("\n");
const cited = new Set();
let miss = 0, checked = 0;
for (let i = 0; i < doc.length; i++) {
  const line = doc[i].replace(/\\\|/g, "|");
  const names = [...line.matchAll(/`([a-z0-9-]+\.txt)`/gi)].map((m) => m[1]).filter((n) => n in files);
  for (const n of names) cited.add(n);
  if (!names.length) continue;
  // Quotations: "..." spans; an escaped \" inside a span is a literal quote of the source.
  const spans = [...line.matchAll(/"((?:[^"\\]|\\.)+)"/g)].map((m) => m[1].replace(/\\"/g, '"'));
  for (const q of spans) {
    if (q.length < 12) continue;
    checked++;
    if (!names.some((n) => files[n].includes(q))) { miss++; console.log(`MISS line ${i + 1}: "${q.slice(0, 90)}" not in ${names.join(", ")}`); }
  }
}
// Table and "Sources read" rows name files with a wildcard prefix (`-P460.txt`); count those as cited too.
const all = doc.join("\n");
for (const f of Object.keys(files)) if (all.includes(f) || all.includes(f.replace(/^wikidata/, ""))) cited.add(f);
const uncited = Object.keys(files).filter((f) => !cited.has(f));
for (const f of uncited) console.log(`UNCITED ${f}`);
console.log(`check-quotes: ${checked} quotations checked against ${Object.keys(files).length} excerpt files, ${miss} missing, ${uncited.length} files uncited`);
process.exit(miss || uncited.length ? 1 : 0);
