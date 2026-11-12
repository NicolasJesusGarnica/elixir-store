const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'src', 'assets', 'perfumes.json');
const perfumes = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));

// Perfiles conocidos de Fragrantica / Fragrance Database para los perfumes del catálogo
const PROFILES = {
  ag_sweet_like_candy: {
    acordes: [
      { nombre: 'Sweet', porcentaje: 100, color: '#FF384D' },
      { nombre: 'Fruity', porcentaje: 82, color: '#D74423' },
      { nombre: 'Vanilla', porcentaje: 68, color: '#CBB677' },
      { nombre: 'Powdery', porcentaje: 52, color: '#988E83' },
      { nombre: 'Lactonic', porcentaje: 40, color: '#86888A' },
    ],
    clima: { invierno: 35, primavera: 75, verano: 55, otono: 35, dia: 85, noche: 20 },
  },
  ag_cloud: {
    acordes: [
      { nombre: 'Sweet', porcentaje: 100, color: '#FF384D' },
      { nombre: 'Coconut', porcentaje: 85, color: '#C4A972' },
      { nombre: 'Vanilla', porcentaje: 80, color: '#CBB677' },
      { nombre: 'Lactonic', porcentaje: 72, color: '#86888A' },
      { nombre: 'Musky', porcentaje: 58, color: '#797E87' },
    ],
    clima: { invierno: 75, primavera: 70, verano: 45, otono: 85, dia: 75, noche: 65 },
  },
  ag_thank_u_next: {
    acordes: [
      { nombre: 'Coconut', porcentaje: 100, color: '#C4A972' },
      { nombre: 'Sweet', porcentaje: 85, color: '#FF384D' },
      { nombre: 'Fruity', porcentaje: 75, color: '#D74423' },
      { nombre: 'Vanilla', porcentaje: 65, color: '#CBB677' },
      { nombre: 'Floral', porcentaje: 50, color: '#D27B9B' },
    ],
    clima: { invierno: 35, primavera: 80, verano: 85, otono: 50, dia: 85, noche: 40 },
  },
  ag_mood_blush: {
    acordes: [
      { nombre: 'Fruity', porcentaje: 100, color: '#D74423' },
      { nombre: 'Floral', porcentaje: 85, color: '#D27B9B' },
      { nombre: 'Fresh', porcentaje: 75, color: '#44A68C' },
      { nombre: 'Sweet', porcentaje: 65, color: '#FF384D' },
      { nombre: 'Musky', porcentaje: 50, color: '#797E87' },
    ],
    clima: { invierno: 25, primavera: 90, verano: 85, otono: 50, dia: 90, noche: 35 },
  },
  ag_god_is_a_woman: {
    acordes: [
      { nombre: 'Fruity', porcentaje: 100, color: '#D74423' },
      { nombre: 'Sweet', porcentaje: 85, color: '#FF384D' },
      { nombre: 'Vanilla', porcentaje: 72, color: '#CBB677' },
      { nombre: 'Powdery', porcentaje: 60, color: '#988E83' },
      { nombre: 'Musky', porcentaje: 52, color: '#797E87' },
    ],
    clima: { invierno: 30, primavera: 90, verano: 85, otono: 55, dia: 88, noche: 40 },
  },
  ag_ari: {
    acordes: [
      { nombre: 'Sweet', porcentaje: 100, color: '#FF384D' },
      { nombre: 'Fruity', porcentaje: 85, color: '#D74423' },
      { nombre: 'Powdery', porcentaje: 70, color: '#988E83' },
      { nombre: 'Vanilla', porcentaje: 65, color: '#CBB677' },
      { nombre: 'Floral', porcentaje: 52, color: '#D27B9B' },
    ],
    clima: { invierno: 45, primavera: 85, verano: 70, otono: 60, dia: 85, noche: 45 },
  },
  ag_moonlight: {
    acordes: [
      { nombre: 'Sweet', porcentaje: 100, color: '#FF384D' },
      { nombre: 'Fruity', porcentaje: 82, color: '#D74423' },
      { nombre: 'Vanilla', porcentaje: 75, color: '#CBB677' },
      { nombre: 'Powdery', porcentaje: 62, color: '#988E83' },
      { nombre: 'Floral', porcentaje: 48, color: '#D27B9B' },
    ],
    clima: { invierno: 75, primavera: 65, verano: 35, otono: 80, dia: 50, noche: 80 },
  },
  bharara_king: {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Sweet', porcentaje: 85, color: '#FF384D' },
      { nombre: 'Citrus', porcentaje: 72, color: '#DCA427' },
      { nombre: 'Amber', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'Fruity', porcentaje: 55, color: '#D74423' },
    ],
    clima: { invierno: 80, primavera: 55, verano: 30, otono: 85, dia: 45, noche: 85 },
  },
  '9_am_dive': {
    acordes: [
      { nombre: 'Citrus', porcentaje: 100, color: '#DCA427' },
      { nombre: 'Aromatic', porcentaje: 85, color: '#558E77' },
      { nombre: 'Fresh Spicy', porcentaje: 75, color: '#4B8E6D' },
      { nombre: 'Aquatic', porcentaje: 70, color: '#3A87B0' },
      { nombre: 'Woody', porcentaje: 52, color: '#7E522F' },
    ],
    clima: { invierno: 20, primavera: 85, verano: 95, otono: 45, dia: 90, noche: 45 },
  },
  '9_pm_black': {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Amber', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'Warm Spicy', porcentaje: 82, color: '#A94425' },
      { nombre: 'Fruity', porcentaje: 70, color: '#D74423' },
      { nombre: 'Sweet', porcentaje: 65, color: '#FF384D' },
    ],
    clima: { invierno: 88, primavera: 50, verano: 20, otono: 88, dia: 30, noche: 92 },
  },
  '9_pm_elixir': {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Amber', porcentaje: 90, color: '#C87D2A' },
      { nombre: 'Sweet', porcentaje: 80, color: '#FF384D' },
      { nombre: 'Warm Spicy', porcentaje: 75, color: '#A94425' },
      { nombre: 'Woody', porcentaje: 60, color: '#7E522F' },
    ],
    clima: { invierno: 92, primavera: 45, verano: 15, otono: 88, dia: 25, noche: 95 },
  },
  '9pm_rebel': {
    acordes: [
      { nombre: 'Fruity', porcentaje: 100, color: '#D74423' },
      { nombre: 'Sweet', porcentaje: 85, color: '#FF384D' },
      { nombre: 'Vanilla', porcentaje: 70, color: '#CBB677' },
      { nombre: 'Woody', porcentaje: 60, color: '#7E522F' },
      { nombre: 'Amber', porcentaje: 52, color: '#C87D2A' },
    ],
    clima: { invierno: 65, primavera: 75, verano: 45, otono: 78, dia: 60, noche: 80 },
  },
  '9_pm_night_out': {
    acordes: [
      { nombre: 'Amber', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'Warm Spicy', porcentaje: 85, color: '#A94425' },
      { nombre: 'Vanilla', porcentaje: 75, color: '#CBB677' },
      { nombre: 'Sweet', porcentaje: 70, color: '#FF384D' },
      { nombre: 'Leather', porcentaje: 52, color: '#5E3A24' },
    ],
    clima: { invierno: 85, primavera: 40, verano: 15, otono: 85, dia: 20, noche: 95 },
  },
  hawas_for_him: {
    acordes: [
      { nombre: 'Fruity', porcentaje: 100, color: '#D74423' },
      { nombre: 'Aquatic', porcentaje: 85, color: '#3A87B0' },
      { nombre: 'Sweet', porcentaje: 80, color: '#FF384D' },
      { nombre: 'Fresh', porcentaje: 75, color: '#44A68C' },
      { nombre: 'Amber', porcentaje: 60, color: '#C87D2A' },
    ],
    clima: { invierno: 35, primavera: 85, verano: 92, otono: 65, dia: 82, noche: 68 },
  },
  hawas_ice: {
    acordes: [
      { nombre: 'Citrus', porcentaje: 100, color: '#DCA427' },
      { nombre: 'Fruity', porcentaje: 88, color: '#D74423' },
      { nombre: 'Aquatic', porcentaje: 82, color: '#3A87B0' },
      { nombre: 'Fresh', porcentaje: 75, color: '#44A68C' },
      { nombre: 'Sweet', porcentaje: 60, color: '#FF384D' },
    ],
    clima: { invierno: 20, primavera: 85, verano: 96, otono: 50, dia: 90, noche: 55 },
  },
  hawas_tropical: {
    acordes: [
      { nombre: 'Tropical', porcentaje: 100, color: '#EA6B3A' },
      { nombre: 'Fruity', porcentaje: 85, color: '#D74423' },
      { nombre: 'Sweet', porcentaje: 75, color: '#FF384D' },
      { nombre: 'Citrus', porcentaje: 65, color: '#DCA427' },
      { nombre: 'Fresh', porcentaje: 52, color: '#44A68C' },
    ],
    clima: { invierno: 15, primavera: 85, verano: 95, otono: 45, dia: 92, noche: 45 },
  },
  jpg_le_male_elixir: {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Sweet', porcentaje: 90, color: '#FF384D' },
      { nombre: 'Honey', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'Tobacco', porcentaje: 75, color: '#704B30' },
      { nombre: 'Amber', porcentaje: 70, color: '#C87D2A' },
      { nombre: 'Warm Spicy', porcentaje: 62, color: '#A94425' },
    ],
    clima: { invierno: 96, primavera: 40, verano: 12, otono: 90, dia: 22, noche: 95 },
  },
  jpg_le_male_le_parfum: {
    acordes: [
      { nombre: 'Warm Spicy', porcentaje: 100, color: '#A94425' },
      { nombre: 'Vanilla', porcentaje: 88, color: '#CBB677' },
      { nombre: 'Lavender', porcentaje: 82, color: '#7B6EA2' },
      { nombre: 'Aromatic', porcentaje: 72, color: '#558E77' },
      { nombre: 'Powdery', porcentaje: 62, color: '#988E83' },
    ],
    clima: { invierno: 92, primavera: 55, verano: 20, otono: 90, dia: 35, noche: 92 },
  },
  jpg_le_beau_edt: {
    acordes: [
      { nombre: 'Coconut', porcentaje: 100, color: '#C4A972' },
      { nombre: 'Vanilla', porcentaje: 85, color: '#CBB677' },
      { nombre: 'Sweet', porcentaje: 80, color: '#FF384D' },
      { nombre: 'Amber', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'Aromatic', porcentaje: 55, color: '#558E77' },
    ],
    clima: { invierno: 30, primavera: 80, verano: 92, otono: 55, dia: 82, noche: 62 },
  },
  jpg_divine_elixir: {
    acordes: [
      { nombre: 'White Floral', porcentaje: 100, color: '#D989A6' },
      { nombre: 'Sweet', porcentaje: 82, color: '#FF384D' },
      { nombre: 'Marine', porcentaje: 72, color: '#3A87B0' },
      { nombre: 'Vanilla', porcentaje: 65, color: '#CBB677' },
      { nombre: 'Salty', porcentaje: 55, color: '#797E87' },
    ],
    clima: { invierno: 35, primavera: 85, verano: 88, otono: 55, dia: 85, noche: 55 },
  },
  dior_fahrenheit: {
    acordes: [
      { nombre: 'Leather', porcentaje: 100, color: '#5E3A24' },
      { nombre: 'Violet', porcentaje: 85, color: '#77638E' },
      { nombre: 'Woody', porcentaje: 80, color: '#7E522F' },
      { nombre: 'Aromatic', porcentaje: 72, color: '#558E77' },
      { nombre: 'Fresh Spicy', porcentaje: 65, color: '#4B8E6D' },
    ],
    clima: { invierno: 85, primavera: 65, verano: 25, otono: 90, dia: 45, noche: 85 },
  },
  acqua_di_gio_edp: {
    acordes: [
      { nombre: 'Marine', porcentaje: 100, color: '#3A87B0' },
      { nombre: 'Aromatic', porcentaje: 88, color: '#558E77' },
      { nombre: 'Citrus', porcentaje: 82, color: '#DCA427' },
      { nombre: 'Fresh Spicy', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'Mineral', porcentaje: 55, color: '#797E87' },
    ],
    clima: { invierno: 20, primavera: 88, verano: 96, otono: 48, dia: 92, noche: 45 },
  },
  xerjoff_erba_pura: {
    acordes: [
      { nombre: 'Fruity', porcentaje: 100, color: '#D74423' },
      { nombre: 'Sweet', porcentaje: 88, color: '#FF384D' },
      { nombre: 'Citrus', porcentaje: 80, color: '#DCA427' },
      { nombre: 'Musky', porcentaje: 70, color: '#797E87' },
      { nombre: 'Vanilla', porcentaje: 60, color: '#CBB677' },
    ],
    clima: { invierno: 45, primavera: 90, verano: 88, otono: 65, dia: 80, noche: 70 },
  },
  asad_lattafa: {
    acordes: [
      { nombre: 'Warm Spicy', porcentaje: 100, color: '#A94425' },
      { nombre: 'Amber', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'Vanilla', porcentaje: 78, color: '#CBB677' },
      { nombre: 'Woody', porcentaje: 70, color: '#7E522F' },
      { nombre: 'Powdery', porcentaje: 52, color: '#988E83' },
    ],
    clima: { invierno: 92, primavera: 45, verano: 18, otono: 88, dia: 32, noche: 92 },
  },
  asad_zanzibar: {
    acordes: [
      { nombre: 'Marine', porcentaje: 100, color: '#3A87B0' },
      { nombre: 'Coconut', porcentaje: 85, color: '#C4A972' },
      { nombre: 'Vanilla', porcentaje: 75, color: '#CBB677' },
      { nombre: 'Aromatic', porcentaje: 68, color: '#558E77' },
      { nombre: 'Salty', porcentaje: 55, color: '#797E87' },
    ],
    clima: { invierno: 30, primavera: 82, verano: 92, otono: 55, dia: 85, noche: 60 },
  },
  paco_rabanne_invictus: {
    acordes: [
      { nombre: 'Citrus', porcentaje: 100, color: '#DCA427' },
      { nombre: 'Marine', porcentaje: 90, color: '#3A87B0' },
      { nombre: 'Aromatic', porcentaje: 80, color: '#558E77' },
      { nombre: 'Fresh Spicy', porcentaje: 70, color: '#4B8E6D' },
      { nombre: 'Woody', porcentaje: 60, color: '#7E522F' },
    ],
    clima: { invierno: 25, primavera: 85, verano: 92, otono: 52, dia: 88, noche: 55 },
  },
  azzaro_tmw_parfum: {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Woody', porcentaje: 88, color: '#7E522F' },
      { nombre: 'Sweet', porcentaje: 80, color: '#FF384D' },
      { nombre: 'Warm Spicy', porcentaje: 72, color: '#A94425' },
      { nombre: 'Balsamic', porcentaje: 58, color: '#8F5438' },
    ],
    clima: { invierno: 94, primavera: 40, verano: 12, otono: 90, dia: 25, noche: 95 },
  },
  stronger_with_you_in: {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Sweet', porcentaje: 90, color: '#FF384D' },
      { nombre: 'Amber', porcentaje: 82, color: '#C87D2A' },
      { nombre: 'Cinnamon', porcentaje: 75, color: '#A94425' },
      { nombre: 'Caramel', porcentaje: 70, color: '#B86B2B' },
    ],
    clima: { invierno: 94, primavera: 45, verano: 15, otono: 92, dia: 30, noche: 92 },
  },
  polo_blue: {
    acordes: [
      { nombre: 'Aromatic', porcentaje: 100, color: '#558E77' },
      { nombre: 'Aquatic', porcentaje: 88, color: '#3A87B0' },
      { nombre: 'Fresh Spicy', porcentaje: 80, color: '#4B8E6D' },
      { nombre: 'Citrus', porcentaje: 72, color: '#DCA427' },
      { nombre: 'Woody', porcentaje: 55, color: '#7E522F' },
    ],
    clima: { invierno: 25, primavera: 88, verano: 95, otono: 50, dia: 92, noche: 45 },
  },
  billie_eilish_dorado: {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Sweet', porcentaje: 88, color: '#FF384D' },
      { nombre: 'Warm Spicy', porcentaje: 80, color: '#A94425' },
      { nombre: 'Cacao', porcentaje: 72, color: '#5A3825' },
      { nombre: 'Amber', porcentaje: 60, color: '#C87D2A' },
    ],
    clima: { invierno: 92, primavera: 45, verano: 15, otono: 88, dia: 35, noche: 90 },
  },
  billie_eilish_negro: {
    acordes: [
      { nombre: 'Woody', porcentaje: 100, color: '#7E522F' },
      { nombre: 'Warm Spicy', porcentaje: 85, color: '#A94425' },
      { nombre: 'Aromatic', porcentaje: 75, color: '#558E77' },
      { nombre: 'Fresh Spicy', porcentaje: 65, color: '#4B8E6D' },
      { nombre: 'Amber', porcentaje: 55, color: '#C87D2A' },
    ],
    clima: { invierno: 85, primavera: 60, verano: 30, otono: 88, dia: 45, noche: 85 },
  },
  sweeth_tooth_cherry_baby: {
    acordes: [
      { nombre: 'Cherry', porcentaje: 100, color: '#C94B6E' },
      { nombre: 'Sweet', porcentaje: 88, color: '#FF384D' },
      { nombre: 'Vanilla', porcentaje: 78, color: '#CBB677' },
      { nombre: 'Fruity', porcentaje: 70, color: '#D74423' },
      { nombre: 'Chocolate', porcentaje: 55, color: '#543220' },
    ],
    clima: { invierno: 65, primavera: 75, verano: 55, otono: 80, dia: 70, noche: 75 },
  },
  valentino_born_in_roma: {
    acordes: [
      { nombre: 'Vanilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'Woody', porcentaje: 85, color: '#7E522F' },
      { nombre: 'Fruity', porcentaje: 80, color: '#D74423' },
      { nombre: 'Sweet', porcentaje: 75, color: '#FF384D' },
      { nombre: 'Floral', porcentaje: 65, color: '#D27B9B' },
    ],
    clima: { invierno: 75, primavera: 82, verano: 45, otono: 88, dia: 65, noche: 80 },
  },
};

// Paleta cromática estándar para mapear acordes automáticamente
const ACCORD_COLORS = {
  sweet: '#FF384D',
  dulce: '#FF384D',
  fruity: '#D74423',
  frutal: '#D74423',
  vanilla: '#CBB677',
  vainilla: '#CBB677',
  powdery: '#988E83',
  atalcado: '#9E9388',
  lactonic: '#86888A',
  lactonico: '#86888A',
  woody: '#7E522F',
  amaderado: '#7E522F',
  madera: '#7E522F',
  citrus: '#DCA427',
  citrico: '#DCA427',
  amber: '#C87D2A',
  ambar: '#C87D2A',
  ambarado: '#C87D2A',
  'warm spicy': '#A94425',
  'especiado calido': '#A94425',
  'fresh spicy': '#4B8E6D',
  'especiado fresco': '#4B8E6D',
  aromatic: '#558E77',
  aromatico: '#558E77',
  aquatic: '#3A87B0',
  acuatico: '#3A87B0',
  marine: '#3A87B0',
  marino: '#3A87B0',
  fresh: '#44A68C',
  fresco: '#44A68C',
  floral: '#D27B9B',
  'white floral': '#D989A6',
  'floral blanco': '#D989A6',
  leather: '#5E3A24',
  cuero: '#5E3A24',
  musky: '#797E87',
  almizcle: '#797E87',
  tropical: '#EA6B3A',
  caramel: '#B86B2B',
  caramelo: '#B86B2B',
  coconut: '#C4A972',
  coco: '#C4A972',
  gourmand: '#965D38',
  coffee: '#462B1D',
  chocolate: '#543220',
  cacao: '#5A3825',
  cherry: '#C94B6E',
  honey: '#C87D2A',
  miel: '#C87D2A',
  tobacco: '#704B30',
  tabaco: '#704B30',
  cinnamon: '#A84323',
  canela: '#A84323',
  rose: '#C94B6E',
  lavender: '#7B6EA2',
  lavanda: '#7B6EA2',
  green: '#4D8343',
  herbal: '#4D8343',
  verde: '#4D8343',
};

function normalizar(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function colorParaAcorde(nombre) {
  const norm = normalizar(nombre);
  return ACCORD_COLORS[norm] || '#8a6d42';
}

function generarPerfilFallback(p) {
  // Deducción inteligente basada en notas olfativas y etiquetas existentes
  const tags = p.etiquetas || [];
  const salida = p.notas?.salida || [];
  const corazon = p.notas?.corazon || [];
  const fondo = p.notas?.fondo || [];
  const todasNotas = [...tags, ...salida, ...corazon, ...fondo].map(normalizar);

  const esDulce = todasNotas.some((n) => /dulce|vainilla|caramelo|pralina|tonka|chocolate|miel/.test(n));
  const esCitrico = todasNotas.some((n) => /citrico|bergamota|limon|mandarina|naranja|pomelo/.test(n));
  const esFrescoAcuatico = todasNotas.some((n) => /acuatico|marino|mar|ozonico|fresco|menta/.test(n));
  const esAmaderado = todasNotas.some((n) => /madera|cedro|sandalo|vetiver|oud|roble/.test(n));
  const esAmbarado = todasNotas.some((n) => /ambar|resina|incienso|labdano|benjui/.test(n));
  const esEspeciado = todasNotas.some((n) => /especiad|canela|cardamomo|pimienta|nuez moscada/.test(n));
  const esFloral = todasNotas.some((n) => /floral|rosa|jazmin|azahar|neroli|iris|violeta|lavanda/.test(n));
  const esAfrutado = todasNotas.some((n) => /frut|manzana|pera|cereza|frambuesa|frutos|melocoton/.test(n));

  const acordes = [];
  let pIndex = 100;

  if (esDulce) {
    acordes.push({ nombre: 'Sweet', porcentaje: pIndex, color: colorParaAcorde('sweet') });
    pIndex -= 16;
  }
  if (esCitrico) {
    acordes.push({ nombre: 'Citrus', porcentaje: pIndex, color: colorParaAcorde('citrus') });
    pIndex -= 16;
  }
  if (esFrescoAcuatico) {
    acordes.push({ nombre: 'Aquatic', porcentaje: pIndex, color: colorParaAcorde('aquatic') });
    pIndex -= 16;
  }
  if (esAmaderado) {
    acordes.push({ nombre: 'Woody', porcentaje: pIndex, color: colorParaAcorde('woody') });
    pIndex -= 16;
  }
  if (esAmbarado) {
    acordes.push({ nombre: 'Amber', porcentaje: pIndex, color: colorParaAcorde('amber') });
    pIndex -= 16;
  }
  if (esEspeciado) {
    acordes.push({ nombre: 'Warm Spicy', porcentaje: pIndex, color: colorParaAcorde('warm spicy') });
    pIndex -= 16;
  }
  if (esAfrutado) {
    acordes.push({ nombre: 'Fruity', porcentaje: pIndex, color: colorParaAcorde('fruity') });
    pIndex -= 16;
  }
  if (esFloral) {
    acordes.push({ nombre: 'Floral', porcentaje: pIndex, color: colorParaAcorde('floral') });
    pIndex -= 16;
  }

  // Si no se dedujo nada, acordes elegantes por defecto
  if (acordes.length < 3) {
    if (p.genero === 'Hombre') {
      acordes.push(
        { nombre: 'Aromatic', porcentaje: 90, color: colorParaAcorde('aromatic') },
        { nombre: 'Fresh Spicy', porcentaje: 75, color: colorParaAcorde('fresh spicy') },
        { nombre: 'Woody', porcentaje: 60, color: colorParaAcorde('woody') }
      );
    } else {
      acordes.push(
        { nombre: 'Floral', porcentaje: 95, color: colorParaAcorde('floral') },
        { nombre: 'Fruity', porcentaje: 80, color: colorParaAcorde('fruity') },
        { nombre: 'Sweet', porcentaje: 65, color: colorParaAcorde('sweet') }
      );
    }
  }

  // Clima según acordes dominantes
  let clima = { invierno: 50, primavera: 70, verano: 50, otono: 60, dia: 70, noche: 60 };
  if (esFrescoAcuatico || esCitrico) {
    clima = { invierno: 20, primavera: 85, verano: 95, otono: 50, dia: 90, noche: 45 };
  } else if (esDulce || esAmbarado || esEspeciado) {
    clima = { invierno: 90, primavera: 45, verano: 20, otono: 88, dia: 30, noche: 92 };
  } else if (esFloral) {
    clima = { invierno: 35, primavera: 92, verano: 80, otono: 55, dia: 85, noche: 45 };
  }

  return {
    acordes: acordes.slice(0, 5),
    clima,
  };
}

let actualizados = 0;
for (const p of perfumes) {
  const conocido = PROFILES[p.id];
  if (conocido) {
    p.acordes = conocido.acordes;
    p.clima = conocido.clima;
  } else {
    const fallback = generarPerfilFallback(p);
    p.acordes = fallback.acordes;
    p.clima = fallback.clima;
  }
  actualizados++;
}

fs.writeFileSync(FILE_PATH, JSON.stringify(perfumes, null, 2), 'utf-8');
console.log(`✓ ${actualizados} perfumes actualizados con Acordes y Clima en ${FILE_PATH}`);
