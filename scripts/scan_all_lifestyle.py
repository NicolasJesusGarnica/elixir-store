import json
import urllib.request
import concurrent.futures
from PIL import Image
import io

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

print(f"Total perfumes in catalog: {len(perfumes)}")

def test_corner_purity(p):
    img = p.get('imagenes', [None])[0]
    if not img:
        return p, False, 0.0, 'NO_IMAGE'
    try:
        req = urllib.request.Request(img, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            w, h = im.size
            
            # Check 4 corner 160x160 boxes
            box_size = int(min(w, h) * 0.22)
            corner_boxes = [
                (0, 0, box_size, box_size),                      # Top-Left
                (w - box_size, 0, w, box_size),                  # Top-Right
                (0, h - box_size, box_size, h),                  # Bottom-Left
                (w - box_size, h - box_size, w, h),              # Bottom-Right
            ]
            
            non_white_total = 0
            pixels_total = 0
            box_ratios = []
            
            for (bx1, by1, bx2, by2) in corner_boxes:
                nw = 0
                tot = 0
                for y in range(by1, by2, 4):
                    for x in range(bx1, bx2, 4):
                        tot += 1
                        r, g, b = im.getpixel((x, y))
                        # Non-white if brightness < 238 or colored (sat > 15)
                        if r < 238 or g < 238 or b < 238 or (max(r, g, b) - min(r, g, b) > 15):
                            nw += 1
                box_ratios.append(nw / tot)
                non_white_total += nw
                pixels_total += tot
                
            # Max non-white in any corner, and overall corner non-white ratio
            max_corner_dirty = max(box_ratios)
            overall_dirty = non_white_total / pixels_total
            
            # In clean studio photography, corner squares should have < 3% non-white pixels
            is_clean = (max_corner_dirty < 0.06) and (overall_dirty < 0.04)
            return p, is_clean, max_corner_dirty, overall_dirty, img
    except Exception as e:
        return p, False, 1.0, 1.0, str(e)

print("Scanning 454 perfumes for corner purity (detecting lifestyle/framed photos)...")
with concurrent.futures.ThreadPoolExecutor(max_workers=25) as ex:
    results = list(ex.map(test_corner_purity, perfumes))

dirty = [r for r in results if not r[1]]
print(f"\nScan complete!")
print(f"Total checked: {len(results)}")
print(f"Clean white: {len(results) - len(dirty)}")
print(f"Dirty / Lifestyle / Framed photos found: {len(dirty)}")

print("\nList of dirty/lifestyle perfumes found:")
for r in sorted(dirty, key=lambda x: x[2], reverse=True):
    p = r[0]
    max_c = r[2]
    tot_c = r[3]
    print(f"  {p['id']} ({p['nombre']}): max_corner_dirty={max_c*100:.1f}%, overall={tot_c*100:.1f}%")

with open('scripts/all_lifestyle_dirty.json', 'w', encoding='utf-8') as f:
    json.dump([
        {
            'id': r[0]['id'],
            'nombre': r[0]['nombre'],
            'marca': r[0]['marca'],
            'img': r[4],
            'max_corner_dirty': r[2],
            'overall_dirty': r[3]
        }
        for r in dirty
    ], f, indent=2, ensure_ascii=False)

print(f"\nSaved {len(dirty)} dirty items to scripts/all_lifestyle_dirty.json")
