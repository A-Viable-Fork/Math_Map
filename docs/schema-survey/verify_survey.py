# Role: checks the survey's frozen generation, complete rankings, receipts, bounded results and edit scope.
# Contract: python docs/schema-survey/verify_survey.py; read-only; run the pilots first; exits nonzero on drift.
# Invariant: this verifies survey consistency, never mathematical truth, universal transport or device behavior.
from pathlib import Path
import hashlib
import json
import subprocess

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(name):
    return json.loads((HERE / name).read_text())


def main():
    freeze = {'02-generation.md': 'ea5c9e3b7e0ba70c77f2b01208b3d741fe14b8d00a6ce678f91076de48443334',
              '02-candidates.json': 'ea0e2954797ae190c654333d60a761c1fab784d5b23c9a6f1e574a782f80be8c'}
    for name, expected in freeze.items():
        assert sha(HERE/name) == expected, 'generation changed: ' + name
    candidates = read('02-candidates.json')['candidates']
    ids = {c['id'] for c in candidates}
    assert len(ids) == len(candidates) == 64
    prior = read('03-prior-art-matrix.json')['candidates']
    assert {r['candidate'] for r in prior} == ids
    sources = {r['id']:r for r in read('03-prior-art-sources.json')['sources']}
    for r in sources.values():
        assert r['status'] == 'fetched'
        assert sha(ROOT/r['excerpt']) == r['excerptSha256']
        data = (ROOT/r['excerpt']).read_bytes()
        for quote, offset in zip(r['windows'], r['offsets']):
            assert data[offset['byteOffset']:offset['byteOffset']+offset['byteLength']] == quote.encode()
    for r in prior:
        assert all(ref in sources for ref in r['receipts'])
        assert r['status'] in {'exists','partial','unknown'}
    verdicts = read('verdicts.json')['verdicts']
    assert len(verdicts) == 64 and {r['candidate'] for r in verdicts} == ids
    assert [r['rank'] for r in verdicts] == list(range(1,65))
    assert all(r['cost'] and r['dayOneReader'] and r['reason'] for r in verdicts)
    pilot_ids = {'C02','C23','C15','C30','C33','C53'}
    assert {r['candidate'] for r in verdicts[:6]} == pilot_ids
    results = read('pilots/results.json')
    assert set(results['results']) == pilot_ids
    assert results['runnerSha256'] == sha(HERE/'pilots/run_pilots.py')
    assert results['rowBuilderSha256'] == sha(HERE/'pilots/make_pilots.py')
    assert results['receiptIndexSha256'] == sha(HERE/'pilots/receipts.json')
    assert results['mapSha256'] == sha(ROOT/'map.json')
    for name, expected in results['inputHashes'].items():
        assert sha(HERE/'pilots'/name) == expected
    rows = 0
    for cid in pilot_ids:
        data = read('pilots/'+cid+'.json')['rows']
        assert 15 <= len({r['entry'] for r in data}) <= 40
        assert all(r['kind'].startswith('generation') for r in data)
        result = results['results'][cid]
        assert result['rows'] == result['receiptRowsChecked'] == len(data)
        assert result['universalProofs'] == 0
        rows += len(data)
    assert rows == 103
    # The exact-byte source correction is additive: original snapshot identities stay visible.
    reading = read('01-reading-sources.json')
    corrected = [r for r in reading['sources'] if 'verifiedSourceSha256' in r]
    assert len(corrected) == 19 and reading['corrections']
    assert all(r['sha256'] != r['verifiedSourceSha256'] and len(r['gitBlobSha']) == 40 for r in corrected)
    # Scope is computed relative to the read main-branch base, not relative to the latest survey commit.
    changed = subprocess.check_output(['git','diff','--name-only','c6f8381284f67cf9e984dd75e00350a756f18880'],cwd=ROOT,text=True).splitlines()
    assert all(p.startswith('docs/schema-survey/') or p in {'repo-map-manifest.json','REPO-MAP.md'} for p in changed), changed
    for p in HERE.rglob('*'):
        if p.is_file() and p.suffix in {'.md','.py'}:
            assert not any(c in p.read_text() for c in ['\u2013','\u2014']), 'authored dash: ' + str(p)
    print('survey: PASS, 64 frozen candidates, 64 source matches/verdicts, 103 bounded pilot rows, production scope unchanged')


if __name__ == '__main__':
    main()
