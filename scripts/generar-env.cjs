const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envFile = path.join(__dirname, '../src/environments.ts');

if (!fs.existsSync(envFile)) {
  console.log('[Elixir] Generando src/environments.ts desde variables de entorno...');
  const apiKey = process.env.FIREBASE_API_KEY || 'TU_API_KEY_AQUI';
  const authDomain = process.env.FIREBASE_AUTH_DOMAIN || 'elixir-store.firebaseapp.com';
  const projectId = process.env.FIREBASE_PROJECT_ID || 'elixir-store';
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'elixir-store.firebasestorage.app';
  const messagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID || '1013128152896';
  const appId = process.env.FIREBASE_APP_ID || '1:1013128152896:web:41fd3adc7a453ecc7f1ca5';
  const adminEmails = (process.env.ADMIN_EMAILS || 'elixir_perfumeria@nixus.es,nixus_admin@nixus.es')
    .split(',')
    .map((e) => `'${e.trim()}'`)
    .join(', ');

  const content = `export const firebaseConfig = {
  apiKey: '${apiKey}',
  authDomain: '${authDomain}',
  projectId: '${projectId}',
  storageBucket: '${storageBucket}',
  messagingSenderId: '${messagingSenderId}',
  appId: '${appId}',
};

export const ADMIN_EMAILS = [${adminEmails}];

export const SOMMELIER_API_URL = process.env.SOMMELIER_API_URL || 'https://delicate-snow-6226.njgarnicaz.workers.dev/sommelier';

export const SITE = {
  url: process.env.SITE_URL || 'https://elixir-store.web.app',
  nombre: 'Elixir Perfumería',
  lema: 'El Lujo Tiene Aroma',
  descripcion:
    'Perfumería de autor en Bolivia. Decants de 6, 10 y 20 ml del perfume original y frasco completo. Envíos a todo el país y pago contra entrega.',
  imagen: 'https://elixir-store.web.app/assets/elixir-og-banner.jpg',
  thumbnail: 'https://elixir-store.web.app/assets/elixir-google-thumbnail.jpg',
  whatsapp: '59164380547',
  instagram: 'https://www.instagram.com/elixir_bolivia/',
  tiktok: 'https://www.tiktok.com/@elixir_bolivia',
  facebook: 'https://www.facebook.com/vanityenda',
  maps: 'https://maps.app.goo.gl/8udP4YAx2UHDxBLg7',

  direccion: 'Av. Murillo y C. Montoya, Villa Imperial de Potosí',
  horario: '9:00 a 21:00',
  dias: 'Todos los días',
  envio: 'Envíos a toda Bolivia. También podés retirar en el local de Potosí.',
};
`;

  fs.writeFileSync(envFile, content, 'utf-8');
  console.log('[Elixir] src/environments.ts generado exitosamente.');
} else {
  console.log('[Elixir] src/environments.ts ya existe.');
}
