'use strict';
// ===== Уровень 5: Звёздная дуэль — Глуша гасит звёзды, ребёнок отвечает звездой с цифрой; темп растёт =====
// [пример, ответ, сколько звёзд горит в подсказке (null — без подсказки), сколько гаснет]
const L5Q=[['4 + ? = 10',6,4],['? + 2 = 10',8,2],['10 − 3 = ?',7,7],['7 + ? = 10',3,7],['? + 5 = 10',5,null],['10 − 9 = ?',1,null],['8 + ? = 10',2,null],['? + 6 = 10',4,null],['10 − 4 = ?',6,null],['1 + ? = 10',9,null]];
SC.l5={enter(){cast=[hero('lira',0,{side:'L'}),hero('dzin',0,{side:'L',ov:.4,z:1}),hero('glusha',0,{side:'R',base:'angry'})];const z=zoneStart(5,{r:-1,ph:'',lit:[],fl:[],wob:{},pop:{},bpm:90});
  musStart({bpm:90,beat(i,w){const z=ZS;if(!z||z.n!==5)return;const b=i%10;if(z.lit.length){if(z.lit[b]){starNote(SONG[b],w,.11);z.fl[b]=w}else hollow(w)}else if(b%2===0)boxNote(midi(SONG[b]+12),w,.05,1)}});
  run(async()=>{await wait(300);await say('e1');await say('e2');SC.l5.next()})},
 prog(){const z=ZS;return z.r*10+(z.ph==='ask'?0:5)},
 geo(){const P=lineup(10);const w=Math.min(600,P.x1-P.x0);const q=L5Q[Math.max(0,ZS.r)]||[];const bar=q[2]!=null;const g=tenGeo(P.cx,safeT()+190,w,92);g.cx=P.cx;g.bar=bar;
  g.by=bar?g.P[5].y+g.d*.5+62:safeT()+300;g.cy=Math.min(gY()-70,g.by+(bar?118:150));return g},
 next(){const z=ZS;z.r++;if(z.r>=L5Q.length){z.ph='win';GOAL='';z.lit=[];const gl=HR('glusha');gl.base='';run(async()=>{pose('glusha','yawn',4);await say('e_yawn');winZone('e_win')});return}
  const [t,ans,lit]=L5Q[z.r];z.t=t;z.ans=ans;z.opts=l1opts(ans);z.wob={};z.ph='call';z.lock=true;GOAL='';
  const bpm=90+z.r*5;musTempo(bpm);
  run(async()=>{const gl=HR('glusha');gl.jump=T;SFX.whoosh();
   if(lit!=null){z.lit=Array(10).fill(1);await wait(G.fast?10:300);// Глуша дует — часть звёзд гаснет
    const off=t.startsWith('?')?[...Array(10-lit).keys()]:[...Array(10).keys()].slice(lit);for(const b of off){z.lit[b]=0;z.pop[b]=T;await wait(G.fast?2:90)}}else z.lit=[];
   if(z.r===4&&!G.fast)await sayNow('e_fast');
   z.ph='ask';z.lock=false;GOAL=t;await sayNow('e_q'+z.r)})},
 pick(v,x,y){const z=ZS;if(z.ph!=='ask'||z.lock)return;
  if(v===z.ans){z.ph='ok';z.lock=true;react(true,x,y);const t=acNow();[0,4,7,12].forEach((d,i)=>pluck(midi(60+d),i*.06,.07));HR('glusha').wob=T;shake=4;
   run(async()=>{z.lock=false;await sayNow('e_ok'+(1+z.r%3));await wait(200);if(ZS===z)SC.l5.next()});return}
  z.wob[v]=T;mistake();sayNow('e_bad')},
 draw(){const z=ZS;bgDraw('l5');const g=SC.l5.geo();
  if(g.bar&&z.lit.length){g.P.forEach((p,i)=>drawStar(p.x,p.y,g.d,z.lit[i]?'lit':'dark',{flash:z.fl[i],pop:z.pop[i]}));if(MUS.on)drawComet(g.P,g.d,beatF())}
  if(z.t&&z.ph!=='win'){const w=Math.min(480,g.w*.85);slice3('banner',g.cx,g.by,w,104,{cap:1.4});const t=z.ph==='ok'?z.t.replace('?',z.ans):z.t;textIn(t,g.cx,g.by,w*.8,76,76,'#fffdf2',{f:NUM,st:'#0a1a5a',lw:8,id:'eq'})}
  drawCast();secretStep()},
 ui(){const z=ZS;if(z.ph==='ask'){const g=SC.l5.geo();choiceRow(z.opts,g.cx,g.cy,118,(v,x,y)=>SC.l5.pick(v,x,y),{wob:z.wob,bob:1})}progDots(L5Q.length,Math.max(0,z.r))},
 taps(ok){const z=ZS;if(z.ph!=='ask'||z.lock)return['wait'];const g=SC.l5.geo();const v=ok?z.ans:z.opts.find(o=>o!==z.ans);const i=z.opts.indexOf(v);return[[g.cx+(i-1)*118*1.18,g.cy]]}};
