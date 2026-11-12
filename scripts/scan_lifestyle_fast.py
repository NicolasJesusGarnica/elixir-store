import json
import urllib.request
import concurrent.futures
from PIL import Image
import io
import sys

# Flush output
sys.stdout.reconfigure(line_buffering=True)

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

print(f"Total perfumes in catalog: {len(perfumes)}")

def test_perfume_corners(p):
    img = p.get('imagenes', [None])[0]
    if not img:
        return p, False, 'NO_IMAGE'
    try:
        req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = resp.read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            w, h = im.size
            
            # Corner size: 100px square in each corner
            cs = int(min(w, h) * 0.16) # ~128px
            corners = [
                im.crop((0, 0, cs, cs)),
                im.crop((w - cs, 0, w, cs)),
                im.crop((0, h - cs, cs, h)),
                im.crop((w - cs, h - cs, w, h)),
            ]
            
            # Check if any corner is significantly non-white
            dirty_corners = 0
            details = []
            for idx, c in enumerate(corners):
                # Sample 9 points in each corner
                cw, ch = c.size
                pts = [
                    (cw//4, ch//4), (cw//2, ch//4), (3*cw//4, ch//4),
                    (cw//4, ch//2), (cw//2, ch//2), (3*cw//4, ch//2),
                    (cw//4, 3*ch//4), (cw//2, 3*ch//4), (3*cw//4, 3*ch//4),
                ]
                non_white_pts = 0
                for pt in pts:
                    r, g, b = c.getpixel(pt)
                    if r < 236 or g < 236 or b < 236 or max(r, g, b) - min(r, g, b) > 15:
                        non_white_pts += 1
                        
                if non_white_pts >= 4: # at least half of the corner is colored/dark
                    dirty_corners += 1
                    details.append((idx, non_white_pts))
                    
            is_clean = (dirty_corners == 0)
            return p, is_clean, dirty_corners, details, img
    except Exception as e:
        return p, False, 4, str(e), img

print("Scanning all 454 perfumes with fast corner sampler...")
with concurrent.futures.ThreadPoolExecutor(max_workers=30) as ex:
    results = list(ex.map(test_perfume_corners, perfumes))

dirty = [r for r in results if not r[1]]
print(f"\nScan complete!")
print(f"Total checked: {len(results)}")
print(f"Clean white: {len(results) - len(dirty)}")
print(f"Perfumes with non-white lifestyle/framed corners: {len(dirty)}")

for r in dirty:
    p = r[0]
    dc = r[2]
    det = r[3]
    print(f"  {p['id']} ({p['nombre']}): dirty_corners={dc}/4, details={det}")

with open('scripts/all_lifestyle_dirty.json', 'w', encoding='utf-8') as f:
    json.dump([
        {
            'id': r[0]['id'],
            'nombre': r[0]['nombre'],
            'marca': r[0]['marca'],
            'img': r[4],
            'dirty_corners': r[2]
        }
        for r in dirty
    ], f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(dirty)} dirty items to scripts/all_lifestyle_dirty.json")
