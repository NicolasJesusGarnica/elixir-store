import time
from concurrent.futures import ThreadPoolExecutor
from ddgs import DDGS

test_queries = [
    "Afnan 9 AM perfume bottle white background",
    "Armaf Club de Nuit perfume bottle white background",
    "Lattafa Khamrah perfume bottle white background",
    "Mancera Cedrat Boise perfume bottle white background",
    "Xerjoff Naxos perfume bottle white background",
    "Al Haramain Amber Oud perfume bottle white background",
]

def search_one(q):
    t0 = time.time()
    try:
        with DDGS() as ddgs:
            results = list(ddgs.images(q, max_results=3))
            return len(results), time.time() - t0, None
    except Exception as e:
        return 0, time.time() - t0, str(e)

t_start = time.time()
with ThreadPoolExecutor(max_workers=3) as ex:
    res = list(ex.map(search_one, test_queries))

for q, r in zip(test_queries, res):
    print(f"{q[:35]}: {r[0]} imgs en {r[1]:.1f}s (err: {r[2]})")

print(f"Total tiempo para 6 consultas concurrentes: {time.time()-t_start:.1f}s")
