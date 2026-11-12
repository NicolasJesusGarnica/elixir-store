import json

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

specific_checks = [
    ('ariana', 'ari'),
    ('ariana', 'sweet'),
    ('ariana', 'thank'),
    ('armaf', 'odyssey'),
    ('armaf', 'rainbow'),
    ('unicorn', ''),
    ('minecraft', ''),
    ('minnie', ''),
    ('spiderman', ''),
    ('carolina', 'sexy'),
    ('gaultier', 'male'),
    ('paco', 'million'),
    ('invictus', ''),
    ('versace', 'pour'),
    ('victoria', 'mini'),
    ('victoria', 'bare')
]

for kw1, kw2 in specific_checks:
    print(f"\n=== SEARCH: '{kw1}' + '{kw2}' ===")
    for p in catalogo:
        text = (p['id'] + ' ' + p['nombre'] + ' ' + p['marca']).lower()
        if kw1 in text and (not kw2 or kw2 in text):
            precio = p.get('completo', {}).get('precioBs', 0)
            stock = p.get('stock_inventario')
            activo = p.get('activo')
            print(f"  {p['id']:<45} | Bs {precio:>4} | stock: {stock} | activo: {activo} | {p['nombre']}")
