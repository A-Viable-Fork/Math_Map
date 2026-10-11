# Grading: MM-DR-004, D9 bound to NixOS

Date 2026-10-11. Evidence marks: **read**, **secondary**, **inferred**, **recalled**, **unknown**.

## 1. Receipts

ChatGPT's receipts were compared with files fetched here at the pinned commits. Nine of nine reproduce (first 64 bits; **read**): nixpkgs `lib/.version` f305a6ac94bdd8a2, `nixos/modules/config/nix.nix` 387e3bea94e883c1, `nixos/modules/security/default.nix` 2baac2d45c08ce37, `nixos/modules/services/desktops/pipewire/pipewire.nix` bc748cf8583bf5b2, `nixos/modules/services/system/nix-daemon-firewall.nix` e441bb8ec99363fa, `pkgs/os-specific/linux/kernel/kernels-org.json` 678066ea38c422cd, `pkgs/os-specific/linux/systemd/default.nix` fbc3938beb410641, `pkgs/top-level/linux-kernels.nix` 3ca231f466cba900; sway `sway/server.c` at `8886939` 3b7d2c5a6c85a000.

Kimi gives one pinned hash, for `lib/.version`: `28e90ecc…`, which is the hash of `26.05` with a trailing newline; the file has none (its hash is `f305a6ac…`). The content is right, the receipt is not of the file's bytes. Its other source rows are the attached inputs, whose hashes match the package sent; its nixpkgs reads carry no hashes, as it says.

## 2. Claims checked at the pin

All **read** at nixpkgs `7c8764b` unless marked.

| Claim | Who | Result |
|---|---|---|
| Default kernel 6.18.55 (`linuxPackages` = `linux_default` = `linux_6_18`; `kernels-org.json` 6.18.55) | ChatGPT; Kimi leaves the patch level unverified | Confirmed: `all-packages.nix` line 8222, `linux-kernels.nix` line 740, `kernels-org.json` line 33 |
| systemd 260.5 | both | Confirmed: `systemd/default.nix` line 204 |
| `pkgs.nix = nixVersions.stable` | ChatGPT | Confirmed: `all-packages.nix` line 11282; the 2.34.8 patch level is not checked here |
| NixOS sets `sandbox-fallback = false` | ChatGPT | Confirmed: `nix-daemon.nix` line 397 |
| PipeWire is per-user by default (`systemWide` false) | ChatGPT | Confirmed: `pipewire.nix` lines 152 to 155, 395 to 397 |
| `nix.firewall` with empty port lists allows all ports | ChatGPT | Confirmed: the option descriptions ("Specifying no ports will allow all TCP traffic") and the rules generated only for non-empty lists, `nix-daemon-firewall.nix` lines 30 to 31, 119 to 127 |
| Sway exposes privileged globals (data control, capture, virtual input) to every client with no security context | ChatGPT | Confirmed: `filter_global` returns `security_context == NULL` for privileged globals, sway `server.c` lines 142 to 149; a separate Unix account is not a security context |
| Landlock enabled in the default LSM list | ChatGPT | Confirmed: `security/default.nix` line 25 |
| Landlock ABI history (4: TCP ports, 6: scoping, 7 in 6.15) | both | **Recalled** consistent; not re-read here. Kimi's "UDP rights ABI 10" is **unknown** |

## 3. The measurement (Q4)

The two reports agree on the substance and differ in the count.

- **Agreed:** the static half of "W never leaves" compiles to NixOS options (accounts, private network and IPC, restricted root, no host display, bus, PipeWire or Nix daemon socket). The dynamic half ("a process that read W emits as W until reset") needs a runtime monitor, and the existing context label does not define it: it has no notion of which process carries the label, how children and delegated work inherit it, or what a reset is.
- **ChatGPT** counts this as zero new invariants and one refinement of the existing label, plus parameters (process incarnation, reset predicate, boundary and boot lifetime). **Kimi** counts two new invariants, `e9-contam` and `e9-reset`. **DeepSeek** counts two invariants (E9-PROC-ORIG, process-origin contamination; E9-EPOCH, policy-epoch freshness), a carrier (`runtime-policy`), two labels (`display-server`, `nix-store`) and two parameters (`session-bus`, `gpu-ipc`).
- **Graded:** ChatGPT's count is the better one. The contamination rule is already the `compartment-context` label in `mapfill/invariants.js`; what is missing is its semantics, not a new property to preserve. Kimi's two invariants restate the same semantics as predicates, and so does DeepSeek's E9-PROC-ORIG. DeepSeek's E9-EPOCH is already inside e9-mediated ("the same bound arguments and current policy epoch checked there") and e9-revoke; its labels and parameters are binding parameters (which display server, whether the store is reachable), the kind ChatGPT lists as parameters rather than vocabulary. ChatGPT also notes the same gap exists in the Android export, which the phone rounds did not catch.
- **A third, independent agreement:** ChatGPT finds that the blanket forbids on send, store, spawn and dispatch need parameter-sensitive guards, since a W-context write inside the boundary is allowed and one outside is not. Research_OS's blueprint of the record and link found the same thing from the other side (docking is a send inside B; `blueprints/record-and-link.md`, finding 3).

**Verdict on the waist:** plausible, needs refinement. The desktop needs no new invariant, carrier or label beyond the phone's. It needs the context label's semantics stated, and the forbids made sensitive to the boundary, on both platforms.

## 4. Per candidate

- **ChatGPT:** confirmed on every claim checked; the strongest report of the D9 rounds. Its Q4 module (`q4-w-policy.nix`) was syntax-checked only, as it says. Its findings that bear on the research OS directly: never give an agent account the host Wayland socket (Sway hands capture and clipboard control to any client without a security context); never give it the Nix daemon socket (fixed-output builds have network, and the daemon firewall's empty port lists mean all ports); on a dual-boot machine the other system is outside every NixOS control, so the NixOS side must be encrypted and the guarantee is scoped to a boot.
- **Kimi:** plausible, shallower. Its contract assurances include eight "monitored" grades (D9-X05, X12, X14, X19, X20, X24, X26, X27) whose own notes say the platform does not establish the contract; under the lessons carried into the prompt these are "unknown". Its pinned evidence is one hash, and that one is not of the file's bytes. Its Q3 adds the GPU render-group sharing and the person-session clipboard route, both consistent with ChatGPT's.

- **DeepSeek:** plausible on the main lines, the weakest on evidence. No source carries a hash; 3 of the 14 nixpkgs paths it cites return 404 at the pin (**read**): `services/desktops/pipewire.nix` (the module is `services/desktops/pipewire/pipewire.nix`), `security/unprivileged-userns.nix` (the option `security.unprivilegedUsernsClone` exists, in `security/misc.nix` line 34) and `system/tmpfiles.nix` (it is `system/boot/systemd/tmpfiles.nix`). Errors of substance: it rates step 1 DEAD because "X11 is a universal bypass", but denying an agent the X socket is configuration, as ChatGPT shows and DeepSeek's own reformulation assumes; it says user namespaces let an agent "bypass DAC", which overstates them (namespace root has no host DAC authority, and installed seccomp, Landlock or AppArmor restrictions are inherited); it says GPU sharing has no configuration gate while its own module sets `PrivateDevices`, which removes the device path. Its module is inconsistent (`DynamicUser` alongside a static `agent-w` account in a group whose gid it reads without setting) and names a package that does not exist. Its reproducibility figure, "85 to 90 percent as of 2026-10" from reproducible.nixos.org, is **unknown**: no snapshot is given, and the date is today. It reuses the ids D9-X28 and D9-X29 for "run eBPF program" and "create user namespace"; if either is taken up it gets a new id.

## 5. What carries forward

- **Bindings:** ChatGPT's `bindings.json` as conjecture with receipted paths, for a `mapfill/nixos.js` in the shape of `android.js`. Proposal; the operator rules.
- **The context-label refinement** (proposal for `compose.mjs` and `mapfill/invariants.js`): a label is carried by a process incarnation; children and delegated work inherit it; a reset is a named operation with a clean-state condition (destroy the contaminated domain, start fresh from clean inputs); and a forbid can name the boundary it guards, so a send inside B passes. The same refinement applies to the Android export.
- **For Research_OS** (proposals; the operator rules): the agent-account rules above become the desktop's enforcement baseline; the forge's encryption becomes a requirement, with guarantees scoped to the NixOS boot.
- **Part B:** both rounds propose Nix operations and four invariants (reproducibility, hermeticity, content binding, reversibility); not landed yet. ChatGPT cites the MSR 2025 reproducibility study (69 to 91 percent bitwise over 2017 to 2023, **secondary**).
- **Pending:** line-level checks beyond the table above.
