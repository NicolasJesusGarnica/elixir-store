import { Component, HostListener, OnDestroy, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';
import { SITE } from '../../environments';

@Component({
  selector: 'app-cart-drawer',
  imports: [RouterLink],
  templateUrl: './cart-drawer.html',
})
export class CartDrawer implements OnDestroy {
  readonly cart = inject(CartService);

  // ---- Gestos táctiles de deslizamiento (Swipe de izquierda a derecha para salir) ----
  readonly arrastrando = signal(false);
  readonly desplazamientoX = signal(0);

  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private isSwipingHorizontal: boolean | null = null;

  constructor() {
    effect(() => {
      const open = this.cart.isOpen();
      if (typeof document !== 'undefined') {
        if (open) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
          this.arrastrando.set(false);
          this.desplazamientoX.set(0);
        }
      }
    });
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:keydown.escape')
  cerrarConEsc() {
    this.cart.isOpen.set(false);
  }

  /** El aviso ofrece abrir el carrito, pero no lo abre solo. */
  verCarrito() {
    this.cart.cerrarAviso();
    this.cart.isOpen.set(true);
  }

  solicitarPedido() {
    if (this.cart.count() === 0) return;
    const url = this.cart.whatsappUrl(SITE.whatsapp);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  // ---- Manejo del gesto táctil de arrastre (Deslizar hacia la derecha para cerrar) ----

  onTouchStart(e: TouchEvent) {
    if (!this.cart.isOpen() || e.touches.length !== 1) return;
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.startTime = Date.now();
    this.isSwipingHorizontal = null;
    this.desplazamientoX.set(0);
  }

  onTouchMove(e: TouchEvent) {
    if (!this.cart.isOpen() || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - this.startX;
    const diffY = currentY - this.startY;

    // Detectar dirección inicial del gesto
    if (this.isSwipingHorizontal === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        // Solo activa el arrastre si es predominantemente horizontal de izquierda a derecha (diffX > 0)
        if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
          this.isSwipingHorizontal = true;
          this.arrastrando.set(true);
        } else {
          this.isSwipingHorizontal = false; // Permite scroll vertical normal de productos
        }
      }
    }

    if (this.isSwipingHorizontal) {
      // Seguimiento 1:1 directo con el dedo hacia la derecha
      const offset = Math.max(0, diffX);
      this.desplazamientoX.set(offset);
      if (e.cancelable) {
        e.preventDefault();
      }
    }
  }

  onTouchEnd(e: TouchEvent) {
    if (this.isSwipingHorizontal) {
      const timeDelta = Date.now() - this.startTime;
      const currentX = e.changedTouches[0]?.clientX ?? this.startX;
      const diffX = currentX - this.startX;
      const velocity = diffX / (timeDelta || 1); // px/ms

      // Se cierra si se arrastró más de 75px o si hubo un impulso rápido hacia la derecha
      if (this.desplazamientoX() > 75 || velocity > 0.3) {
        this.arrastrando.set(false);
        this.cart.isOpen.set(false);
        this.desplazamientoX.set(0);
      } else {
        // Vuelve suavemente a su posición
        this.arrastrando.set(false);
        this.desplazamientoX.set(0);
      }
    }
    this.isSwipingHorizontal = null;
  }

  onTouchCancel() {
    this.arrastrando.set(false);
    this.desplazamientoX.set(0);
    this.isSwipingHorizontal = null;
  }
}