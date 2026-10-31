/* audio.js — motor de som sintetizado (WebAudio): música por fase + efeitos */
(()=>{
let ctx,mg,mute=false,next=0,step=0;
// Fases musicais: calm (base), tense (ameaça>80%), battle (combate). root em Hz, chords em semitons.
const PH={calm:{bpm:76,root:110,ch:[[0,3,7],[-4,0,3],[3,7,10],[-2,2,5]],arp:[0,2,1,2,1,2,0,1],wave:"sine"},
 tense:{bpm:104,root:98,ch:[[0,1,6],[0,1,5],[-2,1,6],[0,3,6]],arp:[0,2,1,2,0,2,1,1],wave:"triangle"},
 battle:{bpm:150,root:82.4,ch:[[0,3,7],[0,3,7],[-2,3,7],[-4,0,7]],arp:[0,1,2,1,0,2,1,2],wave:"sawtooth"}};
const A=VR.audio={ph:"calm",
 init(){if(ctx)return;ctx=new(window.AudioContext||window.webkitAudioContext)();mg=ctx.createGain();mg.gain.value=mute?0:.5;
  const cp=ctx.createDynamicsCompressor(),dl=ctx.createDelay(),fb=ctx.createGain(),wet=ctx.createGain();dl.delayTime.value=.28;fb.gain.value=.3;wet.gain.value=.25;
  mg.connect(cp);cp.connect(ctx.destination);mg.connect(dl);dl.connect(fb);fb.connect(dl);dl.connect(wet);wet.connect(cp);   // eco/reverb simples
  next=ctx.currentTime+.1;setInterval(sched,100)},
 toggle(){mute=!mute;if(mg)mg.gain.value=mute?0:.5;return mute},get muted(){return mute}};
const hz=(r,n)=>r*2**(n/12);
function note(f,t,d,ty="sine",v=.06,f2){const o=ctx.createOscillator(),g=ctx.createGain();o.type=ty;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
 g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+Math.min(.03,d/3));g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.05)}
function noise(t,d,v=.3,fq=800,type="lowpass"){const n=ctx.sampleRate*d,b=ctx.createBuffer(1,n,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
 const s=ctx.createBufferSource(),g=ctx.createGain(),f=ctx.createBiquadFilter();f.type=type;f.frequency.value=fq;g.gain.value=v;s.buffer=b;s.connect(f);f.connect(g);g.connect(mg);s.start(t)}
// Agendador: toca 1 passo (semicolcheia) de cada vez, ligeiramente à frente do relógio de áudio
function sched(){if(!ctx||mute)return;const p=PH[A.ph],sd=60/p.bpm/2;
 while(next<ctx.currentTime+.25){play(p,step,next,sd);next+=sd;step++}}
function play(p,s,t,sd){const bar=Math.floor(s/16)%p.ch.length,ch=p.ch[bar],b=A.ph;
 if(s%16==0)ch.forEach((n,i)=>note(hz(p.root,n),t,sd*16,"triangle",.035));                                   // pad
 const an=ch[p.arp[s%8]%3];
 if(b=="calm"){if(s%2==0&&(s%4==0||Math.random()<.5))note(hz(p.root*4,an),t,sd*3,p.wave,.045);if(s%8==0)note(p.root/2,t,sd*7,"sine",.07)}
 else if(b=="tense"){note(hz(p.root*2,an),t,sd*.9,"square",.018);if(s%2==0)note(p.root/2,t,sd*1.6,"sawtooth",.05+VR.threatLevel()/4000);if(s%16==8)note(hz(p.root*8,ch[1]),t,sd*6,"sine",.03)}
 else{note(hz(p.root*4,an),t,sd*.8,"square",.03);if(s%2==0)note(p.root/2,t,sd*1.5,"sawtooth",.07);if(s%4==0)noise(t,.12,.25,180);if(s%4==2)noise(t,.05,.08,6000,"highpass");   // kick/hat
  if(s%16>=12)note(hz(p.root*8,ch[s%3]),t,sd,"square",.02)}}
VR.threatLevel=()=>VR.r?VR.r.th:0;
// Efeitos sonoros (usar sempre via VR.sfx.nome())
const S=f=>(...a)=>{if(ctx&&!mute)f(ctx.currentTime,...a)};
VR.sfx={
 click:S(t=>{note(740,t,.05,"square",.04);note(990,t+.04,.05,"square",.03)}),
 hover:S(t=>note(1200,t,.02,"sine",.015)),
 build:S(t=>[440,554,659,880].forEach((f,i)=>note(f,t+i*.06,.12,"square",.045))),
 err:S(t=>{note(200,t,.12,"sawtooth",.06);note(150,t+.1,.18,"sawtooth",.06)}),
 on:S(t=>note(500,t,.15,"triangle",.07,900)),off:S(t=>note(700,t,.15,"triangle",.07,320)),
 laser:S(t=>note(1400,t,.12,"square",.018,300)),
 boom:S(t=>{noise(t,.7,.5,700);note(90,t,.5,"sawtooth",.12,30)}),
 hit:S(t=>noise(t,.08,.12,2500)),
 shield:S(t=>{note(300,t,.6,"sine",.1,1200);note(600,t+.1,.5,"triangle",.06,1800)}),
 aoe:S(t=>{noise(t,.9,.55,500);note(500,t,.7,"sawtooth",.1,40)}),
 over:S(t=>[330,440,660,880].forEach((f,i)=>note(f,t+i*.05,.25,"sawtooth",.05))),
 coin:S(t=>{note(988,t,.07,"square",.05);note(1319,t+.07,.2,"square",.05)}),
 good:S(t=>[523,659,784,1046].forEach((f,i)=>note(f,t+i*.08,.25,"triangle",.07))),
 bad:S(t=>{note(180,t,.3,"sawtooth",.08,90);note(120,t+.15,.4,"sawtooth",.08,60)}),
 warp:S(t=>{for(let i=0;i<14;i++)note(200+i*90,t+i*.05,.25,"sawtooth",.035);noise(t,.9,.2,3000,"bandpass")}),
 alarm:S(t=>{for(let i=0;i<4;i++)note(i%2?600:880,t+i*.18,.16,"square",.05)}),
 win:S(t=>[392,523,659,784,1046].forEach((f,i)=>note(f,t+i*.1,.3,"triangle",.08))),
 lose:S(t=>[330,262,196,131].forEach((f,i)=>note(f,t+i*.2,.4,"sawtooth",.07)))};
})();
