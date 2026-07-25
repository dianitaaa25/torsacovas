import {
    obtenerPoemas
} from "./poemas-db.js";


export let todosLosPoemas = [];

export let poemasFiltrados = [];

export let estadisticas = {};

export let mapaEstadisticas = {};

export let estadoFiltros = {

    busqueda: "",
    tema: "",
    anio: "",
    mes: "",
    orden: "aleatorio"

};


export async function iniciarEstado(){

    todosLosPoemas =
        await obtenerPoemas();


    poemasFiltrados =
        [...todosLosPoemas];


    return todosLosPoemas;

}



export function actualizarFiltro(
    nombre,
    valor
){

    estadoFiltros[nombre] = valor;

}



export function normalizar(texto){

    return (texto || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-z0-9\s]/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}