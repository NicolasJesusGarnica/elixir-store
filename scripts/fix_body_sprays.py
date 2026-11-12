import json

with open('src/assets/perfumes.json', encoding='utf-8') as f:
    cat = json.load(f)

with open('scripts/progreso_r2.json', encoding='utf-8') as f:
    prog_r2 = json.load(f)

body_sprays = {
    'av_eau_my_unicorn_eau_my_unicorn_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_eau_my_unicorn_body_spray.webp',
    'av_mickey_mouse_mickey_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_mickey_body_spray.webp',
    'av_barbie_tester_barbie_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_barbie_body_spray.webp',
    'av_marvel_marvel_capitan_america_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_marvel_capitan_america_body_spray.webp',
    'av_minnie_mouse_minnie_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_minnie_body_spray.webp',
    'av_spiderman_spiderman_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_spiderman_body_spray.webp',
    'av_paw_patrol_paw_patrol_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_paw_patrol_body_spray.webp',
    'av_lilo_and_stich_lilo_and_stich_body_spray': 'https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/air_val_lilo_and_stich_body_spray.webp'
}

for p in cat:
    if p['id'] in body_sprays:
        p['imagenes'] = [body_sprays[p['id']]]
        print(f"Set exact body spray image for {p['id']}: {p['imagenes'][0]}")

with open('src/assets/perfumes.json', 'w', encoding='utf-8') as f:
    json.dump(cat, f, ensure_ascii=False, indent=2)

print("Saved exact body spray mappings.")
