'use strict';
// ===== Уровень 1: Небесная Десятка — зажги тёмные звёзды до десяти, потом «6 + ? = 10» =====
const L1R=[6,3,7,5];
function l1opts(n){const s=new Set([n]);const c=[n-1,n+1,n+2,n-2].filter(v=>v>=1&&v<=9);shuffle(c);while(s.size<3)s.add(c.pop());return shuffle([...s])}
SC.l1={enter(){cast=[hero('lira',0,{side:'L'}),hero('dzin',0,{side:'L',ov:.4,z:1}),hero('kov',0,{side:'R'})];const z=zoneStart(1,{r:-1,ph:'',lit:[],fl:[],pop:{},swob:{},wob:{},opop:{},flour:0});
  musStart({bpm:92,beat(i,w){const z=ZS;if(!z||z.n!==1||!z.lit.length)return;const b=i%10;if(z.lit[b]){starNote(SONG[b],w,z.lit[b]===2?.15:.12);z.fl[b]=w}else hollow(w)}});
  run(async()=>{await wait(300);await say('a1');await say('a2');SC.l1.next()})},
 prog(){const z=ZS;return z.r*100+(z.ph==='ask'?50:z.ph==='light'?0:70)+z.lit.filter(v=>v===2).length},
 geo(){const P=lineup(10);const g=tenGeo(P.cx,safeT()+190,Math.min(620,P.x1-P.x0),104);g.cx=P.cx;g.by=g.P[5].y+g.d*.5+70;g.cy=Math.min(gY()-70,g.by+120);return g},
 next(){const z=ZS;z.r++;if(z.r>=L1R.length){z.ph='win';GOAL='';z.lit=Array(10).fill(1);winZone('a_win','a_gl');return}
  const k=L1R[z.r];z.k=k;z.lit=Array.from({length:10},(_,i)=>i<k?1:0);z.ph='light';z.opts=l1opts(10-k);z.wob={};GOAL='Зажги тёмные звёзды: нажимай на них';sayNow('a_r'+k)},
 tap(x,y){const z=ZS;if(z.ph!=='light')return;const g=SC.l1.geo();const i=g.P.findIndex(p=>Math.hypot(x-p.x,y-p.y)<g.d*.62);if(i<0)return;
  if(z.lit[i]===1){z.swob[i]=T;SFX.blip();if(!talk)sayNow('a_old');return}
  if(z.lit[i]===2){z.lit[i]=0;z.pop[i]=T;tone(500,.12,'sine',.06,0,300);return}// погасить — ошибку можно исправить сразу
  z.lit[i]=2;z.pop[i]=T;starNote(SONG[i],acNow(),.15);z.fl[i]=acNow();burst(g.P[i].x,g.P[i].y,14,'spark',50,.5);if(offBeat()<.11)burst(g.P[i].x,g.P[i].y,10,'spark',190,.8);
  if(z.lit.every(v=>v))SC.l1.full()},
 full(){const z=ZS;z.ph='full';z.lock=true;run(async()=>{const t=acNow();z.flour=t;for(let i=0;i<10;i++){starNote(SONG[i],t+i*.2,.14);z.fl[i]=t+i*.2}
   HR('kov').jump=T;await wait(2100);z.lock=false;if(ZS!==z)return;z.ph='ask';GOAL=`${z.k} + ? = 10`;await sayNow('a_q'+z.k)})},
 pick(v,x,y){const z=ZS;if(z.ph!=='ask'||z.lock)return;const need=10-z.k;
  if(v===need){z.ph='ok';z.lock=true;z.okv=v;react(true,x,y);burst(x,y,40,'conf',null,.8);run(async()=>{z.lock=false;await sayNow('a_ok'+z.k);await wait(300);if(ZS===z)SC.l1.next()});return}
  z.wob[v]=T;mistake();sayNow('a_bad')},
 draw(){const z=ZS;bgDraw('l1');const g=SC.l1.geo();let kn=0;
  g.P.forEach((p,i)=>{const st=z.lit[i]?'lit':'dark';const num=z.lit[i]===2?++kn:null;drawStar(p.x,p.y,g.d,st,{flash:z.fl[i],pop:z.pop[i],wob:z.swob[i],num,ns:.42})});
  if(MUS.on&&z.lit.length)drawComet(g.P,g.d,beatF());
  // доска-пример и звёзды-ответы
  if(z.k&&z.ph!=='win'){const w=Math.min(430,g.w*.78);slice3('banner',g.cx,g.by,w,96,{cap:1.4});const t=z.ph==='ok'?`${z.k} + ${10-z.k} = 10`:`${z.k} + ? = 10`;
   textIn(t,g.cx,g.by,w*.8,70,70,'#fffdf2',{f:NUM,st:'#0a1a5a',lw:8,id:'eq'})}
  drawCast();secretStep()},
 ui(){const z=ZS;if(z.ph==='ask'){const g=SC.l1.geo();choiceRow(z.opts,g.cx,g.cy,112,(v,x,y)=>SC.l1.pick(v,x,y),{wob:z.wob,bob:1})}progDots(L1R.length,Math.max(0,z.r))},
 taps(ok){const z=ZS;if(z.lock||z.ph==='full'||z.ph==='ok'||z.ph==='')return['wait'];const g=SC.l1.geo();
  if(z.ph==='light'){if(!ok)return[];const i=z.lit.indexOf(0);return i<0?['wait']:[[g.P[i].x,g.P[i].y]]}
  if(z.ph==='ask'){const need=10-z.k,v=ok?need:z.opts.find(o=>o!==need);const i=z.opts.indexOf(v);return[[g.cx+(i-1)*112*1.18,g.cy]]}return['wait']}};
