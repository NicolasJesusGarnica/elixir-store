import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

def clean(text):
    return re.sub(r'[^a-z0-9]+', ' ', text.lower()).strip()

print(f"Total catalogo: {len(catalogo)}")
print(f"Total items inventario PDF: {len(inventario)}")

# Normalizar items del PDF
pdf_items = []
for it in inventario:
    desc = clean(f"{it['marca']} {it['descripcion']}")
    # Extraer ml
    m = re.search(r'(\d+)\s*ml', it['descripcion'].lower())
    ml = int(m.group(1)) if m else 100
    pdf_items.append({
        'marca': it['marca'],
        'descripcion': it['descripcion'],
        'clean_desc': desc,
        'stock': it['stock'],
        'precio_botella': it['precio_botella'],
        'ml': ml,
        'pagina': it['pagina']
    })

# Analizar los 524 perfumes del catalogo
con_decants = [p for p in catalogo if len(p.get('volumenes', [])) > 0]
print(f"Perfumes con decants actualmente: {len(con_decants)}")

matches_pdf = []
no_matches_pdf = []

for p in con_decants:
    p_marca = clean(p['marca'])
    p_nom = clean(p['nombre'])
    p_id = clean(p['id'])
    
    # Buscar match exacto o muy cercano en PDF
    found = None
    for item in pdf_items:
        # Match directo por palabras clave significativas
        # Ej: teriaq intense lattafa
        if 'teriaq' in p_nom and 'teriaq' in item['clean_desc']:
            found = item
            break
        elif 'bharara' in p_nom and 'king' in p_nom and 'bharara' in item['clean_desc'] and 'king' in item['clean_desc']:
            found = item
            break
        elif 'zanzibar' in p_nom and 'zanzibar' in item['clean_desc']:
            found = item
            break
        elif 'asad' in p_nom and 'asad' in item['clean_desc'] and 'zanzibar' not in item['clean_desc'] and 'zanzibar' not in p_nom:
            found = item
            break
            
    if not found:
        # Busqueda general
        palabras_clave = [w for w in p_nom.split() if w not in ['de', 'el', 'la', 'los', 'las', 'edp', 'edt', 'parfum', 'intense', 'elixir', 'men', 'women', 'pour', 'homme', 'femme']]
        for item in pdf_items:
            if all(w in item['clean_desc'] for w in palabras_clave) and len(palabras_clave) >= 2:
                found = item
                break
                
    if found:
        matches_pdf.append((p, found))
    else:
        no_matches_pdf.append(p)

print(f"\nDe los {len(con_decants)} perfumes con decants:")
print(f"Encontrados directamente en el PDF de inventario: {len(matches_pdf)}")
print(f"No encontrados directamente en el PDF: {len(no_matches_pdf)}")

print("\n--- 10 que están en el PDF pero tienen decants: ---")
for p, it in matches_pdf[:10]:
    print(f"- {p['nombre']} (ID: {p['id']})")
    print(f"  En PDF: {it['marca']} {it['descripcion']} -> Botella {it['ml']}ml Bs {it['precio_botella']}")
    print(f"  Tiene decants inventados: {p['volumenes']}")
