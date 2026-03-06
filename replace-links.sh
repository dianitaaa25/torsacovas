#!/bin/bash

# Reemplazos directos
declare -A links=(
"pages/biografia\.html"="/biografia"
"pages/dibujos\.html"="/dibujos"
"pages/obras\.html"="/obras"
"pages/poemas\.html"="/poemas"

"pages/dibujos/bruno\.html"="/dibujos/bruno"
"pages/dibujos/corazon-desahuciado\.html"="/dibujos/corazon-desahuciado"
"pages/dibujos/costa-virgen\.html"="/dibujos/costa-virgen"
"pages/dibujos/desilusion-acongojada\.html"="/dibujos/desilusion-acongojada"
"pages/dibujos/extasis-soledad\.html"="/dibujos/extasis-soledad"
"pages/dibujos/jose\.html"="/dibujos/jose"
"pages/dibujos/lucidez-seductora\.html"="/dibujos/lucidez-seductora"
"pages/dibujos/nefelibata-aturdido\.html"="/dibujos/nefelibata-aturdido"
"pages/dibujos/sanfrancisco\.html"="/dibujos/sanfrancisco"
"pages/dibujos/soledad-entre-estrellas\.html"="/dibujos/soledad-entre-estrellas"
"pages/dibujos/tiara\.html"="/dibujos/tiara"

"pages/poemas/2023/adios-amor\.html"="/poemas/adios-amor"
"pages/poemas/2023/corazon-timido\.html"="/poemas/corazon-timido"
"pages/poemas/2023/eres-mi-sueno\.html"="/poemas/eres-mi-sueno"
"pages/poemas/2023/esencial\.html"="/poemas/esencial"
"pages/poemas/2023/luna-roja\.html"="/poemas/luna-roja"
"pages/poemas/2023/mentiroso\.html"="/poemas/mentiroso"
"pages/poemas/2023/victima\.html"="/poemas/victima"

"pages/poemas/2024/cada-verso\.html"="/poemas/cada-verso"
"pages/poemas/2024/me-quiero-enamorar\.html"="/poemas/me-quiero-enamorar"
"pages/poemas/2024/mi-amor\.html"="/poemas/mi-amor"
"pages/poemas/2024/panchita\.html"="/poemas/panchita"
"pages/poemas/2024/solo-queria-verte\.html"="/poemas/solo-queria-verte"
"pages/poemas/2024/versos-desesperanza\.html"="/poemas/versos-desesperanza"

"pages/poemas/2025/estrellas-azules\.html"="/poemas/estrellas-azules"
"pages/poemas/2025/hasta-la-muerte\.html"="/poemas/hasta-la-muerte"
"pages/poemas/2025/nefelibata-aturdido\.html"="/poemas/nefelibata-aturdido"
"pages/poemas/2025/tu-tonto-yo\.html"="/poemas/tu-tonto-yo"
"pages/poemas/2025/una-flor\.html"="/poemas/una-flor"
"pages/poemas/2025/un-ser\.html"="/poemas/un-ser"

"pages/poemas/2026/apologia\.html"="/poemas/apologia"
"pages/poemas/2026/lluvia-apartamento\.html"="/poemas/lluvia-apartamento"
"pages/poemas/2026/paraguas-para-huracan\.html"="/poemas/paraguas-para-huracan"
)

# Recorrer todos los HTML
find . -type f -name "*.html" | while read file; do
    for old in "${!links[@]}"; do
        new="${links[$old]}"
        # Reemplazo dentro de href=""
        sed -i "s|href=\"$old\"|href=\"$new\"|g" "$file"
    done
done