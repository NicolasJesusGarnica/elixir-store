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
  console.log('Total documentos en Firestore:', snap.size);
  const ids = snap.docs.map(d => d.id);
  console.log('IDs en Firestore:', ids.slice(0, 30));
  
  // Revisar cuantos tienen decants en Firestore
  let conDecants = 0;
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.volumenes && d.volumenes.length > 0) {
      conDecants++;
    }
  }
  console.log('Documentos con decants en Firestore:', conDecants);
  process.exit(0);
}

main().catch(console.error);
