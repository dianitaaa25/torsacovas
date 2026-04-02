import { supabaseClient } from "./client.js";
import { obtenerPost } from "./posts.js";
import { getUser } from "./auth.js";
import { showGlobalToast, openAuthModal } from "../../utils/ui.js";

export async function contarLikes(slug) {
  const post = await obtenerPost(slug);

  const { count, error } = await supabaseClient
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id);

  if (error) {
    console.error(error);
    return 0;
  }

  return count || 0;
}

export async function mostrarLikes(slug) {
  const total = await contarLikes(slug);

  const el = document.getElementById("likes-" + slug);
  if (el) el.textContent = total;
}

export async function darLike(slug) {
  console.log("Click en like");

  const user = await getUser();
  console.log("Usuario:", user);

  if (!user) {
    showGlobalToast("Debes iniciar sesión para dar like");
    openAuthModal();
    return;
  }

  const post = await obtenerPost(slug);
  console.log("Post:", post);

  const { data: existente } = await supabaseClient
    .from("likes")
    .select("*")
    .eq("post_id", post.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existente) {
    console.log("Ya diste like");
    return;
  }

  const { error } = await supabaseClient
    .from("likes")
    .insert([{
      post_id: post.id,
      user_id: user.id
    }]);

  if (error) {
    if (error.code === "23505") {
      console.log("Like duplicado evitado");
      return;
    }
  
    console.error("Error insert like:", error);
    showGlobalToast("Error al dar like");
    return;
  }

  console.log("Like insertado");
  mostrarLikes(slug);
}