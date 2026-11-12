const fs = require('fs');
const path = require('path');

const BASE = 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/';
const CAT = 'src/assets/perfumes.json';
const data = JSON.parse(fs.readFileSync(CAT, 'utf8'));

let cambios = 0;
for (const p of data) {
  const nuevas = p.imagenes.map((ruta) => {
    const archivo = ruta.split('/').pop();
    const destino = BASE + archivo;
    if (ruta !== destino) cambios++;
    return destino;
  });
  p.imagenes = nuevas;
}

fs.writeFileSync(CAT, JSON.stringify(data, null, 1));
console.log('productos:', data.length, '· URLs cambiadas:', cambios);
console.log('ejemplo:', data[0].imagenes[0]);