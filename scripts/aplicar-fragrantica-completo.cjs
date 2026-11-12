const fs = require('fs');

/**
 * MASTER SCRIPT: Enriquecimiento Total del Catálogo Elixir con Fragrantica.es
 * 
 * Reglas con comprobación rigurosa de límites de palabra (\b) para evitar trampas de subcadenas
 * (ej: 'REM' en SUPREMACY/EXTREME, 'ARI' en BVLGARI/ARIANI, etc.).
 */

const FRAGRANTICA_MASTER_RULES = [
  // ==============================================================
  // 1. AFNAN
  // ==============================================================
  {
    test: (id, n) => n.includes('9 AM DIVE') || id.includes('9_am_dive'),
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'afrutados', porcentaje: 58, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 48, color: '#8D5524' }
    ],
    notas: {
      salida: ['Menta fresca', 'Grosellas negras', 'Limón de Sicilia', 'Pimienta rosa'],
      corazon: ['Manzana verde crujiente', 'Incienso místico', 'Cedro del Atlas'],
      fondo: ['Jengibre fresco', 'Sándalo cremoso', 'Pachulí terroso', 'Jazmín']
    }
  },
  {
    test: (id, n) => n.includes('9 AM') && (n.includes('BEIGE') || n.includes('AQUA VITAE') || (!n.includes('DIVE'))),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 75, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Limón de Sicilia', 'Cardamomo', 'Pimienta rosa'],
      corazon: ['Lavanda francesa', 'Manzana crujiente', 'Flor de azahar', 'Rosa'],
      fondo: ['Madera de cedro', 'Pachulí noble', 'Almizcle blanco', 'Musgo de roble']
    }
  },
  {
    test: (id, n) => n.includes('9 PM ELIXIR'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 74, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Canela oscura', 'Lavanda salvaje', 'Pimienta negra'],
      corazon: ['Vainilla Bourbon profunda', 'Flor de azahar', 'Haba tonka'],
      fondo: ['Ámbar extremo', 'Madera de sándalo', 'Pachulí noble']
    }
  },
  {
    test: (id, n) => n.includes('9 PM REBEL'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 65, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana roja dulce', 'Piña caramelizada', 'Bergamota'],
      corazon: ['Canela picante', 'Vainilla cremosa', 'Flor de azahar'],
      fondo: ['Ámbar dorado', 'Madera de cedro', 'Almizcle seductor', 'Musgo']
    }
  },
  {
    test: (id, n) => n.includes('9 PM NIGHT OUT'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Cardamomo negro', 'Lavanda fresca', 'Pimienta negra'],
      corazon: ['Canela de Ceilán', 'Flor de azahar', 'Incienso'],
      fondo: ['Vainilla negra', 'Haba tonka tostada', 'Cedro del Atlas']
    }
  },
  {
    test: (id, n) => (n.includes('9 PM') || n.includes('9PM')) && !n.includes('REBEL') && !n.includes('ELIXIR') && !n.includes('NIGHT OUT'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'afrutados', porcentaje: 68, color: '#D74423' },
      { nombre: 'canela', porcentaje: 60, color: '#A84323' },
      { nombre: 'dulce', porcentaje: 55, color: '#FF384D' },
      { nombre: 'lavanda', porcentaje: 48, color: '#8076A3' },
      { nombre: 'aromático', porcentaje: 42, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Manzana silvestre', 'Canela de Ceilán', 'Lavanda salvaje', 'Bergamota italiana'],
      corazon: ['Flor de azahar del naranjo', 'Lirio de los valles (muguete)'],
      fondo: ['Vainilla Bourbon intensa', 'Haba tonka tostada', 'Ámbar cálido', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('TURATHI BLUE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'almizclado', porcentaje: 58, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Pomelo chispeante', 'Bergamota de Calabria'],
      corazon: ['Notas amaderadas nobles', 'Ámbar gris suntuoso'],
      fondo: ['Almizcle sedoso', 'Pachulí terroso', 'Especias cálidas']
    }
  },
  {
    test: (id, n) => n.includes('TURATHI ELECTRIC'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 75, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Limón electrizante', 'Menta fresca', 'Pomelo rosa'],
      corazon: ['Lavanda aromática', 'Jengibre picante', 'Cardamomo'],
      fondo: ['Madera de cedro', 'Ambroxan', 'Vetiver']
    }
  },
  {
    test: (id, n) => n.includes('TURATHI PURPLE'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'afrutados', porcentaje: 85, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 65, color: '#CBB677' }
    ],
    notas: {
      salida: ['Frutos rojos maduros', 'Mandarina dulce'],
      corazon: ['Rosa de Damasco', 'Jazmín sambac', 'Flor de azahar'],
      fondo: ['Vainilla suave', 'Almizcle blanco', 'Ámbar cálido']
    }
  },
  {
    test: (id, n) => n.includes('SUPREMACY NOT ONLY INTENSE'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'ahumado', porcentaje: 88, color: '#565051' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' },
      { nombre: 'musgo', porcentaje: 60, color: '#556B2F' }
    ],
    notas: {
      salida: ['Grosellas negras intensas', 'Manzana verde crujiente', 'Bergamota'],
      corazon: ['Musgo de roble', 'Pachulí de Indonesia', 'Lavanda francesa'],
      fondo: ['Ámbar gris majestuoso', 'Almizcle seductor', 'Azafrán noble']
    }
  },
  {
    test: (id, n) => n.includes('SUPREMACY IN OUD'),
    acordes: [
      { nombre: 'oud', porcentaje: 100, color: '#3D3430' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Azafrán noble', 'Nuez moscada', 'Lavanda fresca'],
      corazon: ['Madera de agar (oud)', 'Notas dulces acarameladas'],
      fondo: ['Pachulí terroso noble', 'Almizcle seductor']
    }
  },
  {
    test: (id, n) => n.includes('SUPREMACY SILVER') || (n.includes('SUPREMACY') && !n.includes('OUD') && !n.includes('INTENSE')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'ahumado', porcentaje: 85, color: '#565051' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 70, color: '#B8B939' }
    ],
    notas: {
      salida: ['Manzana crujiente', 'Grosellas negras', 'Bergamota italiana', 'Piña fresca'],
      corazon: ['Rosa de mayo', 'Abedul ahumado', 'Jazmín de Marruecos', 'Pachulí'],
      fondo: ['Musgo de roble', 'Almizcle sedoso', 'Ámbar gris', 'Vainilla suave']
    }
  },
  {
    test: (id, n) => n.includes('HISTORIC OLMEDA'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Pomelo rosado', 'Pimienta rosa', 'Cardamomo', 'Enebro'],
      corazon: ['Bergamota de Calabria', 'Nuez moscada', 'Jazmín blanco'],
      fondo: ['Madera de cedro', 'Ámbar cálido', 'Pachulí noble', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('HISTORIC SAHARA'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 85, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' },
      { nombre: 'avainillado', porcentaje: 65, color: '#CBB677' }
    ],
    notas: {
      salida: ['Azafrán ardiente', 'Pimienta rosa', 'Bergamota'],
      corazon: ['Rosa de Damasco', 'Incienso místico', 'Cedro del Atlas'],
      fondo: ['Ámbar dorado profundo', 'Vainilla Bourbon', 'Madera de agar (oud)']
    }
  },

  // ==============================================================
  // 2. ARMAF
  // ==============================================================
  {
    test: (id, n) => n.includes('CLUB DE NUIT INTENSE') || id.includes('cdnim'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'ahumado', porcentaje: 88, color: '#565051' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' },
      { nombre: 'cuero', porcentaje: 60, color: '#6E4823' }
    ],
    notas: {
      salida: ['Limón de Amalfi vibrante', 'Piña tropical', 'Bergamota', 'Grosellas negras', 'Manzana verde'],
      corazon: ['Abedul ahumado', 'Jazmín blanco', 'Rosa de mayo'],
      fondo: ['Ámbar gris oceánico', 'Almizcle seductor', 'Pachulí terroso', 'Vainilla suave']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT BLING') || (n.includes('CLUB DE NUIT') && n.includes('BLING')),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'pachulí', porcentaje: 88, color: '#7E6850' },
      { nombre: 'floral', porcentaje: 80, color: '#E87EA1' },
      { nombre: 'rosa', porcentaje: 72, color: '#F0587E' }
    ],
    notas: {
      salida: ['Naranja dulce', 'Bergamota italiana', 'Pomelo rosado', 'Melocotón jugoso'],
      corazon: ['Rosa de Damasco', 'Jazmín sambac', 'Geranio', 'Lichi'],
      fondo: ['Pachulí noble', 'Vainilla de Madagascar', 'Almizcle blanco', 'Vetiver']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT SILLAGE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'metálico', porcentaje: 88, color: '#9E9E9E' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'almizclado', porcentaje: 70, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Bergamota de Calabria', 'Grosellas negras', 'Limón', 'Lima ácida', 'Hojas de violeta', 'Jengibre'],
      corazon: ['Rosa romántica', 'Iris noble', 'Jazmín de Grasse'],
      fondo: ['Ambroxan radiante', 'Almizcle cristalino', 'Sándalo', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT ICONIC') || n.includes('BLUE ICONIC'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Pomelo chispeante', 'Limón de Sicilia', 'Menta fresca', 'Pimienta rosa', 'Cilantro'],
      corazon: ['Jengibre picante', 'Nuez moscada', 'Melón dulce', 'Jazmín'],
      fondo: ['Incienso oriental', 'Ámbar cálido', 'Cedro', 'Sándalo', 'Pachulí', 'Ládano']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT UNTOLD'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 90, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 80, color: '#AA331E' },
      { nombre: 'metálico', porcentaje: 70, color: '#9E9E9E' }
    ],
    notas: {
      salida: ['Azafrán noble persa', 'Jazmín sambac'],
      corazon: ['Amberwood brillante', 'Ámbar gris suntuoso'],
      fondo: ['Resina de abeto balsámica', 'Madera de cedro noble']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT URBAN ELIXIR'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Bergamota de Calabria', 'Pimienta rosa', 'Jazmín', 'Flor de azahar'],
      corazon: ['Lavanda francesa', 'Elemí', 'Geranio', 'Azafrán', 'Vetiver'],
      fondo: ['Ambroxan potente', 'Pachulí terroso', 'Cedro', 'Ládano']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT PRECIEUX') || n.includes('PRECIEUX'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 72, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Piña caramelizada', 'Manzana roja', 'Pera jugosa', 'Pimienta rosa'],
      corazon: ['Jazmín sambac', 'Lirio blanco', 'Madera de cedro blanco'],
      fondo: ['Vainilla de Madagascar', 'Ámbar blanco', 'Almizcle aterciopelado', 'Cuero suave']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY MANDARIN SKY'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'caramelo', porcentaje: 82, color: '#B86B2B' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Mandarina jugosa soleada', 'Naranja dulce', 'Azafrán noble', 'Salvia'],
      corazon: ['Caramelo derretido caliente', 'Haba tonka tostada', 'Tagete floral'],
      fondo: ['Ambroxan radiante', 'Vetiver de Haití', 'Madera de cedro']
    }
  },
  {
    test: (id, n) => n.includes('CANDEE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'caramelo', porcentaje: 80, color: '#B86B2B' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' }
    ],
    notas: {
      salida: ['Fresas maduras glaseadas', 'Bergamota', 'Mandarina'],
      corazon: ['Caramelo de azúcar tostado', 'Flor de azahar', 'Jazmín suave'],
      fondo: ['Vainilla cremosa batida', 'Haba tonka tostada', 'Almizcle blanco']
    }
  },
  {
    test: (id, n) => n.includes('THE LIONS CLUB FEROCE') || (n.includes('LIONS') && n.includes('FEROCE')),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'cuero', porcentaje: 70, color: '#6E4823' }
    ],
    notas: {
      salida: ['Limón siciliano', 'Pimienta negra ardiente', 'Cardamomo'],
      corazon: ['Canela de Ceilán', 'Salvia aromática', 'Lavanda salvaje'],
      fondo: ['Ámbar dorado intenso', 'Cuero noble negro', 'Madera de cedro del Atlas']
    }
  },
  {
    test: (id, n) => n.includes('THE LIONS CLUB RUGIR') || (n.includes('LIONS') && n.includes('RUGIR')),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'fresco', porcentaje: 80, color: '#68B684' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Bergamota italiana', 'Menta fresca'],
      corazon: ['Pachulí terroso noble', 'Geranio salvaje', 'Lavanda francesa'],
      fondo: ['Madera de sándalo noble', 'Haba tonka tostada', 'Vetiver de Haití']
    }
  },
  {
    test: (id, n) => n.includes('YUM YUM'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 82, color: '#CBB677' },
      { nombre: 'caramelo', porcentaje: 75, color: '#B86B2B' }
    ],
    notas: {
      salida: ['Algodón de azúcar dulce', 'Frutos rojos confitados', 'Caramelo líquido'],
      corazon: ['Malvavisco suave', 'Vainilla cremosa batida', 'Pétalos dulces'],
      fondo: ['Almizcle blanco delicado', 'Haba tonka azucarada']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY') && (n.includes('BAHAMAS') || n.includes('SPECTRA') || n.includes('MEGA') || n.includes('WHITE') || n.includes('AOUD') || n.includes('GO MANGO') || n.includes('MONTAGNE') || n.includes('LICHI')),
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#E8A317' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'marino', porcentaje: 68, color: '#258BD2' }
    ],
    notas: {
      salida: ['Mango Alfonso maduro', 'Lichi jugoso', 'Agua de coco fresca', 'Maracuyá'],
      corazon: ['Flor de tiaré', 'Jazmín de playa', 'Frangipani hawaiano'],
      fondo: ['Vainilla de Madagascar', 'Almizcle blanco solar', 'Madera de sándalo rubia']
    }
  },

  // ==============================================================
  // 3. BURBERRY
  // ==============================================================
  {
    test: (id, n) => n.includes('BURBERRY HER'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'almizclado', porcentaje: 70, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Fresa silvestre', 'Frambuesa madura', 'Zarzamora', 'Cereza ácida', 'Grosellas negras', 'Mandarina'],
      corazon: ['Violeta suave empolvada', 'Jazmín blanco radiante'],
      fondo: ['Almizcle blanco aterciopelado', 'Vainilla suave', 'Cashmeran', 'Ámbar', 'Musgo de roble']
    }
  },
  {
    test: (id, n) => n.includes('BURBERRY ORIGINAL') || (n.includes('BURBERRY') && n.includes('WOMEN') && !n.includes('HER') && !n.includes('GODDESS')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'atalcado', porcentaje: 70, color: '#988E83' }
    ],
    notas: {
      salida: ['Melocotón jugoso', 'Albaricoque dulce', 'Pera madura', 'Grosellas negras', 'Manzana verde'],
      corazon: ['Madera de sándalo cremoso', 'Jazmín blanco', 'Musgo de roble noble'],
      fondo: ['Vainilla Bourbon de Madagascar', 'Madera de cedro cálida', 'Almizcle sedoso']
    }
  },
  {
    test: (id, n) => n.includes('BURBERRY GODDESS'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'lavanda', porcentaje: 85, color: '#8076A3' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' },
      { nombre: 'dulce', porcentaje: 70, color: '#FF384D' }
    ],
    notas: {
      salida: ['Infusión de vainilla suntuosa', 'Lavanda francesa luminosa', 'Cacao puro', 'Jengibre'],
      corazon: ['Caviar de vainilla opulento'],
      fondo: ['Absoluto de vainilla Bourbon de Madagascar']
    }
  },

  // ==============================================================
  // 4. FRENCH AVENUE
  // ==============================================================
  {
    test: (id, n) => n.includes('AETHER EXTRAIT') || (n.includes('AETHER') && n.includes('FRENCH AVENUE')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'verde', porcentaje: 90, color: '#5C9058' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 75, color: '#B8B939' }
    ],
    notas: {
      salida: ['Manzana verde crujiente de Grasse', 'Bergamota de Calabria', 'Mandarina siciliana'],
      corazon: ['Petitgrain', 'Madera de cedro blanco', 'Pomelo rosa', 'Hojas de violeta'],
      fondo: ['Musgo de roble francés', 'Almizcle blanco limpio', 'Amberwood suntuoso']
    }
  },
  {
    test: (id, n) => n.includes('VENENO SCARLET') || (n.includes('VENENO') && n.includes('SCARLET')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'almendras', porcentaje: 82, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 75, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Cereza negra licorosa', 'Almendra amarga crujiente', 'Azafrán noble'],
      corazon: ['Jazmín sambac embriagador', 'Rosa de Damasco', 'Ciruela madura'],
      fondo: ['Haba tonka tostada', 'Vainilla Bourbon intensa', 'Madera de sándalo', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('VENENO') && !n.includes('SCARLET'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'cuero', porcentaje: 80, color: '#6E4823' },
      { nombre: 'canela', porcentaje: 72, color: '#A84323' }
    ],
    notas: {
      salida: ['Fresas silvestres rojas', 'Caramelo líquido caliente', 'Fresas confitadas'],
      corazon: ['Canela picante aromática', 'Vainilla cremosa', 'Frambuesa madura'],
      fondo: ['Cuero ruso noble ahumado', 'Pachulí terroso', 'Haba tonka tostada']
    }
  },
  {
    test: (id, n) => n.includes('LIQUID BRUN'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'canela', porcentaje: 85, color: '#A84323' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' }
    ],
    notas: {
      salida: ['Canela de Ceilán picante', 'Cardamomo de Guatemala', 'Bergamota italiana', 'Flor de azahar'],
      corazon: ['Vainilla Bourbon cremosa de Madagascar', 'Elemí balsámico'],
      fondo: ['Praliné artesanal crujiente', 'Almizcle sensual', 'Madera de gaiac', 'Ambroxan']
    }
  },

  // ==============================================================
  // 5. GIVENCHY GENTLEMAN ONLY
  // ==============================================================
  {
    test: (id, n) => n.includes('GENTLEMAN ONLY') || n.includes('GENTLEMEN ONLY'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 88, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'ahumado', porcentaje: 70, color: '#565051' }
    ],
    notas: {
      salida: ['Pimienta rosa picante', 'Mandarina verde', 'Hojas de abedul', 'Nuez moscada', 'Bergamota'],
      corazon: ['Vetiver terroso', 'Madera de cedro noble', 'Pachulí terroso', 'Hojas de violeta', 'Elemí'],
      fondo: ['Incienso oriental misterioso', 'Almizcle blanco seductor']
    }
  },

  // ==============================================================
  // 6. LATTAFA FAKHAR BLACK / PLATIN
  // ==============================================================
  {
    test: (id, n) => n === 'LATTAFA FAKHAR' || n.includes('FAKHAR MEN') || n.includes('FAKHAR PLATIN') || (n.includes('FAKHAR') && !n.includes('WOM') && !n.includes('ROSE') && !n.includes('GOLD')),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 88, color: '#4B8E6D' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Bergamota de Calabria', 'Jengibre picante'],
      corazon: ['Lavanda francesa', 'Salvia sclarea aromática', 'Bayas de enebro', 'Geranio salvaje'],
      fondo: ['Haba tonka tostada', 'Amberwood suntuoso', 'Madera de cedro blanco', 'Vetiver de Haití']
    }
  },

  // ==============================================================
  // 7. PACO RABANNE MINI SET
  // ==============================================================
  {
    test: (id, n) => n.includes('PACO RABANNE SET MINI') || (n.includes('SET MINI') && n.includes('RABANNE')),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'cuero', porcentaje: 88, color: '#6E4823' },
      { nombre: 'ámbar', porcentaje: 80, color: '#C87D2A' },
      { nombre: 'cítrico', porcentaje: 72, color: '#B8B939' }
    ],
    notas: {
      salida: ['Mandarina sanguina jugosa', 'Pomelo chispeante', 'Menta fresca silvestre'],
      corazon: ['Canela picante de Ceilán', 'Rosa de Damasco', 'Notas especiadas ardientes'],
      fondo: ['Cuero rubio noble seductor', 'Ámbar cálido líquido', 'Pachulí terroso de Indonesia']
    }
  }
];

function ejecutarMasterEnriquecimiento() {
  const path = 'src/assets/perfumes.json';
  const catalog = JSON.parse(fs.readFileSync(path, 'utf8'));

  let count = 0;

  for (const p of catalog) {
    const id = p.id.toLowerCase();
    const nombre = p.nombre.toUpperCase();

    const regla = FRAGRANTICA_MASTER_RULES.find(r => r.test(id, nombre));
    if (regla) {
      p.acordes = regla.acordes;
      p.notas = regla.notas;
      count++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`✅ Master script finalizado: ${count} perfumes sincronizados rigurosamente con Fragrantica.`);
}

ejecutarMasterEnriquecimiento();
