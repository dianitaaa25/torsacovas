let catalogo = null;

export async function cargarCatalogo() {

    if (catalogo) {
        return catalogo;
    }

    const respuesta = await fetch("/assets/data/poemas.json");

    if (!respuesta.ok) {
        throw new Error("No se pudo cargar poemas.json");
    }

    catalogo = await respuesta.json();
    return catalogo;

}

export async function obtenerPoemas() {

    const datos = await cargarCatalogo();
    return datos.poemas;

}

export async function obtenerPoema(slug) {

    const poemas = await obtenerPoemas();
    return poemas.find(poema => poema.slug === slug);

}