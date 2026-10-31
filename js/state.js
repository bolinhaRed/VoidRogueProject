/* state.js — estado global, utilitários, custos, gravação e carregamento */
(()=>{
const KEY="voidrogue_v2";
VR.$=s=>document.querySelector(s);VR.rnd=n=>Math.floor(Math.random()*n);
VR.G={meta:{q:0,u:{},best:0},run:null};VR.r=null;
VR.fmt=n=>n>=1e6?(n/1e6).toFixed(1)+"M":n>=1e4?(n/1e3).toFixed(1)+"k":Math.floor(n);
VR.lvl=k=>VR.G.meta.u[k]||0;                      // nível de uma melhoria de legado
VR.on=k=>!VR.r.off[k];                             // edifício ligado?
VR.costB=k=>VR.B[k].c.map(x=>Math.floor(x*1.5**VR.r.b[k]*(1-.04*VR.lvl("cd"))));
VR.costR=k=>VR.RS[k].c.map(x=>Math.floor(x*1.6**VR.r.rs[k]));
VR.costS=k=>VR.S[k].c.map(x=>Math.floor(x*.97**VR.r.b.hg));
VR.can=c=>c.every((x,i)=>VR.r.r[i]>=x);VR.pay=c=>c.forEach((x,i)=>VR.r.r[i]-=x);
VR.fleet=()=>VR.T.reduce((s,t)=>s+VR.r.sh[t],0);
VR.cap=()=>10+5*VR.r.b.hg+5*VR.lvl("hc");
VR.dmgB=()=>1+.05*VR.lvl("dm")+.04*VR.r.rs.w+(VR.on("lab")?.03*VR.r.b.lab:0);
VR.hpB=()=>1+.04*VR.r.rs.e;
// Registo permanente (histórico) + notificação
VR.L=(m,c="")=>{const r=VR.r;r.log.unshift({t:Math.floor(r.age),c,m});if(r.log.length>300)r.log.length=300;if(c)VR.toast(m,c)};
VR.newRun=()=>{const s=VR.lvl("sr")*500;
 VR.r=VR.G.run={r:[500+s,300+s,100+s/2],b:{mm:1,mc:1,sd:0,ps:1,lab:0,hg:0,es:0},off:{},sh:{lf:0,hf:0,cr:0,bb:0,nv:VR.lvl("nv")},
  rs:{w:0,e:0},th:10,jump:0,nodes:VR.genNodes(),ex:0,age:0,t:Date.now(),ev:null,log:[],acc:0,slow:0,qb:0};
 VR.L("Nova campanha iniciada. A anomalia aproxima-se...","s");VR.save()};
VR.endRun=(win,msg)=>{const r=VR.r,m=VR.G.meta,q=Math.floor(r.jump*8+r.age/40)+(win?100:0);m.q+=q;m.best=Math.max(m.best,r.jump);
 const j=r.jump,a=Math.floor(r.age),b=r.qb;VR.G.run=VR.r=null;VR.save();
 VR.menu(`<b>${win?"VITÓRIA — Centro da Galáxia alcançado!":"GAME OVER"}</b><br><small>${msg} Saltos: ${j} · Tempo: ${a}s</small><br><span style="color:var(--pu)">+${q+b} Fragmentos Quânticos${b?` (${b} das ruínas)`:""}</span>`)};
VR.save=()=>{try{if(VR.r)VR.r.t=Date.now();localStorage.setItem(KEY,JSON.stringify(VR.G))}catch(e){}};
VR.load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(s)VR.G=s}catch(e){}
 VR.r=VR.G.run;const r=VR.r;if(!r)return;
 const dt=Math.min((Date.now()-r.t)/1000,28800);               // compensa tempo inativo (máx. 8h)
 if(dt>5){for(let i=0;i<Math.ceil(dt/60)&&VR.r;i++)VR.tick(Math.min(60,dt-i*60),1);
  if(VR.r)VR.L(`Ausente ${Math.floor(dt/60)} min: produção acumulada, ameaça em ${VR.r.th.toFixed(0)}%.`,"s")}};
})();
