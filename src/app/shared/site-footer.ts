import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PerfumesService } from '../core/perfumes.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  private svc = inject(PerfumesService);

  readonly site = SITE;

  /** Cifras reales del catalogo. */
  readonly fragancias = computed(() => this.svc.productos().length);
  readonly marcas = computed(() => this.svc.marcas().length);

  readonly anio = new Date().getFullYear();

  readonly whatsappEnlace = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hola Elixir, quiero hacer una consulta sobre los decants.',
  )}`;

  /** Familias olfativas: entradas reales al catalogo. */
  readonly familias = [
    { nombre: 'Dulces', etiqueta: 'Dulce' },
    { nombre: 'Frescos', etiqueta: 'Fresco' },
    { nombre: 'Intensos', etiqueta: 'Intenso' },
  ];
}