import os
from icrawler.builtin import GoogleImageCrawler

test_dir = 'temp_test_images/google_eros'
os.makedirs(test_dir, exist_ok=True)

print("Iniciando prueba de GoogleImageCrawler...")
google_crawler = GoogleImageCrawler(storage={'root_dir': test_dir})
google_crawler.crawl(keyword='Versace Eros Energy bottle white background', max_num=2)

files = os.listdir(test_dir)
print(f"Descargados con Google: {len(files)} archivos -> {files}")
