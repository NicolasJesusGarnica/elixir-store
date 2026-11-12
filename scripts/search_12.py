import urllib.request
import urllib.parse
import re
import json

queries = {
    'afnan_9pm_negro_100': 'Afnan 9 PM 100ml edp bottle white background packshot',
    'afnan_supremacy_in_oud': 'Afnan Supremacy in Oud bottle white background',
    'arabiyat_prestige_marwa': 'Arabiyat Prestige Marwa bottle white background',
    'adidas_vibes_happy_feels': 'Adidas Vibes Happy Feels Eau de Parfum bottle white background',
    'ajmal_vi': 'Ajmal VI Eau de Parfum 100ml bottle white background',
    'carolina_herrera_ch': 'Carolina Herrera CH for women round red bottle white background sephora',
    'burberry_goddess': 'Burberry Goddess Eau de Parfum bottle white background sephora',
    'carolina_herrera_bad_boy_le': 'Carolina Herrera Bad Boy Le Parfum bottle matte black white background sephora',
    'davidoff_cool_water': 'Davidoff Cool Water Man Eau de Toilette bottle white background',
    'nene_beauty_bruma_body_splash': 'Colorina Nene Beauty Body Splash 200ml',
    'pepe_jeans_london_calling_for_her': 'Pepe Jeans London Calling for Her bottle cocktail white background',
    'shrek_for_boys': 'Air-Val Shrek Eau de Toilette bottle'
}

results = {}

for key, q in queries.items():
    url = f'https://www.bing.com/images/search?q={urllib.parse.quote(q)}&FORM=HDRSC2'
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            murls = re.findall(r'murl&quot;:&quot;(http[^&]+)&quot;', html)
            results[key] = murls[:6]
            print(f"[{key}] Found {len(murls)} images. Top 2:")
            for m in murls[:2]:
                print("   ", m)
    except Exception as e:
        print(f"[{key}] Error: {e}")

with open('scripts/search_results_12.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
