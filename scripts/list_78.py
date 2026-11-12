import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    cat = json.load(f)

print(f"Total: {len(cat)}")
for i, p in enumerate(cat[:78]):
    print(f"{i+1:2d}. id={p['id']:30s} marca={p['marca']:20s} nombre={p['nombre']:35s}")
