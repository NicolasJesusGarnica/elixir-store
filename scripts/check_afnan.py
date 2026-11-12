import json

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

for p in cat:
    if '9' in p['nombre'] or '9_pm' in p['id'] or 'elixir' in p['id']:
        print(f"ID: {p['id']} | Nombre: {p['nombre']} | Completo: {p.get('completo')}")
