require('dotenv').config({ path: '.env.r2' });
const fs = require('fs');
const path = require('path');
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

const ids = [
  'afnan_9pm_negro_100',
  'afnan_supremacy_in_oud',
  'arabiyat_prestige_marwa',
  'adidas_vibes_happy_feels',
  'ajmal_vi',
  'carolina_herrera_ch',
  'burberry_goddess',
  'carolina_herrera_bad_boy_le',
  'davidoff_cool_water',
  'nene_beauty_bruma_body_splash',
  'pepe_jeans_london_calling_for_her',
  'shrek_for_boys',
];

(async () => {
  for (const id of ids) {
    const local = path.join('temp_final_12', `${id}.webp`);
    const key = `perfumes/${id}.webp`;
    const body = fs.readFileSync(local);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
    console.log(`[R2 UPLOADED] -> ${PUBLICO}/${key}`);
  }
  console.log('✅ Los 12 perfumes han sido subidos exitosamente a Cloudflare R2.');
})();
