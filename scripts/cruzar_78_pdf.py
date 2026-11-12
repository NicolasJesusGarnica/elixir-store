import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

with open('scripts/inventario_extraido.json', 'r', encoding='utf-8') as f:
    inventario = json.load(f)

# Primeros 78 perfumes (los existentes originales)
existentes = catalogo[:78]

coincidencias = []
no_coincidencias = []

for p in existentes:
    p_id = p['id']
    p_nom = p['nombre'].upper()
    p_marca = p['marca'].upper()
    
    matches = []
    for item in inventario:
        item_desc = f"{item['marca']} {item['descripcion']}".upper()
        
        # Palabras significativas
        p_words = [w for w in p_nom.replace('_', ' ').split() if len(w) > 2 and w not in ['EDP', 'EDT', 'PARFUM', 'HOMME', 'HER', 'HIM', 'INTENSE', 'MEN', 'WOMEN', 'ELIXIR']]
        if not p_words:
            p_words = [w for w in p_nom.split() if len(w) > 2]
            
        coincide = 0
        for w in p_words:
            if w in item_desc:
                coincide += 1
                
        if len(p_words) > 0 and coincide >= max(1, len(p_words) - 1):
            matches.append(item)
            
    if matches:
        coincidencias.append((p, matches))
    else:
        no_coincidencias.append(p)

print(f"Total en catalogo: {len(catalogo)}")
print(f"De los 78 iniciales:")
print(f"Coinciden con el PDF de inventario: {len(coincidencias)}")
print(f"NO coinciden con el PDF de inventario: {len(no_coincidencias)}")

print("\n--- EJEMPLOS DE COINCIDENCIAS (Tienen decants pero están en el PDF como botella completa) ---")
for p, m in coincidencias:
    best = m[0]
    print(f"ID: {p['id']} | Nombre: {p['nombre']} | Marca: {p['marca']}")
    print(f"   -> En PDF: {best['marca']} {best['descripcion']} | Precio Botella: Bs {best['precio_botella']} | Stock: {best['stock']}")
    print(f"   -> Decants actuales: {p.get('volumenes')}")
    print(f"   -> Completo actual: {p.get('completo')}\n")
