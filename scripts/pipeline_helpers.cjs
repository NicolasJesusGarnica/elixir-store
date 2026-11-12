const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.r2' });
const sharp = require('sharp');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const ACC_ID = process.env.R2_ACCOUNT_ID;
const ACCESS = process.env.R2_ACCESS_KEY;
const SECRET = process.env.R2_SECRET_KEY;
const BUCKET = process.env.R2_BUCKET || 'elixir-images';
const PUBLICO = process.env.R2_PUBLICO_URL || 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${ACC_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS, secretAccessKey: SECRET },
});

/**
 * Optimiza una imagen raw (JPG/PNG/WEBP):
 * - Trim de bordes blancos o transparentes
 * - Resize a 800x800 contain con fondo blanco puro
 * - Compresión WebP optimizada (q=85)
 * - Retorna buffer WebP
 */
async function optimizarImagen(inputPath) {
  const inputBuf = fs.readFileSync(inputPath);
  const meta = await sharp(inputBuf).metadata();

  let trimmedBuf = inputBuf;
  try {
    if (meta.hasAlpha) {
      const res = await sharp(inputBuf).trim().toBuffer({ resolveWithObject: true });
      trimmedBuf = res.data;
    } else {
      const res = await sharp(inputBuf).trim({ background: '#ffffff', threshold: 16 }).toBuffer({ resolveWithObject: true });
      trimmedBuf = res.data;
    }
  } catch (err) {
    // Si trim falla por color uniforme u otro motivo, usar buffer original
    trimmedBuf = inputBuf;
  }

  // Redimensionar con 14px de margen de seguridad (772x772 dentro de 800x800)
  const bgExtend = meta.hasAlpha ? { r: 255, g: 255, b: 255, alpha: 1 } : '#ffffff';

  const webpBuffer = await sharp(trimmedBuf)
    .resize({
      width: 772,
      height: 772,
      fit: 'contain',
      background: bgExtend
    })
    .extend({
      top: 14,
      bottom: 14,
      left: 14,
      right: 14,
      background: '#ffffff'
    })
    .webp({ quality: 85, effort: 6 })
    .toBuffer();

  return webpBuffer;
}

/**
 * Sube buffer WebP a R2
 */
async function subirAR2(key, buffer) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return `${PUBLICO}/${key}`;
}

module.exports = {
  optimizarImagen,
  subirAR2
};
