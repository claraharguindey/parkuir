// ── USER ID ─────────────────────────────────────────────
const userId =
  localStorage.getItem("parkuir_userId") ||
  (() => {
    const id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    localStorage.setItem("parkuir_userId", id);
    return id;
  })();

// ── PALETA ──────────────────────────────────────────────
const COLORS_R1 = ["#ff3773", "#ffcce0", "#ff6ab0", "#ff88c8", "#dd44ff"];
const COLORS_R2 = ["#5566ff", "#ffdd44", "#44ee44", "#1a1a1a", "#882244"];

let currentColor = "#ff3773";
let brushSize = 5;
let currentShape = "round";
let erasing = false;

function buildPalette(id, colors) {
  const el = document.getElementById(id);
  colors.forEach((hex, i) => {
    const btn = document.createElement("button");
    btn.className =
      "color-btn" + (id === "paletteRow1" && i === 0 ? " active" : "");
    btn.style.background = hex;
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".color-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentColor = hex;
      erasing = false;
      document.getElementById("btnEraser").textContent = "Borrar";
    });
    el.appendChild(btn);
  });
}
buildPalette("paletteRow1", COLORS_R1);
buildPalette("paletteRow2", COLORS_R2);

// ── HERRAMIENTAS ────────────────────────────────────────
document.querySelectorAll(".tool-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tool-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentShape = btn.dataset.shape || "round";
    erasing = false;
    document.getElementById("btnEraser").textContent = "Borrar";
  });
});

const sizeSlider = document.getElementById("brushSizeSlider");
sizeSlider.addEventListener("input", () => {
  brushSize = parseInt(sizeSlider.value);
});

// ── CANVAS + MÁSCARA ────────────────────────────────────
const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");
const shirtImg = new Image();
shirtImg.src = "./../images/camiseta.png";
let maskCanvas = null;

// Precarga el stamp
const stampImg = document.getElementById("stampImg");

shirtImg.onload = () => {
  initCanvas();
};

function initCanvas() {
  const size = canvas.parentElement.offsetWidth;
  canvas.width = size;
  canvas.height = size;
  maskCanvas = document.createElement("canvas");
  maskCanvas.width = size;
  maskCanvas.height = size;
  maskCanvas.getContext("2d").drawImage(shirtImg, 0, 0, size, size);
}

window.addEventListener("resize", () => {
  const tmp = document.createElement("canvas");
  tmp.width = canvas.width;
  tmp.height = canvas.height;
  tmp.getContext("2d").drawImage(canvas, 0, 0);
  const size = canvas.parentElement.offsetWidth;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(tmp, 0, 0, size, size);
  if (shirtImg.complete) {
    maskCanvas = document.createElement("canvas");
    maskCanvas.width = size;
    maskCanvas.height = size;
    maskCanvas.getContext("2d").drawImage(shirtImg, 0, 0, size, size);
  }
});

setTimeout(() => {
  if (!maskCanvas && shirtImg.complete) initCanvas();
}, 200);

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  if (e.touches)
    return {
      x: (e.touches[0].clientX - rect.left) * sx,
      y: (e.touches[0].clientY - rect.top) * sy,
    };
  return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
}

let lastX = null,
  lastY = null;

function drawMark(x, y) {
  if (!maskCanvas) return;
  const tmp = document.createElement("canvas");
  tmp.width = canvas.width;
  tmp.height = canvas.height;
  const tc = tmp.getContext("2d");
  tc.fillStyle = currentColor;
  tc.strokeStyle = currentColor;

  if (currentShape === "stamp") {
    if (!stampImg.complete || !stampImg.naturalWidth) return;
    const s = brushSize * 5;
    const ratio = stampImg.naturalWidth / stampImg.naturalHeight;
    const w = ratio >= 1 ? s : s * ratio;
    const h = ratio >= 1 ? s / ratio : s;
    tc.drawImage(stampImg, x - w / 2, y - h / 2, w, h);
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.drawImage(tmp, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    lastX = x;
    lastY = y;
    return;
  }

  if (currentShape === "triangle-down") {
    const s = brushSize * 2.5;
    tc.beginPath();
    tc.moveTo(x, y + s);
    tc.lineTo(x + s, y - s);
    tc.lineTo(x - s, y - s);
    tc.closePath();
    tc.fill();
  } else if (currentShape === "star") {
    const s = brushSize * 2.5;
    const inner = s * 0.38;
    tc.beginPath();
    for (let i = 0; i < 8; i++) {
      const aOuter = (i * Math.PI * 2) / 8 - Math.PI / 2;
      const aInner = aOuter + Math.PI / 8;
      tc.lineTo(x + s * Math.cos(aOuter), y + s * Math.sin(aOuter));
      tc.lineTo(x + inner * Math.cos(aInner), y + inner * Math.sin(aInner));
    }
    tc.closePath();
    tc.fill();
  } else if (currentShape === "heart") {
    const s = brushSize * 2;
    tc.save();
    tc.translate(x, y);
    tc.scale(s / 30, s / 30);
    tc.beginPath();
    tc.moveTo(0, -10);
    tc.bezierCurveTo(10, -25, 30, -15, 30, 0);
    tc.bezierCurveTo(30, 15, 15, 25, 0, 35);
    tc.bezierCurveTo(-15, 25, -30, 15, -30, 0);
    tc.bezierCurveTo(-30, -15, -10, -25, 0, -10);
    tc.closePath();
    tc.fill();
    tc.restore();
  } else if (currentShape === "diamond") {
    const s = brushSize * 2.5;
    tc.beginPath();
    tc.moveTo(x, y - s);
    tc.lineTo(x + s * 0.65, y);
    tc.lineTo(x, y + s);
    tc.lineTo(x - s * 0.65, y);
    tc.closePath();
    tc.fill();
  } else if (currentShape === "square") {
    const s = brushSize * 2;
    tc.fillRect(x - s / 2, y - s / 2, s, s);
  } else {
    // round
    tc.lineWidth = brushSize;
    tc.lineCap = "round";
    tc.lineJoin = "round";
    tc.beginPath();
    if (lastX !== null) {
      tc.moveTo(lastX, lastY);
      tc.lineTo(x, y);
      tc.stroke();
    } else {
      tc.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      tc.fill();
    }
  }

  tc.globalCompositeOperation = "destination-in";
  tc.drawImage(maskCanvas, 0, 0);
  ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
  ctx.drawImage(tmp, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  lastX = x;
  lastY = y;
}

let painting = false;
canvas.addEventListener("mousedown", (e) => {
  painting = true;
  lastX = null;
  drawMark(...Object.values(getPos(e)));
});
canvas.addEventListener("mousemove", (e) => {
  if (!painting) return;
  drawMark(...Object.values(getPos(e)));
});
canvas.addEventListener("mouseup", () => {
  painting = false;
  lastX = null;
});
canvas.addEventListener("mouseleave", () => {
  painting = false;
  lastX = null;
});
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    painting = true;
    lastX = null;
    drawMark(...Object.values(getPos(e)));
  },
  { passive: false },
);
canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    if (!painting) return;
    drawMark(...Object.values(getPos(e)));
  },
  { passive: false },
);
canvas.addEventListener("touchend", () => {
  painting = false;
});

// ── ACCIONES ────────────────────────────────────────────
document.getElementById("btnEraser").addEventListener("click", function () {
  erasing = !erasing;
  this.textContent = erasing ? "✕ Borrando" : "Borrar";
});
document.getElementById("btnClear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
document.getElementById("btnSave").addEventListener("click", () => {
  const exp = document.createElement("canvas");
  exp.width = canvas.width;
  exp.height = canvas.height;
  const ec = exp.getContext("2d");
  ec.drawImage(shirtImg, 0, 0, exp.width, exp.height);
  ec.drawImage(canvas, 0, 0);
  const link = document.createElement("a");
  link.download = "equipacion-parkuir.png";
  link.href = exp.toDataURL();
  link.click();
});
document.getElementById("btnX").addEventListener("click", () => {
  document.getElementById("shirtTitle").value = "";
  document.getElementById("shirtDesc").value = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// ── GALERÍA ─────────────────────────────────────────────
const galleryGrid = document.getElementById("galleryGrid");
const galleryEmpty = document.getElementById("galleryEmpty");
const API = "https://parkuir.vitrin.as/api/liga";

function renderCard(entry) {
  const card = document.createElement("div");
  card.className = "shirt-card";
  card.dataset.id = entry.id;
  card.innerHTML = `
    <img src="${entry.img}" alt="${entry.title}">
    <div class="card-title">${entry.title}</div>
    <div class="card-desc">${entry.desc || ""}</div>
  `;
  card.addEventListener("click", () => {
    document.getElementById("modalImg").src = entry.img;
    document.getElementById("modalTitle").textContent = entry.title;
    document.getElementById("modalDesc").textContent = entry.desc;
    document.getElementById("modalNum").textContent = new Date(
      entry.date,
    ).toLocaleDateString("es-ES");
    document.getElementById("modalId").dataset.id = entry.id;
    const esNuestro = !entry.userId || entry.userId === userId;
    document.getElementById("modalId").style.display = esNuestro
      ? "block"
      : "none";
    document.getElementById("modal").classList.add("open");
  });
  galleryGrid.appendChild(card);
}

async function loadGallery() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    galleryGrid.innerHTML = "";
    if (data.length === 0) {
      galleryGrid.appendChild(galleryEmpty);
      galleryEmpty.style.display = "block";
    } else {
      galleryEmpty.style.display = "none";
      data.forEach(renderCard);
    }
  } catch (e) {
    console.warn("Sin servidor, modo local");
  }
}

loadGallery();

document.getElementById("btnSubmit").addEventListener("click", async () => {
  const title =
    document.getElementById("shirtTitle").value.trim() || "Sin título";
  const desc = document.getElementById("shirtDesc").value.trim();

  const exp = document.createElement("canvas");
  exp.width = canvas.width;
  exp.height = canvas.height;
  const ec = exp.getContext("2d");
  ec.drawImage(shirtImg, 0, 0, exp.width, exp.height);
  ec.drawImage(canvas, 0, 0);
  const img = exp.toDataURL("image/png");

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, desc, img, userId }),
    });
    if (res.ok) {
      const entry = await res.json();
      entry.userId = userId;
      galleryEmpty.style.display = "none";
      renderCard(entry);
      galleryGrid.insertBefore(galleryGrid.lastChild, galleryGrid.firstChild);
    }
  } catch (e) {
    galleryEmpty.style.display = "none";
    const entry = {
      id: Date.now(),
      title,
      desc,
      img,
      userId,
      date: new Date().toISOString(),
    };
    renderCard(entry);
    galleryGrid.insertBefore(galleryGrid.lastChild, galleryGrid.firstChild);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("shirtTitle").value = "";
  document.getElementById("shirtDesc").value = "";
  document
    .querySelector(".gallery-section")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

// ── MODAL ───────────────────────────────────────────────
function closeModal() {
  document.getElementById("modal").classList.remove("open");
}
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal")) closeModal();
});
document.getElementById("modalId").addEventListener("click", async function () {
  const id = parseInt(this.dataset.id);
  if (!id) return;
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      alert("No puedes borrar una equipación que no es tuya.");
      return;
    }
  } catch (e) {}
  const card = galleryGrid.querySelector(`[data-id="${id}"]`);
  if (card) card.remove();
  if (!galleryGrid.children.length) {
    galleryGrid.appendChild(galleryEmpty);
    galleryEmpty.style.display = "block";
  }
  closeModal();
});
