# Секреты: в каждом уровне поймать комету тапом; после 5 — кнопка бонуса на карте
import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':844,'height':390},has_touch=True,is_mobile=True)
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('http://127.0.0.1:18768/index.html');await pg.evaluate('localStorage.clear()');await pg.reload();await pg.wait_for_function('G.scene==="title"',timeout=30000)
    await pg.evaluate('G.mute=true;G.fast=true;G.secTest=true;SV.open=6;SV.sec=[0,0,0,0,0];save()')
    for n in range(1,6):
      await pg.evaluate(f'G.go("l{n}")')
      for _ in range(200):
        s=await pg.evaluate('G.secret()')
        if s:break
        await pg.wait_for_timeout(100)
      if not s:print('l',n,'no comet');continue
      q=await pg.evaluate(f'G.pg({s["x"]},{s["y"]})');await pg.touchscreen.tap(q['x'],q['y']);await pg.wait_for_timeout(500)
      print('l',n,'sec',await pg.evaluate('SV.sec'))
    await pg.evaluate('G.go("map")');await pg.wait_for_timeout(1500);await pg.screenshot(path='shots/sec_map.png')
    print('bonus btn',await pg.evaluate('UI.some(b=>b.id==="bonus")'),'errs',errs)
    await b.close()
asyncio.run(main())
