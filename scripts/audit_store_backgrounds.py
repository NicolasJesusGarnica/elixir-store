import json
import urllib.request
import concurrent.futures
from PIL import Image
import io

with open('src/assets/perfumes.json', 'r', encoding='utf-8') as f:
    perfumes = json.load(f)

print(f"Total perfumes in catalog: {len(perfumes)}")

def check_perfume_bg(p):
    img_url = p.get('imagenes', [None])[0]
    if not img_url:
        return p['id'], p['nombre'], 'NO_URL', None, 0
    
    try:
        req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = resp.read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            w, h = im.size
            
            # Sample border points: 4 corners + 4 edge midpoints
            pts = [
                (int(w * 0.03), int(h * 0.03)),
                (int(w * 0.97), int(h * 0.03)),
                (int(w * 0.03), int(h * 0.97)),
                (int(w * 0.97), int(h * 0.97)),
                (int(w * 0.50), int(h * 0.02)),
                (int(w * 0.50), int(h * 0.98)),
                (int(w * 0.02), int(h * 0.50)),
                (int(w * 0.98), int(h * 0.50)),
            ]
            
            white_count = 0
            pixels = []
            for pt in pts:
                r, g, b = im.getpixel(pt)
                pixels.append((r, g, b))
                # Pure white studio background: high brightness and very low color tint/saturation
                if r >= 238 and g >= 238 and b >= 238 and (max(r, g, b) - min(r, g, b) <= 12):
                    white_count += 1
            
            avg_r = sum(p[0] for p in pixels[:4]) // 4
            avg_g = sum(p[1] for p in pixels[:4]) // 4
            avg_b = sum(p[2] for p in pixels[:4]) // 4
            
            # If 6 or more border points are pure white, it's a clean white studio image
            is_white = white_count >= 6
            return p['id'], p['nombre'], is_white, (avg_r, avg_g, avg_b), white_count, img_url
    except Exception as e:
        return p['id'], p['nombre'], 'ERROR', str(e), 0, img_url

print("Auditing images on R2 concurrently...")
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    results = list(executor.map(check_perfume_bg, perfumes))

non_white = [r for r in results if r[2] is False]
errors = [r for r in results if r[2] == 'ERROR']

print(f"\nAudit complete!")
print(f"Total checked: {len(results)}")
print(f"White background OK: {len([r for r in results if r[2] is True])}")
print(f"Non-white background found: {len(non_white)}")
print(f"Errors: {len(errors)}")

# Save report
report = [
    {
        'id': r[0],
        'nombre': r[1],
        'avg_corners': r[3],
        'white_score': r[4],
        'img_url': r[5]
    }
    for r in non_white
]

with open('scripts/non_white_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print(f"Saved {len(report)} items to scripts/non_white_report.json")
