// ── PARKUIR — about.js ────────────────────────────────────
// Modos: leer · travestir · fracasar · ilegibilidad

const FONT_STACK = {
  bebas: '"BebasNeue", sans-serif',
  outreque: '"Outreque", sans-serif',
  clm: '"CLMRallye", sans-serif',
};
const FONT_KEYS = Object.keys(FONT_STACK);

const textBlock = document.getElementById("text-block");

// Guardamos el HTML original para poder restaurarlo
const originalHTML = textBlock.innerHTML;

// ── UTILIDADES ────────────────────────────────────────────

function allWords() {
  return Array.from(textBlock.querySelectorAll("span.word"));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Envuelve cada palabra del texto en un <span class="word">
function wrapWords() {
  textBlock.innerHTML = originalHTML;
  textBlock.querySelectorAll("p").forEach((p) => {
    p.innerHTML = p.innerHTML
      .split(/(<[^>]+>|\s+)/)
      .map((chunk) => {
        if (/^</.test(chunk)) return chunk; // etiquetas HTML intactas
        if (/^\s+$/.test(chunk)) return chunk; // espacios intactos
        if (!chunk.trim()) return chunk;
        return `<span class="word">${chunk}</span>`;
      })
      .join("");
  });
}

// ── LIMPIEZA ──────────────────────────────────────────────

let cleanupFns = [];

function stopAll() {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
  // restaura el HTML original limpiamente
  textBlock.innerHTML = originalHTML;
  textBlock.style.cssText = "";
}

// ── MODO: LEER ────────────────────────────────────────────

function modeLeer() {
  stopAll();
  document.body.classList.add("reading");
}

// ── MODO: TRAVESTIR ───────────────────────────────────────
// Cada clic en el botón viste a todas las palabras con una identidad
// tipográfica nueva y distinta. Sin hover — la transformación es colectiva.

function dress(span) {
  const CASES = ["uppercase", "lowercase", "capitalize", "none"];
  span.style.fontFamily = FONT_STACK[pick(FONT_KEYS)];
  span.style.textTransform = pick(CASES);
  span.style.direction = Math.random() < 0.12 ? "rtl" : "ltr";
  span.style.fontSize = rand(0.8, 1.3) + "em";
  span.style.letterSpacing = rand(-0.02, 0.1) + "em";
  span.style.transition = "all " + rand(0.2, 0.6).toFixed(2) + "s ease";
}

function modeTravestir() {
  stopAll();
  document.body.classList.remove("reading");
  wrapWords();

  allWords().forEach((span) => {
    span.style.display = "inline-block";
  });

  // vestimenta inicial al entrar en el modo
  allWords().forEach(dress);

  // cada clic en el botón vuelve a vestir
  const btn = document.getElementById("btn-travestir");
  function redress() {
    allWords().forEach(dress);
  }
  btn.addEventListener("click", redress);
  cleanupFns.push(() => btn.removeEventListener("click", redress));
}

// ── MODO: FRACASAR ────────────────────────────────────────
// El texto intenta comportarse (se reordena solo) pero falla:
// las palabras se mueven a posiciones incorrectas cada pocos segundos,
// intentan volver pero no del todo.

function modeFracar() {
  stopAll();
  document.body.classList.remove("reading");
  wrapWords();

  const words = allWords();

  // Guarda posición original de cada palabra
  words.forEach((span) => {
    span.style.display = "inline-block";
    span.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
    span.style.position = "relative";
  });

  function attemptOrder() {
    words.forEach((span) => {
      // intenta volver al sitio... pero falla un poco
      const failX = rand(-6, 6);
      const failY = rand(-4, 4);
      const failRot = rand(-3, 3);
      span.style.transform = `translate(${failX}px, ${failY}px) rotate(${failRot}deg)`;
    });
  }

  function chaos() {
    words.forEach((span) => {
      const x = rand(-18, 18);
      const y = rand(-10, 10);
      const rot = rand(-8, 8);
      span.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
    });
  }

  // Ciclo: caos → intento fallido → caos → ...
  let phase = 0;
  function tick() {
    if (phase % 2 === 0) chaos();
    else attemptOrder();
    phase++;
  }

  tick();
  const interval = setInterval(tick, 1800);
  cleanupFns.push(() => clearInterval(interval));
}

// ── MODO: ILEGIBILIDAD ────────────────────────────────────
// Cada clic en el botón baraja las letras de cada palabra.

function shuffle(str) {
  const chars = str.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function modeIlegibilidad() {
  stopAll();
  document.body.classList.remove("reading");
  wrapWords();

  const words = allWords();

  function scramble() {
    words.forEach((span) => {
      span.textContent = shuffle(span.textContent);
    });
  }

  scramble();

  const btn = document.getElementById("btn-ilegibilidad");
  btn.addEventListener("click", scramble);
  cleanupFns.push(() => btn.removeEventListener("click", scramble));
}

// ── API PÚBLICA ───────────────────────────────────────────

const ALL_MODES = ["reading", "mode-travestir", "mode-fracasar", "mode-ilegibilidad"];

function setBodyMode(cls) {
  ALL_MODES.forEach((c) => document.body.classList.remove(c));
  if (cls) document.body.classList.add(cls);
}

window.setMode = function (m) {
  switch (m) {
    case "read":
      setBodyMode("reading");
      modeLeer();
      break;
    case "travestir":
      setBodyMode("mode-travestir");
      modeTravestir();
      break;
    case "fracasar":
      setBodyMode("mode-fracasar");
      modeFracar();
      break;
    case "ilegibilidad":
      setBodyMode("mode-ilegibilidad");
      modeIlegibilidad();
      break;
  }
};

// init
setBodyMode("reading");