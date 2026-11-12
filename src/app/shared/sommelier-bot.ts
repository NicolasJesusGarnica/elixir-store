import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SommelierService } from '../core/sommelier.service';
import { CartService } from '../core/cart.service';
import { Perfume, precioMin } from '../core/perfume.model';

@Component({
  selector: 'app-sommelier-bot',
  imports: [RouterLink],
  templateUrl: './sommelier-bot.html',
})
export class SommelierBot {
  readonly sommelier = inject(SommelierService);
  readonly cart = inject(CartService);
  private router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;

  readonly inputTexto = signal('');
  readonly precioMin = precioMin;
  readonly agregadoId = signal<string | null>(null);

  /** Ocultar en la ruta /admin para no interferir con las herramientas de gestión */
  readonly esRutaAdmin = computed(() => this.router.url.startsWith('/admin'));

  onInput(e: Event): void {
    this.inputTexto.set((e.target as HTMLInputElement).value);
  }

  enviarMensaje(pregunta?: string): void {
    const texto = (pregunta ?? this.inputTexto()).trim();
    if (!texto || this.sommelier.cargando()) return;
    this.inputTexto.set('');
    void this.sommelier.enviarMensaje(texto).then(() => {
      this.scrollAlFondo();
    });
    this.scrollAlFondo();
  }

  agregarAlCarrito(p: Perfume): void {
    this.sommelier.agregarDecantABolsa(p);
    this.agregadoId.set(p.id);
    setTimeout(() => {
      if (this.agregadoId() === p.id) {
        this.agregadoId.set(null);
      }
    }, 1800);
  }

  scrollAlFondo(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTo({
          top: this.scrollContainer.nativeElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 80);
    setTimeout(() => {
      if (this.scrollContainer?.nativeElement) {
        this.scrollContainer.nativeElement.scrollTo({
          top: this.scrollContainer.nativeElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 300);
  }

  formatearMarkdown(texto: string): string {
    if (!texto) return '';

    // Formatear negritas con acento refinado
    const formateado = texto.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white tracking-wide">$1</strong>');

    // Separar por líneas y detectar viñetas editoriales
    const lineas = formateado.split('\n');
    const resultado: string[] = [];

    for (const linea of lineas) {
      const limpia = linea.trim();
      if (limpia.startsWith('•') || limpia.startsWith('* ') || limpia.startsWith('- ')) {
        const contenido = limpia.replace(/^[•*-]\s*/, '');
        resultado.push(
          `<div class="flex items-start gap-2.5 my-2 text-neutral-200 leading-relaxed font-sans text-xs sm:text-[13px]">` +
            `<span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#C8A96A] shadow-[0_0_8px_rgba(200,169,106,0.5)]"></span>` +
            `<div class="flex-1">${contenido}</div>` +
          `</div>`
        );
      } else if (limpia.length > 0) {
        resultado.push(`<p class="leading-relaxed text-xs sm:text-[13px] text-neutral-300 font-sans my-1.5">${limpia}</p>`);
      }
    }

    return resultado.join('');
  }
}
