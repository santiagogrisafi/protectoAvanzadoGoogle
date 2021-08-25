const express = require('express');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let verifyToken = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        id: payload.id,
        google: true,
    }
};


app.post('/google', async(req, res) => {
    req.body.idtoken = req.get('idtoken');
    let idtoken = req.body.idtoken;
    let googleUser = await verifyToken(idtoken)
        .catch(err => console.log(err));
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({ ok: false, err });
        }
        if (userDB) {
            if (!userDB.google) {
                return res.status(403).json({ ok: false, message: 'Usuario ya esta creado por otro medio por lo tanto no se puede con google' });
            }
            let token = jwt.sign({
                user: userDB,
            }, process.env.SIGN, { expiresIn: process.env.EXP });
            return res.json({
                ok: true,
                user: userDB,
                token,
            })
        } else {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: bcrypt.hashSync(':(', 10),
            });
            user.save((err, userDB) => {
                if (err) {
                    return res.status(400).json({ ok: false, err });
                }
                let token = jwt.sign({
                    user: userDB,
                }, process.env.SIGN, { expiresIn: process.env.EXP });
                return res.json({
                    ok: true,
                    user: userDB,
                    token,
                })
            });
        }
    });
});

module.exports = app;