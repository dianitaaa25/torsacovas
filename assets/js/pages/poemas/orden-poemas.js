import {
    actualizarFiltro
} from "./estado-poemas.js";

import {
    actualizarListado
} from "./motor-poemas.js";

import {
    estadoFiltros
} from "./estado-poemas.js";

const selector =
document.getElementById(
    "orden-poemas"
);

export function actualizarSelectorOrden() {

    selector.value =
    estadoFiltros.orden || "aleatorio";

}

selector.addEventListener(
    "change",
    () => {

        actualizarFiltro(
            "orden",
            selector.value
        );


        actualizarListado();

    }
);