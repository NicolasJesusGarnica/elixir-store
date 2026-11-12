import os
import urllib.request
from ddgs import DDGS

TEST_PERFUMES = [
    {
        'id': 'lattafa_asad_bourbon',
        'marca': 'Lattafa',
        'nombre': 'LATTAFA ASAD BOURBON',
        'query': 'Lattafa Asad Bourbon bottle white background'
    },
    {
        'id': 'pdm_althair',
        'marca': 'Parfums de Marly',
        'nombre': 'PARFUMS DE MARLY ALTHAIR',
        'query': 'Parfums de Marly Althair bottle white background'
    },
    {
        'id': 'versace_eros_energy',
        'marca': 'Versace',
        'nombre': 'VERSACE EROS ENERGY',
        'query': 'Versace Eros Energy bottle white background'
    }
]

os.makedirs('temp_raw_images', exist_ok=True)

with DDGS() as ddgs:
    for p in TEST_PERFUMES:
        pid = p['id']
        query = p['query']
        print(f"\nBuscando: {p['nombre']}...")
        results = list(ddgs.images(query, max_results=6))
        success = False

        for idx, r in enumerate(results):
            img_url = r['image']
            try:
                req = urllib.request.Request(
                    img_url,
                    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                )
                with urllib.request.urlopen(req, timeout=8) as resp:
                    data = resp.read()
                    if len(data) > 10000: # at least 10kb
                        ext = '.png' if '.png' in img_url.lower() else '.jpg'
                        raw_path = f"temp_raw_images/{pid}{ext}"
                        with open(raw_path, 'wb') as f:
                            f.write(data)
                        print(f"  [OK] Descargada opción {idx}: {img_url} ({len(data)} bytes)")
                        success = True
                        break
            except Exception as e:
                pass

        if not success:
            print(f"  [FAIL] No se pudo descargar {p['nombre']}")

print("\n--- Fin de descarga de prueba con fallback ---")
