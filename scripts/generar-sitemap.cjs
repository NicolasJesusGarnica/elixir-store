const fs = require('fs');
const path = require('path');

function obtenerSiteUrl() {
  try {
    const envPath = path.join(__dirname, '..', 'src', 'environments.ts');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(/url:\s*'([^']+)'/);
      if (match && match[1]) {
        return match[1].replace(/\/+$/, '');
      }
    }
  } catch {
    /* fallback */
  }
  return 'https://elixir-store.web.app';
}

function xmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generarSitemap() {
  const baseUrl = obtenerSiteUrl();
  const catalogoPath = path.join(__dirname, '..', 'src', 'assets', 'perfumes.json');
  
  if (!fs.existsSync(catalogoPath)) {
    console.error('[Sitemap] Error: No se encontró src/assets/perfumes.json');
    process.exit(1);
  }

  const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf8'));
  const productosActivos = catalogo.filter((p) => p.activo !== false);

  const hoy = new Date().toISOString().split('T')[0];

  const rutas = [
    { ruta: '', prioridad: '1.0', frecuencia: 'daily' },
    { ruta: 'perfumes', prioridad: '0.9', frecuencia: 'daily' },
    { ruta: 'decants', prioridad: '0.9', frecuencia: 'daily' },
    { ruta: 'novedades', prioridad: '0.8', frecuencia: 'weekly' },
  ];

  for (const p of productosActivos) {
    rutas.push({
      ruta: `perfumes/${p.id}`,
      prioridad: '0.7',
      frecuencia: 'weekly',
    });
  }

  rutas.push(
    { ruta: 'terminos', prioridad: '0.3', frecuencia: 'monthly' },
    { ruta: 'privacidad', prioridad: '0.3', frecuencia: 'monthly' },
    { ruta: 'reembolsos', prioridad: '0.3', frecuencia: 'monthly' },
    { ruta: 'cookies', prioridad: '0.3', frecuencia: 'monthly' },
  );

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const r of rutas) {
    const loc = r.ruta ? `${baseUrl}/${r.ruta}` : `${baseUrl}/`;
    xml += '  <url>\n';
    xml += `    <loc>${xmlEscape(loc)}</loc>\n`;
    xml += `    <lastmod>${hoy}</lastmod>\n`;
    xml += `    <changefreq>${r.frecuencia}</changefreq>\n`;
    xml += `    <priority>${r.prioridad}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  // Guardar en public/sitemap.xml (usado en el build de Angular)
  const publicDest = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(publicDest, xml, 'utf8');
  console.log(`[Sitemap] ✅ Generado public/sitemap.xml con ${rutas.length} URLs indexables.`);

  // Si ya existe la carpeta dist/elixir-store/browser, sincronizarlo directamente
  const distDest = path.join(__dirname, '..', 'dist', 'elixir-store', 'browser', 'sitemap.xml');
  if (fs.existsSync(path.dirname(distDest))) {
    fs.writeFileSync(distDest, xml, 'utf8');
    console.log(`[Sitemap] ✅ Sincronizado dist/elixir-store/browser/sitemap.xml.`);
  }
}

generarSitemap();
