const fs = require('fs');

const REGLAS_ULTIMOS_9 = [
  // 1. ANTONIO BANDERAS ICON
  {
    test: (id, n) => n.includes('ANTONIO BANDERAS ICON') && !n.includes('SPLENDID'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 70, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Pomelo brillante refrescante', 'Pimienta negra picante'],
      corazon: ['Lavanda francesa salvaje', 'Salvia sclarea aromática'],
      fondo: ['Madera de cedro blanco', 'Musgo de roble noble', 'Ámbar cálido']
    }
  },

  // 2. JEAN PAUL GAULTIER JPG SET MINI
  {
    test: (id, n) => n.includes('JPG SET MINI') || (n.includes('SET MINI') && n.includes('JPG')),
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'lavanda', porcentaje: 90, color: '#8076A3' },
      { nombre: 'cálido especiado', porcentaje: 82, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' }
    ],
    notas: {
      salida: ['Cardamomo negro picante', 'Lavanda francesa', 'Menta fresca', 'Bergamota'],
      corazon: ['Iris noble empolvado', 'Canela de Ceilán', 'Flor de azahar'],
      fondo: ['Vainilla Bourbon suntuosa', 'Haba tonka tostada', 'Maderas nobles orientales']
    }
  },

  // 3. LACOSTE L.12:12 BLANC EAU INTENSE
  {
    test: (id, n) => n.includes('L.12:12') || n.includes('BLANC EAU INTENSE'),
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 72, color: '#4B8E6D' }
    ],
    notas: {
      salida: ['Mandarina jugosa brillante', 'Cardamomo de Guatemala'],
      corazon: ['Salvia sclarea aromática', 'Lavanda francesa'],
      fondo: ['Madera de sándalo noble', 'Cuero blanco suave']
    }
  },

  // 4. CAROLINA HERRERA GOOD GIRL (variante sin espacio GOODGIRL)
  {
    test: (id, n) => n.includes('GOODGIRL') && !n.includes('VERY'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'floral blanco', porcentaje: 88, color: '#DDDCD7' },
      { nombre: 'cálido especiado', porcentaje: 80, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'cacao', porcentaje: 70, color: '#4B3621' }
    ],
    notas: {
      salida: ['Almendra crocante', 'Café arábica intenso', 'Bergamota italiana', 'Limón'],
      corazon: ['Nardos seductores', 'Jazmín sambac blanco', 'Flor de azahar', 'Rosa de Bulgaria'],
      fondo: ['Haba tonka tostada', 'Cacao puro oscuro', 'Vainilla Bourbon', 'Praliné', 'Sándalo', 'Ámbar', 'Pachulí']
    }
  },

  // 5. CAROLINA HERRERA VERY GOOD GIRL (variante VERY GOODGIRL)
  {
    test: (id, n) => n.includes('VERY GOODGIRL'),
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'rosa', porcentaje: 90, color: '#F0587E' },
      { nombre: 'avainillado', porcentaje: 80, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' }
    ],
    notas: {
      salida: ['Lichi jugoso exótico', 'Grosellas rojas silvestres'],
      corazon: ['Rosa de mayo seductora', 'Rosa centifolia'],
      fondo: ['Vainilla Bourbon suntuosa', 'Vetiver de Haití']
    }
  },

  // 6. BURBERRY MR BURBERRY IN BLACK
  {
    test: (id, n) => n.includes('BURBERRY IN BLACK') || (n.includes('BURBERRY') && n.includes('IN BLACK')),
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 80, color: '#4A8B71' },
      { nombre: 'ámbar', porcentaje: 72, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Pomelo chispeante', 'Cardamomo aromático', 'Estragón fresco'],
      corazon: ['Madera de cedro blanco', 'Nuez moscada', 'Hojas de abedul'],
      fondo: ['Benjuí resinoso', 'Madera de sándalo noble', 'Vetiver de Haití']
    }
  },

  // 7. FRENCH AVENUE AZZURE AOUD
  {
    test: (id, n) => n.includes('AZZURE AOUD') || n.includes('AZZURE OUD'),
    acordes: [
      { nombre: 'oud', porcentaje: 100, color: '#3D3430' },
      { nombre: 'marino', porcentaje: 90, color: '#258BD2' },
      { nombre: 'amaderado', porcentaje: 80, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 72, color: '#C87D2A' }
    ],
    notas: {
      salida: ['Bergamota de Calabria', 'Notas marinas profundas', 'Manzana crujiente'],
      corazon: ['Azafrán noble persa', 'Madera de agar (oud)', 'Pachulí terroso'],
      fondo: ['Ámbar gris suntuoso', 'Cuero ahumado', 'Almizcle seductor']
    }
  },

  // 8. FRENCH AVENUE VULCAN FEU
  {
    test: (id, n) => n.includes('VULCAN FEU'),
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#E8A317' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'cálido especiado', porcentaje: 82, color: '#AA331E' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' }
    ],
    notas: {
      salida: ['Mango Alfonso maduro jugoso', 'Jengibre ardiente picante', 'Bayas rojas dulces', 'Limón'],
      corazon: ['Jazmín nocturno embriagador', 'Maderas secas nobles', 'Cumarina'],
      fondo: ['Ámbar gris ardiente', 'Madera de cedro blanco', 'Almizcle solar']
    }
  },

  // 9. PACO RABANNE XS BLACK (variante de orden inverso)
  {
    test: (id, n) => n.includes('XS BLACK'),
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'afrutados', porcentaje: 80, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 72, color: '#8D5524' }
    ],
    notas: {
      salida: ['Limón de Calabria fresco', 'Calamansi cítrico', 'Tagete', 'Salvia'],
      corazon: ['Praliné de chocolate artesanal', 'Canela picante', 'Bálsamo de Tolú', 'Cardamomo negro'],
      fondo: ['Palo de rosa brasileño', 'Ámbar negro profundo', 'Pachulí noble', 'Ébano']
    }
  }
];

function aplicarUltimos9() {
  const path = 'src/assets/perfumes.json';
  const catalog = JSON.parse(fs.readFileSync(path, 'utf8'));

  let count = 0;

  for (const p of catalog) {
    const id = p.id.toLowerCase();
    const nombre = p.nombre.toUpperCase();

    const regla = REGLAS_ULTIMOS_9.find(r => r.test(id, nombre));
    if (regla) {
      p.acordes = regla.acordes;
      p.notas = regla.notas;
      count++;
    }
  }

  fs.writeFileSync(path, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`✅ Últimos 9 perfumes completados con éxito: ${count} actualizados.`);
}

aplicarUltimos9();
