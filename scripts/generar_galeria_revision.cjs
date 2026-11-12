const fs = require('fs');
const path = require('path');

const perfumes = JSON.parse(fs.readFileSync('src/assets/perfumes.json', 'utf-8'));

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elixir Perfumería — Galería de Revisión del Catálogo Maestro</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0c0a09;
      --card-bg: #141210;
      --card-border: rgba(200, 169, 106, 0.15);
      --card-border-hover: rgba(200, 169, 106, 0.45);
      --gold: #C8A96A;
      --gold-light: #e5cb96;
      --text-main: #fbfaf7;
      --text-muted: #a8a29e;
      --text-dim: #78716c;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      padding: 30px 20px 80px;
    }
    header {
      max-width: 1400px;
      margin: 0 auto 30px;
      text-align: center;
      padding-bottom: 25px;
      border-bottom: 1px solid var(--card-border);
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 10px;
      border: 1px solid rgba(200,169,106,0.3);
      padding: 4px 12px;
      border-radius: 999px;
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      letter-spacing: 0.05em;
      color: #fff;
      margin-bottom: 8px;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 14px;
    }
    .controls {
      max-width: 1400px;
      margin: 0 auto 25px;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      background: var(--card-bg);
      padding: 16px 20px;
      border-radius: 12px;
      border: 1px solid var(--card-border);
    }
    .search-box {
      flex: 1;
      min-width: 250px;
    }
    .search-box input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(200,169,106,0.25);
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .search-box input:focus {
      border-color: var(--gold);
    }
    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    select {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(200,169,106,0.25);
      color: var(--text-main);
      padding: 9px 14px;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
      cursor: pointer;
    }
    .stats {
      color: var(--gold);
      font-size: 13px;
      font-weight: 600;
    }
    .grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: var(--card-border-hover);
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    }
    .img-wrap {
      width: 100%;
      height: 260px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      position: relative;
    }
    .img-wrap img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }
    .card:hover .img-wrap img {
      transform: scale(1.04);
    }
    .type-pill {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(20, 18, 16, 0.85);
      backdrop-filter: blur(4px);
      color: var(--gold);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid rgba(200,169,106,0.3);
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 4px;
    }
    .title {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      color: #fff;
      margin-bottom: 8px;
      line-height: 1.25;
      min-height: 40px;
    }
    .accords {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 12px;
    }
    .accord-tag {
      font-size: 10px;
      font-weight: 500;
      padding: 2px 7px;
      border-radius: 4px;
      color: #fff;
      text-shadow: 0 1px 2px rgba(0,0,0,0.7);
    }
    .prices-box {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .bottle-price {
      font-size: 12px;
      color: var(--text-muted);
    }
    .bottle-price strong {
      color: #fff;
      font-size: 15px;
    }
    .decant-chips {
      display: flex;
      gap: 4px;
    }
    .decant-chip {
      background: rgba(200, 169, 106, 0.12);
      border: 1px solid rgba(200, 169, 106, 0.3);
      color: var(--gold-light);
      font-size: 10px;
      font-weight: 600;
      padding: 3px 6px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <header>
    <div class="badge">Elixir Perfumería • Inventario Oficial</div>
    <h1>Catálogo de Fragancias & Frascos Originales</h1>
    <p class="subtitle">524 Perfumes con fotografía de estudio en fondo blanco (Cloudflare R2), precios oficiales de inventario y notas de Fragrantica</p>
  </header>

  <div class="controls">
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="Buscar por nombre o marca..." oninput="filtrar()">
    </div>
    <div class="filters">
      <select id="brandFilter" onchange="filtrar()">
        <option value="">Todas las marcas</option>
      </select>
      <select id="typeFilter" onchange="filtrar()">
        <option value="">Todos los tipos</option>
        <option value="Árabe">Árabe</option>
        <option value="Diseñador">Diseñador</option>
        <option value="Nicho">Nicho</option>
      </select>
      <select id="genderFilter" onchange="filtrar()">
        <option value="">Todos los géneros</option>
        <option value="Hombre">Hombre</option>
        <option value="Mujer">Mujer</option>
        <option value="Unisex">Unisex</option>
      </select>
    </div>
    <div class="stats" id="statsCount">Mostrando ${perfumes.length} perfumes</div>
  </div>

  <div class="grid" id="perfumesGrid"></div>

  <script>
    const perfumes = ${JSON.stringify(perfumes)};
    
    // Poblar filtro de marcas
    const brands = [...new Set(perfumes.map(p => p.marca))].sort();
    const brandSelect = document.getElementById('brandFilter');
    brands.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b;
      opt.textContent = b;
      brandSelect.appendChild(opt);
    });

    function renderPerfumes(items) {
      const grid = document.getElementById('perfumesGrid');
      grid.innerHTML = items.map(p => {
        const img = (p.imagenes && p.imagenes[0]) || '';
        const decants = (p.volumenes && p.volumenes.length > 0)
          ? p.volumenes.slice(0, 3).map(v => \`<span class="decant-chip">\${v.ml}ml: Bs \${v.precioBs}</span>\`).join('')
          : \`<span class="decant-chip" style="background:rgba(200,169,106,0.1); border-color:rgba(200,169,106,0.3); color:#e5cb96;">Frasco \${(p.completo && p.completo.ml) ? p.completo.ml : 100}ml</span>\`;
        
        const accords = (p.acordes || []).slice(0, 3).map(a => 
          \`<span class="accord-tag" style="background-color: \${a.color || '#C8A96A'}">\${a.nombre}</span>\`
        ).join('');
        const bottlePrice = (p.completo && p.completo.precioBs) ? \`Bs \${p.completo.precioBs}\` : 'Consultar';

        return \`
          <div class="card">
            <div class="img-wrap">
              <span class="type-pill">\${p.tipo || 'Diseñador'} • \${p.genero || 'Unisex'}</span>
              <img src="\${img}" alt="\${p.nombre}" loading="lazy" onerror="this.onerror=null; this.src='https://pub-0ebf947f5aae4640acf31cf3822fa62a.r2.dev/perfumes/placeholder.webp';">
            </div>
            <div class="card-body">
              <div class="brand">\${p.marca}</div>
              <div class="title">\${p.nombre}</div>
              <div class="accords">\${accords}</div>
              <div class="prices-box">
                <div class="bottle-price">Botella: <strong>\${bottlePrice}</strong></div>
                <div class="decant-chips">\${decants}</div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
      document.getElementById('statsCount').textContent = \`Mostrando \${items.length} perfumes\`;
    }

    function filtrar() {
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      const brand = document.getElementById('brandFilter').value;
      const type = document.getElementById('typeFilter').value;
      const gender = document.getElementById('genderFilter').value;

      const filtered = perfumes.filter(p => {
        const matchesQ = !q || p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q);
        const matchesBrand = !brand || p.marca === brand;
        const matchesType = !type || p.tipo === type;
        const matchesGender = !gender || p.genero === gender;
        return matchesQ && matchesBrand && matchesType && matchesGender;
      });

      renderPerfumes(filtered);
    }

    renderPerfumes(perfumes);
  </script>
</body>
</html>
`;

fs.writeFileSync('galeria_revision.html', html, 'utf-8');
console.log(`Galería de revisión generada con éxito para ${perfumes.length} perfumes en galeria_revision.html`);
