const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SIGN, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: {
                    error: 'Error en la validacion del token',
                },
            })
        }
        req.user = decoded.user;
        next();
    });
};

let verifyRole = (req, res, next) => {
    let userRole = req.user.role;
    if (userRole === 'admin') {
        next();
        return;
    }
    return res.status(403).json({
        ok: false,
        message: {
            error: 'Es un usuario con el rol de user, solo se permiten usuarios admin',
        },
    })
};

module.exports = { verifyRole, verifyToken };