import urllib.request
import urllib.parse
import re
import html as html_lib
import json

def buscar_imagenes_bing(query):
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}&FORM=HDRSC2"
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            iusc_matches = re.findall(r'class="iusc"[^>]*?m="([^"]+)"', content)
            urls = []
            for m in iusc_matches:
                decoded = html_lib.unescape(m)
                try:
                    data = json.loads(decoded)
                    if 'murl' in data:
                        urls.append(data['murl'])
                except:
                    pass
            return urls
    except Exception as e:
        print(f"Error: {e}")
        return []

tests = [
    'Afnan Historic Sahara bottle white background',
    'Versace Eros Energy bottle white background',
    'Parfums de Marly Althair bottle white background',
    'Xerjoff Naxos bottle white background',
    'Lattafa Teriaq Intense bottle white background'
]

for t in tests:
    results = buscar_imagenes_bing(t)
    print(f"\nResultados para '{t}': {len(results)}")
    for r in results[:2]:
        print(f"  {r}")
