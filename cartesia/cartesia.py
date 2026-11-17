#!/usr/bin/env python3
"""Cartesia helper run inside GitHub Actions (the key comes from the CARTESIA_API_KEY secret).
modes:
  list            -> out/voices.json (all voices visible to the account)
  tts <job.json>  -> out/<id>.wav + out/<id>.json (word timestamps) for every line in the job
job.json = {"model": "sonic-3", "lines": [{"id": "l01", "voice": "<voice_id>", "text": "...", "language": "es", "speed": 1.0, "emotion": ["positivity"]}]}
"""
import json, os, sys, base64, wave, urllib.request, urllib.error

KEY = os.environ.get('CARTESIA_API_KEY', '')
VER = '2025-04-16'
BASE = 'https://api.cartesia.ai'
OUT = 'out'
os.makedirs(OUT, exist_ok=True)

def req(method, path, body=None, stream=False):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(BASE + path, data=data, method=method, headers={'X-API-Key': KEY, 'Cartesia-Version': VER, 'Content-Type': 'application/json'})
    try:
        return urllib.request.urlopen(r, timeout=180)
    except urllib.error.HTTPError as e:
        print('HTTP', e.code, path, e.read()[:800].decode('utf8', 'replace'))
        raise

def list_voices():
    allv, after = [], None
    while True:
        q = '/voices/?limit=100' + (f'&starting_after={after}' if after else '')
        d = json.load(req('GET', q))
        items = d.get('data', d if isinstance(d, list) else [])
        allv += items
        if isinstance(d, dict) and d.get('has_more') and items:
            after = items[-1]['id']
        else:
            break
    json.dump(allv, open(f'{OUT}/voices.json', 'w'), ensure_ascii=False, indent=1)
    print('voices:', len(allv))

def tts(job_path):
    job = json.load(open(job_path))
    model = job.get('model', 'sonic-3')
    sr = 44100
    for ln in job['lines']:
        body = {'model_id': model, 'transcript': ln['text'], 'voice': {'mode': 'id', 'id': ln['voice']}, 'language': ln.get('language', 'es'),
                'output_format': {'container': 'raw', 'encoding': 'pcm_s16le', 'sample_rate': sr}, 'add_timestamps': True}
        ctl = {}
        if 'speed' in ln: ctl['speed'] = ln['speed']
        if 'emotion' in ln: ctl['emotion'] = ln['emotion']
        if ctl:
            if model.startswith('sonic-3'):
                body['generation_config'] = {k: v for k, v in [('speed', ln.get('speed')), ('emotion', (ln.get('emotion') or [None])[0])] if v is not None}
            else:
                body['voice']['__experimental_controls'] = ctl
        try:
            resp = req('POST', '/tts/sse', body)
        except Exception:
            if model != 'sonic-2':
                body['model_id'] = 'sonic-2'; body.pop('generation_config', None)
                resp = req('POST', '/tts/sse', body)
            else:
                raise
        pcm, words = bytearray(), {'words': [], 'start': [], 'end': []}
        for raw in resp:
            line = raw.decode('utf8', 'replace').strip()
            if not line.startswith('data:'): continue
            try: ev = json.loads(line[5:].strip())
            except Exception: continue
            if ev.get('type') == 'chunk' and ev.get('data'): pcm += base64.b64decode(ev['data'])
            elif ev.get('type') == 'timestamps' and ev.get('word_timestamps'):
                wt = ev['word_timestamps']
                for k in words: words[k] += wt.get(k, [])
            elif ev.get('type') == 'error': print('error event', ln['id'], ev)
        with wave.open(f"{OUT}/{ln['id']}.wav", 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(bytes(pcm))
        json.dump({'id': ln['id'], 'text': ln['text'], 'dur': len(pcm) / 2 / sr, **words}, open(f"{OUT}/{ln['id']}.json", 'w'), ensure_ascii=False)
        print(ln['id'], round(len(pcm) / 2 / sr, 2), 's', len(words['words']), 'words')

if __name__ == '__main__':
    if not KEY: sys.exit('CARTESIA_API_KEY secret missing')
    if sys.argv[1] == 'list': list_voices()
    else: tts(sys.argv[2])
