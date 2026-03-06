const BASE_PATH = "/";

function fixLinks(container) {

  container.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");

    if (
      href &&
      !href.startsWith("http") &&
      !href.startsWith("#") &&
      !href.startsWith("mailto") &&
      !href.startsWith(BASE_PATH)
    ) {
      link.setAttribute("href", BASE_PATH + href);
    }
  });

  container.querySelectorAll("img[src], source[src], audio[src]").forEach(el => {
    const src = el.getAttribute("src");

    if (
      src &&
      !src.startsWith("http") &&
      !src.startsWith(BASE_PATH)
    ) {
      el.setAttribute("src", BASE_PATH + src);
    }
  });
}

function loadPartial(id, file, callback) {

  const url = BASE_PATH + "partials/" + file;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar " + url);
      return res.text();
    })
    .then(html => {

      const el = document.getElementById(id);
      if (!el) return;

      el.innerHTML = html;

      fixLinks(el);

      if (callback) callback();
    })
    .catch(err => console.error(err));
}

loadPartial("header", "header.html");
loadPartial("menu", "menu.html");
loadPartial("carousel", "carousel.html");

loadPartial("footer", "footer.html", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});