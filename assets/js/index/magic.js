document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enterBtn");

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      const siteWrapper = document.querySelector(".site-wrapper");

      if (siteWrapper) siteWrapper.classList.add("magic-opening");

      setTimeout(() => {
        window.location.href = "pages/biografia.html";
      }, 900);
    });
  }
});
