const salaModel = require('../models/salaModel');
const usuarioModel = require('../models/usuarioModel');

exports.get = async () => {
  return await salaModel.listarSalas();
}

exports.entrar = async (iduser, idsala) => {
  console.log("Entrar: " + iduser + " - " + idsala);

  const sala = await salaModel.buscarSala(idsala);
  if (!sala) {
      console.error("Sala não encontrada para ID:", idsala);
      return { msg: "Sala não encontrada" };
  }

  let user = await usuarioModel.buscarUsuario(iduser);
  if (!user) {
      return { msg: "Usuário não encontrado" };
  }

  console.log(sala);
  console.log(user);

  user.sala = { _id: sala._id, nome: sala.nome, tipo: sala.tipo };

  if (await usuarioModel.alterarUsuario(user)) {
      return { msg: "OK", timestamp: Date.now() };
  }

  return { msg: "Falha ao atualizar usuário" };
};

exports.sair = async (iduser) => {
  console.log("Sair: " + iduser);

  let user = await usuarioModel.buscarUsuario(iduser);
  if (!user) {
      console.error("Usuário não encontrado para ID:", iduser);
      return { msg: "Usuário não encontrado" };
  }

  if (!user.sala) {
      console.error("Usuário não está associado a nenhuma sala");
      return { msg: "Usuário não está associado a nenhuma sala" };
  }

  user.sala = null;

  if (await usuarioModel.alterarUsuario(user)) {
      return { msg: "OK", timestamp: Date.now() };
  }

  return { msg: "Falha ao atualizar usuário" };
};


exports.enviarMensagem = async (nick, msg, idsala) => {
  const sala = await salaModel.buscarSala(idsala);

  if (!sala) {
      console.error("Sala não encontrada para ID:", idsala);
      return { msg: "Sala não encontrada" };
  }

  console.log(sala.msgs);

  if (!sala.msgs) {
      sala.msgs = [];
  }

  const timestamp = Date.now();
  sala.msgs.push({
      timestamp: timestamp,
      msg: msg,
      nick: nick
  });

  let resp = await salaModel.atualizarMensagens(sala);

  if (!resp.matchedCount) {
      console.error("Falha ao atualizar mensagens da sala.");
      return { msg: "Falha ao atualizar mensagens" };
  }

  return { msg: "OK", timestamp: timestamp };
};

exports.buscarMensagens = async (idsala, timestamp) => {
  let mensagens = await salaModel.buscarMensagens(idsala, timestamp);

  if (!mensagens || mensagens.length === 0) {
      console.log("Nenhuma mensagem encontrada");
  }

  return {
      timestamp: mensagens[mensagens.length - 1].timestamp,
      msgs: mensagens
  };
};