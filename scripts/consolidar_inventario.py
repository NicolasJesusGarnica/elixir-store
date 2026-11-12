import json
import re

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Marcas conocidas para estandarización perfecta
KNOWN_BRANDS = {
    'ADIDAS': 'Adidas',
    'AFNAN': 'Afnan',
    'AJMAL': 'Ajmal',
    'AL HARAMAIN': 'Al Haramain',
    'AL WATANIAH': 'Al Wataniah',
    'AMARAN': 'Amaran',
    'ANFAR': 'Anfar',
    'ANTONIO BANDERAS': 'Antonio Banderas',
    'ARABIYAT PRESTIGE': 'Arabiyat Prestige',
    'ARD AL ZAAFARAN': 'Ard Al Zaafaran',
    'ARIANA GRANDE': 'Ariana Grande',
    'ARMAF': 'Armaf',
    'AZZARO': 'Azzaro',
    'BENETTON': 'Benetton',
    'BHARARA': 'Bharara',
    'BILLIE EILISH': 'Billie Eilish',
    'BURBERRY': 'Burberry',
    'BVLGARI': 'Bvlgari',
    'CACHAREL': 'Cacharel',
    'CALVIN KLEIN': 'Calvin Klein',
    'CAMARA': 'Camara',
    'CAROLINA HERRERA': 'Carolina Herrera',
    'DAVIDOFF': 'Davidoff',
    'DIOR': 'Dior',
    'DOLCE GABBANA': 'Dolce & Gabbana',
    'DUMONT': 'Dumont',
    'EMPORIO ARMANI': 'Emporio Armani',
    'FRENCH AVENUE': 'French Avenue',
    'GAME OF SPADES': 'Game of Spades',
    'GIORGIO ARMANI': 'Giorgio Armani',
    'GIVENCHY': 'Givenchy',
    'GUCCI': 'Gucci',
    'GUESS': 'Guess',
    'HERMES': 'Hermes',
    'HUGO BOSS': 'Hugo Boss',
    'JENNIFER LOPEZ': 'Jennifer Lopez',
    'JESUS DEL POZO': 'Jesus del Pozo',
    'KAJAL': 'Kajal',
    'KHADLAJ': 'Khadlaj',
    'LACOSTE': 'Lacoste',
    'LANCOME': 'Lancome',
    'LATTAFA': 'Lattafa',
    'LATTAFA PRIDE': 'Lattafa Pride',
    'LATTAFA VURV': 'Lattafa Vurv',
    'MAISON ALHAMBRA': 'Maison Alhambra',
    'MANCERA': 'Mancera',
    'MARC JACOBS': 'Marc Jacobs',
    'MERCEDES BENZ': 'Mercedes Benz',
    'MESSI': 'Messi',
    'MONT BLANC': 'Montblanc',
    'MONTALE': 'Montale',
    'MOSCHINO': 'Moschino',
    'MUGLER': 'Mugler',
    'NIKE': 'Nike',
    'NINA RICCI': 'Nina Ricci',
    'ORIENTICA': 'Orientica',
    'PACO RABANNE': 'Paco Rabanne',
    'PARFUMS DE MARLY': 'Parfums de Marly',
    'PEPE JEANS': 'Pepe Jeans',
    'POLO': 'Ralph Lauren Polo',
    'PRADA': 'Prada',
    'RASASI': 'Rasasi',
    'RAYHAAN': 'Rayhaan',
    'ROME': 'Rome',
    'SABRINA CARPENTER': 'Sabrina Carpenter',
    'SHAKIRA': 'Shakira',
    'TUBBEES': 'Tubbees',
    'VALENTINO': 'Valentino',
    'VERSACE': 'Versace',
    'VICTORIA SECRET': "Victoria's Secret",
    'VIKTOR ROLF': 'Viktor & Rolf',
    'XERJOFF': 'Xerjoff'
}

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

def clean_brand(b, desc):
    b_up = b.upper()
    for k, v in KNOWN_BRANDS.items():
        if k in b_up:
            return v
    desc_up = desc.upper()
    for k, v in KNOWN_BRANDS.items():
        if k in desc_up:
            return v
    # Air-Val kids
    if 'AV ' in b_up or 'BARBIE' in desc_up or 'SPIDERMAN' in desc_up or 'FROZEN' in desc_up:
        return 'Air-Val'
    return b.title()

def clean_perfume_name(marca, desc):
    d = desc
    # remove brand from description if present
    d = re.sub(re.escape(marca), '', d, flags=re.IGNORECASE).strip()
    
    # Extract bottle ML if present
    ml_match = re.search(r'\b(\d+)\s*ML\b', d, re.IGNORECASE)
    ml = int(ml_match.group(1)) if ml_match else 100
    
    # Clean noise keywords
    d_clean = re.sub(r'\b\d+\s*ML\b', '', d, flags=re.IGNORECASE)
    d_clean = re.sub(r'\b(TESTER|CONTINGENCIA|ISP|REFILL|ORIGINAL|REF\s*\d+|MAN|WOMAN|WOMEN|MEN|HOMME|MUJER|HOMBRE|UNISEX|W|H)\b', '', d_clean, flags=re.IGNORECASE)
    d_clean = re.sub(r'SET\s+\d+.*', '', d_clean, flags=re.IGNORECASE)
    d_clean = re.sub(r'\+.*', '', d_clean)
    d_clean = re.sub(r'\b(EXTRAIT DE PARFUM|EAU DE PARFUM|EAU DE TOILETTE|EDP|EDT|EP|PARFUM INTENSE|PARFUM|PARFUM INTENSE|COLOGNE)\b', '', d_clean, flags=re.IGNORECASE)
    d_clean = ' '.join(d_clean.split()).strip()
    
    if not d_clean:
        d_clean = desc
        
    return d_clean.title(), ml

consolidated = {}
for it in items:
    marca = clean_brand(it['marca'], it['descripcion'])
    clean_name, ml = clean_perfume_name(marca, it['descripcion'])
    
    # Key normalization
    norm_key = re.sub(r'[^A-Z0-9]+', '_', f"{marca.upper()}_{clean_name.upper()}").strip('_')
    
    if norm_key not in consolidated:
        consolidated[norm_key] = {
            'id': norm_key.lower(),
            'marca': marca,
            'nombre': f"{marca.upper()} {clean_name.upper()}",
            'nombre_corto': clean_name,
            'tipo': clasificar_tipo(marca),
            'genero': it['genero_inventario'],
            'precios_botella': [],
            'stocks': [],
            'mls': [],
            'descripciones_originales': []
        }
        
    consolidated[norm_key]['precios_botella'].append(it['precio_botella'])
    consolidated[norm_key]['stocks'].append(it['stock'])
    consolidated[norm_key]['mls'].append(ml)
    consolidated[norm_key]['descripciones_originales'].append(it['descripcion'])

print(f"Total perfumes canónicos consolidados: {len(consolidated)}")

with open('scripts/perfumes_consolidados.json', 'w', encoding='utf-8') as f:
    json.dump(list(consolidated.values()), f, ensure_ascii=False, indent=2)

print("Guardado en scripts/perfumes_consolidados.json")
