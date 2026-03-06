document.addEventListener("DOMContentLoaded", () => {

  const visor = document.getElementById("visorDibujo");
  const visorImg = document.getElementById("visorImg");
  const cerrar = document.getElementById("visorCerrar");

  if (!visor || !visorImg) return;

  const ZOOM_SCALE = 2;

  let zoomed = false;
  let isDragging = false;
  let moved = false;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  visorImg.setAttribute("draggable", "false");
  visorImg.addEventListener("dragstart", e => e.preventDefault());

  function applyTransform() {
    visorImg.style.transform =
      `scale(${ZOOM_SCALE}) translate(${currentX}px, ${currentY}px)`;
  }

  function resetZoom() {
    zoomed = false;
    isDragging = false;
    moved = false;
    currentX = 0;
    currentY = 0;

    visorImg.classList.remove("zoom");
    visorImg.classList.remove("dragging");
    visorImg.style.transform = "";
    visorImg.style.cursor = "zoom-in";
  }

  /* ===== ABRIR VISOR ===== */
  document.querySelectorAll(".dibujo-click").forEach(img => {
    img.addEventListener("click", () => {
      visorImg.src = img.src;
      visor.classList.add("activo");
      resetZoom();
    });
  });

  /* ===== MOUSE DOWN ===== */
  visorImg.addEventListener("mousedown", (e) => {
    if (!zoomed) return;

    e.preventDefault();
    moved = false;

    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;

    visorImg.style.cursor = "grabbing";
  });

  /* ===== MOUSE MOVE ===== */
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    moved = true;

    applyTransform();
  });

  /* ===== MOUSE UP ===== */
  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    visorImg.style.cursor = "zoom-out";
  });

  /* ===== TOUCH (MÓVIL) ===== */

  visorImg.addEventListener("touchstart", (e) => {
    if (!zoomed) return;

    const touch = e.touches[0];

    isDragging = true;
    moved = false;

    startX = touch.clientX - currentX;
    startY = touch.clientY - currentY;

    visorImg.classList.add("dragging");
  }, { passive: false });

  visorImg.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    e.preventDefault(); 

    const touch = e.touches[0];

    currentX = touch.clientX - startX;
    currentY = touch.clientY - startY;

    moved = true;

    applyTransform();
  }, { passive: false });

  visorImg.addEventListener("touchend", () => {
    if (!isDragging) return;

    isDragging = false;
    visorImg.classList.remove("dragging");
  });

  /* ===== CLIC / TAP / ZOOM ===== */

  visorImg.addEventListener("click", (e) => {
    e.stopPropagation();

    if (moved) {
      moved = false;
      return;
    }

    zoomed = !zoomed;

    if (zoomed) {
      currentX = 0;
      currentY = 0;
      visorImg.classList.add("zoom");
      applyTransform();
      visorImg.style.cursor = "zoom-out";
    } else {
      resetZoom();
    }
  });

  /* ===== CERRAR ===== */

  if (cerrar) cerrar.addEventListener("click", cerrarVisor);

  visor.addEventListener("click", e => {
    if (e.target === visor) cerrarVisor();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrarVisor();
  });

  function cerrarVisor() {
    visor.classList.remove("activo");
    resetZoom();
  }

});
