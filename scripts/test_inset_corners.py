import urllib.request
from PIL import Image
import io

for name in ['prada_paradoxe_intense.webp', 'afnan_9pm_negro_100.webp', 'ariana_grande_mod_vanilla.webp', 'arabiyat_prestige_marwa.webp']:
    url = f'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/{name}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        im = Image.open(io.BytesIO(resp.read())).convert('RGB')
        c100 = [im.getpixel((100, 100)), im.getpixel((700, 100)), im.getpixel((100, 700)), im.getpixel((700, 700))]
        white_100 = sum(1 for r,g,b in c100 if r >= 238 and g >= 238 and b >= 238 and max(r,g,b)-min(r,g,b) <= 15)
        print(f'{name}: white_at_100px = {white_100}/4 | pixels={c100}')
