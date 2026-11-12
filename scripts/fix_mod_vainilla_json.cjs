const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '../src/assets/perfumes.json');
const perfumes = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

let updated = 0;
for (const p of perfumes) {
  if (p.id === 'ariana_grande_mod_vainilla') {
    p.imagenes = ['https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/ariana_grande_mod_vanilla.webp'];
    updated++;
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(perfumes, null, 2), 'utf8');
console.log('Successfully updated', updated, 'items in', catalogPath);
