// Role: self-description (FUNCTIONS.md F9). Every code file says what it is for, in a header the
//   repository map and the inventory read.
// Contract: config `headers: { include: [globs], exclude: [globs], require: "role" | "any" }`. Default
//   include: code files (js, mjs, cjs, py, sh) under scripts/, build/, checks/, tools/, bin/. "role"
//   (default) requires a `Role:` field in the leading comment block or Python docstring; "any" accepts any
//   header. Reports each file without one.
// Invariant: read-only.
import { listFiles, read, result } from "../lib/core.mjs";
import { header, fields } from "../lib/headers.mjs";

const DEFAULT = ["scripts/**", "build/**", "checks/**", "tools/**", "bin/**"];
export default function headers(root, cfg = {}) {
  const files = listFiles(root, { ext: /\.(js|mjs|cjs|py|sh)$/, include: cfg.include || DEFAULT, exclude: cfg.exclude || [] });
  const need = cfg.require || "role";
  const fails = [];
  for (const f of files) {
    const h = header(read(root, f), (f.match(/\.([a-z]+)$/) || [, ""])[1]);
    if (!h) fails.push(`${f}: no header`);
    else if (need === "role" && !fields(h).role) fails.push(`${f}: header has no Role`);
  }
  return result("headers", fails, `${files.length} code files, ${need === "role" ? "Role required" : "any header"}`);
}
