require('dotenv').config({ path: '.env.r2' });
const fs = require('fs');
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const ACC_ID = process.env.R2_ACCOUNT_ID;
const ACCESS = process.env.R2_ACCESS_KEY;
const SECRET = process.env.R2_SECRET_KEY;
const BUCKET = process.env.R2_BUCKET || 'elixir-images';

if (!ACC_ID || !ACCESS || !SECRET) {
  console.error('Faltan credenciales en .env.r2');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACC_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS, secretAccessKey: SECRET },
});

const catalogo = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));
const urls = Array.from(new Set(catalogo.flatMap((p) => p.imagenes || [])));

console.log(`Iniciando optimización de proporciones para ${urls.length} imágenes...`);

(async () => {
  let subidas = 0;
  let omitidas = 0;
  let errores = 0;

  for (let i = 0; i < urls.length; i++) {
    const rawUrl = urls[i];
    const urlLimpia = rawUrl.split('?')[0];
    const filename = urlLimpia.split('/').pop();

    try {
      const res = await fetch(urlLimpia);
      if (!res.ok) {
        console.error(`Error al descargar ${filename}: HTTP ${res.status}`);
        errores++;
        continue;
      }

      const inputBuf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(inputBuf).metadata();

      let pipeline = sharp(inputBuf);
      let trimmedObj;

      if (meta.hasAlpha) {
        trimmedObj = await pipeline.trim().toBuffer({ resolveWithObject: true });
      } else {
        trimmedObj = await pipeline
          .trim({ background: '#ffffff', threshold: 14 })
          .toBuffer({ resolveWithObject: true });
      }

      const tw = trimmedObj.info.width;
      const th = trimmedObj.info.height;
      const areaRatio = (tw * th) / (meta.width * meta.height);

      // Si la imagen tiene márgenes excesivos (más del 6% de espacio muerto), la normalizamos
      const tieneMargenMuerto = areaRatio < 0.94 || tw < meta.width - 24 || th < meta.height - 24;

      if (tieneMargenMuerto) {
        const bgExtend = meta.hasAlpha ? { r: 0, g: 0, b: 0, alpha: 0 } : '#ffffff';
        // Añadir 14px de respiración elegante
        const processedBuf = await sharp(trimmedObj.data)
          .extend({ top: 14, bottom: 14, left: 14, right: 14, background: bgExtend })
          .webp({ quality: 85, effort: 6 })
          .toBuffer();

        const postMeta = await sharp(processedBuf).metadata();

        // Subir a R2
        await s3.send(
          new PutObjectCommand({
            Bucket: BUCKET,
            Key: `perfumes/${filename}`,
            Body: processedBuf,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=604800',
          })
        );

        subidas++;
        console.log(
          `[${i + 1}/${urls.length}] OPTIMIZADA: ${filename} (${meta.width}x${meta.height} -> ${postMeta.width}x${postMeta.height}, ratio: ${areaRatio.toFixed(2)})`
        );
      } else {
        omitidas++;
        console.log(
          `[${i + 1}/${urls.length}] YA PERFECTA: ${filename} (${meta.width}x${meta.height}, ratio: ${areaRatio.toFixed(2)})`
        );
      }
    } catch (e) {
      console.error(`Error procesando ${filename}:`, e.message);
      errores++;
    }
  }

  console.log('---');
  console.log(`Completado. Subidas a R2: ${subidas} | Ya proporcionadas: ${omitidas} | Errores: ${errores}`);
})();
