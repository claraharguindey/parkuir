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
// Las palabras cambian de fuente, caja (upper/lower/mixed) y dirección
// al pasar el ratón por encima. Cada una elige su propia identidad.

function modeTravestir() {
  stopAll();
  document.body.classList.remove("reading");
  wrapWords();

  const CASES = ["uppercase", "lowercase", "capitalize"];
  const DIRECTIONS = ["ltr", "rtl"];

  allWords().forEach((span) => {
    // identidad aleatoria asignada al nacer
    const font = pick(FONT_KEYS);
    const textCase = pick(CASES);
    const dir = Math.random() < 0.15 ? "rtl" : "ltr"; // mayoría ltr pero alguna rtl
    const size = rand(0.85, 1.25);

    span.style.display = "inline-block";
    span.style.transition = "all 0.25s ease";
    span.style.cursor = "pointer";

    function dress() {
      span.style.fontFamily = FONT_STACK[font];
      span.style.textTransform = textCase;
      span.style.direction = dir;
      span.style.fontSize = size + "em";
      span.style.letterSpacing = rand(-0.02, 0.08) + "em";
    }

    function undress() {
      span.style.fontFamily = "";
      span.style.textTransform = "";
      span.style.direction = "";
      span.style.fontSize = "";
      span.style.letterSpacing = "";
    }

    span.addEventListener("mouseenter", dress);
    span.addEventListener("mouseleave", undress);
    // touch
    span.addEventListener("touchstart", dress, { passive: true });
    span.addEventListener("touchend", undress, { passive: true });
  });

  cleanupFns.push(() => {
    allWords().forEach((span) => {
      span.removeEventListener("mouseenter", () => {});
      span.removeEventListener("mouseleave", () => {});
    });
  });
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
// El texto existe pero no se entrega fácil.
// Las palabras tienen opacidad baja; al detenerte encima se revelan,
// pero las vecinas se oscurecen más. Hay que leer en soledad, despacio.

function modeIlegibilidad() {
  stopAll();
  document.body.classList.remove("reading");
  wrapWords();

  const words = allWords();

  words.forEach((span) => {
    span.style.display = "inline-block";
    span.style.opacity = "0.15";
    span.style.transition = "opacity 0.4s ease";
    span.style.cursor = "default";
    span.style.userSelect = "none";
  });

  function reveal(e) {
    const target = e.currentTarget;
    const idx = words.indexOf(target);

    words.forEach((span, i) => {
      const dist = Math.abs(i - idx);
      if (dist === 0) {
        span.style.opacity = "1";
      } else if (dist <= 2) {
        span.style.opacity = "0.08";
      } else {
        span.style.opacity = "0.15";
      }
    });
  }

  function resetOpacity() {
    words.forEach((span) => {
      span.style.opacity = "0.15";
    });
  }

  words.forEach((span) => {
    span.addEventListener("mouseenter", reveal);
    span.addEventListener("touchstart", reveal, { passive: true });
  });

  textBlock.addEventListener("mouseleave", resetOpacity);

  cleanupFns.push(() => {
    words.forEach((span) => {
      span.removeEventListener("mouseenter", reveal);
      span.removeEventListener("touchstart", reveal);
    });
    textBlock.removeEventListener("mouseleave", resetOpacity);
  });
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