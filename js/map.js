/* map.js — nodos do sistema, eventos e todas as ações do jogador (VR.act) */
(()=>{
const rnd=VR.rnd,L=(...a)=>VR.L(...a),R=()=>VR.r,PAIRS=["mc","md","cm","cd","dm","dc"];
VR.genNodes=()=>{const W=VR.P().w||{},ts=Object.keys(VR.NODE),MW=VR.MD().wm||{},w=t=>(W[t]||VR.NODE[t].w)*(MW[t]||1),tot=ts.reduce((s,t)=>s+w(t),0);   // pesos dependem do planeta
 return Array.from({length:6},()=>{let x=Math.random()*tot,t;for(t of ts){x-=w(t);if(x<=0)break}return{t,done:0}})};
VR.exploreCost=()=>Math.round((25+R().jump*10)*(R().slow>0?1.5:1)*VR.MD().ec);
const gainQ=n=>{VR.G.meta.q+=n;R().qb+=n;L(`+${n} Fragmentos Quânticos!`,"s")};
// Anomalia: aumenta a ameaça, abranda a frota ou acelera a ameaça temporariamente
function anomaly(){const r=R(),x=rnd(3);
 if(x==0){r.th=Math.min(99,r.th+15);L("Singularidade instável: ameaça +15%.","x")}
 else if(x==1){r.slow=90;L("Dilatação temporal: frota lenta durante 90s (menos cadência de tiro, exploração +50%).","x")}
 else{r.acc=60;L("Distorção gravítica: a ameaça acelera x2 durante 60s.","x")}
 const d=80+r.jump*30;r.r[2]+=d;L(`Recolhidos ${d} deutério junto ao horizonte de eventos.`,"g");VR.sfx.bad();VR.scene.shake=10}
function explore(k){const r=R(),n=r.nodes[k],dc=VR.exploreCost();
 if(!VR.fleet()){L("Precisas de pelo menos uma nave para explorar.","x");VR.sfx.err();return}
 if(r.r[2]<dc||n.done)return;r.r[2]-=dc;n.done=1;r.ex++;
 if(n.t=="ast"){const f=VR.fleet(),k=VR.MD().ast;r.r[0]+=k*(300+r.jump*150+f*40);r.r[1]+=k*(180+r.jump*90+f*25);r.r[2]+=k*(60+f*8);L("Asteroides explorados: recursos recolhidos.","g");VR.sfx.coin()}
 else if(n.t=="sos"){r.ev={t:"sos"};L("Sinal de socorro detetado! Escolhe o que fazer.","s")}
 else if(n.t=="mer"){r.ev={t:"mer",rt:{mc:.5+rnd(25)/100,md:.35+rnd(25)/100,cm:1.2+rnd(40)/100,cd:.5+rnd(25)/100,dm:2.2+rnd(60)/100,dc:1.5+rnd(40)/100}};L("Um mercador interestelar oferece trocas.","s")}
 else if(n.t=="rui"){r.ev={t:"rui"};L("Ruínas antigas à vista... risco elevado, grande recompensa.","s")}
 else if(n.t=="bh")anomaly();
 else{L("Frota hostil encontrada!","x");VR.startBattle({n:2+r.jump*2+rnd(3),a:4,h:20,loot:1})}}
function event(k){const r=R(),ev=r.ev,j=r.jump;r.ev=null;
 if(ev.t=="sos"){if(k=="h"){if(Math.random()<.55){if(Math.random()<.5){r.sh.hf++;L("Sobreviventes juntam-se à frota: +1 Caça Pesado!","g")}else{r.r[0]+=800+j*300;r.r[1]+=500+j*200;L("Carga abandonada recuperada!","g")}VR.sfx.good()}
   else{L("Emboscada pirata!","x");VR.startBattle({n:3+j*2,a:5,h:22,loot:1})}}else{r.r[1]+=120+j*40;L("Ignoraste o sinal e recolheste destroços (+cristal).")}}
 else if(ev.t=="rui"){if(k=="ra"){const x=Math.random();
   if(x<.25)gainQ(2+rnd(5));
   else if(x<.5){const t=Math.random()<.5?"w":"e";r.rs[t]++;L(`Tecnologia antiga! ${VR.RS[t].n} sobe para o nível ${r.rs[t]}.`,"s");VR.sfx.good()}
   else if(x<.7){r.r[0]+=1500+j*500;r.r[1]+=1000+j*400;r.r[2]+=300+j*100;L("Cofre das ruínas: grande carga de recursos!","g");VR.sfx.good()}
   else{L("Os guardiões das ruínas despertaram!","x");VR.startBattle({n:4+j*2,a:8,h:35,big:1,loot:1,title:"GUARDIÕES",done:w=>{if(w)gainQ(3)}})}}
  else{r.r[0]+=200+j*80;r.r[1]+=120+j*50;if(Math.random()<.15)gainQ(1);else L("Vasculhaste o exterior das ruínas: pouca coisa, mas seguro.","g")}}}
function trade(p){const r=R(),ev=r.ev;if(!ev||ev.t!="mer")return;const i="mcd".indexOf(p[0]),o="mcd".indexOf(p[1]),a=Math.floor(r.r[i]*.3);
 if(a<10){VR.sfx.err();return}r.r[i]-=a;const g=Math.floor(a*ev.rt[p]);r.r[o]+=g;L(`Troca: ${VR.fmt(a)} ${"MCD"[i]} → ${VR.fmt(g)} ${"MCD"[o]}`,"g");VR.sfx.coin()}
VR.act=(a,k)=>{VR.audio.init();VR.sfx.click();const r=R();if(!r)return;const bt=VR.battle.on;const st0=JSON.stringify([r.b,r.sh,r.rs,r.ex]);   // para detetar a 1.ª ação bem-sucedida
 
 if(a=="b"){const c=VR.costB(k);if(VR.can(c)){VR.pay(c);r.b[k]++;VR.sfx.build();L(`${VR.B[k].n} → nível ${r.b[k]}`)}else VR.sfx.err()}
 if(a=="r"){const c=VR.costR(k);if(VR.can(c)&&r.b.lab>r.rs[k]){VR.pay(c);r.rs[k]++;VR.sfx.build();L(`${VR.RS[k].n} → nível ${r.rs[k]}`,"s")}else VR.sfx.err()}
 if(a=="s"){const c=VR.costS(k);if(r.b.hg&&VR.can(c)&&VR.fleet()<VR.cap()){VR.pay(c);r.sh[k]++;VR.sfx.build();L(`${VR.S[k].n} construído`)}else{VR.sfx.err();if(VR.fleet()>=VR.cap())L("Capacidade do hangar cheia: melhora o Hangar.","x")}}
 if(a=="t"){r.off[k]=!r.off[k];(r.off[k]?VR.sfx.off:VR.sfx.on)();L(`${VR.B[k].n}: ${r.off[k]?"desligado":"ligado"}`)}
 if(a=="n"&&!r.ev&&!bt)explore(k);
 if(a=="e"&&r.ev&&!bt)event(k);
 if(a=="m")trade(k);
 if(a=="j"&&!bt){const dc=200*(r.jump+1);if(r.ex>=3&&r.r[2]>=dc){r.r[2]-=dc;r.jump++;VR.scene.warp=1;VR.sfx.warp();r.ev=null;
   if(r.jump>=10){VR.endRun(1,"Sobreviveste a 10 saltos!");return}r.th=15;r.mod=VR.nextMod(r.mod);r.nodes=VR.genNodes();r.ex=0;L(`Sistema: ${VR.MD().n} — ${VR.MD().d}`,"s");VR.scene.rebuild();L(`SALTO ${r.jump}/10 concluído. Novo sistema, ameaça mais rápida.`,"s")}}
 if(!r.go&&JSON.stringify([r.b,r.sh,r.rs,r.ex])!=st0)r.go=1;   // 1.ª construção/exploração inicia a ameaça
 VR.render();VR.save()};
})();
