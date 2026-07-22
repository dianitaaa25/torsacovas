import {
    estadisticas
} from "./estado-poemas.js";


const contenedor =
document.getElementById("lista-poemas");


const preview =
document.getElementById("preview-global");


export function mostrarPoemas(poemas) {

    contenedor.innerHTML = "";


    poemas.forEach(poema => {


        const tarjeta =
        document.createElement("div");


        tarjeta.className =
        "poema-item";


        const enlace =
        document.createElement("a");


        enlace.href =
        `/poemas/${poema.slug}`;


        enlace.textContent =
        poema.titulo;



        tarjeta.addEventListener(
            "mouseenter",
            () => {


                preview.innerHTML = `

                    <h4>
                        ${poema.titulo}
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
                            ❤️ ${estadisticas[poema.slug]?.likes ?? 0}
                        </span>


                        <span>
                            💬 ${estadisticas[poema.slug]?.comentarios ?? 0}
                        </span>

                    </div>

                `;

                const top =
    tarjeta.offsetTop + tarjeta.offsetHeight + 12;

preview.style.top = `${top}px`;

                preview.classList.add(
                    "visible"
                );


            }
        );



        tarjeta.addEventListener(
            "mouseleave",
            () => {

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



function formatearFecha(fecha) {

    if (!fecha) return "";


    const opciones = {

        day: "numeric",

        month: "long",

        year: "numeric"

    };


    return new Date(fecha)
    .toLocaleDateString(
        "es-ES",
        opciones
    );

}