import os
from PIL import Image

dir_path = 'temp_review_12'
files = os.listdir(dir_path)

for f in sorted(files):
    if not f.endswith('.webp'): continue
    im = Image.open(os.path.join(dir_path, f)).convert('RGBA')
    w, h = im.size
    
    # corners
    tl = im.getpixel((5, 5))
    tr = im.getpixel((w - 5, 5))
    bl = im.getpixel((5, h - 5))
    br = im.getpixel((w - 5, h - 5))
    
    print(f"File: {f} ({w}x{h})")
    print(f"   Corners: TL={tl}, TR={tr}, BL={bl}, BR={br}")
