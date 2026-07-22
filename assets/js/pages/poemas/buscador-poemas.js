import {
    actualizarFiltro
} from "./estado-poemas.js";

import {
    actualizarListado
} from "./motor-poemas.js";

import {
    estadoFiltros
} from "./estado-poemas.js";

const input = document.getElementById(
    "buscador-poemas"
);

export function actualizarInputBusqueda() {

    input.value =
    estadoFiltros.busqueda || "";

}

input.addEventListener(
    "input",
    () => {

        actualizarFiltro(
            "busqueda",
            input.value
        );


        actualizarListado();

    }
);