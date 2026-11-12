import json
import os
import re

CATALOG_PATH = 'src/assets/perfumes.json'
PREPARADOS_PATH = 'scripts/catalogo_preparado.json'
CONSOLIDADOS_PATH = 'scripts/perfumes_consolidados.json'
R2_STATE_PATH = 'scripts/progreso_r2.json'

with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
    existentes = json.load(f)

with open(PREPARADOS_PATH, 'r', encoding='utf-8') as f:
    nuevos = json.load(f)

with open(CONSOLIDADOS_PATH, 'r', encoding='utf-8') as f:
    consolidados = json.load(f)

r2_state = {}
if os.path.exists(R2_STATE_PATH):
    try:
        with open(R2_STATE_PATH, 'r', encoding='utf-8') as f:
            r2_state = json.load(f)
    except Exception:
        r2_state = {}

# Mapa de consolidados por marca y nombre normalizado
cons_map = {}
for c in consolidados:
    key = f"{c['marca']} {c['nombre_corto']}".lower().replace(' ', '')
    cons_map[key] = c

# 1. Actualizar precios de botellas completas en perfumes existentes
actualizados_existentes = 0
for ex in existentes:
    ex_key = f"{ex['marca']} {ex['nombre']}".lower().replace(' ', '')
    # Buscar coincidencia
    match = cons_map.get(ex_key)
    if not match:
        for k, v in cons_map.items():
            if ex['marca'].lower() in k and ex['nombre'].lower().split()[-1] in k:
                match = v
                break
    
    if match and match['precios_botella']:
        precios_validos = [p for p in match['precios_botella'] if p > 0]
        if precios_validos:
            precio_min = min(precios_validos)
            if not ex.get('completo'):
                ex['completo'] = {'ml': 100, 'precioBs': int(precio_min)}
            elif ex['completo'].get('precioBs') is None or ex['completo'].get('precioBs') == 0:
                ex['completo']['precioBs'] = int(precio_min)
            actualizados_existentes += 1

print(f"Perfumes existentes actualizados con precios de inventario: {actualizados_existentes}/{len(existentes)}")

# 2. Agregar nuevos perfumes
ids_existentes = set(p['id'] for p in existentes)
agregados = 0

for n in nuevos:
    nid = n['id']
    if nid in ids_existentes:
        continue

    # Verificar URL R2
    if nid in r2_state and r2_state[nid].get('status') == 'ok':
        n['imagenes'] = [f"{r2_state[nid]['r2_url']}?v=2"]
    else:
        n['imagenes'] = [f"https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/{nid}.webp?v=2"]

    # Limpiar campos temporales no necesarios en el json del frontend
    if 'query_busqueda' in n:
        del n['query_busqueda']

    existentes.append(n)
    ids_existentes.add(nid)
    agregados += 1

print(f"Total perfumes agregados: {agregados}")
print(f"Total catálogo final: {len(existentes)}")

with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
    json.dump(existentes, f, ensure_ascii=False, indent=2)

print(f"Guardado exitosamente en {CATALOG_PATH}")
