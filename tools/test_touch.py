# Настоящие тапы (hasTouch, мобильная эмуляция) на 3 размерах: каждая зона от начала до конца;
# на каждом шаге — нарочная ошибка, проверка что ввод не заблокирован (<600 мс), затем исправление; хит-зоны >= 56 css px.
import asyncio,os,time,json,sys
def scn(n):return 'fin' if n==6 else 'bonus' if n==7 else f'l{n}'
from playwright.async_api import async_playwright
URL=os.environ.get('URL','http://127.0.0.1:18768/index.html')
VPS=[(844,390),(667,375),(932,430)]
if os.environ.get('VPS'):VPS=[tuple(map(int,v.split('x'))) for v in os.environ['VPS'].split(',')]
ZL=[int(x) for x in os.environ.get('ZS','1,2,3,4,5,6').split(',')]
async def run(b,W,H,F,R):
  tag=f'{W}x{H}';out=f'shots/touch/{tag}';os.makedirs(out,exist_ok=True)
  ctx=await b.new_context(viewport={'width':W,'height':H},has_touch=True,is_mobile=True,device_scale_factor=2)
  pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append('console: '+m.text))
  await pg.goto(URL);await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_function('G.scene==="title"',timeout=40000)
  await pg.evaluate('G.fast=true;G.mute=true;SV.open=6;SV.stars=[1,1,1,1,1];SV.sec=[1,1,1,1,1];save()')
  if os.environ.get('SAYLOG'):await pg.evaluate("window.SAYLOG=[];for(const f of ['say','sayNow']){const o=window[f];window[f]=function(k){SAYLOG.push([f,k,G.scene,GOAL,ZS?ZS.mist:0]);return o.apply(this,arguments)}}")
  async def tap(x,y):
    q=await pg.evaluate(f'G.pg({x},{y})');await pg.touchscreen.tap(q['x'],q['y']);await pg.wait_for_timeout(240)
  async def taps(ok):
    t0=time.time();L=await pg.evaluate(f'G.taps({str(ok).lower()})')
    while L==['wait'] and time.time()-t0<12:
      await pg.wait_for_timeout(150)
      if await zdone(ZN):return -1
      L=await pg.evaluate(f'G.taps({str(ok).lower()})')
    if L==['wait']:F.append(f'{tag} {sc} stuck waiting');return -1
    for t in L:
      if t=='wait':await pg.wait_for_timeout(400);continue
      if t is None:F.append(f'{tag} {sc} taps: missing button');continue
      await tap(*t)
    return len(L)
  async def hitcheck(where):
    small=await pg.evaluate("UI.filter(b=>!b.dis).map(b=>({id:b.id,w:Math.max(b.w+12,56/S)*S,h:Math.max(b.h+12,56/S)*S})).filter(b=>b.w<55.9||b.h<55.9)")
    for s in small:F.append(f'{tag} {where}: button {s["id"]} hit {s["w"]:.0f}x{s["h"]:.0f}css <56')
  async def unlock_ms():
    t=time.time()
    while await pg.evaluate('G.locked()'):
      await pg.wait_for_timeout(20)
      if time.time()-t>8:break
    return (time.time()-t)*1000
  async def zdone(n):return await pg.evaluate(f'G.scene!=="{scn(n)}"||!!(ZS&&ZS.done)')
  for n in ZL:
    global sc,ZN;sc=scn(n);ZN=n
    await pg.evaluate(f'G.go("{scn(n)}")');await pg.wait_for_timeout(700)
    await hitcheck(sc)
    if await pg.evaluate('G.locked()'):F.append(f'{tag} {sc} locked during intro voice')
    steps=0;shot=0;t0=time.time()
    while not await zdone(n) and time.time()-t0<240:
      p0=await pg.evaluate('G.prog()');m0=await pg.evaluate('ZS?ZS.mist:0')
      await unlock_ms()
      nw=await taps(False)
      if nw<0:continue
      tm=time.time()
      if nw==0:R.append(f'{tag} {sc} step {p0}: no wrong choice possible');tm=-1e9
      while await pg.evaluate('ZS?ZS.mist:0')<=m0 and time.time()-tm<3:await pg.wait_for_timeout(30)
      if nw==0:pass
      elif await pg.evaluate('ZS?ZS.mist:0')<=m0:F.append(f'{tag} {sc} step {p0}: mistake not registered')
      else:
        ms=await unlock_ms();R.append(f'{tag} {sc} unlock after mistake {ms:.0f}ms')
        if ms>600:F.append(f'{tag} {sc} input locked {ms:.0f}ms after mistake')
      if W==844 and not shot:await pg.wait_for_timeout(200);await pg.screenshot(path=f'{out}/{sc}_mistake.png')
      ok=False
      for k in range(5):
        await taps(True);tw=time.time()
        while time.time()-tw<4:
          if await zdone(n) or await pg.evaluate('G.prog()')!=p0:ok=True;break
          await pg.wait_for_timeout(50)
        if ok:break
      if W==844 and not shot:shot=1;await pg.wait_for_timeout(150);await pg.screenshot(path=f'{out}/{sc}_fixed.png')
      if not ok:F.append(f'{tag} {sc} step {p0}: correct answer not accepted');break
      steps+=1
    if not await zdone(n):F.append(f'{tag} {sc} not finished')
    st=await pg.evaluate('SV.stars')
    if n<6 and not st[n-1]:F.append(f'{tag} {sc} star not awarded')
    if n==6 and not await pg.evaluate('SV.fin'):F.append(f'{tag} fin not saved')
    await pg.screenshot(path=f'{out}/{sc}_end.png')
    R.append(f'{tag} {sc} steps {steps} -> {await pg.evaluate("G.scene")}')
  if errs:F.append(f'{tag} page errors: {errs[:3]}')
  if os.environ.get('SAYLOG'):json.dump(await pg.evaluate('SAYLOG'),open(f'shots/saylog_{tag}.json','w'),ensure_ascii=False,indent=0)
  await ctx.close()
async def main():
  F=[];R=[]
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    for W,H in VPS:await run(b,W,H,F,R)
    await b.close()
  print('\n'.join(R));print('FAILS:',len(F));print('\n'.join(F))
asyncio.run(main())
