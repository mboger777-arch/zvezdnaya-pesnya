'use strict';
// ===== общие помощники, звёзды, секреты, титул, вступление, карта, бонус =====
const LVL=[{n:1,sc:'l1',name:'Небесная Десятка',pos:[215,360]},{n:2,sc:'l2',name:'Два барабана',pos:[340,150]},{n:3,sc:'l3',name:'Звездопад',pos:[618,390]},
 {n:4,sc:'l4',name:'Эхо Глуши',pos:[688,88]},{n:5,sc:'l5',name:'Звёздная дуэль',pos:[1040,370]}];
const FINPOS=[1010,110];
G.prog=()=>SCN&&SCN.prog?SCN.prog():0;G.taps=ok=>SCN&&SCN.taps?SCN.taps(ok):[];
function plaque(t,x,y,w,o){o=o||{};const sp=o.sp||'board';const h=o.h||w/aspect(sp);if(o.h)slice3(sp,x,y,w,h,{cap:1.3,a:o.a});else{X.save();X.translate(x,y);if(o.a!=null)X.globalAlpha=o.a;sprW(sp,0,0,w);X.restore()}
 textIn(t,x,y+(o.dy||0)*h,w*(o.iw||.8),h*(o.ih||.58),o.size||44,o.col||'#fff6dc',{f:o.f||FONT,st:o.st||'#3a1a06',lw:o.lw||6,id:o.id||'plaque',min:o.min||18});return h}
function fitSpr(n,x,y,d,o){const a=aspect(n);return spr(n,x,y,a>1?d/a:d,o)}
// ---- звёзды: lit (горит), dark (пустое гнездо), kid (зажёг ребёнок), blue (звезда Ковшика) ----
const TINT={};function tinted(n,col,k){const key=n+col;if(TINT[key])return TINT[key];const i=IM[n];if(!okI(i))return null;const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.drawImage(i,0,0);x.globalCompositeOperation='source-atop';x.globalAlpha=k||.5;x.fillStyle=col;x.fillRect(0,0,c.width,c.height);TINT[key]=c;return c}
function starImg(st){if(st==='blue')return tinted('star_lit','#4f7dff',.55);if(st==='pink')return tinted('star_lit','#ff7ad0',.45);return IM[st==='dark'?'star_dark':'star_lit']}
function drawStar(x,y,d,st,o){o=o||{};const im=starImg(st);if(!im||!(im.width||im.naturalWidth))return;const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height;
 const fl=o.flash!=null?clamp(1-(acNow()-o.flash)/.45,0,1)*(acNow()>=o.flash?1:0):0;const pop=o.pop!=null&&T-o.pop<.45?1+Math.sin((T-o.pop)/.45*Math.PI)*.35:1;
 const wob=o.wob!=null&&T-o.wob<.6?Math.sin((T-o.wob)*30)*.18*(1-(T-o.wob)/.6):0;const k=d*(1+fl*.22)*pop/Math.max(iw,ih);
 X.save();X.translate(x,y);X.rotate(wob+(st!=='dark'?Math.sin(T*1.7+x*.01)*.04:0));
 if(st!=='dark'&&(fl>0||o.glow)){X.globalAlpha=.35*(fl+(o.glow?.6+.4*Math.sin(T*5):0));X.fillStyle=st==='blue'?'#8fb0ff':'#fff0a0';X.beginPath();X.arc(0,0,d*.62,0,7);X.fill();X.globalAlpha=1}
 if(o.a!=null)X.globalAlpha=o.a;X.drawImage(im,-iw*k/2,-ih*k/2,iw*k,ih*k);X.globalAlpha=1;
 if(o.num!=null)txt(String(o.num),0,d*.06,d*(o.ns||.5),'#fffdf2',{f:NUM,st:'#5a2a00',lw:Math.max(5,d*.08),box:[-d*.45,-d*.45,d*.45,d*.45],id:'snum'});X.restore()}
// десятка: две строки по пять (как в уроке). Возвращает центры звёзд
function tenGeo(cx,top,w,dmax){const d=Math.min(dmax||118,w/5*.92),gx=Math.min(w/5,d*1.22),gy=d*1.12;const P=[];for(let i=0;i<10;i++){const r=i<5?0:1,c=i%5;P.push({x:cx+(c-2)*gx,y:top+d/2+r*gy})}return{P,d,h:d+gy,w:gx*5}}
// подсветка-«комета», бегущая по десятке в ритм
function drawComet(P,d,f){const i=Math.floor(f)%10,u=f-Math.floor(f);const a=P[i],b=P[(i+1)%10];const x=a.x,y=a.y-d*.62;X.save();X.globalAlpha=.85;spr('comet',x-d*.15-u*12,y+Math.sin(u*Math.PI)*-6,d*.42,{rot:0});X.restore()}
// большая доска с примером (цифры крупные и контрастные)
function eqBoard(t,x,y,w,o){o=o||{};const h=w/aspect('board');X.save();X.translate(x,y);sprW('board',0,0,w);X.restore();textIn(t,x,y,w*.8,h*.6,o.size||88,'#fffdf2',{f:NUM,st:'#3a1a06',lw:9,id:'eq',min:30});return h}
// варианты ответа — звёзды с цифрами; неверная звезда покачается, можно сразу выбрать другую
function choiceRow(opts,cx,cy,d,fn,o){o=o||{};const gap=d*1.18;opts.forEach((v,i)=>{const x=cx+(i-(opts.length-1)/2)*gap,y=cy+(o.bob?Math.sin(beatF()*Math.PI*2+i)*6:0);UI.push({id:'opt'+v,x,y,w:d,h:d,fn:()=>fn(v,x,y)});
  drawStar(x,y,d*1.08,'lit',{num:v,ns:.46,wob:o.wob&&o.wob[v],pop:o.pop&&o.pop[v]})});return opts.map((v,i)=>({v,x:cx+(i-(opts.length-1)/2)*gap,y:cy}))}
// ---- общая рамка уровня ----
function zoneStart(n,o){STF.length=0;for(const k in PDOT)delete PDOT[k];ZS=Object.assign({n,r:0,done:false,lock:false,mist:0,step:0},o||{});secretInit(n);return ZS}
function mistake(){ZS.mist++;SFX.bad();react(false)}
function HR(n){return cast.find(c=>c.n===n)}
function lineup(gap){gap=gap==null?14:gap;let xl=safeL(),xr=safeR();
 for(const c of cast){if(c.side!=='L'||c.hide)continue;const w=heroBW(c),lw=heroLW(c);const edge=xl===safeL();c.x=edge?xl+w/2:xl-(c.ov||0)*lw+lw/2;xl=Math.max(xl,c.x+(edge?w/2-(w-lw)/2:lw/2))}
 for(const c of cast){if(c.side!=='R'||c.hide)continue;const w=heroBW(c),lw=heroLW(c);const edge=xr===safeR();c.x=edge?xr-w/2:xr+(c.ov||0)*lw-lw/2;xr=Math.min(xr,c.x-(edge?w/2-(w-lw)/2:lw/2))}
 return{x0:xl+gap,x1:xr-gap,cx:(xl+xr)/2}}
// реакции: верно — все радуются, Глуша ворчит; ошибка — Глуша хихикает, Лира думает, Дзинь грустит (недолго)
function react(ok,x,y){const l=HR('lira'),k=HR('kov'),d=HR('dzin'),g=HR('glusha');
 if(ok){if(l){l.jump=T;pose('lira','cheer',1.4)}if(k){k.jump=T+.1;pose('kov','cheer',1.4)}if(d){d.jump=T+.2;pose('dzin','cheer',1.4)}
  if(g&&!g.kind){pose('glusha','angry',1.6);g.wob=T;setTimeout(()=>SFX.grumble(),G.fast?0:300)}SFX.yay();if(x!=null)flyStar(x,y)}
 else{if(l){l.wob=T;pose('lira','think',1.8)}if(k)pose('kov','wow',1.4);if(d)pose('dzin','sad',1.2);if(g&&!g.kind){pose('glusha','laugh',1.4);g.jump=T;SFX.giggle()}}}
const STF=[];function flyStar(x,y){STF.push({x,y,t0:T})}
async function winZone(line,gl){const z=ZS;z.lock=true;cheer();burst(640,300,90,'conf',null,1.4);SFX.star();
 const i=z.n-1;SV.stars[i]=1;SV.open=Math.max(SV.open,Math.min(6,z.n+1));save();z.won=1;
 await say(line);if(gl){z.glq=1;await say(gl)}await wait(500);z.done=true;z.lock=false;go('map')}
function progDots(n,done){DOTSN=n;const x1=safeR()-14,r=dotR(n),per=n;const gr=goalRect();
 const px=i=>x1-(per-1-i)*(r*2.3)-r,py=i=>gr.top+gr.bh/2;
 {const xa=px(0)-r*1.25,xb=x1+r*.15,yc=py(0);X.save();X.fillStyle='rgba(20,14,44,.42)';X.beginPath();X.roundRect(xa,yc-r*1.25,xb-xa,r*2.5,r*1.25);X.fill();X.restore()}
 for(let i=0;i<n;i++){const x=px(i),y=py(i);const pop=PDOT[i]&&T-PDOT[i]<.5?1+Math.sin((T-PDOT[i])/.5*Math.PI)*.45:1;X.save();X.globalAlpha=i<done?1:.45;spr(i<done?'star':'star_dark',x,y,r*2.2*pop,{rot:i<done?Math.sin(T*2+i)*.1:0});X.restore()}
 for(let j=STF.length-1;j>=0;j--){const s=STF[j],u=clamp((T-s.t0)/(G.fast?.05:.7),0,1),e=ease(u);const i=Math.max(0,Math.min(n-1,done-1));const tx=px(i);
  const x=lerp(s.x,tx,e),yy=lerp(s.y,py(i),e)-Math.sin(u*Math.PI)*120;spr('star',x,yy,70*(1-u*.4),{rot:u*8});if(Math.random()<.5)burst(x,yy,1,'spark',50,.3);
  if(u>=1){STF.splice(j,1);PDOT[i]=T;SFX.coin()}}}
const PDOT={};
// ---- секрет уровня: падающая золотая звезда пролетает по небу; поймай — и она твоя ----
const SEC={n:0,t:0,on:null,got:0};
function secretInit(n){SEC.n=n;SEC.on=null;SEC.got=0;SEC.t=T+(G.fast?.5:rnd(9,15))}
function secretStep(){if(!SEC.n||SEC.n>5)return;if(SV.sec[SEC.n-1]&&!SEC.on)return;const v=vis();
 if(!SEC.on&&T>SEC.t&&!locked()){const dir=Math.random()<.5?1:-1;SEC.on={t0:T,dir,y0:safeT()+rnd(150,230),d:G.fast?60:4.2}}
 const s=SEC.on;if(!s)return;const u=(T-s.t0)/s.d;if(u>1){SEC.on=null;SEC.t=T+rnd(12,18);return}
 const x0=s.dir>0?v.x0-60:v.x0+v.w+60,x1=s.dir>0?v.x0+v.w+60:v.x0-60;s.x=lerp(x0,x1,G.fast?.5:u);s.y=s.y0+Math.sin(u*Math.PI)*-40+u*60;
 X.save();X.translate(s.x,s.y);X.scale(-s.dir,1);spr('comet',0,0,80);X.restore();if(Math.random()<.4)burst(s.x,s.y,1,'spark',48,.25);
 UI.push({id:'secret',x:s.x,y:s.y,w:120,h:110,fn:()=>secretCatch()})}
function secretCatch(){const s=SEC.on;if(!s)return;SEC.on=null;SEC.got=1;SV.sec[SEC.n-1]=1;save();burst(s.x,s.y,50,'spark',50,1.2);SFX.star();starNote(SONG[0]+12,acNow());const d=HR('dzin');if(d){d.jump=T;pose('dzin','cheer',1.4)}
 sayNow(SV.sec.every(v=>v)?'sec_all':'sec_ok')}
G.secret=()=>SEC.on?{x:SEC.on.x,y:SEC.on.y}:null;
// ---- титул ----
SC.title={enter(){cast=[hero('lira',0),hero('dzin',0),hero('kov',0)];musMenu()},
 draw(){bgDraw('title');const hw=c=>heroX(c);
  cast[0].x=safeL()+hw(cast[0])/2;cast[1].x=safeL()+hw(cast[0])+hw(cast[1])/2-14;cast[2].x=safeR()-hw(cast[2])/2;
  // звёзды-ноты вокруг названия мерцают по очереди в такт колыбельной
  const lx=(cast[1].x+hw(cast[1])/2+cast[2].x-hw(cast[2])/2)/2,lw=Math.min(620,cast[2].x-hw(cast[2])/2-(cast[1].x+hw(cast[1])/2)-10);
  const f=beatF();for(let i=0;i<10;i++){const a=-Math.PI*.92+i/9*Math.PI*.84;const x=lx+Math.cos(a)*lw*.5,y=safeT()+250+Math.sin(a)*170;drawStar(x,y,46,Math.floor(f)%10===i?'lit':'lit',{a:Math.floor(f)%10===i?1:.55})}
  drawCast();
  const lh=lw/aspect('plank');X.save();X.translate(lx,safeT()+200);X.rotate(Math.sin(T*1.1)*.012);sprW('plank',0,0,lw);X.restore();
  textIn('Звёздная песня',lx,safeT()+200+lh*.08,lw*.78,lh*.5,92,'#fff6dc',{f:FONT,st:'#3a1a06',lw:9,id:'logo'});
  textIn('игра про число 10',lx,safeT()+200+lh/2+40,lw*.9,56,48,'#ffe27a',{f:FONT,st:'#1a1050',lw:7,id:'logo2'});SC.title.lx=lx;SC.title.ly=safeT()+200+lh/2+70},
 ui(){const lx=SC.title.lx||640;boardBtn('play',lx,Math.min(safeB()-90,SC.title.ly+110),360,'Играть',()=>{ac();if(!SV.intro)go('intro');else go('map')},{pulse:1,size:72});
  btn('sound','b_sound',safeR()-44,safeT()+42,84,()=>{G.mute=!G.mute;if(G.mute)stopTalk()},{always:1});if(G.mute){X.save();X.strokeStyle='#d0202a';X.lineWidth=9;X.lineCap='round';const x=safeR()-44,y=safeT()+42;X.beginPath();X.moveTo(x-30,y-30);X.lineTo(x+30,y+30);X.stroke();X.restore()}}};
// ---- вступление: песня звучит, Глуша глотает ноты, Дзинь падает на палубу ----
SC.intro={enter(){cast=[hero('lira',0,{side:'L'}),hero('dzin',0,{side:'L',ov:.3,hide:1}),hero('kov',0,{side:'L',ov:.15}),hero('glusha',0,{side:'R',hide:1})];const z=zoneStart(0,{lit:[1,1,1,1,1,1,1,1,1,1],fl:[],eat:[]});SEC.n=0;
  musStart({bpm:96,beat(i,w){const b=i%10;if(z.lit[b]){starNote(SONG[b],w);z.fl[b]=w}else hollow(w)}});
  const gl=HR('glusha'),dz=HR('dzin');
  run(async()=>{await wait(500);await say('i1');await say('i2');
   gl.hide=0;gl.fly={t0:T,from:1};SFX.whoosh();await wait(G.fast?20:900);pose('glusha','angry');await say('i3');
   // Глуша вдыхает — четыре звезды летят ей в рот
   pose('glusha','laugh');SFX.suck();for(const b of [3,6,8,9]){z.eat.push({b,t0:T});await wait(G.fast?10:260)}await wait(G.fast?10:500);for(const b of [3,6,8,9])z.lit[b]=0;
   await say('i4');gl.fly={t0:T,from:0};SFX.whoosh();await wait(G.fast?20:900);gl.hide=1;
   // Дзинь падает на палубу
   dz.hide=0;dz.drop=T;SFX.zip();await wait(G.fast?20:700);SFX.bell();shake=5;pose('dzin','sad');await say('i5');pose('dzin','');
   pose('lira','point');await say('i6');pose('lira','');pose('kov','cheer');SFX.thump();await say('i7');pose('kov','');cheer();await say('i8');
   SV.intro=1;save();await wait(300);go('map')})},
 draw(){const z=ZS;bgDraw('title');const P=lineup();const gl=HR('glusha'),dz=HR('dzin');
  const g=tenGeo(P.cx,safeT()+200,Math.min(560,P.x1-P.x0),100);const f=beatF();
  g.P.forEach((p,i)=>{const e=z.eat.find(q=>q.b===i);if(e&&!z.lit[i])return drawStar(p.x,p.y,g.d,'dark');if(e){const u=clamp((T-e.t0)/(G.fast?.02:.6),0,1),gx=gl.dx||safeR()-150,gy=gY()-gl.h*.62;drawStar(lerp(p.x,gx,ease(u)),lerp(p.y,gy,ease(u)),g.d*(1-u*.7),'lit');return}
   drawStar(p.x,p.y,g.d,z.lit[i]?'lit':'dark',{flash:z.fl[i]})});
  if(MUS.on)drawComet(g.P,g.d,f);
  if(gl.fly){const u=clamp((T-gl.fly.t0)/(G.fast?.02:.85),0,1),e=ease(u);const off=(gl.fly.from?1-e:e)*600;gl.gy=gY()-(gl.fly.from?(1-e):e)*260;gl.ox=off}
  if(dz.drop){const u=clamp((T-dz.drop)/(G.fast?.02:.7),0,1);dz.gy=gY()-(1-u*u)*520-(u>=1?0:0);if(u>=1){dz.gy=null;dz.drop=0;burst(dz.dx||400,gY()-10,30,'spark',50)}}
  for(const c of cast)if(c.ox){c.x+=c.ox}
  drawCast()},
 ui(){boardBtn('skip',640,safeB()-40,220,'Дальше',()=>{SV.intro=1;save();go('map')},{size:44})}};
// ---- карта: вся карта видна целиком; по краям — размытый фон ----
function mapRect(){const v=vis(),k=Math.min(v.w/1280,v.h/720);const w=1280*k,h=720*k;return{x:640-w/2,y:v.y0+v.h-h,k,w,h}}
SC.map={enter(){cast=[hero('lira',0,{h:280}),hero('dzin',0,{h:130})];GOAL='';musMenu();
  run(async()=>{await wait(300);if(SV.stars.every(v=>!v))await say('m1');else if(SV.stars.every(v=>v)&&!SV.fin)await say('m_fin');else if(SV.sec.every(v=>v)&&!SV.bonus)await say('m_bonus')})},
 draw(){const v=vis(),m=mapRect();const b=IM.bg_map;
  if(okI(b)){X.save();X.filter='blur(14px) brightness(.8)';const s=Math.max(v.w/1280,v.h/720)*1.1;X.drawImage(b,640-640*s,v.y0+v.h/2-360*s,1280*s,720*s);X.restore();X.drawImage(b,m.x,m.y,m.w,m.h)}
  BGN='map';for(const c of cast){c.gy=safeB()-4}
  cast[0].x=safeL()+heroX(cast[0])/2;cast[1].x=safeL()+heroX(cast[0])+heroX(cast[1])/2-14;drawCast()},
 ui(){const m=mapRect();{const w=5*50+30,y=safeB()-34;X.save();X.fillStyle='rgba(20,14,44,.55)';X.beginPath();X.roundRect(640-w/2,y-30,w,60,30);X.fill();X.restore();for(let i=0;i<5;i++)drawStar(640-100+i*50,y,46,SV.stars[i]?'lit':'dark')}
  LVL.forEach((z,i)=>{const x=m.x+z.pos[0]*m.k,y=m.y+z.pos[1]*m.k,open=SV.open>=z.n,done=SV.stars[i];const d=100,bob=Math.sin(T*2+i)*4;
   btn('zone'+z.n,'tile',x,y+bob,d,()=>{if(!open){sayNow('m_lock');SFX.bad();return}go(z.sc)},{pulse:open&&!done});
   txt(String(z.n),x,y+bob+3,70,open?'#fff6dc':'#9ab0c0',{f:NUM,st:'#0a1a5a',lw:8,box:[x-d*.4,y+bob-d*.4,x+d*.4,y+bob+d*.4],id:'zn'});
   if(!open)spr('lock',x+38,y+bob+34,56);if(done)spr('star',x+40,y+bob-40,60,{rot:Math.sin(T*2)*.1});if(SV.sec[i])spr('comet',x-44,y+bob-42,46);
   plaque(z.name,x,y+bob+d/2+44,280,{size:40,id:'zname',sp:'lplank',h:92,iw:.84,ih:.82,min:30})});
  const allS=SV.stars.every(v=>v);const[fx,fy]=[m.x+FINPOS[0]*m.k,m.y+FINPOS[1]*m.k];const bob=Math.sin(T*2.2)*5;
  btn('zone6','tile',fx,fy+bob,110,()=>{if(!allS){sayNow('m_lock');SFX.bad();return}go('fin')},{pulse:allS&&!SV.fin});if(allS)drawStar(fx,fy+bob,64,'lit');else spr('lock',fx,fy+bob,60);
  if(SV.fin)spr('medal',fx+44,fy+bob-40,74);plaque('Финал',fx,fy+bob+88,190,{size:42,id:'zname',sp:'lplank',h:70,iw:.8,ih:.75});
  // золотые ноты-секреты: пять гнёзд; когда собраны все — бонусная песенка
  const sc=SV.sec.filter(v=>v).length,bx=safeR()-150,by=safeB()-64;if(sc>=5){const bw=240,bh=bw/aspect('board');boardBtn('bonus',safeR()-bw/2-14,safeB()-bh/2-10,bw,'Бонус-песня',()=>go('bonus'),{pulse:!SV.bonus,size:42})}
  else{const w=250,h=74;X.save();X.fillStyle='rgba(20,14,44,.55)';X.beginPath();X.roundRect(bx-w/2,by-h/2,w,h,h/2);X.fill();X.restore();for(let i=0;i<5;i++)drawStar(bx-96+i*48,by,40,SV.sec[i]?'lit':'dark')}}};
// ---- бонус: «Звёздное пианино» — песенка «Сияй, звёздочка» по светящимся звёздам, потом свободная игра ----
const PIANO=[60,62,64,65,67,69,71,72,74,76];
const TW=[0,0,4,4,5,5,4,3,3,2,2,1,1,0,4,4,3,3,2,2,1,4,4,3,3,2,2,1,0,0,4,4,5,5,4,3,3,2,2,1,1,0];
SC.bonus={enter(){cast=[hero('lira',0,{side:'L'}),hero('dzin',0,{side:'L',ov:.3}),hero('kov',0,{side:'R'})];const z=zoneStart(7,{k:0,free:0,fl:{}});SEC.n=0;musStop();
  run(async()=>{await wait(300);await say('bn1');GOAL='Нажимай на звезду, которая светится';await say('bn2')})},
 prog(){return ZS.k},
 geo(){const P=lineup(10);return tenGeo(P.cx,250,Math.min(640,P.x1-P.x0),120)},
 tap(x,y){const z=ZS,g=SC.bonus.geo();g.P.forEach((p,i)=>{if(Math.hypot(x-p.x,y-p.y)<g.d*.6)SC.bonus.hit(i)})},
 hit(i){const z=ZS;starNote(PIANO[i]-12,acNow(),.16);z.fl[i]=acNow();if(z.free)return;
  if(i===TW[z.k]){z.k++;if(z.k%7===0){HR('dzin').jump=T;burst(640,300,20,'spark',50)}if(z.k>=TW.length){z.free=1;z.done=true;GOAL='Играй сам: нажимай на любые звёзды';SV.bonus=1;save();cheer();burst(640,300,90,'conf',null,1.4);sayNow('bn_win')}}},
 draw(){const z=ZS;bgDraw('fin');const g=SC.bonus.geo();g.P.forEach((p,i)=>drawStar(p.x,p.y,g.d,'lit',{flash:z.fl[i],glow:!z.free&&TW[z.k]===i,a:z.free||TW[z.k]===i?1:.7}));drawCast()},
 ui(){const z=ZS;if(!z.free){const w=Math.min(520,vis().w*.4);X.save();X.fillStyle='rgba(20,14,44,.5)';X.beginPath();X.roundRect(640-w/2,safeB()-150,w,22,11);X.fill();X.fillStyle='#ffd34a';X.beginPath();X.roundRect(640-w/2,safeB()-150,Math.max(22,w*z.k/TW.length),22,11);X.fill();X.restore()}},
 taps(ok){const z=ZS;if(z.free)return['wait'];const g=SC.bonus.geo();const p=g.P[ok?TW[z.k]:(TW[z.k]+1)%10];return ok?[[p.x,p.y]]:[]}};
