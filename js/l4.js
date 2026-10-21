'use strict';
// ===== Уровень 4: Эхо Глуши — Глуша глотает ноты; посчитай тишину (10 − 6 = 4), потом пощекочи её, чтобы ноты вылетели =====
const L4M=[4,7,2,5];
SC.l4={enter(){cast=[hero('lira',0,{side:'L'}),hero('dzin',0,{side:'L',ov:.4,z:1}),hero('glusha',0,{side:'R'})];const z=zoneStart(4,{r:-1,ph:'',lit:Array(10).fill(1),fl:[],pop:{},fly:[],wob:{},gone:[]});
  musStart({bpm:88,beat(i,w){const z=ZS;if(!z||z.n!==4)return;const b=i%10;if(z.lit[b]){starNote(SONG[b],w,.12);z.fl[b]=w}else hollow(w)}});
  run(async()=>{await wait(300);pose('glusha','laugh',2);await say('d1');await say('d2');SC.l4.next()})},
 prog(){const z=ZS;return z.r*100+({eat:0,ask:30,tickle:60}[z.ph]||90)+(z.back||0)},
 geo(){const P=lineup(10);const g=tenGeo(P.cx,safeT()+190,Math.min(620,P.x1-P.x0),104);g.cx=P.cx;g.by=g.P[5].y+g.d*.5+66;g.cy=Math.min(gY()-70,g.by+118);return g},
 gm(){const gl=HR('glusha');return{x:(gl.dx||safeR()-150)-20,y:gY()-gl.h*.55}},
 next(){const z=ZS;z.r++;if(z.r>=L4M.length){z.ph='win';GOAL='';z.lit=Array(10).fill(1);winZone('d_win','d_gl');return}
  const m=L4M[z.r];z.m=m;z.back=0;z.lit=Array(10).fill(1);z.ph='eat';z.lock=true;GOAL='';z.wob={};
  z.gone=shuffle([...Array(10).keys()]).slice(0,m).sort((a,b)=>a-b);z.opts=l1opts(m);
  run(async()=>{await wait(G.fast?20:700);pose('glusha','laugh',2.4);SFX.suck();const g=SC.l4.geo(),M=SC.l4.gm();
   for(const b of z.gone){z.fly.push({b,t0:T,fx:g.P[b].x,fy:g.P[b].y,tx:M.x,ty:M.y});z.lit[b]=0;await wait(G.fast?5:180)}
   await wait(G.fast?20:600);z.fly=[];z.ph='ask';z.lock=false;GOAL=`10 − ${10-m} = ?`;await sayNow('d_q'+m)})},
 pick(v,x,y){const z=ZS;if(z.ph!=='ask'||z.lock)return;
  if(v===z.m){z.ph='said';z.lock=true;react(true,x,y);run(async()=>{z.lock=false;await sayNow('d_ok'+z.m);if(ZS!==z)return;z.ph='tickle';GOAL='Пощекочи Глушу: нажимай на неё';await say('d_tick')});return}
  z.wob[v]=T;mistake();sayNow('d_bad')},
 tickle(){const z=ZS;if(z.ph!=='tickle')return false;const gl=HR('glusha');gl.jump=T;pose('glusha','laugh',1);SFX.giggle();
  const b=z.gone[z.back];if(b==null)return true;z.back++;const g=SC.l4.geo(),M=SC.l4.gm();z.fly.push({b,t0:T,fx:M.x,fy:M.y,tx:g.P[b].x,ty:g.P[b].y,out:1});
  setTimeout(()=>{if(ZS!==z)return;z.lit[b]=1;z.pop[b]=T;starNote(SONG[b],acNow(),.15);z.fl[b]=acNow();burst(g.P[b].x,g.P[b].y,16,'spark',50,.6)},G.fast?10:420);
  if(z.back===1&&!talk)sayNow('d_gig');
  if(z.back>=z.gone.length){z.ph='done';z.lock=true;run(async()=>{await wait(G.fast?30:600);const t=acNow();for(let i=0;i<10;i++){starNote(SONG[i],t+i*.2,.13);z.fl[i]=t+i*.2}react(true,640,300);await wait(G.fast?20:900);z.lock=false;await sayNow('d_back');if(ZS===z)SC.l4.next()})}
  return true},
 onHero(n){if(n==='glusha'&&ZS&&ZS.ph==='tickle')return SC.l4.tickle()},
 tap(x,y){const z=ZS;if(z.ph!=='tickle')return;const gl=HR('glusha');if(gl&&Math.abs(x-gl.dx)<heroX(gl)*.6&&y>gY()-gl.h-30)SC.l4.tickle()},
 draw(){const z=ZS;bgDraw('l4');const g=SC.l4.geo();
  g.P.forEach((p,i)=>{if(z.lit[i])drawStar(p.x,p.y,g.d,'lit',{flash:z.fl[i],pop:z.pop[i]});else{drawStar(p.x,p.y,g.d,'dark');X.save();X.globalAlpha=.55+.15*Math.sin(T*3+i);spr('puff',p.x,p.y,g.d*.62);X.restore()}});
  if(MUS.on)drawComet(g.P,g.d,beatF());
  if(z.m&&z.ph!=='win'){const w=Math.min(430,g.w*.78);slice3('banner',g.cx,g.by,w,96,{cap:1.4});const done=z.ph!=='eat'&&z.ph!=='ask';textIn(`10 − ${10-z.m} = ${done?z.m:'?'}`,g.cx,g.by,w*.8,70,70,'#fffdf2',{f:NUM,st:'#0a1a5a',lw:8,id:'eq'})}
  drawCast();
  for(const f of z.fly){const u=clamp((T-f.t0)/(G.fast?.01:.42),0,1),e=ease(u);if(!f.out&&u>=1)continue;if(f.out&&u>=1)continue;drawStar(lerp(f.fx,f.tx,e),lerp(f.fy,f.ty,e)-Math.sin(u*Math.PI)*70,g.d*(f.out?.4+.6*e:1-.7*e),'lit')}
  if(z.ph==='tickle'){const gl=HR('glusha');if(gl.dx){X.save();X.globalAlpha=.6+.4*Math.sin(T*6);spr('note',gl.dx-heroX(gl)*.45,gY()-gl.h*1.02+Math.sin(T*5)*8,64);X.restore()}}
  secretStep()},
 ui(){const z=ZS;if(z.ph==='ask'){const g=SC.l4.geo();choiceRow(z.opts,g.cx,g.cy,112,(v,x,y)=>SC.l4.pick(v,x,y),{wob:z.wob,bob:1})}progDots(L4M.length,Math.max(0,z.r))},
 taps(ok){const z=ZS;if(z.lock)return['wait'];const g=SC.l4.geo();
  if(z.ph==='ask'){const v=ok?z.m:z.opts.find(o=>o!==z.m);const i=z.opts.indexOf(v);return[[g.cx+(i-1)*112*1.18,g.cy]]}
  if(z.ph==='tickle'){if(!ok)return[];const gl=HR('glusha');return[[gl.dx,gY()-gl.h*.45]]}return['wait']}};
