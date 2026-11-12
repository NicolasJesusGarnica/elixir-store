import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\njgar\.gemini\antigravity\brain\d730f7fa-6104-4e26-9d77-427391740b10\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        txt = json.dumps(data)
        if 'decant' in txt.lower():
            # If user message or planning message
            if data.get('type') == 'USER_INPUT':
                print(f"[USER Step {data.get('step_index')}]: {data.get('content')}")
            elif data.get('type') == 'PLANNER_RESPONSE':
                # Check if it has specific keywords like "lista de decants" or "decants oficiales"
                if any(w in txt.lower() for w in ['decants oficiales', 'decant de', 'los decants son', 'hicimos los decants']):
                    print(f"[ASSISTANT Step {data.get('step_index')}]: {data.get('content', '')[:300]}...")
