import { registerFromModal, loginFromModal, loginWithGoogle } from "./api/supabase/auth.js";
import { resetAuthModal } from "./utils/ui.js";

const BASE_PATH = window.location.hostname === "dianitaaa25.github.io"
  ? "/torsacovas/"
  : "/";

function fixLinks(container) {
  container.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (
      href &&
      !href.startsWith("http") &&
      !href.startsWith("#") &&
      !href.startsWith("mailto") &&
      !href.startsWith(BASE_PATH)
    ) {
      link.setAttribute("href", BASE_PATH + href);
    }
  });

  container.querySelectorAll("img[src], source[src], audio[src]").forEach(el => {
    const src = el.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith(BASE_PATH)) {
      el.setAttribute("src", BASE_PATH + src);
    }
  });
}

function loadPartial(id, file, callback) {
  const url = BASE_PATH + "partials/" + file;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar " + url);
      return res.text();
    })
    .then(html => {
      const el = document.getElementById(id);
      if (!el) return;

      el.innerHTML = html;
      fixLinks(el);

      if (typeof gtag === "function") {
        gtag('event', 'page_view', { page_path: window.location.pathname });
      }

      if (callback) callback();
    })
    .catch(err => console.error(err));
}

loadPartial("header", "header.html", async () => {
  const { supabaseClient } = await import("./api/supabase/client.js");

  const authHeader = document.getElementById("authHeader");
  if (!authHeader) return;

  let outsideClickListenerAdded = false;

  async function renderAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    const user = session?.user;

    if (user) {
      authHeader.innerHTML = `
        <div class="auth-header">
          <div class="auth-user" id="authUserBtn">
            ${user.email}
          </div>
          <div class="auth-dropdown" id="authDropdown">
            <button id="logoutBtn">Cerrar sesión</button>
          </div>
        </div>
      `;

      const userBtn = document.getElementById("authUserBtn");
      const dropdown = document.getElementById("authDropdown");
      const logoutBtn = document.getElementById("logoutBtn");

      if (userBtn && dropdown) {
        userBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          dropdown.classList.toggle("show");
          userBtn.classList.toggle("active");
        });
      }

      if (!outsideClickListenerAdded) {
        document.addEventListener("click", () => {
          const dropdown = document.getElementById("authDropdown");
          const userBtn = document.getElementById("authUserBtn");
          if (dropdown && userBtn) {
            dropdown.classList.remove("show");
            userBtn.classList.remove("active");
          }
        });
        outsideClickListenerAdded = true;
      }

      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          localStorage.removeItem('sb-gqhgmalvclhufiwmleei-auth-token');
          supabaseClient.auth.signOut();
          window.location.reload();
        });
      }

    } else {
      authHeader.innerHTML = `
        <div class="auth-user" id="loginBtn">
          Iniciar sesión
        </div>
      `;
      document.getElementById("loginBtn")
        ?.addEventListener("click", () => {
          document.getElementById("authModal")?.classList.add("show");
        });
    }
  }

  await renderAuth();

  const { data: sessionData } = await supabaseClient.auth.getSession();
  if (sessionData?.session) {
    await renderAuth();
    const modal = document.getElementById("authModal");
    modal?.classList.remove("show");
    resetAuthModal();
  }

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    await renderAuth();

    if (!session) return;

    const modal = document.getElementById("authModal");
    modal?.classList.remove("show");
    resetAuthModal();

    const pending = localStorage.getItem("pendingAction");

    if (pending) {
      const action = JSON.parse(pending);
      localStorage.removeItem("pendingAction");

      const { darLike } = await import("./api/supabase/likes.js");
      const { comentar } = await import("./api/supabase/comentarios.js");

      if (action.type === "like") darLike(action.slug);

      if (action.type === "comment") {
        const textarea = document.getElementById("nuevo-comentario");
        if (textarea && action.contenido) textarea.value = action.contenido;
        comentar(action.slug);
      }
    }
  });
});

loadPartial("menu", "menu.html");
loadPartial("carousel", "carousel.html");
loadPartial("footer", "footer.html", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

loadPartial("modal", "modal.html", () => {
  const authModal = document.getElementById("authModal");
  const enterBtn = document.getElementById("enterBtn");
  const closeAuthModal = document.getElementById("closeAuthModal");

  const tabLogin = document.getElementById("tabLogin");
  const tabRegister = document.getElementById("tabRegister");
  const btnSubmit = document.getElementById("btnSubmit");

  let mode = "login";

  enterBtn?.addEventListener("click", () => {
    authModal?.classList.add("show");
  });

  closeAuthModal?.addEventListener("click", () => {
    authModal?.classList.remove("show");
    resetAuthModal();
  });

  window.addEventListener("click", e => {
    if (e.target === authModal) {
      authModal?.classList.remove("show");
      resetAuthModal();
    }
  });

  tabLogin?.addEventListener("click", () => {
    mode = "login";
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    btnSubmit.textContent = "Iniciar sesión";
  });

  tabRegister?.addEventListener("click", () => {
    mode = "register";
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    btnSubmit.textContent = "Registrarse";
  });

  btnSubmit?.addEventListener("click", () => {
    if (mode === "login") {
      loginFromModal();
    } else {
      registerFromModal();
    }
  });

  document.getElementById("btnGoogle")?.addEventListener("click", loginWithGoogle);
});

window.addEventListener("load", async () => {
  const { supabaseClient } = await import("./api/supabase/client.js");
  await supabaseClient.auth.getSession();

  if (window.location.hash) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});