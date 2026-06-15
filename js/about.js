import { Renderer } from "https://cdn.jsdelivr.net/npm/ogl/src/core/Renderer.js";
import { Geometry } from "https://cdn.jsdelivr.net/npm/ogl/src/core/Geometry.js";
import { Program } from "https://cdn.jsdelivr.net/npm/ogl/src/core/Program.js";
import { Mesh } from "https://cdn.jsdelivr.net/npm/ogl/src/core/Mesh.js";
import { Texture } from "https://cdn.jsdelivr.net/npm/ogl/src/core/Texture.js";
import { Flowmap } from "https://cdn.jsdelivr.net/npm/ogl/src/extras/Flowmap.js";
import { Vec2 } from "https://cdn.jsdelivr.net/npm/ogl/src/math/Vec2.js";
import { Vec4 } from "https://cdn.jsdelivr.net/npm/ogl/src/math/Vec4.js";

// ── MODO ──────────────────────────────────────────────────
let mode = "read";

const textBlock = document.getElementById("text-block");
const center = document.getElementById("about-center");

function setMode(m) {
  mode = m;
  if (m === "read") {
    document.body.classList.add("reading");
    stopFlow();
  } else {
    document.body.classList.remove("reading");
    startFlow();
  }
}
window.setMode = setMode;

// ── TIPOGRAFÍAS DISPONIBLES PARA EL REMIX ──────────────────
const FONT_STACK = {
  bebas: '"BebasNeue", sans-serif',
  outreque: '"Outreque", sans-serif',
  clm: '"CLMRallye", sans-serif',
};
const FONT_KEYS = Object.keys(FONT_STACK);

const vertex = `
        attribute vec2 uv;
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0, 1);
        }
      `;
const fragment = `
        precision highp float;
        precision highp int;
        uniform sampler2D tWater;
        uniform sampler2D tFlow;
        uniform float uTime;
        varying vec2 vUv;
        uniform vec4 res;
        void main() {
          vec3 flow = texture2D(tFlow, vUv).rgb;
          vec2 uv = .5 * gl_FragCoord.xy / res.xy;
          vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);
          myUV -= flow.xy * (0.15 * 0.7);
          vec4 tex = texture2D(tWater, myUV);
          gl_FragColor = vec4(tex.rgb, tex.a);
        }
      `;

let flow = null;

async function startFlow() {
  try {
    if (!flow) flow = await createFlowText();
    flow.show();
  } catch (err) {
    console.error("No se pudo iniciar el modo TOCAR:", err);
    document.body.classList.add("reading");
  }
}
function stopFlow() {
  if (flow) flow.hide();
}

async function createFlowText() {
  await Promise.all([
    document.fonts.load("16px BebasNeue"),
    document.fonts.load("16px Outreque"),
    document.fonts.load("16px CLMRallye"),
  ]).catch(() => {});

  const wrap = document.getElementById("flow-canvas");

  const pStyle = getComputedStyle(textBlock.querySelector("p"));
  const fontSize = parseFloat(pStyle.fontSize);
  const lineHeight = parseFloat(pStyle.lineHeight);
  const paraGap = parseFloat(pStyle.marginBottom);
  const ink = pStyle.color;

  const paragraphs = Array.from(textBlock.querySelectorAll("p")).map((p) =>
    p.textContent.trim().replace(/\s+/g, " ").split(" "),
  );

  const dpr = 2;

  const txCanvas = document.createElement("canvas");
  const txCtx = txCanvas.getContext("2d");

  function wordsWithStyle(shuffle) {
    return paragraphs.map((words) =>
      words.map((w) => {
        let text = w;
        let font = "outreque";
        if (shuffle) {
          const chars = text.split("");
          for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
          }
          text = chars.join("");
          font = FONT_KEYS[Math.floor(Math.random() * FONT_KEYS.length)];
        }
        return { text, font };
      }),
    );
  }

  let currentWords = wordsWithStyle(false);

  function drawText() {
    const cssW = wrap.clientWidth || center.clientWidth;
    const cssH = wrap.clientHeight || center.clientHeight;
    txCanvas.width = Math.max(1, cssW * dpr);
    txCanvas.height = Math.max(1, cssH * dpr);
    txCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    txCtx.clearRect(0, 0, cssW, cssH);

    txCtx.fillStyle = ink || "#292929";
    txCtx.textBaseline = "top";

    const padX = fontSize * 1.4;
    const padY = fontSize * 1.4;
    const maxWidth = cssW - padX * 2;

    txCtx.font = `${fontSize}px ${FONT_STACK.outreque}`;
    const spaceW = txCtx.measureText(" ").width;

    let y = padY;

    currentWords.forEach((words) => {
      let line = [];
      let lineW = 0;
      words.forEach((w) => {
        txCtx.font = `${fontSize}px ${FONT_STACK[w.font]}`;
        const ww = txCtx.measureText(w.text).width;
        if (lineW + ww > maxWidth && line.length) {
          drawLine(line, padX, y);
          y += lineHeight;
          line = [];
          lineW = 0;
        }
        line.push(w);
        lineW += ww + spaceW;
      });
      if (line.length) {
        drawLine(line, padX, y);
        y += lineHeight;
      }
      y += paraGap;
    });

    function drawLine(words, x, startY) {
      let cx = x;
      words.forEach((w) => {
        txCtx.font = `${fontSize}px ${FONT_STACK[w.font]}`;
        txCtx.fillText(w.text, cx, startY);
        cx += txCtx.measureText(w.text).width + spaceW;
      });
    }

    return { cssW, cssH };
  }

  let { cssW, cssH } = drawText();

  // ── OGL ──
  const renderer = new Renderer({ dpr, alpha: true });
  const gl = renderer.gl;
  gl.clearColor(0, 0, 0, 0);
  gl.canvas.style.width = "100%";
  gl.canvas.style.height = "100%";
  gl.canvas.style.display = "block";
  wrap.appendChild(gl.canvas);

  const mouse = new Vec2(-1);
  const velocity = new Vec2();
  const flowmap = new Flowmap(gl);

  const geometry = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
    uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
  });

  const texture = new Texture(gl, {
    image: txCanvas,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
  });

  let aspect = cssW / cssH;

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      tWater: { value: texture },
      res: { value: new Vec4(cssW, cssH, 1, 1) },
      tFlow: flowmap.uniform,
    },
  });
  const mesh = new Mesh(gl, { geometry, program });

  function resizeFlow() {
    cssW = wrap.clientWidth || center.clientWidth;
    cssH = wrap.clientHeight || center.clientHeight;
    renderer.setSize(cssW, cssH);
    aspect = cssW / cssH;

    const drawn = drawText();
    texture.image = txCanvas;

    const imageAspect = drawn.cssH / drawn.cssW;
    let a1, a2;
    if (cssH / cssW < imageAspect) {
      a1 = 1;
      a2 = cssH / cssW / imageAspect;
    } else {
      a1 = (cssW / cssH) * imageAspect;
      a2 = 1;
    }
    program.uniforms.res.value = new Vec4(cssW, cssH, a1, a2);
  }

  let lastTime;
  const lastPos = new Vec2();

  // ── POINTER (desktop) ──
  function onMove(e) {
    const rect = gl.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouse.set(x / rect.width, 1 - y / rect.height);

    if (!lastTime) {
      lastTime = performance.now();
      lastPos.set(x, y);
    }
    const dx = x - lastPos.x;
    const dy = y - lastPos.y;
    lastPos.set(x, y);
    const t = performance.now();
    const delta = Math.max(10.4, t - lastTime);
    lastTime = t;
    velocity.x = dx / delta;
    velocity.y = dy / delta;
    velocity.needsUpdate = true;
  }
  function onLeave() {
    mouse.set(-1);
    lastTime = null;
  }
  function onClick() {
    currentWords = wordsWithStyle(true);
    drawText();
    texture.image = txCanvas;
  }

  // ── TOUCH (móvil) ──
  function getTouchPos(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = gl.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  function onTouchStart(e) {
    e.preventDefault();
    const { x, y } = getTouchPos(e);
    const rect = gl.canvas.getBoundingClientRect();
    mouse.set(x / rect.width, 1 - y / rect.height);
    lastPos.set(x, y);
    lastTime = performance.now();
  }

  function onTouchMove(e) {
    e.preventDefault();
    const { x, y } = getTouchPos(e);
    const rect = gl.canvas.getBoundingClientRect();
    mouse.set(x / rect.width, 1 - y / rect.height);

    if (!lastTime) {
      lastTime = performance.now();
      lastPos.set(x, y);
    }
    const dx = x - lastPos.x;
    const dy = y - lastPos.y;
    lastPos.set(x, y);
    const t = performance.now();
    const delta = Math.max(10.4, t - lastTime);
    lastTime = t;
    velocity.x = dx / delta;
    velocity.y = dy / delta;
    velocity.needsUpdate = true;
  }

  function onTouchEnd(e) {
    e.preventDefault();
    mouse.set(-1);
    lastTime = null;
  }

  function onTouchClick(e) {
    // tap sin movimiento → mezclar letras
    if (Math.abs(velocity.x) < 0.01 && Math.abs(velocity.y) < 0.01) {
      currentWords = wordsWithStyle(true);
      drawText();
      texture.image = txCanvas;
    }
  }

  let rafId = null;
  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (!velocity.needsUpdate) {
      mouse.set(-1);
      velocity.set(0, 0);
    }
    velocity.needsUpdate = false;

    flowmap.aspect = aspect;
    flowmap.mouse.copy(mouse);
    flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
    flowmap.update();

    program.uniforms.uTime.value = t * 0.01;
    renderer.render({ scene: mesh });
  }

  const resizeObs = new ResizeObserver(() => resizeFlow());

  function show() {
    wrap.style.display = "block";
    gl.canvas.style.touchAction = "none";
    resizeFlow();
    resizeObs.observe(wrap);
    // pointer (desktop)
    gl.canvas.addEventListener("pointermove", onMove);
    gl.canvas.addEventListener("pointerleave", onLeave);
    gl.canvas.addEventListener("pointerup", onLeave);
    gl.canvas.addEventListener("click", onClick);
    // touch (móvil)
    gl.canvas.addEventListener("touchstart", onTouchStart, {
      passive: false,
    });
    gl.canvas.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    gl.canvas.addEventListener("touchend", onTouchEnd, {
      passive: false,
    });
    gl.canvas.addEventListener("touchend", onTouchClick, {
      passive: false,
    });
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  function hide() {
    wrap.style.display = "none";
    resizeObs.disconnect();
    // pointer
    gl.canvas.removeEventListener("pointermove", onMove);
    gl.canvas.removeEventListener("pointerleave", onLeave);
    gl.canvas.removeEventListener("pointerup", onLeave);
    gl.canvas.removeEventListener("click", onClick);
    // touch
    gl.canvas.removeEventListener("touchstart", onTouchStart);
    gl.canvas.removeEventListener("touchmove", onTouchMove);
    gl.canvas.removeEventListener("touchend", onTouchEnd);
    gl.canvas.removeEventListener("touchend", onTouchClick);
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  return { show, hide };
}

// init — modo lectura por defecto
document.body.classList.add("reading");
