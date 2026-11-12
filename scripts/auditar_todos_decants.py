import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

print(f"Total en catalogo actual: {len(catalogo)}")
print(f"Total filas en PDF inventario: {len(inventario)}")

# Analizar cuántos tienen decants en el catálogo actual
con_decants = [p for p in catalogo if len(p.get('volumenes', [])) > 0]
print(f"Perfumes con decants en catálogo: {len(con_decants)}")
for p in con_decants:
    print(f"- ID: {p['id']} | {p['nombre']} | Marca: {p['marca']} | Decants: {p['volumenes']} | Completo: {p.get('completo')}")
