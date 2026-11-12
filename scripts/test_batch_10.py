import json
import time
import urllib.request
import os
from ddgs import DDGS

with open('scripts/catalogo_preparado.json', encoding='utf-8') as f:
    items = json.load(f)[:10]

os.makedirs('temp_test_batch', exist_ok=True)

with DDGS() as ddgs:
    for i, it in enumerate(items):
        t0 = time.time()
        q = it['query_busqueda']
        print(f"[{i+1}/10] Buscando: {it['nombre']}...")
        try:
            res = list(ddgs.images(q, max_results=5))
            ok = False
            for r in res:
                url = r['image']
                try:
                    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
                    with urllib.request.urlopen(req, timeout=6) as resp:
                        data = resp.read()
                        if len(data) > 8000:
                            ext = '.png' if '.png' in url.lower() else '.jpg'
                            with open(f"temp_test_batch/{it['id']}{ext}", 'wb') as out:
                                out.write(data)
                            ok = True
                            print(f"  ✓ OK ({len(data)} bytes) en {time.time()-t0:.1f}s")
                            break
                except Exception:
                    pass
            if not ok:
                print('  ✗ No se pudo descargar')
        except Exception as e:
            print(f'  ✗ Error DDG: {e}')
        time.sleep(1.2)
