// Role: the fill review. Field-by-field grades of the authored fills (origin fill, tier authored) against
//   sources, in batches of 25: the D7 name-only stubs in id order, then the missing homes of mapfill/homes.js
//   (one grade per home, on its first entry, covering every entry that carries it).
// Contract: exports REVIEW = [{ id, batch, why, sources: { key: url }, files: { key: excerpt file }, fields: {
//   name, description, input, output, preserved, broken: { verdict, src?, quote?, note?, more?: [{ src, quote }] }
//   }, contra: [field], covers?: [id] }]: the targeted-grade shape of audit/targeted-0_1.js, with the excerpt file
//   each source was windowed into (scripts/excerpt.mjs), further receipts for a field in more, and in contra the
//   fields whose recalled expectation (audit/fill-review-recall-0_1.js, written before any source was read) the
//   source contradicted. Every quote occurs in its file (scripts/mathmap.mjs --check); the grades are checked by
//   scripts/audit.mjs, which renders reports/FILL-REVIEW.md.
// Invariant: data only. A grade is a claim about a fill, never an edit to it. confirmed: the source states the
//   field's claim; imprecise: right idea, a detail wrong; wrong: the source contradicts it; unsupported: no
//   source found that settles it. A field without a fetched source is unsupported, never confirmed.
"use strict";

const C = (src, quote, note, more) => ({ verdict: "confirmed", src, quote, ...(note ? { note } : {}), ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const I = (src, quote, note, more) => ({ verdict: "imprecise", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const X = (src, quote, note, more) => ({ verdict: "wrong", src, quote, note, ...(more ? { more: more.map(([s, q]) => ({ src: s, quote: q })) } : {}) });
const U = (note) => ({ verdict: "unsupported", note });
const WHY = (b) => `Fill review, batch ${b}: an authored fill graded field by field against sources.`;
const r = (id, batch, files, fields, contra = [], opts = {}) => ({ id, batch, why: WHY(batch), files, fields, contra, ...opts });

const R = String.raw;
const ROWS = [
  // Batch 1: D7-001 to D7-025.
  r("D7-001", 1, { n: "nlab-functor", f: "nlab-faithful-functor", u: "nlab-full-functor", m: "mathlib-Mathlib.CategoryTheory.Functor.Basic" }, {
    name: C("n", "* A *functor* is a [[homomorphism]] of [[categories]]."),
    description: C("n", "a component-[[function]] of the [[classes]] of [[objects]];", "\"The basic structure-transporting move\" is a gloss."),
    input: C("n", "* A functor between [[small categories]] is a [[homomorphism]] of the [[underlying]] [[graphs]] that respects the [[composition]] of [[edges]]."),
    output: C("m", "map : ∀ {X Y : C}, (X ⟶ Y) → ((obj X) ⟶ (obj Y))", null, [["m", "obj : C → D"]]),
    preserved: C("n", "* $F$ preserves [[commuting diagrams]].", null, [["n", "* it respects [[composition]]: the image of the composite of two morphisms under $F$ is the composite of their images."], ["m", "map_id : ∀ X : C, map (𝟙 X) = 𝟙 (obj X)"]]),
    broken: I("f", "its [[function]] $F_{x,y}$ on [[hom-sets]] is [[injection|injective]]",
      "Distinctions are lost only where F is not faithful (a faithful functor is injective on hom-sets). A functor that is not full misses morphisms between images; it identifies nothing. Injectivity on objects is no part of either notion.", [["u", "between [[hom sets]] is [[surjective]]."]]),
  }),
  r("D7-002", 1, { n: "nlab-natural-transformation", m: "mathlib-Mathlib.CategoryTheory.NatTrans" }, {
    name: C("n", "a natural transformation is a [[2-morphism]] between two functors."),
    description: C("m", "naturality ⦃X Y : C⦄ (f : X ⟶ Y) : F.map f ≫ app Y = app X ≫ G.map f", null, [["n", "the following [[diagram]] [[commuting diagram|commutes]] in $D$:"]]),
    input: C("m", "structure NatTrans (F G : C ⥤ D) : Type max u₁ v₂ where"),
    output: C("m", "app (X : C) : F.obj X ⟶ G.obj X"),
    preserved: C("m", "naturality ⦃X Y : C⦄ (f : X ⟶ Y) : F.map f ≫ app Y = app X ≫ G.map f"),
    broken: U("A gloss (\"the identity of the two functors\"); no source states what a natural transformation loses."),
  }),
  r("D7-003", 1, { a: "nlab-adjoint-functor", t: "nlab-adjoint-functor-theorem", m: "mathlib-Mathlib.CategoryTheory.Adjunction.Limits" }, {
    name: C("a", "if there exists a [[natural isomorphism]] between the [[hom-functors]] of the following form:"),
    description: C("a", "if there exists a [[natural isomorphism]] between the [[hom-functors]] of the following form:", "\"Best approximation from below\" is a gloss."),
    input: I("t", "with all small limits has a left adjoint if it preserves these [[limit]]s and satisfies the [[solution set condition]].",
      "The solution set condition alone does not give a left adjoint: Freyd's theorem also needs G to preserve limits and its domain to be complete and locally small."),
    output: C("a", "is the _[[unit of an adjunction|unit morphism]]_ of the adjunction at that object, denoted"),
    preserved: C("m", "lemma leftAdjoint_preservesColimits : PreservesColimitsOfSize.{v, u} F"),
    broken: U("No fetched source states that left adjoints fail to preserve limits; \"the extra structure is freely added\" is a gloss."),
  }, ["input"]),
  r("D7-004", 1, { a: "nlab-adjoint-functor", t: "nlab-adjoint-functor-theorem", m: "mathlib-Mathlib.CategoryTheory.Adjunction.Limits" }, {
    name: C("a", "if there exists a [[natural isomorphism]] between the [[hom-functors]] of the following form:"),
    description: C("a", "is the _[[counit of an adjunction|counit morphism]]_ of the adjunction at that object, denoted"),
    input: I("t", "and that a functor that [[preserved colimit|preserves]] [[colimits]] is a [[left adjoint]].",
      "As for the left adjoint, dually: F must preserve colimits, with a cocomplete, locally small domain; the dual solution set condition alone is not enough."),
    output: C("a", "is the _[[counit of an adjunction|counit morphism]]_ of the adjunction at that object, denoted"),
    preserved: C("m", "lemma rightAdjoint_preservesLimits : PreservesLimitsOfSize.{v, u} G"),
    broken: U("No fetched source states that right adjoints fail to preserve colimits."),
  }, ["input"]),
  r("D7-005", 1, { k: "nlab-kan-extension", m: "mathlib-Mathlib.CategoryTheory.Functor.KanExtension.Basic" }, {
    name: C("m", "class IsLeftKanExtension : Prop where"),
    description: C("m", "nonempty_isUniversal : Nonempty (LeftExtension.mk F' α).IsUniversal", "The pointwise formula is a colimit over the comma category (K over d), for ordinary locally small categories.",
      [["k", "there is an expression of a weighted (co)limit and hence a pointwise Kan extension as an ordinary (&quot;conical&quot;, meaning: in terms of [[cone]]s) (co)limit over a [[comma category]]:"]]),
    input: C("k", "If the [[codomain]] category $D$ admits certain [[limit|(co)limits]], then left and right Kan extensions can be constructed"),
    output: C("k", R`the universal transformation $F\to (Lan_p F)p$`),
    preserved: C("k", "* the left Kan extension operation forms the [[colimit]] of a functor;", "Along the functor to the terminal category. \"Universal property\" restates the definition."),
    broken: C("k", R`(Lan_p F)(c&#39;) \coloneqq colim^{C&#39;(p(-),c&#39;)} F`, "Each value is this colimit, so values off the image of K are determined by F and K, not given; \"freely generated\" is a gloss."),
  }),
  r("D7-006", 1, { k: "nlab-kan-extension", m: "mathlib-Mathlib.CategoryTheory.Functor.KanExtension.Basic" }, {
    name: C("m", "class IsRightKanExtension : Prop where"),
    description: C("m", "nonempty_isUniversal : Nonempty (RightExtension.mk F' α).IsUniversal", "Pointwise, a limit over the comma category (d over K).",
      [["k", "there is an expression of a weighted (co)limit and hence a pointwise Kan extension as an ordinary (&quot;conical&quot;, meaning: in terms of [[cone]]s) (co)limit over a [[comma category]]:"]]),
    input: C("k", "If the [[codomain]] category $D$ admits certain [[limit|(co)limits]], then left and right Kan extensions can be constructed"),
    output: C("k", "Then these objects fit together into a functor $Ran_p F$ which is a right Kan extension of $F$ along $p$.", "The counit is not quoted; the output functor is."),
    preserved: C("k", "* the right Kan extension operation forms the [[limit]] of a functor."),
    broken: C("k", R`(Ran_p F)(c&#39;) \coloneqq lim^{C&#39;(c&#39;,p(-))} F`, "Values are determined by this limit; \"cofreely\" is a gloss."),
  }),
  r("D7-007", 1, { y: "nlab-yoneda-embedding", m: "mathlib-Mathlib.CategoryTheory.Yoneda" }, {
    name: C("y", "The **Yoneda embedding** for $C$ a [[locally small category]] is the [[functor]]"),
    description: C("y", "The [[Yoneda lemma]] implies that this functor is [[full and faithful functor|full and faithful]] and hence realizes $C$ as a [[full subcategory]] inside its category of presheaves."),
    input: C("y", "For $C$ a [[locally small category]], every [[object]] $X$ of $C$ induces a [[presheaf]] on $C$: the [[representable presheaf]] $h_X$ represented by $X$."),
    output: C("y", R`This assignment extends to a [[functor]] $C \to [C^{op}, Set]$ from $C$ to its [[category of presheaves]].`),
    preserved: C("y", R`The Yoneda embedding $y \colon \mathcal{C} \longrightarrow Func(\mathcal{C}^{op}, Set)$ [[preserved limit|preserves]] [[limits]], hence is a [[continuous functor]].`, null, [["m", "def fullyFaithful : (yoneda (C := C)).FullyFaithful where"]]),
    broken: C("y", "In contrast, the Yoneda embedding does not in general preserve [[colimits]].", "\"Smallness of the ambient category\" is not checked.",
      [["y", "Instead, the Yoneda embedding of a [[small category]] $\\mathcal{C}$ is its *[[free cocompletion]]*."]]),
  }),
  r("D7-008", 1, { c: "nlab-co-yoneda-lemma" }, {
    name: C("c", "What is sometimes called the _co-Yoneda lemma_ or _density formula_ is a basic fact about [[presheaves]]"),
    description: C("c", "it says that every [[presheaf]] is a [[colimit]] of [[representable functor|representables]]", null,
      [["c", "Under [[duality|abstract duality]] an [[end]] turns into a [[coend]], so a co-Yoneda lemma ought to be a similarly fundamental expression for $F(c)$ in terms of a [[coend]]."]]),
    input: C("c", "## Every presheaf is a colimit of representables"),
    output: C("c", "Yet another way to state this is as a [[colimit]] over the [[comma category]] $(Y,F)$, for $Y$ the [[Yoneda embedding]] (the [[category of elements]] of $F$):"),
    preserved: C("c", "is canonically presented as a colimit of representables, we exhibit a natural isomorphism"),
    broken: C("c", "it is the &quot;colimit over itself of all the representables contained in it&quot;", "Every element contributes a representable: the presentation is canonical, not economical."),
  }),
  r("D7-009", 1, { g: "nlab-grothendieck-construction", m: "mathlib-Mathlib.CategoryTheory.Grothendieck" }, {
    name: C("g", "The **Grothendieck construction** describes this in the context of [[Cat]]"),
    description: C("g", R`* the [[objects]] of $\int F$ are pairs $(c,a)$, where $c \in Obj(C)$ and $a \in Obj(F(c))$,`, null, [["m", "fiber : F.obj base"]]),
    input: C("g", "is encoded in a [[pseudofunctor]]/[[2-functor]]"),
    output: C("g", "The essential image of this functor consists of [[Grothendieck fibration]]s and this establishes an [[equivalence of 2-categories]]"),
    preserved: C("g", "The essential image of this functor consists of [[Grothendieck fibration]]s and this establishes an [[equivalence of 2-categories]]"),
    broken: U("A gloss; no source states what the construction loses beyond the change of presentation."),
  }),
  r("D7-010", 1, { l: "nlab-limit", t: "nlab-adjoint-functor-theorem", m: "mathlib-Mathlib.CategoryTheory.Adjunction.Limits" }, {
    name: C("l", "Moreover, the limit $lim F$ is the _universal_ object with this property"),
    description: C("l", "is called the **universal cone** over $F$, because,"),
    input: C("l", "A limit is taken over a [[functor]]"),
    output: C("l", "is an [[object]] $lim F$ of $C$ equipped with morphisms to the objects $F(d)$"),
    preserved: C("t", "A basic result of [[category theory]] is that right [[adjoint functors]] [[preserved limit|preserve]] all [[limits]] that exist in their [[domain]]", null, [["m", "lemma rightAdjoint_preservesLimits : PreservesLimitsOfSize.{v, u} G"]]),
    broken: U("\"Information not shared by all parts of the diagram\" is a gloss no source states."),
  }),
  r("D7-011", 1, { c: "nlab-colimit", l: "nlab-limit", m: "mathlib-Mathlib.CategoryTheory.Adjunction.Limits" }, {
    name: C("c", "The intuitive general idea of a colimit is that it defines an object obtained by sewing together the objects of the diagram"),
    description: C("c", "The intuitive general idea of a colimit is that it defines an object obtained by sewing together the objects of the diagram"),
    input: C("c", "according to the instructions given by the morphisms of the diagram."),
    output: C("l", "The corresponding universal object for morphisms _out_ of the diagram is the [[colimit]]."),
    preserved: C("c", "**([[adjoints preserve (co-)limits|left adjoint functors preserve colimits]])**", null, [["m", "lemma leftAdjoint_preservesColimits : PreservesColimitsOfSize.{v, u} F"]]),
    broken: C("c", "sewing together the objects of the diagram, according to the instructions given by the morphisms of the diagram", "Sewing along the diagram's morphisms identifies what they relate."),
  }),
  r("D7-012", 1, { p: "nlab-pullback", m: "mathlib-Mathlib.CategoryTheory.Limits.Shapes.Pullback.Mono" }, {
    name: C("p", "a pullback is sometimes called a __fibered product__ (or _fiber product_ or _fibre product_)."),
    description: C("p", "consisting of pairs $(a,b)$ such that the [[equation]] $f(a) = g(b)$ holds.", "In Set. Intersections and inverse images as special cases are not checked."),
    input: C("p", "Such a diagram is also called a **pullback diagram** or a [[cospan]]."),
    output: C("p", "If the [[limit]] exists, we obtain a commutative square"),
    preserved: C("p", "Pullbacks preserve [[monomorphisms]] and [[isomorphisms]]:", null, [["m", "instance pullback.fst_of_mono {X Y Z : C} {f : X ⟶ Z} {g : Y ⟶ Z} [HasPullback f g] [Mono g] :"]]),
    broken: C("p", "consisting of pairs $(a,b)$ such that the [[equation]] $f(a) = g(b)$ holds.", "In Set, elements of X and Y with no common image in Z drop out."),
  }),
  r("D7-013", 1, { p: "nlab-pushout", m: "mathlib-Mathlib.CategoryTheory.Limits.Shapes.Pullback.Mono" }, {
    name: C("p", "or more simply an __[[amalgamation]]__ (or __amalgam__) of $a$ and $b$."),
    description: C("p", "In the category [[Set]] a &#39;pushout&#39; is a quotient of the disjoint union of two sets.", "Attaching cells is not checked.", [["p", "A [[pushout]] of [[injections]] of [[Sets]] is called the [[union]] of the sets."]]),
    input: C("p", "Such a diagram is called a [[span]]."),
    output: C("p", "If the colimit exists, we obtain a [[commutative square]]"),
    preserved: C("p", "Pushouts preserve [[epimorphisms]] and [[isomorphisms]]:", null, [["m", "instance pushout.inl_of_epi {X Y Z : C} {f : X ⟶ Y} {g : X ⟶ Z} [HasPushout f g] [Epi g] :"]]),
    broken: C("p", R`identifying $a \in A$ with $b \in B$ if there exists $x \in C$ such that $f(x) = a$ and $g(x) = b$`, "The two images of Z are identified."),
  }),
  r("D7-014", 1, { e: "nlab-equalizer", m: "mathlib-Mathlib.CategoryTheory.Limits.Shapes.Equalizers" }, {
    name: C("e", "over a parallel pair i.e. of the [[diagram]] of the shape"),
    description: C("e", "* In $C =$ [[Set]] the equalizer of two functions of sets is the subset of elements of $c$ on which both functions coincide."),
    input: C("e", "two [[parallel morphisms]] in a [[category]] $C$, their equalizer is, if it exists"),
    output: C("e", "Then $e$ is a [[monomorphism]].", null, [["m", "instance equalizer.ι_mono : Mono (equalizer.ι f g)"]]),
    preserved: C("e", "Then $e$ is a [[monomorphism]]."),
    broken: C("e", "* In $C =$ [[Set]] the equalizer of two functions of sets is the subset of elements of $c$ on which both functions coincide."),
  }),
  r("D7-015", 1, { q: "nlab-coequalizer", m: "mathlib-Mathlib.CategoryTheory.Limits.Shapes.Equalizers" }, {
    name: C("q", "the **coequalizer** $coeq(f,g)$ of two [[parallel morphisms]] $f$ and $g$"),
    description: C("q", "is (if it exists), the _[[colimit]]_ under the [[diagram]] formed by these two morphisms"),
    input: C("q", "the **coequalizer** $coeq(f,g)$ of two [[parallel morphisms]] $f$ and $g$"),
    output: C("q", "Morphisms that coequalize some pair of [[parallel morphisms]] are called *[[regular epimorphisms]]*.", null, [["m", "instance coequalizer.π_epi : Epi (coequalizer.π f g)"]]),
    preserved: C("m", "instance coequalizer.π_epi : Epi (coequalizer.π f g)"),
    broken: C("q", "This means that the [[quotient]] function", "In Set, the quotient by the equivalence relation generated by f(x) ~ g(x)."),
  }),
  r("D7-016", 1, { p: "nlab-cartesian-product" }, {
    name: C("p", "(as a special case of a category-theoretic _[[limit]]_)"),
    description: C("p", "(as a special case of a category-theoretic _[[limit]]_)", null, [["p", "such that it is [[universal property|universal with this property]]"]]),
    input: C("p", "(the _[[projections]]_), for each $i"),
    output: C("p", "(the _[[projections]]_), for each $i"),
    preserved: U("\"Each factor recoverable when the others are nonempty\" is a fact about sets; no fetched source states it, or what product formation preserves in general."),
    broken: U("\"Independence is imposed\" is a gloss no source states."),
  }),
  r("D7-017", 1, { c: "nlab-coproduct" }, {
    name: C("c", "The notion of _coproduct_ is a generalization to arbitrary [[categories]] of the notion of [[disjoint union]] in the category [[Set]]."),
    description: C("c", "A coproduct is thus the [[colimit]] over the [[diagram]] that consists of just two objects.", "Binary in the quote; the family case is the same colimit over a discrete diagram."),
    input: C("c", "A coproduct is thus the [[colimit]] over the [[diagram]] that consists of just two objects."),
    output: C("c", "are called [[coprojections]] or sometimes &quot;injections&quot; or &quot;inclusions&quot;"),
    preserved: I("c", "although in general they may not be [[monomorphisms]]",
      "\"Each summand embeds\" is stated without its condition: in general the coprojections need not be monomorphisms. They are in Set and wherever coproducts are disjoint.", [["c", "especially when it is [[disjoint coproduct|disjoint]]"]]),
    broken: I("c", "although in general they may not be [[monomorphisms]]",
      "\"Nothing is identified\" holds for disjoint unions; in general a coprojection that is not a monomorphism identifies parts of its summand."),
  }),
  r("D7-018", 1, { c: "nlab-cartesian-closed-category" }, {
    name: C("c", "The [[internal hom]] $[S,X]$ in a cartesian closed category is often called [[exponential object|exponentiation]] and is denoted $X^S$.", "\"Cartesian Closed Structure Evaluation\" is not a standard name; the source names the structure and its evaluation map."),
    description: C("c", R`There is an evaluation map $ev_{X, Y}: Y^X \times X \to Y$, which by definition is the map corresponding to the identity map $Y^X \to Y^X$ under the bijection.`),
    input: C("c", "The [[internal hom]] $[S,X]$ in a cartesian closed category is often called [[exponential object|exponentiation]] and is denoted $X^S$."),
    output: C("c", R`There is an evaluation map $ev_{X, Y}: Y^X \times X \to Y$, which by definition is the map corresponding to the identity map $Y^X \to Y^X$ under the bijection.`),
    preserved: C("c", "* The [[internal logic]] of cartesian closed categories is [[minimal logic]] or the [[typed lambda-calculus]].", null, [["c", R`the bijection $\hom(Z, Y^X) \to \hom(Z \times X, Y)$`]]),
    broken: C("c", R`the bijection $\hom(Z, Y^X) \to \hom(Z \times X, Y)$`, "A bijection of hom-sets loses nothing."),
  }),
  r("D7-019", 1, { x: "nlab-exponential-object", c: "nlab-cartesian-closed-category", t: "nlab-adjoint-functor-theorem" }, {
    name: C("x", "An __exponential object__ $X^Y$ is an [[internal hom]] $[Y,X]$ in a [[cartesian closed category]]."),
    description: C("x", R`an exponential object $X^Y$ is a [[representing object]] for the functor $\hom(- \times Y, X)$.`, null, [["c", R`the product functors $A \times -$ have [[right adjoints]]`]]),
    input: C("x", "Let $X$ and $Y$ be objects of a [[category]] $C$ such that all binary [[products]] with $Y$ exist.", "Binary products with B suffice; the fill asks for all finite products."),
    output: C("x", "an __exponential object__ is an object $X^Y$ equipped with an __[[evaluation map]]__"),
    preserved: C("x", R`an exponential object $X^Y$ is a [[representing object]] for the functor $\hom(- \times Y, X)$.`, "\"Limits in C\" read as: (-)^B, a right adjoint, preserves limits.",
      [["t", "A basic result of [[category theory]] is that right [[adjoint functors]] [[preserved limit|preserve]] all [[limits]] that exist in their [[domain]]"]]),
    broken: C("x", R`an exponential object $X^Y$ is a [[representing object]] for the functor $\hom(- \times Y, X)$.`, "It exists exactly when hom(- x B, C) is representable."),
  }),
  r("D7-020", 1, { s: "nlab-subobject-classifier", m: "mathlib-Mathlib.CategoryTheory.Subobject.Classifier.Defs" }, {
    name: C("s", "In a [[category]] $C$ with [[finite limit]]s, a **subobject classifier** is a [[monomorphism]]"),
    description: C("s", "is the [[pullback]] of this morphism along a unique morphism (the [[characteristic morphism]] of $A$)", null, [["m", "truth : Ω₀ ⟶ Ω"]]),
    input: C("s", "In a [[category]] $C$ with [[finite limit]]s, a **subobject classifier** is a [[monomorphism]]", "Finite limits suffice for the definition; a topos is the usual setting."),
    output: C("s", "is the [[pullback]] of this morphism along a unique morphism (the [[characteristic morphism]] of $A$)"),
    preserved: C("s", "In this case the representing object is [[generalized the|the]] subobject classifier: there is a [[natural isomorphism]]", "The Heyting algebra structure of Omega is not checked."),
    broken: C("s", R`It is not usually true in [[toposes]] that $\Omega$ is the [[coproduct]] $\mathbf{2} = 1 + 1$`, "The source speaks to Booleanness (Omega = 1 + 1). Two-valuedness (exactly two global truth values) is a different condition, which the fill runs together with it; not checked here."),
  }),
  r("D7-021", 1, { c: "nlab-cauchy-complete-category" }, {
    name: C("c", "The basic idea is that the Cauchy [[completion]] of a [[category]] is the closure of a category under what are called &quot;[[absolute limit]]s&quot;"),
    description: C("c", "Equivalently, the Cauchy completion is the closure with respect to [[absolute colimit]]s.", null,
      [["c", R`the Cauchy completion of $\mathcal{V}$-enriched category is its completion under _finite direct sums and idempotent splitting_.`], ["c", "The Cauchy completion is the usual completion under _Cauchy nets_ or _Cauchy filters_."]]),
    input: C("c", "All of these concepts generalize straightforwardly to the context of general $V$-[[enriched category theory|enriched categories]]"),
    output: C("c", "It contains $C$ as a [[full subcategory]] because the [[Yoneda embedding]] is a [[full and faithful functor]]."),
    preserved: C("c", R`and we say that $C$ and $\bar{C}$ are **Morita equivalent**.`, null, [["c", R`$$Set^{C^{op}} \simeq Set^{\bar{C}^{op}}$$`]]),
    broken: C("c", R`the inclusion $C \hookrightarrow \overline{C}$ is an [[equivalence of categories]] precisely if already every [[idempotent]] in $C$ splits;`, "Nothing is removed; objects are added only where idempotents do not yet split."),
  }),
  r("D7-022", 1, { k: "nlab-karoubi-envelope", c: "nlab-cauchy-complete-category", m: "mathlib-Mathlib.CategoryTheory.Idempotents.Karoubi" }, {
    name: C("k", "The _Karoubi envelope_ or _idempotent completion_ of a [[category]] is the [[universal construction|universal]] enlargement of the category with the property that every [[idempotent]] is a [[split idempotent]]."),
    description: C("m", "comm : P.p ≫ f ≫ Q.p = f", null, [["m", "idem : p ≫ p = p"]]),
    input: C("k", "The _Karoubi envelope_ or _idempotent completion_ of a [[category]] is the [[universal construction|universal]] enlargement of the category with the property that every [[idempotent]] is a [[split idempotent]]."),
    output: C("m", "def toKaroubi : C ⥤ Karoubi C where", "Full faithfulness of the embedding is stated in the nLab's characterization.", [["k", R`For a fully faithful embedding $i \colon \mathcal{C} \to \mathcal{D}$ to exhibit an idempotent(-splitting) completion of $\mathcal{C}$, it suffices that`]]),
    preserved: C("c", R`$$Set^{C^{op}} \simeq Set^{\bar{C}^{op}}$$`, "The Karoubi envelope is the Cauchy completion of an ordinary category, so presheaves are kept."),
    broken: C("k", "which are [[retracts]] of objects in", "Nothing is removed; retracts are added."),
  }),
  r("D7-023", 1, { k: "nlab-karoubi-envelope", c: "nlab-cauchy-complete-category" }, {
    name: C("k", "The _Karoubi envelope_ or _idempotent completion_ of a [[category]]"),
    description: C("k", "Thus, the Karoubi envelope is a [[completion]] operation into such categories."),
    input: C("k", "The _Karoubi envelope_ or _idempotent completion_ of a [[category]]"),
    output: C("k", "In particular the idempotent completion always exists and is unique up to [[equivalence of categories]]."),
    preserved: C("c", R`$$Set^{C^{op}} \simeq Set^{\bar{C}^{op}}$$`),
    broken: C("k", "which are [[retracts]] of objects in", "Nothing is removed; retracts are added."),
  }),
  r("D7-024", 1, { t: "nlab-adjoint-functor-theorem", m: "mathlib-Mathlib.CategoryTheory.Adjunction.AdjointFunctorTheorems" }, {
    name: C("t", "This is Freyd&#39;s original version, sometimes called the &quot;**General Adjoint Functor Theorem**&quot;.", "The attribution to Freyd is the source's."),
    description: C("t", "with all small limits has a left adjoint if it preserves these [[limit]]s and satisfies the [[solution set condition]].", null, [["m", "lemma isRightAdjoint_of_preservesLimits_of_solutionSetCondition [HasLimitsOfSize.{w, w} D]"]]),
    input: C("t", "* $C$ is [[complete category|complete]] and [[locally small category|locally small]], and $R$ satisfies the [[solution set condition]]."),
    output: C("t", "with all small limits has a left adjoint if it preserves these [[limit]]s and satisfies the [[solution set condition]]."),
    preserved: C("t", R`Sufficient conditions for a limit-preserving functor $R \colon C \to D$ to be a [[right adjoint]] include:`, "G's limit preservation is a hypothesis, kept; the adjunction bijection is the conclusion."),
    broken: I("t", "Now an initial object is the limit of the identity functor, but this is generally a large limit; we replace this with some small limit conditions that guarantee existence of an initial object.",
      "The solution set condition exists to replace the large limit by a small one: the left adjoint's value is an initial object built from a small limit over the solution set. Non-constructivity is fair; \"a large limit\" is the wrong half."),
  }),
  r("D7-025", 1, { w: "wikipedia-dedekind-macneille-completion", n: "nlab-macneille-completion", m: "mathlib-Mathlib.Order.Completion" }, {
    name: C("w", "It is named after [[Holbrook Mann MacNeille]] whose 1937 paper first defined and constructed it", "The attribution to MacNeille (and Dedekind) is the source's."),
    description: C("w", "define a ''cut'' to be a pair of sets {{math|(''A'', ''B'')}} for which {{math|1=''A''<sup>u</sup> = ''B''}}", null,
      [["w", "is the smallest [[complete lattice]] that contains it."], ["m", "def factorEmbedding (f : β ↪o α) : DedekindCut β ↪o α :="]]),
    input: C("w", "is the smallest [[complete lattice]] that contains it."),
    output: C("m", "abbrev DedekindCut [Preorder α] := Concept α α (· ≤ ·)"),
    preserved: C("n", "that preserves all least upper bounds (joins) and greatest lower bounds (meets) existing in $L$.", "The nLab states it for a lattice L; for a poset the density claim is Wikipedia's.",
      [["w", "is join-dense and meet-dense in the Dedekind–MacNeille completion"]]),
    broken: C("w", "However, the completion of a [[distributive lattice]] need not itself be distributive"),
  }),
];

// The source each excerpt file was windowed from, as its header records it (checked by scripts/audit.mjs).
const URLS = {
  "mathlib-Mathlib.CategoryTheory.Adjunction.AdjointFunctorTheorems": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Adjunction/AdjointFunctorTheorems.lean",
  "mathlib-Mathlib.CategoryTheory.Adjunction.Limits": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Adjunction/Limits.lean",
  "mathlib-Mathlib.CategoryTheory.Functor.Basic": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Functor/Basic.lean",
  "mathlib-Mathlib.CategoryTheory.Functor.KanExtension.Basic": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Functor/KanExtension/Basic.lean",
  "mathlib-Mathlib.CategoryTheory.Grothendieck": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Grothendieck.lean",
  "mathlib-Mathlib.CategoryTheory.Idempotents.Karoubi": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Idempotents/Karoubi.lean",
  "mathlib-Mathlib.CategoryTheory.Limits.Shapes.Equalizers": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Limits/Shapes/Equalizers.lean",
  "mathlib-Mathlib.CategoryTheory.Limits.Shapes.Pullback.Mono": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Limits/Shapes/Pullback/Mono.lean",
  "mathlib-Mathlib.CategoryTheory.NatTrans": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/NatTrans.lean",
  "mathlib-Mathlib.CategoryTheory.Subobject.Classifier.Defs": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Subobject/Classifier/Defs.lean",
  "mathlib-Mathlib.CategoryTheory.Yoneda": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/CategoryTheory/Yoneda.lean",
  "mathlib-Mathlib.Order.Completion": "https://github.com/leanprover-community/mathlib4/blob/380f2aafb622cb2c1c93dac545b6389083c68c51/Mathlib/Order/Completion.lean",
  "nlab-adjoint-functor": "https://ncatlab.org/nlab/source/adjoint+functor",
  "nlab-adjoint-functor-theorem": "https://ncatlab.org/nlab/source/adjoint+functor+theorem",
  "nlab-cartesian-closed-category": "https://ncatlab.org/nlab/source/cartesian+closed+category",
  "nlab-cartesian-product": "https://ncatlab.org/nlab/source/cartesian+product",
  "nlab-cauchy-complete-category": "https://ncatlab.org/nlab/source/Cauchy+complete+category",
  "nlab-co-yoneda-lemma": "https://ncatlab.org/nlab/source/co-Yoneda+lemma",
  "nlab-coequalizer": "https://ncatlab.org/nlab/source/coequalizer",
  "nlab-colimit": "https://ncatlab.org/nlab/source/colimit",
  "nlab-coproduct": "https://ncatlab.org/nlab/source/coproduct",
  "nlab-equalizer": "https://ncatlab.org/nlab/source/equalizer",
  "nlab-exponential-object": "https://ncatlab.org/nlab/source/exponential+object",
  "nlab-faithful-functor": "https://ncatlab.org/nlab/source/faithful+functor",
  "nlab-full-functor": "https://ncatlab.org/nlab/source/full+functor",
  "nlab-functor": "https://ncatlab.org/nlab/source/functor",
  "nlab-grothendieck-construction": "https://ncatlab.org/nlab/source/Grothendieck+construction",
  "nlab-kan-extension": "https://ncatlab.org/nlab/source/Kan+extension",
  "nlab-karoubi-envelope": "https://ncatlab.org/nlab/source/Karoubi+envelope",
  "nlab-limit": "https://ncatlab.org/nlab/source/limit",
  "nlab-macneille-completion": "https://ncatlab.org/nlab/source/MacNeille+completion",
  "nlab-natural-transformation": "https://ncatlab.org/nlab/source/natural+transformation",
  "nlab-pullback": "https://ncatlab.org/nlab/source/pullback",
  "nlab-pushout": "https://ncatlab.org/nlab/source/pushout",
  "nlab-subobject-classifier": "https://ncatlab.org/nlab/source/subobject+classifier",
  "nlab-yoneda-embedding": "https://ncatlab.org/nlab/source/Yoneda+embedding",
  "wikipedia-dedekind-macneille-completion": "https://en.wikipedia.org/w/index.php?action=raw&oldid=1377697498",
};

const REVIEW = ROWS.map((g) => ({ ...g, files: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, `excerpts/${b}.txt`])),
  sources: Object.fromEntries(Object.entries(g.files).map(([k, b]) => [k, URLS[b] ?? null])) }));

module.exports = { REVIEW };
