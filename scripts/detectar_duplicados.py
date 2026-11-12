import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    cat = json.load(f)

old_78 = cat[:78]
new_items = cat[78:]

print(f"Old 78 items: {len(old_78)}")
print(f"New items: {len(new_items)}")

def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

duplicados = []
for old in old_78:
    old_id = norm(old['id'])
    old_name = norm(old['nombre'])
    
    for new in new_items:
        new_id = norm(new['id'])
        new_name = norm(new['nombre'])
        
        # Coincidencia si los nombres o IDs son iguales o están contenidos el uno en el otro
        if old_id == new_id or old_name == new_name or (old_name in new_name and len(old_name) > 8) or (new_name in old_name and len(new_name) > 8):
            duplicados.append((old, new))
            break

print(f"Total duplicados detectados entre los viejos 78 y los nuevos del PDF: {len(duplicados)}")
print("\n--- EJEMPLOS DE DUPLICADOS ---")
for old, new in duplicados[:25]:
    print(f"VIEJO (con decants): [{old['id']}] {old['nombre']} (decants: {len(old.get('volumenes', []))})")
    print(f"NUEVO (del PDF):     [{new['id']}] {new['nombre']} (completo: {new.get('completo')})\n")
