import { supabaseClient } from "./client.js";
import { obtenerPost } from "./posts.js";
import { getUser } from "./auth.js";
import { showGlobalToast, openAuthModal } from "../../utils/ui.js";

export async function cargarComentarios(slug) {
  const post = await obtenerPost(slug);

  const { data } = await supabaseClient
    .from("comentarios")
    .select("contenido, created_at, user_id")
    .eq("post_id", post.id)
    .order("created_at", { ascending: false });

  const contenedor = document.getElementById("lista-comentarios");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  data?.forEach(c => {
    const div = document.createElement("div");
    div.className = "comentario";
    div.textContent = c.contenido;
    contenedor.appendChild(div);
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

  if (!contenido) return;

  const post = await obtenerPost(slug);

  const { error } = await supabaseClient.from("comentarios").insert([{
    post_id: post.id,
    user_id: user.id,
    contenido
  }]);

  if (error) {
    console.error(error);
    showGlobalToast("Error al publicar comentario");
    return;
  }

  if (textarea) textarea.value = "";

  cargarComentarios(slug);
}