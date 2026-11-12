import json
import re

with open("scripts/raw_pdf_lines.txt", "r", encoding="utf-8") as f:
    raw_lines = f.readlines()

with open("src/assets/perfumes.json", "r", encoding="utf-8") as f:
    catalogo = json.load(f)

# Reconstruir filas completas
rows = []
curr = ""
for line in raw_lines:
    line = re.sub(r'^PAG \d+:\s*', '', line).strip()
    if not line or any(h in line for h in ["ELIXIR - REPORTES", "Generador por", "ESTADO:", "CODIGO ITEM", "LINEA:"]):
        continue
    m = re.search(r'(\d+\.\d{2})\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})$', line)
    if m:
        full = (curr + " " + line).strip() if curr else line
        curr = ""
        cant_v, cant_min, cant, costo, precio = m.groups()
        rows.append({
            'full': full,
            'precio': float(precio),
            'costo': float(costo),
            'cant': float(cant)
        })
    else:
        curr = (curr + " " + line).strip() if curr else line

# Palabras clave de sets / combos / complementos
keywords = [r'\bset\b', r'\bestuche\b', r'\bshampoo\b', r'\bshower\b', r'\bgel\b', r'\bbl\b', r'\bsg\b', r'\bdesodorante\b', r'\bdeso\b', r'\blonchera\b', r'\bmochila\b', r'\bneceser\b', r'\bteddy\b', r'\bbody mist\b', r'\bbody splash\b', r'\bbruma\b', r'\bhair mist\b', r'\blip glow\b']

sets_found = []
for r in rows:
    f_lower = r['full'].lower()
    for kw in keywords:
        if re.search(kw, f_lower):
            sets_found.append(r)
            break

print(f"Total filas encontradas con palabras clave de sets/complementos: {len(sets_found)}")

# Verificar cuáles están ya en el catálogo
ya_estan = []
faltan = []

for r in sets_found:
    text = r['full'].lower()
    # Buscar en catalogo
    match = None
    for p in catalogo:
        p_name = p['nombre'].lower()
        # Si las 2 primeras palabras del set están en el nombre
        # o si el id del set coincide
        words = [w for w in re.findall(r'[a-z0-9]+', text) if len(w) > 3 and w not in ['unidad', 'bienes', 'general', 'hombre', 'mujer', 'unisex', 'set', 'estuche', 'edt', 'edp', '100ml', 'spray']]
        if len(words) >= 2:
            if all(w in p_name or w in p['id'] for w in words[:2]):
                # Si además el catálogo tiene 'set' o 'estuche' o 'body'
                if any(k in p_name or k in p['id'] for k in ['set', 'estuche', 'mist', 'splash', 'bruma', 'sg', 'deo']):
                    match = p
                    break
    if match:
        ya_estan.append((r, match))
    else:
        faltan.append(r)

print(f"Ya están en catálogo: {len(ya_estan)}")
print(f"Faltan por añadir: {len(faltan)}")

print("\n--- FALTAN POR AÑADIR (SETS / COMBOS / BODY MISTS / COMPLEMENTOS) ---")
for f in faltan:
    print(f"Bs {f['precio']:>6.1f} | Stock: {f['cant']:>4.1f} | {f['full']}")
