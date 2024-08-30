const express = require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const usuarioController = require('./controllers/usuarioController');
const salaController = require('./controllers/salaController');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', (req, res, next) => {
    res.status(200).send("<h1>API-CHAT</h1>");
}));

app.use('/', router.get('/sobre', (req, res, next) => {
    res.status(200).send ({
        "nome" : "CHATINFO",
        "autor" : "Valentina Fischer Martins Pacheco",
        "versao" : "0.1.0"
    });
}));

app.use('/entrar', router.post('/entrar', async(req, res, next) => {
    const token = require('./util/token');
    if(token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)){
        let resp = await usuarioController.entrar(req.body.nick);
        res.status(200).send(resp);
    } else{
        res.status(401).send({"msg":"Usuário inválido"});
    }
}));

app.use('/salas', router.get('/salas', async (req, res, next) => {
    const token = require('./util/token');
    if(await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)){
        let resp = await salaController.get();
        res.status(200).send(resp);
    } else{
        res.status(401).send({"msg":"Usuário não encontrado"});
    }
}));

app.use("/sala/entrar", router.post("/sala/entrar", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    const idsala = req.query.idsala;

    if (token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)){
        console.log("dados do entrar: " + req.headers.iduser, idsala);
        let resp = await salaController.entrar(req.headers.iduser, idsala);
        res.status(200).send(resp);
    } else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));
  
app.use("/sala/enviar", router.post("/sala/enviar", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if (!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
    let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idsala);
    res.status(200).send(resp);
}));
  
app.use("/sala/listar", router.get("/sala/listar", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
    
    let resp = await salaController.buscarMensagens(req.headers.idsala, req.headers.timestamp);
    res.status(200).send(resp);
}));

app.use("/sala/sair", router.post("/sala/sair", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;
    
    let resp = await salaController.sair(req.headers.iduser);
    res.status(200).send(resp);
}));

module.exports = app;