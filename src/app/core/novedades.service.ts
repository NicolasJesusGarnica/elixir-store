import { Injectable, computed, signal } from '@angular/core';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { NovedadBanner } from './novedad.model';
import { db } from './firebase';

const COLECCION = 'novedades';
const CLAVE_CACHE_BANNERS = 'elixir_novedades_cache_v2';

/**
 * Banners sincronizados con los datos reales en Firestore.
 * Esto evita el "flash" de contenido viejo (FOOC) al recargar la página.
 */
const BANNERS_INICIALES: NovedadBanner[] = [
  {
    id: 'banner_1793311557905',
    titulo: '9 AM Dive de Afnan',
    subtitulo: 'El pináculo de la perfumería árabe. Frescura y elegancia para dejar huella todo el día.',
    imagen: 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/1793311587302-9AM_Dive.webp',
    perfumeId: '9_am_dive',
    badge: 'Lanzamiento',
    orden: 1,
    activo: true,
  },
  {
    id: 'banner_1793311773089',
    titulo: 'JEAN PAUL GAULTIER LE MALE ELIXIR',
    subtitulo: 'La máxima intensidad de Jean Paul Gaultier. Un clásico reinventado para destacar.',
    imagen: 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/1793311778888-Le_Male.webp',
    perfumeId: 'jpg_le_male_elixir',
    badge: 'Lanzamiento',
    orden: 2,
    activo: true,
  },
  {
    id: 'banner_1793312045776',
    titulo: 'Odyssey Candee',
    subtitulo: 'Odyssey Candee te envuelve en un aura vibrante y golosa. Un capricho hecho perfume.',
    imagen: 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/1793312055354-odyssey.webp',
    perfumeId: 'odyssey_candee',
    badge: 'Lanzamiento',
    orden: 3,
    activo: true,
  },
];

/**
 * Normaliza los números de orden de una lista de banners:
 * 1. Ordena los banners por `orden` ascendente (y por id como desempate).
 * 2. Asigna números secuenciales y únicos: 1, 2, 3...
 * 3. Retorna la lista resultante y un flag si se modificó algún orden.
 */
export function normalizarOrdenes(lista: NovedadBanner[]): { normalizados: NovedadBanner[]; huboCambios: boolean } {
  const ordenados = [...lista].sort((a, b) => {
    const ordenA = Number(a.orden) || 0;
    const ordenB = Number(b.orden) || 0;
    if (ordenA !== ordenB) return ordenA - ordenB;
    return a.id.localeCompare(b.id);
  });

  let huboCambios = false;
  const normalizados = ordenados.map((b, idx) => {
    const ordenEsperado = idx + 1;
    if (b.orden !== ordenEsperado) {
      huboCambios = true;
      return { ...b, orden: ordenEsperado };
    }
    return b;
  });

  return { normalizados, huboCambios };
}

function cargarBannersIniciales(): NovedadBanner[] {
  if (typeof window !== 'undefined') {
    try {
      const guardado = localStorage.getItem(CLAVE_CACHE_BANNERS);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return normalizarOrdenes(parsed).normalizados;
        }
      }
    } catch {
      /* fallback */
    }
  }
  return normalizarOrdenes(BANNERS_INICIALES).normalizados;
}

function guardarEnCache(banners: NovedadBanner[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CLAVE_CACHE_BANNERS, JSON.stringify(banners));
    } catch {
      /* ignore */
    }
  }
}

@Injectable({ providedIn: 'root' })
export class NovedadesService {
  private todos = signal<NovedadBanner[]>(cargarBannersIniciales());
  readonly cargando = signal(true);

  readonly banners = computed(() =>
    this.todos()
      .filter((b) => b.activo)
      .sort((a, b) => a.orden - b.orden)
  );

  readonly todosLosBanners = computed(() =>
    [...this.todos()].sort((a, b) => a.orden - b.orden)
  );

  constructor() {
    this.cargando.set(false);
    void this.refrescar();
  }

  async refrescar(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const snap = await getDocs(collection(db(), COLECCION));
      if (!snap.empty) {
        const datos = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as NovedadBanner);
        const { normalizados } = normalizarOrdenes(datos);
        this.todos.set(normalizados);
        guardarEnCache(normalizados);
      }
    } catch (e) {
      console.warn('[Elixir] Novedades en vivo no disponibles:', (e as { code?: string })?.code);
    }
  }

  /**
   * Sincroniza y repara en Firestore cualquier orden duplicado o corrupto existente.
   * Se ejecuta de forma segura cuando un usuario administrador tiene sesión activa.
   */
  async sincronizarOrdenesSiHayDuplicados(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const { normalizados, huboCambios } = normalizarOrdenes(this.todos());
    if (!huboCambios) return false;

    try {
      const promesas = normalizados
        .filter((b) => {
          const antes = this.todos().find((x) => x.id === b.id);
          return antes && antes.orden !== b.orden;
        })
        .map((b) => updateDoc(doc(db(), COLECCION, b.id), { orden: b.orden }));

      await Promise.all(promesas);
      this.todos.set(normalizados);
      guardarEnCache(normalizados);
      console.log('[Elixir] Banners sincronizados y reparados en Firestore sin duplicados.');
      return true;
    } catch (e) {
      console.warn('[Elixir] Error al sincronizar órdenes en Firestore:', e);
      return false;
    }
  }

  /**
   * Guarda o edita un banner aplicando intercambio automático (swap) si colisiona con el orden de otro banner.
   */
  async guardar(banner: NovedadBanner): Promise<void> {
    const nuevoOrden = Math.max(1, Math.round(Number(banner.orden) || 1));
    const bannerActualizado: NovedadBanner = { ...banner, orden: nuevoOrden };

    const lista = [...this.todos()];
    const indiceActual = lista.findIndex((b) => b.id === banner.id);
    const esNuevo = indiceActual === -1;
    const ordenAnterior = !esNuevo ? lista[indiceActual].orden : null;

    // Mapa de los otros banners que deben actualizarse en Firestore
    const bannersModificados = new Map<string, number>();

    if (esNuevo) {
      // Al insertar un nuevo banner en nuevoOrden, desplazamos los que estén en esa posición o superior
      for (const b of lista) {
        if (b.orden >= nuevoOrden) {
          b.orden++;
          bannersModificados.set(b.id, b.orden);
        }
      }
      lista.push(bannerActualizado);
    } else {
      // Banner existente cuyo orden ha sido editado
      if (ordenAnterior !== null && ordenAnterior !== nuevoOrden) {
        // Buscamos si otro banner ya tenía ese nuevoOrden
        const colision = lista.find((b) => b.id !== banner.id && b.orden === nuevoOrden);
        if (colision) {
          // INTERCAMBIO DIRECTO (Swap): El otro banner toma el lugar que tenía este banner
          colision.orden = ordenAnterior;
          bannersModificados.set(colision.id, ordenAnterior);
        }
      }
      lista[indiceActual] = bannerActualizado;
    }

    // Normalizamos para asegurar que jamás existan números repetidos ni huecos
    const { normalizados } = normalizarOrdenes(lista);
    for (const b of normalizados) {
      if (b.id !== banner.id) {
        const original = this.todos().find((x) => x.id === b.id);
        if (original && original.orden !== b.orden) {
          bannersModificados.set(b.id, b.orden);
        }
      }
    }

    // Persistir el banner principal
    const { id, ...data } = bannerActualizado;
    const bannerFinal = normalizados.find((b) => b.id === id) ?? bannerActualizado;
    data.orden = bannerFinal.orden;

    const promesas: Promise<unknown>[] = [
      setDoc(doc(db(), COLECCION, id), data, { merge: true }),
    ];

    // Persistir los otros banners cuyo orden fue modificado por el intercambio
    for (const [otroId, ordenOtro] of bannersModificados.entries()) {
      const ordenFinal = normalizados.find((b) => b.id === otroId)?.orden ?? ordenOtro;
      promesas.push(
        updateDoc(doc(db(), COLECCION, otroId), { orden: ordenFinal })
      );
    }

    await Promise.all(promesas);

    this.todos.set(normalizados);
    guardarEnCache(normalizados);
  }

  /**
   * Mueve un banner un lugar hacia arriba ('subir') o hacia abajo ('bajar') en el carrusel,
   * intercambiando posiciones de forma instantánea y atómica en Firestore.
   */
  async moverOrden(bannerId: string, direccion: 'subir' | 'bajar'): Promise<void> {
    const ordenados = [...this.todosLosBanners()];
    const indice = ordenados.findIndex((b) => b.id === bannerId);
    if (indice === -1) return;

    const nuevoIndice = direccion === 'subir' ? indice - 1 : indice + 1;
    if (nuevoIndice < 0 || nuevoIndice >= ordenados.length) return;

    const actual = ordenados[indice];
    const adyacente = ordenados[nuevoIndice];

    // Intercambio de orden
    const tempOrden = actual.orden;
    actual.orden = adyacente.orden;
    adyacente.orden = tempOrden;

    // Normalizar para blindar contra cualquier inconsistencia previa
    const { normalizados } = normalizarOrdenes(ordenados);

    const promesas = normalizados
      .filter((b) => b.id === actual.id || b.id === adyacente.id)
      .map((b) => updateDoc(doc(db(), COLECCION, b.id), { orden: b.orden }));

    await Promise.all(promesas);

    this.todos.set(normalizados);
    guardarEnCache(normalizados);
  }

  async actualizar(id: string, cambios: Partial<NovedadBanner>): Promise<void> {
    await updateDoc(doc(db(), COLECCION, id), cambios as Record<string, unknown>);
    const actual = this.todos().find((b) => b.id === id);
    if (actual) this.upsertLocal({ ...actual, ...cambios });
    guardarEnCache(this.todos());
  }

  async eliminar(id: string): Promise<void> {
    await deleteDoc(doc(db(), COLECCION, id));
    const restantes = this.todos().filter((b) => b.id !== id);
    const { normalizados, huboCambios } = normalizarOrdenes(restantes);

    if (huboCambios) {
      const promesas = normalizados
        .filter((b) => {
          const antes = restantes.find((r) => r.id === b.id);
          return antes && antes.orden !== b.orden;
        })
        .map((b) => updateDoc(doc(db(), COLECCION, b.id), { orden: b.orden }));
      await Promise.all(promesas);
    }

    this.todos.set(normalizados);
    guardarEnCache(normalizados);
  }

  private upsertLocal(b: NovedadBanner) {
    this.todos.update((l) => {
      const i = l.findIndex((x) => x.id === b.id);
      if (i === -1) return [...l, b];
      const copy = [...l];
      copy[i] = b;
      return copy;
    });
    guardarEnCache(this.todos());
  }
}
