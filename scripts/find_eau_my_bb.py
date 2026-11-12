import json

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

for p in cat:
    if 'BB' in p['nombre'].upper() or 'EAU MY' in p['nombre'].upper() or 'av_' in p['id']:
        print(f"ID: {p['id']} | Nombre: {p['nombre']} | Imagenes: {p.get('imagenes')}")
