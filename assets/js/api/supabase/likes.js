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

export async function usuarioDioLike(slug) {
  const user = await getUser();
  if (!user) return false;

  const post = await obtenerPost(slug);

  const { data } = await supabaseClient
    .from("likes")
    .select("*")
    .eq("post_id", post.id)
    .eq("user_id", user.id)
    .maybeSingle();

  return !!data;
}

export async function mostrarLikes(slug) {
  const total = await contarLikes(slug);

  const el = document.getElementById("likes-" + slug);
  if (el) el.textContent = `${total}`;

  const btn = document.getElementById("btn-like-" + slug);
  if (!btn) return;

  const user = await getUser();

  if (!user) {
    btn.classList.remove("liked");
    return;
  }

  const tieneLike = await usuarioDioLike(slug);

  if (tieneLike) {
    btn.classList.add("liked");
  } else {
    btn.classList.remove("liked");
  }
}

export async function darLike(slug) {
  const user = await getUser();

  if (!user) {
    localStorage.setItem("pendingAction", JSON.stringify({
      type: "like",
      slug
    }));

    openAuthModal();

    setTimeout(() => {
      showGlobalToast("Debes iniciar sesión para dar like.");
    }, 200);

    return;
  }

  const post = await obtenerPost(slug);

  const { data: existente } = await supabaseClient
    .from("likes")
    .select("*")
    .eq("post_id", post.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const btn = document.getElementById("btn-like-" + slug);

  if (existente) {
    const { error } = await supabaseClient
      .from("likes")
      .delete()
      .eq("post_id", post.id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      showGlobalToast("Error al quitar like");
      return;
    }

    if (btn) {
      btn.classList.add("animate");
      setTimeout(() => btn.classList.remove("animate"), 300);
    }

    mostrarLikes(slug);
    return;
  }

  const { error } = await supabaseClient
    .from("likes")
    .insert([{
      post_id: post.id,
      user_id: user.id
    }]);

  if (error) {
    if (error.code === "23505") return;

    console.error(error);
    showGlobalToast("Error al dar like");
    return;
  }

  if (btn) {
    btn.classList.add("animate");
    setTimeout(() => btn.classList.remove("animate"), 300);
  }

  mostrarLikes(slug);
}