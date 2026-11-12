import json
import urllib.request
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

with open('scripts/progreso_r2.json', encoding='utf-8') as f:
    prog_r2 = json.load(f)

print(f"Total perfumes in catalog: {len(cat)}")
print(f"Total entries in progreso_r2: {len(prog_r2)}")

# Check each perfume image
broken = []
for p in cat:
    imgs = p.get('imagenes', [])
    if not imgs:
        broken.append((p['id'], p['nombre'], 'NO_IMGS', None))
        continue
    img_url = imgs[0].split('?')[0] # remove query params
    # Check if this filename is in prog_r2
    filename = img_url.split('/')[-1].replace('.webp', '')
    if filename not in prog_r2 or prog_r2[filename].get('status') != 'ok':
        broken.append((p['id'], p['nombre'], filename, img_url))

print(f"\nTotal potentially broken / missing in progreso_r2: {len(broken)}")
for pid, name, filename, url in broken:
    # Try to find a match in prog_r2
    matches = [k for k in prog_r2.keys() if any(t in k for t in pid.split('_') if len(t) > 3)]
    print(f"\n[BROKEN] {pid} | {name}")
    print(f"   Current URL: {url}")
    print(f"   Candidates in R2: {matches[:5]}")
