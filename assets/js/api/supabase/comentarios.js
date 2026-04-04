import { supabaseClient } from "./client.js";
import { obtenerPost } from "./posts.js";
import { getUser } from "./auth.js";

function showGlobalToast(message, type = "info") {
  const toast = document.getElementById("globalToast");
  if (!toast) return console.log(message);
  
  toast.textContent = message;
  toast.className = `global-toast ${type}`;
  toast.classList.add("show");
  
  setTimeout(() => toast.classList.remove("show"), 4000);
}

let comentariosListenersIniciados = false;

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

  if (!comentariosListenersIniciados) {
    contenedor.addEventListener("click", async (e) => {
      if (e.target.classList.contains("eliminar-btn")) {
        const id = e.target.dataset.id;
        
        if (!confirm("¿Eliminar este comentario?")) return;

        const { error } = await supabaseClient
          .from("comentarios")
          .delete()
          .eq("id", id);

        if (error) {
          console.error(error);
          showGlobalToast("Error al eliminar comentario", "error");
          return;
        }

        showGlobalToast("Comentario eliminado.", "success");
        cargarComentarios(slug);
      }
    });
    
    comentariosListenersIniciados = true;
  }
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

    showGlobalToast("Debes iniciar sesión para comentar.", "error");
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
    showGlobalToast("Error al publicar comentario.", "error");
    return;
  }

  if (textarea) textarea.value = "";
  showGlobalToast("Comentario publicado.", "success");

  cargarComentarios(slug);
}