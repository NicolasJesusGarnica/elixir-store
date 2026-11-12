import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../core/firebase';
import { PerfumesService } from '../core/perfumes.service';
import { Perfume, Volumen, AcordePrincipal, ClimaUso, obtenerColorAcorde } from '../core/perfume.model';
import { CartDrawer } from '../shared/cart-drawer';
import { ConfirmService } from '../core/confirm.service';
import { NovedadesService } from '../core/novedades.service';
import { NovedadBanner } from '../core/novedad.model';
import CATALOGO from '../../assets/perfumes.json';
import { ADMIN_EMAILS } from '../../environments';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, FormsModule, CartDrawer],
  templateUrl: './admin.html',
})
export class Admin implements OnDestroy {
  readonly svc = inject(PerfumesService);
  readonly novedadesSvc = inject(NovedadesService);
  readonly confirm = inject(ConfirmService);
  private router = inject(Router);

  readonly pestana = signal<'catalogo' | 'novedades'>('catalogo');

  user = signal<string | null>(null);
  email = '';
  pass = '';
  error = signal('');
  aviso = signal('');

  q = signal('');
  editando = signal<string | null>(null);
  borrador = signal<Perfume | null>(null);
  importando = signal(false);
  subiendo = signal(false);
  guardando = signal(false);

  constructor() {
    onAuthStateChanged(auth(), (u) => {
      const email = u?.email?.toLowerCase();
      if (email && ADMIN_EMAILS.some((adm) => adm.toLowerCase() === email)) {
        this.user.set(u!.email ?? null);
        void this.novedadesSvc.sincronizarOrdenesSiHayDuplicados();
      } else {
        this.user.set(null);
        if (u) {
          this.error.set('Acceso denegado: este correo no tiene permisos de administrador.');
          void signOut(auth());
        }
      }
    });
  }

  readonly lista = computed(() => {
    const t = this.q().trim().toLowerCase();
    const f = this.filtro();
    // Ojo: se usa todos(), no productos(). productos() ya viene filtrado por
    // activo, asi que el panel no podia ver (ni recuperar) lo que estaba dado
    // de baja y el chip "De baja" marcaba siempre 0.
    let l = [...this.svc.todos()];
    if (f === 'activos') l = l.filter((p) => p.activo);
    if (f === 'baja') l = l.filter((p) => !p.activo);
    if (f === 'nuevos') l = l.filter((p) => p.nuevo);
    if (f === 'destacados') l = l.filter((p) => p.destacado);
    if (f === 'sinPrecio') l = l.filter((p) => !p.volumenes.length && !p.completo?.precioBs);
    if (t) l = l.filter((p) => `${p.nombre} ${p.marca}`.toLowerCase().includes(t));
    return l;
  });

  readonly filtro = signal<'todos' | 'activos' | 'baja' | 'nuevos' | 'destacados' | 'sinPrecio'>('todos');

  readonly stats = computed(() => {
    const l = this.svc.todos();
    return {
      total: l.length,
      activos: l.filter((p) => p.activo).length,
      baja: l.filter((p) => !p.activo).length,
      nuevos: l.filter((p) => p.nuevo).length,
      destacados: l.filter((p) => p.destacado).length,
      sinPrecio: l.filter((p) => !p.volumenes.length && !p.completo?.precioBs).length,
    };
  });

  mostrarPass = signal(false);
  entrando = signal(false);
  honeypot = ''; // Trampa para bots: si tiene contenido, el envío se rechaza de inmediato.
  intentosFallidos = signal(0);
  segundosBloqueo = signal(0);
  private bloqueoTimer: ReturnType<typeof setInterval> | null = null;
  private inactividadTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy() {
    if (this.bloqueoTimer) clearInterval(this.bloqueoTimer);
    if (this.inactividadTimer) clearTimeout(this.inactividadTimer);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  reiniciarInactividad() {
    if (!this.user()) return;
    if (this.inactividadTimer) clearTimeout(this.inactividadTimer);
    // Cierre automático tras 25 minutos sin actividad
    this.inactividadTimer = setTimeout(() => {
      if (this.user()) {
        void this.cierrePorInactividad();
      }
    }, 25 * 60 * 1000);
  }

  private async cierrePorInactividad() {
    this.salirPermitido = true;
    await signOut(auth());
    this.user.set(null);
    this.error.set('Sesión finalizada por inactividad.');
  }

  private registrarFallo() {
    this.pass = '';
    this.intentosFallidos.update((n) => n + 1);
    if (this.intentosFallidos() >= 3) {
      this.iniciarBloqueo(45);
    }
  }

  private iniciarBloqueo(segundos: number) {
    this.segundosBloqueo.set(segundos);
    if (this.bloqueoTimer) clearInterval(this.bloqueoTimer);
    this.bloqueoTimer = setInterval(() => {
      this.segundosBloqueo.update((s) => {
        if (s <= 1) {
          if (this.bloqueoTimer) clearInterval(this.bloqueoTimer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async entrar() {
    this.error.set('');

    // 1. Bloqueo temporal por intentos fallidos
    if (this.segundosBloqueo() > 0) {
      this.error.set(`Acceso bloqueado por seguridad. Espera ${this.segundosBloqueo()}s para volver a intentar.`);
      return;
    }

    // 2. Trampa honeypot (bots y scripts de relleno automático)
    if (this.honeypot.trim().length > 0) {
      await new Promise((r) => setTimeout(r, 1200));
      this.error.set('Credenciales no válidas.');
      return;
    }

    if (!this.email || !this.pass) {
      this.error.set('Por favor completa tu correo y contraseña.');
      return;
    }

    // 3. Pre-validación local contra whitelist autorizada:
    // Si el correo no es administrador, NUNCA se contacta a Firebase (inmunidad contra enumeración de cuentas)
    const correoNormalizado = this.email.trim().toLowerCase();
    if (!ADMIN_EMAILS.some((adm) => adm.toLowerCase() === correoNormalizado)) {
      this.registrarFallo();
      this.error.set('Correo o contraseña incorrectos.');
      return;
    }

    this.entrando.set(true);
    try {
      await signInWithEmailAndPassword(auth(), correoNormalizado, this.pass);
      this.pass = '';
      this.intentosFallidos.set(0);
      this.reiniciarInactividad();
    } catch (e) {
      this.registrarFallo();
      const code = (e as { code?: string })?.code ?? 'desconocido';
      this.error.set(this.mensaje(code));
    } finally {
      this.entrando.set(false);
    }
  }

  private mensaje(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-email':
        return 'Correo o contraseña incorrectos.';
      case 'auth/operation-not-allowed':
      case 'auth/unsupported-first-login-method':
        return 'Habilitá el método Email/Password en Firebase → Authentication → Sign-in method.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Esperá unos minutos.';
      case 'auth/network-request-failed':
        return 'Error de red. Revisá tu conexión.';
      default:
        return `Error: ${code}`;
    }
  }

  salirPermitido = false;

  async salir() {
    const ok = await this.confirm.ask(
      '¿Seguro que querés salir del panel?',
      'Los cambios que no hayas guardado se perderán.',
    );
    if (!ok) return;
    this.salirPermitido = true;
    await signOut(auth());
    this.user.set(null);
    this.editando.set(null);
    this.borrador.set(null);
    this.error.set('');
    this.aviso.set('');
    this.email = '';
    this.pass = '';
    if (this.inactividadTimer) clearTimeout(this.inactividadTimer);
  }

  editar(p: Perfume) {
    this.editando.set(p.id);
    const clon = structuredClone(p);
    if (!clon.completo) {
      clon.completo = { ml: 100, precioBs: null };
    }
    if (!clon.volumenes) {
      clon.volumenes = [];
    }
    this.borrador.set(clon);
    this.etiquetasTexto.set((p.etiquetas ?? []).join(', '));
    this.notasTexto.set({
      salida: (p.notas?.salida ?? []).join(', '),
      corazon: (p.notas?.corazon ?? []).join(', '),
      fondo: (p.notas?.fondo ?? []).join(', '),
    });
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const el = document.getElementById('modal-perfume-body');
        if (el) el.scrollTop = 0;
      }, 10);
    }
  }

  readonly niveles = [
    { k: 'salida' as const, t: 'Notas de salida' },
    { k: 'corazon' as const, t: 'Corazón' },
    { k: 'fondo' as const, t: 'Base' },
  ];

  readonly etiquetasTexto = signal('');
  readonly notasTexto = signal<{ salida: string; corazon: string; fondo: string }>({
    salida: '',
    corazon: '',
    fondo: '',
  });

  private aLista(s: string): string[] {
    return s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  setEtiquetas(texto: string) {
    this.etiquetasTexto.set(texto);
    this.borrador.update((b) => (b ? { ...b, etiquetas: this.aLista(texto) } : b));
  }

  rmEtiqueta(e: string) {
    const b = this.borrador();
    if (!b) return;
    const etiquetas = (b.etiquetas ?? []).filter((x) => x !== e);
    this.etiquetasTexto.set(etiquetas.join(', '));
    this.borrador.set({ ...b, etiquetas });
  }

  setNota(k: 'salida' | 'corazon' | 'fondo', texto: string) {
    this.notasTexto.update((n) => ({ ...n, [k]: texto }));
    this.borrador.update((b) => {
      if (!b) return b;
      const lista = this.aLista(texto);
      const notas = { ...(b.notas ?? { salida: [], corazon: [], fondo: [] }), [k]: lista };
      const vacio = !notas.salida.length && !notas.corazon.length && !notas.fondo.length;
      return { ...b, notas: vacio ? undefined : notas };
    });
  }

  async cancelar() {
    const b = this.borrador();
    if (b) {
      const original =
        this.editando() === '__nuevo__'
          ? null
          : this.svc.productos().find((x) => x.id === b.id);

      const huboCambios = original
        ? JSON.stringify(original) !== JSON.stringify(b)
        : (b.nombre.trim() !== '' || b.marca.trim() !== '' || (b.imagenes && b.imagenes.length > 0));

      if (huboCambios) {
        const descartar = await this.confirm.ask(
          '¿Descartar cambios del perfume?',
          'Tienes modificaciones sin guardar en esta ficha. Si sales ahora, se perderán los cambios.'
        );
        if (!descartar) return;
      }
    }
    this.editando.set(null);
    this.borrador.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  toggleBorrador(campo: 'activo' | 'nuevo' | 'destacado') {
    this.borrador.update((b) => (b ? { ...b, [campo]: !b[campo] } : b));
  }

  hacerPortada(index: number) {
    this.borrador.update((b) => {
      if (!b || index <= 0 || index >= b.imagenes.length) return b;
      const imgs = [...b.imagenes];
      const [elegida] = imgs.splice(index, 1);
      imgs.unshift(elegida);
      return { ...b, imagenes: imgs };
    });
  }

  setCompleto(campo: 'ml' | 'precioBs', valor: string | number | null) {
    const b = this.borrador();
    if (!b) return;
    const completo = { ...(b.completo ?? { ml: 100, precioBs: null }) };
    if (campo === 'ml') {
      completo.ml = Number(valor) || 100;
    } else {
      const num = valor === '' || valor === null || valor === undefined ? null : Number(valor);
      completo.precioBs = num !== null && !isNaN(num) && num >= 0 ? num : null;
    }
    this.borrador.set({ ...b, completo });
  }

  toggleTieneCompleto(activar: boolean) {
    const b = this.borrador();
    if (!b) return;
    const completo = { ...(b.completo ?? { ml: 100, precioBs: null }) };
    if (activar) {
      if (completo.precioBs === null || completo.precioBs === undefined) {
        completo.precioBs = 0;
      }
    } else {
      completo.precioBs = null;
    }
    this.borrador.set({ ...b, completo });
  }

  setVol(i: number, campo: 'ml' | 'precioBs', valor: string) {
    const b = this.borrador();
    if (!b) return;
    const v: Volumen = { ...b.volumenes[i] };
    v[campo] = Number(valor);
    this.borrador.set({ ...b, volumenes: b.volumenes.map((x, j) => (j === i ? v : x)) });
  }

  addVolumen() {
    const b = this.borrador();
    if (!b) return;
    const usado = b.volumenes.map((v) => v.ml);
    const siguiente = [6, 10, 20, 30, 50, 100].find((ml) => !usado.includes(ml)) ?? 10;
    this.borrador.set({ ...b, volumenes: [...b.volumenes, { ml: siguiente, precioBs: 0 }] });
  }

  rmVolumen(i: number) {
    const b = this.borrador();
    if (!b) return;
    this.borrador.set({ ...b, volumenes: b.volumenes.filter((_, j) => j !== i) });
  }

  readonly obtenerColorAcorde = obtenerColorAcorde;

  agregarAcorde() {
    const b = this.borrador();
    if (!b) return;
    const acordes = b.acordes ? [...b.acordes] : [];
    acordes.push({ nombre: 'Nuevo Acorde', porcentaje: 70, color: '#FF384D' });
    this.borrador.set({ ...b, acordes });
  }

  rmAcorde(index: number) {
    const b = this.borrador();
    if (!b || !b.acordes) return;
    this.borrador.set({ ...b, acordes: b.acordes.filter((_, i) => i !== index) });
  }

  actualizarAcordeNombre(index: number, val: string) {
    const b = this.borrador();
    if (!b || !b.acordes || !b.acordes[index]) return;
    const acordes = [...b.acordes];
    const prev = acordes[index];
    const color = prev.color && prev.color !== '#8a6d42' ? prev.color : obtenerColorAcorde(val);
    acordes[index] = { ...prev, nombre: val, color };
    this.borrador.set({ ...b, acordes });
  }

  actualizarAcordePorcentaje(index: number, val: number | string) {
    const b = this.borrador();
    if (!b || !b.acordes || !b.acordes[index]) return;
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    const acordes = [...b.acordes];
    acordes[index] = { ...acordes[index], porcentaje: num };
    this.borrador.set({ ...b, acordes });
  }

  actualizarAcordeColor(index: number, color: string) {
    const b = this.borrador();
    if (!b || !b.acordes || !b.acordes[index]) return;
    const acordes = [...b.acordes];
    acordes[index] = { ...acordes[index], color };
    this.borrador.set({ ...b, acordes });
  }

  setClima(campo: keyof ClimaUso, val: number | string) {
    const b = this.borrador();
    if (!b) return;
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    const actual = b.clima ?? { invierno: 50, primavera: 50, verano: 50, otono: 50, dia: 50, noche: 50 };
    this.borrador.set({ ...b, clima: { ...actual, [campo]: num } });
  }

  /** Crea un producto en blanco listo para completar. */
  nuevo() {
    const b: Perfume = {
      id: '',
      nombre: '',
      marca: '',
      tipo: 'Diseñador',
      genero: 'Hombre',
      descripcion: '',
      etiquetas: [],
      notas: { salida: [], corazon: [], fondo: [] },
      acordes: [
        { nombre: 'Citrus', porcentaje: 100, color: '#DCA427' },
        { nombre: 'Aromatic', porcentaje: 80, color: '#558E77' },
        { nombre: 'Woody', porcentaje: 60, color: '#7E522F' },
      ],
      clima: { invierno: 30, primavera: 80, verano: 90, otono: 50, dia: 85, noche: 50 },
      imagenes: [],
      volumenes: [],
      completo: { ml: 100, precioBs: 0 },
      activo: true,
      nuevo: true,
      destacado: false,
    };
    this.editando.set('__nuevo__');
    this.borrador.set(b);
    this.etiquetasTexto.set('');
    this.notasTexto.set({ salida: '', corazon: '', fondo: '' });
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const el = document.getElementById('modal-perfume-body');
        if (el) el.scrollTop = 0;
      }, 10);
    }
  }

  slug(s: string): string {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }

  readonly R2_BASE = 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/';

  /** Worker de subida (worker/elixir-upload.js en Cloudflare). */
  private readonly WORKER_URL = 'https://delicate-snow-6226.njgarnicaz.workers.dev';

  /**
   * Sube imágenes a Cloudflare R2 con auto-conversión a .webp en el navegador.
   * Acepta JPG, PNG, WEBP, etc. Los convierte automáticamente en el cliente
   * antes de enviar para garantizar compresión ultra-rápida y cero peso excesivo.
   */
  async subirImagenes(event: Event) {
    const input = event.target as HTMLInputElement;
    const todos = Array.from(input.files ?? []);
    input.value = '';
    if (!todos.length) return;

    const imagenes = todos.filter((f) => f.type.startsWith('image/') || /\.(webp|jpg|jpeg|png|avif)$/i.test(f.name));
    if (!imagenes.length) {
      this.aviso.set('Solo se permiten archivos de imagen (JPG, PNG, WebP).');
      return;
    }

    const b = this.borrador();
    if (!b) return;

    this.subiendo.set(true);
    this.aviso.set(`Convirtiendo ${imagenes.length} imagen(es) a WebP de alta fidelidad…`);
    try {
      const usuario = auth().currentUser;
      if (!usuario) throw new Error('Tu sesión expiró. Volvé a iniciar sesión.');

      // Conversión automática en el cliente a .webp
      const filesWebp: File[] = [];
      for (const img of imagenes) {
        const webp = await convertirAWebp(img, 0.88, 1600);
        filesWebp.push(webp);
      }

      const urls = [...b.imagenes];

      for (const f of filesWebp) {
        const idToken = await getIdToken(usuario);
        const res = await fetch(`${this.WORKER_URL}/subir?nombre=${encodeURIComponent(f.name)}`, {
          method: 'POST',
          headers: { 'content-type': 'image/webp', authorization: `Bearer ${idToken}` },
          body: f,
        });
        if (res.status === 401) {
          throw new Error('No autorizado. Volvé a iniciar sesión en el panel.');
        }
        if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);
        urls.push(((await res.json()) as { url: string }).url);
      }
      this.borrador.set({ ...b, imagenes: urls });
      this.aviso.set(
        `✓ ${filesWebp.length} imagen(es) optimizadas a WebP y subidas a R2. Guardá para confirmar.`,
      );
    } catch (e) {
      this.aviso.set(`Error al subir: ${(e as Error).message}`);
    } finally {
      this.subiendo.set(false);
    }
  }


  /** Reemplaza las URLs locales (/assets/perfumes/x.webp) por las de Cloudflare R2. */
  async migrarUrlsR2() {
    this.migrando.set(true);
    try {
      let n = 0;
      for (const p of this.svc.todos()) {
        const nuevas = p.imagenes
          .filter((r) => r.includes('/assets/perfumes/'))
          .map((r) => this.R2_BASE + r.split('/').pop());
        if (nuevas.length && nuevas[0] !== p.imagenes[0]) {
          await this.svc.actualizar(p.id, { imagenes: nuevas });
          n++;
        }
      }
      this.aviso.set(`${n} productos apuntando a R2.`);
    } catch (e) {
      this.aviso.set(`Error: ${(e as { code?: string })?.code ?? 'desconocido'}`);
    } finally {
      this.migrando.set(false);
    }
  }

  readonly migrando = signal(false);

  /** Edita un precio desde la lista, sin abrir el editor. Guarda al salir del campo. */
  async guardarPrecio(p: Perfume, indice: number, valor: string) {
    const n = Number(valor);
    if (Number.isNaN(n) || n < 0) return;
    const volumenes = p.volumenes.map((v, i) => (i === indice ? { ...v, precioBs: n } : v));
    if (volumenes[indice].precioBs === p.volumenes[indice].precioBs) return;
    await this.svc.actualizar(p.id, { volumenes });
  }

  /** Al salir del campo de precio */
  blurPrecio(p: Perfume, indice: number, input: HTMLInputElement) {
    void this.guardarPrecio(p, indice, input.value);
  }

  /** Quantos campos de precio tiene el producto (para maquetar la fila) */
  precioEn(indice: number, total: number): number {
    return total - indice;
  }

  /** Quita una imagen del producto (no la borra de R2). */
  rmImagen(i: number) {
    this.borrador.update((b) => (b ? { ...b, imagenes: b.imagenes.filter((_, j) => j !== i) } : b));
  }


  async guardar() {
    const b = this.borrador();
    if (!b) return;
    const id = b.id || this.slug(b.nombre);
    if (!id) {
      this.aviso.set('Poné un nombre para generar el identificador.');
      return;
    }
    if (!b.imagenes.length) {
      this.aviso.set('Se guarda sin imagen. Podés subirla después desde Editar.');
    }
    this.guardando.set(true);
    try {
      this.aviso.set('Guardando cambios…');
      const volumenesValidos = (b.volumenes ?? [])
        .filter((x) => x.ml > 0 && typeof x.precioBs === 'number' && x.precioBs >= 0)
        .sort((x, y) => x.ml - y.ml);

      const completoValido = b.completo
        ? {
            ml: Number(b.completo.ml) || 100,
            precioBs:
              typeof b.completo.precioBs === 'number' && b.completo.precioBs > 0
                ? b.completo.precioBs
                : null,
          }
        : { ml: 100, precioBs: null };

      await this.svc.guardar({
        ...b,
        id,
        volumenes: volumenesValidos,
        completo: completoValido,
      });
      this.aviso.set(`✓ "${b.nombre}" guardado con éxito.`);
      this.editando.set(null);
      this.borrador.set(null);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    } catch (e) {
      this.aviso.set(`Error al guardar: ${(e as Error).message}`);
    } finally {
      this.guardando.set(false);
    }
  }

  async toggle(p: Perfume, campo: 'activo' | 'nuevo' | 'destacado') {
    await this.svc.actualizar(p.id, { [campo]: !p[campo] } as Partial<Perfume>);
  }

  async darDeBaja(p: Perfume) {
    await this.svc.actualizar(p.id, { activo: false });
    this.aviso.set(`"${p.nombre}" ha sido dado de baja (ya no aparece en la tienda).`);
    setTimeout(() => this.aviso.set(''), 3500);
  }

  async ponerEnTienda(p: Perfume) {
    await this.svc.actualizar(p.id, { activo: true });
    this.aviso.set(`✓ "${p.nombre}" publicado en la tienda con éxito.`);
    setTimeout(() => this.aviso.set(''), 3500);
  }

  async eliminar(p: Perfume) {
    if (!confirm(`¿Eliminar definitivamente "${p.nombre}" del catálogo?\n\nEsta acción borrará el perfume por completo de la base de datos.\nSi solo quieres pausarlo u ocultarlo de los clientes, usa "Dar de baja".`)) return;
    await this.svc.eliminar(p.id);
    this.aviso.set(`"${p.nombre}" fue eliminado del catálogo.`);
    setTimeout(() => this.aviso.set(''), 3500);
  }

  /**
   * Compara el catalogo local contra lo que hay ahora en Firestore para saber
   * exactamente que va a cambiar el importador. Sin esto, un clic pisa precios,
   * fotos o descripciones editadas en el panel sin avisar.
   */
  readonly diffImportacion = computed(() => {
    const actuales = new Map(
      this.svc.todos().map((p) => [p.id, p] as const),
    );

    const cambios: { nombre: string; campos: string[] }[] = [];

    for (const local of CATALOGO as Perfume[]) {
      const actual = actuales.get(local.id);
      if (!actual) {
        cambios.push({ nombre: local.nombre, campos: ['producto nuevo'] });
        continue;
      }

      const campos: string[] = [];
      if (actual.nombre !== local.nombre) campos.push('nombre');
      if (actual.descripcion !== local.descripcion) campos.push('descripción');
      if (JSON.stringify(actual.etiquetas ?? []) !== JSON.stringify(local.etiquetas ?? []))
        campos.push('etiquetas');
      if (JSON.stringify(actual.volumenes) !== JSON.stringify(local.volumenes))
        campos.push('precios');
      if ((actual.imagenes?.[0] ?? '') !== (local.imagenes?.[0] ?? '')) campos.push('imagen');
      if (actual.destacado !== local.destacado) campos.push('destacado');
      if (actual.nuevo !== local.nuevo) campos.push('nuevo');
      if (actual.activo !== local.activo) campos.push('activo');
      if (JSON.stringify(actual.acordes ?? []) !== JSON.stringify(local.acordes ?? []))
        campos.push('acordes');
      if (JSON.stringify(actual.clima ?? {}) !== JSON.stringify(local.clima ?? {}))
        campos.push('clima');

      if (campos.length) cambios.push({ nombre: local.nombre, campos });
    }

    return cambios;
  });

  /** Importa los 78 productos del catalogo local a Firestore. Pide confirmacion antes. */
  async importar() {
    const cambios = this.diffImportacion();

    if (!cambios.length) {
      this.aviso.set('No hay diferencias: Firestore ya coincide con el archivo local.');
      return;
    }

    // Resumen por tipo de campo, para que se vea el alcance de un vistazo.
    const porCampo = new Map<string, number>();
    for (const c of cambios) for (const campo of c.campos) {
      porCampo.set(campo, (porCampo.get(campo) ?? 0) + 1);
    }
    const resumen = [...porCampo.entries()]
      .map(([campo, n]) => `${n} en ${campo}`)
      .join(' · ');

    const ejemplos = cambios
      .slice(0, 6)
      .map((c) => `${c.nombre} (${c.campos.join(', ')})`)
      .join('\n');
    const resto = cambios.length > 6 ? `\n…y ${cambios.length - 6} más.` : '';

    const ok = await this.confirm.ask(
      `Se van a sobrescribir ${cambios.length} producto(s)`,
      `${resumen}\n\n${ejemplos}${resto}\n\nEsto reemplaza en Firestore lo que editaste desde el panel con el contenido del archivo local.`,
    );
    if (!ok) return;

    this.importando.set(true);
    try {
      const data = CATALOGO as Perfume[];
      const localIds = new Set(data.map((p) => p.id));
      const snap = await getDocs(collection(db(), 'perfumes'));
      const batchEliminar = writeBatch(db());
      let eliminados = 0;
      for (const d of snap.docs) {
        if (!localIds.has(d.id)) {
          batchEliminar.delete(d.ref);
          eliminados++;
        }
      }
      if (eliminados > 0) {
        await batchEliminar.commit();
      }

      const chunkSize = 400;
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const batch = writeBatch(db());
        for (const p of chunk) {
          const { id, ...rest } = p;
          // merge: true evita borrar campos que no vengan en el archivo.
          batch.set(doc(db(), 'perfumes', id), rest, { merge: true });
        }
        await batch.commit();
      }
      await this.svc.refrescar();
      this.aviso.set(`Importados ${data.length} productos oficiales del inventario.`);
    } catch (e) {
      this.aviso.set(`Error al importar: ${(e as { code?: string })?.code ?? 'desconocido'}`);
    } finally {
      this.importando.set(false);
    }
  }

  /* ==========================================================================
     GESTIÓN DE BANNERS DE NOVEDADES Y PROMOCIONES
     ========================================================================== */
  bannerBorrador = signal<NovedadBanner | null>(null);
  editandoBanner = signal<string | null>(null);
  guardandoBanner = signal(false);
  subiendoBannerImg = signal(false);

  nuevoBanner() {
    const total = this.novedadesSvc.todosLosBanners().length;
    const primerPerfume = this.svc.productos()[0]?.id ?? '';
    const b: NovedadBanner = {
      id: 'banner_' + Date.now(),
      titulo: '',
      subtitulo: '',
      imagen: '',
      perfumeId: primerPerfume,
      badge: 'Lanzamiento',
      orden: total + 1,
      activo: true,
    };
    this.editandoBanner.set('__nuevo__');
    this.bannerBorrador.set(b);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const el = document.getElementById('modal-banner-body');
        if (el) el.scrollTop = 0;
      }, 10);
    }
  }

  editarBanner(b: NovedadBanner) {
    this.editandoBanner.set(b.id);
    this.bannerBorrador.set(structuredClone(b));
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const el = document.getElementById('modal-banner-body');
        if (el) el.scrollTop = 0;
      }, 10);
    }
  }

  async cancelarBanner() {
    const b = this.bannerBorrador();
    if (b) {
      const original =
        this.editandoBanner() === '__nuevo__'
          ? null
          : this.novedadesSvc.todosLosBanners().find((x) => x.id === b.id);

      const huboCambios = original
        ? JSON.stringify(original) !== JSON.stringify(b)
        : (b.titulo.trim() !== '' || b.imagen.trim() !== '');

      if (huboCambios) {
        const descartar = await this.confirm.ask(
          '¿Descartar cambios del póster?',
          'Tienes modificaciones sin guardar en esta ventana. Si sales ahora, se perderán los cambios.'
        );
        if (!descartar) return;
      }
    }
    this.editandoBanner.set(null);
    this.bannerBorrador.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  async guardarBanner() {
    const b = this.bannerBorrador();
    if (!b) return;
    if (!b.titulo.trim()) {
      this.aviso.set('Por favor ingresá un título para el póster de novedad.');
      return;
    }
    if (!b.imagen.trim()) {
      this.aviso.set('Por favor subí una imagen o pegá la URL del póster.');
      return;
    }
    if (!b.perfumeId) {
      this.aviso.set('Por favor seleccioná el perfume de destino para el clic.');
      return;
    }

    this.guardandoBanner.set(true);
    try {
      await this.novedadesSvc.guardar(b);
      this.aviso.set(`✓ Banner "${b.titulo}" guardado exitosamente.`);
      this.editandoBanner.set(null);
      this.bannerBorrador.set(null);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    } catch (e) {
      this.aviso.set(`Error al guardar banner: ${(e as Error).message}`);
    } finally {
      this.guardandoBanner.set(false);
    }
  }

  async toggleBannerActivo(b: NovedadBanner) {
    await this.novedadesSvc.actualizar(b.id, { activo: !b.activo });
  }

  async moverBanner(b: NovedadBanner, direccion: 'subir' | 'bajar') {
    try {
      await this.novedadesSvc.moverOrden(b.id, direccion);
      this.aviso.set(`✓ Orden de "${b.titulo}" actualizado.`);
    } catch (e) {
      this.aviso.set(`Error al cambiar orden: ${(e as Error).message}`);
    }
  }

  esPrimerBanner(b: NovedadBanner): boolean {
    const banners = this.novedadesSvc.todosLosBanners();
    return banners.length > 0 && banners[0].id === b.id;
  }

  esUltimoBanner(b: NovedadBanner): boolean {
    const banners = this.novedadesSvc.todosLosBanners();
    return banners.length > 0 && banners[banners.length - 1].id === b.id;
  }

  bannerEnConflicto(idActual: string | undefined, orden: number | string | undefined): NovedadBanner | null {
    if (!orden) return null;
    const num = Number(orden);
    if (!num || num < 1) return null;
    const actual = this.novedadesSvc.todosLosBanners().find((b) => b.id === idActual);
    if (actual && actual.orden === num) return null;
    return this.novedadesSvc.todosLosBanners().find((b) => b.id !== idActual && b.orden === num) ?? null;
  }

  getOrdenOriginal(id: string | undefined): number {
    if (!id || id === '__nuevo__') return this.novedadesSvc.todosLosBanners().length + 1;
    const original = this.novedadesSvc.todosLosBanners().find((b) => b.id === id);
    return original ? original.orden : 1;
  }

  async eliminarBanner(b: NovedadBanner) {
    const ok = await this.confirm.ask(
      `¿Eliminar el póster "${b.titulo}"?`,
      'Dejará de mostrarse en la sección de Novedades.'
    );
    if (!ok) return;
    try {
      await this.novedadesSvc.eliminar(b.id);
      this.aviso.set(`Banner "${b.titulo}" eliminado.`);
    } catch (e) {
      this.aviso.set(`Error al eliminar: ${(e as Error).message}`);
    }
  }

  async subirImagenBanner(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const b = this.bannerBorrador();
    if (!b) return;

    this.subiendoBannerImg.set(true);
    this.aviso.set('Optimizando póster y convirtiendo a WebP…');
    try {
      const fileWebp = await convertirAWebp(file, 0.90, 2048);
      const usuario = auth().currentUser;
      if (!usuario) throw new Error('Tu sesión expiró. Volvé a iniciar sesión.');
      const idToken = await getIdToken(usuario);

      const res = await fetch(`${this.WORKER_URL}/subir?nombre=${encodeURIComponent(fileWebp.name)}`, {
        method: 'POST',
        headers: { 'content-type': 'image/webp', authorization: `Bearer ${idToken}` },
        body: fileWebp,
      });

      if (!res.ok) throw new Error(`El servidor de subida respondió ${res.status}`);
      const data = (await res.json()) as { url: string };
      this.bannerBorrador.set({ ...b, imagen: data.url });
      this.aviso.set('✓ Póster convertido a WebP y subido exitosamente.');
    } catch (e) {
      this.aviso.set(`Error al subir imagen del póster: ${(e as Error).message}`);
    } finally {
      this.subiendoBannerImg.set(false);
    }
  }

  getNombrePerfume(id: string): string {
    // todos(): un banner puede apuntar a un producto dado de baja y hay que
    // poder mostrar su nombre igual en el panel.
    const p = this.svc.todos().find((x) => x.id === id);
    return p ? `${p.marca} · ${p.nombre}` : id;
  }
}

/**
 * Convierte cualquier imagen (JPG, PNG, JPEG, AVIF) a formato .webp de alta calidad en el navegador.
 * Reduce el peso drásticamente antes de enviar a Cloudflare R2 sin perder calidad visual.
 */
async function convertirAWebp(archivo: File, calidad = 0.88, maxDimension = 1600): Promise<File> {
  // Si ya es webp y pesa menos de 3MB, no hace falta reprocesar
  if (archivo.type === 'image/webp' && archivo.size < 3 * 1024 * 1024) {
    return archivo;
  }

  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(archivo);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(archivo);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(archivo);
              return;
            }
            const nombreSinExt = archivo.name.replace(/\.[^/.]+$/, '');
            const nuevoArchivo = new File([blob], `${nombreSinExt}.webp`, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(nuevoArchivo);
          },
          'image/webp',
          calidad
        );
      };
      img.onerror = () => resolve(archivo);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(archivo);
    reader.readAsDataURL(archivo);
  });
}