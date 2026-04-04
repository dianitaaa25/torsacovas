import { showGlobalToast } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  if (!form) return;

  const sound = document.getElementById("messageSound");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const nombre = formData.get("nombre")?.trim();
    const email = formData.get("email")?.trim();
    const mensaje = formData.get("mensaje")?.trim();

    if (!nombre || !email || !mensaje) {
      showGlobalToast("Completa todos los campos antes de enviar.", "info");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      showGlobalToast("Introduce un correo válido.", "info");
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      const data = await response.json();

      if (response.ok) {
        form.reset();
        showGlobalToast("Mensaje enviado correctamente.", "success");
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
      } else {
        const errorMsg = data?.errors?.map(err => err?.message).join(", ") || "No se pudo enviar el mensaje.";
        showGlobalToast(errorMsg, "error");
      }

    } catch (err) {
      console.error("Error enviando formulario:", err);
      showGlobalToast("Error de conexión. Inténtalo nuevamente.", "error");
    }

  });

});