import urllib.request
import urllib.parse
import re

def buscar_id_fragrantica(marca, perfume):
    query = f"site:fragrantica.com {marca} {perfume}"
    url = f"https://www.bing.com/search?q={urllib.parse.quote(query)}"
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'fragrantica\.com/perfume/[^"\'<>\s]+?-(\d+)\.html', html)
            if matches:
                return matches[0]
    except Exception as e:
        print(f"Error buscando {marca} {perfume}: {e}")
    return None

test_cases = [
    ('Lattafa', 'Asad Bourbon'),
    ('Afnan', 'Historic Sahara'),
    ('Mancera', 'French Riviera'),
    ('Versace', 'Eros Energy'),
    ('Al Wataniah', 'Durrat Al Aroos'),
    ('Xerjoff', 'Naxos')
]

for m, p in test_cases:
    fid = buscar_id_fragrantica(m, p)
    img_url = f"https://fimgs.net/mdimg/perfume/o.{fid}.jpg" if fid else "NO ENCONTRADO"
    print(f"{m} - {p} => Fragrantica ID: {fid} => Foto: {img_url}")
