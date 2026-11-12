import os
import sys
import time
import urllib.request
import io
import json
from PIL import Image
from ddgs import DDGS
sys.path.append('.')
sys.path.append('scripts')
from luxury_image_processor import process_to_luxury_white_webp

# Output directory
os.makedirs('temp_sets_packshots', exist_ok=True)

# List of the 35 sets to process
sets_to_process = [
    {
        "id": "afnan_supremacy_not_only_intense_set",
        "search": "Afnan Supremacy Not Only Intense gift set edp shower gel deo white background",
        "fallback": "Afnan Supremacy Not Only Intense set 3 pcs packshot white"
    },
    {
        "id": "mousuf_edp_set",
        "search": "Ard Al Zaafaran Mousuf perfume set body spray desodorante white background",
        "fallback": "Mousuf edp set 3 pcs packshot"
    },
    {
        "id": "jesus_del_pozo_halloween_women_set",
        "search": "Jesus del Pozo Halloween Women set estuche edt mini body lotion shower gel white background",
        "fallback": "Halloween perfume set 4 pcs white background"
    },
    {
        "id": "game_of_spades_full_house_set",
        "search": "Jo Milano Game of Spades Full House set 4 pcs parfum lotion gel white background",
        "fallback": "Game of Spades Full House Jo Milano set white"
    },
    {
        "id": "game_of_spades_wildcard_set",
        "search": "Jo Milano Game of Spades Wildcard set 4 pcs parfum lotion gel white background",
        "fallback": "Game of Spades Wildcard Jo Milano set white"
    },
    {
        "id": "calvin_klein_ck_one_set",
        "search": "Calvin Klein CK One gift set edt shower gel 100ml white background",
        "fallback": "CK One set 2 pcs packshot white background"
    },
    {
        "id": "calvin_klein_euphoria_women_set",
        "search": "Calvin Klein Euphoria Women gift set edp body lotion white background",
        "fallback": "Euphoria Calvin Klein set 2 pcs packshot"
    },
    {
        "id": "burberry_her_edp_set_bl",
        "search": "Burberry Her edp gift set body lotion 50ml 75ml white background",
        "fallback": "Burberry Her edp set 2 pcs packshot"
    },
    {
        "id": "burberry_goddess_edp_set",
        "search": "Burberry Goddess edp gift set 100ml 10ml travel spray white background",
        "fallback": "Burberry Goddess set 2 pcs packshot"
    },
    {
        "id": "burberry_her_edt_set",
        "search": "Burberry Her edt gift set 50ml 10ml travel spray white background",
        "fallback": "Burberry Her Eau de Toilette gift set packshot"
    },
    {
        "id": "burberry_mini_set_4pcs",
        "search": "Burberry Her and Goddess miniature set 4 pcs 5ml white background",
        "fallback": "Burberry mini perfume set 4 pcs packshot"
    },
    {
        "id": "hugo_boss_bottled_set",
        "search": "Hugo Boss Boss Bottled gift set edt deodorant spray white background",
        "fallback": "Boss Bottled set 2 pcs packshot white"
    },
    {
        "id": "lattafa_asad_set",
        "search": "Lattafa Asad gift set edp deodorant spray 200ml white background",
        "fallback": "Lattafa Asad set 2 pcs packshot white"
    },
    {
        "id": "lattafa_badee_al_oud_mini_set",
        "search": "Lattafa Badee Al Oud miniature collection set 5ml 4 pcs white background",
        "fallback": "Badee Al Oud mini set Lattafa packshot"
    },
    {
        "id": "lattafa_khamrah_set",
        "search": "Lattafa Khamrah gift set edp deodorant spray 200ml white background",
        "fallback": "Lattafa Khamrah set 2 pcs packshot white"
    },
    {
        "id": "lattafa_the_kingdom_set",
        "search": "Lattafa The Kingdom gift set edp 100ml 12ml hair mist 50ml white background",
        "fallback": "The Kingdom Lattafa set 3 pcs packshot"
    },
    {
        "id": "lattafa_yara_set_25ml",
        "search": "Lattafa Yara collection set 4 pcs 25ml candy tous moi white background",
        "fallback": "Yara collection set 25ml Lattafa packshot"
    },
    {
        "id": "lattafa_yara_mini_set_5ml",
        "search": "Lattafa Yara miniature set 4 pcs 5ml candy tous moi white background",
        "fallback": "Yara mini set 4 pcs Lattafa packshot"
    },
    {
        "id": "lattafa_pride_nebras_set",
        "search": "Lattafa Pride Nebras gift set edp 100ml travel 20ml deodorant white background",
        "fallback": "Nebras Lattafa Pride set 3 pcs packshot"
    },
    {
        "id": "orientica_amber_rouge_set_2pcs",
        "search": "Orientica Amber Rouge luxury set edp 30ml travel 7.5ml white background",
        "fallback": "Amber Rouge Orientica set 2 pcs packshot"
    },
    {
        "id": "orientica_amber_rouge_set_neceser",
        "search": "Orientica Amber Rouge luxury set 80ml travel case neceser white background",
        "fallback": "Amber Rouge Orientica set neceser packshot"
    },
    {
        "id": "versace_eros_flame_set_neceser",
        "search": "Versace Eros Flame gift set edp 100ml 10ml pouch neceser white background",
        "fallback": "Versace Eros Flame set neceser packshot"
    },
    {
        "id": "airval_barbie_body_spray_set",
        "search": "Air-Val Barbie set body spray shampoo gel 9478 white background",
        "fallback": "Barbie Air Val set body spray shower gel white"
    },
    {
        "id": "airval_batman_edt_set",
        "search": "Air-Val Batman set edt 50ml shampoo gel fidget toy 9412 white background",
        "fallback": "Batman Air Val gift set edt white background"
    },
    {
        "id": "airval_bob_esponja_edt_set",
        "search": "Air-Val Bob Esponja set edt 100ml shower gel 3d lunch bag lonchera 9285 white background",
        "fallback": "SpongeBob Air Val edt set lunchbox white"
    },
    {
        "id": "airval_eau_my_bb_teddy_set",
        "search": "Air-Val Eau My BB set edt 60ml teddy bear 8304 white background",
        "fallback": "Eau My BB set oso peluche Air Val white"
    },
    {
        "id": "airval_eau_my_unicorn_spray_set",
        "search": "Air-Val Eau My Unicorn set body spray 200ml shampoo gel white background",
        "fallback": "Eau My Unicorn Air Val body spray set white"
    },
    {
        "id": "airval_eau_my_unicorn_edt_mochila",
        "search": "Air-Val Eau My Unicorn set edt 50ml shower gel mochila backpack 8987 white background",
        "fallback": "Eau My Unicorn edt mochila set Air Val white"
    },
    {
        "id": "airval_frozen_edt_neceser",
        "search": "Air-Val Disney Frozen set edt 50ml shower gel neceser 8587 white background",
        "fallback": "Disney Frozen Air Val edt neceser set white"
    },
    {
        "id": "airval_frozen_body_spray_set",
        "search": "Air-Val Disney Frozen II set body spray 200ml shampoo gel 9475 white background",
        "fallback": "Disney Frozen II Air Val body spray set white"
    },
    {
        "id": "airval_marvel_capitan_america_set",
        "search": "Air-Val Marvel Capitan America set edt 100ml shower gel lonchera 3d 8772 white background",
        "fallback": "Captain America Air Val edt lunch box set white"
    },
    {
        "id": "airval_minecraft_edt_lonchera",
        "search": "Air-Val Minecraft set edt 50ml shower gel lonchera 9458 white background",
        "fallback": "Minecraft Air Val edt lunch bag set white"
    },
    {
        "id": "airval_spiderman_edt_neceser",
        "search": "Air-Val Marvel Spiderman set edt 50ml shower gel neceser 9263 white background",
        "fallback": "Spiderman Air Val edt toiletry bag set white"
    },
    {
        "id": "paco_rabanne_invictus_set_10ml",
        "search": "Paco Rabanne Invictus gift set edt 100ml travel spray 10ml white background",
        "fallback": "Invictus gift set 2 pcs packshot white background"
    },
    {
        "id": "victoria_secret_bare_vanilla_set",
        "search": "Victorias Secret Bare Vanilla fragrance mist 75ml lip gloss glow set white background",
        "fallback": "Bare Vanilla mist lip gloss set Victorias Secret white"
    }
]

def verify_packshot(img_bytes):
    try:
        im = Image.open(io.BytesIO(img_bytes))
        if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
            alpha = im.convert('RGBA')
            bg = Image.new('RGB', alpha.size, (255, 255, 255))
            bg.paste(alpha, mask=alpha.split()[3])
            im_rgb = bg
        else:
            im_rgb = im.convert('RGB')
            
        w, h = im_rgb.size
        if w < 180 or h < 180:
            return False, 0.0, None
            
        c_pts = [
            (int(w * 0.03), int(h * 0.03)),
            (int(w * 0.97), int(h * 0.03)),
            (int(w * 0.03), int(h * 0.97)),
            (int(w * 0.97), int(h * 0.97)),
        ]
        corners_white = 0
        for pt in c_pts:
            r, g, b = im_rgb.getpixel(pt)
            if r >= 235 and g >= 235 and b >= 235 and max(r, g, b) - min(r, g, b) <= 18:
                corners_white += 1
                
        if corners_white < 2:
            return False, 0.0, None
            
        tot = 0
        white = 0
        for y in range(0, h, 10):
            for x in range(0, w, 10):
                tot += 1
                r, g, b = im_rgb.getpixel((x, y))
                if r >= 235 and g >= 235 and b >= 235 and max(r, g, b) - min(r, g, b) <= 18:
                    white += 1
        ratio = white / tot
        return (ratio >= 0.35), ratio, im_rgb
    except Exception:
        return False, 0.0, None

successful = []
failed = []

print(f"Starting packshot search and processing for {len(sets_to_process)} sets...")

for idx, s in enumerate(sets_to_process):
    pid = s['id']
    out_file = os.path.join('temp_sets_packshots', f"{pid}.webp")
    if os.path.exists(out_file) and os.path.getsize(out_file) > 5000:
        print(f"[{idx+1}/{len(sets_to_process)}] [ALREADY READY] {pid}")
        successful.append(pid)
        continue

    queries = [s['search'], s['fallback']]
    found = False
    print(f"[{idx+1}/{len(sets_to_process)}] Searching: {s['search']} ...")
    
    for q in queries:
        try:
            with DDGS() as ddgs:
                results = list(ddgs.images(q, max_results=6))
        except Exception as e:
            time.sleep(1.0)
            continue
            
        for r in results:
            url = r.get('image')
            if not url:
                continue
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=6) as resp:
                    data = resp.read()
                    ok, ratio, im_rgb = verify_packshot(data)
                    if ok and im_rgb:
                        temp_png = f"temp_sets_packshots/{pid}_raw.png"
                        im_rgb.save(temp_png)
                        process_to_luxury_white_webp(temp_png, out_file)
                        if os.path.exists(temp_png):
                            os.remove(temp_png)
                        print(f"  -> SUCCESS: {pid} (white ratio={ratio*100:.1f}%)")
                        successful.append(pid)
                        found = True
                        break
            except Exception:
                continue
        if found:
            break
            
    if not found:
        print(f"  -> RETRYING with broader terms: {pid}")
        failed.append(s)

print(f"\nProcessing summary: {len(successful)} successful, {len(failed)} need secondary search.")
