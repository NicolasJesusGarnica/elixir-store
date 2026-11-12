import json
import os
import glob
from PIL import Image

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

print(f"Total perfumes in catalog: {len(perfumes)}")

# Match each perfume with temp_raw_catalog
raw_files = {}
for f in glob.glob('temp_raw_catalog/*'):
    base = os.path.splitext(os.path.basename(f))[0]
    raw_files[base] = f

print(f"Files in temp_raw_catalog: {len(raw_files)}")

non_white_perfumes = []

for p in perfumes:
    pid = p['id']
    raw_path = raw_files.get(pid)
    if not raw_path:
        # try without prefix or with alternative
        for k, v in raw_files.items():
            if k in pid or pid in k:
                raw_path = v
                break
    
    if raw_path:
        try:
            im = Image.open(raw_path).convert('RGB')
            w, h = im.size
            # Sample 4 corners
            pts = [
                (int(w * 0.04), int(h * 0.04)),
                (int(w * 0.96), int(h * 0.04)),
                (int(w * 0.04), int(h * 0.96)),
                (int(w * 0.96), int(h * 0.96)),
            ]
            white_corners = 0
            for pt in pts:
                r, g, b = im.getpixel(pt)
                if r >= 235 and g >= 235 and b >= 235 and max(r, g, b) - min(r, g, b) <= 18:
                    white_corners += 1
            
            # If corners are not white in the raw image, it was a lifestyle / non-white photo!
            if white_corners < 3:
                c_rgb = [im.getpixel(pt) for pt in pts]
                non_white_perfumes.append((p, raw_path, white_corners, c_rgb))
        except Exception as e:
            print(f"Error {pid}: {e}")

print(f"\nPerfumes with non-white raw background: {len(non_white_perfumes)}")
for p, rp, wc, c_rgb in sorted(non_white_perfumes, key=lambda x: x[0]['id']):
    print(f"  {p['id']} ({p['nombre']}): corners_white={wc}/4, file={os.path.basename(rp)}")
