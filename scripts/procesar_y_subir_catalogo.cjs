const fs = require('fs');
const path = require('path');
const { optimizarImagen, subirAR2 } = require('./pipeline_helpers.cjs');

const RAW_DIR = 'temp_raw_catalog';
const STATE_FILE = 'scripts/progreso_r2.json';
const CATALOG_FILE = 'scripts/catalogo_preparado.json';

let state = {};
if (fs.existsSync(STATE_FILE)) {
  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch (e) {
    state = {};
  }
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

async function processQueue(items, concurrency = 4) {
  let index = 0;
  let success = 0;
  let failed = 0;
  const total = items.length;

  async function worker() {
    while (index < total) {
      const curIdx = index++;
      const item = items[curIdx];
      const id = item.id;
      const filePath = item.file;

      if (state[id] && state[id].status === 'ok') {
        success++;
        continue;
      }

      try {
        const webpBuf = await optimizarImagen(filePath);
        const r2Key = `perfumes/${id}.webp`;
        const r2Url = await subirAR2(r2Key, webpBuf);

        state[id] = {
          status: 'ok',
          r2_url: r2Url,
          size_kb: +(webpBuf.length / 1024).toFixed(1),
          timestamp: new Date().toISOString()
        };
        success++;
        console.log(`[${curIdx + 1}/${total}] ✓ R2 OK: ${id} (${state[id].size_kb} KB)`);
      } catch (err) {
        state[id] = {
          status: 'failed',
          error: err.message
        };
        failed++;
        console.error(`[${curIdx + 1}/${total}] ✗ Error ${id}: ${err.message}`);
      }

      if ((curIdx + 1) % 20 === 0) {
        saveState();
        console.log(`--- Progreso R2: ${curIdx + 1}/${total} | Subidos: ${success} | Errores: ${failed} ---`);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  saveState();
  console.log(`\nFinalizado R2: ${success} subidos exitosamente, ${failed} fallidos de ${total}.`);
}

async function main() {
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`Directorio ${RAW_DIR} no existe.`);
    return;
  }

  const files = fs.readdirSync(RAW_DIR);
  console.log(`Archivos raw encontrados: ${files.length}`);

  const itemMap = new Map();
  for (const f of files) {
    const parsed = path.parse(f);
    const id = parsed.name;
    const fullPath = path.join(RAW_DIR, f);
    if (!itemMap.has(id)) {
      itemMap.set(id, { id, file: fullPath });
    }
  }

  const items = Array.from(itemMap.values());
  await processQueue(items, 4);
}

main().catch(console.error);
