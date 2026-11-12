import json
import urllib.request
from PIL import Image
import io
import concurrent.futures

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

def test_perfume(p):
    img = p.get('imagenes', [None])[0]
    if not img:
        return p, False, 'no_img'
    try:
        req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = resp.read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            w, h = im.size
            # Test 8 outer margin points (at 3% inset)
            pts = [
                (int(w*0.03), int(h*0.03)),
                (int(w*0.97), int(h*0.03)),
                (int(w*0.03), int(h*0.97)),
                (int(w*0.97), int(h*0.97)),
                (int(w*0.50), int(h*0.02)),
                (int(w*0.50), int(h*0.98)),
                (int(w*0.02), int(h*0.50)),
                (int(w*0.98), int(h*0.50)),
            ]
            white_pts = 0
            for pt in pts:
                r, g, b = im.getpixel(pt)
                if r >= 238 and g >= 238 and b >= 238 and max(r, g, b) - min(r, g, b) <= 12:
                    white_pts += 1
            
            # Also check if it's a letterboxed photo inside white canvas!
            # If the corners are white, but inner content (e.g. at (w*0.5, h*0.05) or (w*0.05, h*0.5)) is colored/dark:
            inner_pts = [
                (int(w*0.50), int(h*0.06)),
                (int(w*0.50), int(h*0.94)),
                (int(w*0.06), int(h*0.50)),
                (int(w*0.94), int(h*0.50)),
            ]
            letterboxed_colored = False
            for ipt in inner_pts:
                r, g, b = im.getpixel(ipt)
                # If dark or colored table/wall
                if (r < 210 or g < 210 or b < 210) and max(r, g, b) - min(r, g, b) > 15:
                    letterboxed_colored = True
                    break

            is_clean_white = (white_pts >= 7) and not letterboxed_colored
            return p, is_clean_white, f"white_pts={white_pts}/8, letterboxed={letterboxed_colored}"
    except Exception as e:
        return p, False, str(e)

print("Scanning all perfumes for non-white / letterboxed photos...")
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
    results = list(ex.map(test_perfume, perfumes))

dirty = [r for r in results if not r[1]]
print(f"Total perfumes: {len(perfumes)}")
print(f"Clean white: {len(results) - len(dirty)}")
print(f"Needs white background fix: {len(dirty)}")

with open('scripts/dirty_perfumes.json', 'w', encoding='utf-8') as f:
    json.dump([{'id': r[0]['id'], 'nombre': r[0]['nombre'], 'marca': r[0]['marca'], 'img': r[0]['imagenes'][0], 'reason': r[2]} for r in dirty], f, indent=2, ensure_ascii=False)

print("Saved to scripts/dirty_perfumes.json")
