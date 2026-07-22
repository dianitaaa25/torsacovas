import { supabaseClient } from "../../api/supabase/client.js";
import { estadisticas } from "./estado-poemas.js";

export async function cargarEstadisticas() {

    const { data } = await supabaseClient
        .from("posts")
        .select(`
            slug,
            likes(count),
            comentarios(count)
        `);

    Object.keys(estadisticas).forEach(k => delete estadisticas[k]);

        data.forEach(post => {

        let slug = post.slug;

        if (slug.startsWith("poema-")) {
            slug = slug.substring(6);
        }

        estadisticas[slug] = {

            likes: post.likes?.[0]?.count ?? 0,
            comentarios: post.comentarios?.[0]?.count ?? 0

        };

    });

}