import json
from collections import defaultdict
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

url_to_perfumes = defaultdict(list)
for p in cat:
    imgs = p.get('imagenes', [])
    if imgs:
        url_to_perfumes[imgs[0].split('?')[0]].append(p)

print('=== Perfumes que comparten la misma imagen en R2 ===')
for url, perfs in url_to_perfumes.items():
    if len(perfs) > 1:
        print(f"\nURL: {url}")
        for p in perfs:
            print(f"   - [{p['id']}] {p['nombre']} (Marca: {p['marca']})")
