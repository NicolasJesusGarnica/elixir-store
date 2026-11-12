import os
import glob
from PIL import Image

files = glob.glob('temp_raw_catalog/*')
print(f"Total files in temp_raw_catalog: {len(files)}")

suspects = []
for f in files:
    try:
        im = Image.open(f)
        # Check aspect ratio, size, or color variance
        # Text/documents typically have almost purely black & white pixels and very high white percentage (>80%) with sharp high-contrast text lines
        gray = im.convert('L')
        w, h = gray.size
        # Sample points or histogram
        hist = gray.histogram()
        # count pixels that are pure white (250-255) vs black (0-50) vs midtones (51-249)
        white_pixels = sum(hist[240:])
        black_pixels = sum(hist[:60])
        mid_pixels = sum(hist[60:240])
        total = w * h
        white_ratio = white_pixels / total
        black_ratio = black_pixels / total
        mid_ratio = mid_pixels / total
        
        # Document table: very high white (>75%), tiny black (text lines > 3%), very low midtone colors (<15%)
        # and almost no colorful saturation!
        if im.mode in ('RGB', 'RGBA'):
            rgb = im.convert('RGB')
            # Check saturation
            # sample 100 pixels
            saturations = []
            for x in range(0, w, max(1, w // 20)):
                for y in range(0, h, max(1, h // 20)):
                    r, g, b = rgb.getpixel((x, y))
                    mx = max(r, g, b)
                    mn = min(r, g, b)
                    sat = (mx - mn) / mx if mx > 0 else 0
                    saturations.append(sat)
            avg_sat = sum(saturations) / len(saturations)
            
            # If it has almost 0 saturation (grayscale document) AND high white ratio AND mid_ratio is low
            if avg_sat < 0.05 and white_ratio > 0.70 and black_ratio > 0.02 and mid_ratio < 0.20:
                suspects.append((f, white_ratio, black_ratio, avg_sat))
    except Exception as e:
        print(f"Error reading {f}: {e}")

print(f"\nDocument/Grayscale suspects found: {len(suspects)}")
for s in suspects:
    print(" ->", s)
