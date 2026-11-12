import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

def normalizar(s):
    s = s.lower()
    s = re.sub(r'\b(edp|edt|parfum|extrait|eau|de|intense|elixir|men|women|hombre|mujer|unisex)\b', '', s)
    s = re.sub(r'[^a-z0-9]', '', s)
    return s

grupos = {}
for p in catalogo:
    key = normalizar(f"{p['marca']} {p['nombre']}")
    if key not in grupos:
        grupos[key] = []
    grupos[key].append(p)

dups = {k: v for k, v in grupos.items() if len(v) > 1}
print(f"Total perfumes en catalogo: {len(catalogo)}")
print(f"Grupos duplicados encontrados: {len(dups)}")

for k, prods in list(dups.items())[:20]:
    print(f"\nGrupo: {k}")
    for p in prods:
        print(f"  - [{p['id']}] {p['nombre']} | Marca: {p['marca']} | Decants: {len(p.get('volumenes', []))} | Completo: {p.get('completo')}")
