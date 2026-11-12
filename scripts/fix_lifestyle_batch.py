import json
import os
import sys
import time
import urllib.request
import io
from PIL import Image
from ddgs import DDGS
import sys
sys.path.append('.')
sys.path.append('scripts')
from luxury_image_processor import process_to_luxury_white_webp

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

with open('scripts/lifestyle_candidates.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Sort by lowest white ratio first (the most dirty ones)
items.sort(key=lambda x: x['white_ratio'])

print(f"Total candidates to fix: {len(items)}")

os.makedirs('temp_fixed_packshots', exist_ok=True)

def verify_packshot(img_bytes):
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
        if w < 200 or h < 200:
            return False, 0.0, None
            
        # 1. Check 4 corners must be pure white
        c_pts = [
            (int(w * 0.03), int(h * 0.03)),
            (int(w * 0.97), int(h * 0.03)),
            (int(w * 0.03), int(h * 0.97)),
            (int(w * 0.97), int(h * 0.97)),
        ]
        corners_white = 0
        for pt in c_pts:
            r, g, b = im_rgb.getpixel(pt)
            if r >= 238 and g >= 238 and b >= 238 and max(r, g, b) - min(r, g, b) <= 15:
                corners_white += 1
                
        if corners_white < 3:
            return False, 0.0, None
            
        # 2. Check total white ratio across the image (must be at least 40% white for a packshot)
        tot = 0
        white = 0
        for y in range(0, h, 8):
            for x in range(0, w, 8):
                tot += 1
                r, g, b = im_rgb.getpixel((x, y))
                if r >= 238 and g >= 238 and b >= 238 and max(r, g, b) - min(r, g, b) <= 15:
                    white += 1
        ratio = white / tot
        
        # A true white studio packshot will have > 45% white background
        return (ratio >= 0.45), ratio, im_rgb
    except Exception as e:
        return False, 0.0, None

successful = []

for idx, it in enumerate(items):
    pid = it['id']
    marca = it['marca']
    nombre = it['nombre']
    
    out_file = os.path.join('temp_fixed_packshots', f"{pid}.webp")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 5000:
        print(f"[{idx+1}/{len(items)}] [ALREADY FIXED] {pid}")
        successful.append((pid, out_file))
        continue
        
    clean_name = nombre.replace(marca.upper(), '').strip()
    # Strip unnecessary keywords like (NUEVO), TESTER, etc.
    clean_name = clean_name.replace('(NUEVO)', '').replace('TESTER', '').replace('COLONIA', '').strip()
    
    queries = [
        f"{marca} {clean_name} perfume bottle white background",
        f"{marca} {clean_name} packshot white background",
        f"{marca} {clean_name} isolated on white",
        f"{marca} {clean_name} bottle box white background",
    ]
    
    found = False
    print(f"[{idx+1}/{len(items)}] Searching for: {marca} {clean_name} ({pid}) ...")
    
    for q in queries:
        try:
            with DDGS() as ddgs:
                results = list(ddgs.images(q, max_results=6))
        except Exception:
            time.sleep(1.0)
            continue
            
        for r in results:
            url = r.get('image')
            if not url:
                continue
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as resp:
                    data = resp.read()
                    ok, ratio, im_rgb = verify_packshot(data)
                    if ok and im_rgb:
                        # Save temp png
                        temp_png = f"temp_fixed_packshots/{pid}_raw.png"
                        im_rgb.save(temp_png)
                        process_to_luxury_white_webp(temp_png, out_file)
                        if os.path.exists(temp_png):
                            os.remove(temp_png)
                        print(f"  -> OK! White ratio={ratio*100:.1f}% from {url[:55]}...")
                        successful.append((pid, out_file))
                        found = True
                        break
            except Exception:
                continue
                
        if found:
            break
            
    if not found:
        print(f"  -> WARNING: No clean packshot found for {pid}")

print(f"\nCompleted! Fixed {len(successful)} / {len(items)} packshots.")
