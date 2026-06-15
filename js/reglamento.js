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
