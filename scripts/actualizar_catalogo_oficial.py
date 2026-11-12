import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo_actual = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario_pdf = json.load(f)

with open('scripts/progreso_r2.json', 'r', encoding='utf-8') as f:
    progreso_r2 = json.load(f)

print(f"Cargados: {len(catalogo_actual)} del catálogo actual, {len(inventario_pdf)} del PDF inventario.")

mapa_existente_por_id = {p['id']: p for p in catalogo_actual}

def normalizar_key(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

mapa_existente_por_nombre = {}
for p in catalogo_actual:
    k = normalizar_key(f"{p['marca']} {p['nombre']}")
    mapa_existente_por_nombre[k] = p

IDS_HISTORICOS = {
    'LATTAFA TERIAQ INTENSE': 'teriaq_intense_lattafa',
    'BHARARA BHARARA KING': 'bharara_king',
    'AFNAN 9 AM DIVE': '9_am_dive',
    'AFNAN 9 PM MEN': '9_pm_black',
    'AFNAN 9 PM ELIXIR': '9_pm_elixir',
    'AFNAN 9 PM REBEL': '9pm_rebel',
    'AFNAN 9 PM NIGHT OUT': '9_pm_night_out',
    'RASASI HAWAS TROPICAL': 'hawas_tropical',
    'RASASI HAWAS ICE': 'hawas_ice',
    'RASASI HAWAS MALIBU': 'hawas_malibu',
    'RASASI HAWAS KOBRA': 'hawas_kobra',
    'RASASI HAWAS VERDE': 'hawas_verde',
    'RASASI HAWAS FIRE': 'hawas_fire',
    'AZZARO THE MOST WANTED INTENSE': 'azzaro_tmw_edp_intense',
    'AZZARO THE MOST WANTED PARFUM': 'azzaro_tmw_parfum',
    'XERJOFF ERBA PURA': 'xerjoff_erba_pura',
    'JEAN PAUL GAULTIER LE MALE ELIXIR': 'jpg_le_male_elixir',
    'JEAN PAUL GAULTIER LE MALE LE PARFUM': 'jpg_le_male_le_parfum',
    'JEAN PAUL GAULTIER JPG LE BEAU': 'jpg_le_beau_edt',
    'JEAN PAUL GAULTIER DIVINE ELIXIR': 'jpg_divine_elixir',
    'PACO RABANNE INVICTUS': 'paco_rabanne_invictus',
    'VALENTINO VALENTINO BORN IN ROMA': 'valentino_born_in_roma',
    'VALENTINO UOMO BORN IN ROMA': 'valentino_born_in_roma',
    'DIOR FAHRENHEIT': 'dior_fahrenheit',
    'LATTAFA ASAD BOURBON': 'asad_lattafa',
    'LATTAFA ASAD': 'asad_lattafa',
    'LATTAFA ASAD ZANZIBAR': 'asad_zanzibar',
    'AFNAN ELECTRIC TURATHI': 'turathi_electric',
    'ARMAF ODYSSEY CANDEE': 'odyssey_candee',
    'ARMAF ODYSSEY BAHAMAS': 'odyssey_bahamas',
    'ARMAF ODYSSEY GO MANGO': 'odyssey_go_mango',
    'ARMAF ODYSSEY MANDARIN SKY': 'mandarine_sky',
    'ARMAF ODYSSEY SPECTRA': 'odyssey_spectra',
    'ARMAF ODYSSEY WHITE': 'odyssey_homme_white',
    'MUGLER ANGEL STELLAR': 'angel_stellar_mugler',
    'MUGLER ANGEL FANTASM': 'angel_fantasm_mugler',
    'NIKE 150 ON FIRE': 'nike_150',
    'NIKE ULTRA BLUE': 'nike_blue',
    'NIKE TRENDY PINK': 'nike_trendy_pink',
    'NIKE YUMMY MUSK': 'nike_yummmy_musk',
    'NIKE GINGER TONIC': 'nike_ginger_tonic',
    'BILLIE EILISH EILISH': 'billie_eilish_dorado',
    'SABRINA CARPENTER CHERRY BABY': 'sweeth_tooth_cherry_baby',
    'GAME OF SPADES HIGH ROLLER': 'game_of_spades_high_roller',
    'GAME OF SPADES NO LIMIT': 'game_of_spades_no_limit',
    'GAME OF SPADES DIAMOND': 'game_of_spades_diamond',
    'GAME OF SPADES EMERALD': 'game_of_spades_emerald',
    'GAME OF SPADES BONUS': 'game_of_spades_bonus',
    'GAME OF SPADES WILDCARD': 'game_of_spades_wildcard',
    'GAME OF SPADES OPAL': 'game_of_spades_opal',
    'GAME OF SPADES FULL HOUSE': 'game_of_spades_full_house',
    'POLO POLO BLUE': 'polo_blue',
    'CAROLINA HERRERA LA BOMBA': 'la_bomba_ch',
    'VERSACE EROS NAJIM': 'eros_najim',
    'ROME ROME EXTRADOSE': 'rome_extradose',
    'ANTONIO BANDERAS BLUE SEDUCTION': 'ab_blue',
    'ANTONIO BANDERAS GOLDEN SECRET': 'ab_golden_secret',
    'ANTONIO BANDERAS ICON': 'ab_icon_men_edt'
}

def extraer_ml(desc):
    m = re.search(r'\b(\d+)\s*ML\b', desc, re.IGNORECASE)
    return int(m.group(1)) if m else 100

def limpiar_nombre(marca, desc):
    d = desc
    d = re.sub(re.escape(marca), '', d, flags=re.IGNORECASE).strip()
    d = re.sub(r'\b\d+\s*ML\b', '', d, flags=re.IGNORECASE)
    d = re.sub(r'\b(TESTER|CONTINGENCIA|ISP|REFILL|ORIGINAL|REF\s*\d+|MAN|WOMAN|WOMEN|MEN|HOMME|MUJER|HOMBRE|UNISEX|W|H)\b', '', d, flags=re.IGNORECASE)
    d = re.sub(r'SET\s+\d+.*', '', d, flags=re.IGNORECASE)
    d = re.sub(r'\+.*', '', d)
    d = re.sub(r'\b(EXTRAIT DE PARFUM|EAU DE PARFUM|EAU DE TOILETTE|EDP|EDT|EP|PARFUM INTENSE|PARFUM|COLOGNE)\b', '', d, flags=re.IGNORECASE)
    d = ' '.join(d.split()).strip()
    return d.title() if d else desc.title()

KNOWN_BRANDS = {
    'ADIDAS': 'Adidas', 'AFNAN': 'Afnan', 'AJMAL': 'Ajmal', 'AL HARAMAIN': 'Al Haramain',
    'AL WATANIAH': 'Al Wataniah', 'AMARAN': 'Amaran', 'ANFAR': 'Anfar',
    'ANTONIO BANDERAS': 'Antonio Banderas', 'ARABIYAT PRESTIGE': 'Arabiyat Prestige',
    'ARD AL ZAAFARAN': 'Ard Al Zaafaran', 'ARIANA GRANDE': 'Ariana Grande',
    'ARMAF': 'Armaf', 'AZZARO': 'Azzaro', 'BENETTON': 'Benetton', 'BHARARA': 'Bharara',
    'BILLIE EILISH': 'Billie Eilish', 'BURBERRY': 'Burberry', 'BVLGARI': 'Bvlgari',
    'CACHAREL': 'Cacharel', 'CALVIN KLEIN': 'Calvin Klein', 'CAMARA': 'Camara',
    'CAROLINA HERRERA': 'Carolina Herrera', 'DAVIDOFF': 'Davidoff', 'DIOR': 'Dior',
    'DOLCE GABBANA': 'Dolce & Gabbana', 'DUMONT': 'Dumont', 'EMPORIO ARMANI': 'Emporio Armani',
    'FRENCH AVENUE': 'French Avenue', 'GAME OF SPADES': 'Game of Spades',
    'GIORGIO ARMANI': 'Giorgio Armani', 'GIVENCHY': 'Givenchy', 'GUCCI': 'Gucci',
    'GUESS': 'Guess', 'HERMES': 'Hermes', 'HUGO BOSS': 'Hugo Boss',
    'JENNIFER LOPEZ': 'Jennifer Lopez', 'JESUS DEL POZO': 'Jesus del Pozo',
    'KAJAL': 'Kajal', 'KHADLAJ': 'Khadlaj', 'LACOSTE': 'Lacoste', 'LANCOME': 'Lancome',
    'LATTAFA': 'Lattafa', 'LATTAFA PRIDE': 'Lattafa Pride', 'LATTAFA VURV': 'Lattafa Vurv',
    'MAISON ALHAMBRA': 'Maison Alhambra', 'MANCERA': 'Mancera', 'MARC JACOBS': 'Marc Jacobs',
    'MERCEDES BENZ': 'Mercedes Benz', 'MESSI': 'Messi', 'MONT BLANC': 'Montblanc',
    'MONTALE': 'Montale', 'MOSCHINO': 'Moschino', 'MUGLER': 'Mugler', 'NIKE': 'Nike',
    'NINA RICCI': 'Nina Ricci', 'ORIENTICA': 'Orientica', 'PACO RABANNE': 'Paco Rabanne',
    'PARFUMS DE MARLY': 'Parfums de Marly', 'PEPE JEANS': 'Pepe Jeans',
    'POLO': 'Ralph Lauren Polo', 'PRADA': 'Prada', 'RASASI': 'Rasasi', 'RAYHAAN': 'Rayhaan',
    'ROME': 'Rome', 'SABRINA CARPENTER': 'Sabrina Carpenter', 'SHAKIRA': 'Shakira',
    'TUBBEES': 'Tubbees', 'VALENTINO': 'Valentino', 'VERSACE': 'Versace',
    'VICTORIA SECRET': "Victoria's Secret", 'VIKTOR ROLF': 'Viktor & Rolf', 'XERJOFF': 'Xerjoff'
}

def clean_brand(b, desc):
    b_up = b.upper()
    for k, v in KNOWN_BRANDS.items():
        if k in b_up:
            return v
    desc_up = desc.upper()
    for k, v in KNOWN_BRANDS.items():
        if k in desc_up:
            return v
    return b.title()

def clasificar_tipo(marca):
    m = marca.upper()
    arabes = ['AFNAN', 'AJMAL', 'AL HARAMAIN', 'AL WATANIAH', 'AMARAN', 'ANFAR', 'ARABIYAT', 'ARD AL ZAAFARAN', 'ARMAF', 'BHARARA', 'DUMONT', 'FRENCH AVENUE', 'KHADLAJ', 'LATTAFA', 'MAISON ALHAMBRA', 'ORIENTICA', 'RASASI', 'RAYHAAN']
    nichos = ['KAJAL', 'MANCERA', 'MONTALE', 'PARFUMS DE MARLY', 'XERJOFF']
    for a in arabes:
        if a in m:
            return 'Árabe'
    for n in nichos:
        if n in m:
            return 'Nicho'
    return 'Diseñador'

consolidados_pdf = {}

for it in inventario_pdf:
    marca = clean_brand(it['marca'], it['descripcion'])
    clean_name = limpiar_nombre(marca, it['descripcion'])
    ml = extraer_ml(it['descripcion'])
    precio = int(it['precio_botella'])
    
    desc_full = f"{marca} {it['descripcion']}".upper()
    preferred_id = None
    for prefix, hist_id in IDS_HISTORICOS.items():
        if prefix in desc_full:
            preferred_id = hist_id
            break
            
    if not preferred_id:
        preferred_id = re.sub(r'[^a-zA-Z0-9]+', '_', f"{marca}_{clean_name}").strip('_').lower()
        preferred_id = re.sub(r'_+', '_', preferred_id)

    # Si es XS Black de Paco Rabanne y el precio es 0 (porque era tester), usar el precio de venta real de 790
    if 'xs_black' in preferred_id and precio == 0:
        precio = 790

    if preferred_id not in consolidados_pdf:
        consolidados_pdf[preferred_id] = {
            'id': preferred_id,
            'marca': marca,
            'nombre': f"{marca.upper()} {clean_name.upper()}",
            'nombre_corto': clean_name,
            'tipo': clasificar_tipo(marca),
            'genero': it['genero_inventario'],
            'ml': ml,
            'precioBs': precio,
            'stock': it['stock'],
            'descripcion_pdf': it['descripcion']
        }
    else:
        # Si ya existe, quedarse con el precio mayor a cero
        if precio > 0:
            if consolidados_pdf[preferred_id]['precioBs'] == 0 or precio < consolidados_pdf[preferred_id]['precioBs']:
                consolidados_pdf[preferred_id]['precioBs'] = precio
                consolidados_pdf[preferred_id]['ml'] = ml
        consolidados_pdf[preferred_id]['stock'] += it['stock']

catalogo_final = []

for cid, item in consolidados_pdf.items():
    existente = mapa_existente_por_id.get(cid)
    if not existente:
        k_nom = normalizar_key(item['nombre'])
        existente = mapa_existente_por_nombre.get(k_nom)

    img_url = f"https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/{cid}.webp?v=2"
    if cid in progreso_r2 and progreso_r2[cid].get('status') == 'ok':
        img_url = f"{progreso_r2[cid]['r2_url']}?v=2"
    elif existente and existente.get('imagenes') and len(existente['imagenes']) > 0:
        base_img = existente['imagenes'][0]
        img_url = f"{base_img}?v=2" if '?v=' not in base_img else base_img

    if existente:
        notas = existente.get('notas', {
            'salida': ['Bergamota', 'Lavanda fresca'],
            'corazon': ['Geranio', 'Pimienta'],
            'fondo': ['Cedro', 'Ambar']
        })
        acordes = existente.get('acordes', [
            {'nombre': 'aromático', 'porcentaje': 100, 'color': '#5F9EA0'},
            {'nombre': 'amaderado', 'porcentaje': 80, 'color': '#8D5524'}
        ])
        clima = existente.get('clima', {
            'invierno': 60, 'primavera': 80, 'verano': 70, 'otono': 75, 'dia': 80, 'noche': 65
        })
        descripcion = existente.get('descripcion', f"Fragancia distintiva de {item['marca']}, elaborada con ingredientes seleccionados para una estela refinada y duradera.")
        etiquetas = existente.get('etiquetas', [item['tipo'], item['genero'], 'Exclusivo'])
        nuevo = existente.get('nuevo', False)
        destacado = existente.get('destacado', False)
        activo = existente.get('activo', True)
    else:
        notas = {
            'salida': ['Bergamota', 'Lavanda fresca'],
            'corazon': ['Geranio', 'Pimienta'],
            'fondo': ['Cedro', 'Ambar']
        }
        acordes = [
            {'nombre': 'aromático', 'porcentaje': 100, 'color': '#5F9EA0'},
            {'nombre': 'amaderado', 'porcentaje': 80, 'color': '#8D5524'},
            {'nombre': 'cítrico', 'porcentaje': 70, 'color': '#B8B939'}
        ]
        clima = {
            'invierno': 55, 'primavera': 85, 'verano': 70, 'otono': 75, 'dia': 80, 'noche': 65
        }
        descripcion = f"Fragancia original de {item['marca']}. Elegancia y presencia magnética con notas seleccionadas de alta calidad."
        etiquetas = [item['tipo'], item['genero'], 'Frasco Sellado']
        nuevo = False
        destacado = False
        activo = True

    # REGLA DE ORO DEL USUARIO: CERO DECANTS INVENTADOS. TODOS SON PERFUMES COMPLETOS.
    volumenes = []

    producto_limpio = {
        'id': cid,
        'nombre': item['nombre'],
        'marca': item['marca'],
        'tipo': item['tipo'],
        'genero': item['genero'],
        'imagenes': [img_url],
        'volumenes': volumenes,
        'completo': {
            'ml': item['ml'],
            'precioBs': item['precioBs']
        },
        'activo': activo,
        'nuevo': nuevo,
        'destacado': destacado,
        'descripcion': descripcion,
        'etiquetas': etiquetas,
        'notas': notas,
        'acordes': acordes,
        'clima': clima,
        'stock_inventario': item['stock']
    }

    catalogo_final.append(producto_limpio)

print(f"Total catálogo limpio definitivo: {len(catalogo_final)}")

# Guardar directamente en src/assets/perfumes.json
with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(catalogo_final, f, ensure_ascii=False, indent=2)

print("¡src/assets/perfumes.json actualizado con éxito!")
