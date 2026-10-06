// Role: adds a value to a repository's leak denylist without writing the value anywhere.
// Contract: `node .infra/tools/leak-add.mjs [--kind LABEL]` prompts for the value on stdin and appends its
//   HMAC-SHA256 digest, under the key infra.json's leak.denylist names, to the denylist file. A phone-like
//   value is stored as its digits; anything else lower-cased. Exit 1 with no key or no denylist configured.
// Invariant: the plain value never touches disk or git; the key never enters the repository.
import { appendFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../lib/core.mjs";
import { leakKey, digest, normalize } from "../checks/leak.mjs";

const root = resolve(join(dirname(fileURLToPath(import.meta.url)), "../.."));
const den = (loadConfig(root).checks?.leak || {}).denylist;
if (!den?.file) { console.log("infra.json has no leak.denylist.file."); process.exit(1); }
const key = leakKey(den);
if (!key) { console.log(`No key. Set ${den.keyEnv || "the keyEnv variable"}${den.keyFile ? ` or write one to ${den.keyFile}` : ""}, outside this repository.`); process.exit(1); }
const a = process.argv.slice(2), k = a.indexOf("--kind");
const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.question("Value to deny: ", (v) => {
  rl.close();
  v = v.trim(); if (!v) process.exit(1);
  appendFileSync(join(root, den.file), `${digest(key, normalize(v))}${k >= 0 ? ` ${a[k + 1]}` : ""}\n`);
  console.log(`Added one digest to ${den.file}.`);
});
