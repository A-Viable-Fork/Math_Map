// Role: the Lean layer's registry. Names the definitions in lean/MathMap/ with the sources they follow, and
//   the Lean declarations that state or prove an entry's claims.
// Contract: exports DEFS = [{ decl, note, receipts: [{ file, quote }] }] and CLAIMS = [{ entry, field, decl,
//   match, note, invariant?, whole? }]. decl is a full Lean name under MathMap. A definition's receipts are
//   verbatim quotes in excerpts/ or source/ showing the definition follows its source; every MathMap
//   definition a claim's statement depends on (as `#mathmap_deps` reports) must be in DEFS or be a claim.
//   match grades how the Lean statement bears on the entry's claim: exact, general, special, or
//   refutes-landed (it refutes the landed text of a field that has since been corrected). whole marks the
//   claims that together state the whole field; invariant names the named-invariant claim it proves.
//   Whether a claim is proved or only stated is not written here: scripts/lean.mjs reads it from Lean
//   (`#print axioms`: sorryAx means stated) into lean/AUDIT.json.
// Invariant: data only. A proof checks the Lean statement; the match grade and the definitions' receipts
//   carry the judgment that the statement is the entry's claim.
"use strict";

const Q = (file, quote) => ({ file, quote });
const D = (decl, note, ...receipts) => ({ decl: `MathMap.${decl}`, note, receipts });
const C = (entry, field, decl, match, note, opts = {}) => ({ entry, field, decl: `MathMap.${decl}`, match, note, ...opts });
const GM = "excerpts/nlab-geometric-morphism.txt", AUF = "excerpts/nlab-aufhebung-definition.txt";

const DEFS = [
  D("GeometricMorphism", "The nLab's definition: an adjoint pair f^* ⊣ f_* with f^* left exact. Stated for categories, not only toposes.",
    Q(GM, "consists of a pair of [[adjoint functors]] $(f^*,f_*)$"), Q(GM, "is [[exact functor|left exact]] in that it preserves finite [[limits]].")),
  D("EssentialGeometricMorphism", "A geometric morphism whose inverse image has a further left adjoint f_!.",
    Q("excerpts/nlab-essential-geometric-morphism.txt", "has not only the [[right adjoint]] $f_*$, but also a [[left adjoint]] $f_!$"),
    Q(GM, "has also a [[left adjoint]] $f_! : E \\to F$, then $f$ is an [[essential geometric morphism]].")),
  D("Subtopos", "A full reflective subcategory with a left exact reflector: the nLab's exact reflective embedding, a geometric embedding between toposes. Every subtopos (the sheaves for a Lawvere-Tierney topology) is one.",
    Q("excerpts/nlab-reflective-subcategory.txt", "in addition preserves [[finite limits]], then the embedding is called _exact_. If the categories are [[topos]]es then such embeddings are called [[geometric embedding]]s."),
    Q("excerpts/nlab-lawvere-tierney.txt", "the embedding is a [[full and faithful functor]] which has a [[exact functor|left exact]] [[left adjoint]] functor")),
  D("Level", "A level is an essential subtopos: a subtopos whose reflector i^* has a further left adjoint i_!, giving the adjoint triple i_! ⊣ i^* ⊣ i_*.",
    Q("excerpts/nlab-level-of-a-topos.txt", "an [[essential subtopos]]  $\\mathbf{H}_l \\hookrightarrow \\mathbf{H}$ is called a _level_ of $\\mathbf{H}$."),
    Q("excerpts/nlab-aufhebung-modalities.txt", "An [[adjoint triple]] $i_!\\dashv i^*\\dashv i_*$")),
  D("Level.skeleton", "The skeleton modality □_i = i_! i^*.", Q("excerpts/nlab-aufhebung-modalities.txt", "namely $\\Box _i \\coloneqq i_!i^*$")),
  D("Level.sheaf", "The sheaf modality ○_i = i_* i^*.", Q("excerpts/nlab-aufhebung-modalities.txt", "and $\\bigcirc _i \\coloneqq i_*i^*$")),
  D("Level.IsSheaf", "i-sheaves are the objects the sheaf modality fixes up to isomorphism.", Q(AUF, "* the _i-sheaves_ : $X\\in\\mathcal{B}$ with $\\bigcirc _i X\\simeq X$")),
  D("Level.IsSkeleton", "i-skeleta are the objects the skeleton modality fixes up to isomorphism.", Q(AUF, "* the _i-skeleta_ : $X\\in\\mathcal{B}$ with $\\Box _i X\\simeq X$")),
  D("Level.Prec", "i ≺ j: every i-sheaf is a j-sheaf and every i-skeleton a j-skeleton.",
    Q(AUF, "when every i-sheaf ($\\bigcirc_i$-[[modal type]]) is also a j-sheaf and every i-skeleton ($\\Box_i$-[[modal type]]) is a j-skeleton.")),
  D("Level.Resolves", "i ≪ j: i ≺ j and ○_j □_i = □_i, which the nLab reads as every i-skeleton being a j-sheaf.",
    Q(AUF, "Let $i\\prec j$, we say that the level $j$ _resolves the opposite_ of level $i$, written"), Q(AUF, "if $\\bigcirc _j\\Box_i=\\Box _i$."),
    Q("excerpts/nlab-aufhebung.txt", "The condition $\\bigcirc_j \\Box_i=\\Box_i$ amounts to saying that every $i$-skeleton is a $j$-sheaf")),
  D("Level.Below", "The order between levels by subtopos inclusion: every j-sheaf is a k-sheaf.", Q(AUF, "in the order relation (by subtopos inclusion) between levels.")),
  D("Level.IsAufhebung", "The least level resolving i: i ≪ j, and j ≤ k whenever i ≪ k.",
    Q(AUF, "iff $i\\ll\\bar{i}$ and for any $k$ with $i\\ll k$ then it holds that $\\bar{i}\\leq k$")),
  D("coneSetoid", "The identification of the cone: points of the cylinder X × I are identified when both lie on the top X × {1}.",
    Q("source/math_map.md", "CX = X × [0,1] / (X × {1})"), Q("excerpts/wikipedia-cone-topology.txt", "and then collapsing one of its end faces to a point.")),
  D("Cone", "The cone as the landed formula gives it: the quotient of the cylinder by the top. For nonempty X it agrees with the source's definition (attach the cylinder to a point).",
    Q("source/math_map.md", "CX = X × [0,1] / (X × {1})"), Q("excerpts/wikipedia-cone-topology.txt", "is intuitively obtained by stretching ''X'' into a [[Cylinder (geometry)|cylinder]]")),
  D("instTopologicalSpaceCone", "The cone carries the quotient topology.", Q("source/math_map.md", "CX = X × [0,1] / (X × {1})")),
  D("Cone.mk", "The quotient map from the cylinder to the cone.", Q("source/math_map.md", "CX = X × [0,1] / (X × {1})")),
  D("Cone.base", "The base of the cone: x ↦ [x, 0], the end of the cylinder that is not collapsed.",
    Q("excerpts/wikipedia-cone-topology.txt", "[[Embedding|embeds]] a space as a [[subspace (topology)|subspace]] of a contractible space.")),
  D("LTTopology", "The nLab's definition read in a meet-semilattice of truth values: a closure operator that is a left exact idempotent monad, that is an inflationary, idempotent, meet-preserving map (Mathlib's Nucleus). External truth values, as for the frame of opens of a space; the internal version in an arbitrary topos is not formalized.",
    Q("excerpts/nlab-lawvere-tierney-definition.txt", "a [[closure operator]] given by a [[exact functor|left exact]] [[idempotent monad]] on the internal meet-[[semilattice]] $\\Omega$."),
    Q("excerpts/nlab-lawvere-tierney-definition.txt", "1. $j true = true$, equivalently $\\id_\\Omega \\leq j: \\Omega \\to \\Omega$"),
    Q("excerpts/nlab-lawvere-tierney-definition.txt", "1. $j j = j$")),
  D("internalAnd", "The internal meet on the subobject classifier, built as the classifying map of <true, true> : 1 -> Omega x Omega; internalAnd_classifies proves it is the nLab's internal intersection map (it classifies the pullback of two subobjects), which by Yoneda determines it.",
    Q("excerpts/nlab-subobject-classifier-meet.txt", "natural in $X$; by the [[Yoneda lemma]], we infer the presence of an internal intersection map"),
    Q("excerpts/nlab-subobject-classifier-meet.txt", "each subobject poset $Sub(X)$ has intersections (gotten as pullbacks or [[fiber products]] of pairs of monics")),
  D("truthPair_mono", "<true, true> is mono (its domain is terminal), so it has a classifying map.",
    Q("excerpts/nlab-subobject-classifier-meet.txt", "making $\\Omega$ an internal [[meet-semilattice]].")),
  D("LawvereTierney", "The nLab's definition, internally: j : Omega -> Omega with j true = true, j j = j and j after meet = meet after (j x j). Stated in any category with a subobject classifier and binary products.",
    Q("excerpts/nlab-lawvere-tierney-definition.txt", "1. $j true = true$, equivalently $\\id_\\Omega \\leq j: \\Omega \\to \\Omega$"),
    Q("excerpts/nlab-lawvere-tierney-definition.txt", "1. $j j = j$"),
    Q("excerpts/nlab-lawvere-tierney-meet.txt", "1. $j \\circ \\wedge = \\wedge \\circ (j \\times j)$"),
    Q("excerpts/nlab-lawvere-tierney-meet.txt", "and $\\wedge: \\Omega \\times \\Omega \\to \\Omega$ is the internal [[meet]].")),
  D("LawvereTierney.Ωj", "The surviving truth values: the j-fixed (closed) truth values, the equalizer of j and the identity.",
    Q("excerpts/nlab-closure-operator.txt", "The elements of the poset that are fixed by the closure operator are called _closed_")),
  D("LawvereTierney.incl", "The inclusion of the j-fixed truth values.",
    Q("excerpts/nlab-closure-operator.txt", "The elements of the poset that are fixed by the closure operator are called _closed_")),
  D("LawvereTierney.close", "j corestricted to its fixed truth values: the collapse onto the closed ones.",
    Q("excerpts/nlab-closure-operator.txt", "The elements of the poset that are fixed by the closure operator are called _closed_")),
  D("bmGenerator", "The generator of standard Brownian motion on the line, f to f''/2.",
    Q("excerpts/wikipedia-wiener-generator.txt", "whose generator is <math>A=\\frac{1}{2}\\Delta</math>")),
  D("hTransformGenerator", "The generator of an h-transformed process: A^h f = (1/h) A (h f).",
    Q("excerpts/wikipedia-doob-h-transform.txt", "&=\\frac{1}{h(x)}A(fh)(x)")),
  D("OpenGame", "An open game (Ghani, Hedges, Winschel and Zahn, Definition 3): strategy profiles, play, coplay, and a best response relation relative to a context.",
    Q("excerpts/arxiv-1603.04641.txt", "• BG : X × (Y → R) → Rel(ΣG) is called the best response"),
    Q("excerpts/arxiv-1603.04641.txt", "Possibly the most important part of the deﬁnition is the best\nresponse relation, which is deﬁned relative to an arbitrary context")),
  D("OpenGame.tensor", "The monoidal product (Definition 12): each component's best response is taken in a context that fixes the other component's play.",
    Q("excerpts/arxiv-1603.04641.txt", "We deﬁne an open game G1 ⊗ G2 : (X1 ×\nX2, S1 × S2) → (Y1 × Y2, R1 × R2) as follows:"),
    Q("excerpts/arxiv-1603.04641.txt", "k1(y1) = π1(k(y1, PG2 (σ2, x2)))\nk2(y2) = π2(k(PG1 (σ1, x1), y2))")),
  D("decision", "A utility-maximising decision (Definition 4): a best response chooses a maximum of the continuation.",
    Q("excerpts/arxiv-1603.04641.txt", "• (σ, σ′) ∈ BD(x, k) iff σ′(x) ∈ arg max k")),
  D("Environment", "Each agent's weak preference over outcomes at each state (a preference profile per state).",
    Q("excerpts/wikipedia-maskin-monotonicity.txt", "Each voter reports his entire [[preference (economics)|preference relation]] over the set of alternatives.")),
  D("Mechanism", "Message spaces and an outcome function: the institution whose equilibrium outcomes implement a correspondence.",
    Q("excerpts/wikipedia-implementation-theory.txt", "whose equilibrium outcomes implement a given set of [[normative]] goals or [[Welfare economics|welfare]] criteria")),
  D("Mechanism.IsNash", "A message profile from which no agent does better by changing only its own message.",
    Q("excerpts/wikipedia-nash-equilibrium.txt", "no player can do better by unilaterally changing their strategy.")),
  D("Mechanism.Implements", "Full implementation: at every state the Nash equilibrium outcomes are exactly the chosen outcomes.",
    Q("excerpts/wikipedia-implementation-theory.txt", "whose equilibrium outcomes implement a given set of [[normative]] goals or [[Welfare economics|welfare]] criteria"),
    Q("excerpts/wikipedia-maskin-monotonicity.txt", "A ''social choice rule'' maps the preference profile to the selected alternative.")),
  D("MaskinMonotonic", "An outcome chosen at one state stays chosen at any state where, for every agent, it is still at least as good as everything it was at least as good as.",
    Q("excerpts/wikipedia-maskin-monotonicity.txt", "such that the position of <math>A_1</math> relative to each of the other alternatives either improves or stays the same as in <math>P_1</math>."),
    Q("excerpts/wikipedia-maskin-monotonicity.txt", "With Maskin monotonicity, <math>A_1</math> should still be chosen at <math>P_2</math>.")),
  D("AntitoneGC", "The corrected D1-099: antitone maps with a ≤ g(f(a)) and b ≤ f(g(b)).",
    Q("excerpts/wikipedia-galois-connection.txt", "=== Antitone Galois connection ==="),
    Q("excerpts/wikipedia-galois-connection.txt", "{{math|''a'' ≤ ''GF''(''a'')}} for all {{mvar|a}} in {{mvar|A}} and {{math|''b'' ≤ ''FG''(''b'')}} for all {{mvar|b}} in {{mvar|B}}.")),
  D("LandedGC", "D1-099 as landed, for the counterexample: antitone maps with a ≤ g(f(a)) and f(g(b)) ≤ b.",
    Q("source/math_map.md", "A pair of order-reversing (antitone) maps f: P -> Q, g: Q -> P satisfying: a ≤ g(f(a)) and f(g(b)) ≤ b for all a in P, b in Q.")),
];

const CLAIMS = [
  // The categorical chain.
  C("D7-X02", "preserved", "Subtopos.inclusion_preservesLimits", "exact", "The inclusion of a subtopos preserves limits.", { invariant: "limits" }),
  C("D7-X02", "broken", "Subtopos.inclusion_not_preservesColimits", "exact", "The inclusion need not preserve colimits: in the degenerate subtopos of Type it does not preserve the initial object.", { invariant: "colimits", whole: true }),
  C("D7-X02", "output", "Subtopos.embedding", "exact", "The inclusion is a geometric morphism with the reflector as inverse image.", { whole: true }),
  C("D7-X02", "output", "Subtopos.embedding_direct_full_faithful", "exact", "Its direct image is fully faithful: a geometric embedding.", { whole: true }),
  C("D7-284", "preserved", "EssentialGeometricMorphism.inverse_preservesLimits", "exact", "f^* preserves limits.", { invariant: "limits", whole: true }),
  C("D7-284", "preserved", "EssentialGeometricMorphism.inverse_preservesColimits", "exact", "f^* preserves colimits.", { invariant: "colimits", whole: true }),
  C("D7-284", "input", "EssentialGeometricMorphism.geometric", "exact", "The input is a geometric morphism; the essential one extends it.", { whole: true }),
  C("D7-284", "output", "EssentialGeometricMorphism.triple", "exact", "An essential geometric morphism is the adjoint triple f_! ⊣ f^* ⊣ f_*: the entry's output.", { whole: true }),
  C("D7-284", "output", "EssentialGeometricMorphism.skeleton_idempotent", "exact", "For an essential inclusion (f_* fully faithful, as the chain's D7-X02 step supplies) the skeleton f_! f^* is idempotent: a modality.", { invariant: "skeletal-objects" }),
  C("D7-284", "output", "EssentialGeometricMorphism.isSkeleton_iff", "exact", "For an essential inclusion the objects the skeleton modality fixes are exactly the image of f_!: the skeleta.", { invariant: "skeletal-objects" }),
  C("D7-284", "output", "EssentialGeometricMorphism.modalities", "general", "Any essential geometric morphism carries the adjoint pair f_! f^* ⊣ f_* f^*; the pair is idempotent, a level's skeleton and sheaf modalities, when the morphism is an embedding (Level.skeletonSheafAdj). General, so it does not by itself make the step's claim formal.", { invariant: "skeletal-objects" }),
  C("D7-X03", "input", "Level.essential", "exact", "The inclusion of a level is an essential geometric morphism: the entry's input kind.", { whole: true }),
  C("D7-X03", "preserved", "Level.reflector_preservesLimits", "exact", "The middle functor i^* of the triple preserves limits.", { invariant: "limits" }),
  C("D7-X03", "preserved", "Level.reflector_preservesColimits", "exact", "The middle functor i^* preserves colimits.", { invariant: "colimits" }),
  C("D7-X03", "output", "Level.skeletonSheafAdj", "exact", "The level carries the adjoint modalities skeleton ⊣ sheaf: the opposition at the level.", { invariant: "level-opposition", whole: true }),
  C("D7-X03", "output", "Level.skeleton", "exact", "The skeleton modality, whose fixed objects are the level's skeleta.", { invariant: "skeletal-objects" }),
  C("D7-X01", "preserved", "Level.IsAufhebung.skeleta_are_sheaves", "exact", "i-skeleta survive as j-sheaves: the entry's field, true by the nLab's definition.", { invariant: "skeletal-objects", whole: true }),
  C("D7-X01", "preserved", "Level.IsAufhebung.sheaves_are_sheaves", "exact", "i-sheaves survive as j-sheaves: the Aufhebung lies above i.", { whole: true }),
  C("D7-X01", "broken", "Level.IsAufhebung.opposition_resolved", "exact", "Both sides of the opposition at level i, its skeleta and its sheaves, become j-sheaves. The step sizes the field also gives (n to n+1, 2n-1, 2n) are not formalized.", { invariant: "level-opposition" }),
  C("D7-X01", "input", "Level.below_preorder", "exact", "The levels ordered by subtopos inclusion form a preorder, the order the Aufhebung is least in.", { whole: true }),
  C("D7-X01", "output", "Level.IsAufhebung.unique", "exact", "The least resolving level, when it exists, is unique up to having the same sheaves.", { whole: true }),
  // D7-288, internally: in any category with a subobject classifier and the finite limits used (so in any topos).
  C("D7-288", "broken", "LawvereTierney.mono_close_iff", "exact", "The retraction of Omega onto the j-fixed truth values identifies truth values (is not mono) unless j is the identity: the collapse the entry names, stated internally.", { invariant: "truth-values", whole: true }),
  C("D7-288", "broken", "LawvereTierney.incl_close", "exact", "Omega retracts onto the surviving truth values."),
  C("D7-288", "description", "internalAnd_classifies", "special", "The meet j must preserve is the internal intersection map; the description's other clauses (closure on subobjects, the subtopos) are not formalized."),
  // D7-288, read in external truth values (special: truth values given as a meet-semilattice).
  C("D7-288", "description", "LTTopology.axioms", "special", "j is inflationary, idempotent and meet-preserving: the entry's description, for truth values given as a meet-semilattice."),
  C("D7-288", "broken", "LTTopology.injective_iff_eq_bot", "special", "j identifies truth values unless it is the trivial topology: the collapse the entry names.", { invariant: "truth-values" }),
  C("D7-288", "broken", "LTTopology.mem_range_iff", "special", "The truth values that survive are the fixed points of j."),
  C("D7-288", "broken", "LTTopology.frameOfTruthValues", "special", "The surviving truth values again form a frame."),
  C("D7-288", "broken", "LTTopology.retract", "special", "The truth values retract onto the surviving ones (a Galois insertion)."),
  // D5-037.
  C("D5-037", "output", "hTransform_bm_id", "exact", "The h-transform of Brownian motion with h(x) = x has generator f''/2 + f'/x: drift 1/x away from the threshold, the Bessel-3 generator.", { invariant: "drift-from-threshold" }),
  // D7-X04.
  C("D7-X04", "preserved", "OpenGame.tensor_best_separable", "exact", "With a separable continuation, the product's best responses are exactly pairs of component best responses in contexts that do not mention the other component.", { whole: true }),
  C("D7-X04", "broken", "tensor_context_dependent", "exact", "With a coordination continuation, the same player-1 strategy is a best response beside one partner strategy and not beside another.", { whole: true }),
  C("D7-X04", "preserved", "OpenGame.tensor_best_of_dominant", "special", "A component whose strategy is a best response against every partner strategy stays verified in the product, with no separability assumption: dominance is the other route to verification that composes."),
  // D7-X05.
  C("D7-X05", "preserved", "Mechanism.maskinMonotonic_of_implements", "exact", "Maskin's necessity theorem: any correspondence implemented in Nash equilibrium is Maskin monotonic.", { whole: true }),
  // D4-075.
  C("D4-075", "output", "Cone.contractible", "exact", "The cone on a nonempty space is contractible (for empty X the landed formula gives the empty space: conditions.js).", { invariant: "contractibility", whole: true }),
  C("D4-075", "preserved", "Cone.isEmbedding_base", "exact", "X embeds in its cone as the base.", { invariant: "topology-of-input", whole: true }),
  C("D4-075", "broken", "Cone.homotopyEquiv_iff", "exact", "The cone keeps X's homotopy type exactly when X is already contractible.", { invariant: "homotopy-type", whole: true }),
  C("D4-075", "broken", "Cone.not_homotopyEquiv_bool", "special", "The instance: the cone on two points is not homotopy equivalent to them."),
  // D2-168.
  C("D2-168", "broken", "stoneCech_separableSpace", "refutes-landed", "The Stone-Cech compactification of a separable space is separable: the landed text lists separability as broken."),
  C("D4-373", "broken", "stoneCech_separableSpace", "refutes-landed", "The same theorem refutes D4-373's landed broken field, which repeats D2-168's error."),
  // D1-099.
  C("D1-099", "description", "antitoneGC_iff", "exact", "The corrected definition is equivalent to b ≤ f(a) iff a ≤ g(b)."),
  C("D1-099", "output", "antitoneGC_iff_galoisConnection", "exact", "An antitone Galois connection is exactly a Galois connection in Mathlib's sense into the order dual: an adjunction.", { whole: true }),
  C("D1-099", "preserved", "AntitoneGC.closureGF", "exact", "g∘f is a closure operator (Mathlib's ClosureOperator)."),
  C("D1-099", "preserved", "AntitoneGC.closureFG", "exact", "f∘g is a closure operator. The fixed-point correspondence is not yet proved."),
  C("D1-099", "description", "landedGC_neither", "refutes-landed", "The landed definition admits (not, const true) on Bool, a Galois connection in neither convention: why the field was corrected."),
];

module.exports = { DEFS, CLAIMS };
