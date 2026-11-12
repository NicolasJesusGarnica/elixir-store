import { Injectable, inject, signal } from '@angular/core';
import { PerfumesService } from './perfumes.service';
import { Perfume } from './perfume.model';
import { SOMMELIER_API_URL, SITE } from '../../environments';
import { CartService } from './cart.service';

export interface MensajeChat {
  id: string;
  rol: 'asistente' | 'usuario';
  texto: string;
  perfumes?: Perfume[];
  fecha: Date;
}

export interface GuiaOlfativa {
  titulo: string;
  subtitulo: string;
  prompt: string;
}

@Injectable({ providedIn: 'root' })
export class SommelierService {
  private perfumesSvc = inject(PerfumesService);
  private cartSvc = inject(CartService);

  readonly isOpen = signal(false);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly guiasOlfativas: GuiaOlfativa[] = [
    {
      titulo: 'Firmas Más Elogiadas',
      subtitulo: 'Creaciones maestras con mayor proyección y halagos',
      prompt: 'Recomiéndame las 2 fragancias más elogiadas y populares de la colección de Elixir.',
    },
    {
      titulo: 'Veladas, Ámbar & Noche',
      subtitulo: 'Notas cálidas, vainilla, maderas nobles y misterio',
      prompt: 'Busco una fragancia seductora, ambarada o amaderada para la noche con excelente duración en piel.',
    },
    {
      titulo: 'Frescura & Uso Diario',
      subtitulo: 'Cítricos limpios, brisa marina y elegancia sobria',
      prompt: 'Recomiéndame un perfume fresco, limpio y versátil para el día a día y trabajo formal.',
    },
    {
      titulo: 'Perfiles Gourmand & Dulces',
      subtitulo: 'Caramelo, praliné, canela, café y haba tonka',
      prompt: 'Me encantan las fragancias dulces, cálidas y golosas con vainilla o especias dulces.',
    },
  ];

  readonly mensajes = signal<MensajeChat[]>([
    {
      id: 'bienvenida',
      rol: 'asistente',
      texto:
        'Bienvenido a **Elixir Chat IA**.\n\nCuéntanos qué perfil aromático buscas o para qué ocasión vestirás tu fragancia, y te recomendaremos la firma ideal de nuestro catálogo.',
      fecha: new Date(),
    },
  ]);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  abrir(): void {
    this.isOpen.set(true);
  }

  cerrar(): void {
    this.isOpen.set(false);
  }

  reiniciar(): void {
    this.mensajes.set([
      {
        id: 'bienvenida_' + Date.now(),
        rol: 'asistente',
        texto:
          'Consulta reiniciada. ¿Qué aroma, ocasión o notas te gustaría explorar hoy?',
        fecha: new Date(),
      },
    ]);
    this.error.set(null);
  }

  /**
   * Genera el prompt de sistema inyectando el catálogo activo de Elixir.
   */
  private generarSystemPrompt(): string {
    const catalogo = this.perfumesSvc
      .productos()
      .map((p) => {
        const decantMin = p.volumenes[0] ? `Decant ${p.volumenes[0].ml}ml a Bs ${p.volumenes[0].precioBs}` : '';
        const acordes = (p.acordes ?? [])
          .map((a: any) => (typeof a === 'string' ? a : a.nombre))
          .filter(Boolean)
          .slice(0, 3)
          .join(', ');
        const notasClave = [
          ...(p.notas?.salida ?? []).slice(0, 2),
          ...(p.notas?.fondo ?? []).slice(0, 2),
        ].join(', ');
        const rasgos = [acordes ? `Acordes: ${acordes}` : '', notasClave ? `Notas: ${notasClave}` : ''].filter(Boolean).join(' | ');
        return `• ${p.nombre} (ID: ${p.id} | ${p.marca} | ${p.genero} | ${decantMin}${rasgos ? ' | ' + rasgos : ''})`;
      })
      .join('\n');

    return `Eres Elixir Chat IA, el Asesor Olfativo Inteligente de "Elixir Perfumería" en Potosí, Bolivia.

DIRECTIVAS ESTRICTAS DE RECOMENDACIÓN Y CANTIDAD:
1. REGLA DE CANTIDAD (ESTRICTAMENTE DE 1 A MÁXIMO 5 POR RESPUESTA):
   - Si el cliente pide una cantidad específica (ej. "dime 5 mejores", "dame 3 opciones", "recomiéndame 4 perfumes", etc.): recomienda EXACTAMENTE la cantidad pedida, con un límite máximo estricto de 5.
   - Si el cliente pide MÁS de 5 (ej. "dame 10", "dame 20", "dime 100", o "dame todos"): entrega ÚNICAMENTE los 5 mejores perfumes que cumplan su criterio. Al final puedes indicar brevemente: "Te presento las 5 mejores opciones; si deseas explorar 5 más, indícamelo con gusto."
   - Si el cliente NO especifica cantidad (ej. "qué me recomiendas para oficina?", "un perfume dulce"): sugiere de 2 a 3 opciones destacadas.
   - NUNCA excedas 5 perfumes en una sola respuesta.
   - Si el cliente pide "dame otros 5", "5 más" o continuar: recomienda 5 fragancias NUEVAS del catálogo que no hayas mencionado antes en la conversación.

2. CONCISIÓN Y ESTILO EDITORIAL (RESPUESTAS DIRECTAS Y SIN RELLENO):
   - Sé directo, sofisticado y conciso. Máximo 1 sola oración descriptiva por cada perfume.
   - NUNCA uses clichés robóticos ("¡Hola! Con gusto te ayudo ✨", "¡Excelente elección!", "Soy una IA") ni abuses de emojis.
   - Recomienda ÚNICAMENTE perfumes de la lista provista del catálogo real de Elixir.

3. ESTRUCTURA EXACTA DE LA RESPUESTA:
   - Una sola frase introductoria breve (máximo 15 palabras).
   - Una viñeta por cada perfume recomendado (hasta un máximo de 5 viñetas).
   - En CADA viñeta debes poner SIEMPRE el nombre en negrita con su identificador:
     • **Nombre del Perfume** [[PERFUME:id]]: Breve descripción de su acorde y notas principales en una sola oración.
   - Ejemplo de respuesta con 5 perfumes:
     "Para mujer con excelente perfil y precio accesible, te presento 5 opciones destacadas:
     • **Nike Trendy Pink** [[PERFUME:nike_trendy_pink]]: Acorde floral y frutal vibrante con un toque dulce juvenil muy fresco.
     • **Pepe L. Indulgence For Her** [[PERFUME:pepe_l_indulgence_for_her]]: Estela dulce y reconfortante de vainilla cálida y matices atalcados.
     • **Lattafa Yara Rosa** [[PERFUME:yara_rosa]]: Néctar gourmand de fresas con crema, helado de vainilla y almizcle suave.
     • **Guess Bella Vita** [[PERFUME:guess_bella_vita]]: Cereza ácida y flores blancas sobre un lecho de praliné y ámbar.
     • **Club De Nuit Woman** [[PERFUME:club_de_nuit_woman]]: Elegancia chipre floral con salida cítrica de naranja y rosa de mayo."

4. PROHIBIDO AGREGAR PÁRRAFOS FINALES SOBRE PRECIOS O COMPRAS:
   - No repitas precios ni hables de decants en el texto; las tarjetas interactivas con foto, precio en Bs y botón para añadir decant ya se generan automáticamente debajo de tu mensaje.

5. SI EL CLIENTE PREGUNTA POR UN PERFUME QUE NO ESTÁ EN EL CATÁLOGO:
   - Explica en una sola frase breve que no se encuentra disponible y ofrece de inmediato alternativas afines del catálogo con su respectiva etiqueta [[PERFUME:id]].

CATÁLOGO REAL DISPONIBLE EN ELIXIR PERFUMERÍA:
${catalogo}`;
  }

  /**
   * Envía la consulta a Google Gemini Flash.
   */
  async enviarMensaje(textoUsuario: string): Promise<void> {
    const limpio = textoUsuario.trim();
    if (!limpio || this.cargando()) return;

    // Agregar mensaje del usuario a la vista
    const msgUsuario: MensajeChat = {
      id: 'usr_' + Date.now(),
      rol: 'usuario',
      texto: limpio,
      fecha: new Date(),
    };
    this.mensajes.update((m) => [...m, msgUsuario]);
    this.cargando.set(true);
    this.error.set(null);

    try {
      // Preparar historial para la consulta (excluyendo bienvenida estática y mensajes previos)
      const historial = this.mensajes()
        .filter((m) => m.id !== 'bienvenida' && !m.id.startsWith('bienvenida_') && !m.id.startsWith('err_'))
        .map((m) => ({
          role: m.rol === 'asistente' ? 'model' : 'user',
          parts: [{ text: m.texto }],
        }));

      // Se consulta a través del proxy seguro del Worker en Cloudflare con timeout estricto de 6.5s
      const payload = {
        systemInstruction: {
          parts: [{ text: this.generarSystemPrompt() }],
        },
        contents: historial,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      let res: Response | null = null;
      try {
        res = await fetch(`${SOMMELIER_API_URL}?model=gemini-2.0-flash`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res || !res.ok) {
        const errJson = await res?.json().catch(() => ({}));
        const msg = errJson?.error?.message || (typeof errJson?.error === 'string' ? errJson.error : '') || `Error del servidor de IA (${res?.status || 504})`;
        throw new Error(msg);
      }

      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts ?? [];
      const textParts = parts.filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought);
      const rawText = textParts.map((p: { text: string }) => p.text).join('\n') || (parts[parts.length - 1]?.text ?? '');

      if (!rawText) {
        throw new Error('No se recibió respuesta del asistente.');
      }

      // Extraer perfumes recomendados mediante etiquetas [[PERFUME:id]] (máximo 5)
      const idsDetectados = [
        ...rawText.matchAll(/\[\[PERFUME:([a-zA-Z0-9_-]+)\]\]/g),
      ].map((m: RegExpMatchArray) => m[1]);

      const perfumesRecomendados: Perfume[] = [];
      for (const id of idsDetectados) {
        const prod = this.perfumesSvc.porId(id);
        if (prod && !perfumesRecomendados.some((p) => p.id === prod.id)) {
          perfumesRecomendados.push(prod);
          if (perfumesRecomendados.length >= 5) break;
        }
      }

      // Respaldo de detección inteligente: si la IA mencionó fragancias en **negrita**
      // pero omitió el tag [[PERFUME:id]], las vinculamos automáticamente en el orden mencionado
      if (perfumesRecomendados.length < 5) {
        const nombresEnNegrita = [...rawText.matchAll(/\*\*(.*?)\*\*/g)]
          .map((m) => m[1].trim().toLowerCase())
          .filter((n) => n.length > 2);

        const catalogo = this.perfumesSvc.productos();
        for (const negrita of nombresEnNegrita) {
          if (perfumesRecomendados.length >= 5) break;

          const match = catalogo.find((p) => {
            const pNombre = p.nombre.toLowerCase();
            return (
              pNombre === negrita ||
              pNombre.includes(negrita) ||
              negrita.includes(pNombre)
            );
          });

          if (match && !perfumesRecomendados.some((rec) => rec.id === match.id)) {
            perfumesRecomendados.push(match);
          }
        }
      }

      // Garantizar tope estricto de 5 fragancias en la interfaz
      if (perfumesRecomendados.length > 5) {
        perfumesRecomendados.length = 5;
      }

      // Limpiar las etiquetas del texto final visible
      const textoLimpio = rawText.replace(/\[\[PERFUME:[a-zA-Z0-9_-]+\]\]/g, '').trim();

      const msgBot: MensajeChat = {
        id: 'bot_' + Date.now(),
        rol: 'asistente',
        texto: textoLimpio,
        perfumes: perfumesRecomendados.length ? perfumesRecomendados : undefined,
        fecha: new Date(),
      };

      this.mensajes.update((m) => [...m, msgBot]);
    } catch (e) {
      console.warn('Sommelier AI en la nube temporalmente saturado; activando Curador Heurístico Local de Elixir:', e);
      // MOTOR DE CURADURÍA HEURÍSTICO LOCAL: NUNCA deja al cliente sin respuesta ni muestra errores
      const curacion = this.curaduriaHeuristica(limpio);
      const msgCurado: MensajeChat = {
        id: 'cur_' + Date.now(),
        rol: 'asistente',
        texto: curacion.texto,
        perfumes: curacion.perfumes.length ? curacion.perfumes : undefined,
        fecha: new Date(),
      };
      this.mensajes.update((m) => [...m, msgCurado]);
      this.error.set(null);
    } finally {
      this.cargando.set(false);
    }
  }

  /**
   * Motor de Curaduría Heurístico Local:
   * Actúa como respaldo infalible si la nube de Google Gemini o Cloudflare Worker
   * sufre saturaciones temporales (errores 503 / 524 / cuota).
   * Analiza semánticamente la intención del cliente contra el catálogo de 489 fragancias
   * y selecciona las mejores opciones reales con fotos, acordes y decants.
   */
  private curaduriaHeuristica(consulta: string): { texto: string; perfumes: Perfume[] } {
    const normalizado = consulta
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const catalogo = this.perfumesSvc.productos(); // Solo productos activos (410 fragancias)

    // Perfiles y ocasiones clave
    const esFresco = /fresc|limpi|citric|marin|acuatic|dia|diari|veran|calor|oficin|trabaj|versatil|formal|elegante/i.test(normalizado);
    const esNoche = /noche|fiest|cit[aa]|inviern|frio|seduct|ambar|cuero|mader|oscuro|misteri|club|salid/i.test(normalizado);
    const esDulce = /dulce|vainill|gourmand|caramel|chocolat|caf[eé]|tonka|postre|azucar/i.test(normalizado);
    const esFemenino = /mujer|dama|femenin|chica|senora/i.test(normalizado);
    const esMasculino = /hombre|caballero|masculin|chico/i.test(normalizado);
    const pideSet = /set|estuche|combo|kit/i.test(normalizado);

    // Sistema de afinidad olfativa con puntuación precisa
    const puntuados = catalogo.map((p) => {
      let score = 0;
      const acordesNombres = (p.acordes ?? []).map((a) => a.nombre.toLowerCase()).join(' ');
      const etiquetasTexto = (p.etiquetas ?? []).map((t) => t.toLowerCase()).join(' ');
      const pTexto = `${p.nombre} ${p.marca} ${p.tipo} ${etiquetasTexto} ${acordesNombres} ${p.descripcion ?? ''}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      // Penalizar sets si el usuario no los solicitó explícitamente
      if (!pideSet && /set|estuche|kit/i.test(p.nombre)) score -= 15;

      // Coincidencia estricta de género
      if (esFemenino && p.genero === 'Hombre') score -= 30;
      if (esMasculino && p.genero === 'Mujer') score -= 30;
      if (esFemenino && p.genero === 'Mujer') score += 6;
      if (esMasculino && p.genero === 'Hombre') score += 6;
      if ((esFemenino || esMasculino) && p.genero === 'Unisex') score += 3;

      // Coincidencia de marcas
      if (normalizado.includes(p.marca.toLowerCase())) score += 12;

      // Coincidencias léxicas en nombre o notas
      const palabras = normalizado.split(/\s+/).filter((w) => w.length > 3);
      for (const pal of palabras) {
        if (pTexto.includes(pal)) score += 2;
      }

      // Familias olfativas principales con contraste
      if (esFresco) {
        if (/fresc|citric|marin|acuatic|aromatic|bergamot|ambroxan|limon|vetiver/i.test(acordesNombres + ' ' + etiquetasTexto)) score += 8;
        if (/dulce|calido|gourmand/i.test(acordesNombres)) score -= 3; // Penalizar dulces en pedidos frescos
      }
      if (esNoche) {
        if (/ambar|amaderad|cuero|especiad|oud|tabaco|cardamom/i.test(acordesNombres + ' ' + etiquetasTexto)) score += 8;
      }
      if (esDulce) {
        if (/dulce|vainill|gourmand|tonka|caramel|praline/i.test(acordesNombres + ' ' + etiquetasTexto)) score += 8;
      }

      // Fragancias insignia con decants disponibles
      if (p.destacado) score += 3;
      if (p.volumenes?.length) score += 2;

      return { perfume: p, score };
    });

    puntuados.sort((a, b) => b.score - a.score);
    const seleccionados = puntuados.slice(0, 3).map((item) => item.perfume);

    let introduccion = '';
    if (esFresco) {
      introduccion = 'Para un perfil **fresco, limpio y versátil**, perfecto para el día a día y ambientes de trabajo formal, he seleccionado estas piezas maestras de nuestra colección con excelente duración y proyección sobria:';
    } else if (esNoche) {
      introduccion = 'Para ocasiones de **noche, eventos y presencia seductora**, estas firmas combinan acordes cálidos, maderas nobles y estela cautivadora:';
    } else if (esDulce) {
      introduccion = 'Para amantes de los acordes **dulces y golosos**, estas opciones destacan por su fondo de vainilla, praliné y calidez envolvente:';
    } else {
      introduccion = 'Basado en tu búsqueda, he seleccionado estas recomendaciones destacadas de nuestra curaduría oficial con máxima fijación y elogios:';
    }

    return { texto: introduccion, perfumes: seleccionados };
  }

  /**
   * Añade el decant más pequeño de un perfume directamente a la bolsa de compras.
   */
  agregarDecantABolsa(p: Perfume): void {
    const primerVol = p.volumenes[0];
    if (!primerVol) return;
    this.cartSvc.add({
      id: p.id,
      name: p.nombre,
      detail: `${primerVol.ml} ml`,
      price: primerVol.precioBs,
      img: p.imagenes[0],
      opciones: p.volumenes.map((v) => ({ ml: v.ml, precioBs: v.precioBs })),
    });
  }

  /**
   * Genera el enlace para continuar la consulta en WhatsApp con la asesora humana.
   */
  generarWhatsAppHandoff(): string {
    const ultimos = this.mensajes().slice(-3);
    const resumen = ultimos
      .map((m) => (m.rol === 'usuario' ? `Cliente: "${m.texto}"` : ''))
      .filter(Boolean)
      .join('\n');

    const texto = `Hola Elixir, estuve conversando con Elixir Chat IA en la web sobre:\n${resumen}\n\n¿Tienen disponible para coordinar mi pedido o envío?`;
    return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(texto)}`;
  }
}
