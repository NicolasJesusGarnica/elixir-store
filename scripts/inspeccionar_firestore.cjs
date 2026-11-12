const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Leer config de environments.ts
const fs = require('fs');
const envText = fs.readFileSync('src/environments.ts', 'utf8');
const match = envText.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);

if (!match) {
  console.log("No se pudo leer firebaseConfig");
  process.exit(1);
}

const configStr = match[1]
  .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
  .replace(/'/g, '"');

let config;
try {
  config = JSON.parse(configStr);
} catch (e) {
  // evaluar de forma segura
  const fn = new Function(`return ${match[1]};`);
  config = fn();
}

const app = initializeApp(config);
const db = getFirestore(app);

async function main() {
  const snap = await getDocs(collection(db, 'perfumes'));
  console.log('Total documentos en Firestore perfumes:', snap.size);
  const teriaq = snap.docs.find(d => d.id.includes('teriaq'));
  if (teriaq) {
    console.log('Teriaq en Firestore:', teriaq.id, JSON.stringify(teriaq.data(), null, 2));
  } else {
    console.log('No hay teriaq en Firestore');
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
