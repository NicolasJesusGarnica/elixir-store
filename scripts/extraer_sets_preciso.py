import re

with open('scripts/raw_pdf_lines.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

targets = [
    'SUPREMACY NOT ONLY INTENSE',
    'MOUSUF',
    'HALLOWEEN WOM',
    'FULL HOUSE',
    'WILDCARD',
    'CK ONE',
    'EUPHORIA WOMEN',
    'GODDESS',
    'HER EDP',
    'HER EDT',
    'BOSS BOTTLED',
    'ASAD',
    'BADEE AL OUD',
    'KHAMRAH',
    'THE KINGDOM',
    'YARA',
    'NEBRAS',
    'AMBER ROUGE',
    'EROS FLAME',
    'BARBIE',
    'BATMAN',
    'BOB ESPONJA',
    'EAU MY BB',
    'EAU MY UNICORN',
    'FROZEN',
    'CAPITAN AMERICA',
    'MINECRAFT',
    'SPIDERMAN',
    'INVICTUS',
    'BARE VANILLA'
]

rows = []
curr = ''
for line in lines:
    line = re.sub(r'^PAG \d+:\s*', '', line).strip()
    if not line or any(h in line for h in ['ELIXIR - REPORTES', 'Generador por', 'ESTADO:', 'CODIGO ITEM', 'LINEA:']):
        continue
    m = re.search(r'(\d+\.\d{2})\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})$', line)
    if m:
        full = (curr + ' ' + line).strip() if curr else line
        curr = ''
        cant_v, cant_min, cant, costo, precio = m.groups()
        rows.append({
            'full': full,
            'precio': float(precio),
            'costo': float(costo),
            'cant': float(cant)
        })
    else:
        curr = (curr + ' ' + line).strip() if curr else line

found_map = {}
for r in rows:
    f_upper = r['full'].upper()
    for t in targets:
        if t in f_upper:
            if any(k in r['full'].lower() for k in ['set', 'estuche', 'bl', 'sg', 'neceser', 'teddy', 'lonchera', 'mochila', 'mini', 'bs', 'mist', 'lip']):
                found_map[r['full']] = r

print(f"Total matching sets found: {len(found_map)}")
for full, r in sorted(found_map.items(), key=lambda x: x[1]['precio']):
    print(f"Bs {r['precio']:>6.1f} | Stock: {r['cant']:>4.1f} | {full}")
