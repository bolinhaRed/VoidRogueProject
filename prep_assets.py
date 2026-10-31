"""Seleciona/redimensiona os sprites dos ZIPs para assets/ e gera js/assets.js (manifesto)."""
from PIL import Image
import os,json
Z='/tmp/z/';C=Z+'cozy-space-ships/cozy-space-ships/';SP=Z+'Spaceship_Pack/';SK=Z+'Space_Pack/Space Pack/';PL=Z+'Pixel_Planets_Pack/Pixel_Planets_Pack/'
M={}
def put(key,src,size=None,crop=None):
    im=Image.open(src).convert('RGBA')
    if crop:im=im.crop(crop)
    if size:im.thumbnail((size,size),Image.NEAREST if size<=64 else Image.LANCZOS)
    p='assets/%s.png'%key;im.save('/tmp/vr/'+p,optimize=True);M[key]=p
for s in('sparrow','kestrel','heron','falcon'):
    put(s,C+'ships/1x/%s-cream.png'%s);put(s+'_t',C+'ships/1x/%s-cream-thrust-4f.png'%s)
    put('e_'+s,C+'ships/1x/%s-slate.png'%s);put('e_%s_t'%s,C+'ships/1x/%s-slate-thrust-4f.png'%s)
put('n_sos',C+'ships/1x/moth-cream.png');put('n_mer',C+'ships/1x/tortoise-sand.png')
put('fenix',SP+'ship_1.png');put('eye',SK+'Enemies/EvilEye_1.png',48)
for k,f in(('laser_t','laser-teal'),('laser_r','laser-rose'),('plasma_t','plasma-teal-4f'),('plasma_r','plasma-rose-4f'),('missile','missile-2f')):put(k,C+'projectiles/1x/%s.png'%f)
for n in(16,32,48):put('ex%d'%n,C+'explosions/1x/explosion-%d-8f.png'%n)
for i,n in enumerate(('001_earth1','012_mars','011_jupiter','037_ice','039_volcano','015_purple','040_greenland','017_saturn','038_redice','018_uranus')):put('P%d'%i,PL+'128x128/%s_a_128.png'%n)
for k,n in(('moon','005_moon'),('sun','004_sun'),('n_rui','045_egypt'),('n_bh','048_blackhole'),('ic_c','031_jewel'),('ic_d','043_water'),('a_sh','029_white'),('a_od','059_yellowcomet1')):put(k,PL+'64x64/%s_a_64.png'%n)
put('bh',PL+'128x128/048_blackhole_a_128.png');put('n_ast',SK+'Asteroids/Asteroid_1.png',44)
put('ic_m',SK+'Box/Cube_2.png',32);put('ic_e',SP+'energy.png',None,(0,0,48,48));put('a_aoe',C+'explosions/1x/explosion-32-8f.png',None,(96,0,128,32))
for k,f in(('b_mm','Turrets/Base_1.png'),('b_mc','Turrets/Base_2.png'),('b_sd','Turrets/Base_4.png'),('b_lab','Spike Balls/LightOn_2.png'),('b_hg','Box/Cube_1.png'),('b_es','Turrets/Base_5.png')):put(k,SK+f,40)
M['b_ps']=M['ic_e'];M['n_cmb']=M['e_sparrow']
open('/tmp/vr/js/assets.js','w').write('/* assets.js — manifesto de imagens + pré-carregamento (gerado por prep_assets.py) */\nVR.ASSETS=%s;\nVR.img={};\nVR.loadAssets=cb=>{const ks=Object.keys(VR.ASSETS);let n=ks.length;ks.forEach(k=>{const i=new Image();i.onload=i.onerror=()=>{if(!--n)cb()};i.src=VR.ASSETS[k];VR.img[k]=i})};\n'%json.dumps(M,indent=1))
print(len(M),'assets',sum(os.path.getsize('/tmp/vr/'+p) for p in set(M.values()))//1024,'KB')
