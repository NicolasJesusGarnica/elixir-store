import { DOCUMENT, Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../../environments';

export interface SeoData {
  titulo: string;
  descripcion: string;
  imagen?: string;
  ruta: string;
  tipo?: 'website' | 'product';
  jsonLd?: unknown;
}

/**
 * SEO por ruta: titulo, descripcion, canonical, Open Graph, Twitter y datos
 * estructurados. Se ejecuta tambien en el servidor, asi que las 78 paginas
 * prerenderizadas ya salen con su meta correcta en el HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private renderer = inject(RendererFactory2).createRenderer(null, null);
  private doc = inject(DOCUMENT);
  private jsonLdElement: HTMLScriptElement | null = null;

  aplicar(datos: SeoData): void {
    const url = `${SITE.url}${datos.ruta}`;
    const imagen = datos.imagen || SITE.imagen;

    this.title.setTitle(datos.titulo);

    this.meta.updateTag({ name: 'description', content: datos.descripcion });
    this.meta.updateTag({ name: 'keywords', content: 'perfumes, decants, perfumería, Bolivia, Potosí, perfumes originales, perfumería de autor, Elixir Perfumería' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE.nombre });
    this.meta.updateTag({ property: 'og:type', content: datos.tipo || 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_BO' });
    this.meta.updateTag({ property: 'og:title', content: datos.titulo });
    this.meta.updateTag({ property: 'og:description', content: datos.descripcion });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: imagen });
    this.meta.updateTag({ property: 'og:image:alt', content: datos.titulo });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: datos.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: datos.descripcion });
    this.meta.updateTag({ name: 'twitter:image', content: imagen });

    this.canonical(url);
    this.estructurado(datos.jsonLd);
  }

  private canonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.renderer.createElement('link') as HTMLLinkElement;
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.doc.head, link);
    }
    this.renderer.setAttribute(link, 'href', url);
  }

  private estructurado(datos: unknown): void {
    if (!datos) {
      if (this.jsonLdElement) {
        this.renderer.removeChild(this.doc.head, this.jsonLdElement);
        this.jsonLdElement = null;
      }
      return;
    }

    if (!this.jsonLdElement) {
      this.jsonLdElement = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.setAttribute(this.jsonLdElement, 'type', 'application/ld+json');
      this.renderer.appendChild(this.doc.head, this.jsonLdElement);
    }
    this.renderer.setProperty(this.jsonLdElement, 'textContent', JSON.stringify(datos));
  }
}

/** Datos estructurados de un producto, para los resultados enriquecidos de Google. */
export function datosProducto(p: {
  id: string;
  nombre: string;
  descripcion?: string;
  imagenes: string[];
  volumenes: { ml: number; precioBs: number }[];
  completo?: { ml?: number | null; precioBs?: number | null };
}): unknown {
  const precio = p.volumenes.length
    ? Math.min(...p.volumenes.map((v) => v.precioBs))
    : (p.completo?.precioBs ?? 0);

  const maxPrecio = p.volumenes.length
    ? Math.max(...p.volumenes.map((v) => v.precioBs))
    : precio;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    description: p.descripcion || `${p.nombre} frasco sellado original de ${p.completo?.ml || 100} ml.`,
    image: p.imagenes,
    brand: { '@type': 'Brand', name: SITE.nombre },
    category: 'Perfumería',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BOB',
      lowPrice: precio,
      highPrice: maxPrecio,
      offerCount: p.volumenes.length || 1,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: SITE.nombre },
    },
  };
}

/** Datos estructurados del negocio, una sola vez en el home para Google Search Console y Rich Snippets. */
export function datosNegocio(total: number): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${SITE.url}/#store`,
    name: SITE.nombre,
    alternateName: ['Elixir', 'Elixir Bolivia', 'Elixir Perfumería Bolivia', 'Elixir Potosí'],
    slogan: SITE.lema,
    description: SITE.descripcion,
    url: SITE.url,
    image: `${SITE.url}/assets/elixir-google-thumbnail.jpg`,
    logo: `${SITE.url}/assets/elixir-google-thumbnail.jpg`,
    telephone: `+${SITE.whatsapp}`,
    priceRange: '$$',
    currenciesAccepted: 'BOB',
    paymentAccepted: 'Cash, QR Simple, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.direccion,
      addressLocality: 'Potosí',
      addressRegion: 'Potosí',
      addressCountry: 'BO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -19.5836,
      longitude: -65.7531,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    sameAs: [
      SITE.instagram,
      SITE.tiktok,
      SITE.facebook,
      SITE.maps,
    ],
    numberOfItems: total,
  };
}