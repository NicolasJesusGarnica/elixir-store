import json

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

with open('scripts/decants_oficiales.json', encoding='utf-8') as f:
    dec = json.load(f)

missing = [k for k in dec if k not in {p['id'] for p in cat}]

print("MAPPING THE 23 MISSING ONES:")
for m in missing:
    print(f"\n--- Decant ID: {m} ---")
    # search in cat
    for p in cat:
        # Check by keywords
        p_name = p['nombre'].lower()
        p_id = p['id'].lower()
        if m == 'ab_icon_men_edp' and 'icon' in p_name and 'antonio' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'ab_queen_of_seduction' and 'queen of seduction' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'acqua_di_gio_edp' and 'acqua' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m.startswith('ag_') and 'ariana' in p_name:
            sub = m.replace('ag_', '').replace('_', ' ')
            if any(w in p_name for w in sub.split()):
                print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'asad_zanzibar' and 'zanzibar' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'billie_eilish_negro' and 'eilish' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'hawas_for_him' and 'hawas' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'icon_a_banderas_women' and 'icon' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'jp_halloween_mujer' and 'halloween' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'jpg_le_classique_edp' and 'classique' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif 'odyssey' in m and 'odyssey' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'pepe_l_indulgence_for_her' and 'indulgence' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
        elif m == 'stronger_with_you_in' and 'stronger' in p_name:
            print(f"Match: {p['id']} -> {p['nombre']}")
