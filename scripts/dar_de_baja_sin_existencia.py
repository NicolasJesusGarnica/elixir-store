import json
import sys
sys.path.append('.')
sys.path.append('scripts')
from verificar_mapeo_exacto import explicit_mapping

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

# Collect all IDs from PDF
to_deactivate = set()
for desc, pid in explicit_mapping.items():
    if pid:
        to_deactivate.add(pid)

# Additional aliases / duplicates with 0 stock
extra_aliases = [
    'victoria_s_secret_bare_vanilla_mist',
    'av_marvel_capitan_america',
    'av_minecraft_minecraft',
    'afnan_supremacy_not_only_intense',
    'ariana_grande_mod_vainilla'
]
for alias in extra_aliases:
    to_deactivate.add(alias)

# Also ensure any item in the catalog with stock_inventario == 0 is deactivated
for p in catalogo:
    if p.get('stock_inventario') == 0:
        to_deactivate.add(p['id'])

print(f"Total productos a dar de baja: {len(to_deactivate)}")

deactivated_count = 0
for p in catalogo:
    if p['id'] in to_deactivate:
        p['activo'] = False
        p['stock_inventario'] = 0
        deactivated_count += 1

print(f"Productos marcados con activo=False y stock_inventario=0: {deactivated_count}")
activos_restantes = len([p for p in catalogo if p.get('activo') is not False])
print(f"Productos activos restantes en la tienda: {activos_restantes}")

with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(catalogo, f, ensure_ascii=False, indent=2)

print("¡Catálogo src/assets/perfumes.json actualizado con éxito!")
