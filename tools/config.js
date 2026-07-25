const path = require("path");

module.exports = {

    carpetaPoemas: path.join(
        __dirname,
        "../pages/poemas"
    ),

    archivoSalida: path.join(
        __dirname,
        "../assets/data/poemas.json"
    )

};