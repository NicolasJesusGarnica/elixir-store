const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = 'temp_final_12';
fs.mkdirSync(outDir, { recursive: true });

const items = [
  {
    id: 'afnan_9pm_negro_100',
    src: 'temp_download_12/afnan_9pm_negro_100.jpg',
    preCrop: async (buf) => {
      const meta = await sharp(buf).metadata();
      return sharp(buf)
        .extract({ left: 0, top: 0, width: meta.width, height: Math.floor(meta.height * 0.79) })
        .toBuffer();
    }
  },
  {
    id: 'afnan_supremacy_in_oud',
    src: 'temp_download_12/afnan_supremacy_in_oud_clean.jpg'
  },
  {
    id: 'arabiyat_prestige_marwa',
    src: 'temp_download_12/arabiyat_prestige_marwa.jpg'
  },
  {
    id: 'adidas_vibes_happy_feels',
    src: 'temp_download_12/adidas_vibes_happy_feels.jpg',
    preCrop: async (buf) => {
      const meta = await sharp(buf).metadata();
      return sharp(buf)
        .extract({ left: 0, top: 0, width: meta.width, height: 806 })
        .toBuffer();
    }
  },
  {
    id: 'ajmal_vi',
    src: 'temp_download_12/ajmal_vi.webp'
  },
  {
    id: 'carolina_herrera_ch',
    src: 'temp_download_12/carolina_herrera_ch.jpg'
  },
  {
    id: 'burberry_goddess',
    src: 'temp_download_12/burberry_goddess.jpg',
    preCrop: async (buf) => {
      const meta = await sharp(buf).metadata();
      return sharp(buf)
        .extract({ left: 0, top: 0, width: meta.width, height: 820 })
        .toBuffer();
    }
  },
  {
    id: 'carolina_herrera_bad_boy_le',
    src: 'temp_download_12/carolina_herrera_bad_boy_le.png'
  },
  {
    id: 'davidoff_cool_water',
    src: 'temp_download_12/davidoff_cool_water.jpg'
  },
  {
    id: 'nene_beauty_bruma_body_splash',
    src: 'temp_download_12/nene_beauty_bruma_body_splash.webp'
  },
  {
    id: 'pepe_jeans_london_calling_for_her',
    src: 'temp_download_12/pepe_jeans_london_calling_for_her.jpg',
    preCrop: async (buf) => {
      const meta = await sharp(buf).metadata();
      return sharp(buf)
        .extract({ left: 0, top: 0, width: meta.width, height: 794 })
        .toBuffer();
    }
  },
  {
    id: 'shrek_for_boys',
    src: 'temp_download_12/shrek_for_boys.jpg'
  }
];

(async () => {
  for (const item of items) {
    let buf = fs.readFileSync(item.src);
    if (item.preCrop) {
      buf = await item.preCrop(buf);
    }

    // Trim outer white edges
    let trimmedBuf = await sharp(buf)
      .trim({ background: '#ffffff', threshold: 16 })
      .toBuffer();

    // Fit inside 800x800 square with comfortable 40px internal margin (720x720 max inner)
    const outPath = path.join(outDir, `${item.id}.webp`);
    await sharp(trimmedBuf)
      .resize({
        width: 720,
        height: 720,
        fit: 'contain',
        background: '#ffffff'
      })
      .extend({
        top: 40,
        bottom: 40,
        left: 40,
        right: 40,
        background: '#ffffff'
      })
      .webp({ quality: 90, effort: 6 })
      .toFile(outPath);

    console.log(`[PROCESSED] -> ${outPath}`);
  }
  console.log('✅ Todos los 12 perfumes procesados con máxima precisión a 800x800 WebP sobre blanco puro #ffffff.');
})();
