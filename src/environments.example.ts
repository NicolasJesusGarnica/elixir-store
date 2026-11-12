/**
 * Plantilla de configuración de entornos.
 * Duplicar este archivo como `src/environments.ts` y completar con las claves reales.
 * NUNCA subir `src/environments.ts` ni `.env` a repositorios públicos.
 */
export const firebaseConfig = {
  apiKey: 'TU_API_KEY_AQUI',
  authDomain: 'tu-proyecto.firebaseapp.com',
  projectId: 'tu-proyecto',
  storageBucket: 'tu-proyecto.firebasestorage.app',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000000000',
};

/** Correos con permiso de escritura (reglas de Firestore/Storage). */
export const ADMIN_EMAILS = ['admin@ejemplo.com'];

/** URL del proxy seguro en Cloudflare Worker para el Sommelier Virtual */
export const SOMMELIER_API_URL = 'https://tu-worker.tu-cuenta.workers.dev/sommelier';

/**
 * Datos del sitio para SEO (titulos, canonical, sitemap, Open Graph).
 */
export const SITE = {
  url: 'https://elixir-store.web.app',
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
