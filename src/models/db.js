const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

let singleton;

async function connect (){
    if (singleton) return singleton; 

    console.log(process.env.DB_HOST)
    const client = new MongoClient(process.env.DB_HOST);
    await client.connect();

    singleton = client.db(process.env.DB_DATABASE);
    return singleton;
};

let findAll = async (collection) => {
    const db = await connect();
    return await db.collection(collection).find().toArray();
};  

async function insertOne(collection, objeto){
    const db = await connect();
    return db.collection(collection).insertOne(objeto);
};

let findOne = async (collection, _id) => {
    try {
        console.log("ID recebido para busca:", _id);  
        const db = await connect();
        let obj = await db.collection(collection).findOne({ '_id': new ObjectId(_id) });

        return obj || null;
    } catch (error) {
        console.error("Erro ao buscar documento:", error);
        throw error; 
    }
};
    
let updateOne = async (collection, object, param) => {
    const db = await connect();
    let result = await db.collection(collection).updateOne(param, { $set: object} );
    return result;
};

module.exports = {findAll, insertOne, findOne, updateOne};