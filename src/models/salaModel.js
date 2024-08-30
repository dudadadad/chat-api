const db = require("./db");
const { ObjectId } = require("mongodb");

let listarSalas = async () => {
    let salas = await db.findAll("sala");
    
    salas = salas.map(({ msgs, ...rest }) => rest);
    console.log("salas: ", salas);
    return salas;
};

let buscarSala = async (idsala) => {
    return db.findOne("sala",idsala);
};  

let atualizarMensagens = async (sala) => {
    const result = await db.updateOne(
        "sala",                       
        { msgs: sala.msgs },          
        { _id: new ObjectId(sala._id) }
    );
    return result;
};

let buscarMensagens = async (idsala, timestamp) => {
  let sala = await buscarSala(idsala);
  if (sala && sala.msgs) {
      let msgs = [];
      sala.msgs.forEach((msg) => {
          if (msg.timestamp >= timestamp) {
              msgs.push(msg);
          }
      });
      return msgs;
  }
  return [];
}

let removerUsuario = async (iduser) => {
  let user = await db.findOne("Usuario", iduser);
  if (user) {
      user.sala = null;
      return await db.updateOne("Usuario", user, { _id: user._id });
  }
  return false;
}

module.exports = {listarSalas, buscarSala, atualizarMensagens, buscarMensagens, removerUsuario};