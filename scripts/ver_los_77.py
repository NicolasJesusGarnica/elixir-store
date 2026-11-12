import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

con_decants = [p for p in catalogo if len(p.get('volumenes', [])) > 0]

# Imprimir los 77
for i, p in enumerate(con_decants):
    print(f"{i+1:2d}. {p['id']:30s} | {p['marca']:20s} | {p['nombre']}")
