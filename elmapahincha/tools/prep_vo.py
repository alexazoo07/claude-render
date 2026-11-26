# prep_vo.py <srcdir with id.mp3/id.json> <prefix> <tempo>
# -> public/sfx/vo_<prefix>_<id>.wav (trimmed, sped up), src/sh/vo_<prefix>.json {dur:{}, words:{id:[[word,t]]}}
import sys,json,glob,os,subprocess,re,unicodedata
import numpy as np
src,prefix,tempo=sys.argv[1],sys.argv[2],float(sys.argv[3])
def norm(w): return ''.join(c for c in unicodedata.normalize('NFD',w.lower()) if unicodedata.category(c)!='Mn' and c.isalnum())
out={'dur':{},'words':{}}
for mp in sorted(glob.glob(f'{src}/*.mp3')):
    k=os.path.basename(mp)[:-4]
    raw=subprocess.run(['ffmpeg','-loglevel','error','-i',mp,'-ac','1','-ar','48000','-f','f32le','-'],capture_output=True).stdout
    a=np.frombuffer(raw,np.float32); thr=10**(-42/20)
    idx=np.where(np.abs(a)>thr)[0]; lead=max(0,idx[0]/48000-0.02); tail=idx[-1]/48000+0.06
    o=f'public/sfx/vo_{prefix}_{k}.wav'
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',f'{lead:.3f}','-to',f'{tail:.3f}','-i',mp,'-af',f'atempo={tempo}','-ar','48000','-ac','2',o],check=True)
    dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',o]).decode())
    out['dur'][k]=round(dur,3)
    j=json.load(open(mp[:-4]+'.json')); txt=''.join(j['chars']); st=j['start']
    ws=[]; 
    for m in re.finditer(r'\[[^\]]*\]|[^\s\[\]]+',txt):
        if m.group().startswith('['): continue
        n=norm(m.group()); 
        if n: ws.append([n,round(max(0,(st[m.start()]-lead)/tempo),3)])
    out['words'][k]=ws
json.dump(out,open(f'src/sh/vo_{prefix}.json','w'),ensure_ascii=False)
print({k:v for k,v in out['dur'].items()}, sum(out['dur'].values()))
