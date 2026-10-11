# MM-DR-002: Binding D9 Operations to Android — Report

**Platform pin (CONFIRMED).** LineageOS 23.2 is based on Android 16 QPR2 (LineageOS Changelog 30/31; Android Authority, 2025-12-02). The AOSP tag for Android 16 QPR2 is **`android-16.0.0_r4`** (build `BP4A.251205.006`, security patch 2025-12-05, pushed to AOSP 2025-12-02; per source.android.com build-numbers table and the android-building group announcement). All paths below were opened at `refs/tags/android-16.0.0_r4` on android.googlesource.com unless marked "verify at sync." Verified at the tag: `AppOpsService.java`, `PermissionManagerService.java`, `ClipboardService.java`, `ActivityManagerService.java`, `ActivityTaskManagerService.java`, `BackgroundActivityStartController.java`, `UserManagerService.java`, `AppFunctionManagerService.java` (system_server), `MediaProvider.java` (packages/providers), `SensorService.cpp`, `IPCThreadState.cpp` (frameworks/native), `NetdNativeService.cpp` (system/netd). The Java-side sensor service path and `PermissionManagerServiceImpl.java` no longer exist at those locations at this tag; I was unable to verify their replacements and say so where relevant.

## 1. Executive Summary

**Verdict on claimed input 1 ("every effect crossing an app's sandbox boundary passes through at least one platform-controlled enforcement point"): NEEDS REFINEMENT — it is false as stated and true only for the *mediated* effect class.** For effects that cross a process boundary through a platform mediation point — Binder calls checked by `ActivityManagerService.checkComponentPermission` + `PermissionManagerService`, AppOps-gated calls in `AppOpsService`, provider access, SELinux-mediated object access, and network egress attributed by eBPF/`netd` — Android does control a choke point and attributes it by UID, hence by package and user/profile. Three structural exceptions defeat the universal claim: (i) zero-permission motion sensors carry speaker audio into any app with no mediation at all (AccelEve, Ba et al., NDSS 2020; still real at this tag — the 200 Hz ceiling is gated only by the *normal* permission `HIGH_SAMPLING_RATE_SENSORS`, no runtime prompt); (ii) in-process computation and data mixing never cross a boundary, so a single app holding data from two compartments is invisible to every boundary mechanism; (iii) cross-app covert channels (timing, shared resources, confused-deputy re-delegation — Felt et al., USENIX Security 2011) cross compartments through channels that are observable only after the fact, if at all. Strongest defensible reformulation: **boundary enforcement is achievable for all effects that cross Binder/permission/AppOps/SELinux/network/storage mediation points, from a root-privileged observer; it is not achievable, by any boundary placement, for in-process flows and sensor ingress — those require one-compartment-per-process discipline and a sensor policy, and covert channels can only be bounded, not eliminated.** Consequence for `compose.mjs`: effects on unmediated channels must be reported "unenforced," never "preserved."

## Q1. Which Android APIs realize each D9 entry?

Answered by the bindings array in Section 3 (38 bindings covering all 27 entries). Cross-cutting findings:

- **Fully mediated and CONFIRMED**: telephony send (`SmsManager.sendTextMessage` — permission `android.permission.SEND_SMS` + `OP_SEND_SMS` checked in `ActivityManagerService`/`AppOpsService`); runtime-permission grant/revoke; AppOps mode setting; per-call provider access; explicit-component activity/service dispatch (with Android 12+ background-launch restrictions enforced by `BackgroundActivityStartController.java`).
- **Mediated but with parameter-decided deviations**: `sendBroadcast` resolves receivers at runtime, so the destination is not bound at send time (breaks E9-LOCAL/E9-CNI in ways a socket write does not — exactly the deviation the prompt predicted). `grantUriPermission`-family grants realize attenuation/delegation but only at URI granularity, and the recipient combines the grant with its own ambient authority (Felt et al. 2011).
- **No platform realization**: D9-X10 (declassify — closest is grant-based "declassify-by-grant," no release-policy metadata), D9-X21 (no authenticated, effect-atomic audit log; logd is UID-tagged but unchained and never atomic with the effect), D9-X25 (the atomic verify+policy+CAS+audit merge transaction is **DEAD** as a platform primitive; it must be built as an app-level service — a local gap, not a structural impossibility), D9-X26 (CAS exists only in-process).
- **Not observable by design**: D9-X08 (pure evaluation), D9-X15 (join), D9-X23 (app-local nonces). Absence of a boundary event is not enforcement.

## Q2. Where Android enforces each effect

Confirmed at the tag: permission checks run in the serving system service via `ActivityManagerService.checkComponentPermission` -> `PermissionManagerService.checkPermission`; AppOps via `AppOpsService.noteOp`; SELinux as kernel MAC with policy in `system/sepolicy`; per-UID network accounting via eBPF in `system/netd/server/TrafficController.cpp`; storage isolation via kernel DAC + SELinux `app_data_file`; compartments via `UserManagerService` (user types incl. `android.os.usertype.profile.PRIVATE` for Private Space, Android 15+) — all verified except as noted. Attribution: UID -> package via `PackageManagerService`, and UID -> user/profile via `UserHandle`, so compartment attribution is available *wherever the channel reports a UID*. Channels that report no UID (in-process ops, sensor HAL ingress) attribute nothing.

## Q3. Where effects escape enforcement

Key rows (full table in Section 5): (1) **AccelEve** (Ba, Zheng, Qin, Yu, Liu, Li, Liu, Ren, NDSS 2020) — accelerometer-as-microphone; not fixed at the tag; the >200 Hz rate needs only the normal permission `android.permission.HIGH_SAMPLING_RATE_SENSORS` (no prompt — per arXiv:2607.25461, 2026); not confinable by configuration except by denying all third-party apps or the "Sensors off" tile. (2) **Permission re-delegation / confused deputy** (Felt, Wang, Moshchuk, Hanna, Chin, USENIX Security 2011) — structural to Android IPC; mitigated (signature checks, mutability-required `PendingIntent`s since Android 12, per-URI grants) but not eliminated. (3) **Clipboard** — background reads blocked since Android 10 (`ClipboardService.java` verified at tag), preview since Android 13; largely closed. (4) **Timing/resource covert channels** — structural; cannot be closed, only bounded. (5) **Agent-facing channels** — IME, `NotificationListenerService`, accessibility services, AppFunctions: a guest app's text can reach an agent without content-level origin recording; these bindings are policy-privileged and can be disallowed for compartment apps, so confinable. (6) **Auto Backup / cloud sync** silently replicates stored data outside every on-device boundary — a `Store` deviation that breaks inventory-based erasure claims.

## Q4. AppFunctions as a carrier for effect profiles (VERDICT: declarations are asserted, never checked)

At `android-16.0.0_r4`, `AppFunctionManagerService.java` (verified; reads `agent_allowlist.txt` under `/data/system/appfunctions/`) indexes per-app XML metadata (`assets/app_functions.xml`) into AppSearch as `AppFunctionStaticMetadata` documents. Metadata carries: `functionIdentifier`, schema info, `scope` (`self`/`activity`/`global`), access levels (`ACCESS_LEVEL_SELF` = 100 ... `ACCESS_LEVEL_ANDROID_TRUSTED` = 300, requiring `android.permission.EXECUTE_APP_FUNCTIONS`), `enabledByDefault`, and arbitrary extra properties via `getMetadataDocument()` (GenericDocument). **Who verifies it:** the platform indexes it and gates *discovery/execution* by access level + allowlist; **nobody verifies behavior against the declaration** — there is no conformance check of any kind. An effect profile could be *carried* as extra GenericDocument properties (mechanically possible today), but it would be an unchecked assertion, exactly like: MCP `ToolAnnotations` (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` — spec revision 2025-03-26; the spec itself says clients MUST treat them as untrusted hints, and "they aren't enforcement"), the Android manifest (permissions enforced at the *call*, but declared component behavior unchecked), and Play Data safety labels (self-asserted, unverified). **Conclusion: every declaration mechanism available is an assertion; none is a checked contract (E9-EBND). A checked effect profile would require a conformance monitor — that is what the Regulator would have to be.**

## Q5. Feasibility (full table in Section 6)

1. **Every boundary-crossing effect passes a platform point: NEEDS REFINEMENT -> fails as stated.** True for mediated effects (CONFIRMED for Binder/AppOps/SELinux/netd-gated paths). False for sensor ingress (no boundary is crossed; nothing to mediate) and false in general for covert channels. **This is the earliest fatal step.**
2. **Observation from a Magisk module without modifying the platform: MARGINAL.** Root can read auditd records, `dumpsys appops`, eBPF traffic stats, ftrace/kprobe traces (kernel-dependent). Inline per-call interposition inside `system_server` would require hooking (Zygisk/LSPosed) — that *is* platform modification; pure-root enforcement is limited to network (owner-match netfilter), storage watch (inotify/FUSE), and log taps.
3. **Attribution to app + compartment: CONFIRMED** for all UID-reporting channels (Binder identity via `IPCThreadState`; `PackageManagerService` uid->package; `UserHandle`->profile).
4. **Per-call computable and fast: MARGINAL.** AppOps `setMode` gives pre-computed per-(op,uid,package) decisions natively; argument-bound per-call tickets (epoch, exact-args) don't exist — the platform's sound pattern is re-check-at-commit inside one system_server transaction.
5. **Escaping channels closed/confined: MARGINAL.** Clipboard, IME/notification/accessibility bindings, and network (always-on VPN lockdown) are configurable; **motion sensors have no permission to revoke** and timing channels are structural — these confine, not close.

## 2. Per-entry verdicts

X01 MARGINAL; X02 MARGINAL; X03 MARGINAL (structural sensor caveat); X04 MARGINAL; X05 CONFIRMED-with-deviations; X06 MARGINAL; X07 MARGINAL; X08 CONFIRMED (unmediated); X09 MARGINAL; X10 NEEDS REFINEMENT; X11 MARGINAL; X12 MARGINAL; X13 MARGINAL; X14 MARGINAL; X15 CONFIRMED (unmediated); X16 MARGINAL; X17 MARGINAL; X18 MARGINAL; X19 MARGINAL; X20 CONFIRMED; X21 NEEDS REFINEMENT; X22 NEEDS REFINEMENT; X23 NEEDS REFINEMENT; X24 MARGINAL (TOCTOU); X25 DEAD (platform primitive; local gap); X26 NEEDS REFINEMENT; X27 MARGINAL.

## 3. The bindings (JSON)

The same array is delivered standalone in `android-bindings.json`.

```json
{
 "pin": "android-16.0.0_r4",
 "source": "MM-DR-002",
 "date": "2026-10-10",
 "bindings": [
  {
   "entry": "D9-X01",
   "api": "java.net.Socket#connect(SocketAddress,int)",
   "aospPath": "libcore/ojluni/src/main/java/java/net/Socket.java; accounting: system/netd/server/TrafficController.cpp (verified)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.INTERNET"
   ],
   "appOps": [],
   "enforcementPoint": "SELinux untrusted_app domain (system/sepolicy) + per-UID eBPF accounting via TrafficController.cpp; socket-creation gate documented but exact point unverified",
   "parameters": {
    "destination d": "inside/outside B decides E9-LOCAL/E9-NOEGRESS",
    "payload": "what egresses",
    "handler h": "socket vs Binder vs intent decides visible point"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-SIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "No per-call policy gate on raw sockets; INTERNET is install-time normal permission; I was unable to verify the exact refusal point for a UID lacking it at r4"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X01",
   "api": "android.telephony.SmsManager#sendTextMessage",
   "aospPath": "frameworks/base/telephony/java/android/telephony/SmsManager.java",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.SEND_SMS"
   ],
   "appOps": [
    "OP_SEND_SMS"
   ],
   "enforcementPoint": "ActivityManagerService.checkComponentPermission -> PermissionManagerService.checkPermission (both verified at r4) + AppOpsService.noteOp (verified)",
   "parameters": {
    "destination": "number outside B breaks E9-LOCAL/E9-NOEGRESS",
    "text": "payload",
    "sentIntent": "receipt binds endpoint+actor"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-SIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS"
    ],
    "note": "Fully mediated; op logged, content not; no epoch/anti-replay"
   },
   "assurance": "enforced",
   "verdict": "CONFIRMED"
  },
  {
   "entry": "D9-X01",
   "api": "android.content.Context#sendBroadcast(Intent)",
   "aospPath": "frameworks/base/core/java/android/content/Context.java; dispatch: frameworks/base/services/core/java/com/android/server/am/BroadcastQueueImpl.java",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "Receiver-side permission resolution in ActivityManagerService via PermissionManagerService; Android 14+ implicit-broadcast restrictions",
   "parameters": {
    "extras": "payload",
    "resolved receivers": "runtime-resolved destination set - deviates from 'explicitly bound endpoint'"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-SIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-CNI"
    ],
    "note": "Implicit broadcast: destination not bound at send; exported/other-profile receivers may observe; breaks E9-LOCAL/E9-CNI in ways a socket write does not"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X02",
   "api": "android.content.Context#openFileOutput(String,int)",
   "aospPath": "frameworks/base/core/java/android/content/Context.java; kernel DAC + SELinux app_data_file (system/sepolicy)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "Kernel UID sandbox + SELinux; no system_server event for app-private files",
   "parameters": {
    "resource r": "app-private path",
    "mode": "append vs truncate decides old-byte retention"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-SIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-ERASE",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "Overwrite destroys prior bytes with no snapshot/replica inventory (backups, caches) - deviates from 'old snapshots remain explicitly inventoried'"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X02",
   "api": "ContentResolver#insert(Uri,ContentValues) into MediaStore",
   "aospPath": "packages/providers/MediaProvider/src/com/android/providers/media/MediaProvider.java (verified at r4)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [
    "OP_WRITE_MEDIA_IMAGES",
    "OP_WRITE_MEDIA_VIDEO",
    "OP_WRITE_MEDIA_AUDIO"
   ],
   "enforcementPoint": "MediaProvider per-package DB + AppOpsService.noteOp; scoped storage (Android 10+, mandatory 11+)",
   "parameters": {
    "collection": "shared vs app-owned volume = visibility boundary",
    "EXIF": "ACCESS_MEDIA_LOCATION for geotags"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-SIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-ERASE",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-AUDIT"
    ],
    "note": "MediaStore projections replicate metadata system-wide; in-place overwrite, no version inventory"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X03",
   "api": "android.hardware.SensorManager#registerListener(SensorEventListener,Sensor,int)",
   "aospPath": "frameworks/base/core/java/android/hardware/SensorManager.java; native: frameworks/native/services/sensorservice/SensorService.cpp (verified). Java-side service path moved; unverified at r4",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "(motion: none)",
    "android.permission.BODY_SENSORS",
    "android.permission.HIGH_SAMPLING_RATE_SENSORS (>200 Hz; normal, no prompt)"
   ],
   "appOps": [
    "OP_BODY_SENSORS"
   ],
   "enforcementPoint": "SensorService.cpp permission check + AppOpsService.noteOp",
   "parameters": {
    "sensorType": "decides permission class; accelerometer = zero-permission audio channel (AccelEve, NDSS 2020)",
    "samplingRate": ">200 Hz needs HIGH_SAMPLING_RATE_SENSORS (normal perm)"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-GFREE",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "HAL authenticity trusted not verified; ingress root device-global, not compartment-scoped; no per-use audit for motion sensors; guest-origin-free broken by design"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X04",
   "api": "android.os.UserManager#createUser(String,String)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/pm/UserManagerService.java (verified at r4)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.CREATE_USERS"
   ],
   "appOps": [],
   "enforcementPoint": "UserManagerService + kernel per-user storage (SELinux profile_data_file); Private Space (Android 15+) = android.os.usertype.profile.PRIVATE",
   "parameters": {
    "userType": "PRIVATE (Private Space) vs MANAGED (work profile) = compartment semantics"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Profiles share kernel/scheduler/sensors/memory bus: no timing isolation; cross-profile channels (chooser, ACTION_SEND, clipboard) exist and are policy-gated"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X04",
   "api": "android.os.Process#start (zygote fork, per-app UID)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/am/ProcessList.java (verify at sync); domains: system/sepolicy/private/untrusted_app.te",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "Kernel DAC (UID) + SELinux MAC at exec/fork",
   "parameters": {
    "uid": "per-app UID = sandbox boundary",
    "seinfo": "SELinux domain from seapp_contexts"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI"
    ],
    "note": "Standard app isolation; timing/resource channels not covered"
   },
   "assurance": "enforced",
   "verdict": "CONFIRMED"
  },
  {
   "entry": "D9-X05",
   "api": "PermissionManagerService#grantRuntimePermission(String,String,boolean,int)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/pm/permission/PermissionManagerService.java (verified at r4)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.GRANT_RUNTIME_PERMISSIONS (caller)"
   ],
   "appOps": [],
   "enforcementPoint": "PMS grant policy (roles, allowlists); every access re-checked via checkPermission in serving service",
   "parameters": {
    "permName": "resource class",
    "userId": "profile scope"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Root issuance realized, but no lifetime/generation/(root,generation) tuple - E9-REVOKE epoch semantics unrealized; grant state is the only epoch"
   },
   "assurance": "enforced",
   "verdict": "CONFIRMED"
  },
  {
   "entry": "D9-X05",
   "api": "AppOpsService#setMode(int,int,String,int)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/appop/AppOpsService.java (verified at r4)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.MANAGE_APP_OPS (caller)"
   ],
   "appOps": [],
   "enforcementPoint": "AppOpsService mode table; consulted by noteOp at each gated call",
   "parameters": {
    "op": "effect class",
    "mode": "allowed/ignored/errored"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Fixed enumerated effect set; raw sockets and in-process effects have no appop"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X05",
   "api": "Context#grantUriPermission(Uri,String,int)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/am/ActivityManagerService.java (verified; grant path -> UriGrantsManager)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "AMS grant table; provider per-call checkRead/WritePermission",
   "parameters": {
    "flags": "FLAG_GRANT_READ/WRITE_URI_PERMISSION",
    "prefix": "FLAG_GRANT_PREFIX_URI_PERMISSION = subtree"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Object-grained issuance; package-bound; lifetime = until revoke/expiry"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X06",
   "api": "PermissionManagerService#revokeRuntimePermission + AppOpsService#setMode(...,MODE_IGNORED)",
   "aospPath": "PermissionManagerService.java + AppOpsService.java (both verified at r4)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.REVOKE_RUNTIME_PERMISSIONS / MANAGE_APP_OPS (caller)"
   ],
   "appOps": [],
   "enforcementPoint": "Live checks in serving services consult current grant/mode state per call",
   "parameters": {
    "alias coverage": "open FDs/active sensor streams already open are unaffected"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-FRESH",
     "E9-AUDIT",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI"
    ],
    "note": "Best-effort, not a generation CAS; no atomic disable of in-flight effects; matches entry's 'earlier delivered data remains' but not its atomic epoch semantics"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X07",
   "api": "Context#openFileInput(String)",
   "aospPath": "frameworks/base/core/java/android/content/Context.java; kernel DAC + SELinux app_data_file",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "Kernel DAC + SELinux; no system_server event",
   "parameters": {
    "path": "inside own sandbox"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-SIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-GFREE",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "No platform-visible event: E9-AUDIT unsatisfiable for app-private reads"
   },
   "assurance": "not observable",
   "verdict": "CONFIRMED"
  },
  {
   "entry": "D9-X07",
   "api": "ContentResolver#query(Uri,...) on another app's provider",
   "aospPath": "frameworks/base/core/java/android/content/ContentResolver.java; checks: ActivityManagerService.getContentProvider + ContentProvider.checkReadPermission",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "provider-defined, e.g. android.permission.READ_CONTACTS, READ_MEDIA_IMAGES"
   ],
   "appOps": [
    "OP_READ_CONTACTS",
    "OP_READ_MEDIA_IMAGES",
    "OP_READ_MEDIA_VIDEO",
    "OP_READ_MEDIA_AUDIO"
   ],
   "enforcementPoint": "AMS provider acquisition + per-call read check via PermissionManagerService; AppOpsService.noteOp",
   "parameters": {
    "uri": "row set",
    "projection": "column subset = attenuation of what egresses"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-SIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-GFREE",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "ContentObserver callbacks notify the provider app on read - a hidden read-notification channel for derived-signal egress; unmodeled by the platform"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X08",
   "api": "JVM/ART in-process evaluation",
   "aospPath": "art/ (runtime repo); bionic/ for JNI",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "None: evaluation is in-process; no boundary crossed",
   "parameters": {
    "f": "purity/totality is a property of f, not platform-enforced",
    "operands": "labels are in-app metadata"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-AUDIT",
     "E9-MEDIATED",
     "E9-EBND"
    ],
    "breaks": [
     "E9-GFREE",
     "E9-SIG",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI"
    ],
    "note": "No purity enforcement: reflection/JNI defeat blanket claims; E9-EBND must come from a certified analyzer, not Android"
   },
   "assurance": "not observable",
   "verdict": "CONFIRMED"
  },
  {
   "entry": "D9-X09",
   "api": "KeyPairGenerator#initialize(AlgorithmParameterSpec)+generateKeyPair (AndroidKeyStore)",
   "aospPath": "libcore (JCA) + keystore2 daemon (system/security/keystore) + KeyMint HAL; verify exact service class at sync",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "keystore2 binder service (SELinux-gated) + KeyMint in TEE/StrongBox; key use authorized by key authorizations",
   "parameters": {
    "attestationChallenge": "caller nonce bound into attestation = freshness witness",
    "purposes": "initial authority"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-ERASE",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Hardware-backed fresh identity; deletion = deleteEntry; TEE latencies leak size/timing (E9-TNI)"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X10",
   "api": "Context#grantUriPermission to chosen package / photo-picker grant (declassify-by-grant)",
   "aospPath": "ActivityManagerService.java (verified; grants); picker: packages/providers/MediaProvider (verified)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "AMS grant table + provider per-call check; picker grants time-boxed subset access",
   "parameters": {
    "target package": "who gets the weaker-confidentiality view",
    "uri subset": "what is released (picker releases user-selected items only)"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-GFREE",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-SIG",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-CNI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "No declassify primitive exists; this is closest. User/system authorization via chooser; grant recorded (monitored); no release-policy metadata (what/who/where/when), no origin annotation"
   },
   "assurance": "enforced",
   "verdict": "NEEDS REFINEMENT"
  },
  {
   "entry": "D9-X11",
   "api": "APK signature verification at install (PackageManagerService -> ApkSignatureVerifier; APK Sig Scheme v2/v3/v4)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/pm/PackageManagerService.java; frameworks/base/core/java/android/util/apk/ApkSignatureVerifier.java (verifier class: verify at sync)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "PMS SigningDetails persistence; verified at install and package scan",
   "parameters": {
    "signingCert": "pinned key per package; v3 rotation allows lineage",
    "scheme": "v2/v3 full-file bytes; v4 fs-verity"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-GFREE",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-SIG",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-INI",
     "E9-AUDIT"
    ],
    "note": "Endorsement binds package identity to signing key, not a datum to a validation predicate + decision scope; package granularity only"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X11",
   "api": "IKeyMintDevice#attestKey (hardware attestation with caller challenge)",
   "aospPath": "system/security/keystore (keystore2) + KeyMint HAL; verify at sync",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "TEE/StrongBox attestation signed with factory key; challenge bound into certificate",
   "parameters": {
    "challenge": "caller-supplied freshness nonce"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-GFREE",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-SIG",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-INI",
     "E9-AUDIT"
    ],
    "note": "Hardware endorsement of key origin; decision scope absent"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X12",
   "api": "Context#grantUriPermission(uri,pkg,FLAG_GRANT_READ_URI_PERMISSION|FLAG_GRANT_PREFIX_URI_PERMISSION)",
   "aospPath": "ActivityManagerService.java (verified; UriGrantsManager; pruneUriPermissions on death/revoke)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "AMS grant table; provider per-call check enforces attenuated right",
   "parameters": {
    "prefix flag": "subtree bounding",
    "recipient": "single named package"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Realizes E9-ATTEN for the URI target (read-only subset, revocable); cannot express effect-class rights - URI granularity only"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X12",
   "api": "android.app.PendingIntent#getActivity(Context,int,Intent,int)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/am/PendingIntentRecord.java (verify at sync)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "AMS PendingIntentRecord; fillIn restrictions; Android 12+ mutability required (FLAG_IMMUTABLE/FLAG_MUTABLE)",
   "parameters": {
    "fillIn": "mask decides which args recipient may modify",
    "mutability": "IMMUTABLE bounds recipient authority"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Attenuation is opt-in; historically misused (StrandHogg class, e.g. CVE-2020-0096); mutability requirement fixes that vector at this tag"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X13",
   "api": "Context#startActivity(chooserIntent with FLAG_GRANT_READ_URI_PERMISSION) - share-sheet delegation",
   "aospPath": "ActivityManagerService.java (verified; grants); resolver UI: com/android/intentresolver (verify at sync)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "AMS grant lifetime-bound to started activity stack; provider checks enforce delegated read",
   "parameters": {
    "recipient": "resolved at user selection (not statically bound)",
    "grant flags": "attenuated rights handed over"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Felt et al. (USENIX Security 2011): permission re-delegation is structural; recipient combines grant with its own ambient authority (e.g. its network access) and can forward; grant recorded, downstream disclosure not"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X14",
   "api": "Context#startForegroundService(Intent)/startService",
   "aospPath": "ActivityManagerService.java (verified) -> ActiveServices -> ProcessList.startProcess (verify); BAL gate: BackgroundActivityStartController.java (verified at r4)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.FOREGROUND_SERVICE (9+); Android 14+ foregroundServiceType + type permission"
   ],
   "appOps": [],
   "enforcementPoint": "AMS component/permission checks + BAL restrictions (12+) + FGS type enforcement (14+)",
   "parameters": {
    "component": "explicitly named (attenuated destination)",
    "fgServiceType": "manifest-declared effect class, enforced at start"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-GFREE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "Spawn gate enforced; child (callee UID) runs with its own full grant graph - child authority is not an attenuation of the caller's set, and child effects attribute to the child"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X14",
   "api": "android.app.job.JobScheduler#schedule(JobInfo)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/job/JobSchedulerService.java (verify at sync)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android.permission.RECEIVE_BOOT_COMPLETED (boot triggers)"
   ],
   "appOps": [],
   "enforcementPoint": "JobSchedulerService quota buckets (12+); JobStatus tracking",
   "parameters": {
    "constraints": "when effects may run",
    "persisted": "survives reboot"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-GFREE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "Deferred spawn in caller's own UID; quota is rate control, not authorization"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X15",
   "api": "Thread#join()/ExecutorService await; Binder sync reply",
   "aospPath": "art/ + libcore (in-process); Binder: frameworks/native/libs/binder/IPCThreadState.cpp (verified at r4)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "None in-process; Binder replies mediated by driver (UID-attributed)",
   "parameters": {
    "handle": "local object; no platform task identity",
    "timeout": "blocking vs cancellation observation"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-REVOKE",
     "E9-FRESH"
    ],
    "breaks": [
     "E9-GFREE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Join is app-local: no boundary event, no accounted child history; trace incorporation must be built in-app"
   },
   "assurance": "not observable",
   "verdict": "CONFIRMED"
  },
  {
   "entry": "D9-X16",
   "api": "Context#bindService(Intent,ServiceConnection,int) -> Service#onBind (installed handler)",
   "aospPath": "frameworks/base/services/core/java/com/android/server/am/ActiveServices.java (verify at sync)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "service-declared android:permission"
   ],
   "appOps": [],
   "enforcementPoint": "AMS permission check on bind; per-call IPC checks by the service binder",
   "parameters": {
    "component": "handler identity (explicit intent binds statically)",
    "exported": "who may install/replace the binding"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-ERASE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT",
     "E9-EBND"
    ],
    "note": "Same request syntax, different effects under different handlers; no stored contract for handler semantics; replaced handler invalidates prior effect certificate (E9-EBND deviates)"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X16",
   "api": "ContentProvider installed via AndroidManifest (manifest-registered interpreter)",
   "aospPath": "PackageManagerService.java (verified; auth registration); mediation: ActivityManagerService.getContentProvider",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "android:readPermission/writePermission or per-uri-permission"
   ],
   "appOps": [],
   "enforcementPoint": "AMS per-call mediation for every provider access",
   "parameters": {
    "authority": "typed effect namespace",
    "exported": "handler exposure scope"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-ERASE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT",
     "E9-EBND"
    ],
    "note": "Closest realization of an installed, platform-mediated effect interpreter; contract is permission-shaped only"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X17",
   "api": "javax.crypto.Cipher#doFinal(byte[]) with AndroidKeyStore key",
   "aospPath": "libcore (JCA) + keystore2 daemon (system/security/keystore) + KeyMint HAL; verify at sync",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "keystore2 enforces key authorization (PURPOSE_ENCRYPT, user-auth binding via Gatekeeper/biometric); SELinux gates keystore2 access",
   "parameters": {
    "algorithm/params": "strength assumptions not imported by the word encrypt",
    "nonce": "freshness discipline is caller responsibility"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-CNI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "Opaque key service realized; output size/timing observable; ciphertext exported by a later send still breaks E9-LOCAL - encryption is not confinement"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X18",
   "api": "javax.crypto.Cipher#doFinal(byte[]) decrypt path (AndroidKeyStore)",
   "aospPath": "libcore (JCA) + keystore2 + KeyMint HAL; verify at sync",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "keystore2 authorization per operation; user-auth gate for auth-bound keys",
   "parameters": {
    "ciphertext envelope": "AEAD authentication decides integrity claims",
    "error channel": "failure observability = modeled side channel"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-ERASE",
     "E9-GFREE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "Plaintext inherits labels only if app models it; AEAD/padding error distinction is an oracle the app must neutralize"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X19",
   "api": "java.security.Signature#sign(byte[]) with AndroidKeyStore key",
   "aospPath": "libcore (JCA) + keystore2 + KeyMint HAL; verify at sync",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "keystore2 per-op authorization (PURPOSE_SIGN, digest/algorithm allowlist)",
   "parameters": {
    "descriptor": "canonical bytes chosen by app - platform binds no what/who/where/when policy",
    "pinned verify key": "established out of band"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Signing oracle available to any code in the app UID; canonicalization and commit-context binding are entirely app obligations"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X20",
   "api": "java.security.Signature#verify(byte[]) in-process / ApkSignatureVerifier at install",
   "aospPath": "libcore (JCA); frameworks/base/core/java/android/util/apk/ApkSignatureVerifier.java (verify class at sync)",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "None at runtime (pure); install-time verifier in PackageManagerService",
   "parameters": {
    "pinned public key bytes": "supplied by verifier, never from message",
    "algorithm": "declared per scheme"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-AUDIT",
     "E9-MEDIATED",
     "E9-EBND"
    ],
    "breaks": [
     "E9-INI"
    ],
    "note": "Witness binds exact bytes/algorithm/key but not current ownership or freshness - matches the entry's own caveat"
   },
   "assurance": "not observable",
   "verdict": "CONFIRMED"
  },
  {
   "entry": "D9-X21",
   "api": "android.util.Log -> logd / AppOps logged-op history",
   "aospPath": "system/core/logd (logd daemon); AppOpsService.java history (verified); SELinux audit via kernel",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [
    "(AppOps logging for gated ops only)"
   ],
   "enforcementPoint": "logd per-UID tagging + SELinux on log read (READ_LOGS is signature); AppOpsService records noteOp events",
   "parameters": {
    "record content": "app-chosen; platform authenticates origin (uid) not truth",
    "log head chaining": "absent"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI"
    ],
    "note": "No authenticated append-only chained log for apps; append never atomic with the recorded effect; deleting a log entry does not undo an egressed effect (absorbing)"
   },
   "assurance": "monitored",
   "verdict": "NEEDS REFINEMENT"
  },
  {
   "entry": "D9-X22",
   "api": "File#delete() on app-private data / keystore deleteEntry / DevicePolicyManager#wipeData(int)",
   "aospPath": "Context.java (deleteFile); DevicePolicyManagerService: frameworks/base/services/core/java/com/android/server/devicepolicy/DevicePolicyManagerService.java (verify); reset via RecoverySystem",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "(wipeData: device owner)"
   ],
   "appOps": [],
   "enforcementPoint": "Kernel fs delete in UID sandbox; keystore2 deletion in TEE; wipeData -> RecoverySystem factory reset",
   "parameters": {
    "inventory completeness": "backups (allowBackup), cloud copies, recipient memory, flash wear-leveling outside platform inventory"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Deletion bounded to modeled copies only; E9-ERASE postcondition needs the complete-inventory discipline; past egress not undone"
   },
   "assurance": "monitored",
   "verdict": "NEEDS REFINEMENT"
  },
  {
   "entry": "D9-X23",
   "api": "java.security.SecureRandom#generateSeed/nextBytes in-process / KeyMint attestKey with challenge",
   "aospPath": "libcore (SecureRandom); keystore2 + KeyMint",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "None for app-local nonces; TEE binds challenge into signed certificate",
   "parameters": {
    "issuer scope": "app-chosen; platform has no shared nonce registry",
    "registry capability": "absent - uniqueness checked only by the app's own store"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI",
     "E9-AUDIT"
    ],
    "note": "Randomness provided; atomic reservation in a protected issuer/scope namespace is not a platform service - build per-app or per-Regulator"
   },
   "assurance": "not observable",
   "verdict": "NEEDS REFINEMENT"
  },
  {
   "entry": "D9-X24",
   "api": "ActivityManagerService#checkComponentPermission + AppOpsService#noteOp + SELinux MAC",
   "aospPath": "ActivityManagerService.java (verified); AppOpsService.java (verified); SELinux: system/sepolicy (kernel LSM)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "(the permission being checked)"
   ],
   "appOps": [
    "(the op being noted)"
   ],
   "enforcementPoint": "Serving services re-evaluate grant state on every binder call; SELinux at kernel object access",
   "parameters": {
    "effect args": "bound by the API call itself",
    "epoch": "no epoch object - grant state may change between check and use (TOCTOU)"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-AUDIT",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-TNI"
    ],
    "note": "Gate trusted/total for covered effects; issues no argument+epoch-bound ticket; sound pattern is re-check-at-commit inside one system_server call; native/SELinux-covered channels are outside the gate"
   },
   "assurance": "enforced",
   "verdict": "MARGINAL"
  },
  {
   "entry": "D9-X25",
   "api": "No platform realization. Closest fragments: SQLiteDatabase transaction (in-process) + ContentProvider.call (non-transactional) + KeyMint attestation",
   "aospPath": "frameworks/base/core/java/android/database/sqlite/SQLiteDatabase.java (in-process); frameworks/base/core/java/android/content/ContentProvider.java",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "None spans verify + policy + CAS + audit atomically; services have only internal locking",
   "parameters": {
    "owner-signed descriptor": "verification available (Signature#verify), commit integration absent",
    "nonce/version CAS": "absent at platform level"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-AUDIT",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-SIG",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI"
    ],
    "note": "DEAD as a platform primitive; must be built as app/privileged-daemon service composing X20+X24+X26 with its own audit. Local specification gap, not structural impossibility"
   },
   "assurance": "unknown",
   "verdict": "DEAD"
  },
  {
   "entry": "D9-X26",
   "api": "AtomicReference#compareAndSet / SQLite conditional UPDATE ... WHERE id=? AND version=?",
   "aospPath": "libcore (java.util.concurrent.atomic); SQLite: external/sqlite + frameworks/base/core/java/android/database/sqlite/",
   "tag": "android-16.0.0_r4",
   "permissions": [],
   "appOps": [],
   "enforcementPoint": "In-process only; system_server has internal transactions but exposes no guarded CAS API to apps",
   "parameters": {
    "expected version": "app-supplied; no platform epoch object",
    "guard spec": "policy re-eval not atomic with swap across binder"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-OWNER",
     "E9-AUTH",
     "E9-REVOKE",
     "E9-FRESH",
     "E9-AUDIT",
     "E9-MEDIATED"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-SIG",
     "E9-ERASE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI"
    ],
    "note": "CAS exists only inside one process; the trusted multi-party CAS with atomic log is exactly what a concrete binding must build"
   },
   "assurance": "not observable",
   "verdict": "NEEDS REFINEMENT"
  },
  {
   "entry": "D9-X27",
   "api": "Context#startActivity(Intent) with explicit ComponentName (attenuate -> spawn -> join)",
   "aospPath": "ActivityTaskManagerService.java (verified) + ActivityManagerService.java (verified); BAL gate: BackgroundActivityStartController.java (verified)",
   "tag": "android-16.0.0_r4",
   "permissions": [
    "component-declared permissions; FOREGROUND_SERVICE family for FGS paths"
   ],
   "appOps": [],
   "enforcementPoint": "ATMS/AMS explicit-component resolution, exported/permission checks, BAL restrictions (12+)",
   "parameters": {
    "component": "explicitly named local destination (bound at dispatch, unlike broadcast)",
    "callback": "join channel (ActivityResult)"
   },
   "deviations": {
    "preserves": [
     "E9-PROV",
     "E9-ORIG",
     "E9-REVOKE",
     "E9-FRESH"
    ],
    "breaks": [
     "E9-LOCAL",
     "E9-NOEGRESS",
     "E9-GFREE",
     "E9-CNI",
     "E9-INI",
     "E9-TNI",
     "E9-PNI",
     "E9-AUDIT"
    ],
    "note": "Explicit dispatch binds destination statically, but callee runs in its own UID with its own grants (ambient authority); callee side-effects attribute to the callee; preserved set holds only with separate callee monitoring"
   },
   "assurance": "monitored",
   "verdict": "MARGINAL"
  }
 ],
 "evidenceNote": "aospPath values verified against android.googlesource.com at refs/tags/android-16.0.0_r4 where no 'verify at sync' note is present; entries with 'verify at sync' were not independently opened."
}
```

## 4. Enforcement map (Q2)

| Mechanism | What it checks | Where (path @ `android-16.0.0_r4`) | Attributes | Cannot see |
|---|---|---|---|---|
| UID sandbox + SELinux | process identity -> filesystem/socket/object access | kernel DAC + `system/sepolicy` (domains incl. `untrusted_app.te`); binder identity: `frameworks/native/libs/binder/IPCThreadState.cpp` (verified) | UID (-> package, user via PMS/UserHandle) | in-process data flow; intra-app flows |
| Runtime/install permissions | permission grants per (package, user) | `PermissionManagerService.java` (verified); called via `ActivityManagerService.checkComponentPermission` (verified) | package, user | effects under no permission (sensors, in-process) |
| AppOps | enumerated sensitive ops per (op, uid, package) | `AppOpsService.java` (verified) | uid, package, op, noteOp history | ops outside enumerated set; raw sockets |
| Binder driver | transaction delivery + caller UID | kernel driver + `IPCThreadState.cpp` (verified) | caller UID per transaction | payload semantics |
| Network: netd + eBPF | per-UID byte/packet accounting, firewall chains, DNS/VPN rules | `system/netd/server/NetdNativeService.cpp`, `TrafficController.cpp` (verified); policy: `NetworkPolicyManagerService` | UID -> app; metered/restricted status | payload content; in-device channels |
| Scoped storage | per-collection file visibility, app-owned dirs | `MediaProvider.java` (verified) + kernel DAC | package, collection | app-private internals |
| User/work profiles | user boundaries, cross-profile intent rules | `UserManagerService.java` (verified); user types `android.os.usertype.*` | user/profile id | shared kernel/sensors |
| Private Space | Android 15+; separate profile user, hidden-when-locked | userType `android.os.usertype.profile.PRIVATE` (dumpsys user; docs) | profile | same as profiles |
| Clipboard | foreground-only read (Android 10+), preview (13+) | `ClipboardService.java` (verified) | uid, package | content-level origin beyond app identity |
| Sensors | permission class per sensor type; >200 Hz gate | `SensorService.cpp` (verified); AppOps `OP_BODY_SENSORS` | package (permission-gated classes only) | motion-sensor streams: no permission, no per-use audit |
| Background starts | who may launch activities/FGS | `BackgroundActivityStartController.java` (verified) | caller token chain | already-running components |

## 5. Escape channels (Q3)

| Channel | Versions | Evidence | Fixed at r4? | Confinable by config? |
|---|---|---|---|---|
| Accelerometer carries speaker audio | all; 200 Hz cap 12+ bypassed via normal `HIGH_SAMPLING_RATE_SENSORS` | Ba et al., AccelEve, NDSS 2020; arXiv:2607.25461 (2026) | **No** | Only by removing apps / "Sensors off" tile |
| Permission re-delegation / confused deputy | all | Felt, Wang, Moshchuk, Hanna, Chin, USENIX Security 2011 | No (structural; mitigated: signature checks, per-URI grants, immutable PendingIntent 12+) | Partially |
| Mutable PendingIntent hijack (StrandHogg class) | <=11 | CVE-2020-0096 | **Yes** (mutability required, 12+) | n/a |
| Clipboard background reads | <=9 | platform docs + `ClipboardService.java` | Mostly (10+ foreground-only; 13+ preview) | Yes |
| Covert timing/resource channels (cache, scheduler, disk metadata) | all | standard noninterference literature (E9-TNI class) | No — structural | No (bound only) |
| `/proc`-style info leaks | <=9 mostly | progressive restriction 10+ (hidepid, per-UID net stats) | Mostly | n/a |
| ContentObserver read-notification (provider learns of reads) | all | provider framework behavior | No | No |
| Auto Backup / cloud sync replication | all | manifest `allowBackup`; scoped-storage docs | No | Yes (disable backup per app) |
| Agent-facing: IME, NotificationListenerService, Accessibility, AppFunctions | all | service-binding docs; AppFunctions metadata docs | No | Yes (disallow bindings for compartment apps) |

## 6. Feasibility table (Q5)

| Step | Best supporting evidence | Main gap | Verdict |
|---|---|---|---|
| 1. Every boundary-crossing effect passes a platform point | Verified: AMS/PermissionManagerService/AppOpsService/SELinux/netd choke points for all mediated IPC/network/provider effects | Sensor ingress crosses no boundary; in-process mixing invisible; covert channels unmediated | **NEEDS REFINEMENT (fails as stated; earliest fatal step)** |
| 2. Privileged observation without platform modification | auditd, dumpsys appops, eBPF stats, ftrace | Inline per-call decisions in system_server need hooking (Zygisk/LSPosed) = modification | MARGINAL |
| 3. Attribution to app + compartment | Binder UID attribution (`IPCThreadState.cpp` verified); PMS uid->package; UserHandle->profile | None for UID-reporting channels | CONFIRMED |
| 4. Per-call, fast policy decision | AppOps `setMode` native per-(op,uid,package) decisions | Argument+epoch-bound tickets don't exist; TOCTOU across binder calls | MARGINAL |
| 5. Escape channels closed/confined | Clipboard/IME/network bindings/VPN lockdown configurable | Motion sensors have no revocable permission; timing channels structural | MARGINAL |

## 7. Bottom-line assessment

**One verdict: NEEDS REFINEMENT (claimed input 1 fails as stated).** Strongest defensible reformulation: *"For effects that cross Android's mediation points — Binder transactions, permission/AppOps-gated service calls, provider access, SELinux-controlled objects, and network egress — a root-privileged Regulator can observe, attribute to app and profile, and enforce per-call compartment policies at those points. Enforcement does not extend to (a) effects that never cross a process boundary (in-process taint mixing — requires one compartment per process plus IPC-mediated sharing), (b) sensor and other zero-permission ingress (requires a sensor policy; structural for motion sensors as configured today), and (c) covert timing/resource channels, which can only be bounded, never closed."* `compose.mjs` must therefore emit "unenforced" for any effect whose binding's assurance is `not observable` or whose channel is listed in Section 5. Absence of a logged break is not a proof; deleting a copy after egress restores nothing.

**AOSP vs OEM:** everything above is AOSP at `android-16.0.0_r4`, which is the LineageOS 23.2 base; LineageOS does not alter these enforcement points. Stock OEM Android 15 builds (e.g., Samsung) match AOSP 15/16 behavior at these layers; any OEM-added management (e.g., Knox) is additive telemetry/policy, not a different enforcement topology, and is out of scope for this binding.

**Documented vs implemented, honestly:** the documented claim "an app without INTERNET cannot open sockets" could not be pinned to an exact code point at the tag by me; the INTERNET row above is marked accordingly. The Java-side sensor service path and `ApkSignatureVerifier` exact location are marked "verify at sync." Everything else carries a verified path or a named uncertainty.

## 8. Bibliography

1. AOSP tag `android-16.0.0_r4` (build `BP4A.251205.006`), Android 16 QPR2, SPL 2025-12-05 — source.android.com "Codenames, tags, and build numbers" + android-building group post, 2025-12-02 (RESULT).
2. Android 16 QPR1/QPR2 release notes — source.android.com (RESULT).
3. LineageOS Changelog 30 ("Primetime Release", 2025-10-11) and Changelog 31 ("Halftime Release", 2026-02-08) — lineageos.org (RESULT).
4. "Google has released Android 16 QPR2's source code" — Android Authority, 2025-12-02 (RESULT).
5. Ba, Zheng, Qin, Yu, Liu, Li, Liu, Ren, "Learning-based Practical Smartphone Eavesdropping with Built-in Accelerometer" (AccelEve), NDSS 2020, and its MobiCom 2020 demo (RESULT).
6. "Physics-Guided Acoustic Eavesdropping via Smartphone Accelerometers" (surveys AccelEve/SpearPhone/VoiceListener/LeakForge; notes `HIGH_SAMPLING_RATE_SENSORS` is a normal permission), arXiv:2607.25461, 2026 (RESULT).
7. Felt, Wang, Moshchuk, Hanna, Chin, "Permission Re-Delegation: Attacks and Defenses," 20th USENIX Security Symposium, 2011 (RESULT).
8. `android.app.appfunctions.AppFunctionMetadata` API reference and `AppFunctionManager` documentation — developer.android.com, retrieved 2026-10 (RESULT); `AppFunctionManagerService.java` @ `android-16.0.0_r4` (THEOREM-by-inspection).
9. MCP tool annotations: spec revision 2025-03-26 `ToolAnnotations` interface and "Tool Annotations as Risk Vocabulary," modelcontextprotocol.io blog, 2026-03-16 (RESULT).
10. Bayton, "What is Private Space in Android 15..." (userType `android.os.usertype.profile.PRIVATE`, dumpsys evidence), bayton.org, 2024-11 (RESULT); Android Private Space docs, developer.android.com (RESULT).
11. Verified AOSP paths @ `android-16.0.0_r4`: `frameworks/base/services/core/java/com/android/server/appop/AppOpsService.java`; `.../pm/permission/PermissionManagerService.java`; `.../clipboard/ClipboardService.java`; `.../am/ActivityManagerService.java`; `.../wm/ActivityTaskManagerService.java`; `.../wm/BackgroundActivityStartController.java`; `.../pm/UserManagerService.java`; `.../appfunctions/.../AppFunctionManagerService.java`; `packages/providers/MediaProvider/.../MediaProvider.java`; `frameworks/native/services/sensorservice/SensorService.cpp`; `frameworks/native/libs/binder/IPCThreadState.cpp`; `system/netd/server/NetdNativeService.cpp` (all opened at the tag; THEOREM-by-inspection).
