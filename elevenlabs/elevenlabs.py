#!/usr/bin/env python3
"""ElevenLabs helper run inside GitHub Actions (key from the ELEVENLABS_API_KEY secret; never printed).
modes:
  list            -> out/voices.json (voices in the account + shared library search for Spanish)
  tts <job.json>  -> out/<id>.mp3 + out/<id>.json (character timestamps) per line
job.json = {"model": "eleven_v3", "lines": [{"id": "l01", "voice": "<voice_id>", "text": "[excited] ¡Hola!", "stability": 0.4}]}
"""
import json, os, sys, base64, urllib.request, urllib.error
KEY = os.environ.get('ELEVENLABS_API_KEY', '').strip()
BASE = 'https://api.elevenlabs.io'
OUT = 'out'; os.makedirs(OUT, exist_ok=True)
def req(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(BASE + path, data=data, method=method, headers={'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'application/json'})
    try:
        return json.load(urllib.request.urlopen(r, timeout=300))
    except urllib.error.HTTPError as e:
        print('HTTP', e.code, path, e.read()[:800].decode('utf8', 'replace')); raise
def list_voices():
    try: mine = req('GET', '/v2/voices?page_size=100')
    except Exception: mine = {}
    shared = {'voices': []}
    for acc in ['mexican', 'argentine', 'colombian', 'chilean', 'peninsular', 'latin american', 'caribbean', 'venezuelan', 'peruvian', 'cuban']:
        try: shared['voices'] += [dict(v, _q=acc) for v in req('GET', '/v1/shared-voices?page_size=60&language=es&gender=male&accent=' + acc.replace(' ', '%20')).get('voices', [])]
        except Exception as e: print('shared err', acc, e)
    json.dump({'mine': mine, 'shared_es': shared}, open(f'{OUT}/voices.json', 'w'), ensure_ascii=False, indent=1)
    print('mine', len(mine.get('voices', [])), 'shared_es', len(shared.get('voices', [])))
    try:
        m = req('GET', '/v1/models'); json.dump(m, open(f'{OUT}/models.json', 'w'), indent=1); print('models', [x.get('model_id') for x in m])
    except Exception as e: print('models err', e)
    try: print('subscription', req('GET', '/v1/user/subscription').get('tier'))
    except Exception: pass
def tts(job_path):
    job = json.load(open(job_path)); model = job.get('model', 'eleven_v3')
    for ln in job['lines']:
        vs = {'stability': ln.get('stability', 0.4), 'similarity_boost': ln.get('similarity', 0.8), 'style': ln.get('style', 0.6), 'use_speaker_boost': True}
        if model.startswith('eleven_v3') or model.startswith('eleven_v4'): vs = {'stability': ln.get('stability', 0.5)}
        body = {'text': ln['text'], 'model_id': ln.get('model', model), 'voice_settings': vs, 'language_code': ln.get('language', 'es')}
        if model != 'eleven_v3' and 'speed' in ln: body['voice_settings']['speed'] = ln['speed']
        if ln.get('owner'):
            try: req('POST', f"/v1/voices/add/{ln['owner']}/{ln['voice']}", {'new_name': ln.get('name', ln['voice'])[:40]})
            except Exception as e: print('add voice (maybe already added)', ln['voice'])
        d = None
        for m in [body['model_id'], 'eleven_v3', 'eleven_multilingual_v2']:
            body['model_id'] = m
            if m == 'eleven_multilingual_v2': body['voice_settings'] = {'stability': 0.35, 'similarity_boost': 0.8, 'style': 0.7, 'use_speaker_boost': True}; body['text'] = __import__('re').sub(r'\[[^\]]*\]\s*', '', body['text'])
            try:
                d = req('POST', f"/v1/text-to-speech/{ln['voice']}/with-timestamps?output_format=mp3_44100_192", body); break
            except Exception:
                try:
                    b2 = dict(body); b2.pop('language_code', None); d = req('POST', f"/v1/text-to-speech/{ln['voice']}/with-timestamps?output_format=mp3_44100_192", b2); break
                except Exception: print('model failed', m)
        print(ln['id'], 'model', body['model_id'])
        open(f"{OUT}/{ln['id']}.mp3", 'wb').write(base64.b64decode(d['audio_base64']))
        al = d.get('normalized_alignment') or d.get('alignment') or {}
        json.dump({'id': ln['id'], 'text': ln['text'], 'chars': al.get('characters', []), 'start': al.get('character_start_times_seconds', []), 'end': al.get('character_end_times_seconds', [])}, open(f"{OUT}/{ln['id']}.json", 'w'), ensure_ascii=False)
        print(ln['id'], 'ok')
if __name__ == '__main__':
    if not KEY: sys.exit('ELEVENLABS_API_KEY secret missing')
    print('key length', len(KEY))
    list_voices() if sys.argv[1] == 'list' else tts(sys.argv[2])
