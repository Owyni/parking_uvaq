const jwt = require('jsonwebtoken');

// 1. Modificamos para incluir el rol en el Token
const generateAccessToken = (userData) => {
    const accessToken = jwt.sign(
        {
            user: userData.matricula,
            nombre: userData.name,
            role: userData.role // <-- Agregamos el rol aquí (ej. 'Administrador')
        },
        process.env.JWT_SECRET,
        {
            // Nota: 7d es excelente para desarrollo, pero en producción 
            // se recomienda un tiempo menor (ej: '24h') por seguridad.
            // Al usarse en un entorno profesional, es mejor que el token se venza pronto vaya :v
            expiresIn: '7d', 
            algorithm: 'HS256'
        }
    );
    return accessToken;
};

// 2. Verifica que el token sea estructuralmente válido
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No se encontró Token de Acceso' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        req.matricula = decoded.user;
        req.role = decoded.role; // <-- Guardamos el rol en la petición
        
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token de Acceso inválido o expirado' });
    }
};

// 3. Bloquea a cualquiera que no sea Administrador
const verifyAdminRole = (req, res, next) => {
    // Primero nos aseguramos de que pasó por verifyAccessToken
    if (!req.role) {
        return res.status(401).json({ message: 'No autenticado.' });
    }
    
    // Validamos estrictamente el rol requerido para el panel
    if (req.role !== 'Administrador') {
        return res.status(403).json({ message: 'Acceso prohibido. Permisos de Administrador requeridos.' });
    }
    
    next();
};

module.exports = { generateAccessToken, verifyAccessToken, verifyAdminRole };