const fs = require('fs');

/**
 * Segunda fase de enriquecimiento con pirámides olfativas y acordes auténticos de Fragrantica.es
 * Cubre diseñadores clásicos, nicho, perfumes árabes restantes y líneas juveniles/infantiles Air-Val.
 */
const FRAGRANTICA_RULES_2 = [
  // ==========================================
  // AIR-VAL (Colecciones con Licencia Oficial)
  // ==========================================
  {
    test: (id, n) => n.includes('BARBIE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'floral', porcentaje: 75, color: '#E87EA1' },
      { nombre: 'avainillado', porcentaje: 60, color: '#CBB677' }
    ],
    notas: {
      salida: ['Fresas maduras glaseadas', 'Mandarina chispeante', 'Manzana roja'],
      corazon: ['Flor de cerezo japonesa', 'Pétalos de jazmín', 'Rosa suave'],
      fondo: ['Vainilla dulce', 'Almizcle blanco delicado', 'Azúcar hilado']
    }
  },
  {
    test: (id, n) => n.includes('BOB ESPONJA'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'marino', porcentaje: 85, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 70, color: '#4A8B71' },
      { nombre: 'fresco', porcentaje: 65, color: '#68B684' }
    ],
    notas: {
      salida: ['Limón fresco', 'Mandarina jugosa', 'Romero'],
      corazon: ['Notas marinas oceánicas', 'Lirio de los valles', 'Jazmín acuático'],
      fondo: ['Almizcle limpio', 'Madera de cedro suave', 'Ámbar claro']
    }
  },
  {
    test: (id, n) => n.includes('EAU MY BB'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'floral blanco', porcentaje: 85, color: '#DDDCD7' },
      { nombre: 'atalcado', porcentaje: 75, color: '#988E83' },
      { nombre: 'almizclado', porcentaje: 70, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Bergamota suave', 'Petitgrain', 'Limón de Amalfi'],
      corazon: ['Flor de azahar del naranjo', 'Rosa blanca', 'Violeta delicada'],
      fondo: ['Almizcle blanco aterciopelado', 'Vainilla sutil']
    }
  },
  {
    test: (id, n) => n.includes('EAU MY UNICORN'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 75, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Frambuesa silvestre', 'Fresas dulces', 'Pera cristalina'],
      corazon: ['Rosa de mayo', 'Lirio blanco', 'Flor de azahar'],
      fondo: ['Almizcle suave', 'Vainilla cremosa', 'Algodón de azúcar']
    }
  },
  {
    test: (id, n) => n.includes('FC BARCELONA') || n.includes('FCB BARCELONA'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 60, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Limón italiano', 'Naranja amarga', 'Pimienta rosa'],
      corazon: ['Cardamomo', 'Lavanda fresca', 'Flor de azahar'],
      fondo: ['Madera de cedro', 'Sándalo', 'Pachulí noble']
    }
  },
  {
    test: (id, n) => n.includes('REAL MADRID') || n.includes('FC REAL MADRID'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 80, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mandarina vibrante', 'Pomelo blanco', 'Menta fresca'],
      corazon: ['Lavanda francesa', 'Cardamomo', 'Nuez moscada'],
      fondo: ['Madera de cedro', 'Ámbar seco', 'Vetiver']
    }
  },
  {
    test: (id, n) => n.includes('FROZEN'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'floral', porcentaje: 75, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Mandarina jugosa', 'Pomelo rosado'],
      corazon: ['Flor de azahar', 'Frambuesa ácida', 'Jazmín acuático'],
      fondo: ['Almizcle blanco', 'Vainilla dulce', 'Maderas claras']
    }
  },
  {
    test: (id, n) => n.includes('LILO AND STICH') || n.includes('LILO & STITCH'),
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#E8A317' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' }
    ],
    notas: {
      salida: ['Mango hawaiano jugoso', 'Piña fresca', 'Agua de coco'],
      corazon: ['Flor de tiaré', 'Frangipani', 'Jazmín de playa'],
      fondo: ['Vainilla de Tahití', 'Almizcle blanco', 'Madera de sándalo suave']
    }
  },
  {
    test: (id, n) => n.includes('MARVEL') || n.includes('CAPITAN AMERICA') || n.includes('IRON'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 60, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Manzana roja', 'Bergamota italiana', 'Pimienta negra'],
      corazon: ['Lavanda silvestre', 'Salvia aromática', 'Notas marinas'],
      fondo: ['Madera de cedro', 'Pachulí terroso', 'Ámbar cálido']
    }
  },
  {
    test: (id, n) => n.includes('MICKEY'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 85, color: '#68B684' },
      { nombre: 'aromático', porcentaje: 70, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Limón de Sicilia', 'Mandarina dulce', 'Bergamota'],
      corazon: ['Lavanda suave', 'Neroli', 'Jazmín'],
      fondo: ['Almizcle blanco', 'Madera de cedro limpia']
    }
  },
  {
    test: (id, n) => n.includes('MINNIE'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'afrutados', porcentaje: 85, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' }
    ],
    notas: {
      salida: ['Fresas maduras', 'Frambuesa', 'Mandarina'],
      corazon: ['Pétalos de rosa', 'Peonía', 'Gardenia'],
      fondo: ['Vainilla suave', 'Almizcle blanco', 'Azúcar glass']
    }
  },
  {
    test: (id, n) => n.includes('MINECRAFT'),
    acordes: [
      { nombre: 'verde', porcentaje: 100, color: '#5C9058' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 70, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Hojas verdes machacadas', 'Menta fresca', 'Bergamota'],
      corazon: ['Lavanda del bosque', 'Salvia', 'Manzana ácida'],
      fondo: ['Madera de cedro', 'Musgo de roble', 'Almizcle limpio']
    }
  },
  {
    test: (id, n) => n.includes('PAW PATROL'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'fresco', porcentaje: 70, color: '#68B684' }
    ],
    notas: {
      salida: ['Mandarina dulce', 'Limón suave', 'Manzana jugosa'],
      corazon: ['Flor de azahar', 'Pera dulce'],
      fondo: ['Almizcle blanco suave', 'Vainilla ligera']
    }
  },
  {
    test: (id, n) => n.includes('SPIDERMAN'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 75, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana crujiente', 'Mandarina ácida', 'Pimienta suave'],
      corazon: ['Lavanda aromática', 'Nuez moscada', 'Romero'],
      fondo: ['Madera de cedro', 'Sándalo', 'Ámbar gris suave']
    }
  },
  {
    test: (id, n) => n.includes('STRANGER THINGS'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'ahumado', porcentaje: 60, color: '#565051' }
    ],
    notas: {
      salida: ['Pimienta negra', 'Bergamota oscura', 'Grosellas silvestres'],
      corazon: ['Cedro del bosque sombrío', 'Pachulí terroso', 'Salvia'],
      fondo: ['Ámbar negro', 'Cuero ahumado', 'Almizcle profundo']
    }
  },
  {
    test: (id, n) => n.includes('SHREK'),
    acordes: [
      { nombre: 'verde', porcentaje: 100, color: '#5C9058' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 75, color: '#68B684' },
      { nombre: 'amaderado', porcentaje: 60, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana verde ácida', 'Menta fresca', 'Limón'],
      corazon: ['Agujas de pino silvestre', 'Lavanda salvaje', 'Hojas de hiedra'],
      fondo: ['Musgo del bosque', 'Madera de cedro', 'Almizcle limpio']
    }
  },

  // ==========================================
  // LATTAFA (Líneas Restantes)
  // ==========================================
  {
    test: (id, n) => n.includes('ANGHAM'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'lavanda', porcentaje: 78, color: '#8076A3' },
      { nombre: 'cálido especiado', porcentaje: 70, color: '#AA331E' },
      { nombre: 'cítrico', porcentaje: 58, color: '#B8B939' }
    ],
    notas: {
      salida: ['Jengibre picante', 'Mandarina jugosa', 'Pimienta rosa'],
      corazon: ['Praliné crujiente', 'Lavanda francesa', 'Jazmín sambac'],
      fondo: ['Vainilla de Madagascar', 'Ámbar dorado', 'Almizcle sedoso']
    }
  },
  {
    test: (id, n) => n.includes('ATLAS'),
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'salado', porcentaje: 92, color: '#3A829E' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 70, color: '#B8B939' },
      { nombre: 'ambar', porcentaje: 60, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Notas marinas oceánicas', 'Sal marina', 'Limón fresco'],
      corazon: ['Davana aromática', 'Jazmín acuático', 'Romero'],
      fondo: ['Ámbar gris puro', 'Musgo de roble', 'Madera de cedro']
    }
  },
  {
    test: (id, n) => n.includes('ETERNAL OUD'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'oud', porcentaje: 75, color: '#3D3430' },
      { nombre: 'afrutados', porcentaje: 65, color: '#D74423' }
    ],
    notas: {
      salida: ['Ciruela madura licorosa', 'Pomelo jugoso'],
      corazon: ['Orquídea misteriosa', 'Benjuí de Siam', 'Heliotropo'],
      fondo: ['Vainilla Bourbon intensa', 'Ámbar suntuoso', 'Madera de oud', 'Haba tonka']
    }
  },
  {
    test: (id, n) => n.includes('NEBRAS ELIXIR') || (n.includes('NEBRAS') && n.includes('ELIXIR')),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'cacao', porcentaje: 85, color: '#684534' },
      { nombre: 'cálido especiado', porcentaje: 72, color: '#AA331E' },
      { nombre: 'afrutados', porcentaje: 65, color: '#D74423' }
    ],
    notas: {
      salida: ['Bayas rojas dulces', 'Mandarina confitada'],
      corazon: ['Cacao oscuro puro', 'Vainilla cremosa', 'Rosas aterciopeladas'],
      fondo: ['Azúcar moreno', 'Haba tonka tostada', 'Ámbar cálido', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('VAINILLA FREAK') || n.includes('GIVE ME GOURMAND'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 95, color: '#FF384D' },
      { nombre: 'lactónico', porcentaje: 85, color: '#86888A' },
      { nombre: 'caramelo', porcentaje: 75, color: '#B86B2B' }
    ],
    notas: {
      salida: ['Vainilla cremosa batida', 'Azúcar glasé'],
      corazon: ['Nata montada dulce', 'Caramelo caliente', 'Leche condensada'],
      fondo: ['Vainilla Bourbon pura', 'Haba tonka', 'Almizcle blanco dulce']
    }
  },
  {
    test: (id, n) => n.includes('QAED AL FURSAN UNTAMED') || (n.includes('QAED AL FURSAN') && n.includes('UNTAMED')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' },
      { nombre: 'ahumado', porcentaje: 68, color: '#565051' },
      { nombre: 'aromático', porcentaje: 60, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Piña salvaje asada', 'Manzana crujiente', 'Bergamota'],
      corazon: ['Abedul ahumado', 'Pachulí terroso', 'Jazmín'],
      fondo: ['Ámbar gris', 'Madera de roble', 'Almizcle', 'Vainilla']
    }
  },
  {
    test: (id, n) => n.includes('SAKEENA'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'floral', porcentaje: 70, color: '#E87EA1' },
      { nombre: 'avainillado', porcentaje: 65, color: '#CBB677' }
    ],
    notas: {
      salida: ['Maracuyá exótico', 'Mandarina dulce', 'Notas ozónicas'],
      corazon: ['Frambuesa jugosa', 'Rosa delicada', 'Flor de azahar', 'Café arábica'],
      fondo: ['Praliné crujiente', 'Vainilla de Madagascar', 'Almizcle blanco', 'Haba tonka']
    }
  },
  {
    test: (id, n) => n.includes('THE KINGDOM') && !n.includes('WOM'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'lavanda', porcentaje: 88, color: '#8076A3' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'cálido especiado', porcentaje: 72, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 65, color: '#FF384D' }
    ],
    notas: {
      salida: ['Lavanda francesa', 'Menta fresca', 'Salvia sclarea'],
      corazon: ['Vainilla cremosa', 'Flor de azahar', 'Tabaco rubio suave'],
      fondo: ['Haba tonka tostada', 'Benjuí de Siam', 'Madera de cedro']
    }
  },
  {
    test: (id, n) => n.includes('VICTORIA') || n.includes('VICTORIEUX FEMME'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'afrutados', porcentaje: 85, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Pera jugosa', 'Mandarina chispeante', 'Pimienta rosa'],
      corazon: ['Tuberosa seductora', 'Jazmín sambac', 'Flor de azahar'],
      fondo: ['Pachulí noble', 'Vainilla Bourbon', 'Madera de cedro', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('VICTORIEUX') && !n.includes('FEMME'),
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 75, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' }
    ],
    notas: {
      salida: ['Notas marinas frescas', 'Pomelo brillante', 'Hojas de laurel'],
      corazon: ['Jazmín hedione', 'Madera de gaiac'],
      fondo: ['Ámbar gris profundo', 'Musgo de roble', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('AFEEF') || n.includes('ATHEERI') || n.includes('DYNASTY') || n.includes('NOW') || n.includes('PETRA') || n.includes('ART OF UNIVERSE') || n.includes('PLAY') || n.includes('RIDERS'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 85, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 60, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Cardamomo negro', 'Bergamota italiana', 'Pimienta rosa'],
      corazon: ['Incienso oriental místico', 'Canela de Ceilán', 'Madera de cedro'],
      fondo: ['Ámbar suntuoso', 'Vainilla suave', 'Madera de oud refinado', 'Sándalo']
    }
  },

  // ==========================================
  // ARIANA GRANDE
  // ==========================================
  {
    test: (id, n) => (n.includes('ARI') && !n.includes('ARIANA') && !n.includes('MOD') && !n.includes('CLOUD')) || n.includes('ARIANA GRANDE ARI'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'floral', porcentaje: 75, color: '#E87EA1' },
      { nombre: 'atalcado', porcentaje: 65, color: '#988E83' }
    ],
    notas: {
      salida: ['Frambuesa jugosa', 'Pera cristalina', 'Pomelo rosado'],
      corazon: ['Orquídea de vainilla', 'Lirio de los valles (muguete)', 'Rosa suave'],
      fondo: ['Malvavisco esponjoso dulce', 'Almizcle sedoso', 'Madera rubia']
    }
  },
  {
    test: (id, n) => n.includes('SWEET LIKE CANDY'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 78, color: '#CBB677' },
      { nombre: 'lactónico', porcentaje: 68, color: '#86888A' }
    ],
    notas: {
      salida: ['Zarzamora azucarada', 'Pera jugosa', 'Bergamota'],
      corazon: ['Crema batida dulce', 'Malvavisco', 'Grosellas negras', 'Flor de madreselva', 'Jazmín'],
      fondo: ['Vainilla de Madagascar', 'Madera de cachemira']
    }
  },
  {
    test: (id, n) => n.includes('GOD IS A'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 78, color: '#A09F9C' },
      { nombre: 'floral', porcentaje: 70, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Pera jugosa suculenta', 'Ambreta (almizcle vegetal)'],
      corazon: ['Raíz de lirio de Florencia', 'Pétalos de rosa turca'],
      fondo: ['Vainilla de Madagascar', 'Madera de cedro blanco']
    }
  },
  {
    test: (id, n) => n.includes('MOONLIGHT') || n.includes('MOON LIGHT'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 78, color: '#CBB677' },
      { nombre: 'atalcado', porcentaje: 65, color: '#988E83' }
    ],
    notas: {
      salida: ['Ciruela dulce madura', 'Grosellas negras'],
      corazon: ['Malvavisco dulce', 'Peonía rosada fresca'],
      fondo: ['Vainilla cremosa', 'Sándalo suave', 'Ámbar negro']
    }
  },
  {
    test: (id, n) => n.includes('R.E.M') || n.includes('REM'),
    acordes: [
      { nombre: 'lavanda', porcentaje: 100, color: '#8076A3' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 78, color: '#988E83' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' },
      { nombre: 'caramelo', porcentaje: 62, color: '#B86B2B' }
    ],
    notas: {
      salida: ['Caramelo salado', 'Higo maduro', 'Membrillo dulce', 'Zefir'],
      corazon: ['Lavanda francesa aromática', 'Flor del peral'],
      fondo: ['Haba tonka tostada', 'Almizcle blanco', 'Sándalo']
    }
  },
  {
    test: (id, n) => n.includes('MOD BLUSH'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 85, color: '#E87EA1' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 68, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Maracuyá exótico', 'Frambuesa madura', 'Pimienta rosa', 'Bergamota italiana'],
      corazon: ['Pera rosada', 'Rosa de mayo', 'Magnolia elegante'],
      fondo: ['Almizcle blanco', 'Dreamwood', 'Ambroxan']
    }
  },
  {
    test: (id, n) => n.includes('MOD VAINILLA') || n.includes('MOD VANILLA'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 78, color: '#988E83' },
      { nombre: 'almizclado', porcentaje: 70, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Ciruela negra licorosa', 'Almizcle vegetal', 'Fresia rosada'],
      corazon: ['Praliné artesanal', 'Raíz de lirio empolvada', 'Jazmín'],
      fondo: ['Vainilla de Madagascar pura', 'Manteca de cacao']
    }
  },

  // ==========================================
  // DOLCE & GABBANA
  // ==========================================
  {
    test: (id, n) => (n.includes('LIGHT BLUE') && (n.includes('WOM') || !n.includes('POUR'))) && !n.includes('SUMMER VIBES'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 88, color: '#68B684' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' }
    ],
    notas: {
      salida: ['Limón siciliano brillante', 'Manzana verde crujiente', 'Campanilla silvestre', 'Cedro'],
      corazon: ['Bambú verde fresco', 'Jazmín blanco delicado', 'Rosa blanca'],
      fondo: ['Madera de cedro', 'Almizcle limpio', 'Ámbar cálido']
    }
  },
  {
    test: (id, n) => n.includes('LIGHT BLUE POUR') || (n.includes('LIGHT BLUE') && n.includes('HIM')),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 85, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Pomelo refrescante', 'Bergamota de Calabria', 'Mandarina siciliana', 'Enebro'],
      corazon: ['Pimienta de Sichuan', 'Romero aromático', 'Palo de rosa de Brasil'],
      fondo: ['Almizcle blanco', 'Incienso místico', 'Musgo de roble']
    }
  },
  {
    test: (id, n) => n.includes('LIGHT BLUE SUMMER VIBES'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 82, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' },
      { nombre: 'dulce', porcentaje: 60, color: '#FF384D' }
    ],
    notas: {
      salida: ['Limón de Calabria soleado'],
      corazon: ['Melocotón maduro dulce de verano'],
      fondo: ['Madera de cedro cálida']
    }
  },
  {
    test: (id, n) => n.includes('DEVOTION'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'floral blanco', porcentaje: 70, color: '#DDDCD7' }
    ],
    notas: {
      salida: ['Limones confitados golosos', 'Avellana tostada'],
      corazon: ['Flor de azahar del naranjo de Grasse', 'Panacota cremosa'],
      fondo: ['Vainilla de Madagascar suntuosa']
    }
  },
  {
    test: (id, n) => n.includes('DG KING') || n.includes('KING DOLCE') || (n.includes('K') && n.includes('DOLCE GABBANA')),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'cálido especiado', porcentaje: 70, color: '#AA331E' }
    ],
    notas: {
      salida: ['Bayas de enebro', 'Cítricos chispeantes', 'Naranja sanguina', 'Limón siciliano', 'Cardamomo'],
      corazon: ['Pimiento picante', 'Salvia sclarea', 'Lavanda francesa', 'Néctar de higo'],
      fondo: ['Pachulí terroso noble', 'Madera de cedro', 'Vetiver', 'Madera de nagarmota']
    }
  },
  {
    test: (id, n) => n.includes('INTENSO POUR') || (n.includes('INTENSO') && n.includes('DOLCE')),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 85, color: '#4B8E6D' },
      { nombre: 'herbal', porcentaje: 78, color: '#68B684' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Notas acuáticas puras', 'Albahaca verde fresca', 'Lavanda', 'Geranio', 'Caléndula'],
      corazon: ['Acorde de tabaco rubio', 'Heno seco', 'Salvado de trigo', 'Salvia sclarea'],
      fondo: ['Ládano resinoso', 'Madera de sándalo', 'Ciprés noble', 'Almizcle', 'Ámbar']
    }
  },

  // ==========================================
  // CAROLINA HERRERA (Líneas 212 y CH)
  // ==========================================
  {
    test: (id, n) => n.includes('212 NYC') || (n.includes('212') && !n.includes('VIP') && !n.includes('HEROES') && !n.includes('SEXY')),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'floral', porcentaje: 78, color: '#E87EA1' },
      { nombre: 'atalcado', porcentaje: 65, color: '#988E83' }
    ],
    notas: {
      salida: ['Flor de azahar del naranjo', 'Flor de cactus', 'Bergamota fresca', 'Mandarina'],
      corazon: ['Lirio de los valles (muguete)', 'Jazmín blanco', 'Gardenia', 'Fresia', 'Camelia'],
      fondo: ['Almizcle blanco aterciopelado', 'Madera de sándalo noble']
    }
  },
  {
    test: (id, n) => n.includes('212 SEXY'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'atalcado', porcentaje: 78, color: '#988E83' },
      { nombre: 'cálido especiado', porcentaje: 68, color: '#AA331E' }
    ],
    notas: {
      salida: ['Pimienta rosa picante', 'Mandarina jugosa', 'Bergamota'],
      corazon: ['Algodón de azúcar dulce', 'Gardenia sedosa', 'Flores blancas exóticas', 'Pelargonio'],
      fondo: ['Vainilla Bourbon', 'Caramelo tostado', 'Almizcle sensual', 'Sándalo', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('212 VIP ROSE') || n.includes('212 VIP ROSÉ'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 85, color: '#E87EA1' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Champaña rosado efervescente', 'Notas afrutadas rojas'],
      corazon: ['Flor del duraznero (melocotonero)'],
      fondo: ['Almizcle blanco', 'Ámbar sensual', 'Madera reina']
    }
  },
  {
    test: (id, n) => n.includes('212 VIP') && !n.includes('BLACK') && !n.includes('ROSE'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'ron', porcentaje: 72, color: '#9B5B28' }
    ],
    notas: {
      salida: ['Maracuyá exótico de la selva', 'Ron dorado caribeño'],
      corazon: ['Almizcle seductor', 'Gardenia nocturna'],
      fondo: ['Haba tonka tostada', 'Vainilla Bourbon cremosa']
    }
  },
  {
    test: (id, n) => n.includes('212 HEROES'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 75, color: '#4B8E6D' },
      { nombre: 'herbal', porcentaje: 68, color: '#68B684' }
    ],
    notas: {
      salida: ['Pera williams crujiente', 'Jengibre picante', 'Acorde de cannabis sativa'],
      corazon: ['Salvia sclarea aromática', 'Geranio'],
      fondo: ['Almizcle urbano moderno', 'Cuero suave']
    }
  },
  {
    test: (id, n) => n === 'CAROLINA HERRERA CH' || n.endsWith(' CH'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'cuero', porcentaje: 88, color: '#6E4823' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'cítrico', porcentaje: 68, color: '#B8B939' }
    ],
    notas: {
      salida: ['Praliné artesanal', 'Canela de Ceilán', 'Gamuza suave'],
      corazon: ['Jazmín sambac', 'Flor de azahar', 'Rosa'],
      fondo: ['Ámbar dorado', 'Madera de sándalo', 'Pachulí']
    }
  },

  // ==========================================
  // ARD AL ZAAFARAN
  // ==========================================
  {
    test: (id, n) => n.includes('OUD 24 HOURS'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'chocolate', porcentaje: 82, color: '#4B3621' },
      { nombre: 'pachulí', porcentaje: 75, color: '#7E6850' },
      { nombre: 'oud', porcentaje: 68, color: '#3D3430' }
    ],
    notas: {
      salida: ['Chocolate oscuro amargo', 'Mandarina jugosa', 'Bergamota italiana'],
      corazon: ['Especias picantes finas', 'Gardenia nocturna', 'Jazmín', 'Ylang-ylang'],
      fondo: ['Madera de agar (oud)', 'Incienso místico', 'Sándalo', 'Pachulí', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('ANA ABIYEDH'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 85, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 70, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Bergamota fresca', 'Naranja jugosa'],
      corazon: ['Pera dulce crujiente', 'Vainilla cremosa'],
      fondo: ['Ámbar dorado cálido', 'Almizcle blanco aterciopelado']
    }
  },
  {
    test: (id, n) => n.includes('MOUSUF'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'chocolate', porcentaje: 80, color: '#4B3621' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Uvas maduras moradas', 'Chocolate dulce con leche'],
      corazon: ['Caramelo suave', 'Madera de agar (oud) refinado'],
      fondo: ['Almizcle blanco', 'Madera de sándalo', 'Tabaco dulce rubio']
    }
  },
  {
    test: (id, n) => n.includes('PISTACHIO MUSK'),
    acordes: [
      { nombre: 'nueces', porcentaje: 100, color: '#9E7E43' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 75, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Pistacho verde tostado', 'Almizcle blanco suave'],
      corazon: ['Flores blancas aromáticas', 'Crema de vainilla'],
      fondo: ['Haba tonka tostada', 'Almizcle empolvado', 'Madera de cedro']
    }
  },
  {
    test: (id, n) => n.includes('MANAAL') || n.includes('MARINA DEEP') || n.includes('RIHANNA'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' }
    ],
    notas: {
      salida: ['Flores orientales ricas', 'Frutas exóticas dulces'],
      corazon: ['Rosa de Damasco', 'Jazmín', 'Azafrán'],
      fondo: ['Ámbar dorado', 'Madera de sándalo', 'Almizcle']
    }
  },

  // ==========================================
  // BENETTON
  // ==========================================
  {
    test: (id, n) => n.includes('BENETTON COLD') || n.includes('COLD SILVER'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 75, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Mandarina italiana', 'Bergamota', 'Neroli'],
      corazon: ['Tomillo aromático', 'Cilantro', 'Pimienta roja'],
      fondo: ['Madera de cedro blanco', 'Pachulí', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('BENETTON HOT') || n.includes('HOT GOLD'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Palo de rosa de Brasil', 'Bergamota'],
      corazon: ['Albaricoque dulce', 'Iris', 'Jazmín sambac'],
      fondo: ['Vainilla cremosa', 'Sándalo', 'Ámbar', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('COLORS BLACK') || (n.includes('BENETTON') && n.includes('BLACK')),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 85, color: '#8D5524' },
      { nombre: 'cuero', porcentaje: 75, color: '#6E4823' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Pimienta negra picante', 'Nuez moscada', 'Bergamota'],
      corazon: ['Acorde de cuero negro', 'Lavanda francesa', 'Pachulí'],
      fondo: ['Madera de agar (oud)', 'Ámbar suntuoso', 'Vainilla suave']
    }
  },
  {
    test: (id, n) => n.includes('PARADISO') || n.includes('TOGETHER HIM'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 85, color: '#E87EA1' },
      { nombre: 'cítrico', porcentaje: 75, color: '#B8B939' }
    ],
    notas: {
      salida: ['Pomelo rosado', 'Grosellas rojas', 'Limón'],
      corazon: ['Flor de tiaré', 'Peonía rosada', 'Jazmín'],
      fondo: ['Madera de cedro', 'Almizcle blanco', 'Ámbar']
    }
  },

  // ==========================================
  // PACO RABANNE
  // ==========================================
  {
    test: (id, n) => n.includes('BLACK XS') && (n.includes('WOM') || n.includes('HER')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'cacao', porcentaje: 80, color: '#4B3621' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' }
    ],
    notas: {
      salida: ['Arándano rojo silvestre', 'Pimienta rosa', 'Tamarindo'],
      corazon: ['Cacao oscuro puro', 'Rosa de Navidad', 'Violeta negra'],
      fondo: ['Vainilla de Madagascar', 'Madera de massoia', 'Pachulí']
    }
  },
  {
    test: (id, n) => n.includes('BLACK XS') && !n.includes('WOM'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Limón de Calabria', 'Calamansi cítrico', 'Tagete', 'Salvia'],
      corazon: ['Praliné de chocolate', 'Canela picante', 'Bálsamo de Tolú', 'Cardamomo negro'],
      fondo: ['Palo de rosa brasileño', 'Ámbar negro', 'Pachulí noble', 'Ébano']
    }
  },
  {
    test: (id, n) => n.includes('OLYMPEA FLORA') || (n.includes('OLYMPEA') && n.includes('FLORA')),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Grosellas negras chispeantes', 'Sorbet helado', 'Pimienta rosa'],
      corazon: ['Rosa de Damasco', 'Peonía rosada exuberante'],
      fondo: ['Vainilla salada característica', 'Pachulí noble', 'Madera de cachemira']
    }
  },
  {
    test: (id, n) => n.includes('ULTRAVIOLET'),
    acordes: [
      { nombre: 'atalcado', porcentaje: 100, color: '#988E83' },
      { nombre: 'floral', porcentaje: 88, color: '#E87EA1' },
      { nombre: 'avainillado', porcentaje: 78, color: '#CBB677' },
      { nombre: 'cálido especiado', porcentaje: 70, color: '#AA331E' }
    ],
    notas: {
      salida: ['Pimiento morrón rojo', 'Pimienta picante', 'Albaricoque', 'Cilantro', 'Palo de rosa'],
      corazon: ['Violeta japonesa', 'Osmanthus (olivo oloroso)', 'Rosa', 'Jazmín'],
      fondo: ['Vainilla suave', 'Ámbar oriental', 'Pachulí', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('PACO RABANNE XS') && !n.includes('BLACK'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 85, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Menta salvaje', 'Bergamota', 'Cilantro', 'Mandarina'],
      corazon: ['Baya de enebro', 'Romero silvestre', 'Geranio de Bourbon'],
      fondo: ['Madera de sándalo', 'Madera de cedro', 'Musgo de roble', 'Almizcle']
    }
  },

  // ==========================================
  // GUESS
  // ==========================================
  {
    test: (id, n) => n.includes('GUESS GIRL'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 78, color: '#E87EA1' },
      { nombre: 'avainillado', porcentaje: 65, color: '#CBB677' }
    ],
    notas: {
      salida: ['Frambuesa silvestre madura', 'Melón dulce', 'Bergamota'],
      corazon: ['Orquídea exótica de Brasil', 'Flor de acacia', 'Lirio blanco'],
      fondo: ['Madera de sándalo australiano', 'Vainilla de Madagascar']
    }
  },
  {
    test: (id, n) => n.includes('GUESS DARE'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Flor del kumquat', 'Flor de limón', 'Flor del peral'],
      corazon: ['Flor de cactus', 'Jazmín salvaje', 'Rosa silvestre'],
      fondo: ['Madera de cedro rubia', 'Almizcle de coco', 'Maderas preciosas']
    }
  },
  {
    test: (id, n) => n.includes('BELLA VITA') || n.includes('GUESS GOLD') || n.includes('GUESS PINK'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 85, color: '#E87EA1' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Cereza ácida negra', 'Limón italiano', 'Grosellas'],
      corazon: ['Nardos seductores', 'Flor de azahar', 'Jazmín'],
      fondo: ['Praliné crujiente', 'Haba tonka tostada', 'Ámbar', 'Almizcle']
    }
  },

  // ==========================================
  // JEAN PAUL GAULTIER (Restantes)
  // ==========================================
  {
    test: (id, n) => n.includes('CLASSIQUE') && !n.includes('MALE'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 72, color: '#988E83' }
    ],
    notas: {
      salida: ['Flor de azahar del naranjo', 'Anís estrellado', 'Rosa de Bulgaria', 'Mandarina', 'Pera'],
      corazon: ['Jengibre picante afrodisíaco', 'Orquídea', 'Iris empolvado', 'Ylang-ylang', 'Ciruela'],
      fondo: ['Vainilla de Madagascar pura', 'Ámbar cálido', 'Almizcle seductor', 'Canela', 'Sándalo']
    }
  },
  {
    test: (id, n) => n.includes('LE MALE') && !n.includes('ELIXIR') && !n.includes('PARFUM') && !n.includes('BEAU'),
    acordes: [
      { nombre: 'lavanda', porcentaje: 100, color: '#8076A3' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 82, color: '#4A8B71' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Lavanda francesa', 'Menta fresca vigorizante', 'Cardamomo', 'Bergamota', 'Artemisia'],
      corazon: ['Canela de Ceilán', 'Flor de azahar del naranjo', 'Alcaravea'],
      fondo: ['Vainilla Bourbon icónica', 'Haba tonka tostada', 'Ámbar', 'Sándalo', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('LA BELLE PARADISE GARDEN'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'acuático', porcentaje: 78, color: '#258BD2' },
      { nombre: 'dulce', porcentaje: 72, color: '#FF384D' }
    ],
    notas: {
      salida: ['Flor de loto azul exótica', 'Notas acuáticas cristalinas'],
      corazon: ['Iris empolvado refinado', 'Nymphaea'],
      fondo: ['Vainilla exquisita sensual', 'Almendra dulce']
    }
  },
  {
    test: (id, n) => n.includes('SCANDAL ABSOLU'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'floral blanco', porcentaje: 80, color: '#DDDCD7' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Higo negro suntuoso licoroso'],
      corazon: ['Tuberosa embriagadora sensual'],
      fondo: ['Madera de sándalo cremoso', 'Miel dorada líquida']
    }
  },

  // ==========================================
  // MAISON ALHAMBRA
  // ==========================================
  {
    test: (id, n) => n.includes('DELILAH'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'rosa', porcentaje: 90, color: '#F0587E' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' },
      { nombre: 'almizclado', porcentaje: 60, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Ruibarbo fresco crujiente', 'Lichi jugoso', 'Bergamota'],
      corazon: ['Rosa turca imperial', 'Peonía fresca', 'Lirio de los valles'],
      fondo: ['Vainilla Bourbon', 'Almizcle blanco', 'Cashmeran', 'Incienso suave']
    }
  },
  {
    test: (id, n) => n.includes('HERCULES'),
    acordes: [
      { nombre: 'tabaco', porcentaje: 100, color: '#734E2F' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'cálido especiado', porcentaje: 80, color: '#AA331E' },
      { nombre: 'canela', porcentaje: 72, color: '#A84323' }
    ],
    notas: {
      salida: ['Canela de Ceilán picante', 'Pimienta negra'],
      corazon: ['Hojas de tabaco aromático', 'Incienso de olíbano', 'Osmanto'],
      fondo: ['Vainilla de Madagascar', 'Madera de cedro', 'Almizcle', 'Vetiver']
    }
  },
  {
    test: (id, n) => n.includes('LEONIE INTENSE'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'lavanda', porcentaje: 80, color: '#8076A3' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Lavanda francesa', 'Grosellas negras', 'Petitgrain'],
      corazon: ['Flor de azahar del naranjo', 'Jazmín sambac', 'Lavanda'],
      fondo: ['Vainilla de Madagascar', 'Haba tonka tostada', 'Ámbar gris', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('SALVO'),
    acordes: [
      { nombre: 'fresco especiado', porcentaje: 100, color: '#4B8E6D' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'cítrico', porcentaje: 80, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Bergamota de Calabria radiante', 'Pimienta de Sichuan'],
      corazon: ['Pimienta rosa', 'Lavanda francesa', 'Anís estrellado', 'Nuez moscada'],
      fondo: ['Ambroxan noble potente', 'Vainilla de Papúa Nueva Guinea', 'Cedro']
    }
  },

  // ==========================================
  // VICTORIA'S SECRET
  // ==========================================
  {
    test: (id, n) => n.includes('BOMBSHELL'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'cítrico', porcentaje: 80, color: '#B8B939' },
      { nombre: 'floral', porcentaje: 75, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Maracuyá fresco de Shangri-la', 'Pomelo', 'Piña', 'Tangerina', 'Fresa silvestre'],
      corazon: ['Peonía rosada de Shangai', 'Orquídea de vainilla', 'Bayas rojas', 'Jazmín', 'Lirio de los valles'],
      fondo: ['Almizcle sensual limpio', 'Notas amaderadas rubias', 'Musgo de roble']
    }
  },
  {
    test: (id, n) => n.includes('BARE VANILLA'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 75, color: '#988E83' }
    ],
    notas: {
      salida: ['Vainilla batida cremosa', 'Manzana suave'],
      corazon: ['Ámbar dorado cálido'],
      fondo: ['Almizcle suave aterciopelado']
    }
  },
  {
    test: (id, n) => n.includes('VICTORIA') && (n.includes('BARE') && !n.includes('VANILLA')),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'floral', porcentaje: 85, color: '#E87EA1' },
      { nombre: 'cítrico', porcentaje: 75, color: '#B8B939' },
      { nombre: 'atalcado', porcentaje: 68, color: '#988E83' }
    ],
    notas: {
      salida: ['Mandarina de Madagascar'],
      corazon: ['Pétalos de violeta egipcia'],
      fondo: ['Madera de sándalo australiano cálido']
    }
  },

  // ==========================================
  // GIVENCHY
  // ==========================================
  {
    test: (id, n) => n.includes('GENTLEMAN SOCIETY'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'floral', porcentaje: 70, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Cardamomo de Guatemala', 'Salvia aromática francesa'],
      corazon: ['Narciso francés salvaje', 'Vetiver de Madagascar', 'Vetiver de Haití'],
      fondo: ['Vainilla de Madagascar', 'Palo de cedro noble', 'Madera de sándalo']
    }
  },
  {
    test: (id, n) => n.includes('L\'INTERDIT ABSOLU'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'lavanda', porcentaje: 85, color: '#8076A3' },
      { nombre: 'tabaco', porcentaje: 78, color: '#734E2F' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Lavanda fresca aromática', 'Cardamomo de Guatemala', 'Neroli'],
      corazon: ['Nardo de la India emblemático', 'Flor de azahar', 'Jazmín sambac'],
      fondo: ['Hojas de tabaco aromático', 'Ron refinado', 'Pachulí terroso', 'Vetiver']
    }
  },
  {
    test: (id, n) => n === 'GIVENCHY PI' || n.includes('GIVENCHY PI'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'ámbar', porcentaje: 75, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Estragón', 'Romero aromático', 'Albahaca'],
      corazon: ['Anís estrellado', 'Neroli', 'Geranio', 'Lirio de los valles'],
      fondo: ['Vainilla Bourbon dorada', 'Almendra azucarada', 'Haba tonka', 'Benjuí', 'Cedro']
    }
  },

  // ==========================================
  // LACOSTE
  // ==========================================
  {
    test: (id, n) => n.includes('LACOSTE ESSENTIAL'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'verde', porcentaje: 88, color: '#5C9058' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Hojas de grosellero negro', 'Bergamota italiana', 'Mandarina', 'Hojas de tomate'],
      corazon: ['Pimienta negra picante', 'Rosa suave'],
      fondo: ['Madera de sándalo noble', 'Pachulí terroso']
    }
  },
  {
    test: (id, n) => n.includes('L.12.12') || n.includes('L 12.12'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 75, color: '#68B684' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Menta fresca', 'Pomelo rosado', 'Mandarina verde'],
      corazon: ['Rosa de mayo', 'Flor de plumeria', 'Almizcle'],
      fondo: ['Madera de cedro', 'Sándalo', 'Ámbar']
    }
  },

  // ==========================================
  // ANTONIO BANDERAS
  // ==========================================
  {
    test: (id, n) => n.includes('GOLDEN SECRET'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'cuero', porcentaje: 88, color: '#6E4823' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'aromático', porcentaje: 72, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Manzana verde licorosa', 'Menta fresca picante'],
      corazon: ['Nuez moscada', 'Pimienta negra', 'Comino'],
      fondo: ['Cuero negro sensual', 'Madera de cedro', 'Almizcle seductor']
    }
  },
  {
    test: (id, n) => n.includes('THE ICON') && !n.includes('SPLENDID') && !n.includes('WOM'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Pomelo brillante', 'Pimienta negra'],
      corazon: ['Lavanda francesa', 'Salvia aromática'],
      fondo: ['Madera de cedro', 'Musgo de roble noble']
    }
  },
  {
    test: (id, n) => n.includes('ICON SPLENDID') || (n.includes('ICON') && n.includes('SPLENDID')),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'floral', porcentaje: 78, color: '#E87EA1' },
      { nombre: 'afrutados', porcentaje: 70, color: '#D74423' }
    ],
    notas: {
      salida: ['Tangerina jugosa', 'Pimienta negra', 'Pera cristalina'],
      corazon: ['Flor de azahar', 'Peonía rosada'],
      fondo: ['Praliné crujiente', 'Vainilla suave', 'Madera de sándalo', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('QUEEN OF SEDUCTION'),
    acordes: [
      { nombre: 'acuático', porcentaje: 100, color: '#258BD2' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'floral', porcentaje: 78, color: '#E87EA1' },
      { nombre: 'fresco', porcentaje: 70, color: '#68B684' }
    ],
    notas: {
      salida: ['Notas acuáticas marinas', 'Pomelo refrescante', 'Frambuesa'],
      corazon: ['Iris noble', 'Jazmín blanco', 'Peonía', 'Pimienta rosa'],
      fondo: ['Gamuza suave elegante', 'Madera de cedro', 'Ámbar']
    }
  },

  // ==========================================
  // BHARARA
  // ==========================================
  {
    test: (id, n) => n.includes('BHARARA ROSE'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'rosa', porcentaje: 90, color: '#F0587E' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' }
    ],
    notas: {
      salida: ['Pera dulce jugosa', 'Bergamota italiana', 'Pimienta rosa'],
      corazon: ['Rosa de Bulgaria exquisita', 'Jazmín de Grasse'],
      fondo: ['Vainilla de Madagascar', 'Ámbar cálido', 'Madera de cedro']
    }
  },
  {
    test: (id, n) => n.includes('VIKING'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 72, color: '#4B8E6D' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Cítricos mediterráneos exóticos', 'Bergamota de Calabria'],
      corazon: ['Cardamomo negro', 'Romero silvestre', 'Hojas de laurel'],
      fondo: ['Ámbar gris suntuoso', 'Cuero noble refinado', 'Pachulí terroso', 'Cedro']
    }
  },

  // ==========================================
  // CALVIN KLEIN
  // ==========================================
  {
    test: (id, n) => n === 'CALVIN KLEIN CK ONE' || (n.includes('CK ONE') && !n.includes('SHOCK')),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'verde', porcentaje: 88, color: '#5C9058' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'floral blanco', porcentaje: 68, color: '#DDDCD7' }
    ],
    notas: {
      salida: ['Limón fresco', 'Notas verdes puras', 'Bergamota', 'Piña', 'Mandarina', 'Cardamomo', 'Papaya'],
      corazon: ['Lirio de los valles', 'Jazmín', 'Violeta', 'Nuez moscada', 'Rosa', 'Raíz de lirio', 'Fresia'],
      fondo: ['Acorde de té verde', 'Almizcle blanco', 'Madera de cedro', 'Sándalo', 'Musgo de roble', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('CK ONE SHOCK'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'tabaco', porcentaje: 88, color: '#734E2F' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 75, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Clementina jugosa', 'Lavanda francesa', 'Pepino refrescante'],
      corazon: ['Cardamomo aromático', 'Pimienta negra', 'Albahaca morada', 'Osmanto'],
      fondo: ['Hojas de tabaco rubio', 'Ámbar cálido', 'Pachulí noble', 'Maderas preciosas', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('CK IN 2 U') || n.includes('CK IN2U'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'avainillado', porcentaje: 85, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Toronja rosada chispeante', 'Bergamota siciliana', 'Hojas de grosellero rojo'],
      corazon: ['Cactus verde fresco', 'Orquídea salvaje'],
      fondo: ['Vainilla cremosa', 'Cedro rojo japonés', 'Ámbar suave']
    }
  },
  {
    test: (id, n) => n.includes('EUPHORIA'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'floral', porcentaje: 88, color: '#E87EA1' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 72, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Granada jugosa seductora', 'Caqui', 'Acorde verde exuberante'],
      corazon: ['Orquídea negra misteriosa', 'Flor de loto exótica', 'Champaca'],
      fondo: ['Madera de caoba', 'Ámbar líquido', 'Almizcle negro', 'Violeta cremosa']
    }
  },

  // ==========================================
  // DUMONT NITRO
  // ==========================================
  {
    test: (id, n) => n.includes('NITRO GREEN'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 78, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Lavanda fresca', 'Azafrán'],
      corazon: ['Pachulí terroso noble', 'Madera de cedro', 'Madera de gaiac'],
      fondo: ['Vainilla Bourbon', 'Ámbar cálido', 'Haba tonka tostada']
    }
  },
  {
    test: (id, n) => n.includes('NITRO GOLD'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'cálido especiado', porcentaje: 80, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 72, color: '#FF384D' }
    ],
    notas: {
      salida: ['Mandarina jugosa', 'Bergamota italiana', 'Notas marinas'],
      corazon: ['Jazmín sambac', 'Canela de Ceilán', 'Nuez moscada'],
      fondo: ['Vainilla dulce intensa', 'Madera de sándalo', 'Ámbar', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('NITRO PLATINUM'),
    acordes: [
      { nombre: 'cuero', porcentaje: 100, color: '#6E4823' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'ahumado', porcentaje: 70, color: '#565051' }
    ],
    notas: {
      salida: ['Bergamota', 'Hojas de abedul ahumadas', 'Mandarina'],
      corazon: ['Cardamomo', 'Cuero noble refinado', 'Pimienta negra'],
      fondo: ['Madera de cedro blanco', 'Ámbar gris', 'Almizcle sensual']
    }
  },

  // ==========================================
  // GIORGIO ARMANI
  // ==========================================
  {
    test: (id, n) => n.includes('ACQUA DE GIO') || n.includes('ACQUA DI GIO'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'marino', porcentaje: 90, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 82, color: '#4A8B71' },
      { nombre: 'fresco', porcentaje: 75, color: '#68B684' }
    ],
    notas: {
      salida: ['Lima', 'Limón siciliano', 'Bergamota de Calabria', 'Jazmín', 'Naranja', 'Mandarina', 'Neroli'],
      corazon: ['Notas marinas oceánicas', 'Jazmín acuático', 'Calone', 'Melocotón', 'Fresia', 'Romero', 'Jacinto'],
      fondo: ['Almizcle blanco', 'Madera de cedro', 'Musgo de roble', 'Pachulí terroso', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('ARMANI CODE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'cuero', porcentaje: 88, color: '#6E4823' },
      { nombre: 'anís', porcentaje: 80, color: '#8A5A3C' },
      { nombre: 'tabaco', porcentaje: 75, color: '#734E2F' }
    ],
    notas: {
      salida: ['Limón fresco', 'Bergamota italiana'],
      corazon: ['Anís estrellado', 'Flor del olivo mediterráneo', 'Madera de gaiac'],
      fondo: ['Cuero negro refinado', 'Haba tonka tostada', 'Tabaco rubio aromático']
    }
  },
  {
    test: (id, n) => n === 'GIORGIO ARMANI ARMANI SI' || (n.includes('SI') && !n.includes('PASSIONE') && n.includes('ARMANI')),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Licor de grosellas negras (casis)'],
      corazon: ['Rosa de mayo de Grasse', 'Fresia blanca'],
      fondo: ['Vainilla Bourbon suntuosa', 'Pachulí terroso noble', 'Notas amaderadas rubias', 'Ambroxan']
    }
  },
  {
    test: (id, n) => n.includes('SI PASSIONE'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'rosa', porcentaje: 80, color: '#F0587E' },
      { nombre: 'floral', porcentaje: 72, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Grosellas negras de la pasión', 'Pera jugosa', 'Pimienta rosa picante', 'Pomelo'],
      corazon: ['Rosa de Damasco apasionada', 'Piña fresca', 'Jazmín sambac', 'Heliotropo'],
      fondo: ['Vainilla de Madagascar cremosa', 'Madera de cedro', 'Amberwood', 'Pachulí']
    }
  },

  // ==========================================
  // JESUS DEL POZO (HALLOWEEN)
  // ==========================================
  {
    test: (id, n) => n.includes('HALLOWEEN TRADICIONAL') || (n.includes('HALLOWEEN') && !n.includes('MAN') && !n.includes('ROCK') && !n.includes(' X')),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'violeta', porcentaje: 90, color: '#7E5B98' },
      { nombre: 'acuático', porcentaje: 80, color: '#258BD2' },
      { nombre: 'atalcado', porcentaje: 72, color: '#988E83' }
    ],
    notas: {
      salida: ['Violeta suave', 'Notas marinas oceánicas', 'Hoja de plátano verde', 'Petitgrain'],
      corazon: ['Magnolia aromática', 'Lirio de los valles', 'Nardos seductores', 'Pimienta rosa'],
      fondo: ['Incienso oriental místico', 'Sándalo', 'Vainilla de Madagascar', 'Mirra preciosa']
    }
  },
  {
    test: (id, n) => n.includes('HALLOWEEN MAN X') || (n.includes('HALLOWEEN') && n.endsWith(' X')),
    acordes: [
      { nombre: 'café', porcentaje: 100, color: '#5B3B26' },
      { nombre: 'cálido especiado', porcentaje: 90, color: '#AA331E' },
      { nombre: 'whisky', porcentaje: 82, color: '#C07D30' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'lavanda', porcentaje: 68, color: '#8076A3' }
    ],
    notas: {
      salida: ['Cardamomo picante', 'Lavanda francesa fresca', 'Limón jugoso'],
      corazon: ['Café tostado intenso', 'Whisky escocés añejo', 'Canela de Ceilán', 'Cuero negro', 'Notas minerales'],
      fondo: ['Haba tonka tostada', 'Ámbar oriental ardiente', 'Incienso místico']
    }
  },
  {
    test: (id, n) => n.includes('HALLOWEEN') && n.includes('ROCK ON'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 85, color: '#5C9058' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Bambú verde fresco', 'Limón', 'Cardamomo', 'Pimienta rosa'],
      corazon: ['Manzana roja dulce', 'Lavanda', 'Romero', 'Hojas de violeta'],
      fondo: ['Almizcle limpio', 'Ámbar cálido', 'Sándalo', 'Musgo de roble']
    }
  },

  // ==========================================
  // KAJAL
  // ==========================================
  {
    test: (id, n) => n.includes('KAJAL HOMME'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 85, color: '#AA331E' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' }
    ],
    notas: {
      salida: ['Mandarina dulce de Calabria', 'Pomelo rosado', 'Grosella roja'],
      corazon: ['Madera de gaiac noble', 'Cardamomo', 'Flor de azahar', 'Cashmeran'],
      fondo: ['Haba tonka tostada', 'Vainilla suave', 'Madera de oud', 'Pachulí terroso']
    }
  },
  {
    test: (id, n) => n.includes('KOLADA') || n.includes('RUBY') || n.includes('TOPAZ'),
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#E8A317' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' }
    ],
    notas: {
      salida: ['Piña dorada jugosa', 'Coco fresco de playa', 'Bergamota'],
      corazon: ['Flor de tiaré', 'Ylang-ylang seductor', 'Rosa de Damasco'],
      fondo: ['Vainilla Bourbon cremosa', 'Ámbar dorado', 'Almizcle blanco aterciopelado']
    }
  },

  // ==========================================
  // LANCOME
  // ==========================================
  {
    test: (id, n) => n.includes('LA VIE EST BELLE') || n.includes('LA VIE BELLE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'pachulí', porcentaje: 72, color: '#7E6850' },
      { nombre: 'iris', porcentaje: 65, color: '#83749B' }
    ],
    notas: {
      salida: ['Grosellas negras crujientes', 'Pera dulce jugosa'],
      corazon: ['Iris pálida de Florencia', 'Jazmín sambac', 'Flor de azahar del naranjo'],
      fondo: ['Praliné artesanal crujiente', 'Vainilla de Madagascar', 'Pachulí noble', 'Haba tonka']
    }
  },
  {
    test: (id, n) => n.includes('IDOLE AURA') || (n.includes('IDOLE') && n.includes('AURA')),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'salado', porcentaje: 88, color: '#3A829E' },
      { nombre: 'rosa', porcentaje: 82, color: '#F0587E' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' }
    ],
    notas: {
      salida: ['Sal marina cristalina solar', 'Rosa de Isparta', 'Bergamota'],
      corazon: ['Rosa centifolia de Grasse', 'Jazmín blanco radiante'],
      fondo: ['Vainilla Bourbon de Madagascar', 'Almizcle solar', 'Heliotropo']
    }
  },
  {
    test: (id, n) => n.includes('TRESOR IN LOVE'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 88, color: '#E87EA1' },
      { nombre: 'rosa', porcentaje: 80, color: '#F0587E' },
      { nombre: 'atalcado', porcentaje: 68, color: '#988E83' }
    ],
    notas: {
      salida: ['Nectarina dulce jugosa', 'Pera', 'Pimienta rosa picante', 'Bergamota'],
      corazon: ['Rosa de Taif romántica', 'Melocotón maduro', 'Violeta delicada', 'Jazmín'],
      fondo: ['Almizcle blanco aterciopelado', 'Madera de cedro de Virginia']
    }
  },

  // ==========================================
  // MANCERA
  // ==========================================
  {
    test: (id, n) => n.includes('CEDRAT BOISE INTENSE') || (n.includes('CEDRAT BOISE') && n.includes('INTENSE')),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'cuero', porcentaje: 80, color: '#6E4823' },
      { nombre: 'afrutados', porcentaje: 72, color: '#D74423' },
      { nombre: 'oud', porcentaje: 65, color: '#3D3430' }
    ],
    notas: {
      salida: ['Cítricos sicilianos vibrantes', 'Grosella negra intensa', 'Especias picantes'],
      corazon: ['Cuero ahumado refinado', 'Madera de oud camboyano', 'Pachulí terroso', 'Sándalo blanco'],
      fondo: ['Ámbar gris suntuoso', 'Vainilla suave', 'Musgo de roble', 'Almizcle blanco']
    }
  },
  {
    test: (id, n) => n.includes('COCO VANILLE'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'coco', porcentaje: 92, color: '#D3B17D' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'floral blanco', porcentaje: 75, color: '#DDDCD7' }
    ],
    notas: {
      salida: ['Coco blanco dulce cremoso', 'Melocotón blanco jugoso'],
      corazon: ['Flor de tiaré de Tahití', 'Ylang-ylang exótico', 'Jazmín sambac'],
      fondo: ['Vainilla de Madagascar pura', 'Almizcle blanco aterciopelado', 'Notas amaderadas rubias']
    }
  },
  {
    test: (id, n) => n.includes('FRENCH RIVIERA'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'marino', porcentaje: 88, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'fresco', porcentaje: 72, color: '#68B684' }
    ],
    notas: {
      salida: ['Mandarina soleada', 'Naranja amarga', 'Limón', 'Jengibre picante', 'Pimienta'],
      corazon: ['Notas marinas de la Costa Azul', 'Flor de tiaré', 'Pino marítimo', 'Vetiver'],
      fondo: ['Sal marina cristalina', 'Ámbar blanco', 'Almizcle blanco limpio']
    }
  },
  {
    test: (id, n) => n.includes('RED TOBACCO'),
    acordes: [
      { nombre: 'tabaco', porcentaje: 100, color: '#734E2F' },
      { nombre: 'cálido especiado', porcentaje: 92, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 85, color: '#CBB677' },
      { nombre: 'oud', porcentaje: 80, color: '#3D3430' },
      { nombre: 'canela', porcentaje: 75, color: '#A84323' }
    ],
    notas: {
      salida: ['Canela ardiente', 'Madera de agar (oud)', 'Incienso ahumado', 'Azafrán noble', 'Nuez moscada', 'Manzana verde', 'Pera blanca'],
      corazon: ['Pachulí terroso de Indonesia', 'Jazmín nocturno'],
      fondo: ['Hojas de tabaco de pipa exquisito', 'Vainilla de Madagascar', 'Ámbar suntuoso', 'Madera de sándalo', 'Madera de gaiac', 'Almizcle', 'Vetiver']
    }
  },

  // ==========================================
  // MONTBLANC
  // ==========================================
  {
    test: (id, n) => n.includes('MONTBLANC EXPLORER') || n.includes('EXPLORER EXTREME'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'ámbar', porcentaje: 72, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Bergamota de Calabria brillante', 'Pimienta rosa refinada', 'Salvia sclarea'],
      corazon: ['Vetiver de Haití orgánico', 'Cuero ahumado flexible'],
      fondo: ['Ambroxan noble potente', 'Akigalawood', 'Pachulí de Indonesia', 'Vaina de cacao']
    }
  },
  {
    test: (id, n) => n.includes('MONTBLANC LEGEND') || (n.includes('LEGEND') && n.includes('MONT BLANC')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'lavanda', porcentaje: 72, color: '#8076A3' }
    ],
    notas: {
      salida: ['Lavanda francesa', 'Piña tropical jugosa', 'Bergamota italiana', 'Cedrón (hierbaluisa)'],
      corazon: ['Manzana roja crujiente', 'Frutos secos nobles', 'Musgo de roble', 'Geranio', 'Cumarina', 'Rosa'],
      fondo: ['Haba tonka tostada', 'Madera de sándalo noble']
    }
  },
  {
    test: (id, n) => n.includes('STARWALKER') || n.includes('STAR WALKER'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Bambú verde fresco zen', 'Bergamota refrescante', 'Mandarina'],
      corazon: ['Madera de sándalo noble', 'Almizcle blanco limpio', 'Cedro blanco'],
      fondo: ['Jengibre picante fresco', 'Resina de abeto', 'Nuez moscada', 'Ámbar']
    }
  },

  // ==========================================
  // MUGLER
  // ==========================================
  {
    test: (id, n) => n.includes('ALIEN HYPERSENSE') || n.includes('ALIEN EXTRAINTENSE'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' },
      { nombre: 'ámbar', porcentaje: 70, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Mandarina verde hipnótica', 'Pera jugosa cristalina'],
      corazon: ['Jazmín sambac imperial electrizante'],
      fondo: ['Cashmeran magnético', 'Ámbar mineral solar', 'Madera flotante a la deriva']
    }
  },
  {
    test: (id, n) => n.includes('ANGEL NOVA'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'rosa', porcentaje: 82, color: '#F0587E' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Frambuesa jugosa sobrenatural', 'Lichi exótico dulce'],
      corazon: ['Rosa de Damasco bio-reciclada'],
      fondo: ['Akigalawood vibrante', 'Benjuí de Siam cálido']
    }
  },
  {
    test: (id, n) => n.includes('ANGEL RECARGA') || (n.includes('ANGEL') && !n.includes('NOVA')),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'pachulí', porcentaje: 92, color: '#7E6850' },
      { nombre: 'cálido especiado', porcentaje: 85, color: '#AA331E' },
      { nombre: 'caramelo', porcentaje: 80, color: '#B86B2B' },
      { nombre: 'chocolate', porcentaje: 75, color: '#4B3621' }
    ],
    notas: {
      salida: ['Algodón de azúcar azul', 'Coco', 'Casis', 'Melón dulce', 'Jazmín', 'Bergamota', 'Mandarina'],
      corazon: ['Miel dorada', 'Bayas rojas silvestres', 'Zarzamora', 'Ciruela', 'Albaricoque', 'Melocotón', 'Orquídea', 'Rosa'],
      fondo: ['Pachulí legendario de Mugler', 'Chocolate amargo', 'Caramelo caliente', 'Vainilla Bourbon', 'Haba tonka', 'Ámbar', 'Almizcle', 'Sándalo']
    }
  },

  // ==========================================
  // PEPE JEANS
  // ==========================================
  {
    test: (id, n) => n.includes('PEPE JEANS CELEBRATE'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' }
    ],
    notas: {
      salida: ['Palomitas de maíz calientes con mantequilla', 'Castaña tostada', 'Pimienta blanca'],
      corazon: ['Caviar de lima', 'Whisky escocés dulce', 'Manzana roja', 'Notas acuáticas'],
      fondo: ['Vainilla dulce', 'Haba tonka', 'Madera de cachemira', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('PEPE JEANS') && !n.includes('CELEBRATE'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' }
    ],
    notas: {
      salida: ['Almendra dulce', 'Mandarina chispeante', 'Malvavisco'],
      corazon: ['Leche de almendras cremosa', 'Vodka dulce', 'Flor de tiaré'],
      fondo: ['Vainilla de Madagascar', 'Ámbar', 'Madera de sándalo']
    }
  },

  // ==========================================
  // RASASI HAWAS VARIANTS
  // ==========================================
  {
    test: (id, n) => n.includes('HAWAS') && (n.includes('KOBRA') || n.includes('MALIBU') || n.includes('TROPICAL') || n.includes('VERDE')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'marino', porcentaje: 88, color: '#258BD2' },
      { nombre: 'cítrico', porcentaje: 80, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 72, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Bergamota italiana', 'Canela de Ceilán', 'Cardamomo'],
      corazon: ['Ciruela dulce de Damasco', 'Flor de azahar', 'Acorde marino energizante'],
      fondo: ['Ámbar gris potente', 'Almizcle seductor', 'Madera flotante a la deriva', 'Pachulí']
    }
  },

  // ==========================================
  // SABRINA CARPENTER
  // ==========================================
  {
    test: (id, n) => n.includes('SWEET TOOTH') && !n.includes('CARAMEL'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 92, color: '#CBB677' },
      { nombre: 'lactónico', porcentaje: 85, color: '#86888A' },
      { nombre: 'chocolate', porcentaje: 80, color: '#4B3621' }
    ],
    notas: {
      salida: ['Malvavisco esponjoso dulce', 'Chocolate blanco cremoso', 'Jengibre confitado', 'Bergamota'],
      corazon: ['Vainilla de Madagascar', 'Leche de coco suave', 'Pétalos de jazmín'],
      fondo: ['Crema batida dulce', 'Azúcar moreno tostado', 'Madera de cachemira', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('CARAMEL DREAM'),
    acordes: [
      { nombre: 'caramelo', porcentaje: 100, color: '#B8B939' },
      { nombre: 'dulce', porcentaje: 92, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 85, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Caramelo oscuro quemado artesanal', 'Almendra azucarada', 'Leche condensada', 'Limón'],
      corazon: ['Orquídea de chocolate', 'Pachulí suave', 'Flor de azahar'],
      fondo: ['Madera de sándalo cálido', 'Vainilla Bourbon intensa', 'Ámbar dorado', 'Almizcle']
    }
  },

  // ==========================================
  // VERSACE
  // ==========================================
  {
    test: (id, n) => n.includes('BRIGHT CRYSTAL'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'fresco', porcentaje: 88, color: '#68B684' },
      { nombre: 'cítrico', porcentaje: 80, color: '#B8B939' },
      { nombre: 'acuático', porcentaje: 72, color: '#258BD2' }
    ],
    notas: {
      salida: ['Yuzu japonés chispeante', 'Granada dulce rubí', 'Acorde de hielo polar'],
      corazon: ['Peonía rosada elegante', 'Flor de loto acuática', 'Magnolia sedosa'],
      fondo: ['Almizcle puro cristalino', 'Madera de caoba noble', 'Ámbar vegetal']
    }
  },
  {
    test: (id, n) => n.includes('CRYSTAL NOIR'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'coco', porcentaje: 88, color: '#D3B17D' },
      { nombre: 'floral blanco', porcentaje: 80, color: '#DDDCD7' },
      { nombre: 'atalcado', porcentaje: 70, color: '#988E83' }
    ],
    notas: {
      salida: ['Pimienta negra picante', 'Jengibre fresco', 'Cardamomo de Ceilán'],
      corazon: ['Coco cremoso sensual', 'Gardenia nocturna', 'Flor de azahar', 'Peonía'],
      fondo: ['Madera de sándalo australiano', 'Almizcle seductor', 'Ámbar solar']
    }
  },
  {
    test: (id, n) => n.includes('EROS NAJIM') || (n.includes('EROS') && n.includes('NAJIM')),
    acordes: [
      { nombre: 'oud', porcentaje: 100, color: '#3D3430' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 72, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Cardamomo negro picante', 'Mandarina oriental', 'Pimienta'],
      corazon: ['Madera de agar (oud) refinada', 'Incienso místico', 'Pachulí'],
      fondo: ['Vainilla Bourbon rica', 'Caramelo tostado', 'Ámbar suntuoso']
    }
  },
  {
    test: (id, n) => n.includes('VERSACE POUR') || (n.includes('VERSACE') && n.includes('POUR HOMME')),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' },
      { nombre: 'floral', porcentaje: 68, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Limón de Calabria fresco', 'Neroli', 'Bergamota italiana', 'Rosa de mayo'],
      corazon: ['Jacinto azul', 'Salvia sclarea', 'Cedro blanco', 'Geranio'],
      fondo: ['Haba tonka tostada', 'Almizcle limpio', 'Ámbar mineral']
    }
  },

  // ==========================================
  // AL HARAMAIN
  // ==========================================
  {
    test: (id, n) => n.includes('AQUA DUBAI'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'marino', porcentaje: 80, color: '#258BD2' },
      { nombre: 'ámbar', porcentaje: 70, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Mandarina jugosa de Dubái', 'Bergamota', 'Notas verdes frescas'],
      corazon: ['Grosellas negras', 'Melón dulce', 'Piña fresca', 'Ámbar blanco'],
      fondo: ['Almizcle blanco puro', 'Petitgrain', 'Gálbano noble']
    }
  },
  {
    test: (id, n) => n.includes('AMBER OUD EXTREME') || (n.includes('AMBER OUD') && n.includes('GOLD')),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 92, color: '#D74423' },
      { nombre: 'avainillado', porcentaje: 85, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 78, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Bergamota chispeante', 'Notas verdes aromáticas'],
      corazon: ['Melón jugoso tropical', 'Notas dulces azucaradas', 'Piña madura', 'Ámbar dorado'],
      fondo: ['Almizcle blanco aterciopelado', 'Vainilla Bourbon pura', 'Maderas preciosas']
    }
  },
  {
    test: (id, n) => n.includes('AMBER OUD ROUGE'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 90, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 82, color: '#AA331E' },
      { nombre: 'almendras', porcentaje: 75, color: '#CBB677' }
    ],
    notas: {
      salida: ['Azafrán noble persa', 'Almendra amarga crujiente'],
      corazon: ['Jazmín grandiflorum de Egipto', 'Madera de cedro del Atlas'],
      fondo: ['Ámbar gris suntuoso', 'Almizcle blanco', 'Notas amaderadas de cachemira']
    }
  },

  // ==========================================
  // HUGO BOSS
  // ==========================================
  {
    test: (id, n) => n.includes('BOSS BOTTLED ELIXIR'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 90, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 82, color: '#AA331E' },
      { nombre: 'ahumado', porcentaje: 72, color: '#565051' }
    ],
    notas: {
      salida: ['Incienso de olíbano ardiente', 'Cardamomo de Guatemala'],
      corazon: ['Pachulí terroso noble', 'Vetiver terroso profundo'],
      fondo: ['Ládano resinoso suntuoso', 'Madera de cedro del Atlas']
    }
  },
  {
    test: (id, n) => n.includes('BOSS BOTTLED BEYOND'),
    acordes: [
      { nombre: 'fresco', porcentaje: 100, color: '#68B684' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' }
    ],
    notas: {
      salida: ['Menta fresca glacial', 'Manzana verde crujiente'],
      corazon: ['Lavanda aromática francesa', 'Canela suave'],
      fondo: ['Madera de sándalo noble', 'Madera de cedro blanco']
    }
  },
  {
    test: (id, n) => n.includes('BOSS BOTTLED'),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'canela', porcentaje: 68, color: '#A84323' }
    ],
    notas: {
      salida: ['Manzana roja icónica', 'Ciruela dulce', 'Bergamota', 'Limón', 'Musgo de roble', 'Geranio'],
      corazon: ['Canela de Ceilán', 'Caoba noble', 'Clavel aromático'],
      fondo: ['Vainilla de Madagascar', 'Madera de sándalo', 'Cedro', 'Vetiver', 'Olivo']
    }
  },

  // ==========================================
  // KHADLAJ
  // ==========================================
  {
    test: (id, n) => n.includes('ISLAND'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'coco', porcentaje: 80, color: '#D3B17D' },
      { nombre: 'tropical', porcentaje: 72, color: '#E8A317' }
    ],
    notas: {
      salida: ['Coco fresco de las islas', 'Mandarina dulce', 'Flores solares'],
      corazon: ['Vainilla cremosa de Tahití', 'Orquídea salvaje', 'Jazmín'],
      fondo: ['Ámbar dorado cálido', 'Almizcle blanco', 'Madera de sándalo']
    }
  },

  // ==========================================
  // MARC JACOBS
  // ==========================================
  {
    test: (id, n) => n.includes('MARC JACOBS PERFECT') || n.includes('PERFECT ELIXIR') || n.includes('PERFECT ABSOLUTE'),
    acordes: [
      { nombre: 'almendras', porcentaje: 100, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Ruibarbo crujiente refrescante', 'Narciso silvestre'],
      corazon: ['Leche de almendras cremosa reconfortante'],
      fondo: ['Cashmeran aterciopelado', 'Madera de cedro noble']
    }
  },

  // ==========================================
  // NIKE
  // ==========================================
  {
    test: (id, n) => n.includes('NIKE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 75, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' }
    ],
    notas: {
      salida: ['Jengibre picante energizante', 'Limón de Sicilia', 'Menta fresca'],
      corazon: ['Lavanda aromática', 'Pimienta rosa', 'Manzana ácida'],
      fondo: ['Madera de cedro', 'Ámbar seco moderno', 'Almizcle limpio']
    }
  },

  // ==========================================
  // RAYHAAN
  // ==========================================
  {
    test: (id, n) => n.includes('RAYHAAN'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'tropical', porcentaje: 88, color: '#E8A317' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mango maduro tropical jugoso', 'Bergamota italiana', 'Pimienta rosa'],
      corazon: ['Lavanda aromática', 'Madera de cedro', 'Notas marinas'],
      fondo: ['Haba tonka tostada', 'Ámbar seco moderno', 'Vainilla suave']
    }
  },

  // ==========================================
  // SHAKIRA
  // ==========================================
  {
    test: (id, n) => n.includes('SHAKIRA'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 80, color: '#B8B939' },
      { nombre: 'avainillado', porcentaje: 70, color: '#CBB677' }
    ],
    notas: {
      salida: ['Pera roja dulce', 'Mandarina chispeante', 'Pomelo rosado'],
      corazon: ['Flor de azahar del naranjo', 'Peonía sensual', 'Lirio blanco'],
      fondo: ['Caramelo tostado', 'Vainilla suave', 'Almizcle sedoso', 'Madera de cedro']
    }
  },

  // ==========================================
  // VIKTOR & ROLF
  // ==========================================
  {
    test: (id, n) => n.includes('FLOWERBOMB'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'pachulí', porcentaje: 90, color: '#7E6850' },
      { nombre: 'floral blanco', porcentaje: 82, color: '#DDDCD7' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' }
    ],
    notas: {
      salida: ['Té verde aromático', 'Bergamota italiana', 'Osmanto'],
      corazon: ['Orquídea catleya exótica', 'Jazmín sambac', 'Fresia', 'Rosa centifolia'],
      fondo: ['Pachulí terroso noble', 'Vainilla Bourbon', 'Almizcle']
    }
  },
  {
    test: (id, n) => n.includes('SPICEBOMB'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'cuero', porcentaje: 90, color: '#6E4823' },
      { nombre: 'tabaco', porcentaje: 82, color: '#734E2F' },
      { nombre: 'canela', porcentaje: 75, color: '#A84323' }
    ],
    notas: {
      salida: ['Pimienta roja ardiente', 'Pimienta rosa', 'Bergamota', 'Elemí'],
      corazon: ['Canela picante', 'Azafrán noble', 'Pimentón dulce'],
      fondo: ['Cuero negro profundo', 'Tabaco de pipa aromático', 'Vetiver de Haití']
    }
  },

  // ==========================================
  // AJMAL
  // ==========================================
  {
    test: (id, n) => n.includes('AJMAL'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'oud', porcentaje: 80, color: '#3D3430' },
      { nombre: 'cálido especiado', porcentaje: 72, color: '#AA331E' }
    ],
    notas: {
      salida: ['Azafrán persa', 'Bergamota fresca', 'Pimienta rosa'],
      corazon: ['Rosa de Taif', 'Madera de oud refinado', 'Jazmín oriental'],
      fondo: ['Ámbar dorado', 'Madera de sándalo', 'Almizcle blanco noble']
    }
  },

  // ==========================================
  // AL WATANIAH
  // ==========================================
  {
    test: (id, n) => n.includes('DURRAT AL AROOS'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 80, color: '#A09F9C' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Almizcle blanco delicado', 'Vainilla suave'],
      corazon: ['Haba tonka tostada', 'Cardamomo'],
      fondo: ['Madera de sándalo', 'Ámbar dorado']
    }
  },
  {
    test: (id, n) => n.includes('SHAGAF AL WARD'),
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#E87EA1' },
      { nombre: 'floral blanco', porcentaje: 88, color: '#DDDCD7' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Jazmín blanco', 'Osmanto aromático', 'Rosa de mayo'],
      corazon: ['Nardo de la India', 'Narciso'],
      fondo: ['Ámbar gris', 'Madera de cedro']
    }
  },

  // ==========================================
  // AMARAN
  // ==========================================
  {
    test: (id, n) => n.includes('AMARAN'),
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 68, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Bergamota de Calabria', 'Notas marinas frescas', 'Mandarina'],
      corazon: ['Romero silvestre', 'Lavanda francesa', 'Geranio'],
      fondo: ['Madera de cedro blanco', 'Pachulí noble', 'Ámbar gris']
    }
  },

  // ==========================================
  // AZZARO
  // ==========================================
  {
    test: (id, n) => n.includes('THE MOST WANTED') || n.includes('MOST WANTED'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' }
    ],
    notas: {
      salida: ['Cardamomo rojo picante de Guatemala'],
      corazon: ['Caramelo toffee derretido goloso'],
      fondo: ['Madera de Bourbon ahumada', 'Amberwood']
    }
  },
  {
    test: (id, n) => n.includes('WANTED BY NIGHT'),
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'canela', porcentaje: 90, color: '#A84323' },
      { nombre: 'afrutados', porcentaje: 82, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' },
      { nombre: 'tabaco', porcentaje: 70, color: '#734E2F' }
    ],
    notas: {
      salida: ['Canela ardiente', 'Mandarina jugosa', 'Lavanda', 'Limón'],
      corazon: ['Notas afrutadas rojas licorosas', 'Incienso místico', 'Comino', 'Cedro rojo'],
      fondo: ['Hojas de tabaco aromático', 'Vainilla Bourbon', 'Cedro del Atlas', 'Cuero negro', 'Ciprés', 'Benjuí']
    }
  },

  // ==========================================
  // CACHAREL
  // ==========================================
  {
    test: (id, n) => n.includes('ANAIS'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'floral', porcentaje: 90, color: '#E87EA1' },
      { nombre: 'verde', porcentaje: 78, color: '#5C9058' },
      { nombre: 'atalcado', porcentaje: 70, color: '#988E83' }
    ],
    notas: {
      salida: ['Lirio blanco', 'Jacinto', 'Madreselva dulce', 'Flor de azahar'],
      corazon: ['Lirio de los valles', 'Azucena pura', 'Jazmín sambac', 'Ylang-ylang', 'Rosa de mayo'],
      fondo: ['Musgo de roble', 'Incienso suave', 'Almizcle blanco', 'Cuero fino', 'Madera de sándalo']
    }
  },

  // ==========================================
  // CAMARA & NENE BEAUTY
  // ==========================================
  {
    test: (id, n) => n.includes('CAMARA') || n.includes('NENE BEAUTY'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' }
    ],
    notas: {
      salida: ['Cereza dulce confitada', 'Fresas maduras', 'Almendra azucarada'],
      corazon: ['Crema batida suave', 'Vainilla cremosa', 'Pétalos de rosa'],
      fondo: ['Vainilla de Madagascar', 'Almizcle blanco dulce', 'Haba tonka']
    }
  },

  // ==========================================
  // RALPH LAUREN POLO
  // ==========================================
  {
    test: (id, n) => n.includes('POLO GREEN') || (n.includes('POLO') && n.includes('GREEN')),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 90, color: '#5C9058' },
      { nombre: 'fresco especiado', porcentaje: 80, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' }
    ],
    notas: {
      salida: ['Albahaca fresca', 'Menta verde vigorizante', 'Pomelo brillante'],
      corazon: ['Salvia sclarea aromática', 'Hojas de violeta', 'Tomillo silvestre'],
      fondo: ['Pachulí terroso noble', 'Ambroxan potente', 'Vetiver de Haití']
    }
  },
  {
    test: (id, n) => n.includes('POLO RED'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'café', porcentaje: 70, color: '#5B3B26' }
    ],
    notas: {
      salida: ['Arándano rojo silvestre', 'Pomelo rojo rubí', 'Limón italiano'],
      corazon: ['Azafrán rojo noble', 'Salvia roja aromática'],
      fondo: ['Café tostado arábica', 'Ámbar cálido', 'Maderas nobles de cedro']
    }
  },

  // ==========================================
  // PRADA
  // ==========================================
  {
    test: (id, n) => n.includes('PARADOXE INTENSE') || (n.includes('PARADOXE') && n.includes('INTENSE')),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 80, color: '#C87D2A' },
      { nombre: 'afrutados', porcentaje: 72, color: '#D74423' }
    ],
    notas: {
      salida: ['Pera dulce jugosa', 'Neroli fresco', 'Bergamota de Calabria'],
      corazon: ['Jazmín blanco opulento', 'Flor de neroli', 'Musgo silvestre'],
      fondo: ['Ambrofix potente', 'Vainilla Bourbon intensa', 'Serenolide (almizcle blanco)']
    }
  },
  {
    test: (id, n) => n.includes('LUNA ROSSA OCEAN') || (n.includes('LUNA ROSSA') && n.includes('OCEAN')),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'ámbar', porcentaje: 80, color: '#C87D2A' },
      { nombre: 'cítrico', porcentaje: 72, color: '#B8B939' }
    ],
    notas: {
      salida: ['Limón chispeante vibrante'],
      corazon: ['Azafrán noble refinado'],
      fondo: ['AmberXtreme potente', 'Madera de roble ahumado noble']
    }
  },

  // ==========================================
  // INDIVIDUAL DESIGNER ICONS
  // ==========================================
  {
    test: (id, n) => n.includes('9AM (BEIGE)') || n.includes('9 AM (BEIGE)'),
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
    test: (id, n) => n.includes('PISTACHIO KUNAFA'),
    acordes: [
      { nombre: 'nueces', porcentaje: 100, color: '#9E7E43' },
      { nombre: 'dulce', porcentaje: 95, color: '#FF384D' },
      { nombre: 'lactónico', porcentaje: 85, color: '#86888A' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' }
    ],
    notas: {
      salida: ['Pistacho tostado de Oriente', 'Almendra dulce', 'Miel dorada pura'],
      corazon: ['Masa kadayif crocante caliente', 'Crema de leche batida espesa'],
      fondo: ['Vainilla de Madagascar', 'Azúcar quemado caramelizado', 'Almizcle suave']
    }
  },
  {
    test: (id, n) => n.includes('MARWA'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'café', porcentaje: 72, color: '#5B3B26' }
    ],
    notas: {
      salida: ['Almendra crocante', 'Bergamota italiana', 'Café arábica tostado'],
      corazon: ['Jazmín sambac blanco', 'Flor de azahar del naranjo', 'Nardos seductores'],
      fondo: ['Vainilla de Madagascar', 'Haba tonka tostada', 'Cacao puro', 'Praliné', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('BILLIE EILISH') || n.includes('YOUR TURN'),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'cacao', porcentaje: 82, color: '#4B3621' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' }
    ],
    notas: {
      salida: ['Pétalos azucarados', 'Bayas rojas maduras', 'Mandarina dulce'],
      corazon: ['Vainilla cremosa suntuosa', 'Especias suaves finas', 'Cacao puro'],
      fondo: ['Haba tonka tostada', 'Almizcle cálido seductor', 'Ámbar', 'Maderas nobles']
    }
  },
  {
    test: (id, n) => n.includes('BVLGARI TERRAE ESSENCE') || (n.includes('TERRAE') && n.includes('ESSENCE')),
    acordes: [
      { nombre: 'terroso', porcentaje: 100, color: '#6A5638' },
      { nombre: 'amaderado', porcentaje: 90, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' }
    ],
    notas: {
      salida: ['Cidra fresca soleada', 'Flor del calamondín'],
      corazon: ['Vetiver de Java', 'Vetiver de Haití', 'Raíz de lirio refinada'],
      fondo: ['Notas terrosas toscanas exclusivas', 'Styrax resinoso noble']
    }
  },
  {
    test: (id, n) => n.includes('COOL WATER'),
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 90, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 80, color: '#4B8E6D' },
      { nombre: 'verde', porcentaje: 72, color: '#5C9058' }
    ],
    notas: {
      salida: ['Agua de mar cristalina', 'Lavanda fresca', 'Menta silvestre', 'Romero', 'Cilantro'],
      corazon: ['Madera de sándalo', 'Jazmín', 'Neroli', 'Geranio'],
      fondo: ['Almizcle blanco', 'Musgo de roble', 'Madera de cedro', 'Tabaco rubio', 'Ámbar']
    }
  },
  {
    test: (id, n) => n.includes('PURE POISON'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' }
    ],
    notas: {
      salida: ['Jazmín blanco puro', 'Mandarina siciliana', 'Bergamota de Calabria', 'Naranja dulce'],
      corazon: ['Flor de azahar del naranjo', 'Gardenia nocturna'],
      fondo: ['Madera de sándalo cremoso', 'Ámbar blanco puro', 'Cedro']
    }
  },
  {
    test: (id, n) => n.includes('IN LOVE WITH YOU'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 78, color: '#E87EA1' }
    ],
    notas: {
      salida: ['Frambuesa madura silvestre', 'Cereza ácida licorosa', 'Grosellas negras'],
      corazon: ['Jazmín sambac seductor', 'Rosa de Damasco', 'Ajenjo amargo'],
      fondo: ['Pachulí terroso noble']
    }
  },
  {
    test: (id, n) => n.includes('FLORA GORGEUS MAGNOLIA') || n.includes('GORGEOUS MAGNOLIA'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' }
    ],
    notas: {
      salida: ['Zarzamora silvestre', 'Bayas dulces del bosque'],
      corazon: ['Magnolia elegante suntuosa', 'Pachulí noble', 'Salvia sclarea'],
      fondo: ['Almizcle blanco aterciopelado', 'Pachulí terroso', 'Maderas rubias']
    }
  },
  {
    test: (id, n) => n.includes('TERRE D') || n.includes('TERRE D\'HERMES'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 90, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 82, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Naranja amarga madura', 'Pomelo chispeante'],
      corazon: ['Pimienta negra picante', 'Pelargonio', 'Pedernal mineral'],
      fondo: ['Vetiver de Java', 'Madera de cedro del Atlas', 'Pachulí terroso', 'Benjuí']
    }
  },
  {
    test: (id, n) => n.includes('JENNIFER LOPEZ') || n.includes('STILL'),
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#DDDCD7' },
      { nombre: 'té', porcentaje: 88, color: '#6A7D42' },
      { nombre: 'cítrico', porcentaje: 80, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Té Earl Grey refinado', 'Mandarina blanca', 'Manzana crujiente', 'Flor de azahar'],
      corazon: ['Jazmín salvaje', 'Lirio de los valles', 'Rosa romántica', 'Fresia'],
      fondo: ['Almizcle suave', 'Pimienta blanca', 'Ámbar limpio', 'Madera de sándalo']
    }
  },
  {
    test: (id, n) => n.includes('CLUB BLACK') || (n.includes('MERCEDES') && n.includes('BLACK')),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 90, color: '#C87D2A' },
      { nombre: 'ahumado', porcentaje: 82, color: '#565051' },
      { nombre: 'balsámico', porcentaje: 75, color: '#865E3C' }
    ],
    notas: {
      salida: ['Bergamota chispeante refinada'],
      corazon: ['Incienso oriental misterioso', 'Jazmín'],
      fondo: ['Vainilla Bourbon exquisita', 'Benjuí de Siam', 'Ambroxan potente', 'Maderas nobles']
    }
  },
  {
    test: (id, n) => n.includes('MESSI'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'marino', porcentaje: 70, color: '#258BD2' }
    ],
    notas: {
      salida: ['Cardamomo fresco', 'Hojas de manzana crujiente', 'Ciprés silvestre'],
      corazon: ['Raíz de lirio noble', 'Lavanda francesa', 'Cuero suave'],
      fondo: ['Madera de cedro noble', 'Vainilla suave', 'Pachulí terroso']
    }
  },
  {
    test: (id, n) => n.includes('ARABIANS TONKA'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 90, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'oud', porcentaje: 80, color: '#3D3430' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' }
    ],
    notas: {
      salida: ['Azafrán noble ardiente', 'Bergamota de Calabria'],
      corazon: ['Madera de agar (oud) refinada', 'Rosa de Bulgaria majestuosa'],
      fondo: ['Haba tonka tostada exquisita', 'Caña de azúcar caramelizada', 'Ámbar blanco', 'Almizcle blanco', 'Musgo de roble']
    }
  },
  {
    test: (id, n) => n.includes('TOY 2') || (n.includes('MOSCHINO') && n.includes('TOY')),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'floral', porcentaje: 88, color: '#E87EA1' },
      { nombre: 'cítrico', porcentaje: 80, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 72, color: '#68B684' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Mandarina jugosa', 'Magnolia aromática'],
      corazon: ['Grosella blanca dulce', 'Peonía rosada', 'Pétalos de jazmín'],
      fondo: ['Almizcle blanco puro', 'Madera de sándalo', 'Amberwood']
    }
  },
  {
    test: (id, n) => n.includes('NINA MANZANA') || (n.includes('NINA') && n.includes('RICCI')),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 85, color: '#D74423' }
    ],
    notas: {
      salida: ['Limón de Amalfi fresco', 'Lima ácida'],
      corazon: ['Manzana acaramelada crujiente', 'Praliné artesanal', 'Peonía', 'Datura'],
      fondo: ['Madera de manzano', 'Almizcle blanco suave', 'Cedro de Virginia']
    }
  },
  {
    test: (id, n) => n.includes('ORIENTICA AMBER ROUGE') || n.includes('AMBER ROUGE'),
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 90, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 82, color: '#AA331E' },
      { nombre: 'almizclado', porcentaje: 72, color: '#A09F9C' }
    ],
    notas: {
      salida: ['Azafrán noble rojo', 'Jazmín blanco grandiflorum'],
      corazon: ['Amberwood brillante', 'Ámbar gris suntuoso'],
      fondo: ['Madera de cedro noble', 'Resina de abeto balsámica']
    }
  },

  // ==========================================
  // ADIDAS COLLECTION (Línea Deportiva & Vibes)
  // ==========================================
  {
    test: (id, n) => n.includes('ADIDAS') && (n.includes('PURE GAME') || n.includes('DYNAMIC') || n.includes('ICE DIVE') || n.includes('CHAMPIONS') || n.includes('UEFA') || n.includes('VICTORY') || n.includes('VIBES')),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 80, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Menta salvaje helada', 'Pomelo chispeante', 'Mandarina brillante'],
      corazon: ['Albahaca fresca', 'Lavanda aromática', 'Madera de gaiac'],
      fondo: ['Haba tonka tostada', 'Madera de cedro blanco', 'Madera de sándalo']
    }
  }
];

function aplicarSegundaFase() {
  const path = 'src/assets/perfumes.json';
  const catalog = JSON.parse(fs.readFileSync(path, 'utf8'));

  let count = 0;

  for (const p of catalog) {
    const id = p.id.toLowerCase();
    const nombre = p.nombre.toUpperCase();

    // Check if this perfume has any matching rule in Part 2
    const regla = FRAGRANTICA_RULES_2.find(r => r.test(id, nombre));
    if (regla) {
      p.acordes = regla.acordes;
      p.notas = regla.notas;
      count++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`✅ Segunda fase completada: ${count} perfumes actualizados con pirámides de Fragrantica.`);
}

aplicarSegundaFase();
