const cat = require('../src/assets/perfumes.json');
const sets = cat.filter(p => /set|estuche|mini/i.test(p.nombre) || /set|estuche|mini/i.test(p.id));
console.log('Total sets en catalogo:', sets.length);
sets.forEach(s => {
  console.log(`[${s.id}] "${s.nombre}" (${s.marca}) -> Bs ${s.completo ? s.completo.precioBs : 'sin precio'}`);
});
