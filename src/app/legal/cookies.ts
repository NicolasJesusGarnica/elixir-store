import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SiteFooter } from '../shared/site-footer';
import { SeoService } from '../core/seo.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-cookies',
  imports: [RouterLink, SiteHeader, CartDrawer, SiteFooter],
  templateUrl: './cookies.html',
})
export class Cookies {
  private seo = inject(SeoService);
  readonly site = SITE;
  readonly fechaActualizacion = 'Octubre 2026';

  constructor() {
    this.seo.aplicar({
      titulo: `Política de Cookies y Almacenamiento Local | ${SITE.nombre}`,
      descripcion:
        'Conoce cómo gestionamos las cookies y el almacenamiento técnico en Elixir Perfumería. Cero rastreadores publicitarios de terceros, solo almacenamiento necesario para tu carrito.',
      imagen: SITE.imagen,
      ruta: '/cookies',
    });
  }
}
