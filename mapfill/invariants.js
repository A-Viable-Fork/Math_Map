// Role: the invariant vocabulary. Names the invariants that entries preserve or break, so a chain of entries
//   can be checked for what survives it by machine rather than by reading free text.
// Contract: exports CARRIERS, INVARIANTS, RELATIONS, ACTS_ON, LINKS and CONTEXT.
//   CARRIERS = { kind: parent|null }: the kinds of object an invariant can belong to (a curve is a variety).
//   INVARIANTS = [{ id, name, kind, carrier, definition, class }]: carrier is the kind of object that has it;
//     "operation" means a property of the step itself (linearity), which every step can have or lack.
//     class is the logical kind of property, which decides what composition may say about it: "state"
//     (holds of one object or state), "step" (holds of one step), "trace" (holds of one run's history),
//     "relational" (relates pairs of runs, as noninterference does) or "hyperproperty" (any other
//     property of sets of runs). The first three can be checked join by join; the last two cannot, and
//     compose.mjs reports them as needing a whole-chain check. Where not given, an invariant of an
//     operation is a step property and any other a state property, which covers the map so far.
//   RELATIONS = [{ from, to, kind, over?, receipts?, basis? }]: implies (from holding gives to) or equivalent
//     (both ways), with receipts (quotes in excerpts/) or a basis naming why it holds by definition. An
//     implication says what it relates: over "preservation" (preserving from preserves to, so composition
//     may carry claims along it) or over "state" (from holding in a state gives to in that state, which
//     composition must not carry: a step preserving from can still break to).
//   ACTS_ON = [{ entry, input: [kinds], output: [kinds], inputPhrase, outputPhrase }]: what an entry takes and
//     returns; each phrase (or each phrase in a list) must occur in the entry's input or output field.
//   LINKS = [{ entry, field, invariant, phrase | receipts, note? }]: field is preserved, broken or output
//     (the step produces the invariant, as a blow-up produces an exceptional divisor). A link is justified
//     either by a phrase in the entry's own field, or, where the entry is silent, by receipts (quotes in
//     excerpts/) with a note saying how they bear on the entry.
//   CONTEXT = [{ entry, raises?, clears?, forbids?, basis }]: context labels, for control flow. A step that
//     raises a label (it reads data from compartment W, say) marks everything after it in the chain, since
//     later steps may depend on that data through control flow as well as through values; the mark persists
//     until a step clears it (an explicit declassification). A step that forbids a label (an egress that W
//     must not reach) is a stated violation when the label is present on entry to it. basis says why.
//     Empty while the map has no systems domain; the mechanism is tested on synthetic chains.
//   Checked by scripts/mathmap.mjs; used by scripts/compose.mjs.
// Invariant: data only. The vocabulary is seeded from the fields that composites use and grows by use.
"use strict";

const CARRIERS = {
  variety: null, surface: "variety", curve: "variety",
  space: null, "point-cloud": null, "simplicial-set": "space",
  category: null, functor: null, topos: "category", level: null,
  field: null, function: "field", form: "field", evolution: null, connection: null, "vector-field": "form",
  operation: null, process: null,
  // D9, systems and effects (generated, MM-DR-001; mapfill/generated.js)
  "system-state": null,
  "execution-trace": null,
  "agent-program": null,
  "data-value": null,
  "signed-value": "data-value",
  "verified-signature": "signed-value",
  "capability": null,
  "key-handle": "capability",
  "task-handle": "capability",
  "policy-ticket": null,
  "handler": null,
  "compartment": null,
};

const I = (id, name, kind, carrier, definition, cls) => ({ id, name, kind, carrier, definition, class: cls || (carrier === "operation" ? "step" : "state") });
const INVARIANTS = [
  // Algebraic geometry
  I("birational-type", "Birational type", "equivalence class", "variety", "The class of a variety up to birational equivalence: isomorphism of dense open subsets."),
  I("function-field", "Function field", "algebraic object", "variety", "The field of rational functions of an irreducible variety, as an extension of the base field."),
  I("local-structure-at-center", "Local structure at the center", "local structure", "variety", "The germ of the space along the locus a surgery is performed on."),
  I("exceptional-divisor", "Presence of the exceptional divisor", "configuration", "variety", "Whether the divisor created by a blow-up is present as a curve (or divisor) in the space."),
  I("self-intersection", "Self-intersection number", "numerical", "curve", "The intersection number of a curve with itself on a surface, C^2."),
  I("curve-isomorphism-type", "Isomorphism type of a curve", "equivalence class", "curve", "The curve up to isomorphism, as an abstract curve."),
  // Topology
  I("homotopy-type", "Homotopy type", "equivalence class", "space", "The space up to homotopy equivalence."),
  I("contractibility", "Contractibility", "property", "space", "Being homotopy equivalent to a point."),
  I("topology-of-input", "Topology of the input", "structure", "space", "The input space's topology as given, before any collapse or gluing."),
  I("point-structure", "Point positions and distances", "structure", "point-cloud", "The positions of the input points and the distances between them."),
  // Category theory
  I("limits", "Limits", "structure", "functor", "Limits of diagrams (all small limits, where stated), preserved when a functor carries limit cones to limit cones."),
  I("finite-limits", "Finite limits", "structure", "functor", "Limits of finite diagrams: the terminal object, pullbacks, equalizers."),
  I("colimits", "Colimits", "structure", "functor", "Colimits of diagrams, preserved when a functor carries colimit cocones to colimit cocones."),
  I("category-structure", "Category structure", "structure", "category", "The objects and morphisms of a category with their composition."),
  I("truth-values", "Truth values", "structure", "topos", "The subobject classifier's elements: the internal truth values of a topos."),
  I("skeletal-objects", "Skeletal objects of a level", "modal class", "level", "The objects fixed by a level's skeleton modality (i-skeleta)."),
  I("level-opposition", "Opposition at a level", "modal relation", "level", "The distinction, at one level, between its skeleta and its sheaves."),
  // Analysis
  I("l2-orthogonality", "L^2 orthogonality", "analytic", "field", "Pieces of a decomposition are mutually orthogonal in the L^2 inner product."),
  I("cohomology", "Cohomology", "algebraic object", "form", "De Rham or singular cohomology groups."),
  I("function-by-resummation", "The function itself (by resummation)", "identity", "function", "The decomposed pieces sum back to the original function."),
  I("spatial-locality", "Spatial locality", "analytic", "field", "Support or concentration in physical space."),
  I("instantaneous-locality", "Instantaneous locality", "analytic", "evolution", "An effect at time t depends only on the source at time t."),
  I("linearity", "Linearity", "algebraic", "operation", "Superposition: the response to a sum is the sum of the responses."),
  I("causality", "Causality", "analytic", "evolution", "Only earlier times contribute to the state at a given time."),
  // Differential geometry
  I("leibniz-rule", "Leibniz rule", "algebraic", "operation", "The product rule for derivations."),
  I("tensoriality", "Tensoriality", "algebraic", "operation", "Linearity over smooth functions (C-infinity linearity) in an argument."),
  // Stochastic processes
  I("markov-property", "Markov property", "property", "process", "The future depends on the past only through the present state."),
  I("transition-law", "Transition law", "structure", "process", "The process's transition probabilities as given."),
  I("drift-from-threshold", "Drift away from the threshold", "analytic", "process", "A mean velocity away from an absorbing threshold: 1/x for Brownian motion conditioned to stay positive."),
  I("exponential-lifetime", "Exponential lifetime", "numerical", "process", "Mean lifetime growing exponentially in a depth (a barrier height over the noise)."),
  I("flatness", "Flatness", "geometric", "connection", "Vanishing curvature: covariant derivatives commute."),
  // D9, systems and effects: generated in MM-DR-001, definitions verbatim from the round's package; classes
  // as graded there (deterministic and timed noninterference are relational, probabilistic is a hyperproperty).
  I("e9-prov", "Complete modeled provenance", "metadata correctness", "data-value", "For datum v, a protected derivation DAG names every modeled data dependency and program-counter dependency that contributed to v; ingress roots are authenticated by the specified adapter. Completeness concerns the declared semantics, not unknown physical causes.", "state"),
  I("e9-orig", "Complete compartment-origin labels", "metadata correctness", "data-value", "For v, Origins(v) is the complete set of compartment and external-ingress identifiers at the roots of its modeled dependency DAG. Derivation unions roots and never rewrites historical origins.", "state"),
  I("e9-gfree", "Known absence of guest origin", "integrity input classification", "data-value", "Origins(v) is complete and intersects the policy GuestSet in the empty set. A missing or unknown origin is not a proof of this predicate. Endorsement does not change this historical fact.", "state"),
  I("e9-local", "Current explicit-payload locality", "confidentiality placement", "system-state", "For fixed boundary B and root compartment W, every live modeled digital copy of a W-derived payload is at a location in B. Ciphertexts retain origins. Previously transmitted or erased copies are not live, so this state predicate does not assert historical confinement.", "state"),
  I("e9-noegress", "No historical explicit egress", "confidentiality trace safety", "execution-trace", "For every event in the trace, no send/store/export of a payload whose complete origin set contains W targets a location outside B. Includes designated requests, logs and replicas, but excludes unmodeled timing/occurrence inference.", "trace"),
  I("e9-sig", "Valid signature on exact bound bytes", "cryptographic evidence predicate", "signed-value", "Verify(pk, Canon(descriptor), sig)=true for the exact immutable descriptor, pinned public key and declared verification algorithm. The descriptor binding is part of the predicate. This does not identify the current owner or establish permission, freshness, or factual truth.", "state"),
  I("e9-owner", "Every accepted merge has current owner approval", "integrity trace safety", "execution-trace", "Every successful merge event contains a verified signature by the owner key for that record at the commit linearization point, covering action, destination/record identity, proposed bytes or their collision-resistant digest, expected version and approval nonce. It satisfies the declared current authorization predicate at commit. Reuse control is separately E9-FRESH.", "trace"),
  I("e9-auth", "All modeled effects authorized", "authority trace safety", "execution-trace", "For every committed effect event e, Allow(Pi_at_commit, actor(e), target(e), action(e), cap(e), epoch(e)) is true. The fixed authorization predicate checks target binding, scope and live authority; possession of a label alone does not satisfy it.", "trace"),
  I("e9-atten", "Declared capability-rights attenuation", "authority step relation", "operation", "For this transition and the specified input/output capability pair, the output names the same permitted target region, no larger declared rights/bounds, and no longer lifetime than the input. Its rights set is a subset of the input rights set. This is not a statement about all ambient or transitive authority.", "step"),
  I("e9-revoke", "No use of a revoked capability generation", "authority trace safety", "execution-trace", "After successful revocation of tuple (root, generation), every subsequent attempt to commit an effect through that generation is denied. All aliases of that generation consult the shared protected revocation state. A newly authorized grant has a different generation. In-flight commits are ordered at explicit linearization points.", "trace"),
  I("e9-fresh", "No replay of an accepted approval", "integrity trace safety", "execution-trace", "No successful acceptance repeats a policy-defined approval identifier (issuer, scope, record/version, nonce), and each acceptance meets the modeled expiry rule. All verifiers share the relevant history or an equivalent serial version discipline. Fresh nonce generation alone does not imply this predicate.", "trace"),
  I("e9-audit", "Complete authenticated committed-effect log", "accountability trace safety", "execution-trace", "Each committed modeled effect has one corresponding protected append record binding actor, effect, relevant parameters and prior log head. Effect commit and log append are one modeled atomic transition or the effect is not committed. Authentication does not make logged statements true or harmless to disclose.", "trace"),
  I("e9-erase", "Absence of a designated secret in modeled recoverable storage", "erasure state predicate", "system-state", "At the current state, the complete declared inventory of recoverable digital copies, snapshots, backups and reconstructing key material for secret x is empty. This is a model-relative postcondition, not a physical disk, flash, forensic, recipient-memory or future-nonreintroduction guarantee.", "state"),
  I("e9-mediated", "Complete effect mediation", "enforcement trace safety", "execution-trace", "Every committed modeled effect crosses the designated trusted gate and commits using the same bound arguments and current policy epoch checked there. The gate cannot be bypassed through handlers, callbacks, retries or delegated tools. Correct mediation does not imply that the policy itself is correct.", "trace"),
  I("e9-cni", "Deterministic termination-insensitive confidentiality", "confidentiality noninterference", "agent-program", "For the declared deterministic model, observer and low-equivalence relation, any two runs from low-equivalent initial full states that both terminate have equal designated low observations at termination. Prior observations may be retained in the low state. Time and termination differences are excluded unless explicitly added.", "relational"),
  I("e9-ini", "Guest-input noninterference for trusted decisions", "integrity noninterference", "agent-program", "In the declared deterministic model, any two terminating runs agreeing on initial trusted inputs and differing only in guest/untrusted input have equal trusted action-decision observations. There is no endorsement exception unless a different policy is explicitly supplied. This states absence of influence, not just absence of guest bytes in code.", "relational"),
  I("e9-tni", "Confidentiality for timed and resource observations", "confidentiality noninterference", "agent-program", "For the same deterministic low-equivalence used by E9-CNI and an observation that includes its ordinary low outputs plus declared times, resource events and termination behavior, corresponding executions have identical full observer traces. The time/resource semantics and scheduler are explicitly part of the model.", "relational"),
  I("e9-ebnd", "Sound static effect upper bound", "static-to-step soundness relation", "operation", "For this instantiated expression, environment and handler semantics, every emitted modeled effect belongs to its certified effect upper bound epsilon. Hidden foreign effects, handler-introduced effects and all branch alternatives are included. An annotation without a conformance proof is not this predicate.", "step"),
  I("e9-pni", "Probabilistic noninterference of joint observations", "probabilistic confidentiality", "agent-program", "For fixed low inputs, declared scheduler/adversary class, probability model and any two secret inputs, the distributions of the complete joint low observation history are identical. Equality of the distribution of each release separately is insufficient. This is exact probabilistic secrecy, not computational indistinguishability.", "hyperproperty"),
];

// What each linked entry takes and returns, in carrier kinds, with the phrase from its input and output fields.
const A = (entry, input, output, inputPhrase, outputPhrase) => ({ entry, input, output, inputPhrase, outputPhrase });
const ACTS_ON = [
  A("D2-117", ["variety"], ["variety"], "Variety X", "Bl_Z(X)"),
  A("D2-118", ["variety"], ["variety"], "Variety X", "Y with E collapsed"),
  A("D2-X01", ["surface", "curve"], ["curve"], "Surface X, curve C", "Strict transform C'"),
  A("D4-048", ["point-cloud"], ["simplicial-set"], "Point cloud", "Cech complex"),
  A("D4-264", ["category"], ["simplicial-set"], "Small category", "Simplicial set"),
  A("D4-X01", ["simplicial-set"], ["category"], "Simplicial complex K", "as a small category"),
  A("D4-075", ["space"], ["space"], "Topological space", "Cone CX"),
  A("D7-068", ["category"], ["functor"], "Category C", "Reflector L"),
  A("D7-288", ["topos"], ["topos"], "Topos E", "Subtopos"),
  A("D7-284", ["functor"], ["functor"], "Geometric morphism", "Triple"),
  A("D7-X01", ["level"], ["level"], "a level i", "The least level j"),
  A("D7-X02", ["topos"], ["functor"], "Subtopos", "Geometric embedding"),
  A("D7-X03", ["functor"], ["level"], "Essential geometric embedding", "Level (essential subtopos)"),
  A("D6-X01", ["function", "field"], ["function", "field"], ["Function f", "a field on a domain"], "Band pieces"),
  A("D4-176", ["form"], ["form"], "k-forms", "Orthogonal decomposition"),
  A("D6-X02", ["evolution", "field"], ["field"], ["Linear evolution operator", "source f(s)"], "The solution u(t)"),
  A("D4-086", ["vector-field", "connection"], ["vector-field"], "Vector fields", "Covariant derivative"),
  A("D5-X02", ["process"], ["function"], "Brownian motion", "Distribution of the first hitting time"),
  A("D5-037", ["process", "function"], ["process"], ["Markov process", "harmonic h"], "h-transformed process"),
  A("D5-X01", ["process"], ["function"], "One-dimensional potential with a well and a barrier", "Escape rate k"),
];

const RELATIONS = [
  { from: "birational-type", to: "function-field", kind: "equivalent",
    receipts: [{ file: "excerpts/wikipedia-birational-geometry.txt", quote: "are birational if and only if their [[Function field of an algebraic variety|function fields]] are isomorphic" }] },
  { from: "limits", to: "finite-limits", kind: "implies", over: "preservation", basis: "By definition: a finite limit is a limit, so a functor preserving all limits preserves the finite ones." },
  { from: "e9-prov", to: "e9-orig", kind: "implies", over: "state", basis: "Generated (MM-DR-001): Q3 definitions: extract the authenticated root identifiers from the complete protected dependency DAG. Same datum and same ingress/compartment model required." },
  { from: "e9-gfree", to: "e9-orig", kind: "implies", over: "state", basis: "Generated (MM-DR-001): Q3 definition of guest-free explicitly includes completeness of Origins(v). Same datum and GuestSet required." },
  { from: "e9-tni", to: "e9-cni", kind: "implies", over: "state", basis: "Generated (MM-DR-001): Q4 C3: equality of the full timed observation implies equality of its ordinary-output projection, when the model, initial low-equivalence and observers are aligned." },
];

const L = (entry, field, invariant, phrase) => ({ entry, field, invariant, phrase });
const LINKS = [
  L("D2-117", "preserved", "birational-type", "Birational type"), L("D2-117", "preserved", "function-field", "function field"),
  L("D2-117", "broken", "local-structure-at-center", "Local structure at Z"), L("D2-117", "output", "exceptional-divisor", "with exceptional divisor"),
  L("D2-118", "preserved", "birational-type", "Birational type"), L("D2-118", "broken", "exceptional-divisor", "Exceptional divisor"),
  L("D2-X01", "preserved", "curve-isomorphism-type", "C' is isomorphic to C"), L("D2-X01", "broken", "self-intersection", "Self-intersection"),
  L("D4-048", "preserved", "homotopy-type", "Homotopy type"), L("D4-048", "broken", "point-structure", "Positions and distances"),
  L("D4-264", "preserved", "category-structure", "Category structure"),
  L("D4-X01", "preserved", "homotopy-type", "Homotopy type"), L("D4-X01", "output", "category-structure", "as a small category"),
  L("D4-075", "output", "contractibility", "contractible"), L("D4-075", "preserved", "topology-of-input", "embedded as the base"),
  L("D4-075", "broken", "homotopy-type", "The homotopy type of X"),
  L("D7-068", "preserved", "limits", "Limits in R"),
  L("D7-284", "preserved", "colimits", "Colimits"), L("D7-284", "preserved", "limits", "limits under f^*"),
  L("D7-288", "preserved", "finite-limits", "Finite limits"), L("D7-288", "broken", "truth-values", "Truth values collapsed by j"),
  L("D7-X01", "preserved", "skeletal-objects", "i-skeleta survive as j-sheaves"), L("D7-X01", "broken", "level-opposition", "The opposition at level i"),
  L("D6-X01", "preserved", "function-by-resummation", "the pieces sum to it"), L("D6-X01", "preserved", "l2-orthogonality", "in L^2 the pieces are orthogonal"),
  L("D6-X01", "broken", "spatial-locality", "Spatial locality"),
  L("D4-176", "preserved", "cohomology", "Cohomology"), L("D4-176", "preserved", "l2-orthogonality", "L^2 orthogonality"),
  L("D6-X02", "preserved", "linearity", "Linearity"), L("D6-X02", "preserved", "causality", "causality"),
  L("D6-X02", "broken", "instantaneous-locality", "Instantaneous locality"),
  L("D4-086", "preserved", "leibniz-rule", "Leibniz rule"), L("D4-086", "preserved", "tensoriality", "tensoriality"),
  L("D4-086", "broken", "flatness", "Flat derivative"),
  L("D5-X02", "broken", "exponential-lifetime", "any exponential dependence on distance"),
  L("D5-X01", "preserved", "exponential-lifetime", "The exponential dependence on barrier height over noise"),
  L("D5-037", "preserved", "markov-property", "Markov property"), L("D5-037", "broken", "transition-law", "Unconditioned transitions"),
  L("D7-X02", "preserved", "limits", "Limits (the inclusion is a right adjoint)"), L("D7-X02", "broken", "colimits", "Colimits"),
  L("D7-X03", "preserved", "limits", "The adjoint triple"), L("D7-X03", "preserved", "colimits", "The adjoint triple"),
  L("D7-X03", "output", "skeletal-objects", "modalities: skeleton left of sheaf"), L("D7-X03", "output", "level-opposition", "skeleton left of sheaf"),
  // Links where the entry's own field is silent, justified by receipts.
  { entry: "D2-X01", field: "preserved", invariant: "birational-type", note: "The strict transform maps to the curve isomorphically away from the blown-up point, so the two curves are birational.",
    receipts: [{ file: "excerpts/wikipedia-resolution-of-singularities.txt", quote: "is an isomorphism away from the singular points" }] },
  { entry: "D6-X01", field: "preserved", invariant: "linearity", note: "Each band piece is a Fourier multiplier applied to f, hence linear in f.",
    receipts: [{ file: "excerpts/wikipedia-littlewood-paley-multiplier.txt", quote: "\\hat f_\\rho := \\chi_\\rho\\hat f" }] },
  { entry: "D4-176", field: "preserved", invariant: "linearity", note: "The decomposition is given by orthogonal projections, which are linear.",
    receipts: [{ file: "excerpts/wikipedia-hodge-projection.txt", quote: "be the orthogonal projection" }] },
  { entry: "D7-284", field: "output", invariant: "skeletal-objects", note: "An essential inclusion's adjoint triple yields the skeleton modality, whose fixed objects are the level's skeleta.",
    receipts: [{ file: "excerpts/nlab-aufhebung-modalities.txt", quote: "yields two [[adjoint modalities]]" }] },
  { entry: "D5-037", field: "output", invariant: "drift-from-threshold", note: "With h(x) = x, harmonic for Brownian motion killed at 0, the transform is Brownian motion conditioned to stay positive, a Bessel-3 process with drift 1/x (the SDE at n = 3).",
    receipts: [{ file: "excerpts/arxiv-2103.12179.txt", quote: "[0,∞), using the harmonic function h(x) =x." }, { file: "excerpts/wikipedia-bessel-process.txt", quote: "dX_t = dW_t + \\frac{n-1}{2}\\frac{dt}{X_t}" }] },
];

const CONTEXT = [];

module.exports = { CARRIERS, INVARIANTS, RELATIONS, ACTS_ON, LINKS, CONTEXT };
