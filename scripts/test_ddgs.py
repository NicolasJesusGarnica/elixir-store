from ddgs import DDGS

test_perfumes = [
    'Parfums de Marly Althair bottle white background',
    'Lattafa Khamrah Qahwa bottle white background',
    'Afnan Historic Sahara bottle white background',
    'Xerjoff Naxos bottle white background',
    'Jean Paul Gaultier Le Beau Paradise Garden bottle white background'
]

with DDGS() as ddgs:
    for q in test_perfumes:
        res = list(ddgs.images(q, max_results=1))
        if res:
            print(f"OK: {q}")
            print(f"  -> {res[0]['image']}")
        else:
            print(f"FAIL: {q}")
