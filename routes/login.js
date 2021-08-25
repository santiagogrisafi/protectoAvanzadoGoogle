const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.js');

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            res.status(403).json({
                ok: false,
                message: {
                    error: 'Correo no encontrado en el sistema, vuelvalo a intentar',
                },
            })
        }
        if (!userDB) {
            res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado en el sistema, vuelvalo a intentar',
                },
            })
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Contraseñas incorrectas, vuelvalo a intentar',
                },
            });
        }

        let token = jwt.sign({
            user: userDB,
        }, process.env.SIGN, { expiresIn: process.env.EXP });

        res.json({
            ok: true,
            user: userDB,
            token,
        })
    });
});



module.exports = app;