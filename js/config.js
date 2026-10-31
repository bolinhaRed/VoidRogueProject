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
VR.ABIL=[{id:"sh",n:"Escudo de Emergência",k:"1",cd:25,ic:"a_sh",d:"Imunidade durante 5s"},
 {id:"aoe",n:"Pulso de Plasma",k:"2",cd:18,ic:"a_aoe",d:"Dano em área a todos os inimigos"},
 {id:"od",n:"Sobrecarga",k:"3",cd:30,ic:"a_od",d:"+60% dano durante 6s"}];
VR.PASS=["Nanobots: +0,8% casco/s","Fúria: +25% dano com casco < 50%"];
