const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));

// Generic templates signatures
const genericSigs = new Set([
  'Bergamota,Lavanda fresca,Manzana verde | Geranio,Pimienta de Sichuan,Salvia | Vetiver,Cedro del Atlas,Ámbar gris',
  'Bergamota,Lavanda fresca | Geranio,Pimienta | Cedro,Ambar',
  'Cardamomo oscuro,Pimienta rosa | Lavanda francesa,Canela de Ceilán | Haba tonka,Ámbar extremo,Maderas preciosas',
  'Pera jugosa,Mandarina italiana | Rosa de mayo,Jazmín sambac,Peonía | Almizcle blanco,Vainilla suave,Cedro',
  'Frutos rojos confitados,Almendra dulce | Caramelo tostado,Orquídea de vainilla,Praliné | Vainilla de Madagascar,Haba tonka,Almizcle',
  'Bergamota de Calabria,Notas marinas,Menta fresca | Romero,Lavanda,Geranio | Cedro,Ambroxan,Almizcle blanco',
  'Azafrán,Nuez moscada,Cardamomo | Madera de oud,Cuero ahumado,Pachulí | Ámbar negro,Vainilla Bourbon,Sándalo'
]);

const genericPerfumes = catalog.filter(p => {
  const sig = (p.notas?.salida || []).join(',') + ' | ' + (p.notas?.corazon || []).join(',') + ' | ' + (p.notas?.fondo || []).join(',');
  return genericSigs.has(sig);
});

console.log(`Perfumes todavía con plantilla genérica: ${genericPerfumes.length}`);

// Group by brand
const byBrand = {};
genericPerfumes.forEach(p => {
  byBrand[p.marca] = byBrand[p.marca] || [];
  byBrand[p.marca].push(p.nombre);
});

Object.entries(byBrand)
  .sort((a,b) => b[1].length - a[1].length)
  .forEach(([marca, list]) => {
    console.log(`\n=== ${marca} (${list.length}) ===`);
    list.forEach(name => console.log(`  - ${name}`));
  });
