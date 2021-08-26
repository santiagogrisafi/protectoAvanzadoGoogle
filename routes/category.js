const express = require('express');
const app = express();
const { verifyRole, verifyToken } = require('../middlewares/auth');
const Category = require('../models/category');

app.get('/category', [verifyToken], (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', '_id email name')
        .exec((err, categoryDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err,
                })
            }
            Category.count({}, (err, cont) => {
                return res.json({
                    ok: true,
                    category: categoryDB,
                    cont,
                })
            });
        });
});

app.get('/category/:id', [verifyToken], (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, finded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err,
            })
        }
        Category.findOne({})
            .populate('user', 'id name email')
            .exec((err, search) => {
                return res.json({
                    ok: true,
                    search,
                })
            });
    });
});

app.put('/category/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let categori = {
        description: body.descripcion,
    }
    Category.findByIdAndUpdate(id, categori, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err,
            })
        }
        return res.json({
            ok: true,
            category: categoryDB,
        })
    });
});

app.post('/category', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;
    let category = new Category({
        description: body.descripcion,
        user: req.user._id,
    });
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err,
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                message: err,
            })
        }
        return res.json({
            ok: true,
            category: categoryDB,
        })
    });
});

app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, erase) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: {
                    err,
                }
            })
        }
        if (!erase) {
            return res.status(400).json({
                ok: false,
                message: {
                    err: 'Categoria no encontrada',
                }
            })
        }
        return res.json({
            ok: true,
            category: erase,
        })
    });
});

module.exports = app;