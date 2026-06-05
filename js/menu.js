const menuBtn = document.getElementById("menu-toggle");
const nav = document.getElementById("main-nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => nav.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target))
      nav.classList.remove("open");
  });
}
