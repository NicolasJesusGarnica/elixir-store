const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIR = 'public/assets/perfumes';
const OUT = '.opt-temp';
const ANCHO = 800; // px de ancho: suficiente para tarjetas y detalle
const CALIDAD = 78; // webp

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.webp'));
  let antes = 0;
  let despues = 0;
  let guardadas = 0;
  const fallidas = [];

  for (const f of files) {
    const p = path.join(DIR, f);
    const original = fs.statSync(p).size;
    antes += original;

    const meta = await sharp(p).metadata();
    const tmp = path.join(OUT, f);

    // Leemos a memoria para no dejar el archivo original abierto (Windows lo bloquea)
    const input = fs.readFileSync(p);
    await sharp(input)
      .resize({ width: ANCHO, withoutEnlargement: true })
      .webp({ quality: CALIDAD, effort: 6 })
      .toFile(tmp);

    const nuevo = fs.statSync(tmp);

    // Solo escribimos la version optimizada si pesa menos
    if (nuevo.size < original) {
      despues += nuevo.size;
      guardadas++;
      // La copia al destino la hace PowerShell (node no puede sobrescribir el archivo abierto)
    } else {
      despues += original;
    }

    const dim = `${meta.width}x${meta.height}`;
    process.stdout.write(
      `${f.padEnd(38)} ${dim.padEnd(11)} ${(original / 1024).toFixed(0).padStart(5)} KB -> ${(Math.min(nuevo.size, original) / 1024).toFixed(0).padStart(4)} KB\n`,
    );
  }

  console.log('---');
  console.log(`optimizadas: ${guardadas}/${files.length}`);
  console.log(`antes:  ${(antes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`despues: ${(despues / 1024 / 1024).toFixed(2)} MB`);
  console.log(`ahorro: ${(100 - (despues / antes) * 100).toFixed(0)}%`);
})();