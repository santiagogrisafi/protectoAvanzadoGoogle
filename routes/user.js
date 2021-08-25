const express = require('express');
const app = express();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const underscore = require('underscore');
const { verifyToken, verifyRole } = require('../middlewares/auth');

app.get('/users', [verifyToken], (req, res) => {

    let s = Number(req.query.s || 0);
    let l = Number(req.query.l || 0);

    User.find({ status: true }, 'name email img google status role')
        .skip(s)
        .limit(l)
        .exec((err, userDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err.errors,
                })
            }
            User.count({ status: true }, (err, cont) => {
                res.json({
                    user: userDB,
                    cont,
                })
            });
        });
});

app.post('/users', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;
    let user = new User();
    user.name = body.name;
    user.email = body.email;
    user.password = body.password;
    user.role = body.role;
    user.status = true;
    user.password = bcrypt.hashSync(body.password, 11);
    user.google = false;

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err,
            })
        }
        return res.json({
            ok: true,
            user: userDB,
        })
    });
});

app.put('/users/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = underscore.pick(req.body, [
        'name',
        'email',
        'status',
        'img',
        'google'
    ]);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.errors,
            });
        }
        return res.json({
            ok: true,
            user: userDB,
        })
    });
});

app.delete('/users/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let downUser = {
        status: false,
    };
    User.findByIdAndUpdate(id, downUser, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.errors,
            });
        }
        return res.json({
            ok: true,
            user: userDB,
        })
    });
});

module.exports = app;