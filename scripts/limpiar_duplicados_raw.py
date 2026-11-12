import os

DIR = 'temp_raw_catalog'
files = os.listdir(DIR)
by_id = {}
for f in files:
    name, ext = os.path.splitext(f)
    path = os.path.join(DIR, f)
    size = os.path.getsize(path)
    by_id.setdefault(name, []).append((path, size))

removed = 0
for name, list_files in by_id.items():
    if len(list_files) > 1:
        list_files.sort(key=lambda x: x[1], reverse=True)
        # Mantener el más pesado, eliminar los demás
        for p, s in list_files[1:]:
            try:
                os.remove(p)
                removed += 1
            except Exception:
                pass

print(f"Archivos redundantes eliminados: {removed}. Total ahora: {len(os.listdir(DIR))}")
