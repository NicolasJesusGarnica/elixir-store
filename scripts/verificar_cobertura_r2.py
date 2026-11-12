import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

with open('scripts/progreso_r2.json', 'r', encoding='utf-8') as f:
    progreso_r2 = json.load(f)

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo_actual = json.load(f)

print(f"Total inventario PDF: {len(inventario)}")
print(f"Total subidos a R2: {len(progreso_r2)}")
print(f"Total catalogo actual: {len(catalogo_actual)}")

# Crear mapa de imágenes por ID existente y por URL en R2
r2_urls = {}
for k, v in progreso_r2.items():
    if v.get('status') == 'ok':
        r2_urls[k] = v.get('r2_url')

cat_por_id = {p['id']: p for p in catalogo_actual}

print(f"Imágenes válidas en R2: {len(r2_urls)}")
