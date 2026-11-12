import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\njgar\.gemini\antigravity\brain\d730f7fa-6104-4e26-9d77-427391740b10\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        idx = data.get('step_index', 0)
        if 4680 <= idx <= 4735:
            tp = data.get('type')
            cnt = data.get('content', '')
            if len(cnt) > 300: cnt = cnt[:300] + '...'
            print(f"Step {idx} [{tp}]: {cnt}\n")
