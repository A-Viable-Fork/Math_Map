# Grading: MM-DR-004 Part B, the Nix operations, line by line

Date 2026-10-11. The operator asked for every claim to be checked line by line before landing [ruling: operator, 2026-10-11], and ruled the renumbering into D9 and the four invariants in. Evidence marks: **read**, **secondary**, **inferred**, **recalled**, **unknown**. Verdicts: confirmed, marginal, plausible, needs refinement, dead.

## How it was graded

Each of the generator's nine entries (`package-chatgpt.zip`, `part-b-entries.json`) was split into atomic claims, and each claim was checked against Nix at `f3f1c3c` (2.34.8) and nixpkgs at `7c8764b`, by reading the source and by evaluation-only experiments with Nix 2.34.6 (the installed binary; the cited code is the pinned commit). Three graders worked in parallel on three entries each; their claim tables, with every fact cited by path and line, are in `part-b/`. They are model output, so this repository re-read a sample of their citations at the pins before landing (**read**, all held):

- Nix `src/libstore/profiles.cc` 255 to 266: `--rollback` selects the highest-numbered generation below the current one, not a requested one.
- Nix `src/libstore/profiles.cc` 187 to 197: deleting `old` generations deletes every generation but the current one, newer ones after a rollback included.
- Nix `src/libstore/gc.cc` 289 to 298: `gcroots` and `profiles` are scanned as roots, so ordinary garbage collection keeps every generation.
- nixpkgs `nixos/modules/services/misc/nix-gc.nix` 63 to 70: `nix.gc.options` defaults to "", so automatic collection deletes no generation unless told to.
- Nix `src/libexpr/primops/fetchTree.cc` 451: in pure mode an unhashed fetch fails with "requires a 'sha256' argument".
- Nix `src/libexpr/primops.cc` 1218: `getEnv` returns "" under pure or restricted evaluation, silently.
- Nix `src/nix/main.cc` 420 to 428: legacy commands return before `pureEval` is set, so `nix-instantiate`, `nix-build` and `nix-env` evaluate impurely by default.
- Nix `src/libstore/linux-derivation-builder.cc` 648 to 650: `/dev/random` and `/dev/urandom` are inside the sandbox, so the stock sandbox never establishes e9-nix-hermetic.
- Nix `src/libstore/include/nix/store/local-settings.hh` 400 to 401: `sandbox-fallback` defaults to true upstream.

## Results

| Generator id | Landed as | Claims | Confirmed | Marginal | Plausible | Needs refinement | Dead | Verdict |
|---|---|---|---|---|---|---|---|---|
| D9-NIX-C01 | D9-X30 Realize a derivation | 20 | 15 | 2 | 1 | 2 | 0 | needs refinement |
| D9-NIX-C02 | D9-X31 Fetch and accept fixed-output content | 18 | 15 | 1 | 1 | 1 | 0 | confirmed, with two refinements |
| D9-NIX-C03 | D9-X32 Evaluate in pure-eval mode | 18 | 13 | 1 | 0 | 4 | 0 | needs refinement |
| D9-NIX-C04 | D9-X33 Evaluate with pure-eval off | 20 | 13 | 1 | 3 | 1 | 2 | needs refinement |
| D9-NIX-C05 | D9-X34 Pin flake input | 18 | 12 | 1 | 2 | 2 | 1 | needs refinement |
| D9-NIX-C06 | D9-X35 Apply overlay | 16 | 10 | 1 | 3 | 2 | 0 | plausible, needs refinement |
| D9-NIX-C07 | D9-X36 Switch system configuration | 23 | 13 | 3 | 1 | 5 | 1 | needs refinement |
| D9-NIX-C08 | D9-X37 Roll back system generation | 21 | 12 | 2 | 2 | 5 | 0 | needs refinement |
| D9-NIX-C09 | D9-X38 Garbage-collect the store, and D9-X39 Delete old profile generations | 17 | 13 | 1 | 0 | 2 | 1 | needs refinement; split |

The graders also listed claims the entries were missing: three each for C04, C05 and C06, and e9-gfree as a missing break for C01 and C03. 171 claims in all; 116 confirmed, 5 dead.

## What the grading changed

- **Dead claims.** C04 and C05 listed e9-nix-hermetic and e9-nix-repro as broken, but those invariants are about builds of a fixed input closure, and evaluating impurely or pinning an input changes which derivation is produced, not how it builds. C07 listed e9-nix-hermetic, but a switch runs no build. C07's "profile lock" does not exist: `nix-env --set` takes none; the switcher's lock is its own. C09 listed e9-nix-reversible as both preserved and broken; the map's checker refuses that.
- **The split.** Ordinary garbage collection keeps every rooted generation, so it preserves e9-nix-reversible (D9-X38). Deleting generations is a separate operation that breaks it (D9-X39): `nix-env --delete-generations`, `nix profile wipe-history`, and the first phase of `nix-collect-garbage -d` or `--delete-older-than`.
- **Rollback.** `--rollback` reaches g1 only when g1 is the highest-numbered generation below the current one; a specific generation is reached with `--switch-generation N`, that generation's own `switch-to-configuration`, or the boot menu. One grader reproduced the case where it is not: with generations 1 to 3, a switch back to 1 and a new switch making 4, `--rollback` went to 3.
- **Missing breaks added.** e9-gfree for realizing (substitution and remote builds skip or bypass signature checks for content-addressed paths) and for pure evaluation (hashed fetches still bring outside content in); e9-erase and e9-gfree for overlays.
- **Preservations added.** e9-nix-content for overlays, since a fixed-output build is still checked against its declared hash under an honest daemon.
- **Pure is not effect-free.** In pure mode a hashed fetch still sends its request, with a URL computed during evaluation, before the hash is checked; one grader observed the connection attempt. The pure and impure evaluation entries now say so.

## The four invariants

A definition is the map's own vocabulary, so it is graded for being well formed, non-vacuous, distinct from what the vocabulary has, and true to the mechanism it names.

| Invariant | Verdict | What changed |
|---|---|---|
| e9-nix-repro | needs refinement, refined | "Allowed execution environment" named its parameter: the derivation's platform and builder and the sandbox settings are what is held fixed. Carrier moved from system state to data-value (the output). |
| e9-nix-hermetic | confirmed | Added that it does not imply e9-nix-repro: a hermetic builder can be nondeterministic. |
| e9-nix-content | needs refinement, refined | The garbled "If called addressing" now reads "If the object is content-addressed, its store path is derived from that digest"; noted as D8-X01's Merkle labelling restricted to these objects. |
| e9-nix-reversible | confirmed | Unchanged in substance; "rollback selecting g1" became "selection of g1", since `--rollback` does not always select g1. |

## Held

- **A small bug in Nix** (**read**, `src/libexpr/paths.cc` 34 to 40 at `f3f1c3c`): the NAR hash mismatch error for a flake input prints the computed hash as "expected" and the lock's hash as "got", the reverse of their meaning; the check itself is correct. An upstream report is the operator's call, held with the other outbound findings.
- **Not graded:** each entry's actsOn, kept as the generator wrote it, and one inferred sentence in D9-X39 (boot menu entries for deleted generations stay until the next boot loader install), marked so in `part-b/grading-c07-c09.md`.
