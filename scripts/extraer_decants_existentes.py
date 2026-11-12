import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Leer los decants originales de los 77 perfumes que estaban en Firestore/scripts
with open('scripts/catalogo_preparado.json', 'r', encoding='utf-8') as f:
    catalogo_preparado = json.load(f)

# También podemos leer directamente de Firestore con un script en node para obtener la lista exacta de decants de los 77
print("Listo para extraer los decants existentes.")
