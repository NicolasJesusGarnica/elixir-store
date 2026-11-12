import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/decants_oficiales.json', 'r', encoding='utf-8') as f:
    decants_map = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario_pdf = json.load(f)

print(f"Total perfumes en catalogo: {len(catalogo)}")
print(f"Total perfumes con decants oficiales guardados: {len(decants_map)}")

def extraer_ml(desc):
    m = re.search(r'\b(\d+)\s*ML\b', desc, re.IGNORECASE)
    return int(m.group(1)) if m else 100

# Mapa para buscar precios y tamaños de botella en el PDF
# Indexar por palabras clave
def buscar_en_pdf(marca, nombre, pid):
    pid_u = pid.upper()
    nom_u = nombre.upper()
    m_u = marca.upper()
    
    # Casos explícitos
    if pid == 'teriaq_intense_lattafa':
        for it in inventario_pdf:
            if 'TERIAQ INTENSE' in it['descripcion'].upper():
                return it
    elif pid == 'bharara_king':
        for it in inventario_pdf:
            if 'BHARARA KING' in it['descripcion'].upper() and it['precio_botella'] > 0:
                return it
    elif pid == 'asad_lattafa':
        for it in inventario_pdf:
            if it['marca'].upper() == 'LATTAFA' and 'ASAD' in it['descripcion'].upper() and 'ZANZIBAR' not in it['descripcion'].upper() and it['precio_botella'] > 0:
                return it
    elif pid == 'hawas_ice':
        for it in inventario_pdf:
            if 'HAWAS ICE' in it['descripcion'].upper():
                return it
    elif pid == '9_am_dive':
        for it in inventario_pdf:
            if '9 AM DIVE' in it['descripcion'].upper():
                return it
    elif pid == '9_pm_black':
        for it in inventario_pdf:
            if '9 PM' in it['descripcion'].upper() and 'MEN' in it['descripcion'].upper():
                return it
    elif pid == 'odyssey_candee':
        for it in inventario_pdf:
            if 'ODYSSEY CANDEE' in it['descripcion'].upper():
                return it

    # Búsqueda general
    tokens = [w for w in nom_u.split() if len(w) > 2 and w not in ['EDP', 'EDT', 'PARFUM', 'INTENSE', 'ELIXIR', 'HOMBRE', 'MUJER', 'UNISEX']]
    for it in inventario_pdf:
        desc = f"{it['marca']} {it['descripcion']}".upper()
        if all(t in desc for t in tokens) and it['precio_botella'] > 0:
            return it
            
    return None

actualizados = 0
for p in catalogo:
    pid = p['id']
    if pid in decants_map:
        # 1. Asignar decants oficiales
        p['volumenes'] = decants_map[pid]
        
        # 2. Verificar que tenga botella completa verificada con el PDF
        pdf_match = buscar_en_pdf(p['marca'], p['nombre'], pid)
        if pdf_match:
            ml = extraer_ml(pdf_match['descripcion'])
            precio = int(pdf_match['precio_botella'])
            p['completo'] = {
                'ml': ml,
                'precioBs': precio
            }
            p['stock_inventario'] = pdf_match['stock']
        elif not p.get('completo') or not p['completo'].get('precioBs'):
            p['completo'] = {'ml': 100, 'precioBs': 350}
            
        actualizados += 1

print(f"Total perfumes con decants y botella completa configurados: {actualizados}")

# Verificaciones clave
for test_id in ['teriaq_intense_lattafa', 'bharara_king', 'hawas_ice', 'odyssey_candee', '9_am_dive']:
    p = next((x for x in catalogo if x['id'] == test_id), None)
    if p:
        print(f"\n✓ [{p['id']}] {p['nombre']}")
        print(f"   Decants: {p['volumenes']}")
        print(f"   Botella completa PDF: {p['completo']} (Stock: {p.get('stock_inventario')})")

with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(catalogo, f, ensure_ascii=False, indent=2)

print("\nsrc/assets/perfumes.json actualizado exitosamente.")
