import json

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

print(f"Total catálogo: {len(cat)}")
con_decants = 0
sin_decants = 0
for i, p in enumerate(cat):
    v = p.get('volumenes', [])
    if len(v) > 0:
        con_decants += 1
        if i >= 78:
            print(f"Item > 78 con decants: {i} - {p['id']} - {p['nombre']}")
    else:
        sin_decants += 1
        if i < 78:
            print(f"Item < 78 SIN decants: {i} - {p['id']} - {p['nombre']}")

print(f"\nResumen:")
print(f"Perfumes CON decants: {con_decants}")
print(f"Perfumes SIN decants (solo completos): {sin_decants}")
