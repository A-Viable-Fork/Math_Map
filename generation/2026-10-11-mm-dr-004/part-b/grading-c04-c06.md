# Grading of MM-DR-004 Part B entries D9-NIX-C04, C05, C06

Pins: Nix source `f3f1c3c5b8ad91850e0f7c590cf177f7ab022024` (paths below are relative to `scratchpad/nix`), nixpkgs `7c8764b7c7b09b34f632464276218ef9090eaa11` (relative to `scratchpad/nixpkgs`). Experiments ran with the installed `nix` 2.34.6 (a patch release away from the source pin; behaviour marked "exp" was observed with the binary, not the source), against `--store dummy://` or a throwaway local store under `grade-b/st*`. No builds ran. Invariant definitions read from `cg/MM-DR-004/candidate-invariants.json` (e9-nix-*) and `/home/user/Math_Map/mapfill/invariants.js:111-121` (e9-gfree, e9-local, e9-noegress, e9-erase).

Verdict scale: confirmed, marginal, plausible, needs refinement, dead.

## Facts established for this grading

| # | Fact | Mark | Where |
|---|---|---|---|
| F1 | `pure-eval` defaults to false in the setting itself | read | src/libexpr/include/nix/expr/eval-settings.hh:181-184 |
| F2 | The new CLI (`nix ...`) sets pure-eval true; legacy commands (`nix-instantiate`, `nix-build`, `nix-env`) return before that line, so they evaluate impure by default | read, exp | src/nix/main.cc:420-428; exp: `nix-instantiate --eval -E builtins.currentTime` returns an integer with no flag |
| F3 | `--impure` sets pure-eval false and nothing else | read | src/libcmd/common-eval-args.cc:118-122 |
| F4 | `--file` forces impure; `nix repl` is impure by default; `--expr` is not forced | read, exp | src/libcmd/installables.cc:459-463; src/nix/repl.cc:55-58; src/nix/main.cc:580-582 |
| F5 | Pure mode: `currentTime`, `currentSystem` are not defined (error `attribute 'currentTime' missing`) | read, exp | src/libexpr/primops.cc:5232-5262 (`impureOnly = true`), src/libexpr/eval.cc:471 |
| F6 | Pure mode: `getEnv` returns `""` silently, it does not fail; restrict-eval does the same | read, exp | src/libexpr/primops.cc:1218 |
| F7 | Pure mode: `builtins.nixPath` is `[ ]`, `<x>` lookup fails | read, exp | src/libexpr/eval.cc:3268-3270; eval-settings.hh:142 |
| F8 | Pure mode: absolute paths outside the allow list are refused; `--impure` lifts this (exp: `readFile /etc/hostname`) | read, exp | src/libexpr/eval.cc:281-286 |
| F9 | Pure mode: `fetchurl`/`fetchTarball` without a hash fail with `in pure evaluation mode, '%s' requires a 'sha256' argument`; with `--impure` they download | read, exp | src/libexpr/primops/fetchTree.cc:451-454 |
| F10 | Pure mode: `fetchTree` refuses unlocked inputs (warns if only narHash-checked); `fetchMercurial` needs a rev; `storePath` disallowed | read | fetchTree.cc:200-211; primops/fetchMercurial.cc:71-72; primops.cc:1924-1925 |
| F11 | Pure mode still performs network fetches for hashed inputs; the URL may be computed at eval time, and the request is sent before the hash is checked | read, exp | fetchTree.cc:456-498 (download, then compare); exp: a pure `fetchurl` with an eval-computed URL attempted the connection |
| F12 | `restrict-eval` and `allowed-uris` are independent of `--impure`; with restrict-eval on, `--impure` still refuses non-allowed URIs and `getEnv` still returns "" | read, exp | eval.cc:425-430; exp: `access to URI ... is forbidden in restricted mode` |
| F13 | Impure evaluation copies an arbitrary host file into the store by interpolating its path | exp | `"${/abs/s.txt}"` produced `/nix/store/...-s.txt` in the scratch store |
| F14 | A lock node is implicitly final; a later fetch compares every field present in both the lock and the fetch result, including narHash (`mismatch in field 'narHash'`); a non-final input compares narHash explicitly | read, exp | src/libflake/lockfile.cc:89-91; src/libfetchers/fetchers.cc:225-271; exp: tampered lock narHash and changed upstream tarball both rejected |
| F15 | When a locked input is mounted, its narHash is computed from the copied tree and compared to the lock's; the error message prints expected and got swapped | read | src/libexpr/paths.cc:24-43 |
| F16 | A final input with narHash is first looked up as the fixed-output store path computed from that narHash (`ensurePath`, possibly via substituters) and used without re-hashing | read | fetchers.cc:327-335, 396-410 |
| F17 | A lock entry that is unlocked but has a narHash is accepted with a warning; one with neither is refused unless `--allow-dirty-locks` | read | lockfile.cc:77-87, 285 |
| F18 | `--override-input` implies `--no-write-lock-file`; `--recreate-lock-file`, `--update-input` are deprecated aliases; lock writing is refused for unlocked inputs unless dirty locks are allowed | read | src/libcmd/installables.cc:53-170; src/libflake/flake.cc:820-831 |
| F19 | Default global flake registry is fetched from `https://channels.nixos.org/flake-registry.json` | read, exp | src/libfetchers/include/nix/fetchers/fetch-settings.hh:119-122; exp: impure eval added `flake-registry.json` to the scratch store |
| F20 | nixpkgs composes overlays with `lib.foldl' (lib.flip lib.extends)` inside `lib.fix`; user overlays come after the internal layers and before `stdenvOverrides` | read | pkgs/top-level/stage.nix:344-366; lib/fixed-points.nix:92-97, 325-334 |
| F21 | `extends` is `prev // overlay final prev`: overlay attributes win over prev; order matters | read, exp | fixed-points.nix:325-334; exp toy: `{ a = 10; b = 22; c = 11; }` |
| F22 | On native Linux, user overlays are also passed into bootstrap stages, so a replaced core package (exp: `coreutils = prev.hello`) is still replaced in the final set even though `stdenvOverrides` re-inherits `coreutils` from prevStage | read, exp | pkgs/stdenv/linux/default.nix:233, 698, 833-850; stage.nix:183 |
| F23 | Fixed-output derivations are not sandboxed from the network on Linux; sandboxed derivations get only loopback | read | src/libstore/unix/build/linux-derivation-builder.cc:576-580, 658-668 |
| F24 | `__noChroot` is rejected under `sandbox = true` and honoured under `sandbox = relaxed` | read | src/libstore/unix/build/derivation-builder.cc:2088-2109 |
| F25 | The daemon rejects a fixed-output build whose content hash differs from the declared one, and an FOD output that references store paths | read | src/libstore/build/derivation-check.cc:30-52 |

## D9-NIX-C04 Evaluate configuration with --impure

| # | Claim | Mark | Verdict | Reason |
|---|---|---|---|---|
| 1 | Evaluation with `--impure` permits ambient environment input | read, exp | confirmed | F6, F3 |
| 2 | ... time input | read, exp | confirmed | F5 |
| 3 | ... system input | read, exp | confirmed | F5 (`currentSystem`) |
| 4 | ... pathname input | read, exp | confirmed | F8, F7 |
| 5 | Inputs include NIX_PATH | read, exp | confirmed | F7; `-I` and `nix-path` also feed it |
| 6 | Inputs include "fetch permissions" | read | needs refinement | `--impure` does not change fetch permissions set by `restrict-eval`/`allowed-uris` (F12); it only lifts the pure-mode hash/lock requirements (F9, F10) |
| 7 | No input-closure guarantee | inferred from 1-4 | confirmed | ambient values flow into the value with no record of them |
| 8 | Unhashed `builtins.fetchurl`/`fetchTarball` can be permitted here | read, exp | confirmed | F9; still subject to restrict-eval (F12) |
| 9 | Purity must not be inferred from Nix syntax | inferred | marginal | true but vague; the operative point is that purity is a setting (F1-F4), and legacy commands are impure by default with no flag at all |
| 10 | Output: value/derivation description or error/divergence | inferred | confirmed | ordinary evaluation outcomes |
| 11 | Possibly store/network effects | exp | confirmed | F13 (store copy), F9 (download), F19 (registry fetch) |
| 12 | Preserved: none established by default | inferred | confirmed | nothing in `--impure` establishes a predicate |
| 13 | No timing/physical preservation; no provenance inferred from store dependency metadata | inferred | confirmed | boilerplate disclaimer, consistent with source |
| 14 | Broken: e9-local | inferred from F8, F11, F9 | plausible | a host-file or env payload can be placed in a fetch URL; the request leaves the boundary. Requires a W payload readable by the evaluator and a reachable network |
| 15 | Broken: e9-noegress | inferred from F8, F11 | plausible | same mechanism; note pure mode can already egress through hashed fetches (F11), so `--impure` widens which payloads (arbitrary paths, env) can reach a request rather than creating the channel |
| 16 | Broken: e9-gfree | inferred from F9 | plausible | unhashed downloads and env values bring content with unknown or guest origin into the value; also possible in pure mode via hashed third-party fetches |
| 17 | Broken: e9-erase | exp F13 | confirmed | impure evaluation copies an arbitrary host file into the world-readable store, adding a recoverable copy |
| 18 | Broken: e9-nix-hermetic | inferred from definition | dead as defined | the predicate is about build input reads; `--impure` does not change the sandbox. Ambient values are baked into the derivation, which becomes the declared closure. A predicate on evaluation inputs would be needed |
| 19 | Broken: e9-nix-repro | inferred from definition | dead as defined | the predicate compares builds of the same declared closure; `--impure` changes which derivation is produced, not how it builds. Expression-to-derivation determinism is what breaks, and no invariant in the vocabulary names it |
| 20 | "Possibility depends on parameters, not operation name" | inferred | confirmed | consistent with F2: the same effect occurs with no flag on legacy commands |
| 21 | Missing: legacy commands and `nix repl` and `--file` are impure without `--impure` | read | needed | F2, F4; a reader would otherwise think impurity needs the flag |
| 22 | Missing: pure mode is not effect-free | read, exp | needed | F11, F19: pure eval fetches, writes the store and may build (IFD) |
| 23 | Missing: `getEnv` returns "" in pure mode rather than failing | read | needed | F6: a silent difference; a pure/impure pair of runs can differ without an error |

Overall: needs refinement. Of 20 graded claims: confirmed 13, marginal 1, plausible 3, needs refinement 1, dead 2; plus 3 missing claims. e9-erase is the best-supported broken invariant; e9-nix-hermetic and e9-nix-repro do not apply as defined.

## D9-NIX-C05 Pin flake input

| # | Claim | Mark | Verdict | Reason |
|---|---|---|---|---|
| 1 | Resolves an input and records the selected reference, revision and narHash in a lock graph | read, exp | confirmed | flake.cc:376-404 (resolve, mount); paths.cc:32 inserts narHash; exp lock showed narHash; rev recorded for git-like inputs |
| 2 | Inputs: flake graph, resolver, existing lock, updates/overrides | read | confirmed | flake.cc:633-769, F18 |
| 3 | Inputs: allowed sources | read | marginal | `allowed-uris` applies only under restrict-eval (F12); there is no separate allowed-sources setting for locking |
| 4 | Inputs: expected narHash | read | confirmed | from the existing lock or `?narHash=` in the ref |
| 5 | Inputs: trust policy | unknown | needs refinement | no trust policy governs input selection; the nearest settings are `accept-flake-config` (for `nixConfig`) and substituter signature policy (F16). Name the one meant |
| 6 | Digest preservation applies to fetches against unchanged expected lock content in a trusted store | read, exp | confirmed | F14, F15, F16: mismatch is rejected; the store-path shortcut trusts store validity |
| 7 | Lock edits/overrides intentionally choose a different object | read | confirmed | F18; flake.cc:388-395 drops narHash on self-attr change |
| 8 | Locks do not certify publisher | read | confirmed | narHash is computed locally from whatever was fetched at lock time (fetchers.cc:205-206, paths.cc:26-32); no signature check |
| 9 | Locks do not certify downstream build behavior | inferred | confirmed | a lock pins source trees only |
| 10 | Locks do not certify protected D9 origin roots | inferred | confirmed | no origin data in the lock format |
| 11 | Output: updated immutable lock bytes | read | needs refinement | `flake.lock` is a mutable file in the flake tree; it is written unless `--no-write-lock-file`/`--override-input` (F18), and may be committed (`--commit-lock-file`). The lock records a selection; it is not immutable |
| 12 | Output: or failure | read | confirmed | e.g. unlocked input refusal (F17, flake.cc:820-831) |
| 13 | Subsequent fetch checks narHash when used | read, exp | confirmed with condition | F14, F15; only when the lock entry carries narHash (paths.cc:34); with `--allow-dirty-locks` an entry checked only by narHash is accepted with a warning (F17); a store-path hit is not re-hashed (F16) |
| 14 | Preserved/output: e9-nix-content | read, exp | confirmed with condition | input trees are stored as fixed-output NAR paths derived from narHash (fetchers.cc:396-410) and mismatches are rejected (F14, F15); holds under an honest store and substituter policy (F16) |
| 15 | Broken: e9-local | inferred | plausible | resolution sends input URLs and refs to remote servers (F19, git/tarball fetchers); a W payload leaves only if the flake's input refs carry W-derived data |
| 16 | Broken: e9-noegress | inferred | plausible | same mechanism as 15 |
| 17 | Broken: e9-gfree | inferred | confirmed | the recorded rev/narHash and the selected tree derive from third-party content |
| 18 | Broken: e9-nix-repro | inferred from definition | dead as defined | relocking selects a different closure; the predicate quantifies over identical closures. Pinning supports, not threatens, reproducibility of selection |
| 19 | Missing: narHash is trust on first use | read | needed | the lock binds the bytes fetched at lock time, whoever served them (claim 8 says this only for publisher) |
| 20 | Missing: indirect refs resolve through registries, including the global registry fetched from channels.nixos.org | read, exp | needed | F19; this is the main resolver input a reader must know |
| 21 | Missing: the narHash mismatch message at paths.cc:36-40 prints expected and got swapped | read | needed (minor) | diagnostic only; the check itself is correct |

Overall: needs refinement. Of 18 graded claims: confirmed 12 (two with stated conditions), marginal 1, plausible 2, needs refinement 2, dead 1; plus 3 missing claims. The core claim (narHash recorded and later checked) is sound with conditions; "immutable" and "trust policy" need fixing; e9-nix-repro does not apply.

## D9-NIX-C06 Apply overlay

| # | Claim | Mark | Verdict | Reason |
|---|---|---|---|---|
| 1 | Applies an overlay function `final: prev: ...` to construct a modified package fixed point | read, exp | confirmed | F20, F21 |
| 2 | Inputs: initial package set, ordered overlay expressions | read, exp | confirmed | F20, F21 (order changes the result) |
| 3 | Inputs: complete evaluator inputs/settings | inferred | confirmed | overlays evaluate under whatever pure/impure and restrict settings hold |
| 4 | No inherited package guarantee survives arbitrary replacement by assumption | read, exp | confirmed | F21, F22 (even a bootstrap-critical package is replaced) |
| 5 | Pure expression-only overlay changes are local to evaluation | read | needs refinement | true only for overlays that avoid fetchers, path literals and IFD; an overlay is ordinary Nix and can fetch (F11), copy paths into the store (F13) and trigger builds (IFD) |
| 6 | Downstream impurity/egress changes depend on expressions and settings | read | confirmed | F23, F24 |
| 7 | An overlay can select input-addressed output modes | read | marginal | true (drop `outputHash`), but the consequential direction is the reverse: making a derivation fixed-output grants it network access (F23); `__noChroot` works under `sandbox = relaxed` (F24) |
| 8 | Does not bypass the daemon hash checks for fixed-output objects | read | confirmed | F25; the overlay can choose a new declared hash, and the check is against that |
| 9 | Output: modified package-set value or evaluation failure/divergence | read, exp | confirmed | F21; `final` misuse gives infinite recursion |
| 10 | Downstream derivations may be replaced | read, exp | confirmed | F22: replacement propagates through the fixed point and the bootstrap stages |
| 11 | Preserved: none established by default | inferred | needs refinement | e9-nix-content is preserved under an honest daemon (F25), and the entry's own input text asserts it |
| 12 | No timing/physical preservation; no provenance from store metadata | inferred | confirmed | boilerplate |
| 13 | Broken: e9-nix-repro | inferred | plausible | an overlay can substitute a nondeterministic builder; two builds of that derivation can differ (sandbox does not hide the clock) |
| 14 | Broken: e9-nix-hermetic | read | confirmed with condition | turning a derivation fixed-output admits network input (F23); `__noChroot` under relaxed sandbox (F24) |
| 15 | Broken: e9-local | read | plausible | a fixed-output builder has network and can read its build inputs, so W-derived inputs can be sent out (F23); also eval-time fetch URLs (F11) |
| 16 | Broken: e9-noegress | read | plausible | same mechanism as 15 |
| 17 | Missing broken: e9-erase | exp | needed | a path literal in an overlay copies that file into the store (F13; arbitrary paths need impure mode, flake-local paths are already in the store) |
| 18 | Missing broken: e9-gfree | inferred | needed | third-party overlays and replaced sources bring guest-origin content into the package set |
| 19 | Missing: overlays reach bootstrap stages on native Linux | read, exp | needed | F22; scope of replacement is wider than the top-level set |

Overall: plausible, needs refinement. Of 16 graded claims: confirmed 10 (one with condition), marginal 1, plausible 3, needs refinement 2, dead 0; plus 3 missing claims. The broken list is defensible; the fixed-output network route should be named, the "local to evaluation" claim narrowed, and e9-nix-content, e9-erase, e9-gfree added.

## Corrected entries

```json
[
  {
    "id": "D9-NIX-C04",
    "name": "Evaluate with pure-eval off",
    "description": "Evaluate a Nix expression with pure-eval false: by --impure on the nix CLI, by default on legacy commands (nix-instantiate, nix-build, nix-env), with --file, and in nix repl.",
    "input": "Expression, evaluator and store state, and ambient inputs: environment variables (getEnv), currentTime, currentSystem, NIX_PATH and -I, any readable absolute path, and unhashed fetchurl, fetchTarball and unlocked fetchTree. restrict-eval and allowed-uris still apply and are independent of pure-eval. Pure mode is not effect-free either: hashed fetches, flake input fetches and IFD still reach the network and the store.",
    "output": "A value or derivation description, or an error or divergence. Side effects: store additions (copied host paths, downloads) and network requests. Ambient values become part of the produced derivation, so repeated runs can yield different derivations.",
    "preserved": "None established.",
    "broken": "May break e9-erase (an interpolated host path is copied into the world-readable store), e9-local and e9-noegress (a host-file or environment payload can be placed in a fetch URL; pure mode already allows hashed fetches, impure mode widens what can reach them), e9-gfree (unhashed downloads and environment values carry unknown or guest origins). Requires a readable payload and, for egress, network access not blocked by restrict-eval.",
    "invariants": {
      "preserved": [],
      "broken": ["e9-erase", "e9-local", "e9-noegress", "e9-gfree"],
      "output": []
    }
  },
  {
    "id": "D9-NIX-C05",
    "name": "Pin flake input",
    "description": "Resolve a flake input, fetch it, and record the selected reference, revision where the input type has one, and the narHash Nix computed from the fetched tree in flake.lock.",
    "input": "Flake inputs, registries (including the global registry, fetched from channels.nixos.org by default), the existing lock, update and override flags, and any narHash given in the reference. --override-input implies --no-write-lock-file.",
    "output": "A written or updated flake.lock, or failure (for example an unlocked input without --allow-dirty-locks). Later fetches of a lock entry that carries a narHash are rejected on mismatch; a store path already valid for that narHash is used without re-hashing.",
    "preserved": "e9-nix-content for locked inputs that carry a narHash, under an honest store and substituter policy. The narHash is trust on first use: it binds the bytes fetched at lock time, not their publisher or downstream build behaviour.",
    "broken": "May break e9-gfree (the selected tree and recorded hashes derive from third-party content), and e9-local and e9-noegress when input references carry W-derived data, since resolution sends them to remote servers.",
    "invariants": {
      "preserved": ["e9-nix-content"],
      "broken": ["e9-gfree", "e9-local", "e9-noegress"],
      "output": ["e9-nix-content"]
    }
  },
  {
    "id": "D9-NIX-C06",
    "name": "Apply overlay",
    "description": "Apply an overlay final: prev: ... to a package set; nixpkgs composes overlays with lib.extends inside lib.fix, after its internal layers and before stdenvOverrides, and on native Linux also in the bootstrap stages.",
    "input": "Initial package set, ordered overlays, and evaluator settings. An overlay is ordinary Nix: it can fetch, copy paths into the store and trigger builds through IFD.",
    "output": "A modified package set, or an evaluation failure or divergence. Overlay attributes win over prev, and replacements propagate to every dependent derivation through the fixed point.",
    "preserved": "e9-nix-content under an honest daemon: a fixed-output build is still checked against its declared hash, though the overlay may change the declared hash.",
    "broken": "May break e9-nix-repro (a substituted builder can be nondeterministic), e9-nix-hermetic (making a derivation fixed-output gives its build network access; __noChroot is honoured under sandbox = relaxed), e9-local and e9-noegress (a fixed-output builder can send its build inputs out), e9-erase (a path literal copies a file into the store), e9-gfree (third-party overlays and sources).",
    "invariants": {
      "preserved": ["e9-nix-content"],
      "broken": ["e9-nix-repro", "e9-nix-hermetic", "e9-local", "e9-noegress", "e9-erase", "e9-gfree"],
      "output": []
    }
  }
]
```

Notes on the corrections: actsOn, kind and tags are unchanged and not graded. The renaming of C04 is a proposal; it reflects F2, since `--impure` is one of four routes to the same mode. The C05 entry drops e9-nix-repro and C04 drops e9-nix-hermetic and e9-nix-repro because those predicates quantify over a fixed declared closure; an invariant for expression-to-derivation determinism would be new generation and is not proposed here.
