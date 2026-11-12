const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, writeBatch, getDocs, deleteDoc } = require('firebase/firestore');
const fs = require('fs');

const envText = fs.readFileSync('src/environments.ts', 'utf8');
const match = envText.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
const fn = new Function(`return ${match[1]};`);
const config = fn();

const app = initializeApp(config);
const db = getFirestore(app);

const catalogo = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));

async function main() {
  console.log(`Iniciando sincronización a Firestore de ${catalogo.length} productos oficiales...`);

  // 1. Obtener documentos existentes en Firestore
  const snap = await getDocs(collection(db, 'perfumes'));
  console.log(`Documentos actuales en Firestore: ${snap.size}`);

  const idsLocales = new Set(catalogo.map(p => p.id));
  const docsAEliminar = snap.docs.filter(d => !idsLocales.has(d.id));
  
  if (docsAEliminar.length > 0) {
    console.log(`Eliminando ${docsAEliminar.length} documentos obsoletos en Firestore...`);
    for (const d of docsAEliminar) {
      await deleteDoc(d.ref);
    }
  }

  // 2. Subir en lotes de 300 (el límite de Firestore es 500 por batch)
  const BATCH_SIZE = 300;
  for (let i = 0; i < catalogo.length; i += BATCH_SIZE) {
    const chunk = catalogo.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    for (const p of chunk) {
      const ref = doc(db, 'perfumes', p.id);
      batch.set(ref, p);
    }

    await batch.commit();
    console.log(`Guardado lote ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} productos).`);
  }

  console.log('¡Sincronización a Firestore completada exitosamente!');

  // 3. Verificación de seguridad en Firestore para Teriaq Intense
  const snapFinal = await getDocs(collection(db, 'perfumes'));
  console.log(`Total documentos verificados en Firestore: ${snapFinal.size}`);

  const teriaqDoc = snapFinal.docs.find(d => d.id === 'teriaq_intense_lattafa');
  if (teriaqDoc) {
    const data = teriaqDoc.data();
    console.log('\n--- VERIFICACIÓN EN FIRESTORE EN VIVO: TERIAQ INTENSE ---');
    console.log('ID:', teriaqDoc.id);
    console.log('Nombre:', data.nombre);
    console.log('Volumenes (Decants):', data.volumenes);
    console.log('Completo (Botella):', data.completo);
  } else {
    console.warn('ADVERTENCIA: No se encontró teriaq_intense_lattafa en Firestore.');
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Error sincronizando con Firestore:', err);
  process.exit(1);
});
