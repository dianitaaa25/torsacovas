import { supabaseClient } from "./client.js";
import { showAuthMessage, clearAuthMessage, traducirError, resetAuthModal } from "../../utils/ui.js";

function showGlobalToast(message, type = "info") {
  const toast = document.getElementById("globalToast");
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `global-toast ${type}`;
  toast.classList.add("show");
  
  setTimeout(() => toast.classList.remove("show"), 4000);
}

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
    showAuthMessage("Cuenta creada correctamente.", "success");
    document.getElementById("authModal")?.classList.remove("show");
    
    showGlobalToast(" Cuenta creada correctamente.", "success");
    setTimeout(resetAuthModal, 1500);
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
    showAuthMessage("Sesión iniciada correctamente.", "success");
    document.getElementById("authModal")?.classList.remove("show");
    
    showGlobalToast("Sesión iniciada correctamente.", "success");
    setTimeout(resetAuthModal, 1500);
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