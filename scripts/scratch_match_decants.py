import json

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

with open('scripts/decants_oficiales.json', encoding='utf-8') as f:
    dec = json.load(f)

cat_ids = {p['id']: p for p in cat}
missing = [k for k in dec if k not in cat_ids]

print(f"Total en catálogo: {len(cat)}")
print(f"Total en decants_oficiales: {len(dec)}")
print(f"Missing count: {len(missing)}\n")

for m_id in missing:
    tokens = m_id.split('_')
    matches = []
    for pid, p in cat_ids.items():
        score = sum(1 for t in tokens if len(t) > 2 and (t in pid or t in p['nombre'].lower()))
        if score >= 2:
            matches.append((score, pid, p['nombre']))
    matches.sort(key=lambda x: -x[0])
    print(f"Decant ID: {m_id} (vols: {dec[m_id]})")
    for score, pid, nom in matches[:3]:
        print(f"   cand ({score}): {pid} | {nom}")
