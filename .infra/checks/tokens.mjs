// Role: interface tokens (FUNCTIONS.md F18, UI.md). A stylesheet declares its colors as custom properties
//   on :root, in both themes, and the roles it uses as text stay legible on its surfaces. Generalized from
//   A-Viable-Fork/knowledge-game build/check-skins.mjs and api/skin-conformance.js.
// Contract: config `tokens: { files: [globs], surfaces: [roles], floor: 4.5, floors: { role: n },
//   pairs: [{ text, on, min }], roles: [names], themes: "both" | "one", motion: true, focus: true,
//   warn: false }`. Files are .css, or .html whose <style> blocks are read. Light tokens are :root (or
//   html) declarations outside a dark context; dark tokens are those under @media (prefers-color-scheme:
//   dark) or a [data-theme="dark"] selector, layered over the light ones. Text roles are the custom
//   properties a `color:` declaration takes through var(); each is checked against every surface role
//   (default paper, bg, surface, card-bg, where defined) in each theme present, except that a role named
//   on-X is checked against X only and a role that is itself a surface is skipped. `pairs` adds explicit
//   pairs. A translucent text color is blended over the surface; a translucent surface is a warning.
//   Fails on: a pair under its floor; a missing required role; themes "both" without a dark variant;
//   transitions, animations or smooth scrolling without a prefers-reduced-motion rule (motion); an
//   outline removed with no :focus or :focus-visible rule (focus; a stylesheet with controls and no focus
//   rule of its own, which leaves the browser's ring, is a warning). `warn: true` reports every failure as a
//   warning, so a repository adopts the check before it complies.
//   Messages name the variant: "base" is the :root values (light, or the only theme), "dark" the overlay.
// Invariant: read-only; contrast is WCAG 2 relative luminance, the same formula as the Knowledge-Game check.
import { listFiles, read, result } from "../lib/core.mjs";

const SURFACES = ["paper", "bg", "surface", "card-bg"];

export function hex(v) {
  const s = v.trim().toLowerCase();
  let m = s.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
    if (h.length !== 6 && h.length !== 8) return null;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1);
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
  if (!m) return null;
  const a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : +m[4];
  return [+m[1], +m[2], +m[3], a];
}
const lum = (c) => { const [r, g, b] = c.slice(0, 3).map((x) => x / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const blend = (fg, bg) => fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3])).concat(1);

// Top-level rules of a stylesheet as { prelude, body }, braces balanced.
function rules(css) {
  const out = []; let depth = 0, start = 0, open = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === "{") { if (depth++ === 0) open = i; }
    else if (css[i] === "}" && depth > 0 && --depth === 0) { out.push({ prelude: css.slice(start, open).trim(), body: css.slice(open + 1, i) }); start = i + 1; }
  }
  return out;
}

export function parse(text, isHtml) {
  let css = isHtml ? [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n") : text;
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const light = {}, dark = {};
  const walk = (src, inDark) => {
    for (const { prelude, body } of rules(src)) {
      if (prelude.startsWith("@media")) { walk(body, inDark || /prefers-color-scheme\s*:\s*dark/.test(prelude)); continue; }
      if (prelude.startsWith("@")) continue;
      if (!/(^|[\s,]):root\b|(^|[\s,])html\b/.test(prelude)) continue;
      const isDark = inDark || /data-theme=["']?dark/.test(prelude);
      for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+)/g)) (isDark ? dark : light)[m[1]] = m[2].trim();
    }
  };
  walk(css, false);
  const text_ = new Set([...css.matchAll(/(?<![\w-])color\s*:\s*var\(\s*--([\w-]+)/g)].map((m) => m[1]));
  return { css, light, dark, textRoles: text_ };
}

function resolve(tokens, name, seen = 0) {
  const v = tokens[name];
  if (v === undefined || seen > 8) return null;
  const m = v.match(/^var\(\s*--([\w-]+)\s*(?:,\s*(.+))?\)$/);
  if (m) return resolve(tokens, m[1], seen + 1) ?? (m[2] ? hex(m[2]) : null);
  return hex(v);
}

export default function tokens(root, cfg = {}) {
  const files = listFiles(root, { ext: /\.(css|html?)$/, include: cfg.files || [], exclude: cfg.exclude || [] });
  const floor = cfg.floor ?? 4.5, floors = cfg.floors || {}, themes = cfg.themes || "both";
  const fails = [], warnings = [];
  let pairs = 0;
  if (!(cfg.files || []).length) warnings.push("no files configured; nothing to check");
  for (const f of files) {
    const { css, light, dark, textRoles } = parse(read(root, f), /\.html?$/.test(f));
    if (!Object.keys(light).length && !Object.keys(dark).length) { fails.push(`${f}: no custom properties on :root`); continue; }
    for (const r of cfg.roles || []) if (!(r in light) && !(r in dark)) fails.push(`${f}: required role --${r} is not declared`);
    const hasLight = Object.keys(light).length > 0, hasDark = Object.keys(dark).length > 0;
    if (themes === "both" && !hasDark) fails.push(`${f}: no dark variant (prefers-color-scheme: dark or [data-theme="dark"])`);
    const variants = [];
    if (hasLight) variants.push(["base", light]);
    if (hasDark) variants.push(["dark", { ...light, ...dark }]);
    const surfaces = (cfg.surfaces || SURFACES).filter((s) => s in light || s in dark);
    const want = [];
    for (const t of textRoles) {
      if (surfaces.includes(t)) continue;
      const on = t.match(/^on-(.+)$/);
      if (on) { if (on[1] in light || on[1] in dark) want.push([t, on[1], floors[t]]); continue; }
      for (const s of surfaces) want.push([t, s, floors[t]]);
    }
    for (const p of cfg.pairs || []) want.push([p.text, p.on, p.min]);
    for (const [name, toks] of variants) {
      for (const [t, s, min] of want) {
        const fg = resolve(toks, t), bg = resolve(toks, s);
        if (!fg || !bg) continue;
        if (bg[3] < 1) { warnings.push(`${f}: ${name}: --${s} is translucent; --${t} on it not evaluated`); continue; }
        const c = contrast(fg[3] < 1 ? blend(fg, bg) : fg, bg), need = min ?? floor;
        pairs++;
        if (c < need) fails.push(`${f}: ${name}: --${t} on --${s} is ${c.toFixed(2)}:1, under ${need}:1`);
      }
    }
    if ((cfg.motion ?? true) && /(^|[\s;{])(transition|animation)\s*:|scroll-behavior\s*:\s*smooth/.test(css) && !/prefers-reduced-motion/.test(css))
      fails.push(`${f}: animates without a prefers-reduced-motion rule`);
    const focusRule = /:focus(-visible|-within)?\b/.test(css);
    if ((cfg.focus ?? true) && !focusRule) {
      const controls = /:hover\b/.test(css) || (/\.html?$/.test(f) && /<(button|input|select|textarea)\b/i.test(read(root, f)));
      if (/outline\s*:\s*(none|0)\b/.test(css)) fails.push(`${f}: removes the focus outline and has no :focus or :focus-visible rule`);
      else if (controls) warnings.push(`${f}: has interactive elements and no focus rule of its own (the browser default ring applies)`);
    }
  }
  const summary = `${files.length} stylesheet(s), ${pairs} text pair(s) at a ${floor}:1 floor`;
  if (cfg.warn) return result("tokens", [], `${summary}, warn only`, [...fails, ...warnings]);
  return result("tokens", fails, summary, warnings);
}
