// ── LAYOUT ────────────────────────────────────────────────
let PLATFORMS = [];

function groundY() {
  return document.getElementById("world-wrapper").clientHeight - 120;
}

function layoutWorld() {
  const gY = groundY();
  const gl = document.getElementById("ground-line");
  gl.style.top = gY + "px";
  gl.style.height =
    document.getElementById("world-wrapper").clientHeight - gY + "px";
  PLATFORMS = [];

  document.querySelectorAll(".bld").forEach((bld) => {
    const left = parseInt(bld.dataset.left);
    const w = parseInt(bld.dataset.w);
    const h = parseInt(bld.dataset.h);
    const wb = parseInt(bld.dataset.wb || 0);

    const block = bld.querySelector(".block");
    block.style.left = left + "px";
    block.style.top = gY - wb - h + "px";
    block.style.width = w + "px";
    block.style.height = h + "px";

    const yearEl = bld.querySelector(".bld-year");
    yearEl.style.left = left + "px";
    yearEl.style.top = gY - wb - h + "px";
    yearEl.textContent = bld.dataset.year;

    PLATFORMS.push({ left, w, h, wb, el: bld });
  });
}

// ── GAME STATE ────────────────────────────────────────────
let playerX = 80, playerY = 0, velX = 0, velY = 0;
let onGround = true, worldOffset = 0;
let stepPhase = 0, jumpConsumed = false;
let activeCard = null, lastActive = null;

const WORLD_W = 5700, GRAVITY = 0.55, JUMP_F = -13;
const ACCEL = 0.55, FRICTION = 0.8, MAX_SPD = 7, PLAYER_H = 100;
const PROX = 120;
const keys = { left: false, right: false };

function getFloor(x) {
  let h = 0;
  PLATFORMS.forEach((p) => {
    if (x + 10 > p.left && x - 10 < p.left + p.w) h = Math.max(h, p.wb + p.h);
  });
  return h;
}

function tryJump() {
  if (onGround && !jumpConsumed) {
    velY = JUMP_F;
    onGround = false;
    jumpConsumed = true;
    spawnParticles();
  }
}

function spawnParticles() {
  const world = document.getElementById("world");
  const gY = groundY();
  for (let i = 0; i < 6; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const a = Math.PI + Math.random() * Math.PI, d = 15 + Math.random() * 30;
    p.style.setProperty("--dx", Math.cos(a) * d + "px");
    p.style.setProperty("--dy", Math.sin(a) * d + "px");
    p.style.left = playerX + "px";
    p.style.top = gY - playerY - PLAYER_H + "px";
    world.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }
}

// ── CARD ──────────────────────────────────────────────────
function openCard(p) {
  const d = p.el.dataset;
  document.getElementById("info-card-year").textContent = d.year;
  document.getElementById("info-card-title").textContent = d.es;
  document.getElementById("info-card-text").textContent = d.body || "";
  const imgEl = document.getElementById("info-card-img-el");
  if (d.img) {
    imgEl.src = d.img;
    imgEl.style.display = "block";
  } else {
    imgEl.style.display = "none";
  }
  document.getElementById("info-card").classList.add("visible");
  document.querySelectorAll(".bld-year").forEach((y) => y.classList.remove("active"));
  p.el.querySelector(".bld-year").classList.add("active");
  activeCard = p;
}

function closeCard() {
  document.getElementById("info-card").classList.remove("visible");
  document.querySelectorAll(".bld-year").forEach((y) => y.classList.remove("active"));
  activeCard = null;
  lastActive = null;
}

document.getElementById("info-card-close").addEventListener("click", closeCard);

// ── PROXIMITY ─────────────────────────────────────────────
function checkProximity() {
  let closest = null, closestDist = Infinity;
  PLATFORMS.forEach((p) => {
    const center = p.left + p.w / 2;
    const dist = Math.abs(playerX - center);
    if (dist < PROX && dist < closestDist) { closestDist = dist; closest = p; }
  });
  if (closest && closest !== lastActive) {
    lastActive = closest;
    openCard(closest);
  } else if (!closest && lastActive) {
    closeCard();
  }
}

// ── INPUT ─────────────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft"  || e.key === "a") keys.left  = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  if ((e.key === " " || e.key === "ArrowUp" || e.key === "w") && !e.repeat) {
    e.preventDefault(); tryJump();
  }
  if (e.key === "Escape") closeCard();
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft"  || e.key === "a") keys.left  = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
  if (e.key === " " || e.key === "ArrowUp" || e.key === "w") jumpConsumed = false;
});

const btnL = document.getElementById("btn-left");
const btnR = document.getElementById("btn-right");
const btnJ = document.getElementById("btn-jump");
btnL.addEventListener("mousedown",  () => keys.left  = true);
btnL.addEventListener("mouseup",    () => keys.left  = false);
btnL.addEventListener("mouseleave", () => keys.left  = false);
btnR.addEventListener("mousedown",  () => keys.right = true);
btnR.addEventListener("mouseup",    () => keys.right = false);
btnR.addEventListener("mouseleave", () => keys.right = false);
btnJ.addEventListener("mousedown",  (e) => { e.preventDefault(); tryJump(); });
btnL.addEventListener("touchstart", (e) => { e.preventDefault(); keys.left  = true; });
btnL.addEventListener("touchend",   () => keys.left  = false);
btnR.addEventListener("touchstart", (e) => { e.preventDefault(); keys.right = true; });
btnR.addEventListener("touchend",   () => keys.right = false);
btnJ.addEventListener("touchstart", (e) => { e.preventDefault(); tryJump(); });

// ── POSE ──────────────────────────────────────────────────
const RUN_FRAMES = [
  "./images/run1.png",
  "./images/run2.png",
  "./images/run3.png",
  "./images/run2.png",
];
let runFrameIdx = 0, lastFrameTime = 0;
const FRAME_MS = 110;

function updatePose(vx, vy, g, now) {
  const img = document.getElementById("player-img");
  if (!img) return;
  if (!g) {
    img.src = "./images/jump.png";
  } else if (Math.abs(vx) > 0.5) {
    if (now - lastFrameTime > FRAME_MS) {
      runFrameIdx = (runFrameIdx + 1) % RUN_FRAMES.length;
      img.src = RUN_FRAMES[runFrameIdx];
      lastFrameTime = now;
    }
  } else {
    img.src = "./images/idle.png";
  }
  img.style.transform = vx < -0.3 ? "scaleX(-1)" : "scaleX(1)";
}

// ── GAME LOOP ─────────────────────────────────────────────
(function gameLoop() {
  const playerEl = document.getElementById("player");
  const world    = document.getElementById("world");

  function tick() {
    const now = performance.now();

    if (keys.right)      velX = Math.min(velX + ACCEL, MAX_SPD);
    else if (keys.left)  velX = Math.max(velX - ACCEL, -MAX_SPD);
    else                 velX *= FRICTION;
    if (Math.abs(velX) < 0.05) velX = 0;

    playerX = Math.max(20, Math.min(WORLD_W - 20, playerX + velX));
    velY += GRAVITY;
    playerY -= velY;

    const floor = getFloor(playerX);
    if (playerY <= floor) {
      const wasAir = !onGround;
      playerY = floor; velY = 0; onGround = true; jumpConsumed = false;
      if (wasAir) {
        playerEl.classList.remove("squish");
        void playerEl.offsetWidth;
        playerEl.classList.add("squish");
        setTimeout(() => playerEl.classList.remove("squish"), 200);
      }
    } else onGround = false;

    const sw = window.innerWidth;
    worldOffset = Math.max(0, Math.min(WORLD_W - sw, playerX - sw * 0.35));
    world.style.transform = `translateX(${-worldOffset}px)`;

    const gY = groundY();
    playerEl.style.left = playerX - 45 + "px";
    playerEl.style.top  = gY - playerY - PLAYER_H + "px";

    updatePose(velX, velY, onGround, now);
    checkProximity();
    requestAnimationFrame(tick);
  }
  tick();
})();

layoutWorld();
window.addEventListener("resize", layoutWorld);