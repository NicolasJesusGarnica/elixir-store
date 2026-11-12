import json

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

existing_ids = {p['id'] for p in perfumes}
existing_names = {p['nombre'].lower() for p in perfumes}

check_list = [
    'afnan_set_supremacy_silver',
    'afnan_supremacy_not_only_intense_set',
    'mousuf_edp_set',
    'jesus_del_pozo_halloween_women_set',
    'game_of_spades_full_house_set',
    'game_of_spades_wildcard_set',
    'calvin_klein_ck_one_set',
    'calvin_klein_euphoria_women_set',
    'burberry_her_edp_set_bl',
    'burberry_goddess_edp_set',
    'burberry_her_edt_set',
    'burberry_mini_set_4pcs',
    'hugo_boss_bottled_set',
    'lattafa_asad_set',
    'lattafa_badee_al_oud_mini_set',
    'lattafa_khamrah_set',
    'lattafa_the_kingdom_set',
    'lattafa_yara_set_25ml',
    'lattafa_yara_mini_set_5ml',
    'lattafa_pride_nebras_set',
    'orientica_amber_rouge_set_2pcs',
    'orientica_amber_rouge_set_neceser',
    'versace_eros_flame_set_neceser',
    'airval_barbie_body_spray_set',
    'airval_batman_edt_set',
    'airval_bob_esponja_edt_set',
    'airval_eau_my_bb_teddy_set',
    'airval_eau_my_unicorn_spray_set',
    'airval_eau_my_unicorn_edt_mochila',
    'airval_frozen_edt_neceser',
    'airval_frozen_body_spray_set',
    'airval_marvel_capitan_america_set',
    'airval_minecraft_edt_lonchera',
    'airval_spiderman_edt_neceser',
    'ariana_grande_ari_body_mist_236ml',
    'ariana_grande_thank_u_next_2_body_mist',
    'ariana_grande_cloud_body_splash_236ml',
    'ariana_grande_god_is_a_woman_body_mist',
    'ariana_grande_mod_blush_body_splash',
    'ariana_grande_moonlight_body_mist',
    'ariana_grande_thank_u_next_body_splash',
    'guess_girl_body_mist_250ml',
    'nene_beauty_bruma_body_splash',
    'paco_rabanne_invictus_set',
    'victoria_secret_bare_vanilla_set'
]

print(f"Total to check: {len(check_list)}")
missing = []
for item in check_list:
    found = item in existing_ids or any(item.replace('_', ' ') in name for name in existing_names)
    if not found:
        # Also check if any existing id contains core words
        words = item.split('_')
        partial = [pid for pid in existing_ids if all(w in pid for w in words[:2]) and ('set' in pid or 'mist' in pid or 'splash' in pid)]
        if partial:
            print(f"  {item} -> Partially found: {partial}")
            continue
    status = "EXISTS" if found else "MISSING"
    if status == "MISSING":
        missing.append(item)
    print(f"  {item}: {status}")

print(f"\nTotal MISSING: {len(missing)}")
