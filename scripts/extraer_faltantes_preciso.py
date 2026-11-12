import json
import re

with open("scripts/raw_pdf_lines.txt", "r", encoding="utf-8") as f:
    raw_lines = f.readlines()

with open("src/assets/perfumes.json", "r", encoding="utf-8") as f:
    catalogo = json.load(f)

# Creamos un conjunto de tokens normalizados para cada perfume del catálogo
cat_index = []
for p in catalogo:
    tokens = set(re.findall(r'[a-z0-9]+', (p['marca'] + ' ' + p['nombre']).lower()))
    cat_index.append({
        'id': p['id'],
        'nombre': p['nombre'],
        'marca': p['marca'],
        'precioBs': p.get('completo', {}).get('precioBs') or (p['volumenes'][0]['precioBs'] if p.get('volumenes') else 0),
        'tokens': tokens
    })

# Unir líneas que pertenecen a la misma fila del PDF
# Cada fila termina con: CANT_VENDIDA CANT_MINIMA CANTIDAD COSTO PRECIO_UNIT (5 números con decimales/enteros)
rows = []
curr = ""
for line in raw_lines:
    line = re.sub(r'^PAG \d+:\s*', '', line).strip()
    if not line:
        continue
    if any(h in line for h in ["ELIXIR - REPORTES", "Generador por", "ESTADO:", "CODIGO ITEM", "LINEA:"]):
        continue
    
    # Termina con e.g. "1.00 0 9.00 55.00 100.00"
    m = re.search(r'(\d+\.\d{2})\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})$', line)
    if m:
        full = (curr + " " + line).strip() if curr else line
        curr = ""
        rows.append((full, m.groups()))
    else:
        curr = (curr + " " + line).strip() if curr else line

print(f"Total filas válidas encontradas: {len(rows)}")

parsed = []
for full_text, metrics in rows:
    cant_v, cant_min, cant, costo, precio = metrics
    precio = float(precio)
    costo = float(costo)
    cant = float(cant)
    
    # Texto sin las métricas finales
    cut_idx = full_text.rfind(metrics[0])
    desc_raw = full_text[:cut_idx].strip()
    
    # Extraer marcas comunes conocidas
    marcas_conocidas = [
        "ADIDAS", "AFNAN", "AJMAL", "AL HARAMAIN", "AL WATANIAH", "AMARAN", "ANFAR",
        "ANTONIO BANDERAS", "ARABIYAT PRESTIGE", "ARD AL ZAAFARAN", "ARIANA GRANDE", "ARMAF",
        "AV BARBIE", "AV BATMAN AND JOKER", "AV BOB ESPONJA", "AV EAU MY BB", "AV EAU MY UNICORN",
        "AV FCB BARCELONA", "AV FCB REAL MADRID", "AV FROZEN", "AV FROZEN II", "AV HELLO KITTY",
        "AV LILO AND STICH", "AV MARVEL", "AV MICKEY MOUSE", "AV MINECRAFT", "AV MINNIE MOUSE",
        "AV PAW PATROL", "AV SPIDERMAN", "AV STRANGER THINGS", "AZZARO", "BENETTON", "BHARARA",
        "BILLIE EILISH", "BURBERRY", "BVLGARI", "CACHAREL", "CALVIN KLEIN", "CAMARA",
        "CAROLINA HERRERA", "DAVIDOFF", "DIOR", "DOLCE GABBANA", "DUMONT", "EMPORIO ARMANI",
        "FRENCH AVENUE", "GAME OF SPADES", "GIORGIO ARMANI", "GIVENCHY", "GUCCI", "GUESS",
        "HERMES", "HUGO BOSS", "JEAN PAUL GAULTIER", "JENNIFER LOPEZ", "JESUS DEL POZO",
        "KAJAL", "KHADLAJ", "LACOSTE", "LANCOME", "LATTAFA", "LATTAFA PRIDE", "LATTAFA VURV",
        "MAISON ALHAMBRA", "MANCERA", "MARC JACOBS", "MERCEDES BENZ", "MESSI", "MONT BLANC",
        "MONTALE", "MOSCHINO", "MUGLER", "NENE BEAUTY", "NIKE", "NINA RICCI", "ORIENTICA",
        "PACO RABANNE", "PARFUMS DE MARLY", "PEPE JEANS", "POLO", "PRADA", "RASASI",
        "RAYHAAN", "ROME", "SABRINA CARPENTER", "SHAKIRA", "SHREK", "STANLEY", "TUBBEES",
        "VALENTINO", "VERSACE", "VICTORIA SECRET", "VIKTOR ROLF", "XERJOFF"
    ]
    
    marca_encontrada = "GENERAL"
    for m in sorted(marcas_conocidas, key=len, reverse=True):
        if m in desc_raw.upper():
            marca_encontrada = m
            break
            
    # Limpiar código inicial si existe
    clean_desc = desc_raw
    # Quitar UNIDAD, GENERAL, BIENES, HOMBRE, MUJER, UNISEX
    clean_desc = re.sub(r'\b(UNIDAD|BIENES|GENERAL|HOMBRE|MUJER|UNISEX)\b', ' ', clean_desc)
    clean_desc = re.sub(r'^[0-9A-Za-z_-]{4,20}\s+', ' ', clean_desc).strip()
    clean_desc = re.sub(r'\s+', ' ', clean_desc)
    
    parsed.append({
        'raw': full_text,
        'marca': marca_encontrada,
        'desc': clean_desc,
        'precio': precio,
        'costo': costo,
        'cantidad': cant
    })

# Clasifiquemos qué tiene y qué no tiene el catálogo
matched = []
unmatched = []

for p in parsed:
    # Excluir testers con precio 0 o filas irrelevantes
    if p['precio'] == 0 and p['cantidad'] == 0:
        continue
    if p['marca'] == 'STANLEY':
        continue # Termos
    if 'DECANT DE PERFUME' in p['desc']:
        continue # Registro contable de decants
        
    p_tokens = set(re.findall(r'[a-z0-9]+', (p['marca'] + ' ' + p['desc']).lower()))
    # Quitar palabras genéricas
    p_tokens_sig = {t for t in p_tokens if t not in ['edp', 'edt', 'ml', '100ml', 'spray', 'man', 'men', 'wom', 'women', 'de', 'el', 'la', 'los', 'un', 'una', 'general']}
    
    best_match = None
    best_score = 0
    for cp in cat_index:
        overlap = len(p_tokens_sig.intersection(cp['tokens']))
        if overlap > best_score:
            best_score = overlap
            best_match = cp
            
    # Si coinciden al menos 2 tokens significativos (o 3 si son palabras cortas)
    if best_score >= 2 and (best_score / max(len(p_tokens_sig), 1)) >= 0.4:
        matched.append((p, best_match, best_score))
    else:
        unmatched.append(p)

print(f"Total productos evaluados del PDF: {len(parsed)}")
print(f"Emparejados con el catálogo actual: {len(matched)}")
print(f"Sin emparejar (posibles faltantes): {len(unmatched)}")

with open("scripts/unmatched_pdf.json", "w", encoding="utf-8") as f:
    json.dump(unmatched, f, indent=2, ensure_ascii=False)

print("\n--- PRODUCTOS DEL PDF SIN EMPAREJAR ---")
for it in unmatched:
    print(f"[{it['marca']}] {it['desc']} | Bs {it['precio']} | Stock: {it['cantidad']}")
