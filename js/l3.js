'use strict';
// ===== Уровень 3: Звездопад — нота с цифрой падает в ритм; нажми на колокольчик, который дополняет её до 10 =====
const L3N=[[4,[6,5,3]],[7,[2,3,7]],[9,[8,1,9]],[2,[8,7,2]],[5,[4,6,5]],[6,[4,6,3]],[1,[9,1,8]],[8,[3,8,2]]];
SC.l3={enter(){cast=[hero('lira',0,{side:'L'}),hero('dzin',0,{side:'L',ov:.4,z:1}),hero('kov',0,{side:'R'})];const z=zoneStart(3,{i:-1,ph:'',lanes:[],sw:{},bwob:{},t0b:0});
  musStart({bpm:92,beat(i,w){const z=ZS;if(!z||z.n!==3)return;const b=i%10;if(b%2===0)boxNote(midi(SONG[b]+12),w,.05,1.2)}});
  run(async()=>{await wait(300);await say('c1');await say('c2');SC.l3.next()})},
 prog(){const z=ZS;return z.i*10+(z.ph==='ok'?5:0)},
 geo(){const P=lineup(10);const lw=Math.min(230,(P.x1-P.x0)/3);const bh=Math.min(150,lw*.75);const lx=j=>P.cx+(j-1)*lw;
  return{P,cx:P.cx,lw,bh,lx,yTop:safeT()+200,yBot:gY()-bh-78,by:gY()-bh*.5}},
 next(){const z=ZS;z.i++;if(z.i>=L3N.length){z.ph='win';GOAL='';winZone('c_win','c_gl');return}
  const [d,l]=L3N[z.i];z.d=d;z.lanes=shuffle(l.slice());z.ph='fall';z.t0b=beatF();z.nx=null;GOAL=`Нота ${d}: нажми на её пару до 10`;sayNow('c_q'+d)},
 noteXY(){const z=ZS,g=SC.l3.geo();if(z.ph==='go'||z.ph==='ok'||z.ph==='back'){const u=clamp((T-z.go.t0)/(G.fast?.02:(z.ph==='back'?.5:.35)),0,1),e=ease(u);
   if(z.ph==='back')return{x:lerp(z.go.tx,g.cx,e),y:lerp(z.go.ty,g.yTop,e)-Math.sin(u*Math.PI)*80,u};return{x:lerp(z.go.fx,z.go.tx,e),y:lerp(z.go.fy,z.go.ty,e),u}}
  const u=G.fast?.3:clamp((beatF()-z.t0b)/7,0,1);return{x:g.cx+Math.sin(u*9)*14,y:lerp(g.yTop,g.yBot,u),u}},
 send(j){const z=ZS;if(z.ph!=='fall'||z.lock)return;const g=SC.l3.geo(),p=SC.l3.noteXY();z.go={j,t0:T,fx:p.x,fy:p.y,tx:g.lx(j),ty:g.by-g.bh*.35};z.ph='go';SFX.whoosh();
  const ok=z.lanes[j]+z.d===10;run(async()=>{await wait(G.fast?40:360);if(ZS!==z)return;
   if(ok){z.ph='ok';z.lock=true;z.sw[j]=T;const t=acNow();starNote(SONG[z.i%10],t,.15);starNote(SONG[z.i%10]+7,t+.12,.1);starNote(SONG[z.i%10]+12,t+.24,.08);burst(g.lx(j),g.by-g.bh*.4,40,'spark',50,1);react(true,g.lx(j),g.by-g.bh*.4);
    z.lock=false;await sayNow('c_ok'+z.d);await wait(250);if(ZS===z)SC.l3.next()}
   else{z.bwob[j]=T;SFX.bump();z.go.tx=z.go.tx;z.go.ty=z.go.ty;z.go.t0=T;z.ph='back';mistake();sayNow('c_bad');await wait(G.fast?40:520);if(ZS===z&&z.ph==='back'){z.ph='fall';z.t0b=beatF()}}})},
 tap(x,y){const z=ZS;if(z.ph!=='fall')return;const g=SC.l3.geo();for(let j=0;j<3;j++){if(Math.abs(x-g.lx(j))<g.lw*.5&&y>g.yTop-60)return SC.l3.send(j)}},
 draw(){const z=ZS;bgDraw('l3',.18);const g=SC.l3.geo();
  // дорожки звездопада
  for(let j=0;j<3;j++){const x=g.lx(j);const gr=X.createLinearGradient(0,g.yTop-80,0,gY());gr.addColorStop(0,'rgba(255,240,170,0)');gr.addColorStop(1,'rgba(255,240,170,.22)');X.fillStyle=gr;X.beginPath();X.roundRect(x-g.lw*.42,g.yTop-80,g.lw*.84,gY()-g.yTop+70,40);X.fill()}
  drawCast();
  // колокольчики с числами
  for(let j=0;j<3;j++){const x=g.lx(j),v=z.lanes[j];if(v==null)continue;const sw=z.sw[j]&&T-z.sw[j]<1.2?Math.sin((T-z.sw[j])*14)*.25*(1-(T-z.sw[j])/1.2):0,bw=z.bwob[j]&&T-z.bwob[j]<.5?Math.sin((T-z.bwob[j])*40)*.08:0;
   X.save();X.translate(x,gY()-g.bh-6);X.rotate(sw+bw);spr('bell',0,0,g.bh,{ay:0});txt(String(v),0,g.bh*.6,g.bh*.5,'#fffdf2',{f:NUM,st:'#5a2a00',lw:8,box:[-g.bh*.45,g.bh*.2,g.bh*.45,g.bh],id:'bnum'});X.restore()}
  // падающая нота-звезда с цифрой
  if(z.ph&&z.ph!=='win'&&z.d){const p=SC.l3.noteXY();if(z.ph==='fall'&&p.u>=1){z.ph='up';z.lock=true;run(async()=>{z.go={t0:T,tx:p.x,ty:p.y};z.ph='back';z.lock=false;if(!talk)sayNow('c_again');await wait(520);if(ZS===z&&z.ph==='back'){z.ph='fall';z.t0b=beatF()}})}
   const k=z.ph==='ok'?1-clamp((T-z.go.t0-.35)/.3,0,1):1;if(k>0)drawStar(p.x,p.y,122*Math.max(.2,k),'lit',{num:z.d,ns:.5,glow:z.ph==='fall'})}
  secretStep()},
 ui(){progDots(L3N.length,Math.max(0,ZS.i))},
 taps(ok){const z=ZS;if(z.ph!=='fall'||z.lock)return['wait'];const g=SC.l3.geo();const j=z.lanes.findIndex(v=>ok?v+z.d===10:v+z.d!==10);return[[g.lx(j),gY()-g.bh*.5]]}};
