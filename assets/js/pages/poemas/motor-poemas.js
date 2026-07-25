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

export async function actualizarListado() {

    let resultados = [...todosLosPoemas];

    if (estadoFiltros.busqueda) {

        const texto = normalizar(
            estadoFiltros.busqueda
        );

        resultados = resultados.filter(poema => {

            const contenido = normalizar([
                poema.titulo,
                poema.descripcion,
                poema.preview,
                poema.textoBusqueda,
                ...(poema.temas || []),
                ...(poema.palabrasClave || [])
            ].join(" "));


            return contenido.includes(texto);

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

    document.getElementById("contador-poemas")
    .textContent = `${resultados.length} poemas`;

}