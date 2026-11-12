const fs = require('fs');
const path = require('path');
const { optimizarImagen, subirAR2 } = require('./pipeline_helpers.cjs');

(async () => {
  const dir = 'temp_test_batch';
  const files = fs.readdirSync(dir);
  console.log(`Archivos encontrados en ${dir}: ${files.length}`);

  const processedIds = new Set();

  for (const f of files) {
    const parsed = path.parse(f);
    const id = parsed.name;
    if (processedIds.has(id)) continue;
    processedIds.add(id);

    const inputPath = path.join(dir, f);
    try {
      console.log(`Procesando ${id}...`);
      const webpBuffer = await optimizarImagen(inputPath);
      const r2Key = `perfumes/${id}.webp`;
      const url = await subirAR2(r2Key, webpBuffer);
      console.log(`  ✓ Subido a R2: ${url} (${(webpBuffer.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`  ✗ Error con ${id}:`, e.message);
    }
  }
  console.log('--- Proceso completado ---');
})();
