import os

keyword = "teriaq"
for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or '.angular' in root or 'dist' in root:
        continue
    for f in files:
        path = os.path.join(root, f)
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
                if keyword in content.lower():
                    print(f"Found in {path}")
        except Exception:
            pass
