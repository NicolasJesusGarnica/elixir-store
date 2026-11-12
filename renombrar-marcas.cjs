const fs = require('fs');
const CAT = 'C:/Users/njgar/Desktop/Proyectos/Elixir_Perfumeria/elixir-store/src/assets/perfumes.json';
const data = JSON.parse(fs.readFileSync(CAT, 'utf8'));

const reemplazos = {
  'A.B. ICON MEN EDT': 'ANTONIO BANDERAS ICON MEN EDT',
  'A.B. ICON MEN EDP': 'ANTONIO BANDERAS ICON MEN EDP',
  'A.B. BLUE': 'ANTONIO BANDERAS BLUE',
  'A.B. GOLDEN SECRET': 'ANTONIO BANDERAS GOLDEN SECRET',
  'A.B. QUEEN OF SEDUCTION': 'ANTONIO BANDERAS QUEEN OF SEDUCTION',
  'J.P.G. LE CLASSIQUE EDP': 'JEAN PAUL GAULTIER LE CLASSIQUE EDP',
  'J.P.G. LE MALE ELIXIR': 'JEAN PAUL GAULTIER LE MALE ELIXIR',
  'J.P.G. LE MALE LE PARFUM': 'JEAN PAUL GAULTIER LE MALE LE PARFUM',
  'J.P.G. DIVINE ELIXIR': 'JEAN PAUL GAULTIER DIVINE ELIXIR',
  'J.P. HALLOWEEN MUJER': 'JEAN PAUL GAULTIER HALLOWEEN MUJER',
};

let n = 0;
for (const p of data) {
  const nuevo = reemplazos[p.nombre];
  if (nuevo) {
    console.log(`  ${p.nombre.padEnd(30)} -> ${nuevo}`);
    p.nombre = nuevo;
    n++;
  }
}

fs.writeFileSync(CAT, JSON.stringify(data, null, 1));
console.log(`\nRenombrados: ${n}`);

const quedan = data.filter((p) => /^[A-Z]\.[A-Z]/.test(p.nombre));
console.log(`Nombres con iniciales que quedan: ${quedan.length}`);
quedan.forEach((p) => console.log(`   ${p.nombre} (${p.marca})`));
console.log(`\nDoble punto: ${data.filter((p) => p.nombre.includes('..')).length}`);
console.log(`Total productos: ${data.length}`);