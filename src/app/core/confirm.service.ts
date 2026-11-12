import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly abierto = signal(false);
  readonly mensaje = signal('');
  readonly detalle = signal('');

  private resolver: ((v: boolean) => void) | null = null;

  ask(mensaje: string, detalle = ''): Promise<boolean> {
    this.mensaje.set(mensaje);
    this.detalle.set(detalle);
    this.abierto.set(true);
    return new Promise<boolean>((res) => (this.resolver = res));
  }

  responder(v: boolean) {
    this.abierto.set(false);
    const r = this.resolver;
    this.resolver = null;
    r?.(v);
  }
}