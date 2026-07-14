document.getElementById("btn-publicacion").addEventListener("click", () => {
  const enlace = document.createElement("a");
  enlace.href = "/assets/parkuir.pdf";
  enlace.download = "parkuir.pdf";
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
});

function showSection(id, btn) {
  document
    .querySelectorAll(".reg-section")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("sec-" + id).classList.add("active");
  document
    .querySelectorAll(".reg-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}
// Lightbox
document.querySelector(".galeria-grid").addEventListener("click", (e) => {
  const img = e.target.closest("img");
  if (!img) return;

  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <div class="lightbox-bg"></div>
    <img src="${img.src}" alt="${img.alt}" />
  `;

  lb.addEventListener("click", () => lb.remove());
  document.body.appendChild(lb);
});
// ── GALERÍA DE ACCIONES ──────────────────────────────────────────────────────

async function initGaleria() {
  const container = document.getElementById('sec-galeria');
  if (!container) return;

  let colecciones;
  try {
    const res = await fetch('./galeria-data.json');
    colecciones = await res.json();
  } catch (e) {
    console.warn('No se pudo cargar galeria-data.json', e);
    return;
  }

  container.innerHTML = '';
  colecciones.forEach((col, i) => {
    container.appendChild(renderBloque(col, i, 0));
  });

  initLightbox();
}

function renderBloque(col, i, nivel) {
  const bloque = document.createElement('div');
  bloque.className = nivel === 0 ? 'galeria-bloque' : 'galeria-sub-bloque';
  bloque.dataset.id = col.id;

  // Botón toggle
  const btn = document.createElement('button');
  btn.className = nivel === 0 ? 'galeria-toggle-btn' : 'galeria-sub-toggle-btn';
  btn.setAttribute('aria-expanded', 'false');

  // Colores cíclicos para nivel 0
  const colorClasses = ['pink', 'orange', 'red', 'cream', 'pink', 'pink'];
  if (nivel === 0) btn.dataset.color = colorClasses[i % colorClasses.length];

  btn.innerHTML = `
    <div class="galeria-btn-text">
      <span class="galeria-titulo">${col.titulo}</span>
      ${col.subtitulo ? `<span class="galeria-subtitulo">${col.subtitulo}</span>` : ''}
    </div>
    <span class="galeria-toggle-icon">+</span>
  `;
  btn.addEventListener('click', () => toggleBloque(bloque, btn));

  // Cuerpo
  const body = document.createElement('div');
  body.className = 'galeria-body';

  // Texto principal (párrafos separados por \n\n)
  if (col.texto) {
    col.texto.split('\n\n').forEach(para => {
      if (!para.trim()) return;
      const p = document.createElement('p');
      p.className = 'galeria-texto';
      p.textContent = para.trim();
      body.appendChild(p);
    });
  }

  // Imágenes
  if (col.imagenes && col.imagenes.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'galeria-grid';
    col.imagenes.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = col.titulo;
      img.loading = 'lazy';
      img.addEventListener('click', () => openLightbox(src));
      grid.appendChild(img);
    });
    body.appendChild(grid);
  }

  // Subsecciones
  if (col.subsecciones && col.subsecciones.length > 0) {
    const subWrap = document.createElement('div');
    subWrap.className = 'galeria-subsecciones';
    col.subsecciones.forEach((sub, j) => {
      subWrap.appendChild(renderBloque(sub, j, 1));
    });
    body.appendChild(subWrap);
  }

  bloque.appendChild(btn);
  bloque.appendChild(body);
  return bloque;
}

function toggleBloque(bloque, btn) {
  const body = bloque.querySelector(':scope > .galeria-body');
  const icon = btn.querySelector('.galeria-toggle-icon');
  const isOpen = bloque.classList.contains('open');

  if (isOpen) {
    bloque.classList.remove('open');
    if (icon) icon.textContent = '+';
    btn.setAttribute('aria-expanded', 'false');
    body.style.maxHeight = '0';
  } else {
    bloque.classList.add('open');
    if (icon) icon.textContent = '×';
    btn.setAttribute('aria-expanded', 'true');
    body.style.maxHeight = body.scrollHeight + 9999 + 'px';
  }
}

// ── LIGHTBOX ─────────────────────────────────────────────────────────────────
function initLightbox() {
  if (document.getElementById('galeria-lightbox')) return;
  const lb = document.createElement('div');
  lb.id = 'galeria-lightbox';
  lb.className = 'lightbox';
  lb.style.display = 'none';
  lb.innerHTML = `<div class="lightbox-bg"></div><img src="" alt="">`;
  lb.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  document.body.appendChild(lb);
}

function openLightbox(src) {
  const lb = document.getElementById('galeria-lightbox');
  lb.querySelector('img').src = src;
  lb.style.display = 'flex';
}

function closeLightbox() {
  const lb = document.getElementById('galeria-lightbox');
  if (lb) lb.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', initGaleria);