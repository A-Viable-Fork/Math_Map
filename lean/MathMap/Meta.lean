import Lean

/-!
# Audit support

`#mathmap_deps X` prints the `MathMap` definitions that the statement of `X` depends on: the constants
its type mentions, followed through the values of definitions and the fields of structures. Projections,
constructors and recursors are reported as their structure. `scripts/lean.mjs` uses it, with
`#print axioms`, to check that every definition a claim rests on is receipted.
-/

open Lean Elab Command

namespace MathMap.Audit

/-- A structure's projections, constructor and recursor stand for the structure itself. -/
def owner (env : Environment) : Name → Name
  | n@(.str p _) =>
    let generated := env.isProjectionFn n || isAuxRecursor env n || isNoConfusion env n ||
      (match env.find? n with | some (.ctorInfo _) | some (.recInfo _) => true | _ => false)
    if isStructure env p && generated then p else n
  | n => n

/-- The `MathMap` constants the statement of `root` depends on. -/
def statementDeps (env : Environment) (root : Name) : Array Name := Id.run do
  let isOurs (m : Name) := (`MathMap).isPrefixOf m && !(`MathMap.Audit).isPrefixOf m
  let some ci := env.find? root | return #[]
  let mut todo : Array Name := ci.type.getUsedConstants
  let mut seen : NameSet := {}
  let mut out : NameSet := {}
  for _ in [0:100000] do
    match todo.back? with
    | none => break
    | some c =>
      todo := todo.pop
      if !isOurs c || seen.contains c then continue
      seen := seen.insert c
      let o := owner env c
      out := out.insert o
      if o != c then todo := todo.push o
      match env.find? c with
      | some (.defnInfo d) => todo := todo ++ d.type.getUsedConstants ++ d.value.getUsedConstants
      | some (.inductInfo i) =>
        todo := todo ++ i.type.getUsedConstants
        for ctor in i.ctors do
          if let some cc := env.find? ctor then todo := todo ++ cc.type.getUsedConstants
      | some other => todo := todo ++ other.type.getUsedConstants
      | none => pure ()
  return out.toList.toArray.qsort (·.toString < ·.toString)

elab "#mathmap_deps " id:ident : command => do
  let n ← liftCoreM <| realizeGlobalConstNoOverloadWithInfo id
  let deps := statementDeps (← getEnv) n
  logInfo m!"MMDEPS {n}: {" ".intercalate (deps.toList.map toString)}"

end MathMap.Audit
