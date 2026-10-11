# Grading: MM-DR-002, D9 bound to Android

Date 2026-10-11. Grades the three candidates in `record.md` against AOSP source fetched directly from `android.googlesource.com` at `refs/tags/android-16.0.0_r4` in this session. Evidence marks follow the kit: **read**, **secondary**, **inferred**, **recalled**, **unknown**. Nothing here was tested on a device.

## 1. The platform pin

**Confirmed (read).** `core/build_id.mk` reads `BUILD_ID=BP4A.251205.006` both in AOSP `platform/build` at `android-16.0.0_r4` and in LineageOS `android_build` on branch `lineage-23.2`. The LineageOS branch moves, and device kernels and vendor blobs are not pinned by the AOSP tag (ChatGPT says so; DeepSeek did not establish the pin at all).

## 2. Source receipts

ChatGPT's receipt hashes were compared with files fetched independently here. Five of five match (first 64 bits shown; **read**): `SensorService.cpp` 6690bfd0857ca5af, `SystemSensorManager.java` 33c00bf9d99b01fc, `ClipboardService.java` 544aabaa64f72970, `ClipboardManager.java` 2324636e04ffca43, `AppOpsManager.java` 91450d5a8ea6b332. Every path in `bindings-chatgpt.json` appears in its receipts, and all 51 bindings use the r4 tag.

Kimi's paths marked verified were spot-checked by HTTP status at the tag (**read**): present are `BroadcastQueueImpl.java`, `PermissionManagerService.java`, `ActivityTaskManagerService.java`, `BackgroundActivityStartController.java`, `ApkSignatureVerifier.java`, `SmsManager.java`, `ProcessList.java`. **Absent (404)** is `system/netd/server/TrafficController.cpp`, which Kimi labels "(verified)" twice; per-UID eBPF network maps live in the Connectivity module at this tag (`packages/modules/Connectivity/service/src/com/android/server/BpfNetMaps.java`, in ChatGPT's receipts). Also absent are two paths Kimi marked "verify at sync", honestly: `services/core/.../devicepolicy/DevicePolicyManagerService.java` (the file is under `services/devicepolicy/`) and `services/core/.../job/JobSchedulerService.java`.

## 3. Sensors: the load-bearing disagreement

DeepSeek says motion sensors have no permission, AppOps or SELinux hook and that closing the channel needs kernel-level sensor HAL changes; Kimi says sensor ingress has "no mediation at all", reports no UID, and is confinable only by denying all third-party apps or the Sensors-off tile. ChatGPT says zero permission is not zero mediation. **The source supports ChatGPT** (read, `frameworks/native/services/sensorservice/SensorService.cpp` at r4):

- `hasSensorAccessLocked` (line 532) requires sensor privacy off and `isUidActive(uid)`: idle apps receive no events.
- `set-uid-state <package> active|idle` (lines 920 to 924), gated on `MANAGE_SENSORS` (line 911), overrides an app's activity state: a per-app sensor cutoff a root shell can apply with `cmd sensorservice set-uid-state <package> idle`, with no hooking and no kernel change.
- A global sensor privacy policy (lines 534, 1659) and a microphone privacy policy (line 168).
- `isRateCappedBasedOnPermission` (line 2651): apps targeting Android 12 or later without `HIGH_SAMPLING_RATE_SENSORS` are rate-capped (200 Hz per `SystemSensorManager.java`); sensors declaring a required app op are checked through AppOps (line 2333).

So the foreground app's motion sensors are readable without a runtime permission, and that is a real gap; it is **confinable per app by configuration**. Whether the cap defeats AccelEve-class attacks is **unknown** here (ChatGPT: "rate limits are mitigation, not a proof of no audio leakage"). None of the three found `set-uid-state`; it is this grading's addition.

## 4. The finding that carries forward: access is enforced, provenance is not

ChatGPT gives every binding two assurance levels. For the platform primitive: enforced 38, monitored 1, unknown 6, not observable 6. For the full D9 contract, which includes where the bytes came from: unknown 47, not observable 4, enforced 0. Android checks who may make a call; nothing carries the origin of the bytes.

ChatGPT's boundary-observation argument shows this is structural for a boundary-only monitor: an app reads a W value and an identical public value, chooses one internally, and emits it; both runs present the same boundary trace, so no decision based on that trace can allow one and deny the other. The argument is a standard indistinguishability proof and holds for its stated observation model (**inferred**). The sound replacement is conservative: once W's data enters a process, everything it emits is treated as W's until reset. One compartment per process is insufficient if the process imports other compartments' data without labels.

Kimi's bindings list most origin invariants as **preserved** (for a raw socket write: E9-PROV, E9-ORIG, E9-SIG, E9-AUTH, E9-REVOKE, E9-FRESH, E9-MEDIATED). Android supplies no evidence for those; this is the silence-as-preservation error the MM-DR-001 lessons ruled out. The same entries in `bindings-chatgpt.json` mark them not observable or unknown.

## 5. AppFunctions

All three agree that declarations are asserted, never checked against behavior. One fact sharpens it (**read**, `services/appfunctions/.../AppFunctionManagerServiceImpl.java` at r4, lines 118 to 175): the agent allowlist merges a hardcoded entry (`com.android.shell`), an updatable DeviceConfig list, and **a secure-setting list, `Settings.Secure.APP_FUNCTION_ADDITIONAL_AGENT_ALLOWLIST`, "set by ADB command"**. A root shell can therefore allowlist the person's own agent. Whether the agent also needs `EXECUTE_APP_FUNCTIONS` and what protection level that permission has was not checked here (**unknown**). Kimi's description (a file `agent_allowlist.txt` under `/data/system/appfunctions/`) does not match this source, and its access-level constants were not found in `AppFunctionManager.java` at the tag.

## 6. Per candidate

**DeepSeek: needs refinement; weakest.** No pin rationale; 13 of 27 operations bound; the sensor claim contradicted by source (section 3); clipboard enforcement cited in the client class rather than `ClipboardService`, and the Android 10 background restriction conflated with Android 12's access notice; `OP_START_FOREGROUND` attached to `startActivity` (it governs foreground services); AccelEve's first author given as Zheng (Ba et al., per the prompt and the other two reports). Its reformulation (enforceable across Binder, sockets and files; one compartment per process) survives with sensors moved to the confinable column.

**Kimi: needs refinement; good on coverage.** All 27 operations, with useful bindings the others lack (SMS send, KeyMint attestation as endorsement, PendingIntent mutability as attenuation). Its feasibility step 2 makes a real point: inline interposition inside `system_server` requires hooking (Zygisk or LSPosed), which is platform modification. Errors: the TrafficController path marked verified (section 2); the sensor claim (section 3); preservation asserted without evidence (section 4); the AppFunctions allowlist location (section 5).

**ChatGPT: plausible; strongest.** Correct pin with its limits stated; receipts that check; correct sensor reading; the two-level assurance; the impossibility argument and its conservative repair; URI-grant revocation not reaching an already-opened file descriptor (repair: a revocable proxy, never raw descriptors); physical channels kept outside digital-origin policy and marked excluded. It ran no device tests and says so. Its paper citations (AccelEve DOI, EarSpy, Oberhuber et al. NDSS 2025, `syncfs` timing, Reardon et al. 2019) are **secondary** here.

## 7. What carries forward

- **Base bindings:** `bindings-chatgpt.json`, as conjecture with receipted paths, for the eventual `mapfill/android.js`. Kimi's extra bindings are considered at landing.
- **The Regulator's pattern** (proposal for the Phone trellis, the operator rules): enforce by setting policy through privileged command interfaces the platform already exposes, rather than by inline interposition. Found here: `cmd sensorservice set-uid-state` (per-app sensors), AppOps modes, runtime permission revoke, and the AppFunctions secure-setting allowlist; network by UID through the Connectivity module's BPF maps. Inline hooking stays a separate, heavier option.
- **The compartment rule** (proposal, F-45): compartments as Android user profiles; a process that has touched W's data emits as W until reset; every cross-profile transfer through a broker the Regulator controls; agents receive guest-touched data only through a labeled broker.
- **For `compose.mjs`:** physical and timing channels are reported as excluded, never preserved; a binding's platform assurance and its full-contract assurance are separate fields.
- **Not yet done:** paper citations, line-level claims beyond sensors and AppFunctions, D8 bindings (none supplied), and any device test.
