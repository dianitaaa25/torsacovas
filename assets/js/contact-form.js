import { showGlobalToast } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("submit", async (e) => {
    const form = e.target;
    if (!form.matches("#contactForm")) return;

    e.preventDefault();

    const formData = new FormData(form);
    const nombre = formData.get("nombre")?.trim();
    const email = formData.get("email")?.trim();
    const mensaje = formData.get("mensaje")?.trim();
    const sound = document.getElementById("messageSound");

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
        method: form.method,
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        form.reset();
        showGlobalToast("Mensaje enviado correctamente.", "success");
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
        return;
      }

      const data = await response.json().catch(() => ({}));
      const errorMsg = data?.errors?.map(err => err?.message).join(", ") || "No se pudo enviar el mensaje.";
      showGlobalToast(errorMsg, "error");

    } catch (err) {
      console.error("Error enviando formulario:", err);
      showGlobalToast("Error de conexión. Inténtalo nuevamente.", "error");
    }

  }, true);
});