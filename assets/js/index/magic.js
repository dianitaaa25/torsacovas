document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enterBtn");

  if (enterBtn) {
    enterBtn.addEventListener("click", (e) => {
      e.preventDefault(); 
      const siteWrapper = document.querySelector(".site-wrapper");

      if (siteWrapper) siteWrapper.classList.add("magic-opening");

      const destination = enterBtn.getAttribute("href") || "/";

      setTimeout(() => {
        window.location.href = destination;
      }, 900);
    });
  }
});