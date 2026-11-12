import glob
import os
from PIL import Image

files = glob.glob('temp_raw_catalog/*')

stats = []

for f in files:
    try:
        im = Image.open(f).convert('RGB')
        w, h = im.size
        # Sample every 5th pixel for speed
        total = 0
        white = 0
        for y in range(0, h, 6):
            for x in range(0, w, 6):
                r, g, b = im.getpixel((x, y))
                total += 1
                if r >= 235 and g >= 235 and b >= 235 and max(r, g, b) - min(r, g, b) <= 15:
                    white += 1
        ratio = white / total if total > 0 else 0
        stats.append((f, ratio, (w, h)))
    except Exception as e:
        print(f"Error {f}: {e}")

stats.sort(key=lambda x: x[1])

print("Top 30 files with LOWEST white pixel percentage in temp_raw_catalog:")
for f, r, sz in stats[:30]:
    print(f"  {r*100:5.1f}% white | {sz} | {os.path.basename(f)}")

print("\nFiles with < 35% white pixels:", len([s for s in stats if s[1] < 0.35]))
print("Files with < 20% white pixels:", len([s for s in stats if s[1] < 0.20]))
print("Files with < 10% white pixels:", len([s for s in stats if s[1] < 0.10]))
