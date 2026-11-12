import glob
import os
from PIL import Image

files = glob.glob('temp_raw_catalog/*')
print(f"Total files in temp_raw_catalog: {len(files)}")

non_white = []

for f in files:
    try:
        im = Image.open(f).convert('RGB')
        w, h = im.size
        
        # Sample points along the corners and outer edges
        # 4 corners (at 2% inside from edges to avoid 1px border artifacts)
        sample_points = [
            (int(w * 0.03), int(h * 0.03)),
            (int(w * 0.97), int(h * 0.03)),
            (int(w * 0.03), int(h * 0.97)),
            (int(w * 0.97), int(h * 0.97)),
            (int(w * 0.50), int(h * 0.03)), # top center
            (int(w * 0.03), int(h * 0.50)), # left center
            (int(w * 0.97), int(h * 0.50)), # right center
        ]
        
        pixels = [im.getpixel(pt) for pt in sample_points]
        
        # Check if the border is white:
        # A white studio background should have R, G, B all > 235 on all or almost all border points,
        # and saturation very low (|R-G| < 15, |G-B| < 15).
        white_count = 0
        for r, g, b in pixels:
            if r >= 235 and g >= 235 and b >= 235 and max(r, g, b) - min(r, g, b) <= 15:
                white_count += 1
                
        # If fewer than 4 out of 7 border points are white, this background is NOT white studio!
        if white_count < 4:
            # Calculate average corner RGB
            avg_r = sum(p[0] for p in pixels[:4]) // 4
            avg_g = sum(p[1] for p in pixels[:4]) // 4
            avg_b = sum(p[2] for p in pixels[:4]) // 4
            non_white.append((f, (avg_r, avg_g, avg_b), white_count))
    except Exception as e:
        print(f"Error {f}: {e}")

print(f"\nNon-white background images found: {len(non_white)}")
for f, avg_rgb, wc in sorted(non_white, key=lambda x: x[0]):
    print(f"  {os.path.basename(f)}: avg_corners={avg_rgb}, white_points={wc}/7")
