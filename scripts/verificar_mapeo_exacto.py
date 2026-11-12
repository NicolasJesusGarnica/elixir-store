import json
import re

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

# Explicit mapping dictionary from PDF item descriptions to perfumes.json ID
# Whenever a 1-to-1 match exists, we define it explicitly to prevent any accidental mismatch.
explicit_mapping = {
    # Page 1
    "9PM (NEGRO) EP 100 TESTER": "afnan_9pm_negro_100",
    "HISTORIC OLMEDA AFNAN 100ML UNISEX EDP": "afnan_historic_olmeda",
    "SUPREMACY NOT ONLY INTENSE EDP 100 ML + SG 150 ML + DEO SPRAY 75 ML SET 3 PCS": "afnan_supremacy_not_only_intense_set",
    "III AJMAL AJMAL 100ML UNISEX EDP": "ajmal_iii",
    "PISTACHIO KUNAFA ANFAR 80ML UNISEX EDP": "anfar_pistachio_kunafa",
    "MANAAL EDP 100 ML": "ard_al_zaafaran_manaal",
    "MOUSUF RAMADI EDP 100 ML": "ard_al_zaafaran_mousuf_ramadi",
    "PISTACHIO MUSK EDP 100 ML": "ard_al_zaafaran_pistachio_musk",
    "ARI BODY MIST SPRAY 236 ML": "ariana_grande_ari_body_mist_spray",
    "ARI EDP 100 ML": "ariana_grande_ari",
    "GOD IS A WOMAN BODY MIST SPRAY 236 ML": "ariana_grande_god_is_a_body_mist_spray",
    "MOD BLUSH EDP 100 ML TESTER": "ariana_grande_mod_blush",
    "MOD VANILLA ARIANA GRANDE 236ML MUJER COLONIA": "ariana_grande_mod_vanilla_colonia",
    "MOD VANILLA EDP 100 ML": "ariana_grande_mod_vanilla",
    "SWEET LIKE CANDY EDP 100 ML": "ariana_grande_sweet_like_candy",
    "THANK U NEXT 100ML MUJER EDP": "ariana_grande_thank_u_next",
    "THANK U NEXT ESTUCHE 100ML MUJER EDP": "ariana_grande_thank_u_next_estuche",
    "CLUB DE NUIT INTENSE PARFUM 105 ML LIMITED EDITION": "armaf_club_de_nuit_intense_limited_edition",
    "CLUB DE NUIT URBAN ELIXIR ARMAF 105ML HOMBRE EDP": "armaf_club_de_nuit_urban_elixir",
    "ODYSSEY MANDARIN SKY EDP 200 ML": "mandarine_sky",
    "ODYSSEY SPECTRA EP 100 H (JPG ULTRA MALE)": "odyssey_spectra",
    "ODYSSEY SPECTRA RAINBOW EDP 200ML": None, # If no 200ml specific entry exists, check below
    "BATMAN EDT 50 ML + GEL Y SHAMPOO 400 ML 2D + FIDGET TOY REF 9412": "airval_batman_edt_set",
    "EAU MY UNICORN BODY SPRAY 200 ML": "av_eau_my_unicorn_eau_my_unicorn_body_spray",
    "EAU MY UNICORN EDT 100 ML TESTER": None, # Check if av_eau_my_unicorn_eau_my_unicorn covers this
    "EAU MY UNICORN EDT 30 ML TESTER": "av_eau_my_unicorn_eau_my_unicorn",
    "CAPITAN AMERICA EDT 100 ML + SG 100 ML + LONCHERA 3D REF 8772": "airval_marvel_capitan_america_set",
    "MINECRAFT BODY SPRAY 200 ML TESTER REF 9599": "av_minecraft_minecraft_body_spray",
    "MINECRAFT EDT 50 ML + SG 100 ML + LONCHERA REF 9458": "airval_minecraft_edt_lonchera",

    # Page 2
    "MINNIE BODY SPRAY 200 ML REF 5363 TESTER": "av_minnie_mouse_minnie_body_spray",
    "SPIDERMAN BODY SPRAY 200 ML REF 5585 TESTER": "av_spiderman_spiderman_body_spray",
    "SPIDERMAN EDT 100 ML REF 5548": "av_spiderman_spiderman",
    "SPIDERMAN EDT 50 ML + SG 100 ML + NECESER REF 9263": "airval_spiderman_edt_neceser",
    "SPIDERMAN PREMIUM EDT 100 ML REF 9280": "av_spiderman_spiderman_premium",
    "STRANGER THINGS MAN EDT 50 ML TESTER": "av_stranger_things_stranger_things",
    "CK ONE EDT 100 ML + SG 100 ML SET 2 PCS": "calvin_klein_ck_one_set",
    "212 HEROES MEN EDT 150 ML": "carolina_herrera_212_heroes",
    "212 SEXY CAROLINA HERRERA 100ML MUJER EDP": "carolina_herrera_212_sexy",
    "PURE POISON EDP 100 ML": "dior_pure_poison",
    "LIGHT BLUE POUR HOMME EDT 125ML": "dolce_gabbana_light_blue_pour",
    "STRONGER WITH YOU INTENSELY 100ML EDP": "emporio_armani_stronger_with_you_intensely",
    "LIQUID BRUN LIMITED EDITION 150ML HOMBRE EDP": "french_avenue_liquid_brun_limited_edition",
    "ALL IN PARFUM 100 ML": "game_of_spades_all_in",
    "DOUBLE BONUS PARFUM 100 ML": "game_of_spades_double_bonus",
    "GENTLEMAN SOCIETY EDP 100 ML": "givenchy_gentleman_society",
    "PI EDT 100 ML": "givenchy_pi",
    "FLORA GORGEUS MAGNOLIA 100 ML EDP": "gucci_flora_gorgeus_magnolia",
    "BOSS BOTTLED BEYOND EDP 100 ML TESTER": "hugo_boss_boss_bottled_beyond",
    "LE MALE ELIXIR 200 ML PARFUM": "jpg_le_male_elixir",
    "HALLOWEEN TRADICIONAL JESUS DEL POZO 200ML MUJER EDT BASE": "jesus_del_pozo_halloween_tradicional_base",
    "KAJAL HOMME EDP 100 ML": "kajal_kajal_homme_edp_100_ml",
    "RUBY EXTRAIT DE PARFUM 100 ML": "kajal_ruby",
    "BADEE AL OUD HONOR AND GLORY EDP 100 ML": "lattafa_badee_al_oud_honor_and_glory",
    "FAKHAR WOMAN LATTAFA DESODORANTE SPRAY 200 ML": None, # Non-perfume deo
    "KHAMRAH EDP 100 ML + DEO SPRAY 200 ML SET 2 PCS": "lattafa_khamrah_set",
    "MAYAR EDP 100 ML": "lattafa_mayar",
    "MUSAMAM WHITE INTENSE LATTAFA 200ML UNISEX DESODORANTE": None, # Non-perfume deo

    # Page 3
    "YARA CANDY + YARA TOUS + YARA MOI + YARA EDP 25 ML SET 4 PCS": "lattafa_yara_set_25ml",
    "NEBRAS EDP 100 ML + 20 ML + DEO SPRAY 200 ML SET 3 PCS": "lattafa_pride_nebras_set",
    "VICTORIEUX FEMME EDP 100 ML": "lattafa_victorieux_femme",
    "LEONIE INTENSE MAISON ALHAMBRA 100ML MUJER EDP": "maison_alhambra_leonie_intense",
    "CEDRAT BOISE INTENSE MANCERA 120ML UNISEX EDP": "mancera_cedrat_boise_intense",
    "COCO VANILLE MANCERA 120ML UNISEX EDP": "mancera_coco_vanille",
    "ARABIANS TONKA 100ML EDP": "montale_arabians_tonka",
    "CHERRY CELEBRATION": "nene_beauty_cherry_celebration",
    "1 MILLION EDT 200 ML": "paco_rabanne_1_million",
    "INVICTUS EDT 100ML + 20ML SET": "paco_rabanne_invictus_set_10ml",
    "SET MINI 4 PCZ P. RABANNE": "paco_rabanne_set_mini_4_pcz_p_rabanne",
    "LONDON CALLING FOR HER EDP 80 ML": "pepe_jeans_london_calling_for_her",
    "PARADOXE INTENSE PRADA 50ML MUJER EDP": "prada_paradoxe_intense",
    "TERMO CLASSIC 2,3 LTS H. GREEN": None, # Non-perfume Stanley
    "TERMO COMIDA 0,41LT - 14OZ CLASSIC BLACK 2.0 SPORK": None, # Non-perfume Stanley
    "LYCHEE LUSH GRANDEUR TUBBEES 50ML UNISEX EDP": "tubbees_lychee_lush_grandeur",
    "POUR HOMME EDT 100 ML": "versace_pour",
    "BARE EDP 100 ML": "victoria_s_secret_bare",
    "BARE VANILLA MIST 75 ML + LIP GLOW SET 2 PCS": "victoria_secret_bare_vanilla_set",
    "MINI LS + PS + BV + VP MIST 75 ML SET 4 PCS": "victoria_s_secret_mini_ls",
    "SPICEBOMB DARK LEATHER VIKTOR ROLF 90ML HOMBRE EDP": "viktor_rolf_spicebomb_dark_leather_viktor_rolf",
    "SPICEBOMB INFRARED VIKTOR ROLF 90ML HOMBRE EDT": "viktor_rolf_spicebomb_infrared_viktor_rolf",
    "NAXOS EDP 100 ML": "xerjoff_naxos"
}

# Verify each ID against catalogo
cat_map = {p['id']: p for p in catalogo}

matched_ids = []
missing_ids = []

for desc, pid in explicit_mapping.items():
    if pid is None:
        continue
    if pid in cat_map:
        matched_ids.append((desc, pid, cat_map[pid]))
    else:
        missing_ids.append((desc, pid))

print(f"Total matched items from PDF: {len(matched_ids)}")
print(f"Total missing IDs: {len(missing_ids)}")
if missing_ids:
    for m in missing_ids:
        print("  Missing ID:", m)
