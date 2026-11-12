import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

iniciales = catalogo[:78]

def extract_ml(text):
    m = re.search(r'(\d+)\s*ML', text, re.IGNORECASE)
    return int(m.group(1)) if m else 100

# Mapeo manual y explícito para los 78 perfumes iniciales contra el PDF
# Para garantizar 100% de precisión matemática con el reporte de existencia.
mapeo_78 = {}

for p in iniciales:
    pid = p['id']
    pname = p['nombre'].upper()
    pmarca = p['marca'].upper()
    
    # Encontrar el mejor match en inventario
    best_item = None
    
    # Reglas específicas para los conocidos
    if pid == 'teriaq_intense_lattafa':
        best_item = next((it for it in inventario if 'TERIAQ INTENSE' in it['descripcion'].upper()), None)
    elif pid == 'bharara_king':
        best_item = next((it for it in inventario if 'BHARARA KING' in it['descripcion'].upper()), None)
    elif pid == 'asad_lattafa':
        best_item = next((it for it in inventario if it['marca'].upper() == 'LATTAFA' and 'ASAD' in it['descripcion'].upper() and 'ZANZIBAR' not in it['descripcion'].upper()), None)
    elif pid == 'asad_zanzibar':
        best_item = next((it for it in inventario if 'ZANZIBAR' in it['descripcion'].upper()), None)
    elif pid == '9_am_dive':
        best_item = next((it for it in inventario if '9 AM DIVE' in it['descripcion'].upper()), None)
    elif pid == '9_pm_black':
        best_item = next((it for it in inventario if '9 PM' in it['descripcion'].upper() and 'REBEL' not in it['descripcion'].upper() and 'NIGHT' not in it['descripcion'].upper() and 'ELIXIR' not in it['descripcion'].upper()), None)
    elif pid == '9_pm_elixir':
        best_item = next((it for it in inventario if '9 PM ELIXIR' in it['descripcion'].upper()), None)
    elif pid == '9pm_rebel':
        best_item = next((it for it in inventario if '9PM REBEL' in it['descripcion'].upper() or '9 PM REBEL' in it['descripcion'].upper()), None)
    elif pid == '9_pm_night_out':
        best_item = next((it for it in inventario if '9 PM NIGHT OUT' in it['descripcion'].upper()), None)
    elif pid == 'hawas_ice':
        best_item = next((it for it in inventario if 'HAWAS ICE' in it['descripcion'].upper()), None)
    elif pid == 'hawas_tropical':
        best_item = next((it for it in inventario if 'HAWAS TROPICAL' in it['descripcion'].upper()), None)
    elif pid == 'hawas_malibu':
        best_item = next((it for it in inventario if 'HAWAS MALIBU' in it['descripcion'].upper()), None)
    elif pid == 'hawas_kobra':
        best_item = next((it for it in inventario if 'HAWAS KOBRA' in it['descripcion'].upper()), None)
    elif pid == 'hawas_verde':
        best_item = next((it for it in inventario if 'HAWAS VERDE' in it['descripcion'].upper()), None)
    elif pid == 'hawas_fire':
        best_item = next((it for it in inventario if 'HAWAS FIRE' in it['descripcion'].upper()), None)
    elif pid == 'hawas_for_him':
        best_item = next((it for it in inventario if 'HAWAS' in it['descripcion'].upper() and 'FOR HIM' in it['descripcion'].upper()), None)
    elif pid == 'azzaro_tmw_edp_intense':
        best_item = next((it for it in inventario if 'THE MOST WANTED' in it['descripcion'].upper() and 'INTENSE' in it['descripcion'].upper()), None)
    elif pid == 'azzaro_tmw_parfum':
        best_item = next((it for it in inventario if 'THE MOST WANTED PARFUM' in it['descripcion'].upper()), None)
    elif pid == 'xerjoff_erba_pura':
        best_item = next((it for it in inventario if 'ERBA PURA' in it['descripcion'].upper()), None)
    elif pid == 'jpg_le_male_elixir':
        best_item = next((it for it in inventario if 'LE MALE ELIXIR' in it['descripcion'].upper()), None)
    elif pid == 'jpg_le_male_le_parfum':
        best_item = next((it for it in inventario if 'LE MALE LE PARFUM' in it['descripcion'].upper()), None)
    elif pid == 'jpg_le_beau_edt':
        best_item = next((it for it in inventario if 'LE BEAU' in it['descripcion'].upper()), None)
    elif pid == 'jpg_divine_elixir':
        best_item = next((it for it in inventario if 'DIVINE ELIXIR' in it['descripcion'].upper()), None)
    elif pid == 'paco_rabanne_invictus':
        best_item = next((it for it in inventario if 'INVICTUS' in it['descripcion'].upper()), None)
    elif pid == 'valentino_born_in_roma':
        best_item = next((it for it in inventario if 'BORN IN ROMA' in it['descripcion'].upper()), None)
    elif pid == 'dior_fahrenheit':
        best_item = next((it for it in inventario if 'FAHRENHEIT' in it['descripcion'].upper()), None)
    elif pid == 'turathi_electric':
        best_item = next((it for it in inventario if 'TURATHI' in it['descripcion'].upper() and 'ELECTRIC' in it['descripcion'].upper()), None)
    elif pid.startswith('odyssey_'):
        variant = pid.replace('odyssey_', '').replace('_', ' ').upper()
        best_item = next((it for it in inventario if 'ODYSSEY' in it['descripcion'].upper() and any(w in it['descripcion'].upper() for w in variant.split())), None)
    elif pid.startswith('nike_'):
        variant = pid.replace('nike_', '').replace('_', ' ').upper()
        best_item = next((it for it in inventario if it['marca'].upper() == 'NIKE' and any(w in it['descripcion'].upper() for w in variant.split())), None)
    elif pid.startswith('ab_'):
        variant = pid.replace('ab_', '').replace('_', ' ').upper()
        best_item = next((it for it in inventario if 'ANTONIO BANDERAS' in it['marca'].upper() and any(w in it['descripcion'].upper() for w in variant.split() if w not in ['MEN', 'WOMEN', 'EDT', 'EDP'])), None)
    elif pid.startswith('game_of_spades_'):
        variant = pid.replace('game_of_spades_', '').replace('_', ' ').upper()
        best_item = next((it for it in inventario if 'GAME OF SPADES' in it['descripcion'].upper() and any(w in it['descripcion'].upper() for w in variant.split())), None)
    elif pid.startswith('ag_'):
        variant = pid.replace('ag_', '').replace('_', ' ').upper()
        best_item = next((it for it in inventario if 'ARIANA GRANDE' in it['marca'].upper() and any(w in it['descripcion'].upper() for w in variant.split() if w not in ['BODY', 'MIST', 'SPRAY'])), None)

    # Si aún no tiene match, buscar por palabras clave
    if not best_item:
        p_tokens = [w for w in pname.split() if len(w) > 2 and w not in ['EDP', 'EDT', 'PARFUM', 'INTENSE', 'ELIXIR', 'HOMBRE', 'MUJER', 'UNISEX']]
        for it in inventario:
            it_desc = f"{it['marca']} {it['descripcion']}".upper()
            if all(t in it_desc for t in p_tokens):
                best_item = it
                break

    if best_item:
        ml = extract_ml(best_item['descripcion'])
        mapeo_78[pid] = {
            'pdf_marca': best_item['marca'],
            'pdf_desc': best_item['descripcion'],
            'ml': ml,
            'precioBs': int(best_item['precio_botella']),
            'stock': best_item['stock'],
            'pagina': best_item['pagina']
        }
    else:
        mapeo_78[pid] = None

encontrados = sum(1 for v in mapeo_78.values() if v is not None)
print(f"Total de los 78 mapeados exitosamente al PDF: {encontrados}/{len(iniciales)}")

for pid, info in list(mapeo_78.items())[20:]:
    if info:
        print(f"✓ {pid:25s} -> {info['pdf_marca']} {info['pdf_desc']} | {info['ml']}ml | Bs {info['precioBs']} (Pag {info['pagina']})")
    else:
        print(f"✗ {pid:25s} -> NO ENCONTRADO EN PDF")
