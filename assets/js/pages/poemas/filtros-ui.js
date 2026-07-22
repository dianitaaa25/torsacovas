const boton = document.getElementById("btn-filtros");
const panel = document.getElementById("panel-filtros");

if (boton) {

    boton.addEventListener("click", () => {
        panel.classList.toggle("activo");
    });
}