import json
import re

with open("scripts/raw_pdf_lines.txt", "r", encoding="utf-8") as f:
    raw_lines = f.readlines()

with open("src/assets/perfumes.json", "r", encoding="utf-8") as f:
    catalogo = json.load(f)

# Limpiar filas
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

print(f"Total rows en PDF: {len(rows)}")

# Excluir no-perfumes evidentes:
# STANLEY, DECANT DE PERFUME, TESTERS con precio 0 y cant 0
filtrados = []
for r in rows:
    f = r['full']
    if 'STANLEY' in f or 'DECANT DE PERFUME' in f:
        continue
    if r['precio'] == 0:
        continue
    filtrados.append(r)

print(f"Total filas relevantes con precio > 0: {len(filtrados)}")

# Buscar si existe en el catálogo
def buscar_en_catalogo(f_text, precio):
    text_lower = f_text.lower()
    for p in catalogo:
        nombre_lower = p['nombre'].lower()
        id_lower = p['id'].lower()
        
        # Coincidencia por id
        id_words = [w for w in id_lower.split('_') if len(w) > 2]
        if id_words and all(w in text_lower for w in id_words[:2]):
            # Verificar si coincide bastante
            return p
            
        # Coincidencia por nombre
        nom_words = [w for w in re.split(r'\W+', nombre_lower) if len(w) > 3]
        if len(nom_words) >= 2 and all(w in text_lower for w in nom_words[:2]):
            return p
    return None

no_encontrados = []
encontrados = []

for r in filtrados:
    match = buscar_en_catalogo(r['full'], r['precio'])
    if match:
        encontrados.append((r, match))
    else:
        no_encontrados.append(r)

print(f"Encontrados: {len(encontrados)}")
print(f"No encontrados: {len(no_encontrados)}")

with open("scripts/items_no_encontrados.json", "w", encoding="utf-8") as out:
    json.dump(no_encontrados, out, indent=2, ensure_ascii=False)

for item in no_encontrados[:40]:
    print(f"Bs {item['precio']:>6.1f} | Cant: {item['cant']} | {item['full']}")
