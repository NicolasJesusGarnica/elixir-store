import { Component, computed, inject, signal, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SiteFooter } from '../shared/site-footer';
import { NovedadesService } from '../core/novedades.service';
import { PerfumesService } from '../core/perfumes.service';
import { precioMin, nombreCorto } from '../core/perfume.model';
import { SeoService } from '../core/seo.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-novedades',
  imports: [RouterLink, SiteHeader, CartDrawer, SiteFooter],
  templateUrl: './novedades.html',
})
export class Novedades implements OnDestroy {
  readonly novedadesSvc = inject(NovedadesService);
  readonly perfumesSvc = inject(PerfumesService);
  private seo = inject(SeoService);

  readonly precioMin = precioMin;
  readonly nombreCorto = nombreCorto;

  readonly banners = this.novedadesSvc.banners;
  readonly activoIdx = signal(this.recuperarIndiceInicial());
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  readonly bannerActivo = computed(() => {
    const list = this.banners();
    if (!list.length) return null;
    const idx = this.activoIdx() % list.length;
    return list[idx] ?? list[0];
  });

  /** Perfume vinculado a la novedad activa para extraer notas, precios y decants */
  readonly perfumeActivo = computed(() => {
    const b = this.bannerActivo();
    if (!b) return null;
    return this.getPerfume(b.perfumeId) ?? null;
  });

  readonly bannerPrev = computed(() => {
    const list = this.banners();
    if (list.length < 2) return null;
    const prev = (this.activoIdx() - 1 + list.length) % list.length;
    return list[prev];
  });

  readonly bannerNext = computed(() => {
    const list = this.banners();
    if (list.length < 2) return null;
    const next = (this.activoIdx() + 1) % list.length;
    return list[next];
  });

  /** Perfumes marcados como nuevos o destacados */
  readonly perfumesNovedad = computed(() => {
    const todos = this.perfumesSvc.productos();
    const nuevos = todos.filter((p) => p.nuevo);
    return nuevos.length ? nuevos : todos.slice(0, 8);
  });

  constructor() {
    this.seo.aplicar({
      titulo: `Novedades y Promociones Exclusivas | ${SITE.nombre}`,
      descripcion: `Descubre los nuevos lanzamientos y promociones en decants originales de alta perfumería en Bolivia.`,
      imagen: SITE.imagen,
      ruta: '/novedades',
    });

    this.iniciarAutoplay();
  }

  ngOnDestroy() {
    this.detenerAutoplay();
  }

  iniciarAutoplay() {
    if (typeof window === 'undefined') return;
    this.detenerAutoplay();
    this.autoplayTimer = setInterval(() => {
      const total = this.banners().length;
      if (total > 1) {
        this.activoIdx.update((i) => (i + 1) % total);
      }
    }, 5500);
  }

  detenerAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  irA(idx: number) {
    this.activoIdx.set(idx);
    this.guardarSlide(idx);
    this.iniciarAutoplay();
  }

  anterior() {
    const total = this.banners().length;
    if (!total) return;
    this.activoIdx.update((i) => {
      const nuevo = i > 0 ? i - 1 : total - 1;
      this.guardarSlide(nuevo);
      return nuevo;
    });
    this.iniciarAutoplay();
  }

  siguiente() {
    const total = this.banners().length;
    if (!total) return;
    this.activoIdx.update((i) => {
      const nuevo = (i + 1) % total;
      this.guardarSlide(nuevo);
      return nuevo;
    });
    this.iniciarAutoplay();
  }

  private guardarSlide(idx: number): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('elixir_novedad_slide', idx.toString());
      } catch {
        /* ignore */
      }
    }
  }

  private recuperarIndiceInicial(): number {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('elixir_novedad_slide');
        if (saved !== null) {
          const idx = parseInt(saved, 10);
          if (!isNaN(idx) && idx >= 0) return idx;
        }
      } catch {
        /* fallback */
      }
    }
    return 0;
  }

  private touchStartX = 0;

  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent) {
    const diff = this.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) this.siguiente();
      else this.anterior();
    }
  }

  getPerfume(id: string) {
    return this.perfumesSvc.productos().find((p) => p.id === id);
  }
}
