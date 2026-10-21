# контактный лист вырезок на шахматке и тёмном фоне: python3 tools/contact.py out.png dir
import sys,glob,os
from PIL import Image,ImageDraw
out=sys.argv[1];fs=sorted(sum([glob.glob(d+'/*.png') for d in sys.argv[2:]],[]))
C=6;cw=260;ch=300;rows=(len(fs)+C-1)//C;S=Image.new('RGB',(C*cw,rows*ch),(40,30,70));d=ImageDraw.Draw(S)
for i,f in enumerate(fs):
    x=(i%C)*cw;y=(i//C)*ch
    for yy in range(y,y+ch-30,20):
        for xx in range(x,x+cw,20):
            if ((xx-x)//20+(yy-y)//20)%2: d.rectangle([xx,yy,xx+19,yy+19],fill=(235,235,235) if (i%2) else (60,50,90))
    im=Image.open(f).convert('RGBA');im.thumbnail((cw-10,ch-40));S.paste(im,(x+5+(cw-10-im.width)//2,y+5+(ch-40-im.height)//2),im)
    d.text((x+6,y+ch-24),os.path.basename(f),fill=(255,255,200))
S.save(out)
