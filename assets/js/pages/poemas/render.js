const preview =
    document.getElementById("preview-global");

import {
    estadoFiltros
} from "./estado-poemas.js";

export function renderizarPoemas(
    poemas,
    contenedor
){


    contenedor.innerHTML = "";


    if(!poemas.length){

        contenedor.innerHTML = `
        
            <div class="sin-resultados">
                <h4>
No se encontró ningún poema
                </h4>

            </div>
        
        `;
        
        return;
        
    }

    poemas.forEach(poema => {


        const tarjeta =
            document.createElement("div");


        tarjeta.className =
            "poema-item";


        const enlace =
            document.createElement("a");


        enlace.href =
            `/pages/poemas/${poema.archivo}`;


        enlace.innerHTML =
        resaltarTexto(
            poema.titulo,
            estadoFiltros.busqueda
        );



        tarjeta.addEventListener(
            "mouseenter",
            () => {


                if(!preview) return;


                preview.innerHTML = `

                    <h4>
                        ${resaltarTexto(
                            poema.titulo,
                            estadoFiltros.busqueda
                        )}
                    </h4>


                    <p class="preview-fecha">
                        ${formatearFecha(poema.fecha)}
                    </p>


                    <p class="preview-texto">
                        ${poema.preview || ""}
                    </p>


                    <div class="preview-temas">

                        ${
                        (poema.temas || [])
                        .map(
                            tema =>
                            `<span>${tema}</span>`
                        )
                        .join("")
                        }

                    </div>


                    <div class="preview-estadisticas">

                        <span>
                            ❤️ ${poema.stats?.likes ?? 0}
                        </span>


                        <span>
                            💬 ${poema.stats?.comentarios ?? 0}
                        </span>


                    </div>

                `;



                const top =
                    tarjeta.offsetTop +
                    tarjeta.offsetHeight +
                    12;


                preview.style.top =
                    `${top}px`;


                preview.classList.add(
                    "visible"
                );


            }
        );



        tarjeta.addEventListener(
            "mouseleave",
            () => {


                if(!preview) return;


                preview.classList.remove(
                    "visible"
                );


            }
        );



        tarjeta.appendChild(
            enlace
        );


        contenedor.appendChild(
            tarjeta
        );


    });


}



function formatearFecha(fecha){


    if(!fecha) return "";


    return new Date(fecha)
        .toLocaleDateString(
            "es-ES",
            {
                day:"numeric",
                month:"long",
                year:"numeric"
            }
        );

}

function resaltarTexto(
    texto,
    busqueda
){

    if(!busqueda || !texto){

        return texto || "";

    }


    const escape =
    busqueda
    .replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );


    const expresion =
    new RegExp(
        `(${escape})`,
        "gi"
    );


    return texto.replace(
        expresion,
        "<mark>$1</mark>"
    );

}