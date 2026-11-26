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
    mine = req('GET', '/v2/voices?page_size=100')
    shared = req('GET', '/v1/shared-voices?page_size=100&language=es')
    json.dump({'mine': mine, 'shared_es': shared}, open(f'{OUT}/voices.json', 'w'), ensure_ascii=False, indent=1)
    print('mine', len(mine.get('voices', [])), 'shared_es', len(shared.get('voices', [])))
    try: print('subscription', req('GET', '/v1/user/subscription').get('tier'))
    except Exception: pass
def tts(job_path):
    job = json.load(open(job_path)); model = job.get('model', 'eleven_v3')
    for ln in job['lines']:
        vs = {'stability': ln.get('stability', 0.4), 'similarity_boost': ln.get('similarity', 0.8), 'style': ln.get('style', 0.6), 'use_speaker_boost': True}
        if model == 'eleven_v3': vs = {'stability': ln.get('stability', 0.5)}
        body = {'text': ln['text'], 'model_id': ln.get('model', model), 'voice_settings': vs, 'language_code': ln.get('language', 'es')}
        if model != 'eleven_v3' and 'speed' in ln: body['voice_settings']['speed'] = ln['speed']
        try:
            d = req('POST', f"/v1/text-to-speech/{ln['voice']}/with-timestamps?output_format=mp3_44100_192", body)
        except Exception:
            body.pop('language_code', None); d = req('POST', f"/v1/text-to-speech/{ln['voice']}/with-timestamps?output_format=mp3_44100_192", body)
        open(f"{OUT}/{ln['id']}.mp3", 'wb').write(base64.b64decode(d['audio_base64']))
        al = d.get('normalized_alignment') or d.get('alignment') or {}
        json.dump({'id': ln['id'], 'text': ln['text'], 'chars': al.get('characters', []), 'start': al.get('character_start_times_seconds', []), 'end': al.get('character_end_times_seconds', [])}, open(f"{OUT}/{ln['id']}.json", 'w'), ensure_ascii=False)
        print(ln['id'], 'ok')
if __name__ == '__main__':
    if not KEY: sys.exit('ELEVENLABS_API_KEY secret missing')
    print('key length', len(KEY))
    list_voices() if sys.argv[1] == 'list' else tts(sys.argv[2])
