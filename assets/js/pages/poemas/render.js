const preview =
    document.getElementById("preview-global");


export function renderizarPoemas(
    poemas,
    contenedor
){


    contenedor.innerHTML = "";


    poemas.forEach(poema => {


        const tarjeta =
            document.createElement("div");


        tarjeta.className =
            "poema-item";


        const enlace =
            document.createElement("a");


        enlace.href =
            `/pages/poemas/${poema.archivo}`;


        enlace.textContent =
            poema.titulo;



        tarjeta.addEventListener(
            "mouseenter",
            () => {


                if(!preview) return;


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