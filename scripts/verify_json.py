import json

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

for p in perfumes:
    if 'mod_v' in p['id']:
        print(p['id'], p['nombre'], p['imagenes'])
