import {
    obtenerPoemas
} from "./poemas-db.js";

export let todosLosPoemas = [];

export let estadisticas = {};

export let estadoFiltros = {
    busqueda: "",
    tema: "",
    anio: "",
    mes: "",
    orden: "aleatorio"
};

export async function iniciarEstado() {

    todosLosPoemas = await obtenerPoemas();

    return todosLosPoemas;

}

export function actualizarFiltro(nombre, valor) {

    estadoFiltros[nombre] = valor;

}

export function normalizar(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}