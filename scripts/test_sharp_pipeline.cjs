const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = 'temp_raw_images';
const outDir = 'temp_opt_images';
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const inputPath = path.join(dir, f);
    const basename = path.parse(f).name;
    const outputPath = path.join(outDir, `${basename}.webp`);

    const inputBuf = fs.readFileSync(inputPath);
    const meta = await sharp(inputBuf).metadata();

    let pipeline = sharp(inputBuf);
    let trimmed;
    if (meta.hasAlpha) {
      trimmed = await pipeline.trim().toBuffer({ resolveWithObject: true });
    } else {
      trimmed = await pipeline
        .trim({ background: '#ffffff', threshold: 16 })
        .toBuffer({ resolveWithObject: true });
    }

    const bgExtend = meta.hasAlpha ? { r: 0, g: 0, b: 0, alpha: 0 } : '#ffffff';

    const processed = await sharp(trimmed.data)
      .resize({ width: 800, height: 800, fit: 'contain', background: bgExtend })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);

    console.log(`[OK] ${f} (${meta.width}x${meta.height}) -> ${outputPath} (${processed.width}x${processed.height}, ${(processed.size / 1024).toFixed(1)} KB)`);
  }
})();
