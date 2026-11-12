import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\njgar\.gemini\antigravity\brain\d730f7fa-6104-4e26-9d77-427391740b10\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            txt = data.get('content', '')
            if 'decant' in txt.lower():
                print(f"Step {data.get('step_index')}: {txt}\n---")
