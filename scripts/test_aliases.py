import json

with open('scripts/decants_oficiales.json', encoding='utf-8') as f:
    dec = json.load(f)

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

cat_by_id = {p['id']: p for p in cat}

print(f"Total decants: {len(dec)}")
matched = 0
unmatched = []

# Known explicit aliases if any:
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
    'odyssey_eau_de_montagne': 'armaf_odyssey_eau_de_montagne',
    'odyssey_lichi': 'armaf_odyssey_lichi_lush',
    'odyssey_auod': 'armaf_odyssey_aoud',
    'pepe_l_indulgence_for_her': 'pepe_jeans_addictive_indulgence_for_her',
    'stronger_with_you_in': 'emporio_armani_stronger_with_you_intensely'
}

for d_id, vols in dec.items():
    actual_id = d_id
    if d_id in cat_by_id:
        matched += 1
    elif d_id in aliases and aliases[d_id] in cat_by_id:
        matched += 1
        print(f"Alias matched: {d_id} -> {aliases[d_id]}")
    else:
        unmatched.append(d_id)

print(f"Matched: {matched}, Unmatched: {len(unmatched)}")
print(f"Unmatched list: {unmatched}")
