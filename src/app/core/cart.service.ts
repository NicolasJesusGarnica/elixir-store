import { Injectable, afterNextRender, computed, inject, signal } from '@angular/core';
import { PerfumesService } from './perfumes.service';

export interface CartOpcion {
  ml: number;
  precioBs: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  detail?: string;
  img?: string;
  opciones?: CartOpcion[];
}

export interface ConsentLogEntry {
  id: string;
  timestamp: string;
  fechaLegible: string;
  terminosVersion: string;
  privacidadVersion: string;
  reembolsosVersion: string;
  totalBs: number;
  itemsCount: number;
  userAgent?: string;
}

/** Version del formato guardado: si cambia, la cache vieja se descarta. */
const CLAVE_CARRITO = 'elixir-carrito-v1';
const CLAVE_CONSENTIMIENTO = 'elixir_consent_log';

@Injectable({ providedIn: 'root' })
export class CartService {
  private svc = inject(PerfumesService);

  private readonly items = signal<CartItem[]>([]);
  readonly isOpen = signal(false);

  /** Aviso efimero al agregar: no interrumpe con el panel a pantalla completa. */
  private readonly _aviso = signal<{ texto: string; id: number } | null>(null);
  readonly aviso = this._aviso.asReadonly();
  private avisoTimer: ReturnType<typeof setTimeout> | null = null;
  private avisoId = 0;

  /** Micro-feedback visual (rebote elástico y destello) al agregar a la bolsa */
  readonly badgeAnimando = signal(false);
  private animTimer: ReturnType<typeof setTimeout> | null = null;

  readonly itemsList = this.items.asReadonly();
  readonly count = computed(() => this.items().reduce((n, i) => n + i.qty, 0));
  readonly total = computed(() => this.items().reduce((t, i) => t + i.price * i.qty, 0));

  constructor() {
    // Se restaura DESPUES de la hidratacion. Si se hiciera en el constructor,
    // el contador del header vendria prerenderizado en 0 desde el servidor y
    // Angular pediria el DOM de vuelta al detectar la diferencia.
    afterNextRender(() => this.restaurar());
  }

  dispararAnimacion(): void {
    if (typeof window === 'undefined') return;
    this.badgeAnimando.set(false);
    requestAnimationFrame(() => {
      this.badgeAnimando.set(true);
      if (this.animTimer) clearTimeout(this.animTimer);
      this.animTimer = setTimeout(() => {
        this.badgeAnimando.set(false);
      }, 500);
    });
  }

  add(item: Omit<CartItem, 'qty'>) {
    this.items.update((list) => {
      const found = list.find((i) => i.id === item.id && i.detail === item.detail);
      if (found) return list.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
      return [...list, { ...item, qty: 1 }];
    });
    this.mostrarAviso(`${item.name}${item.detail ? ` · ${item.detail}` : ''}`);
    this.dispararAnimacion();
    this.guardar();
  }

  mostrarAviso(texto: string): void {
    this.avisoId += 1;
    this._aviso.set({ texto, id: this.avisoId });
    if (typeof window === 'undefined') return;
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this.avisoTimer = setTimeout(() => {
      // Solo se oculta si sigue siendo el mismo aviso (no pisa uno nuevo)
      if (this._aviso()?.id === this.avisoId) this._aviso.set(null);
    }, 3200);
  }

  cerrarAviso(): void {
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this._aviso.set(null);
  }

  setQty(id: string, detail: string | undefined, qty: number) {
    this.items.update((list) =>
      qty <= 0
        ? list.filter((i) => !(i.id === id && i.detail === detail))
        : list.map((i) => (i.id === id && i.detail === detail ? { ...i, qty } : i)),
    );
    this.guardar();
  }

  /**
   * Cambia el volumen de una linea y recalcula el precio.
   *
   * Si el producto ya estaba en el carrito con ese volumen, las cantidades se
   * suman en una sola linea en vez de crear una nueva. Esto se hacia sobre la
   * lista ORIGINAL: antes se filtraba primero la linea destino y despues se
   * buscaba en el filtro, con lo cual nunca se encontraba y se perdian unidades.
   */
  cambiarVolumen(id: string, detail: string | undefined, op: CartOpcion) {
    const nuevo = `${op.ml} ml`;

    this.items.update((list) => {
      const origen = list.find((i) => i.id === id && i.detail === detail);
      if (!origen || origen.detail === nuevo) return list;

      const destino = list.find((i) => i.id === id && i.detail === nuevo);

      const fusionado: CartItem = {
        ...origen,
        detail: nuevo,
        price: op.precioBs,
        qty: origen.qty + (destino?.qty ?? 0),
      };

      // Se retiran las dos lineas (la que cambia y la que se fusiona) y se
      // reinserta una sola, en la posicion que ocupaba la original.
      const restantes = list.filter(
        (i) => !(i.id === id && (i.detail === detail || i.detail === nuevo)),
      );
      const posicion = Math.min(list.indexOf(origen), restantes.length);

      return [...restantes.slice(0, posicion), fusionado, ...restantes.slice(posicion)];
    });
    this.guardar();
  }

  // ---- Persistencia ----

  /**
   * Guarda el carrito en el navegador. Si el almacenamiento falla (modo privado,
   * cuota llena) la tienda sigue funcionando: solo se pierde la persistencia.
   */
  private guardar(): void {
    if (typeof window === 'undefined') return;
    try {
      const lista = this.items();
      if (lista.length) {
        window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(lista));
      } else {
        window.localStorage.removeItem(CLAVE_CARRITO);
      }
    } catch {
      /* sin persistencia: no es motivo para romper el carrito */
    }
  }

  /**
   * Recupera el carrito guardado al abrir la pagina.
   *
   * No se confia en lo que quedo guardado: se revalida contra el catalogo actual.
   * Los precios se actualizan (si subiste un precio, el cliente no debe pedir al
   * valor viejo) y se descartan los productos que ya no existen o que perdieron
   * ese volumen. Un carrito guardado con datos corruptos simplemente se ignora.
   */
  restaurar(): void {
    if (typeof window === 'undefined') return;

    let datos: unknown;
    try {
      const bruto = window.localStorage.getItem(CLAVE_CARRITO);
      if (!bruto) return;
      datos = JSON.parse(bruto);
    } catch {
      this.descartarGuardado();
      return;
    }

    if (!Array.isArray(datos)) {
      this.descartarGuardado();
      return;
    }

    const vigentes: CartItem[] = [];
    for (const bruto of datos as Record<string, unknown>[]) {
      const id = bruto?.['id'];
      const nombre = bruto?.['name'];
      if (typeof id !== 'string' || typeof nombre !== 'string') continue;
      const qty = Number(bruto['qty']);
      if (!Number.isFinite(qty) || qty <= 0) continue;

      const producto = this.svc.porId(id);
      if (!producto) continue; // eliminado o dado de baja

      const ml = Number(String(bruto['detail'] ?? '').match(/(\d+)/)?.[1] ?? NaN);
      const volumen = Number.isFinite(ml)
        ? producto.volumenes.find((v) => v.ml === ml)
        : undefined;

      // Si ese volumen ya no existe, la linea se cae: mandar un pedido con un
      // volumen inexistente genera mas confusion que un carrito sin esa linea.
      if (!volumen) continue;

      vigentes.push({
        id: producto.id,
        name: producto.nombre,
        detail: `${volumen.ml} ml`,
        price: volumen.precioBs,
        qty,
        img: producto.imagenes[0],
        opciones: producto.volumenes.map((v) => ({ ml: v.ml, precioBs: v.precioBs })),
      });
    }

    if (vigentes.length) this.items.set(vigentes);
    if (!vigentes.length) this.descartarGuardado();
  }

  private descartarGuardado(): void {
    try {
      window.localStorage.removeItem(CLAVE_CARRITO);
    } catch {
      /* nada que hacer */
    }
  }

  /**
   * Registra documentalmente la aceptación informada de los Términos, Política
   * de Privacidad y Política de Reembolsos en localStorage con timestamp y código
   * único verificable (trazabilidad legal).
   */
  registrarConsentimiento(): { id: string; stamp: string } {
    const ahora = new Date();
    const id = `ELX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const fechaLegible = ahora.toLocaleString('es-BO', {
      timeZone: 'America/La_Paz',
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const stamp = `[Consentimiento legal registrado: Términos v1.0, Privacidad v1.0 y Reembolsos aceptados el ${fechaLegible} · Ref: #${id}]`;

    if (typeof window !== 'undefined') {
      try {
        const existente = window.localStorage.getItem(CLAVE_CONSENTIMIENTO);
        const lista: ConsentLogEntry[] = existente ? JSON.parse(existente) : [];
        lista.push({
          id,
          timestamp: ahora.toISOString(),
          fechaLegible,
          terminosVersion: '1.0',
          privacidadVersion: '1.0',
          reembolsosVersion: '1.0',
          totalBs: this.total(),
          itemsCount: this.count(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        });
        window.localStorage.setItem(CLAVE_CONSENTIMIENTO, JSON.stringify(lista.slice(-25)));
      } catch {
        /* localStorage seguro */
      }
    }

    return { id, stamp };
  }

  whatsappUrl(phone: string): string {
    const lines = this.items().map(
      (i) => `• ${i.name}${i.detail ? ` (${i.detail})` : ''} x${i.qty} — Bs ${i.price * i.qty}`,
    );
    const msg = `Hola Elixir, quiero pedir:\n${lines.join('\n')}\nTotal: Bs ${this.total()}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }
}
