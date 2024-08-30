const db = require("./db");

async function registrarUsuario(nick) {
    return await db.insertOne("usuario",{"nick": nick});
};

let buscarUsuario = async (idUser) => {
    let user = await db.findOne("usuario", idUser);
    return user;
};
  
let alterarUsuario = async (user) => {
    return await db.updateOne("usuario", user,{_id:user._id});
};
 
module.exports = {registrarUsuario, buscarUsuario, alterarUsuario};