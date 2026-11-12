import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SiteFooter } from '../shared/site-footer';
import { SeoService } from '../core/seo.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-reembolsos',
  imports: [RouterLink, SiteHeader, CartDrawer, SiteFooter],
  templateUrl: './reembolsos.html',
})
export class Reembolsos {
  private seo = inject(SeoService);
  readonly site = SITE;
  readonly fechaActualizacion = 'Octubre 2026';

  constructor() {
    this.seo.aplicar({
      titulo: `Política de Reembolsos, Devoluciones y Garantías | ${SITE.nombre}`,
      descripcion:
        'Conoce nuestra garantía de satisfacción y reposición al 100% por rotura o fuga en envíos. Normas de higiene en perfumería y procedimiento de reclamo.',
      imagen: SITE.imagen,
      ruta: '/reembolsos',
    });
  }
}
