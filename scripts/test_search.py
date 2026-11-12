import urllib.request
import urllib.parse
import re

query = 'Lattafa Asad Bourbon bottle white background'
url = f'https://www.bing.com/images/search?q={urllib.parse.quote(query)}&FORM=HDRSC2'

req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
)

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        murls = re.findall(r'murl&quot;:&quot;(http[^&]+)&quot;', html)
        print('Bing images found:', len(murls))
        for m in murls[:3]:
            print(' -', m)
except Exception as e:
    print('Error:', e)
