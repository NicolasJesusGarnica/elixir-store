import urllib.request
from PIL import Image
import io

keys = [
    'prada_paradoxe_intense.webp',
    'afnan_9pm_negro_100.webp',
    'sabrina_carpenter_sweet_tooth.webp',
    'ariana_grande_mod_blush.webp',
    'paco_rabanne_lady_million.webp',
    'jean_paul_gaultier_le_beau_paradise_garden.webp',
    'shakira_rojo.webp',
    'burberry_goddess.webp',
]

for k in keys:
    url = f'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/{k}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = resp.read()
        im = Image.open(io.BytesIO(data))
        # Check corners
        corners = [
            im.getpixel((5, 5)),
            im.getpixel((795, 5)),
            im.getpixel((5, 795)),
            im.getpixel((795, 795)),
        ]
        print(f"{k}: size={im.size}, corners={corners}")
