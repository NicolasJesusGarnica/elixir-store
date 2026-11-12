import json

with open('scripts/perfumes_consolidados.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

for it in items:
    if it['marca'] in ['Hombre', 'Mujer', 'Unisex', 'General']:
        print(f"{it['marca']} -> {it['descripciones_originales'][0]}")
