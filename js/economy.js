/* economy.js — produção, energia (com ligar/desligar), ameaça e tick de 1s */
(()=>{
// Calcula produção/consumo atuais. Edifícios desligados não consomem nem produzem.
VR.eco=()=>{const r=VR.r,b=r.b,on=VR.on,prod=on("ps")?20*b.ps*1.1**b.ps:0,
 rows=Object.keys(VR.B).filter(k=>VR.B[k].e).map(k=>({k,use:on(k)?b[k]*VR.B[k].e:0,full:b[k]*VR.B[k].e})),
 cons=rows.reduce((s,x)=>s+x.use,0),ef=cons?Math.min(1,prod/cons):1,lb=1+(on("lab")?.05*b.lab:0);
 const mine=(k,base,x)=>on(k)?base*b[k]*1.1**b[k]*ef*lb*x:0;
 return{prod,cons,rows,ef,m:mine("mm",6,1+.1*VR.lvl("pm")),c:mine("mc",4,1),d:mine("sd",2,1),es:on("es")?b.es*ef:0}};
VR.trate=()=>{const r=VR.r;return .12*(1+.4*r.jump)*(1-.05*VR.lvl("th"))*(1-.04*VR.eco().es)*(r.acc>0?2:1)};
VR.tick=(dt,off)=>{const r=VR.r,e=VR.eco();r.r[0]+=e.m*dt;r.r[1]+=e.c*dt;r.r[2]+=e.d*dt;r.age+=dt;
 r.acc=Math.max(0,r.acc-dt);r.slow=Math.max(0,r.slow-dt);r.th+=dt*VR.trate();
 if(off)r.th=Math.min(r.th,99);
 if(r.th>=100&&!VR.battle.on&&!off){r.th=40;VR.L("A ANOMALIA ATINGIU O SISTEMA! Ataque massivo inevitável!","x");VR.sfx.alarm();
  VR.startBattle({n:6+r.jump*5,a:6,h:25,big:1,loot:0,title:"ATAQUE MASSIVO"})}};
})();
