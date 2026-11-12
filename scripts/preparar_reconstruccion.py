import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    items_pdf = json.load(f)

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo_actual = json.load(f)

with open('scripts/progreso_r2.json', 'r', encoding='utf-8') as f:
    progreso_r2 = json.load(f)

print(f"Total filas en PDF: {len(items_pdf)}")
print(f"Total catalogo actual: {len(catalogo_actual)}")
print(f"Total subidos a R2: {len(progreso_r2)}")

# Marcas normalizadas
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

def clean_perfume_name(marca, desc):
    d = desc
    d = re.sub(re.escape(marca), '', d, flags=re.IGNORECASE).strip()
    ml_match = re.search(r'\b(\d+)\s*ML\b', d, re.IGNORECASE)
    ml = int(ml_match.group(1)) if ml_match else 100
    
    d_clean = re.sub(r'\b\d+\s*ML\b', '', d, flags=re.IGNORECASE)
    d_clean = re.sub(r'\b(TESTER|CONTINGENCIA|ISP|REFILL|ORIGINAL|REF\s*\d+|MAN|WOMAN|WOMEN|MEN|HOMME|MUJER|HOMBRE|UNISEX|W|H)\b', '', d_clean, flags=re.IGNORECASE)
    d_clean = re.sub(r'SET\s+\d+.*', '', d_clean, flags=re.IGNORECASE)
    d_clean = re.sub(r'\+.*', '', d_clean)
    d_clean = re.sub(r'\b(EXTRAIT DE PARFUM|EAU DE PARFUM|EAU DE TOILETTE|EDP|EDT|EP|PARFUM INTENSE|PARFUM|COLOGNE)\b', '', d_clean, flags=re.IGNORECASE)
    d_clean = ' '.join(d_clean.split()).strip()
    
    if not d_clean:
        d_clean = desc
        
    return d_clean.title(), ml

# Mapeo de IDs existentes prioritarios para no romper URLs ni banners
IDS_PRIORITARIOS = {
    ('lattafa', 'teriaq intense'): 'teriaq_intense_lattafa',
    ('bharara', 'bharara king'): 'bharara_king',
    ('lattafa', 'asad'): 'asad_lattafa',
    ('lattafa', 'asad zanzibar'): 'asad_zanzibar',
    ('afnan', '9 am dive'): '9_am_dive',
    ('afnan', '9 pm'): '9_pm_black',
    ('afnan', '9 pm elixir'): '9_pm_elixir',
    ('afnan', '9 pm rebel'): '9pm_rebel',
    ('afnan', '9 pm night out'): '9_pm_night_out',
    ('rasasi', 'hawas ice'): 'hawas_ice',
    ('rasasi', 'hawas tropical'): 'hawas_tropical',
    ('rasasi', 'hawas malibu'): 'hawas_malibu',
    ('rasasi', 'hawas kobra'): 'hawas_kobra',
    ('rasasi', 'hawas verde'): 'hawas_verde',
    ('rasasi', 'hawas fire'): 'hawas_fire',
    ('azzaro', 'the most wanted intense'): 'azzaro_tmw_edp_intense',
    ('azzaro', 'the most wanted'): 'azzaro_tmw_parfum',
    ('xerjoff', 'erba pura'): 'xerjoff_erba_pura',
    ('jean paul gaultier', 'le male elixir'): 'jpg_le_male_elixir',
    ('jean paul gaultier', 'le male le parfum'): 'jpg_le_male_le_parfum',
    ('jean paul gaultier', 'le beau'): 'jpg_le_beau_edt',
    ('jean paul gaultier', 'divine elixir'): 'jpg_divine_elixir',
    ('paco rabanne', 'invictus'): 'paco_rabanne_invictus',
    ('valentino', 'born in roma'): 'valentino_born_in_roma',
    ('dior', 'fahrenheit'): 'dior_fahrenheit',
    ('armaf', 'odyssey candee'): 'odyssey_candee',
    ('armaf', 'odyssey bahamas'): 'odyssey_bahamas',
    ('armaf', 'odyssey go mango'): 'odyssey_go_mango',
    ('armaf', 'odyssey mandarin sky'): 'mandarine_sky',
    ('armaf', 'odyssey spectra'): 'odyssey_spectra',
    ('armaf', 'odyssey white'): 'odyssey_homme_white',
    ('mugler', 'angel stellar'): 'angel_stellar_mugler',
    ('mugler', 'angel fantasm'): 'angel_fantasm_mugler',
    ('nike', 'ultra blue'): 'nike_blue',
    ('nike', '150 on fire'): 'nike_150',
    ('nike', 'trendy pink'): 'nike_trendy_pink',
    ('nike', 'yummy musk'): 'nike_yummmy_musk',
    ('nike', 'ginger tonic'): 'nike_ginger_tonic',
    ('billie eilish', 'eilish'): 'billie_eilish_dorado',
    ('sabrina carpenter', 'cherry baby'): 'sweeth_tooth_cherry_baby',
    ('versace', 'eros najim'): 'eros_najim',
    ('rome', 'rome extradose'): 'rome_extradose',
    ('carolina herrera', 'la bomba'): 'la_bomba_ch',
    ('antonio banderas', 'blue seduction'): 'ab_blue',
    ('antonio banderas', 'golden secret'): 'ab_golden_secret',
    ('antonio banderas', 'icon'): 'ab_icon_men_edt'
}

print("Configuración lista.")
