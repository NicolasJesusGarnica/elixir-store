from ddgs import DDGS
import json

queries = {
    'afnan_9pm_negro_100': 'Afnan 9 PM Eau de Parfum 100ml bottle white background',
    'afnan_supremacy_in_oud': 'Afnan Supremacy in Oud bottle white background',
    'arabiyat_prestige_marwa': 'Arabiyat Prestige Marwa bottle',
    'adidas_vibes_happy_feels': 'Adidas Vibes Happy Feels Eau de Parfum bottle',
    'ajmal_vi': 'Ajmal VI perfume bottle',
    'carolina_herrera_ch': 'Carolina Herrera CH for women Eau de Toilette bottle sephora',
    'burberry_goddess': 'Burberry Goddess Eau de Parfum bottle sephora',
    'carolina_herrera_bad_boy_le': 'Carolina Herrera Bad Boy Le Parfum bottle matte black',
    'davidoff_cool_water': 'Davidoff Cool Water Man Eau de Toilette bottle white background',
    'nene_beauty_bruma_body_splash': 'Colorina Nene Beauty Body Splash',
    'pepe_jeans_london_calling_for_her': 'Pepe Jeans London Calling for Her Eau de Parfum bottle',
    'shrek_for_boys': 'Air-Val Shrek for Boys Eau de Toilette bottle'
}

results = {}

with DDGS() as ddgs:
    for key, q in queries.items():
        try:
            res = list(ddgs.images(q, max_results=5))
            results[key] = [r['image'] for r in res]
            print(f"[{key}] Found {len(res)} results:")
            for r in res[:2]:
                print(f"   {r['title']}: {r['image']}")
        except Exception as e:
            print(f"[{key}] Error: {e}")

with open('scripts/ddgs_results_12.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
