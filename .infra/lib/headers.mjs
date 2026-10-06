// Role: reads what a file says about itself. The leading comment block (or a Python module docstring)
//   and its Role, Contract, Invariant, Usage and Purpose fields; and a Markdown document's front matter.
// Contract: header(text, ext) returns the header text ("" if none); fields(header) returns the named
//   fields, continuation lines joined; frontMatter(text) returns { fields } or null, list values
//   (`[a, b]`) parsed to arrays.
// Invariant: pure functions; no file access.
export function header(text, ext) {
  const lines = text.split("\n");
  let i = 0; if (lines[0]?.startsWith("#!")) i++;
  const out = [];
  if (ext === "py") {
    while (i < lines.length && (lines[i].trim() === "" || (lines[i].startsWith("#") && !lines[i].startsWith("#!")))) { if (lines[i].startsWith("#")) out.push(lines[i].replace(/^#\s?/, "")); i++; }
    const doc = lines.slice(i).join("\n").match(/^\s*[rubfRUBF]*("""|''')([\s\S]*?)\1/);
    if (doc) out.push(...doc[2].split("\n"));
  } else {
    while (i < lines.length && /^\s*(\/\/|#|\/\*|\*)/.test(lines[i])) { out.push(lines[i].replace(/^\s*(\/\/+|#+|\/\*+|\*+\/?)\s?/, "")); i++; }
  }
  return out.join("\n").trim();
}

export function fields(h) {
  const f = {}; let cur = null;
  for (const l of h.split("\n")) {
    const m = l.match(/^(Role|Contract|Invariant|Usage|Purpose)\s*:\s*(.*)$/i);
    if (m) { cur = m[1].toLowerCase(); f[cur] = m[2]; } else if (cur && l.trim()) f[cur] += " " + l.trim();
  }
  for (const k of Object.keys(f)) f[k] = f[k].replace(/\s+/g, " ").trim();
  return f;
}

export function frontMatter(text) {
  const m = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z -]*?)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, "");
    out[kv[1]] = v;
  }
  return { fields: out };
}
