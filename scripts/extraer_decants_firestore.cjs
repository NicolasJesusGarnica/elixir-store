const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');

const envText = fs.readFileSync('src/environments.ts', 'utf8');
const match = envText.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
const fn = new Function(`return ${match[1]};`);
const config = fn();

const app = initializeApp(config);
const db = getFirestore(app);

async function main() {
  const snap = await getDocs(collection(db, 'perfumes'));
  console.log('Documentos en Firestore:', snap.size);
  
  const mapaDecants = {};
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.volumenes && d.volumenes.length > 0) {
      mapaDecants[doc.id] = d.volumenes;
    }
  }
  
  console.log('Perfumes con decants encontrados en Firestore:', Object.keys(mapaDecants).length);
  fs.writeFileSync('scripts/decants_oficiales.json', JSON.stringify(mapaDecants, null, 2));
  console.log('Guardado en scripts/decants_oficiales.json');
  process.exit(0);
}

main().catch(console.error);
