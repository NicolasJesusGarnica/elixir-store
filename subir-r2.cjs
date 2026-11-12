// Sube las imagenes de public/assets/perfumes a Cloudflare R2 (script local, se borra al terminar).
// Uso: node subir-r2.cjs
require('dotenv').config({ path: '.env.r2' });
const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const ACC_ID = process.env.R2_ACCOUNT_ID;
const ACCESS = process.env.R2_ACCESS_KEY;
const SECRET = process.env.R2_SECRET_KEY;
const BUCKET = process.env.R2_BUCKET || 'elixir-images';
const PUBLICO = process.env.R2_PUBLICO_URL;
const DIR = 'public/assets/perfumes';

if (!ACC_ID || !ACCESS || !SECRET || !PUBLICO) {
  console.error('Faltan datos en .env.r2');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACC_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS, secretAccessKey: SECRET },
});

(async () => {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.webp'));
  let ok = 0;
  let fallo = 0;

  for (const f of files) {
    const key = `perfumes/${f}`;
    const body = fs.readFileSync(path.join(DIR, f));
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: body,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      );
      ok++;
      process.stdout.write(`\rsubidas: ${ok}/${files.length}`);
    } catch (e) {
      fallo++;
      console.error(`\nFALLO ${f}: ${e.name} ${e.message}`);
    }
  }

  console.log(`\n---`);
  console.log(`subidas: ${ok} · fallidas: ${fallo}`);
  console.log(`ejemplo: ${PUBLICO}/perfumes/${files[0]}`);
  console.log(`\nPearl de URLs base: ${PUBLICO}/perfumes/`);
})();