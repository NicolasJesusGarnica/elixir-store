const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
const fs = require('fs');

const envText = fs.readFileSync('src/environments.ts', 'utf8');
const match = envText.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
const fn = new Function(`return ${match[1]};`);
const config = fn();

const app = initializeApp(config);
const db = getFirestore(app);

const catalogo = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));
const inactivos = catalogo.filter(p => p.activo === false);

console.log(`Verificando sincronización de ${inactivos.length} productos dados de baja en Firestore...`);

(async () => {
  let updatedCount = 0;
  for (const p of inactivos) {
    try {
      const ref = doc(db, 'perfumes', p.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        if (data.activo !== false || data.stock_inventario !== 0) {
          await updateDoc(ref, {
            activo: false,
            stock_inventario: 0
          });
          console.log(`[Firestore] Actualizado ${p.id} a activo: false, stock: 0`);
          updatedCount++;
        }
      }
    } catch (e) {
      console.error(`Error verificando ${p.id}:`, e.message);
    }
  }
  console.log(`[Firestore] Sincronización completada. ${updatedCount} documentos actualizados.`);
  process.exit(0);
})();
