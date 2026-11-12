from PIL import Image, ImageDraw

def floodfill_white(in_path, out_path, thresh=30):
    im = Image.open(in_path).convert('RGB')
    w, h = im.size
    
    # Floodfill from four corners
    corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for c in corners:
        try:
            ImageDraw.floodfill(im, c, (255, 255, 255), thresh=thresh)
        except Exception as e:
            pass
            
    im.save(out_path, quality=95)
    print(f"Saved: {out_path}")

floodfill_white('temp_download_12/afnan_supremacy_in_oud.jpg', 'temp_download_12/afnan_supremacy_in_oud_clean.jpg', thresh=35)
