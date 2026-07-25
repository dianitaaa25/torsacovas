import {
    supabaseClient
} from "../../api/supabase/client.js";


import {
    estadisticas
} from "./estado-poemas.js";



export async function cargarEstadisticas(){


    const {
        data,
        error
    } =
    await supabaseClient
        .from("posts")
        .select(`
            slug,
            likes(count),
            comentarios(count)
        `);



    if(error){

        console.error(
            "Error cargando estadísticas:",
            error
        );

        return;

    }



    Object.keys(estadisticas)
    .forEach(
        key =>
        delete estadisticas[key]
    );



    data.forEach(post=>{


        let slug =
        post.slug;



        if(
            slug.startsWith("poema-")
        ){

            slug =
            slug.substring(6);

        }



        estadisticas[slug]={

            likes:
            post.likes?.[0]?.count ?? 0,


            comentarios:
            post.comentarios?.[0]?.count ?? 0

        };


    });


}

export function aplicarEstadisticas(poemas){


    return poemas.map(poema=>{


        return {

            ...poema,


            stats:
            estadisticas[poema.slug]
            ||
            {
                likes:0,
                comentarios:0
            }

        };


    });


}