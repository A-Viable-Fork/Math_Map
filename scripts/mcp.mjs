// Role: the map as a tool server. Serves map.json and the composition checker over the Model Context
//   Protocol (stdio, newline-delimited JSON-RPC 2.0), so a language model can query entries and check
//   chains instead of reading the map whole.
// Contract: `node scripts/mcp.mjs` serves on stdin/stdout. Tools: map_info, search_entries, get_entry,
//   list_invariants, compose_chain. Every answer carries the commit the map was built from, so a citation
//   names an exact version. `--selftest` runs each tool in process and exits 1 on any failure (check-all
//   runs it). Node 18 or later, no dependencies.
// Invariant: read-only. Entries are served from the generated map.json as published (with origin and
//   trust tier); chains are checked by scripts/compose.mjs over the same sources. Nothing is written to
//   stdout but protocol messages.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { compose, describe } from "./compose.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAP = JSON.parse(readFileSync(join(ROOT, "map.json"), "utf8"));
const BY_ID = Object.fromEntries(MAP.entries.map((e) => [e.id, e]));
const VERSION = { builtFrom: MAP.builtFrom.commit, repo: "https://github.com/A-Viable-Fork/Math_Map" };
const CAVEAT = "Tiers, strongest evidence first: flagged (known wrong; do not use), audited (graded against sources; auditVerdict is the worst field), receipted (every claim quoted), landed (as written, unreviewed), authored (a fill, unreviewed). Cite the entry id and builtFrom commit.";

const str = (description) => ({ type: "string", description });
const TOOLS = [
  { name: "map_info", description: "What the math map is, its domains, counts by origin and trust tier, the functional-tag vocabulary, and the commit it was built from. Call this first.",
    inputSchema: { type: "object", properties: {} } },
  { name: "search_entries", description: "Find typed transformations (input, output, preserved and broken invariants). All filters are optional and combine with AND. Returns short records; use get_entry for the full entry.",
    inputSchema: { type: "object", properties: {
      text: str("Case-insensitive substring of name, description, input, output, preserved or broken."),
      domain: str("D1 to D8; see map_info for names."), tag: { type: "array", items: { type: "string" }, description: "Functional tags; every one must match." },
      kind: str("Operation kind, e.g. Transformer."), tier: { type: "string", enum: ["flagged", "audited", "receipted", "landed", "authored"] },
      anchorable: { type: "boolean", description: "Only entries with input, output and at least one invariant field." },
      invariant: str("A named invariant id (see list_invariants) the entry preserves, breaks or produces."),
      formal: { type: "boolean", description: "Only entries linked to Mathlib declarations (get_entry shows the links and their match grades)." },
      limit: { type: "integer", minimum: 1, maximum: 100, description: "Default 20." } } } },
  { name: "get_entry", description: "One entry in full: fields, origin, trust tier, evidence level per field and per invariant claim, audit verdict, receipts, corrections (with the landed text), conditions, counterexamples, Mathlib links with match grades, named invariants and the kinds of object it acts on.",
    inputSchema: { type: "object", properties: { id: str("Entry id, e.g. D2-117 or D7-X01.") }, required: ["id"] } },
  { name: "list_invariants", description: "The named-invariant vocabulary used by compose_chain: carriers (kinds of object, with parents), invariants with definitions, and the relations between them. Optionally filtered to one carrier and its sub-kinds.",
    inputSchema: { type: "object", properties: { carrier: str("e.g. variety, functor, field.") } } },
  { name: "compose_chain", description: "Apply entries in order and report whether each join fits (match, narrowing, mismatch) and what happens to each named invariant: survives, broken, unknown (the map is silent), restored, created, or created then broken. Each result, join and the chain as a whole carries the weakest evidence level it rests on (contradicted, unsupported, unchecked, imprecise, sourced, formal) and where that claim is. Unknown means the map does not say, not that the invariant is lost.",
    inputSchema: { type: "object", properties: { chain: { type: "array", items: { type: "string" }, minItems: 1, description: "Entry ids in order of application." } }, required: ["chain"] } },
];

const short = (e) => ({ id: e.id, name: e.name, domain: e.domain, kind: e.kind, tier: e.tier, ...(e.auditVerdict ? { auditVerdict: e.auditVerdict } : {}), ...(e.formal ? { mathlib: e.formal.map((k) => `${k.decl} (${k.match})`) } : {}), input: e.input, output: e.output, description: e.description });
const sub = (k, c, C) => { for (let x = k; x; x = C[x]) if (x === c) return true; return false; };

const HANDLERS = {
  map_info: () => ({ about: MAP.about, ...VERSION, domains: MAP.domains, counts: MAP.counts, origins: MAP.origins, tiers: CAVEAT, tags: MAP.vocabulary }),
  search_entries: (a) => {
    let es = MAP.entries;
    if (a.domain) es = es.filter((e) => e.domain === a.domain);
    for (const t of a.tag || []) es = es.filter((e) => e.tags.includes(t));
    if (a.kind) es = es.filter((e) => e.kind.toLowerCase() === String(a.kind).toLowerCase());
    if (a.tier) es = es.filter((e) => e.tier === a.tier);
    if (a.anchorable !== undefined) es = es.filter((e) => e.anchorable === a.anchorable);
    if (a.formal !== undefined) es = es.filter((e) => !!e.formal === a.formal);
    if (a.invariant) es = es.filter((e) => e.invariants && ["preserved", "broken", "output"].some((f) => e.invariants[f].includes(a.invariant)));
    if (a.text) { const q = String(a.text).toLowerCase(); es = es.filter((e) => [e.name, e.description, e.input, e.output, e.preserved, e.broken].filter(Boolean).join(" ").toLowerCase().includes(q)); }
    const lim = Math.min(Math.max(Number(a.limit) || 20, 1), 100);
    return { ...VERSION, matches: es.length, shown: Math.min(lim, es.length), entries: es.slice(0, lim).map(short) };
  },
  get_entry: (a) => { const e = BY_ID[a.id]; if (!e) throw new Error(`no entry ${a.id}`); return { ...VERSION, tiers: CAVEAT, entry: e }; },
  list_invariants: (a) => {
    const V = MAP.invariants, C = V.carriers;
    if (a.carrier && !(a.carrier in C)) throw new Error(`no carrier ${a.carrier}; carriers: ${Object.keys(C).join(", ")}`);
    const terms = a.carrier ? V.terms.filter((t) => sub(a.carrier, t.carrier, C) || sub(t.carrier, a.carrier, C)) : V.terms;
    const ids = new Set(terms.map((t) => t.id));
    return { ...VERSION, carriers: C, invariants: terms, relations: V.relations.filter((r) => ids.has(r.from) || ids.has(r.to)) };
  },
  compose_chain: (a) => {
    if (!Array.isArray(a.chain) || !a.chain.length) throw new Error("chain must be a non-empty array of entry ids");
    const r = compose(a.chain.map(String));
    if (r.error) throw new Error(r.error);
    return { ...VERSION, summary: describe(r), result: r, note: "Unknown means the map is silent at those steps, not that the invariant is lost." };
  },
};

const PROTOCOL = "2025-06-18";
export function handle(msg) {
  const { id, method, params = {} } = msg;
  const ok = (result) => ({ jsonrpc: "2.0", id, result }), err = (code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });
  if (method === "initialize") return ok({ protocolVersion: params.protocolVersion || PROTOCOL, capabilities: { tools: {} },
    serverInfo: { name: "math-map", version: VERSION.builtFrom.slice(0, 12) },
    instructions: `A typed map of mathematical transformations. Start with map_info. ${CAVEAT}` });
  if (method === "ping") return ok({});
  if (method === "tools/list") return ok({ tools: TOOLS });
  if (method === "tools/call") {
    const h = HANDLERS[params.name];
    if (!h) return err(-32602, `unknown tool ${params.name}`);
    try { return ok({ content: [{ type: "text", text: JSON.stringify(h(params.arguments || {}), null, 1) }] }); }
    catch (e) { return ok({ content: [{ type: "text", text: e.message }], isError: true }); }
  }
  if (id === undefined) return null;
  return err(-32601, `method not found: ${method}`);
}

function selftest() {
  const F = [];
  const call = (name, args) => { const r = handle({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }).result; return { err: !!r.isError, text: r.content[0].text }; };
  const init = handle({ jsonrpc: "2.0", id: 0, method: "initialize", params: { protocolVersion: PROTOCOL } });
  if (!init.result?.capabilities?.tools) F.push("initialize lacks the tools capability");
  if (handle({ jsonrpc: "2.0", method: "notifications/initialized" }) !== null) F.push("a notification got a reply");
  const listed = handle({ jsonrpc: "2.0", id: 2, method: "tools/list" }).result.tools.map((t) => t.name);
  for (const n of Object.keys(HANDLERS)) if (!listed.includes(n)) F.push(`tool ${n} not listed`);
  for (const t of TOOLS) if (!HANDLERS[t.name]) F.push(`tool ${t.name} has no handler`);
  const info = call("map_info", {});
  if (info.err || JSON.parse(info.text).counts.entries !== MAP.entries.length) F.push("map_info count wrong");
  const s = call("search_entries", { text: "blow", domain: "D2" });
  if (s.err || !JSON.parse(s.text).entries.some((e) => e.id === "D2-117")) F.push("search_entries misses D2-117");
  const g = call("get_entry", { id: "D7-X01" });
  if (g.err || JSON.parse(g.text).entry.tier !== "receipted") F.push("get_entry D7-X01 is not receipted");
  if (!call("get_entry", { id: "D9-999" }).err) F.push("get_entry accepted a missing id");
  const v = call("list_invariants", { carrier: "curve" });
  if (v.err || !JSON.parse(v.text).invariants.some((t) => t.id === "birational-type")) F.push("list_invariants(curve) misses the parent carrier's invariants");
  const fm = call("search_entries", { formal: true, limit: 100 });
  if (fm.err || !JSON.parse(fm.text).entries.some((e) => e.id === "D1-099" && e.mathlib.length)) F.push("search_entries(formal) misses D1-099");
  const c = call("compose_chain", { chain: ["D2-118", "D2-117"] });
  if (c.err || !JSON.parse(c.text).result.invariants.length) F.push("compose_chain returned nothing");
  if (!c.err && !JSON.parse(c.text).result.evidence?.level) F.push("compose_chain carries no evidence");
  const g2 = call("get_entry", { id: "D8-133" });
  if (g2.err || !JSON.parse(g2.text).entry.corrected || JSON.parse(g2.text).entry.tier === "flagged") F.push("get_entry D8-133 does not show its correction");
  if (!call("compose_chain", { chain: ["D2-118", "nope"] }).err) F.push("compose_chain accepted a missing id");
  for (const f of F) console.log("FAIL", f);
  if (F.length) { console.log(`mcp: ${F.length} failure(s)`); process.exit(1); }
  console.log(`mcp: PASS (${TOOLS.length} tools, built from ${VERSION.builtFrom.slice(0, 7)})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--selftest")) selftest();
  else {
    const rl = createInterface({ input: process.stdin });
    rl.on("line", (line) => {
      if (!line.trim()) return;
      let msg; try { msg = JSON.parse(line); } catch { process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }) + "\n"); return; }
      const r = handle(msg);
      if (r) process.stdout.write(JSON.stringify(r) + "\n");
    });
  }
}
