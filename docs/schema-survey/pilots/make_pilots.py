# Role: materializes disposable survey rows, preserving production map data and source evidence levels.
# Contract: run from any directory with Python 3; writes only pilots/*.json and the pilot receipt index.
# Invariant: generated trial designs remain separate from source readings and finite check results.
from pathlib import Path
import hashlib
import json
import subprocess
import time

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
MAP = json.loads((ROOT / 'map.json').read_text())
ENTRIES = {e['id']: e for e in MAP['entries']}
RECEIPTS = {}


def receipt(path, quote, role='source statement'):
    data = (ROOT / path).read_bytes()
    encoded = quote.encode()
    offset = data.index(encoded)
    rid = 'R' + hashlib.sha256((path + '\0' + quote).encode()).hexdigest()[:16]
    RECEIPTS[rid] = dict(id=rid, file=path, sha256=hashlib.sha256(data).hexdigest(),
                         quote=quote, byteOffset=offset, byteLength=len(encoded), role=role)
    return rid


def source(rid):
    path = 'docs/schema-survey/receipts/' + rid + '.txt'
    text = (ROOT / path).read_text()
    # Source-window files have a fixed five-line preamble. Keep every window, not merely its heading.
    return receipt(path, '\n'.join(text.splitlines()[5:]).strip(), 'fetched source window')


def identity(eid, field='description'):
    e = ENTRIES[eid]
    return receipt('map.json', json.dumps(e[field], ensure_ascii=False),
                   'read map field; its mathematical truth keeps the original map evidence level')


def local(path, quote):
    return receipt(path, quote)


def row(eid, refs, **kw):
    return dict(entry=eid, name=ENTRIES[eid]['name'], kind='generation: disposable survey proposal',
                entryEvidence=ENTRIES[eid]['evidence'], receiptIds=[identity(eid), *refs], **kw)


def write(cid, rows, purpose):
    assert 15 <= len({r['entry'] for r in rows}) <= 40
    start = time.perf_counter()
    for r in rows:
        assert r['entry'] in ENTRIES
        assert r['receiptIds'] and all(x in RECEIPTS for x in r['receiptIds'])
    payload = dict(candidate=cid, mapCommit='c6f8381284f67cf9e984dd75e00350a756f18880',
                   purpose=purpose, rows=rows,
                   fixtureRule='Inputs and proposed annotations are generated fixtures, labeled as such. Source statements remain readings.')
    (HERE / (cid + '.json')).write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n')
    return dict(rows=len(rows), distinctEntries=len({r['entry'] for r in rows}),
                materializeSeconds=time.perf_counter() - start)


def predicate(var, typ, op, value):
    return {'op': op, 'var': var, 'type': typ, 'value': value}


def conditions():
    p = predicate
    definitions = [
        ('D2-118', 'smooth-point inverse contraction, other geometric hypotheses remain ambient',
         p('curve.selfIntersection', 'integer', 'eq', -1), -1, -2,
         'excerpts/wikipedia-castelnuovo.txt', 'self-intersection]] number&nbsp;&minus;1)'),
        ('D3-116', 'the sheafification adjunction requires existence of this sheafification',
         p('site.hasWeakSheafify', 'boolean', 'eq', True), True, False,
         'excerpts/mathlib-Mathlib.CategoryTheory.Sites.Sheafification.txt',
         'def sheafificationAdjunction [HasWeakSheafify J A] :'),
        ('D4-048', 'nerve theorem for the cover, with all nonempty intersections contractible',
         p('cover.good', 'boolean', 'eq', True), True, False,
         'excerpts/wikipedia-nerve-complex.txt', 'the set <math>\\bigcap_{i\\in J} U_i</math> is either empty or contractible'),
        ('D4-075', 'contractibility of this quotient definition of the cone',
         p('space.cardinality', 'integer', 'gt', 0), 2, 0,
         'lean/MathMap/Cone.lean', 'theorem Cone.contractible [Nonempty X] : ContractibleSpace (Cone X) :='),
        ('D4-176', 'closed-manifold version of the Hodge statement',
         p('manifold.closed', 'boolean', 'eq', True), True, False,
         'excerpts/wikipedia-hodge-theory.txt', 'on a closed Riemannian manifold as a sum of three parts in the form'),
        ('D5-037', 'the particular Brownian/Bessel construction uses h(x)=x, rather than arbitrary h',
         p('harmonic.hIsX', 'boolean', 'eq', True), True, False,
         'excerpts/arxiv-2103.12179.txt', '[0,∞), using the harmonic function h(x) =x.'),
        ('D6-090', 'the regular-Borel three-part refinement, separately from the two-part theorem',
         p('measure.regularBorel', 'boolean', 'eq', True), True, False,
         'excerpts/wikipedia-lebesgue-decomposition.txt', 'An alternative refinement is that of the decomposition of a regular [[Borel measure]]'),
        ('D6-117', 'the SFinite/SigmaFinite construction, with SFinite(mu) still an ambient obligation',
         p('measure.nuSigmaFinite', 'boolean', 'eq', True), True, False,
         'excerpts/mathlib-Mathlib.MeasureTheory.Measure.Decomposition.Lebesgue.txt',
         '[SFinite μ] [SigmaFinite ν] : HaveLebesgueDecomposition μ ν'),
        ('D7-068', 'exact reflector version, between the declared categories',
         p('reflector.preservesFiniteLimits', 'boolean', 'eq', True), True, False,
         'excerpts/nlab-reflective-subcategory.txt', 'in addition preserves [[finite limits]], then the embedding is called _exact_.'),
        ('D7-X14', 'degree of product equals sum, using the explicit leading-coefficient guard',
         p('leading.product', 'integer', 'ne', 0), 6, 0,
         'excerpts/mathlib-Mathlib.Algebra.Polynomial.Degree.Operations.txt',
         "theorem degree_mul' (h : leadingCoeff p * leadingCoeff q ≠ 0) :\n    degree (p * q) = degree p + degree q"),
        ('D7-X16', 'leading coefficient of sum, only with the indicated strict degree ordering',
         p('degree.pMinusQ', 'integer', 'lt', 0), -1, 0,
         'excerpts/mathlib-Mathlib.Algebra.Polynomial.Degree.Operations.txt',
         'theorem leadingCoeff_add_of_degree_lt (h : degree p < degree q) :\n    leadingCoeff (p + q) = leadingCoeff q'),
        ('D7-X17', 'degree preserved by a coefficient homomorphism',
         p('coefficientMap.injective', 'boolean', 'eq', True), True, False,
         'excerpts/mathlib-Mathlib.Algebra.Polynomial.Degree.Lemmas.txt',
         'theorem degree_map_eq_of_injective {f : R →+* S} (hf : Function.Injective f) (p : Polynomial R) :'),
        ('D7-X18', 'noncommutative-target evaluation as a ring homomorphism',
         p('point.commutesWithCoefficientImage', 'boolean', 'eq', True), True, False,
         'excerpts/mathlib-Mathlib.Algebra.Polynomial.Eval.Defs.txt',
         "def eval₂RingHom' (f : R →+* S) (x : S) (hf : ∀ a, Commute (f a) x) : R[X] →+* S where"),
        ('D7-X19', 'strict drop of natDegree under derivative, with nonconstant degree',
         p('polynomial.natDegree', 'integer', 'ne', 0), 2, 0,
         'excerpts/mathlib-Mathlib.Algebra.Polynomial.Derivative.txt',
         'theorem natDegree_derivative_lt {p : R[X]} (hp : p.natDegree ≠ 0) :'),
        ('D7-X20', 'membership in the chosen roots multiset agrees with IsRoot',
         p('polynomial.nonzero', 'boolean', 'eq', True), True, False,
         'excerpts/mathlib-Mathlib.Algebra.Polynomial.Roots.txt',
         'theorem mem_roots (hp : p ≠ 0) : a ∈ p.roots ↔ IsRoot p a'),
        ('D7-X22', 'factorwise splitting inferred from product splitting, both factors nonzero',
         p('f.nonzero', 'boolean', 'eq', True), True, False,
         'excerpts/mathlib-Mathlib.Algebra.Polynomial.Splits.txt',
         'theorem splits_mul (hf₀ : f ≠ 0) (hg₀ : g ≠ 0) :\n    Splits (f * g) ↔ Splits f ∧ Splits g'),
    ]
    rows = []
    for eid, claim, guard, yes, no, file, quote in definitions:
        rows.append(row(eid, [local(file, quote)], claim=claim, predicate=guard,
                        cases=[{'facts': {guard['var']: yes}, 'expected': 'satisfied'},
                               {'facts': {guard['var']: no}, 'expected': 'violated'},
                               {'facts': {}, 'expected': 'unknown'}],
                        remainingAmbient='Other theorem hypotheses and the correspondence of operand facts to a real mathematical object remain obligations. Satisfied means this guard only.'))
    return rows


def declaration(file, name):
    text = (ROOT / file).read_text()
    at = text.index('-- ' + name + ' (line ')
    start = text.index('\n', at) + 1
    end = text.find('\n-- ', start)
    return local(file, text[start:end if end >= 0 else None].strip())


def intertwinings():
    poly = 'excerpts/mathlib-Mathlib.Algebra.Polynomial.'
    specs = [
        ('D7-X14', 'degree_product', 'degree(p*q) = degree(p)+degree(q)', 'nonzero polynomials over QQ',
         [source('PS08')]),
        ('D7-X15', 'coefficient_add', 'coeff(p+q,n) = coeff(p,n)+coeff(q,n)', 'QQ[X], n=1',
         [declaration(poly+'Coeff.txt', 'Polynomial.coeff_add')]),
        ('D7-X16', 'leading_product', 'lc(p*q) = lc(p)*lc(q)', 'QQ[X], nonzero p and q',
         [source('PS08'), declaration(poly+'Degree.Operations.txt', 'Polynomial.leadingCoeff_mul')]),
        ('D7-X17', 'map_derivative', 'map_mod5(derivative(p)) = derivative(map_mod5(p))', 'ZZ[X] to (ZZ/5)[X]',
         [declaration(poly+'Derivative.txt', 'Polynomial.derivative_map')]),
        ('D7-X18', 'evaluate_product', 'eval(p*q,a) = eval(p,a)*eval(q,a)', 'commutative QQ, a=2',
         [declaration(poly+'Eval.Defs.txt', 'Polynomial.eval₂RingHom')]),
        ('D7-X19', 'derivative_product', 'D(p*q) = D(p)*q+p*D(q)', 'QQ[X]',
         [declaration(poly+'Derivative.txt', 'Polynomial.derivative_mul')]),
        ('D7-X20', 'roots_product', 'roots(p*q) = roots(p) multiset_union roots(q)', 'nonzero split polynomials over QQ',
         [declaration(poly+'Roots.txt', 'Polynomial.roots_mul')]),
        ('D7-X21', 'evaluate_composition', 'eval(p.comp(q),a) = eval(p,eval(q,a))', 'QQ[X], a=2',
         [declaration(poly+'Eval.Defs.txt', 'Polynomial.comp')]),
        ('D7-X22', 'splitting_product', 'splits(p*q) iff splits(p) and splits(q)', 'QQ[X], both factors nonzero',
         [declaration(poly+'Splits.txt', 'Polynomial.splits_mul')]),
        ('D6-032', 'dft_convolution', 'DFT(circular_convolution(x,y)) = DFT(x)*DFT(y)', 'periodic vectors of length 4, backward normalization',
         [source('PS02'), source('PS03')]),
        ('D6-040', 'fft_dft', 'FFT(x) = DFT(x)', 'four-point numeric algorithm instance, backward normalization',
         [source('PS02')]),
        ('D1-001', 'transpose_product', 'transpose(A*B) = transpose(B)*transpose(A)', 'finite adjacency matrices; multiplication counts walks',
         [source('PS04')]),
        ('D1-002', 'complement_clique', 'S clique in complement(G) iff S independent in G', 'finite loopless simple graphs',
         [source('PS05')]),
        ('D1-109', 'translation_difference', 'T_v(x)-T_v(y) = x-y', 'finite rational coordinate vectors, same v', []),
        ('D5-091', 'log_product', 'log(x*y) = log(x)+log(y)', 'ordinary real logarithm, positive x,y; Lean source uses its extended convention',
         [source('PS07')]),
        ('D6-101', 'mobius_composition', 'M_A(M_B(z)) = M_(A*B)(z)', 'rational matrices with nonzero determinant; avoid poles', []),
        ('D6-148', 'walsh_xor', 'W_ortho(x xor_convolve y) = sqrt(N)*W_ortho(x)*W_ortho(y)', 'N=4, Sylvester order, W_ortho=H/2',
         [source('PS01')]),
    ]
    return [row(eid, refs, rule=model, equation=eq, domain=domain,
                evidence='read definitions; generated alignment; finite/symbolic experiment is separately recorded',
                sourceAction=eq.split(' = ')[0], targetAction=eq.split(' = ')[-1])
            for eid, model, eq, domain, refs in specs]


def inverses():
    specs = [
        ('D1-001', 'transpose_graph', 'loopless directed graph on three labeled vertices', 'same', [source('PS04')]),
        ('D8-217', 'transpose_graph', 'loopless directed graph on three labeled vertices', 'same', [source('PS04')]),
        ('D1-002', 'complement', 'simple loopless undirected graph on three fixed vertices', 'same', [source('PS05')]),
        ('D1-082', 'reverse_complement', 'permutations of 1,2,3; no tableau assertion', 'same', []),
        ('D1-109', 'translation', 'rational points and a fixed displacement vector', 'negate displacement', []),
        ('D2-001', 'translation', 'rational points and a fixed displacement vector', 'negate displacement', []),
        ('D6-145', 'translation', 'rational points and a fixed displacement vector', 'negate displacement', []),
        ('D1-110', 'reflection', 'reflection in the fixed x-axis of QQ^2', 'same', []),
        ('D2-002', 'reflection', 'reflection in the fixed x-axis of QQ^2', 'same', []),
        ('D6-119', 'reflection', 'reflection in the fixed x-axis of QQ^2', 'same', []),
        ('D1-111', 'rotation', '90-degree rotation around the origin in QQ^2', 'negate angle', []),
        ('D2-003', 'rotation', '90-degree rotation around the origin in QQ^2', 'negate angle', []),
        ('D8-186', 'rotation', '90-degree rotation around the origin in QQ^2', 'negate angle', []),
        ('D6-101', 'mobius', 'nonzero determinant, rational points away from both poles', 'adjugate matrix', []),
        ('D6-148', 'walsh', 'N=4, unnormalized Sylvester matrix, fixed ordering', 'same matrix divided by N', [source('PS01')]),
        ('D5-055', 'hadamard_gate', 'one-qubit normalized Hadamard on two coordinates', 'same', []),
    ]
    return [row(eid, refs, model=model, relation='two-sided inverse on stated trial domain',
                target=eid, parameterMap=pm, domain=domain,
                equality='exact on rational finite models; tolerance 1e-10 for the normalized two-coordinate gate',
                canonicalIdentity='not decided; repeated domain views are separate entry rows',
                evidence='read definitions, generated inverse edge, finite trial only')
            for eid, model, domain, pm, refs in specs]


def binding_modules():
    script = "console.log(JSON.stringify({android:require('./mapfill/android.js'),nixos:require('./mapfill/nixos.js'),context:require('./mapfill/invariants.js').CONTEXT}))"
    return json.loads(subprocess.check_output(['node', '-e', script], cwd=ROOT))


def fingerprint(e, vocabulary, context):
    keys = ['id', 'name', 'kind', 'tags', 'description', 'input', 'output', 'preserved', 'broken',
            'actsOn', 'invariants', 'conditions', 'counterexamples', 'combinator', 'relation', 'complexity']
    payload = {'algorithm': 'survey-contract-v1', 'entry': {k: e[k] for k in keys if k in e},
               'vocabulary': vocabulary, 'contextRules': context}
    return hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()).hexdigest()


def realizations():
    modules = binding_modules()
    rows = []
    for i in range(1, 17):
        eid = f'D9-X{i:02}'
        platform = 'android' if i <= 8 else 'nixos'
        module = modules[platform]
        binding = next(b for b in module['BINDINGS'] if b['entry'] == eid)
        path = 'mapfill/' + platform + '.js'
        text = (ROOT/path).read_text()
        marker = '  { entry: "' + eid + '"' if platform == 'android' else '  {"entry":"' + eid + '"'
        at = text.index(marker, text.index('const BINDINGS'))
        end = text.find('\n  {', at + 3)
        if end < 0:
            end = text.index('\n];', at)
        ref = local(path, text[at:end].rstrip())
        rows.append(row(eid, [ref], by='platform', platform=platform, sourcePin=module['PIN'],
                        artifact=binding.get('api') or binding.get('mechanism'),
                        contractFingerprint=fingerprint(ENTRIES[eid], MAP['invariants'], modules['context']),
                        fingerprintAlgorithm='survey-contract-v1', departures=binding.get('note'),
                        unestablished=binding.get('unestablished', []),
                        sourceAssurance=binding.get('platformAssurance'),
                        contractAssurance=binding.get('contractAssurance'),
                        sourceHashesStatus='read from the existing generated binding, not re-fetched in this pilot',
                        behavioralCheck=None, observations=[],
                        evidence='read: this binding claim exists; its inherited assurance is unchanged'))
    return rows


def translations():
    rows = []
    for rule in intertwinings():
        eid = rule['entry']
        required = ['operation', 'operatorLaw', 'domainGuard']
        if eid in {'D6-032', 'D6-040', 'D6-148'}:
            required.append('normalization')
        kept = list(required) if eid.startswith('D7-X') else ['operation']
        if eid == 'D6-032':
            kept = ['operation', 'operatorLaw', 'domainGuard']
        fields = {f: ENTRIES[eid][f] for f in ['description', 'input', 'output', 'preserved', 'broken']}
        refs = list(rule['receiptIds']) + [identity(eid, 'preserved'), identity(eid, 'input')]
        refs = list(dict.fromkeys(refs))
        rows.append(row(eid, refs, model=rule['rule'], mathematicalFragment={'equation': rule['equation'],
                        'domain': rule['domain'], 'requiredInformation': required},
                        codeFragment={'file': 'docs/schema-survey/pilots/run_pilots.py', 'function': 'c23',
                                      'modelKey': rule['rule'], 'status': 'generated finite/symbolic implementation, not an imported production binding'},
                        language=fields,
                        alignment={'kind': 'generation: manually proposed span interpretation, not automatic semantic parsing',
                                   'field': 'preserved' if eid.startswith('D7-X') or eid=='D6-032' else 'description',
                                   'keptExplicitly': kept, 'unestablished': sorted(set(required)-set(kept)),
                                   'guardMeaning': 'The finite trial domain is narrower than the general entry. Broader language never proves broader code correctness.'},
                        arrows=[{'from': 'math', 'to': 'code', 'kept': 'the named finite model and equation test',
                                 'lost': ['generality beyond the tested fragment', 'unrun proof obligations']},
                                {'from': 'code', 'to': 'language', 'kept': kept, 'lost': sorted(set(required)-set(kept))},
                                {'from': 'language', 'to': 'math', 'kept': kept, 'lost': sorted(set(required)-set(kept))}],
                        equality='same scoped contract information and same finite computation; surface wording equality is irrelevant'))
    eid = 'D6-060'
    rows.append(row(eid, [source('PS01'), identity(eid, 'preserved')], model='hadamard_recursive',
                    mathematicalFragment={'equation': 'orthonormal Sylvester H4 = unnormalized H4 / 2', 'domain': 'N=4',
                                          'requiredInformation': ['operation', 'operatorLaw', 'domainGuard', 'normalization']},
                    codeFragment={'file': 'docs/schema-survey/pilots/run_pilots.py', 'function': 'c33',
                                  'status': 'generated exact/symbolic recurrence comparison'},
                    language={f: ENTRIES[eid][f] for f in ['description','input','output','preserved','broken']},
                    alignment={'kind':'generation: one literal-recursion interpretation', 'field':'description',
                               'keptExplicitly':['operation','domainGuard'], 'unestablished':['operatorLaw','normalization']},
                    arrows=[{'from':'math','to':'code','lost':['generality beyond N=4']},
                            {'from':'code','to':'language','lost':['normalization convention needs an explicit submatrix convention']},
                            {'from':'language','to':'math','lost':['a unique normalized recurrence is not recoverable without interpretation']}],
                    equality='matrix equality at N=4 under the stated submatrix convention'))
    return rows


def atlas_transitions():
    groups = [
        ('ISO-CROSS-LEG', ['D4-221','D5-087','D6-091'], 'quadratic',
         'f(x)=a*x^2, a>0; three coefficient/derivative/dual charts of this family only'),
        ('ISO-CROSS-GC', ['D1-099','D1-100','D7-119'], 'galois_fixed',
         'a specified finite monotone adjunction, restricted to its fixed-point objects'),
        ('ISO-CROSS-TP', ['D1-020','D2-103','D4-388'], 'tensor',
         'finite labeled graph adjacency matrices and chosen bases; topology not certified'),
        ('ISO-CROSS-SHEAF', ['D3-116','D7-290'], 'unknown',
         'coefficient category and sheafification comparison witness not supplied'),
        ('ISO-CROSS-YON', ['D3-114','D4-435','D7-007'], 'unknown',
         'universe, presheaf-category and embedding comparison witness not supplied'),
        ('ISO-D1-INT-01', ['D1-004','D1-046','D1-048','D1-057','D1-058','D1-060'], 'graphic_forgetful',
         'graphic independence abstraction; isolated vertex count is forgotten'),
    ]
    rows = []
    for cluster, ids, model, domain in groups:
        for index, eid in enumerate(ids):
            assert eid in MAP['clusters'][cluster]['members']
            refs=[]
            if model=='galois_fixed': refs.append(source('PS09'))
            if model=='tensor': refs.append(source('PS06'))
            transitions = {
                'quadratic': [('coefficient_a','curvature_h','h=2*a'),('curvature_h','dual_coefficient_b','b=1/(2*h)'),('dual_coefficient_b','coefficient_a','a=1/(4*b)')],
                'galois_fixed': [('fixed_P','fixed_Q','l on fixed points'),('fixed_Q','canonical_closed_bit','g then bit encoding'),('canonical_closed_bit','fixed_P','bit decoding')],
            }
            frm,to,formula=transitions[model][index] if model in transitions else ('entry_view','partner_view','not supplied as an isomorphism')
            tested = model in {'quadratic','galois_fixed'} or (model=='tensor' and eid!='D4-388')
            state = 'bounded transition/diagram check' if tested else 'blocked: lossy' if model=='graphic_forgetful' else 'unknown: missing witness'
            rows.append(row(eid,refs,cluster=cluster,chart={'id':eid+':trial-chart','view':frm,'objectIdentity':'shared-trial-object-v1'},
                            transition={'toEntry':ids[(index+1)%len(ids)],'from':frm,'to':to,'formula':formula,
                                        'validityDomain':domain,'equality':'exact rational equality on trial objects; tensor diagram checks only',
                                        'residuals':['outside the declared finite/family fragment', 'global library admission and semantic alignment unproved']},
                            model=model,trialStatus=state,
                            evidence='read: cluster membership and entry text; generation: transition proposal; check: bounded experiment'))
    return rows


def main():
    stats = {'C02': write('C02', conditions(), 'Discharge explicit scoped guards; retain absent facts as unknown.')}
    stats['C23'] = write('C23', intertwinings(), 'Execute a rule dictionary on bounded examples and catch a wrong target action or normalization.')
    stats['C15'] = write('C15', inverses(), 'Discover a reverse route through explicitly scoped inverse edges and check both round trips.')
    stats['C30'] = write('C30', realizations(), 'Pin a realization to a contract fingerprint without promoting static source claims into behavior.')
    stats['C33'] = write('C33', translations(), 'Track losses on math/code/language arrows and refuse to restore omitted information on a round trip.')
    stats['C53'] = write('C53', atlas_transitions(), 'Compose scoped atlas transitions, reject a broken cycle and preserve lossy/unknown bridges.')
    (HERE / 'receipts.json').write_text(json.dumps({'receipts': list(RECEIPTS.values())}, indent=2, ensure_ascii=False) + '\n')
    (HERE / 'materialization.json').write_text(json.dumps(stats, indent=2) + '\n')
    print(json.dumps(stats))


if __name__ == '__main__':
    main()
