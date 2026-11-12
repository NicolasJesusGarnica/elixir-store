import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = r'C:/Users/njgar/.gemini/antigravity/brain/d730f7fa-6104-4e26-9d77-427391740b10/.system_generated/logs/transcript.jsonl'
with open(transcript_path, encoding='utf-8') as f:
    lines = [json.loads(line) for line in f]

user_steps = []
for i, l in enumerate(lines):
    if l.get('source') == 'USER_EXPLICIT' or l.get('type') == 'USER_INPUT':
        txt = (l.get('content') or '')[:120].replace('\n', ' ')
        user_steps.append((l.get('step_index', i), txt, i))

print(f"Total user steps: {len(user_steps)}")
for s, txt, line_no in user_steps[-25:]:
    print(f"Step {s} (line {line_no}): {txt}")
