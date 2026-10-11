# MM-DR-003 external-equivalence review

**Research date:** 2026-10-11  
**Normative input:** `MM-DR-003-package.zip` (`d9-entries.json`, `effect-invariants.json`, `invariant-relations.json`, `android-bindings.json`)  
**Scope:** Official documentation, repositories, papers, and release pages where available.

> **Negative-result caveat:** “No verified direct equivalent” means no direct equivalent was verified in the cited sources. It does not prove that no unpublished, private, or newly created project exists.

## Executive verdict

| Question | Answer | Closest precedent |
|---|---|---|
| Existing static or dynamic Android mapping for the exact D9 model? | **No verified direct equivalent** | SuSi, PScout/Stowaway/Axplorer, TaintDroid/FlowDroid/DroidSafe, Android AppOps |
| Language/runtime with abstract typed operations, reusable platform libraries, and declarative composition? | **No complete equivalent** | **Effect TS** operationally; **Koka** type-theoretically |
| Policy system composing declarative profiles over those operations? | **No complete equivalent** | **Zelkova/AWS Access Analyzer** for semantic policy inclusion; OPA for general policy encoding |
| OS capability design with typed operation atoms and invariant-preserving profiles? | **No complete equivalent** | **Fuchsia** and **Genode** are closest; seL4 and Capsicum provide lower-level capability enforcement |

The closest implementable combination is:

1. Keep the supplied D9 operation/invariant schema as normative.
2. Treat Android permissions, AppOps, APIs, and AppFunctions metadata as **versioned evidence and enforcement adapters**, not as D9 semantics.
3. Use taint systems only as optional validators.
4. Use an OPA-like or SMT-like checker for profile composition, while borrowing the subset/reference-policy idea from Zelkova.
5. Borrow capability-routing and session-mediation ideas from Fuchsia and Genode, respectively.

---

## 1. Android binding decision

### Recommendation

**Do not bind D9 semantics directly to Android permission names or generic categories such as “location,” “camera,” or “network.”**

Instead, bind each D9 operation through a versioned, concrete tuple:

```text
(
  d9OperationId,
  androidApiLevel,
  concreteSignature,
  operationKind,
  requiredRuntimeCheck,
  evidenceSource
)
```

The binding should distinguish:

- the **D9 semantic operation**, which is normative;
- the Android API or service call that realizes it;
- the platform permission or AppOp used for enforcement;
- any intent, provider, binder, or AppFunction interface used for delivery;
- the Android release in which that evidence is valid.

This is necessary because Android mechanisms have different meanings:

- `<uses-feature>` is informational; Android itself does not use it as a general runtime authorization mechanism.
- Intent filters advertise handling for implicit intents; an explicit intent can still bypass them, so they are not a complete authority boundary.
- Android AppOps models operational events such as instantaneous and long-running operations, and can record proxied access through `noteProxyOp`, but it remains an Android operation/audit vocabulary rather than a composable invariant algebra.
- AppFunctions require a protected service declaration, generated metadata, and `EXECUTE_APP_FUNCTIONS` for discovery/execution by authorized callers.
- MCP annotations are explicitly untrusted behavioral hints, not guarantees or permissions.

### Compatible versus incompatible mappings

| Android artifact | Compatibility with D9 | Reason |
|---|---|---|
| Permission name | **Incompatible as semantic binding** | Grants or labels access; does not identify the exact semantic operation, data direction, state change, or invariant behavior |
| AppOp name | **Compatible as runtime evidence** | Operation-oriented and auditable, but still platform-specific and not self-describing |
| Concrete Java/Kotlin signature | **Compatible, versioned** | Precise, but implementation may change across API levels |
| ContentProvider/URI operation | **Compatible with scope metadata** | Concrete and enforceable, but authority/path semantics must be normalized |
| Intent action plus data/category | **Partially compatible** | Useful for discovery and dispatch; explicit intents and exported-component configuration complicate semantic authority |
| Android AppFunction schema | **Compatible as a typed execution surface** | Gives typed parameters, descriptions, discovery, and controlled execution; does not supply D9 invariant composition |
| MCP-style annotations | **Not an enforcement binding** | Hints may be wrong or malicious; authorization remains server/client-side |
| Generic “sensitive data” or “safe” label | **Incompatible** | Does not preserve the distinction between read, write, export, identity, and irreversible effects |

**Practical rule:** bind D9 IDs to concrete Android behavior, then map that behavior to permissions/AppOps. Never derive the D9 meaning from the permission alone.

### Role of AppFunctions

Android AppFunctions is the most relevant current Android interface because it provides typed, discoverable, locally executable operations through `AppFunctionManager`. It can expose a D9 realization as an agent-callable tool, but it should not become the semantic source of truth:

- it has an execution permission boundary;
- functions can be individually enabled or disabled;
- it is currently experimental/alpha rather than a mature stable contract;
- its generated XML describes invocation metadata, not invariant-preserving relations among semantic operations.

As of the 2026-10-07 Jetpack update, AppFunctions remains at **1.0.0-alpha13**, with recent API renames and access-level additions, confirming that the interface is still changing.

---

## 2. Closest language or runtime system

### Effect TS: closest operational match

Effect TS is the closest practical runtime analogue:

- computations are represented by the typed `Effect<A, E, R>` model;
- requirements are tracked in types;
- `Context`, tags, and `Layer` support dependency injection and composition;
- `@effect/platform` exposes abstract services such as `FileSystem` and `Terminal`;
- platform packages adapt those services to Node.js, Deno, Bun, and browsers.

This closely matches the “same abstract operation, different runtime realization” part of D9.

However, it is not a D9 equivalent:

- an Effect service is an application/library interface, not a standardized platform-wide semantic atom;
- the type system tracks service requirements and errors, not externally standardized state-transition invariants;
- there is no built-in cross-operation relation such as “composition with this operation preserves or breaks invariant X”;
- platform layers provide implementations, not a reusable registry of externally governed effect profiles.

### Koka: closest type-theoretic match

Koka supports abstract effect operations, row-polymorphic effects, inference, and effect handlers. Its documentation represents effects in function types and lets handlers implement user-defined operations in a typed and composable way. The foundational paper describes duplicate-label row polymorphism and open effect rows.

This is close to D9’s notion of typed operations and composable effects, but Koka does not provide:

- Android-specific operation profiles;
- reusable cross-runtime platform libraries in the Effect TS sense;
- a standardized invariant registry;
- platform authorization mappings.

### Why OCaml is not the closest match

OCaml has efficient native effect handlers, but its user-defined effects are currently unchecked: an unhandled effect is a runtime failure rather than an effect guaranteed by the function type. Thus it lacks the declarative type-level operation profile requested in the prompt.

### Conclusion for language/runtime equivalence

- **Best operational analogue:** Effect TS.
- **Best formal effect-system analogue:** Koka.
- **No verified system combining both with D9-style invariant profiles and Android mappings.**

---

## 3. Closest policy-composition system

### OPA/Rego

OPA is a mature, general-purpose policy engine. Rego is declarative, composes rules and packages, and can evaluate arbitrary structured JSON input. That makes it suitable for implementing a D9 checker.

What OPA does not provide:

- a canonical D9 operation vocabulary;
- native effect-invariant semantics;
- built-in preserved/broken relations;
- platform-specific Android bindings;
- automatic proof that a profile preserves a semantic invariant.

OPA can encode D9, but the semantics would come from the D9 schema and its interpreter/checker, not from Rego itself.

### Zelkova/AWS IAM Access Analyzer

Zelkova is semantically closer to invariant checking than a generic rule engine. It encodes AWS policies as logical formulas and checks properties over all request contexts.

The AWS `CheckNoNewAccess` model is especially relevant: a candidate policy passes when it grants no access beyond a reference policy. Conceptually, that resembles checking whether a composed profile stays within a preserved-invariant boundary.

The limitation is scope:

- it reasons about AWS principals, actions, resources, and IAM conditions;
- the underlying engine is not an open, domain-neutral D9 implementation;
- AWS action names are service authorization actions, not typed state-changing semantic atoms;
- it does not model reusable Android runtime profiles.

### CaMeL

CaMeL is a newer capability-enforcement architecture for LLM-agent tool calls. It separates trusted control flow from untrusted data flow and uses capabilities and policies to prevent unauthorized exfiltration during tool invocation. Its released code is Apache-2.0.

It is relevant because it enforces policies over operation calls and data flows, but:

- it targets LLM-agent execution rather than OS-wide operation profiles;
- policies and capabilities are framework-specific;
- it does not provide D9’s reusable cross-layer operation/invariant registry.

### Conclusion for policy equivalence

- **Closest formal composition idea:** Zelkova’s semantic inclusion/reference-policy check.
- **Best general implementation substrate:** OPA.
- **Closest dynamic agent-enforcement analogue:** CaMeL.
- **No verified existing policy engine natively implements D9 profile composition.**

---

## 4. Closest OS capability paper, framework, or design

### Fuchsia

Fuchsia is the closest complete OS-level design. Components declare capabilities they use and provide; capabilities are routed through explicit `use`, `offer`, and `expose` relationships; and every route must resolve from consumer to provider. Directory capabilities can carry rights such as read-only access, while protocols, services, directories, storage, dictionaries, runners, and resolvers are first-class capability types. Fuchsia also makes least privilege structural: a newly created program initially has no ability to act and receives only the capabilities supplied by its creator.

Why it is still not D9:

- FIDL protocols are typed, but a capability generally grants access to a protocol or service, not a standardized semantic operation atom;
- rights are often service- or directory-shaped rather than invariant-shaped;
- there is no native D9-style relation stating that one operation preserves or breaks another operation’s invariant;
- profiles are component/topology configurations, not reusable semantic effect profiles.

### Genode

Genode is arguably closest at the service-composition layer. Parents create children, mediate session creation, and decide whether to deny, implement, forward, or interpose a requested service. The resulting session capability provides the service-specific interface. Genode capabilities refer to typed RPC objects, and capability delegation occurs through capability arguments in RPC calls.

This maps well to composable least-authority systems:

- the parent can enforce policy when a session is created;
- intermediate components can interpose;
- capabilities are delegated and typed by RPC interface;
- sessions can be scoped and resource-bounded.

But operation semantics remain service-specific. Genode does not itself define a universal semantic-effect algebra or invariant registry.

### seL4

seL4 provides fine-grained, kernel-enforced object capabilities, delegation, subdivision, and formal proofs of isolation and security enforcement. It is strong where Fuchsia and Genode are higher-level:

- unforgeable capabilities;
- rights attached to kernel objects;
- verified enforcement;
- controlled delegation and revocation structures.

Its limitation is abstraction level: seL4 capabilities authorize kernel-object operations, not application-level semantic effects such as “export user-selected content.” A system built on seL4 would still need a D9 layer above it.

### Capsicum

Capsicum extends UNIX with capability mode and fine-grained file-descriptor capabilities, allowing processes to retain selected rights while losing access to global namespaces. It is an important practical design because it works within a UNIX programming model.

However:

- rights are descriptor/syscall-oriented;
- no typed semantic operation registry is provided;
- invariant composition is left to the application;
- it does not model Android-style permission or AppOp semantics.

### Conclusion for OS equivalence

- **Closest complete OS architecture:** Fuchsia.
- **Closest policy-mediating component architecture:** Genode.
- **Strongest low-level enforcement primitive:** seL4.
- **Closest practical UNIX capability model:** Capsicum.
- **No cited OS design natively combines typed semantic operation atoms, reusable invariant profiles, and cross-layer composition.**

---

## 5. Maintenance, licensing, and practical-reuse ledger

Dates are publication/update dates where an official dated source was available. Where no reliable public release date was identified, the date below is the **2026-10-11 review date**, not an invented commit date.

### Android mappings and analyzers

| System | Status as of 2026-10-11 | License/reuse assessment | D9 relevance |
|---|---|---|---|
| SuSi | Historical NDSS 2014 research system; no active platform-profile lineage verified | Research artifact/source license must be verified before incorporation | Source/sink categories can inform D9 classes but do not provide invariant profiles |
| PScout | Historical CCS 2012 permission-mapping work; legacy dataset/tool | Academic artifact; reuse terms require verification | API-to-permission evidence only |
| Stowaway | Historical CCS 2011 permission-specification work; legacy | Academic artifact; verify dataset license | Permission evidence only |
| Axplorer | Historical 2016 Android framework/permission mapping work; legacy | Academic artifact; verify reuse terms | API-to-permission evidence only |
| TaintDroid | Historical OSDI 2010 system; important research lineage | AOSP-derived licensing and modified sources must be reviewed | Dynamic taint validation, not declarative profiles |
| FlowDroid | Maintained research/static-analysis lineage; project remains usable but is not an Android semantic-profile platform | Apache-2.0 project licensing should still be checked per module/version | Possible taint backend; not a D9 authority source |
| DroidSafe | Historical NDSS 2015 system; legacy | Research license/reuse terms require verification | Static flow validation only |
| Android AppOps | Active Android platform mechanism in AOSP; documented behavior remains current | AOSP Apache-2.0, subject to file-level notices | Best Android-native operation/audit evidence |
| Android AppFunctions | **Active but alpha:** 1.0.0-alpha13 released 2026-10-07 | Android/Jetpack ecosystem and sample repository are Apache-2.0; review artifact-level terms | Best current typed Android execution surface |

### Effect languages and runtimes

| System | Status as of 2026-10-11 | License/reuse assessment | D9 relevance |
|---|---|---|---|
| Effect TS | Active; repository documents Effect 4.x LTS and current runtime requirements | Verify exact package license before redistribution | Closest reusable cross-runtime service abstraction |
| Koka | Active; repository shows v3.2.9 dated 2026-09-17 | Verify compiler/runtime license in the exact release | Closest row-typed effect-operation model |
| OCaml effect handlers | Active language/runtime feature, but user effects are unchecked | OCaml compiler/runtime licensing is generally LGPL-style with linking exceptions; verify release | Useful contrast, not a typed D9 profile system |

### Policy systems

| System | Status as of 2026-10-11 | License/reuse assessment | D9 relevance |
|---|---|---|---|
| OPA | Active CNCF graduated project; 2026 release stream includes v1.21.x | Apache-2.0 | Good policy-evaluation substrate; D9 semantics must be encoded |
| Zelkova/AWS Access Analyzer | Active as AWS automated-reasoning technology; current AWS sample/API ecosystem remains in use | Proprietary AWS service; open samples are not the reasoning engine | Closest semantic inclusion/reference-policy model |
| CaMeL | Research implementation from 2025; paper revised 2025-06-24; code available | Apache-2.0 repository | Closest tool-call capability/data-flow enforcement analogue |

### OS capability systems

| System | Status as of 2026-10-11 | License/reuse assessment | D9 relevance |
|---|---|---|---|
| Fuchsia | Active; official capability/component documentation updated in mid-2026 | Multi-license project; perform per-directory/package review | Closest OS-wide explicit capability routing |
| Genode | Active; 25.11 release line visible in current project listings | Genode has AGPL/commercial licensing arrangements; verify deployment model | Closest parent-mediated service/session composition |
| seL4 | Active; current whitepaper page updated 2026-09-18 | Generally BSD-style kernel licensing; verify associated libraries/tools | Strongest verified low-level capability enforcement |
| Capsicum | Mature FreeBSD capability/sandbox feature; no standalone application-profile layer identified at review date | BSD-licensed FreeBSD components | Practical descriptor-rights model, below D9 abstraction |
| MCP | Active protocol ecosystem; curriculum reports current 2026-07-28 revision | Specification repository is MIT-licensed | Useful metadata/interoperability model, but annotations are not enforcement |

---

## 6. Paper and canonical-source anchors

### Older Android mapping and analysis papers

1. **SuSi — “Efficient and Precise Taint Analysis for Android with SuSi”**, NDSS 2014  
   https://www1.cs.fau.de/projects/susi/

2. **PScout — “PScout: Analyzing the Android Permission Specification”**, CCS 2012  
   https://doi.org/10.1145/2382196.2382222

3. **Stowaway — “Android Permissions Demystified”**, CCS 2011  
   https://doi.org/10.1145/2046707.2046779

4. **Axplorer — “On Demystifying the Android Application Framework: Re-Visiting Android Permission Specification Analysis”**, USENIX Security 2016  
   https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/backes

5. **TaintDroid — “TaintDroid: An Information-Flow Tracking System for Realtime Privacy Monitoring on Smartphones”**, OSDI 2010  
   https://www.usenix.org/legacy/events/osdi10/tech/full_papers/Enck.pdf

6. **FlowDroid — “FlowDroid: Precise Context, Flow, Field, Object-sensitive and Lifecycle-aware Taint Analysis for Android Apps”**, PLDI 2014  
   https://doi.org/10.1145/2594291.2594299

7. **DroidSafe — “Information Flow Analysis of Android Applications in DroidSafe”**, NDSS 2015  
   https://www.ndss-symposium.org/ndss2015/ndss-2015-information-flow-analysis-android-applications-droidsafe

### Additional anchors

8. **Koka — “Programming with Row-Polymorphic Effect Types”**  
   https://arxiv.org/abs/1406.2061

9. **Zelkova — “Semantic-based Automated Reasoning for AWS Access Policies using SMT”**  
   https://www.amazon.science/publications/semantic-based-automated-reasoning-for-aws-access-policies-using-smt

10. **CaMeL — “Defeating Prompt Injections by Design”**  
    https://arxiv.org/abs/2503.18813

11. **seL4 — “seL4: Formal Verification of an OS Kernel”**  
    https://doi.org/10.1145/1629575.1629596

12. **Capsicum — “Capsicum: Practical Capabilities for UNIX”**  
    https://www.usenix.org/legacy/events/sec10/tech/full_papers/Watson.pdf

### Official project/documentation starting points

- Android AppOps: https://developer.android.com/reference/android/app/AppOpsManager
- Android AppFunctions: https://developer.android.com/jetpack/androidx/releases/appfunctions
- Effect TS: https://effect.website/docs/
- OPA: https://www.openpolicyagent.org/docs/latest/
- Fuchsia capabilities: https://fuchsia.dev/fuchsia-src/concepts/components/v2/capabilities
- Genode: https://genode.org/
- seL4: https://sel4.systems/
- FreeBSD Capsicum: https://man.freebsd.org/cgi/man.cgi?query=cap_rights_limit
- Model Context Protocol: https://modelcontextprotocol.io/

---

## Final determination

There is **no verified existing system that simultaneously provides**:

1. abstract, typed platform-operation atoms;
2. reusable operation profiles across application/runtime layers;
3. preserved/broken invariant semantics and operation relations;
4. declarative profile composition;
5. concrete Android API mappings; and
6. OS-enforced capability semantics.

The closest reusable design is therefore a synthesis:

- **D9 schema:** normative operation and invariant model from the supplied package.
- **Android layer:** concrete API/AppOps/AppFunction bindings.
- **Effect layer:** Effect TS-style service/layer portability or Koka-style typed operations.
- **Policy layer:** OPA-style evaluation plus Zelkova-style semantic inclusion.
- **OS layer:** Fuchsia-style capability routing or Genode-style session mediation.
- **Analysis layer:** FlowDroid/TaintDroid-style validation only, never as the source of semantic truth.
