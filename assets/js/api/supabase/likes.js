import { supabaseClient } from "./client.js";
import { obtenerPost } from "./posts.js";
import { getUser } from "./auth.js";

function showGlobalToast(message, type = "info") {
  const toast = document.getElementById("globalToast");
  if (!toast) return console.log(message);
  
  toast.textContent = message;
  toast.className = `global-toast ${type}`;
  toast.classList.add("show");
  
  setTimeout(() => toast.classList.remove("show"), 2000);
}

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

    const modal = document.getElementById("authModal");
    if (modal) modal.classList.add("show");
    
    showGlobalToast("Debes iniciar sesión para dar like.", "error");
    return;
  }

  const btn = document.getElementById("btn-like-" + slug);
  if (!btn) return;

  const post = await obtenerPost(slug);
  const eraLiked = btn.classList.contains("liked");

  btn.classList.add("animate");
  
  if (eraLiked) {
    btn.classList.remove("liked");
  } else {
    btn.classList.add("liked");
  }

  setTimeout(() => btn.classList.remove("animate"), 200);

  setTimeout(async () => {
    try {
      if (eraLiked) {
        const { error } = await supabaseClient
          .from("likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
      } else {
        const { error } = await supabaseClient
          .from("likes")
          .insert([{ post_id: post.id, user_id: user.id }]);
      }

      mostrarLikes(slug);
    } catch (err) {
      console.error(err);
      btn.classList.toggle("liked", eraLiked);
    }
  }, 50);
}