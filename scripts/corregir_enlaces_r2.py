import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

with open('scripts/progreso_r2.json', encoding='utf-8') as f:
    prog_r2 = json.load(f)

# Build a clean dictionary of verified R2 URLs
r2_map = {k: v['r2_url'] for k, v in prog_r2.items() if v.get('status') == 'ok'}

print(f"Total perfumes en catalogo: {len(cat)}")
print(f"Total imagenes validas en R2: {len(r2_map)}")

# Mapping logic
def resolver_url_r2(p):
    pid = p['id']
    nombre = p['nombre'].upper()
    marca = p['marca'].upper()
    
    # 1. Coincidencia exacta con pid
    if pid in r2_map:
        return r2_map[pid]
        
    # 2. Casos AV -> Air-Val
    if pid.startswith('av_') or pid.startswith('t_av_'):
        clave = pid.replace('t_av_', 'air_val_').replace('av_', 'air_val_')
        # Limpiar repeticiones como air_val_eau_my_bb_eau_my_bb -> air_val_eau_my_bb
        partes = clave.split('_')
        # deduplicar partes consecutivas
        dedup = []
        for x in partes:
            if not dedup or dedup[-1] != x:
                dedup.append(x)
        dedup_clave = '_'.join(dedup)
        if dedup_clave in r2_map:
            return r2_map[dedup_clave]
        if clave in r2_map:
            return r2_map[clave]
            
        # Buscar en air_val_*
        for k in r2_map:
            if k.startswith('air_val_'):
                sub = k.replace('air_val_', '')
                if sub in pid:
                    return r2_map[k]

    # 3. Casos por prefijo de marca
    # ej: 9_am_dive -> afnan_9_am_dive
    marca_clean = p['marca'].lower().replace(' ', '_').replace('-', '_').replace('&', '').strip()
    candidato_marca = f"{marca_clean}_{pid}"
    if candidato_marca in r2_map:
        return r2_map[candidato_marca]

    # 4. Búsqueda por coincidencia de tokens en el nombre
    tokens = [w for w in nombre.split() if len(w) > 2 and w not in ['EDP', 'EDT', 'PARFUM', 'SPRAY', 'BODY', '100', '200', 'TESTER', 'COLONIA']]
    candidatos = []
    for k, url in r2_map.items():
        score = sum(1 for t in tokens if t.lower() in k)
        if score >= len(tokens) * 0.7:
            candidatos.append((score, k, url))
            
    if candidatos:
        candidatos.sort(key=lambda x: -x[0])
        return candidatos[0][2]

    # Si ya tiene una URL en R2 que termina en .webp, mantenerla como fallback
    if p.get('imagenes') and p['imagenes'][0].startswith('https://pub-'):
        return p['imagenes'][0]

    return None

actualizados = 0
for p in cat:
    antigua = p['imagenes'][0] if p.get('imagenes') else None
    nueva = resolver_url_r2(p)
    if nueva and nueva != antigua:
        p['imagenes'] = [nueva]
        actualizados += 1
        if 'bb' in p['id'] or actualizados <= 15:
            print(f"[{p['id']}] {antigua} -> {nueva}")

print(f"\nTotal imágenes corregidas / re-enlazadas: {actualizados}")

with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(cat, f, ensure_ascii=False, indent=2)

print("src/assets/perfumes.json actualizado con URLs exactas de R2.")
