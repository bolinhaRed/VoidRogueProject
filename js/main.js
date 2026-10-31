/* main.js — arranque: carrega assets, grava/carrega, ciclo de 1s, teclas e fases musicais */
(()=>{
const $=VR.$;let last=Date.now();
VR.loadAssets(()=>{
 VR.load();VR.scene.start();$("#boot").remove();
 if(VR.r){VR.render();VR.menu()}else VR.menu();
 // Ciclo de jogo: 1 tick por segundo (usa Date.now para compensar abrandamentos do browser)
 setInterval(()=>{const n=Date.now(),dt=Math.min((n-last)/1000,5);last=n;
  if(VR.r){VR.tick(dt,0);if(VR.r)VR.render()}
  VR.audio.ph=VR.battle.on?"battle":VR.r&&VR.r.th>80?"tense":"calm"},1000);
 setInterval(()=>{if(VR.r)VR.save()},5000);
 addEventListener("beforeunload",VR.save);
 // Ao voltar ao separador, compensa o tempo inativo
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&VR.r){const dt=(Date.now()-last)/1000;if(dt>5){last=Date.now();VR.tick(dt,1);VR.render()}}});
 // Atalhos: 1-3 habilidades de combate
 addEventListener("keydown",e=>{const a=VR.ABIL.find(x=>x.k==e.key);if(a)VR.useAbil(a.id)});
 document.addEventListener("pointerover",e=>{if(e.target.closest&&e.target.closest("button:not(:disabled)"))VR.sfx.hover()});
});
})();
