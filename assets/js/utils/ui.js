export function showAuthMessage(message, type = "error") {
  const el = document.getElementById("authMessage");

  if (!el) return;

  el.textContent = message;
  el.className = "auth-message show " + type;
}

export function clearAuthMessage() {
  const el = document.getElementById("authMessage");

  if (!el) return;

  el.textContent = "";
  el.className = "auth-message";
}

export function traducirError(msg) {
  if (!msg) return "Ocurrió un error";

  if (msg.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos";
  }

  if (msg.includes("Email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesión";
  }

  if (msg.includes("User already registered")) {
    return "Este correo ya está registrado";
  }

  if (msg.includes("Password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres";
  }

  if (msg.includes("Unable to validate email address")) {
    return "Correo inválido";
  }

  return "Error: " + msg;
}

export function showGlobalToast(message, type = "error", duration = 2500) {
  const el = document.getElementById("globalToast");

  if (!el) return;

  el.textContent = message;
  el.className = "global-toast show " + type;

  setTimeout(() => {
    el.classList.remove("show");
  }, duration);
}

export function openAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) {
    modal.style.display = "block";
  }
}