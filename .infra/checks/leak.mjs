// Role: the leak check. Keeps out of a repository what must never land in it: secrets, device and personal
//   identifiers, and values the owner names, without the list of those values revealing anything.
// Contract: config `leak: { exclude, patterns, emailAllow, allowFile, terms, denylist: { file, keyEnv,
//   keyFile } }`.
//   - patterns: names from PATTERNS below (default: all). Exact strings that trip a pattern wrongly go in
//     allowFile, one per line.
//   - emailAllow: regex strings for addresses that may appear (default: noreply addresses).
//   - terms: plain words or phrases that must not appear (matched at a word start, case-insensitive), for a
//     repository whose concern is an outbound direction (nothing of a private layer in a public tree).
//   - denylist: HMAC-SHA256 digests, keyed by an environment variable (or a key file outside the
//     repository), of values that must never appear. Every token, digit run and two- or three-word phrase of
//     each file is hashed and compared. With no key the layer is skipped with a notice.
// Invariant: read-only. Generalized from A-Viable-Fork/phone scripts/leak-check.mjs (2026-10-02).
import { readFileSync, existsSync } from "node:fs";
import { createHmac } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";
import { listFiles, read, result } from "../lib/core.mjs";

const luhn = (s) => { let sum = 0; for (let i = 0; i < s.length; i++) { let d = +s[s.length - 1 - i]; if (i % 2) { d *= 2; if (d > 9) d -= 9; } sum += d; } return sum % 10 === 0; };
export const PATTERNS = {
  "private-key": (l) => l.match(/-----BEGIN [A-Z ]*PRIVATE KEY-----/g),
  "github-token": (l) => l.match(/\b(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g),
  "aws-key": (l) => l.match(/\bAKIA[0-9A-Z]{16}\b/g),
  "api-key": (l) => l.match(/\bsk-[A-Za-z0-9_-]{20,}\b/g),
  "mac": (l) => l.match(/\b[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){5}\b/g),
  "phone-nanp": (l) => l.match(/(?<![\w.])(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?![\w.])/g),
  "imei": (l) => (l.match(/(?<!\d)\d{15}(?!\d)/g) || []).filter(luhn),
  "email": null, // handled with emailAllow below
};
const DEFAULT_EMAIL_OK = ["^noreply@anthropic\\.com$", "^noreply@github\\.com$", "^[\\w.-]+@users\\.noreply\\.github\\.com$"];

const expand = (p) => (p && p.startsWith("~/") ? join(homedir(), p.slice(2)) : p);
export function leakKey(den = {}) {
  if (den.keyEnv && process.env[den.keyEnv]) return process.env[den.keyEnv];
  const p = expand(den.keyFile);
  return p && existsSync(p) ? readFileSync(p, "utf8").trim() : null;
}
export const digest = (key, v) => createHmac("sha256", key).update(v.toLowerCase()).digest("hex");
export const normalize = (v) => (/^[\d\s().+-]+$/.test(v) ? v.replace(/\D/g, "") : v.toLowerCase());
export function candidates(text) {
  const out = new Set();
  const words = text.toLowerCase().match(/[\p{L}\p{N}@._+'-]+/gu) || [];
  for (let i = 0; i < words.length; i++) {
    const w = words[i].replace(/^[._'-]+|[._'-]+$/g, "");
    if (w) out.add(w);
    if (i + 1 < words.length) out.add(`${w} ${words[i + 1]}`);
    if (i + 2 < words.length) out.add(`${w} ${words[i + 1]} ${words[i + 2]}`);
  }
  for (const m of text.matchAll(/\+?\d[\d\s().-]{5,}\d/g)) out.add(m[0].replace(/\D/g, ""));
  return out;
}

const lines = (root, f) => (f && existsSync(join(root, f)) ? read(root, f).split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")) : []);

export default function leak(root, cfg = {}) {
  const den = cfg.denylist || {};
  const exclude = [...(cfg.exclude || []), ...(den.file ? [den.file] : [])];
  const files = listFiles(root, { exclude });
  const names = cfg.patterns || Object.keys(PATTERNS);
  for (const n of names) if (!(n in PATTERNS)) throw new Error(`leak: unknown pattern "${n}"`);
  const allow = new Set(lines(root, cfg.allowFile));
  const emailOk = (cfg.emailAllow || DEFAULT_EMAIL_OK).map((r) => new RegExp(r, "i"));
  const terms = (cfg.terms || []).map((t) => [t, new RegExp(`(?<![\\p{L}\\p{N}])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "iu")]);
  const key = leakKey(den);
  const deny = new Set(lines(root, den.file).map((l) => l.split(/\s/)[0]));
  const fails = [];
  for (const f of files) {
    const t = read(root, f);
    t.split("\n").forEach((l, i) => {
      const at = `${f}:${i + 1}`;
      for (const n of names) {
        if (n === "email") { for (const m of l.matchAll(/[\w.+-]+@[\w-]+\.[\w.-]*\w/g)) if (!emailOk.some((r) => r.test(m[0])) && !allow.has(m[0])) fails.push(`${at}: e-mail address`); continue; }
        for (const m of PATTERNS[n](l) || []) if (!allow.has(m)) fails.push(`${at}: ${n}`);
      }
      for (const [t0, re] of terms) if (re.test(l)) fails.push(`${at}: term "${t0}"`);
    });
    if (key && deny.size) for (const c of candidates(t)) if (deny.has(digest(key, c))) fails.push(`${f}: a denylisted value`);
  }
  const layer = !deny.size ? "denylist empty" : key ? `${deny.size} denylisted values checked` : `denylist SKIPPED: no key (${den.keyEnv || "keyEnv unset"})`;
  return result("leak", [...new Set(fails)], `${files.length} files; ${names.length} patterns${terms.length ? `, ${terms.length} terms` : ""}; ${layer}`);
}
