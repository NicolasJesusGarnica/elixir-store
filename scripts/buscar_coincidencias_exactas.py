import json

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

items_to_find = [
    ("9PM (NEGRO) TESTER", ["9pm", "negro"]),
    ("HISTORIC OLMEDA", ["historic", "olmeda"]),
    ("SUPREMACY NOT ONLY INTENSE SET", ["supremacy", "not", "only", "intense", "set"]),
    ("III AJMAL", ["ajmal", "iii"]),
    ("PISTACHIO KUNAFA ANFAR", ["pistachio", "kunafa"]),
    ("MANAAL", ["manaal"]),
    ("MOUSUF RAMADI", ["mousuf", "ramadi"]),
    ("PISTACHIO MUSK", ["pistachio", "musk"]),
    ("ARI BODY MIST", ["ari", "body", "mist"]),
    ("ARI EDP 100 ML", ["ari", "100"]),
    ("GOD IS A WOMAN BODY MIST", ["god", "woman", "mist"]),
    ("MOD BLUSH TESTER", ["mod", "blush"]),
    ("MOD VANILLA COLONIA", ["mod", "vanilla", "colonia"]),
    ("MOD VANILLA EDP 100 ML", ["mod", "vanilla"]),
    ("SWEET LIKE CANDY EDP", ["sweet", "like", "candy"]),
    ("THANK U NEXT 100ML EDP", ["thank", "next"]),
    ("THANK U NEXT ESTUCHE", ["thank", "next", "estuche"]),
    ("CLUB DE NUIT INTENSE PARFUM LIMITED", ["club", "nuit", "limited"]),
    ("CLUB DE NUIT URBAN ELIXIR", ["urban", "elixir"]),
    ("ODYSSEY MANDARIN SKY 200ML", ["mandarin", "sky"]),
    ("ODYSSEY SPECTRA EP 100 H", ["odyssey", "spectra"]),
    ("ODYSSEY SPECTRA RAINBOW 200ML", ["rainbow"]),
    ("BATMAN SET", ["batman", "set"]),
    ("EAU MY UNICORN BODY SPRAY", ["unicorn", "spray"]),
    ("EAU MY UNICORN TESTER 100ML", ["unicorn", "tester"]),
    ("EAU MY UNICORN TESTER 30ML", ["unicorn", "30"]),
    ("CAPITAN AMERICA SET", ["capitan", "america", "set"]),
    ("MINECRAFT BODY SPRAY TESTER", ["minecraft", "spray"]),
    ("MINECRAFT SET LONCHERA", ["minecraft", "set"]),
    ("MINNIE BODY SPRAY TESTER", ["minnie"]),
    ("SPIDERMAN BODY SPRAY TESTER", ["spiderman", "spray"]),
    ("SPIDERMAN EDT 100ML", ["spiderman", "100"]),
    ("SPIDERMAN SET NECESER", ["spiderman", "neceser"]),
    ("SPIDERMAN PREMIUM 100ML", ["spiderman", "premium"]),
    ("STRANGER THINGS TESTER", ["stranger", "things"]),
    ("CK ONE SET", ["ck", "one", "set"]),
    ("212 HEROES MEN 150 ML", ["212", "heroes"]),
    ("212 SEXY CAROLINA HERRERA 100ML", ["212", "sexy"]),
    ("PURE POISON EDP", ["pure", "poison"]),
    ("LIGHT BLUE POUR HOMME 125ML", ["light", "blue"]),
    ("STRONGER WITH YOU INTENSELY", ["stronger", "intensely"]),
    ("LIQUID BRUN", ["liquid", "brun"]),
    ("ALL IN PARFUM", ["all", "in"]),
    ("DOUBLE BONUS", ["double", "bonus"]),
    ("GENTLEMAN SOCIETY", ["gentleman", "society"]),
    ("PI EDT 100 ML", ["givenchy", "pi"]),
    ("FLORA GORGEOUS MAGNOLIA", ["gorgeous", "magnolia"]),
    ("BOSS BOTTLED BEYOND TESTER", ["bottled", "beyond"]),
    ("LE MALE ELIXIR 200 ML", ["male", "elixir"]),
    ("HALLOWEEN TRADICIONAL 200ML BASE", ["halloween", "tradicional"]),
    ("KAJAL HOMME EDP 100 ML", ["kajal", "homme"]),
    ("RUBY EXTRAIT 100 ML", ["ruby"]),
    ("BADEE AL OUD HONOR AND GLORY", ["honor", "glory"]),
    ("KHAMRAH SET", ["khamrah", "set"]),
    ("MAYAR EDP 100 ML", ["mayar"]),
    ("YARA SET 25ML", ["yara", "25ml"]),
    ("NEBRAS SET", ["nebras", "set"]),
    ("VICTORIEUX FEMME", ["victorieux"]),
    ("LEONIE INTENSE", ["leonie"]),
    ("CEDRAT BOISE INTENSE", ["cedrat", "boise", "intense"]),
    ("COCO VANILLE", ["coco", "vanille"]),
    ("ARABIANS TONKA", ["arabians", "tonka"]),
    ("CHERRY CELEBRATION", ["cherry", "celebration"]),
    ("1 MILLION EDT 200 ML", ["million"]),
    ("INVICTUS 20ML SET", ["invictus", "20ml"]),
    ("SET MINI 4 PCZ P. RABANNE", ["mini", "4", "rabanne"]),
    ("LONDON CALLING FOR HER", ["london", "calling"]),
    ("PARADOXE INTENSE PRADA 50ML", ["paradoxe", "intense"]),
    ("LYCHEE LUSH TUBBEES", ["lychee", "lush"]),
    ("VERSACE POUR HOMME 100 ML", ["versace", "pour", "homme"]),
    ("BARE EDP 100 ML", ["bare"]),
    ("BARE VANILLA MIST + LIP GLOW SET", ["bare", "vanilla", "set"]),
    ("MINI LS + PS + BV + VP MIST SET", ["mini", "ls"]),
    ("SPICEBOMB DARK LEATHER", ["dark", "leather"]),
    ("SPICEBOMB INFRARED", ["infrared"]),
    ("NAXOS EDP 100 ML", ["naxos"])
]

for label, words in items_to_find:
    matches = []
    for p in catalogo:
        name_lower = p['nombre'].lower()
        id_lower = p['id'].lower()
        if all(w in name_lower or w in id_lower for w in words):
            matches.append((p['id'], p['nombre'], p.get('completo', {}).get('precioBs', 0), p['activo'], p.get('stock_inventario')))
    print(f"\n{label}:")
    for m in matches:
        print(f"  -> id: {m[0]} | name: {m[1]} | precio: {m[2]} Bs | activo: {m[3]} | stock: {m[4]}")
