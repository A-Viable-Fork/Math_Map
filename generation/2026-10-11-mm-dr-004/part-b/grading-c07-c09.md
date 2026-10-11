# Grading of D9-NIX-C07, C08, C09 (MM-DR-004 Part B)

Pins: nixpkgs `7c8764b7c7b09b34f632464276218ef9090eaa11` (paths below prefixed `np:`), Nix `f3f1c3c5b8ad91850e0f7c590cf177f7ab022024` (prefixed `nix:`). Local experiments ran with Nix 2.34.6 on a throwaway profile under `grade-c/exp/prof` (print-only GC queries; the scratch profile and its `gcroots/auto` links were removed afterwards).

## Facts read (cited below by letter)

- **A.** `switch-to-configuration-ng` is the only switcher: `np:nixos/modules/system/activation/switchable-system.nix:10-16` (removed `enableNg` option says ng "is now the only switch-to-configuration implementation"), `:54` links `lib.getExe pkgs.switch-to-configuration-ng` as `$out/bin/switch-to-configuration`.
- **B.** The switcher takes `/run/nixos/switch-to-configuration.lock` with a nonblocking exclusive flock and dies if held: `np:pkgs/by-name/sw/switch-to-configuration-ng/src/main.rs:1813-1827`. It is not the Nix profile lock.
- **C.** Order inside the switcher: pre-switch checks (`main.rs:1833-1840`), bootloader install for `switch` and `boot` only (`:1847-1849`), syncfs of /nix/store (`:1853-1861`), `boot` exits here (`:1863-1865`), unit stop jobs, then `activate` (`:2235-2247`, failure sets exit code 2 and continues), then start/restart/reload jobs with failures setting exit code 4 (`:2389`, `:2673`), final `exit(exit_code)` (`:2689`). No undo or rollback path exists in `main.rs` (grep for "rollback": none).
- **D.** The `activate` script sets `/run/current-system`: `np:nixos/modules/system/activation/activation-script.nix:79`; `/nix/var/nix/gcroots/current-system` points at it: `:284`.
- **E.** nixos-rebuild-ng sets the profile before activation: `services.py:229-243` calls `nix.set_profile` then `nix.switch_to_configuration` for `switch|boot`; `set_profile` runs `nix-env -p <profile> --set <toplevel>` (`np:pkgs/by-name/ni/nixos-rebuild-ng/src/nixos_rebuild/nix.py:669`). Root or `--sudo` is required (`nix.py:739-742`).
- **F.** Rollback in nixos-rebuild-ng: `switch|boot --rollback` runs `nix-env --rollback -p <profile>` (`nix.py:603-611`, `services.py:133-135`); `test|build --rollback` picks a non-current generation link and activates it without moving the profile (`nix.py:614-631`, `services.py:136-143`).
- **G.** `nix-env --set` (`nix:src/nix/nix-env/nix-env.cc:758-801`) calls `createGeneration` and `switchLink` with no `lockProfile`; `createGeneration` adds link `N+1` via `addPermRoot` and never removes older links (`nix:src/libstore/profiles.cc:64-98`, root at `:95-96`).
- **H.** `switchGeneration` (used by `--rollback` and `--switch-generation`) takes the profile lock and, with no explicit target, selects the highest-numbered generation below current (`profiles.cc:256-281`, rule at `:264-266`; error "no profile version older than the current" at `:270-271`). `lockProfile` at `:283-287`.
- **I.** Experiment: generations 1,2,3; `--switch-generation 1`; `--set` new path created generation 4; `--rollback` went to 3, not 1. So `--rollback` after a switch returns to the pre-switch target only when that target was the highest-numbered generation below the new one.
- **J.** GC roots: `findRootsNoTemp` scans `<stateDir>/gcroots` and `<stateDir>/profiles` plus runtime roots (`nix:src/libstore/gc.cc:289-298`); indirect roots resolved, unreadable roots skipped with "cannot read potential root" (`gc.cc:239-255`, `:265-282`); big GC lock (`:516-517`); roots marked alive (`:630-634`); `--ignore-liveness` skips root discovery (`:520-521`) and is refused through the daemon (`nix:src/libstore/daemon.cc:748-749`); `gcDeleteSpecific` refuses live paths (`gc.cc:698-705`).
- **K.** Experiment: every generation link of the scratch profile appeared in `--print-roots` (via `gcroots/auto` indirect roots) and none of their paths was in `--print-dead`; after `--delete-generations old`, the three deleted generations' paths appeared in `--print-dead`.
- **L.** Generation deletion: `deleteOldGenerations` deletes every non-current generation, including ones newer than current (`profiles.cc:187-197`; experiment K deleted generation 4 while 3 was current); `deleteGenerationsOlderThan` keeps the generation that was current at time t (`:199-230`); `deleteGenerations` refuses the current one (`:141-142`); all take the profile lock. Callers: `nix-env --delete-generations` (`nix-env.cc:1364-1373`), `nix profile wipe-history` (`nix:src/nix/profile.cc:965-972`), `nix-collect-garbage -d|--delete-older-than`, which deletes generations in the profile directories and then runs GC (`nix:src/nix/nix-collect-garbage/nix-collect-garbage.cc:73-99`).
- **M.** NixOS `nix.gc`: `options` defaults to "" (`np:nixos/modules/services/misc/nix-gc.nix:63-70`); the service runs `nix-collect-garbage ${cfg.options}` (`:88`). Default automatic GC deletes no generations.
- **N.** Files in `environment.etc` with a mode are copied out of the store into /etc at activation (`np:nixos/modules/system/etc/setup-etc.pl:113-124`); sshd authorized keys are such a file built from configuration (`np:nixos/modules/services/networking/ssh/sshd.nix:146-153`).
- **O.** Bootloader menus are built from the system profile's generations (`np:nixos/modules/system/boot/loader/grub/install-grub.pl:606`; systemd-boot `systemd-boot-builder.py:76-78,234-235`); the default entry is the toplevel passed to the installer (`systemd-boot-builder.py:388`). NixOS manual: GRUB boots "any previous configuration that hasn't been garbage-collected" (`np:nixos/doc/manual/administration/rollback.section.md:7-9`).

## D9-NIX-C07 Switch system generation

| # | Claim | Mark | Verdict | Reason |
|---|---|---|---|---|
| 1 | Pinned switcher is switch-to-configuration-ng | read A | confirmed | Only implementation at the pin |
| 2 | The operation selects a built system profile and activates it using the switcher | read E, C | needs refinement | The switcher never touches the profile; nixos-rebuild-ng moves it with `nix-env --set` before calling the switcher, and only for switch/boot |
| 3 | Input: privileged owner/admin authorization | read E | confirmed | nixos-rebuild-ng requires root or `--sudo` |
| 4 | Input: old and new closures | read main.rs:1772-1775, D | confirmed | Old toplevel read from /run/current-system |
| 5 | Input: profile lock | read B, G, H | needs refinement | `nix-env --set` takes no profile lock; the switcher takes its own run lock in /run/nixos |
| 6 | Input: activation scripts | read C | confirmed | `activate` is run |
| 7 | Input: bootloader action | read C | confirmed | Only for switch and boot |
| 8 | Input: mutable service state | read C | confirmed | Units are stopped, started, restarted, reloaded |
| 9 | Reversibility only for the retained profile reference | inferred C | confirmed | No snapshot or undo in the switcher |
| 10 | Scripts, restarts and bootloader update are not one reversible transaction | read C, E | confirmed | Profile set, then bootloader, then activation; errors set exit codes and continue |
| 11 | A policy change can broaden authority | inferred | confirmed | New config can grant more |
| 12 | A closure signature does not implement D9-X25 | inferred | marginal | True, but off-topic; the switcher checks no signatures at all |
| 13 | Output: selected profile/current-system and requested changes, or partial failure | read C, D, E | needs refinement | Name the failure state: profile and bootloader already at g2 while running state is mixed; exit codes 1, 2, 4 |
| 14 | Preserved (conditional): e9-nix-reversible | read G, H, I | needs refinement | The switch keeps g1's link (precondition preserved), but `--rollback` reaches g1 only if g1 is the highest-numbered generation below g2; `test` moves no profile |
| 15 | No timing/physical preservation | expression | marginal | Boilerplate scope note |
| 16 | No provenance inferred from store dependency metadata | expression | marginal | Boilerplate, unrelated to switching |
| 17 | Broken: e9-local | inferred C | confirmed | Activation runs configured root code and starts units that can place W payload outside B |
| 18 | Broken: e9-noegress | inferred C | confirmed | Same mechanism; started units can send |
| 19 | Broken: e9-erase | read N | confirmed | Activation copies store files into /etc (and arbitrary activation snippets can write anywhere), creating new recoverable copies |
| 20 | Broken: e9-auth | inferred | needs refinement | e9-auth is checked against policy at commit; broadening policy is not a violation, and the root switch is itself allowed. Breakable only if the model treats activation effects as unmediated; drop or state that model |
| 21 | Broken: e9-revoke | read N | plausible | A new config that lists a previously revoked key regenerates authorized_keys.d and sshd accepts it; whether this is "same generation" depends on modeling the key as the capability |
| 22 | Broken: e9-nix-hermetic | read C, E | dead | The switch performs no build; hermeticity is a build-trace predicate. The build precedes this operation |
| 23 | Possibility depends on parameters, not operation name | inferred | confirmed | Depends on the configuration activated |

Overall: **needs refinement**. 23 claims: confirmed 13, needs refinement 5, plausible 1, marginal 3, dead 1.

## D9-NIX-C08 Roll back selected generation

| # | Claim | Mark | Verdict | Reason |
|---|---|---|---|---|
| 1 | Selects a retained previous system profile target and performs the requested activation/boot action | read F, H | needs refinement | `--rollback` selects the highest generation below current, not a requested one; `test --rollback` activates without moving the profile |
| 2 | Input: current profile | read H | confirmed | |
| 3 | Input: requested previous generation | read F, H, I, O | needs refinement | A specific N is reached only by `nix-env --switch-generation N`, `system-N-link/bin/switch-to-configuration`, or the boot menu |
| 4 | Input: intact rooted closure | read J, K | confirmed | Generation links are GC roots; an invalid target is skipped as a root |
| 5 | Input: privilege | read E | confirmed | |
| 6 | Input: activation mode | read F | confirmed | switch, boot, test |
| 7 | Input: current mutable state | inferred C | confirmed | Activation acts on it |
| 8 | Requires a valid retained target and a successful reference switch | read H | confirmed | Error when no older generation exists |
| 9 | No return of /var or databases | inferred C, H | confirmed | Rollback is a symlink replacement plus reactivation; no snapshot exists in either path |
| 10 | No return of W memory, nonce or approval histories | inferred C, H | confirmed | Same |
| 11 | No undo of past egress | inferred | confirmed | Trace events are past |
| 12 | Old packages or policy can reintroduce flaws | inferred N | confirmed | The old closure is activated as is |
| 13 | Output: previous target selected and activation effects, or missing-generation/activation failure | read C, F, H | needs refinement | Add partial failure after the profile and bootloader moved; `test` leaves the profile unchanged |
| 14 | Preserved (conditional): e9-nix-reversible | read H, I | needs refinement | Holds when the selection is g1; the stock `--rollback` rule can select a different generation |
| 15 | No timing/physical preservation | expression | marginal | Boilerplate |
| 16 | No provenance inferred from store metadata | expression | marginal | Boilerplate |
| 17 | Broken: e9-local | inferred C | plausible | Reactivated g1 services can place W payload outside B |
| 18 | Broken: e9-noegress | inferred C | plausible | Reactivated services can send |
| 19 | Broken: e9-auth | inferred | needs refinement | As C07 #20 |
| 20 | Broken: e9-revoke | read N | confirmed | Rolling back past the revocation restores the key file from g1's closure and sshd accepts the key again |
| 21 | Possibility depends on parameters | inferred | confirmed | |

Not listed and correctly absent: e9-erase. A secret in g1's closure is already a recoverable store copy while g1 is retained, so rollback adds no new breakage (inferred).

Overall: **needs refinement**. 21 claims: confirmed 12, needs refinement 5, plausible 2, marginal 2, dead 0.

## D9-NIX-C09 Garbage-collect the store

| # | Claim | Mark | Verdict | Reason |
|---|---|---|---|---|
| 1 | Computes root reachability and removes unreachable objects | read J | confirmed | |
| 2 | Inputs: store graph, permanent and temporary roots | read J | confirmed | Runtime roots (running processes) are a third class and are missing |
| 3 | Inputs: generation roots | read J, K | confirmed | `<stateDir>/profiles` scanned; other profiles rooted via `gcroots/auto` |
| 4 | Input: GC lock | read J | confirmed | |
| 5 | Input: flags | read J, L | confirmed | max-freed, keep-outputs, keep-derivations |
| 6 | Deleting old generations is an additional root-removal operation | read L | confirmed | `nix-collect-garbage -d` bundles it with GC |
| 7 | Reversibility preserved for generations that stay rooted under ordinary GC | read J, K | confirmed | Caveats: root-run local `nix-store --delete --ignore-liveness` (refused via daemon), and roots in unreadable directories are skipped |
| 8 | May be broken after deleting their roots/generations | read K, L | confirmed | But the breaking act is generation deletion, a separate operation |
| 9 | Distinct scopes, not contradictory assertions | read invariants lists | needs refinement | The lists still name e9-nix-reversible as both preserved and broken; split the entry |
| 10 | GC does not establish e9-erase | inferred J | confirmed | Unlinks rooted-free paths only; copies outside the store, caches and backups are untouched |
| 11 | GC does not reverse historical exports | inferred | confirmed | |
| 12 | Output: remaining rooted closure and reclaimed objects/bytes, or errors | read daemon.cc:754 | confirmed | Paths and bytes freed returned |
| 13 | Output: no complete erasure witness | inferred | confirmed | |
| 14 | No timing/physical preservation; no provenance inference | expression | marginal | Boilerplate |
| 15 | Broken: e9-nix-reversible | read J, K | dead | Ordinary GC cannot remove a rooted generation; belongs to the deletion entry |
| 16 | Preserved: e9-nix-reversible | read J, K | confirmed | For every generation whose link remains |
| 17 | Possibility depends on parameters, not operation name | read L, M | needs refinement | Depends on which operation runs: `nix-collect-garbage -d` is two operations; NixOS `nix.gc.options` defaults to "" and deletes no generations |

Overall: **needs refinement** (split required). 17 claims: confirmed 13, needs refinement 2, marginal 1, dead 1, plausible 0. One further claim (#2 runtime roots) is an omission noted inside a confirmed row.

## Corrected entries

```json
[
  {
    "id": "D9-NIX-C07",
    "name": "Switch system configuration",
    "kind": "Transformer",
    "tags": ["nix", "activation"],
    "description": "nixos-rebuild-ng switch or boot: set the system profile to a built toplevel with nix-env --set, then run its switch-to-configuration (switch-to-configuration-ng at the pin), which takes /run/nixos/switch-to-configuration.lock, runs pre-switch checks, installs the bootloader (switch, boot), syncs, and for switch stops units, runs activate and starts, restarts or reloads units.",
    "input": "Root authorization, built new toplevel, current toplevel (/run/current-system), system profile, action (switch, boot, test, dry-activate), activation scripts, bootloader installer, running units and mutable state. test and dry-activate leave the profile and bootloader unchanged. The steps are sequential with no undo.",
    "output": "Profile at a new generation N+1 with older links kept, bootloader default and /run/current-system at the new toplevel, unit changes; or a failure exit (1 pre-switch or bootloader, 2 activate, 4 units) after the profile and bootloader may already have moved, leaving running state mixed.",
    "preserved": "Retention of the previous generation link and its rooted closure, the precondition of e9-nix-reversible.",
    "broken": "May break e9-local, e9-noegress, e9-erase and e9-revoke: activation runs configured root code, starts units, copies store files into /etc, and can reinstate a removed key.",
    "invariants": {"preserved": ["e9-nix-reversible"], "broken": ["e9-local", "e9-noegress", "e9-erase", "e9-revoke"], "output": []}
  },
  {
    "id": "D9-NIX-C08",
    "name": "Roll back system generation",
    "kind": "Transformer",
    "tags": ["nix", "rollback"],
    "description": "Return the system to a retained earlier generation: nixos-rebuild switch|boot --rollback runs nix-env --rollback, which selects the highest-numbered generation below current, then that generation's switch-to-configuration; nix-env --switch-generation N, system-N-link/bin/switch-to-configuration or the boot menu select a specific N; test --rollback activates an earlier link without moving the profile.",
    "input": "System profile with a retained earlier generation link, root authorization, action, current running units and mutable state.",
    "output": "Profile (switch, boot) and running system at the selected generation, or an error when no earlier generation exists, or a partial activation failure as in C07. /var, databases, other mutable state, nonce and approval histories and past egress are not restored.",
    "preserved": "e9-nix-reversible for the selected generation: the profile target equals g1 when the selection is g1, which --rollback guarantees only when g1 is the highest-numbered generation below the current one.",
    "broken": "May break e9-local and e9-noegress by reactivating old services, and e9-revoke by restoring credentials removed after g1, such as authorized keys built into /etc.",
    "invariants": {"preserved": ["e9-nix-reversible"], "broken": ["e9-local", "e9-noegress", "e9-revoke"], "output": []}
  },
  {
    "id": "D9-NIX-C09",
    "name": "Garbage-collect the store",
    "kind": "Transformer",
    "tags": ["nix", "gc"],
    "description": "nix-store --gc or nix-collect-garbage without -d: under the global GC lock, find permanent roots (gcroots, profiles), runtime roots and temporary roots, and delete store paths unreachable from them, up to max-freed.",
    "input": "Store graph, roots, GC lock, max-freed, keep-outputs and keep-derivations settings.",
    "output": "Deleted path list and bytes freed, or errors. Every rooted path remains.",
    "preserved": "e9-nix-reversible for every generation whose link remains, since generation links are roots. Not under root-run local nix-store --delete --ignore-liveness, a different operation.",
    "broken": "None of the listed invariants. GC does not establish e9-erase: copies outside the store, caches and backups remain.",
    "invariants": {"preserved": ["e9-nix-reversible"], "broken": [], "output": []}
  },
  {
    "id": "D9-NIX-C10",
    "name": "Delete old profile generations",
    "kind": "Transformer",
    "tags": ["nix", "gc", "rollback"],
    "description": "Remove generation links of a profile under the profile lock: nix-env --delete-generations, nix profile wipe-history, or the first phase of nix-collect-garbage -d or --delete-older-than (also via NixOS nix.gc.options, empty by default). The current generation is never deleted; old deletes every other generation, including newer ones after a rollback; --delete-older-than keeps the generation current at the cutoff.",
    "input": "Profile, selector (old, list, +N, age), dry-run flag, write access to the profile directory.",
    "output": "Fewer generation links; the closures they alone rooted become unreachable and are reclaimed by a following GC. Boot menu entries for deleted generations remain until the next bootloader install.",
    "preserved": "e9-nix-reversible for the current generation and those kept.",
    "broken": "Breaks e9-nix-reversible for every deleted generation, including a newer generation left after a rollback.",
    "invariants": {"preserved": [], "broken": ["e9-nix-reversible"], "output": []}
  }
]
```

The boot menu sentence in C10 is inferred from O and was not tested.
