import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for slug in ['teriaq_intense_lattafa', 'bharara_king', 'hawas_ice', 'asad_lattafa', 'nike_blue', 'ab_blue']:
    url = f'http://localhost:4200/perfumes/{slug}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            html = response.read().decode('utf-8')
        title = re.search(r'<title>(.*?)</title>', html)
        t_str = title.group(1) if title else "No title"
        has_bottle = "Botella Completa" in html
        has_decant_sel = "Selecciona el tamaño del decant" in html
        print(f"[{slug}]: {t_str} | Botella Completa={has_bottle} | Tiene selector decants={has_decant_sel}")
    except Exception as e:
        print(f"[{slug}]: Error {e}")
