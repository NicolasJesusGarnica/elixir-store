import os
import sys
import time
import urllib.request
import io
from PIL import Image
from ddgs import DDGS
sys.path.append('.')
sys.path.append('scripts')
from luxury_image_processor import process_to_luxury_white_webp

secondary_targets = [
    {
        "id": "afnan_supremacy_not_only_intense_set",
        "queries": [
            "Afnan Supremacy Not Only Intense coffret set white",
            "Supremacy Not Only Intense gift set 3 pcs white",
            "Afnan Supremacy Not Only Intense set packshot",
            "Afnan Supremacy Not Only Intense estuche"
        ]
    },
    {
        "id": "lattafa_asad_set",
        "queries": [
            "Lattafa Asad gift set 2 pcs white background",
            "Lattafa Asad coffret edp deo spray white",
            "Lattafa Asad set 2 pcs packshot",
            "Lattafa Asad set perfume desodorante"
        ]
    },
    {
        "id": "lattafa_the_kingdom_set",
        "queries": [
            "Lattafa The Kingdom gift set edp hair mist white",
            "The Kingdom Lattafa 3 pcs set white background",
            "Lattafa The Kingdom coffret 100ml 12ml",
            "The Kingdom Lattafa set packshot"
        ]
    },
    {
        "id": "lattafa_yara_set_25ml",
        "queries": [
            "Lattafa Yara collection 4 in 1 set 25ml white background",
            "Lattafa Yara 4 pcs set 25ml packshot",
            "Yara Tous Moi Candy 25ml set Lattafa",
            "Lattafa Yara set 4 x 25ml"
        ]
    },
    {
        "id": "lattafa_pride_nebras_set",
        "queries": [
            "Lattafa Pride Nebras set 3 pcs white background",
            "Lattafa Nebras gift set edp spray packshot",
            "Nebras Lattafa Pride coffret set white",
            "Lattafa Pride Nebras set perfume travel deo"
        ]
    },
    {
        "id": "airval_eau_my_unicorn_spray_set",
        "queries": [
            "Air-Val Eau My Unicorn set body spray gel shampoo white",
            "Eau My Unicorn set 2 pcs Air Val packshot",
            "Eau My Unicorn body spray gel shampoo 200ml",
            "Eau My Unicorn Air Val set infantil"
        ]
    },
    {
        "id": "paco_rabanne_invictus_set_10ml",
        "queries": [
            "Paco Rabanne Invictus gift set 100ml 10ml white background",
            "Invictus set 100ml 10ml travel spray packshot white",
            "Paco Rabanne Invictus coffret edt 100ml 10ml",
            "Invictus set 2 pcs Paco Rabanne"
        ]
    }
]

def verify_packshot(img_bytes):
    try:
        im = Image.open(io.BytesIO(img_bytes))
        if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
            alpha = im.convert('RGBA')
            bg = Image.new('RGB', alpha.size, (255, 255, 255))
            bg.paste(alpha, mask=alpha.split()[3])
            im_rgb = bg
        else:
            im_rgb = im.convert('RGB')
            
        w, h = im_rgb.size
        if w < 160 or h < 160:
            return False, 0.0, None
            
        c_pts = [
            (int(w * 0.03), int(h * 0.03)),
            (int(w * 0.97), int(h * 0.03)),
            (int(w * 0.03), int(h * 0.97)),
            (int(w * 0.97), int(h * 0.97)),
        ]
        corners_white = 0
        for pt in c_pts:
            r, g, b = im_rgb.getpixel(pt)
            if r >= 230 and g >= 230 and b >= 230 and max(r, g, b) - min(r, g, b) <= 20:
                corners_white += 1
                
        if corners_white < 2:
            # Let's see if top corners are white
            top_white = (im_rgb.getpixel(c_pts[0])[0] >= 230 and im_rgb.getpixel(c_pts[1])[0] >= 230)
            if not top_white:
                return False, 0.0, None
            
        tot = 0
        white = 0
        for y in range(0, h, 10):
            for x in range(0, w, 10):
                tot += 1
                r, g, b = im_rgb.getpixel((x, y))
                if r >= 230 and g >= 230 and b >= 230 and max(r, g, b) - min(r, g, b) <= 20:
                    white += 1
        ratio = white / tot
        return (ratio >= 0.25), ratio, im_rgb
    except Exception:
        return False, 0.0, None

for item in secondary_targets:
    pid = item['id']
    out_file = os.path.join('temp_sets_packshots', f"{pid}.webp")
    found = False
    print(f"Targeting: {pid} ...")
    
    for q in item['queries']:
        try:
            with DDGS() as ddgs:
                results = list(ddgs.images(q, max_results=8))
        except Exception:
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
                    ok, ratio, im_rgb = verify_packshot(data)
                    if ok and im_rgb:
                        temp_png = f"temp_sets_packshots/{pid}_raw.png"
                        im_rgb.save(temp_png)
                        process_to_luxury_white_webp(temp_png, out_file)
                        if os.path.exists(temp_png):
                            os.remove(temp_png)
                        print(f"  -> SUCCESS: {pid} (ratio={ratio*100:.1f}%) from {url[:50]}...")
                        found = True
                        break
            except Exception:
                continue
        if found:
            break
            
    if not found:
        print(f"  -> STILL NOT FOUND: {pid}")
