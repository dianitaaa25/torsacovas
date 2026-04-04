import { supabaseClient } from "./client.js";
import { obtenerPost } from "./posts.js";
import { getUser } from "./auth.js";
import { showGlobalToast, openAuthModal } from "../../utils/ui.js";

export async function cargarComentarios(slug) {
  const post = await obtenerPost(slug);

  const { data } = await supabaseClient
    .from("comentarios")
    .select("id, contenido, created_at, user_id, nombre_usuario")
    .eq("post_id", post.id)
    .order("created_at", { ascending: false });

  const contenedor = document.getElementById("lista-comentarios");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const totalEl = document.getElementById("total-comentarios");
  if (totalEl) {
    totalEl.textContent = `${data?.length || 0} comentarios`;
  }

  const user = await getUser();

  data?.forEach(c => {
    const div = document.createElement("div");
    div.className = "comentario";

    const fecha = new Date(c.created_at).toLocaleString("es-ES", {
      dateStyle: "long",
      timeStyle: "short"
    });

    const nombre = c.nombre_usuario || "Anónimo";
    const esMio = user && user.id === c.user_id;

    div.innerHTML = `
      <div class="comentario-header">
        <span class="comentario-nombre">${nombre}</span>
        <span class="comentario-fecha">${fecha}</span>
      </div>
      <div class="comentario-texto">${c.contenido}</div>
      ${esMio ? `<button class="eliminar-btn" data-id="${c.id}">Eliminar</button>` : ""}
    `;

    contenedor.appendChild(div);
  });

  contenedor.addEventListener("click", async (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      const id = e.target.dataset.id;

      const { error } = await supabaseClient
        .from("comentarios")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showGlobalToast("Error al eliminar comentario");
        return;
      }

      cargarComentarios(slug);
    }
  });
}

export async function comentar(slug) {
  const textarea = document.getElementById("nuevo-comentario");
  const contenido = textarea?.value.trim();

  const user = await getUser();

  if (!user) {
    localStorage.setItem("pendingAction", JSON.stringify({
      type: "comment",
      slug,
      contenido
    }));

    openAuthModal();

    setTimeout(() => {
      showGlobalToast("Debes iniciar sesión para comentar.");
    }, 200);

    return;
  }

  if (!contenido) {
    showGlobalToast("Escribe un comentario antes de publicar.", "info");
    return;
  }

  const post = await obtenerPost(slug);

  const nombre = user.email.split("@")[0];

  const { error } = await supabaseClient.from("comentarios").insert([{
    post_id: post.id,
    user_id: user.id,
    contenido,
    nombre_usuario: nombre
  }]);

  if (error) {
    console.error(error);
    showGlobalToast("Error al publicar comentario");
    return;
  }

  if (textarea) textarea.value = "";

  cargarComentarios(slug);
}