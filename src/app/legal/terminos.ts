import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SiteFooter } from '../shared/site-footer';
import { SeoService } from '../core/seo.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-terminos',
  imports: [RouterLink, SiteHeader, CartDrawer, SiteFooter],
  templateUrl: './terminos.html',
})
export class Terminos {
  private seo = inject(SeoService);
  readonly site = SITE;
  readonly fechaActualizacion = 'Octubre 2026';

  constructor() {
    this.seo.aplicar({
      titulo: `Términos y Condiciones de Uso y Venta | ${SITE.nombre}`,
      descripcion:
        'Términos y condiciones legales de Elixir Perfumería en Bolivia. Información sobre decants originales, descargo de marcas registradas, envíos y derechos de compra.',
      imagen: SITE.imagen,
      ruta: '/terminos',
    });
  }
}
