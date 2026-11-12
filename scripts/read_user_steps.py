import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\njgar\.gemini\antigravity\brain\d730f7fa-6104-4e26-9d77-427391740b10\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    lines = f.readlines()

user_steps = []
for line in lines:
    try:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            user_steps.append((data.get('step_index'), data.get('content', '')))
    except:
        pass

print(f"Total user steps: {len(user_steps)}")
for idx, txt in user_steps[-20:]:
    print(f"\n[Step {idx}]:\n{txt}")
