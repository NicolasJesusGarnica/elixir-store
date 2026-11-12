import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { PerfumesService } from './perfumes.service';
import { Perfume } from './perfume.model';

const POLO: Perfume = {
  id: 'polo_blue',
  nombre: 'POLO BLUE',
  marca: 'Ralph Lauren',
  tipo: 'Diseñador',
  genero: 'Hombre',
  descripcion: 'Aromatico y fresco.',
  etiquetas: ['Fresco'],
  imagenes: ['https://r2.dev/polo.webp'],
  volumenes: [
    { ml: 6, precioBs: 50 },
    { ml: 20, precioBs: 120 },
  ],
  completo: { ml: 100, precioBs: null },
  activo: true,
  nuevo: false,
  destacado: false,
};

/** Catalogo minimo: evita levantar Firebase en los tests. */
const catalogo = new Map<string, Perfume>([[POLO.id, POLO]]);

describe('CartService', () => {
  let cart: CartService;

  function crear(): CartService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CartService,
        {
          provide: PerfumesService,
          useValue: {
            porId: (id: string) => catalogo.get(id),
          },
        },
      ],
    });
    return TestBed.inject(CartService);
  }

  beforeEach(() => {
    localStorage.clear();
    catalogo.clear();
    catalogo.set(POLO.id, POLO);
    cart = crear();
  });

  const OP = (ml: number, precioBs: number) => ({ ml, precioBs });

  describe('agregar', () => {
    it('agrega un producto con cantidad 1', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      expect(cart.count()).toBe(1);
      expect(cart.itemsList()[0].qty).toBe(1);
    });

    it('suma cantidad si el mismo producto y volumen ya estan', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      expect(cart.itemsList()).toHaveLength(1);
      expect(cart.count()).toBe(2);
    });

    it('separa en lineas distintas los distintos volumenes', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'a', name: 'A', price: 80, detail: '20 ml' });

      expect(cart.itemsList()).toHaveLength(2);
    });

    it('no abre el carrito al agregar (solo muestra aviso)', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      expect(cart.isOpen()).toBe(false);
      expect(cart.aviso()?.texto).toContain('A');
    });
  });

  describe('cambiarVolumen', () => {
    // Regresion: al cambiar de volumen se perdian unidades silenciosamente.
    it('conserva la cantidad al cambiar a un volumen que no esta en el carrito', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      cart.cambiarVolumen('a', '6 ml', OP(20, 120));

      expect(cart.itemsList()).toHaveLength(1);
      expect(cart.itemsList()[0].detail).toBe('20 ml');
      expect(cart.itemsList()[0].qty).toBe(2);
      expect(cart.itemsList()[0].price).toBe(120);
    });

    it('SUMA las cantidades cuando el volumen destino ya existe', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' }); // qty 1
      cart.add({ id: 'a', name: 'A', price: 80, detail: '10 ml' }); // qty 2
      cart.add({ id: 'a', name: 'A', price: 80, detail: '10 ml' });

      expect(cart.count()).toBe(3);

      cart.cambiarVolumen('a', '6 ml', OP(10, 80));

      expect(cart.itemsList()).toHaveLength(1);
      expect(cart.itemsList()[0].detail).toBe('10 ml');
      expect(cart.itemsList()[0].qty).toBe(3);
      expect(cart.count()).toBe(3);
      expect(cart.total()).toBe(240);
    });

    it('no toca otros productos del carrito', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'b', name: 'B', price: 90, detail: '10 ml' });

      cart.cambiarVolumen('a', '6 ml', OP(20, 120));

      const b = cart.itemsList().find((i) => i.id === 'b');
      expect(b?.detail).toBe('10 ml');
      expect(b?.qty).toBe(1);
      expect(b?.price).toBe(90);
    });

    it('mantiene la posicion de la linea que cambio', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'b', name: 'B', price: 90, detail: '10 ml' });

      cart.cambiarVolumen('a', '6 ml', OP(20, 120));

      expect(cart.itemsList()[0].id).toBe('a');
      expect(cart.itemsList()[1].id).toBe('b');
    });

    it('no hace nada si el volumen elegido es el mismo', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      cart.cambiarVolumen('a', '6 ml', OP(6, 50));

      expect(cart.itemsList()[0].qty).toBe(1);
      expect(cart.itemsList()[0].price).toBe(50);
    });

    it('no rompe con un id o detalle inexistente', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      cart.cambiarVolumen('zzz', '6 ml', OP(20, 120));
      cart.cambiarVolumen('a', '99 ml', OP(20, 120));

      expect(cart.itemsList()).toHaveLength(1);
      expect(cart.itemsList()[0].detail).toBe('6 ml');
    });
  });

  describe('setQty', () => {
    it('cambia la cantidad de la linea indicada', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      cart.setQty('a', '6 ml', 3);

      expect(cart.itemsList()[0].qty).toBe(3);
    });

    it('elimina la linea si la cantidad llega a 0', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });

      cart.setQty('a', '6 ml', 0);

      expect(cart.itemsList()).toHaveLength(0);
      expect(cart.total()).toBe(0);
    });

    it('afecta solo a la linea del volumen indicado', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'a', name: 'A', price: 80, detail: '10 ml' });

      cart.setQty('a', '6 ml', 5);

      expect(cart.itemsList().find((i) => i.detail === '6 ml')?.qty).toBe(5);
      expect(cart.itemsList().find((i) => i.detail === '10 ml')?.qty).toBe(1);
    });
  });

  describe('total', () => {
    it('suma precio por cantidad de todas las lineas', () => {
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'a', name: 'A', price: 50, detail: '6 ml' });
      cart.add({ id: 'b', name: 'B', price: 80, detail: '10 ml' });

      expect(cart.total()).toBe(180);
    });
  });

  describe('whatsappUrl', () => {
    it('incluye nombre, volumen, cantidad y total en el mensaje', () => {
      cart.add({ id: 'a', name: 'POLO BLUE', price: 50, detail: '6 ml' });
      cart.setQty('a', '6 ml', 2);

      const url = cart.whatsappUrl('59170000000');
      const texto = decodeURIComponent(url.split('text=')[1]);

      expect(url).toContain('wa.me/59170000000');
      expect(texto).toContain('POLO BLUE');
      expect(texto).toContain('6 ml');
      expect(texto).toContain('x2');
      expect(texto).toContain('100');
    });
  });

  describe('persistencia', () => {
    it('guarda el carrito en el navegador', () => {
      cart.add({ id: 'polo_blue', name: 'POLO BLUE', price: 50, detail: '6 ml' });
      cart.setQty('polo_blue', '6 ml', 3);

      const guardado = localStorage.getItem('elixir-carrito-v1');
      expect(guardado).toBeTruthy();
      expect(JSON.parse(guardado as string)[0].qty).toBe(3);
    });

    it('recupera el carrito despues de recargar', () => {
      cart.add({ id: 'polo_blue', name: 'POLO BLUE', price: 50, detail: '6 ml' });
      cart.setQty('polo_blue', '6 ml', 2);

      // Instancia nueva = como si el usuario recarga la pagina.
      const recargado = crear();
      recargado.restaurar();

      expect(recargado.count()).toBe(2);
      expect(recargado.total()).toBe(100);
      expect(recargado.itemsList()[0].detail).toBe('6 ml');
    });

    it('ACTUALIZA el precio si el catalogo cambio desde que se agrego', () => {
      cart.add({ id: 'polo_blue', name: 'POLO BLUE', price: 50, detail: '6 ml' });

      // El precio subio de 50 a 65 en el catalogo.
      catalogo.set(POLO.id, {
        ...POLO,
        volumenes: [
          { ml: 6, precioBs: 65 },
          { ml: 20, precioBs: 150 },
        ],
      });

      const recargado = crear();
      recargado.restaurar();

      expect(recargado.itemsList()[0].price).toBe(65);
      expect(recargado.total()).toBe(65);
    });

    it('recupera tambien las opciones de volumen', () => {
      cart.add({ id: 'polo_blue', name: 'POLO BLUE', price: 50, detail: '6 ml' });

      const recargado = crear();
      recargado.restaurar();

      expect(recargado.itemsList()[0].opciones).toHaveLength(2);
    });

    it('descarta productos que ya no existen', () => {
      cart.add({ id: 'polo_blue', name: 'POLO BLUE', price: 50, detail: '6 ml' });
      cart.add({ id: 'fantasma', name: 'BORRADO', price: 10, detail: '6 ml' });

      const recargado = crear();
      recargado.restaurar();

      expect(recargado.itemsList()).toHaveLength(1);
      expect(recargado.itemsList()[0].id).toBe('polo_blue');
    });

    it('descarta la linea si ese volumen ya no existe', () => {
      cart.add({ id: 'polo_blue', name: 'POLO BLUE', price: 50, detail: '20 ml' });

      catalogo.set(POLO.id, { ...POLO, volumenes: [{ ml: 6, precioBs: 50 }] });

      const recargado = crear();
      recargado.restaurar();

      expect(recargado.itemsList()).toHaveLength(0);
    });

    it('ignora datos corruptos sin romper', () => {
      localStorage.setItem('elixir-carrito-v1', '{esto no es json');

      const recargado = crear();
      recargado.restaurar();

      expect(recargado.itemsList()).toHaveLength(0);
    });

    it('ignora un objeto donde deberia haber una lista', () => {
      localStorage.setItem('elixir-carrito-v1', '{"id":"polo_blue"}');

      const recargado = crear();
      recargado.restaurar();

      expect(recargado.itemsList()).toHaveLength(0);
    });

    it('borra el guardado cuando el carrito queda vacio', () => {
      cart.add({ id: 'polo_blue', name: 'POLO BLUE', price: 50, detail: '6 ml' });
      cart.setQty('polo_blue', '6 ml', 0);

      expect(localStorage.getItem('elixir-carrito-v1')).toBeNull();
    });
  });
});