import { supabaseClient } from "./client.js";

function normalizarSlug(slug) {

  if (
    slug.startsWith("poema-") ||
    slug.startsWith("dibujo-")
  ) {
    return slug;
  }

  const path = window.location.pathname;

  if (path.startsWith("/poemas/")) {
    return `poema-${slug}`;
  }

  if (path.startsWith("/dibujos/")) {
    return `dibujo-${slug}`;
  }

  return slug;
}

export async function obtenerPost(slug) {

  const slugFinal = normalizarSlug(slug);

  let { data: post } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("slug", slugFinal)
    .maybeSingle();

  if (!post) {

    const { data: nuevo } = await supabaseClient
      .from("posts")
      .insert([{ slug: slugFinal }])
      .select()
      .maybeSingle();

    return nuevo;
  }

  return post;
}