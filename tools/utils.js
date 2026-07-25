function limpiarTexto(texto){

    return texto
        .replace(/\s+/g," ")
        .trim();

}


function obtenerSlug(nombre){

    return nombre
        .replace(".html","")
        .toLowerCase();

}


module.exports = {
    limpiarTexto,
    obtenerSlug
};