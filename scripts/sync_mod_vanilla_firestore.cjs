const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
const fs = require('fs');

const envText = fs.readFileSync('src/environments.ts', 'utf8');
const match = envText.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
const fn = new Function(`return ${match[1]};`);
const config = fn();

const app = initializeApp(config);
const db = getFirestore(app);

(async () => {
  const ref = doc(db, 'perfumes', 'ariana_grande_mod_vainilla');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    console.log('Current in Firestore:', snap.data().imagenes);
    await updateDoc(ref, {
      imagenes: ['https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/ariana_grande_mod_vanilla.webp']
    });
    console.log('Updated ariana_grande_mod_vainilla in Firestore!');
  } else {
    console.log('Document not found in Firestore.');
  }
})();
