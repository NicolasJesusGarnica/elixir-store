import json

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/sets_metadata.json', 'r', encoding='utf-8') as f:
    nuevos_sets = json.load(f)

print(f"Catálogo actual: {len(catalogo)} perfumes")
print(f"Nuevos sets a integrar: {len(nuevos_sets)}")

existing_ids = {p['id'] for p in catalogo}
added_count = 0
for s in nuevos_sets:
    if s['id'] in existing_ids:
        print(f"Ya existe {s['id']}, omitiendo...")
    else:
        catalogo.append(s)
        added_count += 1

print(f"Total sets agregados: {added_count}")
print(f"Nuevo tamaño total del catálogo: {len(catalogo)}")

with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(catalogo, f, ensure_ascii=False, indent=2)

print("¡src/assets/perfumes.json actualizado con éxito!")
