import json
import glob
import os
from PIL import Image

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

# Map id to raw file
raw_map = {}
for f in glob.glob('temp_raw_catalog/*'):
    base = os.path.splitext(os.path.basename(f))[0]
    raw_map[base] = f

print(f"Total perfumes: {len(perfumes)}, raw files in temp_raw_catalog: {len(raw_map)}")

lifestyle_dirty = []

for p in perfumes:
    pid = p['id']
    f = raw_map.get(pid)
    if not f:
        # Search by substring
        for k, v in raw_map.items():
            if k in pid or pid in k:
                f = v
                break
                
    if f:
        try:
            im = Image.open(f).convert('RGB')
            w, h = im.size
            # Sample every 6th pixel
            tot = 0
            white = 0
            for y in range(0, h, 6):
                for x in range(0, w, 6):
                    tot += 1
                    r, g, b = im.getpixel((x, y))
                    if r >= 238 and g >= 238 and b >= 238 and max(r, g, b) - min(r, g, b) <= 15:
                        white += 1
            ratio = white / tot
            # In a clean white studio photo of a perfume, white is AT LEAST 40% (usually 55% - 85%)
            if ratio < 0.35:
                lifestyle_dirty.append((p, f, ratio))
        except Exception as e:
            pass

print(f"\nPerfumes with < 35% white background in raw image: {len(lifestyle_dirty)}")
for p, f, r in sorted(lifestyle_dirty, key=lambda x: x[2]):
    print(f"  {r*100:5.1f}% white | {p['id']} ({p['nombre']}) -> {os.path.basename(f)}")

with open('scripts/lifestyle_candidates.json', 'w', encoding='utf-8') as f:
    json.dump([
        {
            'id': p[0]['id'],
            'nombre': p[0]['nombre'],
            'marca': p[0]['marca'],
            'raw_file': p[1],
            'white_ratio': p[2]
        }
        for p in lifestyle_dirty
    ], f, indent=2, ensure_ascii=False)

print(f"\nSaved to scripts/lifestyle_candidates.json")
