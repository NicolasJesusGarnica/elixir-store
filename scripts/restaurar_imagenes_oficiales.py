import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/firestore_original_perfumes.json', encoding='utf-8') as f:
    fs_docs = json.load(f)

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

print(f"Total en Firestore original: {len(fs_docs)}")

# Aliases between original firestore IDs and catalog IDs
aliases = {
    'ab_queen_of_seduction': 'antonio_banderas_queen_of_seduction',
    'acqua_di_gio_edp': 'giorgio_armani_acqua_di_gio',
    'ag_ari': 'ariana_grande_ari',
    'ag_cloud': 'ariana_grande_cloud',
    'ag_god_is_a_woman': 'ariana_grande_god_is_a',
    'ag_mood_blush': 'ariana_grande_mod_blush',
    'ag_moonlight': 'ariana_grande_moonlight_body_mist',
    'ag_sweet_like_candy': 'ariana_grande_sweet_like_candy',
    'ag_thank_u_next': 'ariana_grande_thank_u_next',
    'billie_eilish_negro': 'billie_eilish_your_turn',
    'hawas_for_him': 'rasasi_hawas',
    'jp_halloween_mujer': 'jesus_del_pozo_halloween',
    'jpg_le_classique_edp': 'jean_paul_gaultier_classique',
    'odyssey_auod': 'armaf_odyssey_aoud',
    'odyssey_eau_de_montagne': 'armaf_odyssey_eau_de_montagne',
    'odyssey_lichi': 'armaf_odyssey_lichi_lush',
    'odyssey_mandarin_sky_elixir': 'mandarine_sky',
    'odyssey_mandarin_sky_vintage': 'mandarine_sky',
    'pepe_l_indulgence_for_her': 'pepe_jeans_addictive_indulgence_for_her',
    'stronger_with_you_in': 'emporio_armani_stronger_with_you_intensely',
    'asad_zanzibar': 'lattafa_asad_zanzibar',
    'icon_a_banderas_women': 'antonio_banderas_icon_splendid_80',
    'ab_icon_men_edp': 'ab_icon_men_edt'
}

cat_by_id = {p['id']: p for p in cat}

restauradas = 0
for fs_id, data in fs_docs.items():
    target_id = aliases.get(fs_id, fs_id)
    if target_id in cat_by_id:
        p = cat_by_id[target_id]
        fs_img = data.get('imagenes', [])
        if fs_img and fs_img != p.get('imagenes'):
            print(f"Restaurando [{target_id}]:")
            print(f"   Antes:   {p.get('imagenes')}")
            print(f"   Oficial: {fs_img}")
            p['imagenes'] = fs_img
            restauradas += 1

print(f"\nTotal imágenes originales restauradas: {restauradas}")

# Especial: Verificar que antonio_banderas_queen_of_seduction tenga la imagen oficial
p_queen = cat_by_id.get('antonio_banderas_queen_of_seduction')
if p_queen:
    print(f"\nVerificación Queen of Seduction: {p_queen['imagenes']}")

with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(cat, f, ensure_ascii=False, indent=2)

print("src/assets/perfumes.json actualizado con imágenes originales oficiales.")
