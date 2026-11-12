import os
import sys
import json
import time
import urllib.request
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from ddgs import DDGS

# Forzar salida utf-8 para que nunca falle por codificación de terminal en Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

OUTPUT_DIR = 'temp_raw_catalog'
STATE_FILE = 'scripts/progreso_descarga.json'
CATALOG_FILE = 'scripts/catalogo_preparado.json'

os.makedirs(OUTPUT_DIR, exist_ok=True)

state = {}
if os.path.exists(STATE_FILE):
    try:
        with open(STATE_FILE, 'r', encoding='utf-8') as f:
            state = json.load(f)
    except Exception:
        state = {}

lock = threading.Lock()

def save_state():
    with lock:
        with open(STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=2)

def is_valid_image(data):
    if len(data) < 8000:
        return False, None
    if data.startswith(b'\xff\xd8\xff'):
        return True, '.jpg'
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        return True, '.png'
    if data.startswith(b'RIFF') and len(data) > 12 and data[8:12] == b'WEBP':
        return True, '.webp'
    return False, None

def check_existing_local(item_id):
    for ext in ['.jpg', '.png', '.webp', '.jpeg']:
        path = os.path.join(OUTPUT_DIR, f"{item_id}{ext}")
        if os.path.exists(path) and os.path.getsize(path) > 8000:
            return path
    return None

def download_candidate(url):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
    )
    with urllib.request.urlopen(req, timeout=7) as resp:
        if resp.status == 200:
            return resp.read()
    return None

def process_item(item, index, total):
    item_id = item['id']
    marca = item['marca']
    nombre = item['nombre']

    # 1. Si ya existe en disco
    local_file = check_existing_local(item_id)
    if local_file:
        with lock:
            state[item_id] = {
                'status': 'ok',
                'file': local_file,
                'size': os.path.getsize(local_file),
                'cached': True
            }
        print(f"[{index}/{total}] [EXISTE] {item_id}", flush=True)
        return True

    queries = [
        f"{marca} {item['query_busqueda']}",
        f"{marca} {nombre.replace(marca.upper(), '').strip()} perfume bottle white background",
        f"{marca} {nombre} perfume bottle",
    ]

    for q_idx, query in enumerate(queries):
        results = []
        try:
            with DDGS() as ddgs:
                results = list(ddgs.images(query, max_results=5))
        except Exception as e:
            time.sleep(1.0)
            results = []

        if not results:
            continue

        for r in results:
            img_url = r.get('image')
            if not img_url:
                continue

            data = None
            try:
                data = download_candidate(img_url)
            except Exception:
                continue

            if not data:
                continue

            valid, ext = is_valid_image(data)
            if valid:
                out_path = os.path.join(OUTPUT_DIR, f"{item_id}{ext}")
                with open(out_path, 'wb') as f_out:
                    f_out.write(data)

                with lock:
                    state[item_id] = {
                        'status': 'ok',
                        'file': out_path,
                        'size': len(data),
                        'source_url': img_url,
                        'query': query
                    }
                print(f"[{index}/{total}] [OK] {item_id} ({len(data)} B, q{q_idx})", flush=True)
                return True

    # Si ninguna query o resultado funcionó
    with lock:
        state[item_id] = {
            'status': 'failed',
            'error': 'No candidate succeeded'
        }
    print(f"[{index}/{total}] [FAIL] {item_id}", flush=True)
    return False

def main():
    with open(CATALOG_FILE, 'r', encoding='utf-8') as f:
        items = json.load(f)

    total = len(items)
    print(f"Iniciando descarga multihilo controlada para {total} perfumes...", flush=True)

    success_count = 0
    fail_count = 0

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(process_item, it, i + 1, total): it
            for i, it in enumerate(items)
        }

        for i, future in enumerate(as_completed(futures)):
            try:
                ok = future.result()
                if ok:
                    success_count += 1
                else:
                    fail_count += 1
            except Exception as e:
                fail_count += 1

            if (i + 1) % 10 == 0 or (i + 1) == total:
                save_state()
                print(f"=== Progreso: {i + 1}/{total} | OK: {success_count} | FAIL: {fail_count} ===", flush=True)

    save_state()
    print(f"\nFinalizado: {success_count} exitosos, {fail_count} fallidos de {total}.", flush=True)

if __name__ == '__main__':
    main()
