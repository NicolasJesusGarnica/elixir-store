import json
import urllib.request
import concurrent.futures
from collections import defaultdict

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

print(f"Total perfumes in catalog: {len(perfumes)}")

# Check duplicate URLs across different products
url_to_perfumes = defaultdict(list)
for p in perfumes:
    img = p.get('imagenes', [None])[0]
    if img:
        url_to_perfumes[img].append(p)
    else:
        print(f"NO IMAGE: {p['id']} - {p['nombre']}")

print(f"Total unique image URLs: {len(url_to_perfumes)}")

duplicate_urls = {k: v for k, v in url_to_perfumes.items() if len(v) > 1}
print(f"URLs shared by multiple perfumes: {len(duplicate_urls)}")
for url, perfs in duplicate_urls.items():
    names = [p['nombre'] for p in perfs]
    print(f"Shared URL: {url.split('/')[-1]} -> {names}")

# Audit all URLs for HTTP 200 and Content-Length
def check_url(url):
    try:
        req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            size = int(resp.headers.get('Content-Length', 0))
            return url, resp.status, size, None
    except Exception as e:
        return url, 0, 0, str(e)

print("\nChecking all URLs on R2 concurrently...")
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(check_url, list(url_to_perfumes.keys())))

errors = [r for r in results if r[1] != 200]
tiny_images = [r for r in results if r[1] == 200 and r[2] < 3000]

print(f"\nAudit completed:")
print(f"Total checked: {len(results)}")
print(f"Errors (non-200): {len(errors)}")
for err in errors:
    print("  -> ERROR:", err)

print(f"Tiny images (< 3KB): {len(tiny_images)}")
for tiny in tiny_images:
    print("  -> TINY:", tiny)
