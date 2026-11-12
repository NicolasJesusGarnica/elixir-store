import os

for root, dirs, files in os.walk('.'):
    if any(x in root for x in ['node_modules', '.git', '.angular', 'dist']):
        continue
    for f in files:
        if f.endswith(('.js', '.cjs', '.ts', '.py')):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as file:
                    if 'perfumes.json' in file.read():
                        print(p)
            except:
                pass
