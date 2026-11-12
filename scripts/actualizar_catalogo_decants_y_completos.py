import json

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

with open('scripts/decants_oficiales.json', encoding='utf-8') as f:
    dec = json.load(f)

with open('scripts/inventario_extraido.json', encoding='utf-8') as f:
    inv = json.load(f)

# Build a lookup map of PDF items
def buscar_pdf(marca, nombre):
    nom_u = nombre.upper()
    marca_u = marca.upper()
    for item in inv:
        desc = f"{item['marca']} {item['descripcion']}".upper()
        # Direct key matches
        if 'TERIAQ INTENSE' in nom_u and 'TERIAQ INTENSE' in desc:
            return item
        if 'BHARARA KING' in nom_u and 'BHARARA KING' in desc:
            return item
        if 'HAWAS ICE' in nom_u and 'HAWAS ICE' in desc:
            return item
        if '9 AM DIVE' in nom_u and '9 AM DIVE' in desc:
            return item
        if 'CANDEE' in nom_u and 'CANDEE' in desc:
            return item
        if 'ZANZIBAR' in nom_u and 'ZANZIBAR' in desc:
            return item

    # Word match
    tokens = [w for w in nom_u.split() if len(w) > 2 and w not in ['EDP', 'EDT', 'PARFUM', 'INTENSE', 'ELIXIR', 'HOMBRE', 'MUJER', 'UNISEX', 'COLONIA']]
    best = None
    best_score = 0
    for item in inv:
        desc = f"{item['marca']} {item['descripcion']}".upper()
        score = sum(1 for t in tokens if t in desc)
        if score > best_score and score >= len(tokens) * 0.7:
            best_score = score
            best = item
    return best

# Aliases between decant keys and catalog IDs
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

cat_ids = {p['id'] for p in cat}

# Add lattafa_asad_zanzibar and antonio_banderas_icon_splendid_80 if missing
with open('scripts/catalogo_preparado.json', encoding='utf-8') as f:
    prep = json.load(f)
prep_by_id = {p['id']: p for p in prep}

for needed_id in ['lattafa_asad_zanzibar', 'antonio_banderas_icon_splendid_80']:
    if needed_id not in cat_ids and needed_id in prep_by_id:
        print(f"Adding {needed_id} from catalogo_preparado to catalog")
        cat.append(prep_by_id[needed_id])
        cat_ids.add(needed_id)

# Map decants
catalog_decant_count = 0
for p in cat:
    pid = p['id']
    # Check if pid is in dec or aliased
    target_dec_key = None
    if pid in dec:
        target_dec_key = pid
    else:
        for d_key, mapped_pid in aliases.items():
            if mapped_pid == pid and d_key in dec:
                target_dec_key = d_key
                break

    if target_dec_key:
        p['volumenes'] = dec[target_dec_key]
        catalog_decant_count += 1
        # Also ensure p['completo'] has bottle size & price from PDF
        if not p.get('completo') or not p['completo'].get('precioBs'):
            pdf_match = buscar_pdf(p['marca'], p['nombre'])
            if pdf_match:
                # extract ml
                import re
                m = re.search(r'\b(\d+)\s*ML\b', pdf_match['descripcion'], re.IGNORECASE)
                ml = int(m.group(1)) if m else 100
                p['completo'] = {'ml': ml, 'precioBs': int(pdf_match['precio_botella'])}
            else:
                p['completo'] = {'ml': 100, 'precioBs': 350}
    else:
        # STRICT RULE: If it does not have real decants, volumenes MUST be empty!
        p['volumenes'] = []
        # And ensure completo exists
        if not p.get('completo') or not p['completo'].get('precioBs'):
            pdf_match = buscar_pdf(p['marca'], p['nombre'])
            if pdf_match:
                import re
                m = re.search(r'\b(\d+)\s*ML\b', pdf_match['descripcion'], re.IGNORECASE)
                ml = int(m.group(1)) if m else 100
                p['completo'] = {'ml': ml, 'precioBs': int(pdf_match['precio_botella'])}
            else:
                p['completo'] = {'ml': 100, 'precioBs': 350}

print(f"\nTotal perfumes en catálogo: {len(cat)}")
print(f"Total perfumes con decants asignados: {catalog_decant_count}")
print(f"Total perfumes solo botella completa: {len(cat) - catalog_decant_count}")

with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(cat, f, ensure_ascii=False, indent=2)

print("Catalogo src/assets/perfumes.json guardado con éxito.")
