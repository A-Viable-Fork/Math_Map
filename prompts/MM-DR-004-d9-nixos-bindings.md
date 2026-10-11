# Title: Binding Abstract Operations on State to NixOS: Which Linux Mechanisms and NixOS Options Realize Each Operation, Where the Desktop Enforces Their Effects, What a Policy Needs Beyond the Phone's Vocabulary, and What Nix's Own Operations Guarantee

**Prompt ID:** MM-DR-004 (the desktop counterpart of MM-DR-002; takes the D9 entries of MM-DR-001 and the Android bindings of MM-DR-002 as input)
**Target:** a binding layer `mapfill/nixos.js` binding the D9 entries of Math_Map to NixOS and the Linux kernel at a pinned nixpkgs commit, and candidate D9 entries for Nix's own operations
**Scaffold:** Math_Map (A-Viable-Fork/math_map); downstream user: the desktop realization of A-Viable-Fork/Research_OS (NixOS, dual-booted, agents running under their own accounts)
**Direction:** For each abstract operation, find the Linux mechanisms and NixOS options that realize and confine it, where the desktop enforces the operation's effects, where effects escape, and what vocabulary a desktop policy needs that the phone's binding did not.
**Date:** 2026-10-11

*Attach: `d9-entries.json`, `effect-invariants.json` and `invariant-relations.json` (27 operations, 19 invariants with their classes; GENERATED, not audited entry by entry), and `android-bindings.json` (the MM-DR-002 Android binding at `android-16.0.0_r4`, graded; the model for the shape of this answer). Before sending: strip the Scaffold Update Notes at the end.*

---

## Context and Setup

Math_Map holds operations as typed entries: input, output, invariants preserved and invariants broken. Domain D9, "Systems and effects", holds abstract operations on state (send, store, read sensor, isolate, grant capability, revoke, declassify, spawn, and others; the attached list is authoritative), with effect invariants such as locality, no historical egress, provenance, compartment origin, guest origin and signature (the attached vocabulary is authoritative; each invariant has a class: state, step, trace, relational or hyperproperty).

A **binding** says that a concrete mechanism realizes an abstract operation, and records where it deviates. The Android binding exists (attached). This prompt asks for the desktop binding, so that the phone and the desktop share operations and differ only in bindings.

The desktop is NixOS. Its whole configuration is one declarative description built from a pinned nixpkgs. AI agents run on it under their own Unix accounts, separate from the person's account; the person's signing key lives under the person's account. A desktop policy is written once (for example "data originating in compartment W never leaves the machine", an invented example) and must compile to NixOS configuration. Compartments on the desktop are realized with separate accounts, systemd services and their sandboxing, namespaces, or containers; say which suits which effect.

**Platform pin.** nixpkgs commit `7c8764b7c7b09b34f632464276218ef9090eaa11` on branch `nixos-26.05` (`lib/.version` reads 26.05 at that commit). Every NixOS option and module citation names a path in nixpkgs at that commit. For kernel mechanisms, state the kernel version NixOS 26.05 uses by default at that commit, and cite the kernel source or documentation for that version. For systemd, state the version packaged at that commit.

### Claimed inputs (desk work, 2026-10-11, unverified)

Treat these as proposals to test. Do not assume any is correct unless independently supported.

1. Every effect an agent's process causes outside its own memory passes through at least one point the kernel or a privileged service controls (a system call checked by DAC, an LSM such as Landlock or AppArmor, seccomp, a namespace boundary, netfilter, D-Bus policy, a portal, PipeWire's permission store, the display server).
2. Each such point can attribute the effect to the account, service or cgroup that caused it.
3. A policy stated once over D9 invariants compiles to NixOS options alone, with no runtime component beyond what NixOS configures.
4. The vocabulary the Android binding needed (effect invariants, the compartment context label, the two assurance levels) suffices for the desktop.

Claims 1 and 4 are the load-bearing ones. Claim 4 is the measurement this round exists for.

### Lessons carried from MM-DR-001 and MM-DR-002 (settled in verification, apply them here)

- **An operation name does not fix its effect.** Name the **parameters** that decide each binding's effect (destination inside or outside the machine, the account it runs under, the namespace, the bus), and state deviations per parameter value where they differ.
- **Grade twice.** Give each binding a `platformAssurance` (what the mechanism itself supplies) and a `contractAssurance` (how much of the whole D9 contract, including where the bytes came from, the desktop can supply): each one of *enforced* (a check the process cannot bypass), *monitored* (observable after the fact), *unknown*, *not observable*. On Android, primitives were mostly enforced while every full contract was unknown or not observable: access is checked, provenance is not. Say whether the same holds here and where it does not.
- **Silence is not preservation.** Never list an origin or provenance invariant as preserved because the mechanism says nothing about it.
- **Zero permission is not zero mediation.** On Android, motion sensors need no permission yet are cut off for idle apps and rate-capped; two of three reports missed this. Look for the mediation that exists even where no permission is asked.
- **Prefer configuration to interposition.** The phone's Regulator enforces by setting policy through interfaces the platform already exposes rather than by hooking. Prefer NixOS options and existing mechanisms; name interposition (eBPF LSM programs, a custom proxy) as a separate, heavier option.
- **Paths are checked.** In MM-DR-002, a path labeled "verified" returned 404 at the tag. Every path you give will be fetched at the pinned commit; give a sha256 of each source file you read, and say plainly when you did not read it.
- **A binding may have no realization.** If no mechanism realizes an entry, say so with `"mechanism": null` and `platformAssurance: "not observable"`, and a note saying why.
- **Physical and timing channels are excluded, never preserved.**

---

## Research Questions

### Part A: the desktop binding

#### Q1. For each attached D9 entry, which Linux mechanisms and NixOS options realize and confine it?

Layers to consider: system calls and DAC (accounts, groups, file modes), Linux namespaces (user, mount, network, PID, IPC), seccomp, Landlock (including its network rules and the ABI version available), AppArmor as packaged in NixOS, cgroups v2, netfilter and nftables (matching by socket owner UID or by cgroup), systemd unit sandboxing directives (for example `PrivateNetwork`, `IPAddressDeny`, `RestrictAddressFamilies`, `ProtectHome`, `ReadOnlyPaths`, `DynamicUser`, `SystemCallFilter`), the D-Bus system and session buses and their policy, xdg-desktop-portal, PipeWire and its permission store for microphone, camera and screen capture, the display server (Wayland compositors and X11), polkit, the kernel keyring and TPM-backed keys, and NixOS containers. For each binding report:

```json
{
  "entry": "D9-X01",
  "mechanism": "what realizes or confines it, e.g. netfilter owner match, or null",
  "nixosOptions": ["networking.nftables.ruleset", "systemd.services.<name>.serviceConfig.IPAddressDeny"],
  "path": "nixos/modules/... at the pinned commit",
  "kernel": { "feature": "e.g. Landlock network rules", "since": "kernel version", "source": "path or documentation URL" },
  "enforcementPoint": "where the check runs",
  "attributes": "what it can attribute: UID, cgroup, service, PID, none",
  "parameters": { "name": "what it decides" },
  "platformAssurance": "enforced | monitored | unknown | not observable",
  "contractAssurance": "enforced | monitored | unknown | not observable",
  "breaks": ["invariant-id"],
  "unestablished": ["invariant-id the desktop cannot establish for this binding"],
  "note": "how this binding deviates from the abstract entry, per parameter value",
  "sources": [{ "repo": "nixpkgs | linux | systemd | other", "path": "...", "sha256": "of the file as read, or null if not read" }],
  "verdict": "CONFIRMED | MARGINAL | PLAUSIBLE | NEEDS REFINEMENT | DEAD | UNVERIFIED"
}
```

#### Q2. Where does the desktop enforce each effect?

For each mechanism in Q1: what it checks, where the check runs, what it attributes, what it cannot see, and how a NixOS configuration turns it on. State which mechanisms an agent running under its own account can bypass, and how (for example a user namespace it may create, a session bus it shares, a socket left in a shared directory).

#### Q3. Where do effects escape enforcement on a desktop?

List channels by which data or authority crosses an account or compartment boundary without passing a point that can attribute it. For each: mechanism, versions affected, evidence (paper, CVE identifier, or source commit), and whether NixOS configuration at the pin can close it. Sub-targets:
- the display server: X11 lets any client read other clients' input and windows; what Wayland compositors packaged at the pin do instead;
- clipboard and drag and drop across accounts or sessions;
- shared `/tmp`, `/dev/shm`, abstract Unix sockets, and the session bus;
- GPU memory and drivers shared between accounts;
- timing and cache side channels between processes (state the class, then exclude it as the lessons say);
- the Nix store itself: world-readable by design; what an agent can learn from it, and what must never enter it (secrets);
- a dual-boot machine: what the other operating system can read of the NixOS partitions, and the reverse.

#### Q4. The vocabulary measurement

Take one invented policy: "data originating in compartment W never leaves the machine, and a process that has read W's data emits as W until it is reset" (the second clause is the per-process contamination rule; prior art Weir, USENIX Security 2016). Write it as a NixOS module sketch, with agents as separate accounts. Then answer:

1. Which parts of the policy compile to NixOS options alone, and which need a runtime component?
2. What does the desktop need that the attached D9 vocabulary and the Android binding do not have? List each as a candidate invariant, carrier, parameter or context label, with why the phone did not need it. If nothing, say so and say why.
3. What does the phone have that the desktop cannot realize?

This answer is the main output of the round. Do not inflate it: an addition counts only if the policy cannot be stated without it.

### Part B: Nix's own operations

#### Q5. Candidate D9 entries for the operations of a declarative system

Propose entries, in the attached D9 entry shape, for these operations as Nix performs them: realize a derivation in the build sandbox; fetch with a fixed output hash; evaluate a configuration (pure and with `--impure`); pin an input (flake lock); apply an overlay; switch to a new system generation; roll back to a previous generation; garbage-collect. For each, give the invariants it preserves and breaks, using the attached vocabulary where it fits and proposing new invariants where it does not (candidates: reproducibility, hermeticity, content addressing, reversibility; define each precisely, with its class).

#### Q6. Which of those guarantees does Nix enforce, and which are conventions?

For each guarantee in Q5: is it enforced by a mechanism at the pin (the build sandbox, the daemon, content addressing), monitored, or a convention a user can break? Name the settings and roles that break it (for example `sandbox = false`, trusted users of the daemon, `--impure`, `builtins.fetchurl` without a hash, a non-deterministic build) with paths at the pin. Cite reproducibility measurements of nixpkgs with their dates.

### Q7. Feasibility

Assess each step separately.

1. Every effect of an agent's process outside its memory passes a point the kernel or a privileged service controls (claimed input 1).
2. Each point attributes the effect to the agent's account, service or cgroup (claimed input 2).
3. The policy of Q4 compiles to NixOS configuration, with any runtime component named (claimed input 3).
4. The escape channels of Q3 are closed by configuration or confined to a stated, small class.
5. The phone's vocabulary suffices, or the additions are listed (claimed input 4).

For each step: inputs available, hidden assumptions, main obstacle, known counterexamples, verdict. Identify the earliest fatal step.

---

## Anti-Hallucination Protocols

1. **Citation requirement.** Every NixOS option needs its module path in nixpkgs at the pinned commit. Every kernel mechanism needs the kernel version and a source path or official documentation with its URL. Every attack needs its paper (authors, year, venue) or CVE identifier. If you cannot verify a citation, write "I was unable to verify this claim."
2. **Evidence labels.** Label each claim THEOREM, RESULT, CONJECTURE, HEURISTIC, NUMERICAL, FOLKLORE, or GENERATED (proposed without a source).
3. **Version specificity.** Never state Linux, systemd or NixOS behavior without the version. Landlock, cgroup and namespace behavior changed across kernel versions; say which version each statement holds for.
4. **NixOS versus generic Linux.** Distinguish what NixOS configures from what a Linux system could be made to do. An option that does not exist at the pin is not a NixOS binding.
5. **Documented versus implemented.** Distinguish what documentation promises from what the code at the pin does. Where they differ, report both.
6. **Exact identifiers.** Option paths, systemd directive names, system call names and LSM names must be exact.
7. **No motivational optimism.** Do not say enforcement "should be possible" without naming the mechanism, its option and its path.

## Verdict Categories

| Verdict | Meaning |
|---|---|
| CONFIRMED | Code at the pinned commit or a rigorous published result directly establishes the claim. |
| MARGINAL | Holds in a restricted configuration or version. |
| PLAUSIBLE | No direct evidence; consistent with what is known; no obstruction found. |
| NEEDS REFINEMENT | The claim has merit but is imprecise or has a gap. |
| DEAD | Code, a published attack, or a structural fact kills it. |
| UNVERIFIED | Insufficient sources to assess. |

## Output Format

1. **Executive Summary.** One paragraph: the verdict on desktop enforcement, and the answer to Q4 in one sentence.
2. **Q1 to Q7,** each with verdicts.
3. **The bindings** as one JSON array in the shape of Q1, in a separate file `bindings.json` if you can produce files.
4. **Source receipts** as one JSON array `[{ "repo", "commit", "path", "sha256" }]` for every file you read, in a separate file `receipts.json` if you can.
5. **The Q4 module sketch** as a Nix file.
6. **Enforcement map:** mechanism, what it checks, NixOS option, what it attributes, what it misses.
7. **Escape channels:** channel, versions, evidence, closable by configuration at the pin (yes or no).
8. **Part B entries** in the attached D9 entry shape, as JSON.
9. **Feasibility Table** for Q7.
10. **Bottom-Line Assessment:** one verdict, and the strongest defensible reformulation if desktop enforcement fails as claimed.
11. **Bibliography** with full identifiers.

Package the files as one zip if you can.

Do not try to be encouraging. Try to be correct. If an effect escapes every boundary, name the channel and say so plainly.

---

## Scaffold Update Notes

*(Strip before sending.)*

- The report is a lead. Every nixpkgs path is re-read at the pinned commit before a binding lands; hashes are reproduced here as they were for AOSP.
- Bindings land in `mapfill/nixos.js`, in the shape of `mapfill/android.js`, with the round recorded under `generation/`.
- Q4 is the measurement Research_OS `BLUEPRINT.md` section 12 build 1 asks for: how much the waist grows for the desktop. Its answer goes to that build, not only to the map.
- Part B entries land as generated D9 entries only after grading; new invariants go through `mapfill/invariants.js` with classes.
- Escape channels feed Research_OS (the desktop realization and the shared-machine rules of section 4a); propose there, the operator rules.
