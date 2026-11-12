import { Component, inject } from '@angular/core';
import { RESPONSE_INIT } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SeoService } from '../core/seo.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink, SiteHeader, CartDrawer],
  templateUrl: './no-encontrado.html',
})
export class NoEncontrado {
  private seo = inject(SeoService);
  private meta = inject(Meta);

  readonly whatsapp = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hola Elixir, no encontré la fragancia que buscaba en la web.',
  )}`;

  constructor() {
    // Solo existe en el servidor: le dice a Node que devuelva 404 de verdad,
    // no un 200 con la pagina de error (que es lo que Google penaliza).
    const init = inject(RESPONSE_INIT, { optional: true });
    if (init) init.status = 404;

    this.seo.aplicar({
      titulo: `Página no encontrada | ${SITE.nombre}`,
      descripcion: 'La página que buscás no existe o cambió de dirección. Te llevamos al catálogo.',
      imagen: SITE.imagen,
      ruta: '/404',
    });

    // Una pagina de error nunca debe indexarse.
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }
}