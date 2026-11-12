import json
import re

with open("scripts/raw_pdf_lines.txt", "r", encoding="utf-8") as f:
    raw_lines = f.readlines()

with open("src/assets/perfumes.json", "r", encoding="utf-8") as f:
    catalogo = json.load(f)

print(f"Total productos en catalogo: {len(catalogo)}")

# Normalizador
def norm(txt):
    return re.sub(r'[^a-z0-9]', '', txt.lower())

cat_names_norm = [norm(p['nombre']) for p in catalogo]

# Busquemos productos en las líneas
# Cada producto suele tener: CODIGO / MARCA / CATEGORIA / DESCRIPCION / CANT / COSTO / PRECIO
# Las líneas que son cabeceras o pies:
# "ELIXIR - REPORTES DE INVENTARIO", "CODIGO", "Pagina", "LINEA:"
items = []
current = ""

for line in raw_lines:
    line = re.sub(r'^PAG \d+:\s*', '', line).strip()
    if not line:
        continue
    if "ELIXIR - REPORTES" in line or "Generador por" in line or "ESTADO:" in line or "CODIGO ITEM" in line or "LINEA:" in line:
        continue
    # Regex para detectar fin de fila: CANT_VENDIDA CANT_MINIMA CANTIDAD COSTO PRECIO_UNIT
    # e.g. 1.00 0 9.00 55.00 100.00
    m = re.search(r'(\d+\.\d{2})\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})$', line)
    if m:
        # Fila completa
        full_line = (current + " " + line).strip() if current else line
        current = ""
        items.append(full_line)
    else:
        # Parte previa de la fila
        current = (current + " " + line).strip() if current else line

print(f"Total filas de productos detectadas: {len(items)}")

# Analicemos cada fila detectada
parsed_products = []
for item in items:
    m = re.search(r'(\d+\.\d{2})\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})$', item)
    if not m:
        continue
    cant_vendida, cant_min, cantidad, costo, precio = m.groups()
    resto = item[:m.start()].strip()
    
    # Separar campos iniciales si es posible
    # Código, Marca, Categoria, Unidad, Ubicación, Descripción
    # Usualmente empieza con codigo numerico
    code_m = re.match(r'^([0-9A-Za-z_-]+)\s+(.+)$', resto)
    code = code_m.group(1) if code_m else ""
    desc_part = code_m.group(2) if code_m else resto

    parsed_products.append({
        'raw': item,
        'code': code,
        'full_desc': desc_part,
        'precio': float(precio),
        'costo': float(costo),
        'cantidad': float(cantidad)
    })

print(f"Total parsed products: {len(parsed_products)}")

# Verifiquemos cuáles están en el catálogo
missing = []
present = []

for p in parsed_products:
    raw_desc = p['full_desc']
    p_norm = norm(raw_desc)
    
    # Buscar si algún nombre del catálogo hace match sustancial
    found = False
    for cat_p in catalogo:
        cn = norm(cat_p['nombre'])
        if cn in p_norm or p_norm in cn:
            found = True
            break
        # También buscar por id
        if cat_p['id'] in p_norm or p_norm in cat_p['id']:
            found = True
            break
        # Buscar por palabras clave clave
        # e.g. si las 3 primeras palabras significativas coinciden
        words = [w for w in re.split(r'\W+', cat_p['nombre'].lower()) if len(w) > 3]
        if len(words) >= 3 and all(w in raw_desc.lower() for w in words[:3]):
            found = True
            break
            
    if found:
        present.append(p)
    else:
        missing.append(p)

print(f"Detectados como presentes: {len(present)}")
print(f"Detectados como faltantes o no coincidentes: {len(missing)}")

with open("scripts/missing_items.json", "w", encoding="utf-8") as f:
    json.dump(missing, f, indent=2, ensure_ascii=False)

print("\n--- EJEMPLOS DE FALTANTES ---")
for m in missing[:30]:
    print(f"- {m['full_desc']} | Bs {m['precio']}")
