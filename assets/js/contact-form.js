import { showGlobalToast } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener("submit", async (e) => {
    const form = e.target;

    if (!form.matches("#contactForm")) return;

    e.preventDefault();

    const formData = new FormData(form);
    const nombre = formData.get("name")?.trim();
    const email = formData.get("email")?.trim();
    const mensaje = formData.get("message")?.trim();

    const sound = document.getElementById("messageSound");

    if (!nombre || !email || !mensaje) {
      showGlobalToast("Completa todos los campos antes de enviar.", "info");
      return;
    }

    if (!email.includes("@")) {
      showGlobalToast("Introduce un correo válido.", "info");
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" }
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

      showGlobalToast("No se pudo enviar el mensaje. Intenta más tarde.", "error");

    } catch (error) {
      console.error("Error enviando formulario", error);

      showGlobalToast("Error de conexión. Inténtalo nuevamente.", "error");
    }

  }, true);

});