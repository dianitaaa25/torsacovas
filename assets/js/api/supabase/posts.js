import { supabaseClient } from "./client.js";

export async function obtenerPost(slug) {
  let { data: post } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) {
    const { data: nuevo } = await supabaseClient
      .from("posts")
      .insert([{ slug }])
      .select()
      .single();

    return nuevo;
  }

  return post;
}