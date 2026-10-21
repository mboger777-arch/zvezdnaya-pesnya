'use strict';
// ===== Уровень 2: Два барабана — Ковшик бьёт свою часть, ребёнок доигрывает до 10; в конце — без звёзд (под тучей) =====
const L2R=[3,8,5,1,6],L2HIDE=3;
SC.l2={enter(){cast=[hero('kov',0,{side:'L'}),hero('lira',0,{side:'R'}),hero('dzin',0,{side:'R',ov:.45,z:1})];const z=zoneStart(2,{r:-1,ph:'',k:0,kc:0,c:0,fl:[],pop:{},b0:0,hide:0,cloud:0,cloudT:0,dpop:0,kpop:0});
  musStart({bpm:90,beat(i,w){const z=ZS;if(!z||z.n!==2)return;
    if(z.ph==='kov'){if(z.kc<z.k){const b=z.kc;z.kc++;drumHit(w,.9);starNote(SONG[b],w,.13);z.fl[b]=w;z.kpop=w;if(z.kc>=z.k)z.kdone=i}else if(i>z.kdone){z.ph='kid';z.b0=i+1;sayNow('b2_k'+z.k)}return}
    if(z.ph==='kid'||z.ph==='ok'){const b=(i-z.b0+1000)%10;const on=b<z.k+Math.min(z.c,10-z.k);if(on){starNote(SONG[b],w,.11);z.fl[b]=w}else if(!z.hide||z.cloud<.5)hollow(w)}}});
  run(async()=>{await wait(300);await say('b2_1');await say('b2_2');SC.l2.next()})},
 prog(){const z=ZS;return z.r*100+({kov:0,kid:20,ok:60}[z.ph]||80)+z.c},
 geo(){const P=lineup(10);const w=Math.min(640,P.x1-P.x0);const g=tenGeo(P.cx,safeT()+190,w,100);g.cx=P.cx;g.by=g.P[5].y+g.d*.5+62;
  let dw=Math.min(190,(P.x1-P.x0)*.27);const ar=IM.drum.naturalHeight/IM.drum.naturalWidth,room=gY()-8-(g.by+52)-6;if(dw*ar*1.12>room)dw=Math.max(110,room/(ar*1.12));g.dw=dw;g.dh=dw*IM.drum.naturalHeight/IM.drum.naturalWidth;g.kx=P.x0+dw*.55;g.cxk=Math.min(P.x1-dw*.5-120,P.cx+dw*.45);g.dy=gY()-g.dh/2-8;g.bx=Math.min(P.x1-54,g.cxk+dw/2+66);g.ux=Math.max(g.kx+dw*.6+52,g.cxk-dw/2-58);g.oy=gY()-60;return g},
 next(){const z=ZS;z.r++;if(z.r>=L2R.length){z.ph='win';GOAL='';winZone('b2_win','b2_gl');return}
  z.k=L2R[z.r];z.kc=0;z.c=0;z.fl=[];z.hide=z.r>=L2HIDE?1:0;z.ph='kov';GOAL='Слушай, сколько раз ударит Ковшик';if(G.fast){z.kc=z.k;z.kdone=-1}
  if(z.hide&&z.r===L2HIDE){z.ph='wait';z.lock=true;run(async()=>{z.cloudT=T;z.lock=false;await sayNow('b2_hide');if(ZS===z){z.ph='kov';z.kdone=1e9;if(G.fast){z.kc=z.k;z.kdone=-1}}})}else if(z.hide)z.cloudT=T},
 drum(){const z=ZS;if(z.ph!=='kid'||z.lock)return;const cap=z.hide?9:10-z.k;if(z.c>=cap){z.dwob=T;SFX.bump();if(!talk)sayNow(z.hide?'b2_many':'b2_full');return}
  const b=z.k+z.c;z.c++;z.dpop=T;drumHit(acNow(),1);if(b<10){starNote(SONG[b],acNow(),.15);z.fl[b]=acNow();z.pop[b]=T}const g=SC.l2.geo();burst(g.cxk,g.dy-g.dh*.3,10,'spark',offBeat()<.11?190:40,.6)},
 undo(){const z=ZS;if(z.ph!=='kid'||z.c<=0)return;z.c--;const b=z.k+z.c;if(b<10)z.pop[b]=T;tone(500,.12,'sine',.06,0,300)},
 ok(){const z=ZS;if(z.ph!=='kid'||z.lock)return;const need=10-z.k;const g=SC.l2.geo();
  if(z.c===need){z.ph='ok';z.lock=true;if(z.hide)z.cloudOff=T;react(true,g.cx,g.by);burst(g.cx,g.by,40,'conf',null,.8);run(async()=>{z.lock=false;await sayNow('b2_ok'+z.k);if(z.k===6)await say('b2_mirror');await wait(400);if(ZS===z)SC.l2.next()});return}
  mistake();sayNow(z.c<need?'b2_few':'b2_many')},
 tap(x,y){const z=ZS,g=SC.l2.geo();if(Math.abs(x-g.cxk)<g.dw*.55&&Math.abs(y-g.dy)<g.dh*.6)return SC.l2.drum();
  // нажал на свою звезду — убрать последний удар
  if(z.ph==='kid'&&!z.hide){const i=g.P.findIndex(p=>Math.hypot(x-p.x,y-p.y)<g.d*.6);if(i>=z.k&&i<z.k+z.c)SC.l2.undo()}},
 draw(){const z=ZS;bgDraw('l2');const g=SC.l2.geo();
  g.P.forEach((p,i)=>{const st=i<z.kc?'blue':(i>=z.k&&i<z.k+z.c)?'lit':'dark';drawStar(p.x,p.y,g.d,st,{flash:z.fl[i],pop:z.pop[i],num:st==='lit'?i-z.k+1:st==='blue'?i+1:null,ns:.5})});
  if(MUS.on&&(z.ph==='kid'||z.ph==='ok'))drawComet(g.P,g.d,(beatF()-z.b0+1000)%10+0);
  // туча Глуши закрывает звёзды (последние раунды)
  {let a=0;if(z.hide){a=clamp((T-z.cloudT)/(G.fast?.02:.6),0,1);if(z.cloudOff)a=1-clamp((T-z.cloudOff)/(G.fast?.02:.7),0,1)}z.cloud=a;
   if(a>0){const cw=g.w*1.25;X.save();X.globalAlpha=a;for(let j=0;j<3;j++)spr('puff',g.cx+(j-1)*cw*.3+Math.sin(T*1.3+j)*8,g.P[0].y+g.d*.55+(j===1?-10:8),g.h*1.5*(j===1?1.1:.95));X.restore()}}
  if(z.k&&z.ph!=='win'){const w=Math.min(460,g.w*.8);slice3('banner',g.cx,g.by,w,96,{cap:1.4});const t=z.ph==='kov'?`${z.kc} + ?`:`${z.k} + ${z.c} = ${z.k+z.c}`;textIn(t,g.cx,g.by,w*.8,70,70,'#fffdf2',{f:NUM,st:'#0a1a5a',lw:8,id:'eq'})}
  // барабаны: левый — Ковшика, правый — твой
  const kp=z.kpop&&acNow()>=z.kpop&&acNow()-z.kpop<.18?.92:1;X.save();X.translate(g.kx,gY()-8);X.scale(1,kp);spr('drum',0,0,g.dh,{ay:1});X.restore();
  const dp=z.dpop&&T-z.dpop<.16?.9:1,dw=z.dwob&&T-z.dwob<.4?Math.sin((T-z.dwob)*40)*.06:0;X.save();X.translate(g.cxk,gY()-8);X.rotate(dw);X.scale(1/dp*.98,dp);X.globalAlpha=z.ph==='kid'?1:.6;spr('drum',0,0,g.dh*1.12,{ay:1});X.restore();
  if(z.ph==='kid'&&z.c===0){X.save();X.globalAlpha=.5+.5*Math.sin(T*6);X.strokeStyle='#ffe27a';X.lineWidth=6;X.beginPath();X.ellipse(g.cxk,gY()-g.dh*1.05,g.dw*.5,g.dh*.2,0,0,7);X.stroke();X.restore()}
  drawCast();secretStep()},
 ui(){const z=ZS,g=SC.l2.geo();if(z.ph==='kid'){btn('ok','b_ok',g.bx,g.oy,100,()=>SC.l2.ok(),{pulse:!z.hide&&z.c===10-z.k});btn('undo','b_undo',g.ux,g.oy,84,()=>SC.l2.undo(),{dis:z.c===0})}
  progDots(L2R.length,Math.max(0,z.r))},
 taps(ok){const z=ZS;if(z.ph!=='kid'||z.lock)return['wait'];const g=SC.l2.geo(),need=10-z.k;const D=[g.cxk,g.dy],OK=[g.bx,g.oy],UN=[g.ux,g.oy];
  if(ok)return[z.c<need?D:z.c>need?UN:OK];
  if(z.c<need)return[OK];if(z.hide)return[UN,OK];return[]}};
