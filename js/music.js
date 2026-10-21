'use strict';
// ===== Музыка: колыбельная-шкатулка, мягкий пэд с ревербером и ритм. Всё синтезируется WebAudio, точно по часам AudioContext =====
const midi=m=>440*Math.pow(2,(m-69)/12);
// Звёздная песня: 10 нот = 10 звёзд Небесной Десятки (две строки по пять)
const SONG=[67,64,67,69,67,64,62,64,62,60];
const SONGCH=['C','C','C','F','C','C','G','C','G','C'];
const CHORDS={C:[48,55,64,67],F:[41,53,57,60],G:[43,55,59,62],Am:[45,52,57,60],Dm:[38,50,57,62],E:[40,52,56,59]};
const MUS={on:false,i:0,next:0,dur:.625,o:null,timer:null,log:[],bus:null,wet:null,padN:[],chord:'',duck:1};
function musInit(){const a=ac();if(!a)return null;if(MUS.bus)return a;
 MUS.master=a.createGain();MUS.master.gain.value=.9;const comp=a.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;MUS.master.connect(comp).connect(a.destination);
 MUS.bus=a.createGain();MUS.bus.gain.value=.8;MUS.bus.connect(MUS.master);
 // ревербер: синтезированный импульс (мягкий «зал»)
 const len=Math.floor(a.sampleRate*2.6),ir=a.createBuffer(2,len,a.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
 const cv=a.createConvolver();cv.buffer=ir;MUS.wet=a.createGain();MUS.wet.gain.value=.32;MUS.wet.connect(cv).connect(MUS.master);return a}
function dest(){return MUS.bus||(AC&&AC.destination)}
function env(g,t,a,peak,d){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+a+d)}
// музыкальная шкатулка: основной тон + обертоны, быстрая атака, долгое затухание
function boxNote(f,when,vol,dec){const a=musInit();if(!a||G.mute)return;const t=Math.max(a.currentTime,when||a.currentTime);vol=vol||.12;dec=dec||1.6;
 [[1,1],[2,.28],[3.01,.09],[4.2,.04]].forEach(([k,v])=>{const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f*k;env(g,t,.004,vol*v,dec/(k>1?k*.7:1));o.connect(g);g.connect(MUS.bus);g.connect(MUS.wet);o.start(t);o.stop(t+dec+.1)})}
// звезда-колокольчик: чистый тон + неровный обертон (переливается)
function starNote(m,when,vol){const a=musInit();if(!a||G.mute)return;const t=Math.max(a.currentTime,when||a.currentTime),f=midi(m+12);vol=vol||.13;
 [[1,1,2.2],[2.01,.22,1.2],[2.76,.08,.8],[.5,.18,1.6]].forEach(([k,v,d])=>{const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f*k;env(g,t,.006,vol*v,d);o.connect(g);g.connect(MUS.bus);g.connect(MUS.wet);o.start(t);o.stop(t+d+.1)})}
// щипок струны (лира Лиры)
function pluck(f,when,vol){const a=musInit();if(!a||G.mute)return;const t=a.currentTime+(when||0);const o=a.createOscillator(),o2=a.createOscillator(),g=a.createGain(),lp=a.createBiquadFilter();o.type='triangle';o2.type='sawtooth';o.frequency.value=f;o2.frequency.value=f*1.003;
 lp.type='lowpass';lp.frequency.setValueAtTime(4000,t);lp.frequency.exponentialRampToValueAtTime(600,t+.6);const g2=a.createGain();g2.gain.value=.25;o2.connect(g2).connect(lp);o.connect(lp);lp.connect(g);env(g,t,.003,vol||.08,1.1);g.connect(MUS.bus);g.connect(MUS.wet);o.start(t);o2.start(t);o.stop(t+1.3);o2.stop(t+1.3)}
// мягкий пэд аккордом
function pad(ch,when,dur,vol){const a=musInit();if(!a||G.mute)return;const t=Math.max(a.currentTime,when);vol=vol||.022;
 for(const m of CHORDS[ch]){for(const det of [-5,5]){const o=a.createOscillator(),g=a.createGain(),lp=a.createBiquadFilter();o.type='triangle';o.frequency.value=midi(m);o.detune.value=det;lp.type='lowpass';lp.frequency.value=900;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+Math.min(.5,dur*.3));g.gain.setValueAtTime(vol,t+dur*.75);g.gain.linearRampToValueAtTime(0,t+dur+.4);o.connect(lp).connect(g);g.connect(MUS.bus);g.connect(MUS.wet);o.start(t);o.stop(t+dur+.5)}}}
function kick(when,vol){const a=musInit();if(!a||G.mute)return;const o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(120,when);o.frequency.exponentialRampToValueAtTime(42,when+.2);env(g,when,.004,vol||.22,.24);o.connect(g).connect(MUS.bus);o.start(when);o.stop(when+.3)}
let _nb=null;function nbuf(a){if(!_nb){_nb=a.createBuffer(1,a.sampleRate*.3,a.sampleRate);const d=_nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}return _nb}
function shaker(when,vol){const a=musInit();if(!a||G.mute)return;const s=a.createBufferSource();s.buffer=nbuf(a);const f=a.createBiquadFilter();f.type='highpass';f.frequency.value=6500;const g=a.createGain();env(g,when,.006,vol||.035,.07);s.connect(f).connect(g).connect(MUS.bus);s.start(when);s.stop(when+.12)}
function woodTick(when,vol){const a=musInit();if(!a||G.mute)return;const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(1250,when);env(g,when,.002,vol||.045,.05);o.connect(g).connect(MUS.bus);o.start(when);o.stop(when+.08)}
// «пустая» доля — тихий глухой вздох вместо ноты: слышно, что ноты не хватает
function hollow(when){const a=musInit();if(!a||G.mute)return;const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(196,when);o.frequency.exponentialRampToValueAtTime(150,when+.25);env(g,when,.01,.035,.25);o.connect(g).connect(MUS.bus);o.start(when);o.stop(when+.3)}
function drumHit(when,vol){const a=musInit();if(!a||G.mute)return;when=when||a.currentTime;kick(when,(vol||1)*.3);const s=a.createBufferSource();s.buffer=nbuf(a);const f=a.createBiquadFilter();f.type='bandpass';f.frequency.value=1800;f.Q.value=.8;const g=a.createGain();env(g,when,.002,.12*(vol||1),.12);s.connect(f).connect(g).connect(MUS.bus);s.start(when);s.stop(when+.2)}
// ---- часы ритма: o={bpm, beat(i,when), kit:'soft'|'none', bar:10, pad:true} ----
function acNow(){return AC?AC.currentTime:T}
function musStart(o){const a=musInit();musStop();MUS.o=o||{};if(!a)return;MUS.dur=60/(MUS.o.bpm||96);MUS.next=a.currentTime+.15;MUS.i=0;MUS.log=[];MUS.on=true;MUS.chord='';MUS.timer=setInterval(musTick,25);musTick()}
function musStop(){MUS.on=false;if(MUS.timer)clearInterval(MUS.timer);MUS.timer=null}
function musTempo(bpm){MUS.dur=60/bpm;if(MUS.o)MUS.o.bpm=bpm}
function musTick(){const a=AC;if(!a||!MUS.on)return;if(a.state!=='running')return;
 if(MUS.next<a.currentTime-.3)MUS.next=a.currentTime+.05;
 while(MUS.next<a.currentTime+.16){const i=MUS.i,w=MUS.next,o=MUS.o,bar=o.bar||10,b=i%bar;MUS.log.push([i,w,MUS.dur]);if(MUS.log.length>16)MUS.log.shift();
  if(!G.mute){if(o.kit!=='none'){if(b===0||(bar===10&&b===5))kick(w,.16);shaker(w,b%2?.02:.03);if(o.tick)woodTick(w,.03)}
   if(o.pad!==false){const ch=o.chord?o.chord(i):SONGCH[b%10];if(ch&&ch!==MUS.chord){MUS.chord=ch;let n=1;while(n<bar&&(o.chord?o.chord(i+n):SONGCH[(b+n)%10])===ch&&(b+n)%bar!==0)n++;pad(ch,w,n*MUS.dur,o.padVol)}}}
  try{o.beat&&o.beat(i,w)}catch(e){console.error(e)}
  MUS.i++;MUS.next+=MUS.dur}}
// дробная позиция в ритме по часам AudioContext (для кометы и пульса)
function beatF(){if(!MUS.on||!MUS.log.length||!AC)return T/.625;const now=AC.currentTime;let L=MUS.log[0];for(const e of MUS.log)if(e[1]<=now)L=e;return L[0]+clamp((now-L[1])/L[2],0,1.999)}
// насколько близко к доле (0 — точно в долю). Для мягкой похвалы «в такт!», ошибкой не считается никогда
function offBeat(){const f=beatF();const d=Math.abs(f-Math.round(f));return d*MUS.dur}
// ---- колыбельная для титула и карты (своя мелодия на тему Звёздной песни) ----
const MENU=[67,64,67,69,67,0, 64,62,64,62,60,0, 69,67,69,72,69,0, 67,64,62,64,60,0];
const MENUCH=['C','C','C','F','C','C','G','G','G','G','C','C','F','F','F','F','F','F','C','C','G','G','C','C'];
function musMenu(){if(MUS.on&&MUS.o&&MUS.o.menu)return;musStart({menu:1,bpm:84,bar:24,kit:'none',padVol:.02,chord:i=>MENUCH[i%24],beat(i,w){const m=MENU[i%24];if(m)boxNote(midi(m+12),w,.09,1.8);if(i%24%6===0)boxNote(midi(48+(i%48<24?0:7)),w,.05,2)}})}
// приглушаем музыку, пока звучит голос; без звука — тишина
function musDuck(){if(!MUS.bus||!AC)return;const want=G.mute?0:(talk&&!G.fast?.38:.8);if(Math.abs(want-MUS.duck)>.01){MUS.duck=want;MUS.bus.gain.setTargetAtTime(want,AC.currentTime,.15)}}
