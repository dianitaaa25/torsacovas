function loadPartial(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(err => console.error(`Error cargando ${file}`, err));
}

loadPartial("header", "../partials/header.html");
loadPartial("menu", "../partials/menu.html");
loadPartial("footer", "../partials/footer.html");
