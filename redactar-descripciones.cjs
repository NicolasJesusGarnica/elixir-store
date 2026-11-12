const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/njgar/Desktop/Proyectos/Elixir_Perfumeria/elixir-store';
const CAT = path.join(ROOT, 'src/assets/perfumes.json');
const data = JSON.parse(fs.readFileSync(CAT, 'utf8'));

const D = {
  // ---- 9 PM / 9 AM (Afnan) ----
  '9_am_dive': {
    d: 'La version fresca de la linea 9: naranja y pomelo en la salida, con un corazon aromatico limpio y un fondo de madera clara y almizcle. Liviana, citrica y perfecta para el dia.',
    e: ['Fresco', 'Citrico', 'Diurno'],
  },
  '9_pm_black': {
    d: 'De la familia 9 PM, la mas cargada en sombra: dulce oscuro con vetiver y un fondo de cuero. Presencia fuerte sin volverse empalagosa.',
    e: ['Dulce', 'Vetiver', 'Nocturno', 'Intenso'],
  },
  '9_pm_elixir': {
    d: 'Un elixir de la casa Afnan: vainilla y un fondo ambarado denso, con un corazon de canela. Dulce, envolvente y con muy buena fijacion.',
    e: ['Vainilla', 'Ambar', 'Especiado', 'Dulce'],
  },
  '9pm_rebel': {
    d: 'La version mas rebelde de la linea 9: vainilla y un fondo de cuero y madera oscura, con un toque aromatico penetrante.',
    e: ['Cuero', 'Vainilla', 'Intenso', 'Masculino'],
  },
  '9_pm_night_out': {
    d: 'Pensada para la noche: dulce con toque afrutado y un fondo ambarado denso. Mucha presencia, con ese perfil envolvente que dura horas.',
    e: ['Dulce', 'Ambar', 'Nocturno', 'Intenso'],
  },

  // ---- Armafate Hawas ----
  hawas_tropical: {
    d: 'Tropical y azucarado: pina y frutas del tropico en la salida, con un fondo de madera y almizcle. Divertido y muy llevable.',
    e: ['Tropical', 'Frutal', 'Dulce'],
  },
  hawas_malibu: {
    d: 'Version mas dulce de la familia Hawas: un acorde de coco y fruta tropical sobre una base clara y arbolada.',
    e: ['Coco', 'Tropical', 'Dulce', 'Fresco'],
  },
  hawas_kobra: {
    d: 'Hawas con mas caracter: frutal agresivo y un fondo ambarado que le da cuerpo. Rico en la secuela.',
    e: ['Frutal', 'Ambar', 'Intenso'],
  },
  hawas_verde: {
    d: 'La mas vegetal de la gama: notas verdes y frescas con un toque frutal y un fondo limpio. Para quien busca algo sin dulce.',
    e: ['Verde', 'Fresco', 'Vegetal'],
  },
  hawas_for_him: {
    d: 'Hawas en version masculina: citrico aromatico, fresco y limpio, con un fondo de madera. El companion del Hawas clasico.',
    e: ['Fresco', 'Citrico', 'Aromatico'],
  },
  hawas_fire: {
    d: 'La mas caliente de la familia: especiado y dulce, con un fondo denso de madera y ambar.',
    e: ['Especiado', 'Ambar', 'Nocturno'],
  },

  // ---- Bharara ----
  bharara_king: {
    d: 'El rey de la familia: un oriental dulce y dominante, con un fondo ambarado y de vainilla que lo hace sentir con presencia constante.',
    e: ['Oriental', 'Dulce', 'Intenso', 'Ambar'],
  },

  // ---- Azzaro ----
  azzaro_tmw_edp_intense: {
    d: 'Version mas intensa del Wanted: canela y cardamomo bien marcados, cerrando con tonka y cedro. Dulce especiado con mucha difusion.',
    e: ['Canela', 'Especiado', 'Dulce', 'Intenso'],
  },

  // ---- Ariana Grande ----
  ag_thank_u_next: {
    d: 'Un gourmand fresco con melocoton y un corazon de peonia, sobre almizcle y madera. Divertido, limpio y muy usual.',
    e: ['Melocoton', 'Dulce', 'Fresco', 'Gourmand'],
  },
  ag_mood_blush: {
    d: 'Rosa y fresa: entrada de fresa y peonia, con un fondo de almizcle y vainilla. Femenino, dulce y muy facil de usar.',
    e: ['Fresa', 'Floral', 'Dulce', 'Femenino'],
  },
  ag_god_is_a_woman: {
    d: 'Mandarina y melocoton en la salida, peonia y jazmin en el corazon, y una base de vainilla de Madagascar con cashmeran. Dulce y con cara de hogar.',
    e: ['Vainilla', 'Melocoton', 'Floral', 'Dulce'],
  },
  ag_sweet_like_candy: {
    d: 'El mas dulce de la linea: caramelo y pralina sobre una base de vainilla y tonka. Gourmand puro, sin una gota amarga.',
    e: ['Caramelo', 'Pralina', 'Dulce', 'Gourmand'],
    n: { salida: ['Caramelo'], corazon: ['Pralina'], fondo: ['Vainilla', 'Tonka'] },
  },
  ag_ari: {
    d: 'Vainilla de Madagascar como protagonista, con ambrette, cashmeran y almizcle. Dulce y suave, con un fondo muy limpio.',
    e: ['Vainilla', 'Suave', 'Dulce', 'Invierno'],
    n: { salida: ['Naranja', 'Bergamota'], corazon: ['Jazmin', 'Almizcle'], fondo: ['Vainilla de Madagascar', 'Cashmeran', 'Ambrette'] },
  },
  ag_moonlight: {
    d: 'Gourmand de noche: pralina y vainilla sobre un fondo de almizcle y madera. Dulce sin ser invasivo.',
    e: ['Pralina', 'Vainilla', 'Dulce', 'Invierno'],
  },

  // ---- Antonio Banderas ----
  ab_queen_of_seduction: {
    d: 'Un oriental especiado para mujer: canela y clavo en la entrada, un corazon de jazmin y un fondo de vainilla y pachuli. seductor por definicion.',
    e: ['Especiado', 'Oriental', 'Femenino', 'Ambar'],
  },
  ab_icon_men_edt: {
    d: 'La version mas ligera de Icon: citrico aromatico con un fondo limpio de madera y algodon. Para el dia a dia.',
    e: ['Fresco', 'Citrico', 'Aromatico', 'Diurno'],
  },
  ab_icon_men_edp: {
    d: 'Mas concentrado y con mas cuerpo que el EDT: aromatico-frutal con un fondo de vetiver y madera.',
    e: ['Aromatico', 'Frutal', 'Vetiver'],
  },
  ab_golden_secret: {
    d: 'Dulce y con peso: vainilla y caramelo sobre un fondo de ambar y cedro. Calido y con muy buena fijacion.',
    e: ['Vainilla', 'Caramelo', 'Ambar', 'Dulce'],
  },
  ab_blue: {
    d: 'Blue Seduction en version concentrada: mar fresco y mentolado, con un fondo aquatico seco y un toque ambarado.',
    e: ['Acuatico', 'Fresco', 'Mentolado'],
    n: { salida: ['Menta', 'Toronja'], corazon: ['Lavanda', 'Salvia'], fondo: ['Ambar', 'Madera'] },
  },

  // ---- Pepe Jeans ----
  pepe_l_indulgence_for_her: {
    d: 'Un gourmand dulce: caramelo, vainilla y flores blancas sobre un fondo limpio. Divertido y juvenil.',
    e: ['Dulce', 'Caramelo', 'Floral', 'Femenino'],
  },

  // ---- Odyssey ----
  odyssey_eau_de_montagne: {
    d: 'Agua de montana: citrico y verde, con un fondo de madera blanca. Fresco y limpio como un amanecer en la sierra.',
    e: ['Fresco', 'Citrico', 'Acuatico'],
  },
  odyssey_bahamas: {
    d: 'Tropical y dulce: coco y fruta amarilla con un fondo ambarado. Un viaje de vacaciones todo el ano.',
    e: ['Coco', 'Tropical', 'Dulce'],
  },
  odyssey_go_mango: {
    d: 'Mango maduro como protagonista, con un fondo de vainilla y un toque ambarado. Dulce y carnoso.',
    e: ['Mango', 'Frutal', 'Dulce'],
  },
  odyssey_mandarin_sky_vintage: {
    d: 'Citrico luminoso con un toque vintage: mandarina, bergamota y un fondo limpio de madera. Fresco y sin estridencias.',
    e: ['Citrico', 'Fresco', 'Vintage'],
  },
  odyssey_mandarin_sky_elixir: {
    d: 'La version mas densa de la linea: mandarina y naranja sobre una base de vainilla y madera. Entre fresco y dulce.',
    e: ['Mandarina', 'Dulce', 'Fresco'],
  },
  odyssey_spectra: {
    d: 'Moderno y aromatico: un fresco afrutado con fondo de musgo blanco y madera.',
    e: ['Fresco', 'Aromatico', 'Moderno'],
  },
  odyssey_homme_white: {
    d: 'Hombre-blanco: muy limpio, citrico y luminoso, con un fondo suave y algodon. Para el calor.',
    e: ['Fresco', 'Citrico', 'Limpio', 'Diurno'],
  },
  odyssey_auod: {
    d: 'Un fresco aromatico con presencia: herbs verdes y un fondo ambarado suave.',
    e: ['Aromatico', 'Verde', 'Fresco'],
  },
  odyssey_candee: {
    d: 'Dulce y suave: caramelo y vainilla con un fondo de musgo y madera. Sin ser invasivo.',
    e: ['Dulce', 'Suave', 'Vainilla'],
  },
  odyssey_lichi: {
    d: 'Frutal dulce: lichi y fresa fresca con un fondo de algodon y almizcle. Ligero y con frescura.',
    e: ['Frutal', 'Fresco', 'Dulce'],
  },

  // ---- Nike ----
  nike_150: {
    d: 'Frutal fresco: manzana y mandarina con un fondo limpio. El perfume del dia a dia.',
    e: ['Frutal', 'Fresco', 'Diurno'],
  },
  nike_trendy_pink: {
    d: 'Rosa y frutal: dulce con fresa y lichi, muy divertido y de facil uso.',
    e: ['Frutal', 'Dulce', 'Femenino', 'Divertido'],
  },
  nike_yummmy_musk: {
    d: 'Gourmand con toque limpio: frutas rojas y almizcle sobre vainilla y algodon. Dulce pero fresco, de los mas retirados del catalogo.',
    e: ['Gourmand', 'Dulce', 'Almizcle', 'Fresco'],
    n: { salida: ['Frutos rojos'], corazon: ['Almizcle'], fondo: ['Vainilla', 'Algodon'] },
  },
  nike_ginger_tonic: {
    d: 'Jengibre y limon: fresco, picante y aditivo. Energizante para el calor.',
    e: ['Fresco', 'Jengibre', 'Citrico', 'Energizante'],
  },

  // ---- Billie Eilish ----
  billie_eilish_negro: {
    d: 'El Eau de Parfum: un dorado avellanado y dulce, con cacao, vetiver y patchouli. Calido, envolvente y con muy buena reaparicion.',
    e: ['Dulce', 'Ambar', 'Cacao', 'Invierno'],
    n: { salida: ['Naranja', 'Fresa'], corazon: ['Plumeria', 'Jazmin'], fondo: ['Cacao', 'Vetiver', 'Pachuli'] },
  },

  // ---- Carolina Herrera Game of Spades ----
  game_of_spades_no_limit: {
    d: 'La version general del juego: especiado y calido, con un fondo de cuero y madera. Presencia segura.',
    e: ['Especiado', 'Cuero', 'Nocturno'],
  },
  game_of_spades_diamond: {
    d: 'La mas fresca de la baraja: citrico y acuoso con un fondo luminoso, sin perder el sello de la casa.',
    e: ['Fresco', 'Citrico', 'Diurno'],
  },
  game_of_spades_emerald: {
    d: 'Verde y aromatica: herbal contemporaneo con un fondo de vetiver y musgo. Elegante y sin endulzar.',
    e: ['Verde', 'Aromatico', 'Elegan'],
  },
  game_of_spades_bonus: {
    d: 'Dulce y ronda: vainilla y un fondo ambarado con un toque de canela. La mas accesible del set.',
    e: ['Dulce', 'Ambar', 'Vainilla'],
  },
  game_of_spades_wildcard: {
    d: 'La mas wild: canela intensa y un fondo de cuero oscuro. Para los que dejan huella.',
    e: ['Especiado', 'Cuero', 'Intenso', 'Nocturno'],
  },
  game_of_spades_opal: {
    d: 'Transparente y luminosa: floral ligera con un fondo blando. Muy neutral en cuanto a genero.',
    e: ['Floral', 'Fresco', 'Luminoso'],
  },
  game_of_spades_full_house: {
    d: 'La combinacion completa de la familia: calida, especiada y con ese fondo de madera que la hace reconocible.',
    e: ['Especiado', 'Ambar', 'Calido'],
  },

  // ---- Versace ----
  eros_najim: {
    d: 'Eros en version dulce: vainilla y un fondo ambarado con un toque calido de la casa. Clasico y moderno.',
    e: ['Vainilla', 'Dulce', 'Ambar', 'Clasico'],
  },
};

let redactadas = 0;
const ids = [];
for (const p of data) {
  const f = D[p.id];
  if (!f) continue;
  p.descripcion = f.d;
  p.etiquetas = f.e;
  if (f.n) p.notas = f.n;
  redactadas++;
  ids.push(p.id);
}

fs.writeFileSync(CAT, JSON.stringify(data, null, 1));

const genericas = data.filter(
  (p) => !p.descripcion || /^Un |^Una /.test(p.descripcion) || p.descripcion.length < 60
);
console.log('redactadas ahora:', redactadas);
console.log('total productos:', data.length);
console.log('sin descripcion propia:', genericas.length, genericas.map((p) => p.id));
console.log('con piramide olfativa:', data.filter((p) => p.notas && p.notas.corazon).length);
console.log('ejemplo:', JSON.stringify(data.find((p) => p.id === 'nike_yummmy_musk'), null, 1).slice(0, 400));