import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import fs from 'node:fs';
import CATALOGO from './assets/perfumes.json';
import { SITE } from './environments';

const browserDistFolder = join(import.meta.dirname, '../browser');

/**
 * Angular 22 bloquea el SSR si el header Host no esta permitido (proteccion
 * contra SSRF). Sin esta lista, cualquier visita devuelve 400 y el sitio
 * entero se ve caido. Anadir aca los dominios que usen el sitio.
 */
const HOSTS_PERMITIDOS = [
  'localhost',
  '127.0.0.1',
  'elixir-store.web.app',
  'elixir-store.firebaseapp.com',
];

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: HOSTS_PERMITIDOS,
});

/**
 * SEO: robots.txt y sitemap.xml generados desde el catalogo real, asi que se
 * actualizan solos cada vez que agregas o sacas una fragancia.
 */
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      '',
      `Sitemap: ${SITE.url}/sitemap.xml`,
      '',
    ].join('\n'),
  );
});

app.get('/sitemap.xml', (_req, res) => {
  const hoy = new Date().toISOString().slice(0, 10);
  const url = (path: string, prioridad: string, frecuencia: string) =>
    `  <url><loc>${SITE.url}${path}</loc><lastmod>${hoy}</lastmod>` +
    `<changefreq>${frecuencia}</changefreq><priority>${prioridad}</priority></url>`;

  const productos = (CATALOGO as { id: string; activo: boolean }[])
    .filter((p) => p.activo !== false)
    .map((p) => url(`/perfumes/${p.id}`, '0.8', 'weekly'))
    .join('\n');

  res
    .type('application/xml')
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${url('/', '1.0', 'weekly')}\n` +
        `${url('/perfumes', '0.9', 'daily')}\n` +
        `${url('/novedades', '0.9', 'daily')}\n` +
        `${url('/terminos', '0.5', 'monthly')}\n` +
        `${url('/privacidad', '0.5', 'monthly')}\n` +
        `${url('/reembolsos', '0.5', 'monthly')}\n` +
        `${url('/cookies', '0.5', 'monthly')}\n` +
        `${productos}\n` +
        `</urlset>`,
    );
});

/**
 * Endpoint de sincronización en desarrollo local:
 * Permite que los cambios guardados desde el admin actualicen inmediatamente
 * src/assets/perfumes.json en disco para que el SSR no sirva precios antiguos al reiniciar.
 */
app.post('/api/sync-perfume-local', express.json(), (req, res) => {
  try {
    const { id, cambios } = req.body as { id: string; cambios: Record<string, unknown> };
    if (id && cambios) {
      const jsonPath = join(process.cwd(), 'src/assets/perfumes.json');
      if (fs.existsSync(jsonPath)) {
        const catalog = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as Record<string, unknown>[];
        const idx = catalog.findIndex((x) => x['id'] === id);
        if (idx !== -1) {
          catalog[idx] = { ...catalog[idx], ...cambios };
          fs.writeFileSync(jsonPath, JSON.stringify(catalog, null, 2), 'utf8');
        }
      }
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

/**
 * Serve static files from /browser.
 * Los assets pesados se cachean un año (tienen hash en el nombre); el HTML
 * nunca, asi un deploy nuevo no queda cacheado en los navegadores.
 */
app.use(
  express.static(browserDistFolder, {
    setHeaders(res, filePath) {
      const esHtml = filePath.endsWith('.html');
      const esIndex = filePath.endsWith(`${'index'}.html`);
      res.setHeader('Cache-Control', esHtml || esIndex ? 'no-cache' : 'public, max-age=31536000, immutable');
    },
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
