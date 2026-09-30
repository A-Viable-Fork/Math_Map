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
  D("AntitoneGC", "The corrected D1-099: antitone maps with a ≤ g(f(a)) and b ≤ f(g(b)).",
    Q("excerpts/wikipedia-galois-connection.txt", "=== Antitone Galois connection ==="),
    Q("excerpts/wikipedia-galois-connection.txt", "{{math|''a'' ≤ ''GF''(''a'')}} for all {{mvar|a}} in {{mvar|A}} and {{math|''b'' ≤ ''FG''(''b'')}} for all {{mvar|b}} in {{mvar|B}}.")),
  D("LandedGC", "D1-099 as landed, for the counterexample: antitone maps with a ≤ g(f(a)) and f(g(b)) ≤ b.",
    Q("source/math_map.md", "A pair of order-reversing (antitone) maps f: P -> Q, g: Q -> P satisfying: a ≤ g(f(a)) and f(g(b)) ≤ b for all a in P, b in Q.")),
];

const CLAIMS = [
  // The categorical chain.
  C("D7-X02", "preserved", "Subtopos.inclusion_preservesLimits", "exact", "The inclusion of a subtopos preserves limits.", { invariant: "limits" }),
  C("D7-X02", "output", "Subtopos.embedding", "exact", "The inclusion is a geometric morphism with the reflector as inverse image.", { whole: true }),
  C("D7-X02", "output", "Subtopos.embedding_direct_full_faithful", "exact", "Its direct image is fully faithful: a geometric embedding.", { whole: true }),
  C("D7-284", "preserved", "EssentialGeometricMorphism.inverse_preservesLimits", "exact", "f^* preserves limits.", { invariant: "limits", whole: true }),
  C("D7-284", "preserved", "EssentialGeometricMorphism.inverse_preservesColimits", "exact", "f^* preserves colimits.", { invariant: "colimits", whole: true }),
  C("D7-X03", "input", "Level.essential", "exact", "The inclusion of a level is an essential geometric morphism: the entry's input kind.", { whole: true }),
  C("D7-X03", "preserved", "Level.reflector_preservesLimits", "exact", "The middle functor i^* of the triple preserves limits.", { invariant: "limits" }),
  C("D7-X03", "preserved", "Level.reflector_preservesColimits", "exact", "The middle functor i^* preserves colimits.", { invariant: "colimits" }),
  C("D7-X03", "output", "Level.skeletonSheafAdj", "exact", "The level carries the adjoint modalities skeleton ⊣ sheaf: the opposition at the level.", { invariant: "level-opposition", whole: true }),
  C("D7-X03", "output", "Level.skeleton", "exact", "The skeleton modality, whose fixed objects are the level's skeleta.", { invariant: "skeletal-objects" }),
  C("D7-X01", "preserved", "Level.IsAufhebung.skeleta_are_sheaves", "exact", "i-skeleta survive as j-sheaves: the entry's field, true by the nLab's definition.", { invariant: "skeletal-objects", whole: true }),
  C("D7-X01", "preserved", "Level.IsAufhebung.sheaves_are_sheaves", "exact", "i-sheaves survive as j-sheaves: the Aufhebung lies above i.", { whole: true }),
  C("D7-X01", "output", "Level.IsAufhebung.unique", "exact", "The least resolving level, when it exists, is unique up to having the same sheaves.", { whole: true }),
  // D1-099.
  C("D1-099", "description", "antitoneGC_iff", "exact", "The corrected definition is equivalent to b ≤ f(a) iff a ≤ g(b)."),
  C("D1-099", "output", "antitoneGC_iff_galoisConnection", "exact", "An antitone Galois connection is exactly a Galois connection in Mathlib's sense into the order dual: an adjunction.", { whole: true }),
  C("D1-099", "preserved", "AntitoneGC.closureGF", "exact", "g∘f is a closure operator (Mathlib's ClosureOperator)."),
  C("D1-099", "preserved", "AntitoneGC.closureFG", "exact", "f∘g is a closure operator. The fixed-point correspondence is not yet proved."),
  C("D1-099", "description", "landedGC_neither", "refutes-landed", "The landed definition admits (not, const true) on Bool, a Galois connection in neither convention: why the field was corrected."),
];

module.exports = { DEFS, CLAIMS };
