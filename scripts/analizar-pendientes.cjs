const fs = require('fs');

const catalog = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));

const signatures = {};
catalog.forEach(p => {
  const sig = (p.notas?.salida || []).join(',') + ' | ' + (p.notas?.corazon || []).join(',') + ' | ' + (p.notas?.fondo || []).join(',');
  signatures[sig] = signatures[sig] || [];
  signatures[sig].push(p);
});

const sorted = Object.entries(signatures).sort((a,b) => b[1].length - a[1].length);

console.log('--- REPETICIONES DE PIRÁMIDES OLFATIVAS ---');
sorted.forEach(([sig, list]) => {
  if (list.length > 2) {
    console.log(`\n[${list.length} perfumes] Sig: ${sig}`);
    console.log('Marcas:', [...new Set(list.map(p => p.marca))].join(', '));
    console.log('Ejemplos:', list.slice(0, 5).map(p => p.nombre).join(' | '));
  }
});

const repeatedCount = sorted.filter(([sig, list]) => list.length > 2).reduce((acc, [, list]) => acc + list.length, 0);
console.log(`\nTotal perfumes con firmas repetidas (>2): ${repeatedCount} de ${catalog.length}`);
