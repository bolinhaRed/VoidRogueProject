/* scene.js — ecrã superior: cena do planeta/frota e animação de batalha (canvas com sprites) */
(()=>{
const cv=VR.$("#sc"),x=cv.getContext("2d"),W=480,H=200,A=k=>VR.img[k],rnd=VR.rnd;cv.width=W;cv.height=H;
const S=VR.scene={warp:0,shake:0,flash:0,rebuild(){nb=null}};
const stars=Array.from({length:90},()=>({x:rnd(W),y:rnd(H),z:1+rnd(3)}));let nb=null,last=0;
const hash=(a,b)=>{const n=Math.sin(a*127.1+b*311.7)*43758.5;return n-Math.floor(n)};
// Nebulosa procedural (apenas fundo); a cor muda em cada sistema
function mkNeb(){const h=[210,12,130,280,40][(VR.r?VR.r.jump:0)%5];nb=document.createElement("canvas");nb.width=120;nb.height=50;const c=nb.getContext("2d");
 for(let i=0;i<120;i++)for(let j=0;j<50;j++){const n=(Math.sin(i*.09+j*.05)+Math.sin(j*.2-i*.04)+Math.sin((i+j)*.07)+hash(i>>1,j>>1)*1.3)/4;if(n>.24){c.fillStyle=`hsla(${h+50},70%,50%,${.08+(n-.24)*.4})`;c.fillRect(i,j,1,1)}}}
// Desenha uma nave (sprite virado para cima rodado por rot). Usa folha de propulsão de 4 frames se existir.
function ship(k,cx,cy,rot,t,sc=1){const th=A(k+"_t"),im=th||A(k);if(!im)return;const fw=th?im.width/4:im.width,fh=im.height,f=th?Math.floor(t*11)%4:0,bh=th?fh-8:fh;
 x.save();x.translate(cx|0,cy|0);x.rotate(rot);x.scale(sc,sc);x.drawImage(im,f*fw,0,fw,fh,-fw/2|0,-bh/2|0,fw,fh);x.restore()}
function frame(ms){const t=ms/1000,dt=Math.min(.05,t-last);last=t;const r=VR.r,B=VR.battle,th=r?r.th:0,w=S.warp;
 VR.battleStep(dt);if(!nb)mkNeb();x.imageSmoothingEnabled=false;
 x.fillStyle="#02030a";x.fillRect(0,0,W,H);x.drawImage(nb,0,0,W,H);
 x.drawImage(A("sun"),W-50,-24,64,64);                                                               // sol distante
 stars.forEach(s=>{s.x-=s.z*.12*(1+w*30);if(s.x<0)s.x=W;x.fillStyle=["#444","#888","#bcd","#fff"][s.z];x.fillRect(s.x,s.y,w>.05?s.z*(1+w*10):s.z>2?2:1,s.z>2?2:1)});
 if(r)for(let i=0;i<th*1.1;i+=2){x.fillStyle=`rgba(255,30,70,${.5*(1-i/(th*1.1+1))*(.6+.4*Math.sin(t*3+i*.1))})`;x.fillRect(W-i,0,2,H)}   // anomalia
 if(r&&(r.acc>0||r.slow>0)){x.save();x.translate(400,100);x.rotate(t*.8);x.globalAlpha=.9;x.drawImage(A("bh"),-48,-48,96,96);x.restore()}              // buraco negro ativo
 const jp=r?r.jump%10:0,a=t*.45,px=B.on?60:100,py=100,pscale=B.on?.7:1;
 x.globalAlpha=B.on?.55:1;
 const mx=px+Math.cos(a)*118*pscale,my=py+Math.sin(a)*28,back=Math.sin(a)<0,mo=()=>x.drawImage(A("moon"),mx-16,my-16,32,32);
 if(back)mo();x.drawImage(A("P"+jp),px-64*pscale,py-64*pscale,128*pscale,128*pscale);if(!back)mo();x.globalAlpha=1;
 if(B.on)drawBattle(t,B);else if(r)idleFleet(t,r);
 if(S.flash>0){x.fillStyle=`rgba(255,255,255,${S.flash})`;x.fillRect(0,0,W,H);S.flash*=.9}
 if(w>.3){x.fillStyle=`rgba(255,255,255,${w*.5})`;x.fillRect(0,0,W,H)}
 S.warp*=.97;if(S.shake>0){cv.style.transform=`translate(${(Math.random()-.5)*S.shake}px,${(Math.random()-.5)*S.shake*.5}px)`;S.shake--}else cv.style.transform="";
 if(B.on)VR.hud();requestAnimationFrame(frame)}
function idleFleet(t,r){VR.T.forEach((k,ti)=>{const n=Math.min(r.sh[k],4),sp=VR.S[k].spr;for(let j=0;j<n;j++)ship(sp,230+j*38+Math.sin(t*1.5+j+ti)*3,28+ti*36+Math.cos(t+j)*3,Math.PI/2,t+j)})}
function drawBattle(t,B){
 B.u.forEach(u=>{if(u.hp<=0)return;if(B.od>0){x.shadowColor="#fa4";x.shadowBlur=8}ship(u.s,u.x+Math.sin(t*2+u.y)*2,u.y,Math.PI/2,t);x.shadowBlur=0;hp(u)});
 B.e.forEach(e=>{if(e.hp<=0)return;e.s=="eye"?x.drawImage(A("eye"),e.x-24,e.y-24):ship(e.s,e.x+Math.sin(t*2+e.y)*2,e.y,-Math.PI/2,t);hp(e)});
 if(B.sh>0){x.fillStyle=`rgba(0,255,225,${.1+.05*Math.sin(t*12)})`;x.strokeStyle=`rgba(0,255,225,${.5+.3*Math.sin(t*10)})`;x.lineWidth=2;x.beginPath();x.ellipse(125,100,100,96,0,0,7);x.fill();x.stroke()}
 B.p.forEach(p=>{const im=A(p.k);x.save();x.translate(p.x,p.y);x.rotate((p.a||0)+Math.PI/2);x.drawImage(im,-1,-4);x.restore()});
 B.fx.forEach(f=>{if(f.k=="ring"){x.strokeStyle=`rgba(255,200,80,${1-f.t/.7})`;x.lineWidth=3;x.beginPath();x.arc(f.x,f.y,f.t*480,0,7);x.stroke();return}
  const im=A("ex"+f.s),fr=Math.min(7,Math.floor(f.t*14));x.drawImage(im,fr*f.s,0,f.s,f.s,(f.x-f.s/2)|0,(f.y-f.s/2)|0,f.s,f.s)})}
function hp(u){if(u.hp>=u.mx)return;x.fillStyle="#000a";x.fillRect(u.x-10,u.y-18,20,3);x.fillStyle=u.a>0&&!u.t?"#f55":u.hp/u.mx>.4?"#5f8":"#fa4";x.fillRect(u.x-10,u.y-18,20*u.hp/u.mx,3)}
S.start=()=>requestAnimationFrame(frame);
})();
