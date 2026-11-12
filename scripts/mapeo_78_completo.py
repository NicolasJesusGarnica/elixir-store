import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

# Buscar los 78 iniciales
iniciales = catalogo[:78]

# Buscar cada uno de los 78 en el inventario con coincidencia flexible
def buscar_en_inventario(p):
    p_nom = p['nombre'].upper()
    p_id = p['id'].upper()
    p_marca = p['marca'].upper()
    
    candidatos = []
    for item in inventario:
        item_text = f"{item['marca']} {item['descripcion']}".upper()
        
        # Casos directos
        if p_id == 'TERIAQ_INTENSE_LATTAFA' and 'TERIAQ' in item_text:
            return item
        if p_id == 'BHARARA_KING' and 'BHARARA KING' in item_text:
            return item
        if 'VALENTINO BORN IN ROMA' in item_text and 'VALENTINO' in p_nom:
            return item
        if 'SWEET LIKE CANDY' in item_text and 'CANDY' in p_nom:
            return item
        if 'THANK U NEXT' in item_text and 'THANK' in p_nom:
            return item
        if 'CLOUD' in item_text and 'CLOUD' in p_nom:
            return item
        if 'FAHRENHEIT' in item_text and 'FAHRENHEIT' in p_nom:
            return item
        if 'INVICTUS' in item_text and 'INVICTUS' in p_nom:
            return item
        if 'LE MALE ELIXIR' in item_text and 'LE MALE ELIXIR' in p_nom:
            return item
        if 'LE MALE LE PARFUM' in item_text and 'LE MALE LE PARFUM' in p_nom:
            return item
        if 'LE BEAU' in item_text and 'LE BEAU' in p_nom:
            return item
        if 'DIVINE' in item_text and 'DIVINE' in p_nom:
            return item
        if 'ERBA PURA' in item_text and 'ERBA PURA' in p_nom:
            return item
        if 'ASAD ZANZIBAR' in item_text and 'ZANZIBAR' in p_nom:
            return item
        if 'ASAD' in item_text and 'ASAD' in p_nom and 'ZANZIBAR' not in item_text and 'ZANZIBAR' not in p_nom:
            return item
        if 'TURATHI' in item_text and ('TURATHI' in p_nom or 'TURATHI' in p_id):
            candidatos.append((3, item))
        if 'ODYSSEY' in item_text and any(w in item_text for w in p_nom.split() if w not in ['ODYSSEY', 'ARMAF']):
            candidatos.append((4, item))
            
        # Puntuacion de coincidencia
        palabras = [w for w in p_nom.replace('EDP', '').replace('EDT', '').split() if len(w) > 2]
        coincidencias = sum(1 for w in palabras if w in item_text)
        if coincidencias >= 2:
            candidatos.append((coincidencias, item))
            
    if candidatos:
        candidatos.sort(key=lambda x: x[0], reverse=True)
        return candidatos[0][1]
    return None

for i, p in enumerate(iniciales):
    match = buscar_en_inventario(p)
    if match:
        print(f"{i+1:2d}. [MATCH] {p['nombre']} -> PDF: {match['marca']} {match['descripcion']} (Bs {match['precio_botella']}, {match['stock']} en stock)")
    else:
        print(f"{i+1:2d}. [NO PDF] {p['nombre']} (ID: {p['id']}, Marca: {p['marca']})")
