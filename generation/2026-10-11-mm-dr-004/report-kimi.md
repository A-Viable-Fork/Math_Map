# MM-DR-004 desktop binding response

Executive summary. Desktop enforcement is real but narrower than the claimed input: NixOS 26.05 at nixpkgs 7c8764b7c7b09b34f632464276218ef9090eaa11 can enforce concrete mediation at DAC, namespaces, cgroups, nftables, systemd unit sandboxing, AppArmor, D-Bus/polkit/PipeWire/portal boundaries, and Nix lifecycle operations, but it does not supply complete provenance, per-process contamination labels, or atomic whole-contract transactions. Q4 answer in one sentence: “W never leaves” compiles only partly to NixOS options (nftables/systemd/network namespace plus storage separation), while “a W-reader emits as W until reset” requires a runtime information-flow/taint monitor and two new D9 vocabulary items (`e9-contam`, `e9-reset`), so claimed input 4 fails.

Evidence labels used below: RESULT for pinned nixpkgs files read at the commit; GENERATED for the attached Math_Map exports and my binding layer; CONJECTURE/HEURISTIC where mechanisms are known but exact option semantics at the pin were not all read.

## Platform pin facts

- RESULT: `lib/.version` at `7c8764b7c7b09b34f632464276218ef9090eaa11` reads `26.05` (sha256 of read content `28e90ecc678ac9cab16e6d036e029f7a38659b904123cbbcee5701ddb8e2b889`).
- RESULT: `pkgs/os-specific/linux/systemd/default.nix` at the pin sets `version = "260.5"`; NixOS uses this package for its systemd. Source file was read through the web fetch tool; sha256 not computed by this tool.
- RESULT/MARGINAL: `nixos/modules/system/boot/kernel.nix` sets `boot.kernelPackages = pkgs.linuxPackages`; release coverage reports NixOS 26.05 moved the default kernel from 6.12 to 6.18, but I did not read the exact `linuxPackages` definition at the pin, so treat the exact 6.18 patch level as UNVERIFIED. Landlock documentation read from kernel.org: filesystem ABI 1 since 5.13; TCP network rights ABI 4 (orientation Linux 6.7+); abstract Unix/signal scope ABI 6 (orientation Linux 6.12+); UDP rights ABI 10 in newer kernels.

## Q1 — bindings

The machine-readable layer is `bindings.json` (27 entries). Pattern: platform assurance is usually `enforced` for a correctly configured service boundary and `monitored` for audit/observation; contract assurance remains `unknown`/`not observable` wherever byte provenance or contamination is required. `mechanism: null` is used for D9-X10 because no NixOS option realizes label declassification.

## Q2 — where each effect is enforced

| mechanism | checks | NixOS option | attributes | misses | bypass by agent account? |
|---|---|---|---|---|---|
| DAC/ACL | open/create/exec by uid/gid/mode | `users.users.*`, file modes, `systemd.services.*.serviceConfig.ProtectHome/ReadOnlyPaths` | UID/GID/path | datum origin; copied bytes | world-readable paths, Nix store, shared groups |
| namespaces | mount/PID/net/IPC/user boundaries | `systemd.services.*.serviceConfig.Private*`, `containers.*.enable` | ns identity, mapped uid | established IPC/display channels | unprivileged userns if allowed; shared session bus |
| nftables | output/input packet by skuid/cgroupv2/addr | `networking.nftables.ruleset` | UID/cgroup/socket | payload provenance; loopback/session IPC | local sockets, D-Bus/PipeWire, pre-opened sockets |
| systemd sandbox | per-unit fs/net/seccomp/caps | `systemd.services.*.serviceConfig` directives such as IPAddressDeny, RestrictAddressFamilies, SystemCallFilter, CapabilityBoundingSet, ProtectSystem | unit/cgroup/UID | process-internal data flow | only if service runs outside unit policy |
| AppArmor | path/profile mediation | `security.apparmor.policies.*` | profile label | semantics of data | unconfined binaries; newly running unconfined processes need kill/refinement |
| D-Bus/polkit/PAM | bus name/action/session auth | `services.dbus.packages`, `security.polkit.extraRules`, `security.pam.services.*` | bus name/UID/action | payload labels | session bus shared with person; policy gaps |
| PipeWire/portal | media node and consent | `services.pipewire.enable`, `xdg.portal.enable` | session/UID/node | non-media sensors; raw device nodes | person session reuse, raw sysfs/iio |
| journal/audit | syscall/service events | `services.journald.extraConfig`, `services.auditd.enable` | UID/PID/unit/syscall | in-process transformation | local root tamper; disabled audit |

## Q3 — escape channels

| channel | versions/evidence | closable at pin? |
|---|---|---|
| X11 protocol | any X server: clients can inspect/inject input and windows; classic X security model. | yes: prefer Wayland; NixOS X11 remains an escape if enabled. |
| Wayland compositor | compositor isolates clients but clipboard/drag and global shortcuts are explicit protocols; packaged compositors differ (CONJECTURE at pin). | mostly, but clipboard/drag must be configured/accepted per compositor. |
| clipboard/drag across sessions | X11 automatic; Wayland usually compositor-mediated but copy can move data person-to-agent if same session. | partially; do not run agents in person session. |
| `/tmp`, `/dev/shm`, abstract sockets | sticky `/tmp` limits deletion but not world-readable files; abstract sockets have no filesystem DAC. | partially: `PrivateTmp`, separate sessions, Landlock scope ABI 6 for service sandboxes. |
| session D-Bus | per-user bus: same account shares authority; separate agent accounts need separate sessions. | yes by architecture; no if agent shares person session. |
| GPU/render nodes | `/dev/dri/renderD*` group `render` can share GPU memory across same-group users; driver-specific. | partially via udev groups, but not a general information-flow boundary. |
| timing/cache side channels | Spectre/Meltdown class and cache contention; excluded per instructions. | excluded, never preserved. |
| Nix store | world-readable by design; closure can leak sources/config. | no: keep secrets out; use sops/age, LUKS, separate roots. |
| dual-boot other OS | can read unencrypted NixOS partitions and bootloader entries; reverse also true. | only with full-disk encryption and careful key custody. |

## Q4 — vocabulary measurement

1. Compiles to NixOS options alone: static account/service separation, W root DAC group, `PrivateTmp`, `ProtectHome`, `ProtectSystem`, read-only paths, nftables `meta skuid` egress deny, per-service `IPAddressDeny`, network namespace containers, journald retention, LUKS/dm-crypt for at-rest W. Needs runtime: per-process contamination tracking, reset authorization, W-output mediation before every egress/IPC/display write, and an anti-replay/reset event log. See `q4-policy-module.nix`; it intentionally asserts when the runtime component is absent.
2. Additions: `e9-contam` (state invariant over `process-state`) and `e9-reset` (trace invariant over reset authority). Why the phone did not need them: Android’s binding compartmentalized by app UID and mediated shared resources through system services; the desktop Q4 explicitly tracks contamination across separate accounts and shared desktop services after a read, a dynamic per-process label with a reset event rather than a static app compartment.
3. Phone has, desktop cannot realize directly: a single platform-enforced app identity/permission broker that all relevant sensors and shared services consult, plus an always-on mediator for many sensors. The desktop has more configurable boundaries but fewer uniform brokers; equivalent assurance requires composing several brokers and still misses non-brokered channels.

## Part B — Nix operations

See `part-b-nix-entries.json`. New invariant definitions are included there (`e9-nix-*`) plus Q4 additions. Nix enforces sandboxing (`nix.settings.sandbox`), fixed-output hash registration, content-addressed store validity, pure evaluation when `pure-eval` is used, generation retention/rollback; reproducibility remains partially convention/measurement, and `--impure`, `sandbox = false`, trusted daemon users, unhashed `builtins.fetchurl`, nondeterministic builds, overlays, and local root can break guarantees. I was unable to verify a fresh nixpkgs reproducibility measurement at the pin from the available tool reads; treat reproducibility citations as not established here.

## Q7 feasibility

| step | inputs | hidden assumption | obstacle | counterexample | verdict |
|---|---|---|---|---|---|
| 1 all effects cross a controlled point | mechanism list | agents confined to configured services | raw user actions, session bus, display, pre-opened sockets, userns | agent writes to world-readable `/tmp` then person sends it | NEEDS REFINEMENT |
| 2 points attribute to account/service/cgroup | audit/journal/cgroup | writers are inside attributed boundary | same session/shared group/abstract socket; kernel sees only local IDs | X11 client input injection | NEEDS REFINEMENT |
| 3 policy compiles to NixOS alone | Q4 module | no contamination clause | W-readers emit as W until reset | process copies W to clipboard | DEAD as stated |
| 4 escapes closed/configured | Q3 list | compositor/session per agent | GPU, dual boot, Nix store, side channels excluded | unencrypted dual-boot read | MARGINAL |
| 5 phone vocabulary suffices | attached invariants | labels static per app | dynamic contamination/reset, desktop shared brokers | Q4 second clause | DEAD |

Earliest fatal step: step 3, because Q4’s second clause has no NixOS option.

## Bottom line

Verdict: NEEDS REFINEMENT for “desktop enforces the same operations with phone vocabulary”; DEAD for “a policy stated once over D9 invariants compiles to NixOS options alone.” Strongest defensible reformulation: NixOS can enforce a *parameterized boundary set* (account, unit, cgroup, namespace, bus, display, store lifecycle) for named effect classes, and can log many violations, but any policy requiring provenance, contamination-until-reset, declassification, or whole-contract atomicity needs an explicit runtime monitor and additional D9 invariants.

## Bibliography

- NixOS/nixpkgs `7c8764b7c7b09b34f632464276218ef9090eaa11`, `lib/.version` (read; sha256 above), `nixos/modules/system/boot/kernel.nix` (read), `pkgs/os-specific/linux/systemd/default.nix` (read), `nixos/modules/services/networking/nftables.nix` (read), `nixos/modules/security/apparmor.nix` (read).
- Linux kernel documentation, “Landlock: unprivileged access control”, docs.kernel.org/userspace-api/landlock.html (read).
- NixOS 26.05 release announcement, 2026-05-30, and release coverage reporting default kernel 6.18 and systemd stage 1 (read/search snippets; exact kernel patch level not verified).
- Attached Math_Map exports `d9-entries.json`, `effect-invariants.json`, `invariant-relations.json`, and MM-DR-002 `android-bindings.json` (read; sha256 in `receipts.json`).
