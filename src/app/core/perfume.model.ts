export type Genero = 'Hombre' | 'Mujer' | 'Unisex';
export type Tipo = 'Árabe' | 'Diseñador' | 'Nicho';

export interface Volumen {
  ml: number;
  precioBs: number;
}

export interface AcordePrincipal {
  nombre: string;
  porcentaje: number;
  color?: string;
}

export interface ClimaUso {
  invierno: number;
  primavera: number;
  verano: number;
  otono: number;
  dia: number;
  noche: number;
}

export interface Perfume {
  id: string;
  nombre: string;
  marca: string;
  tipo: Tipo;
  genero: Genero;
  descripcion?: string;
  etiquetas?: string[];
  notas?: {
    salida: string[];
    corazon: string[];
    fondo: string[];
  };
  acordes?: AcordePrincipal[];
  clima?: ClimaUso;
  imagenes: string[];
  /** Decants con precio confirmado. */
  volumenes: Volumen[];
  /** Perfume completo: precio pendiente. */
  completo: { ml: number; precioBs: number | null };
  activo: boolean;
  nuevo: boolean;
  destacado: boolean;
  stock_inventario?: number;
}

export function precioMin(p: Perfume): number {
  const precios = p.volumenes.map((v) => v.precioBs);
  if (precios.length) return Math.min(...precios);
  return typeof p.completo?.precioBs === 'number' && p.completo.precioBs > 0
    ? p.completo.precioBs
    : 0;
}

export function precioMax(p: Perfume): number {
  const precios = [...p.volumenes.map((v) => v.precioBs), p.completo.precioBs].filter(
    (n): n is number => typeof n === 'number'
  );
  return precios.length ? Math.max(...precios) : 0;
}

/** Precio por mililitro de un volumen. */
/** Sin tildes y en minuscula, para comparar nombres sin depender de como se escriben. */
function sinTildes(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Nombre para las tarjetas: si el nombre ya arranca con la marca
 * ("JEAN PAUL GAULTIER LE MALE LE PARFUM") se recorta, porque arriba de la
 * tarjeta la marca ya esta escrita y repetirla solo estira el titulo.
 * El nombre completo se sigue usando en Google, en la ficha y en el pedido.
 */
export function nombreCorto(p: Perfume): string {
  const marca = sinTildes(p.marca);
  if (marca && sinTildes(p.nombre).startsWith(marca)) {
    const resto = p.nombre.slice(p.marca.length).trim();
    if (resto) return resto;
  }
  return p.nombre;
}

export function porMl(v: Volumen): number {
  return v.ml > 0 ? v.precioBs / v.ml : 0;
}

/** El volumen con el mejor precio por ml (el que mas conviene). */
export function mejorVolumen(volumenes: Volumen[]): Volumen | null {
  if (!volumenes.length) return null;
  return volumenes.reduce((a, b) => (porMl(b) < porMl(a) ? b : a));
}

/** Bs por ml del volumen mas barato: el titular del producto. */
export function mejorPrecioMl(p: Perfume): number {
  const v = mejorVolumen(p.volumenes);
  return v ? porMl(v) : 0;
}

export const PALETA_ACORDES: Record<string, string> = {
  sweet: '#FF384D',
  dulce: '#FF384D',
  fruity: '#D74423',
  frutal: '#D74423',
  afrutados: '#D74423',
  afrutado: '#D74423',
  vanilla: '#CBB677',
  vainilla: '#CBB677',
  avainillado: '#CBB677',
  powdery: '#988E83',
  atalcado: '#988E83',
  apolvado: '#988E83',
  empolvado: '#988E83',
  lactonic: '#86888A',
  lactonico: '#86888A',
  woody: '#8D5524',
  amaderado: '#8D5524',
  amaderados: '#8D5524',
  madera: '#8D5524',
  citrus: '#B8B939',
  citrico: '#B8B939',
  citricos: '#B8B939',
  amber: '#C87D2A',
  ambar: '#C87D2A',
  ambarado: '#C87D2A',
  'warm spicy': '#AA331E',
  'calido especiado': '#AA331E',
  'especiado calido': '#AA331E',
  'fresh spicy': '#4B8E6D',
  'fresco especiado': '#4B8E6D',
  'especiado fresco': '#4B8E6D',
  'soft spicy': '#8C5240',
  'especiado suave': '#8C5240',
  aromatic: '#4A8B71',
  aromatico: '#4A8B71',
  aquatic: '#258BD2',
  acuatico: '#258BD2',
  marine: '#258BD2',
  marino: '#258BD2',
  ozonic: '#4F9BC2',
  ozonico: '#4F9BC2',
  fresh: '#44A68C',
  fresco: '#44A68C',
  floral: '#D27B9B',
  florales: '#D27B9B',
  'white floral': '#D989A6',
  'floral blanco': '#D989A6',
  'flores blancas': '#D989A6',
  'yellow floral': '#DFBF48',
  'floral amarillo': '#DFBF48',
  leather: '#5E3A24',
  cuero: '#5E3A24',
  musky: '#797E87',
  almizcle: '#797E87',
  almizclado: '#797E87',
  almizclados: '#797E87',
  tropical: '#EA6B3A',
  caramel: '#B86B2B',
  caramelo: '#B86B2B',
  coconut: '#C4A972',
  coco: '#C4A972',
  gourmand: '#965D38',
  coffee: '#462B1D',
  cafe: '#462B1D',
  chocolate: '#543220',
  cacao: '#5A3825',
  herbal: '#4D8343',
  green: '#1F7A28',
  verde: '#1F7A28',
  'verde fresco': '#368E3E',
  smoky: '#55565B',
  ahumado: '#55565B',
  patchouli: '#6F773B',
  pachuli: '#6F773B',
  nueces: '#A98260',
  nuez: '#A98260',
  frutossecos: '#A98260',
  rose: '#C94B6E',
  rosa: '#C94B6E',
  rosas: '#C94B6E',
  iris: '#77638E',
  violeta: '#7B6EA2',
  violet: '#7B6EA2',
  lavender: '#8076A3',
  lavanda: '#8076A3',
  earthy: '#4A533C',
  terroso: '#4A533C',
  terrosos: '#4A533C',
  balsamic: '#7D6350',
  balsamico: '#7D6350',
  canela: '#A84323',
  cinnamon: '#A84323',
  tobacco: '#704B30',
  tabaco: '#704B30',
  miel: '#DDA135',
  amielado: '#DDA135',
  salado: '#528EA6',
  salty: '#528EA6',
  mineral: '#7B96A8',
  oud: '#4E3524',
  cereza: '#B31D38',
  cherry: '#B31D38',
  ron: '#9A4C1B',
  rum: '#9A4C1B',
  almendra: '#BA9B7B',
  almendrado: '#BA9B7B',
  musgo: '#495B3D',
  moss: '#495B3D',
};

export function obtenerColorAcorde(nombre: string, colorCustom?: string): string {
  if (colorCustom && colorCustom.trim().startsWith('#')) return colorCustom.trim();
  const limpio = (nombre || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return PALETA_ACORDES[limpio] || '#8a6d42';
}