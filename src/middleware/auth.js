const jwt = require('jsonwebtoken');

const generateAccessToken = (userData) => {
    const accessToken = jwt.sign(
        {
            user: userData.matricula,
            nombre: userData.name
        },
        process.env.SECRET_WORD,
        {
            expiresIn: '7d',
            algorithm: 'HS256'
        }
    );
    return accessToken;
};

const verifyAccessToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No se encontró Token de Acceso' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.SECRET_WORD);
        req.user = decoded;
        req.matricula = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token de Acceso inválido' });
    }
};

module.exports = { generateAccessToken, verifyAccessToken };