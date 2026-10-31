/* config.js — dados estáticos do jogo (edifícios, naves, nodos, legado, habilidades) */
window.VR={};
// Edifícios: c = custo base [metal,cristal,deutério], e = consumo de energia por nível, ic = chave do sprite
VR.B={
 mm:{n:"Mina de Metal",ic:"b_mm",c:[60,15,0],e:10,d:"Extrai metal"},
 mc:{n:"Mina de Cristal",ic:"b_mc",c:[48,24,0],e:10,d:"Extrai cristal"},
 sd:{n:"Sintetizador de Deutério",ic:"b_sd",c:[100,50,0],e:15,d:"Sintetiza combustível"},
 ps:{n:"Planta Solar",ic:"b_ps",c:[75,30,0],e:0,d:"Gera 20 de energia por nível"},
 lab:{n:"Laboratório",ic:"b_lab",c:[200,400,200],e:8,d:"+5% produção e dano por nível"},
 hg:{n:"Hangar de Naves",ic:"b_hg",c:[400,200,100],e:6,d:"+5 capacidade de frota por nível"},
 es:{n:"Escudo Planetário",ic:"b_es",c:[500,500,300],e:20,d:"-4% velocidade da ameaça por nível"}};
VR.RS={w:{n:"Armamento",ic:"a_od",c:[300,200,100],d:"+4% dano"},e:{n:"Blindagem",ic:"a_sh",c:[300,300,150],d:"+4% casco"}};
// Naves: spr = sprite aliado, en = sprite inimigo, a = ataque, h = casco
VR.S={
 lf:{n:"Caça Ligeiro",spr:"sparrow",en:"e_sparrow",c:[300,100,0],a:5,h:10},
 hf:{n:"Caça Pesado",spr:"kestrel",en:"e_kestrel",c:[600,300,50],a:14,h:30},
 cr:{n:"Cruzador",spr:"heron",en:"e_heron",c:[2000,1000,200],a:42,h:90},
 bb:{n:"Nave de Batalha",spr:"falcon",en:"e_falcon",c:[6000,3000,800],a:110,h:240},
 nv:{n:"Fénix Quântico",spr:"fenix",c:[12000,6000,2500],a:260,h:520,lock:"nv"}};
VR.T=Object.keys(VR.S);
// Árvore de Legado: b = custo base (custo = b*(nível+1)), m = nível máximo
VR.UP={
 pm:{n:"Minas Quânticas",d:"+10% metal",b:8,m:10},
 dm:{n:"Armas Quânticas",d:"+5% dano",b:8,m:10},
 sr:{n:"Reservas Iniciais",d:"+500 recursos iniciais",b:8,m:10},
 th:{n:"Escudo Anti-Anomalia",d:"-5% ameaça/s",b:8,m:10},
 cd:{n:"Engenharia Eficiente",d:"-4% custo de edifícios",b:10,m:10},
 hc:{n:"Hangar Expandido",d:"+5 capacidade de frota",b:10,m:10},
 ab:{n:"Sistemas Táticos",d:"-8% recarga de habilidades",b:12,m:8},
 nv:{n:"Projeto Fénix",d:"Desbloqueia o Fénix Quântico (começas com um)",b:60,m:1}};
// Tipos de nodo (w = peso de geração)
VR.NODE={ast:{n:"Asteroides",ic:"n_ast",w:22},sos:{n:"Socorro",ic:"n_sos",w:14},cmb:{n:"Combate",ic:"n_cmb",w:24},
 mer:{n:"Mercador",ic:"n_mer",w:12},rui:{n:"Ruínas",ic:"n_rui",w:14},bh:{n:"Anomalia",ic:"n_bh",w:14}};
// Habilidades de combate: ativas (1-3) + passivas
VR.ABIL=[{id:"sh",n:"Escudo de Emergência",k:"1",cd:16,ic:"a_sh",d:"Imunidade durante 5s"},
 {id:"aoe",n:"Pulso de Plasma",k:"2",cd:12,ic:"a_aoe",d:"Dano em área a todos os inimigos"},
 {id:"od",n:"Sobrecarga",k:"3",cd:20,ic:"a_od",d:"+60% dano durante 6s"}];
VR.PASS=["Nanobots: +0,8% casco/s","Fúria: +25% dano com casco < 50%"];
// Planetas iniciais (estilo "escolha de asteroide"): multiplicadores de produção (m,c,de), energia solar (en),
// velocidade da ameaça (th), custo de edifícios (cost), capacidade extra (cap), Fragmentos (q), pesos de nodos (w),
// multiplicador de pontuação (sm) e sprite (sp).
VR.PL={
 terra:{n:"Terra Verde",sp:"P0",d:"Planeta equilibrado, ideal para aprender.",sm:1,m:1,c:1,de:1,en:1,th:1,cost:1,cap:0,q:1,w:{}},
 arido:{n:"Mundo Árido",sp:"P1",d:"Rico em metal, pobre em cristal. Construir sai mais barato.",sm:1.1,m:1.3,c:.75,de:1,en:1,th:1,cost:.9,cap:0,q:1,w:{}},
 gelo:{n:"Gelo Eterno",sp:"P3",d:"Deutério abundante, mas pouca luz solar para as plantas.",sm:1.15,m:1,c:1,de:1.4,en:.7,th:1,cost:1,cap:0,q:1,w:{}},
 vulcao:{n:"Vulcão Ardente",sp:"P4",d:"Energia geotérmica e cristal, mas o planeta é instável: a ameaça avança mais depressa.",sm:1.3,m:1,c:1.3,de:1,en:1.3,th:1.2,cost:1,cap:0,q:1,w:{}},
 gasoso:{n:"Gigante Gasoso",sp:"P2",d:"Deutério à vontade e estaleiros orbitais, mas sem metal fácil.",sm:1.25,m:.7,c:1,de:1.5,en:1,th:1,cost:1,cap:5,q:1,w:{}},
 antigo:{n:"Mundo Antigo",sp:"P9",d:"Cheio de ruínas e Fragmentos extra, mas com recursos escassos.",sm:1.5,m:.85,c:.85,de:.85,en:1,th:1,cost:1,cap:0,q:1.25,w:{rui:40}}};
// Modificadores de sistema (um por sistema; o 1.º é calmo). en=energia solar, th=ameaça, ec=custo de exploração,
// hp/ea=casco/ataque inimigo, loot=pilhagem, de=deutério, ast=asteroides, wm=multiplicador de peso de nodos
VR.MODS={
 calm:{n:"Sistema Calmo",d:"Sem modificadores.",en:1,th:1,ec:1,hp:1,ea:1,loot:1,de:1,ast:1,wm:{}},
 ion:{n:"Sistema Iónico",d:"Plantas Solares geram metade da energia.",en:.5,th:1,ec:1,hp:1,ea:1,loot:1,de:1,ast:1,wm:{}},
 grave:{n:"Cemitério Estelar",d:"Inimigos com -30% casco, mas o dobro de nodos de combate.",en:1,th:1,ec:1,hp:.7,ea:1,loot:1,de:1,ast:1,wm:{cmb:2}},
 neb:{n:"Nebulosa Densa",d:"Ameaça -25% mais lenta, mas explorar custa +50% Deutério.",en:1,th:.75,ec:1.5,hp:1,ea:1,loot:1,de:1,ast:1,wm:{}},
 rich:{n:"Cinturão Rico",d:"Asteroides dão o dobro e são mais comuns.",en:1,th:1,ec:1,hp:1,ea:1,loot:1,de:1,ast:2,wm:{ast:2}},
 storm:{n:"Tempestade Gravítica",d:"Anomalias frequentes, mas +40% produção de Deutério.",en:1,th:1,ec:1,hp:1,ea:1,loot:1,de:1.4,ast:1,wm:{bh:3}},
 pirate:{n:"Território Pirata",d:"Inimigos +25% ataque, mas pilhagem x1,5.",en:1,th:1,ec:1,hp:1,ea:1.25,loot:1.5,de:1,ast:1,wm:{cmb:1.5}}};
VR.MD=()=>VR.MODS[(VR.r&&VR.r.mod)||"calm"];
VR.nextMod=cur=>{const k=Object.keys(VR.MODS).filter(x=>x!="calm"&&x!=cur);return k[Math.floor(Math.random()*k.length)]};
