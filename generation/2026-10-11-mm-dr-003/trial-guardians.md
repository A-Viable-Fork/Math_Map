# Trial: Guardians on the D9 export

Date 2026-10-11. Follows the ruling in `grading.md` section 4 [ruling: operator, 2026-10-11]: express the contracts for an existing checker. Evidence marks as in the grading.

## What ran

`node scripts/export-guardians.mjs --source D9-X07=compartment-w --forbid compartment-w` produced 27 tool specifications, five of them sinks (D9-X01, X02, X14, X26, X27: the entries that may break no-egress or locality), and one taint rule, `compartment-w-never-leaves-via-D9-X07`, with D9-X10 (declassify) as its sanitizer. The source label is an instance choice: it says the person's compartment W is what D9-X07 reads here.

Guardians was cloned at `59e52d9` and run unmodified from its `src/` under Python 3.13 with pydantic 2.14.0 and z3-solver 5.1.0, outside this repository. The export loaded into its `ToolSpec` and `Policy` models without change (**read**: the run below).

## Harness

```python
# Load the Math_Map Guardians export into Guardians at 59e52d9 and verify three workflows.
import json, sys
sys.path.insert(0, sys.argv[2])
from guardians import ToolSpec, ToolRegistry, Policy, Workflow, verify

exp = json.load(open(sys.argv[1]))
reg = ToolRegistry()
for s in exp["registry"]:
    reg.register(ToolSpec(**s), lambda **kw: None)
policy = Policy(**exp["policy"])

def call(label, tool, args, bind=None):
    return {"label": label, "tool_call": {"tool_name": tool, "arguments": args, "result_binding": bind}}

workflows = {
  "a-leak": {"goal": "read W, send it", "steps": [
      call("read", "D9-X07", {}, "w"),
      call("send", "D9-X01", {"data-value": {"ref": "w"}})]},
  "b-declassified": {"goal": "read W, declassify, send", "steps": [
      call("read", "D9-X07", {}, "w"),
      call("declassify", "D9-X10", {"data-value": {"ref": "w"}}, "pub"),
      call("send", "D9-X01", {"data-value": {"ref": "pub"}})]},
  "c-branch": {"goal": "read W, branch on it, send a constant", "steps": [
      call("read", "D9-X07", {}, "w"),
      {"label": "branch", "conditional": {"condition": "w == 'secret'",
        "then_steps": [call("send-yes", "D9-X01", {"data-value": "yes"})],
        "else_steps": [call("send-no", "D9-X01", {"data-value": "no"})]}}]},
}
for name, wf in workflows.items():
    r = verify(Workflow(**wf), policy, reg)
    print(name, "ok" if r.ok else "violations", [(v.category, v.step_label, v.rule_name) for v in r.violations])
```

## Result

| Workflow | Expected | Guardians returned |
|---|---|---|
| a. read W, send it | taint violation | `taint` at `send`, rule `compartment-w-never-leaves-via-D9-X07` |
| b. read W, declassify, send the result | no violation | ok |
| c. read W, branch on it, send a constant in each branch | a leak the checker misses | ok |

Workflows a and b confirm the export carries the flow contracts Guardians can check. Workflow c confirms the limit read in `verify.py` (`_verify_conditional` runs both branches on a copy of the entry state and carries no label from the condition into them): one bit of W leaves through which constant is sent, and Guardians passes it. Confirmed for this export at this commit; the same holds for any Guardians policy, since the branch handling is independent of the specifications.

## What follows

Guardians is a usable target for the explicit-flow half of the D9 contracts, graded **confirmed** on these three workflows and no more. The implicit-flow half needs the per-process contamination rule (Weir, prior art; `compose.mjs` context labels, whose vocabulary is still empty), or a patch to Guardians that raises the condition's labels into both branches. The second would be an upstream contribution, held until the operator signs off. Relational and hyperproperty invariants (e9-cni, e9-ini, e9-tni, e9-pni) and the prose contracts stay outside the export, as `notExported` says.

## Addendum, later the same day

Two things above have moved. The context-label vocabulary is no longer empty: `mapfill/invariants.js` raises `compartment-context` at D9-X03, X07, X15, X18 and X27 and forbids it at every entry whose broken field names E9-NOEGRESS, so `node scripts/compose.mjs --chain D9-X07,D9-X01 --require e9-noegress` reports a context violation at the send: the label marks every step after the read until a step clears it, so a decision taken on the data in between is covered as well as the data itself.

And the upstream patch is drafted: `guardians-pc-labels.patch`, against `59e52d9`. It adds a program-counter value to Guardians' abstract state: a conditional raises it by the values its condition reads, for both branches, and restores it after the join; a tool call made under it carries it to every parameter for taint checking and into its result's labels and provenance. The pc starts from the outer pc, never from an empty value, because `sanitized_for` joins by intersection and an empty start would erase every sanitization (the first draft did; the declassified-condition test caught it). Results (**read**, this run):

| | Guardians tests | `test_implicit_flow.py` (6 new) | Workflow c above |
|---|---|---|---|
| at `59e52d9` | 130 passed | 3 failed (the three leaks), 3 passed | ok (missed) |
| with the patch | 136 passed | 6 passed | `taint` at `send-yes` and `send-no` |

Workflows a and b return what they returned before. Not covered: a loop over a labeled collection, whose iteration count reveals its length; the patch leaves `_verify_loop` alone. The patch is held: sending it upstream is the operator's call.
