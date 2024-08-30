const jwt = require('jsonwebtoken');

const normalizeKey = (key) => {
    return key; 
};

const checkToken = async (token, id, key) => {
    const normalizedKey = normalizeKey(key);
    console.log('Token recebido:', token);
    console.log('ID recebido:', id);
    console.log('Chave Normalizada:', normalizedKey);
    try {
        var decoded = jwt.verify(token, normalizedKey);
        if (decoded.id === id) {
            return true;
        }
    } catch (err) {
        console.log('Erro JWT:', err.message);
        return false;
    }
};

const setToken = async (id, key) => {
    const normalizedKey = normalizeKey(key);
    if (id) {
        const signedToken = jwt.sign({ id }, normalizedKey, { expiresIn: 28800 });
        console.log('Token Gerado:', signedToken);
        console.log('Chave Normalizada:', normalizedKey);
        return signedToken;
    }
    return false;
};

module.exports = {
    checkToken,
    setToken
};