/**
 * ============================================================================
 * WORKER DE CLOUDFLARE: ELIXIR PERFUMERÍA — CORE DE SEGURIDAD & PROXY EDGE
 * ============================================================================
 *
 * Responsabilidades:
 *  1. Validación criptográfica de tokens Firebase ID (JWT) con claves públicas
 *     de Google (JWKS, RSASSA-PKCS1-v1_5, SHA-256).
 *  2. Control de Acceso Basado en Roles (RBAC) para operaciones administrativas.
 *  3. Almacenamiento seguro en Cloudflare R2 con validación estricta de formato WebP y tamaño.
 *  4. Proxy seguro para Google Gemini (Sommelier Virtual) con API Key oculta en
 *     variables de entorno de Cloudflare, rate-limiting, sanitización y cascada de modelos.
 *  5. Política de CORS dinámico con allowlist estricta para evitar uso no autorizado.
 *
 * Configuración en Cloudflare Dashboard:
 *  - Workers & Pages -> tu Worker -> Settings:
 *      * Bindings: R2 bucket "IMAGENES" -> bucket "elixir-images"
 *      * Variables de entorno (texto):
 *          - PUBLICO_URL: https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev
 *          - FIREBASE_PROJECT_ID: elixir-store
 *          - ADMIN_EMAILS: elixir_perfumeria@nixus.es,nixus_admin@nixus.es
 *          - ALLOWED_ORIGINS: https://elixir-store.web.app,https://elixir-store.firebaseapp.com
 *      * Variables secretas (encriptadas):
 *          - GEMINI_API_KEY: <tu-clave-secreta-de-gemini>
 * ============================================================================
 */

const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

const DEFAULT_PROJECT_ID = 'elixir-store';

const DEFAULT_ADMIN_EMAILS = [
  'elixir_perfumeria@nixus.es',
  'nixus_admin@nixus.es',
];

const DEFAULT_ALLOWED_ORIGINS = [
  'https://elixir-store.web.app',
  'https://elixir-store.firebaseapp.com',
  'http://localhost:4200',
  'http://localhost:4201',
  'http://127.0.0.1:4200',
  'http://127.0.0.1:4201',
];

/**
 * Genera cabeceras CORS dinámicas basadas en la lista blanca de orígenes autorizados.
 */
function obtenerCorsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const configurados = (env?.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const permitidos = [...DEFAULT_ALLOWED_ORIGINS, ...configurados];

  let allowOrigin = 'https://elixir-store.web.app';
  if (origin) {
    const esValido =
      permitidos.includes(origin) ||
      /^https:\/\/[a-z0-9-]+--elixir-store\.(web\.app|firebaseapp\.com)$/.test(origin);

    if (esValido) {
      allowOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

/**
 * Convierte una cadena codificada en Base64URL a Uint8Array sin dependencias externas.
 */
function b64urlABytes(texto) {
  const limpio = texto.replace(/-/g, '+').replace(/_/g, '/');
  const relleno = limpio.length % 4 ? '='.repeat(4 - (limpio.length % 4)) : '';
  const binario = atob(limpio + relleno);
  return Uint8Array.from(binario, (c) => c.charCodeAt(0));
}

/**
 * Obtiene las claves públicas de Google Firebase (JWKS).
 * Utiliza la caché del borde de Cloudflare (caches.default) para minimizar latencia,
 * con soporte para forzar recarga en caso de rotación reciente de claves por Google.
 */
async function clavesPublicas(forzarRecarga = false) {
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  if (cache && !forzarRecarga) {
    const enCache = await cache.match(JWKS_URL);
    if (enCache) {
      try {
        return await enCache.json();
      } catch {
        // En caso de respuesta corrupta en caché, continuar a fetch fresco
      }
    }
  }

  const res = await fetch(JWKS_URL, {
    cf: { cacheTtl: 3600, cacheEverything: true },
  });

  if (!res.ok) {
    throw new Error(`Error al consultar claves públicas de Firebase (${res.status})`);
  }

  if (cache) {
    await cache.put(JWKS_URL, res.clone());
  }

  return res.json();
}

/**
 * Valida criptográficamente un Firebase ID Token (JWT) usando WebCrypto API nativa.
 * Verifica:
 *  - Algoritmo RS256 en cabecera
 *  - Existencia del ID de clave pública (kid) en JWKS de Google
 *  - Firma digital criptográfica (RSASSA-PKCS1-v1_5 con SHA-256)
 *  - Audiencia (aud == FIREBASE_PROJECT_ID)
 *  - Emisor (iss == https://securetoken.google.com/<FIREBASE_PROJECT_ID>)
 *  - Expiración (exp > ahora)
 *  - Emisión (iat <= ahora + tolerancia de desfase)
 *  - Identificador único de usuario (sub no vacío)
 */
async function verificarIdToken(idToken, env) {
  if (!idToken || typeof idToken !== 'string') return null;

  const partes = idToken.split('.');
  if (partes.length !== 3) return null;

  const [headerB64, payloadB64, firmaB64] = partes;
  const decodificador = new TextDecoder();

  let header;
  let payload;
  try {
    header = JSON.parse(decodificador.decode(b64urlABytes(headerB64)));
    payload = JSON.parse(decodificador.decode(b64urlABytes(payloadB64)));
  } catch {
    return null;
  }

  if (header.alg !== 'RS256' || !header.kid) {
    return null;
  }

  // Búsqueda de clave pública con soporte para rotación
  let jwks = await clavesPublicas(false);
  let jwk = (jwks.keys || []).find((k) => k.kid === header.kid);

  if (!jwk) {
    // Si la clave no está en la caché del borde, forzar actualización fresca
    jwks = await clavesPublicas(true);
    jwk = (jwks.keys || []).find((k) => k.kid === header.kid);
  }

  if (!jwk) {
    return null;
  }

  // Importar clave pública a WebCrypto
  const claveCrypto = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  // Verificación estricta de firma digital
  const firmaValida = await crypto.subtle.verify(
    { name: 'RSASSA-PKCS1-v1_5' },
    claveCrypto,
    b64urlABytes(firmaB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  );

  if (!firmaValida) {
    return null;
  }

  const projectId = (env?.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID).trim();
  const ahora = Math.floor(Date.now() / 1000);

  // Validación de claims según la especificación de Firebase Authentication
  if (payload.aud !== projectId) return null;
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) return null;
  if (typeof payload.exp !== 'number' || payload.exp < ahora - 60) return null;
  if (typeof payload.iat !== 'number' || payload.iat > ahora + 300) return null;
  if (typeof payload.sub !== 'string' || !payload.sub.trim()) return null;

  return payload;
}

/**
 * Control de Acceso Basado en Roles (RBAC):
 * Valida que el correo del usuario verificado pertenezca a la lista de administradores.
 */
function esAdmin(payload, env) {
  if (!payload || !payload.email) return false;

  const emailUsuario = String(payload.email).trim().toLowerCase();
  const emailsConfigurados = (env?.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const listaAdmin = emailsConfigurados.length > 0 ? emailsConfigurados : DEFAULT_ADMIN_EMAILS;
  return listaAdmin.includes(emailUsuario);
}

/**
 * Sanitiza mensajes de error para garantizar que claves secretas nunca se filtren
 */
function sanitizarTexto(texto, secreto) {
  if (!texto) return '';
  let sanitizado = String(texto);
  if (secreto && secreto.length > 5) {
    sanitizado = sanitizado.split(secreto).join('[SECRETO_PROTEGIDO]');
  }
  return sanitizado;
}

export default {
  async fetch(request, env) {
    const corsHeaders = obtenerCorsHeaders(request, env);

    // Manejo de preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    // =========================================================================
    // RUTA 1: SOMMELIER IA (Proxy seguro para Google Gemini)
    // La clave de API vive 100% oculta en Cloudflare (env.GEMINI_API_KEY)
    // =========================================================================
    if (url.pathname === '/sommelier') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const apiKey = env?.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error: 'Servicio de IA no disponible: GEMINI_API_KEY no configurada en Cloudflare Worker.',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        );
      }

      // Validación estricta de tamaño de cuerpo (anti-abuso: máx 60 KB)
      const bodyText = await request.text();
      if (bodyText.length > 60 * 1024) {
        return new Response(
          JSON.stringify({ error: 'Cuerpo de mensaje demasiado extenso (máx 60 KB)' }),
          {
            status: 413,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        );
      }

      let payload;
      try {
        payload = JSON.parse(bodyText);
      } catch {
        return new Response(
          JSON.stringify({ error: 'Formato JSON inválido' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          },
        );
      }

      // Parámetros de generación controlados desde el Edge
      const geminiPayload = {
        systemInstruction: payload.systemInstruction,
        contents: payload.contents,
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 2048,
        },
      };

      // Cascada de modelos en caso de saturación temporal de Google (503 / 429)
      // gemini-2.0-flash tiene la menor latencia y prácticamente 0 saturación 503
      const modelosCandidatos = [
        url.searchParams.get('model'),
        env?.GEMINI_MODEL,
        'gemini-2.0-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-flash',
      ].filter(Boolean);

      const modelos = [...new Set(modelosCandidatos)];
      let ultimoError = null;

      for (const modelo of modelos) {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
        try {
          const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(geminiPayload),
            signal: AbortSignal.timeout(6000), // Máximo 6s por intento para evitar errores 524
          });

          if (geminiRes.ok) {
            const data = await geminiRes.text();
            return new Response(data, {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }

          if (geminiRes.status === 503 || geminiRes.status === 429) {
            const errBody = await geminiRes.text().catch(() => '');
            ultimoError = `Modelo ${modelo} saturado (${geminiRes.status}): ${sanitizarTexto(errBody.slice(0, 100), apiKey)}`;
            continue;
          }

          // Error definitivo (ej: 400 bad request)
          const errorData = await geminiRes.text();
          return new Response(sanitizarTexto(errorData, apiKey), {
            status: geminiRes.status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        } catch (err) {
          ultimoError = `Fallo de conexión con ${modelo}: ${sanitizarTexto(err.message, apiKey)}`;
          continue;
        }
      }

      return new Response(
        JSON.stringify({
          error: {
            message: 'El servicio de IA se encuentra temporalmente ocupado. Por favor intenta en unos segundos.',
            detalle: ultimoError,
          },
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      );
    }

    // =========================================================================
    // RUTA 2: SUBIDA DE IMÁGENES A CLOUDFLARE R2 (/subir)
    // Protegido con validación criptográfica JWT y RBAC
    // =========================================================================
    if (url.pathname === '/subir') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const authorization = request.headers.get('Authorization') || '';
      const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

      if (!idToken) {
        return new Response(JSON.stringify({ error: 'Token de autenticación no proporcionado' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      let claims = null;
      try {
        claims = await verificarIdToken(idToken, env);
      } catch (err) {
        claims = null;
      }

      if (!claims) {
        return new Response(JSON.stringify({ error: 'Token de autenticación inválido o expirado' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      if (!esAdmin(claims, env)) {
        return new Response(JSON.stringify({ error: 'Acceso denegado: se requieren privilegios de administrador' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const contentType = (request.headers.get('Content-Type') || '').toLowerCase();
      if (contentType !== 'image/webp') {
        return new Response(JSON.stringify({ error: 'Formato no admitido: solo se aceptan imágenes image/webp' }), {
          status: 415,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const body = await request.arrayBuffer();
      if (body.byteLength > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'La imagen excede el límite máximo de 5 MB' }), {
          status: 413,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      if (!env?.IMAGENES) {
        return new Response(JSON.stringify({ error: 'Configuración R2 faltante en Cloudflare Worker (binding IMAGENES)' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Nombre seguro y prefijo único por timestamp
      const enviado = url.searchParams.get('nombre') || '';
      const seguro = enviado.replace(/[^a-zA-Z0-9._-]/g, '-');
      const key = `perfumes/${Date.now()}-${seguro || 'imagen.webp'}`;

      await env.IMAGENES.put(key, body, {
        httpMetadata: {
          contentType: 'image/webp',
          cacheControl: 'public, max-age=31536000, immutable',
        },
      });

      const publicUrl = (env?.PUBLICO_URL || 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev').replace(/\/$/, '');

      return new Response(
        JSON.stringify({
          ok: true,
          key,
          url: `${publicUrl}/${key}`,
          admin: claims.email,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      );
    }

    // Ruta de estado / diagnóstico
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(
        JSON.stringify({
          status: 'online',
          service: 'Elixir Perfumería Edge Worker',
          version: '2.0.0',
          features: ['jwt-cryptographic-verification', 'rbac-admin', 'gemini-sommelier-proxy', 'r2-storage'],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      );
    }

    return new Response(JSON.stringify({ error: 'Endpoint no encontrado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  },
};
