import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SiteFooter } from '../shared/site-footer';
import { SeoService } from '../core/seo.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-privacidad',
  imports: [RouterLink, SiteHeader, CartDrawer, SiteFooter],
  templateUrl: './privacidad.html',
})
export class Privacidad {
  private seo = inject(SeoService);
  readonly site = SITE;
  readonly fechaActualizacion = 'Octubre 2026';

  constructor() {
    this.seo.aplicar({
      titulo: `Política de Privacidad y Tratamiento de Datos | ${SITE.nombre}`,
      descripcion:
        'Conoce cómo protegemos tus datos en Elixir Perfumería. Principio de minimización: no requerimos registro de usuarios, solo datos esenciales para el despacho.',
      imagen: SITE.imagen,
      ruta: '/privacidad',
    });
  }
}
