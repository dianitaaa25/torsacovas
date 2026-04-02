import { supabaseClient } from "./client.js";
import { showAuthMessage, clearAuthMessage, traducirError } from "../../utils/ui.js";

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
      redirectTo
    }
  });

  if (error) {
    showAuthMessage(traducirError(error.message), "error");
  }
}
export async function logout() {
  await supabaseClient.auth.signOut();
  alert("Sesión cerrada"); 
}