import json

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total perfumes en catalogo: {len(data)}")
con_volumenes = [p for p in data if len(p.get('volumenes', [])) > 0]
print(f"Perfumes con volumenes (decants): {len(con_volumenes)}")

print("\n--- Lista de perfumes con decants actuales ---")
for i, p in enumerate(con_volumenes):
    print(f"{i+1}. {p['id']} | {p['nombre']} | Marca: {p['marca']} | Decants: {p['volumenes']} | Completo: {p.get('completo')}")
