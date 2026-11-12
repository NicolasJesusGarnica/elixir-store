import json

sets_data = [
    {
        "id": "afnan_supremacy_not_only_intense_set",
        "nombre": "AFNAN SUPREMACY NOT ONLY INTENSE SET (EDP 100ML + SG 150ML + DEO 75ML)",
        "marca": "Afnan",
        "tipo": "Árabe",
        "genero": "Hombre",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/afnan_supremacy_not_only_intense_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 640},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Exclusivo set de lujo de Afnan que incluye el prestigioso Supremacy Not Only Intense Extrait de Parfum de 100ml, gel de ducha aromático de 150ml y spray desodorante de 75ml. Una composición potente, frutal y ahumada con grosella negra, bergamota, musgo de roble y ámbar gris.",
        "etiquetas": ["Afrutado", "Ahumado", "Amaderado", "Cítrico", "Musgoso"],
        "notas": {
            "salida": ["Grosella negra", "Bergamota", "Manzana"],
            "corazon": ["Musgo de roble", "Pachulí", "Lavanda"],
            "fondo": ["Ámbar gris", "Almizcle", "Azafrán"]
        },
        "acordes": [
            {"nombre": "afrutados", "porcentaje": 100, "color": "#E91E63"},
            {"nombre": "amaderado", "porcentaje": 85, "color": "#8D5524"},
            {"nombre": "musgoso", "porcentaje": 80, "color": "#556B2F"},
            {"nombre": "cítrico", "porcentaje": 70, "color": "#FFC107"},
            {"nombre": "ahumado", "porcentaje": 65, "color": "#607D8B"}
        ],
        "clima": {"invierno": 80, "primavera": 85, "verano": 75, "otono": 90, "dia": 80, "noche": 95},
        "stock_inventario": 0
    },
    {
        "id": "mousuf_edp_set",
        "nombre": "ARD AL ZAAFARAN MOUSUF SET (EDP 100ML + BS 250ML + DESO 300ML)",
        "marca": "Ard Al Zaafaran",
        "tipo": "Árabe",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/mousuf_edp_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 290},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set completo Mousuf de Ard Al Zaafaran con 3 piezas: Eau de Parfum de 100ml en saco artesanal, body spray de 250ml y desodorante en aerosol de 300ml. Fragancia gourmand oriental cautivadora con notas de uvas chocolatosas, madera de agar oud y caramelo tentador.",
        "etiquetas": ["Dulce", "Afrutado", "Chocolate", "Oud", "Amaderado"],
        "notas": {
            "salida": ["Uvas", "Chocolate", "Caramelo"],
            "corazon": ["Oud", "Almizcle", "Notas florales"],
            "fondo": ["Tabaco", "Madera de cedro", "Ámbar"]
        },
        "acordes": [
            {"nombre": "dulce", "porcentaje": 100, "color": "#FF4081"},
            {"nombre": "afrutados", "porcentaje": 85, "color": "#9C27B0"},
            {"nombre": "chocolate", "porcentaje": 80, "color": "#5D4037"},
            {"nombre": "amaderado", "porcentaje": 75, "color": "#795548"},
            {"nombre": "cálido especiado", "porcentaje": 70, "color": "#D84315"}
        ],
        "clima": {"invierno": 90, "primavera": 70, "verano": 50, "otono": 85, "dia": 70, "noche": 90},
        "stock_inventario": 6
    },
    {
        "id": "jesus_del_pozo_halloween_women_set",
        "nombre": "JESUS DEL POZO HALLOWEEN WOMEN SET (EDT 100ML + MINI + BL 150ML + SG 150ML)",
        "marca": "Jesus Del Pozo",
        "tipo": "Diseñador",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/jesus_del_pozo_halloween_women_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 590},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Edición estuche de 4 piezas de Halloween Women por Jesús del Pozo: frasco principal EDT 100ml, miniatura de colección para bolso, loción corporal hidratante (BL) de 150ml y gel de baño (SG) de 150ml. Un aroma floral semi-oriental enigmático y cautivador.",
        "etiquetas": ["Atalcado", "Floral Blanco", "Violeta", "Acuático", "Avainillado"],
        "notas": {
            "salida": ["Violeta", "Notas marinas", "Plátano", "Petit grain"],
            "corazon": ["Violeta", "Magnolia", "Lirio de los valles", "Tuberosa", "Pimienta"],
            "fondo": ["Incienso", "Vainilla de Madagascar", "Sándalo", "Mirra"]
        },
        "acordes": [
            {"nombre": "atalcado", "porcentaje": 100, "color": "#BA68C8"},
            {"nombre": "floral blanco", "porcentaje": 85, "color": "#E0E0E0"},
            {"nombre": "violeta", "porcentaje": 85, "color": "#7B1FA2"},
            {"nombre": "acuático", "porcentaje": 70, "color": "#00BCD4"},
            {"nombre": "avainillado", "porcentaje": 65, "color": "#FBC02D"}
        ],
        "clima": {"invierno": 70, "primavera": 90, "verano": 80, "otono": 80, "dia": 85, "noche": 80},
        "stock_inventario": 5
    },
    {
        "id": "game_of_spades_full_house_set",
        "nombre": "JO MILANO GAME OF SPADES FULL HOUSE SET (PARFUM 100ML + 7.5ML + BL 200ML + SG 200ML)",
        "marca": "Jo Milano Paris",
        "tipo": "Nicho",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/game_of_spades_full_house_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 1190},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Suntuoso set de alta perfumería de la colección Game of Spades: Full House Parfum 100ml, atomizador de viaje de 7.5ml, crema corporal perfumada de 200ml y gel de ducha de 200ml en cofre de lujo. Una firma olfativa opulenta con maderas nobles, ámbar y especias finas.",
        "etiquetas": ["Floral", "Afrutado", "Amaderado", "Fresco Especiado", "Ámbar"],
        "notas": {
            "salida": ["Bergamota", "Ruibarbo", "Lichi"],
            "corazon": ["Rosa turca", "Peonía", "Vainilla"],
            "fondo": ["Cashmeran", "Cedro", "Incienso", "Vetiver"]
        },
        "acordes": [
            {"nombre": "floral", "porcentaje": 100, "color": "#E91E63"},
            {"nombre": "afrutados", "porcentaje": 85, "color": "#FF4081"},
            {"nombre": "amaderado", "porcentaje": 80, "color": "#8D6E63"},
            {"nombre": "fresco especiado", "porcentaje": 75, "color": "#26A69A"},
            {"nombre": "ámbar", "porcentaje": 70, "color": "#FFA726"}
        ],
        "clima": {"invierno": 85, "primavera": 80, "verano": 65, "otono": 90, "dia": 75, "noche": 95},
        "stock_inventario": 4
    },
    {
        "id": "game_of_spades_wildcard_set",
        "nombre": "JO MILANO GAME OF SPADES WILDCARD SET (PARFUM 100ML + 7.5ML + BL 200ML + SG 200ML)",
        "marca": "Jo Milano Paris",
        "tipo": "Nicho",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/game_of_spades_wildcard_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 1190},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Cofre de edición limitada Game of Spades Wildcard: Parfum de 100ml, atomizador de viaje recargable de 7.5ml, loción sedosa de 200ml y shower gel de 200ml. Perfil aromático magnético con notas florales ambaradas y matices amaderados de alta concentración.",
        "etiquetas": ["Ámbar", "Almendrado", "Cálido Especiado", "Amaderado", "Metálico"],
        "notas": {
            "salida": ["Jazmín", "Azafrán", "Flores blancas"],
            "corazon": ["Ámbar gris", "Almendra amarga", "Cedro"],
            "fondo": ["Resina de abeto", "Almizcle", "Ambroxan"]
        },
        "acordes": [
            {"nombre": "ámbar", "porcentaje": 100, "color": "#FF9800"},
            {"nombre": "almendrado", "porcentaje": 85, "color": "#D7CCC8"},
            {"nombre": "cálido especiado", "porcentaje": 80, "color": "#BF360C"},
            {"nombre": "amaderado", "porcentaje": 75, "color": "#5D4037"},
            {"nombre": "metálico", "porcentaje": 60, "color": "#90A4AE"}
        ],
        "clima": {"invierno": 90, "primavera": 75, "verano": 60, "otono": 90, "dia": 70, "noche": 95},
        "stock_inventario": 5
    },
    {
        "id": "calvin_klein_ck_one_set",
        "nombre": "CALVIN KLEIN CK ONE SET (EDT 100ML + SHOWER GEL 100ML)",
        "marca": "Calvin Klein",
        "tipo": "Diseñador",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/calvin_klein_ck_one_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 400},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Dúo esencial del revolucionario CK One de Calvin Klein: Eau de Toilette de 100ml y gel de baño energizante de 100ml. El clásico unisex por excelencia, limpio, fresco y cítrico con té verde, piña y almizcles transparentes.",
        "etiquetas": ["Cítrico", "Verde", "Fresco", "Aromático", "Amaderado"],
        "notas": {
            "salida": ["Limón", "Bergamota", "Piña", "Cardamomo", "Papaya"],
            "corazon": ["Lirio de los valles", "Jazmín", "Violeta", "Nuez moscada", "Rosa"],
            "fondo": ["Té verde", "Almizcle", "Cedro", "Sándalo", "Ámbar"]
        },
        "acordes": [
            {"nombre": "cítrico", "porcentaje": 100, "color": "#FFEB3B"},
            {"nombre": "verde", "porcentaje": 90, "color": "#4CAF50"},
            {"nombre": "fresco", "porcentaje": 85, "color": "#80DEEA"},
            {"nombre": "aromático", "porcentaje": 75, "color": "#26A69A"},
            {"nombre": "amaderado", "porcentaje": 60, "color": "#8D6E63"}
        ],
        "clima": {"invierno": 45, "primavera": 90, "verano": 95, "otono": 70, "dia": 95, "noche": 60},
        "stock_inventario": 0
    },
    {
        "id": "calvin_klein_euphoria_women_set",
        "nombre": "CALVIN KLEIN EUPHORIA WOMEN SET (EDP 100ML + BODY LOTION 100ML)",
        "marca": "Calvin Klein",
        "tipo": "Diseñador",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/calvin_klein_euphoria_women_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 650},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set seductor de Calvin Klein Euphoria Women: Eau de Parfum de 100ml junto a loción hidratante para el cuerpo de 100ml. Una fragancia floral oriental misteriosa que despierta los sentidos con granada brillante, orquídea negra y ámbar líquido.",
        "etiquetas": ["Amaderado", "Floral", "Dulce", "Afrutado", "Empolvado"],
        "notas": {
            "salida": ["Granada", "Caqui", "Acorde verde"],
            "corazon": ["Orquídea negra", "Flor de loto", "Champaca"],
            "fondo": ["Ámbar líquido", "Caoba", "Violeta negra", "Crema batida"]
        },
        "acordes": [
            {"nombre": "amaderado", "porcentaje": 100, "color": "#6D4C41"},
            {"nombre": "floral", "porcentaje": 85, "color": "#AB47BC"},
            {"nombre": "dulce", "porcentaje": 80, "color": "#EC407A"},
            {"nombre": "afrutados", "porcentaje": 75, "color": "#C2185B"},
            {"nombre": "empolvado", "porcentaje": 65, "color": "#CE93D8"}
        ],
        "clima": {"invierno": 90, "primavera": 70, "verano": 55, "otono": 85, "dia": 65, "noche": 95},
        "stock_inventario": 3
    },
    {
        "id": "burberry_her_edp_set_bl",
        "nombre": "BURBERRY HER EDP SET (EDP 50ML + BODY LOTION 75ML)",
        "marca": "Burberry",
        "tipo": "Diseñador",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/burberry_her_edp_set_bl.webp"],
        "volumenes": [],
        "completo": {"ml": 50, "precioBs": 780},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Elegante set británico Burberry Her: frasco Eau de Parfum de 50ml y loción perfumada para cuerpo de 75ml. Captura el espíritu vibrante de Londres con una explosión gourmand de frutos rojos, jazmín y fondo de ámbar almizclado.",
        "etiquetas": ["Afrutado", "Dulce", "Amaderado", "Empolvado", "Almizclado"],
        "notas": {
            "salida": ["Fresa", "Frambuesa", "Mora", "Cereza ácida", "Grosella negra"],
            "corazon": ["Violeta", "Jazmín"],
            "fondo": ["Almizcle", "Vainilla", "Ámbar", "Cashmeran", "Pachulí"]
        },
        "acordes": [
            {"nombre": "afrutados", "porcentaje": 100, "color": "#E91E63"},
            {"nombre": "dulce", "porcentaje": 90, "color": "#F06292"},
            {"nombre": "amaderado", "porcentaje": 75, "color": "#8D6E63"},
            {"nombre": "empolvado", "porcentaje": 70, "color": "#E1BEE7"},
            {"nombre": "almizclado", "porcentaje": 65, "color": "#B0BEC5"}
        ],
        "clima": {"invierno": 75, "primavera": 90, "verano": 80, "otono": 85, "dia": 85, "noche": 80},
        "stock_inventario": 1
    },
    {
        "id": "burberry_goddess_edp_set",
        "nombre": "BURBERRY GODDESS EDP SET (EDP 100ML + TRAVEL SPRAY 10ML)",
        "marca": "Burberry",
        "tipo": "Diseñador",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/burberry_goddess_edp_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 1210},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Set de prestigio Burberry Goddess: frasco recargable EDP 100ml y vaporizador de cartera de 10ml. Una oda a la fuerza y elegancia femenina orquestada alrededor de un trío de vainillas de Madagascar con infusión de lavanda radiante.",
        "etiquetas": ["Avainillado", "Dulce", "Aromático", "Lavanda", "Cálido Especiado"],
        "notas": {
            "salida": ["Infusión de vainilla", "Lavanda", "Cacao", "Jengibre"],
            "corazon": ["Caviar de vainilla"],
            "fondo": ["Absoluto de vainilla"]
        },
        "acordes": [
            {"nombre": "avainillado", "porcentaje": 100, "color": "#FDD835"},
            {"nombre": "dulce", "porcentaje": 85, "color": "#FFB74D"},
            {"nombre": "aromático", "porcentaje": 80, "color": "#7E57C2"},
            {"nombre": "lavanda", "porcentaje": 75, "color": "#9575CD"},
            {"nombre": "cálido especiado", "porcentaje": 65, "color": "#D84315"}
        ],
        "clima": {"invierno": 85, "primavera": 80, "verano": 65, "otono": 85, "dia": 80, "noche": 90},
        "stock_inventario": 6
    },
    {
        "id": "burberry_her_edt_set",
        "nombre": "BURBERRY HER EDT SET (EDT 50ML + TRAVEL SPRAY 10ML)",
        "marca": "Burberry",
        "tipo": "Diseñador",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/burberry_her_edt_set.webp"],
        "volumenes": [],
        "completo": {"ml": 50, "precioBs": 680},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set luminoso Burberry Her Eau de Toilette: frasco de 50ml más spray de bolsillo de 10ml. Una reinterpretación floral frutal chispeante con flor de peonía floreciente, pera verde jugosa y fondo de madreselva con cedro.",
        "etiquetas": ["Floral", "Fresco", "Afrutado", "Verde", "Almizclado"],
        "notas": {
            "salida": ["Pera verde", "Fresa", "Grosella negra", "Pimienta rosa"],
            "corazon": ["Peonía", "Rosa", "Lirio de los valles", "Madreselva"],
            "fondo": ["Almizcle", "Cedro"]
        },
        "acordes": [
            {"nombre": "floral", "porcentaje": 100, "color": "#F48FB1"},
            {"nombre": "fresco", "porcentaje": 85, "color": "#80CBC4"},
            {"nombre": "afrutados", "porcentaje": 80, "color": "#FF8A80"},
            {"nombre": "verde", "porcentaje": 70, "color": "#81C784"},
            {"nombre": "almizclado", "porcentaje": 65, "color": "#CFD8DC"}
        ],
        "clima": {"invierno": 50, "primavera": 95, "verano": 90, "otono": 75, "dia": 95, "noche": 70},
        "stock_inventario": 1
    },
    {
        "id": "burberry_mini_set_4pcs",
        "nombre": "BURBERRY MINIATURES SET 4 PCS (HER EDP 5ML X2 + GODDESS EDP 5ML X2)",
        "marca": "Burberry",
        "tipo": "Diseñador",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/burberry_mini_set_4pcs.webp"],
        "volumenes": [],
        "completo": {"ml": 20, "precioBs": 550},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Cofre de coleccionista con 4 miniaturas de lujo Burberry en réplicas exactas de 5ml: dos frascos de Burberry Her EDP y dos frascos de Burberry Goddess EDP. Ideal para regalo o viaje.",
        "etiquetas": ["Dulce", "Avainillado", "Afrutado", "Amaderado", "Empolvado"],
        "notas": {
            "salida": ["Frutos rojos", "Lavanda", "Infusión de vainilla"],
            "corazon": ["Caviar de vainilla", "Jazmín", "Violeta"],
            "fondo": ["Absoluto de vainilla", "Ámbar", "Almizcle"]
        },
        "acordes": [
            {"nombre": "dulce", "porcentaje": 100, "color": "#F06292"},
            {"nombre": "avainillado", "porcentaje": 90, "color": "#FDD835"},
            {"nombre": "afrutados", "porcentaje": 85, "color": "#E91E63"},
            {"nombre": "amaderado", "porcentaje": 70, "color": "#8D6E63"},
            {"nombre": "empolvado", "porcentaje": 65, "color": "#CE93D8"}
        ],
        "clima": {"invierno": 80, "primavera": 85, "verano": 70, "otono": 85, "dia": 85, "noche": 85},
        "stock_inventario": 1
    },
    {
        "id": "hugo_boss_bottled_set",
        "nombre": "HUGO BOSS BOSS BOTTLED SET (EDT 100ML + DEO SPRAY 150ML)",
        "marca": "Hugo Boss",
        "tipo": "Diseñador",
        "genero": "Hombre",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/hugo_boss_bottled_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 620},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Estuche icónico del hombre contemporáneo Boss Bottled por Hugo Boss: Eau de Toilette 100ml y desodorante spray antitranspirante de alta duración. Notas equilibradas de manzana crujiente, canela cálida y maderas nobles.",
        "etiquetas": ["Amaderado", "Afrutado", "Canela", "Cálido Especiado", "Avainillado"],
        "notas": {
            "salida": ["Manzana", "Ciruela", "Limón", "Bergamota", "Musgo de roble"],
            "corazon": ["Canela", "Caoba", "Clavel"],
            "fondo": ["Vainilla", "Sándalo", "Cedro", "Vetiver", "Olivo"]
        },
        "acordes": [
            {"nombre": "amaderado", "porcentaje": 100, "color": "#795548"},
            {"nombre": "afrutados", "porcentaje": 85, "color": "#8BC34A"},
            {"nombre": "canela", "porcentaje": 85, "color": "#A1887F"},
            {"nombre": "cálido especiado", "porcentaje": 80, "color": "#E64A19"},
            {"nombre": "avainillado", "porcentaje": 70, "color": "#FFCA28"}
        ],
        "clima": {"invierno": 80, "primavera": 85, "verano": 65, "otono": 90, "dia": 90, "noche": 80},
        "stock_inventario": 1
    },
    {
        "id": "lattafa_asad_set",
        "nombre": "LATTAFA ASAD SET (EDP 100ML + DEO SPRAY 200ML)",
        "marca": "Lattafa",
        "tipo": "Árabe",
        "genero": "Hombre",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/lattafa_asad_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 380},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set de poder masculino Lattafa Asad: Eau de Parfum de 100ml y desodorante en aerosol a juego de 200ml en caja dorada y negra. Aroma intenso, oscuro y especiado con pimienta negra, tabaco, piña tostada, café y ámbar seco.",
        "etiquetas": ["Cálido Especiado", "Ambarado", "Avainillado", "Amaderado", "Tabaco"],
        "notas": {
            "salida": ["Pimienta negra", "Tabaco", "Piña"],
            "corazon": ["Pachulí", "Café", "Iris"],
            "fondo": ["Vainilla", "Ámbar", "Madera seca", "Benjuí", "Ládano"]
        },
        "acordes": [
            {"nombre": "cálido especiado", "porcentaje": 100, "color": "#D84315"},
            {"nombre": "ambarado", "porcentaje": 85, "color": "#FF8F00"},
            {"nombre": "avainillado", "porcentaje": 80, "color": "#FFC107"},
            {"nombre": "amaderado", "porcentaje": 75, "color": "#4E342E"},
            {"nombre": "tabaco", "porcentaje": 70, "color": "#6D4C41"}
        ],
        "clima": {"invierno": 95, "primavera": 65, "verano": 40, "otono": 90, "dia": 60, "noche": 95},
        "stock_inventario": 3
    },
    {
        "id": "lattafa_badee_al_oud_mini_set",
        "nombre": "LATTAFA BADEE AL OUD 4 MINIATURAS SET (5ML X 4)",
        "marca": "Lattafa",
        "tipo": "Árabe",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/lattafa_badee_al_oud_mini_set.webp"],
        "volumenes": [],
        "completo": {"ml": 20, "precioBs": 340},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Exclusiva caja de colección de la prestigiosa serie Bade'e Al Oud de Lattafa: 4 frascos miniatura de 5ml que incluyen Oud for Glory, Amethyst, Sublime y Noble Blush. La mejor forma de experimentar las cuatro facetas del oud moderno.",
        "etiquetas": ["Oud", "Amaderado", "Cálido Especiado", "Dulce", "Floral"],
        "notas": {
            "salida": ["Lavanda", "Azafrán", "Manzana verde", "Rosa"],
            "corazon": ["Oud", "Ciruela", "Pachulí"],
            "fondo": ["Ámbar gris", "Almizcle", "Vainilla"]
        },
        "acordes": [
            {"nombre": "oud", "porcentaje": 100, "color": "#212121"},
            {"nombre": "amaderado", "porcentaje": 90, "color": "#5D4037"},
            {"nombre": "cálido especiado", "porcentaje": 85, "color": "#BF360C"},
            {"nombre": "dulce", "porcentaje": 75, "color": "#AD1457"},
            {"nombre": "floral", "porcentaje": 70, "color": "#EC407A"}
        ],
        "clima": {"invierno": 90, "primavera": 70, "verano": 50, "otono": 85, "dia": 70, "noche": 90},
        "stock_inventario": 2
    },
    {
        "id": "lattafa_khamrah_set",
        "nombre": "LATTAFA KHAMRAH SET (EDP 100ML + DEO SPRAY 200ML)",
        "marca": "Lattafa",
        "tipo": "Árabe",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/lattafa_khamrah_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 450},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Estuche de presentación de gala del aclamado Lattafa Khamrah: botella de cristal labrado EDP 100ml con desodorante perfumado de 200ml. Obra maestra gourmand dulce y licorosa inspirada en dátiles confitados, canela, nuez moscada, praliné y haba tonka.",
        "etiquetas": ["Dulce", "Canela", "Avainillado", "Cálido Especiado", "Ambarado"],
        "notas": {
            "salida": ["Canela", "Nuez moscada", "Bergamota"],
            "corazon": ["Dátiles", "Praliné", "Nardo", "Mahonia"],
            "fondo": ["Vainilla", "Haba tonka", "Benjuí", "Mirra", "Madera de akigala"]
        },
        "acordes": [
            {"nombre": "dulce", "porcentaje": 100, "color": "#E65100"},
            {"nombre": "canela", "porcentaje": 90, "color": "#BF360C"},
            {"nombre": "avainillado", "porcentaje": 85, "color": "#FFB300"},
            {"nombre": "cálido especiado", "porcentaje": 80, "color": "#D84315"},
            {"nombre": "ambarado", "porcentaje": 75, "color": "#FF8F00"}
        ],
        "clima": {"invierno": 100, "primavera": 60, "verano": 35, "otono": 95, "dia": 60, "noche": 100},
        "stock_inventario": 0
    },
    {
        "id": "lattafa_the_kingdom_set",
        "nombre": "LATTAFA THE KINGDOM SET (EDP 100ML + TRAVEL 12ML + HAIR MIST 50ML)",
        "marca": "Lattafa",
        "tipo": "Árabe",
        "genero": "Hombre",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/lattafa_the_kingdom_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 450},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Cofre real Lattafa The Kingdom de 3 piezas: Eau de Parfum de 100ml con escudo metálico, spray de viaje de 12ml y bruma capilar enriquecida (Hair Mist) de 50ml. Fragancia acuática aromática y amaderada de porte soberano.",
        "etiquetas": ["Aromático", "Avainillado", "Dulce", "Tabaco", "Amaderado"],
        "notas": {
            "salida": ["Salvia", "Lavanda", "Menta"],
            "corazon": ["Tabaco", "Vainilla", "Flor de azahar"],
            "fondo": ["Benjuí", "Haba tonka", "Cedro"]
        },
        "acordes": [
            {"nombre": "aromático", "porcentaje": 100, "color": "#26A69A"},
            {"nombre": "avainillado", "porcentaje": 85, "color": "#FFCA28"},
            {"nombre": "dulce", "porcentaje": 80, "color": "#FF8A65"},
            {"nombre": "tabaco", "porcentaje": 75, "color": "#795548"},
            {"nombre": "amaderado", "porcentaje": 70, "color": "#4E342E"}
        ],
        "clima": {"invierno": 85, "primavera": 80, "verano": 60, "otono": 85, "dia": 75, "noche": 90},
        "stock_inventario": 3
    },
    {
        "id": "lattafa_yara_set_25ml",
        "nombre": "LATTAFA YARA COLECTION SET 4 PCS (25ML X 4)",
        "marca": "Lattafa",
        "tipo": "Árabe",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/lattafa_yara_set_25ml.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 450},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Colección completa Yara de Lattafa en formato deluxe de 25ml cada una: Yara Rosa original, Yara Tous (mango y coco tropical), Yara Moi (caramelo y flores blancas) y Yara Candy (frutal gourmand dulce). 4 frascos de lujo portátiles.",
        "etiquetas": ["Dulce", "Avainillado", "Afrutado", "Tropical", "Lactónico"],
        "notas": {
            "salida": ["Heliotropo", "Orquídea", "Mandarina", "Mango"],
            "corazon": ["Acorde gourmand", "Frutas tropicales", "Coco"],
            "fondo": ["Vainilla", "Sándalo", "Almizcle", "Caramelo"]
        },
        "acordes": [
            {"nombre": "dulce", "porcentaje": 100, "color": "#F06292"},
            {"nombre": "avainillado", "porcentaje": 90, "color": "#FDD835"},
            {"nombre": "afrutados", "porcentaje": 85, "color": "#FF8A80"},
            {"nombre": "tropical", "porcentaje": 80, "color": "#FFB74D"},
            {"nombre": "lactónico", "porcentaje": 75, "color": "#FFF9C4"}
        ],
        "clima": {"invierno": 70, "primavera": 90, "verano": 95, "otono": 80, "dia": 95, "noche": 80},
        "stock_inventario": 0
    },
    {
        "id": "lattafa_yara_mini_set_5ml",
        "nombre": "LATTAFA YARA MINIATURAS SET 4 PCS (5ML X 4)",
        "marca": "Lattafa",
        "tipo": "Árabe",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/lattafa_yara_mini_set_5ml.webp"],
        "volumenes": [],
        "completo": {"ml": 20, "precioBs": 290},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set de miniaturas de la familia Yara por Lattafa: cuatro réplicas de colección de 5ml (Yara Rosa, Yara Tous, Yara Moi y Yara Candy). Tamaño ideal para bolso y probar toda la línea.",
        "etiquetas": ["Dulce", "Avainillado", "Tropical", "Afrutado", "Empolvado"],
        "notas": {
            "salida": ["Orquídea", "Mandarina", "Mango", "Heliotropo"],
            "corazon": ["Frutas tropicales", "Gourmand", "Coco"],
            "fondo": ["Vainilla", "Caramelo", "Almizcle"]
        },
        "acordes": [
            {"nombre": "dulce", "porcentaje": 100, "color": "#F06292"},
            {"nombre": "avainillado", "porcentaje": 90, "color": "#FDD835"},
            {"nombre": "tropical", "porcentaje": 80, "color": "#FFB74D"},
            {"nombre": "afrutados", "porcentaje": 75, "color": "#FF8A80"},
            {"nombre": "empolvado", "porcentaje": 70, "color": "#E1BEE7"}
        ],
        "clima": {"invierno": 70, "primavera": 90, "verano": 95, "otono": 80, "dia": 95, "noche": 80},
        "stock_inventario": 4
    },
    {
        "id": "lattafa_pride_nebras_set",
        "nombre": "LATTAFA PRIDE NEBRAS SET (EDP 100ML + TRAVEL 20ML + DEO 200ML)",
        "marca": "Lattafa Pride",
        "tipo": "Árabe",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/lattafa_pride_nebras_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 420},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Set supremo de la línea exclusiva Lattafa Pride: Nebras EDP de 100ml, atomizador de bolsillo de 20ml y desodorante spray de 200ml. Fascinante delicia gourmand con bayas rojas, cacao amargo, azúcar moreno y vainilla sedosa.",
        "etiquetas": ["Dulce", "Avainillado", "Cacao", "Afrutado", "Cálido Especiado"],
        "notas": {
            "salida": ["Bayas rojas", "Mandarina"],
            "corazon": ["Vainilla", "Cacao", "Rosa"],
            "fondo": ["Azúcar", "Haba tonka", "Ámbar", "Almizcle"]
        },
        "acordes": [
            {"nombre": "dulce", "porcentaje": 100, "color": "#D81B60"},
            {"nombre": "avainillado", "porcentaje": 95, "color": "#FFC107"},
            {"nombre": "cacao", "porcentaje": 85, "color": "#4E342E"},
            {"nombre": "afrutados", "porcentaje": 75, "color": "#E91E63"},
            {"nombre": "cálido especiado", "porcentaje": 70, "color": "#BF360C"}
        ],
        "clima": {"invierno": 95, "primavera": 70, "verano": 50, "otono": 90, "dia": 70, "noche": 95},
        "stock_inventario": 0
    },
    {
        "id": "orientica_amber_rouge_set_2pcs",
        "nombre": "ORIENTICA AMBER ROUGE SET (EDP 30ML + TRAVEL 7.5ML)",
        "marca": "Orientica",
        "tipo": "Nicho",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/orientica_amber_rouge_set_2pcs.webp"],
        "volumenes": [],
        "completo": {"ml": 30, "precioBs": 560},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set dúo de la lujosa casa Orientica: Amber Rouge EDP en joyero de 30ml con spray de bolsillo de 7.5ml. Famosa por su opulencia hipnótica de azafrán, jazmín blanco y cedro cristalino ambarado.",
        "etiquetas": ["Ámbar", "Cálido Especiado", "Amaderado", "Metálico", "Floral Blanco"],
        "notas": {
            "salida": ["Azafrán", "Jazmín"],
            "corazon": ["Ámbar gris", "Madera de cedro"],
            "fondo": ["Resina de abeto", "Almizcle"]
        },
        "acordes": [
            {"nombre": "ámbar", "porcentaje": 100, "color": "#FF9800"},
            {"nombre": "cálido especiado", "porcentaje": 85, "color": "#D84315"},
            {"nombre": "amaderado", "porcentaje": 80, "color": "#795548"},
            {"nombre": "metálico", "porcentaje": 70, "color": "#78909C"},
            {"nombre": "floral blanco", "porcentaje": 65, "color": "#ECEFF1"}
        ],
        "clima": {"invierno": 90, "primavera": 80, "verano": 65, "otono": 90, "dia": 75, "noche": 95},
        "stock_inventario": 2
    },
    {
        "id": "orientica_amber_rouge_set_neceser",
        "nombre": "ORIENTICA AMBER ROUGE LUXURY SET (EDP 80ML + 7.5ML + 5ML + NECESER)",
        "marca": "Orientica",
        "tipo": "Nicho",
        "genero": "Unisex",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/orientica_amber_rouge_set_neceser.webp"],
        "volumenes": [],
        "completo": {"ml": 80, "precioBs": 950},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Cofre de máximo lujo Orientica Amber Rouge: frasco insignia EDP de 80ml en estuche metálico grabado, atomizador recargable de 7.5ml, miniatura de 5ml y elegante neceser de viaje exclusivo.",
        "etiquetas": ["Ámbar", "Amaderado", "Cálido Especiado", "Almizclado", "Aromático"],
        "notas": {
            "salida": ["Azafrán", "Jazmín"],
            "corazon": ["Madera ambarina", "Ámbar gris"],
            "fondo": ["Resina de abeto", "Cedro", "Almizcle"]
        },
        "acordes": [
            {"nombre": "ámbar", "porcentaje": 100, "color": "#FF9800"},
            {"nombre": "amaderado", "porcentaje": 85, "color": "#6D4C41"},
            {"nombre": "cálido especiado", "porcentaje": 80, "color": "#BF360C"},
            {"nombre": "almizclado", "porcentaje": 70, "color": "#B0BEC5"},
            {"nombre": "aromático", "porcentaje": 65, "color": "#26A69A"}
        ],
        "clima": {"invierno": 90, "primavera": 80, "verano": 65, "otono": 90, "dia": 75, "noche": 95},
        "stock_inventario": 2
    },
    {
        "id": "versace_eros_flame_set_neceser",
        "nombre": "VERSACE EROS FLAME SET (EDP 100ML + TRAVEL 10ML + NECESER)",
        "marca": "Versace",
        "tipo": "Diseñador",
        "genero": "Hombre",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/versace_eros_flame_set_neceser.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 1050},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Set de alta gama Versace Eros Flame: Eau de Parfum en frasco rojo pasión de 100ml, travel spray de 10ml y exclusivo neceser de tocador de diseño Versace. Notas cítricas italianas ardientes con pimienta negra, romero, haba tonka y vainilla.",
        "etiquetas": ["Cítrico", "Cálido Especiado", "Avainillado", "Aromático", "Amaderado"],
        "notas": {
            "salida": ["Mandarina", "Pimienta de Madagascar", "Limón", "Chinotto", "Romero"],
            "corazon": ["Pimienta", "Geranio", "Rosa"],
            "fondo": ["Vainilla", "Haba tonka", "Sándalo", "Cedro de Texas", "Pachulí", "Musgo de roble"]
        },
        "acordes": [
            {"nombre": "cítrico", "porcentaje": 100, "color": "#FFA000"},
            {"nombre": "cálido especiado", "porcentaje": 85, "color": "#D32F2F"},
            {"nombre": "avainillado", "porcentaje": 80, "color": "#FBC02D"},
            {"nombre": "aromático", "porcentaje": 75, "color": "#388E3C"},
            {"nombre": "amaderado", "porcentaje": 70, "color": "#5D4037"}
        ],
        "clima": {"invierno": 85, "primavera": 80, "verano": 65, "otono": 85, "dia": 80, "noche": 95},
        "stock_inventario": 5
    },
    {
        "id": "airval_barbie_body_spray_set",
        "nombre": "AIR-VAL BARBIE SET (BODY SPRAY 200ML + GEL Y SHAMPOO 400ML)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_barbie_body_spray_set.webp"],
        "volumenes": [],
        "completo": {"ml": 200, "precioBs": 140},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Divertido y dulce set infantil oficial de Barbie creado por Air-Val: colonia en spray refrescante de 200ml y frasco 2 en 1 de gel de baño y shampoo suave de 400ml. Aroma alegre a flores rosadas y frutos del bosque.",
        "etiquetas": ["Afrutado", "Dulce", "Floral", "Fresco"],
        "notas": {
            "salida": ["Manzana", "Fresa", "Cítricos"],
            "corazon": ["Pétalos de rosa", "Jazmín"],
            "fondo": ["Almizcle suave", "Vainilla"]
        },
        "acordes": [
            {"nombre": "afrutados", "porcentaje": 100, "color": "#E91E63"},
            {"nombre": "dulce", "porcentaje": 90, "color": "#F48FB1"},
            {"nombre": "floral", "porcentaje": 75, "color": "#CE93D8"},
            {"nombre": "fresco", "porcentaje": 70, "color": "#80DEEA"}
        ],
        "clima": {"invierno": 60, "primavera": 95, "verano": 95, "otono": 75, "dia": 95, "noche": 60},
        "stock_inventario": 1
    },
    {
        "id": "airval_batman_edt_set",
        "nombre": "AIR-VAL BATMAN HERO SET (EDT 50ML + GEL Y SHAMPOO 400ML + FIDGET TOY)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_batman_edt_set.webp"],
        "volumenes": [],
        "completo": {"ml": 50, "precioBs": 210},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set oficial de Batman de Air-Val: Eau de Toilette de 50ml en botella emblemática, gel de ducha y shampoo 2 en 1 de 400ml y juguete antiestrés Fidget Toy. Aroma fresco, limpio y dinámico para pequeños héroes.",
        "etiquetas": ["Cítrico", "Fresco", "Aromático", "Amaderado"],
        "notas": {
            "salida": ["Mandarina", "Manzana verde", "Bergamota"],
            "corazon": ["Lavanda", "Notas marinas"],
            "fondo": ["Madera de cedro", "Ámbar"]
        },
        "acordes": [
            {"nombre": "cítrico", "porcentaje": 100, "color": "#FFC107"},
            {"nombre": "fresco", "porcentaje": 85, "color": "#00BCD4"},
            {"nombre": "aromático", "porcentaje": 75, "color": "#26A69A"},
            {"nombre": "amaderado", "porcentaje": 65, "color": "#795548"}
        ],
        "clima": {"invierno": 60, "primavera": 95, "verano": 95, "otono": 75, "dia": 95, "noche": 65},
        "stock_inventario": 0
    },
    {
        "id": "airval_bob_esponja_edt_set",
        "nombre": "AIR-VAL BOB ESPONJA SET (EDT 100ML + SG 100ML + LONCHERA 3D)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_bob_esponja_edt_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 230},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set de 3 piezas de Bob Esponja por Air-Val: Eau de Toilette de 100ml, gel de ducha espumoso de 100ml y sensacional lonchera 3D con relieve. Fragancia cítrica marina alegre con melón, mandarina y brisa oceánica.",
        "etiquetas": ["Acuático", "Cítrico", "Fresco", "Afrutado"],
        "notas": {
            "salida": ["Mandarina", "Melón", "Pomelo"],
            "corazon": ["Notas marinas", "Romero"],
            "fondo": ["Almizcle blanco", "Maderas claras"]
        },
        "acordes": [
            {"nombre": "acuático", "porcentaje": 100, "color": "#00ACC1"},
            {"nombre": "cítrico", "porcentaje": 90, "color": "#FFEB3B"},
            {"nombre": "fresco", "porcentaje": 85, "color": "#80DEEA"},
            {"nombre": "afrutados", "porcentaje": 75, "color": "#FF8A65"}
        ],
        "clima": {"invierno": 50, "primavera": 95, "verano": 100, "otono": 70, "dia": 100, "noche": 60},
        "stock_inventario": 2
    },
    {
        "id": "airval_eau_my_bb_teddy_set",
        "nombre": "AIR-VAL EAU MY BB SET (EDT 60ML + TEDDY BEAR)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Bebé",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_eau_my_bb_teddy_set.webp"],
        "volumenes": [],
        "completo": {"ml": 60, "precioBs": 190},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Tierno estuche de regalo para bebés y niños pequeños: colonia suave Eau My BB EDT 60ml libre de alérgenos junto a un osito de peluche extra suave. Delicada brisa de flor de azahar, bergamota suave y algodón blanco.",
        "etiquetas": ["Floral Blanco", "Cítrico Suave", "Fresco", "Empolvado"],
        "notas": {
            "salida": ["Bergamota", "Petit grain", "Neroli"],
            "corazon": ["Flor de azahar del naranjo", "Rosa", "Lirio"],
            "fondo": ["Almizcle blanco", "Vainilla suave"]
        },
        "acordes": [
            {"nombre": "floral blanco", "porcentaje": 100, "color": "#ECEFF1"},
            {"nombre": "cítrico suave", "porcentaje": 85, "color": "#FFF59D"},
            {"nombre": "fresco", "porcentaje": 80, "color": "#B2EBF2"},
            {"nombre": "empolvado", "porcentaje": 75, "color": "#E1BEE7"}
        ],
        "clima": {"invierno": 60, "primavera": 95, "verano": 95, "otono": 80, "dia": 100, "noche": 70},
        "stock_inventario": 2
    },
    {
        "id": "airval_eau_my_unicorn_spray_set",
        "nombre": "AIR-VAL EAU MY UNICORN SET (BODY SPRAY 200ML + GEL Y SHAMPOO 400ML)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_eau_my_unicorn_spray_set.webp"],
        "volumenes": [],
        "completo": {"ml": 200, "precioBs": 210},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Mágico estuche infantil Eau My Unicorn por Air-Val: fragancia en body spray refrescante de 200ml acompañada de gel y shampoo 2 en 1 de 400ml. Aroma de fantasía con frambuesas dulces, malvaviscos y algodón de azúcar.",
        "etiquetas": ["Dulce", "Afrutado", "Floral Suave", "Golosina"],
        "notas": {
            "salida": ["Fresas silvestres", "Pera", "Grosella"],
            "corazon": ["Rosa", "Lirio", "Frambuesa"],
            "fondo": ["Algodón de azúcar", "Vainilla"]
        },
        "acordes": [
            {"nombre": "dulce", "porcentaje": 100, "color": "#F48FB1"},
            {"nombre": "afrutados", "porcentaje": 90, "color": "#FF80AB"},
            {"nombre": "floral suave", "porcentaje": 70, "color": "#E1BEE7"},
            {"nombre": "golosina", "porcentaje": 65, "color": "#FFD54F"}
        ],
        "clima": {"invierno": 65, "primavera": 95, "verano": 95, "otono": 75, "dia": 95, "noche": 65},
        "stock_inventario": 1
    },
    {
        "id": "airval_eau_my_unicorn_edt_mochila",
        "nombre": "AIR-VAL EAU MY UNICORN SET (EDT 50ML + SG 300ML + MOCHILA)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_eau_my_unicorn_edt_mochila.webp"],
        "volumenes": [],
        "completo": {"ml": 50, "precioBs": 280},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set de regalo infantil Eau My Unicorn con 3 piezas: frasco EDT de 50ml, gel de baño perfumado de 300ml y preciosa mochila escolar temática con diseño de unicornio brillante.",
        "etiquetas": ["Afrutado", "Dulce", "Fresco", "Empolvado"],
        "notas": {
            "salida": ["Mandarina dulce", "Pera", "Frutos rojos"],
            "corazon": ["Jazmín", "Flor de azahar", "Rosa"],
            "fondo": ["Vainilla", "Almizcle suave"]
        },
        "acordes": [
            {"nombre": "afrutados", "porcentaje": 100, "color": "#FF4081"},
            {"nombre": "dulce", "porcentaje": 85, "color": "#F8BBD0"},
            {"nombre": "fresco", "porcentaje": 80, "color": "#80DEEA"},
            {"nombre": "empolvado", "porcentaje": 70, "color": "#E1BEE7"}
        ],
        "clima": {"invierno": 60, "primavera": 95, "verano": 95, "otono": 75, "dia": 95, "noche": 65},
        "stock_inventario": 1
    },
    {
        "id": "airval_frozen_edt_neceser",
        "nombre": "AIR-VAL DISNEY FROZEN SET (EDT 50ML + SG 100ML + NECESER)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_frozen_edt_neceser.webp"],
        "volumenes": [],
        "completo": {"ml": 50, "precioBs": 210},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Estuche oficial Disney Frozen de Air-Val: Eau de Toilette de 50ml con silueta de Elsa y Anna, shower gel de 100ml y estuche neceser azul brillante. Fragancia frutal y floral suave como la escarcha nórdica.",
        "etiquetas": ["Cítrico", "Afrutado", "Dulce", "Fresco"],
        "notas": {
            "salida": ["Pomelo", "Naranja", "Manzana"],
            "corazon": ["Frambuesa", "Chocolate blanco", "Rosa"],
            "fondo": ["Vainilla", "Sándalo"]
        },
        "acordes": [
            {"nombre": "cítrico", "porcentaje": 100, "color": "#FFD54F"},
            {"nombre": "afrutados", "porcentaje": 85, "color": "#FF80AB"},
            {"nombre": "dulce", "porcentaje": 80, "color": "#B388FF"},
            {"nombre": "fresco", "porcentaje": 75, "color": "#80D8FF"}
        ],
        "clima": {"invierno": 65, "primavera": 95, "verano": 95, "otono": 75, "dia": 95, "noche": 65},
        "stock_inventario": 1
    },
    {
        "id": "airval_frozen_body_spray_set",
        "nombre": "AIR-VAL DISNEY FROZEN II SET (BODY SPRAY 200ML + GEL Y SHAMPOO 400ML)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_frozen_body_spray_set.webp"],
        "volumenes": [],
        "completo": {"ml": 200, "precioBs": 140},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set de higiene y perfume infantil Disney Frozen II por Air-Val: spray corporal perfumado de 200ml y gel-shampoo 2 en 1 de 400ml con fórmula delicada para el cuidado del cabello y la piel.",
        "etiquetas": ["Afrutado", "Fresco", "Dulce", "Limpio"],
        "notas": {
            "salida": ["Cítricos suaves", "Manzana fresca"],
            "corazon": ["Flores blancas", "Frutos rojos"],
            "fondo": ["Almizcle limpio", "Vainilla"]
        },
        "acordes": [
            {"nombre": "afrutados", "porcentaje": 100, "color": "#80D8FF"},
            {"nombre": "fresco", "porcentaje": 85, "color": "#A7FFEB"},
            {"nombre": "dulce", "porcentaje": 75, "color": "#EA80FC"},
            {"nombre": "limpio", "porcentaje": 70, "color": "#ECEFF1"}
        ],
        "clima": {"invierno": 60, "primavera": 95, "verano": 95, "otono": 75, "dia": 95, "noche": 60},
        "stock_inventario": 1
    },
    {
        "id": "airval_marvel_capitan_america_set",
        "nombre": "AIR-VAL MARVEL CAPITÁN AMÉRICA SET (EDT 100ML + SG 100ML + LONCHERA 3D)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_marvel_capitan_america_set.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 260},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Combo de superhéroes Capitán América por Air-Val: frasco de Eau de Toilette de 100ml, gel de baño de 100ml y espectacular lonchera rígida 3D con el escudo metálico del vengador. Notas frescas de menta, lima y maderas limpias.",
        "etiquetas": ["Cítrico", "Aromático", "Fresco", "Verde"],
        "notas": {
            "salida": ["Lima ácida", "Menta crujiente", "Mandarina"],
            "corazon": ["Lavanda", "Notas verdes"],
            "fondo": ["Cedro", "Almizcle"]
        },
        "acordes": [
            {"nombre": "cítrico", "porcentaje": 100, "color": "#00BCD4"},
            {"nombre": "aromático", "porcentaje": 85, "color": "#3F51B5"},
            {"nombre": "fresco", "porcentaje": 80, "color": "#80DEEA"},
            {"nombre": "verde", "porcentaje": 70, "color": "#4CAF50"}
        ],
        "clima": {"invierno": 55, "primavera": 95, "verano": 95, "otono": 70, "dia": 95, "noche": 60},
        "stock_inventario": 0
    },
    {
        "id": "airval_minecraft_edt_lonchera",
        "nombre": "AIR-VAL MINECRAFT SET (EDT 50ML + SG 100ML + LONCHERA)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_minecraft_edt_lonchera.webp"],
        "volumenes": [],
        "completo": {"ml": 50, "precioBs": 210},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set gamer infantil Minecraft por Air-Val: Eau de Toilette de 50ml, gel de baño de 100ml y práctica lonchera temática con diseño de píxeles y bloques verdes. Aroma vivaz, energizante y verde.",
        "etiquetas": ["Verde", "Afrutado", "Fresco", "Aromático"],
        "notas": {
            "salida": ["Manzana verde", "Bergamota", "Anís"],
            "corazon": ["Lavanda", "Salvia"],
            "fondo": ["Pachulí", "Madera de cedro"]
        },
        "acordes": [
            {"nombre": "verde", "porcentaje": 100, "color": "#43A047"},
            {"nombre": "afrutados", "porcentaje": 85, "color": "#7CB342"},
            {"nombre": "fresco", "porcentaje": 80, "color": "#80CBC4"},
            {"nombre": "aromático", "porcentaje": 75, "color": "#2E7D32"}
        ],
        "clima": {"invierno": 55, "primavera": 95, "verano": 95, "otono": 70, "dia": 95, "noche": 60},
        "stock_inventario": 0
    },
    {
        "id": "airval_spiderman_edt_neceser",
        "nombre": "AIR-VAL MARVEL SPIDERMAN SET (EDT 50ML + SG 100ML + NECESER)",
        "marca": "Air-Val",
        "tipo": "Diseñador",
        "genero": "Niños",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/airval_spiderman_edt_neceser.webp"],
        "volumenes": [],
        "completo": {"ml": 50, "precioBs": 210},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Set oficial de Spiderman por Air-Val: botella Eau de Toilette de 50ml, gel de baño de 100ml y estuche neceser rojo y azul arácnido con cierre. Fragancia fresca especiada con cítricos y maderas sutiles.",
        "etiquetas": ["Cítrico", "Aromático", "Fresco Especiado", "Amaderado"],
        "notas": {
            "salida": ["Pimienta negra", "Bergamota", "Naranja"],
            "corazon": ["Lavanda", "Flor de azahar"],
            "fondo": ["Ámbar", "Cedro", "Vainilla"]
        },
        "acordes": [
            {"nombre": "cítrico", "porcentaje": 100, "color": "#E53935"},
            {"nombre": "aromático", "porcentaje": 85, "color": "#1E88E5"},
            {"nombre": "fresco especiado", "porcentaje": 80, "color": "#FB8C00"},
            {"nombre": "amaderado", "porcentaje": 65, "color": "#6D4C41"}
        ],
        "clima": {"invierno": 60, "primavera": 95, "verano": 90, "otono": 75, "dia": 95, "noche": 65},
        "stock_inventario": 0
    },
    {
        "id": "paco_rabanne_invictus_set_10ml",
        "nombre": "PACO RABANNE INVICTUS SET (EDT 100ML + TRAVEL SPRAY 10ML)",
        "marca": "Paco Rabanne",
        "tipo": "Diseñador",
        "genero": "Hombre",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/paco_rabanne_invictus_set_10ml.webp"],
        "volumenes": [],
        "completo": {"ml": 100, "precioBs": 1350},
        "activo": True,
        "nuevo": False,
        "destacado": True,
        "descripcion": "Estuche de victoria Paco Rabanne Invictus: legendario trofeo Eau de Toilette de 100ml junto a spray atomizador de viaje de 10ml. El perfume de los campeones, combinando frescura marina mordaz con madera de guayaco y hoja de laurel.",
        "etiquetas": ["Acuático", "Cítrico", "Aromático", "Fresco Especiado", "Amaderado"],
        "notas": {
            "salida": ["Notas marinas", "Pomelo", "Mandarina"],
            "corazon": ["Hoja de laurel", "Jazmín"],
            "fondo": ["Ámbar gris", "Madera de guayaco", "Musgo de roble", "Pachulí"]
        },
        "acordes": [
            {"nombre": "acuático", "porcentaje": 100, "color": "#0288D1"},
            {"nombre": "cítrico", "porcentaje": 90, "color": "#FBC02D"},
            {"nombre": "aromático", "porcentaje": 85, "color": "#00897B"},
            {"nombre": "fresco especiado", "porcentaje": 75, "color": "#26A69A"},
            {"nombre": "amaderado", "porcentaje": 70, "color": "#5D4037"}
        ],
        "clima": {"invierno": 50, "primavera": 90, "verano": 95, "otono": 75, "dia": 95, "noche": 80},
        "stock_inventario": 4
    },
    {
        "id": "victoria_secret_bare_vanilla_set",
        "nombre": "VICTORIA'S SECRET BARE VANILLA SET (MIST 75ML + LIP GLOW)",
        "marca": "Victoria's Secret",
        "tipo": "Diseñador",
        "genero": "Mujer",
        "imagenes": ["https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/victoria_secret_bare_vanilla_set.webp"],
        "volumenes": [],
        "completo": {"ml": 75, "precioBs": 390},
        "activo": True,
        "nuevo": False,
        "destacado": False,
        "descripcion": "Dúo tentador de Victoria's Secret: Bare Vanilla Fragrance Mist en presentación travel de 75ml y brillo labial hidratante Flavor Gloss Lip Glow a juego. Notas sensuales de vainilla batida, flor de manzana y cachemira tibia.",
        "etiquetas": ["Avainillado", "Dulce", "Atalcado", "Almizclado"],
        "notas": {
            "salida": ["Flor de manzana", "Vainilla batida"],
            "corazon": ["Cachemira tibia"],
            "fondo": ["Vainilla negra", "Almizcle suave"]
        },
        "acordes": [
            {"nombre": "avainillado", "porcentaje": 100, "color": "#FDD835"},
            {"nombre": "dulce", "porcentaje": 90, "color": "#FFB74D"},
            {"nombre": "atalcado", "porcentaje": 75, "color": "#E1BEE7"},
            {"nombre": "almizclado", "porcentaje": 65, "color": "#CFD8DC"}
        ],
        "clima": {"invierno": 85, "primavera": 75, "verano": 65, "otono": 85, "dia": 80, "noche": 85},
        "stock_inventario": 0
    }
]

with open('scripts/sets_metadata.json', 'w', encoding='utf-8') as f:
    json.dump(sets_data, f, ensure_ascii=False, indent=2)

print(f"Generated sets_metadata.json with {len(sets_data)} complete sets!")
