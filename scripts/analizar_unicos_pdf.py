import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

print(f"Total filas en PDF: {len(inventario)}")

# Agrupar por perfume unico en el PDF
perfumes_pdf = {}
for item in inventario:
    marca = item['marca'].strip().upper()
    desc = item['descripcion'].strip().upper()
    
    # Extraer ml
    m = re.search(r'(\d+)\s*ML', desc)
    ml = int(m.group(1)) if m else 100
    
    key = f"{marca} {desc}"
    if key not in perfumes_pdf:
        perfumes_pdf[key] = {
            'marca': item['marca'].strip(),
            'descripcion': item['descripcion'].strip(),
            'genero': item['genero_inventario'],
            'stock': item['stock'],
            'precio_botella': item['precio_botella'],
            'costo': item['costo'],
            'ml': ml,
            'pagina': item['pagina']
        }
    else:
        # Sumar stock si hay duplicado en PDF
        perfumes_pdf[key]['stock'] += item['stock']

print(f"Perfumes únicos extraídos del PDF: {len(perfumes_pdf)}")
