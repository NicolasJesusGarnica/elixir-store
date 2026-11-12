from PIL import Image

for name in ['marwa_justmylook', 'marwa_souq']:
    im = Image.open(f'scripts/{name}.png')
    print(f"{name}: size={im.size}, mode={im.mode}")
    # Composite on white
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        alpha = im.convert('RGBA')
        bg = Image.new('RGB', alpha.size, (255, 255, 255))
        bg.paste(alpha, mask=alpha.split()[3])
        out_im = bg
    else:
        out_im = im.convert('RGB')
    
    # Check corners of out_im
    w, h = out_im.size
    corners = [
        out_im.getpixel((10, 10)),
        out_im.getpixel((w - 10, 10)),
        out_im.getpixel((10, h - 10)),
        out_im.getpixel((w - 10, h - 10))
    ]
    print(f"  Corners: {corners}")
    out_im.save(f'scripts/{name}_white.png')
