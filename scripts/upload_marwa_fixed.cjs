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
  const filePath = path.join(__dirname, 'arabiyat_prestige_marwa_perfect.webp');
  const body = fs.readFileSync(filePath);
  const key = 'perfumes/arabiyat_prestige_marwa.webp';

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=604800',
    })
  );
  console.log(`[R2 OK] Subido con éxito: ${PUBLICO}/${key}`);
})();
