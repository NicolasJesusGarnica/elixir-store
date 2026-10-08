import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../core/cart.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(readonly cart: CartService, private router: Router) {}

  query = '';
  menuOpen = signal(false);
  buscar(e: Event) {
    e.preventDefault();
    this.router.navigate(['/perfumes'], { queryParams: { q: this.query } });
  }
}
