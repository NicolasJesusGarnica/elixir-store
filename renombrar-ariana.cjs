const fs = require('fs');
const CAT = 'C:/Users/njgar/Desktop/Proyectos/Elixir_Perfumeria/elixir-store/src/assets/perfumes.json';
const data = JSON.parse(fs.readFileSync(CAT, 'utf8'));

const reemplazos = {
  'A.G. CLOUD': 'ARIANA GRANDE CLOUD',
  'A.G. THANK U NEXT': 'ARIANA GRANDE THANK U NEXT',
  'A.G. MOOD BLUSH': 'ARIANA GRANDE MOOD BLUSH',
  'A.G. GOD IS A WOMAN': 'ARIANA GRANDE GOD IS A WOMAN',
  'A.G. SWEET LIKE CANDY': 'ARIANA GRANDE SWEET LIKE CANDY',
  'A.G.. ARI': 'ARIANA GRANDE ARI',
  'A.G. MOONLIGHT': 'ARIANA GRANDE MOONLIGHT',
};

let n = 0;
for (const p of data) {
  const nuevo = reemplazos[p.nombre];
  if (nuevo) {
    console.log(`  ${p.nombre.padEnd(26)} -> ${nuevo}`);
    p.nombre = nuevo;
    n++;
  }
}

fs.writeFileSync(CAT, JSON.stringify(data, null, 1));
console.log(`\nProductos renombrados: ${n}`);

const quedan = data.filter((p) => /a\.g\./i.test(p.nombre));
console.log(`Nombres con "A.G." que quedan: ${quedan.length}`);
console.log(`\nOtros con iniciales, sin tocar (misma situacion):`);
data
  .filter((p) => /^[a-z]\.[a-z]\.?/.test(p.nombre))
  .forEach((p) => console.log(`   ${p.nombre.padEnd(28)} (marca: ${p.marca})`));