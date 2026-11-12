import { RenderMode, ServerRoute } from '@angular/ssr';
import CATALOGO from '../assets/perfumes.json';

type Producto = { id: string; activo?: boolean; nombre?: string };

/**
 * Los ids salen del MISMO catalogo que usa la tienda (src/assets/perfumes.json).
 * Antes se leia una copia en public/assets/data/perfumes.json que se desincronizo
 * del panel y dejo de prerrenderizar productos.
 */
function idsPerfumes(): string[] {
  return (CATALOGO as Producto[])
    .filter((p) => p.activo !== false)
    .map((p) => p.id);
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'perfumes',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'decants',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'novedades',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'terminos',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'privacidad',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'reembolsos',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'cookies',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'perfumes/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return idsPerfumes().map((id) => ({ id }));
    },
  },
  {
    // Todo lo demas se renderiza en vivo: es la pagina 404 y tiene que
    // poder devolver el codigo HTTP correcto en cada URL desconocida.
    path: '**',
    renderMode: RenderMode.Server,
  },
];