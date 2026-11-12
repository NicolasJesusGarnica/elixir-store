import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

print(f"Items actuales en perfumes.json: {len(catalogo)}")
print(f"Filas en inventario_extraido.json (PDF): {len(inventario)}")

# Construir mapa de búsqueda para el inventario del PDF
# Cada item del PDF tiene: marca, descripcion, stock, costo, precio_botella, genero_inventario, pagina
# Buscaremos coincidencias exactas y semánticas para los 78 iniciales
# Y limpiaremos TODOS los decants inventados.

def limpiar_texto(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

# Indexar inventario por marca y tokens
pdf_por_marca = {}
for it in inventario:
    m = it['marca'].upper().strip()
    if m not in pdf_por_marca:
        pdf_por_marca[m] = []
    pdf_por_marca[m].append(it)

print(f"Marcas en el PDF: {len(pdf_por_marca)}")
