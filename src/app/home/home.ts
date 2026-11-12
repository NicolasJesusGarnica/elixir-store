import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { PerfumesService } from '../core/perfumes.service';
import { SeoService, datosNegocio } from '../core/seo.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SiteHeader, CartDrawer],
  templateUrl: './home.html',
})
export class Home {
  private svc = inject(PerfumesService);
  private seo = inject(SeoService);

  /** Cifras que salen del catalogo real, no de una promesa. */
  readonly totalFragancias = computed(() => this.svc.productos().length);
  readonly totalMarcas = computed(() => this.svc.marcas().length);

  constructor() {
    effect(() => {
      const total = this.totalFragancias();
      this.seo.aplicar({
        titulo: `${SITE.nombre} — ${SITE.lema} · Perfumes y decants en Bolivia`,
        descripcion: `${total} fragancias originales en decants de 6, 10 y 20 ml. Elegí por olor, probá en tu piel y comprá el frasco completo si te encantó. Envíos a todo el país y pago contra entrega.`,
        imagen: SITE.imagen,
        ruta: '/',
        jsonLd: datosNegocio(total),
      });
    });
  }
}