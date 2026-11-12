from PIL import Image

def process_to_luxury_white_webp(input_path, output_path, canvas_size=800, content_target_size=720):
    im = Image.open(input_path)
    
    # 1. Composite onto white if alpha
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        alpha = im.convert('RGBA')
        bg = Image.new('RGB', alpha.size, (255, 255, 255))
        bg.paste(alpha, mask=alpha.split()[3])
        im_rgb = bg
    else:
        im_rgb = im.convert('RGB')
    
    # 2. Find bounding box of non-white content
    # A pixel is non-white if any channel is < 245
    w, h = im_rgb.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    
    # Sample step for speed
    step = 2
    found = False
    for y in range(0, h, step):
        for x in range(0, w, step):
            r, g, b = im_rgb.getpixel((x, y))
            if r < 242 or g < 242 or b < 242:
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                found = True
                
    if not found:
        min_x, min_y, max_x, max_y = 0, 0, w, h
    else:
        # Add small margin
        pad = 10
        min_x = max(0, min_x - pad)
        min_y = max(0, min_y - pad)
        max_x = min(w, max_x + pad)
        max_y = min(h, max_y + pad)
        
    cropped = im_rgb.crop((min_x, min_y, max_x, max_y))
    cw, ch = cropped.size
    
    # 3. Scale proportionally so max dimension is content_target_size
    scale = min(content_target_size / cw, content_target_size / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 4. Center on canvas_size x canvas_size pure white
    canvas = Image.new('RGB', (canvas_size, canvas_size), (255, 255, 255))
    offset_x = (canvas_size - new_w) // 2
    offset_y = (canvas_size - new_h) // 2
    canvas.paste(resized, (offset_x, offset_y))
    
    canvas.save(output_path, 'WEBP', quality=88, method=6)
    print(f"Saved {output_path}: canvas={canvas_size}x{canvas_size}, content={new_w}x{new_h}")
    return output_path

if __name__ == '__main__':
    process_to_luxury_white_webp('scripts/marwa_justmylook.png', 'scripts/arabiyat_prestige_marwa_opt.webp')
