import json
import os
import time
import urllib.request
import io
from PIL import Image
from ddgs import DDGS
import subprocess

with open('scripts/true_non_white.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Total perfumes to fix: {len(items)}")

def is_candidate_white(img_bytes):
    try:
        im = Image.open(io.BytesIO(img_bytes))
        # Composite on white if transparent
        if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
            alpha = im.convert('RGBA')
            bg = Image.new('RGB', alpha.size, (255, 255, 255))
            bg.paste(alpha, mask=alpha.split()[3])
            im_rgb = bg
        else:
            im_rgb = im.convert('RGB')
            
        w, h = im_rgb.size
        if w < 250 or h < 250:
            return False, 0, None
            
        pts = [
            (int(w * 0.03), int(h * 0.03)),
            (int(w * 0.97), int(h * 0.03)),
            (int(w * 0.03), int(h * 0.97)),
            (int(w * 0.97), int(h * 0.97)),
        ]
        white_count = 0
        for pt in pts:
            r, g, b = im_rgb.getpixel(pt)
            if r >= 238 and g >= 238 and b >= 238 and max(r, g, b) - min(r, g, b) <= 15:
                white_count += 1
                
        # Also ensure content isn't totally blank (needs some non-white pixels in center)
        center_pixel = im_rgb.getpixel((w // 2, h // 2))
        return (white_count >= 3), white_count, im_rgb
    except Exception as e:
        return False, 0, None

def process_luxury(im_rgb, out_path):
    w, h = im_rgb.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    step = 2
    found = False
    for y in range(0, h, step):
        for x in range(0, w, step):
            r, g, b = im_rgb.getpixel((x, y))
            if r < 240 or g < 240 or b < 240:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                found = True
    if not found:
        min_x, min_y, max_x, max_y = 0, 0, w, h
    else:
        pad = 12
        min_x = max(0, min_x - pad)
        min_y = max(0, min_y - pad)
        max_x = min(w, max_x + pad)
        max_y = min(h, max_y + pad)
        
    cropped = im_rgb.crop((min_x, min_y, max_x, max_y))
    cw, ch = cropped.size
    scale = min(720 / cw, 720 / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new('RGB', (800, 800), (255, 255, 255))
    canvas.paste(resized, ((800 - new_w) // 2, (800 - new_h) // 2))
    canvas.save(out_path, 'WEBP', quality=88, method=6)
    return out_path

os.makedirs('temp_fixed_white', exist_ok=True)
fixed_files = []

for idx, item in enumerate(items):
    pid = item['id']
    marca = item['marca']
    nombre = item['nombre']
    
    clean_nombre = nombre.replace(marca.upper(), '').strip()
    queries = [
        f"{marca} {clean_nombre} perfume bottle white background",
        f"{marca} {clean_nombre} bottle white background",
        f"{marca} {clean_nombre} box bottle white background",
        f"{marca} {nombre} white background",
    ]
    
    found_image = False
    print(f"\n[{idx+1}/{len(items)}] Searching for: {marca} - {nombre} ({pid})")
    
    for q in queries:
        try:
            with DDGS() as ddgs:
                results = list(ddgs.images(q, max_results=8))
        except Exception as e:
            time.sleep(1.0)
            continue
            
        for r in results:
            url = r.get('image')
            if not url:
                continue
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=6) as resp:
                    data = resp.read()
                    is_white, wc, im_rgb = is_candidate_white(data)
                    if is_white and im_rgb:
                        out_path = os.path.join('temp_fixed_white', f"{pid}.webp")
                        process_luxury(im_rgb, out_path)
                        print(f"  -> SUCCESS: Found white background image ({wc}/4 corners) from {url[:60]}...")
                        fixed_files.append((pid, out_path))
                        found_image = True
                        break
            except Exception:
                continue
                
        if found_image:
            break
            
    if not found_image:
        print(f"  -> WARNING: No clean white image found for {pid}")

print(f"\nDone! Fixed {len(fixed_files)} / {len(items)} images.")
