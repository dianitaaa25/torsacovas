import { renderizarPoemas } from "./render.js";


let poemasActuales = [];


export function mostrarPoemas(poemas){

    poemasActuales = poemas;


    const contenedor =
        document.getElementById("lista-poemas");


    if(!contenedor) return;


    renderizarPoemas(
        poemas,
        contenedor
    );

}


export function obtenerPoemasMostrados(){

    return poemasActuales;

}