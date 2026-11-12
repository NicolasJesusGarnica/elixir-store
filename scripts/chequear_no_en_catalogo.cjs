const fs = require('fs');

const catalogo = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf8'));
const localIds = new Set(catalogo.map(p => p.id));

// IDs de los 78 viejos en Firestore
const firestoreIds = [
  '9_am_dive', '9_pm_black', '9_pm_elixir', '9_pm_night_out', '9pm_rebel',
  'ab_blue', 'ab_golden_secret', 'ab_icon_men_edp', 'ab_icon_men_edt', 'ab_queen_of_seduction',
  'acqua_di_gio_edp', 'ag_ari', 'ag_cloud', 'ag_god_is_a_woman', 'ag_mood_blush',
  'ag_moonlight', 'ag_sweet_like_candy', 'ag_thank_u_next', 'angel_fantasm_mugler',
  'angel_stellar_mugler', 'asad_lattafa', 'asad_zanzibar', 'azzaro_tmw_edp_intense',
  'azzaro_tmw_parfum', 'bharara_king', 'billie_eilish_dorado', 'billie_eilish_negro',
  'dior_fahrenheit', 'eros_najim', 'game_of_spades_bonus', 'game_of_spades_diamond',
  'game_of_spades_emerald', 'game_of_spades_full_house', 'game_of_spades_high_roller',
  'game_of_spades_no_limit', 'game_of_spades_opal', 'game_of_spades_wildcard',
  'hawas_fire', 'hawas_for_him', 'hawas_ice', 'hawas_kobra', 'hawas_malibu',
  'hawas_tropical', 'hawas_verde', 'icon_a_banderas_women', 'jp_halloween_mujer',
  'jpg_divine_elixir', 'jpg_le_beau_edt', 'jpg_le_classique_edp', 'jpg_le_male_elixir',
  'jpg_le_male_le_parfum', 'la_bomba_ch', 'mandarine_sky', 'nike_150', 'nike_blue',
  'nike_ginger_tonic', 'nike_trendy_pink', 'nike_yummmy_musk', 'odyssey_auod',
  'odyssey_bahamas', 'odyssey_candee', 'odyssey_eau_de_montagne', 'odyssey_go_mango',
  'odyssey_homme_white', 'odyssey_lichi', 'odyssey_mandarin_sky_elixir',
  'odyssey_mandarin_sky_vintage', 'odyssey_spectra', 'paco_rabanne_invictus',
  'pepe_l_indulgence_for_her', 'polo_blue', 'rome_extradose', 'stronger_with_you_in',
  'sweeth_tooth_cherry_baby', 'teriaq_intense_lattafa', 'turathi_electric',
  'valentino_born_in_roma', 'xerjoff_erba_pura'
];

const noEnCatalogo = firestoreIds.filter(id => !localIds.has(id));
console.log('Total en Firestore que no están en catalogo local:', noEnCatalogo.length);
console.log(noEnCatalogo);
