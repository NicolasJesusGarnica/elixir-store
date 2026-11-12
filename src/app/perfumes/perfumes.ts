import { Component, computed, effect, inject, signal, untracked, ElementRef, HostListener, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, filter } from 'rxjs';
import { SiteHeader } from '../shared/site-header';
import { CartDrawer } from '../shared/cart-drawer';
import { SiteFooter } from '../shared/site-footer';
import { PerfumesService } from '../core/perfumes.service';
import { CartService } from '../core/cart.service';
import { Genero, Tipo, Perfume, precioMin, porMl, mejorVolumen, nombreCorto } from '../core/perfume.model';
import { SeoService } from '../core/seo.service';
import { SITE } from '../../environments';

type Orden = 'destacados' | 'menor' | 'mayor' | 'az';

/**
 * Texto que se compara al buscar: nombre, marca, tipo, genero, etiquetas y
 * TODAS las notas olfativas. Sin esto, buscar "lavanda" no encontraba nada
 * aunque 13 fragancias la tengan en su piramide.
 */
function textoBuscable(p: Perfume): string {
  const notas = p.notas
    ? [...(p.notas.salida ?? []), ...(p.notas.corazon ?? []), ...(p.notas.fondo ?? [])]
    : [];
  return normalizar(`${p.nombre} ${p.marca} ${p.tipo} ${p.genero} ${(p.etiquetas ?? []).join(' ')} ${notas.join(' ')}`);
}

/** Sin tildes y en minuscula, para que "arbol" encuentre "Árbol". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

@Component({
  selector: 'app-perfumes',
  imports: [RouterLink, FormsModule, SiteHeader, CartDrawer, SiteFooter],
  templateUrl: './perfumes.html',
})
export class Perfumes {
  readonly svc = inject(PerfumesService);
  readonly cart = inject(CartService);
  readonly precioMin = precioMin;
  readonly porMl = porMl;
  readonly mejorVolumen = mejorVolumen;
  readonly nombreCorto = nombreCorto;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);
  private el = inject(ElementRef);

  readonly esModoDecants = signal(
    this.route.snapshot.data['soloDecants'] === true ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/decants'))
  );

  readonly baseProductos = computed(() => {
    const todos = this.svc.productos();
    return this.esModoDecants()
      ? todos.filter((p) => p.volumenes && p.volumenes.length > 0)
      : todos;
  });

  q = signal('');
  mostrarPredictivo = signal(false);
  marca = signal('todas');
  tipo = signal<Tipo | 'todos'>('todos');
  genero = signal<Genero | 'todos'>('todos');
  orden = signal<Orden>('destacados');
  precioDesde = signal<number | null>(null);
  precioHasta = signal<number | null>(null);
  etiqueta = signal<string | null>(null);
  readonly agregadoId = signal<string | null>(null);
  private agregadoTimer: ReturnType<typeof setTimeout> | null = null;

  readonly hayFiltrosActivos = computed(() => {
    return (
      Boolean(this.q().trim()) ||
      this.marca() !== 'todas' ||
      this.tipo() !== 'todos' ||
      this.genero() !== 'todos' ||
      this.precioDesde() !== null ||
      this.precioHasta() !== null ||
      Boolean(this.etiqueta())
    );
  });

  /** Sugerencias predictivas en tiempo real mientras el usuario escribe */
  readonly sugerencias = computed(() => {
    const terminos = normalizar(this.q().trim()).split(/\s+/).filter(Boolean);
    if (!terminos.length) return [];
    return this.baseProductos().filter((p) => {
      const texto = textoBuscable(p);
      return terminos.every((t) => texto.includes(t));
    }).slice(0, 6);
  });

  @HostListener('document:click', ['$event'])
  onClickDocument(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('#buscador-predictivo-catalogo')) {
      this.mostrarPredictivo.set(false);
    }
  }

  /** Evita que se escriba en la URL antes de haber leido los parametros del link. */
  private readonly urlLeida = signal(false);
  private urlTimer: ReturnType<typeof setTimeout> | null = null;

  /** El input del catalogo filtra al instante; abre el predictivo y la URL se actualiza sola. */
  onBuscar(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.q.set(val);
    this.mostrarPredictivo.set(val.trim().length > 0);
  }

  limpiarBusqueda(): void {
    this.q.set('');
    this.mostrarPredictivo.set(false);
  }

  abrirPredictivo(): void {
    if (this.q().trim().length > 0) {
      this.mostrarPredictivo.set(true);
    }
  }

  cerrarPredictivo(): void {
    this.mostrarPredictivo.set(false);
  }

  onMarcaChange(e: Event): void {
    this.marca.set((e.target as HTMLSelectElement).value);
  }

  onOrdenChange(e: Event): void {
    this.orden.set((e.target as HTMLSelectElement).value as Orden);
  }

  /**
   * Escribe los filtros en la barra de direcciones con history.replaceState,
   * SIN navegar. Si se usara el Router, la navegacion reemitiria los parametros,
   * el efecto que los lee los volveria a aplicar y el filtro se "comeria" los
   * clics del usuario. Asi el link es compartible y no hay eco.
   */
  private escribirUrl(): void {
    if (typeof window === 'undefined') return;

    const next = new URLSearchParams();
    const q = this.q().trim();
    if (q) next.set('q', q);
    if (this.marca() !== 'todas') next.set('marca', this.marca());
    if (this.tipo() !== 'todos') next.set('tipo', this.tipo());
    if (this.genero() !== 'todos') next.set('genero', this.genero());
    if (this.orden() !== 'destacados') next.set('orden', this.orden());
    if (this.precioDesde() !== null) next.set('min', String(this.precioDesde()));
    if (this.precioHasta() !== null) next.set('max', String(this.precioHasta()));
    if (this.etiqueta()) next.set('etiqueta', this.etiqueta() as string);
    if (this.pagina() > 1) next.set('pagina', String(this.pagina()));

    const ruta = this.esModoDecants() ? '/decants' : '/perfumes';
    const query = next.toString();
    const actualQuery = window.location.search.replace(/^\?/, '');
    if (query === actualQuery && window.location.pathname === ruta) return;

    window.history.replaceState(null, '', query ? `${ruta}?${query}` : ruta);
  }

  /** Guarda la posición y URL del catálogo antes de abrir el detalle de una fragancia */
  guardarPosicion(perfumeId: string): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(
        'elixir_catalogo_volver',
        JSON.stringify({
          url: window.location.pathname + window.location.search,
          perfumeId,
          scrollY: window.scrollY,
        }),
      );
    } catch {
      /* sessionStorage no disponible */
    }
  }

  readonly marcas = computed(() =>
    [...new Set(this.baseProductos().map((p) => p.marca))].sort((a, b) => a.localeCompare(b))
  );

  readonly tipos = computed(() =>
    [...new Set(this.baseProductos().map((p) => p.tipo))]
  );

  readonly precioMinGlobal = computed(() => {
    // Los productos sin decants (precio 0) no deben arrastrar el minimo a cero.
    const precios = this.baseProductos().map(precioMin).filter((n) => n > 0);
    return precios.length ? Math.min(...precios) : 0;
  });

  readonly generos: (Genero | 'todos')[] = ['todos', 'Hombre', 'Mujer', 'Unisex'];

  precioDeOrden(p: Perfume): number {
    if (this.esModoDecants()) {
      return precioMin(p);
    }
    if (p.completo?.precioBs && p.completo.precioBs > 0) {
      return p.completo.precioBs;
    }
    return precioMin(p);
  }

  readonly resultados = computed(() => {
    const terminos = normalizar(this.q().trim()).split(/\s+/).filter(Boolean);
    const min = this.precioDesde();
    const max = this.precioHasta();
    // Todas las palabras tienen que aparecer: "polo azul" no trae los polo.
    const coincide = terminos.length
      ? (p: Perfume) => {
          const texto = textoBuscable(p);
          return terminos.every((t) => texto.includes(t));
        }
      : () => true;

    let out: Perfume[] = this.baseProductos().filter((p) => {
      if (this.marca() !== 'todas' && normalizar(p.marca) !== normalizar(this.marca())) return false;
      if (this.tipo() !== 'todos' && normalizar(p.tipo) !== normalizar(this.tipo())) return false;
      if (this.genero() !== 'todos' && normalizar(p.genero) !== normalizar(this.genero())) return false;
      if (this.etiqueta() && !p.etiquetas?.some((e) => normalizar(e) === normalizar(this.etiqueta()!)))
        return false;
      if (!coincide(p)) return false;
      if (min !== null || max !== null) {
        // En modo decants filtramos por precios de decants; en catálogo general consideramos completo y decants
        let precios: number[] = [];
        if (this.esModoDecants()) {
          precios = p.volumenes.map((v) => v.precioBs);
        } else {
          if (p.completo?.precioBs && p.completo.precioBs > 0) {
            precios.push(p.completo.precioBs);
          }
          if (p.volumenes.length) {
            precios.push(...p.volumenes.map((v) => v.precioBs));
          }
        }
        if (!precios.length) return false;
        const entra = precios.some((x) => (min === null || x >= min) && (max === null || x <= max));
        if (!entra) return false;
      }
      return true;
    });

    // Si nada coincide con todas las palabras, se muestra lo que coincide con
    // alguna: es preferible 5 resultados aproximados antes que una pantalla vacía.
    if (out.length === 0 && terminos.length > 1) {
      out = this.baseProductos().filter((p) => {
        if (this.marca() !== 'todas' && normalizar(p.marca) !== normalizar(this.marca())) return false;
        if (this.tipo() !== 'todos' && normalizar(p.tipo) !== normalizar(this.tipo())) return false;
        if (this.genero() !== 'todos' && normalizar(p.genero) !== normalizar(this.genero())) return false;
        if (this.etiqueta() && !p.etiquetas?.some((e) => normalizar(e) === normalizar(this.etiqueta()!)))
          return false;
        const texto = textoBuscable(p);
        return terminos.some((t) => texto.includes(t));
      });
    }

    out = [...out];
    switch (this.orden()) {
      case 'menor':
        out.sort((a, b) => this.precioDeOrden(a) - this.precioDeOrden(b));
        break;
      case 'mayor':
        out.sort((a, b) => this.precioDeOrden(b) - this.precioDeOrden(a));
        break;
      case 'az':
        out.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        out.sort((a, b) => Number(b.destacado) - Number(a.destacado));
    }
    return out;
  });

  setPrecioMin(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.precioDesde.set(v === '' ? null : Math.max(0, Number(v)));
  }

  setPrecioMax(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.precioHasta.set(v === '' ? null : Math.max(0, Number(v)));
  }

  limpiarPrecio() {
    this.precioDesde.set(null);
    this.precioHasta.set(null);
  }

  scrollAlCatalogo(e?: Event) {
    if (e) e.preventDefault();
    if (typeof document === 'undefined') return;
    const el = document.getElementById('catalogo');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  }

  limpiar() {
    this.q.set('');
    this.mostrarPredictivo.set(false);
    this.marca.set('todas');
    this.tipo.set('todos');
    this.genero.set('todos');
    this.orden.set('destacados');
    this.precioDesde.set(null);
    this.precioHasta.set(null);
    this.etiqueta.set(null);
    this.pagina.set(1);
    this.escribirUrl();
  }

  /**
   * Aplica los parametros de la URL a los filtros.
   * Tipo, marca y genero se resuelven contra las opciones REALES del catalogo:
   * si el link trae "arabe" o "Árabe" o "ARABE", siempre cae en el valor que
   * existe de verdad. Asi el chip queda marcado y el filtro nunca queda colgado.
   */
  private aplicarParams(p: { get(nombre: string): string | null }): void {
    const q = p.get('q') ?? '';
    const etiqueta = p.get('etiqueta') ?? '';
    const orden = p.get('orden') ?? '';
    const min = p.get('min');
    const max = p.get('max');
    const pagStr = p.get('pagina');

    const tipo = this.resolver(p.get('tipo'), this.tipos() as string[], 'todos');
    const genero = this.resolver(p.get('genero'), ['Hombre', 'Mujer', 'Unisex'], 'todos');
    const marca = this.resolver(p.get('marca'), this.marcas(), 'todas');

    if (normalizar(this.q()) !== normalizar(q)) this.q.set(q);
    if (etiqueta !== (this.etiqueta() ?? '')) this.etiqueta.set(etiqueta || null);
    if (tipo !== this.tipo()) this.tipo.set(tipo as Tipo | 'todos');
    if (genero !== this.genero()) this.genero.set(genero as Genero | 'todos');
    if (marca !== this.marca()) this.marca.set(marca);
    if (orden && (this.orden() as string) !== orden) this.orden.set(orden as Orden);
    if (min !== null && Number(min) !== this.precioDesde()) this.precioDesde.set(Number(min));
    if (max !== null && Number(max) !== this.precioHasta()) this.precioHasta.set(Number(max));

    if (pagStr) {
      const pag = Number(pagStr);
      if (Number.isFinite(pag) && pag > 0) {
        this.pagina.set(pag);
      }
    }

    this.urlLeida.set(true);
  }

  /** Busca el valor real que corresponde al parametro, ignorando tildes y mayusculas. */
  private resolver(valor: string | null, opciones: string[], porDefecto: string): string {
    if (!valor) return porDefecto;
    const n = normalizar(valor);
    return opciones.find((o) => normalizar(o) === n) ?? porDefecto;
  }

  // ---- Paginacion ----
  readonly porPagina = 18;
  readonly pagina = signal(1);

  readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.resultados().length / this.porPagina))
  );

  readonly visibles = computed(() => {
    const desde = (this.pagina() - 1) * this.porPagina;
    return this.resultados().slice(desde, desde + this.porPagina);
  });

  /** Numeros de pagina: muestra 1, la ultima y hasta 2 alrededor de la actual. */
  readonly paginas = computed(() => {
    const total = this.totalPaginas();
    const act = this.pagina();
    const set = new Set<number>([1, total]);
    for (let i = act - 2; i <= act + 2; i++) if (i >= 1 && i <= total) set.add(i);
    const arr = [...set].sort((a, b) => a - b);
    return arr.map((n, i) => ({ n, hueco: i > 0 && n - arr[i - 1] > 1 }));
  });

  irA(n: number) {
    const val = Math.min(Math.max(1, n), this.totalPaginas());
    this.pagina.set(val);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.escribirUrl();
  }

  /** Agrega el decant más conveniente o el frasco completo sin salir del listado. */
  agregarRapido(p: Perfume) {
    if (this.esModoDecants() && p.volumenes.length > 0) {
      const v = mejorVolumen(p.volumenes);
      if (!v) return;
      this.cart.add({
        id: p.id,
        name: p.nombre,
        price: v.precioBs,
        detail: `Decant ${v.ml} ml`,
        img: p.imagenes[0],
        opciones: p.volumenes.map((x) => ({ ml: x.ml, precioBs: x.precioBs })),
      });
    } else if (p.completo?.precioBs && p.completo.precioBs > 0) {
      this.cart.add({
        id: p.id,
        name: p.nombre,
        price: p.completo.precioBs,
        detail: `Botella ${p.completo.ml || 100} ml`,
        img: p.imagenes[0],
      });
    } else if (p.volumenes.length > 0) {
      const v = mejorVolumen(p.volumenes);
      if (!v) return;
      this.cart.add({
        id: p.id,
        name: p.nombre,
        price: v.precioBs,
        detail: `Decant ${v.ml} ml`,
        img: p.imagenes[0],
        opciones: p.volumenes.map((x) => ({ ml: x.ml, precioBs: x.precioBs })),
      });
    } else {
      return;
    }
    this.agregadoId.set(p.id);
    if (this.agregadoTimer) clearTimeout(this.agregadoTimer);
    this.agregadoTimer = setTimeout(() => this.agregadoId.set(null), 1200);
  }

  rango(p: Perfume): string {
    if (p.volumenes.length < 2) return p.volumenes.length ? `${p.volumenes[0].ml} ml` : '';
    return `${p.volumenes[0].ml}–${p.volumenes[p.volumenes.length - 1].ml} ml`;
  }

  /** Los tamanos disponibles, en una linea: "6 · 10 · 20 ml". */
  tamanos(p: Perfume): string {
    return p.volumenes.map((v) => v.ml).join(' · ') + ' ml';
  }

  constructor() {
    // Escucha cambios de ruta entre /perfumes y /decants
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((e) => {
        const url = e.urlAfterRedirects || e.url;
        const modo = this.route.snapshot.data['soloDecants'] === true || url.startsWith('/decants');
        if (this.esModoDecants() !== modo) {
          this.esModoDecants.set(modo);
          this.limpiar();
        }
      });

    // La URL es la fuente de verdad de los filtros: entrar por ?q= o ?genero= funciona,
    // el atras del navegador tambien, y el enlace se puede compartir.
    // initialValue con el snapshot: garantiza un ParamMap real desde el primer
    // Los signals son la unica fuente de verdad. La URL es un espejo.
    // Al entrar por un link (?tipo=Arabe&genero=Mujer...) se lee la URL directo:
    // en el navegador desde location.search (sincronico) y en el servidor desde
    // el snapshot del router. Asi el filtro ya sale aplicado en el HTML.
    const inicial =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : this.route.snapshot.queryParamMap;
    this.aplicarParams(inicial);

    // Navegaciones posteriores: links del footer, buscador del header, atras.
    this.route.queryParamMap
      .pipe(skip(1), takeUntilDestroyed())
      .subscribe((p) => {
        this.aplicarParams(p);
      });

    let prevFiltros: string | null = null;
    effect(() => {
      const actual = `${this.q()}|${this.marca()}|${this.tipo()}|${this.genero()}|${this.orden()}|${this.precioDesde()}|${this.precioHasta()}|${this.etiqueta()}`;
      if (prevFiltros !== null && prevFiltros !== actual) {
        untracked(() => {
          if (this.pagina() !== 1) {
            this.pagina.set(1);
          }
        });
      }
      prevFiltros = actual;
    });

    effect(() => {
      // En el servidor la URL no se toca: eso es trabajo del navegador.
      if (typeof window === 'undefined') return;

      // Se leen los signals para quedar subscribed al efecto...
      void this.q();
      void this.marca();
      void this.tipo();
      void this.genero();
      void this.orden();
      void this.precioDesde();
      void this.precioHasta();
      void this.etiqueta();
      void this.pagina();

      // ...pero la escritura se aplaza: escribir en la URL en cada tecla
      // hacia volver el valor viejo al input mientras el usuario escribe.
      if (this.urlTimer) clearTimeout(this.urlTimer);
      this.urlTimer = setTimeout(() => this.escribirUrl(), 300);
    });

    // SEO: el catalogo cuenta los productos reales del filtro activo.
    effect(() => {
      const total = this.resultados().length;
      const desde = this.precioMinGlobal();
      const esDecants = this.esModoDecants();
      const ruta = esDecants ? '/decants' : '/perfumes';

      if (esDecants) {
        this.seo.aplicar({
          titulo: this.q().trim()
            ? `Decants “${this.q().trim()}” — ${total} resultado${total === 1 ? '' : 's'} | ${SITE.nombre}`
            : `Decants de Perfumes Originales (6, 10 y 20 ml) desde Bs ${desde} | ${SITE.nombre}`,
          descripcion:
            `Explora ${total} decants artesanales de perfumes originales en atomizadores de vidrio (6, 10 y 20 ml) desde Bs ${desde}. ` +
            `Prueba en tu piel antes del frasco completo. Envíos a toda Bolivia y pago contra entrega.`,
          imagen: SITE.imagen,
          ruta,
        });
      } else {
        this.seo.aplicar({
          titulo: this.q().trim()
            ? `“${this.q().trim()}” — ${total} resultado${total === 1 ? '' : 's'} | ${SITE.nombre}`
            : `${total} perfumes originales y decants | ${SITE.nombre}`,
          descripcion:
            `Catálogo completo con ${total} fragancias originales: frascos completos sellados y decants de prueba. ` +
            `Filtros por familia, marca y género. Envíos a toda Bolivia y pago contra entrega.`,
          imagen: SITE.imagen,
          ruta,
        });
      }
    });

    afterNextRender(() => {
      this.restaurarScrollGuardado();
    });
  }

  private restaurarScrollGuardado(): void {
    if (typeof window === 'undefined') return;
    try {
      const guardado = sessionStorage.getItem('elixir_catalogo_volver');
      if (!guardado) return;
      const estado = JSON.parse(guardado);
      sessionStorage.removeItem('elixir_catalogo_volver');

      if (!estado) return;

      // Esperar a que la vista hidratada renderice las tarjetas
      setTimeout(() => {
        if (estado.perfumeId) {
          const el = document.getElementById('perfume-' + estado.perfumeId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-[#C8A96A]', 'transition-all', 'duration-700');
            setTimeout(() => el.classList.remove('ring-2', 'ring-[#C8A96A]'), 2200);
            return;
          }
        }
        if (typeof estado.scrollY === 'number' && estado.scrollY > 0) {
          window.scrollTo({ top: estado.scrollY, behavior: 'smooth' });
        }
      }, 150);
    } catch {
      /* nada */
    }
  }
}