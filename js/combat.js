/* combat.js — combate em tempo real com animação, habilidades ativas e passivas */
(()=>{
const B=VR.battle={on:false},rnd=VR.rnd;
const alive=a=>a.filter(u=>u.hp>0);
// Inicia uma batalha. o = {n: nº inimigos, a: ataque, h: casco, big, loot, title, done(win)}
VR.startBattle=o=>{const r=VR.r,k=1+.45*r.jump,us=[],es=[],pool=["e_sparrow","e_kestrel","e_heron","e_falcon"].slice(0,Math.min(4,2+Math.floor(r.jump/2)));
 VR.T.forEach(t=>{for(let i=0;i<r.sh[t];i++){const mx=VR.S[t].h*VR.hpB();us.push({t,hp:mx,mx,a:VR.S[t].a,cd:Math.random()*1.4,s:VR.S[t].spr})}});
 us.forEach((u,i)=>{u.x=70+(i%5)*30+rnd(6);u.y=24+(Math.floor(i/5)%7)*25+rnd(5)});
 for(let i=0;i<o.n;i++){const mx=o.h*k*VR.MD().hp;es.push({hp:mx,mx,a:o.a*k*VR.MD().ea,cd:Math.random()*1.6,s:o.big&&Math.random()<.6?"eye":pool[rnd(pool.length)],x:410-(i%5)*30-rnd(6),y:24+(Math.floor(i/5)%7)*25+rnd(5)})}
 Object.assign(B,{on:true,u:us,e:es,p:[],fx:[],t:0,sh:0,od:0,focus:null,rush:0,bl:0,cd:{sh:0,aoe:0,od:0},o,end:0,res:"",sc:0});
 VR.L(`${o.title||"Batalha"}: ${us.length} naves contra ${o.n} inimigos.`,"b");VR.sfx.alarm();VR.hudShow(true)};
const fx=(k,x,y,s)=>B.fx.push({k,x,y,s,t:0});
function dmg(tg,d){tg.hp-=d;if(tg.hp<=0){fx("ex",tg.x,tg.y,tg.mx>100?48:32);VR.sfx.boom();VR.scene.shake=6}else fx("ex",tg.x,tg.y,16)}
function shoot(from,to,own,d){B.p.push({x:from.x+(own?16:-16),y:from.y,to,own,d,k:own?"laser_t":"laser_r"});VR.sfx.laser()}
// Atualização por frame (dt em segundos); chamada pelo módulo da cena
VR.battleStep=dt=>{if(!B.on)return;B.t+=dt;const r=VR.r,sl=r.slow>0?.6:1;
 for(const k in B.cd)B.cd[k]=Math.max(0,B.cd[k]-dt);B.sh=Math.max(0,B.sh-dt);B.od=Math.max(0,B.od-dt);B.rush=Math.max(0,B.rush-dt);B.bl=Math.max(0,B.bl-dt);
 if(!B.end){const us=alive(B.u),es=alive(B.e);
  const avg=us.length?us.reduce((s,u)=>s+u.hp/u.mx,0)/us.length:1,fury=avg<.5?1.25:1;                         // passiva: Fúria
  us.forEach(u=>{u.hp=Math.min(u.mx,u.hp+u.mx*.008*dt);u.cd-=dt;                                              // passiva: Nanobots
   if(u.cd<=0&&es.length){u.cd=(1.4+Math.random()*.4)/sl/(B.rush>0?2:1);shoot(u,B.focus&&B.focus.hp>0?B.focus:es[rnd(es.length)],1,u.a*VR.dmgB()*(B.od>0?1.6:1)*fury)}});
  es.forEach(e=>{e.cd-=dt;if(e.cd<=0&&us.length){e.cd=1.5+Math.random()*.5;shoot(e,us[rnd(us.length)],0,e.a/VR.hpB())}});
  if(!es.length)B.end=2.4,B.res="win";else if(!us.length)B.end=2.4,B.res="lose";else if(B.t>45)B.end=2.4,B.res="retreat"}
 else if((B.end-=dt)<=0)finish();
 B.p=B.p.filter(p=>{const g=p.to;if(g.hp<=0)return false;const dx=g.x-p.x,dy=g.y-p.y,d=Math.hypot(dx,dy),v=300*dt;
  if(d<v+6){if(p.own||B.sh<=0)dmg(g,p.d);else{fx("ex",g.x-10,g.y,16);VR.sfx.hit()}return false}
  p.x+=dx/d*v;p.y+=dy/d*v;p.a=Math.atan2(dy,dx);return true});
 B.fx=B.fx.filter(f=>(f.t+=dt)<(f.k=="ring"?.7:8/14))};
// Habilidades ativas (botões ou teclas 1-3)
VR.useAbil=id=>{if(!B.on||B.end||B.cd[id]>0)return;const a=VR.ABIL.find(x=>x.id==id);B.cd[id]=a.cd*(1-.08*VR.lvl("ab"));
 if(id=="sh"){B.sh=5;VR.sfx.shield()}
 if(id=="od"){B.od=6;VR.sfx.over()}
 if(id=="aoe"){VR.sfx.aoe();fx("ring",380,100);VR.scene.flash=.5;alive(B.e).forEach((e,i)=>setTimeout(()=>{if(e.hp>0)dmg(e,e.mx*.35)},i*60))}};
// Impulso: gasta Deutério em tempo real para reduzir recargas (-6s) e dobrar a cadência de tiro durante 4s
VR.boost=()=>{const r=VR.r;if(!B.on||B.end||B.bl>0)return;const c=40+10*r.jump;if(r.r[2]<c){VR.sfx.err();return}
 r.r[2]-=c;B.bl=3;B.rush=4;for(const k in B.cd)B.cd[k]=Math.max(0,B.cd[k]-6);VR.sfx.over();VR.scene.flash=.2};
function finish(){const r=VR.r,o=B.o;B.on=false;VR.hudShow(false);const left={};VR.T.forEach(t=>left[t]=0);alive(B.u).forEach(u=>left[u.t]++);
 const lost=VR.T.map(t=>r.sh[t]-left[t]?`${r.sh[t]-left[t]} ${VR.S[t].n}`:"").filter(Boolean).join(", ")||"nenhuma";r.sh=left;
 VR.L(`${B.res=="win"?"Vitória":B.res=="lose"?"Derrota":"Inimigo em retirada"} — perdas: ${lost}`,"b");
 if(B.res=="lose"||!VR.fleet()){VR.endRun(0,"A frota foi destruída.");return}
 if(B.res=="win"&&o.loot){const m=VR.MD().loot*o.n*(90+r.jump*40),c=VR.MD().loot*o.n*(50+r.jump*20),d=VR.MD().loot*o.n*(25+r.jump*10);r.r[0]+=m;r.r[1]+=c;r.r[2]+=d;VR.L(`Pilhagem: ${VR.fmt(m)} metal, ${VR.fmt(c)} cristal, ${VR.fmt(d)} deutério`,"g");VR.sfx.good()}
 if(o.done)o.done(B.res=="win");VR.render()}
})();
