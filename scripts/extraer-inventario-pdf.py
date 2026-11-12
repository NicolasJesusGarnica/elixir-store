import pypdf
import re
import json

PDF_PATH = r'C:\Users\njgar\.gemini\antigravity\brain\d730f7fa-6104-4e26-9d77-427391740b10\.user_uploaded\media_1794191566785_c4cf0e6b.pdf'

def normalizar_cadena(s):
    return re.sub(r'\s+', ' ', s).strip()

def es_no_perfume(desc, marca):
    d = desc.upper()
    m = marca.upper()
    if 'STANLEY' in d or 'STANLEY' in m or 'TERMO' in d:
        return True
    if 'DECANT DE PERFUME' in d:
        return True
    # Desodorantes solos (no sets)
    if 'DESODORANTE' in d and not any(k in d for k in ['EDP', 'EDT', 'PARFUM', 'SET']):
        return True
    # Jabones o shower gels solos
    if ('SHOWER GEL' in d or 'SHAMPOO' in d) and not any(k in d for k in ['EDP', 'EDT', 'PARFUM', 'SET']):
        return True
    # Cosméticos
    if any(k in d for k in ['LABIAL', 'GLOSS NENE', 'CREMA VICTORIA SECRET', 'FIDGET TOY']):
        return True
    return False

def extraer_items():
    reader = pypdf.PdfReader(PDF_PATH)
    items = []
    pattern = re.compile(r'GENERAL\s+(.+?)\s+(\d+\.\d{2})\s+(\d+)\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})$')

    marca_vigente = 'DESCONOCIDA'

    for page_idx, page in enumerate(reader.pages):
        text = page.extract_text()
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        for i, line in enumerate(lines):
            match = pattern.search(line)
            if match:
                desc = match.group(1).strip()
                cant_vendida = float(match.group(2))
                cant_min = int(match.group(3))
                stock = float(match.group(4))
                costo = float(match.group(5))
                precio = float(match.group(6))

                marca_detectada = ''
                categoria = 'UNISEX'
                unidad_idx = -1

                for k in range(1, 8):
                    if i - k >= 0 and 'UNIDAD' in lines[i - k]:
                        unidad_idx = i - k
                        break

                if unidad_idx != -1:
                    u_line = lines[unidad_idx]
                    parts = u_line.replace('UNIDAD', '').strip().split()
                    if parts and parts[-1] in ['HOMBRE', 'MUJER', 'UNISEX', 'GENERAL']:
                        categoria = parts[-1]
                        brand_parts = parts[:-1]
                    else:
                        brand_parts = parts

                    # Buscar líneas adicionales hacia arriba (por si la marca ocupó 2 líneas)
                    for b_idx in range(unidad_idx - 1, max(-1, unidad_idx - 4), -1):
                        prev_l = lines[b_idx]
                        if re.match(r'^\d+$', prev_l) or 'GENERAL' in prev_l or '(BIENES)' in prev_l or 'CODIGO' in prev_l:
                            break
                        cleaned_tok = re.sub(r'^\d+\s*', '', prev_l).strip()
                        if cleaned_tok and not re.match(r'^\d+$', cleaned_tok):
                            brand_parts.insert(0, cleaned_tok)

                    if brand_parts:
                        cand = ' '.join(brand_parts).strip()
                        cand = re.sub(r'^\d+\s*', '', cand).strip()
                        if cand and cand not in ['HOMBRE', 'MUJER', 'UNISEX', 'GENERAL']:
                            marca_detectada = cand

                if marca_detectada:
                    marca_vigente = marca_detectada

                marca_final = marca_vigente

                # Inferencia por descripción si la marca sigue ambigua
                desc_up = desc.upper()
                if 'JEAN PAUL GAULTIER' in desc_up or 'LE MALE' in desc_up or 'SCANDAL' in desc_up or 'LE BEAU' in desc_up:
                    marca_final = 'JEAN PAUL GAULTIER'
                elif 'CAROLINA HERRERA' in desc_up or '212' in desc_up or 'GOOD GIRL' in desc_up or 'BAD BOY' in desc_up:
                    marca_final = 'CAROLINA HERRERA'
                elif 'ANTONIO BANDERAS' in desc_up or 'BLUE SEDUCTION' in desc_up or 'GOLDEN SECRET' in desc_up:
                    marca_final = 'ANTONIO BANDERAS'
                elif 'ACQUA DI GIO' in desc_up or 'ARMANI CODE' in desc_up or 'SI PASSIONE' in desc_up:
                    marca_final = 'GIORGIO ARMANI'
                elif 'STRONGER WITH YOU' in desc_up or 'IN LOVE WITH YOU' in desc_up:
                    marca_final = 'EMPORIO ARMANI'
                elif 'GAME OF SPADES' in desc_up:
                    marca_final = 'GAME OF SPADES'
                elif 'LATTAFA' in desc_up or 'ASAD' in desc_up or 'KHAMRAH' in desc_up or 'YARA' in desc_up or 'ECLAIRE' in desc_up:
                    marca_final = 'LATTAFA'
                elif 'ARMAF' in desc_up or 'CLUB DE NUIT' in desc_up or 'ODYSSEY' in desc_up:
                    marca_final = 'ARMAF'
                elif 'VERSACE' in desc_up or 'EROS' in desc_up or 'DYLAN BLUE' in desc_up:
                    marca_final = 'VERSACE'
                elif 'PACO RABANNE' in desc_up or 'INVICTUS' in desc_up or 'ONE MILLION' in desc_up or '1 MILLION' in desc_up or 'FAME' in desc_up:
                    marca_final = 'PACO RABANNE'
                elif 'PARFUMS DE MARLY' in desc_up or 'ALTHAIR' in desc_up:
                    marca_final = 'PARFUMS DE MARLY'
                elif 'XERJOFF' in desc_up or 'ERBA PURA' in desc_up or 'NAXOS' in desc_up:
                    marca_final = 'XERJOFF'

                if es_no_perfume(desc, marca_final):
                    continue

                items.append({
                    'marca': normalizar_cadena(marca_final),
                    'genero_inventario': 'Hombre' if categoria == 'HOMBRE' else ('Mujer' if categoria == 'MUJER' else 'Unisex'),
                    'descripcion': normalizar_cadena(desc),
                    'stock': stock,
                    'costo': costo,
                    'precio_botella': precio,
                    'pagina': page_idx + 1
                })

    return items

if __name__ == '__main__':
    items = extraer_items()
    print(f'Total de registros de perfumes extraídos del PDF: {len(items)}')
    with open('scripts/inventario_extraido.json', 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    print('Guardado en scripts/inventario_extraido.json')
