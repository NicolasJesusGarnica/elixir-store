import json
import urllib.request
import concurrent.futures
from PIL import Image
import io

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

print(f"Total perfumes in catalog: {len(perfumes)}")

def check_corners(p):
    img = p.get('imagenes', [None])[0]
    if not img:
        return p, False, 'NO_IMAGE', [(0,0,0)]*4
    try:
        req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            w, h = im.size
            
            # Sample 4 corners with 5px padding from the absolute edge
            px = max(2, int(w * 0.02))
            py = max(2, int(h * 0.02))
            corners = [
                im.getpixel((px, py)),
                im.getpixel((w - 1 - px, py)),
                im.getpixel((px, h - 1 - py)),
                im.getpixel((w - 1 - px, h - 1 - py))
            ]
            
            white_corners = 0
            for r, g, b in corners:
                # White studio: bright and near zero color tint
                if r >= 235 and g >= 235 and b >= 235 and max(r, g, b) - min(r, g, b) <= 15:
                    white_corners += 1
            
            # If all 4 corners (or at least 3/4) are white, background is white studio
            is_white = (white_corners >= 3)
            return p, is_white, f"white_corners={white_corners}/4", corners
    except Exception as e:
        return p, False, f"ERROR: {e}", [(0,0,0)]*4

print("Auditing 4 corners of all 454 perfumes on R2...")
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
    results = list(ex.map(check_corners, perfumes))

non_white = [r for r in results if not r[1]]
print(f"\nAudit complete!")
print(f"Total perfumes: {len(results)}")
print(f"White background (>=3/4 corners pure white): {len(results) - len(non_white)}")
print(f"Non-white background found: {len(non_white)}")

print("\nList of perfumes with non-white background:")
for p, _, reason, corners in sorted(non_white, key=lambda x: x[0]['id']):
    print(f"  {p['id']} ({p['nombre']}): {reason} | corners={corners}")

with open('scripts/true_non_white.json', 'w', encoding='utf-8') as f:
    json.dump([
        {
            'id': r[0]['id'],
            'nombre': r[0]['nombre'],
            'marca': r[0]['marca'],
            'img': r[0]['imagenes'][0],
            'reason': r[2],
            'corners': r[3]
        }
        for r in non_white
    ], f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(non_white)} non-white perfumes to scripts/true_non_white.json")
