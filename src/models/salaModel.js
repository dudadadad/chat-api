const db = require("./db");
function listarSalas() {
    return db.findAll("salas");
}

module.exports = {listarSalas};