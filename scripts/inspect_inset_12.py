import os
from PIL import Image

dir_path = 'temp_review_12'
files = os.listdir(dir_path)

for f in sorted(files):
    if not f.endswith('.webp'): continue
    im = Image.open(os.path.join(dir_path, f)).convert('RGB')
    w, h = im.size
    
    # Check pixels at 10%, 15%, 20% inset from top and sides
    samples = [
        im.getpixel((int(w * 0.15), int(h * 0.15))),
        im.getpixel((int(w * 0.85), int(h * 0.15))),
        im.getpixel((int(w * 0.15), int(h * 0.85))),
        im.getpixel((int(w * 0.85), int(h * 0.85))),
        im.getpixel((int(w * 0.10), int(h * 0.50))),
        im.getpixel((int(w * 0.90), int(h * 0.50))),
        im.getpixel((int(w * 0.50), int(h * 0.10))),
        im.getpixel((int(w * 0.50), int(h * 0.90))),
    ]
    non_pure_white = [s for s in samples if s != (255, 255, 255)]
    print(f"File: {f}")
    if non_pure_white:
        print(f"   Non-white background samples detected: {non_pure_white[:4]}")
    else:
        print(f"   Border sample points are 255,255,255")
