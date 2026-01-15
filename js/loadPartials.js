async function loadPartial(id, file) {
  const response = await fetch(file);
  const data = await response.text();
  document.getElementById(id).innerHTML = data;
}

loadPartial("header", "partials/header.html");
loadPartial("menu", "partials/menu.html");
loadPartial("footer", "partials/footer.html");
