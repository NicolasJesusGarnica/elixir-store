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

(async () => {
  const mappings = [
    { local: 'temp_fixed_white/av_eau_my_bb_eau_my_bb.webp', key: 'perfumes/air_val_eau_my_bb.webp' },
    { local: 'temp_fixed_white/av_frozen_frozen.webp', key: 'perfumes/air_val_frozen.webp' },
  ];

  for (const m of mappings) {
    const body = fs.readFileSync(m.local);
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: m.key,
        Body: body,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=604800',
      })
    );
    console.log(`[R2 OK] ${PUBLICO}/${m.key}`);
  }
})();
