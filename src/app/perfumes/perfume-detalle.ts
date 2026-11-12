import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  RESPONSE_INIT,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SiteFooter } from '../shared/site-footer';
import { PerfumesService } from '../core/perfumes.service';
import { CartService } from '../core/cart.service';
import {
  Perfume,
  Volumen,
  precioMin,
  porMl,
  mejorVolumen,
  nombreCorto,
  obtenerColorAcorde,
} from '../core/perfume.model';
import { SeoService, datosProducto } from '../core/seo.service';
import { SITE } from '../../environments';

/**
 * Nombre para el titulo de Google. Si el nombre ya arranca con la marca
 * ("ARIANA GRANDE CLOUD") no la repetimos: "(Ariana Grande)" seria ruido.
 */
function nombreSEO(p: Perfume): string {
  const n = p.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const m = p.marca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return n.startsWith(m) ? p.nombre : `${p.nombre} (${p.marca})`;
}

/**
 * Generador pseudo-aleatorio de 32 bits (Mulberry32).
 * Garantiza determinismo entre el prerenderizado SSR y la hidratación en cliente
 * (evitando errores NG0500 de hidratación), produciendo una distribución aleatoria
 * de alta entropía verdaderamente única para cada fragancia.
 */
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash FNV-1a de 32 bits para convertir el ID del perfume en una semilla numérica única */
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

@Component({
  selector: 'app-perfume-detalle',
  imports: [RouterLink, SiteHeader, CartDrawer, SiteFooter, NgTemplateOutlet],
  templateUrl: './perfume-detalle.html',
})
export class PerfumeDetalle implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(PerfumesService);
  readonly cart = inject(CartService);
  private seo = inject(SeoService);
  private meta = inject(Meta);
  readonly precioMin = precioMin;
  readonly porMl = porMl;
  readonly nombreCorto = nombreCorto;
  readonly obtenerColorAcorde = obtenerColorAcorde;

  readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });
  readonly producto = computed(() => this.svc.porId(this.id()));

  readonly vols = signal<Volumen[]>([]);
  readonly sel = signal<number | null>(null);
  readonly modoCompra = signal<'decant' | 'completo'>('decant');
  readonly cantidad = signal(1);
  readonly foto = signal(0);

  readonly niveles = [
    { k: 'salida' as const, t: 'Notas de salida', duracion: 'Primeros 15 – 30 min' },
    { k: 'corazon' as const, t: 'Notas de corazón', duracion: 'Evolución · 2 a 4 hrs' },
    { k: 'fondo' as const, t: 'Notas de fondo', duracion: 'Fijación · 6 a 12+ hrs' },
  ];

  readonly agregado = signal(false);

  // ---- Zoom interactivo de imagen & Lightbox ----
  readonly zoomActivo = signal(false);
  readonly zoomX = signal(50);
  readonly zoomY = signal(50);
  readonly puedeZoom = signal(true);
  readonly lightboxAbierto = signal(false);
  readonly lightboxZoom = signal(false);

  /** Solo existe en el servidor: permite devolver un 404 real si el id no existe. */
  private readonly respuesta = inject(RESPONSE_INIT, { optional: true });

  /** Barra fija de compra: se muestra cuando el boton real ya salio de pantalla. */
  readonly barraVisible = signal(false);
  private readonly cta = viewChild<ElementRef<HTMLElement>>('cta');

  @HostListener('window:scroll')
  alDesplazar() {
    const el = this.cta()?.nativeElement;
    if (!el) return;
    // Aparece recien cuando el boton quedo por arriba de la pantalla.
    this.barraVisible.set(el.getBoundingClientRect().bottom < 0);
  }

  @HostListener('window:keydown', ['$event'])
  alTecla(e: KeyboardEvent) {
    if (!this.lightboxAbierto()) return;
    if (e.key === 'Escape') {
      this.cerrarLightbox();
    } else if (e.key === 'ArrowLeft') {
      const p = this.producto();
      if (p && p.imagenes.length > 1) this.anteriorFoto(p.imagenes.length);
    } else if (e.key === 'ArrowRight') {
      const p = this.producto();
      if (p && p.imagenes.length > 1) this.siguienteFoto(p.imagenes.length);
    }
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.puedeZoom.set(true);
    }

    effect(() => {
      const p = this.producto();
      const v = p?.volumenes ?? [];
      this.vols.set(v);
      // El perfume completo es el principal en aparecer por defecto
      if (p?.completo?.precioBs && p.completo.precioBs > 0) {
        this.modoCompra.set('completo');
        this.sel.set(null);
      } else if (v.length > 0) {
        this.modoCompra.set('decant');
        this.sel.set(mejorVolumen(v)?.ml ?? v[0].ml);
      } else {
        this.modoCompra.set('completo');
        this.sel.set(null);
      }
      this.cantidad.set(1);
      this.foto.set(0);
      this.carruselPagina.set(0);
      this.zoomActivo.set(false);
    });

    // SEO: cada fragancia sale con su propio titulo, descripcion y datos de precio.
    effect(() => {
      const p = this.producto();

      // Si el id no existe, es un 404 de verdad (no un 200 con "no encontrado").
      if (this.respuesta) this.respuesta.status = p ? 200 : 404;

      if (!p) {
        this.seo.aplicar({
          titulo: `No encontramos esa fragancia | ${SITE.nombre}`,
          descripcion: SITE.descripcion,
          imagen: SITE.imagen,
          ruta: '/perfumes',
        });
        // Una pagina de error nunca debe indexarse.
        this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
        return;
      }
      this.meta.removeTag('name="robots"');

      const desde = precioMin(p);
      const formato = p.volumenes.length
        ? `Decant desde Bs ${desde}`
        : `Botella Completa ${p.completo?.ml || 100} ml · Bs ${p.completo?.precioBs || desde}`;
      const medida = p.volumenes.length
        ? 'Decants en atomizadores de vidrio.'
        : `Frasco sellado original de ${p.completo?.ml || 100} ml.`;

      this.seo.aplicar({
        titulo: `${nombreSEO(p)} — ${formato} | ${SITE.nombre}`,
        descripcion: `${p.descripcion ? `${p.descripcion.slice(0, 110)}... ` : ''}${medida} Envíos a toda Bolivia y pago contra entrega.`,
        imagen: p.imagenes[0] || SITE.imagen,
        ruta: `/perfumes/${p.id}`,
        tipo: 'product',
        jsonLd: datosProducto(p),
      });
    });
  }

  onMouseMove(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    this.zoomX.set(x);
    this.zoomY.set(y);
  }

  onMouseEnter() {
    this.zoomActivo.set(true);
  }

  onMouseLeave() {
    this.zoomActivo.set(false);
    this.zoomX.set(50);
    this.zoomY.set(50);
  }

  abrirLightbox() {
    this.lightboxAbierto.set(true);
    this.lightboxZoom.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarLightbox() {
    this.lightboxAbierto.set(false);
    this.lightboxZoom.set(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  toggleLightboxZoom() {
    this.lightboxZoom.update((z) => !z);
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  anteriorFoto(total: number) {
    this.foto.update((f) => (f > 0 ? f - 1 : total - 1));
  }

  siguienteFoto(total: number) {
    this.foto.update((f) => (f < total - 1 ? f + 1 : 0));
  }

  // ---- Carrusel de 12 perfumes aleatorios (3 páginas de 4) ----
  readonly carruselPagina = signal(0);

  readonly recomendados = computed(() => {
    const p = this.producto();
    if (!p) return [];
    const otros = this.svc.productos().filter((o) => o.id !== p.id);
    const seed = hashString(p.id);
    const rng = mulberry32(seed);

    // Priorizar fragancias afines (mismo género o Unisex) para alta relevancia editorial
    const afines: Perfume[] = [];
    const resto: Perfume[] = [];

    for (const o of otros) {
      const esAfin =
        p.genero === 'Unisex' ||
        o.genero === 'Unisex' ||
        o.genero === p.genero;
      if (esAfin) afines.push(o);
      else resto.push(o);
    }

    // Shuffle Fisher-Yates de alta entropía con Mulberry32
    function shuffle(arr: Perfume[]): Perfume[] {
      const copia = [...arr];
      for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const temp = copia[i];
        copia[i] = copia[j];
        copia[j] = temp;
      }
      return copia;
    }

    const afinesMezclados = shuffle(afines);
    const restoMezclados = shuffle(resto);

    return [...afinesMezclados, ...restoMezclados].slice(0, 12);
  });

  // Alias retrocompatible para evitar errores de compilador
  readonly relacionados = this.recomendados;

  readonly gruposRecomendados = computed(() => {
    const recs = this.recomendados();
    const grupos: Perfume[][] = [];
    for (let i = 0; i < recs.length; i += 4) {
      grupos.push(recs.slice(i, i + 4));
    }
    return grupos;
  });

  carruselAnterior() {
    this.carruselPagina.update((pag) => Math.max(0, pag - 1));
  }

  carruselSiguiente() {
    this.carruselPagina.update((pag) => Math.min(this.gruposRecomendados().length - 1, pag + 1));
  }

  irACarrusel(idx: number) {
    this.carruselPagina.set(idx);
  }

  seleccionarDecant(ml: number) {
    this.modoCompra.set('decant');
    this.sel.set(ml);
  }

  seleccionarCompleto() {
    this.modoCompra.set('completo');
  }

  readonly elegido = computed<Volumen | null>(() => {
    if (this.modoCompra() !== 'decant') return null;
    const ml = this.sel();
    return this.vols().find((v) => v.ml === ml) ?? null;
  });

  menos() { this.cantidad.update((n) => Math.max(1, n - 1)); }
  mas() { this.cantidad.update((n) => Math.min(99, n + 1)); }

  agregar() {
    const p = this.producto();
    if (!p) return;
    const v = this.elegido();
    if (this.modoCompra() === 'decant' && v) {
      for (let i = 0; i < this.cantidad(); i++) {
        this.cart.add({
          id: p.id,
          name: p.nombre,
          price: v.precioBs,
          detail: `Decant ${v.ml} ml`,
          img: p.imagenes[0],
          opciones: p.volumenes.map((x) => ({ ml: x.ml, precioBs: x.precioBs })),
        });
      }
    } else if (p.completo?.precioBs && p.completo.precioBs > 0) {
      for (let i = 0; i < this.cantidad(); i++) {
        this.cart.add({
          id: p.id,
          name: p.nombre,
          price: p.completo.precioBs,
          detail: `Botella Completa ${p.completo.ml || 100} ml`,
          img: p.imagenes[0],
        });
      }
    } else {
      return;
    }
    this.agregado.set(true);
    setTimeout(() => this.agregado.set(false), 1600);
    this.cantidad.set(1);
  }

  porMlTexto(v: Volumen): string {
    const val = porMl(v);
    return Number.isInteger(val) ? val.toString() : val.toFixed(1);
  }

  rango(p: Perfume): string {
    if (p.volumenes.length < 2) return p.volumenes.length ? `${p.volumenes[0].ml} ml` : '';
    return `${p.volumenes[0].ml}–${p.volumenes[p.volumenes.length - 1].ml} ml`;
  }

  consultar() {
    const p = this.producto();
    if (!p) return '';
    const v = this.elegido();
    const texto = (this.modoCompra() === 'decant' && v)
      ? `Hola Elixir, quiero consultar sobre ${p.nombre} (${p.marca}) en decant de ${v.ml} ml (Bs ${v.precioBs}).`
      : p.completo?.precioBs
        ? `Hola Elixir, quiero consultar sobre la botella completa de ${p.nombre} (${p.marca}) de ${p.completo.ml || 100} ml (Bs ${p.completo.precioBs}).`
        : `Hola Elixir, quiero consultar precio de ${p.nombre} (${p.marca})`;
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`;
  }

  tieneNotas(p: Perfume): boolean {
    const n = p.notas;
    return !!(n && (n.salida?.length || n.corazon?.length || n.fondo?.length));
  }

  /**
   * Vuelve a la página, fila exacta y filtros donde estaba el usuario en el catálogo,
   * garantizando una experiencia de navegación continua y sin fricción (UX).
   */
  volverAlCatalogo() {
    if (typeof window !== 'undefined') {
      const guardado = sessionStorage.getItem('elixir_catalogo_volver');
      if (guardado) {
        try {
          const estado = JSON.parse(guardado);
          if (estado?.url) {
            this.router.navigateByUrl(estado.url);
            return;
          }
        } catch {
          /* fallback */
        }
      }
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
    }
    this.router.navigate(['/perfumes']);
  }
}