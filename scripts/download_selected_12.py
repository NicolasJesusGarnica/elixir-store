import urllib.request
import os
import json

with open('scripts/ddgs_results_12.json', 'r', encoding='utf-8') as f:
    results = json.load(f)

out_dir = 'temp_download_12'
os.makedirs(out_dir, exist_ok=True)

# Select best candidates
selected = {
    'afnan_9pm_negro_100': 'https://zaoud.it/cdn/shop/files/9pm-perfume-bottle-shows-against-white-background.jpg?v=1715938801&width=1946',
    'afnan_supremacy_in_oud': 'https://dxbperfume.co.uk/cdn/shop/files/supremacy_1_0712bf1c-0a71-430b-a11e-4fa912c5e3cd.jpg?v=1732194299&width=1400',
    'arabiyat_prestige_marwa': 'https://purpleorchidbh.com/wp-content/uploads/2025/06/Marwa-Arabiyat-Prestige.jpg',
    'adidas_vibes_happy_feels': 'https://lojasrede.vtexassets.com/arquivos/ids/411686-1000-auto/814254-2-Perfume-Adidas-Vibes-Happy-Feels-Eau-De-Parfum-Unissex-50ml.webp',
    'ajmal_vi': 'https://http2.mlstatic.com/D_NQ_NP_987393-MLA89900403570_082025-O.webp',
    'carolina_herrera_ch': 'https://www.faces.sa/dw/image/v2/BJSM_PRD/on/demandware.static/-/Sites-faces-master-catalog/default/dw928221c5/product/8411061607169_11/8411061607169_11.jpg?sw=800&sh=800',
    'burberry_goddess': 'https://media.sephora.eu/content/dam/digital/pim/published/B/BURBERRY/P10052709/94477-media_1.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit',
    'carolina_herrera_bad_boy_le': 'https://perfumehousebd.com/wp-content/uploads/2023/07/CAROLINA-HERRERA-BAD-BOY-LE-PERFUME-EDP-100ML-1.png',
    'davidoff_cool_water': 'https://skinsociety.me/cdn/shop/files/3616303467371-1_1024x.jpg?v=1690458967',
    'nene_beauty_bruma_body_splash': 'https://velvetbeautybo.com/wp-content/uploads/2025/10/Nene-Beauty-x-Colorina-Body-Spash-Niebla-Perfumada-200ml.webp',
    'pepe_jeans_london_calling_for_her': 'https://cdn.idealo.com/folder/Product/202074/8/202074884/s3_produktbild_max_4/pepe-jeans-london-calling-for-her-eau-de-parfum-80-ml.jpg',
    'shrek_for_boys': 'https://i5.walmartimages.com/asr/239824ce-d683-451c-aed4-83481cc9b31f.0a5ea6ae8f1559b676d469409351ab84.jpeg'
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for key, url in selected.items():
    ext = '.webp' if '.webp' in url.lower() else ('.png' if '.png' in url.lower() else '.jpg')
    target_path = os.path.join(out_dir, key + ext)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(target_path, 'wb') as f:
                f.write(data)
            print(f"[OK] {key} ({len(data)} bytes) -> {target_path}")
    except Exception as e:
        print(f"[FAIL] {key}: {e}")
