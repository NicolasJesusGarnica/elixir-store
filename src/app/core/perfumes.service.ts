import { Injectable, computed, inject, signal } from '@angular/core';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Genero, Perfume, precioMax, precioMin } from './perfume.model';
import { db } from './firebase';
import CATALOGO from '../../assets/perfumes.json';

const COLECCION = 'perfumes';
const CACHE_KEY = 'elixir_perfumes_cache_v2';

/**
 * Normaliza y sanea las marcas provenientes de Firestore o catálogo según el inventario oficial de Elixir.
 * Evita que nombres de líneas (como "9 PM", "Odyssey", "Turathi") suplanten a las casas reales (Afnan, Armaf, Rasasi).
 */
export function normalizarMarca(m: string | undefined, localMarca: string | undefined, nombre: string): string {
  const marca = (m ?? '').trim();
  const n = (nombre ?? '').toUpperCase();

  // 1. AFNAN (líneas 9 PM, 9 AM, Turathi, Historic Olmeda/Sahara, Supremacy)
  if (marca === '9 PM' || marca === '9PM' || marca === 'Turathi') return 'Afnan';
  if (
    n.startsWith('9 PM') ||
    n.startsWith('9 AM') ||
    n.startsWith('9PM') ||
    n.includes('TURATHI') ||
    n.includes('HISTORIC OLMEDA') ||
    n.includes('HISTORIC SAHARA') ||
    n.includes('SUPREMACY')
  ) {
    return 'Afnan';
  }

  // 2. ARMAF (líneas Odyssey, Club de Nuit, The Lions Club, Yum Yum)
  if (marca === 'Odyssey') return 'Armaf';
  if (
    n.startsWith('ODYSSEY') ||
    n.startsWith('CLUB DE NUIT') ||
    n.includes('THE LIONS CLUB') ||
    n.includes('YUM YUM ARMAF')
  ) {
    return 'Armaf';
  }

  // 3. RASASI (línea Hawas)
  if (marca === 'Armafate' || n.startsWith('HAWAS')) {
    return 'Rasasi';
  }

  // 4. GAME OF SPADES (Jo Milano Paris)
  if (n.includes('GAME OF SPADES')) {
    return 'Game of Spades';
  }

  // 5. EMPORIO ARMANI (Stronger With You / In Love With You)
  if (n.includes('STRONGER WITH YOU') || n.includes('IN LOVE WITH YOU')) {
    return 'Emporio Armani';
  }

  // 6. JESUS DEL POZO (Halloween)
  if (n.includes('HALLOWEEN') || n.includes('JESUS DEL POZO')) {
    return 'Jesus del Pozo';
  }

  // 7. AIR-VAL INTERNATIONAL (licencias infantiles Disney, Marvel, Nickelodeon)
  if (marca.startsWith('Av ') || marca.startsWith('T Av ') || marca === 'Shrek') {
    return 'Air-Val';
  }

  // 8. Normalizaciones menores
  if (marca === 'Jesus Del Pozo') return 'Jesus del Pozo';
  if (marca === 'Ralph Lauren' && localMarca === 'Ralph Lauren Polo') return 'Ralph Lauren Polo';

  return localMarca || marca || 'Elixir';
}

/**
 * Normaliza el género según la categorización oficial del inventario de Elixir.
 */
export function normalizarGenero(
  g: Genero | string | undefined,
  localGenero: Genero | string | undefined,
  nombre: string
): Genero {
  const n = (nombre ?? '').toUpperCase();

  // Unisex confirmados por inventario
  if (n.includes('9 AM DIVE 100') || n === '9 AM DIVE' || n.includes('AFNAN 9 AM DIVE')) return 'Unisex';
  if (n.includes('9 PM REBEL') || n.includes('9 PM ELIXIR') || n.includes('9AM (BEIGE)')) return 'Unisex';
  if (n.includes('TURATHI ELECTRIC') || n.includes('ELECTRIC TURATHI')) return 'Unisex';
  if (n.includes('HISTORIC OLMEDA') || n.includes('HISTORIC SAHARA') || n.includes('SUPREMACY IN OUD')) return 'Unisex';
  if (n.includes('ODYSSEY BAHAMAS') || n.includes('ODYSSEY EAU DE MONTAGNE') || n.includes('ODYSSEY GO MANGO')) return 'Unisex';
  if (n.includes('ERBA PURA') || n.includes('NAXOS') || n.includes('TORINO 21')) return 'Unisex';
  if (n.includes('TERIAQ') || n.includes('TERIAQ INTENSE') || n.includes('HAWAS ICE')) return 'Unisex';

  if (n.includes('GAME OF SPADES')) {
    if (n.includes('ALL IN') || n.includes('DOUBLE BONUS')) return 'Hombre';
    return 'Unisex';
  }

  // Hombre confirmados por inventario
  if (n.includes('GOLDEN SECRET')) return 'Hombre';

  // Mujer confirmados por inventario
  if (n.includes('ODYSSEY CANDEE') || n.includes('ODYSSEY LICHI')) return 'Mujer';
  if (n.includes('LA BOMBA C.H') || n.includes('NIKE YUMMMY MUSK')) return 'Mujer';

  const cand = (localGenero || g || 'Unisex') as string;
  if (cand === 'Niños' || cand === 'Bebé') return 'Unisex';
  if (cand === 'Hombre' || cand === 'Mujer' || cand === 'Unisex') return cand;
  return 'Unisex';
}

/**
 * Normaliza las URLs de Cloudflare R2 para asegurar que el navegador
 * solicite la versión recortada y proporcionada sin márgenes muertos (?v=2).
 */
function normalizarImagenes(imgs?: string[]): string[] {
  if (!imgs || !imgs.length) return [];
  return imgs.map((u) => {
    if (u && u.includes('pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev') && !u.includes('?v=')) {
      return `${u}?v=2`;
    }
    return u;
  });
}

/**
 * Lee de Firestore. Si la coleccion esta vacia o falla, usa el catalogo local
 * (src/assets/perfumes.json) para que la tienda nunca se quede en blanco.
 */
@Injectable({ providedIn: 'root' })
export class PerfumesService {
  private readonly todosSignal = signal<Perfume[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  /** Todos, incluyendo los dados de baja. La tienda usa productos(); el panel usa este. */
  readonly todos = this.todosSignal.asReadonly();

  /** Solo los visibles en la tienda. Filtra por activo. */
  readonly productos = computed(() => this.todosSignal().filter((p) => p.activo));

  readonly marcas = computed(() =>
    [...new Set(this.productos().map((p) => p.marca))].sort((a, b) => a.localeCompare(b))
  );
  readonly tipos = computed(() => [...new Set(this.productos().map((p) => p.tipo))]);
  readonly precioMin = computed(() => {
    // Solo precios reales: un producto sin decants tiene 0 y llevaria el minimo a cero.
    const precios = this.productos().map(precioMin).filter((n) => n > 0);
    return precios.length ? Math.min(...precios) : 0;
  });
  readonly precioMax = computed(() =>
    this.productos().length ? Math.max(...this.productos().map(precioMax)) : 0
  );

  constructor() {
    const catalogoInicial = (CATALOGO as Perfume[]).map((p) => ({
      ...p,
      marca: normalizarMarca(p.marca, p.marca, p.nombre),
      genero: normalizarGenero(p.genero, p.genero, p.nombre),
      imagenes: normalizarImagenes(p.imagenes),
    }));
    // En el navegador aplicamos inmediatamente la caché persistente local
    // para que el usuario NUNCA vea precios viejos por milésimas mientras Firestore responde.
    const catalogoConCache = this.cargarDesdeCache(catalogoInicial);
    this.todosSignal.set(catalogoConCache);
    this.cargando.set(false);
    void this.refrescar();
  }

  /** Consulta Firestore en segundo plano (solo navegador). */
  async refrescar(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const snap = await getDocs(collection(db(), COLECCION));
      if (!snap.empty) {
        const firestoreMap = new Map(snap.docs.map((d) => [d.id, d.data() as Partial<Perfume>]));

        // Guardar overrides en localStorage para inicio instantáneo sin parpadeo
        this.guardarEnCache(firestoreMap);

        // 1. Mapear todo el catálogo local asegurando que ningún perfume se pierda,
        // aplicando overrides de Firestore si ya fue editado en la base de datos.
        const combinados = (CATALOGO as Perfume[]).map((local) => {
          const remote = firestoreMap.get(local.id);
          if (!remote) {
            return {
              ...local,
              marca: normalizarMarca(local.marca, local.marca, local.nombre),
              genero: normalizarGenero(local.genero, local.genero, local.nombre),
              imagenes: normalizarImagenes(local.imagenes),
            };
          }
          const imgs = remote.imagenes?.length ? remote.imagenes : local.imagenes;
          return {
            ...local,
            ...remote,
            id: local.id,
            marca: normalizarMarca(remote.marca, local.marca, local.nombre),
            genero: normalizarGenero(remote.genero, local.genero, local.nombre),
            activo: remote.activo !== undefined ? remote.activo : local.activo,
            stock_inventario: remote.stock_inventario !== undefined ? remote.stock_inventario : local.stock_inventario,
            volumenes: remote.volumenes !== undefined ? remote.volumenes : local.volumenes,
            completo:
              remote.completo?.precioBs && remote.completo.precioBs > 0
                ? remote.completo
                : local.completo?.precioBs
                ? local.completo
                : (remote.completo ?? local.completo),
            acordes: local.acordes?.length ? local.acordes : (remote.acordes ?? []),
            notas: local.notas ?? remote.notas,
            clima: local.clima ?? remote.clima,
            imagenes: normalizarImagenes(imgs),
          } as Perfume;
        });

        // 2. Incluir cualquier perfume creado directamente en Firestore que no esté en el JSON
        const localIds = new Set((CATALOGO as Perfume[]).map((p) => p.id));
        for (const doc of snap.docs) {
          if (!localIds.has(doc.id)) {
            const data = doc.data() as Perfume;
            combinados.push({
              ...data,
              id: doc.id,
              marca: normalizarMarca(data.marca, undefined, data.nombre),
              genero: normalizarGenero(data.genero, undefined, data.nombre),
              activo: data.activo !== undefined ? data.activo : true,
              volumenes: data.volumenes ?? [],
              completo: data.completo ?? { ml: 100, precioBs: null },
              imagenes: normalizarImagenes(data.imagenes),
            });
          }
        }

        this.todosSignal.set(combinados);
      }
    } catch (e) {
      // El comprador nunca debe ver un codigo de Firestore. El catalogo local
      // ya esta cargado, asi que solo avisamos que los precios pueden estar desactualizados.
      console.warn('[Elixir] catalogo en vivo no disponible:', (e as { code?: string })?.code);
      this.error.set('Mostramos el catalogo guardado: los precios pueden estar desactualizados.');
    }
  }

  porId(id: string): Perfume | undefined {
    // Filtra por activo: un producto desactivado tiene que dar 404 aunque
    // alguien llegue con el link directo, si no se sigue pudiendo comprar.
    return this.productos().find((p) => p.id === id);
  }

  // ---- Escritura (bloqueada por reglas para quien no sea admin) ----

  async guardar(p: Perfume): Promise<void> {
    const { id, ...data } = p;
    await setDoc(doc(db(), COLECCION, id), data, { merge: true });
    this.upsertLocal(p);
    this.guardarItemEnCache(id, p);
    void this.syncLocalDev(id, p);
  }

  async actualizar(id: string, cambios: Partial<Perfume>): Promise<void> {
    await updateDoc(doc(db(), COLECCION, id), cambios as Record<string, unknown>);
    // Busca en la lista completa (no en productos()): si el producto esta
    // desactivado igual hay que refrescar la copia local al editarlo.
    const actual = this.todosSignal().find((p) => p.id === id);
    if (actual) {
      const nuevo = { ...actual, ...cambios };
      this.upsertLocal(nuevo);
      this.guardarItemEnCache(id, nuevo);
      void this.syncLocalDev(id, nuevo);
    }
  }

  async eliminar(id: string): Promise<void> {
    await deleteDoc(doc(db(), COLECCION, id));
    this.todosSignal.update((l) => l.filter((p) => p.id !== id));
    this.eliminarItemDeCache(id);
  }

  private upsertLocal(p: Perfume) {
    this.todosSignal.update((l) => {
      const i = l.findIndex((x) => x.id === p.id);
      if (i === -1) return [...l, p];
      const copy = [...l];
      copy[i] = p;
      return copy;
    });
  }

  /** Carga síncrona desde localStorage para 0ms de retraso y cero parpadeo al reiniciar */
  private cargarDesdeCache(catalogo: Perfume[]): Perfume[] {
    if (typeof window === 'undefined') return catalogo;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return catalogo;
      const cached = JSON.parse(raw) as Record<string, Partial<Perfume>>;
      return catalogo.map((local) => {
        const ov = cached[local.id];
        if (!ov) return local;
        return {
          ...local,
          ...ov,
          completo:
            ov.completo?.precioBs && ov.completo.precioBs > 0
              ? ov.completo
              : local.completo?.precioBs
              ? local.completo
              : (ov.completo ?? local.completo),
          volumenes: ov.volumenes ?? local.volumenes,
        };
      });
    } catch {
      return catalogo;
    }
  }

  private guardarEnCache(firestoreMap: Map<string, Partial<Perfume>>) {
    if (typeof window === 'undefined') return;
    try {
      const obj: Record<string, Partial<Perfume>> = {};
      for (const [id, data] of firestoreMap.entries()) {
        obj[id] = {
          completo: data.completo,
          volumenes: data.volumenes,
          activo: data.activo,
          stock_inventario: data.stock_inventario,
        };
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch {
      /* ignore */
    }
  }

  private guardarItemEnCache(id: string, p: Partial<Perfume>) {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const obj: Record<string, Partial<Perfume>> = raw ? JSON.parse(raw) : {};
      obj[id] = {
        ...(obj[id] ?? {}),
        completo: p.completo,
        volumenes: p.volumenes,
        activo: p.activo,
        stock_inventario: p.stock_inventario,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch {
      /* ignore */
    }
  }

  private eliminarItemDeCache(id: string) {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const obj: Record<string, Partial<Perfume>> = JSON.parse(raw);
      delete obj[id];
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch {
      /* ignore */
    }
  }

  /** En localhost sincroniza src/assets/perfumes.json en disco para que el SSR no sirva precios antiguos */
  private async syncLocalDev(id: string, cambios: Partial<Perfume>) {
    if (typeof window === 'undefined') return;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      try {
        await fetch('/api/sync-perfume-local', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, cambios }),
        });
      } catch {
        /* ignore dev sync error */
      }
    }
  }
}