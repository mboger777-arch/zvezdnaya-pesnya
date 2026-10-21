# Быстрый снимок состояния: VP=844x390 python tools/peek.py name 'js-перед' [ждать_мс]
import asyncio,os,sys
from playwright.async_api import async_playwright
async def main():
  W,H=map(int,os.environ.get('VP','844x390').split('x'));name,js=sys.argv[1],sys.argv[2];wt=int(sys.argv[3]) if len(sys.argv)>3 else 1500
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    ctx=await b.new_context(viewport={'width':W,'height':H},has_touch=True,is_mobile=True,device_scale_factor=1)
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    await pg.goto('http://127.0.0.1:18768/index.html');await pg.wait_for_function('G.scene==="title"',timeout=30000);await pg.evaluate('SV.open=6;SV.stars=[1,1,1,1,1];G.mute=true;G.fast=true')
    for part in js.split(';;'):
      await pg.evaluate(part);await pg.wait_for_timeout(wt)
    os.makedirs('shots/peek',exist_ok=True);await pg.screenshot(path=f'shots/peek/{name}_{W}x{H}.png');print('errors',errs[:5])
    await b.close()
asyncio.run(main())
