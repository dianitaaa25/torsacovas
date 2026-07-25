import {
    cargarEstadisticas,
    aplicarEstadisticas
} from "./estadisticas-poemas.js";


async function iniciar(){


    await iniciarEstado();


    await cargarEstadisticas();



    mostrarPoemas(

        aplicarEstadisticas(
            todosLosPoemas
        )

    );


}


iniciar();