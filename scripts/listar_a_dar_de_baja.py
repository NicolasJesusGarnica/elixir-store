import json
import sys
sys.path.append('.')
sys.path.append('scripts')
from verificar_mapeo_exacto import explicit_mapping

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

cat_map = {p['id']: p for p in catalogo}

to_deactivate = set()
for desc, pid in explicit_mapping.items():
    if pid and pid in cat_map:
        to_deactivate.add(pid)

# Also include ariana_grande_mod_vainilla alias if mod_vanilla is deactivated
if 'ariana_grande_mod_vanilla' in to_deactivate:
    if 'ariana_grande_mod_vainilla' in cat_map:
        to_deactivate.add('ariana_grande_mod_vainilla')

print(f"Total perfumes to deactivate: {len(to_deactivate)}")

for pid in sorted(to_deactivate):
    p = cat_map[pid]
    precio = p.get('completo', {}).get('precioBs', 0)
    stock = p.get('stock_inventario')
    print(f"  {pid:<45} | Bs {precio:>4} | stock: {stock} | {p['nombre']}")
