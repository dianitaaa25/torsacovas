import {
    iniciarEstado,
    todosLosPoemas,
    estadoFiltros,
    normalizar,
    estadisticas
} from "./estado-poemas.js";

//console.log("ESTADISTICAS:", estadisticas);

import {
    mostrarPoemas
} from "./listado-poemas.js";

import {
    guardarURL
} from "./url-poemas.js";

import {
    aplicarEstadisticas
} from "./estadisticas-poemas.js";

function obtenerBase(){

    return [
        ...todosLosPoemas
    ];

}

export async function actualizarListado() {

    let resultados = obtenerBase();

    if (estadoFiltros.busqueda) {


        const palabras =
        normalizar(
            estadoFiltros.busqueda
        )
        .split(" ")
        .filter(Boolean);



        resultados =
        resultados.filter(poema=>{


            const campos = {


                titulo:
                normalizar(
                    poema.titulo
                ),


                descripcion:
                normalizar(
                    poema.descripcion
                ),


                contenido:
                normalizar(
                    poema.textoBusqueda
                ),


                preview:
                normalizar(
                    poema.preview
                ),


                temas:
                normalizar(
                    (poema.temas || [])
                    .join(" ")
                ),


                claves:
                normalizar(
                    (poema.palabrasClave || [])
                    .join(" ")
                )

            };



            const textoTotal =
            Object.values(campos)
            .join(" ");



            return palabras.every(
                palabra =>
                textoTotal.includes(
                    palabra
                )
            );


        });


    }

    if (estadoFiltros.tema) {
    
        resultados =
        resultados.filter(poema =>
            (poema.temas || [])
            .includes(
                estadoFiltros.tema
            )
        );
    
    }

    if (estadoFiltros.anio) {

        resultados =
        resultados.filter(poema =>
            String(poema.año) ===
            String(estadoFiltros.anio)
        );

    }

    if (estadoFiltros.mes) {

        resultados =
        resultados.filter(poema =>
            String(poema.mes).padStart(2,"0")
            ===
            estadoFiltros.mes
        );

    }

    if (estadoFiltros.orden === "reciente") {

        resultados.sort((a,b)=>
            b.fecha.localeCompare(
                a.fecha
            )
        );

    }

    if (estadoFiltros.orden === "antiguo") {

        resultados.sort((a,b)=>
            a.fecha.localeCompare(
                b.fecha
            )
        );

    }

    if (estadoFiltros.orden === "az") {

        resultados.sort((a, b) =>
            a.titulo.localeCompare(
                b.titulo,
                "es"
            )
        );

    }


    if (estadoFiltros.orden === "za") {

        resultados.sort((a, b) =>
            b.titulo.localeCompare(
                a.titulo,
                "es"
            )
        );

    }


    if (estadoFiltros.orden === "aleatorio") {


        resultados.sort(
            () =>
            Math.random() -
            0.5
        );


    }

    if (estadoFiltros.orden === "likes") {
        
        resultados.sort((a, b) =>
        
            (estadisticas[b.slug]?.likes ?? 0)
            -
            (estadisticas[a.slug]?.likes ?? 0)
    
        );
    
    }
    
    if (estadoFiltros.orden === "comentarios") {
    
        resultados.sort((a, b) =>
        
            (estadisticas[b.slug]?.comentarios ?? 0)
            -
            (estadisticas[a.slug]?.comentarios ?? 0)
    
        );
    
    }

    guardarURL();

    mostrarPoemas(
        aplicarEstadisticas(
            resultados
        )
    );

    const contador =
    document.getElementById(
        "contador-poemas"
    );
    
    
    if(contador){
    
        contador.textContent =
        resultados.length === 1
        ?
        "1 poema encontrado"
        :
        `${resultados.length} poemas encontrados`;
    
    }

}