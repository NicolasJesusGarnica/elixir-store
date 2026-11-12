from PIL import Image

im = Image.open('temp_review_12/ajmal_vi.webp')
print("Ajmal VI size:", im.size)
# Save as png in artifacts or brain so we can inspect or let's check
im.save('temp_review_12/ajmal_vi.png')
