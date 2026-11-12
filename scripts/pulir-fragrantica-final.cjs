const fs = require('fs');

/**
 * Script de precisión quirúrgica:
 * Resuelve las colisiones de subcadena (VICTORIA vs VICTORIA'S SECRET, REM en EXTREME, ARI en BVLGARI/MARINA/MANDARIN)
 * y asigna pirámides olfativas auténticas de Fragrantica a los últimos perfumes pendientes.
 */

const REGLAS_PRECISION = [
  // 1. CAROLINA HERRERA BAD BOY EXTREME
  {
    test: (id, n) => n.includes('BAD BOY EXTREME'),
    acordes: [
      { nombre: 'cacao', porcentaje: 100, color: '#4B3621' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 72, color: '#4A8B71' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Salvia sclarea aromática', 'Jengibre fresco picante', 'Bergamota'],
      corazon: ['Vetiver terroso de la India', 'Cacao puro oscuro amargo', 'Haba tonka'],
      fondo: ['Pachulí noble', 'Ámbar dorado ardiente', 'Incienso de olíbano']
    }
  },

  // 2. MONTBLANC EXPLORER EXTREME
  {
    test: (id, n) => n.includes('EXPLORER EXTREME'),
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

  // 3. AL HARAMAIN AMBER OUD EXTREME GOLD
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

  // 4. BVLGARI TERRAE ESSENCE
  {
    test: (id, n) => n.includes('TERRAE ESSENCE') || (n.includes('BVLGARI') && n.includes('TERRAE')),
    acordes: [
      { nombre: 'terroso', porcentaje: 100, color: '#6A5638' },
      { nombre: 'amaderado', porcentaje: 90, color: '#8D5524' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'balsámico', porcentaje: 70, color: '#865E3C' }
    ],
    notas: {
      salida: ['Cidra fresca soleada de Calabria', 'Flor del calamondín'],
      corazon: ['Vetiver de Java', 'Vetiver de Haití', 'Raíz de lirio refinada'],
      fondo: ['Notas terrosas toscanas exclusivas', 'Styrax resinoso noble']
    }
  },

  // 5. ARD AL ZAAFARAN MARINA DEEP AND DARK
  {
    test: (id, n) => n.includes('MARINA DEEP'),
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Notas marinas profundas oceánicas', 'Bergamota italiana', 'Manzana verde'],
      corazon: ['Romero silvestre', 'Lavanda francesa', 'Geranio aromático'],
      fondo: ['Madera de cedro blanco', 'Ámbar gris suntuoso', 'Almizcle limpio']
    }
  },

  // 6. ARMAF ODYSSEY MANDARIN SKY
  {
    test: (id, n) => n.includes('MANDARIN SKY'),
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

  // 7. VICTORIA'S SECRET (Línea Completa de Brumas y Perfumes)
  {
    test: (id, n) => n.includes('VICTORIA') && n.includes('SECRET'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 80, color: '#E87EA1' },
      { nombre: 'avainillado', porcentaje: 72, color: '#CBB677' }
    ],
    notas: {
      salida: ['Maracuyá de Shangri-la', 'Fresas silvestres', 'Mandarina dulce'],
      corazon: ['Peonía rosada de Shanghái', 'Orquídea de vainilla', 'Jazmín sambac'],
      fondo: ['Vainilla batida cremosa', 'Almizcle seductor', 'Maderas rubias']
    }
  },

  // 8. DUMONT NITRO MINI SET
  {
    test: (id, n) => n.includes('NITRO MINI SET'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Manzana verde crujiente', 'Bergamota italiana', 'Lavanda fresca'],
      corazon: ['Cardamomo picante', 'Pachulí terroso noble', 'Madera de cedro'],
      fondo: ['Vainilla Bourbon intensa', 'Ámbar dorado cálido', 'Haba tonka tostada']
    }
  },

  // 9. JEAN PAUL GAULTIER SCANDAL LE PARFUM (LE 80)
  {
    test: (id, n) => n.includes('SCANDAL LE') || n.includes('SCANDAL LE 80'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'caramelo', porcentaje: 90, color: '#B86B2B' },
      { nombre: 'avainillado', porcentaje: 82, color: '#CBB677' },
      { nombre: 'floral blanco', porcentaje: 75, color: '#DDDCD7' }
    ],
    notas: {
      salida: ['Mandarina dulce jugosa', 'Jazmín sambac blanco radiante'],
      corazon: ['Caramelo salado derretido', 'Miel dorada líquida'],
      fondo: ['Vainilla Bourbon de Madagascar', 'Haba tonka tostada']
    }
  },

  // 10. JESUS DEL POZO ROCK ON
  {
    test: (id, n) => n.includes('ROCK ON'),
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 85, color: '#5C9058' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 70, color: '#8D5524' }
    ],
    notas: {
      salida: ['Bambú verde fresco', 'Limón siciliano', 'Cardamomo', 'Pimienta rosa'],
      corazon: ['Manzana roja dulce', 'Lavanda francesa', 'Romero', 'Hojas de violeta'],
      fondo: ['Almizcle limpio', 'Ámbar cálido', 'Madera de sándalo', 'Musgo de roble']
    }
  },

  // 11. JESUS DEL POZO X
  {
    test: (id, n) => n.includes('JESUS DEL POZO X') || (n.includes('HALLOWEEN') && n.includes('MAN X')),
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
  }
];

function aplicarPrecision() {
  const path = 'src/assets/perfumes.json';
  const catalog = JSON.parse(fs.readFileSync(path, 'utf8'));

  let count = 0;

  for (const p of catalog) {
    const id = p.id.toLowerCase();
    const nombre = p.nombre.toUpperCase();

    const regla = REGLAS_PRECISION.find(r => r.test(id, nombre));
    if (regla) {
      p.acordes = regla.acordes;
      p.notas = regla.notas;
      count++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`✅ Ajustes de precisión aplicados a ${count} perfumes.`);
}

aplicarPrecision();
