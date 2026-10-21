'use strict';
// ===== Финал: сыграй всю Звёздную песню по созвездию-лире; Глуша добреет и поёт; медаль «Мастер десятки» =====
const LYRE=[[-.30,.50],[-.44,.16],[-.38,-.20],[-.20,-.44],[0,-.32],[.20,-.44],[.38,-.20],[.44,.16],[.30,.50],[0,.62]];
SC.fin={enter(){cast=[hero('lira',0,{side:'L'}),hero('dzin',0,{side:'L',ov:.4,z:1}),hero('kov',0,{side:'R'}),hero('glusha',0,{side:'R',ov:.2,base:'yawn',z:-1})];const z=zoneStart(6,{k:0,ph:'intro',fl:[],pop:{},song:0,medal:0});SEC.n=0;
  musStart({bpm:96,beat(i,w){const z=ZS;if(!z||z.n!==6)return;const b=i%10;if(z.ph==='song'||z.ph==='medal'){starNote(SONG[b],w,.13);z.fl[b]=w;if(b===0)boxNote(midi(SONG[0]+12),w,.05,2)}}});
  run(async()=>{await wait(300);await say('f1');z.ph='play';GOAL='Нажимай на звезду, которая светится'})},
 prog(){const z=ZS;return z.ph==='play'?z.k:z.ph==='medal'?100:50},
 geo(){const P=lineup(10);const w=Math.min(520,P.x1-P.x0),h=Math.min(380,gY()-safeT()-230);const cx=P.cx,cy=safeT()+170+h/2;return{P:LYRE.map(([a,b])=>({x:cx+a*w,y:cy+b*h*.82})),d:Math.min(88,w*.17),cx,cy,w,h}},
 tap(x,y){const z=ZS;if(z.ph!=='play')return;const g=SC.fin.geo();const i=g.P.findIndex(p=>Math.hypot(x-p.x,y-p.y)<g.d*.7);if(i<0)return;
  if(i!==z.k){z.pop[i]=T;starNote(SONG[i],acNow(),.06);return}// не та звезда — тихо звякнет, без ошибки
  starNote(SONG[i],acNow(),.16);z.fl[i]=acNow();z.pop[i]=T;burst(g.P[i].x,g.P[i].y,18,'spark',50,.7);z.k++;if(z.k===1)sayNow('f2');
  if(z.k>=10){z.ph='song';GOAL='';z.lock=true;run(async()=>{cheer();await wait(G.fast?20:900);pose('glusha','yawn',3);await say('f3');const gl=HR('glusha');gl.base='kind';gl.kind=1;gl.jump=T;burst(gl.dx||1000,gY()-200,60,'spark',300,1);SFX.star();
    await say('f4');await say('f5');z.ph='medal';z.medal=T;SV.fin=1;save();burst(640,300,120,'conf',null,1.6);SFX.star();cheer();await say('f6');z.lock=false;z.done=true})}},
 draw(){const z=ZS;bgDraw('fin');const g=SC.fin.geo();
  // линии созвездия и струны лиры
  X.save();X.strokeStyle='rgba(255,226,140,.55)';X.lineWidth=4;X.beginPath();g.P.forEach((p,i)=>{if(i<=Math.max(0,z.k-1)||z.ph!=='play'){i?X.lineTo(p.x,p.y):X.moveTo(p.x,p.y)}});X.stroke();
  if(z.ph!=='play'&&z.ph!=='intro'){X.lineWidth=2.5;X.strokeStyle='rgba(255,240,200,.5)';for(let j=1;j<=4;j++){const a=g.P[3],b=g.P[5];const x=lerp(g.P[2].x,g.P[6].x,j/5);X.beginPath();X.moveTo(x,g.P[4].y+8);X.lineTo(lerp(g.P[0].x,g.P[8].x,j/5),g.P[9].y-10);X.stroke()}}X.restore();
  g.P.forEach((p,i)=>drawStar(p.x,p.y,g.d,i<z.k||z.ph!=='play'&&z.ph!=='intro'?'lit':'dark',{flash:z.fl[i],pop:z.pop[i],glow:z.ph==='play'&&i===z.k}));
  drawCast();
  if(z.ph==='medal'){const u=ease(clamp((T-z.medal)/(G.fast?.02:.8),0,1));const md=Math.min(230,gY()-safeT()-200)*u;X.save();X.translate(g.cx,g.cy-20);X.rotate(Math.sin(T*2)*.05);spr('medal',0,0,md);X.restore();
   const bw=Math.min(520,g.w*1.1);slice3('banner',g.cx,g.cy+md*.55+40,bw,96,{cap:1.4,a:u});if(u>.5)textIn('Мастер десятки',g.cx,g.cy+md*.55+40,bw*.8,66,58,'#ffe27a',{f:FONT,st:'#0a1a5a',lw:7,id:'medal'})}},
 ui(){const z=ZS;if(z.ph==='medal'&&z.done){boardBtn('again',safeR()-150,safeB()-70,260,'Ещё раз',()=>go('fin'),{size:44})}if(z.ph==='play')progDots(10,z.k)},
 taps(ok){const z=ZS;if(z.ph!=='play')return['wait'];if(!ok)return[];const g=SC.fin.geo(),p=g.P[z.k];return[[p.x,p.y]]}};
