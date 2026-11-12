from ddgs import DDGS
import urllib.request
from PIL import Image
import io

def check_white_bg(img_bytes):
    try:
        im = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        w, h = im.size
        # Sample the outer 10% perimeter
        perimeter_pixels = []
        for x in range(0, w, max(1, w // 20)):
            perimeter_pixels.append(im.getpixel((x, int(h * 0.05))))
            perimeter_pixels.append(im.getpixel((x, int(h * 0.95))))
        for y in range(0, h, max(1, h // 20)):
            perimeter_pixels.append(im.getpixel((int(w * 0.05), y)))
            perimeter_pixels.append(im.getpixel((int(w * 0.95), y)))
            
        white_count = sum(1 for r, g, b in perimeter_pixels if r >= 240 and g >= 240 and b >= 240 and max(r,g,b)-min(r,g,b) <= 12)
        ratio = white_count / len(perimeter_pixels)
        return ratio > 0.85, ratio, im
    except Exception as e:
        return False, 0, None

queries = {
    'prada_paradoxe_intense': 'Prada Paradoxe Intense bottle box white background',
    'afnan_9pm_negro_100': 'Afnan 9PM EDP 100ml Fullbai bottle box white background'
}

with DDGS() as ddgs:
    for key, q in queries.items():
        print(f"\nSearching for {key}: {q}")
        res = list(ddgs.images(q, max_results=10))
        for idx, r in enumerate(res):
            url = r['image']
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=5) as resp:
                    data = resp.read()
                    ok, ratio, im = check_white_bg(data)
                    print(f" [{idx}] white_ratio={ratio:.2f}, size={im.size if im else 0}: {url[:70]}...")
            except Exception as e:
                pass
