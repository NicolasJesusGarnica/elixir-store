import os
from PIL import Image

dir_path = 'temp_review_12'
files = [
    'ajmal_vi.webp',
    'carolina_herrera_ch.webp',
    'burberry_goddess.webp',
    'carolina_herrera_bad_boy_le.webp',
    'nene_beauty_bruma_body_splash.webp',
    'pepe_jeans_london_calling_for_her.webp',
    'shrek_for_boys.webp'
]

for f in files:
    path = os.path.join(dir_path, f)
    if os.path.exists(path):
        im = Image.open(path)
        print(f"File {f}: format={im.format}, size={im.size}, mode={im.mode}")
