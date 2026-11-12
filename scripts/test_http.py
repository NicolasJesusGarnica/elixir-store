import urllib.request
import re

url = 'http://localhost:4200/perfumes/teriaq_intense_lattafa'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=5) as response:
        html = response.read().decode('utf-8')
        
    print(f"Status 200 OK. Longitud: {len(html)}")
    
    # Extraer titulo
    title = re.search(r'<title>(.*?)</title>', html)
    print("Title:", title.group(1) if title else "No title")
    
    # Buscar menciones de decant o botella completa
    if "Botella Completa" in html:
        print("✓ Encontrado 'Botella Completa'")
    if "450" in html:
        print("✓ Encontrado '450' (Precio oficial)")
    if "Selecciona el tamaño del decant" in html:
        print("✗ ALERTA: Aún aparece 'Selecciona el tamaño del decant'")
    else:
        print("✓ NO aparece selector de decants (Eliminado correctamente)")
except Exception as e:
    print("Error:", e)
