from bing_image_downloader import downloader
import os

test_dir = 'temp_test_images'
query = 'Versace Eros Energy bottle white background'

downloader.download(
    query,
    limit=2,
    output_dir=test_dir,
    adult_filter_off=True,
    force_replace=False,
    timeout=10,
    verbose=True
)

downloaded = os.listdir(os.path.join(test_dir, query)) if os.path.exists(os.path.join(test_dir, query)) else []
print("Archivos descargados:", downloaded)
