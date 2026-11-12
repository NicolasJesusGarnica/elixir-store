const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// read src/environments.ts
const fs = require('fs');
const content = fs.readFileSync('src/environments.ts', 'utf-8');
const match = content.match(/firebaseConfig\s*:\s*({[^}]+})/s);
if (!match) {
  console.log("No firebase config found");
  process.exit(1);
}

const firebaseConfig = eval('(' + match[1] + ')');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const d = await getDoc(doc(db, 'perfumes', '9_pm_elixir'));
  if (d.exists()) {
    console.log("Firestore 9_pm_elixir:", JSON.stringify(d.data(), null, 2));
  } else {
    console.log("Firestore 9_pm_elixir does NOT exist");
  }
  process.exit(0);
}

check();
