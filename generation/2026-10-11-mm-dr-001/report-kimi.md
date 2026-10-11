# Operations on State and Their Effects: D9 Report

**Date:** 2026-10-10. Desk research; every citation below was checked against a primary or near-primary source this session unless marked *unverified in desk check*.

---

## 1. Executive Summary

**Overall verdict: DEAD as stated; MARGINAL under a precisely restricted reformulation.** The checkability claim — that a chain of operations satisfies a personal effect policy *exactly when* no step breaks a named invariant — fails at the first load-bearing step for confidentiality-side invariants of the noninterference family, because those are hyperproperties (properties of sets of executions) and are not preserved under sequential composition (McCullough 1987/1988; Zakinthinos & Lee 1995; Mantel 2002 — all verified). The seed six operations are not a sufficient core (declassification, endorsement, erasure and aggregation are missing and are theory-mandated). The seed invariants survive mostly intact but must be split by logical class: trace-safety invariants (locality-as-event-absence, integrity, authority confinement, signature validity, audit) are per-join checkable and compositional under stated side conditions; hyperproperty invariants (noninterference, separability, leak bounds, no-dependency-on-guest-data) require whole-chain checks (self-composition, HyperLTL-style verification) — this is a *structural* gap, not a repairable side condition, per Clarkson & Schneider 2010. Per-join checking remains sound and useful for the trace-property subclass, which is exactly what runtimes like CaMeL (Debenedetti et al. 2025) implement — but CaMeL's guarantees are per-call data-flow checks over a restricted interpreter, not hyperproperty checks.

---

## 2. Q1 — Theories That Name Operations on State and Their Effect Properties

**Section verdict: CONFIRMED** (the theories exist, are as described, and each contributes a distinct ingredient; the "seed six suffice" input is the part that fails).

| Theory | Operations formalized | Named properties | Carrier of property | Do properties compose? | Citation (verified) |
|---|---|---|---|---|---|
| Effect systems | Side-effecting constructs (read/write/alloc on regions) | Effect sets + region annotations in types; effect soundness = static over-approximation of side effects | Expression/function (static artifact) | Yes — effect union + subeffecting is fully compositional statically (RESULT) | Gifford & Lucassen 1986, LFP pp. 28–38; Lucassen & Gifford 1988, POPL pp. 47–57; Talpin & Jouvelot 1992, JFP 2(3):245–271 |
| Algebraic effects & handlers | Signature of effect ops + handlers | Equations of the algebraic theory; handlers as models | Computation/monad | Partially — handlers *re-interpret* effects, so an op's observable effect depends on the handler in scope (RESULT — this is the paradigmatic context dependence) | Plotkin & Power 2003, Appl. Categ. Struct. 11(1):69–94; Plotkin & Pretnar 2009, ESOP, LNCS 5502 (handlers) |
| Information-flow control | Assignments, conditionals, I/O; declassify | Lattice of security classes; explicit/implicit flows; noninterference; declassification dimensions (what/who/where/when) | Variable/value (labels); system (NI) | Per-statement soundness holds for termination-insensitive NI in deterministic sequential languages (RESULT, Volpano–Smith–Irvine 1996); NI itself not compositional (RESULT, below) | Denning 1976, CACM 19(5):236–243; Goguen & Meseguer 1982, IEEE S&P pp. 11–20; Volpano, Smith, Irvine 1996, JCS 4(3):167–187; Myers & Liskov 1997 SOSP pp. 129–142 and 1998 IEEE S&P pp. 186–197; Sabelfeld & Myers 2003, IEEE JSAC 21(1):5–19; Sabelfeld & Sands 2005, CSFW pp. 255–269 |
| Capabilities | Acquire, link, grant, delegate, revoke; mint/attenuate | Capability safety ⇒ authority safety ⇒ isolation; authority confinement; integrity | Capability; agent; store | Authority confinement compositional under no-amplification conditions (RESULT, in the stated models) | Dennis & Van Horn 1966, CACM 9(3):143–155; Miller 2006 thesis (*unverified in desk check*); Maffeis, Mitchell, Taly 2010, IEEE S&P; Klein et al. 2009 SOSP pp. 207–220; Sewell et al. 2011 ITP pp. 325–340; Murray et al. 2013 IEEE S&P pp. 415–429; Woodruff et al. 2014 ISCA (CHERI) |
| Process calculi (π-calculus) | Send/receive on named channels; scope restriction; replication | Scope extrusion; typed variants add mobility/locality types | Process; channel | Parallel composition + restriction is the composition mechanism; security properties (Focardi–Gorrieri taxonomy) mostly non-compositional under hook-up without side conditions | Milner 1999 book; Focardi & Gorrieri 1995 taxonomy (verified via Springer survey) |
| Agent security (CaMeL) | Tool calls planned by privileged LLM, executed by restricted interpreter over untrusted data | Capabilities-as-value-metadata (origin, allowed readers); no control-flow influence from untrusted data; policy checks at each call | Value (metadata); tool call (step) | Per-call checks are compositional by construction (each call checked at the join); sound *within the restricted-interpreter model* (RESULT as claimed by authors) | Debenedetti et al. 2025, arXiv:2503.18813 (SaTML 2026) |

**What each gives the map, concretely:**

- **Effect systems** supply the schema-level idea: an operation's "broken" list is exactly a static effect annotation. They also prove the per-step static-over-approximation is sound (effect soundness, Lucassen–Gifford 1988).
- **Algebraic effects** supply the vocabulary of *operations as data* (generic effects) and the warning: handlers make effect profiles context-dependent (Plotkin–Pretnar 2009). This is direct evidence against Q5-step-1's context independence.
- **IFC** supplies the invariant vocabulary (provenance/labels, confidentiality vs. integrity duality, declassification dimensions) and the two-sided composition story: type-system per-statement soundness (Volpano–Smith–Irvine 1996) vs. property-level non-composition (McCullough, Mantel).
- **Capabilities** supply grant/revoke/attenuate/delegate, authority confinement, and the strongest positive results: seL4's integrity and authority confinement are Hoare-expressible and refinement-preserved (Sewell et al. 2011), while its confidentiality proof (intransitive NI) required determinizing the spec and adding system-configuration assumptions — the confidentiality/integrity composition asymmetry made concrete (Murray et al. 2013).
- **CaMeL** supplies a working existence proof that per-join capability checks over value provenance are deployable in 2025 agent systems — and also documents its limits (token overhead ~2.8×; no atomicity; policies per-application).

**Not verified in desk check:** Nielson & Nielson's type-and-effect-systems chapter (commonly cited as LNCS 1710, 1999); Leijen's Koka row-typing paper (commonly cited as MSFP 2014); Miller 2006 thesis. I was unable to verify these specific claims this session and they are not load-bearing anywhere below.

---

## 3. Q2 — The D9 Entries

**Section verdict:** entries are GENERATED authorship grounded in the Q1 sources; each entry carries its own verdict. Seed test: the six seed operations are necessary but **not sufficient** (DEAD as a sufficiency claim — missing declassify, endorse, erase, aggregate, dispatch; each is theory-mandated by IFC, seL4-style integrity, secure-erasure practice, declassification theory, and CaMeL respectively).

```json
[
  {
    "id": "D9-X01", "domain": "D9", "name": "send",
    "kind": "Transformer", "primitive": true,
    "tags": ["channel", "exfiltration", "confidentiality"],
    "description": "Delivers a value over a named channel to a recipient set.",
    "input": "value with provenance metadata and a reader-policy; channel descriptor naming recipient set",
    "output": "delivery event; acknowledgement",
    "preserved": "provenance (EI-02) is preserved iff metadata is attached to the message (CaMeL-style)",
    "broken": "locality (EI-01, event form) iff the channel crosses the policy boundary — CONTEXT-DEPENDENT",
    "invariants": { "preserved": ["EI-02"], "broken": ["EI-01"], "output": [] },
    "actsOn": { "input": ["value", "channel"], "output": ["channel"] },
    "sources": ["Debenedetti2025", "Lampson1973", "GM1982"],
    "verdict": "NEEDS REFINEMENT",
    "notes": "Whether send breaks locality depends on the channel, not the operation: refutes context-independence of effect profiles."
  },
  {
    "id": "D9-X02", "domain": "D9", "name": "store",
    "kind": "Transformer", "primitive": true,
    "tags": ["store", "copy", "integrity"],
    "description": "Writes a value into a store location under an authorized key.",
    "input": "value, store key, write authority",
    "output": "acknowledgement",
    "preserved": "provenance (EI-02), signature validity (EI-05), integrity (EI-03) at that location if key authorized",
    "broken": "erasability (EI-11) of the value's prior copies: storing creates a new copy (GENERATED)",
    "invariants": { "preserved": ["EI-02", "EI-03", "EI-05"], "broken": ["EI-11"], "output": ["EI-02"] },
    "actsOn": { "input": ["value", "store"], "output": ["store"] },
    "sources": ["Sewell2011 (integrity model)", "GENERATED (erasability broken)"],
    "verdict": "CONFIRMED (integrity side) / GENERATED (erasability side)"
  },
  {
    "id": "D9-X03", "domain": "D9", "name": "read-sensor",
    "kind": "Transformer", "primitive": true,
    "tags": ["input", "freshness", "provenance"],
    "description": "Samples a sensor and returns the reading tagged with sensor identity and time.",
    "input": "sensor handle, read authority",
    "output": "value tagged (origin=sensor, timestamp)",
    "preserved": "n/a (source operation)",
    "broken": "n/a",
    "invariants": { "preserved": [], "broken": [], "output": ["EI-02", "EI-06"] },
    "actsOn": { "input": ["sensor"], "output": ["value"] },
    "sources": ["GENERATED (pattern from Denning1976 labeling)"],
    "verdict": "GENERATED (PLAUSIBLE)"
  },
  {
    "id": "D9-X04", "domain": "D9", "name": "isolate",
    "kind": "Transformer", "primitive": true,
    "tags": ["compartment", "isolation", "sandbox"],
    "description": "Creates a fresh compartment running given code with exactly the granted capability set.",
    "input": "code, initial capability set, resource bounds",
    "output": "compartment handle",
    "preserved": "authority confinement (EI-04) for the parent: child holds no authority beyond grant",
    "broken": "none on input values; the isolation claim (EI-08) is conditional on no-amplification and is itself a hyperproperty",
    "invariants": { "preserved": ["EI-04"], "broken": [], "output": ["EI-08"] },
    "actsOn": { "input": ["code", "capability"], "output": ["compartment"] },
    "sources": ["Maffeis2010", "Sewell2011", "Murray2013"],
    "verdict": "MARGINAL (sound in capability models; EI-08 output claim not per-join checkable)"
  },
  {
    "id": "D9-X05", "domain": "D9", "name": "grant-capability",
    "kind": "Transformer", "primitive": true,
    "tags": ["capability", "authority"],
    "description": "Transfers a capability to another agent, optionally attenuated.",
    "input": "capability, grantee, attenuation spec",
    "output": "grantee's new authority",
    "preserved": "authority confinement (EI-04): granted rights are a subset of grantor's (no amplification)",
    "broken": "separability (EI-08) between grantor compartment and grantee unless grantee is inside the trust boundary (GENERATED)",
    "invariants": { "preserved": ["EI-04"], "broken": ["EI-08"], "output": [] },
    "actsOn": { "input": ["capability", "agent"], "output": ["capability", "agent"] },
    "sources": ["DennisVanHorn1966", "Maffeis2010", "Sewell2011"],
    "verdict": "CONFIRMED (no-amplification) / GENERATED (EI-08 broken)"
  },
  {
    "id": "D9-X06", "domain": "D9", "name": "revoke-capability",
    "kind": "Transformer", "primitive": true,
    "tags": ["capability", "authority", "liveness"],
    "description": "Destroys a capability, removing future authority through it.",
    "input": "capability",
    "output": "revocation event",
    "preserved": "authority confinement (EI-04) strengthened; audit trail (EI-10)",
    "broken": "availability (liveness: existing users of the capability lose service) — no invariant id assigned; GENERATED note: revoke does NOT restore erasability (EI-11) because copies/derivatives persist",
    "invariants": { "preserved": ["EI-04", "EI-10"], "broken": [], "output": [] },
    "actsOn": { "input": ["capability"], "output": ["capability"] },
    "sources": ["Sewell2011", "GENERATED (erase-restore note)"],
    "verdict": "CONFIRMED (confinement) / GENERATED (notes)"
  },
  {
    "id": "D9-X07", "domain": "D9", "name": "declassify",
    "kind": "Transformer", "primitive": true,
    "tags": ["confidentiality", "release", "ifc"],
    "description": "Downgrades the confidentiality label of a value, authorized by its owner per the decentralized label model.",
    "input": "labeled value, owner authority evidence, target label",
    "output": "value at lower label; release record",
    "preserved": "declassification authority (EI-09) is preserved exactly when the caller owns the released policy",
    "broken": "noninterference (EI-07) by design; strong locality (EI-01 info form)",
    "invariants": { "preserved": ["EI-09"], "broken": ["EI-07"], "output": ["EI-10"] },
    "actsOn": { "input": ["value"], "output": ["value"] },
    "sources": ["MyersLiskov1997", "MyersLiskov1998", "SabelfeldSands2005"],
    "verdict": "CONFIRMED"
  },
  {
    "id": "D9-X08", "domain": "D9", "name": "endorse",
    "kind": "Transformer", "primitive": true,
    "tags": ["integrity", "ifc"],
    "description": "Upgrades the integrity label of a value, vouching for it as an endorsing principal (integrity dual of declassify).",
    "input": "value, endorser authority",
    "output": "value at higher integrity; endorsement record",
    "preserved": "integrity (EI-03) for downstream readers relying on the endorser",
    "broken": "the integrity analogue of noninterference — untrusted→trusted flow is permitted by design (GENERATED framing; dual of Sabelfeld–Sands declassification)",
    "invariants": { "preserved": ["EI-03"], "broken": [], "output": ["EI-03"] },
    "actsOn": { "input": ["value"], "output": ["value"] },
    "sources": ["MyersLiskov1998 (integrity extension)", "ZdancewicMyers2001", "GENERATED (framing)"],
    "verdict": "MARGINAL (dual construction; endorsement control less standardized in literature)"
  },
  {
    "id": "D9-X09", "domain": "D9", "name": "delegate",
    "kind": "Transformer", "primitive": false,
    "derived": "D9-X05 grant-capability ∘ D9-X10 attenuate",
    "tags": ["capability", "authority"],
    "description": "Grants an attenuated capability to another agent (chains mint+grant).",
    "input": "capability, grantee, restriction spec",
    "output": "derived capability held by grantee",
    "preserved": "authority confinement (EI-04)",
    "broken": "separability (EI-08) as in grant",
    "invariants": { "preserved": ["EI-04"], "broken": ["EI-08"], "output": [] },
    "actsOn": { "input": ["capability", "agent"], "output": ["capability", "agent"] },
    "sources": ["Maffeis2010", "Sewell2011"],
    "verdict": "CONFIRMED"
  },
  {
    "id": "D9-X10", "domain": "D9", "name": "attenuate",
    "kind": "Transformer", "primitive": true,
    "tags": ["capability", "monotonicity"],
    "description": "Derives a new capability with a subset of rights/bounds from an existing one.",
    "input": "capability, restriction spec",
    "output": "derived capability",
    "preserved": "authority confinement (EI-04): rights non-increasing (capability monotonicity)",
    "broken": "none",
    "invariants": { "preserved": ["EI-04"], "broken": [], "output": ["EI-04"] },
    "actsOn": { "input": ["capability"], "output": ["capability"] },
    "sources": ["Woodruff2014 (CHERI model)", "Sewell2011"],
    "verdict": "CONFIRMED (in CHERI/seL4 capability models)"
  },
  {
    "id": "D9-X11", "domain": "D9", "name": "spawn",
    "kind": "Transformer", "primitive": false,
    "derived": "D9-X04 isolate ∘ D9-X05 grant-capability",
    "tags": ["agent", "compartment"],
    "description": "Creates a new agent (compartment + initial authority + scheduling context).",
    "input": "code, initial capabilities, resource bounds",
    "output": "agent handle",
    "preserved": "authority confinement (EI-04)",
    "broken": "none on input",
    "invariants": { "preserved": ["EI-04"], "broken": [], "output": ["EI-08"] },
    "actsOn": { "input": ["code", "capability"], "output": ["agent"] },
    "sources": ["Maffeis2010", "Murray2013 (scheduler conditions)"],
    "verdict": "MARGINAL (isolation output claim is hyperproperty)"
  },
  {
    "id": "D9-X12", "domain": "D9", "name": "join",
    "kind": "Transformer", "primitive": true,
    "tags": ["merge", "aggregation", "labels"],
    "description": "Merges two values/records into one (concatenation, record merge).",
    "input": "two values with labels",
    "output": "merged value",
    "preserved": "provenance (EI-02) = join of input provenances (Denning join rule)",
    "broken": "locality (EI-01): merged value is visible to the union of readers; leak budget (EI-12) under aggregation",
    "invariants": { "preserved": ["EI-02"], "broken": ["EI-01", "EI-12"], "output": ["EI-02"] },
    "actsOn": { "input": ["value", "value"], "output": ["value"] },
    "sources": ["Denning1976 (join rule)", "SabelfeldSands2005 (what-dimension/aggregation)", "Clarkson2009 (quantitative)"],
    "verdict": "CONFIRMED (label algebra) / GENERATED (leak-budget broken)"
  },
  {
    "id": "D9-X13", "domain": "D9", "name": "encrypt",
    "kind": "Transformer", "primitive": true,
    "tags": ["crypto", "confidentiality"],
    "description": "Encrypts a value under a key; ciphertext is portable across the boundary.",
    "input": "plaintext value, encryption key",
    "output": "ciphertext",
    "preserved": "provenance (EI-02) of the ciphertext; locality (EI-01) in the sense that ciphertext may safely cross — HEURISTIC, rests on the encryption-as-NI intuition (Goguen–Meseguer motivating example)",
    "broken": "freshness (EI-06) not addressed by encryption itself",
    "invariants": { "preserved": ["EI-02", "EI-01"], "broken": [], "output": [] },
    "actsOn": { "input": ["value", "key"], "output": ["value"] },
    "sources": ["GM1982 (motivating example)", "GENERATED (profile)"],
    "verdict": "PLAUSIBLE (HEURISTIC on EI-01; conditional on key not co-located with ciphertext)"
  },
  {
    "id": "D9-X14", "domain": "D9", "name": "decrypt",
    "kind": "Transformer", "primitive": true,
    "tags": ["crypto", "confidentiality"],
    "description": "Decrypts ciphertext under the key; plaintext re-enters the portable domain.",
    "input": "ciphertext, key",
    "output": "plaintext",
    "preserved": "provenance (EI-02) linking plaintext to original origin",
    "broken": "locality (EI-01) wherever the plaintext is then held; noninterference (EI-07) with respect to the key holder",
    "invariants": { "preserved": ["EI-02"], "broken": ["EI-01"], "output": ["EI-02"] },
    "actsOn": { "input": ["value", "key"], "output": ["value"] },
    "sources": ["GENERATED (standard dual of encrypt)"],
    "verdict": "PLAUSIBLE"
  },
  {
    "id": "D9-X15", "domain": "D9", "name": "sign",
    "kind": "Transformer", "primitive": true,
    "tags": ["signature", "integrity"],
    "description": "Produces a signature over a value with a signing key.",
    "input": "value, signing key",
    "output": "signature",
    "preserved": "integrity (EI-03) of the value as carried by the signature",
    "broken": "none",
    "invariants": { "preserved": ["EI-03"], "broken": [], "output": ["EI-05"] },
    "actsOn": { "input": ["value", "key"], "output": ["signature"] },
    "sources": ["GENERATED (standard)"],
    "verdict": "GENERATED (PLAUSIBLE)"
  },
  {
    "id": "D9-X16", "domain": "D9", "name": "verify",
    "kind": "Transformer", "primitive": true,
    "tags": ["signature", "integrity"],
    "description": "Verifies a signature and returns the value marked endorsed or failure.",
    "input": "value, signature, verification key",
    "output": "endorsed value or failure",
    "preserved": "signature validity (EI-05) is consumed to establish integrity (EI-03)",
    "broken": "none",
    "invariants": { "preserved": ["EI-05"], "broken": [], "output": ["EI-03"] },
    "actsOn": { "input": ["value", "signature", "key"], "output": ["value"] },
    "sources": ["GENERATED"],
    "verdict": "GENERATED (PLAUSIBLE)"
  },
  {
    "id": "D9-X17", "domain": "D9", "name": "log",
    "kind": "Transformer", "primitive": true,
    "tags": ["audit", "trace"],
    "description": "Appends an immutable record of an event to an audit trail.",
    "input": "event record",
    "output": "appended log entry",
    "preserved": "provenance (EI-02) of the record",
    "broken": "locality (EI-01) if the log store is outside the boundary (context-dependent)",
    "invariants": { "preserved": ["EI-02"], "broken": ["EI-01"], "output": ["EI-10"] },
    "actsOn": { "input": ["event"], "output": ["trace"] },
    "sources": ["GENERATED"],
    "verdict": "GENERATED (PLAUSIBLE)"
  },
  {
    "id": "D9-X18", "domain": "D9", "name": "erase",
    "kind": "Transformer", "primitive": true,
    "tags": ["erasure", "privacy"],
    "description": "Securely erases a value at named locations, restoring non-recoverability at those locations.",
    "input": "value/locations, erase authority",
    "output": "erasure certificate (local)",
    "preserved": "audit (EI-10) of the erasure event",
    "broken": "none locally — BUT whole-chain note: prior copies made by store (D9-X02) or sends defeat global erasability (EI-11); per-step verdict alone is unsound",
    "invariants": { "preserved": ["EI-10"], "broken": [], "output": ["EI-11"] },
    "actsOn": { "input": ["value", "store"], "output": ["store"] },
    "sources": ["GENERATED (profile); structural analogue of forward correctability (Johnson–Thayer 1988)"],
    "verdict": "NEEDS REFINEMENT (per-step output claim is local only)"
  },
  {
    "id": "D9-X19", "domain": "D9", "name": "dispatch",
    "kind": "Transformer", "primitive": false,
    "derived": "control-flow plan (from privileged planner) + D9-X04 isolate (quarantined data handling) + per-call policy check before D9-X01 send or tool call",
    "tags": ["agent", "control-flow", "capability-check"],
    "description": "Routes a planned tool call, checking each argument's capabilities (origin, allowed readers) against policy before execution; untrusted data cannot influence control flow.",
    "input": "plan, arguments with capability metadata, policy",
    "output": "executed call or denial",
    "preserved": "guest non-dependency sufficient condition (EI-13 per-step form): untrusted values only reach sinks whose policy admits their provenance",
    "broken": "none if check passes; the check is a per-call sufficient condition, sound but incomplete for the hyperproperty",
    "invariants": { "preserved": ["EI-02", "EI-13"], "broken": [], "output": ["EI-10"] },
    "actsOn": { "input": ["value", "plan"], "output": ["operation"] },
    "sources": ["Debenedetti2025"],
    "verdict": "MARGINAL (sound in the restricted-interpreter model; not a hyperproperty check; utility cost documented ~2.8x tokens)"
  },
  {
    "id": "D9-X20", "domain": "D9", "name": "aggregate",
    "kind": "Transformer", "primitive": true,
    "tags": ["aggregation", "leak-budget", "merge"],
    "description": "Collects multiple outputs (each individually harmless) into a combined disclosure.",
    "input": "stream of labeled values, disclosure target",
    "output": "combined output",
    "preserved": "provenance (EI-02) of each component",
    "broken": "leak budget (EI-12): individually in-budget releases can jointly exceed the bound; locality (EI-01) at the disclosure point",
    "invariants": { "preserved": ["EI-02"], "broken": ["EI-12", "EI-01"], "output": [] },
    "actsOn": { "input": ["value"], "output": ["channel"] },
    "sources": ["SabelfeldSands2005 (what-dimension; non-occlusion)", "Clarkson2009", "GENERATED (counterexample shape)"],
    "verdict": "CONFIRMED (aggregation hazard is established in the declassification literature)"
  }
]
```

---

## 4. Q3 — The Effect-Invariant Vocabulary

**Section verdict: NEEDS REFINEMENT → resolved.** Testing the five seeds:

- **locality** — **kept, split** into event form (trace safety, per-join checkable) and information form (hyperproperty, whole-chain). Conflating them is the single most likely failure of this map.
- **provenance** — **kept**; subsumes *compartment-origin* and *guest-origin* as label granularities rather than separate invariants (MERGE): both are provenance at different lattice resolutions (Denning 1976 labels; CaMeL metadata).
- **signature** — **kept** as signature-validity; it serves *integrity of authorship*, explicitly distinct from confidentiality.
- **integrity** (new, REQUIRED) — the seed list had confidentiality only; integrity composes better (Hoare-expressible, refinement-preserved: Sewell et al. 2011) and must not be conflated with confidentiality.
- **authority** (new, REQUIRED), **freshness** (new), **audit** (new), **erasability** (new), **leak-budget** (new), **noninterference** (named explicitly so the checker can refuse it), **separability**, **guest non-dependency**, **declassification authority**.

```json
[
  { "id": "EI-01", "name": "locality", "kind": "confinement", "carrier": "value-in-channel",
    "definition": "Event form: no output event carrying the value crosses boundary B. Information form: observations outside B are independent of the value (noninterference against B).",
    "class": "trace (safety), event form; hyperproperty, information form",
    "source": "Lampson1973; GM1982" },
  { "id": "EI-02", "name": "provenance", "kind": "label-integrity/confidentiality carrier", "carrier": "value",
    "definition": "Every value carries a label recording origin (compartment, guest/trusted bit); operations compute output labels as the join of input labels plus pc label.",
    "class": "step (relational label judgment); per-step sound for termination-insensitive noninterference in deterministic sequential languages",
    "source": "Denning1976; VolpanoSmithIrvine1996" },
  { "id": "EI-03", "name": "integrity", "kind": "integrity", "carrier": "value/store",
    "definition": "No state outside the authorized write set is modified; a subject cannot write without authority (Biba/seL4 sense).",
    "class": "trace (safety); Hoare-expressible, refinement-preserved",
    "source": "Sewell2011 (seL4 integrity theorem)" },
  { "id": "EI-04", "name": "authority-confinement", "kind": "authority", "carrier": "capability/agent",
    "definition": "No agent holds authority beyond what was granted (no amplification); authority only enters by explicit grant.",
    "class": "trace (safety)",
    "source": "Sewell2011; Maffeis2010 (capability safety implies authority safety, in their JS models)" },
  { "id": "EI-05", "name": "signature-validity", "kind": "integrity-of-authorship", "carrier": "value",
    "definition": "The value carries a valid signature by a named key at verification time.",
    "class": "step",
    "source": "GENERATED (standard)" },
  { "id": "EI-06", "name": "freshness", "kind": "temporal", "carrier": "value",
    "definition": "The value was produced within a bounded time window / is not a replay.",
    "class": "trace (needs monotonic time and bounded inter-step delay)",
    "source": "GENERATED (standard; cf. freshness literature)" },
  { "id": "EI-07", "name": "noninterference", "kind": "confidentiality", "carrier": "compartment/system",
    "definition": "Low outputs are independent of high inputs (commands of one group do not affect the view of another).",
    "class": "hyperproperty",
    "source": "GM1982" },
  { "id": "EI-08", "name": "separability", "kind": "isolation", "carrier": "compartment-pair",
    "definition": "Two compartments are noninterfering in both directions (mutual isolation).",
    "class": "hyperproperty",
    "source": "McLean1996; ZakinthinosLee1996" },
  { "id": "EI-09", "name": "declassification-authority", "kind": "release-control", "carrier": "operation",
    "definition": "A declassification is valid only if the caller owns the released policy (per-owner readers sets). Per-call check is step-expressible; the 'what is released overall' dimension is not.",
    "class": "step (who-dimension); hyperproperty (what-dimension, via delimited release)",
    "source": "MyersLiskov1997/1998; SabelfeldSands2005" },
  { "id": "EI-10", "name": "audit-completeness", "kind": "accountability", "carrier": "trace",
    "definition": "Every effect event is preceded by an immutable log entry recording it (log-before-effect, atomically).",
    "class": "trace (safety, conditional on atomicity)",
    "source": "GENERATED (standard)" },
  { "id": "EI-11", "name": "erasability", "kind": "privacy", "carrier": "value",
    "definition": "After an erase event, no subsequent state or output depends on the erased value. Globally requires absence of other copies.",
    "class": "trace (safety); NOT per-step compositional without a no-copies side condition",
    "source": "GENERATED (profile); structural analogue: forward correctability (Johnson&Thayer1988)" },
  { "id": "EI-12", "name": "leak-budget", "kind": "quantitative-confidentiality", "carrier": "channel/system",
    "definition": "The total information disclosed about a secret along a channel stays below a bound (in bits or belief revision).",
    "class": "hyperproperty",
    "source": "ClarksonMyersSchneider2009 (Quantifying information flow with beliefs, JCS 17(5):655-701)" },
  { "id": "EI-13", "name": "guest-non-dependency", "kind": "confidentiality/control-flow", "carrier": "operation",
    "definition": "An agent's actions do not depend on guest/untrusted data. Per-step sufficient condition: no dependency edge (taint) from guest-labeled values to action parameters; the property itself is dependency noninterference.",
    "class": "hyperproperty (property); step (type-system sufficient condition)",
    "source": "Debenedetti2025; VolpanoSmithIrvine1996 (per-statement soundness of the sufficient condition)" }
]
```

**Relations** (`GENERATED` unless a source is named):

```json
[
  { "from": "EI-07", "to": "EI-01", "relation": "implies",
    "justification": "Noninterference against boundary B is the information form of locality at B (GM1982 defines NI; locality info-form defined as NI restricted to a boundary).",
    "source": "GM1982 (definitions)" },
  { "from": "EI-08", "to": "EI-07", "relation": "implies",
    "justification": "Separability of compartments C1,C2 is mutual noninterference between their user sets.",
    "source": "GENERATED (standard, cf. McLean1996 composition theory)" },
  { "from": "EI-05", "to": "EI-03", "relation": "implies",
    "justification": "A verified signature by a named key establishes that the value was authored by the key holder (integrity of authorship), a strengthening of store integrity for that value.",
    "source": "GENERATED (HEURISTIC)" },
  { "from": "EI-09", "to": "EI-07", "relation": "breaks-unless",
    "justification": "Declassification violates noninterference by design; it is acceptable only within the delimited-release / prudent-principles envelope (conservativity, monotonicity of release, non-occlusion).",
    "source": "SabelfeldSands2005" },
  { "from": "EI-02", "to": "EI-07", "relation": "sufficient-condition-per-step",
    "justification": "Per-statement label preservation (join rule + pc label) is a sound per-step sufficient condition for termination-insensitive NI in deterministic sequential programs; it is not equivalent to NI.",
    "source": "VolpanoSmithIrvine1996" },
  { "from": "EI-13", "to": "EI-07", "relation": "sufficient-condition-per-step",
    "justification": "Per-call no-dependency checks (CaMeL) are a sound per-step sufficient condition for guest non-dependency inside the restricted interpreter model; incomplete outside it.",
    "source": "Debenedetti2025" }
]
```

---

## 5. Q4 — Dedicated Audit: Is Per-Join Checking Sound?

**Section verdict: CONFIRMED** (with named counterexamples). Question: for each invariant I, if every step preserves I, does the chain? "Compositional" below means under *sequential* composition of steps (the map's chain model); parallel/feedback composition cited where it is the settled result.

| Invariant | Class | Compositional under sequential composition? | Settling result |
|---|---|---|---|
| EI-01 locality (event form) | trace (safety) | **YES** | Standard: safety properties are closed under trace concatenation — a chain emits no boundary-crossing event iff no step does (GENERATED lemma; definitional) |
| EI-01 locality (information form) = EI-07 | hyperproperty | **NO** | McCullough 1987 (generalized NI fails hook-up), 1988; Zakinthinos & Lee 1995 (two noninterference-composition theorems, JCS 3(4):269–281); Mantel 2002 (possibilistic properties need not be preserved) |
| EI-02 provenance | step | **YES, with pc-label side condition** | Explicit flows: Denning 1976 join rule; implicit flows require the pc label — Volpano–Smith–Irvine 1996 (RESULT) |
| EI-03 integrity | trace (safety) | **YES** | seL4 integrity proof is per-transition (Hoare-style) and refinement-preserved — Sewell et al. 2011 (RESULT) |
| EI-04 authority confinement | trace (safety) | **YES, under no-amplification** | Sewell et al. 2011 (authority confinement theorem); Maffeis et al. 2010 (capability safety ⇒ authority safety ⇒ isolation, in their JS subset models) (RESULT per model) |
| EI-05 signature validity | step | **YES** | Definitional per-step (GENERATED) |
| EI-06 freshness | trace | **Under condition** (monotonic time, bounded delay between steps) | GENERATED; without the bound, store-then-late-read yields stale data that per-step checks pass |
| EI-07 noninterference | hyperproperty | **NO**; compositional only for strengthened properties: restrictiveness (McCullough 1987), forward correctability (Johnson & Thayer 1988, weaker and composable per Mantel 2002's survey), or under no-feedback hook-up conditions | McCullough 1987/1988; Zakinthinos & Lee 1995/1996/1997; Mantel 2002; McLean 1996 (composition theory for possibilistic properties) |
| EI-08 separability | hyperproperty | **NO under feedback**; also unsound with internal nondeterminism | Zakinthinos & Lee 1996 ("How and Why Feedback Composition Fails"); Roscoe & Wulf 1995 (separability not sound for internally nondeterministic systems) (RESULT) |
| EI-09 declass authority (who) | step | **YES** per-call | Myers & Liskov 1998 (relabeling sound & complete) |
| EI-09 (what dimension) | hyperproperty | **NO** | Aggregation defeats per-release checks; non-occlusion is required precisely because declassification can mask other leaks — Sabelfeld & Sands 2005 (RESULT) |
| EI-10 audit completeness | trace | **YES, with atomicity condition** (log precedes effect in the same step) | GENERATED; without atomicity, a crashed step has effects without records |
| EI-11 erasability | trace | **NO without no-copies side condition** | GENERATED structural result (analogue of forward correctability): erase locally, then read an old copy from another location — each step preserves its local EI-11, the chain violates global erasability |
| EI-12 leak budget | hyperproperty | **NO** | Aggregation counterexample: two steps each leak ≤1 bit (in budget), chain leaks 2 bits (over a 1-bit budget) — GENERATED counterexample; quantitative hyperproperties framework: Clarkson–Myers–Schneider 2009 |
| EI-13 guest non-dependency | hyperproperty; per-step sufficient condition exists | **Per-step check is sound but incomplete** | Type-system per-statement soundness: Volpano–Smith–Irvine 1996; runtime per-call enforcement: Debenedetti et al. 2025 (RESULT within their model) |

**Weakest extra conditions that restore composition** (from the literature): hook-up properties / restrictiveness or forward correctability for NI-class properties; no-feedback composition for separability; determinization of the abstract spec (as Murray et al. 2013 had to do for seL4 confidentiality); pc-labeling for implicit flows; atomic log-before-effect for audit; global copy/alias accounting for erasure; per-release budgets plus an aggregator-level total for leak bounds.

**Checker design consequence (for the map operator):** `compose.mjs` must return "whole-chain check required" — not a pass — for EI-01(info), EI-07, EI-08, EI-12, and the property-reading of EI-13, because per-join silence is unsound for these.

---

## 6. Q5 — Feasibility: Can a Personal Policy Be Checked by Per-Join Propagation?

**Section verdict: DEAD as stated; MARGINAL for the trace-property subclass.**

| Step | Claim | Best supporting result | Main gap | Verdict |
|---|---|---|---|---|
| 1 | Every D9 op has a context-independent effect profile | Effect systems: static effect annotations (Lucassen–Gifford 1988); seL4: security theorems with explicit configuration assumptions (Murray et al. 2013) | Handlers re-interpret effects (Plotkin–Pretnar 2009); whether `send` breaks locality depends on the channel; whether `declassify` is authorized depends on ownership state. Profiles are only well-defined *relative to stated environment assumptions* (the seL4 approach) | **NEEDS REFINEMENT** — fatal only in the naive reading |
| 2 | Effect profiles compose into a chain profile | Safety-property closure; integrity refinement chain (Sewell et al. 2011) | False for hyperproperties (McCullough 1987/1988; Mantel 2002) | **DEAD as stated**; true for trace/safety invariants |
| 3 | Each example policy is preservation of named invariants | Policy 1 ("W never leaves the device") = EI-01 event form ✓; Policy 2 ("nothing merged without owner's signature") = EI-03/EI-05 preservation ✓; Policy 3 ("no agent acts on guest text") = EI-13 ✓ *as a sufficient per-step condition* | Policies 1 and 3 in their *information* readings are EI-07-class and cannot be stated as per-step invariant preservation | **CONFIRMED** for operational readings; **NEEDS REFINEMENT** for information readings |
| 4 | Per-join propagation is sound | Volpano–Smith–Irvine 1996 per-statement soundness; CaMeL per-call soundness; Sewell 2011 per-transition integrity | Unsound for noninterference-family invariants: McCullough's counterexample, Zakinthinos–Lee, Mantel; Roscoe–Wulf on separability | **DEAD for the universal claim**; sound for the trace/safety subclass and for step-expressible sufficient conditions |
| 5 | Per-join propagation is useful | Forward correctability is weaker than restrictiveness yet composable (Mantel 2002); CaMeL deployment shows practical acceptability | Restrictiveness-type per-step checks reject correct systems (McCullough; Mantel); type-based no-dependency is incomplete; CaMeL costs ~2.8× tokens | **MARGINAL** |

**Earliest fatal step:** Step 4 (with Step 1 fatal only under naive context-independence). The chain "satisfies policy iff no step breaks invariant" fails exactly where the policy invariant is a hyperproperty.

**Failure-mode disposition:**

- **(a) Hyperproperties (noninterference):** fatal to *per-join checking of the property itself*; confines the approach to step-expressible sufficient conditions (type systems, per-call taint/capability checks) or to strengthened composable properties (restrictiveness, forward correctability) — a *structural* gap, not a missing side condition.
- **(b) Implicit flows (control, timing, resource):** not fatal; a *local, repairable* side condition — pc-labeling (Volpano–Smith–Irvine 1996); timing/resource channels remain outside any per-join value-label system entirely (Murray et al. 2013 explicitly exclude timing channels from their proof).
- **(c) Aggregation:** fatal for per-release/per-join budgets; confines leak-budget policies to a chain-level accumulator check (quantitative hyperproperty, whole-chain).
- **(d) Context dependence:** not fatal if profiles are stated relative to explicit environment assumptions and the checker tracks assumptions across joins (the seL4 configuration-assumptions pattern); fatal only for the claim of absolute context independence.

**Gap characterization:** for trace/safety invariants the per-join-to-whole-chain gap is a matter of *local side conditions* (pc labels, atomicity, time bounds, no-copies accounting) — repairable within the per-join architecture. For the noninterference family it is the *logical class of the property* (hyperproperty vs. trace property) — repairable only by changing what is checked (strengthened composable properties, or whole-chain relational methods: self-composition, HyperLTL/self-composed model checking, TLA-style k-behavior verification).

---

## 7. Critical Obstructions

1. **Noninterference is not compositional** (McCullough 1987/1988; Zakinthinos & Lee 1995; Mantel 2002) — the load-bearing obstruction; kills checkability-claim-3 for any policy in the noninterference family, including "no agent acts on guest data" in its dependency reading.
2. **Confidentiality vs. integrity asymmetry** — seL4's own verification had to determinize the spec and add configuration assumptions for confidentiality (Murray et al. 2013), while integrity went through by ordinary Hoare reasoning (Sewell et al. 2011). The map must treat them as different invariant kinds with different checker rules.
3. **Context dependence of effect profiles** — handlers (Plotkin–Pretnar 2009), channel choice, ownership state. The only rigorous workaround found: state assumptions explicitly and thread them through joins (seL4 pattern).
4. **Aggregation and the what-dimension of declassification** — per-step release authorization cannot bound total disclosure (Sabelfeld & Sands 2005; Clarkson–Myers–Schneider 2009).
5. **Erasure requires global copy accounting** — per-step "erased" verdicts are unsound without it (structurally the forward-correctability problem).
6. **Timing/resource channels are invisible to value-label propagation** — excluded even from the strongest published kernel proof (Murray et al. 2013); any personal policy about them needs a different mechanism entirely.

## 8. Bottom-Line Assessment

**Verdict: NEEDS REFINEMENT** (charitable reading of the whole program) — the checkability claim as stated is **DEAD**.

**Strongest defensible reformulation:** per-join invariant propagation is **sound and useful for trace-property invariants (safety) over operation chains** — locality-event-form, integrity, authority confinement, signature validity, audit — **under stated local side conditions** (pc labels, log-before-effect atomicity, bounded freshness windows, no-copy erasure accounting), with effect profiles expressed *relative to explicit environment assumptions*. **Hyperproperty invariants (noninterference, separability, leak budgets, guest non-dependency as a property) are not per-join checkable**; for them the checker must either (i) verify a step-expressible sufficient condition (type/per-call no-dependency à la Volpano–Smith–Irvine 1996 and CaMeL 2025 — sound, incomplete), (ii) verify a strengthened composable property (restrictiveness / forward correctability), or (iii) escalate to a whole-chain relational check (self-composition, HyperLTL, TLA-style). This reformulation is exactly what the strongest available engineering existence proofs — seL4's proof architecture and CaMeL's runtime — already instantiate in their respective models.

## 9. Bibliography

1. J. B. Dennis, E. C. Van Horn. *Programming Semantics for Multiprogrammed Computations.* CACM 9(3):143–155, 1966.
2. D. E. Denning. *A Lattice Model of Secure Information Flow.* CACM 19(5):236–243, 1976.
3. B. Lampson. *A Note on the Confinement Problem.* CACM 16(10):613–615, 1973.
4. D. K. Gifford, J. M. Lucassen. *Integrating Functional and Imperative Programming.* Proc. 1986 ACM Conf. on Lisp and Functional Programming, pp. 28–38, 1986.
5. J. M. Lucassen, D. K. Gifford. *Polymorphic Effect Systems.* POPL 1988, pp. 47–57.
6. J.-P. Talpin, P. Jouvelot. *Polymorphic Type, Region and Effect Inference.* J. Functional Programming 2(3):245–271, 1992.
7. J. A. Goguen, J. Meseguer. *Security Policies and Security Models.* IEEE S&P 1982, pp. 11–20.
8. J. A. Goguen, J. Meseguer. *Unwinding and Inference Control.* IEEE S&P 1984, pp. 75–86.
9. D. Volpano, G. Smith, C. Irvine. *A Sound Type System for Secure Flow Analysis.* Journal of Computer Security 4(3):167–187, 1996.
10. A. C. Myers, B. Liskov. *A Decentralized Model for Information Flow Control.* SOSP 1997, pp. 129–142.
11. A. C. Myers, B. Liskov. *Complete, Safe Information Flow with Decentralized Labels.* IEEE S&P 1998, pp. 186–197.
12. A. Sabelfeld, A. C. Myers. *Language-Based Information-Flow Security.* IEEE JSAC 21(1):5–19, 2003.
13. A. Sabelfeld, D. Sands. *Dimensions and Principles of Declassification.* CSFW 2005, pp. 255–269.
14. S. Zdancewic, A. Myers. *Robust Declassification.* CSFW 2001, pp. 15–23.
15. M. S. Miller. *Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control.* PhD thesis, Johns Hopkins University, 2006. *(unverified in desk check)*
16. S. Maffeis, J. C. Mitchell, A. Taly. *Object Capabilities and Isolation of Untrusted Web Applications.* IEEE S&P 2010.
17. G. Klein et al. *seL4: Formal Verification of an OS Kernel.* SOSP 2009, pp. 207–220.
18. T. Sewell, S. Winwood, P. Gammie, T. Murray, J. Andronick, G. Klein. *seL4 Enforces Integrity.* ITP 2011, LNCS 6898, pp. 325–340.
19. T. Murray et al. *seL4: From General Purpose to a Proof of Information Flow Enforcement.* IEEE S&P 2013, pp. 415–429.
20. J. Woodruff et al. *The CHERI Capability Model: Revisiting RISC in an Age of Risk.* ISCA 2014.
21. R. Milner. *Communicating and Mobile Systems: The π-Calculus.* Cambridge University Press, 1999.
22. R. Focardi, R. Gorrieri. *A Taxonomy of Security Properties for Process Algebras.* J. Computer Security 3(1):5–34, 1995.
23. E. Debenedetti et al. *Defeating Prompt Injections by Design.* arXiv:2503.18813, 2025 (SaTML 2026).
24. D. McCullough. *Specifications for Multi-Level Security and a Hook-Up Property.* IEEE S&P 1987, pp. 161–166.
25. D. McCullough. *Noninterference and the Composability of Security Properties.* IEEE S&P 1988, pp. 177–186.
26. A. Zakinthinos, E. S. Lee. *The Composability of Non-Interference.* CSFW 1995, pp. 2–8; journal version JCS 3(4):269–281, 1995.
27. A. Zakinthinos, E. S. Lee. *How and Why Feedback Composition Fails.* CSFW 1996, pp. 95–101.
28. A. Zakinthinos, E. S. Lee. *A General Theory of Security Properties.* IEEE S&P 1997, pp. 94–102.
29. H. Mantel. *On the Composition of Secure Systems.* IEEE S&P 2002, pp. 88–104.
30. J. McLean. *A General Theory of Composition for a Class of "Possibilistic" Security Properties.* IEEE TSE 22(1):53–67, 1996.
31. A. W. Roscoe, L. Wulf. *Composing and Decomposing Systems under Security Properties.* CSFW 1995, pp. 9–15.
32. D. M. Johnson, F. J. Thayer. *Security and the Composition of Machines.* CSFW 1988.
33. J. Rushby. *Noninterference, Transitivity, and Channel-Control Security Policies.* SRI CSL-92-2, 1992.
34. M. R. Clarkson, F. B. Schneider. *Hyperproperties.* JCS 18(6):1157–1210, 2010 (prelim. CSF 2008, pp. 51–65).
35. M. R. Clarkson, A. C. Myers, F. B. Schneider. *Quantifying Information Flow with Beliefs.* JCS 17(5):655–701, 2009.
36. M. R. Clarkson, B. Finkbeiner, M. Koleini, K. K. Micinski, M. N. Rabe, C. Sánchez. *Temporal Logics for Hyperproperties.* arXiv:1401.4492 (POST 2014).
37. G. Barthe, P. R. D'Argenio, T. Rezk. *Secure Information Flow by Self-Composition.* MSCS 21(6):1207–1252, 2011.
38. B. Finkbeiner. *Model Checking Algorithms for Hyperproperties* (invited), covering HyperLTL/Büchi-automata reduction and self-composition, 2021.
39. G. Plotkin, J. Power. *Algebraic Operations and Generic Effects.* Appl. Categ. Struct. 11(1):69–94, 2003.
40. G. Plotkin, M. Pretnar. *Handlers of Algebraic Effects.* ESOP 2009, LNCS 5502, pp. 80–94.

**Verification-status flags:** items 15 (Miller 2006), and the Nielson–Nielson and Leijon/Koka citations mentioned in Q1, were not independently verified this session and carry no load. All other items were checked against primary PDFs, publisher records, or authoritative bibliographies in this desk research.

---

*Next per the program: feed the D9 entries to MM-DR-002 (Android bindings); run MM-DR-003 (prior art) after both return.*
