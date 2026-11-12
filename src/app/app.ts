import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CookieBanner } from './shared/cookie-banner';
import { SommelierBot } from './shared/sommelier-bot';

@Component({
  imports: [RouterOutlet, CookieBanner, SommelierBot],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('elixir-store');

  constructor(router: Router) {
    // Solo en el navegador: en el SSR no existe window/requestAnimationFrame.
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    // Al cambiar de pagina siempre arrancamos arriba (si no hay ancla #).
    router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        const hayAncla = (e as NavigationEnd).urlAfterRedirects.includes('#');
        if (hayAncla) return;
        requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
      });
  }
}