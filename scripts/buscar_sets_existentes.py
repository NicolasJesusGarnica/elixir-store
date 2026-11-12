import json

with open("src/assets/perfumes.json", "r", encoding="utf-8") as f:
    catalogo = json.load(f)

queries = [
    "halloween", "supremacy silver", "9pm rebel", "supremacy not only", "mousuf",
    "full house", "wildcard", "euphoria", "ck one", "burberry her", "burberry goddess",
    "boss bottled", "asad", "khamrah", "the kingdom", "nebras", "amber rouge",
    "invictus", "eros flame", "bare vanilla", "mini ps mist", "barbie", "batman",
    "bob esponja", "eau my bb", "eau my unicorn", "frozen", "capitan america",
    "minecraft", "spiderman"
]

for q in queries:
    matches = [p for p in catalogo if q in p['nombre'].lower() or q in p['id'].lower()]
    sets = [p for p in matches if any(w in p['nombre'].lower() for w in ['set', 'estuche', 'sg', 'bl', 'deo', 'mochila', 'lonchera', 'shampoo'])]
    print(f"Query '{q}': {len(matches)} matches, {len(sets)} sets:")
    for s in sets:
        print(f"   * [{s['id']}] {s['nombre']} - Bs {s.get('completo', {}).get('precioBs')}")
