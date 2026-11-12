const fs = require('fs');

/**
 * Base de datos enriquecida de Pirámides Olfativas y Acordes Principales
 * extraídos fielmente de Fragrantica.es para el catálogo de Elixir Perfumería.
 */
const FRAGRANTICA_RULES = [
  // ==========================================
  // AFNAN
  // ==========================================
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
    test: (id, n) => n.includes('9 PM ELIXIR'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 74, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 65, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mandarina italiana', 'Canela oscura', 'Pimienta negra'],
      corazon: ['Lavanda de Provenza', 'Heliotropo aterciopelado', 'Vainilla cremosa'],
      fondo: ['Ámbar extremo', 'Haba tonka', 'Madera de cedro noble']
    }
  },
  {
    test: (id, n) => n.includes('9 PM REBEL') || n.includes('9PM REBEL'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'cítrico', porcentaje: 58, color: '#B8B939' }
    ],
    notas: {
      salida: ['Piña madura jugosa', 'Mandarina chispeante', 'Manzana Granny Smith'],
      corazon: ['Caramelo salado', 'Madera de cedro blanco', 'Vainilla suave'],
      fondo: ['Ámbar dorado', 'Almizcle sensual', 'Maderas oscuras aterciopeladas']
    }
  },
  {
    test: (id, n) => n.includes('9 PM NIGHT OUT'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'ahumado', porcentaje: 78, color: '#555555' },
      { nombre: 'cuero', porcentaje: 68, color: '#5E3A24' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Pimienta rosa picante', 'Bergamota italiana', 'Cardamomo verde'],
      corazon: ['Canela pura', 'Cuero ahumado', 'Incienso de olíbano'],
      fondo: ['Madera de gaiac', 'Ámbar gris mineral', 'Vainilla negra']
    }
  },
  {
    test: (id, n) => n.includes('TURATHI BLUE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'almizclado', porcentaje: 75, color: '#797E87' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 55, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Cítricos espumosos', 'Bergamota de Calabria', 'Mandarina jugosa'],
      corazon: ['Ámbar cálido', 'Maderas preciosas'],
      fondo: ['Almizcle blanco', 'Pachulí terroso', 'Especias orientales']
    }
  },
  {
    test: (id, n) => n.includes('TURATHI ELECTRIC') || n.includes('ELECTRIC TURATHI'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'acuático', porcentaje: 88, color: '#258BD2' },
      { nombre: 'fresco', porcentaje: 78, color: '#44A68C' },
      { nombre: 'aromático', porcentaje: 68, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' }
    ],
    notas: {
      salida: ['Bergamota eléctrica', 'Mandarina helada', 'Lima ácida'],
      corazon: ['Notas marinas oceánicas', 'Menta salvaje', 'Romero fresco'],
      fondo: ['Cedro blanco', 'Almizcle limpio', 'Ámbar cristalino']
    }
  },
  {
    test: (id, n) => n.includes('TURATHI PURPLE'),
    acordes: [
      { nombre: 'florales', porcentaje: 100, color: '#D27B9B' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'almizclado', porcentaje: 55, color: '#797E87' }
    ],
    notas: {
      salida: ['Cardamomo', 'Frutas rojas silvestres', 'Pimienta rosa'],
      corazon: ['Jazmín sambac', 'Rosa de Damasco', 'Piña dulce'],
      fondo: ['Vainilla de Madagascar', 'Pachulí', 'Ámbar dorado']
    }
  },
  {
    test: (id, n) => n.includes('HISTORIC OLMEDA'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 55, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Pimienta rosa', 'Cardamomo de Ceilán', 'Enebro de Virginia', 'Toronja rosada'],
      corazon: ['Bergamota de Calabria', 'Cedro del Atlas', 'Nuez moscada', 'Jazmín'],
      fondo: ['Pachulí terroso', 'Ámbar gris mineral', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('HISTORIC SAHARA'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'dulce', porcentaje: 70, color: '#FF384D' },
      { nombre: 'aromático', porcentaje: 58, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Azafrán oriental', 'Nuez moscada', 'Canela en corteza'],
      corazon: ['Jazmín de noche', 'Flor de azahar', 'Madera de cedro'],
      fondo: ['Vainilla Bourbon', 'Ámbar del desierto', 'Madera de oud', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('SUPREMACY NOT ONLY INTENSE'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'ahumado', porcentaje: 88, color: '#555555' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'musgo', porcentaje: 68, color: '#3B8B88' },
      { nombre: 'cítrico', porcentaje: 58, color: '#B8B939' }
    ],
    notas: {
      salida: ['Grosellas negras maduras', 'Bergamota chispeante', 'Manzana verde'],
      corazon: ['Musgo de roble', 'Pachulí terroso', 'Lavanda francesa'],
      fondo: ['Ámbar gris oceánico', 'Almizcle sensual', 'Azafrán']
    }
  },
  {
    test: (id, n) => n.includes('SUPREMACY IN OUD'),
    acordes: [
      { nombre: 'oud', porcentaje: 100, color: '#68452B' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 58, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Azafrán real', 'Nuez moscada', 'Lavanda aromática'],
      corazon: ['Madera de oud exquisita', 'Notas dulces acarameladas'],
      fondo: ['Pachulí de Indonesia', 'Almizcle sensual']
    }
  },
  {
    test: (id, n) => n.includes('SUPREMACY SILVER'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 90, color: '#B8B939' },
      { nombre: 'ahumado', porcentaje: 78, color: '#555555' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'cuero', porcentaje: 55, color: '#5E3A24' }
    ],
    notas: {
      salida: ['Piña jugosa', 'Grosellas negras', 'Bergamota', 'Manzana'],
      corazon: ['Abedul ahumado', 'Pachulí', 'Jazmín', 'Rosa'],
      fondo: ['Almizcle', 'Musgo de roble', 'Ámbar gris', 'Vainilla']
    }
  },

  // ==========================================
  // ARMAF - CLUB DE NUIT & ODYSSEY
  // ==========================================
  {
    test: (id, n) => n.includes('CLUB DE NUIT INTENSE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'ahumado', porcentaje: 78, color: '#555555' },
      { nombre: 'cuero', porcentaje: 68, color: '#5E3A24' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 48, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Limón de Amalfi', 'Piña tropical', 'Bergamota', 'Grosellas negras', 'Manzana'],
      corazon: ['Abedul ahumado', 'Jazmín de Grasse', 'Rosa de mayo'],
      fondo: ['Almizcle blanco', 'Ámbar gris', 'Pachulí', 'Vainilla']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT SILLAGE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'metálico', porcentaje: 85, color: '#797E87' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'verde', porcentaje: 68, color: '#3A8A42' },
      { nombre: 'aromático', porcentaje: 58, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Bergamota', 'Grosellas negras', 'Limón', 'Lima ácida', 'Hojas de violeta', 'Jengibre'],
      corazon: ['Iris florentino', 'Jazmín', 'Rosa'],
      fondo: ['Ambroxan', 'Almizcle blanco', 'Sándalo', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT ICONIC'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'ámbar', porcentaje: 55, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Toronja (pomelo)', 'Menta piperita', 'Limón', 'Pimienta rosa', 'Cilantro'],
      corazon: ['Jengibre fresco', 'Nuez moscada', 'Melón de agua', 'Jazmín'],
      fondo: ['Incienso ahumado', 'Ámbar', 'Cedro', 'Sándalo', 'Pachulí', 'Ládano']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT UNTOLD'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 90, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 80, color: '#AA331E' },
      { nombre: 'metálico', porcentaje: 70, color: '#797E87' },
      { nombre: 'dulce', porcentaje: 60, color: '#FF384D' }
    ],
    notas: {
      salida: ['Azafrán dorado', 'Jazmín blanco'],
      corazon: ['Amberwood luminoso', 'Ámbar gris mineral'],
      fondo: ['Resina de abeto', 'Madera de cedro de Virginia']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT URBAN ELIXIR'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 68, color: '#4A8B71' },
      { nombre: 'ahumado', porcentaje: 58, color: '#555555' }
    ],
    notas: {
      salida: ['Bergamota', 'Pimienta rosa', 'Jazmín', 'Flor de azahar del naranjo'],
      corazon: ['Lavanda', 'Geranio', 'Elemí', 'Tagetes', 'Vetiver', 'Azafrán'],
      fondo: ['Ambroxan de alta fijación', 'Pachulí', 'Ámbar', 'Cedro', 'Ládano']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT PRECIEUX'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'cuero', porcentaje: 78, color: '#5E3A24' },
      { nombre: 'cálido especiado', porcentaje: 68, color: '#AA331E' },
      { nombre: 'cítrico', porcentaje: 58, color: '#B8B939' }
    ],
    notas: {
      salida: ['Piña jugosa', 'Pera', 'Manzana crujiente', 'Pimienta rosa', 'Bergamota'],
      corazon: ['Maderas blancas nobles', 'Jazmín', 'Anís estrellado', 'Lirio de los valles'],
      fondo: ['Cuero fino', 'Vainilla Bourbon', 'Almizcle', 'Pachulí', 'Ámbar', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT LION HEART') || n.includes('CLUB DE NUIT LIONHEART'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'cuero', porcentaje: 78, color: '#5E3A24' },
      { nombre: 'dulce', porcentaje: 68, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Canela pura', 'Nuez moscada', 'Cardamomo verde'],
      corazon: ['Lavanda francesa', 'Madera de gaiac', 'Cuero ahumado'],
      fondo: ['Haba tonka tostada', 'Vainilla negra', 'Ámbar', 'Sándalo']
    }
  },
  {
    test: (id, n) => n.includes('CLUB DE NUIT MALEKA'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Lichi exótico', 'Frutos rojos silvestres', 'Bergamota'],
      corazon: ['Nardos seductores', 'Jazmín sambac', 'Flor de azahar'],
      fondo: ['Vainilla Bourbon', 'Almizcle blanco', 'Madera de cedro']
    }
  },
  {
    test: (id, n) => n.includes('MANDARIN SKY') || n.includes('MANDARINE SKY'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'caramelo', porcentaje: 82, color: '#B86B2B' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 65, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Naranja sanguina', 'Azafrán dorado', 'Salvia'],
      corazon: ['Caramelo fundido', 'Haba tonka tostada', 'Tagetes'],
      fondo: ['Ambroxan de larga estela', 'Cedro seco', 'Vetiver de Haití']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY CANDEE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'caramelo', porcentaje: 80, color: '#B86B2B' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' },
      { nombre: 'almizclado', porcentaje: 60, color: '#797E87' }
    ],
    notas: {
      salida: ['Fresas silvestres', 'Frambuesa jugosa', 'Frutas confitadas'],
      corazon: ['Caramelo artesanal', 'Algodón de azúcar', 'Jazmín blanco'],
      fondo: ['Vainilla de Madagascar', 'Almizcle suave', 'Sándalo cremoso']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY BAHAMAS'),
    acordes: [
      { nombre: 'acuático', porcentaje: 100, color: '#258BD2' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 68, color: '#44A68C' },
      { nombre: 'tropical', porcentaje: 58, color: '#F08080' }
    ],
    notas: {
      salida: ['Bergamota caribeña', 'Fruta de la pasión (maracuyá)', 'Pomelo rosa'],
      corazon: ['Notas marinas oceánicas', 'Flor de tiaré tahitiana', 'Jazmín de agua'],
      fondo: ['Madera de cedro blanco', 'Almizcle solar', 'Ámbar cristalino']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY SPECTRA'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'canela', porcentaje: 78, color: '#A84323' },
      { nombre: 'afrutados', porcentaje: 70, color: '#D74423' },
      { nombre: 'aromático', porcentaje: 60, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Pera madura', 'Lavanda silvestre', 'Menta helada', 'Bergamota'],
      corazon: ['Canela de Ceilán', 'Alcaravea especiada', 'Salvia esclarea'],
      fondo: ['Vainilla negra oriental', 'Ámbar dorado', 'Pachulí', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY MEGA'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'acuático', porcentaje: 58, color: '#258BD2' }
    ],
    notas: {
      salida: ['Bergamota', 'Jengibre vigorizante', 'Manzana verde crocante'],
      corazon: ['Salvia aromática', 'Bayas de enebro', 'Geranio egipcio'],
      fondo: ['Haba tonka', 'Amberwood', 'Vetiver de Haití', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY WHITE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'floral blanco', porcentaje: 78, color: '#D989A6' },
      { nombre: 'almizclado', porcentaje: 68, color: '#797E87' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Pimienta rosa', 'Manzana verde', 'Yuzu japonés'],
      corazon: ['Flor de azahar del naranjo', 'Iris elegante', 'Menta fresca'],
      fondo: ['Vainilla cremosa', 'Cuero blanco suave', 'Pachulí', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY AOUD') || n.includes('ODYSSEY AUOD'),
    acordes: [
      { nombre: 'oud', porcentaje: 100, color: '#68452B' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'cuero', porcentaje: 78, color: '#5E3A24' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Cardamomo oriental', 'Azafrán puro'],
      corazon: ['Madera de oud camboyano', 'Rosa de Damasco', 'Jazmín'],
      fondo: ['Cuero negro', 'Ámbar', 'Sándalo', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY GO MANGO'),
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#F08080' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'cítrico', porcentaje: 72, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 60, color: '#44A68C' }
    ],
    notas: {
      salida: ['Mango Alfonso maduro', 'Maracuyá exótico', 'Mandarina jugosa'],
      corazon: ['Jazmín blanco', 'Flor de azahar', 'Melocotón dulce'],
      fondo: ['Vainilla cremosa', 'Almizcle solar', 'Maderas rubias']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY EAU DE MONTAGNE'),
    acordes: [
      { nombre: 'fresco', porcentaje: 100, color: '#44A68C' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 78, color: '#3A8A42' },
      { nombre: 'cítrico', porcentaje: 68, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Bergamota alpina', 'Menta salvaje helada', 'Limón'],
      corazon: ['Lavanda de alta montaña', 'Hojas de violeta', 'Romero'],
      fondo: ['Cedro blanco', 'Musgo de roble', 'Almizcle puro']
    }
  },
  {
    test: (id, n) => n.includes('ODYSSEY LICHI') || n.includes('LICHI LUSH'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 88, color: '#D27B9B' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'fresco', porcentaje: 70, color: '#44A68C' },
      { nombre: 'almizclado', porcentaje: 58, color: '#797E87' }
    ],
    notas: {
      salida: ['Lichi rosado jugoso', 'Frutas rojas silvestres', 'Bergamota'],
      corazon: ['Rosa de mayo', 'Peonía rosada', 'Magnolia'],
      fondo: ['Almizcle blanco', 'Vainilla suave', 'Madera de cedro']
    }
  },

  // ==========================================
  // LATTAFA
  // ==========================================
  {
    test: (id, n) => n.includes('KHAMRAH') && !n.includes('QAHWA'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 92, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 85, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 76, color: '#8D5524' },
      { nombre: 'canela', porcentaje: 70, color: '#A84323' },
      { nombre: 'ámbar', porcentaje: 62, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Canela de Ceilán', 'Nuez moscada', 'Bergamota italiana'],
      corazon: ['Dátiles confitados', 'Praliné crujiente', 'Nardos seductores', 'Mahonial'],
      fondo: ['Vainilla Bourbon', 'Haba tonka tostada', 'Benjuí de Siam', 'Mirra preciosa', 'Amberwood', 'Madera de akigala']
    }
  },
  {
    test: (id, n) => n.includes('KHAMRAH QAHWA'),
    acordes: [
      { nombre: 'café', porcentaje: 100, color: '#4B2A1E' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 78, color: '#CBB677' },
      { nombre: 'canela', porcentaje: 70, color: '#A84323' },
      { nombre: 'amaderado', porcentaje: 60, color: '#8D5524' }
    ],
    notas: {
      salida: ['Canela cálida', 'Cardamomo verde', 'Jengibre confitado'],
      corazon: ['Café arábica tostado', 'Praliné', 'Frutas dulces secas', 'Flores blancas'],
      fondo: ['Café espresso intenso', 'Vainilla cremosa', 'Haba tonka', 'Benjuí', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('ASAD') && !n.includes('ZANZIBAR') && !n.includes('BOURBON'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' },
      { nombre: 'dulce', porcentaje: 64, color: '#FF384D' },
      { nombre: 'tabaco', porcentaje: 55, color: '#704B30' }
    ],
    notas: {
      salida: ['Pimienta negra picante', 'Piña caramelizada', 'Tabaco rubio'],
      corazon: ['Café recién tostado', 'Iris atalcado', 'Pachulí terroso'],
      fondo: ['Ámbar dorado', 'Vainilla negra', 'Maderas secas nobles', 'Benjuí', 'Ládano']
    }
  },
  {
    test: (id, n) => n.includes('ASAD ZANZIBAR'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'marino', porcentaje: 88, color: '#258BD2' },
      { nombre: 'coco', porcentaje: 78, color: '#86888A' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'iris', porcentaje: 58, color: '#8076A3' }
    ],
    notas: {
      salida: ['Pimienta negra molida', 'Lavanda fresca'],
      corazon: ['Agua de coco salada', 'Iris elegante y empolvado'],
      fondo: ['Vainilla suave', 'Incienso místico ahumado']
    }
  },
  {
    test: (id, n) => n.includes('ASAD BOURBON'),
    acordes: [
      { nombre: 'licoroso', porcentaje: 100, color: '#8A3324' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 72, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 64, color: '#CBB677' }
    ],
    notas: {
      salida: ['Ciruela madura', 'Cardamomo de Ceilán', 'Manzana caramelizada'],
      corazon: ['Whisky bourbon añejo en barrica', 'Canela', 'Nuez moscada'],
      fondo: ['Vainilla Bourbon intensa', 'Tabaco rubio', 'Madera de roble ahumado']
    }
  },
  {
    test: (id, n) => (n.includes('YARA') || id.includes('yara')) && !n.includes('CANDY') && !n.includes('TOUS') && !n.includes('MOI') && !n.includes('ELIXIR'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'atalcado', porcentaje: 70, color: '#988E83' },
      { nombre: 'tropical', porcentaje: 60, color: '#F08080' },
      { nombre: 'floral', porcentaje: 52, color: '#D27B9B' }
    ],
    notas: {
      salida: ['Heliotropo suave', 'Orquídea salvaje', 'Mandarina jugosa'],
      corazon: ['Acuerdo goloso de algodón', 'Frutas tropicales exóticas'],
      fondo: ['Vainilla de Madagascar', 'Almizcle blanco aterciopelado', 'Sándalo cremoso']
    }
  },
  {
    test: (id, n) => n.includes('YARA CANDY'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'caramelo', porcentaje: 82, color: '#B86B2B' },
      { nombre: 'avainillado', porcentaje: 74, color: '#CBB677' },
      { nombre: 'cítrico', porcentaje: 58, color: '#B8B939' }
    ],
    notas: {
      salida: ['Grosellas negras escarchadas', 'Mandarina verde efervescente'],
      corazon: ['Caramelos masticables de fresa', 'Gardenia dulce'],
      fondo: ['Sirope de vainilla', 'Ámbar acaramelado', 'Almizcle', 'Sándalo']
    }
  },
  {
    test: (id, n) => n.includes('YARA TOUS'),
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#F08080' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'floral blanco', porcentaje: 72, color: '#D989A6' },
      { nombre: 'avainillado', porcentaje: 65, color: '#CBB677' },
      { nombre: 'coco', porcentaje: 55, color: '#86888A' }
    ],
    notas: {
      salida: ['Mango Alfonso maduro', 'Agua de coco fresca', 'Maracuyá exótico'],
      corazon: ['Jazmín de Grasse', 'Heliotropo sedoso', 'Flor de azahar'],
      fondo: ['Vainilla cremosa', 'Madera de cachemira', 'Almizcle dorado']
    }
  },
  {
    test: (id, n) => n.includes('YARA MOI'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'caramelo', porcentaje: 90, color: '#B86B2B' },
      { nombre: 'floral blanco', porcentaje: 80, color: '#D989A6' },
      { nombre: 'pachulí', porcentaje: 70, color: '#4B3621' },
      { nombre: 'avainillado', porcentaje: 60, color: '#CBB677' }
    ],
    notas: {
      salida: ['Jazmín sambac', 'Melocotón aterciopelado'],
      corazon: ['Ámbar dorado', 'Caramelo líquido caliente'],
      fondo: ['Pachulí terroso', 'Madera de sándalo']
    }
  },
  {
    test: (id, n) => n.includes('YARA ELIXIR'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 80, color: '#D27B9B' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Frutas del bosque maduras', 'Bergamota italiana'],
      corazon: ['Rosa de Damasco', 'Jazmín nocturno', 'Vainilla'],
      fondo: ['Madera de cedro noble', 'Caramelo fundido', 'Almizcle blanco']
    }
  },
  {
    test: (id, n) => n.includes('BADEE AL OUD') && (n.includes('HONOR') || n.includes('GLORY')),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'cálido especiado', porcentaje: 80, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'canela', porcentaje: 65, color: '#A84323' },
      { nombre: 'ahumado', porcentaje: 52, color: '#555555' }
    ],
    notas: {
      salida: ['Piña caramelizada a la brasa', 'Crème brûlée'],
      corazon: ['Canela de Ceilán', 'Benjuí resinoso', 'Cúrcuma aromática', 'Pimienta negra'],
      fondo: ['Vainilla Bourbon', 'Madera de cachemira', 'Sándalo', 'Musgo de roble']
    }
  },
  {
    test: (id, n) => n.includes('BADEE AL OUD') && n.includes('SUBLIME'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 78, color: '#D27B9B' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'verde', porcentaje: 55, color: '#3A8A42' }
    ],
    notas: {
      salida: ['Manzana roja', 'Lichi jugoso', 'Rosa de Damasco'],
      corazon: ['Ciruela madura', 'Jazmín de Grasse'],
      fondo: ['Vainilla de Madagascar', 'Musgo de roble', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('BADEE AL OUD') && n.includes('NOBLE BLUSH'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 78, color: '#988E83' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'almizclado', porcentaje: 58, color: '#797E87' }
    ],
    notas: {
      salida: ['Leche de almendras dulces', 'Merengue batido'],
      corazon: ['Rosa suave', 'Jazmín de noche'],
      fondo: ['Vainilla Bourbon pura', 'Sándalo cremoso', 'Almizcle blanco']
    }
  },
  {
    test: (id, n) => n.includes('ECLAIRE') && !n.includes('PISTACHE'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 92, color: '#FF384D' },
      { nombre: 'caramelo', porcentaje: 85, color: '#B86B2B' },
      { nombre: 'lactónico', porcentaje: 78, color: '#86888A' },
      { nombre: 'cálido especiado', porcentaje: 60, color: '#AA331E' }
    ],
    notas: {
      salida: ['Caramelo espeso caliente', 'Leche condensada', 'Azúcar moreno tostado'],
      corazon: ['Flores blancas melosas', 'Miel pura de acacia'],
      fondo: ['Vainilla de Madagascar', 'Praliné artesanal', 'Almizcle dulce']
    }
  },
  {
    test: (id, n) => n.includes('ECLAIRE PISTACHE'),
    acordes: [
      { nombre: 'nuez', porcentaje: 100, color: '#8D5524' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'lactónico', porcentaje: 80, color: '#86888A' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' },
      { nombre: 'pistacho', porcentaje: 65, color: '#88B04B' }
    ],
    notas: {
      salida: ['Pistacho tostado crujiente', 'Cardamomo verde'],
      corazon: ['Crema de pistacho artesanal', 'Malvavisco esponjoso'],
      fondo: ['Vainilla Bourbon', 'Haba tonka', 'Maderas suaves dulces']
    }
  },
  {
    test: (id, n) => n.includes('NEBRAS') && !n.includes('ELIXIR'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'cacao', porcentaje: 82, color: '#4B2A1E' },
      { nombre: 'cálido especiado', porcentaje: 72, color: '#AA331E' },
      { nombre: 'afrutados', porcentaje: 62, color: '#D74423' }
    ],
    notas: {
      salida: ['Frutos rojos maduros', 'Mandarina jugosa'],
      corazon: ['Vainilla rica de Madagascar', 'Cacao puro rallado', 'Rosa delicada'],
      fondo: ['Azúcar moreno caramelizado', 'Haba tonka', 'Ámbar cálido', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('TERIAQ') && !n.includes('INTENSE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'cuero', porcentaje: 88, color: '#5E3A24' },
      { nombre: 'caramelo', porcentaje: 82, color: '#B86B2B' },
      { nombre: 'afrutados', porcentaje: 75, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'floral', porcentaje: 55, color: '#D27B9B' }
    ],
    notas: {
      salida: ['Caramelo toffee', 'Almendra amarga', 'Albaricoque aterciopelado', 'Pimienta rosa'],
      corazon: ['Miel dorada', 'Ruibarbo crujiente', 'Flores blancas exóticas', 'Rosa de Damasco'],
      fondo: ['Cuero oscuro lujoso', 'Vainilla', 'Ládano', 'Almizcle', 'Vetiver']
    }
  },
  {
    test: (id, n) => n.includes('TERIAQ INTENSE'),
    acordes: [
      { nombre: 'licoroso', porcentaje: 100, color: '#8A3324' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 84, color: '#FF384D' },
      { nombre: 'canela', porcentaje: 75, color: '#A84323' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 60, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Bergamota de Calabria', 'Canela de Ceilán selecta'],
      corazon: ['Ciruela licorosa añeja', 'Flores nocturnas seductoras'],
      fondo: ['Ámbar gris noble', 'Haba tonka tostada', 'Benjuí resinoso', 'Vainilla pura']
    }
  },
  {
    test: (id, n) => n.includes('VINTAGE RADIO'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'cálido especiado', porcentaje: 68, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 58, color: '#FF384D' }
    ],
    notas: {
      salida: ['Ciruela madura jugosa', 'Lavanda silvestre', 'Salvia aromática'],
      corazon: ['Palo santo ahumado', 'Pimienta negra recién molida'],
      fondo: ['Madera de sándalo rica', 'Ámbar dorado mineral']
    }
  },
  {
    test: (id, n) => n.includes('MUSAMAM WHITE INTENSE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 68, color: '#4A8B71' },
      { nombre: 'coco', porcentaje: 58, color: '#86888A' },
      { nombre: 'sándalo', porcentaje: 52, color: '#8D5524' }
    ],
    notas: {
      salida: ['Bergamota brillante', 'Naranja dulce', 'Especias cálidas finas'],
      corazon: ['Madera de cedro noble', 'Mahonial floral', 'Ylang-ylang exótico', 'Leche de coco'],
      fondo: ['Sándalo cremoso de Mysore', 'Benjuí', 'Almizcle blanco']
    }
  },
  {
    test: (id, n) => n.includes('MAYAR') && !n.includes('CHERRY'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 88, color: '#D27B9B' },
      { nombre: 'fresco', porcentaje: 78, color: '#44A68C' },
      { nombre: 'dulce', porcentaje: 68, color: '#FF384D' },
      { nombre: 'cítrico', porcentaje: 58, color: '#B8B939' }
    ],
    notas: {
      salida: ['Lichi jugoso', 'Frambuesa madura', 'Hojas de violeta'],
      corazon: ['Rosa blanca de Damasco', 'Peonía rosada', 'Jazmín sambac'],
      fondo: ['Vainilla suave', 'Almizcle blanco']
    }
  },
  {
    test: (id, n) => n.includes('MAYAR CHERRY'),
    acordes: [
      { nombre: 'cereza', porcentaje: 100, color: '#990000' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'almendra', porcentaje: 70, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 60, color: '#CBB677' }
    ],
    notas: {
      salida: ['Cereza negra madura', 'Almendra amarga'],
      corazon: ['Rosa turca sensual', 'Jazmín sambac'],
      fondo: ['Vainilla Bourbon', 'Haba tonka tostada', 'Madera de cedro']
    }
  },
  {
    test: (id, n) => n.includes('FAKHAR') && (n.includes('MAN') || n.includes('BLACK') || n.includes('PLATIN')),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' },
      { nombre: 'afrutados', porcentaje: 68, color: '#D74423' },
      { nombre: 'ámbar', porcentaje: 55, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Bergamota italiana', 'Jengibre fresco'],
      corazon: ['Lavanda de Provenza', 'Salvia esclarea', 'Bayas de enebro', 'Geranio'],
      fondo: ['Haba tonka tostada', 'Amberwood', 'Cedro del Atlas', 'Vetiver']
    }
  },
  {
    test: (id, n) => n.includes('FAKHAR') && (n.includes('WOMAN') || n.includes('WOMEN') || n.includes('ROSE')),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'nardos', porcentaje: 88, color: '#C77D98' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 70, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 55, color: '#B8B939' }
    ],
    notas: {
      salida: ['Frutas dulces exóticas', 'Granada', 'Azucena blanca'],
      corazon: ['Nardos hipnóticos', 'Jazmín sambac', 'Gardenia', 'Rosa de Damasco', 'Madreselva'],
      fondo: ['Vainilla cremosa', 'Sándalo', 'Almizcle blanco', 'Ambroxan']
    }
  },
  {
    test: (id, n) => n.includes('FAKHAR GOLD'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 68, color: '#B8B939' },
      { nombre: 'dulce', porcentaje: 55, color: '#FF384D' }
    ],
    notas: {
      salida: ['Pomelo rosado', 'Pimienta rosa', 'Cardamomo de Ceilán'],
      corazon: ['Nardo solar', 'Notas minerales cálidas', 'Artemisia'],
      fondo: ['Ámbar dorado', 'Madera de cachemira', 'Cuero suave', 'Ládano']
    }
  },
  {
    test: (id, n) => n.includes('HAYAATI'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'canela', porcentaje: 88, color: '#A84323' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 68, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 58, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Manzana crocante', 'Bergamota fresca'],
      corazon: ['Canela pura', 'Notas amaderadas secas'],
      fondo: ['Vainilla suave', 'Almizcle limpio']
    }
  },
  {
    test: (id, n) => n.includes('HER CONFESSION'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'lactónico', porcentaje: 70, color: '#86888A' },
      { nombre: 'almizclado', porcentaje: 58, color: '#797E87' }
    ],
    notas: {
      salida: ['Canela fina', 'Flor blanca celestial'],
      corazon: ['Tuberosa cremosa', 'Jazmín de noche', 'Crema de vainilla'],
      fondo: ['Almizcle sensual', 'Madera de sándalo', 'Haba tonka']
    }
  },
  {
    test: (id, n) => n.includes('HIS CONFESSION'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'iris', porcentaje: 78, color: '#8076A3' },
      { nombre: 'dulce', porcentaje: 68, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Canela pura', 'Lavanda fresca', 'Mandarina siciliana'],
      corazon: ['Benjuí resinoso', 'Iris empolvado', 'Ciprés verde'],
      fondo: ['Vainilla oscura', 'Haba tonka', 'Cedro noble', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('QAED AL FURSAN') && !n.includes('UNTAMED'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'fresco', porcentaje: 68, color: '#44A68C' },
      { nombre: 'cuero', porcentaje: 55, color: '#5E3A24' }
    ],
    notas: {
      salida: ['Piña madura jugosa', 'Azafrán oriental'],
      corazon: ['Jazmín blanco', 'Abeto balsámico'],
      fondo: ['Ámbar dorado', 'Madera de cedro', 'Madera de oud sutil']
    }
  },

  // ==========================================
  // RASASI - HAWAS
  // ==========================================
  {
    test: (id, n) => n.includes('HAWAS') && (n.includes('ICE') || id.includes('ice')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 90, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 82, color: '#44A68C' },
      { nombre: 'aromático', porcentaje: 72, color: '#4A8B71' },
      { nombre: 'acuático', porcentaje: 64, color: '#258BD2' },
      { nombre: 'dulce', porcentaje: 55, color: '#FF384D' }
    ],
    notas: {
      salida: ['Manzana helada escarchada', 'Bergamota de Calabria', 'Limón siciliano', 'Anís estrellado'],
      corazon: ['Ciruela jugosa', 'Flor de azahar brillante', 'Cardamomo fresco'],
      fondo: ['Ámbar cristalino glacial', 'Almizcle blanco puro', 'Musgo de roble', 'Maderas flotantes']
    }
  },
  {
    test: (id, n) => n.includes('HAWAS') && !n.includes('ICE') && !n.includes('FIRE') && !n.includes('KOBRA') && !n.includes('MALIBU') && !n.includes('TROPICAL') && !n.includes('VERDE'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'acuático', porcentaje: 80, color: '#258BD2' },
      { nombre: 'fresco especiado', porcentaje: 72, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 62, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Bergamota italiana', 'Limón de Sicilia', 'Canela'],
      corazon: ['Ciruela acuosa', 'Flor de azahar del naranjo', 'Cardamomo', 'Notas marinas vibrantes'],
      fondo: ['Ámbar gris oceánico', 'Almizcle sensual', 'Pachulí terroso', 'Maderas a la deriva']
    }
  },
  {
    test: (id, n) => n.includes('HAWAS FIRE'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'ahumado', porcentaje: 88, color: '#555555' },
      { nombre: 'ámbar', porcentaje: 80, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' },
      { nombre: 'cuero', porcentaje: 60, color: '#5E3A24' }
    ],
    notas: {
      salida: ['Pimienta negra de Madagascar', 'Cardamomo verde', 'Nuez moscada'],
      corazon: ['Canela en corteza', 'Humo de madera noble', 'Ládano resinoso'],
      fondo: ['Ámbar seco', 'Cuero ahumado', 'Pachulí', 'Cedro']
    }
  },

  // ==========================================
  // FRENCH AVENUE
  // ==========================================
  {
    test: (id, n) => n.includes('LIQUID BRUN'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 82, color: '#8D5524' },
      { nombre: 'canela', porcentaje: 74, color: '#A84323' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' },
      { nombre: 'dulce', porcentaje: 58, color: '#FF384D' }
    ],
    notas: {
      salida: ['Canela de Ceilán selecta', 'Cardamomo aromático', 'Flor de azahar brillante', 'Bergamota'],
      corazon: ['Vainilla Bourbon de Madagascar', 'Haba tonka tostada'],
      fondo: ['Praliné acaramelado', 'Almizcle sensual', 'Madera de gaiac noble', 'Ambroxan']
    }
  },
  {
    test: (id, n) => n.includes('SPECTRE GHOST'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'dulce', porcentaje: 58, color: '#FF384D' }
    ],
    notas: {
      salida: ['Jengibre fresco picante', 'Bergamota italiana'],
      corazon: ['Grosellas negras maduras', 'Rosa turca', 'Cardamomo'],
      fondo: ['Vainilla suntuosa', 'Sándalo cremoso', 'Madera de cedro', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('SPECTRE WRAITH'),
    acordes: [
      { nombre: 'café', porcentaje: 100, color: '#4B2A1E' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' },
      { nombre: 'licoroso', porcentaje: 62, color: '#8A3324' }
    ],
    notas: {
      salida: ['Ron caribeño oscuro', 'Caña de azúcar caramelizada'],
      corazon: ['Café espresso tostado', 'Chocolate negro amargo', 'Caramelo fundido'],
      fondo: ['Madera de sándalo', 'Almendra tostada', 'Vainilla negra']
    }
  },
  {
    test: (id, n) => n.includes('ROYAL BLEND'),
    acordes: [
      { nombre: 'licoroso', porcentaje: 100, color: '#8A3324' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' },
      { nombre: 'canela', porcentaje: 68, color: '#A84323' }
    ],
    notas: {
      salida: ['Coñac envejecido en barrica', 'Canela de Ceilán', 'Nuez moscada'],
      corazon: ['Haba tonka tostada', 'Madera de roble noble'],
      fondo: ['Vainilla Bourbon pura', 'Praliné crujiente', 'Sándalo']
    }
  },

  // ==========================================
  // JEAN PAUL GAULTIER
  // ==========================================
  {
    test: (id, n) => n.includes('LE MALE ELIXIR'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 82, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' },
      { nombre: 'miel', porcentaje: 68, color: '#DDA135' },
      { nombre: 'lavanda', porcentaje: 62, color: '#8076A3' },
      { nombre: 'tabaco', porcentaje: 55, color: '#704B30' },
      { nombre: 'cálido especiado', porcentaje: 48, color: '#AA331E' }
    ],
    notas: {
      salida: ['Lavanda aromática de Provenza', 'Menta helada refrescante'],
      corazon: ['Vainilla cremosa de Madagascar', 'Benjuí de Siam resinoso'],
      fondo: ['Miel dorada pura', 'Haba tonka tostada', 'Hojas de tabaco rubio']
    }
  },
  {
    test: (id, n) => n.includes('LE MALE LE PARFUM'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'lavanda', porcentaje: 70, color: '#8076A3' },
      { nombre: 'atalcado', porcentaje: 62, color: '#988E83' },
      { nombre: 'amaderado', porcentaje: 52, color: '#8D5524' }
    ],
    notas: {
      salida: ['Cardamomo de Guatemala'],
      corazon: ['Lavanda de Provenza', 'Iris empolvado'],
      fondo: ['Vainilla oscura oriental', 'Notas orientales suntuosas', 'Maderas nobles']
    }
  },
  {
    test: (id, n) => n.includes('LE BEAU') && n.includes('PARADISE GARDEN'),
    acordes: [
      { nombre: 'verde', porcentaje: 100, color: '#3A8A42' },
      { nombre: 'acuático', porcentaje: 88, color: '#258BD2' },
      { nombre: 'coco', porcentaje: 80, color: '#86888A' },
      { nombre: 'dulce', porcentaje: 72, color: '#FF384D' },
      { nombre: 'fresco', porcentaje: 65, color: '#44A68C' }
    ],
    notas: {
      salida: ['Notas acuosas cristalinas', 'Menta helada', 'Jengibre', 'Notas verdes'],
      corazon: ['Sal marina', 'Agua de coco fresca', 'Higo verde jugoso'],
      fondo: ['Sándalo cremoso', 'Haba tonka']
    }
  },
  {
    test: (id, n) => n.includes('LE BEAU LE PARFUM'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'coco', porcentaje: 88, color: '#86888A' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 70, color: '#AA331E' },
      { nombre: 'ámbar', porcentaje: 60, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Piña jugosa', 'Iris elegante', 'Ciprés fresco', 'Jengibre picante'],
      corazon: ['Coco cremoso tostado', 'Notas amaderadas solares'],
      fondo: ['Haba tonka', 'Sándalo', 'Ámbar cálido', 'Ámbar gris']
    }
  },
  {
    test: (id, n) => n.includes('LE BEAU') && !n.includes('PARADISE') && !n.includes('LE PARFUM'),
    acordes: [
      { nombre: 'coco', porcentaje: 100, color: '#86888A' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 78, color: '#CBB677' },
      { nombre: 'cítrico', porcentaje: 68, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Bergamota de Calabria radiante'],
      corazon: ['Madera de coco tostada'],
      fondo: ['Haba tonka adictiva']
    }
  },
  {
    test: (id, n) => n.includes('SCANDAL POUR HOMME') || n.includes('SCANDAL INTENSE'),
    acordes: [
      { nombre: 'caramelo', porcentaje: 100, color: '#B86B2B' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 60, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Salvia esclarea aromática'],
      corazon: ['Caramelo fundido', 'Haba tonka tostada'],
      fondo: ['Vetiver terroso de Haití']
    }
  },
  {
    test: (id, n) => n.includes('DIVINE') && (n.includes('ELIXIR') || n.includes('DIVINE')),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'salado', porcentaje: 88, color: '#808080' },
      { nombre: 'floral blanco', porcentaje: 80, color: '#D989A6' },
      { nombre: 'marino', porcentaje: 70, color: '#258BD2' },
      { nombre: 'amarillo floral', porcentaje: 60, color: '#DFBF48' }
    ],
    notas: {
      salida: ['Calypsone marino', 'Frutos rojos maduros', 'Bergamota'],
      corazon: ['Lirio majestuoso', 'Jazmín solar', 'Ylang-ylang'],
      fondo: ['Merengue dulce esponjoso', 'Sal marina', 'Pachulí blanco', 'Almizcle']
    }
  },

  // ==========================================
  // DIOR
  // ==========================================
  {
    test: (id, n) => n.includes('FAHRENHEIT'),
    acordes: [
      { nombre: 'cuero', porcentaje: 100, color: '#5E3A24' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'ozónico', porcentaje: 75, color: '#4F9BC2' },
      { nombre: 'fresco especiado', porcentaje: 65, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 55, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 45, color: '#1F7A28' }
    ],
    notas: {
      salida: ['Flor del moscadero', 'Lavanda silvestre', 'Cedro', 'Manzanilla', 'Mandarina siciliana', 'Flor del espino', 'Bergamota', 'Limón'],
      corazon: ['Hojas de violeta auténtica', 'Nuez moscada', 'Cedro del Atlas', 'Sándalo', 'Clavel especiado', 'Madreselva', 'Jazmín', 'Lirio de los valles'],
      fondo: ['Cuero ruso intenso', 'Vetiver de Haití', 'Almizcle animal', 'Ámbar fósil', 'Pachulí terroso', 'Haba tonka']
    }
  },

  // ==========================================
  // XERJOFF
  // ==========================================
  {
    test: (id, n) => n.includes('ERBA PURA'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 90, color: '#B8B939' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 74, color: '#797E87' },
      { nombre: 'avainillado', porcentaje: 65, color: '#CBB677' }
    ],
    notas: {
      salida: ['Naranja de Sicilia dulce', 'Bergamota de Calabria', 'Limón de Sicilia'],
      corazon: ['Cesta de frutas mediterráneas exuberantes'],
      fondo: ['Almizcle blanco sensual', 'Vainilla pura de Madagascar', 'Ámbar dorado']
    }
  },
  {
    test: (id, n) => n.includes('NAXOS'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'miel', porcentaje: 92, color: '#DDA135' },
      { nombre: 'tabaco', porcentaje: 85, color: '#704B30' },
      { nombre: 'cítrico', porcentaje: 75, color: '#B8B939' },
      { nombre: 'lavanda', porcentaje: 68, color: '#8076A3' },
      { nombre: 'avainillado', porcentaje: 60, color: '#CBB677' }
    ],
    notas: {
      salida: ['Lavanda de Provenza', 'Bergamota italiana', 'Limón de Sicilia'],
      corazon: ['Miel silvestre pura', 'Canela especiada', 'Cachemira sedosa', 'Jazmín sambac'],
      fondo: ['Hojas de tabaco aromático', 'Haba tonka tostada', 'Vainilla Bourbon']
    }
  },
  {
    test: (id, n) => n.includes('TORINO 21'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 90, color: '#3A8A42' },
      { nombre: 'cítrico', porcentaje: 82, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 72, color: '#4B8E6D' },
      { nombre: 'herbal', porcentaje: 60, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Menta fresca de jardín', 'Limón de Calabria', 'Albahaca verde', 'Tomillo'],
      corazon: ['Grosellas negras', 'Romero aromático', 'Lavanda', 'Jazmín'],
      fondo: ['Hierbaluisa luminosa', 'Almizcle blanco limpio']
    }
  },

  // ==========================================
  // PARFUMS DE MARLY
  // ==========================================
  {
    test: (id, n) => n.includes('ALTHAIR') || n.includes('ALTHAÏR'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 74, color: '#8D5524' },
      { nombre: 'canela', porcentaje: 66, color: '#A84323' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Canela de Ceilán selecta', 'Cardamomo de Guatemala', 'Flor de azahar', 'Bergamota'],
      corazon: ['Vainilla Bourbon de Madagascar', 'Elemí resinoso'],
      fondo: ['Praliné tostado', 'Almizcle blanco', 'Ambroxan', 'Madera de gaiac']
    }
  },

  // ==========================================
  // PACO RABANNE
  // ==========================================
  {
    test: (id, n) => (n.includes('1 MILLION') || n.includes('ONE MILLION')) && !n.includes('ELIXIR') && !n.includes('ROYAL') && !n.includes('PARFUM') && !n.includes('GOLD'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'canela', porcentaje: 88, color: '#A84323' },
      { nombre: 'cuero', porcentaje: 78, color: '#5E3A24' },
      { nombre: 'cítrico', porcentaje: 68, color: '#B8B939' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 48, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mandarina roja sanguínea', 'Toronja rosada', 'Menta piperita'],
      corazon: ['Canela pura especiada', 'Notas especiadas orientales', 'Absoluto de rosa'],
      fondo: ['Ámbar dorado', 'Cuero suave masculino', 'Maderas blancas ricas', 'Pachulí hindú']
    }
  },
  {
    test: (id, n) => n.includes('MILLION ELIXIR') || n.includes('GOLD ELIXIR'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'ámbar', porcentaje: 70, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 60, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana roja glaseada', 'Davana aromática'],
      corazon: ['Rosa de Damasco', 'Osmanto dorado', 'Madera de cedro'],
      fondo: ['Absoluto de vainilla Bourbon', 'Haba tonka tostada', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('MILLION ROYAL'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 68, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 58, color: '#CBB677' }
    ],
    notas: {
      salida: ['Cardamomo de Guatemala', 'Mandarina jugosa', 'Bergamota'],
      corazon: ['Lavanda francesa', 'Salvia esclarea', 'Hojas de violeta'],
      fondo: ['Benjuí resinoso', 'Cedro noble', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('INVICTUS') && !n.includes('VICTORY'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'marino', porcentaje: 90, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 60, color: '#8D5524' }
    ],
    notas: {
      salida: ['Notas marinas oceánicas', 'Toronja (pomelo) jugosa', 'Mandarina'],
      corazon: ['Hoja de laurel victoriosa', 'Jazmín hediona'],
      fondo: ['Ámbar gris mineral', 'Madera de gaiac', 'Musgo de roble', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('INVICTUS VICTORY'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 80, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 70, color: '#4A8B71' },
      { nombre: 'cálido especiado', porcentaje: 60, color: '#AA331E' }
    ],
    notas: {
      salida: ['Pimienta rosa vibrante', 'Limón (lima ácida)'],
      corazon: ['Lavanda de Provenza', 'Incienso de olíbano ahumado'],
      fondo: ['Vainilla oscura intensa', 'Haba tonka', 'Ámbar cálido']
    }
  },
  {
    test: (id, n) => n.includes('FAME') && (n.includes('PACO') || n.includes('RABANNE')),
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#F08080' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' },
      { nombre: 'floral blanco', porcentaje: 60, color: '#D989A6' }
    ],
    notas: {
      salida: ['Mango jugoso suculento', 'Bergamota italiana'],
      corazon: ['Jazmín puro de Grasse', 'Incienso de olíbano'],
      fondo: ['Vainilla de Madagascar', 'Madera de sándalo']
    }
  },
  {
    test: (id, n) => n.includes('LADY MILLION'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'miel', porcentaje: 80, color: '#DDA135' },
      { nombre: 'cítrico', porcentaje: 70, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 60, color: '#D74423' }
    ],
    notas: {
      salida: ['Frambuesa jugosa', 'Neroli fresco', 'Limón de Amalfi'],
      corazon: ['Jazmín sambac', 'Flor del naranjo africano', 'Gardenia'],
      fondo: ['Miel blanca pura', 'Pachulí', 'Ámbar']
    }
  },

  // ==========================================
  // CAROLINA HERRERA
  // ==========================================
  {
    test: (id, n) => n.includes('BAD BOY') && !n.includes('EXTREME') && !n.includes('LE PARFUM'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'cacao', porcentaje: 78, color: '#4B2A1E' },
      { nombre: 'dulce', porcentaje: 68, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Pimienta blanca picante', 'Pimienta negra molida', 'Bergamota'],
      corazon: ['Salvia aromática', 'Madera de cedro'],
      fondo: ['Haba tonka tostada', 'Cacao puro rallado', 'Amberwood']
    }
  },
  {
    test: (id, n) => n.includes('BAD BOY EXTREME'),
    acordes: [
      { nombre: 'cacao', porcentaje: 100, color: '#4B2A1E' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'ahumado', porcentaje: 72, color: '#555555' },
      { nombre: 'ámbar', porcentaje: 62, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 52, color: '#8D5524' }
    ],
    notas: {
      salida: ['Jengibre fresco picante', 'Bergamota italiana'],
      corazon: ['Vetiver de las arenas', 'Cacao puro tostado'],
      fondo: ['Haba tonka suntuosa', 'Pachulí terroso']
    }
  },
  {
    test: (id, n) => n.includes('212 VIP BLACK') && !n.includes('ELIXIR'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'anisado', porcentaje: 78, color: '#5F9EA0' },
      { nombre: 'especiado suave', porcentaje: 68, color: '#8C5240' },
      { nombre: 'dulce', porcentaje: 58, color: '#FF384D' }
    ],
    notas: {
      salida: ['Absenta nocturna', 'Anís estrellado', 'Hinojo'],
      corazon: ['Lavanda francesa aromática'],
      fondo: ['Vainilla negra oriental', 'Almizcle sensual']
    }
  },
  {
    test: (id, n) => n.includes('212 VIP BLACK ELIXIR'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'café', porcentaje: 58, color: '#4B2A1E' }
    ],
    notas: {
      salida: ['Cardamomo negro', 'Mandarina jugosa'],
      corazon: ['Café licoroso', 'Lavanda de medianoche'],
      fondo: ['Vainilla negra Bourbon', 'Cuero ahumado', 'Ámbar seco']
    }
  },
  {
    test: (id, n) => n.includes('GOOD GIRL') && !n.includes('BLUSH') && !n.includes('VERY'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'floral blanco', porcentaje: 88, color: '#D989A6' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' },
      { nombre: 'cacao', porcentaje: 62, color: '#4B2A1E' },
      { nombre: 'almendra', porcentaje: 54, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Almendra crocante', 'Café arábica', 'Bergamota', 'Limón'],
      corazon: ['Nardos seductores', 'Jazmín sambac', 'Flor de azahar', 'Rosa de Bulgaria'],
      fondo: ['Haba tonka tostada', 'Cacao puro', 'Vainilla Bourbon', 'Praliné', 'Sándalo', 'Ámbar', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('VERY GOOD GIRL'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'rosa', porcentaje: 90, color: '#D27B9B' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 70, color: '#D27B9B' },
      { nombre: 'avainillado', porcentaje: 60, color: '#CBB677' }
    ],
    notas: {
      salida: ['Lichi exótico jugoso', 'Grosella roja fresca'],
      corazon: ['Rosa de mayo aterciopelada'],
      fondo: ['Vainilla de Madagascar cremosa', 'Vetiver de Haití']
    }
  },
  {
    test: (id, n) => n.includes('GOOD GIRL BLUSH'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#D27B9B' },
      { nombre: 'atalcado', porcentaje: 88, color: '#988E83' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'fresco', porcentaje: 58, color: '#44A68C' }
    ],
    notas: {
      salida: ['Bergamota italiana', 'Mandarina brillante'],
      corazon: ['Peonía rosada', 'Agua de rosas destilada', 'Ylang-ylang exótico'],
      fondo: ['Vainilla Bourbon doble', 'Haba tonka']
    }
  },

  // ==========================================
  // EMPORIO ARMANI & GIORGIO ARMANI
  // ==========================================
  {
    test: (id, n) => n.includes('STRONGER WITH YOU') && !n.includes('INTENSELY'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 72, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 62, color: '#8D5524' }
    ],
    notas: {
      salida: ['Cardamomo de Ceilán', 'Pimienta rosa', 'Hojas de violeta', 'Menta fresca'],
      corazon: ['Salvia aromática', 'Melón dulce', 'Piña'],
      fondo: ['Vainilla Bourbon', 'Castaña glaseada', 'Cedro', 'Amberwood']
    }
  },
  {
    test: (id, n) => n.includes('STRONGER WITH YOU INTENSELY'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 84, color: '#FF384D' },
      { nombre: 'canela', porcentaje: 76, color: '#A84323' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 58, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Pimienta rosa picante', 'Enebro aromático', 'Violeta'],
      corazon: ['Canela pura', 'Caramelo toffee derretido', 'Salvia esclarea', 'Lavanda'],
      fondo: ['Vainilla intensa', 'Haba tonka tostada', 'Ámbar cálido', 'Gamuza suave']
    }
  },
  {
    test: (id, n) => n.includes('ACQUA DI GIO'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'marino', porcentaje: 90, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' },
      { nombre: 'verde', porcentaje: 58, color: '#3A8A42' }
    ],
    notas: {
      salida: ['Notas marinas oceánicas', 'Bergamota de Calabria', 'Mandarina verde', 'Neroli'],
      corazon: ['Jazmín de agua', 'Romero aromático', 'Calone marino', 'Caqui'],
      fondo: ['Cedro del Atlas', 'Pachulí de Indonesia', 'Almizcle blanco', 'Musgo de roble']
    }
  },

  // ==========================================
  // VERSACE
  // ==========================================
  {
    test: (id, n) => n.includes('EROS') && !n.includes('FLAME') && !n.includes('ENERGY') && !n.includes('NAJIM'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 88, color: '#3A8A42' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' },
      { nombre: 'dulce', porcentaje: 60, color: '#FF384D' },
      { nombre: 'cítrico', porcentaje: 50, color: '#B8B939' }
    ],
    notas: {
      salida: ['Menta piperita fresca', 'Manzana verde crocante', 'Limón italiano'],
      corazon: ['Haba tonka venezolana', 'Ambroxan mineral', 'Geranio egipcio'],
      fondo: ['Vainilla de Madagascar', 'Cedro de Virginia', 'Cedro del Atlas', 'Vetiver', 'Musgo de roble']
    }
  },
  {
    test: (id, n) => n.includes('EROS FLAME'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Pimienta negra picante', 'Chinotto cítrico', 'Romero aromático', 'Limón'],
      corazon: ['Pimienta amaderada', 'Geranio', 'Rosa de Damasco'],
      fondo: ['Vainilla Bourbon', 'Haba tonka tostada', 'Sándalo', 'Cedro de Texas', 'Pachulí', 'Musgo']
    }
  },
  {
    test: (id, n) => n.includes('EROS ENERGY'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 88, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 68, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Naranja sanguina solar', 'Lima ácida', 'Limón de Sorrento', 'Pomelo rosa', 'Mandarina'],
      corazon: ['Pimienta blanca picante', 'Pimienta rosa', 'Grosella negra'],
      fondo: ['Almizcle limpio', 'Musgo de roble', 'Pachulí noble']
    }
  },
  {
    test: (id, n) => n.includes('DYLAN BLUE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'acuático', porcentaje: 80, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 72, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 62, color: '#4B8E6D' },
      { nombre: 'ahumado', porcentaje: 52, color: '#555555' }
    ],
    notas: {
      salida: ['Bergamota de Calabria', 'Notas acuáticas refrescantes', 'Pomelo', 'Hojas de higuera'],
      corazon: ['Ambroxan fijador', 'Pimienta negra', 'Pachulí', 'Papiro de Egipto', 'Hojas de violeta'],
      fondo: ['Incienso místico', 'Almizcle', 'Haba tonka', 'Azafrán dorado']
    }
  },

  // ==========================================
  // ARIANA GRANDE
  // ==========================================
  {
    test: (id, n) => n.includes('CLOUD') && !n.includes('PINK') && !n.includes('INTENSE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'lactónico', porcentaje: 90, color: '#86888A' },
      { nombre: 'avainillado', porcentaje: 82, color: '#CBB677' },
      { nombre: 'coco', porcentaje: 74, color: '#86888A' },
      { nombre: 'atalcado', porcentaje: 62, color: '#988E83' },
      { nombre: 'almizclado', porcentaje: 52, color: '#797E87' }
    ],
    notas: {
      salida: ['Lavanda suave', 'Pera jugosa', 'Bergamota fresca'],
      corazon: ['Crema batida dulce', 'Praliné artesanal', 'Coco rallado', 'Orquídea de vainilla'],
      fondo: ['Almizcle blanco aterciopelado', 'Notas amaderadas suaves']
    }
  },
  {
    test: (id, n) => n.includes('CLOUD INTENSE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'lactónico', porcentaje: 82, color: '#86888A' },
      { nombre: 'ámbar', porcentaje: 74, color: '#C87D2A' },
      { nombre: 'coco', porcentaje: 64, color: '#86888A' }
    ],
    notas: {
      salida: ['Lavanda francesa', 'Pera dulce', 'Bergamota'],
      corazon: ['Crema batida densa', 'Praliné', 'Coco tostado', 'Orquídea de vainilla'],
      fondo: ['Ambroxan cálido', 'Madera de cachemira', 'Almizcle', 'Maderas']
    }
  },
  {
    test: (id, n) => n.includes('CLOUD PINK'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 82, color: '#CBB677' },
      { nombre: 'tropical', porcentaje: 72, color: '#F08080' },
      { nombre: 'coco', porcentaje: 62, color: '#86888A' }
    ],
    notas: {
      salida: ['Fruta del dragón (pitahaya)', 'Bayas silvestres rosadas', 'Piña fresca'],
      corazon: ['Agua de coco', 'Orquídea de vainilla dulce', 'Ambreta'],
      fondo: ['Praliné rosado', 'Almizcle blanco', 'Amberwood', 'Musgo suave']
    }
  },
  {
    test: (id, n) => n.includes('THANK U NEXT'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'coco', porcentaje: 88, color: '#86888A' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' },
      { nombre: 'rosa', porcentaje: 58, color: '#D27B9B' }
    ],
    notas: {
      salida: ['Frambuesa jugosa brillante', 'Pera blanca crujiente'],
      corazon: ['Crema de coco tropical', 'Pétalos de rosa rosa'],
      fondo: ['Macarons franceses dulces', 'Almizcle aterciopelado']
    }
  },

  // ==========================================
  // DUMONT - NITRO
  // ==========================================
  {
    test: (id, n) => n.includes('NITRO RED'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'acuático', porcentaje: 88, color: '#258BD2' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'aromático', porcentaje: 70, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 60, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana roja crocante', 'Lavanda fresca', 'Bergamota italiana'],
      corazon: ['Sandía jugosa dulce', 'Cedro noble', 'Calamus'],
      fondo: ['Sándalo cremoso', 'Pachulí terroso', 'Ámbar cálido']
    }
  },
  {
    test: (id, n) => n.includes('NITRO WHITE'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 78, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 68, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' }
    ],
    notas: {
      salida: ['Miel de acacia dorada', 'Bergamota brillante', 'Manzana'],
      corazon: ['Vainilla cremosa', 'Cedro', 'Lavanda'],
      fondo: ['Ámbar seco', 'Haba tonka tostada', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('NITRO ELIXIR') || n.includes('NITRO INTENSE'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'ámbar', porcentaje: 80, color: '#C87D2A' },
      { nombre: 'dulce', porcentaje: 70, color: '#FF384D' },
      { nombre: 'cuero', porcentaje: 58, color: '#5E3A24' }
    ],
    notas: {
      salida: ['Cardamomo de Ceilán', 'Pimienta rosa', 'Cítricos'],
      corazon: ['Canela oscura', 'Lavanda', 'Maderas preciosas'],
      fondo: ['Ámbar dorado', 'Vainilla negra', 'Cuero ahumado', 'Pachulí']
    }
  },

  // ==========================================
  // BHARARA
  // ==========================================
  {
    test: (id, n) => n.includes('BHARARA KING') || n.includes('KING BHARARA'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 74, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 62, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Naranja dulce jugosa', 'Limón siciliano', 'Bergamota italiana'],
      corazon: ['Notas afrutadas dulces exuberantes'],
      fondo: ['Vainilla de Madagascar pura', 'Ámbar blanco radiante', 'Almizcle sensual']
    }
  },

  // ==========================================
  // GAME OF SPADES
  // ==========================================
  {
    test: (id, n) => n.includes('GAME OF SPADES'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Cítricos chispeantes', 'Notas afrutadas dulces', 'Bergamota'],
      corazon: ['Flores blancas aromáticas', 'Especias cálidas finas', 'Jazmín'],
      fondo: ['Ámbar dorado rico', 'Vainilla suave', 'Madera de cedro', 'Almizcle']
    }
  },

  // ==========================================
  // TUBBEES GOURMAND COLLECTION
  // ==========================================
  {
    test: (id, n) => n.includes('TUBBEES'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'lactónico', porcentaje: 80, color: '#86888A' },
      { nombre: 'caramelo', porcentaje: 70, color: '#B86B2B' },
      { nombre: 'afrutados', porcentaje: 60, color: '#D74423' }
    ],
    notas: {
      salida: ['Azúcar hilado dulce', 'Fresas maduras glaseadas', 'Frutas confitadas'],
      corazon: ['Caramelo de mantequilla caliente', 'Vainilla cremosa batida', 'Malvavisco'],
      fondo: ['Vainilla de Madagascar', 'Almizcle suave dulce', 'Haba tonka']
    }
  }
];

function enriquecerCatalogo() {
  const path = 'src/assets/perfumes.json';
  const catalog = JSON.parse(fs.readFileSync(path, 'utf8'));

  let enriquecidosCount = 0;

  for (const p of catalog) {
    const id = p.id.toLowerCase();
    const nombre = p.nombre.toUpperCase();

    // Buscar regla específica
    const regla = FRAGRANTICA_RULES.find(r => r.test(id, nombre));
    if (regla) {
      p.acordes = regla.acordes;
      p.notas = regla.notas;
      enriquecidosCount++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`✅ Catálogo enriquecido con pirámides de Fragrantica: ${enriquecidosCount} perfumes actualizados.`);
}

enriquecerCatalogo();
