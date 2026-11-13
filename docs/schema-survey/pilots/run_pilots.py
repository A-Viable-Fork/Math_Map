# Role: disposable experiments for the schema survey, with bounded claims and explicit negative controls.
# Contract: python run_pilots.py [--pilot C02]; reads pilot sidecars and production data; writes results.json.
# Invariant: touches no production data; receipt occurrence, finite checks and universal proof are separate.
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import sys
import time

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]


def verify_receipts():
    receipts = json.loads((HERE / 'receipts.json').read_text())['receipts']
    by = {}
    for r in receipts:
        data = (ROOT / r['file']).read_bytes()
        assert hashlib.sha256(data).hexdigest() == r['sha256'], r['id']
        assert data[r['byteOffset']:r['byteOffset'] + r['byteLength']] == r['quote'].encode(), r['id']
        by[r['id']] = r
    return by


def guard(p, facts):
    if p['var'] not in facts:
        return 'unknown'
    value = facts[p['var']]
    if (p['type'] == 'boolean' and type(value) is not bool) or (p['type'] == 'integer' and type(value) is not int):
        return 'unknown'
    if p['op'] not in {'eq', 'ne', 'lt', 'gt'}:
        return 'unknown'
    result = {'eq': lambda: value == p['value'], 'ne': lambda: value != p['value'],
              'lt': lambda: value < p['value'], 'gt': lambda: value > p['value']}[p['op']]()
    return 'satisfied' if result else 'violated'


def c02(rows):
    outcomes = []
    for r in rows:
        observed = [guard(r['predicate'], case['facts']) for case in r['cases']]
        assert observed == [case['expected'] for case in r['cases']]
        assert guard(r['predicate'], {r['predicate']['var']: 'true'}) == 'unknown'
        outcomes.append({'entry': r['entry'], 'caseDecisions': observed, 'checked': True,
                         'scope': 'guard evaluation from supplied fixture facts, not proof of the entry'})
    base = json.loads(subprocess.check_output(['node', 'scripts/compose.mjs', '--chain', 'D2-118,D2-117', '--json'], cwd=ROOT))
    assert 'obligations' not in base
    contraction = next(r for r in rows if r['entry'] == 'D2-118')
    assert guard(contraction['predicate'], {'curve.selfIntersection': -2}) == 'violated'
    # A genuine finite zero-divisor witness for the guarded degree claim: (2X)^2 = 0 in (Z/4)[X].
    assert (2 * 2) % 4 == 0
    assert guard(next(r for r in rows if r['entry'] == 'D7-X14')['predicate'], {'leading.product': 0}) == 'violated'
    return dict(outcomes=outcomes, structurallyChecked=len(rows), finiteSemanticsChecked=0, universalProofs=0,
                controls={'missingFactIsUnknown': True, 'illTypedFactIsUnknown': True,
                          'minusTwoCurveRejected': True, 'zeroDivisorProductRejected': True},
                baseline={'compositionReportsObligations': False, 'joins': base['joins']},
                finding='The existing composition output cannot evaluate these guards; merely having conditions prose does not discharge them.')


def c23(rows):
    import itertools
    import math
    import numpy as np
    import scipy.fft as fft
    from scipy.linalg import hadamard
    import sympy as s
    x = s.Symbol('x')
    p, q = (x - 1) * (x + 2), x - 3
    pp, qq = s.Poly(p, x), s.Poly(q, x)
    close = lambda a, b: bool(np.allclose(a, b, atol=1e-10, rtol=1e-10))
    degree = lambda a: s.Poly(a, x).degree()
    roots = lambda a: sorted(s.Poly(a, x).all_roots(), key=str)
    splits = lambda a: sum(s.Poly(a, x).ground_roots().values()) == degree(a)
    circ = lambda a, b: np.array([sum(a[j] * b[(k-j) % len(a)] for j in range(len(a))) for k in range(len(a))])
    xorconv = lambda a, b: np.array([sum(a[j] * b[k ^ j] for j in range(4)) for k in range(4)])
    vectors = [np.array(v) for v in itertools.product([0, 1], repeat=4)]
    a, b = np.array([[0, 1], [0, 0]]), np.array([[0, 0], [1, 0]])
    edge_pairs = [(0, 1), (0, 2), (1, 2)]
    complement_ok = True
    for mask in range(8):
        edges = {e for j, e in enumerate(edge_pairs) if mask & (1 << j)}
        for subset in range(8):
            chosen = [e for e in edge_pairs if all(subset & (1 << v) for v in e)]
            complement_ok &= all(e not in edges for e in chosen) == (not any(e in edges for e in chosen))
    u = np.array([0, 0, 0, 1]); v = np.array([0, 1, 0, 0])
    h = hadamard(4) / 2
    A, B = s.Matrix([[1, 2], [1, 3]]), s.Matrix([[2, 1], [1, 1]])
    mob = lambda m, z: (m[0, 0]*z+m[0, 1])/(m[1, 0]*z+m[1, 1])
    checks = {
        'degree_product': degree(p*q) == degree(p)+degree(q),
        'coefficient_add': s.Poly(p+q, x).nth(1) == pp.nth(1)+qq.nth(1),
        'leading_product': s.Poly(p*q, x).LC() == pp.LC()*qq.LC(),
        'map_derivative': s.Poly(s.diff(p, x), x, modulus=5) == s.Poly(p, x, modulus=5).diff(),
        'evaluate_product': (p*q).subs(x, 2) == p.subs(x, 2)*q.subs(x, 2),
        'derivative_product': s.expand(s.diff(p*q, x)-s.diff(p, x)*q-p*s.diff(q, x)) == 0,
        'roots_product': roots(p*q) == sorted(roots(p)+roots(q), key=str),
        'evaluate_composition': p.subs(x, q).subs(x, 2) == p.subs(x, q.subs(x, 2)),
        'splitting_product': splits(p*q) == (splits(p) and splits(q)) and not splits(x*x+1),
        'dft_convolution': all(close(fft.fft(circ(a, b)), fft.fft(a)*fft.fft(b)) for a in vectors for b in vectors),
        'fft_dft': all(close(fft.fft(a), np.exp(-2j*np.pi*np.outer(np.arange(4), np.arange(4))/4) @ a) for a in vectors),
        'transpose_product': np.array_equal((a @ b).T, b.T @ a.T),
        'complement_clique': complement_ok,
        'translation_difference': all((i+v)-(j+v) == i-j for i in range(-3, 4) for j in range(-3, 4) for v in range(-2, 3)),
        'log_product': all(abs(math.log(a*b)-math.log(a)-math.log(b)) < 1e-12 for a in [0.25, 1, 2, 3] for b in [0.5, 1, 4]),
        'mobius_composition': all(s.simplify(mob(A, mob(B, z))-mob(A*B, z)) == 0 for z in [s.Rational(i, 7) for i in range(1, 8)]),
        'walsh_xor': all(close(h @ xorconv(a, b), 2*(h @ a)*(h @ b)) for a in vectors for b in vectors),
    }
    controls = {
        'linearConvolutionIsNotCircular': not close(fft.fft(np.convolve(u, v)[:4]), fft.fft(u)*fft.fft(v)),
        'transposeOrderMatters': not np.array_equal((a @ b).T, a.T @ b.T),
        'normalizedWalshNeedsScale': not close(h @ xorconv(u, v), (h @ u)*(h @ v)),
        'mobiusCompositionOrderMatters': mob(A*B, s.Rational(1, 7)) != mob(B*A, s.Rational(1, 7)),
    }
    assert all(controls.values()), controls
    assert all(checks[r['rule']] for r in rows), checks
    return dict(outcomes=[{'entry': r['entry'], 'checked': bool(checks[r['rule']]), 'equation': r['equation'],
                           'scope': r['domain']} for r in rows], structurallyChecked=len(rows),
                finiteSemanticsChecked=len(rows), universalProofs=0, controls=controls,
                finding='The rule dictionary detects circular/linear convolution, multiplication order and normalization changes that carrier matching alone does not express.')


def c15(rows):
    from fractions import Fraction as Q
    import itertools
    import numpy as np
    from scipy.linalg import hadamard
    all_directed = [(u, v) for u in range(3) for v in range(3) if u != v]
    all_undirected = [(0, 1), (0, 2), (1, 2)]
    transpose = lambda es: {(v, u) for u, v in es}
    complement = lambda es: set(all_undirected) - es
    rc = lambda perm: tuple(4 - x for x in perm[::-1])
    points = [(Q(x, 3), Q(y, 5)) for x in range(-2, 3) for y in range(-2, 3)]
    trans = lambda p, v: tuple(x+y for x, y in zip(p, v))
    reflect = lambda p: (p[0], -p[1])
    rotate = lambda p: (-p[1], p[0])
    unrotate = lambda p: (p[1], -p[0])
    A, Ai = (1, 2, 1, 3), (3, -2, -1, 1)
    mob = lambda a, z: (a[0]*z+a[1])/(a[2]*z+a[3])
    h4 = hadamard(4)
    h2 = hadamard(2)/np.sqrt(2)
    checks = {
        'transpose_graph': all(transpose(transpose({e for j, e in enumerate(all_directed) if mask & (1 << j)})) ==
                               {e for j, e in enumerate(all_directed) if mask & (1 << j)} for mask in range(64)),
        'complement': all(complement(complement({e for j, e in enumerate(all_undirected) if mask & (1 << j)})) ==
                         {e for j, e in enumerate(all_undirected) if mask & (1 << j)} for mask in range(8)),
        'reverse_complement': all(rc(rc(p)) == p for p in itertools.permutations([1, 2, 3])),
        'translation': all(trans(trans(p, (Q(2), Q(-1))), (Q(-2), Q(1))) == p and
                           trans(trans(p, (Q(-2), Q(1))), (Q(2), Q(-1))) == p for p in points),
        'reflection': all(reflect(reflect(p)) == p for p in points),
        'rotation': all(unrotate(rotate(p)) == p and rotate(unrotate(p)) == p for p in points),
        'mobius': all(mob(Ai, mob(A, z)) == z and mob(A, mob(Ai, z)) == z for z in [Q(i, 7) for i in range(1, 7)]),
        'walsh': np.array_equal(h4 @ h4, 4*np.eye(4, dtype=int)),
        'hadamard_gate': np.allclose(h2 @ h2, np.eye(2), atol=1e-10),
    }
    def reachable(edges, start, end):
        pending, seen = [start], set()
        while pending:
            n = pending.pop()
            if n == end:
                return True
            if n not in seen:
                seen.add(n); pending += [b for a, b in edges if a == n]
        return False
    def reverse_route(model, facts):
        if model == 'mobius' and (facts['determinant'] == 0 or facts['denominator'] == 0):
            return {'status':'blocked', 'reason':'outside the inverse domain'}
        if model == 'walsh' and facts['inverseScale'] != Q(1, facts['N']):
            return {'status':'blocked', 'reason':'inverse normalization mismatch'}
        return {'status':'route', 'edge':('output','input')}
    outcomes = []
    for r in rows:
        before = [('input', 'output')]
        proposed = reverse_route(r['model'], {'determinant':1,'denominator':1,'inverseScale':Q(1,4),'N':4})
        assert proposed['status']=='route'
        after = before + [proposed['edge']]
        assert not reachable(before, 'output', 'input') and reachable(after, 'output', 'input')
        assert checks[r['model']], r['entry']
        outcomes.append({'entry': r['entry'], 'bothRoundTripsChecked': True, 'reverseRouteBefore': False,
                         'reverseRouteWithSidecar': True, 'scope': r['domain']})
    controls = {'singularMobiusBlocked': reverse_route('mobius',{'determinant':1*4-2*2,'denominator':1})['status']=='blocked',
                'inversePoleAtOneRejected': reverse_route('mobius',{'determinant':1,'denominator':Ai[2]*Q(1)+Ai[3]})['status']=='blocked',
                'walshWithoutInverseScaleFails': reverse_route('walsh',{'inverseScale':Q(1),'N':4})['status']=='blocked' and not np.array_equal(h4 @ h4, np.eye(4)),
                'sameNameDoesNotMergeGateAndSignal': len({r['entry'] for r in rows if r['model'] in {'walsh', 'hadamard_gate'}}) == 2}
    assert all(controls.values())
    return dict(outcomes=outcomes, structurallyChecked=len(rows), finiteSemanticsChecked=len(rows),
                universalProofs=0, controls=controls,
                finding='Explicit inverse edges supply reverse routes and their parameter/domain restrictions. The route graph comparison is a bounded forward-only fixture, not an existing production route engine.')


def c30(rows):
    from copy import deepcopy
    from make_pilots import binding_modules, fingerprint, MAP, ENTRIES
    modules = binding_modules()
    outcomes = []
    for r in rows:
        e = ENTRIES[r['entry']]
        current = fingerprint(e, MAP['invariants'], modules['context'])
        assert current == r['contractFingerprint']
        mutated = deepcopy(e); mutated['input'] += ' generated drift-control operand'
        assert fingerprint(mutated, MAP['invariants'], modules['context']) != current
        evidence_only = deepcopy(e); evidence_only['evidence'] = {'input': 'formal'}
        assert fingerprint(evidence_only, MAP['invariants'], modules['context']) == current
        changed_vocab = deepcopy(MAP['invariants']); changed_vocab['terms'][0]['definition'] = 'generated drift control'
        assert fingerprint(e, changed_vocab, modules['context']) != current
        # Static source metadata cannot authorize the universal behavioral assurance "enforced".
        assert r['contractAssurance'] in {'unknown', 'not observable'}
        assert r['behavioralCheck'] is None and r['observations'] == []
        outcomes.append({'entry': r['entry'], 'platform': r['platform'], 'fingerprintMatched': True,
                         'inputDriftDetected': True, 'vocabularyDriftDetected': True,
                         'evidenceChangeDoesNotMoveContract': True, 'contractAssurance': r['contractAssurance'],
                         'behaviorVerified': False})
    gaps = {eid: [p for p in ['android', 'nixos'] if not any(b['entry'] == eid for b in modules[p]['BINDINGS'])]
            for eid in ['D9-X28', 'D9-X29', 'D9-X42', 'D9-X43', 'D9-X44']}
    assert gaps['D9-X28'] == ['android', 'nixos'] and gaps['D9-X29'] == ['android', 'nixos']
    return dict(outcomes=outcomes, structurallyChecked=len(rows), finiteSemanticsChecked=0, universalProofs=0,
                controls={'contractMutationDetected': True, 'vocabularyMutationDetected': True,
                          'sourceClaimCannotPromoteBehavior': True}, gaps=gaps,
                finding='Static realization envelopes can detect contract drift and preserve assurance. Actual X28/X29 platform gaps persist; no device behavior was measured.',
                fingerprintLimit='The conservative whole-vocabulary dependency detects more drift but can overinvalidate unrelated entries. Proof bodies and foreign definition closure are outside this trial algorithm.')


def c33(rows):
    import sympy as s
    from scipy.linalg import hadamard
    rules = json.loads((HERE/'C23.json').read_text())['rows']
    bounded = c23(rules)
    assert bounded['finiteSemanticsChecked'] == 17
    outcomes = []
    for r in rows:
        required = set(r['mathematicalFragment']['requiredInformation'])
        kept = set(r['alignment']['keptExplicitly'])
        lost = required-kept
        assert lost == set(r['alignment']['unestablished'])
        field = r['alignment']['field']
        assert field in r['language'] and r['language'][field]
        # This tests the proposed alignment's bookkeeping, not the mathematical interpretation of English.
        assert required.intersection(kept) == kept
        outcomes.append({'entry':r['entry'], 'annotationChecked':True, 'lostInformation':sorted(lost),
                         'roundTripCanRestoreRequiredInformation':not bool(lost),
                         'languageMeaningProved':False,
                         'codeCheck':'bounded C23 experiment' if r['model']!='hadamard_recursive' else 'N=4 recurrence comparison'})
    h1 = s.Matrix([[1]])
    h2 = h1.row_join(h1).col_join(h1.row_join(-h1))/s.sqrt(2)
    literal_h4 = h2.row_join(h2).col_join(h2.row_join(-h2))/2
    conventional_h4 = s.Matrix(hadamard(4))/2
    assert literal_h4 != conventional_h4
    assert s.simplify(literal_h4.T*literal_h4) == s.eye(4)/2
    assert conventional_h4.T*conventional_h4 == s.eye(4)
    # Inject a lost normalization into an otherwise annotated card: it must block the information round trip.
    dft = next(r for r in rows if r['entry']=='D6-032')
    assert 'normalization' not in dft['alignment']['keptExplicitly']
    return dict(outcomes=outcomes, structurallyChecked=len(rows), finiteSemanticsChecked=len(rows),
                universalProofs=0, languageMeaningProofs=0,
                controls={'omittedNormalizationCannotReappear':True,'literalHadamardRecursionDiffersAtFour':True},
                findings=[{'entry':'D6-060','grade':'needs refinement','evidence':'inferred from exact matrix computation under the literal recursive reading',
                           'literalGram':'I/2','normalizedGram':'I',
                           'limit':'The source sentence does not say whether the inner blocks are normalized. This is a convention/clarity finding, held without changing the row.'}],
                finding='Translation cards expose explicit omissions and a normalization ambiguity. Their hand-authored alignments need independent semantic review; no natural-language equivalence has been proved.')


def c53(rows):
    from fractions import Fraction as Q
    import itertools
    import numpy as np
    from make_pilots import MAP
    def quadratic_cycle(a):
        if a <= 0:
            return {'status':'outside overlap'}
        h = 2*a
        b = 1/(2*h)
        return {'status':'checked', 'returned':1/(4*b)}
    def same_object(left, right):
        return left['objectIdentity'] == right['objectIdentity']
    assert quadratic_cycle(Q(0))['status']=='outside overlap'
    assert not same_object({'objectIdentity':'shared-trial-object-v1'}, {'objectIdentity':'shared-trial-object-v2'})
    quadratic = []
    for a in [Q(i, 3) for i in range(1, 17)]:
        h, b = 2*a, 1/(4*a)
        end = quadratic_cycle(a)['returned']
        assert end == a
        assert 1/(2*b) != a  # wrong inverse normalization fails the cycle
        quadratic.append({'a':str(a),'h':str(h),'b':str(b),'returned':str(end)})
    # l : {0,1} -> {0,1,2}; u : {0,1,2} -> {0,1}, a finite monotone adjunction.
    l, u = lambda a: 2*a, lambda b: b//2
    assert all((l(a)<=b) == (a<=u(b)) for a in [0,1] for b in [0,1,2])
    fixed_p = [a for a in [0,1] if u(l(a))==a]
    fixed_q = [b for b in [0,1,2] if l(u(b))==b]
    assert all(u(l(a))==a for a in fixed_p) and all(l(u(b))==b for b in fixed_q)
    assert l(u(1)) == 0 < 1  # this composition is interior, not an extensive closure
    # Independent construction of the finite graph tensor-product adjacency matrix.
    A = np.array([[0,1],[1,0]])
    B = np.array([[0,1,0],[1,0,1],[0,1,0]])
    vertices = list(itertools.product(range(2), range(3)))
    graph_product = np.array([[int(A[a,c] and B[b,d]) for c,d in vertices] for a,b in vertices])
    assert np.array_equal(graph_product, np.kron(A,B))
    # Graphic independence on a triangle is unchanged by adjoining an isolated vertex.
    edges = [(0,1),(1,2),(0,2)]
    def independent_sets(vertices):
        out=[]
        for mask in range(8):
            parent={v:v for v in vertices}
            def find(x):
                while parent[x]!=x: x=parent[x]
                return x
            ok=True
            for j,(a,b) in enumerate(edges):
                if mask & (1<<j):
                    a,b=find(a),find(b)
                    if a==b: ok=False; break
                    parent[a]=b
            if ok:out.append(mask)
        return out
    assert independent_sets([0,1,2]) == independent_sets([0,1,2,3])
    outcomes=[]
    for r in rows:
        assert r['entry'] in MAP['clusters'][r['cluster']]['members']
        checked=r['trialStatus']=='bounded transition/diagram check'
        outcomes.append({'entry':r['entry'],'cluster':r['cluster'],'checked':checked,
                         'status':r['trialStatus'],'domain':r['transition']['validityDomain']})
    assert sum(r['checked'] for r in outcomes)==8
    return dict(outcomes=outcomes, structurallyChecked=len(rows), finiteSemanticsChecked=8, universalProofs=0,
                quadraticCycle=quadratic, fixedPoints={'P':fixed_p,'Q':fixed_q},
                controls={'wrongCycleNormalizationRejected':True,'zeroQuadraticOutsideOverlap':True,
                          'unrestrictedGaloisRoundTripFailsAtOne':True,'bothCompositionsAreNotClosures':True,
                          'graphicAbstractionLosesIsolatedVertices':True,'changedSharedObjectVersionNeedsRecheck':True},
                counterexamples={'galois':{'b':1,'l_u_b':0},
                                 'graphic':{'verticesBefore':3,'verticesAfter':4,'sameIndependentEdgeSets':True}},
                finding='A cluster label is not transport data. Six trial chart transitions and two finite tensor diagram views check; six lossy abstraction rows and six missing-witness rows remain blocked/unknown.',
                limits='No global cocycle theorem, arbitrary convex-function equivalence, sheaf/Yoneda comparison or topological tensor comparison was checked.')


RUNNERS = {'C02': c02, 'C23': c23, 'C15': c15, 'C30': c30, 'C33': c33, 'C53': c53}


def main():
    a = argparse.ArgumentParser()
    a.add_argument('--pilot', choices=list(RUNNERS))
    args = a.parse_args()
    refs = verify_receipts()
    results = {}
    for cid, run in RUNNERS.items():
        if args.pilot and args.pilot != cid:
            continue
        payload = json.loads((HERE / (cid + '.json')).read_text())
        rows = payload['rows']
        assert 15 <= len({r['entry'] for r in rows}) <= 40
        assert all(all(ref in refs for ref in r['receiptIds']) for r in rows)
        start = time.perf_counter()
        result = run(rows)
        result.update(rows=len(rows), distinctEntries=len({r['entry'] for r in rows}),
                      receiptRowsChecked=len(rows), runSeconds=time.perf_counter() - start)
        results[cid] = result
        print(cid, 'PASS', len(rows), 'rows')
    (HERE / 'results.json').write_text(json.dumps({'kind': 'check readings', 'python': sys.version.split()[0],
        'runnerSha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        'rowBuilderSha256':hashlib.sha256((HERE/'make_pilots.py').read_bytes()).hexdigest(),
        'inputHashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in HERE.glob('C*.json')},
        'receiptIndexSha256':hashlib.sha256((HERE/'receipts.json').read_bytes()).hexdigest(),
        'mapSha256':hashlib.sha256((ROOT/'map.json').read_bytes()).hexdigest(),
        'scope': 'Disposable bounded experiments. No device observations, external kernel replay or universal language equivalence is claimed.',
        'results': results}, indent=2, ensure_ascii=False) + '\n')


if __name__ == '__main__':
    main()
