const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const config = require("./config");

const {
    limpiarTexto,
    obtenerSlug
} = require("./utils");


const poemas = [];


const archivos = fs.readdirSync(
    config.carpetaPoemas,
    {
        recursive:true
    }
);


archivos

.filter(
    archivo =>
        archivo.endsWith(".html") &&
        !archivo.includes("borradores")
)

.forEach((archivo)=>{


    const ruta = path.join(
        config.carpetaPoemas,
        archivo
    );


    const html = fs.readFileSync(
        ruta,
        "utf8"
    );


    const $ = cheerio.load(html);



    const titulo = $("h3")
        .first()
        .text()
        .trim();


    if(!titulo){

        console.error(
            "❌ Falta título:",
            archivo
        );

        return;

    }



    const fechaTexto = $(".obra-fecha")
        .text()
        .trim();


    if(!fechaTexto){

        console.error(
            "❌ Falta fecha:",
            archivo
        );

        return;

    }



    const texto = $(".poema")
        .text()
        .trim();


    if(!texto){

        console.error(
            "❌ Falta contenido:",
            archivo
        );

        return;

    }



    const descripcion = $("meta[name='description']")
        .attr("content")
        ?.trim() || "";

    const temas = extraerMetaLista(
        $,
        "poema-temas"
    );


    const palabrasClave = extraerMetaLista(
        $,
        "poema-palabras-clave"
    );



    const slug = obtenerSlug(
        path.basename(archivo)
    );



    const fechaISO = convertirFecha(
        fechaTexto
    );



    const preview = generarPreview(
        texto
    );



    poemas.push({

        slug,

        publicado:true,

        titulo,

        fecha:fechaISO,

        año:
            Number(
                fechaISO.substring(0,4)
            ),

        mes:
            Number(
                fechaISO.substring(5,7)
            ),

        archivo,

        descripcion,

        preview,

        textoBusqueda:
            limpiarTexto(texto),

        temas,

        palabrasClave,

        stats:{

            likes:0,

            comentarios:0

        }

    });


});



// Ordenar del más reciente al más antiguo

poemas.sort((a,b)=>{

    return new Date(b.fecha) - new Date(a.fecha);

});



// Crear catálogo final

const catalogo = {

    version:1,

    ultimaActualizacion:
        new Date()
        .toISOString()
        .split("T")[0],

    total:
        poemas.length,

    poemas

};



// Guardar JSON

fs.writeFileSync(

    config.archivoSalida,

    JSON.stringify(
        catalogo,
        null,
        2
    )

);



console.log(
    "Poemas generados:",
    poemas.length
);


console.log(
    "✔ Catálogo sin errores"
);





// ----------------------------
// FUNCIONES AUXILIARES
// ----------------------------



function generarPreview(texto){

    const limite = 250;


    if(texto.length <= limite){

        return texto;

    }


    let corte = texto.substring(
        0,
        limite
    );


    corte = corte.substring(
        0,
        corte.lastIndexOf(" ")
    );


    return corte + "...";

}

function extraerMetaLista($, nombre){


    const contenido = $(`meta[name="${nombre}"]`)
        .attr("content")
        ?.trim();


    if(!contenido){

        return [];

    }


    return contenido
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

}

function convertirFecha(fecha){


    const meses = {

        enero:"01",
        febrero:"02",
        marzo:"03",
        abril:"04",
        mayo:"05",
        junio:"06",
        julio:"07",
        agosto:"08",
        septiembre:"09",
        octubre:"10",
        noviembre:"11",
        diciembre:"12"

    };


    const partes = fecha
        .toLowerCase()
        .split(" ");



    if(partes.length !== 5){

        return fecha;

    }



    const dia =
        partes[0]
        .padStart(2,"0");



    const mes =
        meses[partes[2]] || "01";



    const año =
        partes[4];



    return `${año}-${mes}-${dia}`;

}