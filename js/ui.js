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
 $("#thl").innerHTML=`Ameaça <b>${r.th.toFixed(1)}%</b> · impacto em <b>${m}:${String(Math.floor(sl%60)).padStart(2,"0")}</b>${r.acc>0?` <span class="bd">ACELERADA ${Math.ceil(r.acc)}s</span>`:""}${r.slow>0?` <span class="bd">FROTA LENTA ${Math.ceil(r.slow)}s</span>`:""}`;
 $("#thf").style.width=Math.min(100,r.th)+"%";$("#sysl").innerHTML=`SISTEMA ${r.jump+1}/10<br><small>${Math.floor(r.age/60)}m ${Math.floor(r.age%60)}s</small>`;
 $("#mt").textContent=VR.audio.muted?"Som: OFF":"Som: ON";
 $("#obj").textContent=obj(e);
 // Base
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
function obj(e){const g=VR.r;if(VR.battle.on)return"COMBATE! Usa as habilidades (teclas 1, 2, 3) para virar a batalha.";if(g.th>85)return"AMEAÇA CRÍTICA! Salta de sistema ou prepara a frota para o ataque massivo.";
 if(e.ef<1)return"Energia insuficiente: constrói Plantas Solares ou desliga instalações no separador Energia.";if(!g.b.hg)return"Objetivo: constrói um Hangar de Naves para poderes produzir uma frota.";
 if(!VR.fleet())return"Objetivo: constrói as tuas primeiras naves no separador Frota.";if(g.ex<3)return`Objetivo: explora ${3-g.ex} nodo(s) no separador Mapa para abrir o salto.`;
 if(g.r[2]<200*(g.jump+1))return"Objetivo: junta Deutério suficiente para o salto de sistema.";return"Tudo pronto: salta para o próximo sistema!"}
/* ---------- HUD de combate (botões das habilidades sobre a cena) ---------- */
VR.hudShow=v=>{$("#bhud").style.display=v?"flex":"none";if(v){$("#abil").innerHTML=VR.ABIL.map(a=>`<button class="ab" id="ab_${a.id}" onclick="VR.useAbil('${a.id}')" title="${a.d}">${img(a.ic,"ai")}<span>${a.k}</span><small>${a.n}</small><i></i></button>`).join("")+`<p class="mu">${VR.PASS.join(" · ")}</p>`}};
VR.hud=()=>{const B=VR.battle;let n=0;for(const a of VR.ABIL){const b=$("#ab_"+a.id);if(!b)continue;const cd=B.cd[a.id],tot=a.cd*(1-.08*VR.lvl("ab"));b.classList.toggle("rdy",!cd);b.classList.toggle("act",(a.id=="sh"&&B.sh>0)||(a.id=="od"&&B.od>0));b.querySelector("i").style.height=(cd?cd/tot*100:0)+"%"}
 const u=B.u.filter(x=>x.hp>0).length,e=B.e.filter(x=>x.hp>0).length;$("#bst").textContent=B.end?(B.res=="win"?"VITÓRIA":B.res=="lose"?"DERROTA":"INIMIGO EM RETIRADA"):`Frota ${u}/${B.u.length}  ·  Inimigos ${e}/${B.e.length}`;
 if(B.end&&B.res!="retreat"&&!B.snd){B.snd=1;(B.res=="win"?VR.sfx.win:VR.sfx.lose)()}};
/* ---------- Menu / Terminal de Legado ---------- */
VR.menu=h=>{const u=VR.G.meta.u,q=VR.G.meta.q;$("#ov").style.display="flex";
 $("#ovc").innerHTML=`<div class="big">VOID ROGUE</div><p>${h||"Sobrevive a 10 saltos até ao Centro da Galáxia. A morte é permanente — o legado não."}</p>
 <ul class="hp"><li>Gere recursos e energia; constrói uma frota no Hangar.</li><li>Explora nodos: mercadores, ruínas, anomalias e combates.</li><li>No combate usa as habilidades (teclas 1-3). Salta antes da Ameaça chegar a 100%.</li></ul>
 <h3>Terminal de Legado · <span style="color:var(--pu)">${q} FQ</span></h3><div class="lg">`+Object.keys(VR.UP).map(k=>{const U=VR.UP[k],l=u[k]||0,c=U.b*(l+1),ok=q>=c&&l<U.m;return`<div class="it ${ok?"af":""}"><div class="tx"><b>${U.n}</b><span class="lv">${l}/${U.m}</span><small>${U.d} · ${l>=U.m?"MÁX":c+" FQ"}</small></div><button style="width:auto;padding:0 10px" ${ok?"":"disabled"} onclick="VR.buy('${k}')">Comprar</button></div>`}).join("")+
 `</div><p class="mu">Melhor run: ${VR.G.meta.best} saltos</p><button style="width:100%;padding:12px;font-size:15px" onclick="VR.go()">${VR.G.run?"Continuar campanha":"Iniciar campanha"}</button>`};
VR.buy=k=>{VR.audio.init();const U=VR.UP[k],m=VR.G.meta,l=m.u[k]||0,c=U.b*(l+1);if(m.q>=c&&l<U.m){m.q-=c;m.u[k]=l+1;VR.sfx.good();VR.save();VR.menu()}else VR.sfx.err()};
VR.go=()=>{VR.audio.init();VR.sfx.click();if(!VR.G.run)VR.newRun();VR.r=VR.G.run;$("#ov").style.display="none";VR.render()};
VR.saveNow=()=>{VR.save();if(VR.r){VR.L("Progresso gravado localmente.","g");VR.render()}};
VR.toggleSound=()=>{VR.audio.init();VR.audio.toggle();VR.render()};
})();
