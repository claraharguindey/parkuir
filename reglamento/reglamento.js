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
