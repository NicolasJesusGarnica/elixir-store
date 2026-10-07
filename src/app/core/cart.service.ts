import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  detail?: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<CartItem[]>([]);
  readonly isOpen = signal(false);

  readonly itemsList = this.items.asReadonly();
  readonly count = computed(() => this.items().reduce((n, i) => n + i.qty, 0));
  readonly total = computed(() => this.items().reduce((t, i) => t + i.price * i.qty, 0));

  add(item: Omit<CartItem, 'qty'>) {
    this.items.update((list) => {
      const found = list.find((i) => i.id === item.id && i.detail === item.detail);
      if (found) return list.map((i) => (i === found ? { ...i, qty: i.qty + 1 } : i));
      return [...list, { ...item, qty: 1 }];
    });
    this.isOpen.set(true);
  }

  setQty(id: string, detail: string | undefined, qty: number) {
    this.items.update((list) =>
      qty <= 0
        ? list.filter((i) => !(i.id === id && i.detail === detail))
        : list.map((i) => (i.id === id && i.detail === detail ? { ...i, qty } : i)),
    );
  }

  whatsappUrl(phone: string): string {
    const lines = this.items().map(
      (i) => `• ${i.name}${i.detail ? ` (${i.detail})` : ''} x${i.qty} — $${(i.price * i.qty).toFixed(2)}`,
    );
    const msg = `Hola Elixir, quiero pedir:\n${lines.join('\n')}\nTotal: $${this.total().toFixed(2)}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }
}
