/* ui.js — interface: barra de recursos, separadores, painéis, toasts, histórico, menu/legado, HUD de combate */
(()=>{
const $=VR.$,fmt=VR.fmt,img=(k,c="px")=>`<img class="${c}" src="${VR.img[k]?VR.img[k].src:""}" alt="">`;VR.ic=img;
const cache={},set=(id,h)=>{if(cache[id]!==h){cache[id]=h;$("#"+id).innerHTML=h}};
const cs=c=>c.map((v,i)=>`<i class="${VR.r.r[i]>=v?"ok":"no"}">${img(["ic_m","ic_c","ic_d"][i],"mi")}${fmt(v)}</i>`).join("");
let filter="";
/* ---------- Toasts (notificações) ---------- */
const TI={g:"ic_m",x:"n_cmb",b:"a_aoe",s:"n_sos"};
VR.toast=(m,c)=>{const t=$("#toasts"),d=document.createElement("div");d.className="ts "+c;d.innerHTML=`${img(TI[c]||"ic_e","ti")}<span></span><u></u>`;d.querySelector("span").textContent=m;
 d.onclick=()=>d.remove();t.prepend(d);setTimeout(()=>d.remove(),4600);while(t.children.length>4)t.lastChild.remove()};
/* ---------- Separadores ---------- */
VR.tab=t=>{document.body.dataset.tab=t;document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("on",b.dataset.t==t));VR.sfx.click()};
/* ---------- Renderização principal (só altera o DOM se o HTML mudou) ---------- */
VR.render=()=>{const r=VR.r;if(!r)return;const e=VR.eco(),bt=VR.battle.on;
 set("res",[["ic_m","Metal",r.r[0],e.m],["ic_c","Cristal",r.r[1],e.c],["ic_d","Deutério",r.r[2],e.d]].map(([i,n,v,p])=>`<div class="ch">${img(i,"ci")}<div><small>${n}</small><b>${fmt(v)}</b><em>+${p.toFixed(1)}/s</em></div></div>`).join("")+
  `<div class="ch ${e.ef<1?"bad":""}">${img("ic_e","ci")}<div><small>Energia</small><b>${Math.floor(e.prod)}/${e.cons}</b><em>${Math.round(e.ef*100)}%</em></div></div>`);
 const sl=Math.max(0,(100-r.th)/VR.trate()),m=Math.floor(sl/60);
 $("#thl").innerHTML=`Ameaça <b>${r.th.toFixed(1)}%</b> · ${r.go?`impacto em <b>${m}:${String(Math.floor(sl%60)).padStart(2,"0")}</b>`:"<b>em pausa</b> (começa na 1.ª ação)"}${r.acc>0?` <span class="bd">ACELERADA ${Math.ceil(r.acc)}s</span>`:""}${r.slow>0?` <span class="bd">FROTA LENTA ${Math.ceil(r.slow)}s</span>`:""}`;
 $("#thf").style.width=Math.min(100,r.th)+"%";$("#sysl").innerHTML=`SISTEMA ${r.jump+1}/10<br><small>${VR.MD().n} · ${Math.floor(r.age/60)}m ${Math.floor(r.age%60)}s</small>`;
 $("#mt").textContent=VR.audio.muted?"Som: OFF":"Som: ON";
 $("#obj").textContent=obj(e);
 set("pinfo",`<b>${esc(r.name)}</b> · ${VR.P().n}<div class="mods">${modChips(VR.P())}</div>`);$("#pname").textContent=r.name+" [renomear]";
 // Base
 set("mdinfo",`<b>${VR.MD().n}</b> <span class="mu">${VR.MD().d}</span>`);
 set("bl",Object.keys(VR.B).map(k=>{const c=VR.costB(k),ok=VR.can(c),B=VR.B[k];return`<div class="it ${ok?"af":""} ${r.off[k]?"off":""}">${img(B.ic,"ic")}<div class="tx"><b>${B.n}</b><span class="lv">Nv ${r.b[k]}</span><small>${B.d}${B.e?` · ${B.e}/nv energia`:""}</small><div class="cs">${cs(c)}</div></div><button ${ok?"":"disabled"} onclick="VR.act('b','${k}')">+</button></div>`}).join(""));
 set("rl",Object.keys(VR.RS).map(k=>{const c=VR.costR(k),ok=VR.can(c)&&r.b.lab>r.rs[k],R=VR.RS[k];return`<div class="it ${ok?"af":""}">${img(R.ic,"ic")}<div class="tx"><b>${R.n}</b><span class="lv">Nv ${r.rs[k]}</span><small>${R.d} · requer Laboratório nv ${r.rs[k]+1}</small><div class="cs">${cs(c)}</div></div><button ${ok?"":"disabled"} onclick="VR.act('r','${k}')">+</button></div>`}).join(""));
 // Gestão de energia: consumo por edifício + interruptores
 const pct=e.cons?Math.min(100,e.prod/e.cons*100):100;
 set("eg",`<div class="gauge"><div style="width:${pct}%" class="${e.ef<1?"lo":""}"></div></div><p class="mono">Produção <b>${Math.floor(e.prod)}</b> · Consumo <b>${e.cons}</b> · Eficiência <b class="${e.ef<1?"neg":"pos"}">${Math.round(e.ef*100)}%</b></p>
  <p class="mu">${e.ef<1?"Défice de energia: minas e escudo rendem menos. Desliga instalações ou constrói Plantas Solares.":"Energia suficiente. Desligar uma instalação poupa a sua energia."}</p>`);
 set("el",`<div class="it ${r.off.ps?"off":""}">${img("b_ps","ic")}<div class="tx"><b>${VR.B.ps.n}</b><span class="lv">Nv ${r.b.ps}</span><small class="pos">+${Math.floor(e.prod)} energia</small></div><button class="sw ${r.off.ps?"":"on"}" onclick="VR.act('t','ps')">${r.off.ps?"OFF":"ON"}</button></div>`+
  e.rows.map(x=>{const B=VR.B[x.k],sh=e.cons?x.use/e.cons*100:0;return`<div class="it ${r.off[x.k]?"off":""}">${img(B.ic,"ic")}<div class="tx"><b>${B.n}</b><span class="lv">Nv ${r.b[x.k]}</span><small class="neg">${r.off[x.k]?`0 (poupa ${x.full})`:`-${x.use} energia`}</small><div class="gauge sm"><div style="width:${sh}%"></div></div></div><button class="sw ${r.off[x.k]?"":"on"}" onclick="VR.act('t','${x.k}')">${r.off[x.k]?"OFF":"ON"}</button></div>`}).join(""));
 // Frota
 const pa=Math.round(VR.T.reduce((s,t)=>s+r.sh[t]*VR.S[t].a,0)*VR.dmgB()),ph=Math.round(VR.T.reduce((s,t)=>s+r.sh[t]*VR.S[t].h,0)*VR.hpB()),cap=VR.cap();
 set("pw",`<div class="gauge"><div style="width:${VR.fleet()/cap*100}%"></div></div><p class="mono">Capacidade <b>${VR.fleet()}/${cap}</b> · ATQ <b>${fmt(pa)}</b> · Casco <b>${fmt(ph)}</b></p>`);
 set("fl",(r.b.hg?"":'<p class="warn">Constrói um Hangar para produzir naves.</p>')+VR.T.map(k=>{const S=VR.S[k];if(S.lock&&!VR.lvl(S.lock))return`<div class="it off">${img(S.spr,"ic")}<div class="tx"><b>${S.n}</b><small>Bloqueado: compra "Projeto Fénix" no Terminal de Legado.</small></div></div>`;
  const c=VR.costS(k),ok=r.b.hg&&VR.can(c)&&VR.fleet()<cap;return`<div class="it ${ok?"af":""}">${img(S.spr,"ic")}<div class="tx"><b>${S.n}</b><span class="lv">x${r.sh[k]}</span><small>ATQ ${S.a} · Casco ${S.h}</small><div class="cs">${cs(c)}</div></div><button ${ok?"":"disabled"} onclick="VR.act('s','${k}')">+</button></div>`}).join(""));
 // Mapa
 const dc=VR.exploreCost();
 set("nodes",r.nodes.map((n,i)=>{const off=n.done||r.ev||bt||r.r[2]<dc,N=VR.NODE[n.t];return`<button class="nd ${n.done?"dn":""}" ${off?"disabled":""} onclick="VR.act('n',${i})">${n.done?img(N.ic,"ni"):'<span class="q">?</span>'}<small>${n.done?N.n:"Setor "+(i+1)+" · "+dc+" D"}</small></button>`}).join(""));
 const ev=r.ev;$("#ev").style.display=ev?"block":"none";
 set("ev",!ev?"":ev.t=="sos"?`<b>Sinal de socorro</b><p class="mu">Uma nave civil pede ajuda. Pode ser genuína... ou uma armadilha.</p><button onclick="VR.act('e','h')">Ajudar (risco)</button> <button onclick="VR.act('e','i')">Ignorar e recolher destroços</button>`:
  ev.t=="rui"?`<b>Ruínas antigas</b><p class="mu">Risco elevado: tecnologia, Fragmentos Quânticos... ou guardiões.</p><button class="dg" onclick="VR.act('e','ra')">Entrar nas ruínas</button> <button onclick="VR.act('e','rb')">Vasculhar o exterior (seguro)</button>`:
  `<b>Mercador interestelar</b><p class="mu">Troca 30% do recurso escolhido à taxa indicada.</p><div class="trd">`+["mc","md","cm","cd","dm","dc"].map(p=>{const i="mcd".indexOf(p[0]),o="mcd".indexOf(p[1]),a=Math.floor(r.r[i]*.3);return`<button ${a<10?"disabled":""} onclick="VR.act('m','${p}')">${fmt(a)} ${"MCD"[i]} → ${fmt(a*ev.rt[p])} ${"MCD"[o]}</button>`}).join("")+`</div><button onclick="VR.act('e','x')" style="margin-top:6px">Terminar comércio</button>`);
 const jc=200*(r.jump+1),ok=r.ex>=3&&r.r[2]>=jc&&!bt;set("jp",`<button ${ok?"":"disabled"} onclick="VR.act('j')" style="width:100%;padding:10px">Saltar para o próximo sistema<br><small>${jc} Deutério · nodos explorados ${Math.min(3,r.ex)}/3</small></button>`);
 // Histórico permanente (com filtros)
 const F=[["","Tudo"],["b","Combate"],["g","Ganhos"],["s","Eventos"],["x","Alertas"]];
 set("lf",F.map(([k,n])=>`<button class="${filter==k?"on":""}" onclick="VR.filt('${k}')">${n}</button>`).join(""));
 set("log",r.log.filter(l=>!filter||l.c==filter).map(l=>`<p class="${l.c}"><time>${String(Math.floor(l.t/60)).padStart(2,"0")}:${String(l.t%60).padStart(2,"0")}</time>${l.m.replace(/</g,"&lt;")}</p>`).join("")||'<p class="mu">Sem registos.</p>')};
VR.filt=k=>{filter=k;VR.render()};
function obj(e){const g=VR.r;if(VR.battle.on)return"COMBATE! Clica num inimigo para focar o fogo, usa as habilidades (1-3) e o Impulso (4, gasta Deutério).";if(!g.go)return"Planeia à vontade: a Ameaça só começa a subir quando construíres algo ou explorares um setor.";if(g.th>85)return"AMEAÇA CRÍTICA! Salta de sistema ou prepara a frota para o ataque massivo.";
 if(e.ef<1)return"Energia insuficiente: constrói Plantas Solares ou desliga instalações no separador Energia.";if(!g.b.hg)return"Objetivo: constrói um Hangar de Naves para poderes produzir uma frota.";
 if(!VR.fleet())return"Objetivo: constrói as tuas primeiras naves no separador Frota.";if(g.ex<3)return`Objetivo: explora ${3-g.ex} nodo(s) no separador Mapa para abrir o salto.`;
 if(g.r[2]<200*(g.jump+1))return"Objetivo: junta Deutério suficiente para o salto de sistema.";return"Tudo pronto: salta para o próximo sistema!"}
/* ---------- HUD de combate (botões das habilidades sobre a cena) ---------- */
VR.hudShow=v=>{$("#bhud").style.display=v?"flex":"none";if(v){$("#abil").innerHTML=VR.ABIL.map(a=>`<button class="ab" id="ab_${a.id}" onclick="VR.useAbil('${a.id}')" title="${a.d}">${img(a.ic,"ai")}<span>${a.k}</span><small>${a.n}</small><i></i></button>`).join("")+`<button class="ab" id="ab_bst" onclick="VR.boost()" title="Gasta Deutério: -6s nas recargas e cadência dupla durante 4s">${img("ic_d","ai")}<span>4</span><small>Impulso</small></button><p class="mu">Clica num inimigo para focar o fogo · ${VR.PASS.join(" · ")}</p>`}};
VR.hud=()=>{const B=VR.battle;let n=0;const bb=$("#ab_bst");if(bb){const c=40+10*VR.r.jump;bb.classList.toggle("rdy",VR.r.r[2]>=c&&!(B.bl>0));bb.querySelector("small").textContent=`Impulso (${c} D)`}for(const a of VR.ABIL){const b=$("#ab_"+a.id);if(!b)continue;const cd=B.cd[a.id],tot=a.cd*(1-.08*VR.lvl("ab"));b.classList.toggle("rdy",!cd);b.classList.toggle("act",(a.id=="sh"&&B.sh>0)||(a.id=="od"&&B.od>0));b.querySelector("i").style.height=(cd?cd/tot*100:0)+"%"}
 const u=B.u.filter(x=>x.hp>0).length,e=B.e.filter(x=>x.hp>0).length;$("#bst").textContent=B.end?(B.res=="win"?"VITÓRIA":B.res=="lose"?"DERROTA":"INIMIGO EM RETIRADA"):`Frota ${u}/${B.u.length}  ·  Inimigos ${e}/${B.e.length}`;
 if(B.end&&B.res!="retreat"&&!B.snd){B.snd=1;(B.res=="win"?VR.sfx.win:VR.sfx.lose)()}};
/* ---------- Menu: Jogar (escolha de planeta) / Legado / Classificação / Como jogar ---------- */
const NM=["Nova Esperança","Colónia Alfa","Porto Estelar","Refúgio Zero","Ítaca","Bastião Lunar","Eco do Vazio","Aurora","Última Fronteira","Posto Órfão"];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
VR.sel={pl:"terra",name:NM[VR.rnd(NM.length)]};let mt="j",sort="score";
const MOD=[["m","Metal",1],["c","Cristal",1],["de","Deutério",1],["en","Energia solar",1],["th","Ameaça",-1],["cost","Custo edifícios",-1]];
const modChips=P=>MOD.filter(([k])=>P[k]&&P[k]!=1).map(([k,n,s])=>{const p=Math.round((P[k]-1)*100);return`<span class="mod ${(p>0)==(s>0)?"g":"b"}">${p>0?"+":""}${p}% ${n}</span>`}).join("")+(P.cap?`<span class="mod g">+${P.cap} capacidade</span>`:"")+(P.q>1?`<span class="mod g">+${Math.round((P.q-1)*100)}% Fragmentos</span>`:"")+(P.w&&P.w.rui?'<span class="mod g">Ruínas frequentes</span>':"")+(P.sm>1?`<span class="mod">Pontos x${P.sm}</span>`:"");
const pimg=k=>VR.img[VR.PL[k].sp].src;
function playTab(){const run=VR.G.run;
 if(run)return`<div class="it af"><img class="ic" src="${pimg(run.pl)}" alt=""><div class="tx"><b>${esc(run.name)}</b><small>${VR.PL[run.pl].n} · Sistema ${run.jump+1}/10 · ${Math.floor(run.age/60)} min</small></div><button style="width:auto;padding:0 12px" onclick="VR.go()">Continuar</button></div><p class="mu" style="margin-top:8px">Para começar noutro planeta, abandona primeiro a campanha atual (botão Abandonar).</p>`;
 return`<h3>1. Escolhe o planeta</h3><div class="pls">`+Object.keys(VR.PL).map(k=>{const P=VR.PL[k];return`<div class="pl ${VR.sel.pl==k?"sel":""}" onclick="VR.pick('${k}')"><img class="ic" src="${pimg(k)}" alt=""><b>${P.n}</b><small>${P.d}</small><div class="mods">${modChips(P)}</div></div>`}).join("")+
 `</div><h3>2. Dá-lhe um nome</h3><div class="nm"><input maxlength="24" value="${esc(VR.sel.name)}" oninput="VR.sel.name=this.value"><button onclick="VR.rollName()">Sortear</button></div><button style="width:100%;padding:12px;font-size:15px;margin-top:10px" onclick="VR.go()">Iniciar campanha</button>`}
function legTab(){const u=VR.G.meta.u,q=VR.G.meta.q;return`<p class="mu">Gasta Fragmentos Quânticos (FQ) em melhorias permanentes para as próximas campanhas. Tens <b style="color:var(--pu)">${q} FQ</b>.</p><div class="lg">`+Object.keys(VR.UP).map(k=>{const U=VR.UP[k],l=u[k]||0,c=U.b*(l+1),ok=q>=c&&l<U.m;return`<div class="it ${ok?"af":""}"><div class="tx"><b>${U.n}</b><span class="lv">${l}/${U.m}</span><small>${U.d} · ${l>=U.m?"MÁX":c+" FQ"}</small></div><button style="width:auto;padding:0 10px" ${ok?"":"disabled"} onclick="VR.buy('${k}')">Comprar</button></div>`}).join("")+`</div>`}
function boardTab(){const b=VR.G.meta.board.slice().sort((x,y)=>y[sort]-x[sort]||y.score-x.score);
 return`<div class="fl">${[["score","Pontuação"],["age","Tempo"],["jump","Saltos"]].map(([k,n])=>`<button class="${sort==k?"on":""}" onclick="VR.sort('${k}')">${n}</button>`).join("")}</div>`+
 (b.length?`<table class="tb"><tr><th>#</th><th>Planeta</th><th>Pontos</th><th>Dias</th><th>Saltos</th></tr>`+b.slice(0,15).map((e,i)=>`<tr class="${e.date==VR.hl?"hl":""}"><td>${i+1}</td><td><b>${esc(e.name)}</b><small>${VR.PL[e.pl]?VR.PL[e.pl].n:""}${e.win?" · VITÓRIA":""}</small></td><td class="mono">${fmt(e.score)}</td><td class="mono">${Math.floor(e.age/60)+1}</td><td class="mono">${e.jump}</td></tr>`).join("")+`</table>`:'<p class="mu">Ainda sem registos. Termina (ou perde) uma campanha para entrares no quadro.</p>')+
 `<p class="mu" style="margin-top:8px">Pontos = (saltos x 1000 + segundos sobrevividos + fragmentos x 50) x multiplicador do planeta (+5000 se vencer). 1 dia = 60 s.</p>`}
const HELP=[["Objetivo","Sobrevive a 10 saltos de sistema até ao Centro da Galáxia. Uma anomalia avança: quando a barra de Ameaça chega a 100% sofres um ataque massivo."],
 ["1. Economia","As minas produzem Metal, Cristal e Deutério, mas gastam energia: constrói Plantas Solares. No separador Energia podes ligar/desligar instalações."],
 ["2. Frota","Constrói um Hangar e depois naves. A capacidade é limitada e as perdas são permanentes nesta campanha."],
 ["3. Mapa","Explora setores (custa Deutério): asteroides, mercadores, ruínas, anomalias, socorros e combates. Com 3 explorados e Deutério suficiente, salta para outro sistema (a Ameaça desce mas acelera). Cada sistema tem um modificador próprio. A Ameaça só começa a subir depois da 1.ª ação e sobe mais depressa quanto mais energia consumires."],
 ["4. Combate","É em tempo real. Clica num inimigo para focar nele o fogo da frota. Habilidades nas teclas 1, 2 e 3: Escudo, Pulso de Plasma e Sobrecarga. Tecla 4 (Impulso): gasta Deutério para reduzir recargas e dobrar a cadência de tiro."],
 ["5. Planetas","Cada planeta tem bónus e penalizações. Planetas mais difíceis dão mais pontos."],
 ["6. Morte permanente","Quando perdes, ganhas Fragmentos Quânticos para o Legado e o resultado entra no Quadro de Classificação."]];
const helpTab=()=>HELP.map(([t,d])=>`<div class="hl2"><b>${t}</b><p>${d}</p></div>`).join("");
VR.menu=(h,t)=>{mt=t||mt;$("#ov").style.display="flex";
 const T=[["j","Jogar"],["l","Legado"],["c","Classificação"],["h","Como jogar"]],c=mt=="j"?playTab():mt=="l"?legTab():mt=="c"?boardTab():helpTab();
 $("#ovc").innerHTML=`<div class="big">VOID ROGUE</div><div class="mtabs">${T.map(([k,n])=>`<button class="${mt==k?"on":""}" onclick="VR.sfx.click();VR.menu(null,'${k}')">${n}</button>`).join("")}</div>${h?`<p class="sum">${h}</p>`:""}${c}${VR.G.run&&mt!="j"?'<button style="width:100%;padding:10px;margin-top:10px" onclick="VR.go()">Voltar ao jogo</button>':""}`};
VR.pick=k=>{VR.sel.pl=k;VR.sfx.click();VR.menu()};VR.sort=k=>{sort=k;VR.menu(null,"c")};VR.rollName=()=>{VR.sel.name=NM[VR.rnd(NM.length)];VR.menu()};
VR.buy=k=>{VR.audio.init();const U=VR.UP[k],m=VR.G.meta,l=m.u[k]||0,c=U.b*(l+1);if(m.q>=c&&l<U.m){m.q-=c;m.u[k]=l+1;VR.sfx.good();VR.save();VR.menu(null,"l")}else VR.sfx.err()};
VR.go=()=>{VR.audio.init();VR.sfx.click();if(!VR.G.run)VR.newRun(VR.sel.pl,(VR.sel.name||"").trim()||"Colónia Alfa");VR.r=VR.G.run;$("#ov").style.display="none";VR.render()};
VR.rename=()=>{const r=VR.r;if(!r)return;const n=prompt("Novo nome do planeta:",r.name);if(n&&n.trim()){r.name=n.trim().slice(0,24);VR.L(`Planeta renomeado para ${r.name}.`,"s");VR.render();VR.save()}};
// Ecrã inteiro manual (útil se a app instalada abrir em modo "standalone")
VR.fs=()=>{const d=document,e=d.documentElement;if(d.fullscreenElement)d.exitFullscreen();else if(e.requestFullscreen)e.requestFullscreen().catch(()=>{})};
VR.saveNow=()=>{VR.save();if(VR.r){VR.L("Progresso gravado localmente.","g");VR.render()}};
VR.toggleSound=()=>{VR.audio.init();VR.audio.toggle();VR.render()};
})();
