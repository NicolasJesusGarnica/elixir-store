import json
import urllib.request
import sys
import concurrent.futures
import time

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    catalogo = json.load(f)

print(f"Total perfumes a auditar: {len(catalogo)}\n")

# 1. Función para chequear HTTP Status en R2 con concurrencia
def chequear_url(url):
    clean_url = url.split('?')[0]
    req = urllib.request.Request(clean_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=8)
        size = int(resp.headers.get('content-length', 0))
        return (resp.status, size, clean_url)
    except urllib.error.HTTPError as e:
        return (e.code, 0, clean_url)
    except Exception as e:
        return (0, 0, str(e))

# Extraer URLs únicas para no chequear duplicados
todas_urls = {}
for p in catalogo:
    imgs = p.get('imagenes', [])
    if imgs:
        todas_urls[imgs[0]] = p

print(f"Total URLs únicas a verificar en R2: {len(todas_urls)}")

resultados_http = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
    futuros = {executor.submit(chequear_url, u): u for u in todas_urls}
    for f in concurrent.futures.as_completed(futuros):
        u = futuros[f]
        status, size, clean = f.result()
        resultados_http[u] = (status, size, clean)

# 2. Análisis Semántico y de Coherencia
rotas = []
muy_chicas = [] # menos de 2KB (posibles imágenes corruptas)
sospechosas = []

for p in catalogo:
    pid = p['id']
    nombre = p['nombre']
    marca = p['marca']
    imgs = p.get('imagenes', [])
    
    if not imgs:
        rotas.append((p, "SIN_IMAGEN", 0))
        continue
        
    url = imgs[0]
    status, size, clean = resultados_http.get(url, (0, 0, ''))
    
    if status != 200:
        rotas.append((p, f"HTTP_{status}", clean))
    elif size < 2500: # menos de 2.5 KB
        muy_chicas.append((p, size, clean))
        
    # Chequeo de coherencia de nombre vs archivo
    archivo = clean.split('/')[-1].replace('.webp', '').lower()
    
    # Palabras clave del perfume (más de 3 letras)
    tokens_nombre = [w.lower() for w in nombre.split() if len(w) > 3 and w.lower() not in ['para', 'homme', 'femme', 'tester', 'spray', 'body', 'colonia', 'original', 'fragancia', 'elixir']]
    
    # Si ninguna palabra clave del nombre está en el nombre del archivo
    coincidencias = [t for t in tokens_nombre if t in archivo]
    if len(tokens_nombre) >= 2 and len(coincidencias) == 0:
        sospechosas.append((p, archivo, tokens_nombre))

print(f"\n================ RESUMEN DE AUDITORÍA ================")
print(f"Total perfumes: {len(catalogo)}")
print(f"URLs con HTTP 200 válidas: {len([r for r in resultados_http.values() if r[0] == 200])}")
print(f"Imágenes Rotas (no cargan): {len(rotas)}")
print(f"Imágenes Sospechosas por tamaño (<2.5KB): {len(muy_chicas)}")
print(f"Imágenes con Discrepancia Semántica de Nombre: {len(sospechosas)}")

if rotas:
    print("\n--- IMÁGENES ROTAS ---")
    for p, err, url in rotas:
        print(f"❌ [{p['id']}] {p['nombre']} -> {err} ({url})")

if muy_chicas:
    print("\n--- IMÁGENES MUY PEQUEÑAS / POSIBLE ERROR DE COMPRESIÓN ---")
    for p, sz, url in muy_chicas:
        print(f"⚠️ [{p['id']}] {p['nombre']} -> {sz} bytes ({url})")

if sospechosas:
    print("\n--- IMÁGENES CON POSIBLE DISCREPANCIA (REVISAR) ---")
    for p, arch, tok in sospechosas:
        print(f"❓ [{p['id']}] {p['nombre']} ({p['marca']}) -> Archivo: {arch}.webp (Tokens buscados: {tok})")

# Guardar informe detallado en JSON
with open('scripts/auditoria_imagenes_resultado.json', 'w', encoding='utf-8') as f:
    json.dump({
        'total': len(catalogo),
        'rotas': [{'id': p['id'], 'nombre': p['nombre'], 'error': err} for p, err, u in rotas],
        'muy_chicas': [{'id': p['id'], 'nombre': p['nombre'], 'bytes': sz, 'url': u} for p, sz, u in muy_chicas],
        'sospechosas': [{'id': p['id'], 'nombre': p['nombre'], 'marca': p['marca'], 'archivo': arch} for p, arch, tok in sospechosas]
    }, f, ensure_ascii=False, indent=2)

print("\nReporte guardado en scripts/auditoria_imagenes_resultado.json")
