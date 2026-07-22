import {
    estadoFiltros,
    actualizarFiltro
} from "./estado-poemas.js";

export function guardarURL() {

    const params = new URLSearchParams();

    Object.entries(estadoFiltros)
    .forEach(([clave, valor]) => {

        if(valor){

            params.set(
                clave,
                valor
            );

        }

    });

    const nuevaURL =
    params.toString()
    ? `${window.location.pathname}?${params}`
    : window.location.pathname;


    history.replaceState(
        null,
        "",
        nuevaURL
    );

}

export function cargarURL() {

    const params =
    new URLSearchParams(
        window.location.search
    );


    params.forEach(
        (valor, clave)=>{

            actualizarFiltro(
                clave,
                valor
            );

        }
    );

}