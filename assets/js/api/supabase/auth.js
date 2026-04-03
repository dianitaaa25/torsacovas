import { supabaseClient } from "./client.js";
import { renderAuth } from "../../load-partials.js";
import { showAuthMessage, clearAuthMessage, traducirError,resetAuthModal } from "../../utils/ui.js";

export async function getUser() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user;
}

export async function registerFromModal() {
  clearAuthMessage();

  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  const { error } = await supabaseClient.auth.signUp({ email, password });

  if (error) {
    showAuthMessage(traducirError(error.message), "error");
  } else {
    showAuthMessage("Cuenta creada correctamente", "success");
    document.getElementById("authModal")?.classList.remove("show");
  }
}

export async function loginFromModal() {
  clearAuthMessage();

  const email = document.getElementById("authEmail").value;
  const password = document.getElementById("authPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    showAuthMessage(traducirError(error.message), "error");
  } else {
    showAuthMessage("Sesión iniciada correctamente", "success");
    document.getElementById("authModal")?.classList.remove("show");
  }
}

export async function loginWithGoogle() {
  clearAuthMessage();

  const redirectTo = window.location.origin + window.location.pathname;

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: false
    }
  });

  if (error) {
    showAuthMessage(traducirError(error.message), "error");
  }
}

export async function logout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error("Error cerrando sesión:", error.message);
    return;
  }

  showToast("Sesión cerrada correctamente");

  if (typeof renderAuth === "function") {
    await renderAuth();
  }
}

function showToast(message, duration = 3000) {
  let toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}