import urllib.request
import urllib.parse
import re

query = 'Versace Eros Energy bottle white background'
url = f'https://www.google.com/search?q={urllib.parse.quote(query)}&udm=2'
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print('Google udm=2 HTML length:', len(html))
        # Look for image URLs: e.g. ["https://...", width, height]
        imgs = re.findall(r'\[\"(https://[^\"]+?\.(?:jpg|png|webp|jpeg)[^\"]*?)\"', html)
        print('Images found:', len(imgs))
        for img in imgs[:5]:
            print(' -', img)
except Exception as e:
    print('Error:', e)
