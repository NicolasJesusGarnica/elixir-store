import json

with open('scripts/non_white_report.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data:
    print(f"{item['id']} | {item['nombre']} | corners={item['avg_corners']} | score={item['white_score']}/8")
