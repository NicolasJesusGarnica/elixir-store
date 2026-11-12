import json
import re

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

pdf_items = [
    # Page 1
    {"marca": "AFNAN", "desc": "9PM (NEGRO) EP 100 TESTER", "precio": 360.0},
    {"marca": "AFNAN", "desc": "HISTORIC OLMEDA AFNAN 100ML UNISEX EDP", "precio": 410.0},
    {"marca": "AFNAN", "desc": "SUPREMACY NOT ONLY INTENSE EDP 100 ML + SG 150 ML + DEO SPRAY 75 ML SET 3 PCS", "precio": 640.0},
    {"marca": "AJMAL", "desc": "III AJMAL AJMAL 100ML UNISEX EDP", "precio": 390.0},
    {"marca": "ANFAR", "desc": "PISTACHIO KUNAFA ANFAR 80ML UNISEX EDP", "precio": 390.0},
    {"marca": "ARD AL ZAAFARAN", "desc": "MANAAL EDP 100 ML", "precio": 280.0},
    {"marca": "ARD AL ZAAFARAN", "desc": "MOUSUF RAMADI EDP 100 ML", "precio": 220.0},
    {"marca": "ARD AL ZAAFARAN", "desc": "PISTACHIO MUSK EDP 100 ML", "precio": 240.0},
    {"marca": "ARIANA GRANDE", "desc": "ARI BODY MIST SPRAY 236 ML", "precio": 145.0},
    {"marca": "ARIANA GRANDE", "desc": "ARI EDP 100 ML", "precio": 650.0},
    {"marca": "ARIANA GRANDE", "desc": "GOD IS A WOMAN BODY MIST SPRAY 236 ML", "precio": 145.0},
    {"marca": "ARIANA GRANDE", "desc": "MOD BLUSH EDP 100 ML TESTER", "precio": 650.0},
    {"marca": "ARIANA GRANDE", "desc": "MOD VANILLA ARIANA GRANDE 236ML MUJER COLONIA", "precio": 145.0},
    {"marca": "ARIANA GRANDE", "desc": "MOD VANILLA EDP 100 ML", "precio": 750.0},
    {"marca": "ARIANA GRANDE", "desc": "SWEET LIKE CANDY EDP 100 ML", "precio": 590.0},
    {"marca": "ARIANA GRANDE", "desc": "THANK U NEXT 100ML MUJER EDP", "precio": 690.0},
    {"marca": "ARIANA GRANDE", "desc": "THANK U NEXT ESTUCHE 100ML MUJER EDP", "precio": 820.0},
    {"marca": "ARMAF", "desc": "CLUB DE NUIT INTENSE PARFUM 105 ML LIMITED EDITION", "precio": 900.0},
    {"marca": "ARMAF", "desc": "CLUB DE NUIT URBAN ELIXIR ARMAF 105ML HOMBRE EDP", "precio": 550.0},
    {"marca": "ARMAF", "desc": "ODYSSEY MANDARIN SKY EDP 200 ML", "precio": 700.0},
    {"marca": "ARMAF", "desc": "ODYSSEY SPECTRA EP 100 H (JPG ULTRA MALE)", "precio": 350.0},
    {"marca": "ARMAF", "desc": "ODYSSEY SPECTRA RAINBOW EDP 200ML", "precio": 530.0},
    {"marca": "AV BATMAN AND JOKER", "desc": "BATMAN EDT 50 ML + GEL Y SHAMPOO 400 ML 2D + FIDGET TOY REF 9412", "precio": 210.0},
    {"marca": "AV EAU MY UNICORN", "desc": "EAU MY UNICORN BODY SPRAY 200 ML", "precio": 70.0},
    {"marca": "AV EAU MY UNICORN", "desc": "EAU MY UNICORN EDT 100 ML TESTER", "precio": 50.0},
    {"marca": "AV EAU MY UNICORN", "desc": "EAU MY UNICORN EDT 30 ML TESTER", "precio": 30.0},
    {"marca": "AV MARVEL", "desc": "CAPITAN AMERICA EDT 100 ML + SG 100 ML + LONCHERA 3D REF 8772", "precio": 260.0},
    {"marca": "AV MINECRAFT", "desc": "MINECRAFT BODY SPRAY 200 ML TESTER REF 9599", "precio": 45.0},
    {"marca": "AV MINECRAFT", "desc": "MINECRAFT EDT 50 ML + SG 100 ML + LONCHERA REF 9458", "precio": 210.0},

    # Page 2
    {"marca": "AV MINNIE MOUSE", "desc": "MINNIE BODY SPRAY 200 ML REF 5363 TESTER", "precio": 45.0},
    {"marca": "AV SPIDERMAN", "desc": "SPIDERMAN BODY SPRAY 200 ML REF 5585 TESTER", "precio": 45.0},
    {"marca": "AV SPIDERMAN", "desc": "SPIDERMAN EDT 100 ML REF 5548", "precio": 130.0},
    {"marca": "AV SPIDERMAN", "desc": "SPIDERMAN EDT 50 ML + SG 100 ML + NECESER REF 9263", "precio": 210.0},
    {"marca": "AV SPIDERMAN", "desc": "SPIDERMAN PREMIUM EDT 100 ML REF 9280", "precio": 145.0},
    {"marca": "AV STRANGER THINGS", "desc": "STRANGER THINGS MAN EDT 50 ML TESTER", "precio": 40.0},
    {"marca": "CALVIN KLEIN", "desc": "CK ONE EDT 100 ML + SG 100 ML SET 2 PCS", "precio": 400.0},
    {"marca": "CAROLINA HERRERA", "desc": "212 HEROES MEN EDT 150 ML", "precio": 1150.0},
    {"marca": "CAROLINA HERRERA", "desc": "212 SEXY CAROLINA HERRERA 100ML MUJER EDP", "precio": 1190.0},
    {"marca": "DIOR", "desc": "PURE POISON EDP 100 ML", "precio": 1650.0},
    {"marca": "DOLCE GABBANA", "desc": "LIGHT BLUE POUR HOMME EDT 125ML", "precio": 700.0},
    {"marca": "EMPORIO ARMANI", "desc": "STRONGER WITH YOU INTENSELY 100ML EDP", "precio": 1550.0},
    {"marca": "FRENCH AVENUE", "desc": "LIQUID BRUN LIMITED EDITION 150ML HOMBRE EDP", "precio": 990.0},
    {"marca": "GAME OF SPADES", "desc": "ALL IN PARFUM 100 ML", "precio": 990.0},
    {"marca": "GAME OF SPADES", "desc": "DOUBLE BONUS PARFUM 100 ML", "precio": 1190.0},
    {"marca": "GIVENCHY", "desc": "GENTLEMAN SOCIETY EDP 100 ML", "precio": 1090.0},
    {"marca": "GIVENCHY", "desc": "PI EDT 100 ML", "precio": 690.0},
    {"marca": "GUCCI", "desc": "FLORA GORGEUS MAGNOLIA 100 ML EDP", "precio": 1520.0},
    {"marca": "HUGO BOSS", "desc": "BOSS BOTTLED BEYOND EDP 100 ML TESTER", "precio": 990.0},
    {"marca": "JEAN PAUL GAULTIER", "desc": "LE MALE ELIXIR 200 ML PARFUM", "precio": 1650.0},
    {"marca": "JESUS DEL POZO", "desc": "HALLOWEEN TRADICIONAL JESUS DEL POZO 200ML MUJER EDT BASE", "precio": 690.0},
    {"marca": "KAJAL", "desc": "KAJAL HOMME EDP 100 ML", "precio": 1570.0},
    {"marca": "KAJAL", "desc": "RUBY EXTRAIT DE PARFUM 100 ML", "precio": 1730.0},
    {"marca": "LATTAFA", "desc": "BADEE AL OUD HONOR AND GLORY EDP 100 ML", "precio": 420.0},
    {"marca": "LATTAFA", "desc": "FAKHAR WOMAN LATTAFA DESODORANTE SPRAY 200 ML", "precio": 45.0},
    {"marca": "KHAMRAH EDP 100 ML + DEO SPRAY 200 ML SET 2 PCS", "desc": "KHAMRAH EDP 100 ML + DEO SPRAY 200 ML SET 2 PCS", "marca": "LATTAFA", "precio": 450.0},
    {"marca": "LATTAFA", "desc": "MAYAR EDP 100 ML", "precio": 350.0},
    {"marca": "LATTAFA", "desc": "MUSAMAM WHITE INTENSE LATTAFA 200ML UNISEX DESODORANTE", "precio": 45.0},

    # Page 3
    {"marca": "LATTAFA", "desc": "YARA CANDY + YARA TOUS + YARA MOI + YARA EDP 25 ML SET 4 PCS", "precio": 450.0},
    {"marca": "LATTAFA PRIDE", "desc": "NEBRAS EDP 100 ML + 20 ML + DEO SPRAY 200 ML SET 3 PCS", "precio": 420.0},
    {"marca": "LATTAFA VURV", "desc": "VICTORIEUX FEMME EDP 100 ML", "precio": 250.0},
    {"marca": "MAISON ALHAMBRA", "desc": "LEONIE INTENSE MAISON ALHAMBRA 100ML MUJER EDP", "precio": 250.0},
    {"marca": "MANCERA", "desc": "CEDRAT BOISE INTENSE MANCERA 120ML UNISEX EDP", "precio": 1650.0},
    {"marca": "MANCERA", "desc": "COCO VANILLE MANCERA 120ML UNISEX EDP", "precio": 1600.0},
    {"marca": "MONTALE", "desc": "ARABIANS TONKA 100ML EDP", "precio": 1790.0},
    {"marca": "NENE BEAUTY", "desc": "CHERRY CELEBRATION", "precio": 360.0},
    {"marca": "PACO RABANNE", "desc": "1 MILLION EDT 200 ML", "precio": 1400.0},
    {"marca": "PACO RABANNE", "desc": "INVICTUS EDT 100ML + 20ML SET", "precio": 1280.0},
    {"marca": "PACO RABANNE", "desc": "SET MINI 4 PCZ P. RABANNE", "precio": 800.0},
    {"marca": "PEPE JEANS", "desc": "LONDON CALLING FOR HER EDP 80 ML", "precio": 270.0},
    {"marca": "PRADA", "desc": "PARADOXE INTENSE PRADA 50ML MUJER EDP", "precio": 1390.0},
    {"marca": "STANLEY", "desc": "TERMO CLASSIC 2,3 LTS H. GREEN", "precio": 949.0},
    {"marca": "STANLEY", "desc": "TERMO COMIDA 0,41LT - 14OZ CLASSIC BLACK 2.0 SPORK", "precio": 499.0},
    {"marca": "TUBBEES", "desc": "LYCHEE LUSH GRANDEUR TUBBEES 50ML UNISEX EDP", "precio": 150.0},
    {"marca": "VERSACE", "desc": "POUR HOMME EDT 100 ML", "precio": 790.0},
    {"marca": "VICTORIA SECRET", "desc": "BARE EDP 100 ML", "precio": 850.0},
    {"marca": "VICTORIA SECRET", "desc": "BARE VANILLA MIST 75 ML + LIP GLOW SET 2 PCS", "precio": 390.0},
    {"marca": "VICTORIA SECRET", "desc": "MINI LS + PS + BV + VP MIST 75 ML SET 4 PCS", "precio": 410.0},
    {"marca": "VIKTOR ROLF", "desc": "SPICEBOMB DARK LEATHER VIKTOR ROLF 90ML HOMBRE EDP", "precio": 1400.0},
    {"marca": "VIKTOR ROLF", "desc": "SPICEBOMB INFRARED VIKTOR ROLF 90ML HOMBRE EDT", "precio": 1190.0},
    {"marca": "XERJOFF", "desc": "NAXOS EDP 100 ML", "precio": 2800.0}
]

excluir_keywords = ['TERMO CLASSIC', 'TERMO COMIDA', 'DESODORANTE SPRAY 200 ML', '200ML UNISEX DESODORANTE']

matches = []
unmatched = []

for item in pdf_items:
    desc = item['desc']
    if any(k in desc for k in excluir_keywords):
        continue
        
    marca = item['marca']
    precio = item['precio']
    
    words = [w.lower() for w in re.findall(r'[A-Za-z0-9]+', desc) if len(w) > 2 and w.lower() not in ['unidad', 'bienes', 'general', 'hombre', 'mujer', 'unisex', 'edp', 'edt', '100ml', 'parfum']]
    
    best_p = None
    best_score = 0
    for p in catalogo:
        score = 0
        p_name = p['nombre'].lower()
        p_id = p['id'].lower()
        
        for w in words:
            if w in p_name or w in p_id:
                score += 1
                
        p_price = p.get('completo', {}).get('precioBs', 0)
        if abs(p_price - precio) < 5:
            score += 3
            
        if any(m.lower() in p['marca'].lower() for m in marca.split()):
            score += 2
            
        if score > best_score:
            best_score = score
            best_p = p
            
    if best_p and best_score >= 4:
        matches.append((item, best_p, best_score))
    else:
        unmatched.append((item, best_p, best_score))

print(f"Total coincidencias identificadas: {len(matches)}")
print(f"Total no coincidentes / revisar: {len(unmatched)}")

print("\n--- MATCHES ENCONTRADOS ---")
for it, p, sc in matches:
    p_price = p.get('completo', {}).get('precioBs', 0)
    print(f"PDF: {it['desc'][:40]:<40} ({it['precio']} Bs) -> CAT: {p['id']} ({p_price} Bs, activo={p['activo']}, stock={p.get('stock_inventario')})")

if unmatched:
    print("\n--- UNMATCHED ---")
    for it, p, sc in unmatched:
        print(f"PDF: {it['desc']} ({it['precio']} Bs) -> Best candidate: {p['id'] if p else 'NONE'} (score {sc})")
