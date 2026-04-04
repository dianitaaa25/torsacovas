import { showGlobalToast } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ contact-form.js cargado");

  document.addEventListener("submit", async (e) => {
    console.log("🎯 Submit detectado en:", e.target);
    
    const form = e.target;
    if (!form.matches("#contactForm")) {
      console.log("❌ No es el formulario contactForm");
      return;
    }

    console.log("✅ Es el formulario correcto");
    e.preventDefault();

    const formData = new FormData(form);
    const nombre = formData.get("nombre")?.trim();
    const email = formData.get("email")?.trim();
    const mensaje = formData.get("mensaje")?.trim();
    
    console.log("📋 Datos del form:", { nombre, email, mensaje });

    const sound = document.getElementById("messageSound");
    console.log("🔊 Sonido encontrado:", !!sound);

    // Validaciones
    if (!nombre || !email || !mensaje) {
      console.log("⚠️ Validación campos vacíos");
      showGlobalToast("Completa todos los campos antes de enviar.", "info");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      console.log("⚠️ Email inválido");
      showGlobalToast("Introduce un correo válido.", "info");
      return;
    }

    console.log("🚀 Enviando a:", form.action);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { "Accept": "application/json" }
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (response.ok) {
        form.reset();
        showGlobalToast("Mensaje enviado correctamente.", "success");
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
        console.log("✅ Todo OK");
        return;
      }

      const data = await response.json().catch(() => ({}));
      console.log("❌ Error data:", data);
      
      const errorMsg = data?.errors?.map(err => err?.message).join(", ") || "No se pudo enviar el mensaje.";
      showGlobalToast(errorMsg, "error");

    } catch (err) {
      console.error("💥 Error completo:", err);
      showGlobalToast("Error de conexión. Inténtalo nuevamente.", "error");
    }

  }, true);
});