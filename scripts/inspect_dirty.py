import json

with open('scripts/dirty_perfumes.json', 'r', encoding='utf-8') as f:
    dirty = json.load(f)

for d in dirty[:15]:
    print(d['id'], d['nombre'], d['reason'])
