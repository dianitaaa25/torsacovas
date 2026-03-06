document.addEventListener("DOMContentLoaded", () => {

  const dibujos = Array.from(document.querySelectorAll(".dibujo img"));
  const lightbox = document.getElementById("lightbox");
  const imgLB = lightbox.querySelector("img");
  const contador = lightbox.querySelector(".contador");
  const titulo = lightbox.querySelector(".titulo");
  const btnPrev = lightbox.querySelector(".prev");
  const btnNext = lightbox.querySelector(".next");

  if (!dibujos.length || !lightbox || !imgLB) return;

  const ZOOM_SCALE = 2;

  let currentIndex = 0;
  let zoomed = false;
  let isDragging = false;
  let moved = false;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  /* ========= DRAG NATIVO ========= */
  imgLB.setAttribute("draggable", "false");
  imgLB.addEventListener("dragstart", e => e.preventDefault());

  /* ========= UTILIDADES ========= */

  function applyTransform() {
    imgLB.style.transform =
      `scale(${ZOOM_SCALE}) translate(${currentX}px, ${currentY}px)`;
  }

  function resetZoom() {
    zoomed = false;
    isDragging = false;
    moved = false;
    currentX = 0;
    currentY = 0;

    imgLB.classList.remove("zoomed");
    imgLB.classList.remove("dragging");
    imgLB.style.transform = "";
  }

  function updateContent() {
    imgLB.classList.add("fade");

    setTimeout(() => {
      imgLB.src = dibujos[currentIndex].src;
      const figure = dibujos[currentIndex].closest(".dibujo");
      const link = figure.querySelector("a");

      if (link) {
      titulo.innerHTML = `<a href="${link.href}">${link.textContent}</a>`;
      } else {
        titulo.textContent = dibujos[currentIndex].dataset.title || "";
      }
      contador.textContent = `${currentIndex + 1} / ${dibujos.length}`;

      resetZoom();
      imgLB.classList.remove("fade");
    }, 250);
  }

  /* ========= LIGHTBOX ========= */

  function openLightbox(index) {
    currentIndex = index;
    updateContent();
    lightbox.classList.add("show");
  }

  function closeLightbox() {
    lightbox.classList.remove("show");
    imgLB.src = "";
    resetZoom();
  }

  function next() {
    currentIndex = (currentIndex + 1) % dibujos.length;
    updateContent();
  }

  function prev() {
    currentIndex = (currentIndex - 1 + dibujos.length) % dibujos.length;
    updateContent();
  }

  /* ========= ABRIR ========= */

  dibujos.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(i));
  });

  /* ========= DRAG MOUSE ========= */

  imgLB.addEventListener("mousedown", (e) => {
    if (!zoomed) return;

    e.preventDefault();
    moved = false;

    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;

    imgLB.classList.add("dragging");
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
    moved = true;

    applyTransform();
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    imgLB.classList.remove("dragging");
  });

  /* ========= DRAG TOUCH (MÓVIL) ========= */

  imgLB.addEventListener("touchstart", (e) => {
    if (!zoomed) return;

    const touch = e.touches[0];

    isDragging = true;
    moved = false;

    startX = touch.clientX - currentX;
    startY = touch.clientY - currentY;

    imgLB.classList.add("dragging");
  }, { passive: false });

  imgLB.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    e.preventDefault(); 

    const touch = e.touches[0];

    currentX = touch.clientX - startX;
    currentY = touch.clientY - startY;

    moved = true;

    applyTransform();
  }, { passive: false });

  imgLB.addEventListener("touchend", () => {
    if (!isDragging) return;

    isDragging = false;
    imgLB.classList.remove("dragging");
  });

  /* ========= CLIC / TAP / ZOOM ========= */

  imgLB.addEventListener("click", (e) => {
    e.stopPropagation();

    if (moved) {
      moved = false;
      return;
    }

    zoomed = !zoomed;

    if (zoomed) {
      currentX = 0;
      currentY = 0;
      imgLB.classList.add("zoomed");
      applyTransform();
    } else {
      resetZoom();
    }
  });

  /* ========= CERRAR ========= */

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });

  btnPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;

    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "Escape") closeLightbox();
  });

});
