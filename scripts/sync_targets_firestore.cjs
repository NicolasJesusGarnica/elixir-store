const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
const fs = require('fs');

const envText = fs.readFileSync('src/environments.ts', 'utf8');
const match = envText.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
const fn = new Function(`return ${match[1]};`);
const config = fn();

const app = initializeApp(config);
const db = getFirestore(app);

const targets = [
  { id: 'afnan_9pm_negro_100', url: 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/afnan_9pm_negro_100.webp' },
  { id: 'arabiyat_prestige_marwa', url: 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/arabiyat_prestige_marwa.webp' },
  { id: 'ariana_grande_mod_vainilla', url: 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/ariana_grande_mod_vanilla.webp' },
  { id: 'prada_paradoxe_intense', url: 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/prada_paradoxe_intense.webp' }
];

(async () => {
  for (const t of targets) {
    const ref = doc(db, 'perfumes', t.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      console.log(`[Firestore] ${t.id} exists, updating image...`);
      await updateDoc(ref, { imagenes: [t.url] });
      console.log(`[Firestore] ${t.id} updated!`);
    } else {
      console.log(`[Firestore] ${t.id} no está en Firestore (usa CATALOGO JSON directo).`);
    }
  }
  console.log('Verificación Firestore completada.');
  process.exit(0);
})();
