from PIL import Image
import numpy as np

def clean_supremacy(in_path, out_path):
    im = Image.open(in_path).convert('RGB')
    arr = np.array(im)
    
    # Background in afnan_supremacy_in_oud is uniform light grey (~230-245 with low saturation)
    # The bottle is dark bronze/gold and gold ring
    r = arr[:, :, 0].astype(int)
    g = arr[:, :, 1].astype(int)
    b = arr[:, :, 2].astype(int)
    
    # Condition for background: brightness > 215 and saturation (max - min) < 15
    diff = np.maximum(np.maximum(np.abs(r - g), np.abs(r - b)), np.abs(g - b))
    is_bg = (r > 215) & (g > 215) & (b > 215) & (diff < 15)
    
    arr[is_bg] = [255, 255, 255]
    res = Image.fromarray(arr)
    res.save(out_path, quality=95)
    print("Cleaned supremacy saved to", out_path)

clean_supremacy('temp_download_12/afnan_supremacy_in_oud.jpg', 'temp_download_12/afnan_supremacy_in_oud_clean.jpg')
