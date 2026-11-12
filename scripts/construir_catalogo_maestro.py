import json
import re

with open('scripts/nuevos_pendientes.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Colores estándar para familias y acordes olfativos (Fragrantica palette)
PALETA_ACORDES = {
    'cítrico': '#B8B939',
    'amaderado': '#8D5524',
    'dulce': '#FF384D',
    'avainillado': '#CBB677',
    'aromático': '#5F9EA0',
    'fresco': '#44A68C',
    'cálido especiado': '#AA331E',
    'fresco especiado': '#3B8B88',
    'afrutados': '#D74423',
    'floral': '#D27B9B',
    'floral blanco': '#E6E6FA',
    'pachulí': '#6F773B',
    'ámbar': '#C87D2A',
    'almizclado': '#797E87',
    'atalcado': '#988E83',
    'verde': '#1F7A28',
    'marino': '#2E8B57',
    'acuático': '#4682B4',
    'cuero': '#8B4513',
    'ahumado': '#4F4F4F',
    'balsámico': '#7D6350',
    'lavanda': '#9370DB',
    'coco': '#C4A972',
    'terrosos': '#4A533C',
    'gourmand': '#BA6B57',
    'café': '#4A2C11',
    'canela': '#B25329',
    'licor': '#9B30FF',
    'tabaco': '#704214',
    'ozónico': '#87CEEB',
    'rosas': '#D27B9B',
    'lactónico': '#86888A',
}

def calcular_decants(precio_botella):
    p = precio_botella
    if p <= 200:
        return [{'ml': 6, 'precioBs': 25}, {'ml': 10, 'precioBs': 40}, {'ml': 20, 'precioBs': 70}]
    elif p <= 350:
        return [{'ml': 6, 'precioBs': 30}, {'ml': 10, 'precioBs': 50}, {'ml': 20, 'precioBs': 90}]
    elif p <= 500:
        return [{'ml': 6, 'precioBs': 40}, {'ml': 10, 'precioBs': 65}, {'ml': 20, 'precioBs': 115}]
    elif p <= 750:
        return [{'ml': 6, 'precioBs': 50}, {'ml': 10, 'precioBs': 75}, {'ml': 20, 'precioBs': 140}]
    elif p <= 1100:
        return [{'ml': 6, 'precioBs': 65}, {'ml': 10, 'precioBs': 95}, {'ml': 20, 'precioBs': 180}]
    elif p <= 1600:
        return [{'ml': 6, 'precioBs': 80}, {'ml': 10, 'precioBs': 125}, {'ml': 20, 'precioBs': 230}]
    elif p <= 2200:
        return [{'ml': 6, 'precioBs': 100}, {'ml': 10, 'precioBs': 160}, {'ml': 20, 'precioBs': 290}]
    else:
        return [{'ml': 6, 'precioBs': 130}, {'ml': 10, 'precioBs': 200}, {'ml': 20, 'precioBs': 380}]

def deducir_perfil_aromatico(marca, nombre, genero):
    nm = f"{marca} {nombre}".lower()
    
    # 1. Determinar acordes según notas y nombre
    acordes_detectados = []
    
    if any(k in nm for k in ['aqua', 'blue', 'dive', 'marine', 'ocean', 'sea', 'cool', 'ice', 'fresh', 'water']):
        acordes_detectados = [('marino', 100), ('cítrico', 85), ('aromático', 75), ('fresco especiado', 65), ('amaderado', 50)]
        clima = {'invierno': 20, 'primavera': 80, 'verano': 100, 'otono': 45, 'dia': 90, 'noche': 40}
        notas = {'salida': ['Bergamota de Calabria', 'Notas marinas', 'Menta fresca'], 'corazon': ['Romero', 'Lavanda', 'Geranio'], 'fondo': ['Cedro', 'Ambroxan', 'Almizcle blanco']}
        desc = f"Una explosión vivificante y magnética de brisa marina y cítricos chispeantes sobre un lecho amaderado sofisticado."
    elif any(k in nm for k in ['oud', 'leather', 'dark', 'black', 'smoke', 'tobacco', 'feu', 'aoud']):
        acordes_detectados = [('amaderado', 100), ('cálido especiado', 88), ('ámbar', 75), ('cuero', 65), ('ahumado', 55)]
        clima = {'invierno': 95, 'primavera': 40, 'verano': 15, 'otono': 90, 'dia': 35, 'noche': 95}
        notas = {'salida': ['Azafrán', 'Nuez moscada', 'Cardamomo'], 'corazon': ['Madera de oud', 'Cuero ahumado', 'Pachulí'], 'fondo': ['Ámbar negro', 'Vainilla Bourbon', 'Sándalo']}
        desc = f"Intensidad de carácter oriental y místico: maderas nobles, cuero ahumado y resinas cálidas que proyectan un aura imponente."
    elif any(k in nm for k in ['sweet', 'candy', 'choc', 'cookie', 'vanilla', 'vainilla', 'caramel', 'cherry', 'pistachio', 'fudge', 'sugar']):
        acordes_detectados = [('dulce', 100), ('avainillado', 85), ('gourmand', 75), ('afrutados', 65), ('lactónico', 50)]
        clima = {'invierno': 85, 'primavera': 55, 'verano': 30, 'otono': 80, 'dia': 70, 'noche': 80}
        notas = {'salida': ['Frutos rojos confitados', 'Almendra dulce'], 'corazon': ['Caramelo tostado', 'Orquídea de vainilla', 'Praliné'], 'fondo': ['Vainilla de Madagascar', 'Haba tonka', 'Almizcle']}
        desc = f"Un capricho olfativo dulce y adictivo: notas de caramelo dorado, vainilla sedosa y matices gourmand irresistibles."
    elif any(k in nm for k in ['rose', 'rosa', 'flower', 'flora', 'blush', 'goddess', 'divine', 'belle', 'girl', 'queen']):
        acordes_detectados = [('floral', 100), ('dulce', 80), ('rosas', 70), ('afrutados', 65), ('atalcado', 55)]
        clima = {'invierno': 45, 'primavera': 95, 'verano': 70, 'otono': 60, 'dia': 85, 'noche': 60}
        notas = {'salida': ['Pera jugosa', 'Mandarina italiana'], 'corazon': ['Rosa de mayo', 'Jazmín sambac', 'Peonía'], 'fondo': ['Almizcle blanco', 'Vainilla suave', 'Cedro']}
        desc = f"Elegancia floral luminosa y cautivadora, donde pétalos aterciopelados se funden con toques frutales y almizcle puro."
    elif any(k in nm for k in ['intense', 'elixir', 'parfum', 'night', 'royal', 'extreme', 'absolu']):
        acordes_detectados = [('ámbar', 100), ('cálido especiado', 85), ('amaderado', 75), ('avainillado', 65), ('aromático', 50)]
        clima = {'invierno': 90, 'primavera': 45, 'verano': 20, 'otono': 85, 'dia': 35, 'noche': 95}
        notas = {'salida': ['Cardamomo oscuro', 'Pimienta rosa'], 'corazon': ['Lavanda francesa', 'Canela de Ceilán'], 'fondo': ['Haba tonka', 'Ámbar extremo', 'Maderas preciosas']}
        desc = f"Concentración profunda y seductora diseñada para dejar una estela imborrable durante la noche."
    else:
        acordes_detectados = [('aromático', 100), ('amaderado', 80), ('cítrico', 70), ('fresco especiado', 60), ('ámbar', 50)]
        clima = {'invierno': 55, 'primavera': 85, 'verano': 70, 'otono': 75, 'dia': 80, 'noche': 65}
        notas = {'salida': ['Bergamota', 'Lavanda fresca', 'Manzana verde'], 'corazon': ['Geranio', 'Pimienta de Sichuan', 'Salvia'], 'fondo': ['Vetiver', 'Cedro del Atlas', 'Ámbar gris']}
        desc = f"Armonía versátil y sofisticada que equilibra frescura aromática con una base amaderada de alta distinción."

    acordes_estructurados = []
    for ac_nom, ac_pct in acordes_detectados:
        color = PALETA_ACORDES.get(ac_nom, '#C8A96A')
        acordes_estructurados.append({
            'nombre': ac_nom,
            'porcentaje': ac_pct,
            'color': color
        })

    etiquetas = [a[0].title() for a in acordes_detectados[:4]]

    return acordes_estructurados, clima, notas, desc, etiquetas

def procesar():
    catalogo_nuevo = []
    vistos = set()

    for it in items:
        marca = it['marca']
        nombre_corto = it['nombre_corto']
        nombre_completo = f"{marca.upper()} {nombre_corto.upper()}".strip()
        
        # ID limpio y url-friendly
        clean_id = re.sub(r'[^a-zA-Z0-9]+', '_', f"{marca}_{nombre_corto}").strip('_').lower()
        clean_id = re.sub(r'_+', '_', clean_id)
        
        if clean_id in vistos:
            continue
        vistos.add(clean_id)

        precios = [p for p in it['precios_botella'] if p > 0]
        precio_botella = min(precios) if precios else 350.0
        ml_botella = it['mls'][0] if it['mls'] else 100

        genero = it['genero']
        tipo = it['tipo']

        acordes, clima, notas, descripcion, etiquetas = deducir_perfil_aromatico(marca, nombre_corto, genero)
        volumenes = [] # Perfumes del inventario son frascos completos, no decants

        query_busqueda = f"{marca} {nombre_corto} perfume bottle white background"

        registro = {
            'id': clean_id,
            'nombre': nombre_completo,
            'marca': marca,
            'tipo': tipo,
            'genero': genero,
            'imagenes': [
                f"https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/{clean_id}.webp?v=2"
            ],
            'volumenes': volumenes,
            'completo': {
                'ml': ml_botella,
                'precioBs': int(precio_botella)
            },
            'activo': True,
            'nuevo': False,
            'destacado': False,
            'descripcion': descripcion,
            'etiquetas': etiquetas,
            'acordes': acordes,
            'clima': clima,
            'notas': notas,
            'query_busqueda': query_busqueda,
            'stock_inventario': sum(it['stocks'])
        }

        catalogo_nuevo.append(registro)

    print(f"Total perfumes listos para procesar imágenes: {len(catalogo_nuevo)}")
    with open('scripts/catalogo_preparado.json', 'w', encoding='utf-8') as f:
        json.dump(catalogo_nuevo, f, ensure_ascii=False, indent=2)
    print("Guardado en scripts/catalogo_preparado.json")

if __name__ == '__main__':
    procesar()
