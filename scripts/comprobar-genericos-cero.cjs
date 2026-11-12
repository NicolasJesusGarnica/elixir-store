const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));

const genericSigs = [
  'Bergamota,Lavanda fresca,Manzana verde | Geranio,Pimienta de Sichuan,Salvia | Vetiver,Cedro del Atlas,Ámbar gris',
  'Bergamota,Lavanda fresca | Geranio,Pimienta | Cedro,Ambar',
  'Cardamomo oscuro,Pimienta rosa | Lavanda francesa,Canela de Ceilán | Haba tonka,Ámbar extremo,Maderas preciosas',
  'Pera jugosa,Mandarina italiana | Rosa de mayo,Jazmín sambac,Peonía | Almizcle blanco,Vainilla suave,Cedro',
  'Frutos rojos confitados,Almendra dulce | Caramelo tostado,Orquídea de vainilla,Praliné | Vainilla de Madagascar,Haba tonka,Almizcle',
  'Bergamota de Calabria,Notas marinas,Menta fresca | Romero,Lavanda,Geranio | Cedro,Ambroxan,Almizcle blanco',
  'Azafrán,Nuez moscada,Cardamomo | Madera de oud,Cuero ahumado,Pachulí | Ámbar negro,Vainilla Bourbon,Sándalo'
];

let totalGeneric = 0;
genericSigs.forEach((sig, i) => {
  const matches = catalog.filter(p => ((p.notas?.salida||[]).join(',') + ' | ' + (p.notas?.corazon||[]).join(',') + ' | ' + (p.notas?.fondo||[]).join(',')) === sig);
  console.log(`Plantilla genérica #${i+1}: ${matches.length} perfumes`);
  totalGeneric += matches.length;
  if (matches.length > 0) {
    matches.forEach(m => console.log('   - ' + m.marca + ' - ' + m.nombre));
  }
});

console.log('---');
console.log(`TOTAL perfumes con plantillas genéricas: ${totalGeneric} de ${catalog.length}`);
