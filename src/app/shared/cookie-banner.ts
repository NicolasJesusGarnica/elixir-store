import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

const CLAVE_COOKIES_OK = 'elixir_cookies_ok';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink],
  templateUrl: './cookie-banner.html',
})
export class CookieBanner {
  private platformId = inject(PLATFORM_ID);
  readonly visible = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const aceptado = window.localStorage.getItem(CLAVE_COOKIES_OK);
      if (!aceptado) {
        // Leve retraso para no colisionar con la primera carga visual
        setTimeout(() => this.visible.set(true), 1200);
      }
    } catch {
      /* sin acceso a storage */
    }
  }

  aceptar() {
    this.visible.set(false);
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      window.localStorage.setItem(CLAVE_COOKIES_OK, 'true');
    } catch {
      /* nada que hacer */
    }
  }
}
