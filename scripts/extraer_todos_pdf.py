import json
from pypdf import PdfReader

pdf_path = r"C:/Users/njgar/.gemini/antigravity/brain/d730f7fa-6104-4e26-9d77-427391740b10/.user_uploaded/media_1794191566785_c4cf0e6b.pdf"
reader = PdfReader(pdf_path)

print(f"Total pages: {len(reader.pages)}")

all_rows = []
for page_num, page in enumerate(reader.pages, 1):
    text = page.extract_text()
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Check if line contains price at the end, e.g. 100.00, 420.00
        parts = line.split()
        if len(parts) >= 4:
            # Let's collect lines
            all_rows.append((page_num, line))

print(f"Total extracted lines: {len(all_rows)}")
with open("scripts/raw_pdf_lines.txt", "w", encoding="utf-8") as f:
    for page_num, line in all_rows:
        f.write(f"PAG {page_num}: {line}\n")
