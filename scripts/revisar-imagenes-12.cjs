const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));

const targets = [
  'AFNAN 9PM (NEGRO) 100',
  'AFNAN SUPREMACY IN OUD',
  'ARABIYAT PRESTIGE MARWA',
  'ADIDAS VIBES HAPPY FEELS',
  'AJMAL VI',
  'CAROLINA HERRERA CH',
  'BURBERRY GODDESS',
  'CAROLINA HERRERA BAD BOY LE',
  'DAVIDOFF COOL WATER',
  'NENE BEAUTY BRUMA BODY SPLASH',
  'PEPE JEANS LONDON CALLING FOR HER',
  'SHREK FOR BOYS'
];

targets.forEach(t => {
  const p = catalog.find(x => x.nombre.toUpperCase().includes(t.toUpperCase()) || t.toUpperCase().includes(x.nombre.toUpperCase()));
  if (p) {
    console.log(`FOUND: [${p.id}] ${p.nombre}`);
    console.log('  Imagenes:', p.imagenes);
  } else {
    console.log(`NOT FOUND EXACT: ${t}`);
    const matches = catalog.filter(x => {
      const words = t.split(' ').filter(w => w.length > 3);
      return words.filter(w => x.nombre.toUpperCase().includes(w)).length >= 2;
    });
    console.log('  Candidates:', matches.map(m => `[${m.id}] ${m.nombre}`));
  }
});
