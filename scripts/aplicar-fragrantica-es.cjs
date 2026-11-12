const fs = require('fs');
const path = require('path');

const rutaJson = path.join(__dirname, '../src/assets/perfumes.json');
const catalogo = JSON.parse(fs.readFileSync(rutaJson, 'utf8'));

// Diccionario de Perfiles Auténticos Fragrantica.es (en español con acordes y estaciones reales)
const PERFILES_FRAGRANTICA = {
  angel_stellar_mugler: {
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'pachulí', porcentaje: 85, color: '#6F773B' },
      { nombre: 'nueces', porcentaje: 68, color: '#A98260' },
      { nombre: 'cálido especiado', porcentaje: 62, color: '#AA331E' },
      { nombre: 'verde', porcentaje: 58, color: '#1F7A28' },
      { nombre: 'terrosos', porcentaje: 55, color: '#4A533C' },
      { nombre: 'cítrico', porcentaje: 50, color: '#B8B939' },
      { nombre: 'balsámico', porcentaje: 46, color: '#7D6350' },
    ],
    clima: { invierno: 85, primavera: 45, verano: 20, otono: 75, dia: 45, noche: 80 },
  },
  angel_fantasm_mugler: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'coco', porcentaje: 85, color: '#C4A972' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'pachulí', porcentaje: 68, color: '#6F773B' },
      { nombre: 'afrutados', porcentaje: 60, color: '#D74423' },
      { nombre: 'tropical', porcentaje: 52, color: '#EA6B3A' },
      { nombre: 'amaderado', porcentaje: 45, color: '#8D5524' },
    ],
    clima: { invierno: 80, primavera: 40, verano: 25, otono: 70, dia: 50, noche: 75 },
  },
  ag_sweet_like_candy: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 82, color: '#D74423' },
      { nombre: 'vainilla', porcentaje: 68, color: '#CBB677' },
      { nombre: 'atalcado', porcentaje: 52, color: '#988E83' },
      { nombre: 'lactónico', porcentaje: 40, color: '#86888A' },
    ],
    clima: { invierno: 35, primavera: 75, verano: 55, otono: 35, dia: 85, noche: 20 },
  },
  ag_ari: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 85, color: '#D74423' },
      { nombre: 'atalcado', porcentaje: 70, color: '#988E83' },
      { nombre: 'cítrico', porcentaje: 60, color: '#B8B939' },
      { nombre: 'rosas', porcentaje: 52, color: '#D27B9B' },
      { nombre: 'almizclado', porcentaje: 45, color: '#797E87' },
    ],
    clima: { invierno: 40, primavera: 85, verano: 70, otono: 55, dia: 85, noche: 35 },
  },
  ag_cloud: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'lactónico', porcentaje: 85, color: '#86888A' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'coco', porcentaje: 70, color: '#C4A972' },
      { nombre: 'almizclado', porcentaje: 55, color: '#797E87' },
      { nombre: 'lavanda', porcentaje: 48, color: '#8076A3' },
    ],
    clima: { invierno: 65, primavera: 70, verano: 45, otono: 75, dia: 70, noche: 65 },
  },
  ag_thank_u_next: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'coco', porcentaje: 85, color: '#C4A972' },
      { nombre: 'afrutados', porcentaje: 75, color: '#D74423' },
      { nombre: 'vainilla', porcentaje: 65, color: '#CBB677' },
      { nombre: 'rosas', porcentaje: 52, color: '#D27B9B' },
      { nombre: 'almendra', porcentaje: 45, color: '#BA9B7B' },
    ],
    clima: { invierno: 30, primavera: 80, verano: 75, otono: 50, dia: 85, noche: 30 },
  },
  ag_god_is_a_woman: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 70, color: '#988E83' },
      { nombre: 'acuático', porcentaje: 58, color: '#258BD2' },
      { nombre: 'almizclado', porcentaje: 52, color: '#797E87' },
      { nombre: 'vainilla', porcentaje: 45, color: '#CBB677' },
      { nombre: 'floral', porcentaje: 38, color: '#D27B9B' },
    ],
    clima: { invierno: 25, primavera: 85, verano: 80, otono: 50, dia: 90, noche: 30 },
  },
  ag_moonlight: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 72, color: '#988E83' },
      { nombre: 'floral', porcentaje: 62, color: '#D27B9B' },
      { nombre: 'avainillado', porcentaje: 55, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 45, color: '#8D5524' },
    ],
    clima: { invierno: 60, primavera: 65, verano: 40, otono: 75, dia: 50, noche: 75 },
  },
  ag_mood_blush: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 70, color: '#D27B9B' },
      { nombre: 'cítrico', porcentaje: 60, color: '#B8B939' },
      { nombre: 'almizclado', porcentaje: 50, color: '#797E87' },
    ],
    clima: { invierno: 30, primavera: 85, verano: 80, otono: 55, dia: 85, noche: 35 },
  },
  '9_pm_black': {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'afrutados', porcentaje: 68, color: '#D74423' },
      { nombre: 'canela', porcentaje: 60, color: '#A84323' },
      { nombre: 'dulce', porcentaje: 55, color: '#FF384D' },
      { nombre: 'lavanda', porcentaje: 48, color: '#8076A3' },
      { nombre: 'aromático', porcentaje: 42, color: '#4A8B71' },
    ],
    clima: { invierno: 85, primavera: 45, verano: 20, otono: 85, dia: 35, noche: 90 },
  },
  '9_am_dive': {
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' },
      { nombre: 'afrutados', porcentaje: 45, color: '#D74423' },
    ],
    clima: { invierno: 15, primavera: 75, verano: 95, otono: 45, dia: 90, noche: 30 },
  },
  '9_pm_elixir': {
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 78, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'dulce', porcentaje: 58, color: '#FF384D' },
    ],
    clima: { invierno: 90, primavera: 40, verano: 15, otono: 85, dia: 35, noche: 90 },
  },
  '9pm_rebel': {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cálido especiado', porcentaje: 85, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' },
    ],
    clima: { invierno: 75, primavera: 60, verano: 35, otono: 80, dia: 45, noche: 85 },
  },
  '9_pm_night_out': {
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 58, color: '#4A8B71' },
    ],
    clima: { invierno: 85, primavera: 45, verano: 20, otono: 80, dia: 30, noche: 95 },
  },
  bharara_king: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'almizclado', porcentaje: 58, color: '#797E87' },
      { nombre: 'ámbar', porcentaje: 48, color: '#C87D2A' },
    ],
    clima: { invierno: 45, primavera: 85, verano: 75, otono: 70, dia: 75, noche: 65 },
  },
  hawas_for_him: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'acuático', porcentaje: 78, color: '#258BD2' },
      { nombre: 'fresco', porcentaje: 68, color: '#44A68C' },
      { nombre: 'cálido especiado', porcentaje: 58, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 50, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 42, color: '#C87D2A' },
    ],
    clima: { invierno: 20, primavera: 80, verano: 95, otono: 55, dia: 85, noche: 45 },
  },
  hawas_ice: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'fresco', porcentaje: 68, color: '#44A68C' },
      { nombre: 'aromático', porcentaje: 58, color: '#4A8B71' },
      { nombre: 'almizclado', porcentaje: 50, color: '#797E87' },
    ],
    clima: { invierno: 15, primavera: 80, verano: 95, otono: 45, dia: 90, noche: 35 },
  },
  hawas_tropical: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'verde', porcentaje: 85, color: '#1F7A28' },
      { nombre: 'coco', porcentaje: 78, color: '#C4A972' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'avainillado', porcentaje: 58, color: '#CBB677' },
      { nombre: 'fresco', porcentaje: 48, color: '#44A68C' },
    ],
    clima: { invierno: 20, primavera: 80, verano: 95, otono: 50, dia: 85, noche: 40 },
  },
  hawas_fire: {
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'mineral', porcentaje: 75, color: '#7B96A8' },
      { nombre: 'marino', porcentaje: 65, color: '#258BD2' },
      { nombre: 'cálido especiado', porcentaje: 55, color: '#AA331E' },
    ],
    clima: { invierno: 65, primavera: 70, verano: 60, otono: 80, dia: 60, noche: 75 },
  },
  hawas_malibu: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 70, color: '#D74423' },
      { nombre: 'atalcado', porcentaje: 60, color: '#988E83' },
      { nombre: 'avainillado', porcentaje: 52, color: '#CBB677' },
    ],
    clima: { invierno: 30, primavera: 85, verano: 90, otono: 60, dia: 80, noche: 50 },
  },
  hawas_kobra: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 88, color: '#4B8E6D' },
      { nombre: 'fresco', porcentaje: 78, color: '#44A68C' },
      { nombre: 'verde', porcentaje: 68, color: '#1F7A28' },
      { nombre: 'almizclado', porcentaje: 58, color: '#797E87' },
      { nombre: 'amaderado', porcentaje: 48, color: '#8D5524' },
    ],
    clima: { invierno: 25, primavera: 85, verano: 90, otono: 60, dia: 85, noche: 40 },
  },
  hawas_verde: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 78, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'afrutados', porcentaje: 58, color: '#D74423' },
      { nombre: 'verde', porcentaje: 48, color: '#1F7A28' },
    ],
    clima: { invierno: 20, primavera: 90, verano: 95, otono: 60, dia: 90, noche: 35 },
  },
  acqua_di_gio_edp: {
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'marino', porcentaje: 88, color: '#258BD2' },
      { nombre: 'mineral', porcentaje: 75, color: '#7B96A8' },
      { nombre: 'cítrico', porcentaje: 65, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 55, color: '#4B8E6D' },
      { nombre: 'lavanda', porcentaje: 48, color: '#8076A3' },
    ],
    clima: { invierno: 15, primavera: 85, verano: 95, otono: 55, dia: 90, noche: 30 },
  },
  stronger_with_you_in: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 92, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 85, color: '#C87D2A' },
      { nombre: 'canela', porcentaje: 78, color: '#A84323' },
      { nombre: 'cálido especiado', porcentaje: 70, color: '#AA331E' },
      { nombre: 'caramelo', porcentaje: 60, color: '#B86B2B' },
      { nombre: 'atalcado', porcentaje: 52, color: '#988E83' },
      { nombre: 'aromático', porcentaje: 45, color: '#4A8B71' },
    ],
    clima: { invierno: 95, primavera: 40, verano: 10, otono: 90, dia: 35, noche: 90 },
  },
  azzaro_tmw_parfum: {
    acordes: [
      { nombre: 'vainilla', porcentaje: 100, color: '#CBB677' },
      { nombre: 'amaderados', porcentaje: 85, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 72, color: '#4B8E6D' },
      { nombre: 'atalcado', porcentaje: 60, color: '#988E83' },
      { nombre: 'fresco', porcentaje: 50, color: '#44A68C' },
    ],
    clima: { invierno: 90, primavera: 45, verano: 15, otono: 85, dia: 35, noche: 90 },
  },
  azzaro_tmw_edp_intense: {
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 78, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 68, color: '#8D5524' },
      { nombre: 'caramelo', porcentaje: 60, color: '#B86B2B' },
      { nombre: 'aromático', porcentaje: 50, color: '#4A8B71' },
    ],
    clima: { invierno: 90, primavera: 40, verano: 15, otono: 85, dia: 35, noche: 90 },
  },
  xerjoff_erba_pura: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 90, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 82, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 75, color: '#797E87' },
      { nombre: 'atalcado', porcentaje: 65, color: '#988E83' },
      { nombre: 'avainillado', porcentaje: 55, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 48, color: '#C87D2A' },
    ],
    clima: { invierno: 30, primavera: 85, verano: 90, otono: 65, dia: 80, noche: 55 },
  },
  jpg_le_classique_edp: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'floral', porcentaje: 85, color: '#D27B9B' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'atalcado', porcentaje: 65, color: '#988E83' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' },
      { nombre: 'ron', porcentaje: 50, color: '#9A4C1B' },
      { nombre: 'rosas', porcentaje: 45, color: '#C94B6E' },
    ],
    clima: { invierno: 85, primavera: 55, verano: 25, otono: 80, dia: 45, noche: 85 },
  },
  jpg_le_male_elixir: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 82, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' },
      { nombre: 'miel', porcentaje: 68, color: '#DDA135' },
      { nombre: 'lavanda', porcentaje: 62, color: '#8076A3' },
      { nombre: 'tabaco', porcentaje: 55, color: '#704B30' },
      { nombre: 'cálido especiado', porcentaje: 48, color: '#AA331E' },
    ],
    clima: { invierno: 95, primavera: 40, verano: 15, otono: 90, dia: 35, noche: 90 },
  },
  jpg_le_male_le_parfum: {
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'lavanda', porcentaje: 75, color: '#8076A3' },
      { nombre: 'aromático', porcentaje: 65, color: '#4A8B71' },
      { nombre: 'atalcado', porcentaje: 58, color: '#988E83' },
      { nombre: 'iris', porcentaje: 50, color: '#77638E' },
      { nombre: 'amaderado', porcentaje: 45, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 40, color: '#C87D2A' },
    ],
    clima: { invierno: 90, primavera: 50, verano: 20, otono: 85, dia: 45, noche: 85 },
  },
  jpg_le_beau_edt: {
    acordes: [
      { nombre: 'coco', porcentaje: 100, color: '#C4A972' },
      { nombre: 'vainilla', porcentaje: 85, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'cítrico', porcentaje: 65, color: '#B8B939' },
      { nombre: 'lactónico', porcentaje: 55, color: '#86888A' },
      { nombre: 'aromático', porcentaje: 48, color: '#4A8B71' },
      { nombre: 'ámbar', porcentaje: 42, color: '#C87D2A' },
    ],
    clima: { invierno: 25, primavera: 80, verano: 95, otono: 55, dia: 85, noche: 45 },
  },
  jpg_divine_elixir: {
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'marino', porcentaje: 75, color: '#258BD2' },
      { nombre: 'salado', porcentaje: 65, color: '#528EA6' },
      { nombre: 'atalcado', porcentaje: 55, color: '#988E83' },
      { nombre: 'aromático', porcentaje: 48, color: '#4A8B71' },
      { nombre: 'almizclado', porcentaje: 40, color: '#797E87' },
    ],
    clima: { invierno: 30, primavera: 85, verano: 85, otono: 60, dia: 80, noche: 50 },
  },
  paco_rabanne_invictus: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'marino', porcentaje: 88, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 65, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 48, color: '#C87D2A' },
      { nombre: 'acuático', porcentaje: 40, color: '#258BD2' },
    ],
    clima: { invierno: 20, primavera: 85, verano: 95, otono: 55, dia: 90, noche: 40 },
  },
  mandarine_sky: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'caramelo', porcentaje: 85, color: '#B86B2B' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 58, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 48, color: '#4A8B71' },
    ],
    clima: { invierno: 75, primavera: 60, verano: 35, otono: 85, dia: 60, noche: 75 },
  },
  valentino_born_in_roma: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'amaderado', porcentaje: 85, color: '#8D5524' },
      { nombre: 'afrutados', porcentaje: 75, color: '#D74423' },
      { nombre: 'floral blanco', porcentaje: 68, color: '#D989A6' },
      { nombre: 'cálido especiado', porcentaje: 58, color: '#AA331E' },
      { nombre: 'atalcado', porcentaje: 50, color: '#988E83' },
    ],
    clima: { invierno: 65, primavera: 75, verano: 50, otono: 80, dia: 70, noche: 65 },
  },
  dior_fahrenheit: {
    acordes: [
      { nombre: 'cuero', porcentaje: 100, color: '#5E3A24' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'ozónico', porcentaje: 75, color: '#4F9BC2' },
      { nombre: 'fresco especiado', porcentaje: 65, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 55, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 45, color: '#1F7A28' },
    ],
    clima: { invierno: 85, primavera: 55, verano: 25, otono: 85, dia: 55, noche: 80 },
  },
  asad_lattafa: {
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'fresco especiado', porcentaje: 88, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 78, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 70, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 62, color: '#CBB677' },
      { nombre: 'tabaco', porcentaje: 55, color: '#704B30' },
      { nombre: 'pachulí', porcentaje: 48, color: '#6F773B' },
    ],
    clima: { invierno: 90, primavera: 45, verano: 15, otono: 85, dia: 40, noche: 85 },
  },
  asad_zanzibar: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'coco', porcentaje: 85, color: '#C4A972' },
      { nombre: 'salado', porcentaje: 75, color: '#528EA6' },
      { nombre: 'iris', porcentaje: 65, color: '#77638E' },
      { nombre: 'lavanda', porcentaje: 58, color: '#8076A3' },
      { nombre: 'aromático', porcentaje: 50, color: '#4A8B71' },
    ],
    clima: { invierno: 40, primavera: 80, verano: 85, otono: 65, dia: 75, noche: 60 },
  },
  teriaq_intense_lattafa: {
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 88, color: '#AA331E' },
      { nombre: 'afrutados', porcentaje: 75, color: '#D74423' },
      { nombre: 'canela', porcentaje: 68, color: '#A84323' },
      { nombre: 'avainillado', porcentaje: 60, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 52, color: '#FF384D' },
      { nombre: 'aromático', porcentaje: 45, color: '#4A8B71' },
    ],
    clima: { invierno: 90, primavera: 45, verano: 15, otono: 85, dia: 35, noche: 90 },
  },
  billie_eilish_dorado: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 90, color: '#FF384D' },
      { nombre: 'cálido especiado', porcentaje: 80, color: '#AA331E' },
      { nombre: 'cacao', porcentaje: 72, color: '#5A3825' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' },
      { nombre: 'atalcado', porcentaje: 52, color: '#988E83' },
    ],
    clima: { invierno: 90, primavera: 45, verano: 20, otono: 85, dia: 45, noche: 85 },
  },
  billie_eilish_negro: {
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 85, color: '#4B8E6D' },
      { nombre: 'cítrico', porcentaje: 72, color: '#B8B939' },
      { nombre: 'cálido especiado', porcentaje: 65, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 55, color: '#4A8B71' },
      { nombre: 'floral', porcentaje: 45, color: '#D27B9B' },
    ],
    clima: { invierno: 75, primavera: 60, verano: 35, otono: 85, dia: 55, noche: 75 },
  },
  sweeth_tooth_cherry_baby: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'cereza', porcentaje: 78, color: '#B31D38' },
      { nombre: 'chocolate', porcentaje: 68, color: '#543220' },
      { nombre: 'avainillado', porcentaje: 58, color: '#CBB677' },
      { nombre: 'almizclado', porcentaje: 48, color: '#797E87' },
    ],
    clima: { invierno: 75, primavera: 60, verano: 35, otono: 80, dia: 60, noche: 75 },
  },
  polo_blue: {
    acordes: [
      { nombre: 'ozónico', porcentaje: 100, color: '#4F9BC2' },
      { nombre: 'acuático', porcentaje: 88, color: '#258BD2' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'verde', porcentaje: 55, color: '#1F7A28' },
      { nombre: 'fresco', porcentaje: 48, color: '#44A68C' },
      { nombre: 'cítrico', porcentaje: 42, color: '#B8B939' },
    ],
    clima: { invierno: 15, primavera: 85, verano: 95, otono: 55, dia: 90, noche: 30 },
  },
  eros_najim: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 78, color: '#1F7A28' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' },
      { nombre: 'cítrico', porcentaje: 48, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 42, color: '#D74423' },
    ],
    clima: { invierno: 65, primavera: 75, verano: 65, otono: 75, dia: 65, noche: 80 },
  },
  rome_extradose: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'lavanda', porcentaje: 68, color: '#8076A3' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' },
      { nombre: 'ahumado', porcentaje: 48, color: '#55565B' },
    ],
    clima: { invierno: 85, primavera: 50, verano: 25, otono: 85, dia: 45, noche: 85 },
  },
  la_bomba_ch: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'floral blanco', porcentaje: 88, color: '#D989A6' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'cacao', porcentaje: 58, color: '#5A3825' },
      { nombre: 'amaderado', porcentaje: 48, color: '#8D5524' },
    ],
    clima: { invierno: 85, primavera: 55, verano: 30, otono: 80, dia: 45, noche: 85 },
  },
  turathi_electric: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'almizclado', porcentaje: 68, color: '#797E87' },
      { nombre: 'atalcado', porcentaje: 58, color: '#988E83' },
      { nombre: 'fresco', porcentaje: 48, color: '#44A68C' },
      { nombre: 'floral blanco', porcentaje: 42, color: '#D989A6' },
    ],
    clima: { invierno: 20, primavera: 85, verano: 95, otono: 55, dia: 90, noche: 35 },
  },
  odyssey_eau_de_montagne: {
    acordes: [
      { nombre: 'almendrado', porcentaje: 100, color: '#BA9B7B' },
      { nombre: 'atalcado', porcentaje: 85, color: '#988E83' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'nueces', porcentaje: 65, color: '#A98260' },
      { nombre: 'lactónico', porcentaje: 55, color: '#86888A' },
    ],
    clima: { invierno: 80, primavera: 50, verano: 25, otono: 75, dia: 50, noche: 75 },
  },
  odyssey_candee: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'caramelo', porcentaje: 78, color: '#B86B2B' },
      { nombre: 'almizclado', porcentaje: 68, color: '#797E87' },
      { nombre: 'atalcado', porcentaje: 58, color: '#988E83' },
    ],
    clima: { invierno: 40, primavera: 85, verano: 75, otono: 60, dia: 85, noche: 40 },
  },
  odyssey_spectra: {
    acordes: [
      { nombre: 'canela', porcentaje: 100, color: '#A84323' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 80, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 72, color: '#D74423' },
      { nombre: 'cálido especiado', porcentaje: 65, color: '#AA331E' },
      { nombre: 'tabaco', porcentaje: 55, color: '#704B30' },
      { nombre: 'ámbar', porcentaje: 48, color: '#C87D2A' },
    ],
    clima: { invierno: 85, primavera: 50, verano: 25, otono: 85, dia: 45, noche: 85 },
  },
  odyssey_bahamas: {
    acordes: [
      { nombre: 'marino', porcentaje: 100, color: '#258BD2' },
      { nombre: 'acuático', porcentaje: 88, color: '#258BD2' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' },
      { nombre: 'fresco', porcentaje: 68, color: '#44A68C' },
      { nombre: 'dulce', porcentaje: 55, color: '#FF384D' },
      { nombre: 'ozónico', porcentaje: 45, color: '#4F9BC2' },
    ],
    clima: { invierno: 15, primavera: 80, verano: 95, otono: 45, dia: 90, noche: 30 },
  },
  odyssey_go_mango: {
    acordes: [
      { nombre: 'tropical', porcentaje: 100, color: '#EA6B3A' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 78, color: '#D74423' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' },
      { nombre: 'avainillado', porcentaje: 55, color: '#CBB677' },
      { nombre: 'cítrico', porcentaje: 48, color: '#B8B939' },
    ],
    clima: { invierno: 25, primavera: 85, verano: 95, otono: 55, dia: 85, noche: 45 },
  },
  odyssey_lichi: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 75, color: '#D27B9B' },
      { nombre: 'floral blanco', porcentaje: 65, color: '#D989A6' },
      { nombre: 'cítrico', porcentaje: 55, color: '#B8B939' },
      { nombre: 'avainillado', porcentaje: 48, color: '#CBB677' },
    ],
    clima: { invierno: 25, primavera: 90, verano: 90, otono: 55, dia: 85, noche: 35 },
  },
  odyssey_auod: {
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'oud', porcentaje: 88, color: '#4E3524' },
      { nombre: 'almizclado', porcentaje: 75, color: '#797E87' },
      { nombre: 'fresco especiado', porcentaje: 65, color: '#4B8E6D' },
      { nombre: 'ámbar', porcentaje: 55, color: '#C87D2A' },
    ],
    clima: { invierno: 85, primavera: 45, verano: 20, otono: 85, dia: 40, noche: 85 },
  },
  odyssey_mandarin_sky_vintage: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'caramelo', porcentaje: 85, color: '#B86B2B' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' },
    ],
    clima: { invierno: 75, primavera: 60, verano: 35, otono: 85, dia: 60, noche: 75 },
  },
  odyssey_mandarin_sky_elixir: {
    acordes: [
      { nombre: 'caramelo', porcentaje: 100, color: '#B86B2B' },
      { nombre: 'cítrico', porcentaje: 85, color: '#B8B939' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'ámbar', porcentaje: 68, color: '#C87D2A' },
      { nombre: 'avainillado', porcentaje: 58, color: '#CBB677' },
    ],
    clima: { invierno: 85, primavera: 50, verano: 25, otono: 85, dia: 45, noche: 85 },
  },
  odyssey_homme_white: {
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 85, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 75, color: '#FF384D' },
      { nombre: 'aromático', porcentaje: 65, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' },
    ],
    clima: { invierno: 80, primavera: 60, verano: 30, otono: 85, dia: 50, noche: 80 },
  },
  ab_golden_secret: {
    acordes: [
      { nombre: 'fresco especiado', porcentaje: 100, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'verde', porcentaje: 65, color: '#1F7A28' },
      { nombre: 'afrutados', porcentaje: 55, color: '#D74423' },
      { nombre: 'cuero', porcentaje: 45, color: '#5E3A24' },
    ],
    clima: { invierno: 70, primavera: 60, verano: 30, otono: 85, dia: 50, noche: 80 },
  },
  ab_blue: {
    acordes: [
      { nombre: 'aromático', porcentaje: 100, color: '#4A8B71' },
      { nombre: 'afrutados', porcentaje: 88, color: '#D74423' },
      { nombre: 'marino', porcentaje: 78, color: '#258BD2' },
      { nombre: 'acuático', porcentaje: 68, color: '#258BD2' },
      { nombre: 'verde', porcentaje: 58, color: '#1F7A28' },
      { nombre: 'fresco especiado', porcentaje: 48, color: '#4B8E6D' },
    ],
    clima: { invierno: 20, primavera: 85, verano: 95, otono: 55, dia: 90, noche: 35 },
  },
  ab_queen_of_seduction: {
    acordes: [
      { nombre: 'acuático', porcentaje: 100, color: '#258BD2' },
      { nombre: 'fresco', porcentaje: 88, color: '#44A68C' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 68, color: '#D74423' },
      { nombre: 'floral', porcentaje: 58, color: '#D27B9B' },
      { nombre: 'dulce', porcentaje: 48, color: '#FF384D' },
    ],
    clima: { invierno: 20, primavera: 90, verano: 95, otono: 55, dia: 90, noche: 35 },
  },
  ab_icon_men_edt: {
    acordes: [
      { nombre: 'fresco especiado', porcentaje: 100, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 78, color: '#B8B939' },
      { nombre: 'lavanda', porcentaje: 68, color: '#8076A3' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 48, color: '#AA331E' },
    ],
    clima: { invierno: 50, primavera: 85, verano: 70, otono: 75, dia: 80, noche: 55 },
  },
  ab_icon_men_edp: {
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' },
    ],
    clima: { invierno: 75, primavera: 60, verano: 30, otono: 85, dia: 45, noche: 85 },
  },
  icon_a_banderas_women: {
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'avainillado', porcentaje: 78, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 68, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 58, color: '#FF384D' },
      { nombre: 'lavanda', porcentaje: 48, color: '#8076A3' },
    ],
    clima: { invierno: 45, primavera: 85, verano: 65, otono: 75, dia: 80, noche: 55 },
  },
  pepe_l_indulgence_for_her: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'atalcado', porcentaje: 78, color: '#988E83' },
      { nombre: 'almendrado', porcentaje: 68, color: '#BA9B7B' },
      { nombre: 'lactónico', porcentaje: 58, color: '#86888A' },
      { nombre: 'cítrico', porcentaje: 48, color: '#B8B939' },
    ],
    clima: { invierno: 70, primavera: 65, verano: 40, otono: 80, dia: 60, noche: 75 },
  },
  jp_halloween_mujer: {
    acordes: [
      { nombre: 'floral', porcentaje: 100, color: '#D27B9B' },
      { nombre: 'atalcado', porcentaje: 88, color: '#988E83' },
      { nombre: 'marino', porcentaje: 78, color: '#258BD2' },
      { nombre: 'verde', porcentaje: 68, color: '#1F7A28' },
      { nombre: 'violeta', porcentaje: 58, color: '#7B6EA2' },
      { nombre: 'floral blanco', porcentaje: 48, color: '#D989A6' },
    ],
    clima: { invierno: 30, primavera: 90, verano: 75, otono: 70, dia: 85, noche: 50 },
  },
  nike_trendy_pink: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 75, color: '#D27B9B' },
      { nombre: 'almizclado', porcentaje: 65, color: '#797E87' },
      { nombre: 'avainillado', porcentaje: 55, color: '#CBB677' },
    ],
    clima: { invierno: 30, primavera: 85, verano: 80, otono: 60, dia: 85, noche: 45 },
  },
  nike_blue: {
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'marino', porcentaje: 75, color: '#258BD2' },
      { nombre: 'fresco especiado', porcentaje: 65, color: '#4B8E6D' },
      { nombre: 'cítrico', porcentaje: 55, color: '#B8B939' },
    ],
    clima: { invierno: 25, primavera: 85, verano: 95, otono: 55, dia: 90, noche: 35 },
  },
  nike_150: {
    acordes: [
      { nombre: 'fresco especiado', porcentaje: 100, color: '#4B8E6D' },
      { nombre: 'amaderado', porcentaje: 85, color: '#8D5524' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' },
      { nombre: 'cítrico', porcentaje: 65, color: '#B8B939' },
      { nombre: 'ámbar', porcentaje: 55, color: '#C87D2A' },
    ],
    clima: { invierno: 50, primavera: 80, verano: 80, otono: 70, dia: 85, noche: 50 },
  },
  nike_yummmy_musk: {
    acordes: [
      { nombre: 'almizclado', porcentaje: 100, color: '#797E87' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'avainillado', porcentaje: 75, color: '#CBB677' },
      { nombre: 'afrutados', porcentaje: 65, color: '#D74423' },
      { nombre: 'atalcado', porcentaje: 55, color: '#988E83' },
    ],
    clima: { invierno: 60, primavera: 75, verano: 55, otono: 75, dia: 75, noche: 65 },
  },
  nike_ginger_tonic: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'fresco especiado', porcentaje: 88, color: '#4B8E6D' },
      { nombre: 'aromático', porcentaje: 75, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 65, color: '#1F7A28' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' },
    ],
    clima: { invierno: 20, primavera: 85, verano: 95, otono: 60, dia: 90, noche: 35 },
  },
  game_of_spades_emerald: {
    acordes: [
      { nombre: 'cítrico', porcentaje: 100, color: '#B8B939' },
      { nombre: 'aromático', porcentaje: 85, color: '#4A8B71' },
      { nombre: 'amaderado', porcentaje: 75, color: '#8D5524' },
      { nombre: 'fresco especiado', porcentaje: 65, color: '#4B8E6D' },
      { nombre: 'almizclado', porcentaje: 55, color: '#797E87' },
    ],
    clima: { invierno: 30, primavera: 85, verano: 90, otono: 65, dia: 85, noche: 45 },
  },
  game_of_spades_diamond: {
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'dulce', porcentaje: 85, color: '#FF384D' },
      { nombre: 'afrutados', porcentaje: 75, color: '#D74423' },
      { nombre: 'ámbar', porcentaje: 65, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' },
    ],
    clima: { invierno: 65, primavera: 75, verano: 50, otono: 75, dia: 70, noche: 65 },
  },
  game_of_spades_full_house: {
    acordes: [
      { nombre: 'cálido especiado', porcentaje: 100, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'tabaco', porcentaje: 75, color: '#704B30' },
      { nombre: 'dulce', porcentaje: 65, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 55, color: '#8D5524' },
    ],
    clima: { invierno: 90, primavera: 45, verano: 15, otono: 85, dia: 40, noche: 85 },
  },
  game_of_spades_wildcard: {
    acordes: [
      { nombre: 'ámbar', porcentaje: 100, color: '#C87D2A' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'cálido especiado', porcentaje: 75, color: '#AA331E' },
      { nombre: 'aromático', porcentaje: 65, color: '#4A8B71' },
      { nombre: 'fresco', porcentaje: 55, color: '#44A68C' },
    ],
    clima: { invierno: 80, primavera: 55, verano: 25, otono: 85, dia: 45, noche: 85 },
  },
  game_of_spades_high_roller: {
    acordes: [
      { nombre: 'cuero', porcentaje: 100, color: '#5E3A24' },
      { nombre: 'amaderado', porcentaje: 88, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 75, color: '#C87D2A' },
      { nombre: 'cálido especiado', porcentaje: 65, color: '#AA331E' },
      { nombre: 'ahumado', porcentaje: 55, color: '#55565B' },
    ],
    clima: { invierno: 90, primavera: 45, verano: 15, otono: 85, dia: 35, noche: 90 },
  },
  game_of_spades_no_limit: {
    acordes: [
      { nombre: 'afrutados', porcentaje: 100, color: '#D74423' },
      { nombre: 'dulce', porcentaje: 88, color: '#FF384D' },
      { nombre: 'floral', porcentaje: 75, color: '#D27B9B' },
      { nombre: 'almizclado', porcentaje: 65, color: '#797E87' },
      { nombre: 'avainillado', porcentaje: 55, color: '#CBB677' },
    ],
    clima: { invierno: 40, primavera: 85, verano: 80, otono: 65, dia: 80, noche: 55 },
  },
  game_of_spades_bonus: {
    acordes: [
      { nombre: 'caramelo', porcentaje: 100, color: '#B86B2B' },
      { nombre: 'avainillado', porcentaje: 88, color: '#CBB677' },
      { nombre: 'dulce', porcentaje: 78, color: '#FF384D' },
      { nombre: 'amaderado', porcentaje: 65, color: '#8D5524' },
      { nombre: 'ámbar', porcentaje: 55, color: '#C87D2A' },
    ],
    clima: { invierno: 85, primavera: 50, verano: 20, otono: 85, dia: 45, noche: 85 },
  },
  game_of_spades_opal: {
    acordes: [
      { nombre: 'floral blanco', porcentaje: 100, color: '#D989A6' },
      { nombre: 'cítrico', porcentaje: 88, color: '#B8B939' },
      { nombre: 'fresco', porcentaje: 75, color: '#44A68C' },
      { nombre: 'almizclado', porcentaje: 65, color: '#797E87' },
      { nombre: 'verde', porcentaje: 55, color: '#1F7A28' },
    ],
    clima: { invierno: 25, primavera: 90, verano: 85, otono: 60, dia: 90, noche: 35 },
  },
  game_of_spades_royale: {
    acordes: [
      { nombre: 'amaderado', porcentaje: 100, color: '#8D5524' },
      { nombre: 'caramelo', porcentaje: 88, color: '#B86B2B' },
      { nombre: 'cacao', porcentaje: 75, color: '#5A3825' },
      { nombre: 'nueces', porcentaje: 65, color: '#A98260' },
      { nombre: 'floral blanco', porcentaje: 55, color: '#D989A6' },
      { nombre: 'dulce', porcentaje: 48, color: '#FF384D' },
    ],
    clima: { invierno: 85, primavera: 50, verano: 20, otono: 85, dia: 45, noche: 85 },
  },
  eros_najim: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'aromático', porcentaje: 88, color: '#4A8B71' },
      { nombre: 'verde', porcentaje: 78, color: '#1F7A28' },
      { nombre: 'fresco especiado', porcentaje: 68, color: '#4B8E6D' },
      { nombre: 'ámbar', porcentaje: 58, color: '#C87D2A' },
      { nombre: 'cítrico', porcentaje: 48, color: '#B8B939' },
      { nombre: 'afrutados', porcentaje: 42, color: '#D74423' },
    ],
    clima: { invierno: 65, primavera: 75, verano: 65, otono: 75, dia: 65, noche: 80 },
  },
  rome_extradose: {
    acordes: [
      { nombre: 'avainillado', porcentaje: 100, color: '#CBB677' },
      { nombre: 'ámbar', porcentaje: 88, color: '#C87D2A' },
      { nombre: 'aromático', porcentaje: 78, color: '#4A8B71' },
      { nombre: 'lavanda', porcentaje: 68, color: '#8076A3' },
      { nombre: 'amaderado', porcentaje: 58, color: '#8D5524' },
      { nombre: 'ahumado', porcentaje: 48, color: '#55565B' },
    ],
    clima: { invierno: 85, primavera: 50, verano: 25, otono: 85, dia: 45, noche: 85 },
  },
  la_bomba_ch: {
    acordes: [
      { nombre: 'dulce', porcentaje: 100, color: '#FF384D' },
      { nombre: 'floral blanco', porcentaje: 88, color: '#D989A6' },
      { nombre: 'cálido especiado', porcentaje: 78, color: '#AA331E' },
      { nombre: 'avainillado', porcentaje: 68, color: '#CBB677' },
      { nombre: 'cacao', porcentaje: 58, color: '#5A3825' },
      { nombre: 'amaderado', porcentaje: 48, color: '#8D5524' },
    ],
    clima: { invierno: 85, primavera: 55, verano: 30, otono: 80, dia: 45, noche: 85 },
  },
};

// Aplicar al catálogo
let actualizados = 0;
for (const p of catalogo) {
  const perfil = PERFILES_FRAGRANTICA[p.id];
  if (perfil) {
    p.acordes = perfil.acordes;
    p.clima = perfil.clima;
    actualizados++;
  } else {
    // Si no está en el mapa específico, traducir acordes al español estándar de Fragrantica
    if (p.acordes && p.acordes.length) {
      p.acordes = p.acordes.map((ac) => {
        let nombreEsp = ac.nombre.toLowerCase();
        if (nombreEsp === 'sweet') nombreEsp = 'dulce';
        else if (nombreEsp === 'citrus') nombreEsp = 'cítrico';
        else if (nombreEsp === 'fruity') nombreEsp = 'afrutados';
        else if (nombreEsp === 'vanilla') nombreEsp = 'avainillado';
        else if (nombreEsp === 'powdery') nombreEsp = 'atalcado';
        else if (nombreEsp === 'woody') nombreEsp = 'amaderado';
        else if (nombreEsp === 'aromatic') nombreEsp = 'aromático';
        else if (nombreEsp === 'fresh') nombreEsp = 'fresco';
        else if (nombreEsp === 'warm spicy') nombreEsp = 'cálido especiado';
        else if (nombreEsp === 'fresh spicy') nombreEsp = 'fresco especiado';
        else if (nombreEsp === 'aquatic') nombreEsp = 'acuático';
        else if (nombreEsp === 'marine') nombreEsp = 'marino';
        else if (nombreEsp === 'floral') nombreEsp = 'floral';
        else if (nombreEsp === 'amber') nombreEsp = 'ámbar';
        else if (nombreEsp === 'white floral') nombreEsp = 'floral blanco';
        return {
          ...ac,
          nombre: nombreEsp,
        };
      });
    }
  }
}

fs.writeFileSync(rutaJson, JSON.stringify(catalogo, null, 2), 'utf8');
console.log(`Perfiles actualizados con éxito: ${actualizados} específicos + resto en español de Fragrantica.`);
