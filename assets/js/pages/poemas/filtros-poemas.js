import {
    iniciarEstado,
    todosLosPoemas,
    actualizarFiltro
} from "./estado-poemas.js";

import {
    actualizarListado
} from "./motor-poemas.js";

import {
    cargarURL
} from "./url-poemas.js";

import {
    estadoFiltros
} from "./estado-poemas.js";

import {
    actualizarInputBusqueda
} from "./buscador-poemas.js";

import { 
    cargarEstadisticas 
} from "./estadisticas-poemas.js";

import {
    actualizarSelectorOrden
} from "./orden-poemas.js";

const tema =
document.getElementById("filtro-tema");


const anio =
document.getElementById("filtro-anio");


const mes =
document.getElementById("filtro-mes");

const btnLimpiar =
document.getElementById("limpiar-filtros");

const orden =
document.getElementById("orden-poemas");

async function iniciar() {

    await iniciarEstado();

    await cargarEstadisticas();

    cargarURL();

    actualizarInputBusqueda();

    actualizarSelectorOrden();

    const temas = [
        ...new Set(
            todosLosPoemas.flatMap(
                poema => poema.temas || []
            )
        )
    
    ];


    temas.forEach(temaDato => {

        const opcion =
        document.createElement("option");

        opcion.value = temaDato;
        opcion.textContent = temaDato;

        tema.appendChild(opcion);

    });



    const anios = [
        ...new Set(
            todosLosPoemas.map(
                poema => poema.año
            )
        )
    ];


    anios.forEach(anioDato => {

        const opcion =
        document.createElement("option");

        opcion.value = anioDato;
        opcion.textContent = anioDato;

        anio.appendChild(opcion);

    });

    tema.value =
    estadoFiltros.tema || "";


    anio.value =
    estadoFiltros.anio || "";


    mes.value =
    estadoFiltros.mes || "";

    tema.addEventListener(
        "change",
        () => {

            actualizarFiltro(
                "tema",
                tema.value
            );

            actualizarListado();

        }
    );


    anio.addEventListener(
        "change",
        () => {

            actualizarFiltro(
                "anio",
                anio.value
            );

            actualizarListado();

        }
    );


    mes.addEventListener(
        "change",
        () => {

            actualizarFiltro(
                "mes",
                mes.value
            );

            actualizarListado();

        }
    );

    btnLimpiar.addEventListener(
        "click",
        () => {

            actualizarFiltro("busqueda", "");

            actualizarFiltro("tema", "");

            actualizarFiltro("anio", "");

            actualizarFiltro("mes", "");

            actualizarFiltro("orden", "aleatorio");

            document.getElementById("buscador-poemas").value = "";

            tema.value = "";

            anio.value = "";

            mes.value = "";

            orden.value = "aleatorio";

            actualizarListado();

            history.replaceState(
                null,
                "",
                window.location.pathname
            );

        }
    );

    actualizarListado();
}

iniciar();