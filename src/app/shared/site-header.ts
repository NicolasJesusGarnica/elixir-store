import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../core/cart.service';
import { PerfumesService } from '../core/perfumes.service';
import { Perfume, precioMin } from '../core/perfume.model';

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
})
export class SiteHeader {
  readonly cart = inject(CartService);
  private svc = inject(PerfumesService);
  private router = inject(Router);
  private el = inject(ElementRef);
  readonly precioMin = precioMin;

  menuOpen = signal(false);
  query = signal('');
  mostrarPredictivo = signal(false);

  readonly sugerencias = computed(() => {
    const terminos = normalizar(this.query().trim()).split(/\s+/).filter(Boolean);
    if (!terminos.length) return [];
    return this.svc.productos().filter((p) => {
      const notas = p.notas
        ? [...(p.notas.salida ?? []), ...(p.notas.corazon ?? []), ...(p.notas.fondo ?? [])]
        : [];
      const texto = normalizar(
        `${p.nombre} ${p.marca} ${p.tipo} ${p.genero} ${(p.etiquetas ?? []).join(' ')} ${notas.join(' ')}`
      );
      return terminos.every((t) => texto.includes(t));
    }).slice(0, 6);
  });

  @HostListener('document:click', ['$event'])
  onClickDocument(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.mostrarPredictivo.set(false);
    }
  }

  onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.query.set(val);
    this.mostrarPredictivo.set(val.trim().length > 0);
  }

  abrirPredictivo(): void {
    if (this.query().trim().length > 0) {
      this.mostrarPredictivo.set(true);
    }
  }

  cerrarPredictivo(): void {
    this.mostrarPredictivo.set(false);
  }

  limpiarBusqueda(): void {
    this.query.set('');
    this.mostrarPredictivo.set(false);
  }

  buscar(e?: Event) {
    if (e) e.preventDefault();
    this.cerrarPredictivo();
    this.menuOpen.set(false);
    const q = this.query().trim();
    this.router.navigate(['/perfumes'], { queryParams: q ? { q } : {} });
  }
}