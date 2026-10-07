import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';

const PROMOS = [
  { src: '/assets/carrusel_1.jpg', alt: 'Promo 1' },
  { src: '/assets/carrusel_2.jpg', alt: 'Promo 2' },
  { src: '/assets/carrusel_3.jpg', alt: 'Promo 3' },
  { src: '/assets/carrusel_4.webp', alt: 'Promo 4' },
  { src: '/assets/carrusel_5.webp', alt: 'Promo 5' },
];

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  constructor(readonly cart: CartService, private router: Router) {}

  query = '';
  buscar(e: Event) {
    e.preventDefault();
    this.router.navigate(['/perfumes'], { queryParams: { q: this.query } });
  }

  readonly promos = PROMOS;
  readonly index = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    if (typeof window !== 'undefined' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.timer = setInterval(() => this.next(), 6000);
    }
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }

  next() { this.index.update((i) => (i + 1) % this.promos.length); }
  prev() { this.index.update((i) => (i - 1 + this.promos.length) % this.promos.length); }
  go(i: number) { this.index.set(i); }
}
