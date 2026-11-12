const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');

const envText = fs.readFileSync('src/environments.ts', 'utf8');
const match = envText.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
const fn = new Function(`return ${match[1]};`);
const config = fn();

const app = initializeApp(config);
const db = getFirestore(app);

(async () => {
  const snap = await getDocs(collection(db, 'perfumes'));
  console.log('Total docs in Firestore:', snap.size);
  snap.forEach(d => {
    if (d.id.includes('mod') || d.id.includes('ariana')) {
      console.log('Found doc:', d.id, d.data().imagenes);
    }
  });
})();
